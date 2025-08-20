// @ts-check
import {defineConfig} from "astro/config";
import pagefind from "astro-pagefind";
import {transformerNotationHighlight} from "@shikijs/transformers";

import markdoc from "@astrojs/markdoc";

import sitemap from "@astrojs/sitemap";

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
            ],

        }
    },
    site: "https://mephi.dev",
    integrations: [pagefind(), markdoc({ignoreIndentation: true, allowHTML: true}), sitemap()],
    devToolbar: {
        enabled: false
    },
    prefetch: true,
    redirects: {
        "/who-am-i": "/articles/who-am-i"
    },
    scopedStyleStrategy: "where",
});