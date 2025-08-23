export interface Post {
  slug: string;
  title: string;
  bannerImagePath: string;
  shortDescription: string;
  markdownPath: string;
  latestUpdate: string;
  language: 'en' | 'zh'; // Language tag for filtering
}

// To add a new post:
// 1. Add a new object to this array.
// 2. Create a corresponding .md file in the /blog folder.
// 3. Make sure the bannerImagePath links to a valid image.
// 4. Add the latestUpdate field with the date of the most recent update.
// 5. Add the language field ('en' for English, 'zh' for Chinese).
export const posts: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World: My First Post',
    bannerImagePath: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2089&auto=format&fit=crop',
    shortDescription: 'Join me on my first step into the world of blogging. Discover the why and how behind this new website.',
    markdownPath: 'blog/first-post.md',
    latestUpdate: '2024-01-15',
    language: 'en',
  },
  {
    slug: 'deep-dive-into-css',
    title: 'A Deep Dive into Modern CSS',
    bannerImagePath: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
    shortDescription: 'From Flexbox to Grid to custom properties, we explore the CSS features that power modern web design.',
    markdownPath: 'blog/second-post.md',
    latestUpdate: '2024-01-20',
    language: 'en',
  },
  {
    slug: 'hello-world-zh',
    title: '你好世界：我的第一篇博客',
    bannerImagePath: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2089&auto=format&fit=crop',
    shortDescription: '和我一起踏上博客之旅的第一步。探索这个新网站背后的原因和方法。',
    markdownPath: 'blog/first-post-zh.md',
    latestUpdate: '2024-01-15',
    language: 'zh',
  },
  {
    slug: 'deep-dive-into-css-zh',
    title: '深入探讨现代CSS',
    bannerImagePath: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
    shortDescription: '从Flexbox到Grid再到自定义属性，我们探索为现代网页设计提供动力的CSS功能。',
    markdownPath: 'blog/second-post-zh.md',
    latestUpdate: '2024-01-20',
    language: 'zh',
  },
];
