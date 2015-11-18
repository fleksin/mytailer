$(document).ready(function(){
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
	   $.each($('input'),function(key, input){
		     if($(input).val() == null){
				alert('请输入所有信息！');
				event.preventDefault();
			}
		});
       var canvas = document.getElementById('resize');
       var canvasImg = document.createElement('input');
       $(canvasImg).attr('name', 'canvasImg');
       $(canvasImg).attr('value', canvas.toDataURL('image/png'));
       $(this).append(canvasImg);
    });
    $('input#price').keyup(function(){        
        var value = $(this).val();
        if($.isNumeric(value)){$('label.price').text('价格').css('color','black');$('button').prop('disabled',false);}
        else {$('label.price').text('请输入正常价格！').css('color','red');$('button').prop('disabled',true);}
     });
   });