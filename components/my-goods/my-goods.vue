<template>
  <!-- 每一项商品 -->
  <view class="goods-list-item">
    <!-- 商品图标部分 -->
    <view class="goods-item-left">
      <radio value="r1" :checked="goods.goods_state" v-if="showRadio" color="#C00000" @click="radioHandler" />
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
        <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChange" />
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-goods",
    props: {
      goods: {
        type: Object,
        defaul: {},
      },
      showRadio: {
        type: Boolean,
        defaul: false
      },
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        defaultPic: 'http://ra2pvob31.hn-bkt.clouddn.com/aa.jpg',
      };
    },
    methods: {
      radioHandler() {
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      numChange(val) {
        let value = parseInt(val);
        if (!value) {
          // 如果转化之后的结果为 NaN，则给定默认值为 1
          this.goods.goods_id = 1
          return;
        }
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          goods_count: val - 0
        })
      }
    },
    filters: {
      tofixed(num) {
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
      display: flex;
      justify-content: space-between;
      align-items: center;

      image {
        height: 200rpx;
        width: 200rpx;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;

        .goods-price {
          font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>
