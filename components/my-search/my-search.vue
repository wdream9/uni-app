<template>
  <view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBtn()">
    <!-- 使用 view 组件模拟 input 输入框的样式 -->
    <view class="my-search-box" :style="{'border-radius':radius + 'px'}">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props:{
      bgcolor:{
        type:String,
        default:'#c00000'
      },
      radius:{
        type:Number,
        default:15
      }
    },
    data() {
      return {

      };
    },
    methods:{
      searchBtn(){
        console.log("awefaqwsdef");
        this.$emit("myclick");
      }
    }
  }
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  padding: 0 10px;
  display: flex;
  align-items: center;
}

.my-search-box {
  height: 36px;
  background-color: #ffffff;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .placeholder {
    font-size: 15px;
    margin-left: 5px;
  }
}
</style>
