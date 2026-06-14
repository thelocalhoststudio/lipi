import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Image, Paragraph } from 'mdast';

/**
 * Consolidated image processing plugin for Astro Base
 *
 * Handles:
 * - Image path resolution for posts/ and pages/ collections
 * - Image captions from title attribute
 * - Image grid class assignment for consecutive images
 * - loading="lazy" and decoding="async" on all images
 */

// ── Path Resolution ──────────────────────────────────────────────────────────

function resolveImagePaths(tree: Root, file: any) {
  visit(tree, 'image', (node: Image) => {
    if (!node.url) return;

    // Skip remote URLs
    if (node.url.startsWith('http://') || node.url.startsWith('https://')) return;

    // Skip absolute paths served from public/
    if (node.url.startsWith('/')) return;

    // Already correctly relative
    if (node.url.startsWith('./') || node.url.startsWith('../')) return;

    const url = node.url;

    // Bare filename — no path separators
    if (!url.includes('/')) {
      node.url = `./attachments/${url}`;
      return;
    }

    // Relative path with attachments/ or images/ prefix
    if (url.startsWith('attachments/') || url.startsWith('images/')) {
      node.url = `./${url}`;
      return;
    }

    // Obsidian absolute vault path e.g. posts/forts-of-sahyadri/rajgad/attachments/image.jpg
    // or pages/attachments/me-wide.jpg
    // Derive content root from file path and strip it
    if (file?.path) {
      const normalizedPath = file.path.replace(/\\/g, '/');
      const contentIndex = normalizedPath.indexOf('/src/content/');

      if (contentIndex !== -1) {
        const contentRoot = normalizedPath
          .slice(contentIndex + '/src/content/'.length)
          .replace(/\/[^/]+\.md$/, '');

        // contentRoot = posts/forts-of-sahyadri/rajgad  or  pages/about

        // Case 1: url is under this specific content entry's path
        // posts/my-post/attachments/image.jpg from posts/my-post/index.md
        if (url.startsWith(`${contentRoot}/`)) {
          node.url = `./${url.slice(contentRoot.length + 1)}`;
          return;
        }

        // Case 2: vault-absolute path within the same collection
        // pages/attachments/me-wide.jpg from pages/about.md
        // Strip the collection name prefix — file is already inside that collection dir
        const collectionName = contentRoot.split('/')[0]; // 'pages' or 'posts'
        if (url.startsWith(`${collectionName}/`)) {
          // pages/attachments/me-wide.jpg → attachments/me-wide.jpg → ./attachments/me-wide.jpg
          const pathWithinCollection = url.slice(collectionName.length + 1);
          node.url = `./${pathWithinCollection}`;
          return;
        }
      }
    }

    // Fallback — prefix with ./
    node.url = `./${url}`;
  });
}

// ── Image Attributes ─────────────────────────────────────────────────────────

function addImageAttributes(tree: Root) {
  visit(tree, 'image', (node: Image) => {
    if (!node.data) node.data = {};
    if (!node.data.hProperties) node.data.hProperties = {};

    const props = node.data.hProperties as Record<string, any>;
    // lazy for all images — browser handles priority naturally;
    // avoids forcing high-res decode on images that may be off-screen
    props.loading = props.loading || 'lazy';
    props.decoding = props.decoding || 'async';
  });
}

// ── Image Captions ───────────────────────────────────────────────────────────

function processImageCaptions(tree: Root) {
  visit(tree, 'image', (node: Image) => {
    if (!node.title) return;

    if (!node.data) node.data = {};
    if (!node.data.hProperties) node.data.hProperties = {};

    const props = node.data.hProperties as Record<string, any>;
    props['data-caption'] = node.title;
    props.title = node.title;
  });
}

// ── Image Grids ───────────────────────────────────────────────────────────────

function mergeConsecutiveImageParagraphs(tree: Root) {
  if (!tree.children?.length) return;

  let i = 0;
  while (i < tree.children.length) {
    const node = tree.children[i];

    // Must be a paragraph containing only images
    if (!isImageOnlyParagraph(node)) {
      i++;
      continue;
    }

    // Collect consecutive image-only paragraphs
    const group: Paragraph[] = [node as Paragraph];
    let j = i + 1;

    while (j < tree.children.length) {
      const next = tree.children[j];
      if (!isImageOnlyParagraph(next)) break;
      group.push(next as Paragraph);
      j++;
    }

    if (group.length > 1) {
      // Merge all images into the first paragraph
      const merged = group[0];
      merged.children = group.flatMap((p) =>
        p.children.filter((child) => child.type === 'image')
      );

      // Remove the consumed paragraphs
      tree.children.splice(i + 1, group.length - 1);
    }

    i++;
  }
}

function isImageOnlyParagraph(node: any): boolean {
  if (node.type !== 'paragraph') return false;
  if (!node.children?.length) return false;

  return node.children.every(
    (child: any) =>
      child.type === 'image' ||
      (child.type === 'text' && child.value.trim() === '')
  );
}

function processImageGrids(tree: Root) {
  visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
    if (!node.children?.length) return;

    const existingClass = (node.data?.hProperties as any)?.class || '';
    if (
      existingClass === 'gallery-grid' ||
      existingClass === 'gallery-single'
    ) return;

    const images = node.children.filter(
      (child) => child.type === 'image'
    ) as Image[];

    const otherContent = node.children.filter(
      (child) =>
        child.type !== 'image' &&
        !(child.type === 'text' && (child as any).value.trim() === '')
    );

    if (images.length === 0 || otherContent.length > 0) return;

    if (!node.data) node.data = {};
    if (!node.data.hProperties) node.data.hProperties = {};

    // Convert paragraph element to div
    node.data.hName = 'div';
    const props = node.data.hProperties as Record<string, any>;
    props.class = images.length === 1 ? 'gallery-single' : 'gallery-grid';

    node.children = images.map((img) => {
      if (!img.data) img.data = {};
      if (!img.data.hProperties) img.data.hProperties = {};
      (img.data.hProperties as any).class = 'gallery-item__image';

      return {
        type: 'div',
        data: {
          hName:       'div',
          hProperties: { class: 'gallery-item' },
        },
        children: [img],
      } as any;
    });
  });
}

// ── Main Plugin ───────────────────────────────────────────────────────────────

export const remarkImageProcessing: Plugin<[], Root> = () => {
  return (tree, file) => {
    resolveImagePaths(tree, file);
    addImageAttributes(tree);
    processImageCaptions(tree);
    mergeConsecutiveImageParagraphs(tree);
    processImageGrids(tree);
  };
};

export default remarkImageProcessing;