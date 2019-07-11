<template>
  <div id="panel">
    <div class="inner">
      <p class="panel-title">路况分析</p>
      <p class="tab-p">
        <span @click="setCurTab('history')" :class="{active:cur_tra==='history'}">历史路况</span>
        <span @click="setCurTab('realtime')" :class="{active:cur_tra==='realtime'}">实时路况</span>
      </p>
      <div class="ctl-box">
        <TimeCtlPanel/>
        <TrafficCtlPanel :title="roadTitle"/>
        <div class="ctl-mask" v-if="cur_tra==='realtime'"></div>
      </div>
    </div>
    <PanelSaveComp :disabled="cur_tra==='realtime'"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import env from '../../../common/env'
  import TimeCtlPanel from '../subComp/TimeCtlPanel'
  import TrafficCtlPanel from '../subComp/TrafficCtlPanel'
  import PanelSaveComp from '../subComp/PanelSaveComp'
  import carTrafficHandler_1 from '../../../service/workbench/carTrafficHandler_1'
  import mapCommonLayer from '../../../service/map/mapCommonLayer'

  export default {
    name: "CarTraffic_1",
    data() {
      return {
        roadTitle:'路况显示',
        curTab:'history',
      }
    },
    components: {
      TimeCtlPanel,
      TrafficCtlPanel,
      PanelSaveComp,
    },
    mounted(){
      this.controller = new carTrafficHandler_1(this);
      this.$nextTick(() => {
        this.controller.getPanelParams();
        this.updateCurTra('history');
      });
    },
    computed: {
      ...mapGetters(['panel_time','display_time','cur_menu','car_traffic_1', 'link_id', 'link_list','cur_tra']),
    },
    methods: {
      ...mapMutations(['updateCarTraffic1','updateLinkList','updateLinkId','updatePanelTime','updateDisplayTime','updateCurTra','updatePanelVType']),
      setCurTab(type){
        let layerId = "carTraffic-1";
        this.curTab = type;
        this.updateCurTra(type);
        if(type === 'realtime'){
          if (env.map.getLayer(layerId)) {
            env.map.setLayoutProperty(layerId,'visibility','none')
          }
          mapCommonLayer.setRealTrafficShow();
        }else{
          if (env.map.getLayer(layerId)) {
            env.map.setLayoutProperty(layerId,'visibility','visible')
          }
          mapCommonLayer.setRealTrafficHide();
        }
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common";

  #panel {
    height: calc(100vh - 8em);
    .inner{
      .ctl-box{
        position: relative;
        .ctl-mask{
          position: absolute;
          top: 0;
          left: 0;
          z-index: 500;
          width: 100%;
          height: 100%;
          background: rgba(36, 36, 35,0.5);
        }
      }
    }
    p{
      text-align: left;
      &.panel-title{
        line-height: 2em;
      }
      &.tab-p{
        line-height: 2em;
        margin: 0.4em 0 1.5em 1.8em;
        span{
          opacity: 0.6;
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
    }
  }

</style>
