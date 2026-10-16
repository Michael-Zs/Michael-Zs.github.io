// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: "https://michael-zs.github.io",
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
});
