//app.js
import newtwork from './utils/network.js';
import api_port from './utils/api_port.js';
App({
  onLaunch: function () {
    this.getUserInfo();
  },
  loginOpt: function (cb) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.resCode = res.code;
        typeof cb == "function" && cb(this.globalData.resCode)
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          }
        }
      })
    }
  },
  loadBaseInfo: function (cb) {
    var that = this;
    newtwork.requestLoading(api_port.loginMall, { mid: that.globalData.mid, code: that.globalData.resCode }, '加载中', res => {
      var resData = JSON.parse(res.resultMsg);
      that.globalData.openid = resData.openid;
      typeof cb == "function" && cb(resData)
    }, () => {
      wx.showToast({
        title: '获取用户基本信息失败',
        icon: 'none',
        duration: 2000
      });
    });
  },
  globalData: {
    userInfo: null,
    resCode: null,
    mid: null,
    openid: null
  }
})