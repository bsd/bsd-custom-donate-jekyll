---
layout: demo-page-list
inner: true
title: Readme
---

#Readme

This repo contains:
* A set of scripts for interacting with Blue State Digital's [donate-api](https://github.com/bsdstrategy/donate-api), allowing you to reproduce much of the functionality available from BSD donation pages on a customized page
* A grunt & jekyll-based tool for quickly creating valid donation form markup and branded styles, including a sequential flow (amount, personal information, payment information), testing it in a simulated local environment, and creating assets to deploy.

When run locally, the jekyll server can simulate API calls and logins so that you can test the actual functional js code as well as the look and feel process without actually donating any money.  All the relative api and asset paths are set up to match what would be available on an actual BSD tools domain.

##Local Dev Requirements: 

* Ruby, latest version of Jekyll (~v1.4.2): http://jekyllrb.com/
* Node, Grunt, & NPM: http://gruntjs.com/getting-started

##Wrapper/Site Requirements
* a way to host your custom donate page on the same secure subdomain as the donate module subdomain in the BSD tools (the Simple Pages module of the BSD tools is always a backup option)
* a jQuery version of at least 1.8.2
* Your site MUST implement the .js/.no-js html class method in some fashion. Otherwise, there's no easy way to toggle javascript-only behaviors off when javascript is disabled.  That means that your html tag must include a class of no-js

    `
        <html class="no-js">
    `
* If you're not using [Modernizr](http://modernizr.com/), you must include this script to toggle that class from no-js to js

    `
        <script>(function(dc){ dc.className = dc.className.replace("no-js","js"); }(document.documentElement));</script>
    `
* for IE9 and below, you'll want to make sure your site implements the placeholder polyfill in some fashion.  There's a copy in /js/polyfills/jquery.placeholder.js that can be used like this:

    `
        <!--[if lte IE 9]><script src="/page/-/donate/jquery.placeholder.js"></script><script>jQuery('input, textarea').placeholder();</script><![endif]-->
    `

While not stricly necessary, we recommend using Modernizr and, in particular, the box-sizing custom detect.