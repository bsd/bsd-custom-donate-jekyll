$( document ).ready(function() {

	// SETS VARIABLES
	var formSect = $('.form-content');

	// IF JS LOADS > ADD CLASS TO FORM CONTENT
	// CAUSES DIVS TO SHOW
	formSect.addClass('pagination-load');

	$('.amount-btn').click(function(){
		$('.progressive-pane').hide(); $('.amount-info').show();
	});
	$('.personal-btn').click(function(){
		$('.progressive-pane').hide(); $('.personal-info').show();
	});
	$('.payment-btn').click(function(){
		$('.progressive-pane').hide(); $('.payment-info').show();
	});
	$('.amount-info .next-btn').click(function(){
		$('.progressive-pane').hide(); $('.personal-info').show();
	});
	$('.personal-info .next-btn').click(function(){
		$('.progressive-pane').hide(); $('.payment-info').show();
	});

});