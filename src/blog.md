---
title: 'Blog'
layout: 'layouts/feed.html'
pagination:
    data: collections.blog
    size: 5
permalink: 'blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
---

Blah blah bla
