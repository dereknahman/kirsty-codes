const { DateTime } = require("luxon");

module.exports = {
    getWebmentionsForUrl: (webmentions, url) => {
        console.log("getWebmentionsForUrl", webmentions);
        return webmentions.children.filter(
            (entry) => entry["wm-target"] === url
        );
    },
};
//     isOwnWebmention: (webmention) => {
//         console.log("isOwnWebmention", webmentions);
//         const urls = [
//             "https://kirsty.website",
//             "https://infosec.exchange/@kir5ty",
//         ];
//         const authorUrl = webmention.author ? webmention.author.url : false;
//         // check if a given URL is part of this site.
//         return authorUrl && urls.includes(authorUrl);
//     },
//     size: (mentions) => {
//         console.log("size", mentions);
//         return !mentions ? 0 : mentions.length;
//     },
//     webmentionsByType: (mentions, mentionType) => {
//         console.log("webmentionsByType", mentions, mentionType);

//         return mentions.filter((entry) => !!entry[mentionType]);
//     },
//     readableDateFromISO: (dateStr, formatStr = "dd LLL yyyy 'at' hh:mma") => {
//         return DateTime.fromISO(dateStr).toFormat(formatStr);
//     },
// };
