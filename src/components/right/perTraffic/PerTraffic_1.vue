<!--  OD分析 -->

<template>
  <div id="panel" ref="panelH">
    <div class="inner" ref="innerH">
      <p class="panel-title">个体出行OD分析</p>
      <div class="ctl-box">
        <TimeCtlPanel/>
        <AllMethodPanel :title="odTitle"/>
      </div>
    </div>
    <PanelSaveComp/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import env from '../../../common/env'
  import TimeCtlPanel from '../subComp/TimeCtlPanel'
  import AllMethodPanel from '../subComp/AllMethodOdPanel'
  import PanelSaveComp from '../subComp/PanelSaveComp'
  import personTripHandle_1 from '../../../service/workbench/personTripHandle_1'

  export default {
    // name: "cmnTraffic",
    data(){
      return{
        odTitle: '个体出行OD分析'
      }
    },
    mounted() {
      this.controller = new personTripHandle_1(this);
      this.$nextTick(() => {
        this.controller.getPanelParams();
      });
    },
    components:{
      TimeCtlPanel,
      AllMethodPanel,
      PanelSaveComp,
    },
    computed: {
      ...mapGetters(['panel_time','display_time','cur_menu','car_traffic_4', 'link_id', 'link_list', 'buffer_width','flow_label_show','buffer_color',
        'selected_only','flow_range_max','flow_range_min','tracking_type','display_mode','distance_type','villageType']),
    },
    methods:{
      ...mapMutations(['updatePersonTrip1','updateLinkList','updateLinkId','updatePanelTime','updateDisplayTime','updateFlowRangeMax','updateFlowRangeMin',
        'updataCurAdvanceType','updataTrackingType','updateGlobalArea']),
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
