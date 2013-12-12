---

##Configuration options REVIEW AND CHANGE THESE PER DONATION FORM

internal-title: MOMA membership page
internal-comment: moma sequential 

client: MOMA

#Page Title, if used in your imported header
page-title: Membership

tools-slug: default #default exists on most clients, but remember: you'll need to configure the custom form to match the options of whatever tools form you use
tools-recurring-slug: #reccur  #leave blank for no recurring. This will need to be a _separate_ toolsform set to take recurring donations
default-source-codes: sequential-donate #source code baked into the page, to identify it for analytics purposes

##
layout: moma-membership #use form-only if you want jekyll to only print out the core markup
sequential: true
quick-donate: false

##top-section
header-section: true
title: Support MoMA
subtitle: Your generosity enables MoMA to enrich and inspire millions with the very best of modern and contemporary art. From children&rsquo;s educational programs to world-class exhibitions, you make MoMA a source of discovery for all.
html-above-header: '<header><h1><a href="http://www.moma.org/" target="_blank"><img src="https://donate.moma.org/page/-/donate/moma-minimal/MoMA_glow_logo_lgk3_500.png" alt="MoMA"></a></h1></header>'

##internationalization
default-country: US # set to either US or GB or leave blank for international. Controls starting state of state_cd labels/country dropdown
default-currency-symbol: "$"

#form customization
custom-amounts: [25000, 10000, 7500, 5000, 2500, 1000, 500] #an array of 7 values for the donation amount
min-donation: 5
max-donation: 500000
country-selection: true #whether to show a country selection dropdown
require-country: true #country selection must be true for this to work, of course
optional-phone: false #phone is required by default, this overrides that
require-cvv: false #this setting/field will not affect quick donate
show-cvv-help: false #help tooltip: not ready for prime-time

employer-and-occupation: false
signup_optin: true #checkbox that enables users to have to opt in to become part of the mailing list (not sure if api reads this???)

#additional text sections
recurring-section-title: Recurring Contribution <span>(Optional)</span>
recurring-intro: We need your help all year round. Become a recurring donor to make an automatic donation every month.
recurring-label: Please Make This A Recurring Contribution <span>(Optional)</span>

#in honor-of
in-honor-of-section: false
in-honor-of-section-title: Honor Someone with Your Contribution <span>(Optional)</span>
in-honor-of-section-intro: "If you would like to make your gift in honor or in memory of someone, please fill out the form below. To send a notification of your thoughtful gift, please enter the recipient's contact information."


#custom fields
custom-one: true
custom-one-label: Member ID (Optional)

custom-two: true
custom-two-label: In Honor Of (Optional)


extended-name-fields: true #boolean to add class for styling all extended name fields at once
name-prefix: true #boolean prefix dropdown?
name-middle: true #boolean middle name?
name-suffix: true #boolean suffix?

#creditcards accepted
accept-visa: true
accept-mastercard: true
accept-amex: true
accept-discover: true
accept-maestro: false #shows up, but not tested with a live client gateway
accept-pay-pal: false  #not yet working

#additional power options
show-first-next-button: true
id-prefix: cd_ #id prefix used in order to reduce collision with other elements on a page 
include-styles-inline: false #if true, will include the css link blocks above the form
include-login-inline: true #if true, will include the login section above the form
include-jquery: true #include a jquery, in case your wrapper hasn't called one yet. false if your wrapper already has one in the head
include-plugin-code: true #if false, you'll need to write the plugin code into your page yourself
top-node-is-outer: true #attach key handlers to outer element on bsdcd-outer-container instead of to the body element. Currently HAS to be true, sorry
extra-classes-on-outer-container: #just a string of extra classes to add on the bsdcd-outer-container, just in case you need to for you convienience


#wicked advanced
#custom-success: function(resobj){ window.succeed(resobj); }

##debug
no_minimum: false #allow nomin setting by default, bypassing the form minimum ?nomin=1 also works
debug: false #prints more console messages

---