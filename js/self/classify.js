const oDomain = "http://www.coskobo.com/appserver/index.php";
const classify = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getBasics();	//获取分类模块基本信息
		this.getAllseal();	//获取所有印材
		this.getGoodsList();		//获取分类商品
	},
	oLoad : function(){

	},
	getBasics:function(){
		let dataUrl = oDomain + "/home/category/cateBaseInfo";
		jsonData.getData(dataUrl,"GET",{"catId":"61"},function(data){
			console.log(data);
		})
	},
	getAllseal:function(){
		let dataUrl = oDomain + "/home/category/materialist";
		jsonData.getData(dataUrl,"GET",{"catId":"61"},function(data){
			console.log(data);
		})
	},
	getGoodsList:function(){
		let dataUrl = oDomain + "/home/category/cateGoodsList";
		jsonData.getData(dataUrl,"GET",{"catId":"61"},function(data){
			console.log(data);
		})
	}
}
classify.init();