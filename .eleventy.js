module.exports = (config) => {
    config.addPassthroughCopy('./src/images/');

    // Returns a collection of blog posts in reverse date order
    config.addCollection('blog', (collection) => {
        return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
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
