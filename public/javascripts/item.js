function fillForm(){
	if($("input[name='fabric']:checked").val()){
		var fabric = $("input[name='fabric']:checked");
		$("input[name='fabric']").val($(fabric).val());
		$("input[name='pricePlus']").val($(fabric).attr('price'));
		var price=parseFloat($("input[name='price']").val()) + parseFloat($(fabric).attr('price'));
		$("input[name='total']").val(price);
	}
}
$(document).ready(function(){
	$('input').prop('readonly', true);
	$('button#next').click(fillForm);
    $('form').submit(null);
});