<template>
  <div id="panel" ref="panelH">
    <div class="inner" ref="innerH">
      <p class="panel-title">公交速度</p>
      <div class="ctl-box">
        <TimeCtlPanel />
        <BusSpeedPanel :title="roadTitle"/>
      </div>
    </div>
    <PanelSaveComp/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import RoadList from '../../common/RoadList'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import TimeCtlPanel from '../subComp/TimeCtlPanel'
  import BusSpeedPanel from '../subComp/BusSpeedPanel'
  import PanelSaveComp from '../subComp/PanelSaveComp'
  import cmnTrafficHandler_1 from '../../../service/workbench/cmnTrafficHandler_1'

  export default {
    name: "BusTraffic_1",
    data(){
      return{
        roadTitle: '公交速度显示'
      }
    },
    mounted() {
      this.controller = new cmnTrafficHandler_1(this);
      this.$nextTick(() => {
        this.controller.getPanelParams();
      });
    },
    components:{
      TimeCtlPanel,
      BusSpeedPanel,
      PanelSaveComp
    },
    computed: {
      ...mapGetters(['panel_time','display_time','cur_menu','cmn_traffic_1', 'link_id', 'link_list']),
    },
    methods: {
      ...mapMutations(['updateCmnTraffic1','updateLinkList','updateLinkId','updatePanelTime','updateDisplayTime','updatePanelVType']),
    }
  }
</script>

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
