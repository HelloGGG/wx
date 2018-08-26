var local_music = require('../../utils/data.js').data

var musics_data = ''
var formatSeconds = require('../../utils/util.js').formatSeconds
var set_music_info = require('../../utils/util.js').set_music_info
var len = 0

const app = getApp()
Page({
  // 页面加载
  onLoad: function(option){
    var that = this
    this.id = option.id
    // 判断数据来自哪个页面,是歌单还是搜索,或者是用户收藏
    console.log(app.globalData.data_from)
    if(app.globalData.data_from == 'index'){
      musics_data = app.globalData.playlist
    } else if (app.globalData.data_from == 'search'){
      console.log(app.globalData.search_result)
      musics_data = app.globalData.search_result
    } else if (app.globalData.data_from == 'my'){
      musics_data = app.globalData.my_list
    } else{
      musics_data = local_music
      this.id = 0
    }
    console.log(musics_data)
    len = musics_data.length
    this.music = musics_data[this.id]
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    set_music_info(this.id, this.backgroundAudioManager)
    console.log('play_load')
   
    this.is_favorite()
    
  },
  // 页面渲染完成
  onReady: function (e) {
    var that = this
    this.setData({
        // 等同于this.data.music = this.music
        music: this.music,
        lyric_arr: this.parseLyric(this.music.lyric),
        count: 0,
        
    })

    that.backgroundAudioManager.onEnded(function () {
      // 单曲循环
      if (that.data.play_mode.single == false) {
        that.music = musics_data[that.id]
        set_music_info(that.id, that.backgroundAudioManager)
        that.setData({
          music: that.music,
          count: 0,
        })
        this.is_favorite()
      } else {
        that.next()
      }
    }) 

   // 后台面板控制
   that.backgroundAudioManager.onNext(function(){
     that.next()
   })

    that.backgroundAudioManager.onPrev(function () {
      that.pre()
    })

    that.backgroundAudioManager.onPlay(function () {
      that.play()
    })

    that.backgroundAudioManager.onPause(function () {
      that.pause()
    })
    // 音乐播放进度更新事件
    that.backgroundAudioManager.onTimeUpdate(function(){
      that.setData({
        totalTime: formatSeconds(that.backgroundAudioManager.duration),
        currentTime: formatSeconds(that.backgroundAudioManager.currentTime),
        percent: (that.backgroundAudioManager.currentTime / that.backgroundAudioManager.duration) * 100
      })
      // 歌词高亮滚动
      that.highlight_lyric()
    })
    // 音乐播放错误事件,自动下一首
    that.backgroundAudioManager.onError(function () {
      that.next()
    })
  },

  data:{ 
    isPlay: true,
    isPause: false,
    play_mode:{
      list: false,
      single: true,
      random: true
    },
    favorite: false,
    status: 'running',
    lyric: false,
    lyric_id: 0,
  },
  // 显示歌词
  show_lyric: function(){
    this.setData({
      lyric: !this.data.lyric
    })
  },
  // 处理不可播放
  cant_play:function(){
    var that = this
    this.backgroundAudioManager.onError(function(){
      that.next()
    })
  },
  // 播放
  play: function () {
    this.backgroundAudioManager.play()
    this.setData({
      isPlay: true,
      isPause: false,
      status: 'running'
    })
  },
  // 暂停
  pause: function() {
    this.backgroundAudioManager.pause()
    this.setData({
      isPlay: false,
      isPause: true,
      status: 'paused'
      })
    
  },
  // 前一首
  pre: function(){
    // 顺序模式
    if (this.data.play_mode.list == false || this.data.play_mode.single == false){
      if (this.id > 0) {
        this.id = this.id
      } else {
        this.id = len
      }
      this.music = musics_data[--this.id]
      set_music_info(this.id, this.backgroundAudioManager)
      this.setData({
        music: this.music,
        count: 0,
        // scroll_top: 0,
        lyric_arr: this.parseLyric(this.music.lyric)
      })
    }else{
      // 随机模式
      var random_id = Math.floor((Math.random()*len))
      this.music = musics_data[random_id]
      set_music_info(random_id, this.backgroundAudioManager)
      this.setData({
        music: this.music,
        count: 0,
        // scroll_top: 0,
        lyric_arr: this.parseLyric(this.music.lyric)
      })
    }
    this.is_favorite()
  },
  // 下一首
  next: function(){
    // 顺序模式
    if (this.data.play_mode.list == false || this.data.play_mode.single == false) {
      if (this.id < len - 1) {
        this.id = this.id
      } else {
        this.id = -1
      }
      this.music = musics_data[++this.id]
      set_music_info(this.id, this.backgroundAudioManager)
      this.setData({
        music: this.music,
        count: 0,
        // scroll_top: 0,
        lyric_arr: this.parseLyric(this.music.lyric)
      })
    }else{
      // 随机模式
      var random_id = Math.floor((Math.random() * len))
      this.music = musics_data[random_id]
      set_music_info(random_id, this.backgroundAudioManager)
      this.setData({
        music: this.music,
        count: 0,
        // scroll_top: 0,
        lyric_arr: this.parseLyric(this.music.lyric)
      })
    }
    this.is_favorite()
  },
  // 播放模式切换
  change_to_list: function(){
    wx.showToast({
      title: '顺序播放',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      play_mode: { 
        list: false,
        single: true,
        random: true
      }
    })
  },

  change_to_single: function () {
    wx.showToast({
      title: '单曲循环',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      play_mode: {
        list: true,
        single: false,
        random: true
      }
    })
  },

  change_to_random: function () {
    wx.showToast({
      title: '随机播放',
      icon: 'success',
      duration: 2000
    })
    this.setData({
      play_mode: {
        list: true,
        single: true,
        random: false
      }
    })
  },
  is_favorite: function(){
    var that = this
    // 判断是否是用户喜爱歌曲
    wx.request({
      url: 'https://freezoness.cn/is_favorite',
      data: {
        open_id: app.globalData.user_open_id,
        song_id: this.music['id']
      },
      success: function (res) {
        if (res.data) {
          that.setData({
            favorite: true
          })
        } else {
          that.setData({
            favorite: false
          })
        }
      }
    })
  },
  // 我的喜欢
  my_favorite:function(){
    this.setData({
      favorite: !this.data.favorite
    })
    if(this.data.favorite){
      wx.request({
        url: 'https://freezoness.cn/add_myfavorite',
        data: {
          'open_id': app.globalData.user_open_id,
          'song_id': this.data.music['id']
        },
        success: function(res){
          console.log(res.data)
          wx.showToast({
            title: '添加喜欢',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }else{
      wx.request({
        url: 'https://freezoness.cn/del_myfavorite',
        data: {
          'open_id': app.globalData.user_open_id,
          'song_id': this.data.music['id']
        },
        success: function (res) {
          console.log(res.data)
          wx.showToast({
            title: '取消喜欢',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }

    if(this.data.favorite){
      wx.showToast({
        title: '添加喜欢',
        icon: 'success',
        duration: 2000
      })
    }else{
      wx.showToast({
        title: '取消喜欢',
        icon: 'success',
        duration: 2000
      })
    }
    
  },

  // 歌词高亮
  highlight_lyric:function(){
    if (this.data.count < this.data.lyric_arr.length - 1 && this.backgroundAudioManager.currentTime >= this.data.lyric_arr[this.data.count][0] && this.backgroundAudioManager.currentTime <= this.data.lyric_arr[this.data.count + 1][0]) {
      this.setData({
        lyric_id: this.data.count,
        lyric_color: 'red',
        target: 'ly' + this.data.count,
        count: this.data.count + 1,
      })
    } else if (this.data.count == this.data.lyric_arr.length - 1) {
      this.setData({
        lyric_id: this.data.count,
        lyric_color: 'red',
        count: this.data.count + 1,
      })
    } else if (this.data.count == this.data.lyric_arr.length) {
      this.setData({
        count: 0,
      })
    }
  },

  // 滑动改变播放进度
  change_currentTime:function(e){
    let current_value = e.detail.value
    let new_time = (current_value / 100) * (this.backgroundAudioManager.duration)
    // 跳转歌词
    for(let i = 0;i < this.data.lyric_arr.length;i++){
      if (new_time >= this.data.lyric_arr[i][0] && new_time <= this.data.lyric_arr[i + 1][0]){
          this.setData({
            count: i
          })
          break;
      }
    }
    this.backgroundAudioManager.seek(new_time)
  },

  //去除空白
  sliceNull: function (lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] == "") {
      } else {
        result.push(lrc[i]);
      }
    }
    return result
  },
  // 解析歌词文本为数组
  parseLyric: function (text) {

    //将文本分隔成一行一行，存入数组
    var lines = text.split('\n'),
      //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
      pattern = /\[\d{2}:.*\d{2}.\d{2,3}\]/g,
      //保存最终结果的数组
      result = [];
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern),
        //提取歌词
        value = v.replace(pattern, '');

      //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
      time.forEach(function (v1, i1, a1) {
        //去掉时间里的中括号得到xx:xx.xx
        var t = v1.slice(1, -1).split(':');
        //将结果压入最终数组
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
    });

    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },

})