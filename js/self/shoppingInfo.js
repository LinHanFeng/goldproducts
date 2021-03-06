let sessionId = sessionStorage.sessionId || "",
	userId = localStorage.userId || "";
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
		/*搜索*/
		$(".search-box .search-btn").on("click",function(){
			let oVal = $(".search-box input").val();
			sessionStorage.searchVal = oVal;
			window.location.href = "search.html?search=1";
		})
		if(userId && userId != ""){
			$(".m-shoppingcart-login").hide();
			let consignee = sessionStorage.consignee || "";
			if(consignee && consignee != ""){
				$(".m-common-step-text").find("em").text(consignee);
			}else{
				let dataUrl = oDomain + "/home/user/userMenuShow",
				param = {
					"userId" : userId
				};
				jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
					console.log(data);
					if(data.code == 0){
						$(".m-common-step-text").find("em").text(data.data.consignee);
						sessionStorage.consignee = data.data.consignee;
					}
				})
			}
		}
		let dataUrl = oDomain + "/home/cart/cartTotal";
		let param = {"sessionId":sessionId}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(result){
			if(result.code == 0){
				$(".m-common-car em").text(result.data.count);
			}
		})
		/*
		*
		*确认提交
		*/
		$(".product-btn").on("click",".go",function(){
			$(".m-common-spinner").show();
			let productList = JSON.parse(sessionStorage.productList),
				$addList = $(".m-shoppinginfo-product-list-param-list"),
				list = {},
				sealParam = new Array();
				for(let i=0;i<$addList.length;i++){
					let goodsId = $addList.eq(i).attr("data-goodsid"),
						setgoodsId = $addList.eq(i).attr("data-setgoodsid") || "",
						id = $addList.eq(i).attr("data-id"),
						parentid = $addList.eq(i).attr("data-parentid"),
						shadow = $addList.eq(i).find("input[name='font"+parentid+id+"']:checked").val() || "",
						shadow_name = $addList.eq(i).find("input[name='font"+parentid+id+"']:checked").siblings("label").text() || "",
						dummy = $addList.eq(i).find("input[name='atari"+parentid+id+"']:checked").val() || "",
						dummy_name = $addList.eq(i).find("input[name='atari"+parentid+id+"']:checked").closest("li").find("p").text() || "",
						diy = $addList.eq(i).find("input[name='sculpture-hand"+parentid+id+"']:checked").val() || "",
						diy_name = $addList.eq(i).find("input[name='sculpture-hand"+parentid+id+"']:checked").closest("div.sculpture-hand-box").find("label span").text() || "",
						add_box_list = $addList.eq(i).find("input[name='additional"+parentid+id+"']:checked").val() || "",
						add_box_list_name = $addList.eq(i).find("input[name='additional"+parentid+id+"']:checked").closest("li").find("p").text() || "",
						word_last_name = $addList.eq(i).find("input[name='word_last_name"+parentid+id+"']").val() || "",
						sculpture_code = $addList.eq(i).find("input[name='sculpture-code"+parentid+id+"']").val() || "",
						shadow_confirm = $addList.eq(i).find("input[name='sculpture-confirm"+parentid+id+"']:checked").val() || "",
						shadow_confirm_name = $addList.eq(i).find("input[name='sculpture-confirm"+parentid+id+"']:checked").closest("div.sculpture-confirm-box").find("label span").text() || "",
						catId = $addList.eq(i).attr("data-catid") || "";
					if(word_last_name == ""){
						$(".m-popup-small-box .m-popup-small").text("彫刻名を記入してください");
						$(".m-popup-small-box").show();
						setTimeout(function(){
							$(".m-popup-small-box").hide();
						},800);
						$(".m-common-spinner").hide();
						window.location.href="#word_last_name"+id;
						return false;
					}
					productList.data[parentid].param[id].parentid = parentid;
					productList.data[parentid].param[id].shadow = shadow;
					productList.data[parentid].param[id].shadow_name = shadow_name;
					productList.data[parentid].param[id].dummy = dummy;
					productList.data[parentid].param[id].dummy_name = dummy_name;
					productList.data[parentid].param[id].diy = diy;
					productList.data[parentid].param[id].diy_name = diy_name;
					productList.data[parentid].param[id].add_box_list = add_box_list;
					productList.data[parentid].param[id].add_box_list_name = add_box_list_name;
					productList.data[parentid].param[id].word_last_name = word_last_name;
					productList.data[parentid].param[id].sculpture_code = sculpture_code;
					productList.data[parentid].param[id].shadow_confirm = shadow_confirm;
					productList.data[parentid].param[id].shadow_confirm_name = shadow_confirm_name;
					list = {
						"user_id" : 0,
						"goods_id" : goodsId,
						"kit_id" : setgoodsId,
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
				let dataUrl = oDomain + "/home/cart/addCartParam",
				param = {
					"sessionId":sessionId,
					"sealParam": sealParam
				};
				sessionStorage.productList = JSON.stringify(productList);
				jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
					if(data.code == 0){
						$(".m-common-spinner").hide();
						window.location.href = "shoppingpay.html";				
					}
				});
		})
		$(".product-btn").on("click",".back",function(){
			window.history.go(-1);
		})
		$(document).on("click",".f-jz",function(){
			$(".m-popup-jz-box").show();
		})
		$(document).on("click",".m-popup-jz-close",function(){
			$(".m-popup-jz-box").hide();
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
		let dataUrl = oDomain + "/home/cart/getCartParam",
		param = {"sessionId":sessionId};
		if(sessionStorage.productList){
			let oHtml = template("cartListTpl",JSON.parse(sessionStorage.productList));
			$(".m-shoppinginfo-product-lists").html(oHtml);
			shoppingInfo.getInfo();
		}else{
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				if(data.code == 0){
					let oHtml = template("cartListTpl",data);
					$(".m-shoppinginfo-product-lists").html(oHtml);
					sessionStorage.productList = JSON.stringify(data);
					shoppingInfo.getInfo();
				}
			})
		}
		return;
	},
	getInfo:function(){
		let dataUrl = oDomain + "/home/param/sealParam",
		$list = $(".m-shoppinginfo-product-list-param-list");
		for(let i=0;i<$list.length;i++){			
			let param = {
				"catId" : $list.eq(i).attr("data-catid"),
				"goodsId" : $list.eq(i).attr("data-goodsid"),
				"set_goods_id" : $list.eq(i).attr("data-setgoodsid") || "0"
			}
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				if(data.code == 0){
					data.data["goodsId"] = $list.eq(i).attr("data-goodsid");
					data.data["setGoodsId"] = $list.eq(i).attr("data-setgoodsid") || "0";
					data.data["catId"] = $list.eq(i).attr("data-catid");
					data.data["parentid"] = $list.eq(i).attr("data-parentid");	
					data.data["id"] = $list.eq(i).attr("data-id");	
					let oHtml = template("sealTpl",data.data);
					$list.eq(i).find(".m-shoppinginfo-add-box").html(oHtml);
					shoppingInfo.wInfo($list.eq(i).attr("data-parentid"),$list.eq(i).attr("data-id"));
				}
			})
		}
	},
	wInfo:function(pid,cid){
		let productList = JSON.parse(sessionStorage.productList),
		oldInfo = "",list=productList.data;
		for(let i=0;i<list.length;i++){
			let oList = list[pid].param[cid];
			let add_box_list_default = oList.add_box_list || undefined,
			diy_default = oList.diy || undefined,
			dummy_default = oList.dummy || undefined,
			word_last_name_default = oList.word_last_name || undefined,
			shadow_default = oList.shadow || undefined,
			shadow_confirm_default = oList.shadow_confirm || undefined,
			word_old_default = oList.sculpture_code || undefined,
			goodsId = oList.goods_id,
			parentid = pid,
			id = cid;
			if(add_box_list_default && add_box_list_default !=""){
				$("input#additional"+parentid+id+add_box_list_default).attr({"checked":"checked"});
			}
			if(diy_default && diy_default !=""){
				$("input#sculpture-hand"+parentid+id+diy_default).attr({"checked":"checked"});
			}
			if(dummy_default && dummy_default !=""){
				$("input#atari"+parentid+id+dummy_default).attr({"checked":"checked"});
			}
			if(word_last_name_default && word_last_name_default !=""){
				$("input#word_last_name"+parentid+id).val(word_last_name_default);
			}
			if(shadow_default && shadow_default !=""){
				$("input#font"+parentid+id+shadow_default).attr({"checked":"checked"});
			}
			if(word_old_default && word_old_default !=""){
				$("input#sculpture-code"+parentid+id).val(word_old_default);
			}
			if(shadow_confirm_default && shadow_confirm_default !=""){
				$("input#sculpture-confirm"+parentid+id+shadow_confirm_default).attr({"checked":"checked"})
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
