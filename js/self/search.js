let sessionId = sessionStorage.sessionId || "",
	userId = localStorage.userId || "";
const search = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar();			//跳转购物车
		this.oSearch();			//搜索操作
		this.changeType();		//改变排序类型（单双排)
		this.changeSort();		//改变排序方式
		this.oNext();			//下一步
	},
	oLoad : function(){
		$(window).on("scroll",function(){
			let oT = 200,
				oS = $(window).scrollTop();
			if(oS > oT){
				$(".m-nav-bottom").show();
				$(".m-common-stick").show();
				$(".m-common-go-top").show();
			}else{
				$(".m-nav-bottom").hide();
				$(".m-common-stick").hide();
				$(".m-common-go-top").hide();
			}
		})
		let dataUrl = oDomain + "/home/cart/cartTotal";
		let param = {"sessionId":sessionId}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(result){
			if(result.code == 0){
				$(".m-common-car em").text(result.data.count);
			}
		})
		$(".m-common-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
	},
	getMenu:function(){
		let dataUrl = oDomain + "/home/index/menuList";
		jsonData.getData(dataUrl,"GET",{},function(data){
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
			search.oMenu();
		})
		$(".m-common-menu,.m-common-stick-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
	},
	oMenu:function(){
		if(userId && userId !=""){
			$(".m-common-menu-content-list .go").closest("li").show()
				.siblings("li").hide();
			$(".m-common-menu-content-list .go").on("click",function(){
				localStorage.removeItem("userId");
				window.location.href = "index.html";
			})
		}else{
			$(".m-common-menu-content-list .go").closest("li").hide();
		}
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
	},
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	oSearch:function(){
		$(".m-search-header-search input").on("focus",function(){
			$(".icon-search").hide();
		})
		$(".m-search-header-search input").on("blur",function(){
			if($(".m-search-header-search input").val() ==""){
				$(".icon-search").show();
			}
		})
		$(".m-search-header-search .icon-close").on("click",function(){
			$(".m-search-header-search input").val("");
			$(".icon-search").show();
		})
		$(".m-search-header-search .search-btn").on("click",function(){
			$(".m-common-spinner").show();
			let keywords = $(".m-search-header-search input").val(),
			field = $(".m-search-main-ta .cur").attr("data-type") || "Goods_id",
			sort = $(".m-search-main-ta .cur").attr("data-sort") || "ASC",
			page = 1,
			dataUrl = oDomain + "/home/Goods/searchGoods",
			param = {
				"keywords" : keywords,
				"field" : field,
				"sort" : sort,
				"page" : page
			};
			sessionStorage.keywords = keywords;
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				$(".m-common-spinner").hide();
				console.log(data)
				if(data.code ==0){
					if(data.data.length >0){
						$(".total-num").text(data.data.length);
						let oData = data.data,
							showList = new Array();
						for(let i=0;i<oData.length;i++){
							if(i<20){
								showList.push(oData[i]);
							}
						}
						let oHtml = template("listTpl",showList);
						$(".m-search-main-content-have-lists ul").html(oHtml);
						$(".m-search-main-content .have").show()
							.siblings(".empty").hide();
						$('.M-box').pagination({
						    totalData:data.data.length,
						    showData:20,
						    coping:true,
						    count:3,
						    current:1,
						    prevContent:"＜ 前へ",
						    nextContent:"次へ ＞",
						    callback:function(v){
						    	$(".M-box").css({
						    		"width":"auto",
						    		"display":"inline-block"
						    	})
						    	let oW = $(".M-box").width()+20;
						    	$(".M-box").css({
						    		"width":oW,
						    		"display":"block",
						    		"margin": "0 auto"
						    	})
						    	let pageNo = v.getCurrent(),
						    		prePage = pageNo -1;
						    		showList = new Array();
								for(let i=prePage*20;i<oData.length;i++){
									if(i<pageNo*20){
										showList.push(oData[i]);
									}
								}
						    	console.log(v.getCurrent());
						    	let oHtml = template("listTpl",showList);
								$(".m-search-main-content-have-lists ul").html(oHtml);
						    }
						},function(){
					    	$(".M-box").css({
					    		"width":"auto",
					    		"display":"inline-block"
					    	})
					    	let oW = $(".M-box").width()+20;
							$(".M-box").css({
					    		"width":oW,
					    		"display":"block",
					    		"margin": "0 auto"
					    	})
						});	
					}else{
						$(".m-search-main-content .empty").show()
							.siblings(".have").hide();
					}
				}
			})
		})
	},
	changeType:function(){
		$(".m-search-qh").on("click",function(){
			let oBtn =$(".m-search-main-content-have-lists ul");
			if(oBtn.hasClass("double")){
				oBtn.removeClass("double");
				$(".m-search-qh img").attr({
					"src" : "../images/icon-search-single.jpg"
				})
			}else{
				$(".m-search-qh img").attr({
					"src" : "../images/icon-search-double.jpg"
				})
				oBtn.addClass("double");
			}
		})
	},
	changeSort:function(){
		$(".m-search-main-tab li").each(function(index,elem){
			$(elem).on("click",function(){
				$(".m-common-spinner").show();
				$(elem).addClass("cur").siblings("li").removeClass("cur");
				let keywords = $(".m-search-header-search input").val(),
				field = $(elem).attr("data-type"),
				sort = $(elem).attr("data-sort") || "ASC",
				page = 1,
				dataUrl = oDomain + "/home/Goods/searchGoods",
				param;
				if(!keywords || keywords == ""){
					keywords = sessionStorage.keywords || "";
				}
				param = {
					"keywords" : keywords,
					"field" : field,
					"sort" : sort,
					"page" : page
				};
				jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
					$(".m-common-spinner").hide();
					console.log(data)
					if(data.code ==0){
						if(data.data.length >0){
							$(".total-num").text(data.data.length);
							let oData = data.data,
								showList = new Array();
							for(let i=0;i<oData.length;i++){
								if(i<20){
									showList.push(oData[i]);
								}
							}
							let oHtml = template("listTpl",showList);
							$(".m-search-main-content-have-lists ul").html(oHtml);
							$(".m-search-main-content .have").show()
								.siblings(".empty").hide();
							$('.M-box').pagination({
							    totalData:data.data.length,
							    showData:20,
							    coping:true,
							    count:3,
							    current:1,
							    prevContent:"＜ 前へ",
							    nextContent:"次へ ＞",
							    callback:function(v){
							    	$(".M-box").css({
							    		"width":"auto",
							    		"display":"inline-block"
							    	})
							    	let oW = $(".M-box").width()+20;
							    	$(".M-box").css({
							    		"width":oW,
							    		"display":"block",
							    		"margin": "0 auto"
							    	})
							    	let pageNo = v.getCurrent(),
							    		prePage = pageNo -1;
							    		showList = new Array();
									for(let i=prePage*20;i<oData.length;i++){
										if(i<pageNo*20){
											showList.push(oData[i]);
										}
									}
							    	console.log(v.getCurrent());
							    	let oHtml = template("listTpl",showList);
									$(".m-search-main-content-have-lists ul").html(oHtml);
							    }
							},function(){
						    	$(".M-box").css({
						    		"width":"auto",
						    		"display":"inline-block"
						    	})
						    	let oW = $(".M-box").width()+20;
								$(".M-box").css({
						    		"width":oW,
						    		"display":"block",
						    		"margin": "0 auto"
						    	})
							});	
						}else{
							$(".m-search-main-content .empty").show()
								.siblings(".have").hide();
						}
					}
				})
			})
		})
	},
	oNext:function(){
		$(".m-search-main-content-have-lists").on("click","li",function(){
			localStorage.goodsId = $(this).attr("data-goodsid");
			window.location.href = "detail.html";
		})
	}
}
if(sessionId && sessionId != ""){
	search.init();
}else{
	getSession.data(function(){
		search.init();
	})
}
