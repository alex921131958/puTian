<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">

        <p class="tab-p">
          <span @click="setCurTab('traffic')" :class="{active:curTab==='traffic'}">交通小区</span>
          <span @click="setCurTab('site')" :class="{active:curTab==='site'}">物理站点</span>
        </p>

        <div v-if="curTab==='traffic'">
          <p class="list">
            <span class="slide">期望线最小值</span>
            <span class="response"><SliderComp v-model="expMin" :min="0" :max="50" :step="1" show-input/></span>
            <!--<span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="expMin" size="large"/></span>-->
          </p>

          <p class="list">
            <span class="slide">期望线最大值</span>
            <span class="response"><SliderComp v-model="expMax" :min="0" :max="300" :step="1" show-input/></span>
            <!--<span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="expMax" size="large"/></span>-->
          </p>

          <p class="list">
            <span class="slide">单侧期望线<span>双向OD平均值</span></span>
            <span class="response"><SliderComp v-model="expWidth" :min="0" :max="50" :step="1" show-input @on-change="widthChange"/></span>
            <!--<span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="expWidth" size="large"/></span>-->
          </p>

          <p class="list">
            <span>小区出行强度显示</span>
            <RadioGroupComp v-model="showDate">
              <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
            </RadioGroupComp>
          </p>

          <p class="list">
            <span>期望线颜色</span>
            <span class="switch">
            <RadioGroupComp class="time-group" v-model="colorSel1">
              <RadioComp :label="item" v-for="item in colorList" :key="item"></RadioComp>
            </RadioGroupComp>
            <ColorPickerComp v-model="colorChange1" :colors="colors" :disabled="colorSel1!=='单色'" @on-change="setExpColor"/></span>
          </p>

          <p class="list">
            <span class="slide">期望线最大宽度</span>
            <span class="response"><SliderComp v-model="expWidth" :min="0" :max="50" :step="1" show-input @on-change="widthChange"/></span>
            <!--<span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="expWidth" size="large"/></span>-->
          </p>

          <p class="list">
            <span>仅显示选定小区OD</span>
            <span class="switch">
            <SwitchComp v-model="switch1"/>
          </span>
          </p>

          <p class="list">
            <span>合并显示所选定交通小区</span>
            <span class="switch"><SwitchComp :disabled="switch1 === false" @on-change="mergeDisplay" /></span>
          </p>

          <p class="list">
            <span>期望线类型</span>
            <RadioGroupComp v-model="showDate">
              <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
            </RadioGroupComp>
          </p>

          <p class="list">
            <span>显示模式</span>
            <RadioGroupComp v-model="showDate">
              <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
            </RadioGroupComp>
          </p>

          <p class="list">
            <span>多图层全局小区选取</span>
            <span class="switch"><SwitchComp :disabled="switch1 === false" @on-change="mergeDisplay" /></span>
          </p>

          <VillageList villageType1="panel" :noDataVill="noDataVill" :villageTitle="villageTitle" :villageList="villageList" :class="{hidden:((villMethod === '全局' && global_v_type === 0) || switch1 === false)}"/>
        </div>

        <div v-if="curTab==='site'">
          <p class="list">
            <span class="slide">期望线最小值</span>
            <span class="response"><SliderComp v-model="expMin" :min="0" :max="50" :step="1" show-input/></span>
            <!--<span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="expMin" size="large"/></span>-->
          </p>

          <p class="list">
            <span class="slide">期望线最大值</span>
            <span class="response"><SliderComp v-model="expMax" :min="0" :max="300" :step="1" show-input/></span>
            <!--<span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="expMax" size="large"/></span>-->
          </p>

          <p class="list">
            <span class="slide">单侧期望线<span>双向OD平均值</span></span>
            <span class="response"><SliderComp v-model="expWidth" :min="0" :max="50" :step="1" show-input @on-change="widthChange"/></span>
            <!--<span class="switch"><InputNumberComp :max="10" :min="1" :step="1" v-model="expWidth" size="large"/></span>-->
          </p>

          <p class="list">
            <span>小区出行强度显示</span>
            <RadioGroupComp v-model="showDate">
              <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
            </RadioGroupComp>
          </p>

          <p class="list">
            <span>期望线颜色</span>
            <span class="switch">
            <RadioGroupComp class="time-group">
              <RadioComp></RadioComp>
            </RadioGroupComp>
            <ColorPickerComp/></span>
          </p>

          <p class="list">
            <span>仅显示选定站点OD</span>
            <span class="switch">
            <SwitchComp/>
          </span>
          </p>

          <p class="list">
            <span>期望线类型</span>
            <RadioGroupComp>
              <RadioComp></RadioComp>
            </RadioGroupComp>
          </p>
        </div>
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
  import VillageList from '../../common/VillageList'

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
      VillageList,
    },
    methods: {
      ...mapMutations(['updateRoadEditable', 'updateBufferWidth','updateFlowLabel','updateBufferColor','updateBufferWidth','updateSelectedOnly',
        'updateFlowRangeMax','updateFlowRangeMin','updateLinkId','updateLinkList','updateMapClickDisabled','updateRoadSelType','updateCurBusLine']),
      setPanelState() {
        this.isPanelOpen = !this.isPanelOpen;
      },
      setCurTab(type){

      },
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
          span{
            color: #adadad;
          }
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
