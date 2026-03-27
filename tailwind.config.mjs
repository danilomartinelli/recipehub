import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'from-red-500', 'to-red-700',
    'from-blue-500', 'to-blue-700',
    'from-green-500', 'to-green-700',
    'from-yellow-500', 'to-yellow-700',
    'from-purple-500', 'to-purple-700',
    'from-pink-500', 'to-pink-700',
  ],
};

export default config;