---
title: "Blog"
layout: "layouts/feed.html"
pagination:
    data: collections.blog
    size: 10
permalink: "blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
paginationPrevText: "Newer posts ->"
paginationNextText: "<- Older posts"
---
