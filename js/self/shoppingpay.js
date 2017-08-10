let sessionId = sessionStorage.sessionId || "";
let shoppingpay = {
	init:function(){
		this.oLoad();			//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar();			//跳转购物车
		this.getProduct();		//产品渲染
		//this.getInfo();			//获取类别Ps:getProduct调用
		this.choosePay();			//选择付款方式

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
		$(".product-btn .back").on("click",function(){
			window.history.back();
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
			shoppingpay.oMenu();
		})
		$(".m-common-menu,.m-common-stick-menu").on("click",function(){
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
	},
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	getProduct:function(){
		let oList = JSON.parse(sessionStorage.productList);
		console.log(oList);
		let oHtml = template("cartListTpl",oList);
		$(".m-shoppingpay-product-lists").html(oHtml);
		$(".m-shoppingpay-product-price .price").text(oList.total.format_goods_price);
		shoppingpay.getInfo();
	},
	getInfo:function(){
		
	},
	choosePay:function(){
		$(".m-shoppingpay-payment-lists").on("click","input,label",function(){
			$(this).closest(".head").siblings(".content").show();
			$(this).closest(".m-shoppingpay-payment-box").siblings().find(".content").hide();
		})
	}
}
if(sessionId && sessionId != ""){
	shoppingpay.init();
}else{
	getSession.data(function(){
		shoppingpay.init();
	})
}
