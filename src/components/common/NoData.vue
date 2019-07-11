<template>
  <div id="no-data">
    <div class="loading-box sk-wave" v-if="!isTimeout">
      <div class="spinner"></div>
    </div>
    <div v-if="isTimeout">
      {{title}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RatioSlider',
    data () {
      return {
        title: '暂无数据',
      }
    },
    props:{
      isTimeout:Boolean
    },
    mounted(){
      this.$nextTick(() => {
        // setTimeout(() => {
        //   this.isTimeout = true;
        // },1000 * 5);
      })
    }
  }
</script>

<style scoped lang="scss">
  #no-data {
    width: calc(100% - 1em);
    height: 16em;
    line-height: 14em;
    text-align: center;
    color: #262d44;
    position: absolute;
    bottom: 0.2em;
    z-index: 100;
    overflow: hidden;
    background-color: rgba(242, 242, 242, 0.3);
    &.dark{
      background-color: rgba(242, 242, 242, 0);
      color: #bbb;
    }
    /*background-color: #fff;*/
    div{
      width: 100%;
      /*min-height: 100px;*/
      &.loading-box{
        /*background: url("../../../static/images/loading.gif") no-repeat center;*/
      }
    }
    .spinner {
      width: 40px;
      height: 40px;
      margin: 100px auto;
      background-color: #2d8cf0;

      border-radius: 100%;
      -webkit-animation: scaleout 1.0s infinite ease-in-out;
      animation: scaleout 1.0s infinite ease-in-out;
    }

    @-webkit-keyframes scaleout {
      0% { -webkit-transform: scale(0.0) }
      100% {
        -webkit-transform: scale(1.0);
        opacity: 0;
      }
    }

    @keyframes scaleout {
      0% {
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
      } 100% {
          transform: scale(1.0);
          -webkit-transform: scale(1.0);
          opacity: 0;
        }
    }
  }
</style>
