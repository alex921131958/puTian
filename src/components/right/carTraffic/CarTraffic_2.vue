<template>
  <div id="panel">
    <div class="inner">
      <p class="panel-title">拥堵识别</p>
      <div class="ctl-box">
        <TimeCtlPanel/>
        <TrafficCtlPanel :title="roadTitle"/>
      </div>
    </div>
    <PanelSaveComp/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import TimeCtlPanel from '../subComp/TimeCtlPanel'
  import TrafficCtlPanel from '../subComp/TrafficCtlPanel'
  import PanelSaveComp from '../subComp/PanelSaveComp'
  import carTrafficHandler_2 from '../../../service/workbench/carTrafficHandler_2'

  export default {
    name: "CarTraffic_2",
    data() {
      return {
        roadTitle:'拥堵路段显示',
      }
    },
    components: {
      TimeCtlPanel,
      TrafficCtlPanel,
      PanelSaveComp,
    },
    mounted(){
      this.controller = new carTrafficHandler_2(this);
      this.$nextTick(() => {
        this.controller.getPanelParams();
      });
    },
    computed: {
      ...mapGetters(['panel_time','display_time','cur_menu','car_traffic_2', 'link_id', 'link_list']),
    },
    methods: {
      ...mapMutations(['updateCarTraffic2','updateLinkList','updateLinkId','updatePanelTime','updateDisplayTime','updatePanelVType']),
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
