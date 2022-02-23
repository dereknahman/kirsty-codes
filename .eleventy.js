const Image = require('@11ty/eleventy-img');

module.exports = (config) => {
    config.addPassthroughCopy('./src/images/');

    // Returns a collection of blog posts in reverse date order
    config.addCollection('blog', (collection) => {
        return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
    });

    // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
    config.setUseGitIgnore(false);

    config.addNunjucksAsyncShortcode('Image', async (src, alt) => {
        if (!alt) {
            throw new Error(`Missing \`alt\` on myImage from: ${src}`);
        }

        let stats = await Image(src, {
            widths: [320, 640, 960],
            formats: ['jpeg', 'webp'],
            urlPath: '/images/',
            outputDir: './dist/img/'
        });

        let lowestSrc = stats['jpeg'][0];

        const srcset = Object.keys(stats).reduce(
            (acc, format) => ({
                ...acc,
                [format]: stats[format].reduce(
                    (_acc, curr) => `${_acc} ${curr.srcset} ,`,
                    ''
                )
            }),
            {}
        );

        const source = `<source type="image/webp" srcset="${srcset['webp']}" >`;

        const img = `<img
          loading="lazy"
          alt="${alt}"
          src="${lowestSrc.url}"
          sizes='(min-width: 1024px) 1024px, 100vw'
          srcset="${srcset['jpeg']}"
          width="${lowestSrc.width}"
          height="${lowestSrc.height}">`;

        return `<div class="image-wrapper"><picture> ${source} ${img} </picture></div>`;
    });

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
