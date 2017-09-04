"use strict";var catId=void 0,sessionId=sessionStorage.sessionId||"";localStorage.catId?catId=localStorage.catId:getQueryString("catId")?catId=getQueryString("catId"):failLoad();var classify={init:function(){this.oLoad(),this.getMenu(),this.goCar(),this.getBasics(),this.getAllseal(),this.getGoodsList()},oLoad:function(){$(window).on("scroll",function(){var o=200,t=$(window).scrollTop();t>o?($(".m-nav-bottom").show(),$(".m-common-stick").show(),$(".m-common-go-top").show()):($(".m-nav-bottom").hide(),$(".m-common-stick").hide(),$(".m-common-go-top").hide())});var o=oDomain+"/home/cart/cartTotal",t={sessionId:sessionId};jsonData.getData(o,"GET",{data:JSON.stringify(t)},function(o){0==o.code&&$(".m-common-car em").text(o.data.count)}),$(".m-common-menu").on("click",function(){$(".m-common-menu-box").show()}),$(".m-detail-backbtn").on("click",function(){window.history.back()})},getMenu:function(){var o=oDomain+"/home/index/menuList";jsonData.getData(o,"GET",{},function(o){var t=template("menuTpl",o);if($(".m-common-menu-content-lists").html(t),o.data.other&&""!=o.data.other)for(var n=0;n<o.data.other.length;n++){'<div class="m-common-menu-content-list"><a href="'+o.data.other[n].href+'">'+o.data.other[n].name;$(".m-common-menu-content-lists").append()}classify.oMenu()}),$(".m-common-menu,.m-common-stick-menu").on("click",function(){$(".m-common-menu-box").show()})},oMenu:function(){$(".m-common-menu-content-list-header").each(function(o,t){$(t).on("click",function(){$(t).find(".jt img").toggleClass("fan"),$(t).siblings("ul").toggle()})}),$(".m-common-menu-content-header").find(".btn").on("click",function(){$(".m-common-menu-box").hide()}),$(".m-common-menu-close").on("click",function(){$(".m-common-menu-box").hide()})},goCar:function(){$(".m-nav-bottom-car,.m-common-car").on("click",function(){window.location.href="shoppingcart.html"})},getBasics:function(){var o=oDomain+"/home/category/cateBaseInfo",t={catId:catId};jsonData.getData(o,"GET",{data:JSON.stringify(t)},function(o){$(".f-nowpage a").text(o.data.cat_name);for(var t in o.data)console.log(t),"cat_id"!=t&&"cat_name"!=t&&($(".m-classify-ranking").show(),$(".m-classify-ranking .content").append(o.data[t]))})},getAllseal:function(){var o=oDomain+"/home/category/materiallist",t={catId:catId};jsonData.getData(o,"GET",{data:JSON.stringify(t)},function(o){if(0==o.code){for(var t=0;t<o.data.length;t++){var n=o.data[t].name;n.indexOf("<br />")>0?o.data[t].name=n.split("<br />"):o.data[t].name=new Array(n)}if(sessionStorage.materiallist=JSON.stringify(o),o.data&&""!=o.data){var a=template("classifyTpl",o);$(".m-classify-type").find(".content").html(a),$(".m-classify-type").show(),$(".m-classify-type .btn").on("click",function(){$(".m-classify-type ul").toggle()}),classify.oTiao()}else $(".m-classify-type").hide()}})},getGoodsList:function(){var o=oDomain+"/home/category/cateGoodsList",t={catId:catId};jsonData.getData(o,"GET",{data:JSON.stringify(t)},function(o){if(0==o.code){var t=template("moduleTpl",o);$(".m-classify-modules").html(t),classify.goInfo()}})},goInfo:function(){$(".modules-list-content-scroll li").each(function(o,t){$(t).on("click",".img,.detail",function(){window.location.href="detail.html?goodsId="+$(t).attr("data-goodsid")}),$(t).on("click",".btn",function(){$(".m-common-spinner").show();var o=oDomain+"/home/cart/addToCart",n=sessionStorage.userId||0,a=$(t).closest("li").attr("data-goodsid"),i={sessionId:sessionId,userId:n,goodsId:a,number:1};jsonData.getData(o,"GET",{data:JSON.stringify(i)},function(o){console.log(o),0==o.code&&($(".m-common-spinner").hide(),window.location.href="shoppingcart.html")})})})},oTiao:function(){$(".m-classify-type li").each(function(o,t){$(t).on("click",function(){var o=$(t).attr("data-id");window.location.href="#"+o})})}};sessionId&&""!=sessionId?classify.init():getSession.data(function(){classify.init()}); oHtml = template("classifyTpl", data);
					$(".m-classify-type").find(".content").html(oHtml);
					$(".m-classify-type").show();
					$(".m-classify-type .btn").on("click", function () {
						$(".m-classify-type ul").toggle();
					});
					classify.oTiao();
				} else {
					$(".m-classify-type").hide();
				}
			}
		});
	},
	getGoodsList: function getGoodsList() {
		var dataUrl = oDomain + "/home/category/cateGoodsList";
		var param = {
			"catId": catId
		};
		jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
			if (data.code == 0) {
				var oHtml = template("moduleTpl", data);
				$(".m-classify-modules").html(oHtml);
				classify.goInfo();
			}
		});
	},
	goInfo: function goInfo() {
		$(".modules-list-content-scroll li").each(function (index, elem) {
			$(elem).on("click", ".img,.detail", function () {
				window.location.href = "detail.html?goodsId=" + $(elem).attr("data-goodsid");
			});
			$(elem).on("click", ".btn", function () {
				$(".m-common-spinner").show();
				var dataUrl = oDomain + "/home/cart/addToCart",
				    userId = sessionStorage.userId || 0,
				    goodsId = $(elem).closest("li").attr("data-goodsid");
				var param = { "sessionId": sessionId, "userId": userId, "goodsId": goodsId, "number": 1 };
				jsonData.getData(dataUrl, "GET", { "data": JSON.stringify(param) }, function (data) {
					console.log(data);
					if (data.code == 0) {
						$(".m-common-spinner").hide();
						window.location.href = "shoppingcart.html";
					}
				});
			});
		});
	},
	oTiao: function oTiao() {
		$(".m-classify-type li").each(function (index, elem) {
			$(elem).on("click", function () {
				var ov = $(elem).attr("data-id");
				window.location.href = "#" + ov;
			});
		});
	}
};

if (sessionId && sessionId != "") {
	classify.init();
} else {
	getSession.data(function () {
		classify.init();
	});
}