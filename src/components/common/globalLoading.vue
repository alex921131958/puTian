<template>
  <div id="mask">
    <div class="spinner">
      <div class="rect1"></div>
      <div class="rect2"></div>
      <div class="rect3"></div>
      <div class="rect4"></div>
      <div class="rect5"></div>
    </div>
    <p>
      {{globalTip}}
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: 'globalLoading',
    data() {
      return {
        title: '暂无数据',
      }
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['cur_step','report_loading']),
      globalTip(){
        return this.cur_step===7 && this.report_loading?'正在努力生成报告,请稍后...':'正在努力出图,请稍后...';
      }
    },
  }
</script>

<style scoped lang="scss">
  #mask {
    width: 100vw;
    height: 100vh;
    line-height: 14em;
    text-align: center;
    color: #262d44;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.92);
    /*background-color: #fff;*/
    div {
      width: 100%;
      /*min-height: 100px;*/
      &.loading-box {
        /*background: url("../../../static/images/loading.gif") no-repeat center;*/
      }
    }
    .spinner {
      margin: 35vh auto 1vh auto;
      width: 50px;
      height: 60px;
      text-align: center;
      font-size: 10px;
    }

    .spinner > div {
      background-color: #fbe644;
      height: 100%;
      width: 6px;
      display: inline-block;

      -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
      animation: stretchdelay 1.2s infinite ease-in-out;
    }

    .spinner .rect2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s;
    }

    .spinner .rect3 {
      -webkit-animation-delay: -1.0s;
      animation-delay: -1.0s;
    }

    .spinner .rect4 {
      -webkit-animation-delay: -0.9s;
      animation-delay: -0.9s;
    }

    .spinner .rect5 {
      -webkit-animation-delay: -0.8s;
      animation-delay: -0.8s;
    }

    p {
      text-align: center;
      color: #fbe644;
      letter-spacing: 0.2em;
      font-size: 1.2em;
    }

    @-webkit-keyframes stretchdelay {
      0%, 40%, 100% {
        -webkit-transform: scaleY(0.4)
      }
      20% {
        -webkit-transform: scaleY(1.0)
      }
    }

    @keyframes stretchdelay {
      0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1.0);
        -webkit-transform: scaleY(1.0);
      }
    }
  }
</style>
