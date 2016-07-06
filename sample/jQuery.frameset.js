(function($) {
	$.fn.set_frames = function(option) {
		option = $.extend({
			width:window.innerWidth ? window.innerWidth:$(window).width(),
			height:window.innerHeight ? window.innerHeight: $(window).height(),
			position_left:0,
			position_top:0,
			isinit:true
		},option);
		var i;
		$(this).width(option.width);
		$(this).height(option.height);
		var position = new Object();
		position.left = option.position_left;
		position.top = option.position_top;
//		if(option.isinit) {
			$(this).offset(position);
//		}
		var frames = $(this).children();
		var len = frames.length;

		var rows = $(this).attr("data-rows");
		var cols = $(this).attr("data-cols");
		if(rows == null) {
			if(cols == null) {alert("frameset error! set rows or cols");return;}
			var cols_arr = carcSizeArr(cols,option.width);
			var last_width = option.width;
			var col_position = option.position_left;
			for(i=0; i < len;i++) {
				var col_width = 0;
				//幅を取得
				col_width = cols_arr[i];

				//サイズをセット
				if(frames.eq(i).is("div[class='frameset']")) {
					//フレームセットの場合、再帰
					option.width = col_width;
					option.position_left = col_position;
					frames.eq(i).set_frames(option);
				}else if(frames.eq(i).is("div[class='frame']")){
					frames.eq(i).width(col_width);
					frames.eq(i).height(option.height);
					position.left = col_position;
					frames.eq(i).offset(position);
				}
				col_position = col_position + col_width;
			}
		}else {
			var rows_arr = carcSizeArr(rows,option.height);

			var row_position = option.position_top;
			for(i=0; i < len;i++) {
				var row_height = 0;
				//高さを取得
				row_height = parseInt(rows_arr[i]);

				//サイズをセット
				if(frames.eq(i).is("div[class='frameset']")) {
					//フレームセットの場合、再帰
					option.height = row_height;
					option.position_top = row_position;
					frames.eq(i).set_frames(option);
				}else if(frames.eq(i).is("div[class='frame']")){
					frames.eq(i).width(option.width);
					frames.eq(i).height(row_height);
					position.top = row_position;
					frames.eq(i).offset(position);
				}
				row_position = row_position + row_height;
			}
		}

	}
	function carcSizeArr(sizeData, winsize) {
		var arr = sizeData.split(",");
		var len = arr.length;
		var lastSize = winsize;
		var result = new Array(len);
		var astIdx = new Array();
		for(var i = 0; i < len; i++) {
			var size = 0;
			if(arr[i] === "*") {
				astIdx.push(i);
			}else {
				size = parseInt(arr[i]);
				result[i] = size;
				lastSize = lastSize - size;
			}
		}
		len = astIdx.length;
		if(len > 0) {
			var astSize = (lastSize/len);
			var astMod = (lastSize%len);
			for(var j = 0; j < len; j++) {
				if(j == 0) {
					result[astIdx[j]] = astSize + astMod;
				}else {
					result[astIdx[j]] = astSize;
				}
			}
		}
		return result;
	}
})(jQuery);


$(function(){
	$("body").css("margin","0px");
	$("form").css("margin","0px");
	$("div[class='frame'] iframe").css("border","none");
	$("div[class='frame'] iframe").css("width","100%");
	$("div[class='frame'] iframe").css("height","100%");
	$("div[class='frameset']").css("overflow","hidden");
	$("div[class='frame']").css("overflow","hidden");
	$(window).resize(function() {
		//var timer = false;
		//if (timer !== false) {
		//	clearTimeout(timer);
		//}
		//timer = setTimeout(function() {
		resize_frames(false)
		//},400);
	});
	resize_frames(true);
});
function resize_frames(binit) {
	var option = new Object();
	option.isinit = binit;
	$("div[class='frameset']:first").set_frames(option);
}
