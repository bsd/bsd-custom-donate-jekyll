//global jQuery, dsa-controller
//this library creates some core behaviors on donate forms if present, such as amount labels (for legacy support), internationalization, in-honor-of-fields

(function($){

    //need to decouple this first value: all this behavior should be plugin-y
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
        countryVal = $form.data('default-country'),
        min = parseFloat($form.data('min-donation'))||0,
        max = parseFloat($form.data('max-donation'))||Infinity,
        symbol = $('[data-currency-symbol]').data('currency-symbol')||"$",
        custom_amounts = gup('amounts'),
        default_amount = gup('default_amt'),
        skip = parseFloat(gup('skip'))||false;
        console.log(skip);

	$('.other_amount_label').hide();

    $form.find('[name="http_referrer"]').val(document.referrer);

    if(nomin){
        $('<input/>',{'type':'hidden','name':'nomin','value':'1'}).appendTo($form);
        min = 0.01;
    }

    //accept an 'x' separated string of amounts, validate each, and assign them to buttons 
    function customAmounts(cas){
        if (!cas || typeof cas !== "string"){ return false; }
        var ca_array = cas.split('x'),
            btn = 0;
        if(ca_array && ca_array.length){
            $.each(ca_array,function(i,v){
                var amt = parseFloat(v);
                if(amt && $presetBtns.eq(btn).length && amt>=min && amt<=max){
                    $presetBtns.eq(btn).html(symbol+(amt.commafy()) );
                    $presetInputs.eq(btn).val(amt);
                    btn++;
                }
            });
        }
    }
    //maybe make this global at some point so it can be exposed to optimizely?
    window.BSDcustomAmounts = customAmounts;
    customAmounts(custom_amounts);

	//apply an active class to a label when amount is selected
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
	});

    //if there's a url parameter requesting a default amount be preselected, see if it's valid and matches an existing label, then select it
    if (default_amount && parseFloat(default_amount) && $presetInputs.filter( function(){ return $(this).val() === default_amount; } ).length>0  ){
        $presetInputs.filter( function(){ return $(this).val() === default_amount; } ).eq(0).next('label').click();
        $body.removeClass('pre-first-click'); //default amount should expose the next button

        //if skip to second step is requested, do so if an amount is already in. Not sure why the delay is needed here
        if(skip && skip===1 ){
            $.wait(3).done(function(){
                $.Topic('change-step').publish(1);
            });
        }
    }

    //now that we've dealt with pre-clicks, lets potentially bind the click behavior to change things on the first click
    $form.one('keydown','.amount_other',function(){
		$body.removeClass('pre-first-click');
	}).one('click','.preset_amount_label',function(){
		if ($('body').find('.pre-first-click').length) { $.Topic('change-step').publish(1); }
        $body.removeClass('pre-first-click');
	});

    //toggle honeree select areas open and toggle between memorial or not
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

    //handles the simplest way to support international validation changes based on country
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