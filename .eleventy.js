const Image = require("@11ty/eleventy-img");
const path = require("path");
const pluginRss = require("@11ty/eleventy-plugin-rss");

async function imageShortcode(src, alt, sizes, pageURL) {
    const imgPath = pageURL ? pageURL : "img";

    const metadata = await Image(src, {
        widths: [300],
        formats: ["avif", "jpeg"],
        urlPath: "/img/",
        outputDir: "dist/" + imgPath,
        filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(src);
            const name = path.basename(src, extension);
            return `${name}-${width}w.${format}`;
        }
    });

    const imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async"
    };

    return Image.generateHTML(metadata, imageAttributes);
}

module.exports = (config) => {
    config.addPassthroughCopy("./src/img/");
    config.addPassthroughCopy("./src/css/");

    config.addPlugin(pluginRss);

    config.addPlugin(pluginRss, {
        posthtmlRenderOptions: {
            closingSingleTag: "default" // opt-out of <img/>-style XHTML single tags
        }
    });

    // enable hot reloading
    config.addWatchTarget("./src/posts/");
    config.addWatchTarget("./src/sass/");

    // Returns a collection of blog posts in chronological order
    config.addCollection("posts", (collection) => {
        return [...collection.getFilteredByGlob("./src/posts/*.md")];
    });

    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false);

    config.addNunjucksAsyncShortcode("image", imageShortcode);

    return {
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "dist"
        }
    };
};
