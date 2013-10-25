/*
 * jquery.detectcctype.js
 * Detects CC type and updates BSD donate form fields accordingly.
 *
 * Written and maintained by Kyle Rush
 *
 * Date: Sunday, 27 Apr 2013 12:11 (GMT - 5:00)
 */
(function($){

    $.fn.extend({
        
        detectCCType: function($container) {
            
            //radio selectors
			var $form = $(this).find('form'),
                $ccTypeSection = $form.find('.cc_type_cont'),
                $ccArray = $form.find("[name='cc_type_cd']"),
				$visa = $ccArray.filter("[value='vs']"),
				$amex = $ccArray.filter("[value='ax']"),
				$discover = $ccArray.filter("[value='ds']"),
				$mastercard = $ccArray.filter("[value='mc']"),
                $maestro = $ccArray.filter("[value='ma']"),
				$ccNum = $form.find('[name="cc_number"]'),
				visaRegEx = /^4/,
				amexRegEx = /^3[47]/,
				discoverRegEx = /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
				masterCardRegEx = /^5[1-5]/,
                maestroRegex = /^(5018|5020|5038|6304|6759|676[1-3])/,
				quickDonateRegEx = /^x/i;
			
			function setCreditCardType(){
                
				var creditCardNumber = $ccNum.val(),
					valid = [];

				$form.removeClass('cc-is-vs cc-is-ax cc-is-ds cc-is-mc cc-is-ma cc-is-qd cc-cover');

				/*if it's not quick donate, remove the checked state from all cardtypes then check to see if one is valid*/
				if( !quickDonateRegEx.test(creditCardNumber) ){
					
                    $ccArray.prop('checked',false);
                    
					if(visaRegEx.test(creditCardNumber)){
						valid = $visa;
					} else if(amexRegEx.test(creditCardNumber)){
						valid = $amex;
					} else if(discoverRegEx.test(creditCardNumber)) {
						valid = $discover;
					} else if(masterCardRegEx.test(creditCardNumber)) {
						valid = $mastercard;
					} else if(maestroRegex.test(creditCardNumber)) {
                        valid = $maestro;
                    }

                    if (valid.length){
                        valid.prop('checked', true);
                        $form.addClass('cc-cover cc-is-'+valid.val());
                    }
				}
                else {
                    $form.addClass('cc-is-qd');
                }
			}
			
            /*subscribe to any events that change the data, such as a QD token coming in*/
            if ($.Topic) { $.Topic('data-update').subscribe( setCreditCardType ); }

			/*bind the behavior to all events that might change the value*/
			$ccNum.on('keyup change', function(){
                setTimeout(setCreditCardType, 0);
            });

            $ccNum.on('paste', function(){
                setTimeout(setCreditCardType, 0);
            });

			//apply class to parent indicating script is running correctly
			$form.addClass('cc-type-detection-active');

                
        }
        
    });

})(jQuery);