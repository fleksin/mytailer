$(document).ready(function(){
console.log('signupM.js');
$('form#final').submit(function(event){
	event.preventDefault();
	var f1 = $('form#1st').serializeArray();
	var f2 = $('form#2nd').serializeArray();
    var data = {};
	for(var i=0; i < f1.length; i++){
		data[f1[i].name] = f1[i].value;
	}
	for(var i=0; i < f2.length; i++){
		data[f2[i].name] = f2[i].value;
	}
	$.post('/signupM', data, function(res){			
		console.log(res);
		if(!res.success){
			$('#prompt').html(res.error).show();			
		}
		else{	
			location.href='/privateStore';
		}
	});
});
})
