<template>
  <div id="panel">
    <div class="inner">
      <StepTitle title="道路规划" :step="step"/>
      <SubTitle title="道路规划内容汇总"/>
      <RoadCount :roadInfo="roadInfo"/>
      <span class="single-btn" @click="setLinkEdit">{{btnTitle}}</span>
      <SubTitle title="显示规划道路"/>
      <RoadDisplay :newRoadColor="newRoadColor" :editRoadColor="editRoadColor" :lineRoadColor="lineRoadColor" :curShowType="curShowType"
                   @setNewColor="setNewColor"  @setEditColor="setEditColor"  @setLineColor="setLineColor" @setRoadType="setRoadType"/>
      <SubTitle title="显示规划地块"/>
      <LandDisplay :landRoadColor="landRoadColor" @setLandColor="setLandColor"/>
    </div>
    <StepSaveComp @stepSave="stepSave"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import StepTitle from '../common/StepTitle'
  import SubTitle from '../common/SubTitle'
  import StepSaveComp from '../common/StepSaveComp'
  import RoadCount from '../step_2/RoadCount'
  import FLOWCONF from '../../flowConf'
  import RoadDisplay from '../step_2/RoadDisplay'
  import StepPanelHandler_2 from '../../../../service/workflow/stepPanelHandler_2'
  import LeafLetHandle from '../../../../service/common/leafLetHandle'
  import LandDisplay from '../step_2/LoadDisplay'
  import eventBus from '../../../../util/event-bus'
  import env from '../../../../common/env'

  export default {
    name: "PanelStep_2",
    data() {
      return {
        step: 2,
        roadInfo:JSON.parse(JSON.stringify(FLOWCONF.ROAD_COUNT)),
        curShowType:FLOWCONF.ROAD_SHOW_TYPE[0].label,
        newRoadColor:"#CA2253",
        editRoadColor:"#388276",
        lineRoadColor:"#DDE939",
        landRoadColor:"#3B90EE",
      }
    },
    mounted() {
      this.controller = new StepPanelHandler_2(this);
      let _this = this;
      this.$nextTick(() => {
        _this.controller.getStepParam();
        let t = setInterval(function() {
          //leaflet确保leaflet文件，及tools文件加载并执行
          if (L && L.Handler) {
              //加载成功后业务处理
            clearInterval(t);
            _this.leafEditer = new LeafLetHandle(_this);
            // this.leafEditer.getLayerContainer();
            _this.leafEditer.getLinkInfo(_this.cur_pro_id);
            _this.leafEditer.paintPolygon(_this.cur_pro_id);
            _this.leafEditer.getOldLineInfo(_this.cur_pro_id);
            _this.leafEditer.deleteWaterMark();
          }
        }, 500);
      });
      eventBus.$on('paintWarning', function () {
        _this.$Modal.confirm({
          title: '确认提醒',
          content: '<p>请先完成当前线编辑的操作</p><p>点击取消放弃当前操作</p>',
          okText: '确定',
          cancelText: '取消',
          closable:true,
          onOk:() => {
          },
          onCancel: ()=> {
            _this.updateCurLinePool(null);
            _this.updateCurJudgeState(null);
            _this.updateAttributePanel(null);
            eventBus.$emit('cancelChange')
          }
        })
      });
      eventBus.$on('reGetTableList', function () {
        _this.leafEditer.getOldLineInfo(_this.cur_pro_id);
        eventBus.$emit("saveLinkItem");
        _this.leafEditer.getEditLink();
      });
      eventBus.$on('zoomWarn', function () {
        _this.$Message.warning({
          content: '当前地图显示级别过大，请放大地图进行操作',
          duration: 2,
          closable: true
        });
      });
      eventBus.$on('updateWarn', ()=>{
        this.$Message.warning({
          content: '道路上下行属性信息设置不完善，将影响后续操作',
          duration: 2,
          closable: true
        })
      });
    },
    beforeDestroy(){
      eventBus.$off('zoomWarn');
      eventBus.$off('reGetTableList');
      eventBus.$off('paintWarning');
      eventBus.$off('createSuccess');
      eventBus.$off('updateWarn');
    },
    computed: {
      ...mapGetters(['panel_show','isLinkEditable','lineOnClick','linkOnClick','map_center','map_zoom','road_single','road_num','road_length','curLine','cur_pro_id',
      'polygonInfo','lineNewColor','lineChangeColor','lineConnectColor','landConnectColor','originalLink','lineNewLinks','lineInfo','editLinks','curLinePool',
      'curJudgeState','curHighlightRoadId','cur_project']),
      btnTitle:function (){
        return this.isLinkEditable?"点击结束道路编辑":"点击开始道路编辑";
      }
    },
    components: {
      StepTitle,
      SubTitle,
      StepSaveComp,
      RoadCount,
      RoadDisplay,
      LandDisplay,
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateLinkEditable','updateAttributePanel','updateMapCenter','updateMapZoom','updateLineOnClick','updateLinkOnClick',
      'updateLineInfo','updateCurLine','updatePolygonInfo','updateLineNewColor','updateLineChangeColor','updateLineConnectColor','updateLandChangeColor',
      'updateOriginalLink','updateLineNewLinks','updateEditLinks','updateCurLinePool','updateCurJudgeState','updateCurHighlightRoadId']),
      setNewColor(data){
        this.newRoadColor = data;
        this.updateLineNewColor(data);
        eventBus.$emit("createSuccess");
      },
      setEditColor(data){
        this.editRoadColor = data;
        this.updateLineChangeColor(data);
        eventBus.$emit("createSuccess");
      },
      setLineColor(data){
        this.lineRoadColor = data;
        this.updateLineConnectColor(data)
      },
      setLandColor(data){
        this.landRoadColor = data;
        this.updateLandChangeColor(data);
        this.controller.changePolygonColor()
      },
      setRoadType(data){
        this.curShowType = data;
      },
      setLinkEdit(){
        if (this.curLinePool){
          if (this.btnTitle === '点击结束道路编辑'){
            this.updateLinkEditable(!this.isLinkEditable);
          }else {
            eventBus.$emit('paintWarning')
          }
        } else {
          this.updateLinkEditable(!this.isLinkEditable);
          if (this.isLinkEditable){
            this.leafEditer.startLine();
          }else{
            this.leafEditer.stopLine();
          }
        }
      },
      stepSave(){
        this.controller.saveStepParam_2()
      }
    },
    watch:{
      isLinkEditable(newVal,oldVal){
        if(oldVal && !newVal && this.curLinePool){
        }
      },
      curLine(newVal){
        this.updateAttributePanel("road");
        this.leafEditer.refreshLink(newVal);
      },
      road_length(newVal){
        this.roadInfo.count = this.road_num;
        this.roadInfo.length = newVal.toFixed(1);
      },
      polygonInfo(newVal){
        this.leafEditer.paintPolygon(newVal);
      },
      lineInfo(newVal, oldVal){
        this.leafEditer.highlightLine(newVal, oldVal)
      },
      curLinePool(newVal){
        if (newVal){
          env.leaf_map.dragging.disable()
        } else {
          env.leaf_map.dragging.enable()
        }
      },
      landRoadColor(newVal){
        this.landRoadColor = newVal
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
      .single-btn{
        display: inline-block;
        margin:0.8rem 0 1rem 2.2em;
        color: #666;
        text-align: center;
        height: 2.3rem;
        line-height: 2.5rem;
        background-color: $highlight;
        cursor: pointer;
      }
    }
  }

</style>
