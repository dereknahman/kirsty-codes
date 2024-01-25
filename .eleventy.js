const path = require("path")
const pluginRss = require("@11ty/eleventy-plugin-rss")

const Image = require("@11ty/eleventy-img")

module.exports = (config) => {
    config.addPassthroughCopy("src/img")

    // delete
    config.addPlugin(pluginRss)

    config.addPlugin(pluginRss, {
        posthtmlRenderOptions: {
            closingSingleTag: "default", // opt-out of <img/>-style XHTML single tags
        },
    })

    // enable hot reloading
    config.addWatchTarget("./src/blog/")
    config.addWatchTarget("./src/sass/")

    // Returns a collection of blog posts in chronological order
    config.addCollection("blog", (collection) => {
        return [...collection.getFilteredByGlob("./src/blog/*.md")].reverse()
    })

    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false)

    // need to undersrand this more

    async function imageShortcode(src, cls, alt, sizes, pageURL) {
        const imgPath = pageURL ? pageURL : "img"

        const metadata = await Image(src, {
            widths: [200, 300, 400],
            formats: ["jpeg"],
            urlPath: "/img/",
            outputDir: "dist/" + imgPath,
            filenameFormat: function (id, src, width, format, options) {
                const extension = path.extname(src)
                const name = path.basename(src, extension)
                return `${name}-${width}w.${format}`
            },
        })

        const imageAttributes = {
            class: cls,
            alt,
            sizes,
            loading: "lazy",
            decoding: "async",
        }

        return Image.generateHTML(metadata, imageAttributes, {
            whitespaceMode: "inline",
        })
    }

    config.addNunjucksAsyncShortcode("image", imageShortcode)

    return {
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "dist",
        },
    }
}
