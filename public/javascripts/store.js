$(document).ready(function(){
    var catag= $.parseJSON($('div#catag-area').attr('catag'));
	//console.log(catag.length);
	var boxes = $("input[type='checkbox']").toArray();
	//var catagUnlock = "<input type = 'checkbox' value = >
	for(var i in boxes){
		var cat = $(boxes[i]).val();
		
		for(var key in catag){           
			if(cat == catag[key]) {$(boxes[i]).attr('checked', true); }			
		}           
	}
	$('a#edit').click(function(){
		var inputs = $('form').find('input');
		if($(inputs).attr('readonly')){
			$(inputs).attr('readonly', false);
            $(inputs).attr('onclick','');
			$('form#user button').show();
		}
		else {
			$(inputs).attr('readonly', true);
            $(inputs).attr('onclick','return false');
			$(inputs).val('');
			$('form button').hide();
		}
	});
	$('form').submit(function(event){
		event.preventDefault();
		$('form button').prop('disabled', true);
        var f1 = $(this).serializeArray();		
		var data = {};
		for(var i=0; i < f1.length; i++){
			data[f1[i].name] = f1[i].value;
		}
        var boxes = $("[type = 'checkbox']:checked").toArray();
        console.log(boxes);
		var catag = [];
		for(var i in boxes){catag.push($(boxes[i]).val())};
        data.catag = catag;
		console.log(data);
		$.post('/updateStore', data, function(res){
			console.log(res);
			$('input').attr('readonly', true);
			$('form button').hide();
			location.reload();
		});
	});
})
