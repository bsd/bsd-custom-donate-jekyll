//global jQuery, dsa

(function($){

    var $body = $('#bsd_contribute_cont')||$('body'),
        $form = $body.find('form'),
        $presetBtns = $form.find('.preset_amount_label'),
        $presetInputs = $form.find('.preset_amount_input'),
        $otherAmt = $form.find('.amount_other'),
        $otherAmtRadio = $form.find('.other_amount_radio'),
        $country = $form.find('.country'),
        $state_cdCont = $form.find('.state_cd_cont').eq(0),
        $state_label = $state_cdCont.find('label'),
        $state_cd = $state_cdCont.find('input,select').eq(0),
        state_cd_id = $state_cd.attr('id'),
        state_cd_tabindex = $state_cd.attr('tabindex'),
        $zip_label = $form.find('label.zip_related'),
        $stateFrag = $body.find('.us-state-dropdown').eq(0).clone().val('').addClass('state_cd').removeClass('hidden').attr('name','state_cd').attr('id',state_cd_id).attr('tabindex',state_cd_tabindex),
        $stateInput = $('<input/>',{'type':'text','name':'state_cd','id':state_cd_id,'class':'text state_cd', 'tabindex':state_cd_tabindex}),
        countryVal = $form.data('default-country');

	$('.other_amount_label').hide();

    $form.find('[name="http_referrer"]').val(document.referrer);

    if(nomin){
        $('<input/>',{'type':'hidden','name':'nomin','value':'1'}).appendTo($form);
    }


    $form.find('.honoree-select').on('change',function(){
        var $el = $(this), val = $el.val();
        $form.removeClass('honor-section memorial-section');
        if(val==="1"){
            $form.addClass('honor-section memorial-section');
        }
        else if (val==="0"){
            $form.addClass('honor-section');
        }
    });

	//apply an active class to label when amount is selected
	$form.on('click','.preset_amount_label',function(e){
		var $el = $(this);
		$presetBtns.removeClass('active');
		$el.addClass('active');
		$otherAmt.val('');
        $el.prev().prop('checked', true);
	}).on('keydown','.amount_other',function(){
		$presetBtns.removeClass('active');
		$presetInputs.each(function(){
			$(this).prop('checked',false);
		});
        $otherAmtRadio.prop('checked', true);
	}).one('keydown','.amount_other',function(){
		$body.removeClass('pre-first-click');
	}).one('click','.preset_amount_label',function(){
		$body.removeClass('pre-first-click');
		$.Topic('change-step').publish(1);
	});

	function switchCountry(qd){
        var val = $country.val(),
            $oldstate = $state_cdCont.hide().find('.state_cd');
		if(val === "US"){
            if(!$oldstate.is('select')){
                $oldstate.remove();
                $state_cdCont.append($stateFrag.val(''));
            }
            $form.removeClass('state-text-input');
            $state_label.html('State<span>*</span>');
            $zip_label.html('ZIP<span>*</span>');
            countryVal = "US";
		}
		else{
            if($oldstate.is('select')){
                $oldstate.remove();
                $state_cdCont.append($stateInput.val(''));
            }
            $form.addClass('state-text-input');
            $state_label.html((val==="GB")?'County<span>*</span>':'State/Region/Province<span>*</span>');
            $zip_label.html('Postal Code<span>*</span>');
            countryVal = (val==="GB")?'GB':'INT';
		}
		$state_cdCont.show();
	}

	$country.on('change',function(){
		switchCountry();
	});

}(jQuery));