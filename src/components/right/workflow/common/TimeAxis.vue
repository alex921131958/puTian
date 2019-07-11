<template>
  <div id="time-axis">
    <div class="box">
      <span class="tip" @click="changeEndStart">
        <i class="icon iconfont icon-pause" v-if="timeStatus"></i>
        <i class="icon iconfont icon-play" v-if="!timeStatus"></i>
      </span>
      <div class="inner">
        <SliderComp v-model="sliderTime" :min="5" :max="23" :step="1" class="time-line" show-tip="hover"></SliderComp>
        <div class="line">
          <!--<span class="split"><i></i></span>-->
          <span :class="['split',parseInt(hour)===8||parseInt(hour)===9||parseInt(hour)===18||parseInt(hour)===19?'highlight':'']" v-for="hour in hours"><i></i></span>
        </div>
        <div class="axis">
          <span :class="['single',sliderTime===5?'active':'']">05</span>
          <span :class="['tick',sliderTime===parseInt(hour)?'active':'']" v-for="hour in hours">
            {{hour}}
          </span>
        </div>
      </div>
      <!--<div class="time-line-control">
        <span><i class="icon iconfont icon-del"></i></span>
        <span @click="changeEndStart">
          <i class="icon iconfont icon-earth" v-if="timeStatus"></i>
          <i class="icon iconfont icon-global" v-if="!timeStatus"></i>
        </span>
        <span><i class="icon iconfont icon-add"></i></span>
      </div>
      <SliderComp v-model="sliderTime" :min="5" :max="25" :step="1" class="timeConf" show-tip="hover"></SliderComp>-->
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'

  export default {
    name: 'TimeAxis',
    data() {
      return {
        sliderTime: 5,
        timeStatus: false,
        timeControl: null,
        hours: ['06', '07', '08', '09', 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      }
    },
    mounted() {
      // this.changeTimeFunc()
    },
    computed: {
      ...mapGetters(['cur_step', 'cur_menu']),
    },
    methods: {
      changeEndStart() {
        this.timeStatus = !this.timeStatus;
        if (this.timeStatus) {

        }
      },
      changeTimeFunc() {
        this.sliderTime += 1;
        let _this = this;
        this.timeControl = setInterval(() => {
          if (_this.sliderTime === 23) _this.sliderTime = 4;
          _this.sliderTime += 1
        }, 3000);
      }
    },
    watch: {
      timeStatus(val) {
        if (val) {
          this.changeTimeFunc()
        } else {
          clearInterval(this.timeControl)
        }
      },
      sliderTime(val) {
        let data = val;
        if (val === 24) data = 31;
        if (val === 25) data = 32;
        eventBus.$emit('hourChange', data)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";

  #time-axis {
    position: absolute;
    bottom: 1em;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 4rem;
    .box {
      width: 50%;
      padding-right: 1rem;
      height: 100%;
      margin-left: 25%;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 3px;
      border: 1px solid rgba(207, 207, 207, 0.6);
      line-height: 4rem;
      display: flex;
      justify-content: center;
      .tip {
        width: 3rem;
        cursor: pointer;
      }
      .inner {
        flex: 1;
        .time-line {
          margin-top: 0.5rem;
        }
        .line {
          position: relative;
          top: -1.6rem;
          line-height: 1.5;
          display: flex;
          justify-content: left;
          height: 4px;
          .split {
            flex: 1;
            text-align: right;
            position: relative;
            /*left: 1px;*/
            &.highlight{
              background-color: $highlight;
            }
            i{
              /*display: inline-block;*/
              float: right;
              width: 1px;
              height: 4px;
              background-color: #767676;
            }
          }
        }
        .axis {
          position: relative;
          top: -1rem;
          line-height: 1.5;
          display: flex;
          justify-content: left;
          .single {
            position: absolute;
            left: -6px;
            &.active {
              color: $bg-red;
            }
          }
          .tick {
            flex: 1;
            text-align: right;
            position: relative;
            left: 6px;
            &.active {
              color: $bg-red;
            }
          }
        }
      }
    }
  }

  @media (min-width:1921px){
    #time-axis {
      position: absolute;
      bottom: 1em;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 4rem;
      font-size: 2em;
      .box {
        width: 50%;
        padding-right: 1rem;
        height: 100%;
        margin-left: 25%;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 3px;
        border: 1px solid rgba(207, 207, 207, 0.6);
        line-height: 4rem;
        display: flex;
        justify-content: center;
        .tip {
          width: 3rem;
          cursor: pointer;
        }
        .inner {
          flex: 1;
          .time-line {
            margin-top: 1.5rem;
          }
          .line {
            position: relative;
            top: -0.8rem;
            line-height: 1.5;
            display: flex;
            justify-content: left;
            height: 4px;
            .split {
              flex: 1;
              text-align: right;
              position: relative;
              /*left: 1px;*/
              &.highlight{
                background-color: $highlight;
              }
              i{
                /*display: inline-block;*/
                float: right;
                width: 1px;
                height: 4px;
                background-color: #767676;
              }
            }
          }
          .axis {
            position: relative;
            top: -0.1rem;
            line-height: 1.5;
            display: flex;
            justify-content: left;
            .single {
              position: absolute;
              left: -6px;
              &.active {
                color: $bg-red;
              }
            }
            .tick {
              flex: 1;
              text-align: right;
              position: relative;
              left: 6px;
              &.active {
                color: $bg-red;
              }
            }
          }
        }
      }
    }
  }
</style>
