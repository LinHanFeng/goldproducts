/* 浏览器信息
 * 返回示例
 * {"versions":{"ios":true,"android":false,"iPhone":true,"iPad":false}}
 *
 */
var browser = {
    versions: function() {
        var u = navigator.userAgent.toLocaleLowerCase(),
            app = navigator.appVersion;
        return { //移动终端浏览器版本信息
            ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/), //ios终端
            android: u.indexOf('android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iphone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('ipad') > -1 //是否iPad
        };
    }()
}
/* rem标准统一
 * 返回示例
 * 运行后  1rem 相当于 屏幕大小除于10的像素 例如 ：iPhone4S下面就是 1rem = 32px
 *
 */
function resize() {
    window.remFontSize = document.documentElement.clientWidth / 10;
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + "px";
    $("body").append('<p id="remset" style="width:10rem;"></p>');
    var realrem= $("#remset").width()/10;
    var rem=document.documentElement.clientWidth/10;
    if(realrem!=rem)
    {
        $("html").css('font-size',(rem*rem)/realrem+"px");
    }
    $("#remset").remove();
}
var b = null;
window.addEventListener("resize", function() {
    clearTimeout(b),
        b = setTimeout(resize, 300)
}, !1);
resize();
/* 获取浏览器参数
 * 返回示例
 * getQueryString("phone")=1354455445
 *
 */
function getQueryString(name) {
    if (window.location.href.indexOf("?") != window.location.href.lastIndexOf("?"))
        var urls = window.location.href.replace(/\?/g, "&").replace(/^.*?&/, "")
    else
        var urls = window.location.href.replace(/^.*\?/, "");
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = ("?" + urls).substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/* cookie操作
 * 示例
 * addCookie("tel", "1589887788", {expires:3600,domain:".qccr.com"}})
 * getCookie("tel")
 * removeCookie("tel",{domain:".qccr.com"}})
 */
function addCookie(name, value, options) {
    if (arguments.length > 1 && name != null) {
        if (options == null) {
            options = {};
        }
        if (value == null) {
            options.expires = -1;
        }
        if (typeof options.expires == "number") {
            var time = options.expires;
            var expires = options.expires = new Date();
            expires.setTime(expires.getTime() + time * 1000);
        }
        if (options.path == null) {
            options.path = "/";
        }
        if (options.domain == null) {
            options.domain = "";
        }
        document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires != null ? "; expires=" + options.expires.toUTCString() : "") + ("; path=/") + ("; domain=" + options.domain) + (options.secure != null ? "; secure" : "");
    }
}
// 获取Cookie
function getCookie(name) {
    if (name != null) {
        var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
        return value ? decodeURIComponent(value[1]) : null;
    }
}
// 移除Cookie
function removeCookie(name, options) {
    addCookie(name, null, options);
}

//jsonp封装
function getJsonData(url,method,serviceId,data,callfunc,errfunc){
    console.log(method)
    console.log(serviceId)
    console.log(url);
    console.log(data);
    console.log(url+"/"+method+"/"+serviceId);
    $.ajax({
        url: url+"/"+method+"/"+serviceId,
        data:data,
        dataType: "jsonp",
        jsonp: "callback",
        success: function (data) {
            callfunc(data);
        },
        error:function(data)
        {
            if(errfunc)
                errfunc(data);
            else
                callfunc(data);
        }
    });
};
//时间格式化
function formatDate(now){
    var   month=now.getMonth()+1;
    var   date=now.getDate();
    var   hour=now.getHours();
    var   minute=now.getMinutes();
    var   second=now.getSeconds();
    return month+"-"+(date>=10 ? date:("0"+date))+"   "+(hour>=10 ? hour:("0"+hour))+":"+(minute>=10 ? minute:("0"+minute))+":"+(second>=10 ? second:("0"+second));
};
/*
 * js加载器
 * 示例:
 * 单个文件加载
 *	superLoad.load("js/test1.js",function(){
 *		test();
 *	})
 *	//多个文件加载
 *	superLoad.start(["js/test1.js","js/test.js"]);
 *	superLoad.callList.push(function(){
 *		console.log($("body"))
 *	});
 *
 */
var superLoad = {
    superCache:{},
    callList: [],
    load: function(path, call) {
        var __this=this;
        if (__this.superCache[path]) {
            if (call && __this.superCache[path].loadstate == 1) {
                call()
            }
            return false
        }
        __this.superCache[path] = {};
        __this.superCache[path].loadstate = -1;
        var script = document.createElement("script");
        script.onload = function() {
            __this.superCache[path].loadstate = 1;
            if (call) {
                call()
            }
            for (var key in __this.superCache) {
                if (__this.superCache[key].loadstate == -1) {
                    return
                }
            }
            __this.onload()
        };
        document.head.appendChild(script);
        script.src = path;
    },
    onload: function() {
        var __this=this;
        for (var i = 0; i < __this.callList.length; i++) {
            __this.callList[i]()
        }
    },
    error: function() {
        alert("加载文件出错")
    },
    start: function(paths) {
        var __this=this;
        if (typeof paths == "string") {
            __this.load(paths)
        } else {
            for (var i = 0; i < paths.length; i++) {
                __this.load(paths[i])
            }
        }
    },
    end: function() {}
};