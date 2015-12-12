function fillForm(){
	var fabric = $("input[name='fabric']:checked");
	var style = $("input[name='style']:checked");
	if(fabric.val()){
		console.log('fabric choosed');
		$("input[name='fabric']").val($(fabric).val());
		$("input[name='fabricPrice']").val($(fabric).attr('price'));
	}
	if(style.val()){
		console.log('style choosed');
		$("input[name='style']").val($(style).val());
		$("input[name='stylePrice']").val($(style).attr('price'));
	}
	var price=parseFloat($("input[name='price']").val()) 
		+ parseFloat($("input[name='fabricPrice']").val())
		+ parseFloat($("input[name='stylePrice']").val());
	$("input[name='total']").val(price);
}

$(document).ready(function(){
	$('input').prop('readonly', true);
	$('button#next').click(fillForm);
    $('form').submit(null);
});
