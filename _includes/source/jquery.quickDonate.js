/*global jQuery */
/*
 * quickDonate.js 
 *
 * Author: Kyle Rush
 * kylerrush@gmail.com
 * kylerush.net
 *
 *
 */
var quickDonate = quickDonate || {};

(function($){

    "use strict";

    //creat the Quick Donate jQuery plugin
    $.fn.extend({
        
        //pass the options variable to the function
        quickDonate: function(options) {

            var $topNode = $(this),
                $bothNodes = $topNode.add($('body')), //because we want qd to inform both login sections outside the form and the form itself, we need to apply classes both places
                $form = $topNode.find('.bsdcd-form ').eq(0),
                firstTry = true,
                loggedin = false,
                spudfields = ['firstname', 'lastname', 'email', 'zip', 'phone', 'country','addr1', 'addr2', 'city', 'state_cd', 'occupation', 'employer'],
                qdfields = ['cc_number','cc_expir_month','cc_expir_year'],
                defaults, ccName, ccNumberFormatted, defaultResponseHandler, clearQDInfo, prefill, qdFail;

            quickDonate.settings = quickDonate.settings || {};


            prefill = function(obj){
                obj = (typeof obj === "object")? obj : {};
                $.each(spudfields,function(i,v){

                    var $f = $form.find('[name="'+v+'"]'),
                        //insert = decodeURIComponent(gup(v)).replace(/\+/g,' ') || obj[v]|| null; //prefill from url maybe not wanted on contrib pages?
                        insert = obj[v]|| null;

                    if (insert) {
                        $f.val(insert).removeClass('placeholder').addClass('prefilled');
                    }
                });
            };

            qdFail = function(){
                //need to get the logged in state because asking people who are already logged in to log in is pointless
                $bothNodes.removeClass('qd_loading').addClass(  ((loggedin)?' qd_not_enabled':' qd_load_failed')  ); //if user is logged in but
                $.Topic('qd-status').publish( false );
                if (firstTry){
                    getSpud().always(function(d){ prefill(d); });
                }
            };

            defaultResponseHandler = function(responseObject, t){

                if(responseObject.status === 200 && t){

                    //strictly check all the data types so that there are no js errors if the response is screwed up
                    if(
                        typeof t.enabled === 'boolean' &&
                        typeof t.token === 'string' &&
                        typeof t.token_info === 'object' &&
                        typeof t.token_info.account_last_four === 'string' &&
                        typeof t.token_info.cc_type_cd === 'string' &&
                        typeof t.token_info.cc_expir_month === 'string' &&
                        typeof t.token_info.cc_expir_year === 'string' &&
                        typeof t.token_info.firstname === 'string' &&
                        typeof t.token_info.lastname === 'string' &&
                        typeof t.token_info.addr1 === 'string' &&
                        /* we need to make sure addr2 is always a string, even blank if there is no value */
                        typeof t.token_info.addr2 === 'string' &&
                        typeof t.token_info.city === 'string' &&
                        typeof t.token_info.state_cd === 'string' &&
                        typeof t.token_info.zip === 'string' &&
                        typeof t.token_info.country === 'string' &&
                        typeof t.token_info.email === 'string' &&
                        typeof t.token_info.phone === 'string' &&
                        typeof t.token_info.employer === 'string' &&
                        typeof t.token_info.occupation === 'string'

                    ){

                        if(quickDonate.settings.debug === true){

                            console.log('properties in response object are all the correct type');

                        }

                        if(t.enabled){

                            //put all the field values in
                            $form.find("[name='quick_donate_populated']").val(t.token);

                            if(t.token_info.cc_type_cd === 'ax'){

                                $("[name='cc_number']").val('XXXXXXXXXXX' + t.token_info.account_last_four);

                            } else {

                                $("[name='cc_number']").val('XXXXXXXXXXXX' + t.token_info.account_last_four);

                            }
                            $form.find("[value='" + t.token_info.cc_type_cd + "']").prop('checked', true);

                            /* the donate api should always return a two digit number, even if the mont is something like "5" */
                            if(t.token_info.cc_expir_month.length === 1){
                                $form.find("[name='cc_expir_month']").val('0' + t.token_info.cc_expir_month);
                            } else {
                                $form.find("[name='cc_expir_month']").val(t.token_info.cc_expir_month);
                            }
                            /*possible maestro support*/
                            if(t.token_info.cc_start_month && t.token_info.cc_start_month.length === 1){
                                $form.find("[name='cc_start_month']").val('0' + t.token_info.cc_start_month);
                            } else {
                                $form.find("[name='cc_start_month']").val(t.token_info.cc_start_month);
                            }
                            if(t.token_info.cc_start_month){
                                $form.find("[name='cc_start_year']").val(t.token_info.cc_start_year);
                            }

                            $form.find("[name='cc_expir_year']").val(t.token_info.cc_expir_year);
                            $form.find("[name='firstname']").val(t.token_info.firstname);
                            $form.find("[name='lastname']").val(t.token_info.lastname);
                            $form.find("[name='addr1']").val(t.token_info.addr1);
                            $form.find("[name='addr2']").val(t.token_info.addr2);
                            $form.find("[name='city']").val(t.token_info.city);
                            $form.find("[name='zip']").val(t.token_info.zip);
                            $form.find("[name='country']").val(t.token_info.country).change(); //have to make sure the state field is the right format
                            $form.find("[name='email']").val(t.token_info.email);
                            $form.find("[name='phone']").val(t.token_info.phone);
                            $form.find("[name='employer']").val(t.token_info.employer);
                            $form.find("[name=occupation]").val(t.token_info.occupation);
                            $form.find("[name='state_cd']").val(t.token_info.state_cd);
                            $form.find("[name='quick_donate_populated']").val(t.token);

                            //put the qd info text into the dom elements
                            $(quickDonate.settings.nameElement).text(t.token_info.firstname + ' ' + t.token_info.lastname);
                            $(quickDonate.settings.addrElement).text(t.token_info.addr1 + ' ' + t.token_info.addr2);
                            $(quickDonate.settings.locElement).text(t.token_info.city + ' ' + t.token_info.state_cd + ' ' + t.token_info.zip + ' ' + t.token_info.country);

                              //detach cvv
                            quickDonate.cvvHolder = $form.removeClass('cvv-input').find('#cc_cvv_cont').detach();

                            /*need to verify that all of these values are correct */
                            if(t.token_info.cc_type_cd === 'vs'){

                                ccName = 'Visa';

                            } else if(t.token_info.cc_type_cd === 'mc'){

                                ccName = 'MasterCard';

                            } else if(t.token_info.cc_type_cd === 'ax'){

                                ccName = 'American Express';

                            } else if(t.token_info.cc_type_cd === 'dc'){

                                ccName = 'DiscoverCard';

                            }
                            $(quickDonate.settings.ccTypeElement).text(ccName);

                            //format the card number
                            if(t.token_info.cc_type_cd === 'ax'){

                                ccNumberFormatted = '**** ****** *' + t.token_info.account_last_four;

                            } else {

                                ccNumberFormatted = '**** **** **** ' + t.token_info.account_last_four;

                            }
                            $(quickDonate.settings.ccNumberElement).text(ccNumberFormatted);
                            //add the qd enabled body class for css
                            $bothNodes.addClass('qd_populated').removeClass('qd_loading qd_load_failed');
                            if(window.location.hash.indexOf('noquickd')>-1){
                                window.location.hash = '';
                            }

                            report(
                                ['Quick Donate', 'populated', true],
                                'quick_donate_populated'
                            );

                            $.Topic('data-update').publish( 'qd_populated' );
                            $.Topic('qd-status').publish( true );
                            //if sequential we can skip to the last step if the user has already completed amounts.  We may want to move this check into sequential.js somehow
                            $.Topic('change-step').publish(
                                ( $('.sequential_breadcrumb_amount').hasClass('completed') )? 2 : 0
                            );

                        } else {

                            qdFail();

                        }

                    } else {

                        if(quickDonate.settings.debug === true){

                            console.log('properties in response object are not the correct type');

                        }

                        //something was wrong with the response object
                        qdFail();
                        //if user doesn't have quick donate yet, don't prompt them to login. But no way to tell when logged out...
                    }

                } else {

                    //something was wrong with the response object
                    if(quickDonate.settings.debug === true){
                        console.log('something was wrong with the response object',responseObject, quickDonate.tokenRequest);
                    }
                    qdFail();

                }

                //run the callback object
                if(typeof quickDonate.settings.callback === 'function'){
                        quickDonate.settings.callback();
                }
                firstTry = false;
            };

            clearQDInfo = function(e, method, noreport){

                if(typeof e === 'object'){ e.preventDefault(); }

                if(!noreport){
                    report(
                        ['Quick Donate', 'cleared', method],
                        'quick_donate_cleared_'+method
                    );
                }

                $.Topic('qd-status').publish( false );

                if(method === 'nuclear'){
                    
                    
                    $('#sequential_next_cont').hide(); //prevent any submission (soft) while we wait for changes

                    $.each( spudfields.concat(qdfields, ['quick_donate_populated'] ), function(i,v){
                        $form.find('[name="'+v+'"]').val('');
                    });

                    $bothNodes.removeClass('qd_populated');
                    if (quickDonate.cvvHolder && quickDonate.cvvHolder.length) {
                        $form.addClass('cvv-input').find('#cc_expiration_cont').after(quickDonate.cvvHolder);
                    }
                    $.Topic('change-step').publish(1, true);

                    $.Topic('data-update').publish( 'qd_cleared' );
                    $('.sequential_breadcrumb_name, .sequential_breadcrumb_payment').removeClass('completed'); //back up any completion measures

                    $('#sequential_next_cont').show();

                    $.ajax({
                        "dataType": "jsonp",
                        "jsonp":"jsonp",
                        "url": "/page/user/logout",
                        "timeout": 8000
                    }).done(function(data){
                         $bothNodes.addClass('qd_load_failed'); //when logout is complete, put login link back
                    }).fail(function(){
                        if (nonsecure){
                            //if we're in test mode, fake a logout. all the above code should allow a user to donate fresh even if the logout failed
                            window.location.hash = 'noquickd';
                            window.location.reload();
                        }
                    });
                }
                else {
                    $bothNodes.removeClass('qd_populated').addClass('qd_cleared');
                    if (quickDonate.cvvHolder && quickDonate.cvvHolder.length) {
                        $form.addClass('cvv-input').find('#cc_expiration_cont').after(quickDonate.cvvHolder);
                    }
                    $.Topic('change-step').publish(1, true); //go to now unhidden name step, but do it silently
                    $.Topic('data-update').publish( 'qd_cleared' );
                    $('.sequential_breadcrumb_2').removeClass('completed'); //back up completion measure
                }
                $bothNodes.removeClass('qd_populated');
                $form.find("[name='quick_donate_populated']").val('');
            };

            //set the default settings
            defaults = {

                tokenRequestPath: '/ctl/Contribution/Quick/GetToken',

                nuclearElement: '#qd_nuclear',

                differentInfoElement: '#qd_clear_info',

                nameElement: '#qd_name',
                addrElement: '#qd_address',
                locElement: '#qd_location',

                ccTypeElement: '#qd_cc_type',

                ccNumberElement: '#qd_cc_number',

                clearInfo: clearQDInfo,

                responseHandler: defaultResponseHandler

            };
            
            //consolidate both user defined and default functions
            quickDonate.settings =  $.extend(true, defaults, options);

            function requestToken(){
                $bothNodes.addClass('qd_loading');

                var tr = $.ajax({

                    url: (hash.indexOf('noquickd')>-1 && firstTry)?'/':quickDonate.settings.tokenRequestPath,

                    converters: { "text json": jQuery.parseJSON },

                    type: 'GET',

                    dataType: 'json'

                });
                return tr;
            }
            
            function tryToken(){
                var obj = requestToken();
                obj.always(function(d) {
                    quickDonate.tokenRequest = d;
                    quickDonate.settings.responseHandler(obj, d);
                });
            }


            tryToken();

            quickDonate.tryToken = tryToken;

            //if qd fails, we can get the spud for the domain in question
            function resFilter(prom){
                return prom.pipe(function(d){
                    return (!d.error)?d:$.Deferred().reject(d);
                },function(d){
                    return $.Deferred().reject(d);
              });
            }
            function getSpud(){
                return resFilter($.ajax({url:'/page/spud?type=getm&field=email,firstname,lastname,addr1,city,state_cd,zip,phone&jsonp=?',dataType:'jsonp'}));
            }
            function getGraph(){
              return resFilter($.ajax({url:'https://my.democrats.org/page/graph/me?callback=?&jsoncallback=?',dataType:'jsonp'}));
            }

            $(quickDonate.settings.nuclearElement).click(function(e){

                quickDonate.settings.clearInfo(e, 'nuclear');

            });

            $(quickDonate.settings.differentInfoElement).click(function(e){

                quickDonate.settings.clearInfo(e, 'reveal');

            });

            $( '.qd-log-in-link' ).click(function(e){
                e.preventDefault();

                window.open(
                    '/ctl/Contribution/Quick/Login',
                    'quickDonateLogin',
                    'status=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=0,width=550,height=350'
                );
            });

            /*not currently exposed/used*/
            $( '.qd-log-out-link' ).click(function(e){
                e.preventDefault();
                quickDonate.settings.clearInfo(e, 'nuclear');
            });

            //clear quick donate if the blue validation had any other errors than just the amount
            $.Topic('bsd-validation-update').subscribe(function(ok, amt_error_only){
                if (!ok && !amt_error_only){
                    quickDonate.settings.clearInfo(0, 'reveal', true); //clear qd because user had errors, but don't report since it's assumed and not user initiated
                }
            });

            /*fake the existence of bQuery and or add a silly method to catch login attempts*/
            window.bQuery = window.bQuery || jQuery;
            window.bQuery.bsd = window.bQuery.bsd || {};
            window.bQuery.bsd.quickDonate = function(){
                loggedin = true;
                quickDonate.tryToken();
            };

        }
            
    });

})(jQuery);
                    