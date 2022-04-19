<template>
  <view>
    <!-- 选择收获地址 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" @click="btnChooseAddress">请选择收获地址</button>
    </view>
    <!-- 渲染收获地址 -->
    <view class="address-info-box" v-else @click="btnChooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">
            收获人：{{address.userName}}
          </view>
        </view>
        <view class="row1-right">
          <view class="phone">
            电话：{{address.telNumber}}
          </view>
          <uni-icons type="arrowright"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">
          收获地址：
        </view>
        <view class="row2-right">
          {{addstr}}
        </view>
      </view>
    </view>
    <!-- 底部的边框线 -->
    <image src="/static/tabbar/cart_border.png" class="address-border"></image>
  </view>
</template>

<script>
  // 1. 按需导入 mapState 和 mapMutations 这两个辅助函数
  import {mapState,mapMutations,mapGetters} from 'vuex'

  export default {
    data() {
      return {
        // address: {}
      }
    },
    methods: {
      ...mapMutations('m_user',['updateAddress']),
      // 3.1 把 m_user 模块中的 updateAddress 函数映射到当前组件
      async btnChooseAddress(){
        const [err,succ] = await uni.chooseAddress().catch(err=>console.log(err))
        if(err === null && succ.errMsg === "chooseAddress:ok"){
          console.log(succ)
          // this.address = succ;
          // 将收获地址存到 vuex 中
          this.updateAddress(succ)
        }
        // 安卓授权失败返回：chooseAddress:fail auth deny
        // ios返回：chooseAddress:fail authorize no response
        if(err && err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response'){
          // 调用方法进行重新授权
          this.reAuth()
        }
      },
      // 调用此方法重新 发起收货地址的授权
      async reAuth(){
        const [err2,confirmResult] = uni.showModal({
          content:"检测没有进行授权，是否去设置打开",
          confirmText:"确认",
          cancelText: "取消"
        })
        // 如果弹窗异常，则直接退出
        if(err2) return
        // 如果用户点击了“取消”按钮，则提示用户取消地址授权
        if(confirmResult.cancel) return uni.$showMsg("你取消了授权！")
        // 如果用户点击确认，则调用 uni.openSetting()进入授权页面，让用户重新进行授权
        if(confirmResult.confirm) return uni.openSetting({
          // 授权结束，需要对授权的结果做进一步判断
          success(settingResult) {
            // 地址授权的值等于 true， 提示用户授权成功
            if(settingResult.authSetting['scope.address']) return uni.$showMsg("授权成功，选择地址")
            // 地址授权的值等于 false ，提示用户 取消了地址授权
            if(!settingResult.authSetting['scope.address']) return uni.$showMsg("您取消了授权")
          }
        })
      }
    },
    computed: {
      ...mapState("m_user",['address']),
      ...mapGetters('m_user',['addstr'])
    },
  }
</script>

<style lang="scss">
  // 底部边框线的样式
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }

  // 选择收货地址的盒子
  .address-choose-box {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // 渲染收货信息的盒子
  .address-info-box {
    font-size: 12px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    // 第一行
    .row1 {
      display: flex;
      justify-content: space-between;

      .row1-right {
        display: flex;
        align-items: center;

        .phone {
          margin-right: 5px;
        }
      }
    }

    // 第二行
    .row2 {
      display: flex;
      align-items: center;
      margin-top: 10px;

      .row2-left {
        white-space: nowrap;
      }
    }
  }
</style>
