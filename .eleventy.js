const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const dateFilter = require("./src/filters/date-filter");
const Image = require("@11ty/eleventy-img");

module.exports = (config) => {
    config.addPassthroughCopy("src/img");

    // plugins
    config.addPlugin(pluginRss, {
        posthtmlRenderOptions: {
            closingSingleTag: "default", // opt-out of <img/>-style XHTML single tags
        },
    });

    // filters
    config.addFilter("dateFilter", dateFilter);
    config.addFilter("isNan", (value) => {
        return isNaN(value);
    });

    // watch targets
    config.addWatchTarget("./src/blog/*");
    config.addWatchTarget("./src/css/*");

    // collections
    config.addCollection("posts", (collection) => {
        return [
            ...collection.getFilteredByGlob("./src/blog/posts/*.md"),
        ].reverse();
    });

    config.addCollection("weeknotes", (collection) => {
        return [
            ...collection.getFilteredByGlob("./src/blog/weeknotes/*.md"),
        ].reverse();
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
