<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>交叉口流量显示</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
       <!-- <p class="list">
          <span>显示内容</span>
          <RadioGroupComp v-model="curContent" on-change="setCrossType">
            <RadioComp :label="item" v-for="item in crossList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>-->
        <p class="list">
          <span class="slide">图标尺寸</span>
          <span class="response"><SliderComp v-model="inputNum" :min="0" :max="10" :step="1" show-input/></span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import SelectComp from '../../common/SelectComp'
  import eventBus from '../../../util/event-bus'
  import env from '../../../common/env'

  export default {
    name: 'CrossFlowPanel',
    data() {
      return {
        isPanelOpen: true,
        crossList: MYCONF.CROSS_LIST,
        curContent: '流量',
        inputNum:1
      }
    },
    mounted() {
      eventBus.$on("getPanelParam",(menuId) => {
        this.inputNum = this.cross_icon;
      });
    },
    computed: {
      ...mapGetters(['cross_icon']),
    },
    props: {
    },
    components: {
      SelectComp,
    },
    methods: {
      ...mapMutations(['updateCrossIcon']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('timePanel');
      },
      setCrossType(){

      },
      setCrossSize(count){
        let sopBase = [
          [16, 0.65],
          [17, 1]
        ];
        let stopObj = count===0?{
          "stops":[
            [16, 0.65*(1-count/10)],
            [17, 1*(1-count/10)]
          ]
        }:count===1? {
          "stops":sopBase
        }:{
          "stops":[
            [16, 0.65*(1+count/10)],
            [17, 1*(1+count/10)]
          ]
        };
        let crossLayer = 'carTraffic-5';
        if(env.map.getLayer(crossLayer)) env.map.setLayoutProperty(crossLayer, 'icon-size', stopObj);
      }

    },
    watch:{
      inputNum(val){
        this.updateCrossIcon(val);
        this.setCrossSize(val);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../common/common.scss";

  .box {
    margin-bottom: 1em;
    p {
      margin: 0.6em 0;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        & > span:first-child {
          text-indent: 2.2em;
        }
        span{
          &.slide{
            width: 14em;
            text-align: left;
          }
          &.response{
            flex: 1;
          }
        }
      }
    }
  }
</style>
