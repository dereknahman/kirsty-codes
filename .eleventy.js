const Image = require('@11ty/eleventy-img');
const path = require('path');

async function imageShortcode(src, alt, sizes, pageURL) {
    const imgPath = pageURL ? pageURL : 'img';

    const metadata = await Image(src, {
        widths: [300, 600, 900],
        formats: ['avif', 'jpeg'],
        urlPath: '/img/',
        outputDir: 'dist/' + imgPath,
        filenameFormat: function (id, src, width, format, options) {
            const extension = path.extname(src);
            const name = path.basename(src, extension);
            return `${name}-${width}w.${format}`;
        }
    });

    const imageAttributes = {
        alt,
        sizes,
        loading: 'lazy',
        decoding: 'async'
    };

    return Image.generateHTML(metadata, imageAttributes);
}

module.exports = (config) => {
    config.addPassthroughCopy('./src/img/');
    config.addPassthroughCopy('./src/css/');

    config.addWatchTarget('./src/css/');

    // Returns a collection of blog posts in reverse date order
    config.addCollection('blog', (collection) => {
        return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
    });

    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false);

    config.addNunjucksAsyncShortcode('image', imageShortcode);

    return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: 'src',
            output: 'dist'
        }
    };
};
