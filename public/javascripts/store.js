$(document).ready(function(){
	$('a#edit').click(function(){
		var inputs = $('form').find('input');
		if($(inputs).attr('readonly')){
			$(inputs).attr('readonly', false);
			$('form#user button').show();
		}
		else {
			$(inputs).attr('readonly', true);
			$('form button').hide();
		}
	});
	$('form').submit(function(event){
		event.preventDefault();
        var f1 = $(this).serializeArray();		
		var data = {};
		for(var i=0; i < f1.length; i++){
			data[f1[i].name] = f1[i].value;
		}
		$.post('/updateStore', data, function(res){
			console.log(res);
			$('input').attr('readonly', true);
			$('form button').hide();
			location.reload();
		});
	});
})