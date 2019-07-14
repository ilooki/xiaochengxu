// pages/scenicspot/ss2/ss2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    title_img: '',
    regionlist: [],
    map: '',

    autoplay: true,
    interval: 4000,
    indicator: true,
  },

  location: '',

  getdetail: function(event) {
    console.log(event)
    var that = this;
    wx.navigateTo({
      url: '/pages/scenicspot/ss3/ss3?region=' + this.location + '/' + event.currentTarget.id,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    this.location = options.region;

    wx.request({
      url: 'https://www.muoo.xyz/proxy',
      data: {
        path: '/ynty/' + options.region,
      },
      success: res => {
        /*var jsonStr = res.data;
        jsonStr = jsonStr.replace(/'/g, '"');
        res.data = JSON.parse(jsonStr);*/

        var src = [];
        for (var i in res.data[0]) {
          try {
            const url = wx.getStorageSync('https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/' + res.data[1][i] + '.jpg');
            if (url) {
              src[i] = {
                'name': res.data[1][i],
                'src': url
              }
            } else {
              src[i] = {
                'name': res.data[1][i],
                'src': 'https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/' + res.data[1][i] + '.jpg'
              }
            }
          }catch(e){
            console.log(e);
          }
        }

        var ti;
        try{
           ti = wx.getStorageSync('https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '.jpg');
          if (!ti) {
            ti = 'https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '.jpg'
          } 
        }catch(e){
          console.log(e);
        }
        

        that.setData({
          title: options.region,
          title_img: ti,
          regionlist: src
        });

        that.transf('');

        console.log(res.data);
      }
    });

    try {
      const url = wx.getStorageSync('https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/map.png');
      if (!url) {
        this.setData({
          map: 'https://www.muoo.xyz/proxy?path=/ynty/' + options.region + '/map.png',
        });
      } else {
        this.setData({
          map: url,
        });
      }
    } catch (e) {
      console.log(e);
    }
  },

  transf: function(x) {
    var that = this;
    wx.cloud.init();
    const db = wx.cloud.database();
    const colleges = db.collection('map').doc('XIm3BnkPDdDCJ7EW');
    colleges.get({
      success(res) {
        var list = that.data.regionlist;

        var i = 0;
        while (i < that.data.regionlist.length) {
          list[i].cname = res.data[that.data.regionlist[i].name];

          i++;
        };

        that.setData({
          regionlist: list,
          title: res.data[that.data.title],
        });
      },
    })
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