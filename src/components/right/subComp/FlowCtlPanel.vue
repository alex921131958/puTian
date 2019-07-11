<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span class="range">流量显示上限(辆/h)</span>
          <span class="response"><SliderComp v-model="rangeMax" :min="500" :max="2000" :step="5" show-input/></span>
          <span class="reset" @click="resetRangeFlow('max')"><i class="icon iconfont icon-refresh"></i></span>
        </p>
        <p class="list">
          <span class="range">流量显示下限(辆/h)</span>
          <span class="response"><SliderComp v-model="rangeMin" :min="1" :max="2000" :step="1" show-input @on-change="setFlowRangeMin"/></span>
          <span class="reset" @click="resetRangeFlow('min')"><i class="icon iconfont icon-refresh"></i></span>
        </p>
        <!--<p class="list">
          <span class="slide">流量宽度显示比例</span>
          <span class="response"><SliderComp v-model="buffer_width['carTraffic-3']" :min="-100" :max="100" :step="1" show-input @on-change="slideChange"/></span>
        </p>-->
        <p class="list">
          <span class="slide">流量宽度显示比例</span>
          <span class="response"><RatioSlider :bufferRatio="buffer_width['carTraffic-3']" ref="ratioSlider" @ratioChange="slideChange"/></span>
        </p>
        <!--<p class="list">
          <span class="slide">背景流量宽度比例</span>
          <span class="response"><RatioSlider :bufferRatio="buffer_background_width" @ratioChange="slideBackChange"/></span>
        </p>-->
        <p class="list">
          <span>色带颜色</span>
          <span class="switch"><ColorPickerComp v-model="buffer_color['carTraffic-3']" :colors="colors" @on-change="setBufferColor"/></span>
        </p>
        <p class="list">
          <span>背景色带颜色</span>
          <span class="switch"><ColorPickerComp v-model="buffer_background_color" :colors="colors" @on-change="setBufferBackColor"/></span>
        </p>
        <p class="list">
          <span>显示流量值标注</span>
          <span class="switch"><SwitchComp v-model="isLabelShow" @on-change="updateFlowLabel(isLabelShow)"/></span>
        </p>
        <p class="list">
          <span>显示背景流量</span>
          <span class="switch"><SwitchComp v-model="isBackgroundShow" @on-change="setFlowBackgroundShow"/></span>
        </p>
        <hr>
        <p class="list">
          <span>仅显示选定道路</span>
          <span class="switch"><SwitchComp v-model="isSelectedOnly" @on-change="updateSelectedOnly(isSelectedOnly)"/></span>
        </p>
        <RoadList :roadList="roadList" :disabled="!isSelectedOnly"/>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import RoadList from '../../common/RoadList'
  import RatioSlider from '../../common/RatioSlider'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import env from '../../../common/env'
  import utilHelper from '../../../util/util-helper'
  import eventBus from '../../../util/event-bus'

  export default {
    name: 'FlowCtlPanel',
    data() {
      return {
        isPanelOpen: true,
        colors: MYCONF.COLOR_PICKER,
        inputNum: 0,
        rangeMax:MYCONF.FLOW_RANGE_MAX,
        rangeMin:MYCONF.FLOW_RANGE_MIN,
        roadList: MYCONF.ROAD_LIST,
        isLabelShow:MYCONF.FLOW_LABEL_SHOW,   //流量标注是否显示默认true
        isSelectedOnly:MYCONF.SELECTED_ONLY,
        isBackgroundShow: false,
        buffer_background_color: '#cb178a',
        buffer_background_width: 0,
      }
    },
    mounted() {
      eventBus.$on("getPanelParam",(menuId) => {
        this.setFlowParam(menuId);
      });
      eventBus.$on("setParamEvent",(type) => {      //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if(type === 'clear'){                //取消
          this.setFlowParam(menuId);
        }else{                              //初始化
          this.setFlowParam("init");
        }
      });
    },
    computed: {
      ...mapGetters(['isRoadEditable', 'panel_time', 'link_id', 'link_list', 'buffer_width', 'cur_menu','flow_label_show','buffer_color',
        'selected_only','flow_range_max','flow_range_min','car_traffic_3','flow_back_show']),
    },
    props: {
      title: {
        type: String
      }
    },
    components: {
      RoadList,
      RatioSlider,
    },
    methods: {
      ...mapMutations(['updateRoadEditable', 'updateBufferWidth','updateFlowLabel','updateBufferColor','updateBufferWidth','updateSelectedOnly',
      'updateFlowRangeMax','updateFlowRangeMin','updateLinkId','updateLinkList','updateMapClickDisabled','updateFlowBackgroundShow','updateFlowBackgroundColor',
      'updateFlowBackgroundWidth','updateFlowBack']),
      setPanelState() {
        this.isPanelOpen = !this.isPanelOpen;
        this.$emit('flowPanel');
      },
      slideChange(val){
        let id = this.cur_menu.id;
        this.updateBufferWidth({'carTraffic-3':val});
        MapCommonLayer.setBufferWidth(id, val);
        MapCommonLayer.setBufferWidth(`${id}-background`, val);
      },
      // slideBackChange(val){
      //   let id = 'carTraffic-3-background';
      //   this.updateFlowBackgroundWidth(val);
      //   MapCommonLayer.setBufferWidth(id, val);
      // },
      setBufferColor(color){
        let id = this.cur_menu.id;
        this.updateBufferColor({'carTraffic-3':color});
        MapCommonLayer.setBufferColor(id, color);
      },
      setBufferBackColor(color){
        let id = 'carTraffic-3-background';
        this.updateFlowBackgroundColor(color);
        MapCommonLayer.setBufferColor(id, color);
      },
      resetRangeFlow(type){
        if(type === 'min'){
          this.rangeMin = MYCONF.FLOW_RANGE_MIN;
          this.updateFlowRangeMin(this.rangeMin);
        }else{
          this.rangeMax = MYCONF.FLOW_RANGE_MAX;
          this.updateFlowRangeMin(this.rangeMax);
        }
      },
      setFlowParam(menuId){
        if(menuId === "carTraffic-3"){
          this.rangeMax = this.car_traffic_3.flowmax;
          this.rangeMin = this.car_traffic_3.flowmin;
          this.updateFlowRangeMax(this.rangeMax);
          this.updateFlowRangeMin(this.rangeMin);
        }else if(menuId === "init"){
          this.rangeMax = MYCONF.FLOW_RANGE_MAX;
          this.rangeMin = MYCONF.FLOW_RANGE_MIN;
          this.updateFlowRangeMax(MYCONF.FLOW_RANGE_MAX);
          this.updateFlowRangeMin(MYCONF.FLOW_RANGE_MIN);
        }
      },
      setFlowRangeMin(data){
        this.updateFlowRangeMin(data);
      },
      setFlowBackgroundShow(data){
        this.updateFlowBackgroundShow(data);
        let attrBool = data ? 'visible' : 'none';
        let layerList = data && !this.isLabelShow ? ['carTraffic-3-background'] : [ 'carTraffic-3-background','carTraffic-3-background-symbol'];
        if (env.map) {
          layerList.map((layerId) => {
            if (env.map.getLayer(layerId)) {
              env.map.setLayoutProperty(layerId, 'visibility', attrBool);
            }
          });
        }
      }
    },
    watch: {
      link_list(newVal) {
        this.roadList = newVal;
      },
      rangeMin(newVal){
        let id = this.cur_menu.id;
        MapCommonLayer.filterMenuLayer(id, newVal);
      },
      rangeMax(newVal){
        if(newVal){
          this.updateFlowRangeMax(newVal);
        }
      }
    },
    beforeDestroy() {
      eventBus.$off("getPanelParam");
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../common/common.scss";

  .box {
    margin-bottom: 1em;
    hr {
      margin-left: 2.2em;
      opacity: 0.3;
      border-width: 0.01em;
    }
    p {
      margin: 0.6em 0;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        margin-left: 2.2em;
        &.left {
          justify-content: flex-start;
          .opacity {
            opacity: 0.6;
            margin-left: 5px;
          }
        }
        & > span:first-child {
          /*text-indent: 2.2em;*/
        }
        & > .btn {
          width: 12.5em;
          margin-right: 0.7em;
          background-color: #adadad;
          cursor: pointer;
          color: #000;
          letter-spacing: 1px;
          &:hover, &.active {
            background-color: $bg-red;
            color: #fff;
            font-weight: 600;
            transition: all ease-in-out 0.3s;
          }
        }
        & > .clear {
          flex: 1;
          background-color: #fff;
          .icon-clear {
            font-size: 1.6em;
            color: $bg-red;
            cursor: pointer;
          }
        }
        span {
          &.reset {
            width: 2.5em;
            height: 2.5em;
            margin-top: 0.25em;
            margin-left: 0.8em;
            background-color: #666;
            line-height: 2.5em;
            cursor: pointer;
            .icon {
              color: #000;
              font-size: 1.4em;
            }
          }
          &.range {
            width: 10em;
            text-align: left;
          }
          &.slide {
            width: 10em;
            text-align: left;
          }
          &.response {
            flex: 1;
          }
        }
      }
    }
    div.list {
      margin-left: 2.2em;
      p {
        margin: 0;
        background-color: #4a4a4a;
        display: flex;
        line-height: 2.6em;
        display: flex;
        span {
          flex: 1;
          &.icon {
            flex: 0.9;
          }
          &.name {
            flex: 1.7;
          }
        }
      }
    }
  }
</style>
