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
    shortDescription: 'Dive deep into LLM API parameters—including Temperature, TOP-P, Max Length, Stop Sequence, Frequency Penalty, and Presence Penalty.',
    markdownPath: 'blog/llm-settings.md',
    latestUpdate: '2025-08-24',
    language: 'en',
  },
  {
    slug: 'llm-settings-zh',
    title: '大语言模型基础参数详解',
    bannerImagePath: 'assets/llm_settings_header.png',
    shortDescription: '深入探讨大语言模型（LLM）API中的基础参数设置，包括Temperature、TOP-P、Max Length、Stop Sequence、Frequency Penalty和Presence Penalty。',
    markdownPath: 'blog/llm-settings-zh.md',
    latestUpdate: '2025-08-24',
    language: 'zh',
  },
  {
    slug: 'understanding-large-language-models',
    title: 'Understanding Large Language Models',
    bannerImagePath: 'assets/understanding-llm/LLM.jpeg',
    shortDescription: 'A comprehensive guide to understanding large language models.',
    markdownPath: 'blog/understanding-large-language-models.md',
    latestUpdate: '2025-08-30',
    language: 'en',
  },
  {
    slug: 'transformer_qkv-zh.md',
    title: '一次讲清楚大语言模型（transformer）的工作原理',
    bannerImagePath: 'assets/transformer/header.png',
    shortDescription: '尝试用简单的语言一次性讲清楚大语言模型的结构，及构架中每一层的工作原理',
    markdownPath: 'blog/transformer_qkv-zh.md',
    latestUpdate: '2025-09-08',
    language: 'zh',
  },
];
