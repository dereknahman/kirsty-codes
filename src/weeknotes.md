---
title: "Weeknotes"
layout: "layouts/feed.html"
pagination:
    data: collections.weeknotes
    size: 10
permalink: "weeknotes{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
paginationPrevText: "Newer posts ->"
paginationNextText: "<- Older posts"
---
