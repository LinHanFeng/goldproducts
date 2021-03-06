let goodsId,sessionId = sessionStorage.sessionId || "",
	userId = localStorage.userId || "";
if(getQueryString("goodsId")){
	goodsId = getQueryString("goodsId");
}else if(localStorage.goodsId){
	goodsId = localStorage.goodsId;
}else{
	goodsId = "";
}
const detail = {
	init:function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表
		//this.oMenu();		//菜单详情
		this.getDetail();	//获取详情
		this.getIncar();	//加入购物车
		this.goCar();		//跳转购物车
	},
	oLoad:function(){
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
		$(".m-detail-backbtn").on("click",function(){
			window.history.back();
		})
		/*搜索*/
		$(".search-box .search-btn").on("click",function(){
			let oVal = $(".search-box input").val();
			sessionStorage.searchVal = oVal;
			window.location.href = "search.html?search=1";
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
			detail.oMenu();
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
	getDetail:function(){
		let dataUrl = oDomain + "/home/Goods/goodsInfo";
		let param = {
			"goodsId":goodsId
		}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			if(data.code==0){
				console.log(data.data);
				$(".m-detail-product .pic img").attr({"src":data.data.goods_img});
				$(".m-detail-product .name").text(data.data.goods_name);
				if(data.data.fast != "1"){
					$(".f-fast").hide();
				}
				if(data.data.ten_years != "1"){
					$(".f-years").hide();
				}
				if(data.data.shadow != "1"){
					$(".f-shadow").hide();
				}
				if(data.data.dummy != "1"){
					$(".f-dummy").hide();
				}
				$(".m-detail-engravingins").html(data.data.goods_desc);
			}else{
				console.error("请求失败");
			}
		})
	},
	getIncar:function(){
		$(".m-detail-addcar").on("click",function(){
			$(".m-common-spinner").show();
			let sessionId = sessionStorage.sessionId || "",
				userId = localStorage.userId || 0,
				number = $("#num").val() || 1;
			if(!sessionId || sessionId ==""){
				getSession.data(function(){
					let dataUrl = oDomain + "/home/cart/addToCart";
					let param = {"sessionId":sessionId,"userId":userId,"goodsId":goodsId,"number":number}
					jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
					$(".m-common-spinner").hide();
						if(data.code == 0){
							window.location.href = "shoppingcart.html";
						}
					})
				});
			}else{
				let dataUrl = oDomain + "/home/cart/addToCart";
				let param = {"sessionId":sessionId,"userId":userId,"goodsId":goodsId,"number":number}
				jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				$(".m-common-spinner").hide();
					if(data.code == 0){
						window.location.href = "shoppingcart.html";
					}
				})
			}
		})
	}
}
if(sessionId && sessionId != ""){
	detail.init();
}else{
	getSession.data(function(){
		detail.init();
	})
}