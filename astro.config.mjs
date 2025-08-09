// @ts-check
import {defineConfig} from "astro/config";

// https://astro.build/config
export default defineConfig({
    i18n: {
        locales: ["en", "ru"],
        defaultLocale: "ru",
    },
    markdown: {
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            }
        }
    }
});
