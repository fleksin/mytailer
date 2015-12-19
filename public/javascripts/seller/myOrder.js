$(document).ready(function(){	
	function remove(){
		console.log('!');
		$(this).parent().remove();
	};
	$('.order').click(function(){
       //console.log(data.address);
		var data = $.parseJSON($(this).attr('data'));
		$('#detail-buyer').html(data.buyer);
        $('#detail-createDate').html(data.createDate);
        $('#detail-title').html(data.title);
        $('#detail-fabric').html(data.fabric);
        $('#detail-price').html(data.price);
        $('#detail-plus').html(data.pricePlus || '0');
        $('#detail-total').html(data.total);
        $('#detail-address').html(data.address || '');
    });
	$('button#list').click(function(){
		var data = $.parseJSON($(this).parents('.order').attr('data'));
		var list = data.list;
		console.log(list);
		var orderID =data.orderID;
		if(list){
			$('#list-hint').html('或者你也可以另设一份表格，这个操作会遗弃已生成的表格');
			$('#list dl').html('');
			for(var key in list){
				console.log(key);
				$('#list dl').append('<dt>' + key +':</dt>' + '<dd>' + list[key] + '</dd>');
			}
		}
		else{ $('#list-hint').html('还没有生成一个表单，请新建'); $('#list dl').html('');}
		$('div#list').show();
		$('div#list').attr('orderID', orderID);
	})
    $('button#close').click(function(){$('div#list').hide();$('form#list-create').hide()});
	$('form#list-create').submit(function(event){
		console.log('here');
		event.preventDefault();
		var orderID = $('div#list').attr('orderID');
		var checked = $(this).find("input[type='checkbox']:checked").toArray();
		var options = $(this).find("input.options").toArray();
		var list = {};
		for(var key in checked){
			list[$(checked[key]).attr('name')] = '';
		}
		for(var key in options){
			var value = $(options[key]).val();
			if(value) list[value] = '';
		}
		//console.log(list);
        var query = {orderID:orderID, list:JSON.stringify(list)};
		$.post('/createList', query, function(res){
			if(res.ok == 1) location.reload();
		});
	});
	$('button#updateList').click(function(){
		var orderID = $(this).attr('orderID');
		var status = Number($(this).attr('status')) + 1;
		var query = {orderID: orderID, status: status};
		$.post('/updateOrder', query, function(res){
			if(res.ok == 1) location.reload();
		});
	});
	$('#list-hint').click(function(){
		if($('form#list-create').is(':visible'))
			$('form#list-create').hide();
		else $('form#list-create').show();
	});
	$('a#add').click(function(){
		$('div#list-option').append("<div class='option'>"
			+"<input class='options' value=''>"
			+"<a class='glyphicon glyphicon-remove-sign' id='remove'>"
			+ "</div>"		
		);
		$('div#list-option').find('a#remove').click(remove);
	});
	
});  
