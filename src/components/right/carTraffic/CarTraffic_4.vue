<template>
  <div id="panel">
    <div class="inner">
      <p class="panel-title">车辆溯源</p>
      <div class="ctl-box">
        <TimeCtlPanel/>
        <SourceConPanel :title="contentTitle"/>
        <SourceDisPanel :title="displayTitle"/>
      </div>
    </div>
    <PanelSaveComp/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import TimeCtlPanel from '../subComp/TimeCtlPanel'
  import PanelSaveComp from '../subComp/PanelSaveComp'
  import SourceConPanel from '../subComp/SourceConPanel'
  import SourceDisPanel from '../subComp/SourceDisPanel'
  import carTrafficHandler_4 from '../../../service/workbench/carTrafficHandler_4'

  export default {
    name: "CarTraffic_3",
    data() {
      return {
        contentTitle:'溯源内容',
        displayTitle:'溯源显示',
      }
    },
    components: {
      TimeCtlPanel,
      SourceConPanel,
      SourceDisPanel,
      PanelSaveComp,
    },
    mounted(){
      this.controller = new carTrafficHandler_4(this);
      this.$nextTick(() => {
        this.controller.getPanelParams();
      });
    },
    computed: {
      ...mapGetters(['panel_time','display_time','cur_menu','car_traffic_4', 'link_id', 'link_list', 'buffer_width','flow_label_show','buffer_color',
        'selected_only','flow_range_max','flow_range_min','tracking_type']),
    },
    methods: {
      ...mapMutations(['updateCarTraffic4','updateLinkList','updateLinkId','updatePanelTime','updateDisplayTime','updateFlowRangeMax','updateFlowRangeMin',
        'updataCurAdvanceType','updataTrackingType','updatePanelVType']),
      setCurTab(type){
        this.curTab = type;
      },
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
