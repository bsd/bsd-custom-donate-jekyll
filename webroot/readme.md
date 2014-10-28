# Sequential Donate Build for CHOP

## Local Dev Requirements:

* Ruby, latest version of Jekyll (~v1.4.2): http://jekyllrb.com/
* Node, Grunt, & NPM: http://gruntjs.com/getting-started

## Wrapper/Site Requirements
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