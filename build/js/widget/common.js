'use strict';

var myTime = {
    /**
     * 当前时间戳
     * @return <int>        unix时间戳(秒)  
     */
    CurTime: function CurTime() {
        return Date.parse(new Date()) / 1000;
    },
    /**              
     * 日期 转换为 Unix时间戳
     * @param <string> 2014-01-01 20:20:20  日期格式              
     * @return <int>        unix时间戳(秒)              
     */
    DateToUnix: function DateToUnix(string) {
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return new Date(parseInt(d[0], 10) || null, (parseInt(d[1], 10) || 1) - 1, parseInt(d[2], 10) || null, parseInt(t[0], 10) || null, parseInt(t[1], 10) || null, parseInt(t[2], 10) || null).getTime() / 1000;
    },
    /**              
     * 时间戳转换日期              
     * @param <int> unixTime    待时间戳(秒)              
     * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)              
     * @param <int>  timeZone   时区              
     */
    UnixToDate: function UnixToDate(unixTime, isFull, timeZone) {
        if (typeof timeZone == 'number') {
            unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
        }
        var time = new Date(unixTime * 1000);
        var ymdhis = "";
        ymdhis += time.getUTCFullYear() + "-";
        ymdhis += time.getUTCMonth() + 1 + "-";
        ymdhis += time.getUTCDate();
        if (isFull === true) {
            ymdhis += " " + time.getUTCHours() + ":";
            ymdhis += time.getUTCMinutes() + ":";
            ymdhis += time.getUTCSeconds();
        }
        return ymdhis;
    }
};

/*superApi*/
//var dataUrl = "https://dev-p6528-api.qichechaoren.com/superapi/insurance/";
// var dataUrl = "https://csapitrunk.qichechaoren.com/superapi/insurance/";
// //var dataUrl = "https://api.qichechaoren.com/superapi/insurance/";
// var userId = getQueryString("userId");

// $RM._appkey = 7004516;            //c端H5
// var u_session_id = "";
// var getSessionId = {
//     getSessionId : function(call){
//         if(ah.inApp){
//             ah.callapp(['getUserInfo'],function(dict){
//                 var oInfo = JSON.parse(dict['getUserInfo']);
//                 u_session_id = oInfo['sessionId'];
//                 if(u_session_id && u_session_id != ""){
//                     $RM.setCookie("u-session-id",u_session_id);
//                     call&&call();
//                 }else{
//                     ah.callapp(['login']);
//                     call&&call();
//                 }
//             })
//         }else{
//             $RM.setCookie("u-session-id","a7fa51d12f6c4c81b52e38b5245f287f");
//             call&&call();
//         }
//     }
// };
// var qccr = {
//     getData : function(dataHost, dataPath, data, callfunc, errcallfunc){
//         $RM.request({
//             api: dataHost+dataPath,
//             dataType: "jsonp",
//             params: data,
//             result: function(data) {
//                 callfunc(data);
//                 //console.log("这是页面callback:" + JSON.stringify(data))
//             },
//             fail:function(data){
//                 callfunc(data);
//             }
//         })
//     }
// };

var jsonData = {
    getData: function getData(dataUrl, type, data, callfunc) {
        $.ajax({
            url: dataUrl,
            type: type,
            dataType: "jsonp",
            data: data,
            async: false,
            success: function success(data) {
                callfunc(data);
            },
            error: function error(data) {
                callfunc(data);
            }
        });
    }

    /*var _hmt = _hmt || [];
    window.onload = function(){
      $("body").append('<p id="sds" style="width:10rem;"></p>');
        var realrem= $("#sds").width()/10;
        var rem=document.documentElement.clientWidth/10;
        if(realrem!=rem){
         $("html").css('font-size',(rem*rem)/realrem+"px");
        }
       $("#sds").remove();
      (function() {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?9ba8813c577021cb449578468da2085b";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
    };*/

    /*页面加载前的loading 效果*/
};function loading(text) {
    //获取浏览器页面可见高度和宽度
    var _PageHeight = document.documentElement.clientHeight,
        _PageWidth = document.documentElement.clientWidth;
    //在页面未加载完毕之前显示的loading Html自定义内容
    var oText = text ? text : "加载中";
    var _LoadingHtml = '<div class="load" id="loadingDiv" ><img src="../images/icon_loading.gif" alt=""><div class="loadText">' + oText + '</div></div>';
    //呈现loading效果
    document.write(_LoadingHtml);
    //监听加载状态改变
    document.onreadystatechange = completeLoading;

    //加载状态为complete时移除loading效果
    function completeLoading() {
        var loadingMask = document.getElementById('loadingDiv');
        if (document.readyState == "complete" && loadingMask) {
            loadingMask.parentNode.removeChild(loadingMask);
        }
    }
}

/*页面加载失败时的展示结果*/
function failLoad() {
    $('body').html('<div class="container z-fail-page">' + '<img class="imgwebp fail-load" data-src="../images/failLoad.png" alt="" >' + '<p class="fail-tips">加载失败，点击重新加载</p>' + '<a href="javascript:;" class="reload">重新加载</a>' + '</div>');
    $('.reload').on('tap', function (event) {
        window.location.reload();
    });
}
//APP登陆状态改变回调
function logincallback(userId) {
    if (userId) {
        common.addCookie('uid', userId);
        common.userid = uid = userId;

        if (location.href.indexOf("detail") > 0) {
            var catId = common.getQueryString('catId');
            var id = common.getQueryString('id');
            var preview = common.getQueryString('preview');
            if (preview == 'null') {
                preview = 0;
            }
            common.signCreate('Content', '{"preview":' + preview + ', "catId":' + catId + ', "id":' + id + ', "userId":' + userId + ', "service_id":"detail"}', function (datas) {
                if (datas.info.isDoLike == 1) {
                    $(".float_layer .i-like ").removeClass(" icon-ttpod").addClass("icon-ttpoded");
                    $(".float_layer .i-likecount").addClass("cur");
                } else {
                    $(".float_layer .i-like ").removeClass(" icon-ttpoded").addClass("icon-ttpod");
                    $(".float_layer .i-likecount").removeClass("cur");
                }
            });
            return;
        }
        //首次进入或详情页
        if (location.search) {
            if (location.search.indexOf('userId')) {
                var _title = common.getQueryString('title'),
                    _catid = common.getQueryString('catId'),
                    _id = common.getQueryString('id'),
                    _href;
                if (_title || _catid || _id) {
                    _href = location.origin + location.pathname + '?catId=' + _catid + '&id=' + _id + '&title=' + encodeURI(_title) + '&userId=' + userId;
                    window.location.replace(_href);
                } else {
                    _href = location.origin + location.pathname + '?userId=' + userId;
                    window.location.replace(_href);
                }
            }
        } else {
            //非推荐板块或非首次进去推荐板块
            window.location.replace(location.href + '?userId=' + userId);
        }
    }
}