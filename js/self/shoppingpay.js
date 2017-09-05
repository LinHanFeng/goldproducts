let sessionId = sessionStorage.sessionId || "",userId = localStorage.userId || "";
let shoppingpay = {
	init:function(){
		this.oLoad();			//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar();			//跳转购物车
		this.getProduct();		//产品渲染
		//this.getInfo();			//获取类别Ps:getProduct调用
		this.choosePay();			//选择付款方式
		this.selectTime();			//选择时间
		this.oNext();			//下一步
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
		if(userId && userId !=""){
			$(".m-shoppingpay-product-notice").find(".login").show()
				.siblings(".logout").hide();

			let dataUrl = oDomain + "/home/user/userMenuShow",
				param = {
					"userId" : userId
				};
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				if(data.code == 0){
					$(".m-common-step-text").find("em").text(data.data.consignee);
					$(".m-shoppingpay-product-notice").find(".name").text(data.data.consignee);
					$(".m-shoppingpay-product-notice").find(".total-point").text(data.data.ck_user_point);
					if(data.data.ck_user_point == "0" || data.data.ck_user_point == 0){
						$(".m-shoppingpay-product-notice").find("input[name='point']").val(0).attr("readonly","readonly");
					}else{
						$(".m-shoppingpay-product-notice").find("input[name='point']").val(data.data.ck_user_point);
					}
					$("input[name='point']").on("blur",function(){
						if($(this).val()>data.data.ck_user_point){
							$(this).val(data.data.ck_user_point);
						}
					})
				}
			})
		}
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
	getProduct:function(){
		let dataUrl = oDomain + "/home/cart/cartList";
		let param ={"sessionId":sessionId,"showall":0};
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			if(data.code == 0){
				if(data.data.goods_list.length>0){
					sessionStorage.payProductLists = JSON.stringify(data);
					$(".m-shoppingpay-product-price .price").text(data.data.total.format_goods_price);
					$(".m-shoppingpay-product-notice .logout em").text(data.data.total.order_get_point);
					let oHtml = template("cartListTpl",data.data);
					$(".m-shoppingpay-product-lists").html(oHtml);
				}else{
					window.location.href ="shoppingcart.html"; 
				}
			}else{
				failLoad();
			}
		})
	},
	getInfo:function(){
		
	},
	choosePay:function(){
		$(".m-shoppingpay-payment-lists").on("click","input,label",function(){
			$(this).closest(".head").siblings(".content").show();
			$(this).closest(".m-shoppingpay-payment-box").siblings().find(".content").hide();
			if($(this).val() != "credit"){
				$("#normal").prop("checked","checked");
				$(".f-today").find("input").attr({"disabled":"disabled"});
				$(".f-today").find("label,label em").css({
					"color":"#ccc"
				});
			}else{
				$(".f-today").find("input").removeAttr("disabled");
				$(".f-today").find("label").css({
					"color":"#000"
				});$(".f-today").find("label em").css({
					"color":"#f00"
				});
			}
		})
	},
	selectTime:function(){
		let selectMonth = new MobileSelect({
		    trigger: '#month', 
		    title: '月',  
		    wheels: [
		                {data:['01','02','03','04','05','06','07','08','09','10','11','12']}
		            ],
		    // position:[2], //Initialize positioning
		    callback:function(i,d){
		    	$("#month").val(d);
		    }
		});
		let dataUrl = oDomain + "/home/cart/shoppingpay",
			param = {
				"sessionId" : sessionId,
				"showall" : 0
			};
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			if(data.code == 0){
				if(data.data.is_allow != 0){
					$(".f-today").find("input").attr({"disabled":"disabled"});
					$(".f-today").find("label,label em").css({
						"color":"#ccc"
					});
				}
				let selectYear = new MobileSelect({
				    trigger: '#year', 
				    title: '年',  
				    wheels: [
				                {
				                	data:data.data.year
				                }
				            ],
				    // position:[2], //Initialize positioning
				    callback:function(i,d){
				    	$("#year").val(d);
				    }
				});
			}else{
				failLoad();
			}
			
		})
	},
	oNext:function(){
		$(".product-btn").on("click",".go",function(){
			$(".m-common-spinner").show();
			let dataUrl = oDomain + "/home/cart/payment",
				type = $("input[name='payment']:checked").val(),
				order_sameday = $("input[name='deliver']:checked").val() || "1",
				use_point = $(".m-shoppingpay-product-notice input[name='point']").val() || 0,
				param;
			if(type == "credit"){
				let credit_card = $("#company").val() || "",
					credit_number = $("#card").val(),
					credit_term =$("#month").val() + $("#year").val(),
					credit_name = $("#owner").val();
					if(!credit_card || credit_card == ""|| !credit_number || credit_number == "" || !credit_term || credit_term == "" || !credit_name || credit_name == ""){
						$(".m-popup-small-box").show();
						$(".m-popup-small-box .m-popup-small").text("情報を完全にしてください");
						setTimeout(function(){
							$(".m-popup-small-box").hide();
							$(".m-popup-small-box .m-popup-small").text("");
						},800)
						$(".m-common-spinner").hide();
						return false;
					}
				param = {
					"sessionId" : sessionId,
					"payment_type" : type,
					"order_sameday_off" : order_sameday,
					"credit_card" : credit_card,
					"credit_number" : credit_number,
					"credit_term" : credit_term,
					"credit_name" : credit_name,
					"use_point"	: use_point
				};
			}else{
				param = {
					"sessionId" : sessionId,
					"payment_type" : type,
					"order_sameday_off" : order_sameday
				}
			}
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				if(data.code == 0){
					$(".m-common-spinner").hide();
					window.location.href = "shoppingaddr.html";
				}
			})
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
