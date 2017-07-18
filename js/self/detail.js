const oDomain = "http://www.coskobo.com/appserver/index.php";
const detail = {
	init:function(){
		this.oLoad();		//页面初始化
		this.oMenu();		//菜单详情
		this.getDetail();	//获取详情
	},
	oLoad:function(){
		$(".m-common-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
		$(".m-detail-backbtn").on("click",function(){
			window.history.back();
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
		jsonData.getData(dataUrl,"GET",{"goodsId":"13261"},function(data){
			console.log(data);
		})
	}
}
detail.init();