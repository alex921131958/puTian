<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span>显示内容</span>
          <RadioGroupComp v-model="curRender">
            <RadioComp :label="item" v-for="item in renderType" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>
        <p class="list">
          <span>仅显示建成区内公交速度</span>
          <span class="switch"><SwitchComp v-model="isTazOnly" @on-change="updateTazOnly(isTazOnly)"/></span>
        </p>
        <p class="list">
          <span>仅显示选择路段公交速度</span>
          <span class="switch"><SwitchComp v-model="isSelectedOnly" @on-change="updateSelectedOnly(isSelectedOnly)"/></span>
        </p>
        <p :class="['list',isSelectedOnly?'':'disabled']">
          <span>选择模式</span>
          <RadioGroupComp v-model="curType">
            <RadioComp :label="item" v-for="item in typeList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>
        <RoadList :roadList="roadList" :disabled="curType==='按线路选择'||!isSelectedOnly"/>
        <p :class="['list',curType==='按道路选择'||!isSelectedOnly?'disabled':'']">
          <span>选择公交线路</span>
          <i-select v-model="curBusLine" style="width:10em;" :label-in-value="labelInValue" @on-change="setCurBusLine">
            <i-option v-for="item in bus_line_list" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-select>
        </p>
        <!--<div class="tip-panel">
          <i class="icon iconfont icon-warn"></i>
          <p>当在道路选择中仅选择一个路段时，分析面板将显示途经该路段的各条公交线路的拥堵情况。</p>
        </div>-->
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import RoadList from '../../common/RoadList'
  import trafficPanelHandler from '../../../service/common/trafficPanelHandler'
  import eventBus from '../../../util/event-bus'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'

  export default {
    name: 'BusSpeedPanel',
    data() {
      return {
        isPanelOpen: true,
        roadList:MYCONF.ROAD_LIST,
        roadTitle:'点击开始选择道路',
        isTazOnly: true,
        isSelectedOnly:false,
        curType:'按道路选择',    //道路选择模式：道路road，线路line
        typeList:['按道路选择','按线路选择'],
        renderType:['公交运行速度','小汽车-公交速度差'],
        curRender:'公交运行速度',    //
        curBusLine:MYCONF.BUS_LINE_LIST[0].value,
        curBusObj:null,
        labelInValue:true,
      }
    },
    mounted() {
      this.controller = new trafficPanelHandler(this);
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
      ...mapGetters(['cur_menu','panel_time','isRoadEditable','bus_line_list','cmn_traffic_1','link_list','bus_speed_type','cur_bus_line']),
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
      ...mapMutations(['updateRoadEditable','updateSelectedOnly','updateRoadSelType','updateCurBusLine','updateBusSpeedType',
      'updateTazOnly']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
      },
      setCurBusLine(data){
        this.curBusObj = data;
        if(data){
          this.updateCurBusLine({
            label:data.label,
            value:parseInt(data.value)
          });
          MapCommonLayer.busLineCenter(this,data.value,true);
        }
      },
      setFlowParam(menuId){
        if(menuId === "cmnTraffic-1"){
          this.curType = this.cmn_traffic_1.roadtype==='line'?'按线路选择':'按道路选择';
          this.curRender = parseInt(this.cmn_traffic_1.speedtype)===1?'小汽车-公交速度差':'公交运行速度';
          this.updateRoadSelType(this.cmn_traffic_1.roadtype);
          if(this.cmn_traffic_1.roadtype==='line' && this.cmn_traffic_1.links && this.cmn_traffic_1.links!==''){
            this.updateCurBusLine({
              label:this.cmn_traffic_1.links.split("#")[1],
              value:parseInt(this.cmn_traffic_1.links.split("#")[0])
            });
            this.curBusLine = String(this.cmn_traffic_1.links.split("#")[0]);
          }else{
            this.updateCurBusLine(null);
            this.curBusLine = null;
          }
        }else if(menuId === "init"){
          this.curType = '按道路选择';
          this.curBusLine = null;
          this.updateRoadSelType('road');
          this.updateCurBusLine(null);
        }
      },

    },
    watch:{
      link_list(newVal) {
        this.roadList = newVal;
      },
      curType(newVal){
        let type = newVal==='按道路选择'?'road':'line';
        this.updateRoadSelType(type);
      },
      curRender(newVal){
        let type = newVal==='公交运行速度'?0:1;
        this.updateBusSpeedType(type);
      },
      isTazOnly(newVal,oldVal){
        if(newVal){
          this.isSelectedOnly = false;
          this.updateSelectedOnly(false);
        }
      },
      isSelectedOnly(newVal,oldVal){
        if(newVal){
          this.isTazOnly = false;
          this.updateTazOnly(false);
        }
      },
      cur_bus_line(newVal){
        if(newVal && newVal.value){
          this.curBusLine = newVal.value;
        }
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
        margin-left: 2.2em;
        &.disabled{
          pointer-events: none;
          opacity: 0.6;
        }
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
      }
    }
    .tip-panel{
      background-color: #602D2A;
      padding: 0.6em 1em;
      text-align: left;
      color: #ddd;
      .icon{
        float: left;
      }
      p{
        margin: 0 0 0 1.8em;
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
