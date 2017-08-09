let sessionId = sessionStorage.sessionId || "";
let shoppingInfo = {
	init:function(){
		this.oLoad();			//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getProduct();		//产品渲染
		//this.getInfo();			//获取类别Ps:getProduct调用
		this.openMore();			//展开更多

	},
	oLoad:function(){
		$(".product-btn").on("click",".go",function(){
			let productList = JSON.parse(sessionStorage.productList),
				$proList = $(".m-shoppinginfo-product-list"),
				$addList = $(".m-shoppinginfo-add-box");
				for(let i=0;i<$addList.length;i++){
					let goodsId = $addList.eq(i).attr("data-goodsid");
					for(let j=0;j<productList.goods_list.length;j++){
						if(productList.goods_list[j].goods_id == goodsId){
							productList.goods_list[j].shadow = $addList.eq(i).find("input[name='font']:checked").val() || "";
							productList.goods_list[j].dummy = $addList.eq(i).find("input[name='atari']:checked").val() || "";
							productList.goods_list[j].diy = $addList.eq(i).find("input[name='sculpture-hand']:checked").val() || "";
						}
					}
				}
				console.log(productList);
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
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				if(data.code == 0){
					data.data["goodsId"] = $list.eq(i).attr("data-goodsid");					
					let oHtml = template("sealTpl",data.data);
					$list.eq(i).after(oHtml);
				}
			})
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
				$(that).text("その他の書体を見る　↓")
			}else{
				$(that).text("閉じる　↑")				
			}
			$(that).siblings(".m-shoppinginfo-atari-lists-box").toggleClass("f-height")
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
