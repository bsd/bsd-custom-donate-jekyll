/*global jQuery, quickDonate */
/*
 * blueContribute.js
 *
 * Author: Kyle Rush
 * kylerrush@gmail.com
 * kylerush.net
 *
 *
 */
var blueContribute = {};

(function($){

    "use strict";

    //function to serialize form data into an object since jQuery doesn't natively do this -- UGH
    $.fn.serializeObject = function(){

        var o = {};

        var a = this.serializeArray();

        $.each(a, function() {

            if (o[this.name] !== undefined) {

                if (!o[this.name].push) {

                    o[this.name] = [o[this.name]];

                }

                o[this.name].push(this.value || '');

            } else {

                o[this.name] = this.value || '';

            }

        });

        return o;
    };

    //creat the blueContribute jQuery plugin
    $.fn.extend({

        //pass the options variable to the function
        blueContribute: function(options) {

            var $form = $(this),
                $body = $('body'),
                locked = false,
                $sourceField = $form.find('[name="source_codes"]'),
                defaultsource = $sourceField.val(),
                $genError = $form.find('.bsdcd-general_error'),
                urlsource = gup('source')||gup('fb_ref'),
                urlsubsource = gup('subsource'),
                $slugField = $form.find("[name='slug']"),
                pagetitle = document.title,
                wait = false,
                msg = {
                    "unknown":"We were unable to process your transaction at this time.",
                    "invalid":"Your donation was not successful. Please correct the problems marked below.",
                    "declined":"The transaction was declined. Please check that the address information is correct or else use a different card.",
                    "review":"Your transaction is under review, there is no need to resubmit at this time."
                }, debug, defaultResponseHandler, defaults, defaultBeforePost, processingState, genError;

            //transfer sourcecodes.  How would we handle cookies/if this page was not the landing page?

            // if(urlsource || urlsubsource) {
            //     if ( urlsubsource ) { urlsource = (urlsource)?urlsource+','+urlsubsource:urlsubsource; }
            //     $sourceField.val( defaultsource  ? defaultsource + ',' + urlsource : urlsource );
            // }

            debug = function(message){
                if(blueContribute.settings.debug){
                    if(typeof console === 'object'){
                        window.console.log(message);
                    }
                }
            };

            /*optional function could include additional _synchronous_ validation checks, but in the base install isn't needed*/
            defaultBeforePost = function(){

                return true;

            };

            processingState = function(on){
                var i = 1,
                    states = ['Processing','.Processing.','..Processing..','...Processing...'],
                    ln = states.length;
                    wait = on; //cancels any outstanding timers
                if (on){
                    $body.addClass('blue_contribute_processing');
                    (function processing(){
                        $.wait(400).then(function(){
                            document.title = states[i % ln] + " | " +pagetitle;
                            if (wait){
                                i++;
                                processing();
                            }
                            else {
                                document.title = pagetitle;
                            }
                        });
                    }());
                }else {
                    $body.removeClass('blue_contribute_processing');
                }
            };

            genError = function(msg){
               $genError.text(msg).removeClass('hidden');
            };

            defaultResponseHandler = function(data){

                var amt_error_only = false, i, resobj;

                //remove all existing errors
                if(blueContribute.latestResponseObject){

                    debug('removing previous errors');
                    debug(blueContribute.latestResponseObject.field_errors);

                    if( $.isArray(blueContribute.latestResponseObject.field_errors) ){

                        if(blueContribute.latestResponseObject.field_errors.length > 0){

                            for(i = 0; i <= blueContribute.latestResponseObject.field_errors.length - 1; i++){

                                debug('reseting ' + blueContribute.latestResponseObject.field_errors[i].field);

                                //wipe the error messages for each field
                                $form.find('.' + blueContribute.latestResponseObject.field_errors[i].field + '_error').text('').addClass('hidden');

                                //remove the error class to the related fields
                                $form.find('.' + blueContribute.latestResponseObject.field_errors[i].field + '_related').removeClass('bsdcd-error');
                                $form.find('[name="' + blueContribute.latestResponseObject.field_errors[i].field + '"]')
                                            .removeClass('form-error');

                                //remove the general errors message
                                $genError.text('').addClass('hidden');

                                $body.removeClass('blue_contribute_error');

                            }

                        }

                    } else {

                        debug('no field errors on the latest repsonse object');

                    }

                } else {

                    debug('this is the first submission');

                }

                var responseIsValidJSON = false;

                if(data && !data.api_version){
                //try to parse the response body as json, if errors occur it is most likely because the json is invalid or because html was returned instead
                    try {

                        blueContribute.latestResponseObject = jQuery.parseJSON(data.responseText)||data;
                        responseIsValidJSON = true;

                    } catch(err) {

                        responseIsValidJSON = false;

                        debug('api response body invalid');
                    }
                }else{
                    blueContribute.latestResponseObject = data;
                    responseIsValidJSON = true;
                }
                resobj = blueContribute.latestResponseObject;

                if(responseIsValidJSON === true && resobj){
                    if(resobj.status && (resobj.status === "success" || resobj.status === "paypal"  ) ){
                        //if custom success is defined, fire it with the response object
                        if (typeof blueContribute.settings.customSuccess === 'function'){
                            processingState(false);
                            blueContribute.settings.customSuccess(resobj);
                        }
                        //if there's no debug parameter and if the site is secure, go to the redirect url
                        else if(!gup('debug') || !nonsecure) {
                            window.location = resobj.redirect_url;
                        }

                    } else {
                        //we have some sort of failure to communicate
                        debug('response was not a success status code');

                        if(resobj.code === 'noslug'  || resobj.code === 'invalidslug'){

                            genError(msg.unknown + ' [No slug]');

                        } else if(resobj.code === 'validation'){

                            debug('validation error');

                            report(
                                ['Donate API', 'Validation Errors', blueContribute.latestResponseObject.field_errors.length],
                                'donate_api_valiation_error'
                            );

                            if( resobj.field_errors && $.isArray(resobj.field_errors) && (resobj.field_errors.length > 0) ){

                                    debug(resobj.field_errors);

                                    if (resobj.field_errors.length===1 && resobj.field_errors[0].field==="amount_group"){
                                        amt_error_only = true;
                                    }

                                    for(i = 0; i <= resobj.field_errors.length - 1; i++){

                                        //inject the error messages for each field
                                        $form.find('.' + resobj.field_errors[i].field + '_error').text(resobj.field_errors[i].message).removeClass('hidden');

                                        //add the error class to the related fields
                                        $form.find('.' + resobj.field_errors[i].field + '_related')
                                            .addClass('bsdcd-error').removeClass('hidden');

                                        $form.find('[name="' + resobj.field_errors[i].field + '"]')
                                            .addClass('form-error');

                                    }

                                    //inject the general errors message
                                    genError(msg.invalid);

                            } else {

                                debug('invalid field_errors property in the donate api');
                                genError(msg.unknown +' [Invalid Validaiton Repsonse]');

                            }

                        } else if(resobj.code === 'gateway'){

                            debug('gateway rejected the transaction');

                            //checking for a declined card
                            if(resobj.gateway_response && resobj.gateway_response.status === "decline"){

                                genError(msg.declined);

                                debug('bank declined');

                                report(
                                    ['Donate API', 'Gateway Error', resobj.gateway_response.status],
                                    'donate_api_gateway_error'
                                );

                            } else if ( resobj.gateway_response && resobj.gateway_response.status==="review" ){
                                genError(msg.review +' [Gateway]');

                                debug('transaction under review');
                                report(
                                    ['Donate API', 'Gateway Error', 'review'],
                                    'donate_api_gateway_error'
                                );
                            }else {

                                //blueContribute.latestResponseObject.gateway_response.status === "unkown" ||
                                //blueContribute.latestResponseObject.gateway_response.status === "error"
                                //not sure why this would happen
                                genError(msg.unknown +' [Gateway]');

                                debug('unknown error gateway error');
                                report(
                                    ['Donate API', 'Unknown Gateway Error', 'unknown or malformed'],
                                    'donate_api_gateway_error'
                                );
                            }

                        }else {

                            genError(msg.unknown +' [Code: '+((resobj.code)?resobj.code:'unknown')+']');
                            debug('truly unknown error from donate api');
                            report(
                                ['Donate API', 'Unknown Error', (resobj.code)?resobj.code:'unknown'],
                                'donate_api_gateway_error'
                            );

                        }

                        //adjust the dom so that the user can see the errors
                        $body.addClass('blue_contribute_error');
                        processingState(false);
                        locked = false;

                        //alert others of the fail
                        //will currently blow away QD if the amount is wrong... that's wrong, I think
                        if ($.Topic) { $.Topic('bsd-validation-update').publish( false, amt_error_only ); }

                        window.scrollTo(0, 0);

                    } //end else for valid error response

                } else {
                    //invalid json
                    locked = false;
                    //adjust the dom so that the user can see the errors
                    $body.addClass('blue_contribute_error');  //toggle off the processing body class
                    processingState(false);
                    //alert others of the fail
                    if ($.Topic) { $.Topic('bsd-validation-update').publish( false, amt_error_only ); }
                    //to do: update dom with a general error message to indicate to the user that something is wrong
                    debug('donate api response not parsable');
                    genError(msg.unknown +' [API DOWN]');
                }

                //behavior that happens on success or fail
                if( typeof blueContribute.settings.afterPost === 'function' ){

                    blueContribute.settings.afterPost();

                }

            };

            //Set the default settings
            defaults = {

                debug: false,

                postTo: '/page/cde/Api/Charge/v1',

                beforePost: defaultBeforePost,

                responseHandler:  defaultResponseHandler,

                customSuccess: null,

                postdelay: 0, //artificially deplay the submission

                slug: ($form.data('slug')||'default'),

                recurSlug: ($form.data('recur-slug')||false)

            };

            //consolidate both user defined and default functions
            blueContribute.settings =  $.extend(true, defaults, options);

            //if a recurring slug exists, allow it to switch the submit slug, or else remove it for safety's sake
            if(blueContribute.settings.recurSlug){
                $form.on('click', "[name='recurring_acknowledge']", function(e){

                    if($slugField.val() === blueContribute.settings.slug){

                        $slugField.val(blueContribute.settings.recurSlug);

                    } else {

                        $slugField.val(blueContribute.settings.slug);

                    }
                });
            }else{
                $form.find("[name='recurring_acknowledge']").closest('li').remove();
            }

            blueContribute.submitForm = function(){

                debug('form submit attempt');

                var beforePostReturnValue = true;

                if(typeof blueContribute.settings.beforePost === 'function'){

                    beforePostReturnValue = blueContribute.settings.beforePost();

                }

                if(beforePostReturnValue && !locked){
                    locked = true;
                    processingState(true);
                    /*default wait is zero, but we can optionally increase it*/
                    $.wait(blueContribute.settings.postdelay).then(function(){

                        //send the donation api request
                        $.ajax({

                            url: blueContribute.settings.postTo,

                            type: nonsecure?'GET':'POST',

                            dataType: 'json',

                            converters: { "text json": jQuery.parseJSON },

                            timeout: 30000,

                            data: $form.serializeObject()

                        }).always(defaultResponseHandler);

                        if(nonsecure){ console.log('non-secure domain, transaction results simulated'); }

                    });

                }else {
                    debug('double submission detected');
                }

            };

            $form.submit(function(e){
                blueContribute.submitForm();
                e.preventDefault();
            });

            //initalization function
            if(typeof blueContribute.settings.afterInit === 'function'){
                blueContribute.settings.afterInit();
            }

            return this;//chainability
        }

    });

}(jQuery));