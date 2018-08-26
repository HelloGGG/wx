const app = getApp()

Page({
  onLoad: function (){
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://freezoness.cn/one_list',
      data:{
        'id': app.globalData.playlist_id
      },
      success:function(res){
        console.log(res.data.result)
        app.globalData.playlist = res.data.result
        that.setData({
          // 获得后台返回的数组
          results: res.data.result
        })
        wx.hideLoading()
      }
    })
  },
  toplay: function (e) {
    wx.navigateTo({
      url: '../play/play?id=' + e.target.id,
    })
  },
})