<template>
  <div id="panel">
    <div class="inner">
      <p class="panel-title">公交分担率分析</p>
      <div class="ctl-box">
        <TimeCtlPanel/>
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
  import PanelSaveComp from '../subComp/PanelSaveComp'

  export default {
    name: "BusTraffic_6",
    data(){
      return{
      }
    },
    mounted() {
    },
    components:{
      TimeCtlPanel,
      PanelSaveComp
    },
    methods:{
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
