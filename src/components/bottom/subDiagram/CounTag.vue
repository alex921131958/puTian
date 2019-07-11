<template>
  <div id="box">
    <p class="gray">
      <span class="title">{{title}}</span>
      <span class="sub" v-if="subTitle">({{subTitle}})</span>
    </p>
    <p class="strong">
      <span class="count">{{count}}</span>
      <span class="unit">{{unit}}</span>
    </p>
  </div>
</template>

<script>
  export default {
    name: "CounTag",
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    props:{
      title:{
        type:String
      },
      subTitle:{
        type:String
      },
      count: {
        // type:Number
      },
      unit: {
        type:String
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #box {
    background-color: #666;
    color: #fff;
    text-align: left;
    margin-top: 0.8em;
    padding: 0.5em;
    border-radius: 2px;
    p{
      &.gray{
        opacity: 0.8;
        letter-spacing: 0.05em;
      }
      &.strong{
        line-height: 1.5em;
        margin-top: 0.8em;
      }
      .title{
        font-size: 1rem;
      }
      .sub{
        font-size: 0.5rem;
      }
      .count{
        font-size: 2.5rem;
        font-weight: 600;
      }
      .unit{
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 0.6em;
      }
    }
  }

</style>
