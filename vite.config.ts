import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Use different base paths for development vs production
    const base = mode === 'production' ? '/blog/' : '/';
    
    return {
      base,
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name].[ext]'
          }
        }
      }
    };
});
