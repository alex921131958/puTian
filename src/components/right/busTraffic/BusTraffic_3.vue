<template>
  <div id="panel">
    <div class="inner">
      <p class="panel-title">公交车流量</p>
      <div class="ctl-box">
        <TimeCtlPanel/>
        <BusFlowPanel :title="roadTitle"/>
      </div>
    </div>
    <PanelSaveComp/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import TimeCtlPanel from '../subComp/TimeCtlPanel'
  import BusFlowPanel from '../subComp/BusFlowPanel'
  import PanelSaveComp from '../subComp/PanelSaveComp'
  import cmnTrafficHandler_3 from '../../../service/workbench/cmnTrafficHandler_3'

  export default {
    name: "BusTraffic_3",
    data(){
      return{
        roadTitle:'全网流量显示',
      }
    },
    mounted() {
      this.controller = new cmnTrafficHandler_3(this);
      this.$nextTick(() => {
        this.controller.getPanelParams();
      });
    },
    components:{
      TimeCtlPanel,
      BusFlowPanel,
      PanelSaveComp
    },
    computed: {
      ...mapGetters(['panel_time','display_time','cur_menu','cmn_traffic_3', 'link_id', 'link_list', 'buffer_width','flow_label_show','buffer_color',
        'selected_only','flow_range_max','flow_range_min']),
    },
    methods: {
      ...mapMutations(['updateCmnTraffic3','updateLinkList','updateLinkId','updatePanelTime','updateDisplayTime','updateFlowRangeMax','updateFlowRangeMin','updatePanelVType']),
    },
    watch:{
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
