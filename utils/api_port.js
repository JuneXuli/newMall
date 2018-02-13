const baseUrl = 'https://dev-web.lamic.cn';

module.exports = {
  loginMall: baseUrl + '/getIntegralMallUserInfo', //用户授权登陆积分商城
  getMallItems: baseUrl + '/toIntegralMall', //获取商品
  exchangeItems: baseUrl + '/exchangeProducts', //兑换商品
  recordsList: baseUrl + '/recordsList' //兑换记录
}