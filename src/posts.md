---
title: "Blog"
layout: "layouts/feed.html"
pagination:
    data: collections.posts
    size: 10
permalink: "posts{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
paginationPrevText: "Newer posts ->"
paginationNextText: "<- Older posts"
---
