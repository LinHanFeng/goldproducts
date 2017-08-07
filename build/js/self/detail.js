const oDomain = "http://www.coskobo.com/appserver/index.php";
const goodsId = sessionStorage.goodsId || "";
const detail = {
	init:function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表
		this.oMenu();		//菜单详情
		this.getDetail();	//获取详情
		this.getIncar();	//加入购物车
	},
	oLoad:function(){
		$(window).on("scroll",function(){
			let oT =  0,
				oS = $(window).scrollTop();
			if(oS > oT){
				$(".m-nav-bottom ").show();
			}else{
				$(".m-nav-bottom ").hide();
			}
		})
		$(".m-common-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
		$(".m-detail-backbtn").on("click",function(){
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
			detail.oMenu();
		})
		$(".m-common-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
	},
	oMenu:function(){
		$(".m-common-menu-content-list-header").each(function(index,elem){
			$(elem).on("click",function(){
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
					$(".f-dummy").hide()
				}
				$(".m-detail-engravingins").html(data.data.goods_desc);
			}else{
				console.error("请求失败");
			}
		})
	},
	getIncar:function(){
		$(".m-detail-addcar").on("click",function(){
			let sessionId = sessionStorage.sessionId || "",
				userId = sessionStorage.userId || 0;
			if(!sessionId || sessionId ==""){
				getSession.data();
			}else{
				let dataUrl = oDomain + "/home/cart/addToCart";
				jsonData.getData(dataUrl,"GET",{"sessionId":sessionId,"userId":userId,"goodsId":goodsId},function(data){
					console.log(data);
				})
			}
		})
	}
}
detail.init();