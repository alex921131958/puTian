<template>
  <div id="panel">
    <div class="inner">
      <StepTitle title="交通影响预测" :step="step"/>

      <SubTitle title="交评方案检查"/>
      <ProgramCheck :statisticItem = "statisticItem"/>
      <div :class="['program-panel',item.value ===0?'success':'warning']" v-for="item in tipItem">
        <div class="program-title">
          <i class="icon iconfont icon-warn" v-if="item.value !== 0"></i>
          <i class="icon iconfont icon-ok" v-if="item.value === 0"></i>
          <p>{{item.label}}</p>
        </div>
        <div class="program-content">
          {{item.tip}}
        </div>
      </div>

      <p class="tip-content" v-if="tipItem.land.value!==0 || tipItem.landEntry.value!==0"><i class="icon iconfont icon-warn"></i>&nbsp;&nbsp;&nbsp;存在警告项，建议完善方案后运行影响评价!</p>

      <SubTitle title="交通分配配置"/>
      <DistributionContent
        @setOdTypeList="setOdTypeList" @setTimeTag="setTimeTag"
        :newOdTypeList="newOdType" :newTimeTag="newTimeTag" ref="contentSet"
      />

      <!--<SubTitle title="交通分配算法"/>-->
      <DistributionAlgorithm
        @setTrafficModel="setTrafficModel" @setIterationNum="setIterationNum" @setPathFunction="setPathFunction"
        :newTrafficModel="newTrafficModel" :newIterationNum="newIterationNum" :newPathFunction="newPathFunction"
      />
      <span class="single-btn" @click="runTrafficFun">运行交通分配</span>

      <TitleSwitch title="流量影响结果" :isShow="isAreaShow" @setSwitchToggle="setSwitchToggle('flow')"/>
      <DistributionResult
        @putFlowMax="putFlowMax" @putFlowMin="putFlowMin" @putFlowWidth="putFlowWidth" @putBaseWidth="putBaseWidth" @putFlowColor="putFlowColor" @putBaseColor="putBaseColor"
        :newFlowMax="newFlowMax" :newFlowMin="newFlowMin" :newFlowWidth="newFlowWidth" :newFlowColor="newFlowColor" :newBaseWidth="newBaseWidth" :newBaseColor="newBaseColor"
      />
      <SubSwitch title="是否显示背景流量" :isShow="isBgFlowShow" @setSubSwitchToggle="setSubSwitchToggle('bgFlow')"/>
      <SubSwitch title="显示流量标注值" :isShow="isFlowShow" @setSubSwitchToggle="setSubSwitchToggle('label')"/>

      <TitleSwitch title="速度、饱和度影响结果" :isShow="isFactorShow" @setSwitchToggle="setSwitchToggle('factor')"/>
      <p class="list">
        <span>交通分配模型</span>
        <i-select v-model="factorType" style="width:10em;" @on-change="changeFactorType">
          <i-option v-for="item in factor_model" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </p>
      <SubSwitch title="显示速度、饱和度影响标注值" :isShow="isFactorLabelShow" @setSubSwitchToggle="setSubSwitchToggle('factor')"/>

      <SubTitle title="报告生成"/>
      <p class="list">
        <span class="slide">流量显示比例</span>
        <!--<span class="response"><SliderComp v-model="factorWidth" :min="-20" :max="60" :step="1" show-input @on-change="putFactorWidth"/></span>-->
        <RatioSlider :bufferRatio="factorWidth" ref="ratioSlider" @ratioChange="putFactorWidth"/>
      </p>

      <p class="list">
        <span class="range">现状、年预测、影响后流量颜色</span>
        <span class="switch"><ColorPickerComp v-model="factorColor" :colors="colors" @on-change="putFactorColor"/></span>
      </p>
      <div class="list tip-panel">
        <i class="icon iconfont icon-warn"></i>
        <p>请参考预览样例调整图幅、流量显示选项后，生成交通影响结果图。平台将自动生成流量、速度、饱和度三种交通影响结果用于交评报告。</p>
      </div>
      <p class="list btn-p">
        <span class="btn-big" @click="getDistributeImage">生成/更新项目 交通影响预测图</span>
        <span class="btn-small" @click="preViewMap">{{preViewTitle}}</span>
      </p>
    </div>
    <StepSaveComp @stepSave="stepSaveHandler"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import StepTitle from '../common/StepTitle'
  import SubTitle from '../common/SubTitle'
  import StepSaveComp from '../common/StepSaveComp'
  import DistributionAlgorithm from '../step_6/DistributionAlgorithm'
  import DistributionContent from '../step_6/DistributionContent'
  import DistributionResult from '../step_6/DistributionResult'
  import ProgramCheck from '../step_6/ProgramCheck'
  import TitleSwitch from '../common/TitleSwitch'
  import SubSwitch from '../common/SubSwitch'
  import FLOWCONF from '../../flowConf'
  import MYCONF from '../../../../myconf'
  import StepPanelHandler_6 from '../../../../service/workflow/stepPanelHandler_6'
  import MapCommonLayer from '../../../../service/map/mapCommonLayer'
  import eventBus from '../../../../util/event-bus'
  import RatioSlider from '../../../common/RatioSlider'
  import env from '../../../../common/env'

  export default {
    name: "PanelStep_6",
    data() {
      return {
        step: 6,
        isAreaShow: true,
        isFactorShow: true,
        isFlowShow: true,
        newFlowMax: 1000,
        newFlowMin: 1,
        newFlowWidth: FLOWCONF.ADD_WIDTH,
        newBaseWidth: FLOWCONF.BASE_WIDTH,
        newFlowColor: '#111111',  //交通分配流量
        newBaseColor: '#3B90EE',  //北京交通量颜色
        newTrafficModel: FLOWCONF.TRAFFIC_DISTRIBUTION_MODEL[1].label,
        newIterationNum: FLOWCONF.ITERATION_NUM[0].label,
        newPathFunction: FLOWCONF.PATH_FUNCTION[0].label,
        newOdType:['用地相关OD'],
        newTimeTag:'晚高峰',
        isBgFlowShow:false,   //是否显示背景流量
        curRequest:null,
        linkData: [],
        tipItem: {
          // road:{
          //   label:'道路相关交通量预测',
          //   value: 0,
          //   tip: '各道路均已进行交通量预测'
          // },
          land:{
            label:'用地规划与交通分布预测',
            value: 0,
            tip: '各地块均已进行交通预测'
          },
          landEntry:{
            label:'地块出入口设置',
            value: 0,
            tip: '各地均已设置出入口'
          },
        },
        statisticItem: FLOWCONF.PROGRAMSUMMARY,
        factor_model:FLOWCONF.FACTOR_MODEL,
        factorType:FLOWCONF.FACTOR_MODEL[0].label,
        colors: MYCONF.COLOR_PICKER,
        factorWidth: FLOWCONF.FACTOR_WIDTH_MIN,  //背景
        factorColor: '#1C485B',
        isFactorLabelShow:false,
        imgTimer:null,
        imgIndex:0,
        preViewed:false,  //是否是已预览状态
      }
    },
    mounted() {
      this.controller = new StepPanelHandler_6(this);
      let _this = this;
      this.$nextTick(() => {
        _this.controller.getStepParam();
        //确定是否重算了所有道路信息
        this.controller.confimRoad();
        //加载之前操作的路 地块在addEntryLayer出入口之后添加
        // this.controller.addLandLayers();
        this.controller.addEntryLayer();
        this.controller.addRoadLineLayer();
        this.updateFactorShow(true);
        _this.updateFactorType('背景速度');
      });
      eventBus.$on("stopRequest",() => {
        this.controller.stopDiagramRequest();
      });
      eventBus.$on("step6LayerShow",() => {
        this.preViewed = false;
        // this.controller.addEntryLayer();
        // this.controller.addRoadLineLayer();
        if (env.map.getLayer('step-flow-5')){
          this.controller.setTrafficLayer();
        }
        if(_this.isFactorShow){
          _this.controller.isRedistribute('factor',_this.factorType);
        }
        if(_this.isAreaShow){
          _this.controller.isRedistribute('distribute');
        }
      });
    },
    beforeDestroy(){
      eventBus.$off('stopRequest');
      eventBus.$off('step6LayerShow');
    },
    computed: {
      ...mapGetters(['panel_show','stepParam_5','cur_pro_id','global_loading','lineNewColor','lineChangeColor','factor_type','cur_route']),
      preViewTitle:function(){
        return this.preViewed ? '关闭':'预览';
      }
    },
    components: {
      StepTitle,
      SubTitle,
      StepSaveComp,
      DistributionAlgorithm,
      DistributionContent,
      DistributionResult,
      TitleSwitch,
      SubSwitch,
      ProgramCheck,
      RatioSlider
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateStep5ParamObj','updateGlobalLoading','updateStepSixTimeTag','updateGlobalMask','updateFactorType','updateFactorShow']),
      setSwitchToggle(type){
        if(type === 'flow'){
          this.isAreaShow = !this.isAreaShow;
          this.controller.setTypeFlowShow('flow');
        }else{
          this.isFactorShow = !this.isFactorShow;
          this.updateFactorShow(this.isFactorShow);
          this.controller.setTypeFlowShow('factor');
        }
      },
      setSubSwitchToggle(type){
        if(type === 'label'){
          this.isFlowShow = !this.isFlowShow;
          this.controller.setFlowLabelShow();
        }else if(type === 'bgFlow'){
          this.isBgFlowShow = !this.isBgFlowShow;
          this.controller.setTypeFlowShow('bg');
        }else{
          this.isFactorLabelShow = !this.isFactorLabelShow;
          this.controller.setTypeFlowShow('factorLabel');
        }
      },
      changeFactorType(data){
        if(this.isFactorShow){
          this.controller.isRedistribute('factor',data);
        }
      },
      putFlowMax(data){
        this.newFlowMax = data;
      },
      putFlowMin(data){
        this.newFlowMin = data;
        this.controller.setFlowFilter();
      },
      putFlowWidth(data){
        this.newFlowWidth = data;
        this.controller.updateBufferWidth('add',data);
      },
      putBaseWidth(data){
        this.newBaseWidth = data;
        this.controller.updateBufferWidth('base',data);
      },
      putFactorWidth(data){
        this.factorWidth = data;
        this.controller.updateBufferWidth('factor',data);
      },
      putFlowColor(data){
        this.newFlowColor = data;
        MapCommonLayer.setBufferColor('step-flow-5',data);
      },
      putBaseColor(data){
        this.newBaseColor = data;
        MapCommonLayer.setBufferColor('step-traffic-5',data);
      },
      putFactorColor(data){
        this.controller.setBufferColor(data);
      },
      setTrafficModel(data){
        this.newTrafficModel = data;
      },
      setFactorType(data){
        switch (data){
          case '背景速度':
            return 'SO';
            break;
          case '影响后速度':
            return 'STA';
            break;
          case '速度影响':
            return 'SD';
            break;
          case '背景饱和度':
            return 'VCO';
            break;
          case '影响后饱和度':
            return 'VCTA';
            break;
          case '饱和度影响':
            return 'VCD';
            break;
          default:
            return 'SO';
            break;
        }
      },
      setIterationNum(data){
        this.newIterationNum = data;
      },
      setPathFunction(data){
        this.newPathFunction = data;
      },
      setOdTypeList(data){
        this.newOdType = data;
      },
      setTimeTag(data){
        this.newTimeTag = data;
        this.updateStepSixTimeTag(data);
      },

      //保存操作
      stepSaveHandler(){
        this.controller.saveStepParam_6();
      },
      runTrafficFun(){
        this.controller.calcTrafficVol();
        this.controller.saveStepParam_6();
        // this.controller.setTrafficLayer();
      },
      getDistributeImage(){
        this.preViewed = false;
        this.controller.checkRedistribute(true);
      },
      //交通影响预测图-渲染预览
      preViewMap(){
        let str = this.preViewed ? 'close':'open';
        this.preViewed = !this.preViewed;
        this.controller.checkRedistribute(false,str);
      }

    },
    watch:{
      factorType(val){
        this.updateFactorType(val);
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
      .tip-panel{
        padding: 0.6em 0.5em;
        text-align: left;
        color: #c7d540;
        font-size: 0.95em;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        margin-left: 2.2em;
        display: flex;
        .icon{
          width:3rem;
        }
        p{
          margin: 0 0 0 0.5em;
          line-height: 1.5em;
          /*color:#333;*/
        }
      }
      .btn-p{
        display: flex;
        color: #666;
        margin-left: 2.2em;
        margin-bottom: 5rem;
        span{
          text-align: center;
          height: 2.5rem;
          line-height: 2.5rem;
          cursor: pointer;
          &.btn-big{
            flex: 1;
            background-color: #c7d540;
            margin-right: 1rem;
            &:hover{
               background-color: #d3e143;
             }
          }
          &.btn-small{
            width: 3.5em;
            background-color: #D7D7D7;
            &:hover{
              background-color: #e3e3e3;
            }
          }
        }
      }
      .single-btn{
        display: inline-block;
        margin-left: 2.2em;
        margin-top: 0.8rem;
        color: #444;
        text-align: center;
        height: 2.3rem;
        line-height: 2.5rem;
        background-color: $highlight;
        cursor: pointer;
        &:hover{
          background-color: #e6d33d;
        }
      }
    }

    .program-panel{
      display: block;
      /*height: 3.5rem;*/
      margin-left: 1.2em;
      margin-bottom: 1em;
      &.warning{
        .program-title{
          background-color: rgba(230, 61, 53, 0.4);
          color: #FF6962;
        }
        .program-content{
          background-color: rgba(230, 61, 53, 0.2);
          color: #FF6962;
        }
      }
      &.success{
        .program-title{
          background-color: rgba(199, 213, 64, 0.4);
          color: #C7D540;
        }
        .program-content{
          background-color: rgba(199, 213, 64, 0.2);
          color: #C7D540;
        }
      }
      .program-title{
        height: 2.2rem;
        /*background-color: #505519;*/
        /*color: #C7D540;*/
        text-align: left;
        .icon{
          float: left;
          margin: 0 0 0 0.5em;
          font-size: 1.05rem;
          margin-top: 0.3rem;
        }
        p{
          margin: 0 0 0 2.2em;
          font-size: 1rem;
          line-height: 2.2rem;
        }
      }
      .program-content{
        /*background-color: #282B0D;*/
        color: #C7D540;
        text-align: left;
        padding-left: 1em;
        font-size: 0.9rem;
        line-height: 2.4;
        p{

        }
      }
    }
    .tip-content{
      margin-left: 1.2em;
      line-height: 1.5;
      color: #EB3E36;
      font-weight: 600;
    }
    p {
      line-height: 3rem;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        margin-top: 0.5em;
        & > span:first-child {
          text-indent: 2.2em;
        }
        .response {
          flex: 1;
        }
        .slide {
          text-indent: 1.2em;
          width: 16em;
          text-align: left;
        }
      }
    }
  }

  @media (max-width: 1599px) {
    #panel{
      p{
        &.list{
          & > span:first-child {
            text-indent: 1.2em;
          }
        }
      }
    }
  }
</style>
