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
    slug: 'llm-settings',
    title: 'Beyond the Black Box: A Comprehensive Guide to LLM Settings',
    bannerImagePath: 'assets/llm_settings_header.png',
    shortDescription: 'Dive deep into LLM API parameters—including Temperature, TOP-P, Max Length, Stop Sequence, Frequency Penalty, and Presence Penalty—to expertly steer AI creativity, coherence, and conciseness for any task.',
    markdownPath: 'blog/llm_settings.md',
    latestUpdate: '2025-08-24',
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
];
