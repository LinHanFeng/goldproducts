"use strict";

var oDomain = "http://www.coskobo.com/appserver/index.php";
$(function () {
	var index = {
		init: function init() {
			this.oLoad(); //页面初始化
			this.getBanner(); //banner获取
			this.oSwiper(); //滑动
			this.getNews(); //news获取
			this.getModules(); //获取模块信息
			//this.closeMore();		//关闭更多PS:getModules调用
			this.getTab(); //获取最新情报和知识
			//this.changeTab();		//tab切换PS:getTab调用
			this.oMenu(); //菜单详情
			//this.goInfo();			//跳转详情页或者分类页PS:getModules调用
		},
		oLoad: function oLoad() {
			$(".m-common-menu").on("click", function () {
				$(".m-common-menu-box").show();
				var dataUrl = oDomain + "/home/index/menuList";
				jsonData.getData(dataUrl, "GET", {}, function (data) {
					console.log(data);
					var oHtml = template("menuTpl", data);
					$(".m-common-menu-content-lists").html(oHtml);
					if (data.data.other && data.data.other != "") {
						for (var i = 0; i < data.data.other.length; i++) {
							var _oHtml = '<div class="m-common-menu-content-list">' + '<a href="' + data.data.other[i].href + '">' + data.data.other[i].name;
							'</a>' + '</div>';
							$(".m-common-menu-content-lists").append();
						}
					}
				});
			});
			var dataUrl = oDomain + "/home/index/indexBaseInfo";
			jsonData.getData(dataUrl, "GET", {}, function (data) {
				if (data.code == 0) {
					console.log(data);
					if (data.data.title && data.data.title != "" && data.data.title != null) {
						$("title").text(data.data.title);
					}
					if (data.data.keywords && data.data.keywords != "" && data.data.keywords != null) {
						$("head").append("<meta name='Keywords' Content='" + data.data.keywords + "'>");
					}
					if (data.data.description && data.data.description != "" && data.data.description != null) {
						$("head").append("<meta name='Description' Content='" + data.data.description + "'>");
					}
					if (data.data.pagedesc && data.data.pagedesc != "" && data.data.pagedesc != null) {
						$(".m-index-banner").find(".m-index-title").html(data.data.pagedesc);
					} else {
						$(".m-index-banner").find(".m-index-title").hide();
					}
				}
			});
		},
		getBanner: function getBanner() {
			var dataUrl = oDomain + "/home/banner/bannerlistindex";
			jsonData.getData(dataUrl, "GET", {}, function (data) {
				console.log(data);
				var oHtml = template("bannerTpl", data);
				$(".m-index-banner").find(".swiper-wrapper").html(oHtml);
				var mySwiper = new Swiper('.swiper-container-banner', {
					autoplay: 3000,
					loop: true,
					direction: 'horizontal',
					pagination: '.swiper-banner-pagination'
				});
			});
		},
		getNews: function getNews() {
			var dataUrl = oDomain + "/home/news/newslistindex";
			jsonData.getData(dataUrl, "GET", {}, function (data) {
				console.log(data);
				var oHtml = template("newsTpl", data);
				$(".swiper-news-container .swiper-wrapper").html(oHtml);
				var mySwiper = new Swiper('.swiper-news-container', {
					// autoplay: 5000,//可选选项，自动滑动,
					autoplay: 3000,
					loop: true,
					direction: 'vertical'
				});
			});
			if ($(".m-tab-header .jt").hasClass("jtx")) {
				var param = { "type": "Newest" };
				jsonData.getData(dataUrl, "GET", { "data": param }, function (data) {
					sessionStorage.Newest = JSON.stringify(data);
					var oHtml = template("tabTpl", data);
					$(".m-index-tab-lists").html(oHtml);
				});
			} else if ($(".m-tab-header .jt").hasClass("right-cur")) {
				var _param = { "type": "knowledge" };
				jsonData.getData(dataUrl, "GET", { "data": _param }, function (data) {
					sessionStorage.knowledgeInfo = JSON.stringify(data);
					var oHtml = template("tabTpl", data);
					$(".m-index-tab-lists").html(oHtml);
				});
			}
			$(".m-tab-header").on("click", ".m-tab-intelligence", function () {
				var data = void 0;
				if (sessionStorage.Newest) {
					data = JSON.parse(sessionStorage.Newest);
				} else {
					var _param2 = { "type": "Newest" };
					jsonData.getData(dataUrl, "GET", { "data": _param2 }, function (data) {
						sessionStorage.Newest = JSON.stringify(data);
						data = data;
					});
				}
				var oHtml = template("tabTpl", data);
				$(".m-index-tab-lists").html(oHtml);
			});
			$(".m-tab-header").on("click", ".m-tab-knowledge", function () {
				var data = void 0;
				if (sessionStorage.knowledgeInfo) {
					data = JSON.parse(sessionStorage.knowledgeInfo);
				} else {
					var _param3 = { "type": "knowledge" };
					jsonData.getData(dataUrl, "GET", { "data": _param3 }, function (data) {
						sessionStorage.knowledgeInfo = JSON.stringify(data);
						data = data;
					});
				}
				var oHtml = template("tabTpl", data);
				$(".m-index-tab-lists").html(oHtml);
			});
		},
		oSwiper: function oSwiper() {
			var mySwiper = new Swiper('.swiper-container', {
				// autoplay: 5000,//可选选项，自动滑动,
				prevButton: '.swiper-button-prev',
				nextButton: '.swiper-button-next',
				direction: 'horizontal'
			});
		},
		getModules: function getModules() {
			var dataUrl = oDomain + "/home/index/moduleList";
			if (sessionStorage.modulelist && sessionStorage.modulelist != "") {
				console.log(JSON.parse(sessionStorage.modulelist));
				var oHtml = template("moduleTpl", JSON.parse(sessionStorage.modulelist));
				$("#product-box").html(oHtml);
				index.closeMore();
				// index.oSwiper();
				index.goInfo();
			} else {
				jsonData.getData(dataUrl, "GET", {}, function (data) {
					console.log(data);
					sessionStorage.modulelist = JSON.stringify(data);
					var oHtml = template("moduleTpl", data);
					$("#product-box").html(oHtml);
					index.closeMore();
					// index.oSwiper();
					index.goInfo();
				});
			}
		},
		goInfo: function goInfo() {
			$(".m-product-category-list .onelist").each(function (index, elem) {
				$(elem).on("click", function () {
					window.location.href = "./classify.html?catId=" + $(elem).attr("data-id");
				});
			});
			$(".m-product-category-list li").each(function (index, elem) {
				$(elem).on("click", function () {
					window.location.href = "./classify.html?catId=" + $(elem).attr("data-id");
				});
			});
			$(".m-product-goods-list .onelist").each(function (index, elem) {
				$(elem).on("click", function () {
					window.location.href = "./classify.html?catId=" + $(elem).attr("data-id");
				});
			});
			$(".m-product-goods-list li").each(function (index, elem) {
				$(elem).on("click", function () {
					window.location.href = "./detail.html?goodsId=" + $(elem).attr("data-id");
				});
			});
			$(".m-product-shuffling-list li").each(function (index, elem) {
				$(elem).on("click", function () {
					window.location.href = "./detail.html?goodsId=" + $(elem).attr("data-id");
				});
			});
		},
		closeMore: function closeMore() {
			$(".m-product-list-content-more").each(function (index, elem) {
				$(elem).on("click", function () {
					$(elem).parents(".m-product-list-content").find(".m-product-list-more-content").toggle();
				});
			});
		},
		getTab: function getTab() {
			index.changeTab();
		},
		changeTab: function changeTab() {
			$(".m-index-tab").on("click", ".m-tab-intelligence,.m-tab-knowledge", function () {
				if ($(this).hasClass('m-tab-knowledge')) {
					$(".m-index-tab .jt").addClass("right-cur").removeClass("jtx");
				} else {
					$(".m-index-tab .jt").addClass("jtx").removeClass("right-cur");
				}
			});
		},
		oMenu: function oMenu() {
			$(".m-common-menu-content-list-header").each(function (index, elem) {
				$(elem).on("click", function () {
					$(elem).siblings("ul").toggle();
				});
			});
			$(".m-common-menu-content-header").find(".btn").on("click", function () {
				$(".m-common-menu-box").hide();
			});
			$(".m-common-menu-close").on("click", function () {
				$(".m-common-menu-box").hide();
			});
		}
	};
	index.init();
});