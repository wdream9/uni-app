<template>
  <view>
    <view class="cart-container" v-if="cart.length !== 0">
      <!-- 收获地址 -->
      <my-address></my-address>
      <!-- 商品标题 区域 -->
      <view class="cart-title">
        <!-- 左侧图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 右侧文本 -->
        <view class="cart-title-text">购物车</view>
      </view>
      <!-- 实现商品的滑动 -->
      <uni-swipe-action>
        <block v-for="(good,i) in cart" :key="i">
          <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(good)">
            <my-goods :goods="good" :showRadio="true" :showNum="true" @radio-change='radioChange'
              @num-change='numChange'>
            </my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
    </view>
    <my-settle v-if="cart.length !== 0"></my-settle>
    <view class="empty-cart" v-else>
      <img src="/static/cart-null.png" >空空如也，请添加商品
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapGetters
  } from 'vuex'
  import badgeMix from '@/mixins/tabbar-badge.js'

  export default {
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }]
      };
    },
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 商品勾选状态改变
      radioChange(e) {
        this.updateGoodsState(e)
      },
      // 商品数量发生改变
      numChange(e) {
        this.updateGoodsCount(e)
      },
      // 左滑删除商品
      swipeActionClickHandler(e) {
        this.removeGoodsById(e.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container{
    padding-bottom: 50px;
  }
  .cart-title {
    height: 40px;
    align-items: center;
    display: flex;
    padding-left: 5px;
    border-bottom: 1rpx solid #EBEEF5;

    .cart-title-text {
      margin-left: 10px;
    }
  }
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
  }
</style>
