---

##Configuration options REVIEW AND CHANGE THESE PER DONATION FORM


internal-title: Shatterproof Demo

client: Shatterproof
author: Drew Tipson

#Page Title, if used in your imported header
page-title: Donate

tools-slug: default
tools-recurring-slug: #leave blank for no recurring
default-source-codes: sequential-donate

##
layout: shatter-minimal
sequential: true
quick-donate: true

id-prefix: cd_ #id used in order to reduce collision with other elements on a page 
include-styles-inline: true #if true, will include the css link blocks above the form
include-login-inline: true #if true, will include the login section above the form
top-node-is-outer: true #attach key handlers to outer element on bsdcd-outer-container instead of to the body element
extra-classes-on-outer-container: #just a string of extra classes to add, just in case you need to

##top-section
header-section: true
title: DONATE
subtitle: Help us bring new energy, new resources, and a new commitment to prevent, treat and ultimately end addiction.

#form customization
custom-amounts: [10, 20, 50, 100, 250, 500, 1000] #an array of 7 values for the donation amount
min-donation: 2
max-donation: 3000
country-selection: true #whether to show a country selection dropdown
require-country: true
require-cvv: true #this setting/field will not affect quick donate
show-cvv-help: false #help tooltip: not ready for prime-time

employer-and-occupation: false


##internationalization
default-country: US # set to either US or GB or leave blank for international. Controls starting state of state_cd labels/country dropdown
default-currency-symbol: "$"

#text sections
recurring-intro: 
recurring-label: Make This A Recurring Contribution (Optional)

#in honor-of
in-honor-of-section: true #not ready for primetime yet
in-honor-of-section-intro: "If you would like to make your gift in honor or in memory of someone, please fill out the form below. To send a notification of your thoughtful gift, please enter the recipient's contact information."

#creditcards accepted
accept-visa: true
accept-mastercard: true
accept-amex: true
accept-discover: true
accept-maestro: false #shows up, but not tested
accept-pay-pal: false  #not yet working

##debug
no_minimum: false
debug: false

---