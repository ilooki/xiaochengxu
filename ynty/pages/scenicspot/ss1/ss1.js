// pages/scenicspot/ss1/ss1.js
var initData = '景区多语语音导游助手\n Multi-language guide\n assistant in the\n senic spot'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regionlist:[],
    size:'0',
    text: initData,
  },

  getdetail:function(event){

    wx.navigateTo({
      url: '/pages/scenicspot/ss2/ss2?region='+event.currentTarget.id,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    wx.setNavigationBarTitle({
      title: '',
    })

    wx.request({
      url: 'https://www.muoo.xyz/proxy',
      data:{
        path:'/ynty',
      },
      success:res=>{
        console.log(res)

        /*var jsonStr = res.data;
        jsonStr = jsonStr.replace(/'/g, '"');
        res.data = JSON.parse(jsonStr);*/

        var src=[];
        for(var i in res.data[1]){
          const s = wx.getStorageSync('https://www.muoo.xyz/proxy?path=/ynty/' + res.data[1][i] + '.jpg');
          if(s){
            src[i] = { 'name': res.data[1][i], 'src': s}
          }else{
            src[i] = { 'name': res.data[1][i], 'src': 'https://www.muoo.xyz/proxy?path=/ynty/' + res.data[1][i] + '.jpg' }
          }
        }

        that.setData({
          regionlist:src,
        });

        that.transf('');

        console.log(res.data);
      }
    });
  },

  transf: function(x){
    var that=this;
    wx.cloud.init();
    const db = wx.cloud.database();
    const colleges = db.collection('map').doc('XIm3BnkPDdDCJ7EW');
    colleges.get({
      success(res){
        var list=that.data.regionlist;
        
        var i=0;
        while(i<that.data.regionlist.length){
          list[i].cname=res.data[that.data.regionlist[i].name];

          i++;
        };

        that.setData({
          regionlist:list,
        });
      },
    })
  },

  saoma:function(){
    wx.scanCode({
      success:res=>{
        console.log(res.result.search('ynty-'));

        if (res.result.search('ynty-')==0){
          res.result.substring(5)

          wx.navigateTo({
            url: '/pages/scenicspot/ss3/ss3?region=' + res.result.substring(5),
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const info=wx.getStorageInfoSync();
    this.setData({
      size:info.keys.length,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})