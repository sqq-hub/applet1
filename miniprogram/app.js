// app.js
App({
  onLaunch:function(){
      console.log('App Launch')
      if(!wx.cloud){

      }else{
          wx.cloud.init({
              env:'cloud1-0gbt54v442520cd7',
              traceUser:true
          })
      }
      this.getOpenid();
  },
  onShow:function(){
      console.log('App Show')
  },
  onHide:function(){
      console.log('App Hide')
  },

  globalData:{
      userInfo:null,
      UserLogin:false,
      openid:null
  },
  //获取用户openid
  getOpenid:function(){
      var app=this;
      var openId=wx.getStorageSync('openId');
      if(openId){
          app.globalData.openid=openId;
          app.isLogin();
      }else{
          wx.cloud.callFunction({
              name:'quickstartFunctions',
              config:{
                env:'cloud1-0gbt54v442520cd7'
              },
              data:{
                type:'getOpenId'
              },
              success(res){
                  //云函数获取openid成功

                  var openId=res.result.openid;
                
                  wx.setStorageSync('openId', openId);
                  app.globalData.openid=openId;
                 // console.log(openId);
                  app.isLogin();
              },
              fail(res){
                  console.log('云函数获取openid失败',res)
              }
          })
      }
  } ,
  //检查是否登录，未登录则提示登录
  isLogin(){
      var userInfo=wx.getStorageSync('UserInfo');
      if(userInfo.nickName&&userInfo.avatarUrl){
          this.globalData.UserLogin=true;
          this.globalData.userInfo=userInfo;
      } else{
          this.globalData.UserLogin=false;
          wx.showToast({
            title: '你还未登录，请先登录！',
            icon:'none',
            duration:1000
          })
      }
  }

  
})
