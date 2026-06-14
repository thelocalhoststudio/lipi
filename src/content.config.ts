import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

export const POSTS_PATH = "src/content/posts/";
export const PAGES_PATH = "src/content/pages/";

function removeDupsAndLowerCase(array: string[]) {
	if (!array.length) return array;
	const lowercaseItems = array.map((str) => str.toLowerCase());
	const distinctItems = new Set(lowercaseItems);
	return Array.from(distinctItems);
}

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: `./${POSTS_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string().optional().default("Travels"),
    tags: z.array(z.string()).transform(removeDupsAndLowerCase).optional(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
    lang: z.string().optional(),
    annotation: z.string().optional(),
  })
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: `./${PAGES_PATH}` }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
    lang: z.string().optional(),
    annotation: z.string().optional(),
  })
});

export const collections = {
  posts: postsCollection,
  pages: pagesCollection,
};