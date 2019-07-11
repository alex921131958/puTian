<template>
  <div id="panel">
    <div class="inner">
      <StepTitle title="交评时间与预设" :step="step"/>
      <SubTitle title="交评时间设置"/>
      <TipMessage/>
      <TimeSetting :proDate="proDate" :proYear="proYear" @updateDateType="updateDateType" @updateYear="updateYear" @updateAimYear="updateAimYear" ref="timeSet"/>

      <SubTitle title="交通量预测调整系数预设"/>
      <RatioPreSetting ref="ratioPreSet" :landVolume="landVolume" :roadVolume="roadVolume" @updateTrafficVol="updateTrafficVol" @landItemChange="landItemChange"/>
    </div>
    <StepSaveComp @stepSave="stepSaveHandler"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import StepTitle from '../common/StepTitle'
  import SubTitle from '../common/SubTitle'
  import StepSaveComp from '../common/StepSaveComp'
  import TipMessage from '../step_1/TipMessage'
  import TimeSetting from '../step_1/TimeSetting'
  import RatioPreSetting from '../step_1/RatioPreSetting'
  import FLOWCONF from '../../flowConf'
  import MYCONF from '../../../../myconf'
  import StepPanelHandler_1 from '../../../../service/workflow/stepPanelHandler_1'

  export default {
    name: "PanelStep_1",
    data() {
      return {
        step: 1,
        landVolume:JSON.parse(JSON.stringify(FLOWCONF.TRAVEL_VOLUME)),
        roadVolume:JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_VOLUME)),
        proDate: MYCONF.DATE_LIST[0],
        proYear: MYCONF.YEAR_LIST[2].label,
        aimYear: MYCONF.TARGET_YEAR,
      }
    },
    mounted() {
      this.controller = new StepPanelHandler_1(this);
      let _this = this;
      setTimeout(() => {
        _this.controller.getProPreSetting();
      },150);
    },
    computed: {
      ...mapGetters(['panel_show','cur_pro_id','index_travelVol','index_trafficVol']),
    },
    components: {
      StepTitle,
      SubTitle,
      StepSaveComp,
      TipMessage,
      TimeSetting,
      RatioPreSetting,
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateTravelIndex','updateTrafficIndex','updateStepOneDataType']),
      stepSaveHandler(step){
        this.$refs.ratioPreSet.updateRatioPreSetting();
        this.controller.saveStepParam_1();
      },
      updateDateType(data){
        this.proDate = data;
        this.updateStepOneDataType(data)
      },
      updateYear(data){
        this.proYear = data;
      },
      updateAimYear(data){
        this.aimYear = data;
      },
      updateTrafficVol(obj){
        // this.$set(this.roadVolume,Object.keys(obj)[0],Object.values(obj)[0]);
        this.roadVolume = obj;
        this.updateTrafficIndex(obj);
      },
      landItemChange(obj){
        // this.$set(this.landVolume[type],item,val);
        this.landVolume = obj;
        this.updateTravelIndex(obj);
      }
    },
    watch:{
      proDate(val){
        this.$refs['timeSet'].updateDate(val);
      },
      proYear(val){
        this.$refs['timeSet'].updateYear(val);
      },
      aimYear(val){
        this.$refs['timeSet'].updateAimYear(val);
      }
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
    }
  }

</style>
