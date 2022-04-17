<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view scroll-y="true" class="left-scroll-view" :style="{height: wh + 'px'}">
        <block v-for="(item,index) in cateList" :key="index">
          <view :class="['left-scroll-view-item',index===active?'active':'']" @click="activeChange(index)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>

      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y="true" class="right-scroll-view" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="index2">
          <!-- 二级分类标题 -->
          <view class="cate-lv2-title"> / {{item2.cat_name}} /</view>
          <!-- 当前二级分类下三级分类列表 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key='index3'
              @click='gotoGoodsList(item3)'>
              <!-- 三级分类的图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 三级分类标题 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh: 0,
        active: 0,
        scrollTop: 0,
        cateList: [],
        cateLevel2: [],
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight
      // 调用获取分类列表数据的方法
      this.getCateList()
    },
    methods: {
      activeChange(index) {
        this.active = index;
        // 重置右边滚动条
        this.scrollTop = this.scrollTop == 0 ? 1 : 0;
        //点击为二级分类赋值
        this.cateLevel2 = this.cateList[index].children
      },
      async getCateList() {
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        console.log("cate list===>", res)
        // 判断是否获取失败
        if (res.meta.status !== 200) return uni.$showMsg()
        // 转存数据
        this.cateList = res.message
        // 为二级分类赋值
        this.cateLevel2 = res.message[0].children
      },
      // 点击商品,去到商品列表
      gotoGoodsList(item){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  // 两个滑块的外部容器
  .scroll-view-container {
    display: flex;
  }

  // 左边滑块
  .left-scroll-view {
    width: 240rpx;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式  既包含left-scroll-view-item类名也包含 active类名
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }

  // 右边滑块
  .right-scroll-view {
    background-color: #ffffff;
  }

  .cate-lv2-title {
    font-size: 26rpx;
    font-weight: bold;
    text-align: center;
    padding: 15rpx;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap; // 一行容不下换行

    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 10px;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
