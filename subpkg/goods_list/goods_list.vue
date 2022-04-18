<template>
  <view>
    <view class="goods-list-container">
      <view v-for="(goods,index) in goodsList" :key='index' @click="gotoDeatil(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        isloading: false
      };
    },
    methods: {
      async getGoodsList(cb) {
        // 开启节流阀
        this.isloading = true
        const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 请求结束关闭节流阀
        this.isloading = false
        if (res.meta.status !== 200) return uni.$showMsg('数据加载失败！')
        cb && cb();
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
        
      },
      gotoDeatil(item){
        uni.navigateTo({
          url:'../goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    onLoad(options) {
      this.queryObj.query = options.query || '';
      this.queryObj.cid = options.cid || '';
      this.getGoodsList()
    },
    onPullDownRefresh() {
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false,
      this.goodsList = []
      // 关闭下拉刷新
      this.getGoodsList(()=>uni.stopPullDownRefresh());
      
    },
    onReachBottom() {
      // 判断是否还有数据
      if(this.queryObj.pagesize * this.queryObj.pagenum >= this.total) return uni.$showMsg("没有更多啦！")
      // 节流阀
      if(this.isloading) return
      // 让页码值自增 +1
      this.queryObj.pagenum += 1
      this.getGoodsList()
    }
  }
</script>

<style lang="scss">

</style>
