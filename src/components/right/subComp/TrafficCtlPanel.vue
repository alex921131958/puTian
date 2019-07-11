<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span>仅显示选择路段路况</span>
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
  import trafficPanelHandler from '../../../service/common/trafficPanelHandler'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import eventBus from '../../../util/event-bus'
  import utilHelper from '../../../util/util-helper'

  export default {
    name: 'TrafficCtlPanel',
    data() {
      return {
        isPanelOpen: true,
        roadList:MYCONF.ROAD_LIST,
        isSelectedOnly:MYCONF.SELECTED_ONLY,
      }
    },
    mounted() {
      this.controller = new trafficPanelHandler(this);
      /*eventBus.$on("getPanelParam",(menuId) => {
        if(menuId === "carTraffic-1"){
          let linkType = this.car_traffic_1.linktype;
          if(linkType === "link"){
            if(this.car_traffic_1.links !== ""){
              this.updateLinkList(utilHelper.getlinkList(this.car_traffic_1.links));
              this.updateLinkId(utilHelper.getlinkId(this.car_traffic_1.links));
              this.roadList = utilHelper.getlinkList(this.car_traffic_1.links);
            }else{
              this.updateLinkList([]);
              this.updateLinkId([]);
              this.roadList = [];
            }
            this.updateMapClickDisabled(false);
          }else{
            this.roadList = [];
            this.updateMapClickDisabled(true);
          }
        }else if(menuId === "carTraffic-2"){
          let linkType = this.car_traffic_2.linktype;
          if(linkType === "link"){
            if(this.car_traffic_2.links !== ""){
              this.updateLinkList(utilHelper.getlinkList(this.car_traffic_2.links));
              this.updateLinkId(utilHelper.getlinkId(this.car_traffic_2.links));
              this.roadList = utilHelper.getlinkList(this.car_traffic_2.links);
            }else{
              this.updateLinkList([]);
              this.updateLinkId([]);
              this.roadList = [];
            }
            this.updateMapClickDisabled(false);
          }else{
            this.roadList = [];
            this.updateMapClickDisabled(true);
          }
        }
      })*/
    },
    computed: {
      ...mapGetters(['isRoadEditable','link_id','link_list','panel_time','car_traffic_1','car_traffic_2','selected_only']),
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
      ...mapMutations(['updateRoadEditable','updateLinkId','updateLinkList','updateMapClickDisabled','updateSelectedOnly']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
      }
    },
    watch:{
      link_list(newVal){
        this.roadList = newVal;
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
