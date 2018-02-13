// pages/home/home.js
//获取应用实例
const app = getApp();
import newtwork from '../../utils/network.js';
import api_port from '../../utils/api_port.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    banners: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    integral: 0,
    goods: [],
    winH:0,
    headerH: 200
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this, winH = 0;
    app.globalData.mid = '5150a260-ab64-4567-a4cb-fcd916546b73';
    if (options.mid) {
      app.globalData.mid = options.mid;
    }
    
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        winH = res.windowHeight;
      }
    });
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        winH: winH
      })
    }else {
      app.getUserInfo((userInfo) => {
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true,
          winH: winH
        })
      })
    }
    //先获取登录的code来获取openid
    app.loginOpt(code => {
      that.loadBaseInfo();
      //that.loadBanner();
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面滚动事件
   */
  scroll: function(e) {
    var that = this, scrollTop = e.detail.scrollTop, headerH = that.data.headerH;
    var newH = 200 - scrollTop*1.0;
    newH = newH > 200 ? 200 : newH;
    newH = newH <100 ? 100 : newH;
    if (newH != headerH) {
      that.setData({
        headerH: newH
      });
    }
  },
  /**
   * 点击兑换记录
   */
  tabExpRecord: function() {
    wx.navigateTo({
      url: '../exch-record/index',
    })
  },
  /**
   * 点击积分商城
   */
  tabInteMall: function() {
    wx.navigateTo({
      url: '../inte-mall/index',
    })
  },
  /**
   * 加载基本信息：积分，openId,热门商品list
   */
  loadBaseInfo: function() {
    var that = this;
    app.loadBaseInfo((res) => {
      that.setData({
        integral: res.credits,
        goods: res.hotProList ? res.hotProList : []
      });
    });
  },
  /**
   * 加载广告
   */
  loadBanner: function() {
    var that = this;
    setTimeout(function() {
      var returnAds = [
        { id: '1', 'picUrl': '../../images/ads/ad1.jpg' },
        { id: '2', 'picUrl': '../../images/ads/ad2.jpg' },
        { id: '3', 'picUrl': '../../images/ads/ad3.jpg' }
      ];
      that.setData({
        banners: returnAds
      });
    }, 500);
  },
  /**
   * 点击商品跳到商品详情
   */
  tabGoods: function(e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.goods && this.data.goods[index]) {
      var itemInfo = this.data.goods[index]
      wx.navigateTo({
        url: '../goods-detail/index?item=' + JSON.stringify(itemInfo),
      })
    } else {
      wx.showToast({
        title: '暂无该商品信息',
        icon: 'none',
        duration: 2000
      });
    }
  }
})