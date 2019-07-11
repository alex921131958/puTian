<template>
  <div id="panel">
    <div class="inner">
      <StepTitle title="用地规划与交通分布预测" :step="step"/>

      <SubTitle title="用地规划内容汇总"/>
      <LandUseCount :land="landUse" :landNum="landNum" :landArea="landArea"/>
      <span class="single-btn" @click="setLandEdit">{{btnTitle}}</span>
      <p class="list single">
        <span class="bold">交通预测时段</span><span class="tip">(更改后重新计算)</span>
        <RadioGroupComp v-model="timeTag" @on-change="setTimeTag">
          <RadioComp :label="item" v-for="item in timeTagList" :key="item"></RadioComp>
        </RadioGroupComp>
      </p>

      <TitleSwitch title="显示规划地块" :isShow="isAreaShow" @setSwitchToggle="setSwitchToggle('area')"/>
      <!--<AreaDisplay :areaColor="areaColor" :labelType="curShowType" @setAreaColor="setAreaColor" @setAreaType="setAreaType"/>-->

      <TitleSwitch title="显示所有地块期望线" :isShow="isOdShow" @setSwitchToggle="setSwitchToggle('od')"/>
      <OdDisplay :odColor="odColor" :expMin="expMin" :expMax="expMax" :expWidth="expWidth" :curContent="odContent" @setOdColor="setOdColor"
                 @setExpMin="setExpMin" @setExpMax="setExpMax" @setExpWidth="setExpWidth" @setCurContent="setCurContent" ref="odDisplay"/>
      <SubSwitch title="合并显示规划地块期望线" :isShow="isAreaMerge" @setSubSwitchToggle="setSubSwitchToggle()"/>
      <SubTitle title="报告生成"/>
      <div class="tip-panel">
        <i class="icon iconfont icon-warn"></i>
        <p>请自行调整图幅、期望线显示选项，至合适的交通影响结果图。平台将自动为项目总体交通分布情况生成期望线图用于交评报告。</p>
      </div>
      <p class="btn-p">
        <span class="btn-big" @click="getImageStep4">生成/更新项目 交通分布预测图</span>
        <!--<span class="btn-small" >样例</span>-->
      </p>
    </div>
    <StepSaveComp @stepSave="stepSave"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import StepTitle from '../common/StepTitle'
  import SubTitle from '../common/SubTitle'
  import TitleSwitch from '../common/TitleSwitch'
  import SubSwitch from '../common/SubSwitch'
  import StepSaveComp from '../common/StepSaveComp'
  import LandUseCount from '../step_4/LandUseCount'
  import AreaDisplay from '../step_4/AreaDisplay'
  import OdDisplay from '../step_4/OdDisplay'
  import FLOWCONF from '../../flowConf'
  import StepPanelHandler_4 from '../../../../service/workflow/stepPanelHandler_4'
  import MapCommonLayer from '../../../../service/map/mapCommonLayer'
  import env from '../../../../common/env'
  import eventBus from '../../../../util/event-bus'

  export default {
    name: "PanelStep_4",
    data() {
      return {
        step: 4,
        landUse:JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_INFO)),    //用地规划内容汇总
        landNum:0,
        landArea:0,
        isAreaShow:true,     //是否显示规划地块
        isOdShow:true,     //是否显示期望线
        areaColor:"#3B90EE",  //地块颜色
        curShowType:FLOWCONF.AREA_SHOW_TYPE[0].label,  //地块文字标签
        odColor:"#ee3d0e",  //期望线颜色颜色
        isAreaMerge:false,   //是否合并显示规划地块期望线

        odContent:FLOWCONF.SHOW_CONTENT[0],   //期望线显示内容
        expMin:FLOWCONF.DEFAULT_EXP_MIN,
        expMax:FLOWCONF.DEFAULT_EXP_MAX,
        expWidth:FLOWCONF.DEFAULT_EXP_WIDTH,
        editDrawList:[],   //全部面信息

        timeTag: '晚高峰',
        timeTagList: ['早高峰','晚高峰'],
        circleRadius:1,    //od圆点半径
      }
    },
    mounted() {
      this.controller = new StepPanelHandler_4(this);
      this.updateAttributePanel(null);
      let _this = this;
      this.$nextTick(() => {
        _this.controller.regEditEvent();
        _this.controller.getStepParam();
      });
      _this.controller.getLandInfo();
      _this.controller.addRoadLineLayer();
      eventBus.$on("saveLandItem",() => {
        _this.controller.getLandInfo();
      });
      eventBus.$on("deleteUpdateLand",() => {
        _this.controller.getLandInfo();
      });
    },
    computed: {
      ...mapGetters(['panel_show','isLandEditable','attributePanel','curEditPool','landBaseArea','landParamObj','landList','landOdColor',
        'landOdType','landOdWidth','landOdData','odExpMax','odExpMin','allOdShow','colorType','cur_pro_id','active_tool','landList','expCircle']),
      btnTitle:function (){
        return this.isLandEditable?"点击结束地块编辑":"点击开始地块编辑和交通分布预测";
      }
    },
    components: {
      StepTitle,
      SubTitle,
      StepSaveComp,
      LandUseCount,
      TitleSwitch,
      AreaDisplay,
      OdDisplay,
      SubSwitch,
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateLandEditable','updateAttributePanel','updateCurEditPool','updateLandBaseArea','updateLandParamObj',
        'updateCurLandId','updateLandBaseArea','updateLandOdColor','updateLandOdType','updateLandOdWidth','updateLandColor','updateOdExpMax',
        'updateOdExpMin','updateTimeTag','updateAllOdShow','updateColorType','updateActiveTool','updateGlobalMask']),
      setSwitchToggle(type){
        if(type === 'area'){
          this.isAreaShow = !this.isAreaShow;
          this.controller.setLandLayerHide(!this.isAreaShow);
        }else{
          this.isOdShow = !this.isOdShow;
          this.updateAllOdShow(this.isOdShow);
          this.controller.setEchartLayerHide(!this.isOdShow);
          if(this.isOdShow){
            this.isAreaMerge = false;
          }
        }
      },
      setSubSwitchToggle(){
        this.isAreaMerge = !this.isAreaMerge;
        if(this.isAreaMerge){
          this.isOdShow = false;
          this.updateAllOdShow(false);
          eventBus.$emit("showAreaMergeOd");
        }
        this.controller.setEchartLayerHide(!this.isAreaMerge);
      },
      setAreaColor(data){
        this.areaColor = data;
        this.updateLandColor(data);
        //修改地块颜色
        this.controller.changeLandColor(data);
      },
      setAreaType(data){
        this.curShowType = data;
      },
      setOdColor(data){
        this.odColor = data;
        this.updateLandOdColor(data);
      },
      setExpMin(data){
        this.expMin = data;
        this.updateOdExpMin(data);
      },
      setExpMax(data){
        this.expMax = data;
        this.updateOdExpMax(data);
      },
      setExpWidth(data){
        this.expWidth = data;
        this.updateLandOdWidth(data);
      },
      setCurContent(data){
        this.odContent = data;
        this.updateLandOdType(data);
      },
      setLandEdit(){
        this.updateLandEditable(!this.isLandEditable);
        //重绘地块时，置空当前
        if(this.isLandEditable){
          this.updateCurLandId(null);
        }
      },
      setTimeTag(data){
        this.updateTimeTag(data);
      },
      stepSave(){
        this.controller.saveStepParam_4()
      },
      getImageStep4(){
        if(this.landNum === 0){
          this.$Message.warning({
            content: '当前交评项目暂无规划地块',
            duration:5,
            closable: true
          });
        }else {
          eventBus.$emit("globalLoadingShow",'step4');
        }
      }
    },
    watch:{
      isLandEditable(newVal,oldVal){
        if(newVal) {
          this.controller.setEchartLayerHide(true);
          if(this.curEditPool && this.landList.indexOf(this.curEditPool.id) === -1){
            let featureId = env.edit.setSelected([this.curEditPool.id]);
          }else{
            this.updateActiveTool(null);
            MapCommonLayer.onLandEditClick('polygon');
          }
        }else {
          //TODO:是否结束编辑即不可编辑
          // MapCommonLayer.onLandEditClick('static');
        }

        if(oldVal && !newVal && this.curEditPool){   //当绘制结束 且编辑池有数据
          this.controller.calcLandInfo();
          this.updateAttributePanel("land");
        }
      },
      landOdColor(val){
        if(this.attributePanel==="land"){
          this.controller.updateOdLineRender('color',val);
        }else{
          eventBus.$emit("updateProjectOdRender",'color',val)  //toTable组件
        }
      },
      landOdType(val){
        if(this.attributePanel==="land"){
          this.controller.updateOdLineRender('type',val);
        }else{
          eventBus.$emit("updateProjectOdRender",'type',val)
        }
      },
      landOdWidth(val){
        if(this.attributePanel==="land"){
          this.controller.updateOdLineRender('width',val);
        }else{
          eventBus.$emit("updateProjectOdRender",'width',val)
        }
      },
      expCircle(val){
        if(this.attributePanel==="land"){
          this.controller.updateOdLineRender('circle',val);
        }else{
          eventBus.$emit("updateProjectOdRender",'circle',val)
        }
      },
      odExpMax(val){
        if(this.attributePanel==="land"){
          this.controller.updateOdLineRender('expMax',val);
        }else{
          eventBus.$emit("updateProjectOdRender",'expMax',val)
        }
      },
      odExpMin(val){
        if(this.attributePanel==="land"){
          this.controller.updateOdLineRender('expMin',val);
        }else{
          eventBus.$emit("updateProjectOdRender",'expMin',val)
        }
      },
      colorType(val){
        if(this.attributePanel==="land"){
          this.controller.updateOdLineRender('colorType',val);
        }else{
          eventBus.$emit("updateProjectOdRender",'colorType',val)
        }
      },
      attributePanel(val){
        if(val === 'land'){
          this.isOdShow = false;
        }
      },
      isOdShow(val){
        this.updateAllOdShow(val);
      },
      allOdShow(val){
        this.isOdShow = val;
        if(val){
          eventBus.$emit("landAttrCancel");
        }
      }
    },
    beforeDestroy() {
      eventBus.$off("saveLandItem");
      eventBus.$off("deleteUpdateLand");
    },
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
        .icon{
          float: left;
          /*color:#333;*/
          margin-top: -0.2em;
        }
        p{
          margin: 0 0 0 1.8em;
          line-height: 1.5em;
          /*color:#333;*/
        }
      }
      .btn-p{
        display: flex;
        color: #666;
        margin-left: 2.2em;
        margin-bottom: 10rem;
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
              background-color: #c7d540;
            }
          }
          &.btn-small{
            width: 3.5em;
            background-color: #D7D7D7;
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
      }
      .list{
        line-height: 1.8em;
        margin-top: 1.5rem;
        &.single{
          .bold{
            font-weight: 600;
            font-size: 1.1em;
          }
          .tip{
            margin-left: 0.5em;
            font-size: 0.9rem;
            color: $highlight;
            opacity: 0.8;
          }
        }
      }
    }
  }
  @media(max-width: 1599px){
    #panel{
      .inner{
        .single-btn{
          margin-left: 1.2em;
        }
      }
    }
  }
</style>
