// pages/exch-record/index.js
const app = getApp();
import newtwork from '../../utils/network.js';
import api_port from '../../utils/api_port.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    loadingMoreHidden: true,//加载更多
    loadingRefreshHidden: true, //下拉刷新
    page: 1,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '兑换记录'
    })
    this.getCardsList('refresh');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.getCardsList("refresh");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCardsList();
  },

  /**
   * 加载兑换列表
   */
  getCardsList: function(opt) {
    var that = this;
    var page = that.data.page;
    
    if (opt === "refresh") {
      page = 1;
      that.setData({
        loadingMoreHidden: true,
        loadingRefreshHidden: false,
        page: page
      });
    } else {
      if (!that.data.hasMore) return;
      page += 1;
      that.setData({
        loadingMoreHidden: false,
        loadingRefreshHidden: true,
        page: page
      });
    }
    newtwork.request(api_port.recordsList, { openid: app.globalData.openid, page: page }, res => {
      var resData = JSON.parse(res.resultMsg), hasMore = true, newCards = resData.list ? resData.list : [];
      if (resData.page >= resData.pagecount) {
        hasMore = false;
      }
      if (!(opt === "refresh")) {
        newCards = that.data.cards.concat(newCards);
      }
      that.setData({
        cards: newCards,
        loadingMoreHidden: true,
        loadingRefreshHidden: true,
        page: resData.page,
        hasMore: hasMore
      });
    }, (msg) => {
      wx.showToast({
        title: msg || '兑换记录获取失败',
        icon: 'none',
        duration: 2000
      });
      that.setData({
        loadingMoreHidden: true,
        loadingRefreshHidden: true
      });
    });
  }
})