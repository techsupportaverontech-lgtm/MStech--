import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Custom plugin to ensure static directories (data/ and assets/) are copied to dist/
function copyStaticDirs() {
  return {
    name: 'copy-static-dirs',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist');
      
      // Copy data/ directory
      const dataSrc = resolve(__dirname, 'data');
      const dataDest = resolve(outDir, 'data');
      if (fs.existsSync(dataSrc)) {
        fs.cpSync(dataSrc, dataDest, { recursive: true });
      }

      // Copy assets/ directory (preserves products/, uploads/, logos, etc.)
      const assetsSrc = resolve(__dirname, 'assets');
      const assetsDest = resolve(outDir, 'assets');
      if (fs.existsSync(assetsSrc)) {
        fs.cpSync(assetsSrc, assetsDest, { recursive: true });
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [copyStaticDirs()],
  build: {
    rollupOptions: {
      checks: {
        pluginTimings: false,
      },
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        rentals: resolve(__dirname, 'rentals.html'),
        solutions: resolve(__dirname, 'solutions.html'),
        vision: resolve(__dirname, 'vision.html'),
        projects: resolve(__dirname, 'projects.html'),
        careers: resolve(__dirname, 'careers.html'),
        reviews: resolve(__dirname, 'reviews.html'),
        contact: resolve(__dirname, 'contact.html'),
        about: resolve(__dirname, 'about.html'),
        terms: resolve(__dirname, 'terms.html'),
        privacy: resolve(__dirname, 'privacy.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
