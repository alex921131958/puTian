<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">

        <p class="list">
          <span>路线选择</span>
          <i-select v-model="curBusLine" filterable style="width:10em;" :label-in-value="labelInValue" @on-change="setCurBusLine">
            <i-option v-for="item in bus_line_list" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-select>
        </p>

        <p class="list">
          <span class="range">流量显示上限(人次)</span>
          <span class="response"><SliderComp v-model="rangeMax" :min="500" :max="2000" :step="5" show-input @on-change="updateFlowRangeMax(rangeMax)"/></span>
          <span class="reset" @click="resetRangeFlow('max')"><i class="icon iconfont icon-refresh"></i></span>
        </p>

        <p class="list">
          <span class="range">流量显示下限(人次)</span>
          <span class="response"><SliderComp v-model="rangeMin" :min="0" :max="2000" :step="1" show-input @on-change="setFlowRangeMin"/></span>
          <span class="reset" @click="resetRangeFlow('min')"><i class="icon iconfont icon-refresh"></i></span>
        </p>

        <p class="list">
          <span class="slide">最大流量显示宽度</span>
          <span class="response"><SliderComp v-model="buffer_width['cmnTraffic-3']" :min="-20" :max="20" :step="1" show-input @on-change="slideChange"/></span>
        </p>

        <p class="list">
          <span>色带颜色</span>
          <span class="switch"><ColorPickerComp v-model="buffer_color['cmnTraffic-3']" :colors="colors" @on-change="setBufferColor"/></span>
        </p>

        <p class="list">
          <span>显示流量值标注</span>
          <span class="switch"><SwitchComp v-model="isLabelShow" @on-change="updateFlowLabel(isLabelShow)"/></span>
        </p>
        <hr>

      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import RoadList from '../../common/RoadList'
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
        curType:'按道路选择',    //道路选择模式：道路road，线路line
        typeList:['按道路选择','按线路选择'],
        curBusLine:MYCONF.BUS_LINE_LIST[0].value,
        curBusObj:null,
        labelInValue:true,
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
      ...mapGetters(['cur_menu','isRoadEditable', 'panel_time', 'link_id', 'link_list', 'buffer_width', 'cur_menu','flow_label_show','buffer_color',
        'selected_only','flow_range_max','flow_range_min','cmn_traffic_3','bus_line_list','cur_bus_line']),
    },
    props: {
      title: {
        type: String
      }
    },
    components: {
      RoadList,
    },
    methods: {
      ...mapMutations(['updateRoadEditable', 'updateBufferWidth','updateFlowLabel','updateBufferColor','updateBufferWidth','updateSelectedOnly',
        'updateFlowRangeMax','updateFlowRangeMin','updateLinkId','updateLinkList','updateMapClickDisabled','updateRoadSelType','updateCurBusLine']),
      setPanelState() {
        this.isPanelOpen = !this.isPanelOpen;
      },
      slideChange(val){
        let id = this.cur_menu.id;
        this.updateBufferWidth({'cmnTraffic-3':val});
        MapCommonLayer.setBufferWidth(id, val);
      },
      setBufferColor(color){
        let id = this.cur_menu.id;
        this.updateBufferColor({'cmnTraffic-3':color});
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
        if(menuId === "cmnTraffic-3"){
          this.rangeMax = this.cmn_traffic_3.flowmax;
          this.rangeMin = this.cmn_traffic_3.flowmin;
          this.curType = this.cmn_traffic_3.roadtype==='line'?'按线路选择':'按道路选择';
          this.updateFlowRangeMax(this.rangeMax);
          this.updateFlowRangeMin(this.rangeMin);
          this.updateRoadSelType(this.cmn_traffic_3.roadtype);
          this.updateCurBusLine({
            label:this.cmn_traffic_3.links.split("#")[1],
            value:parseInt(this.cmn_traffic_3.links.split("#")[0])
          });
          this.curBusLine = String(this.cmn_traffic_3.links.split("#")[0]);
        }else if(menuId === "init"){
          this.rangeMax = MYCONF.FLOW_RANGE_MAX;
          this.rangeMin = MYCONF.FLOW_RANGE_MIN;
          this.curType = '按道路选择';
          this.curBusLine = null;
          this.updateFlowRangeMax(MYCONF.FLOW_RANGE_MAX);
          this.updateFlowRangeMin(MYCONF.FLOW_RANGE_MIN);
          this.updateRoadSelType('road');
          this.updateCurBusLine(null);
        }
      },
      setCurBusLine(data){
        this.curBusObj = data;
        this.updateCurBusLine({
          label:data.label,
          value:parseInt(data.value)
        });
        MapCommonLayer.busLineCenter(this,data.value,true);
      },
      setFlowRangeMin(data){
        this.updateFlowRangeMin(data);
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
      curType(newVal){
        let type = newVal==='按道路选择'?'road':'line';
        this.updateRoadSelType(type);
      },
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
      &.ctl-title {
        text-align: left;
        font-weight: bolder;
        margin-top: 2em;
        & > span {
          cursor: pointer;
          letter-spacing: 2px;
          font-size: $font-bigger;
          .icon-Arrow {
            position: relative;
            top: -0.2em;
            display: inline-block;
            font-size: 0.5em;
            opacity: 0.6;
            margin-right: 0.5em;
            transform: rotate(360deg);
            transition: all ease-in-out 0.3s;
            &.down {
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
        &.disabled{
          pointer-events: none;
          opacity: 0.6;
        }
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
            width: 14em;
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
