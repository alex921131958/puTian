<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="tab-p">
          <span @click="setCurTab('base')" :class="{active:curTab==='base'}">基础溯源</span>
          <span @click="setCurTab('advance')" :class="{active:curTab==='advance'}">高级通道溯源</span>
        </p>
        <div v-if="curTab==='base'">
          <p class="list check-list">
            <span>溯源类型<span style="opacity:0.6">(可多选)</span></span>
            <ChkGroupComp v-model="typeList">
              <ChkComp label="途经"></ChkComp>
              <ChkComp label="出发"></ChkComp>
              <ChkComp label="到达"></ChkComp>
              <ChkComp label="内部"></ChkComp>
            </ChkGroupComp>
          </p>
          <RoadList :roadTitle="road_title" :roadList="roadList"/>
        </div>
        <div v-if="curTab==='advance'">
          <p class="list">
            <span>起点道路集A溯源类型<span style="opacity:0.6">(可多选)</span></span>
            <ChkGroupComp v-model="advanceTypeA">
              <ChkComp label="途经"></ChkComp>
              <ChkComp label="出发"></ChkComp>
            </ChkGroupComp>
          </p>
          <AdvanceRoadList advanceType="A" :roadTitle="roadTitleA" :roadList="roadListA" @setAdvanceEdit="setAdvanceEdit"/>
          <p class="list">
            <span>终点道路集B溯源类型<span style="opacity:0.6">(可多选)</span></span>
            <ChkGroupComp v-model="advanceTypeB">
              <ChkComp label="途经"></ChkComp>
              <ChkComp label="到达"></ChkComp>
            </ChkGroupComp>
          </p>
          <AdvanceRoadList advanceType="B" :roadTitle="roadTitleB" :roadList="roadListB" @setAdvanceEdit="setAdvanceEdit" @setMapClickEvent="setMapClickEvent"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import env from '../../../common/env'
  import RoadList from '../../common/RoadList'
  import AdvanceRoadList from '../../common/advanceRoadList'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import eventBus from '../../../util/event-bus'
  import utilHelper from '../../../util/util-helper'

  export default {
    name: 'SourceConPanel',
    data() {
      return {
        isPanelOpen: true,
        curTab:'base',
        typeList:['途经'],
        advanceTypeA:['途经'],
        advanceTypeB:['途经'],
        curAdvanceType:'',
        roadList:MYCONF.ROAD_LIST,
        roadListA:MYCONF.ROAD_LIST,
        roadListB:MYCONF.ROAD_LIST,
        roadTitleA:'点击开始选择道路集A',
        roadTitleB:'点击开始选择道路集B',
        isRoadEditA:false,     //地图是否可编辑
        isRoadEditB:false,
      }
    },
    mounted() {
      eventBus.$on("getPanelParam",(menuId) => {
        this.setSourceParam(menuId);
      });
      eventBus.$on("setParamEvent",(type) => {      //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if(type === 'clear'){                //取消
          this.setSourceParam(menuId);
        }else{                              //初始化
          this.setSourceParam("init");
        }
      });
    },
    computed: {
      ...mapGetters(['isRoadEditable','panel_time','link_id','link_list','link_id_A','link_id_B','link_list_A','link_list_B','road_title',
        'cur_advance_type','tracking_type','common_link_id','map_click_disabled','source_type','car_traffic_4','cur_menu']),
    },
    props: {
      title:{
        type:String
      }
    },
    components: {
      RoadList,
      AdvanceRoadList,
    },
    methods: {
      ...mapMutations(['updateRoadEditable','updataSourceType','updataAdvanceA','updataAdvanceB','updataCurAdvanceType','updataTrackingType',
        'updateCommonLinkId','updateMapClickDisabled','updateClickDisabledType','updateLinkList','updateLinkId']),

      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('trafficPanel');
      },
      setCurTab(type){
        this.updataTrackingType(type);
        if(this.curTab === 'base' && type === 'advance'){
          this.updateRoadEditable(false);
        }
        this.curTab = type;
        let curType = type==='base'?'':this.cur_advance_type;
        this.updataCurAdvanceType(curType);
        this.updateMapClickDisabled(false);
        this.updateClickDisabledType('');
      },
      setAdvanceEdit(type){
        this.updataCurAdvanceType(type);
        if(type === 'A'){
          this.isRoadEditA = !this.isRoadEditA;
          this.isRoadEditB = this.isRoadEditA ? false : this.isRoadEditB;
          this.roadTitleA = this.isRoadEditA?'点击结束选择道路集A':'点击开始选择道路集A';
          if(this.roadTitleA){
            this.roadTitleB = '点击开始选择道路集B';
            this.updateRoadEditable(true);
          }
        }else{
          this.isRoadEditB = !this.isRoadEditB;
          this.isRoadEditA = this.isRoadEditB ? false : this.isRoadEditA;
          this.roadTitleB = this.isRoadEditB?'点击结束选择道路集B':'点击开始选择道路集B';
          if(this.roadTitleB){
            this.roadTitleA = '点击开始选择道路集A';
            this.updateRoadEditable(true);
          }
        }
        if(this.isRoadEditA || this.isRoadEditB){
          let linkIds = this.cur_advance_type==='A'?this.link_id_A:this.link_id_B;
          if (env.map.getLayer('baseRoadHighlight')) env.map.setFilter('baseRoadHighlight', ["in", "linkid", ...linkIds]);
        }
      },
      setMapClickEvent(type){
        this.updataCurAdvanceType(type);
      },
      setSourceType(type){
        this.typeList = [];
        let sourceType = type.split(",");
        if(sourceType.includes('0')){
          this.typeList.push('途经')
        }
        if(sourceType.includes('1')){
          this.typeList.push('出发')
        }
        if(sourceType.includes('2')){
          this.typeList.push('到达')
        }
        if(sourceType.includes('3')){
          this.typeList.push('内部')
        }
      },
      setSourceParam(menuId){
        if(menuId === "carTraffic-4"){
          let sourceType = this.car_traffic_4.sourcetype.split("#").join(",");
          this.updataSourceType(sourceType);
          this.setSourceType(sourceType);
        }else if(menuId === "init"){
          this.updataSourceType("0");
          this.setSourceType("0");
        }
      }
    },
    //8.03
    watch: {
      link_list(newVal){
        this.roadList = newVal;
      },
      link_list_A(newVal){
        this.roadListA = newVal;
      },
      link_list_B(newVal){
        this.roadListB = newVal;
      },
      typeList(newVal){
        let listSource = [];
        if(newVal.includes('途经')){
          listSource.push('0')
        }
        if(newVal.includes('出发')){
          listSource.push('1')
        }
        if(newVal.includes('到达')){
          listSource.push('2')
        }
        if(newVal.includes('内部')){
          listSource.push('3')
        }
        this.updataSourceType(listSource.join(','));
      },

      advanceTypeA(newVal){
        let listSource = [];
        if(newVal.includes('途经')){
          listSource.push('0')
        }
        if(newVal.includes('出发')){
          listSource.push('1')
        }
        this.updataAdvanceA(listSource.join(','));
      },
      advanceTypeB(newVal){
        let listSource = [];
        if(newVal.includes('途经')){
          listSource.push('0')
        }
        if(newVal.includes('到达')){
          listSource.push('1')
        }
        this.updataAdvanceB(listSource.join(','));
      },
      isRoadEditable(newVal){
        if(!newVal){
          this.isRoadEditA = false;
          this.isRoadEditB = false;
          this.roadTitleA = '点击开始选择道路集A';
          this.roadTitleB = '点击开始选择道路集B';
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
    p {
      margin: 0.6em 0;
      &.tab-p{
        line-height: 2em;
        margin: 0.8em 0 0.8em 1.8em;
        text-align: left;
        span{
          opacity: 0.6;
          font-size: $font-arrow;
          font-weight: bold;
          display: inline-block;
          padding: 3px;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          &:hover,&.active{
            opacity: 1;
            border-color: $bg-red;
          }
        }
      }
      &.ctl-title {
        text-align: left;
        font-weight: bolder;
        margin-top: 2em;
      }
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        margin-left: 2.2em;
        &.check-list{
          white-space: nowrap;
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
