var OPEN_ID = ''//储存获取到openid
var SESSION_KEY = ''//储存获取到session_key

const app = getApp()

Page({
  onLoad: function(){
    var that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://freezoness.cn/playlists',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        app.globalData.playlists = res.data.result
        console.log(app.globalData.playlists)
        that.setData({
          results: app.globalData.playlists
        })
        wx.hideLoading()
      }
    }),
    
    wx.login({
      success: function (res) {
        wx.request({
          url: 'https://freezoness.cn/use_wxapi',
          data: {
            js_code: res.code,
          },
          method: 'GET',
          success: function (res) {
            OPEN_ID = res.data.openid;//获取到的openid
            // 设置全局open_id
            app.globalData.user_open_id = OPEN_ID

            SESSION_KEY = res.data.session_key;//获取到session_key
            //console.log(OPEN_ID)
            //console.log(SESSION_KEY)
            wx.request({
              url: 'https://freezoness.cn/user_login',
              data: {
                'open_id': OPEN_ID
              },
              success: function (res) {
                that.setData({
                  results: res.data
                })
              }

            })
          }
        })
      }
    })

  },


  onReady: function () {
    var that = this
    wx.request({
      url: 'https://freezoness.cn/carousel',
      success: function(res){
        that.setData({
          imgUrls: res.data
        })
      }
    })
  },


  data: {
    indicatorDots: true,  //是否显示面板指示点
    autoplay: true,      //是否自动切换
    interval: 3000,       //自动切换时间间隔
    duration: 1000,       //滑动动画时长
    inputShowed: false,
    inputVal: "",
    num: 0
  },

  submit: function (e) {
    // 显示正在搜索中,增加交互
    wx.showLoading({
      title: '搜索中',
    })
    var that = this
    // 去除两头空格,防止用户搜素空白字符
    e.detail.value.search = e.detail.value.search.replace(/^\s+|\s+$/g, "")
    if (e.detail.value.search.length != 0) {
      wx.request({
        url: 'https://freezoness.cn/search',
        data: {
          s_word: e.detail.value.search,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          app.globalData.search_result = res.data.result
          app.globalData.data_from = 'search'
          console.log(app.globalData.search_result)
          // 搜索成功,消除loading
          wx.hideLoading()
          wx.navigateTo({
            url: '../search/search'
          })
        },
        fail: function () {
          wx.showToast({
            title: '搜索失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }

  },


  // toplay: function(e){
  //   wx.navigateTo({
  //     url: '../play/play?id=' + e.target.id,
  //   })
  //   console.log(e.target.id)
  // },

  single_list: function(e){
    app.globalData.playlist_id = e.target.id
    app.globalData.data_from = 'index'
    console.log(e.target.id)
    wx.navigateTo({
      url: '../song_list/song_list'
    })
   
  },

  to_my:function(e){
    wx.showLoading({
      title: '登录中',
    })
    var that = this
    wx.request({
      url: 'https://freezoness.cn/get_user_songs',
      data: {
        open_id: app.globalData.user_open_id
      },
      success: function (res) {
        app.globalData.my_list = res.data.result
        app.globalData.data_from = 'my'
        wx.hideLoading()
        wx.navigateTo({
          url: '../my_music/my'
        })
      }

    })


  }

})



