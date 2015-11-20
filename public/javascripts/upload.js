function checkNum(){
	if (isNaN($(this).val())){ 
		$('label#error').html(' 价格必须是数字!');
		$('button').prop('disabled',true);
	} 
	else {
		$('label#error').html('');
		$('button').prop('disabled',false);
	}
}

function removeFabric(){
	$(this).parent('div').remove();	
}

$(document).ready(function(){
	var numfields = $('input').length;
	console.log(numfields);
    document.getElementById('myFileInput').addEventListener('change',function(){
      console.log('file info');
      var reader = new FileReader();
      reader.onload = function(e){
        //document.getElementById('uploadImg').src = e.target.result;
        var img = new Image;
        img.src = e.target.result;
        var canvas = document.getElementById('resize');
        var MAX_WIDTH = 400;
        var MAX_HEIGHT = 300;
        var width = img.width;
        var height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
             height *= MAX_WIDTH / width;
             width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
             width *= MAX_HEIGHT / height;
             height = MAX_HEIGHT;
          }
        } 
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height); 
        console.log(canvas.toDataURL("image/png"));
      };
      reader.readAsDataURL(this.files[0]);  
      var canvas = document.getElementById('resize');
      console.log('the length of dataurl: '+canvas.toDataURL('image/png').length);
    });
    $('form.panel').submit(function(event){
       //var fd = new FormData($('form.panel'));
		$('button').attr('disable', true);
		$('#uploading').show();
		$('input').each(function(key, input){
		     if(!$(input).val()){
				console.log('miss: ' + $(input).attr('name'));
				event.preventDefault();
				$('div#hint').html('请填写所有信息');
				return;
			}
		});
		if(!$("input[name='name']:checked").val()){
			event.preventDefault();
			$('div#hint').html('请选一个商品类别');
			return;
		}
		var canvas = document.getElementById('resize');
		var canvasImg = document.createElement('input');
		$(canvasImg).attr('name', 'canvasImg');
		$(canvasImg).attr('value', canvas.toDataURL('image/png'));
		$(this).append(canvasImg);
    });
    $('input#price').keyup(function(){        
        var value = $(this).val();
        if($.isNumeric(value)){
			$('label.price').text('价格').css('color','black');
			$('button').prop('disabled',false);
			var price = parseFloat(value);
			var charge = (price * 0.2).toFixed(2);
			var total = (price * 1.2).toFixed(2);
			$('span#charge').html(charge);
            $('span#total').html(total);
		}
        else {$('label.price').text('请输入正常价格！').css('color','red');
              $('button').prop('disabled',true);
              $('span#charge').html('');
              $('span#total').html(''); }
     });
	$('#addParam').click(function(){
        var input ="<div style='display:flex;width=100%;margin:0 0 5px' id='oneOption'>" + 
               "<label class='glyphicon glyphicon-trash' id='remove' ></label>" +
               "<input name='optionalFabric' type='text' placeholder='面料' class='form-control'>" + 
               "<label>+</label>"+
               "<input id='plus' name='plus' type='text' placeholder='价格' class='form-control'>" +               
            "</div>" ;
		$('.parameters').append(input);
		$('.parameters #plus').keyup(checkNum);
		$('.parameters #remove').click(removeFabric);
		
	});		
});