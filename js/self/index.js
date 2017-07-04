$(function(){
	var index = {
		init:function(){
			this.oLoad();		//页面初始化
			this.getBanner();		//banner获取
			this.oSwiper();		//滑动
			this.getNews();		//news获取
		},
		oLoad:function(){
			
		},
		getBanner:function(){
			var dataUrl = "http://www.coskobo.com/appserver/index.php/home/banner/bannerlistindex";
			jsonData.getData(dataUrl,"GET",{},function(data){
				console.log(data);
				var oHtml = template("bannerTpl",data);
				$(".m-index-banner").find(".swiper-wrapper").html(oHtml);
			})
			var mySwiper = new Swiper('.swiper-container-banner',{
				direction : 'horizontal'
			})
		},
		getNews:function(){
			var dataUrl = "http://www.coskobo.com/appserver/index.php/home/news/newslistindex";
			jsonData.getData(dataUrl,"GET",{},function(data){
				console.log(data);
			})
		},
		oSwiper:function(){
			var mySwiper = new Swiper('.swiper-container', {
				// autoplay: 5000,//可选选项，自动滑动,
				prevButton:'.swiper-button-prev',
				nextButton:'.swiper-button-next',
				direction : 'horizontal'
			})

		}
	}
	index.init();
})
