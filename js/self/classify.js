const oDomain = "http://www.coskobo.com/appserver/index.php";
const classify = {
	init : function(){
		this.oLoad();		//页面初始化
		this.oMenu();		//
		this.getBasics();	//获取分类模块基本信息
		this.getAllseal();	//获取所有印材
		this.getGoodsList();		//获取分类商品
	},
	oLoad : function(){
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
	getBasics:function(){
		let dataUrl = oDomain + "/home/category/cateBaseInfo";
		let param = {
			"catId":61
		}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
		})
	},
	getAllseal:function(){
		let dataUrl = oDomain + "/home/category/materiallist";
		let param = {
			"catId":61
		}
		if(sessionStorage.materiallist){
			console.log(JSON.parse(sessionStorage.materiallist))
			let oHtml = template("classifyTpl",JSON.parse(sessionStorage.materiallist));
			$(".m-classify-type").find(".content").html(oHtml);
			$(".m-classify-type .btn").on("click",function(){
				$(".m-classify-type ul").toggle();
			})
		}else{
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				if(data.code == 0){
					sessionStorage.materiallist = JSON.stringify(data);
					let oHtml = template("classifyTpl",data);
					$(".m-classify-type").find(".content").html(oHtml);
					$(".m-classify-type .btn").on("click",function(){
						$(".m-classify-type ul").toggle();
					})
				}
			})
		}

		
	},
	getGoodsList:function(){
		let dataUrl = oDomain + "/home/category/cateGoodsList";
		let param = {
			"catId":61
		}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
		})
	}
}
classify.init();