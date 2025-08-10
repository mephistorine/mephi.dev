// @ts-check
import {defineConfig} from "astro/config";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            }
        }
    },
    site: "https://mephi.dev",
    integrations: [
        pagefind()
    ]
});
