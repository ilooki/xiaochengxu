//app.js
App({
  onLaunch: function () {
    var that=this;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

    //在这里开始定位，然后尝试这引导用户

    //开始下载所有文件
    /*wx.request({
      url: 'https://www.muoo.xyz/proxy',
      data: {
        path: '/ynty',
      },
      success:res=>{
        console.log(res);
        for(var i in res.data[1]){
          //获取该根景点的图片
          that.download('https://www.muoo.xyz/proxy?path=/ynty/' + res.data[1][i] + '.jpg', 'https://www.muoo.xyz/proxy?path=/ynty/' + res.data[1][i] + '.jpg');
          //获取它的子节点
          that.downloadAll(res.data[1][i]);
        }
      }
    });*/

    wx.getLocation({
      success: function(location) {
      },
    });
  },

  refresh(){
    //开始下载所有文件
    wx.request({
      url: 'https://www.muoo.xyz/proxy',
      data: {
        path: '/ynty',
      },
      success: res => {
        console.log(res);
        for (var i in res.data[1]) {
          //获取该根景点的图片
          that.download('https://www.muoo.xyz/proxy?path=/ynty/' + res.data[1][i] + '.jpg', 'https://www.muoo.xyz/proxy?path=/ynty/' + res.data[1][i] + '.jpg');
          //获取它的子节点
          that.downloadAll(res.data[1][i]);
        }
      }
    });
  },
  downloadAll:function(d){
    var that=this;

    //下载地图
    that.download('https://www.muoo.xyz/proxy?path=/ynty/' + d + '/map.png','https://www.muoo.xyz/proxy?path=/ynty/' + d + '/map.png');

    //为节省空间，不是渌江书院的资料不下载
    //if (d !='Lujiang_Academy') return;

    //向服务器请求二级景点列表
    wx.request({
      url: 'https://www.muoo.xyz/proxy',
      data: {
        path: '/ynty/' + d,
      },
      success: xxx => {

        //得到二级景点
        for (var j in xxx.data[1]) {
          //下载录音
          that.download('https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '/chinese/voice.mp3', 'https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '/chinese/voice.mp3');
          that.download('https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '/english/voice.mp3', 'https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '/english/voice.mp3');
          that.download('https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '/japanese/voice.mp3', 'https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '/japanese/voice.mp3');
          //下载图片
          that.download('https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '.jpg',
          'https://www.muoo.xyz/proxy?path=/ynty/' + d + '/' + xxx.data[1][j] + '.jpg');
        }
      }
    });
  },
  download:function(key,value){
    const k=wx.getStorageSync(key);
    if(k && k.indexOf('http://tmp/')!=-1){
      return;
    }

    wx.downloadFile({
      url: value,
      success: res1 => {

        //先将文件的临时路径保存下来
        wx.setStorage({
          key: key,
          data: res1.tempFilePath,
        });

        wx.saveFile({
          tempFilePath: res1.tempFilePath,
          success:res2=>{
            wx.setStorage({
              key: key,
              data: res2.savedFilePath,
            });
          },
          fail:res2=>{
            console.log(res2);
          }
        });
      }
    });
  },
  getPath:function(key){
    wx.getStorage({
      key: key,
      success: function(res) {

      },
    });
  },
  globalData: {
    userInfo: null
  }
})