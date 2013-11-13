---

##Configuration options REVIEW AND CHANGE THESE PER DONATION FORM

internal-title: Obama Biden test
internal-comment: Test of Obama Biden

client: Obama Biden

#Page Title, if used in your imported header
page-title: Give

tools-slug: default #default exists on most clients, but remember: you'll need to configure the custom form to match the options of whatever tools form you use
tools-recurring-slug: reccur  #leave blank for no recurring. This will need to be a _separate_ toolsform set to take recurring donations
default-source-codes: sequential-donate #source code baked into the page, to identify it for analytics purposes

##
layout: ob #use form-only if you want jekyll to only print out the core markup
sequential: true
quick-donate: true

##top-section
header-section: true
title: Donate Today
subtitle: 

##internationalization
default-country: US # set to either US or GB or leave blank for international. Controls starting state of state_cd labels/country dropdown
default-currency-symbol: "$"

#form customization
custom-amounts: [10, 20, 50, 100, 250, 500, 1000] #an array of 7 values for the donation amount
min-donation: 2
max-donation: 3000
country-selection: false #whether to show a country selection dropdown
require-country: false #country selection must be true for this to work, of course
optional-phone: false #phone is required by default, this overrides that
require-cvv: false #this setting/field will not affect quick donate
show-cvv-help: false #help tooltip: not ready for prime-time

employer-and-occupation: false


#additional text sections
recurring-intro: 
recurring-label: Make This A Recurring Contribution
#in honor-of
in-honor-of-section: false 
in-honor-of-section-intro: "If you would like to make your gift in honor or in memory of someone, please fill out the form below. To send a notification of your thoughtful gift, please enter the recipient's contact information."

#creditcards accepted
accept-visa: true
accept-mastercard: true
accept-amex: true
accept-discover: true
accept-maestro: false #shows up, but not tested with a live client gateway
accept-pay-pal: false  #not yet working

#additional power options
id-prefix: cd_ #id prefix used in order to reduce collision with other elements on a page 
include-styles-inline: true #if true, will include the css link blocks above the form
include-login-inline: true #if true, will include the login section above the form
include-jquery: true #include a jquery, in case your wrapper hasn't called one yet. false if your wrapper already has one in the head
top-node-is-outer: true #attach key handlers to outer element on bsdcd-outer-container instead of to the body element. Currently HAS to be true, sorry
extra-classes-on-outer-container: #just a string of extra classes to add on the bsdcd-outer-container, just in case you need to for you convienience

##debug
no_minimum: false #allow nomin setting by default, bypassing the form minimum ?nomin=1 also works
debug: true #prints more console messages

---