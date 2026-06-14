import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const dev = process.argv.includes('dev');

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: { noExternal: ['chart.js'] }
});