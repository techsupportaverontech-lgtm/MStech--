import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
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
