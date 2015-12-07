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
	$('input').prop('required', false); // comment this out later, its for test

	var numfields = $('input').length;
	console.log(numfields);
    document.getElementById('myFileInput').addEventListener('change',function(){
      console.log('file info');
      var reader = new FileReader();
      reader.onload = function(e){
        document.getElementById('uploadImg').src = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);  
      // var canvas = document.getElementById('resize');
      // console.log('the length of dataurl: '+canvas.toDataURL('image/png').length);
    });
    $('form.panel').submit(function(event){
       //var fd = new FormData($('form.panel'));
		var Form = this;
		var options =[];
		var styleOpt = [];
		
		$('button').attr('disabled', true);
		$('.options').each(function(key, one){
			var name = $(this).find('#fabricPlus').val();
			var price = $(this).find('#pricePlus').val();
			options.push({'name':name, 'price':price});
		});
		$('.styleOpt').each(function(key, one){
			var name = $(this).find('#optName').val();
			var price = $(this).find('#optPrice').val();
			styleOpt.push({'name':name, 'price':price});
		});
		$(Form).append("<input id='test' name='fabricPlus' value="
                 + JSON.stringify(options) +" style='display:none'>");
		$(Form).append("<input id='test' name='style' value="
                 + JSON.stringify(styleOpt) +" style='display:none'>");
		
		//check inputs
		$('input').each(function(key, input){
		     if(!$(input).val()){
				event.preventDefault();
				$('div#hint').html('请填写所有信息');
				return;
			}
		});
		if($('div#hint').html()) return;
		if(!$("input[name='catag']:checked").val()){
			event.preventDefault();
			$('div#hint').html('请选一个商品类别');
			return;
		}
		// var canvas = document.getElementById('resize');
		// var canvasImg = document.createElement('input');
		// $(canvasImg).attr('name', 'canvasImg');
		// $(canvasImg).attr('style', 'display:none');
		// $(canvasImg).attr('value', canvas.toDataURL('image/png'));
		// $(this).append(canvasImg);
		$('#uploading').show();
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
        var input ="<div style='display:flex;width=100%;margin:0 0 5px' class='options'>" + 
               "<label class='glyphicon glyphicon-trash' id='remove' ></label>" +
               "<input id='fabricPlus' type='text' placeholder='面料' class='form-control'>" + 
               "<label>+</label>"+
               "<input id='pricePlus' type='text' placeholder='价格' class='form-control'>" +               
            "</div>" ;
		$('.parameters').append(input);
		$('.parameters #pricePlus').keyup(checkNum);
		$('.parameters #remove').click(removeFabric);
	});	
	$('#addstyle').click(function(){
        var input ="<div style='display:flex;width=100%;margin:0 0 5px' class='styleOpt'>" + 
               "<label class='glyphicon glyphicon-trash' id='remove' ></label>" +
               "<input id='optName' type='text' placeholder='选项' class='form-control'>" + 
               "<label>+</label>"+
               "<input id='optPrice' type='text' placeholder='价格' class='form-control'>" +               
            "</div>" ;
		$('.styles').append(input);
		$('.styles #optPrice').keyup(checkNum);
		$('.styles #remove').click(removeFabric);
	});	
});
