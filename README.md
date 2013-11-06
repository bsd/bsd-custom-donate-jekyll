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
    *But... core layout should support IE7

There's a lot more to be done to make the core more flexible and customizable, but you shouldn't need more than a couple of client-specific tweaks to get a nice looking, fully functional form.

##Requirements: 

*Ruby, latest version of Jekyll (v1), etc.
*Something to compile SASS with (Codekit, sass watch, etc.)
*Your site MUST implement the .js .no-js method. Otherwise, there's no easy way to toggle sequential off when javascript is disabled

##Setup: 

1. Clone the reponsitory and cd into it
2. run "jekyll serve --w" from the command line
3. navigate to http://localhost:4000 and you should see a list of pages built

##Creating new pages in jekyll

Simply create a markdown file in _posts with the YYYY-MM-DD-unique-name format.  Copy over the default config file, then go through and set all the options.  In the future, we'll automate this for you.  If you've created a valid config file, your jekyll server should list your page and you should see it in the _sites directory as well as in the list on http://localhost:4000

If you've not changed any of the default options, it won't have any styles, of course (but all the js should work!).  Pulling core styles from a client site and getting them into the test jekyll environment isn't hard (usually takes me about 10-20 minutes max). You'll then simply create a new custom donate styleset that works with those .  Check the "Creating new layouts" section for more.

##Implementing a new page in practice

First question: does your client have an EE install that can run on a secure domain?  i.e. https://donate.pih.org/pages/ is a real EE page (even though not all of its assets are secure)

Yes: then you can host a custom donate page on EE, as a template, maybe even using the standard wrappers (as long as you're not calling any non-secure assets in the wrapper or the main css).

No: then you probably have to host the custom form in the Simple Pages module on the tools, so that it can all run on the client's secure domain. Again, whatever wrapper you use should be https:// friendly

(Caveat: in either case, you're going to want to make sure that there is no way to access the non-secure version of the page, ideally by using a server side method to forward people to the secure domain when they request your page.)

At this point, you should have basically two steps to get things working (this will change, as we'll want to separate core stuff from client custom stuff)

1. Upload the /donate/ folder in /page/-/ from jekyll to a folder /donate on your client's server.
2. Put the form markup on EE or Simple Pages, inside some appropriate wrapper.  If you want jekyll to just output the inner markup, instead of any test wrapper you used locally, set the layout option to form-only and copy the source of the result.  Make sure to figure out whether you want it to simply print out the CSS links and/or login markup above the form, or whether you are going to put those elsewhere in your real, production wrapper. You can turn both off in the config (you can also turn them off to stick them elsewhere in your test layout wrapper if you have one, to more closely match production).
3. If your site is not responsive, just link to the desktop stylesheet and ignore the main one.  Or, leave everything in place and set the sequential/form breakpoints to like 2px or something.

Now test!

##Things you'll want to test

1. Overriden styles: there's a trade-off in making bsdcd styles simpler/faster: existing client styles may override the core, breaking the plug-n-play nature of structure/look. However, there are a couple of very common culprits if things look wrong: 
    *special padding and margins on ul/ol/li elements (often caused by over-specific rules).
    *.base or #framework classes in the wrapper triggering a bunch of complex tools styles (just remove those from the wrapper in most cases)
2. Do you have some means of getting the CSS in the <head>?  If not, the styles may flash on first load. A custom tools wrapper may be in order, or an includes/header.html conditinal that can call the styles as needed.
3. Does the background image work at all browser sizes above tablet?  This can take some serious playing around with the code in bsdcd-backgrounds, as it really depends on what the image is, and what part of it you want to keep in view as the page scales, all without exposing the edges of the image.

##Wrapper Tips

It's best to use a minimal wrapper (no nav, clutter) and it's also best to avoid wrappers like #framework that might just add tools styles and clutter that you don't want to have to undo.  It's also worth noting that h1-h6/p/ul/li styles used within the form markup may have to be tweaked or extended if you're using classes like .base to set font styles and sizes.  

##Creating new layouts

At this point, you should basically have DrewT set this up for you.  It's quick, but not yet automated or intuitive. 

The basics though, involve creating

1. a page layout template [layoutname].html (can use jekyll includes if you understand how to use them) that pulls in
2. any necessary headers and footer wrappers, with their external assets (like images) tweaked to point at the client's production site (but don't go crazy: this is all just so that you can quickly test the styles/layout)
3. a new folder [layoutname] in scss for the project that compiles the css into the /page/-/donate/[layoutname] folder


## Todo

*allow quick donate to be turned completely off
*separate structure from functionality even more, and split off style choices into discrete modules
*make the lack of a next button on the amounts step in sequential an option rather than a mandatory feature
*arbitrary custom fields
*additional stock layouts (more conventional text on the left/form on the right, layout for sidebar iframes, etc.)

### Minor things these scripts do that you might not notice at first, but are critical behavior

*If users can ever select a country different from the US, then the zip field cannot be type="tel"  This would bring up the numbers only keypad on mobile phones, preventing users from entering any postal codes that include letters. We can't switch types dynamically because this breaks/throws security warnings in IEs.
*Likewise, if users can select different countries than the US, then state_cd needs to switch from a dropdown to a text field and back again.  The main form handles this already, and the in honor section simply leaves honoree_state_cd as a text field regardless because it always allows international addresses.


<a href="javascript:(function()%7B!function(%24,window,document,undefined)%7Bvar isPlaying,animId,Starfield%3Dfunction(el,options)%7Bthis.el%3Del,this.%24el%3D%24(el),this.options%3Doptions,that%3Dthis%7D,isInited%3D!1,canCanvas%3D!1%3B!function()%7Bfor(var lastTime%3D0,vendors%3D%5B"ms","moz","webkit","o"%5D,x%3D0%3Bx<vendors.length%26%26!window.requestAnimationFrame%3B%2B%2Bx)window.requestAnimationFrame%3Dwindow%5Bvendors%5Bx%5D%2B"RequestAnimationFrame"%5D,window.cancelAnimationFrame%3Dwindow%5Bvendors%5Bx%5D%2B"CancelAnimationFrame"%5D%7C%7Cwindow%5Bvendors%5Bx%5D%2B"CancelRequestAnimationFrame"%5D%3Bwindow.requestAnimationFrame%7C%7C(window.requestAnimationFrame%3Dfunction(callback)%7Bvar currTime%3D(new Date).getTime(),timeToCall%3DMath.max(0,16-(currTime-lastTime)),id%3Dwindow.setTimeout(function()%7Bcallback(currTime%2BtimeToCall)%7D,timeToCall)%3Breturn lastTime%3DcurrTime%2BtimeToCall,id%7D),window.cancelAnimationFrame%7C%7C(window.cancelAnimationFrame%3Dfunction(id)%7BclearTimeout(id)%7D)%7D(),Starfield.prototype%3D%7Bdefaults:%7BstarColor:"rgba(255,255,255,1)",bgColor:"rgba(0,0,0,1)",mouseMove:!0,mouseColor:"rgba(0,0,0,0.2)",mouseSpeed:20,fps:15,speed:3,quantity:512,ratio:256,divclass:"starfield"%7D,resizer:function()%7Bvar oldStar%3Dthis.star,initW%3Dthis.context.canvas.width,initH%3Dthis.context.canvas.height%3Bthis.w%3Dthis.%24el.width(),this.h%3Dthis.%24el.height(),this.x%3DMath.round(this.w/2),this.y%3DMath.round(this.h/2),this.portrait%3Dthis.w<this.h%3Bvar ratX%3Dthis.w/initW,ratY%3Dthis.h/initH%3Bthis.context.canvas.width%3Dthis.w,this.context.canvas.height%3Dthis.h%3Bfor(var i%3D0%3Bi<this.n%3Bi%2B%2B)this.star%5Bi%5D%5B0%5D%3DoldStar%5Bi%5D%5B0%5D*ratX,this.star%5Bi%5D%5B1%5D%3DoldStar%5Bi%5D%5B1%5D*ratY,this.star%5Bi%5D%5B3%5D%3Dthis.x%2Bthis.star%5Bi%5D%5B0%5D/this.star%5Bi%5D%5B2%5D*this.star_ratio,this.star%5Bi%5D%5B4%5D%3Dthis.y%2Bthis.star%5Bi%5D%5B1%5D/this.star%5Bi%5D%5B2%5D*this.star_ratio%3Bthat.context.fillStyle%3Dthat.settings.bgColor,this.context.strokeStyle%3Dthis.settings.starColor%7D,init:function()%7Bthis.settings%3D%24.extend(%7B%7D,this.defaults,this.options)%3Bvar url%3Ddocument.location.href%3Bthis.n%3DparseInt(-1!%3Durl.indexOf("n%3D")%3Furl.substring(url.indexOf("n%3D")%2B2,-1!%3Durl.substring(url.indexOf("n%3D")%2B2,url.length).indexOf("%26")%3Furl.indexOf("n%3D")%2B2%2Burl.substring(url.indexOf("n%3D")%2B2,url.length).indexOf("%26"):url.length):this.settings.quantity),this.flag%3D!0,this.test%3D!0,this.w%3D0,this.h%3D0,this.x%3D0,this.y%3D0,this.z%3D0,this.star_color_ratio%3D0,this.star_x_save%3D0,this.star_y_save%3D0,this.star_ratio%3Dthis.settings.ratio,this.star_speed%3Dthis.settings.speed,this.star_speed_save%3D0,this.star%3Dnew Array(this.n),this.color%3Dthis.settings.starColor,this.opacity%3D.1,this.cursor_x%3D0,this.cursor_y%3D0,this.mouse_x%3D0,this.mouse_y%3D0,this.canvas_x%3D0,this.canvas_y%3D0,this.canvas_w%3D0,this.canvas_h%3D0,this.fps%3Dthis.settings.fps,this.desktop%3D!navigator.userAgent.match(/(iPhone%7CiPod%7CiPad%7CAndroid%7CBlackBerry%7CBB10%7CIEMobile)/),this.orientationSupport%3Dwindow.DeviceOrientationEvent!%3D%3Dundefined,this.portrait%3Dnull%3Bvar canvasInit%3Dfunction()%7Bthat.w%3Dthat.%24el.width(),that.h%3Dthat.%24el.height(),that.initW%3Dthat.w,that.initH%3Dthat.h,that.portrait%3Dthat.w<that.h,that.wrapper%3D%24("<canvas />").addClass(that.settings.divclass),that.wrapper.appendTo(that.el),that.starz%3D%24("canvas",that.el),that.starz%5B0%5D.getContext%26%26(that.context%3Dthat.starz%5B0%5D.getContext("2d"),canCanvas%3D!0),that.context.canvas.width%3Dthat.w,that.context.canvas.height%3Dthat.h%7D%3BcanvasInit()%3Bvar starInit%3Dfunction()%7Bif(canCanvas)%7Bthat.x%3DMath.round(that.w/2),that.y%3DMath.round(that.h/2),that.z%3D(that.w%2Bthat.h)/2,that.star_color_ratio%3D1/that.z,that.cursor_x%3Dthat.x,that.cursor_y%3Dthat.y%3Bfor(var i%3D0%3Bi<that.n%3Bi%2B%2B)that.star%5Bi%5D%3Dnew Array(5),that.star%5Bi%5D%5B0%5D%3D2*Math.random()*that.w-2*that.x,that.star%5Bi%5D%5B1%5D%3D2*Math.random()*that.h-2*that.y,that.star%5Bi%5D%5B2%5D%3DMath.round(Math.random()*that.z),that.star%5Bi%5D%5B3%5D%3D0,that.star%5Bi%5D%5B4%5D%3D0%3Bthat.context.fillStyle%3Dthat.settings.bgColor,that.context.strokeStyle%3Dthat.settings.starColor%7D%7D%3BstarInit(),isInited%3D!0%7D,anim:function()%7Bthis.mouse_x%3Dthis.cursor_x-this.x,this.mouse_y%3Dthis.cursor_y-this.y,this.context.fillRect(0,0,this.w,this.h)%3Bfor(var i%3D0%3Bi<this.n%3Bi%2B%2B)this.test%3D!0,this.star_x_save%3Dthis.star%5Bi%5D%5B3%5D,this.star_y_save%3Dthis.star%5Bi%5D%5B4%5D,this.star%5Bi%5D%5B0%5D%2B%3Dthis.mouse_x>>4,this.star%5Bi%5D%5B0%5D>this.x<<1%26%26(this.star%5Bi%5D%5B0%5D-%3Dthis.w<<1,this.test%3D!1),this.star%5Bi%5D%5B0%5D<-this.x<<1%26%26(this.star%5Bi%5D%5B0%5D%2B%3Dthis.w<<1,this.test%3D!1),this.star%5Bi%5D%5B1%5D%2B%3Dthis.mouse_y>>4,this.star%5Bi%5D%5B1%5D>this.y<<1%26%26(this.star%5Bi%5D%5B1%5D-%3Dthis.h<<1,this.test%3D!1),this.star%5Bi%5D%5B1%5D<-this.y<<1%26%26(this.star%5Bi%5D%5B1%5D%2B%3Dthis.h<<1,this.test%3D!1),this.star%5Bi%5D%5B2%5D-%3Dthis.star_speed,this.star%5Bi%5D%5B2%5D>this.z%26%26(this.star%5Bi%5D%5B2%5D-%3Dthis.z,this.test%3D!1),this.star%5Bi%5D%5B2%5D<0%26%26(this.star%5Bi%5D%5B2%5D%2B%3Dthis.z,this.test%3D!1),this.star%5Bi%5D%5B3%5D%3Dthis.x%2Bthis.star%5Bi%5D%5B0%5D/this.star%5Bi%5D%5B2%5D*this.star_ratio,this.star%5Bi%5D%5B4%5D%3Dthis.y%2Bthis.star%5Bi%5D%5B1%5D/this.star%5Bi%5D%5B2%5D*this.star_ratio,this.star_x_save>0%26%26this.star_x_save<this.w%26%26this.star_y_save>0%26%26this.star_y_save<this.h%26%26this.test%26%26(this.context.lineWidth%3D2*(1-this.star_color_ratio*this.star%5Bi%5D%5B2%5D),this.context.beginPath(),this.context.moveTo(this.star_x_save,this.star_y_save),this.context.lineTo(this.star%5Bi%5D%5B3%5D,this.star%5Bi%5D%5B4%5D),this.context.stroke(),this.context.closePath())%7D,loop:function()%7Bthis.anim(),animId%3Dwindow.requestAnimationFrame(function()%7Bthat.loop()%7D)%7D,move:function()%7Bfunction handleOrientation(event)%7Bif(null!%3D%3Devent.beta%26%26null!%3D%3Devent.gamma)%7Bvar x%3Devent.gamma,y%3Devent.beta%3Bthat.portrait%7C%7C(x%3D-1*event.beta,y%3Devent.gamma),that.cursor_x%3Dthat.w/2%2B5*x,that.cursor_y%3Dthat.h/2%2B5*y%7D%7Dfunction handleMousemove(event)%7Bthat.cursor_x%3Devent.pageX%7C%7Cevent.clientX%2Bdoc.scrollLeft-doc.clientLeft,that.cursor_y%3Devent.pageY%7C%7Cevent.clientY%2Bdoc.scrollTop-doc.clientTop%7Dvar doc%3Ddocument.documentElement%3Bthis.orientationSupport%26%26!this.desktop%3Fwindow.addEventListener("deviceorientation",handleOrientation,!1):window.addEventListener("mousemove",handleMousemove,!1)%7D,stop:function()%7Bwindow.cancelAnimationFrame(animId),isPlaying%3D!1%7D,start:function()%7Breturn isInited%7C%7C(isInited%3D!0,this.init()),isPlaying%7C%7C(isPlaying%3D!0,this.loop()),window.addEventListener("resize",function()%7Bthat.resizer()%7D,!1),window.addEventListener("orientationchange",function()%7Bthat.resizer()%7D,!1),this.settings.mouseMove%26%26this.move(),this%7D%7D,Starfield.defaults%3DStarfield.prototype.defaults,%24.fn.starfield%3Dfunction(options)%7Breturn this.each(function()%7Bnew Starfield(this,options).start()%7D)%7D,window.Starfield%3DStarfield%7D(jQuery,window,document)%3BjQuery(%27body%27).starfield().append(%27<style>.starfield %7B position: fixed%3Btop: 0%3Bleft: 0%3Bz-index: -1%3Bheight: 100%25%3Bwidth: 100%25%3B%7D body%7Bbackground-color:transparent%3Bbackground-image:none%3B%7D</style>%27)%3B%7D)()%3B">stars</a>
