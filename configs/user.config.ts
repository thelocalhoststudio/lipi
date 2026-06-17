import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "Lipi",
  description:
    "A minimal editorial theme for Astro built for blogs, journals, travel writing, and long-form publishing.",

  url: "https://astro-lipi.pages.dev",
  author: "John Doe",

  logo: "/logo.svg",
  avatar: "/avatar.png",

  navigation: [
    { title: "Writing", url: "/posts" },
    { title: "Archive", url: "/archive" },
    { title: "About", url: "/about" },
  ],

  footerLinks: [
    { title: "RSS", url: "/rss.xml" },
    { title: "Archive", url: "/archive" },
    { title: "Source", url: "https://github.com/thelocalhoststudio/lipi" },
    
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com/thelocalhoststudio/lipi",
      icon: "github",
    },
    {
      title: "X",
      url: "https://x.com/",
      icon: "x",
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/",
      icon: "linkedin",
    },
    
  ],

  footerCredits: "Designed for reading. Built with Astro & Lipi",

  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,

  showThemeToggle: true,
  showReadingTime: true,

  heroVariant: "studio",

  annotation: "Writing between filter coffees and terminal windows.",
};

export default userConfig;