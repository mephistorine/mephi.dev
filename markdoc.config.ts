import {component, defineMarkdocConfig, nodes} from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";
import {transformerNotationHighlight} from "@shikijs/transformers";

export default defineMarkdocConfig({
    extends: [
        shiki({
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            },
            transformers: [
                transformerNotationHighlight()
            ],
        })
    ],
    nodes: {
        heading: {
            ...nodes.heading,
            render: component("./src/components/markdoc/Heading.astro")
        },
        // Убираем лишний article
        document: {
            ...nodes.document,
            render: undefined
        }
    },
    tags: {
        image: {
            render: component("./src/components/markdoc/Figure.astro"),
            attributes: {
                width: {
                    type: String,
                },
                height: {
                    type: String,
                },
                loading: {
                    type: String,
                },
                fetchpriority: {
                    type: String,
                },
                ...nodes.image.attributes
            }
        },
        carousel: {
            render: component("./src/components/markdoc/Carousel.astro")
        }
    }
});
