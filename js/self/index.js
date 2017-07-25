const oDomain = "http://www.coskobo.com/appserver/index.php";
$(function(){
	const index = {
		init:function(){
			this.oLoad();			//页面初始化
			this.getBanner();		//banner获取
			this.oSwiper();			//滑动
			this.getNews();			//news获取
			this.getModules();		//获取模块信息
			//this.closeMore();		//关闭更多PS:getModules调用
			this.getTab();			//获取最新情报和知识
			//this.changeTab();		//tab切换PS:getTab调用
			this.getMenu();		//获取菜单列表	
			// this.oMenu();		//菜单列表操作PS:getMenu调用
			//this.goInfo();			//跳转详情页或者分类页PS:getModules调用
		},
		oLoad:function(){
			$(window).on("scroll",function(){
				let oT = $(".m-index-news").offset().top,
					oS = $(window).scrollTop();
				if(oS > oT){
					$(".m-nav-bottom ").show();
				}else{
					$(".m-nav-bottom ").hide();
				}
			})
			let dataUrl = oDomain +"/home/index/indexBaseInfo";
			jsonData.getData(dataUrl,"GET",{},function(data){
				if(data.code == 0){
					console.log(data);
					if(data.data.title && data.data.title != ""&& data.data.title != null){
						$("title").text(data.data.title);
					}
					if(data.data.keywords && data.data.keywords != "" && data.data.keywords != null){
						$("head").append("<meta name='Keywords' Content='"+data.data.keywords+"'>")
					}
					if(data.data.description && data.data.description != "" && data.data.description != null){
						$("head").append("<meta name='Description' Content='"+data.data.description+"'>")
					}
					if(data.data.pagedesc && data.data.pagedesc != "" && data.data.pagedesc != null){
						$(".m-index-banner").find(".m-index-title").html(data.data.pagedesc)
					}else{
						$(".m-index-banner").find(".m-index-title").hide();
					}
				}
			})
		},
		getBanner:function(){
			let dataUrl = oDomain + "/home/banner/bannerlistindex";
			jsonData.getData(dataUrl,"GET",{},function(data){
				console.log(data);
				let oHtml = template("bannerTpl",data);
				$(".m-index-banner").find(".swiper-wrapper").html(oHtml);
				let mySwiper = new Swiper('.swiper-container-banner',{
					autoplay : 3000,
					loop : true,
					direction : 'horizontal',
					autoplayDisableOnInteraction : false,
					pagination : '.swiper-banner-pagination'
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
					autoplay : 3000,
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
				index.closeMore();
				// index.oSwiper();
				index.goInfo();
			}else{
				jsonData.getData(dataUrl,"GET",{},function(data){
					console.log(data);
					sessionStorage.modulelist = JSON.stringify(data);
					let oHtml = template("moduleTpl",data);
					$("#product-box").html(oHtml);
					index.closeMore();
					// index.oSwiper();
					index.goInfo();
				})
			}
		},
		goInfo:function(){
			$(".m-product-category-list .onelist").each(function(index,elem){
				$(elem).on("click",function(){
					window.location.href = "./classify.html?catId="+$(elem).attr("data-id");
				})
			})
			$(".m-product-category-list li").each(function(index,elem){
				$(elem).on("click",function(){
					window.location.href = "./classify.html?catId="+$(elem).attr("data-id");
				})
			})
			$(".m-product-goods-list .onelist").each(function(index,elem){
				$(elem).on("click",function(){
					window.location.href = "./classify.html?catId="+$(elem).attr("data-id");
				})
			})
			$(".m-product-goods-list li").each(function(index,elem){
				$(elem).on("click",function(){
					window.location.href = "./detail.html?goodsId="+$(elem).attr("data-id");
				})
			})
			$(".m-product-shuffling-list li").each(function(index,elem){
				$(elem).on("click",function(){
					window.location.href = "./detail.html?goodsId="+$(elem).attr("data-id");
				})
			})
		},
		closeMore:function(){
			$(".m-product-list-content-more").each(function(index,elem){
				$(elem).on("click",function(){
					$(elem).toggleClass("f-open");
					if($(elem).hasClass("f-open")){
						$(elem).text("閉じる　↑");
					}else{
						$(elem).text("個人印鑑をもっと見る　↓");
					}
					$(elem).parents(".m-product-list-content").find(".m-product-list-more-content").toggle();
				})
			})
		},
		getTab:function(){
			let dataUrl = oDomain + "/home/news/newslistindex";
			let param = {"type":"Newest"}
			jsonData.getData(dataUrl,"GET",{"data":param},function(data){
				sessionStorage.Newest = JSON.stringify(data);
				let oHtml = template("tabTpl",data);
				$(".m-index-tab-intelligence-lists").html(oHtml);
			})
			param = {"type":"knowledge"}
			jsonData.getData(dataUrl,"GET",{"data":param},function(data){
				sessionStorage.knowledgeInfo = JSON.stringify(data);
				let oHtml = template("tabTpl",data);
				$(".m-index-tab-knowledge-lists").html(oHtml);
			})
			if($(".m-tab-header .jt").hasClass("jtx")){
				$(".m-index-tab-knowledge-lists").hide();
				$(".m-index-tab-intelligence-lists").show();
			}else if($(".m-tab-header .jt").hasClass("right-cur")){
				$(".m-index-tab-intelligence-lists").hide();
				$(".m-index-tab-knowledge-lists").show();
			}
			index.changeTab();
		},
		changeTab:function(){
			$(".m-index-tab").on("click",".m-tab-intelligence,.m-tab-knowledge",function(){
				$(this).find(".btn").addClass("cur");
				$(this).siblings(".f-tab").find(".btn").removeClass("cur");
				if($(this).hasClass('m-tab-knowledge')){
					$(".m-index-tab .jt").addClass("right-cur").removeClass("jtx");
					$(".m-index-tab-knowledge-lists").hide();
					$(".m-index-tab-intelligence-lists").show();
				}else{
					$(".m-index-tab .jt").addClass("jtx").removeClass("right-cur");
					$(".m-index-tab-intelligence-lists").hide();
					$(".m-index-tab-knowledge-lists").show();
				}
			})
		},
		getMenu:function(){
			let dataUrl = oDomain + "/home/index/menuList";
			jsonData.getData(dataUrl,"GET",{},function(data){
				console.log(data);
				let oHtml = template("menuTpl",data);
				$(".m-common-menu-content-lists").html(oHtml);
				if(data.data.other && data.data.other !=""){						
					for(let i=0;i<data.data.other.length;i++){
						let oHtml = '<div class="m-common-menu-content-list">'+
						'<a href="'+data.data.other[i].href+'">'+data.data.other[i].name
						'</a>'+
						'</div>';
						$(".m-common-menu-content-lists").append();
					}
				}
				index.oMenu();
			})
			$(".m-common-menu").on("click",function(){
				$(".m-common-menu-box").show();
			})
		},
		oMenu:function(){
			$(".m-common-menu-content-list-header").each(function(index,elem){
				$(elem).on("click",function(){
					$(elem).find(".jt img").toggleClass("fan");
					$(elem).siblings("ul").toggle();
				})
			})
			$(".m-common-menu-content-header").find(".btn").on("click",function(){
				$(".m-common-menu-box").hide();
			})
			$(".m-common-menu-close").on("click",function(){
				$(".m-common-menu-box").hide();
			})
		}
	}
	index.init();
})
