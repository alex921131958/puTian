<template>
  <div class="tip-panel">
    <i class="icon iconfont icon-warn"></i>
    <p>若更改交评时间设置，此交评项目中所有相关规划将失效，需要重新进行步骤2、3、4、5中的交通量预测、相关交通量提取和交通影响预测。</p>
  </div>
</template>

<script>
    export default {
        name: "TipMessage",
      data() {
        return {
        }
      },
      props:{
        title:{
          type:String
        },
      },
      mounted() {

      },
    }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";
  .tip-panel{
    background-color: rgba(251, 230, 68, 0.2);
    padding: 0.6em 1em;
    text-align: left;
    color: $highlight;
    font-size: 0.95em;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    line-height: 1.8;
    .icon{
      float: left;
    }
    p{
      margin: 0 0 0 1.8em;
    }
  }

</style>
