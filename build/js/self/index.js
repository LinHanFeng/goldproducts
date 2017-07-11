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
			this.getTab(); //获取最新情报和知识
			//this.changeTab();		//tab切换PS:getTab调用
		},
		oLoad: function oLoad() {},
		getBanner: function getBanner() {
			var dataUrl = oDomain + "/home/banner/bannerlistindex";
			jsonData.getData(dataUrl, "GET", {}, function (data) {
				console.log(data);
				var oHtml = template("bannerTpl", data);
				$(".m-index-banner").find(".swiper-wrapper").html(oHtml);
				var mySwiper = new Swiper('.swiper-container-banner', {
					direction: 'horizontal'
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
				// index.oSwiper();
			} else {
				jsonData.getData(dataUrl, "GET", {}, function (data) {
					console.log(data);
					sessionStorage.modulelist = JSON.stringify(data);
					var oHtml = template("moduleTpl", data);
					$("#product-box").html(oHtml);
					// index.oSwiper();
				});
			}
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
		}
	};
	index.init();
});