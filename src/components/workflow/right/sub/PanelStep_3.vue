<template>
  <div id="panel">
    <div class="inner">
      <StepTitle title="规划道路交通分布预测" :step="step"/>
      <SubTitle title="道路相关交通分布调整系数"/>
      <TrafficRatio
        :trafficTemp="trafficTemp" :roadRadius="roadRadius" :trafficYell="trafficYell" :newDayNight="newDayNight"
        @roadRadiusChange="roadRadiusChange" @trafficVolChange="trafficVolChange" @dayNightChange="dayNightChange"
      />

      <TitleSwitch title="显示规划道路和地块" :isShow="isAreaShow" @setSwitchToggle="setSwitchToggle"/>
      <RoadFlow
                @setFlowMax="setFlowMax" @setFlowMin="setFlowMin" @setFlowWidth="setFlowWidth" @setFlowColor="setFlowColor" @setTrafficColor="setTrafficColor" @setBackgroundWidth="setBackgroundWidth"
                :newFlowMax="newFlowMax" :newFlowMin="newFlowMin" :newFlowWidth="newFlowWidth" :newFlowColor="newFlowColor" :newTrafficColor="newTrafficColor" :newBackgroundWidth="newBackgroundWidth"
      />
      <SubSwitch title="是否显示背景流量" :isShow="isBgFlowShow" @setSubSwitchToggle="setSubSwitchToggle('bgFlow')"/>
      <SubSwitch title="显示流量标注值" :isShow="isFlowShow" @setSubSwitchToggle="setSubSwitchToggle('flowLable')"/>

    </div>
    <StepSaveComp @stepSave="stepSaveHandler"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import StepTitle from '../common/StepTitle'
  import SubTitle from '../common/SubTitle'
  import StepSaveComp from '../common/StepSaveComp'
  import TrafficRatio from '../step_3/TrafficRatio'
  import RoadFlow from '../step_3/RoadFlow'
  import TitleSwitch from '../common/TitleSwitch'
  import SubSwitch from '../common/SubSwitch'
  import FLOWCONF from '../../flowConf'
  import StepPanelHandler_3 from '../../../../service/workflow/stepPanelHandler_3'
  import mapCommonLayer from '../../../../service/map/mapCommonLayer'

  export default {
    name: "PanelStep_3",
    data() {
      return {
        step: 3,
        isAreaShow: true,
        isFlowShow: true,
        isBgFlowShow: false,
        newFlowMax: 1000,
        newFlowMin: 1,
        newFlowWidth: FLOWCONF.BUFFER_COMMON,
        newBackgroundWidth: FLOWCONF.BUFFER_COMMON,
        newFlowColor: '#3B90EE',
        newTrafficColor: '#E63D35',
        trafficTemp: JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_VOLUME)),
        roadRadius: JSON.parse(JSON.stringify(FLOWCONF.ROADRADIUS)),
        trafficYell: JSON.parse(JSON.stringify(FLOWCONF.TRAFFICYELLOW)),
        newDayNight: '早高峰',
        polygonList: [],
      }
    },
    mounted() {
      this.controller = new StepPanelHandler_3(this);
      let _this = this;
      this.$nextTick(() => {
        _this.controller.getStepParam();
        _this.controller.getLandList();
      });
      this.controller.getRoadLinePaint();

    },
    computed: {
      ...mapGetters(['panel_show','roadTrafficModules','searchRadius','landFlowMax','landFlowMin','landFlowWidth',
        'landPlanColor','backgroundPlanColor', 'isLandPlanShow','isBackgroundFlowShow','isFlowRemakeShow','cur_pro_id',
        'landBackgroundWidth','timeRange','lineNewColor','lineChangeColor']),
    },
    components: {
      StepTitle,
      SubTitle,
      StepSaveComp,
      TrafficRatio,
      RoadFlow,
      TitleSwitch,
      SubSwitch
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateDayTraffic','updateMorningTraffic','updateEveningTraffic','updateSearchRadius',
        'updateLandFlowMax','updateLandFlowMin', 'updateLandFlowWidth','updateLandPlanColor','updateBackgroundPlanColor',
        'updateIsLandPlanShow','updateIsBackgroundFlowShow','updateIsFlowRemakeShow', 'updateRoadTrafficModules',
        'updateRoadTrafficDis','updateLandBackgroundWidth','updateTimeRange']),
      setSwitchToggle(){
        this.isAreaShow = !this.isAreaShow;
        this.updateIsLandPlanShow(this.isAreaShow);
        this.controller.setLandLayerHide(!this.isAreaShow);
      },
      setSubSwitchToggle(type){
        if(type === 'bgFlow'){
          this.isBgFlowShow = !this.isBgFlowShow;
          this.updateIsBackgroundFlowShow(this.isBgFlowShow);
          this.controller.backgroundFlowShow();
        }else if(type === 'flowLable'){
          this.isFlowShow = !this.isFlowShow;
          this.updateIsFlowRemakeShow(this.isFlowShow)
        }
      },
      setFlowMax(data){
        this.newFlowMax = data;
        this.updateLandFlowMax(data)
      },
      setFlowMin(data){
        this.newFlowMin = data;
        this.updateLandFlowMin(data);
        this.controller.setRoadFlowFilter(data)
      },
      setFlowWidth(data){
        this.newFlowWidth = data;
        this.updateLandFlowWidth(data);
        let id = 'traceability';
        this.controller.changeFlowWidth(id, data)
      },
      setBackgroundWidth(data){
        this.newBackgroundWidth = data;
        this.updateLandBackgroundWidth(data);
        let id = 'backTraceability';
        this.controller.changeFlowWidth(id, data)
      },
      setFlowColor(data){
        this.newFlowColor = data;
        this.updateLandPlanColor(data);
        let id = 'traceability';
        mapCommonLayer.setBufferColor(id, data)
      },
      setTrafficColor(data){
        this.newTrafficColor = data;
        this.updateBackgroundPlanColor(data)
        let id = 'backTraceability';
        mapCommonLayer.setBufferColor(id, data)
      },
      stepSaveHandler(){
        this.controller.saveStepParam_3()
      },
      roadRadiusChange(data){
        this.roadRadius = data;
        this.updateSearchRadius(data)
      },
      trafficVolChange(data){
        this.trafficTemp = data;
        this.updateRoadTrafficModules(data)
      },
      dayNightChange(data){
        this.newDayNight = data;
        this.updateTimeRange(data)
      }
    },
    watch: {

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
