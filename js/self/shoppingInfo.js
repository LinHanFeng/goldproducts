let sessionId = sessionStorage.sessionId || "";
let shoppingInfo = {
	init:function(){
		this.oLoad();			//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar();		//跳转购物车
		this.getProduct();		//产品渲染
		//this.getInfo();			//获取类别Ps:getProduct调用
		//this.wInfo();			//如果有操作过则填之前的
		this.openMore();			//展开更多

	},
	oLoad:function(){
		$(window).on("scroll",function(){
			let oT = 200,
				oS = $(window).scrollTop();
			if(oS > oT){
				$(".m-common-stick").show();
				$(".m-common-go-top").show();
			}else{
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
		$(".product-btn").on("click",".go",function(){
			let productList = JSON.parse(sessionStorage.productList),
				$proList = $(".m-shoppinginfo-product-list"),
				$addList = $(".m-shoppinginfo-add-box"),
				list = {},
				sealParam = new Array();
				for(let i=0;i<$addList.length;i++){
					let goodsId = $addList.eq(i).attr("data-goodsid"),
						shadow = $addList.eq(i).find("input[name='font"+goodsId+"']:checked").val() || "",
						dummy = $addList.eq(i).find("input[name='atari"+goodsId+"']:checked").val() || "",
						diy = $addList.eq(i).find("input[name='sculpture-hand"+goodsId+"']:checked").val() || "",
						add_box_list = $addList.eq(i).find("input[name='additional"+goodsId+"']:checked").val() || "",
						word_last_name = $addList.eq(i).find("input[name='word_last_name"+goodsId+"']").val() || "",
						sculpture_code = $addList.eq(i).find("input[name='sculpture-code"+goodsId+"']").val() || "",
						shadow_confirm = $addList.eq(i).find("input[name='sculpture-confirm"+goodsId+"']").val() || "",
						catId = $addList.eq(i).attr("data-catid") || "";
					for(let j=0;j<productList.goods_list.length;j++){
						if(productList.goods_list[j].goods_id == goodsId){
							productList.goods_list[j].shadow = shadow;
							productList.goods_list[j].dummy = dummy;
							productList.goods_list[j].diy = diy;
							productList.goods_list[j].add_box_list = add_box_list;
							productList.goods_list[j].word_last_name = word_last_name;
							productList.goods_list[j].sculpture_code = sculpture_code;
							productList.goods_list[j].shadow_confirm = shadow_confirm;
						}
						list = {
							"user_id" : 0,
							"goods_id" : goodsId,
							"cat_id" : catId,
							"font" : shadow,
							"color" : "",
							"word_last_name" : word_last_name,
							"photocopy_check" : shadow_confirm,
							"add_goods_id" : add_box_list,
							"dummy" : dummy,
							"is_diy" : diy,
							"word_old" : sculpture_code 
						}
						sealParam.push(list);
					}
				}
				let dataUrl = oDomain + "/home/cart/addCartParam",
				param = {
					"sessionId":sessionId,
					"sealParam": sealParam
				};
				console.log(productList);
				sessionStorage.productList = JSON.stringify(productList);
				jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
					console.log(data);
					if(data.code == 0){
						window.location.href = "shoppingpay.html";				
					}
				});
		})
		$(".product-btn").on("click",".back",function(){
			window.history.go(-1);
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
			shoppingInfo.oMenu();
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
		let oHtml = template("cartListTpl",oList);
		$(".m-shoppinginfo-product-lists").html(oHtml);
		shoppingInfo.getInfo();
	},
	getInfo:function(){
		let dataUrl = oDomain + "/home/param/sealParam",
		$list = $(".m-shoppinginfo-product-list");
		for(let i=0;i<$list.length;i++){			
			let param = {
				"catId" : $list.eq(i).attr("data-catid"),
				"goodsId" : $list.eq(i).attr("data-goodsid")
			}
			// for(let j=0;j<productList.goods_list.length;j++){
			// 	let goodsId = productList.goods_list[j].goods_id;
			// 	if(goodsId == $list.eq(i).attr("data-goodsid")){
			// 		oldInfo = productList.goods_list[j];
			// 	}
			// }
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				if(data.code == 0){
					data.data["goodsId"] = $list.eq(i).attr("data-goodsid");				
					data.data["catId"] = $list.eq(i).attr("data-catid");				
					let oHtml = template("sealTpl",data.data);
					$list.eq(i).after(oHtml);
					shoppingInfo.wInfo();
				}
			})
		}
	},
	wInfo:function(){
		let productList = JSON.parse(sessionStorage.productList),
		oldInfo = "",list=productList.goods_list;
		for(let i=0;i<list.length;i++){
			let add_box_list_default = list[i].add_box_list || undefined,
				diy_default = list[i].diy || undefined,
				dummy_default = list[i].dummy || undefined,
				word_last_name_default = list[i].word_last_name || undefined,
				shadow_default = list[i].shadow || undefined,
				shadow_confirm_default = list[i].shadow_confirm || undefined,
				word_old_default = list[i].sculpture_code || undefined,
				goodsId = list[i].goods_id;
				if(add_box_list_default && add_box_list_default !=""){
					$("input#additional"+goodsId+add_box_list_default).attr({"checked":"checked"});
				}
				if(diy_default && diy_default !=""){
					$("input#sculpture-hand"+goodsId+diy_default).attr({"checked":"checked"});
				}
				if(dummy_default && dummy_default !=""){
					$("input#atari"+goodsId+dummy_default).attr({"checked":"checked"});
				}
				if(word_last_name_default && word_last_name_default !=""){
					$("input#word_last_name"+goodsId).val(word_last_name_default);
				}
				if(shadow_default && shadow_default !=""){
					$("input#font"+goodsId+shadow_default).attr({"checked":"checked"});
				}
				if(word_old_default && word_old_default !=""){
					$("input#sculpture-code"+goodsId).val(word_old_default);
				}
				if(shadow_confirm_default && shadow_confirm_default !=""){
					$("input#sculpture-confirm"+goodsId+shadow_confirm_default).attr({"checked":"checked"})
				}
		}
	},
	openMore:function(){
		$(".m-shoppinginfo-content").on("click",".m-shoppinginfo-font-btn",function(){
			let that = this;
			if($(that).siblings(".m-shoppinginfo-font-lists-box").hasClass("f-height")){
				$(that).text("その他の書体を見る　↓")
			}else{
				$(that).text("閉じる　↑")				
			}
			$(that).siblings(".m-shoppinginfo-font-lists-box").toggleClass("f-height")
		})
		$(".m-shoppinginfo-content").on("click",".m-shoppinginfo-atari-btn",function(){
			let that = this;
			if($(that).siblings(".m-shoppinginfo-atari-lists-box").hasClass("f-height")){
				$(that).text("その他の色を見る　↓")
			}else{
				$(that).text("閉じる　↑")				
			}
			$(that).siblings(".m-shoppinginfo-atari-lists-box").toggleClass("f-height")
		})
		$(".m-shoppinginfo-content").on("click",".m-shoppinginfo-additional-btn",function(){
			let that = this;
			if($(that).siblings(".m-shoppinginfo-atari-lists-box").hasClass("f-height")){
				$(that).text("その他の色を見る　↓")
			}else{
				$(that).text("閉じる　↑")				
			}
			$(that).siblings(".m-shoppinginfo-additional-lists-box").toggleClass("f-height")
		})
	}
}
if(sessionId && sessionId != ""){
	shoppingInfo.init();
}else{
	getSession.data(function(){
		shoppingInfo.init();
	})
}
