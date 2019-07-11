<template>
  <div id="progress">
    <div class="inner">
      <span class="tip calc"><i class="icon iconfont icon-calc"></i>正在计算</span>
      <div class="container">
        <div class="warning">
        </div>
      </div>
      <span class="tip radius" @click="stopRequest">中止计算</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../util/event-bus'
  import MYCONF from '../../myconf'
  import FLOWCONF from '../../components/workflow/flowConf'
  export default {
    name: 'ProgressComp',
    data () {
      return {
        title: '延时指数',
      }
    },
    mounted(){
    },
    computed: {
      ...mapGetters(['cur_step','cur_menu']),
    },
    methods: {
      stopRequest(){
       eventBus.$emit("stopRequest");
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">
  #progress {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 100;
    .inner{
      width: 30vw;
      height: 4vh;
      background-color: rgba(166, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      .warning {
        position: relative;
        background-color: #F8B827;
        border: 1px solid #F8B827;
        border-radius: 10px;
        /*box-shadow: 1vw 3vh 10vh rgba(248, 184, 39, 0.8);*/
        background-size: 3em 3em;
        background-image: linear-gradient(-45deg, transparent 0em, transparent 0.8em, #FBE644 0.9em, #FBE644 2.1em, transparent 2.1em, transparent 2.9em, #FBE644 3.1em);
        -webkit-animation: warning-animation 750ms infinite linear;
        -moz-animation: warning-animation 750ms infinite linear;
        animation: warning-animation 750ms infinite linear;
      }
      @-webkit-keyframes warning-animation {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 3em 0;
        }
      }
      @-moz-keyframes warning-animation {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 3em 0;
        }
      }
      @keyframes warning-animation {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 3em 0;
        }
      }
      .warning:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 100%;
        border-radius: 10px;
        background-image: linear-gradient(to bottom, #F8B827, rgba(248, 184, 39, 0.6) 15%, transparent 60%, #F8B827);
      }

      .container {
        width: 20vw;
        /*margin: 1vh auto 0;*/
      }
      .container .warning {
        height: 2.2vh;
      }

      .tip{
        color: #fff;
        &.calc{
          margin-right: 1vw;
          .icon-calc{
            margin-right: 0.2vw;
          }
        }
        &.radius{
          margin-left: 1vw;
          background-color: #A60000;
          padding: 0 10px;
          border-radius: 10px;
          cursor: pointer;
        }
      }

    }
  }

  @media(max-width: 1800px){
    #progress {
      .inner{
        .container {
          width: 18vw;
          /*margin: 1vh auto 0;*/
        }
      }
    }
  }

  @media(max-width: 1500px){
    #progress {
      .inner{
        .container {
          width: 16vw;
          /*margin: 1vh auto 0;*/
        }
      }
    }
  }
</style>
