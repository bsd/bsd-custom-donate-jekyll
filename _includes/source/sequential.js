/*global jQuery, blueContribute */
/*
*
* sequential.js
*
* Written by Kyle Rush (kylerrush@gmail.com)
*/

var sequential = {},
	_gaq = _gaq || [];



window.optimizely = window.optimizely || [];

(function($){

	"use strict";

	//creat the Quick Donate jQuery plugin
    $.fn.extend({
        
        //pass the options variable to the function
        sequential: function(options) {

            var $topNode = $(this),
                $form = $topNode.find('.bsdcd-form'),
                $breadcrumbs = $topNode.find('.sequential_breadcrumb');

			sequential.currentStep = 0;
			sequential.currency_symbol = $topNode.find('[data-currency-symbol]').data('data-currency-symbol')||"$";

            var countryVal = "US";

			/*make sequential QD aware*/
			sequential.qd = false;
			$.Topic('qd-status').subscribe(function(status){
				sequential.qd = status;
				console.log('qd',status);
			});

            /*if bsd reports errors, drop sequential styling*/
            $.Topic('bsd-validation-update').subscribe(function(ok){
                if(!ok) { $topNode.removeClass('sequential'); }
            });

			sequential.utilityFunctions = {};

			sequential.utilityFunctions.goToStep = function(step){

                console.log(step);

				var isPreviousStep, changeStep, $newStep;

				isPreviousStep = step < sequential.currentStep;

				changeStep = function(leaveerror){

					console.log('step',step);

					$topNode.removeClass('sequential_step_' + sequential.currentStep);

					sequential.settings.stepContainers.eq(sequential.currentStep).addClass('inactive').removeClass('active');

					$('li.sequential_breadcrumb_' + sequential.currentStep).removeClass('active').addClass('completed');

					sequential.currentStep = step;

                    console.log('change');

                    $newStep = $breadcrumbs.eq(step);

                    $newStep.prevAll().removeClass('step-error');

					$topNode.addClass('sequential_step_' + sequential.currentStep);

					$topNode.find('.sequential_error_message').text('');

                    sequential.settings.stepContainers.eq(step).find('[required]').filter(function(){
                        if($(this).val() === ""){
                            return true;
                        }
                    }).first().focus();

					sequential.settings.stepContainers.eq(sequential.currentStep).addClass('active').removeClass('inactive');

					$('li.sequential_breadcrumb_' + sequential.currentStep).addClass('active');

					_gaq.push(['_trackEvent', 'Sequential donate', 'Screen view', step]);

					window.optimizely.push(['trackEvent', 'sequential_screen_' + step]);

					if(step===1 && sequential.qd){
						sequential.utilityFunctions.goToStep(2);
					}

				};

				if( typeof step === 'number' ){

					if( typeof sequential.settings.validationFunctions[sequential.currentStep] === 'function'){

						if( isPreviousStep ){

							changeStep();

						} else if( sequential.currentStep !== step ) {

                            //this still allows us to skip from step 1 to step 3, past an invalid step 2....
							if( sequential.settings.validationFunctions[sequential.currentStep]() ){

                                if( sequential.currentStep === (sequential.settings.stepContainers.length - 1) ){

                                    //last step so submit the form
                                    blueContribute.submitForm();
                                    $topNode.find('#sequential_donate_btn_copy').text('Processing...');
                                }
                                else if ( (step - sequential.currentStep) > 1){
                                    sequential.utilityFunctions.goToStep(sequential.currentStep+1);
                                    sequential.utilityFunctions.goToStep(step);
                                }
                                else{
                                    changeStep();
                                }
							} else {
								console.log('step fail',sequential.currentStep);
                                $('li.sequential_breadcrumb_' + sequential.currentStep).addClass('step-error');
							}

						}

					} else {

						//not an actual function

					}

				}

			};

			$.Topic('change-step').subscribe(sequential.utilityFunctions.goToStep); //allow other modules to change steps 

			sequential.utilityFunctions.validateAmounts = function (){

				var amountRadioGroupNumber, otherAmountNumber, amountIsSelected, amountIsUnderMaximum, amountIsOverMinimum, amount;

				$topNode.removeClass('sequential_error');

				$('.sequential_error_message').text('');

				amountRadioGroupNumber = parseFloat( $("input[name='amount']:checked").val() );

				otherAmountNumber = parseFloat( $('[name="amount_other"]').val().replace(/\,/g, '') );

				amountIsSelected = function(){

					if( otherAmountNumber ){

						//other amount field has a valid number in it

						//console.log('other amount has a valid number in it');

						amount = otherAmountNumber;

						return true;

					} else {

						//other amount is not a valid number

						if( amountRadioGroupNumber ){

							//console.log('a valid preset radio is selected');

							amount = amountRadioGroupNumber;

							return true;

						} else {

							//no amount is selected

							//console.log('no amount selected');

							return false;

						}

					}

				};

				amountIsUnderMaximum = function(amount){

					if(typeof sequential.settings.donationAmountLimit === 'number'){

						console.log('donation amount minimum is set');

						if(typeof amount === 'number'){

							if( amount <= sequential.settings.donationAmountLimit ){

								//user selected amount is under maximum
								return true;

							} else {

								//user selected amount is not under maximum

								_gaq.push(['_trackEvent', 'Sequential donate', 'Amount error', 'Above maximum']);

								window.optimizely.push(['trackEvent', 'sequential_amount_over_maximum_error']);

								return false;

							}

						} else {

							//argument is not a number, so just let it go through and catch the problem on the server side
							return true;

						}

					} else {

						//no amount maximum is set o return true
						return true;

					}

				};

				amountIsOverMinimum = function(amount){

					if(typeof sequential.settings.donationAmountMinimum === 'number'){

						if(typeof amount === 'number'){

							if( amount >= sequential.settings.donationAmountMinimum || nomin){

								//user selected amount is over minimum
								return true;

							} else {

								//user selected amount is not over minimum
                                _gaq.push(['_trackEvent', 'Sequential donate', 'Amount error', 'Below minimum']);
                                window.optimizely.push(['trackEvent', 'sequential_amount_under_minimum_error']);

                                return false;
							}

						} else {

							//no minimum is specified
							return true;

						}

					} else {

						//no amount minimum is set so return true
						return true;

					}

				};

				if( amountIsSelected() ){

					//console.log('amount is selected');

					if( amountIsUnderMaximum(amount) ){

						//console.log('selected amount is under maximum');

						if( amountIsOverMinimum(amount) ){

							//amount is over minimum

							//console.log('selected amount is over minimum');

							$topNode.find('#sequential_donate_btn_copy').text('Donate ' + sequential.currency_symbol + amount);

							return true;

						} else {

							//amount is under minimum

							//console.log('selected amount is NOT over minimum');

							$topNode.addClass('sequential_error');

							$('.sequential_error_message').text('The minimum amount is ' + sequential.currency_symbol + sequential.settings.donationAmountMinimum + '.');

							return false;

						}

					} else {

						//amount is over maximum

						//console.log('selected amount is NOT under maximum');

						$topNode.addClass('sequential_error');

						$('.sequential_error_message').text('The maximum amount is ' + sequential.currency_symbol + sequential.settings.donationAmountLimit + '.');

						return false;

					}

				} else {

					//no amount is selected

					//console.log('no amount is selected');

					$topNode.addClass('sequential_error');

					$('.sequential_error_message').text('Please select an amount.');

					return false;

				}

			};

			sequential.utilityFunctions.validatePersonalInfo = function(){

				var numberOfInvalidFields, firstName, lastName, address, city, state, zip, email, phone, country, employer, occupation;

				numberOfInvalidFields = 0;

				$topNode.removeClass('sequential_error');

				$('.sequential_error_message').text('');

				firstName = $("[name='firstname']");

				if( !firstName.val() ){

					numberOfInvalidFields++;

					firstName.addClass('bsdcd-error');

				} else {

					firstName.removeClass('bsdcd-error');

				}

				lastName = $("[name='lastname']");

				if( !lastName.val() ){

					numberOfInvalidFields++;

					lastName.addClass('bsdcd-error');

				} else {

					lastName.removeClass('bsdcd-error');

				}

				address = $("[name='addr1']");

				if( !address.val() ){

					numberOfInvalidFields++;

					address.addClass('bsdcd-error');

				} else {

					address.removeClass('bsdcd-error');

				}

				city = $("[name='city']");

				if( !city.val() ){

					numberOfInvalidFields++;

					city.addClass('bsdcd-error');

				} else {

					city.removeClass('bsdcd-error');

				}

				state = $("[name='state_cd']");

				if( (state.is('select') && state.val().length !== 2 ) || !state.val() ){

					numberOfInvalidFields++;

					state.addClass('bsdcd-error');

					//console.log('state first');

				} else {

					state.removeClass('bsdcd-error');

					//console.log('state second');

				}

				//needs to not use US validation when it's not the US
				zip = $topNode.find("[name='zip']").val();

                console.log('zip',zip);
				if( countryVal ==="US" ){
					zip.replace(/\D/g, '');
				}

				if( countryVal === "US" && zip.length >= 5 && zip.length <= 9 ){
					$topNode.find("[name='zip']").removeClass('bsdcd-error');
				} else if ( countryVal ==="GB" && zip.length >= 3 && zip.length <= 10 ){
					$topNode.find("[name='zip']").removeClass('bsdcd-error');
				}else if ( countryVal !== "US" && countryVal !== "GB" && !!zip ){
					$topNode.find("[name='zip']").removeClass('bsdcd-error');
				}else {

					numberOfInvalidFields++;

					$topNode.find("[name='zip']").addClass('bsdcd-error');

				}

				country = $topNode.find('[name="country"]');

				if(sequential.settings.requireCountry){

					if( !country.val() ){

						numberOfInvalidFields++;

						country.addClass('bsdcd-error');

					}
                    else {
                        country.removeClass('bsdcd-error');
                    }

				}

				email = {};

				email.input = $topNode.find("[name='email']");

				email.address = email.input.val();

				email.isValid = function(){

					var emailRegEx = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

					if( emailRegEx.test(email.address) ){

						return true;

					} else {

						return false;

					}

				};

				if( email.isValid() ){

					email.input.removeClass('bsdcd-error');

				} else {

					numberOfInvalidFields++;

					email.input.addClass('bsdcd-error');

				}

				phone = {};

				phone.input = $topNode.find("[name='phone']");

				phone.number = phone.input.val();

				phone.isValid = function(){

					var rawPhoneNumber = phone.number.replace(/\D/g, '');

					if(rawPhoneNumber.length >= 10 && rawPhoneNumber.length <= 11){

						return true;

					} else {

						return false;

					}

				};

				if( (sequential.settings.optionalphone && !phone.number) || phone.isValid() ){

					phone.input.removeClass('bsdcd-error');

				} else {

					numberOfInvalidFields++;

					phone.input.addClass('bsdcd-error');

				}

                employer = $topNode.find("[name='employer']");

                if( employer.length && !employer.val() ){

                    numberOfInvalidFields++;

                    employer.addClass('bsdcd-error');

                } else {

                    employer.removeClass('bsdcd-error');

                }

                occupation = $topNode.find("[name='occupation']");

                if( occupation.length && !occupation.val() ){

                    numberOfInvalidFields++;

                    occupation.addClass('bsdcd-error');

                } else {

                    occupation.removeClass('bsdcd-error');

                }

				if(numberOfInvalidFields > 0){

					$topNode.addClass('sequential_error');

					$topNode.find('.sequential_error_message').text('Please correct the problems shown above.');

					return false;

				} else {

					return true;

				}

			};

			sequential.utilityFunctions.validatePaymentInfo = function (){

				var creditCard, expirationDate, invalidFields, cvv;

				invalidFields = 0;

				creditCard = {};

				creditCard.field = $("[name='cc_number']");

				creditCard.number = creditCard.field.val();

				creditCard.isValid = function(){

					var creditCardRegex = /[0-9]{13,19}|([0-9- ]{3,8}){3,6}/;

					if(creditCardRegex.test(creditCard.number) || (sequential.qd && creditCard.number.indexOf('XXX')>-1 ) ){

						return true;

					} else {

						return false;

					}

				};

				if( creditCard.isValid() ){

					creditCard.field.removeClass('bsdcd-error');

				} else {

					invalidFields++;

					creditCard.field.addClass('bsdcd-error');

				}

				expirationDate = {};

				expirationDate.month = {};

				expirationDate.month.field = $("[name='cc_expir_month']");

				expirationDate.month.val = expirationDate.month.field.val();

				expirationDate.month.regEx = /^(01|02|03|04|05|06|07|08|09|10|11|12)$/;

				expirationDate.month.isValid = function(){

					if( expirationDate.month.regEx.test(expirationDate.month.val) ){

						return true;

					} else {

						return false;
					}

				};

				if( expirationDate.month.isValid() ){

					expirationDate.month.field.removeClass('bsdcd-error');

				} else {

					invalidFields++;

					expirationDate.month.field.addClass('bsdcd-error');

				}

				expirationDate.year = {};

				expirationDate.year.field = $("[name='cc_expir_year']");

				expirationDate.year.val = parseInt( expirationDate.year.field.val(), 10 );

				expirationDate.year.isValid = function(){

					if( isNaN(expirationDate.year.val) ) {

						return false;

					} else {

						if( expirationDate.year.val >= 2013 ){

							return true;

						} else {

							return false;

						}

					}

				};

				if( expirationDate.year.isValid() ){

					expirationDate.year.field.removeClass('bsdcd-error');

				} else {

					expirationDate.year.field.addClass('bsdcd-error');

					invalidFields++;

				}

                cvv = $topNode.find('[name="cc_cvv"]');

                if(sequential.settings.requireCVV){

                    if( sequential.qd || /^[0-9]{3,4}$/.test( cvv.val() ) ){

                        cvv.removeClass('bsdcd-error');

                    }else {
                        invalidFields++;
                        cvv.addClass('bsdcd-error');

                    }

                }


				if( invalidFields > 0 ){

                    console.log(invalidFields);

					$('.sequential_error_message').text('Please correct the problems marked above.');

					$('body').addClass('sequential_error');

					return false;

				} else {

					$topNode.removeClass('sequential_error');

					$('.sequential_error_message').text('');

					return true;

				}

			};

			var defaults = {

				stepContainers: $('.sequential_step'),

				donationAmountLimit: $form.data('max-donation')||null,

				donationAmountMinimum: $form.data('min-donation')||null,

                requireCountry: $form.data('require-country')||false,

                optionalphone: $form.data('optional-phone')||false,

                requireCVV: $form.data('require-cvv')||false,

				validationFunctions: [sequential.utilityFunctions.validateAmounts, sequential.utilityFunctions.validatePersonalInfo, sequential.utilityFunctions.validatePaymentInfo]

			};

			//consolidate both user defined and default settings
			sequential.settings = $.extend(true, defaults, options);

			//add sequential body class
			$topNode.addClass('sequential').addClass('sequential_step_' + sequential.currentStep);

			if( sequential.settings.requireCountry ){

				$topNode.addClass('sequential_country_field');

			}

			//show the first step
			$(sequential.settings.stepContainers[0]).addClass('active');
			$('li.sequential_breadcrumb_0').addClass('active');

			//hide the others
			$(sequential.settings.stepContainers).not( $(sequential.settings.stepContainers[sequential.currentStep]) ).addClass('inactive');

            //enable next buttons
			$topNode.on('click','.sequential_move_forward',function(e){
                e.preventDefault();
                sequential.utilityFunctions.goToStep(sequential.currentStep + 1);
            });

			$('.bsdcd-seq-breadcrumbs').on('click', 'a', function(e){

				var clickedBreadcrumb = $(this).closest('li');

				e.preventDefault();

				if( clickedBreadcrumb.hasClass('sequential_breadcrumb_amount') ){

					sequential.utilityFunctions.goToStep(0);

				} else if( clickedBreadcrumb.hasClass('sequential_breadcrumb_name') ){

					sequential.utilityFunctions.goToStep(1);

				} else if( clickedBreadcrumb.hasClass('sequential_breadcrumb_payment') ){

					sequential.utilityFunctions.goToStep(2);

				}

			});

        }

    });

})(jQuery);

window.sequential = sequential;