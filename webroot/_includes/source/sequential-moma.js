/*global jQuery, blueContribute */
/*
*
* sequential.js
*
* Written by Kyle Rush (kylerrush@gmail.com)
*/

var sequential = {};

(function($){

	"use strict";

	//creat the Quick Donate jQuery plugin
    $.fn.extend({
        
        //pass the options variable to the function
        sequential: function(options) {

            var $topNode = $(this),
                $form = $topNode.find('.bsdcd-form'),
                $otheramt = $form.find('[name="amount_other"]'),
                $breadcrumbs = $topNode.find('.sequential_breadcrumb');

			sequential.currentStep = 0;
			sequential.currency_symbol = $topNode.find('[data-currency-symbol]').data('currency-symbol')||"$";

            var countryVal = "US";

			/*make sequential QD aware*/
			sequential.qd = false;
			$.Topic('qd-status').subscribe(function(status){
				sequential.qd = status;
			});

            /*if bsd reports errors, drop sequential styling*/
            $.Topic('bsd-validation-update').subscribe(function(ok){
                if(!ok) { $topNode.removeClass('sequential'); }
            });

			sequential.utilityFunctions = {};

			sequential.utilityFunctions.goToStep = function(step, silent){

                //console.log(step);

				var isPreviousStep, changeStep, oldstep = sequential.currentStep, $newStep, stepname;

				isPreviousStep = step < sequential.currentStep;

				changeStep = function(){

					//console.log('step',step, silent);
                    sequential.currentStep = step;

                    $topNode.removeClass('sequential_step_' + oldstep).find('.sequential_error_message').text('');
                    sequential.settings.stepContainers.eq(oldstep).addClass('inactive').removeClass('active');
                    $breadcrumbs.eq(oldstep).removeClass('active');

                    //if qd is populated and step 1 was valid, users should go right to the step 2 without adding step 1
                    if(step===4 && sequential.qd){ //shoul dnever happen now
                        sequential.utilityFunctions.goToStep(1);
                    }else {
                        $topNode.addClass('sequential_step_' + step);

                        $newStep = $breadcrumbs.eq(step);
                        stepname = $newStep.data('stepname');

                        $newStep.addClass('active').prevAll().removeClass('step-error').addClass('completed');
                        sequential.settings.stepContainers.eq(step).addClass('active').removeClass('inactive').prevAll().addClass('completed');

                        //if not touch, focus on this steps first required field that is currently without a value
                        if(!touch){
                            sequential.settings.stepContainers.eq(step).find('input').find('[required]').filter(function(){
                                if($(this).val() === ""){
                                    return true;
                                }
                            }).first().focus();
                        }

                        if(!silent){
                            report(
                                ['Sequential donate', 'Screen view', stepname],
                                'sequential_screen_' + stepname
                            );
                        }
                    }
				};

				if( typeof step === 'number' ){

					if( typeof sequential.settings.validationFunctions[sequential.currentStep] === 'function'){

						if( isPreviousStep ){

							changeStep();

						} else if( sequential.currentStep !== step ) {

                            //this still allows us to skip from step 1 to step 3, past an invalid step 2....
							if( sequential.settings.validationFunctions[sequential.currentStep]() ){

                                if( sequential.currentStep === 1 ){

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
								//console.log('step fail',sequential.currentStep);
                                $('li.sequential_breadcrumb_' + sequential.currentStep).removeClass('completed').addClass('step-error');
							}

						}

					}

				}

			};

			$.Topic('change-step').subscribe(sequential.utilityFunctions.goToStep); //allow other modules to change steps 

            sequential.utilityFunctions.validateAmountsAndPersonal = function(){
                return sequential.utilityFunctions.validateAmounts() && sequential.utilityFunctions.validatePersonalInfo();
            };

			sequential.utilityFunctions.validateAmounts = function (){

				var amountRadioGroupNumber, otherAmountNumber, amountIsSelected, amountIsUnderMaximum, amountIsOverMinimum, amount, tmpamount = $otheramt.val();

				$topNode.removeClass('sequential_error');

				$('.sequential_error_message').text('');

				amountRadioGroupNumber = parseFloat( $form.find("input[name='amount']:checked").val() );

				if (tmpamount) { otherAmountNumber =  parseFloat( $otheramt.val( tmpamount.replace(/[^\d\.]/g,'') ).val() ); }

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

						//console.log('donation amount minimum is set');

						if(typeof amount === 'number'){

							if( amount <= sequential.settings.donationAmountLimit ){

								//user selected amount is under maximum
								return true;

							} else {

								//user selected amount is not under maximum
                                report(
                                    ['Sequential donate', 'Amount error', 'Above maximum'],
                                    'sequential_amount_over_maximum_error'
                                );

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

                                report(
                                    ['Sequential donate', 'Amount error', 'Below minimum'],
                                    'sequential_amount_under_minimum_error'
                                );

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

							//$topNode.find('#sequential_donate_btn_copy').text('Donate ' + sequential.currency_symbol + amount.commafy());
                            $topNode.find('#sequential_donate_btn_copy').text('Purchase Membership');

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

                    report(
                        ['Sequential donate', 'Amount error', 'no amount selected'],
                        'sequential_amount_not_selected'
                    );

					return false;

				}

			};

			sequential.utilityFunctions.validatePersonalInfo = function(){

				var numberOfInvalidFields, $prefix, firstName, lastName, address, city, $state, zip, email, phone, country, employer, occupation, $zip;

				numberOfInvalidFields = 0;

				$topNode.removeClass('sequential_error');

				$('.sequential_error_message').text('');


                $prefix = $form.find("[name='prefix']");

                if( !$prefix.val() ){

                    numberOfInvalidFields++;

                    $prefix.addClass('bsdcd-error');

                } else {

                    $prefix.removeClass('bsdcd-error');

                }

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

				$state = $("[name='state_cd']");

				if( ($state.is('select') && $state.val().length !== 2 ) || !$state.val() ){

					numberOfInvalidFields++;

					$state.addClass('bsdcd-error');

				} else {

					$state.removeClass('bsdcd-error');

				}

				//needs to not use US validation when it's not the US
				$zip = $form.find("[name='zip']");
                zip = $zip.val();

                //console.log('zip',zip);
				if( countryVal ==="US" ){
					zip.replace(/\D/g, '');
				}

				if( countryVal === "US" && zip.length >= 5 && zip.length <= 9 ){
					$zip.removeClass('bsdcd-error');
				} else if ( countryVal === "GB" && zip.length >= 3 && zip.length <= 10 ){
					$zip.removeClass('bsdcd-error');
				}else if ( countryVal !== "US" && countryVal !== "GB" && !!zip ){
					$zip.removeClass('bsdcd-error');
				}else {

					numberOfInvalidFields++;

					$zip.addClass('bsdcd-error');

				}

				country = $form.find('[name="country"]');

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

				email.input = $form.find("[name='email']");

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

				phone.input = $form.find("[name='phone']");

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

                employer = $form.find("[name='employer']");

                if( employer.length && !employer.val() ){

                    numberOfInvalidFields++;

                    employer.addClass('bsdcd-error');

                } else {

                    employer.removeClass('bsdcd-error');

                }

                occupation = $form.find("[name='occupation']");

                if( occupation.length && !occupation.val() ){

                    numberOfInvalidFields++;

                    occupation.addClass('bsdcd-error');

                } else {

                    occupation.removeClass('bsdcd-error');

                }

				if(numberOfInvalidFields > 0){

					$topNode.addClass('sequential_error');

					$topNode.find('.sequential_error_message').text('').last().text('Please correct the problems shown above.');

                    report(
                        ['Sequential donate', 'Personal Info validation errors', numberOfInvalidFields],
                        'sequential_personal_info_errors'
                    );

					return false;

				} else {

					return true;

				}

			};

			sequential.utilityFunctions.validatePaymentInfo = function (){

				var creditCard, expirationDate, invalidFields, cvv, pp;

				invalidFields = 0;

                pp = $form.find('[name="cc_type_cd"]').filter(':checked').val() === "pp";

				creditCard = {};

				creditCard.field = $form.find("[name='cc_number']");

				creditCard.number = creditCard.field.val();


				if(/[0-9]{13,19}|([0-9- ]{3,8}){3,6}/.test(creditCard.number) || (sequential.qd && creditCard.number.indexOf('XXX')>-1 || pp) ){

					creditCard.field.removeClass('bsdcd-error');

				} else {

                    invalidFields++;

                    creditCard.field.addClass('bsdcd-error');

				}

				expirationDate = {};

				expirationDate.month = {};

				expirationDate.month.field = $form.find("[name='cc_expir_month']");

				expirationDate.month.val = expirationDate.month.field.val();

				expirationDate.month.regEx = /^(01|02|03|04|05|06|07|08|09|10|11|12)$/;

				expirationDate.month.isValid = function(){

					if( expirationDate.month.regEx.test(expirationDate.month.val) || pp){

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

				expirationDate.year.field = $form.find("[name='cc_expir_year']");

				expirationDate.year.val = parseInt( expirationDate.year.field.val(), 10 );

				if( ( isNaN(expirationDate.year.val) || expirationDate.year.val < 2013) && !pp) {

                    expirationDate.year.field.addClass('bsdcd-error');

                    invalidFields++;

				} else {

                    expirationDate.year.field.removeClass('bsdcd-error');

				}

                cvv = $form.find('[name="cc_cvv"]');

                if(sequential.settings.requireCVV){

                    if( pp || sequential.qd || /^[0-9]{3,4}$/.test( cvv.val() ) ){

                        cvv.removeClass('bsdcd-error');

                    }else {
                        invalidFields++;
                        cvv.addClass('bsdcd-error');

                    }

                }


				if( invalidFields > 0 ){

                    //console.log(invalidFields);

					$('.sequential_error_message').text('Please correct the problems marked above.');

					$('body').addClass('sequential_error');

                    report(
                        ['Sequential donate', 'Payment Info validation errors', invalidFields],
                        'sequential_payment_info_errors'
                    );

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

				validationFunctions: [sequential.utilityFunctions.validateAmountsAndPersonal, sequential.utilityFunctions.validatePaymentInfo]

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

            return this;
        }

    });

})(jQuery);

window.sequential = sequential;