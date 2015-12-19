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
});
