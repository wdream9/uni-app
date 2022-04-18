<template>
  <!-- 每一项商品 -->
  <view class="goods-list-item">
    <!-- 商品图标部分 -->
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo || defaultPic"></image>
    </view>
    <!-- 商品描述 -->
    <view class="goods-item-right">
      <!-- 商品名称 -->
      <view class="goods-name">
        {{goods.goods_name}}
      </view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    props:{
      goods:{
        type:Object,
        defaul: {},
      }
    },
    data() {
      return {
        defaultPic: 'http://ra2pvob31.hn-bkt.clouddn.com/aa.jpg',
      };
    },
    filters:{
      tofixed(num){
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
// 商品项
  .goods-list-item {
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;

      image {
        height: 200rpx;
        width: 200rpx;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
</style>
