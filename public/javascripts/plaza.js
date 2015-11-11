var $panel = $('.panel');
$panel.each(function(index,el){
	$(el).find('#seeMore').click(function(){
		var $moreItem = $(el).find('#moreItem');
		if($moreItem.is(':hidden')){
			$moreItem.slideDown(200,function(){
				$(this).css('display','flex');
			});
			$(this).text('隐藏更多');
		}
		else{
			$moreItem.slideUp(200);
			$(this).text('更多衣服');
		}
	})
});

