const app = getApp()
Page({
  onLoad: function(){
    this.setData({
      results: app.globalData.search_result
    })
    console.log(this.data.results)
  },
  
  data:{
    search_word: '',
  },

  toplay: function (e) {
    wx.navigateTo({
      url: '../play/play?id=' + e.target.id,
    })
  },

})