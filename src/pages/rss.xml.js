import rss from '@astrojs/rss';
import {getCollection} from "astro:content";
import {pathBuilder} from "../utils/index.js";

export async function GET(context) {
    const articles = await getCollection("articles");
    return rss({
        // `<title>` field in output xml
        title: 'Сэм Булатов',
        // `<description>` field in output xml
        description: 'Блог о разработке',
        // Pull in your project "site" from the endpoint context
        // https://docs.astro.build/en/reference/api-reference/#site
        site: context.site,
        // Array of `<item>`s in output xml
        // See "Generating items" section for examples using content collections and glob imports
        items: articles.map((article) => {
            return {
                title: article.data.title,
                pubDate: article.data.publishDate,
                description: article.data.description,
                link: pathBuilder.singleArticle(article.id)
            }
        }),
        trailingSlash: false,
        // (optional) inject custom xml
        customData: `<language>ru-RU</language>`,
    });
}
