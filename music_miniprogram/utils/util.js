var local_music = require('./data.js').data
var musics_data = ''
 
const app = getApp()
// 秒转分秒格式
function formatSeconds(value) {
  var secondTime = parseInt(value);// 秒
  var minuteTime = 0;// 分
  var result = '';
  if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
  }
  if (minuteTime == 0) {
    result = "0:" + parseInt(secondTime);
  } else {
    result = parseInt(minuteTime) + ":" + parseInt(secondTime);
  }
  return result;
}

// 设置后台播放器参数
function set_music_info(id, bgam) {
  // 更新music_data,防止使用本地文件json数据
  if (app.globalData.data_from == 'index') {
    musics_data = app.globalData.playlist
  } else if (app.globalData.data_from == 'search') {
    console.log(app.globalData.search_result)
    musics_data = app.globalData.search_result
  } else if (app.globalData.data_from == 'my') {
    musics_data = app.globalData.my_list
  } else {
    musics_data = local_music
  }
  var music = musics_data[id]
  console.log(music)
  bgam.title = music.title
  bgam.singer = music.singer
  bgam.coverImgUrl = music.poster
  bgam.src = music.mp3 // 设置了 src 之后会自动播放
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatSeconds: formatSeconds,
  set_music_info: set_music_info
}
