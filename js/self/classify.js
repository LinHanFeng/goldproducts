const oDomain = "http://www.coskobo.com/appserver/index.php";
const catId = getQueryString("catId");
const classify = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.getBasics();	//获取分类模块基本信息
		this.getAllseal();	//获取所有印材
		this.getGoodsList();		//获取分类商品
		//this.goInfo();			//跳转详情页PS:getGoodsList调用
	},
	oLoad : function(){
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
			classify.oMenu();
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
	getBasics:function(){
		let dataUrl = oDomain + "/home/category/cateBaseInfo";
		let param = {
			"catId":catId
		}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			$(".f-nowpage a").text(data.data.cat_name);
			for(let v in data.data){
				console.log(v);
				console.log(data.data[v]);
				if(v != "cat_id" || v != "cat_name"){
					$(".m-classify-ranking").show();
					$(".m-classify-ranking .content").append(data.data[v]);
				}
			}
		})
	},
	getAllseal:function(){
		let dataUrl = oDomain + "/home/category/materiallist";
		let param = {
			"catId":catId
		}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			if(data.code == 0){
				for(let i=0;i<data.data.length;i++){
					let oName = data.data[i].name;
					if(oName.indexOf("<br />")>0){
						data.data[i].name = oName.split("<br />");
					}
				}
				sessionStorage.materiallist = JSON.stringify(data);
				if(data.data && data.data != ""){
					let oHtml = template("classifyTpl",data);
					$(".m-classify-type").find(".content").html(oHtml);
					$(".m-classify-type .btn").on("click",function(){
						$(".m-classify-type ul").toggle();
					})
				}else{
					$(".m-classify-type").hide();
				}
			}
		})
	},
	getGoodsList:function(){
		let dataUrl = oDomain + "/home/category/cateGoodsList";
		let param = {
			"catId":catId
		}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
			console.log(data);
			if(data.code == 0){
				let oHtml = template("moduleTpl",data);
				$(".m-classify-modules").html(oHtml);
				classify.goInfo();
			}
		})
	},
	goInfo:function(){
		$(".modules-list-content-scroll li").each(function(index,elem){
			$(elem).on("click",".img,.detail",function(){
				window.location.href = "detail.html?goodsId="+$(elem).attr("data-id");
			})
		})
	}
}
classify.init();