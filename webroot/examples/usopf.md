---

##Configuration options REVIEW AND CHANGE THESE PER DONATION FORM

internal-title: Simple #Internal title of page for internal reference
internal-comment: This is an example of a simple floating-box-style sequential form #internal comment

client: "Demo Client"

## Meta Information
page-title: Give #Public Page Title, if it is used in your imported header
page-description: Please Donate Today

## Destination Donate Page
tools-slug: default #default exists on most clients, but remember: you'll need to configure this custom form to match the options of whatever tools form you use or vice-versa
tools-recurring-slug: reccur #leave blank for no recurring. This will need to be the url slug of a second, _separate_ tools form that is set to take only recurring donations, but is otherwise configured the same way as the original form
default-source-codes: custom-donate #a comma separated list of source codes that will baked into the page by default, to identify it for analytics purposes

##########
# Core Page Layout/Style Options
#############################
layout: default #The wrapper. "default" is the default included wrapper
form: default-form.html #The form layout engine. The standard included option is default-form.html but you can create your own as long as they are placed in _includes/
style: default #default/form-only/or the slug of your custom style/layout

##########
# Core Feature Options
#############################
sequential: false
quick-donate: false
detect-cc-type: false


##internationalization
default-country: US # set to either US or GB or leave blank to default to international. This controls the default labels/toggling the US state dropdown
currency-symbol: "$" # Use "&pound;&thinsp;" for pounds
country-selection: true #whether to show a country selection dropdown at all
require-country: true #country selection must be true for this to work, of course

#form customization
custom-amounts: [10, 20, 50, 100, 250, 500, 1000] #an array of 7 values for the donation amount DO NOT INCLUDE COMMAS IN THE NUMBERS
min-donation: 2 #minimum donation amount allowed. Ensure that this matches the tools form
max-donation: 30000 #maximum donation amount allowed. Ensure that this matches the tools form
optional-phone: false #phone is required by default unless this is set to true, which would make the phone field optional
employer-and-occupation: true #whether or not to show the employer and occupation fields

require-cvv: true #Show the CVV field for credit card information. This setting will not affect quick donate, which does not use CVV
show-cvv-help: false #show a cvv help tooltip: not ready for prime-time

##########
# Additional Text Sections
#############################
# Recurring Donations
recurring-section-title: Recurring Contribution <span>(Optional)</span>
recurring-intro: We need your help all year round. Become a recurring donor to make an automatic donation every month.
recurring-label: Please Make This A Recurring Contribution <span>(Optional)</span>

#in honor-of
in-honor-of-section: true
in-honor-of-section-title: Honor Someone with Your Contribution <span>(Optional)</span>
in-honor-of-section-intro: "If you would like to make your gift in honor or in memory of someone, please fill out the form below. To send a notification of your thoughtful gift, please enter the recipient's contact information."

#creditcards accepted
accept-visa: true
accept-mastercard: false
accept-amex: false
accept-discover: false
accept-maestro: false #shows up, but not tested with a live client gateway
accept-pay-pal: false  #not yet implemented or tested

##########
# Default Layout Options
#############################

##top-section
header-section: true #include an intro section
title: Donate Today
subtitle: Help where it matters most
above-header-html: #override the entire top section and use your own arbitrary html

##footer section
footer-section: false #include a simple footer section directly after the main form
privacy-policy-link: /page/terms-of-service #
terms-of-service-link: /page/privacy-policy #
copyright-start-year: 2007

##########
# Debug Options
#############################
no_minimum: false #allow nomin setting by default, bypassing the form's minimum. Adding the ?nomin=1 parameter would also work
debug: true #prints more console messages


##########
# Power Options
#############################

cc-detect: false #automatically pick credit card based on number, and show cc images using the CC-detect plugin
show-first-next-button: false #set to true if you don't want to intially hide the next button for the amount step
id-prefix: cd_ #id prefix used in order to reduce collision with other elements on a page
include-styles-inline: false #if true, will include the css link blocks above the form
include-login-inline: false #if true, will include the login section above the form
include-jquery: true #include a jquery, in case your wrapper hasn't called one yet. false if your wrapper already has one in the head
include-plugin-code: true #if false, you'll need to write the plugin code into your page yourself
extra-classes-on-outer-container: #just a string of extra classes to add on the bsdcd-outer-container, just in case you need to for you convienience
class-on-in-honor: #in-honor-of section title and intro can get a separate class, useful for sites that use .base, leave blank for nothing extra
class-on-recurring: #reucrring title and intro can get a separate class, useful for sites that use .base
button-classes: #additional classes to attach to submit button-like elements
outer-container-selector: #defaults to .bsdcd-outer-container, but override it here
seq_options: #JSON parsable string defining custom sequential step error messages for a few key standard errors'"customErrors":{"overmax":"The maximum amount is $10,000 per transaction. For gifts over $10,000, please complete multiple transactions."}'
content-after-button-html: #arbitrary html included after the buttons, potentially shown on all steps (though this can be controlled with css)

##########
# Advanced Power Options
#############################
#add a custom success function that's called when a user successfully donates instead of the standard redirect method. resobj is the objection containing information about the successful donation as outlined in the example success response in the BSD donate api docs
custom-success: # something like function(resobj){ window.succeed(resobj); }


---