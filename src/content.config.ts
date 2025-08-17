import {glob, file} from "astro/loaders";
import {defineCollection, reference} from "astro:content";
import {z} from "zod";

export const articles = defineCollection({
    loader: glob({
        pattern: "**/[^_]*.(md|mdoc)",
        base: "./src/data/articles",
    }),
    schema: ({image}) => z.object({
        title: z.string(),
        description: z.string().optional(),
        publishDate: z.date().transform(date => new Date(date)),
        // updateDate: z.date().transform(date => new Date(date)),
        category: reference("categories"),
        tags: z.array(reference("tags")).optional(),
        isHidden: z.boolean().optional(),
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

export const categories = defineCollection({
    loader: file("./src/data/categories.yml"),
    schema: z.object({
        slug: z.string(),
        name: z.string()
    })
})

export const tags = defineCollection({
    loader: file("./src/data/tags.yml"),
    schema: z.object({
        slug: z.string(),
        name: z.string()
    })
})

export const speeches = defineCollection({
    loader: glob({
        pattern: "**/[^_]*.(md|mdoc)",
        base: "./src/data/speeches",
    }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        conference: z.object({
            name: z.string(),
            url: z.string().url().optional(),
            location: z.string()
        }),
        startDate: z.date().transform(date => new Date(date)),
        endDate: z.date().transform(date => new Date(date)),
    })
})

export const collections = {articles, categories, tags, speeches};
