export interface Post {
  slug: string;
  title: string;
  bannerImagePath: string;
  shortDescription: string;
  markdownPath: string;
  latestUpdate: string;
}

// To add a new post:
// 1. Add a new object to this array.
// 2. Create a corresponding .md file in the /blog folder.
// 3. Make sure the bannerImagePath links to a valid image.
// 4. Add the latestUpdate field with the date of the most recent update.
export const posts: Post[] = [
  {
    slug: 'hello-world',
    title: 'Hello World: My First Post',
    bannerImagePath: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2089&auto=format&fit=crop',
    shortDescription: 'Join me on my first step into the world of blogging. Discover the why and how behind this new website.',
    markdownPath: 'blog/first-post.md',
    latestUpdate: '2024-01-15',
  },
  {
    slug: 'deep-dive-into-css',
    title: 'A Deep Dive into Modern CSS',
    bannerImagePath: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
    shortDescription: 'From Flexbox to Grid to custom properties, we explore the CSS features that power modern web design.',
    markdownPath: 'blog/second-post.md',
    latestUpdate: '2024-01-20',
  },
];
