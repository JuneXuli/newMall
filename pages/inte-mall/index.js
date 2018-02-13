// pages/inte-mall/index.js
const app = getApp();
import newtwork from '../../utils/network.js';
import api_port from '../../utils/api_port.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectCateId: 'cate1',
    categories: [],
    goods: [],
    loadingMoreHidden: true,
    hasMore: true,
    page: 1,
    pagesize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getGoodsList('refresh');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    //this.getGoodsList('refresh');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoodsList();
  },

  /**
   * 用户点击分类
   */
  tapCate: function (e) {
    this.setData({
      selectCateId: e.currentTarget.id
    })
  },
  getGoodsList: function(opt) {
    var that = this, page;
    if (!that.data.loadingMoreHidden) return;
    if (opt === "refresh") {
      page = 1;
    } else {
      if (!that.data.hasMore) return;
      page = that.data.page + 1;
    }
    that.setData({
      loadingMoreHidden: false
    });
    newtwork.request(api_port.getMallItems, { openid: app.globalData.openid, page: page, pagesize: that.data.pagesize }, res => {
      var resData = JSON.parse(res.resultMsg), hasMore = true, newGoods = resData.list ? resData.list : [];
      if (resData.page >= resData.pagecount) {
        hasMore = false;
      }
      if (!(opt === "refresh")) {
        newGoods = that.data.goods.concat(newGoods);
      }
      that.setData({
        goods: newGoods,
        loadingMoreHidden: true,
        page: resData.page,
        hasMore: hasMore
      });
    }, () => {
      wx.showToast({
        title: '获取商品失败',
        icon: 'none',
        duration: 2000
      });
      that.setData({
        loadingMoreHidden: true
      });
    });
  },
  
  /**
   * 点击商品跳到商品详情
   */
  tabGoods: function (e) {
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