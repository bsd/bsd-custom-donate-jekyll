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
layout: shatter-minimal #use form-only if you want jekyll to only print out the core markup
sequential: true
quick-donate: true


##top-section
header-section: true
title: DONATE
subtitle: Help us bring new energy, new resources, and a new commitment to prevent, treat and ultimately end addiction.

#form customization
custom-amounts: [10, 25, 50, 100, 250, 1000, 2500] #an array of 7 values for the donation amount
min-donation: 5
max-donation: 300000
country-selection: true #whether to show a country selection dropdown
require-country: true #country selection must be true for this to work, of course
optional-phone: true #phone is required by default, this overrides that
require-cvv: false #this setting/field will not affect quick donate
show-cvv-help: false #help tooltip: not ready for prime-time

employer-and-occupation: false


##internationalization
default-country: US # set to either US or GB or leave blank for international. Controls starting state of state_cd labels/country dropdown
default-currency-symbol: "$"

#text sections
recurring-intro: 
recurring-label: Make This A Recurring Contribution (Optional)

#in honor-of
in-honor-of-section: true 
in-honor-of-section-intro: To make your contribution in somebody's honor, fill in the information below. Please provide an email or street address so we can notify them (or, in the case of an in memoriam contribution, the recipient you specify) of your thoughtfulness and generosity.

#creditcards accepted
accept-visa: true
accept-mastercard: true
accept-amex: true
accept-discover: true
accept-maestro: false #shows up, but not tested
accept-pay-pal: false  #not yet working

#additional power options
id-prefix: cd_ #id used in order to reduce collision with other elements on a page 
include-styles-inline: false #if true, will include the css link blocks above the form
include-login-inline: false #if true, will include the login section above the form
include-jquery: false #include a jquery, in case your wrapper hasn't called one yet. false if your wrapper already has one in the head
top-node-is-outer: true #attach key handlers to outer element on bsdcd-outer-container instead of to the body element
extra-classes-on-outer-container: #just a string of extra classes to add, just in case you need to
class-on-in-honor: base #in-honor-of section title and intro can get a separate class, useful for sites that use .base

##debug
no_minimum: false
debug: false

---