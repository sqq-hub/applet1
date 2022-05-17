// pages/me/index.js
var app=getApp();
const db=wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        UserLogin:false,
        userInfo:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        app.isLogin()
        this.setData({
            UserLogin:app.globalData.UserLogin,
            userInfo:app.globalData.userInfo
        })
       
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

    },

    getUserProfile(){
        let openId=app.globalData.openid;
       wx.getUserProfile({
         desc: '完善会员资料',
         success:(res)=>{
             let userInfo=res.userInfo
            // console.log(userInfo.nickName)
             db.collection('UserList').where({
                 '_openid':openId
             }).get({
                 success:(res)=>{
                     console.log('根据全局openid查询用户表成功',res)
                     console.log(openId);
                     if(res.errMsg=="collection.get:ok"&&res.data.length==0){
                       //console.log(userInfo.nickName)
                         db.collection('UserList').add({ //把用户信息写入数据库的用户表
                             data:{
                                avatarUrl:userInfo.avatarUrl, 
                                nickName:userInfo.nickName,
                                registerTime:new Date()
                             },
                            
                             success:(res)=>{ 
                                 console.log('写入成功', res.errMsg)
                                if(res.errMsg=="collection.add:ok"){ 
                                    wx.setStorageSync('UserInfo',userInfo) //保存用户信息到本地缓存
                                    this.setData({
                                        userInfo:userInfo,
                                        UserLogin:true
                                    })
                                    wx.showToast({
                                        title:'恭喜，登录成功',
                                        icon:"success",
                                        duration:1000
                                    })
                                } else{
                                    wx.showToast({
                                        title:'登录失败，请检查网络后重试！',
                                        icon:'none',
                                        duration:1000
                                    })
                                }
                             },
                             fail:err=>{
                                 console.log('用户信息写入失败',err)
                                wx.showToast({
                                  title: '登录失败，请检查网络后重试！',
                                  icon:'none',
                                  duration:1000
                                })
                             }
                         })
                     }else{
                         //数据库已有用户信息，直接登录
                         wx.setStorageSync('UserInfo', userInfo)
                         this.setData({
                             userInfo:userInfo,
                             UserLogin:true
                         })
                         app.globalData.userInfo=userInfo;
                         app.globalData.UserLogin=true;
                         wx.showToast({
                            title:'恭喜，登录成功',
                            icon:"success",
                            duration:1000
                        })
                     }
                 },
                 fail:err=>{
                     console.log('根据全局openid查询用户表失败',err)
                     wx.showToast({
                        title: '登录失败，请检查网络后重试！',
                        icon:'none',
                        duration:1000
                      })
                 }
             })
         },
         fail:err=>{
            console.log('用户信息获取失败',err)
            wx.showToast({
               title: '登录失败，请检查网络后重试！',
               icon:'none',
               duration:1000
             })
        }
       })
    },
    //我的页面登录后显示 待完善

    //清除数据退出
    exit(){
        let UserLogin=this.data.UserLogin
        if(UserLogin){
            wx.showToast({
              title: '退出成功',
              icon:'success',
              duration:1000
            })
            this.setData({
                UserLogin:false
            })
            wx.removeStorageSync('UserInfo')
        }else{
            // 提示登录
            wx.showToast({
              title: '你还未登录，请先登录！',
              icon:'none',
              duration:1000
            })
        }
    }
})
