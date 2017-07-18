const oDomain = "http://www.coskobo.com/appserver/index.php";
const classify = {
	init : function(){
		this.oLoad();
	},
	oLoad : function(){
		let dataUrl = oDomain + "/home/category/cateBaseInfo";
		jsonData.getData(dataUrl,"GRT",{},function(data){
			console.log(data);
		})
	}
}
classify.init();