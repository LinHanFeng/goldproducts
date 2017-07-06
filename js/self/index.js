const oDomain = "http://www.coskobo.com/appserver/index.php";
$(function(){
	var index = {
		init:function(){
			this.oLoad();			//页面初始化
			this.getBanner();		//banner获取
			this.oSwiper();			//滑动
			this.getNews();			//news获取
			this.getModules();		//获取模块信息
		},
		oLoad:function(){
			
		},
		getBanner:function(){
			let dataUrl = oDomain + "/home/banner/bannerlistindex";
			jsonData.getData(dataUrl,"GET",{},function(data){
				console.log(data);
				let oHtml = template("bannerTpl",data);
				$(".m-index-banner").find(".swiper-wrapper").html(oHtml);
				let mySwiper = new Swiper('.swiper-container-banner',{
					direction : 'horizontal'
				})
			})
		},
		getNews:function(){
			let dataUrl = oDomain + "/home/news/newslistindex";
			jsonData.getData(dataUrl,"GET",{},function(data){
				console.log(data);
				let oHtml = template("newsTpl",data);
				$(".swiper-news-container .swiper-wrapper").html(oHtml);
				let mySwiper = new Swiper('.swiper-news-container', {
					// autoplay: 5000,//可选选项，自动滑动,
					autoplay : 1000,
					loop : true,
					direction : 'vertical'
				})
			})

		},
		oSwiper:function(){
			let mySwiper = new Swiper('.swiper-container', {
				// autoplay: 5000,//可选选项，自动滑动,
				prevButton:'.swiper-button-prev',
				nextButton:'.swiper-button-next',
				direction : 'horizontal'
			})

		},
		getModules:function(){
			let dataUrl = oDomain + "/home/index/moduleList";
			if(sessionStorage.modulelist && sessionStorage.modulelist != ""){
				console.log(JSON.parse(sessionStorage.modulelist));
				let oHtml = template("moduleTpl",JSON.parse(sessionStorage.modulelist));
				$("#product-box").html(oHtml);
				index.oSwiper();
			}else{
				jsonData.getData(dataUrl,"GET",{},function(data){
					console.log(data);
					sessionStorage.modulelist = JSON.stringify(data);
					let oHtml = template("moduleTpl",data);
					$("#product-box").html(oHtml);
					index.oSwiper();
				})
			}
		}
	}
	index.init();
})
