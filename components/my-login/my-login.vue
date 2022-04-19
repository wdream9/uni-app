<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <!-- 登录按钮,老版本登录方法 不展示弹窗-->
    <!-- <button type="primary" class="btn-login" open-type='getUserInfo' @getuserinfo="getUserInfo">一键登录</button> -->
    <!-- 最新版登录方法 -->
    <button type='primary' class="btn-login" lang="zh_CN" @tap="getUserProfile">一键登录-新</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  // 按需导入辅助函数
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    computed: {
      // 调用 mapState 辅助方法，把 m_user 模块中的数据映射到当前用组件中使用
      ...mapState('m_user', ['redirectInfo']),
    },
    data() {
      return {
        token: uni.getStorageSync('token') || '',
      };
    },
    methods: {
      // 调用 mapMutations 辅助方法，把 m_user 模块中的方法映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 获取微信用户的基本信息
      getUserInfo(e) {
        console.log("getUserInfo===>", e)
        // 判断是否获取用户信息成功
        if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')
        // 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
        // console.log(e.detail.userInfo)

        // 3. 将用户的基本信息存储到 vuex 中
        this.updateUserInfo(e.detail.userInfo)
        // 获取登录成功后的 Token 字符串
        this.getToken(e.detail)
      },
      // 弹出登录弹框(新版)
      getUserProfile() {
        //推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息                                              均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        uni.getUserProfile({
          desc: '用于获取您的个人信息', // s声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: info => {
            console.log("info===>", info);
            if (info.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权！')
            // 将用户的基本信息存储到 vuex 中
            this.updateUserInfo(info.userInfo)
            // 获取登录成功后的 Token 字符串
            this.getToken(info)
          }
        });
      },
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        console.log("wx.login===>", res)
        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        console.log('query===>', query)
        // 换取 token
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log('loginResult===>', loginResult)
        this.updateToken('123456789')
        this.navigateBack()
        uni.$showMsg('登录失败-给了临时token-记得改！')
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        // 2. 更新 vuex 中的 token
        this.updateToken(loginResult.message.token)
        // 判断 vuex 中的 redirectInfo 是否为 null
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }

    }
  }
</script>

<style lang="scss">
  .login-container {
    // 登录盒子的样式
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
    position: relative;
    overflow: hidden;

    // 绘制登录盒子底部的半椭圆造型
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }

    // 登录按钮的样式
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    // 按钮下方提示消息的样式
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
