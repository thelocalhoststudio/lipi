import userConfig from "../configs/lipi.config";

export interface NavItem {
  title: string;
  url: string;
}

export interface SocialItem {
  title: string;
  url: string;
  icon?: string;
}

export interface UserConfig {
  title: string;
  description: string;
  url: string;
  author: string;

  avatar?: string;
  logo?: string;
  defaultOGImage?: string;

  navigation?: NavItem[];
  social?: SocialItem[];

  footerCredits?: string;

  postsPerPage?: number;
  recentPosts?: number;
  relatedPosts?: number;

  showLogo?: boolean;
  showThemeToggle?: boolean;
  showReadingTime?: boolean;

  heroVariant?: "default" | "studio";

};

const siteConfig = {
  title: userConfig.title,
  description: userConfig.description,
  url: userConfig.url,
  author: userConfig.author,

  avatar: userConfig.avatar,
  logo: userConfig.logo,
  ogImage: userConfig.defaultOGImage ?? "/og.jpg",

  navigation: userConfig.navigation ?? [],
  social: userConfig.social ?? [],

  postsPerPage: userConfig.postsPerPage ?? 8,
  recentPosts: userConfig.recentPosts ?? 6,
  relatedPosts: userConfig.relatedPosts ?? 4,

  showLogo: userConfig.showLogo ?? false,
  showThemeToggle: userConfig.showThemeToggle ?? true,
  showReadingTime: userConfig.showReadingTime ?? true,

  heroVariant: userConfig.heroVariant ?? "default",
};

export default siteConfig;