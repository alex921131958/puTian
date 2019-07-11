<template>
  <div id="panel">
    <div class="inner">
      <p class="title">交评方案比选</p>
      <SubTitle title="建设内容比较"/>
      <Construction></Construction>

      <p class="tip-title" v-show="isShow">
        <span>交通影响比较</span><span class="tip">(更改分析范围需应用方可生效)</span>
      </p>
      <TrafficInfluence v-show="isShow"></TrafficInfluence>

      <p class="tip-title">
        <span>显示选项</span><span class="tip">(选择单方案时显示为影响后数值)</span>
      </p>
      <ShowOption></ShowOption>

    </div>
    <StepSaveComp @stepSave="stepSaveHandler"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SubTitle from '../common/SubTitle'
  import StepSaveComp from '../common/StepSaveComp'
  import FLOWCONF from '../../flowConf'
  import MYCONF from '../../../../myconf'
  import Construction from '../compare/Construction'
  import TrafficInfluence from '../compare/TrafficInfluence'
  import ShowOption from '../compare/ShowOption'

  export default {
    name: "ComparePanel",
    data() {
      return {
        isShow:false
      }
    },
    mounted() {

    },
    computed: {
      ...mapGetters(['panel_show','cur_pro_id','index_travelVol','index_trafficVol']),
    },
    components: {
      SubTitle,
      StepSaveComp,
      Construction,
      TrafficInfluence,
      ShowOption,
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateTravelIndex','updateTrafficIndex','updateStepOneDataType']),
      stepSaveHandler(step){
      },

    },
    watch:{

    }
  }

</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  #panel {
    height: calc(100vh - 8em);
    text-align: left;
    .inner {
      padding: 1em 1.5em;
      p .title{
        font-size: 1.4em;
        line-height: 2em;
        font-weight: bold;
      }
      .tip-title{
        font-size: 1.1em;
        line-height: 2em;
        font-weight: 600;
        margin-top: 0.5rem;
        .tip{
          margin-left: 0.5em;
          font-size: 0.9rem;
          color: $highlight;
        }
      }

    }
  }
</style>
