---
title: "Tag Archive"
layout: "layouts/feed.html"
pagination:
    data: collections
    size: 1
    alias: tag
    filter:
        [
            "all",
            "random",
            "work",
            "accessibility",
            "rss",
            "monthnotes",
            "myMakes"
        ]
permalink: "tag/{{ tag | slug }}/"
---
