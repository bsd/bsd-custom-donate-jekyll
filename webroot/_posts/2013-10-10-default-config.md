---

##Configuration options REVIEW AND CHANGE THESE PER DONATION FORM

internal-title: Default Config #Internal title of page for internal reference
internal-comment: This is the config to clone from #internal comment

client: NONE

#Public Page Title, if it is used in your imported header
page-title: Give

tools-slug: default #default exists on most clients, but remember: you'll need to configure this custom form to match the options of whatever tools form you use or vice-versa
tools-recurring-slug: reccur  #leave blank for no recurring. This will need to be a _separate_ tools form set to take only recurring donations, and otherwise configured the same way as the original form
default-source-codes: custom-donate #comma separated list of source codes that will baked into the page by default, to identify it for analytics purposes

##Core Options
layout: default #use form-only if you want jekyll to only print out the core markup
sequential: true
quick-donate: true

##top-section
header-section: true #include an intro section
title: Your Donation Will Save Lives
subtitle: Donate to Partners In Health
above-header-html: #override the entire top section and use your own arbitrary html

##internationalization
default-country: US # set to either US or GB or leave blank for international. Controls starting state of state_cd labels/country dropdown
default-currency-symbol: "$"

#form customization
custom-amounts: [10, 20, 50, 100, 250, 500, 1000] #an array of 7 values for the donation amount NO COMMAS IN THE NUMBERS
min-donation: 2
max-donation: 3000
country-selection: true #whether to show a country selection dropdown
require-country: true #country selection must be true for this to work, of course
optional-phone: false #phone is required by default, this overrides that
require-cvv: true #this setting/field will not affect quick donate
show-cvv-help: false #help tooltip: not ready for prime-time

employer-and-occupation: false #whether or not to show the employer and occupation fields


#additional text sections
recurring-section-title: Recurring Contribution <span>(Optional)</span>
recurring-intro: We need your help all year round. Become a recurring donor to make an automatic donation every month.
recurring-label: Please Make This A Recurring Contribution <span>(Optional)</span>

#in honor-of
in-honor-of-section: false
in-honor-of-section-title: Honor Someone with Your Contribution <span>(Optional)</span>
in-honor-of-section-intro: "If you would like to make your gift in honor or in memory of someone, please fill out the form below. To send a notification of your thoughtful gift, please enter the recipient's contact information."

#creditcards accepted
accept-visa: true
accept-mastercard: true
accept-amex: true
accept-discover: true
accept-maestro: false #shows up, but not tested with a live client gateway
accept-pay-pal: false  #not yet working

#additional power options
show-first-next-button: false #set to true if you don't want to intially hide the next button for the amount step
id-prefix: cd_ #id prefix used in order to reduce collision with other elements on a page 
include-styles-inline: true #if true, will include the css link blocks above the form
include-login-inline: true #if true, will include the login section above the form
include-jquery: true #include a jquery, in case your wrapper hasn't called one yet. false if your wrapper already has one in the head
include-plugin-code: true #if false, you'll need to write the plugin code into your page yourself
top-node-is-outer: true #attach key handlers to outer element on bsdcd-outer-container instead of to the body element. Currently HAS to be true, sorry
extra-classes-on-outer-container: #just a string of extra classes to add on the bsdcd-outer-container, just in case you need to for you convienience
class-on-in-honor: #in-honor-of section title and intro can get a separate class, useful for sites that use .base, leave blank for nothing extra
class-on-recurring: #reucrring title and intro can get a separate class, useful for sites that use .base
button-classes: #additional classes to attach to submit button-like things
seq_options: #JSON parsable string defining custom error messages for standard errors'"customErrors":{"overmax":"The maximum amount is $10,000 per transaction. For gifts over $10,000, please complete multiple transactions."}'
content-after-button-html: #arbitrary html after the buttons, potentially shown on all steps (though this can be controlled with css)


#very advanced: add a custom success function that's called when a user successfully donates instead of the standard redirect method. resobj is the objection containing information about the successful donation as outlined in the example success response in the BSD donate api docs
custom-success: # something like function(resobj){ window.succeed(resobj); }


##debug
no_minimum: false #allow nomin setting by default, bypassing the form minimum ?nomin=1 also works
debug: true #prints more console messages

---