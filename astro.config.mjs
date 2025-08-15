// @ts-check
import {defineConfig} from "astro/config";
import pagefind from "astro-pagefind";
import {transformerNotationHighlight} from "@shikijs/transformers";

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            },
            transformers: [
                transformerNotationHighlight()
            ]
        }
    },
    site: "https://mephi.dev",
    integrations: [
        pagefind()
    ]
});
