import {glob} from "astro/loaders";
import {defineCollection} from "astro:content";
import {z} from "zod";

export const articles = defineCollection({
    loader: glob({
        pattern: "**/[^_]*.md",
        base: "./src/data/articles",
    }),
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string().optional(),
        publishDate: z.date().transform(date => new Date(date)),
        updateDate: z.date().transform(date => new Date(date)),
        poster: z.object({
            url: image(),
            alt: z.string(),
            author: z.object({
                name: z.string(),
                url: z.string().url()
            }).optional()
        }).optional(),
    }),
});
/*
export const categories = defineCollection({
    loader: glob({
        pattern: "**!/!*.md",
        base: "./src/pages/categories"
    }),
    schema: z.object({
        title: z.string()
    })
})*/

export const collections = {articles};
