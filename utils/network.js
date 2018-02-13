/**
 * 不显示对话框的请求
 */
function request(url, params, onSuccess, onFail, onComplete, requestCode) {
  this.requestLoading(url, params, "", onSuccess, onFail, onComplete, requestCode)
}

/**
 * 展示加载对话框的网络请求
 * url:网络请求的url
 * params:请求参数
 * message:进度条的提示信息
 * onSuccess:成功的回调函数
 * onFail：失败的回调
 * onComplete：请求完成的回调
 * requestCode：请求方式：默认为Post
 */
function requestLoading(url, params, message, onSuccess, onFail, onComplete, requestType) {

  var params = arguments[1] ? arguments[1] : {};
  var onSuccess = typeof arguments[3] == "function" ? arguments[3] : function () { };
  var onFail = typeof arguments[4] == "function" ? arguments[4] : function () { };
  var onComplete = typeof arguments[5] == "function" ? arguments[5] : function () { };
  var requestType = arguments[6] ? arguments[6] : "GET";

  //防止重复提交，相同请求间隔时间不能小于500毫秒
  var nowTime = new Date().getTime();
  if (this.requestCount[url] && (nowTime - this.requestCount[url]) < 500) {
    return;
  }
  this.requestCount[url] = nowTime;

  wx.showNavigationBarLoading()
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }

  wx.request({
    url: url,
    data: params,
    header: {
      'content-type': 'application/json'
      //'content-type': 'application/x-www-form-urlencoded'
    },
    method: requestType,
    dataType: 'json',
    success: res => {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      
      if (res.statusCode == 200) {
        if (res.data.isResultTrue) {
          onSuccess(res.data)
        } else {
          onFail(res.data.resultMsg)
        }
      } else {
        onFail()
      }

    },
    fail: res => {
      wx.hideNavigationBarLoading()
      if (message != "") {
        wx.hideLoading()
      }
      onFail()
    },
    complete: res => {
      onComplete();
    },
  })
}

module.exports = {
  request: request,
  requestLoading: requestLoading,
  requestCount: {}
}
