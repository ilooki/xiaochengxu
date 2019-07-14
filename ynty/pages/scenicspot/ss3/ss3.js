// pages/scenicspot/ss3/ss3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animation: '',
    languagestyle: ['language-item-selected', 'language-item', 'language-item'],
    src: "/resource/image/play.png",
    title: {},
    content: '',
  },

  translate: function(event) {
    this.animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
    this.animation.opacity(0).step().opacity(0.7).step();
    this.setData({
      animation: this.animation.export()
    });
  },

  changelanguage: function(event) {
    var that = this;
    if (event.target.id != this.language) {
      this.translate();
    }

    if (this.isplay) {
      this.audiocontrol();
    }

    if (event.target.id == "chinese") {
      this.setData({
        languagestyle: ['language-item-selected', 'language-item', 'language-item'],
      });

      wx.request({
        url: 'https://www.muoo.xyz/proxy',
        data: {
          'path': '/ynty/' + this.position + '/chinese/content.txt'
        },
        success: function(res) {
          console.log(res);

          that.setData({
            content: res.data,
          })
        },
      });
    } else if (event.target.id == "english") {
      this.setData({
        languagestyle: ['language-item', 'language-item-selected', 'language-item']
      });

      wx.request({
        url: 'https://www.muoo.xyz/proxy',
        data: {
          'path': '/ynty/' + this.position + '/english/content.txt'
        },
        success: function(res) {

          that.setData({
            content: res.data,
          })
        },
      });
    } else if (event.target.id == "japanese") {
      this.setData({
        languagestyle: ['language-item', 'language-item', 'language-item-selected']
      });

      wx.request({
        url: 'https://www.muoo.xyz/proxy',
        data: {
          'path': '/ynty/' + this.position + '/japanese/content.txt'
        },
        success: function(res) {
          console.log(res);

          that.setData({
            content: res.data,
          })
        },
      });
    }

    this.language = event.target.id;
  },

  isplay: false,
  language: 'chinese',
  voice: {},
  audiocontrol: function(event) {
    var inneraudiocontext = wx.createInnerAudioContext();

    if (this.isplay) {
      this.setData({
        src: "/resource/image/play.png"
      });

      if (this.language == 'chinese') {
        this.voice.chinese.pause();
      } else if (this.language == 'english') {
        this.voice.english.pause();
      } else if (this.language == 'japanese') {
        this.voice.japanese.pause();
      }

      this.isplay = false;
    } else {
      this.setData({
        src: "/resource/image/pause.png"
      });

      if (this.language == 'chinese') {
        this.voice.chinese.play();
      } else if (this.language == 'english') {
        this.voice.english.play();
      } else if (this.language == 'japanese') {
        this.voice.japanese.play();
      }

      this.isplay = true;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  position: '',
  onLoad: function(options) {
    try{
      const ti = wx.getStorageSync("https://www.muoo.xyz/proxy?path=/ynty/" + options.region + ".jpg");
      if(ti){
        this.setData({
          title: {
            'name': options.region_chinese,
            'src': ti
          }
        });
      }else{
        this.setData({
          title: {
            'name': options.region_chinese,
            'src': "https://www.muoo.xyz/proxy?path=/ynty/" + options.region + ".jpg"
          }
        });
      }
    }catch(e){
      console.log(e);
    }

    var that = this;
    wx.request({
      url: 'https://www.muoo.xyz/proxy',
      data: {
        'path': '/ynty/' + options.region + '/chinese/content.txt'
      },
      success: function(res) {
        console.log(res);

        that.setData({
          content: res.data,
        });
      },
    });

    this.position = options.region;

    this.voice.chinese = wx.createInnerAudioContext();
    this.voice.english = wx.createInnerAudioContext();
    this.voice.japanese = wx.createInnerAudioContext();

    try{
      const c = wx.getStorageSync('https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/chinese/voice.mp3');
      if(c){
        this.voice.chinese.src = c;
      }else{
        wx.downloadFile({
          url: 'https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/chinese/voice.mp3',
          success: res => {
            this.voice.chinese.src = res.tempFilePath;
            
          }
        });
      }

      const e = wx.getStorageSync('https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/english/voice.mp3');
      if (e) {
        this.voice.english.src = e;
      } else {
        wx.downloadFile({
          url: 'https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/english/voice.mp3',
          success: res => {
            this.voice.english.src = res.tempFilePath;
          }
        });
      }

      const j = wx.getStorageSync('https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/japanese/voice.mp3');
      if (j) {
        this.voice.japanese.src = j;
      } else {
        wx.downloadFile({
          url: 'https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/japanese/voice.mp3',
          success: res => {
            this.voice.japanese.src = res.tempFilePath;
          }
        });
      }
    }catch(e){
      console.log(e);
    }

    this.translate(options.region);
  },

  translate:function(x){
    var that=this;

    const db = wx.cloud.database();
    const colleges = db.collection('map').doc('XIm3BnkPDdDCJ7EW');
    colleges.get({
      success:res=>{
        console.log(res.data[x])
        that.setData({
          '[title.name]': res.data[x]
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.voice.chinese.destroy();
    this.voice.japanese.destroy();
    this.voice.english.destroy();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})