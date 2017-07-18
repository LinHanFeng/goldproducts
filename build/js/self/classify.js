"use strict";

var oDomain = "http://www.coskobo.com/appserver/index.php";
var classify = {
	init: function init() {
		this.oLoad();
	},
	oLoad: function oLoad() {
		var dataUrl = oDomain + "/home/category/cateBaseInfo";
		jsonData.getData(dataUrl, "GRT", {}, function (data) {
			console.log(data);
		});
	}
};
classify.init();