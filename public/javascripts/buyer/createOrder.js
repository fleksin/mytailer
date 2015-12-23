$(document).ready(function(){ 
    $('button#pay').click(function(){
     var address = $("input[name='address']:checked");
     if($(address).val()){
        $(this).prop('disabled', true);
		var address = {address: $(address).val()}
        $.post('/createPay', address).done(function(data){
           window.location.replace(data.url);
        }).fail(function(){
           alert('提交失败，请重试');
           $('button#pay').prop('disabled', false);
        });
     }
     else{
       $(this).html('请选择一个地址!');
     }
    });
	$('button#pushAddress').click(function(){
		var btn = this;
		$(this).prop('disabled','true');
		var address = $('input#newAddress').val();
		$('input#newAddress').val('');
		if(address && address != ''){
		  var data = {address: address};
		  $.post('/mycustomer/pushAddress', data).done(function(res){
			if(res.ok == 1){ //document.location.reload(true);
				alert('添加成功！');
 				$('dl#address').append("<dd><input type='radio' name='address' value="+ address +">"+ address +"</dd>");
				$(button).prop('disabled','false');
			}
			else alert('try again!'); 
		  });
``		}
		else{
			 $(this).html('请输入地址!');
		}
	});
});
