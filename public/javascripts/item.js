$(document).ready(function(){
	$('button').click(function(event){
		var price;
		if(!$("input[name='fabric']:checked").val()){
			$(this).append("<input name='fabric' value='"+ $('#fabric').text() +"' style='display:none'>");
			price=$('#price').text();
		}
		else{
			var pricePlus=$("input[name='fabric']:checked").attr('price');
			price= pricePlus + $('#price').text() ;
			$(this).append("<input name='price' value='"+ price +"' style='display:none'>");
			$(this).append("<input name='pricePlus' value='" + pricePlus + "' style='display:none'>");
		}
	})
});