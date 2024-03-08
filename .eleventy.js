const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const filters = require("./utils/filters.js");

const Image = require("@11ty/eleventy-img");

module.exports = (config) => {
    config.addPassthroughCopy("src/img");

    config.addPlugin(pluginRss);

    // Object.keys(filters).forEach((filterName) => {
    //     config.addFilter(filterName, filters[filterName]);
    // });
    // WEBMENTIONS FILTER
    config.addFilter("webmentionsForUrl", (webmentions, url) => {
        // console.log("urgh", webmentions);

        // define which types of webmentions should be included per URL.
        // possible values listed here:
        // https://github.com/aaronpk/webmention.io#find-links-of-a-specific-type-to-a-specific-page
        const allowedTypes = [
            "mention-of",
            "in-reply-to",
            "like-of",
            "repost-of",
            "bookmark-of",
        ];

        // define which HTML tags you want to allow in the webmention body content
        // https://github.com/apostrophecms/sanitize-html#what-are-the-default-options
        const allowedHTML = {
            allowedTags: ["b", "i", "em", "strong", "a"],
            allowedAttributes: {
                a: ["href"],
            },
        };

        // clean webmention content for output
        const clean = (entry) => {
            console.log("entry -> ", entry);
            const { html, text } = entry.content;

            if (html) {
                // really long html mentions, usually newsletters or compilations
                entry.content.value =
                    html.length > 2000
                        ? `mentioned this in <a href="${entry["wm-source"]}">${entry["wm-source"]}</a>`
                        : sanitizeHTML(html, allowedHTML);
            } else {
                entry.content.value = sanitizeHTML(text, allowedHTML);
            }

            return entry;
        };

        // sort webmentions by published timestamp chronologically.
        // swap a.published and b.published to reverse order.
        const orderByDate = (a, b) =>
            new Date(b.published) - new Date(a.published);

        // only allow webmentions that have an author name and a timestamp
        const checkRequiredFields = (entry) => {
            const { author, published } = entry;
            return !!author && !!author.name && !!published;
        };

        console.log(
            "lol -> ",
            webmentions
                .filter((entry) => entry["wm-target"] === url)
                .filter((entry) => allowedTypes.includes(entry["wm-property"]))
                .filter(checkRequiredFields)
                .sort(orderByDate)
                .map(clean)
        );

        // run all of the above for each webmention that targets the current URL
        return webmentions
            .filter((entry) => entry["wm-target"] === url)
            .filter((entry) => allowedTypes.includes(entry["wm-property"]))
            .filter(checkRequiredFields)
            .sort(orderByDate)
            .map(clean);
    });

    config.addPlugin(pluginRss, {
        posthtmlRenderOptions: {
            closingSingleTag: "default", // opt-out of <img/>-style XHTML single tags
        },
    });

    config.addWatchTarget("./src/blog/");
    config.addWatchTarget("./src/sass/");

    config.addCollection("blog", (collection) => {
        return [...collection.getFilteredByGlob("./src/blog/*.md")].reverse();
    });

    config.setUseGitIgnore(false);

    async function imageShortcode(src, cls, alt, sizes, pageURL) {
        const imgPath = pageURL ? pageURL : "img";

        const metadata = await Image(src, {
            widths: [200, 300, 400],
            formats: ["jpeg"],
            urlPath: "/img/",
            outputDir: "dist/" + imgPath,
            filenameFormat: function (id, src, width, format, options) {
                const extension = path.extname(src);
                const name = path.basename(src, extension);
                return `${name}-${width}w.${format}`;
            },
        });

        const imageAttributes = {
            class: cls,
            alt,
            sizes,
            loading: "lazy",
            decoding: "async",
        };

        return Image.generateHTML(metadata, imageAttributes, {
            whitespaceMode: "inline",
        });
    }

    config.addNunjucksAsyncShortcode("image", imageShortcode);

    return {
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "dist",
        },
    };
};
