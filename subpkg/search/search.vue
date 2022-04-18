<template>
  <view>
    <!-- 基本用法 -->
    <view class="search-bar-box">
      <uni-search-bar ref="searchbar" :radius="100" @input="input" cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="forward" size="20px" @click="clean"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,index) in histories" :key='index' @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的 timerId
        timer: null,
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索历史
        historyList: ['aa', 'b', 'cccc'],
      };
    },
    methods: {
      // 输入事件
      input(e) {
        // 清楚timer对应的延时器
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          // 如果500毫秒内没有触发新的输入事件，则为搜索关键字赋值
          this.kw = e
          // 根据关键词，查询搜索建议列表
          this.getSearchList()
        }, 500)
        console.log(e)
      },
      // 根据搜索关键词，搜索商品建议列表
      async getSearchList() {
        // 判断关键词是否为空
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        // 发起请求，获取搜索建议列表
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.kw
        })
        if (res.meta.status !== 200) return uni.$showMsg('数据加载失败！')
        this.searchResults = res.message
        this.saveSearchHistory();
      },
      // 跳转至商品详情页
      gotoDetail(goods_id) {
        uni.navigateTo({
          // 指定详情页面的 URL 地址，并传递 goods_id 参数
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      // 保存本次的搜索关键字
      saveSearchHistory(){
        const set = new Set(this.historyList)
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        // 将搜索历史存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList));
      },
      // 清空搜索历史
      clean(){
        this.historyList = [];
        uni.setStorageSync("kw",'[]')
      },
      // 跳转到商品列表
      gotoGoodsList(kw){
        uni.navigateTo({
          url:'../goods_list/goods_list?query=' + kw
        })
      }
    },
    computed:{
      histories(){
        return [...this.historyList].reverse();
      }
    },
    onLoad() {
      // 自动获取焦点
      this.$refs.searchbar.show = true;
      this.$refs.searchbar.showSync = true;
      // 从本地内存中获取到搜索历史
      this.historyList = JSON.parse(uni.getStorageSync("kw") || '[]')
    }
  }
</script>

<style lang="scss">
  .search-bar-box {
    background-color: #C00000;
    position: sticky;
    // 吸顶的位置
    top: 0;
    z-index: 999;
  }

  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {

    .history-title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      font-size: 12px;
    }

    .history-list {
      display: flex;
      flex-wrap: warp;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }

  }
</style>
