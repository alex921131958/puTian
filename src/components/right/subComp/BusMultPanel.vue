<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span>按物理站台合并</span>
          <span class="switch"><SwitchComp/></span>
        </p>
        <p class="list">
          <span class="range">最大气泡对应阈值(人次/h)</span>
          <span class="switch"><InputNumberComp :min="500" :max="2000" :step="500" v-model="rangeMax" size="large"/></span>
          <span class="reset"><i class="icon iconfont icon-refresh"></i></span>
        </p>
        <p class="list">
          <span>突出显示超阈值站点</span>
          <span class="switch"><SwitchComp/></span>
        </p>
        <p class="list">
          <span class="slide">气泡最小半径</span>
          <span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="inputMin" size="large"/></span>
        </p>
        <p class="list">
          <span class="slide">气泡最大半径</span>
          <span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="inputMax" size="large"/></span>
        </p>

        <p class="list">
          <span>显示内容</span>
          <RadioGroupComp v-model="showDate">
            <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>
        <p class="list">
          <span>显示数字标注</span>
          <span class="switch"><SwitchComp/></span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import RoadList from '../../common/RoadList'
  import trafficPanelHandler from '../../../service/common/trafficPanelHandler'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'

  export default {
    name: 'TrafficCtlPanel',
    data() {
      return {
        isPanelOpen: true,
        roadList:MYCONF.ROAD_LIST,
        roadTitle:'点击开始选择道路',
        showDate: MYCONF.DISPLAY_LIST[0],
        showList: MYCONF.DISPLAY_LIST,
        inputMin: 2,
        inputMax: 2,
        rangeMax: 500
      }
    },
    mounted() {
      this.controller = new trafficPanelHandler(this);
    },
    computed: {
      ...mapGetters(['isRoadEditable']),
    },
    props: {
      title:{
        type:String
      }
    },
    components: {
      RoadList,
    },
    methods: {
      ...mapMutations(['updateRoadEditable']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('busMultPanel');
      }

    },
    watch:{
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../common/common.scss";

  .box {
    margin-bottom: 1em;
    hr{
      margin-left: 2.2em;
      opacity: 0.3;
      border-width: 0.01em;
    }
    p {
      margin: 0.6em 0;
      &.ctl-title {
        text-align: left;
        font-weight: bolder;
        margin-top: 2em;
        & > span {
          cursor: pointer;
          letter-spacing: 2px;
          font-size: $font-arrow;
          .icon-Arrow{
            position: relative;
            top: -0.2em;
            display: inline-block;
            font-size: 0.6em;
            opacity: 0.6;
            margin-right: 0.5em;
            transform: rotate(360deg);
            transition: all ease-in-out 0.3s;
            &.down{
              transform: rotate(270deg);
              transition: all ease-in-out 0.3s;
            }
          }
        }
      }
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        margin-left: 2.2em;
        &.left{
          justify-content: flex-start;
          .opacity{
            opacity: 0.6;
            margin-left: 5px;
          }
        }
        & > span:first-child {
          /*text-indent: 2.2em;*/
        }
        & > .btn{
          width: 12.5em;
          margin-right: 0.7em;
          background-color: #adadad;
          cursor: pointer;
          color: #000;
          letter-spacing: 1px;
          &:hover,&.active{
            background-color: $bg-red;
            color: #fff;
            font-weight: 600;
            transition: all ease-in-out 0.3s;
          }
        }
        & > .clear{
          flex: 1;
          background-color: #fff;
          .icon-clear{
            font-size: 1.6em;
            color: $bg-red;
            cursor: pointer;
          }
        }
        span{
          &.reset{
            width: 2.5em;
            height: 2.5em;
            margin-top: 0.25em;
            margin-left: 0.8em;
            background-color: #666;
            line-height: 2.5em;
            cursor: pointer;
            .icon{
              color: #000;
              font-size: 1.4em;
            }
          }
          &.range{
            width: 10em;
            text-align: left;
          }
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
    div.list{
      margin-left: 2.2em;
      p{
        margin: 0;
        background-color: #4a4a4a;
        display: flex;
        line-height: 2.6em;
        display: flex;
        span{
          flex: 1;
          &.icon{
            flex: 0.9;
          }
          &.name{
            flex: 1.7;
          }
        }
      }
    }
  }
</style>
