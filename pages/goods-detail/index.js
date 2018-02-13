// pages/goods-detail/index.js
//获取应用实例
const app = getApp();
import newtwork from '../../utils/network.js';
import api_port from '../../utils/api_port.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    indicatorDots: false,
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
    if (options.item) {
      var itemInfo = JSON.parse(options.item);
      this.setData({
        banners: [{pic:itemInfo.pic}],
        item: itemInfo
      });
    }
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
   * 兑换
   */
  toexchange: function() {
    var that = this;
    var id = that.data.item.id;
    if(id) {
      newtwork.requestLoading(api_port.exchangeItems, { productId: id, openid: app.globalData.openid, num:1}, '加载中', res => {
        var resData = JSON.parse(res.resultMsg);
        that.setInte(resData.credits);
        wx.showToast({
          title: '兑换成功，请前往商户公众号查看',
          icon: 'none',
          duration: 2000
        });
      }, (msg) => {
        wx.showToast({
          title: msg || '兑换失败',
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      wx.showToast({
        title: '查询不到商品信息，兑换失败',
        icon: 'none',
        duration: 2000
      });
    }
  },
  
  /**
   * 设置积分
   * credits 新的积分
   */
  setInte: function (credits) {
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prevPage = pages[0];  //首页
      prevPage.setData({
        integral: credits
      })
    }
  }
})