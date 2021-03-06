let sessionId = sessionStorage.sessionId || "",code = getQueryString("code"),
	userId = localStorage.userId || "";
const forgetpwd = {
	init : function(){
		this.oLoad();		//页面初始化
		this.getMenu();		//获取菜单列表	
		// this.oMenu();		//菜单列表操作PS:getMenu调用
		this.goCar();			//跳转购物车
		this.oNext();			//下一步
	},
	oLoad : function(){
		$(window).on("scroll",function(){
			let oT = 200,
				oS = $(window).scrollTop();
			if(oS > oT){
				$(".m-nav-bottom").show();
				$(".m-common-stick").show();
				$(".m-common-go-top").show();
			}else{
				$(".m-nav-bottom").hide();
				$(".m-common-stick").hide();
				$(".m-common-go-top").hide();
			}
		})
		let dataUrl = oDomain + "/home/cart/cartTotal";
		let param = {"sessionId":sessionId}
		jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(result){
			if(result.code == 0){
				$(".m-common-car em").text(result.data.count);
			}
		})
		$(".m-common-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
		$(".m-detail-backbtn").on("click",function(){
			window.history.back();
		})
		/*搜索*/
		$(".search-box .search-btn").on("click",function(){
			let oVal = $(".search-box input").val();
			sessionStorage.searchVal = oVal;
			window.location.href = "search.html?search=1";
		})
	},
	getMenu:function(){
		let dataUrl = oDomain + "/home/index/menuList";
		jsonData.getData(dataUrl,"GET",{},function(data){
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
			forgetpwd.oMenu();
		})
		$(".m-common-menu,.m-common-stick-menu").on("click",function(){
			$(".m-common-menu-box").show();
		})
	},
	oMenu:function(){
		if(userId && userId !=""){
			$(".m-common-menu-content-list .go").closest("li").show()
				.siblings("li").hide();
			$(".m-common-menu-content-list .go").on("click",function(){
				localStorage.removeItem("userId");
				window.location.href = "index.html";
			})
		}else{
			$(".m-common-menu-content-list .go").closest("li").hide();
		}
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
	goCar:function(){
		$(".m-nav-bottom-car,.m-common-car").on("click",function(){
			window.location.href = "shoppingcart.html";
		})
	},
	oNext:function(){
		$(".m-member-common-btn-box").on("click",".go",function(){
			let dataUrl = oDomain + "/home/user/authentication",
			email=$("#id").val() || "",
			birth = $("#date").val() || "";
			if(!email || email == ""){
				$(".m-popup-small-box .m-popup-small").text("メールアドレスをご入力ください");
				$(".m-popup-small-box").show();
				setTimeout(function(){
					$(".m-popup-small-box").hide();
				},800)
			}else if(!birth || birth == ""){
				$(".m-popup-small-box .m-popup-small").text("生年月日をご記入ください");
				$(".m-popup-small-box").show();
				setTimeout(function(){
					$(".m-popup-small-box").hide();
				},800)
			}
			let param={
				"email" : email,
				"birth" : birth
			};
			jsonData.getData(dataUrl,"GET",{"data":JSON.stringify(param)},function(data){
				console.log(data);
				if(data.code == 0){
					sessionStorage.msg = "パスワードの確認メールを送信しました。";
					window.location.href = "prompt.html?form=forgetpwd"
				}else{
					$(".m-forgetpwd-notice").text(data.msg).show();
				}
			})
		})
	}
}
if(sessionId && sessionId != ""){
	forgetpwd.init();
}else{
	getSession.data(function(){
		forgetpwd.init();
	})
}
