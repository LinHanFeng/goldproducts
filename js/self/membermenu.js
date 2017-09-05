let sessionId = sessionStorage.sessionId || "",userId = localStorage.userId || "";
const membermenu = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getPoint();		//获取积分
		this.getOrder();		//获取订单记录
		this.goCar();			//跳转购物车
		this.oNext();			//下一步
	},
	oLoad : function(){
		if(!userId || userId == ""){
			window.location.href = "login.html";
		}
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
			membermenu.oMenu();
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
	getPoint:function(){
		let dataUrl = oDomain + "/home/user/userMenuShow",
			param = {
				"userId" : userId
			};
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			if(data.code == 0){
				$(".m-common-module-notice").find("em").text(data.data.consignee)
				$(".m-membermenu-page").find(".total-point").text(data.data.ck_user_point+"ポイント")
			}
		})
	},
	getOrder:function(){
		let dataUrl = oDomain + "/home/user/orderList",
			param = {
				"userId" : userId,
				"page" : 1
			};
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			if(data.code == 0){
				if(data.data.length > 0){
					let oHtml = template("orderTpl",data);
					$(".m-membermenu-history tbody").html(oHtml);
					$(".m-membermenu-history tbody").find("tr").each(function(index,elem){
						$(elem).on("click",function(){
							window.location.href = "http://www.inkans.com/order-done-"+$(elem).attr("data-go")+".html"
						})
					})
				}
			}
		})
	},
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	oNext:function(){
		$(".f-out").on("click",function(){
			let dataUrl = oDomain + "/home/user/logout",
			param = {
				"userId" : userId
			};
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				if(data.code ==0){
					localStorage.removeItem("userId");
					window.location.href = "login.html";
				}
			})
		})
	}
}
if(sessionId && sessionId != ""){
	membermenu.init();
}else{
	getSession.data(function(){
		membermenu.init();
	})
}
