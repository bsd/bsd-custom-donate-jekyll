bsd-custom-donate-jekyll
========================

A Jekyll framework for locally developing/testing/listing custom donate pages using the donate API.  Simulates API calls and logins so that you can test the process without actually donating money.

There are three main ways you can use this tool. 

1. Either you can simply create some plug-and-play custom donate form markup based on config variables and use that code in EE or the tools, include the js/css links to the library and then handle any extra client styling yourself, or
2. You can create new jekyll wrappers/style types in the tool and compile/preview/test all the css/js on the local jekyll server.
3. Canibalize the code

Some things of note here:
    *SASSified
    *handles quick donate logins/logouts natively
    *handles in honor of fields
    *handles prefill of data from url parameters and spud
    *credit card type auto-detection. (Currently Visa, Mastercard, Amex, Discover, Maestro)
    *nomin=1 for testing extremely low dollar amounts
    *sequential donate behavior is separated from the core
    *built for content-box so that it can work with older sites.  Better(i.e., simpler) border-box support in progress if you don't need to support IE7
    *Core Layout supports IE7

There's a lot more to be done to make the core more flexible and customizable, but you shouldn't need more than a couple of client-specific tweaks to get a nice looking, fully functional form.

##Requirements: 

*Ruby, latest version of Jekyll (v1), etc.
*Something to compile SASS with (Codekit, sass watch, etc.)
*Your site MUST implement the .js .no-js method. Otherwise, there's no easy way to toggle sequential off when javascript is disabled

##Setup: 

1. Clone the reponsitory and cd into it
2. run "jekyll serve --w" from the command line
3. navigate to [http://localhost:4000] and you should see a list of pages built

##Creating new pages in jekyll

Simply create a markdown file in _posts with the YYYY-MM-DD-unique-name format.  Copy over the default config file, then go through and set all the options.  In the future, we'll automate this for you.  If you've created a valid config file, your jekyll server should list your page and you should see it in the _sites directory. 

##Implementing a new page

First question: does your client have an EE install that can run on a secure domain?  i.e. https://donate.pih.org/pages/ is a real EE page (even though not all of its assets are secure)

Yes: then you can host a custom donate page on EE, as a template, maybe even using the standard wrappers (as long as you're not calling any non-secure assets in the wrapper or the main css).

No: then you probably have to host the custom form in the Simple Pages module on the tools, so that it can all run on the client's secure domain. Again, whatever wrapper you use should be https:// friendly

(Caveat: in either case, you're going to want to make sure that there is no way to access the non-secure version of the page, ideally by using a server side method to forward people to the secure domain when they request your page.)

At this point, you should have basically two steps to get things working (this will change, as we'll want to separate core stuff from client custom stuff)

1. Upload the /donate/ folder in /page/-/ from jekyll to a folder /donate on your client's server.
2. Put the form markup on EE or Simple Pages, inside some appropriate wrapper.  If you want jekyll to just output the inner markup, instead of any test wrapper you used locally, set the layout option to form-only and copy the source of the result.

Now test!

##Wrapper Tips

It's best to use a minimal wrapper (no nav, clutter) and it's also best to avoid wrappers like #framework that might just add tools styles and clutter that you don't want to have to undo.  It's also worth noting that h1-h6/p/ul/li styles used within the form markup may have to be tweaked or extended if you're using classes like .base to set font styles and sizes.  

##Creating new templates

At this point, you should basically have DrewT set this up for you.  It's quick, but not yet automated or intuitive. 

The basics though, involve creating

1. a page layout template that pulls in
2. any necessary headers and footer wrappers, with their external assets pointed at the client site
3. a new scss folder for the project that compiles into the /page/-/donate/foldername folder


## Todo

*allow quick donate to be turned completely off
*separate structure from functionality even more, and split off style choices into discrete modules
*make the lack of a next button on the amounts step in sequential an option rather than a mandatory feature
*arbitrary custom fields
*additional stock layouts (more conventional text on the left/form on the right, layout for sidebar iframes, etc.)

### Minor things these scripts do that you might not notice at first, but are critical behavior

*If users can ever select a country different from the US, then the zip field cannot be type="tel"  This would bring up the numbers only keypad on mobile phones, preventing users from entering any postal codes that include letters. We can't switch types dynamically because this breaks/throws security warnings in IEs.
*Likewise, if users can select different countries than the US, then state_cd needs to switch from a dropdown to a text field and back again.  The main form handles this already, and the in honor section simply leaves honoree_state_cd as a text field regardless because it always allows international addresses.



