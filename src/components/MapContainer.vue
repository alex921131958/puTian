<template>
  <div class="container">
    <div id="leaf-container">
      <a class="minemap-logo" target="_blank" href="https://www.minedata.cn/" v-if="cur_route==='workflow'&&cur_step===2"></a>
      <div id="map-container" v-show="isMapShow">
        <div class="map-control">
          <div class="div" @click="compassOp()"><i class="icon iconfont icon-compass"></i></div>
          <div class="div">
            <span v-if="isThree" @click="changeThree()">3D</span>
            <span v-if="!isThree" @click="changeTwo()">2D</span>
          </div>
          <div class="div" @click="zoomOut()"><i class="icon iconfont icon-del"></i></div>
          <div class="div" @click="zoomIn()"><i class="icon iconfont icon-add"></i></div>
          <div class="div" @click="changeFullMap()">
            <i class="icon iconfont icon-full-screen" v-if="screenView"></i>
            <i class="icon iconfont icon-exit-screen" v-if="!screenView"></i>
          </div>
        </div>

        <div class="time-ctrl" v-show="cur_menu.id!=='carTraffic-1' || cur_tra!=='realtime'" v-if="cur_route==='workbench'">
          <span :class="[display_time.hour===31||display_time.hour===32?'desc':'','bold']">{{displayHour(display_time.hour)}}</span><span v-if="display_time.hour!==31&&display_time.hour!==32">&nbsp; ~ </span><span class="normal" v-if="display_time.hour!==31&&display_time.hour!==32">{{display_time.hour+1}}:00</span> <br/>
          <span class="normal">{{display_time.year}}</span>
          <span class="text">{{displaySeason(display_time.season)}}</span>
          <span class="text">{{disDateTag(display_time.datetag)}}</span>
        </div>
        <MapLegend v-if="(cur_menu.id==='carTraffic-1'||cur_menu.id==='cmnTraffic-1'||(cur_step===4&&colorType==='彩色')) && lengedShow"/>
        <PersonTripLegend v-if="cur_menu.id.substring(0,10)==='personTrip' && personalLegengShow"/>
        <PersonExpLineLegend v-if="(cur_menu.id==='personTrip-1'||cur_menu.id==='personTrip-5') && lineLegendShow"/>
        <WorkflowLegend v-if="cur_route==='workflow' && (cur_step===6) && (workflowType==='edit' || workflowType==='new')"/>
        <CompareLegend v-if="cur_route==='workflow' && workflowType==='case'&& compareLegendShow"/>
        <ProgressComp v-if="global_loading"/>
        <TimeAxis v-if="cur_menu.id==='personTrip-2'"></TimeAxis>
        <LanduseType v-if="map_setting.land_use"/>
      </div>
    </div>

    <Diagram v-if="cur_route==='workbench'&&cur_menu.id!=='carTraffic-5' || loading_tip"/>
    <FlowTable v-if="cur_route==='workflow' && (cur_step===4 || cur_step===2 || cur_step===5)"/>
    <FlowLastTable v-if="cur_route==='workflow' && (cur_step===6)"/>
    <CompareTable v-if="cur_route==='workflow' && (this.workflowType==='case')"></CompareTable>

  </div>
</template>

<script>
  import env from '../common/env'
  import eventBus from '../util/event-bus'
  import MYCONF from '../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import MapInit from '../service/map/mapInit'
  import mapContainerHandler from '../service/workbench/mapContainerHandler'
  import MapCommonLayer from '../service/map/mapCommonLayer'
  import Diagram from './bottom/Diagram'
  import FlowTable from './workflow/bottom/FlowTable'
  import MapLegend from './common/MapLegend'
  import FlowLastTable from './workflow/bottom/FlowLastTable'
  import CompareTable from './workflow/bottom/CompareTable'
  import leafLetMapInit from '../service/map/leafletInit'
  import PersonTripLegend from './common/PersonTripLegend'
  import PersonExpLineLegend from './common/PersonExpLineLegend'
  import ProgressComp from './common/ProgressComp'
  import PreImage from './common/PreImage'
  import TimeLine from './right/workflow/common/TimeLine'
  import TimeAxis from './right/workflow/common/TimeAxis'
  import WorkflowLegend from './common/WorkflowLegend'
  import CompareLegend from './common/CompareLegend'
  import LanduseType from './common/LanduseType'

  export default {
    name: 'MapContainer',
    data() {
      return {
        screenView: true,
        isThree: true,
        linkIds:[],
        linkList:[],
        adminBoundLayer:[],  //区县边界
        poiLayer:[],    //poi
        adminLayer:[],  //建筑
        roadLayer:[],  //道路
        landUseLayer:[],  //功能用地
        greenFaceLayer:[],  //绿地
        waterLayer:[],  //水体
        roadLineLayer:[],  //道路图层提取
        isMapShow:true,
        workflowType: '',
      }
    },
    mounted() {
      this.controller = new mapContainerHandler(this);
      this.$nextTick(() => {
        this.mapInit();
      });
      eventBus.$on("clearLinkSelected",() => {
        this.linkIds = [];
        this.linkList = [];
      });
      eventBus.$on("displayMapSetting", () =>{
        this.controller.displayMapSetting();
      });
      this.workflowType = sessionStorage.getItem("workflowType")
    },
    computed: {
      ...mapGetters([ 'panel_show','isRoadEditable','panel_time','link_id','link_list','cur_menu',
        'road_title','cur_advance_type','link_id_A','link_id_B','link_list_A','link_list_B',
        'activeList','cur_item_active','flow_label_show','buffer_color','selected_only','tracking_type',
        'isVillageEditable','village_id','village_list','common_link_id','global_v_active','global_village',
        'global_village_id', 'global_village_name','map_click_disabled','buffer_width','heatmap_width','cur_zoom',
        'display_time', 'display_mode','grid_heatmap','bus_speed_type','map_setting','cur_route','cur_step',
        'isLinkEditable','map_center','map_zoom','attributePanel','colorType','entryArr','ratioArr',
        'lngLatArr','linkArr','isFlowRemakeShow', 'global_loading','mask_url','cur_tra','cur_route','loading_tip',
        'single_layer','layer_legend_type','line_layer_legend','compareShowType','isBackgroundFlowShow','flow_background_show'
      ]),
      lengedShow(){
        let arr = ['公交运行速度','小汽车-公交速度差','拥堵情况'];
        return arr.some((item)=>{
          return item===this.layer_legend_type
        });
      },
      personalLegengShow(){
        let arr = ['职住比','居住人口','就职人口','平均出行距离','平均出行时间','分时动态人口','全方式od','交通生成量','交通吸引量','生成吸引总量','生成吸引比'];
        return arr.some((item)=>{
          return item===this.layer_legend_type
        });
      },
      lineLegendShow(){
        let arr = ['建成区od','全方式od'];
        return arr.some((item)=>{
          return item===this.line_layer_legend
        });
      },
      compareLegendShow(){
        let arr = ['speed','speedCompare','saturation','saturationCompare','service','serviceCompare'];
        return arr.some((item)=>{
          return item===this.layer_legend_type
        });
      }
    },
    components:{
      Diagram,
      FlowTable,
      MapLegend,
      FlowLastTable,
      PersonTripLegend,
      PersonExpLineLegend,
      ProgressComp,
      PreImage,
      TimeLine,
      CompareTable,
      TimeAxis,
      WorkflowLegend,
      CompareLegend,
      LanduseType,
    },
    methods: {
      ...mapMutations(['updateLinkList','updateLinkId','updateLinkListA','updateLinkIdA','updateLinkListB','updateLinkIdB',
        'updateRoadEditable','updateRoadTitle','updataCurAdvanceType','updateBufferColor', 'updateVillageEditable',
        'updateVillageTitle','updateVillageId','updateVillageList','updateCommonLinkId','updateGlobalVillage',
        'updateGlobalVillageIds', 'updateGlobalVillageNames','updateMapClickDisabled','updateClickDisabledType','updateHeatmap_width',
        'updateCurZoom','updatePreMenu', 'updateMapCenter','updateMapZoom','updateEntryArr','updateLngLatArr','updateLinkArr',
        'updateGlobalLoading','updateMaskUrl','updateLayerLegendType','updateLineLayerLegend']),
      mapInit: MapInit,
      autoResize(){
        env.map.resize();
      },
      compassOp(){
        env.map.easeTo({
          bearing:0
        })
      },
      zoomIn(){
        if (env.map.getZoom() < 17){
          env.map.zoomIn();
        }
      },
      zoomOut(){
        if (env.map.getZoom() > 3){
          env.map.zoomOut();
        }
      },
      changeFullMap(){
        this.controller.toggleFullMap();
        this.screenView = !this.screenView;
      },
      changeThree(){
        env.map.setPitch(45);
        this.isThree = false;
      },
      changeTwo(){
        env.map.setPitch(0);
        this.isThree = true;
      },
      displayHour(hour){
        return hour === 31?'早高峰':hour === 32?'晚高峰':hour+':00';
      },
      displaySeason(season) {
        switch(season){
          case 1:
            return '第一季度';
            break;
          case 2:
            return '第二季度';
            break;
          case 3:
            return '第三季度';
            break;
          case 4:
            return '第四季度';
            break;
          default:
            return '全年';
            break;
        }
      },
      disDateTag(datetag) {
        return datetag === 1?'工作日':'非工作日';
      },
      handleResize (event) {
        /*this.cWidth = window.innerWidth;
        this.cHeight = window.innerHeight+200;*/
        env.cWidth = window.innerWidth;
        env.cHeight = window.innerHeight+200;
        this.controller.setEchartLayerShow();
      }
    },
    watch:{
      panel_show(newVal,oldVal){
        if(newVal !== oldVal){
          let _this = this;
          this.$nextTick(() => {
            setTimeout(() => {
              _this.autoResize();
            },100)
          })
        }
      },

      //8.15
      isVillageEditable(newVal){
        if (newVal) {
          this.updateVillageTitle('点击结束选择小区');
          this.$Message.info({
            content: '选择方式：1.点选；2.按住shift键框选',
            closable: true
          });
          this.controller.setOtherLayerHide();
          this.controller.setEchartLayerHide();
          let villageId = this.global_v_active ? this.global_village_id : this.village_id;
          MapCommonLayer.addVillageLayer(this.panel_time,villageId)
        }else {
          this.updateVillageTitle('点击开始选择小区');
          this.controller.setOtherLayerShow();
          this.controller.setEchartLayerShow();
          eventBus.$emit("setEchartLayerDisplay",'show');
        }
      },

      isRoadEditable(newVal){
        if(newVal){
          this.updateRoadTitle('点击结束选择道路');
          this.$Message.info({
            content: '选择方式：1.点选；2.按住shift键框选',
            closable: true
          });
          this.controller.setOtherLayerHide();
          this.controller.setEchartLayerHide();
          eventBus.$emit("setEchartLayerDisplay",'hide');
          let linkId = this.cur_advance_type==='A'?this.link_id_A:this.cur_advance_type==='B'?this.link_id_B:this.link_id;
          MapCommonLayer.addBaseRoadLayer(this.panel_time,linkId);
        }else{
          this.updateRoadTitle('点击开始选择道路');
          this.controller.setOtherLayerShow();
          this.controller.setEchartLayerShow();
          eventBus.$emit("setEchartLayerDisplay",'show');
          // MapCommonLayer.hideBaseRoadLayer();
        }
      },
      linkIds(newVal){
        //框选道路长度截取
        if (newVal.length > MYCONF.MAX_LINK_LEN) {
          newVal = newVal.slice(0, MYCONF.MAX_LINK_LEN);
        }
        if(this.cur_advance_type==='A'){
          this.updateLinkIdA(newVal);
        }else if(this.cur_advance_type==='B'){
          this.updateLinkIdB(newVal);
        }else{
          this.updateLinkId(newVal);
        }
        if(this.cur_advance_type==='A'||this.cur_advance_type==='B'){
          let linkIdA = this.link_id_A;
          let linkIdB = this.link_id_B;
          let newLinkId = linkIdA.filter(item => linkIdB.some(linkId => linkId === item));
          this.updateCommonLinkId(newLinkId);
        }
      },
      cur_menu(newVal,oldVal){     //切换菜单menu
        if(newVal){
          this.updatePreMenu(oldVal);
          this.updateRoadEditable(false);
          this.updateVillageEditable(false);
          MapCommonLayer.hideBaseRoadLayer();
          MapCommonLayer.hideBaseVillageLayer();
          this.updateLinkList([]);
          this.updateLinkId([]);
          this.linkIds = [];
          this.linkList = [];

          this.updateLayerLegendType('');
          this.updateLineLayerLegend('');
          this.updataCurAdvanceType(''); //高级溯源置空
          this.updateMapClickDisabled(false);   //解除map点选框选禁用
          this.updateClickDisabledType('');
          //TODO:切换menu 进度条置否
          this.updateGlobalLoading(false);
          if(newVal.id === 'carTraffic-5' || oldVal.id==='carTraffic-5'){
            setTimeout(() => {
              env.map.resize();
            },300)
          }
        }
      },
      cur_advance_type(newVal){
        if(newVal){
          this.linkIds = this.cur_advance_type==='A'?this.link_id_A:this.cur_advance_type==='B'?this.link_id_B:this.link_id;
          this.linkList = this.cur_advance_type==='A'?this.link_list_A:this.cur_advance_type==='B'?this.link_list_B:this.link_list;
        }
      },
      activeList(newVal,oldVal){
        if(newVal && newVal.length!==oldVal.length){
          if(this.cur_item_active.active && env.map){
            this.controller.setObjectLayerShow();
            // this.controller.setEchartLayerShow();
          }else if(env.map){
            this.controller.setObjectLayerHide();
            // this.controller.setEchartLayerHide();
          }
        }
        if(this.single_layer && newVal){
          this.controller.setMultitLayerHide(oldVal,newVal);
        }
      },
      flow_label_show(newVal){
        if(newVal){
          this.controller.setFlowLabelShow();
        }else{
          this.controller.setFlowLabelHide();
        }
      },
      //TODO:此处无法实时更新filter
      /*selected_only(newVal){
        if(newVal){
          this.controller.setFlowSelected();
        }else{
          this.controller.setFlowAll();
        }
      },*/

      //道路规划
      cur_step(newVal){
        setTimeout(() => {
          if(env.map){
            env.map.resize();
          }
        },100);
        if (newVal === 2){
          if (env.leaf_map){
            env.leaf_map.remove();
          }
          leafLetMapInit(this.map_center, this.map_zoom);
          this.isMapShow = false;
        }else {
          this.isMapShow = true;
          if (env.leaf_map) {
            env.leaf_map.remove();
          }
          env.leaf_map = null;
        }
      },
      isFlowRemakeShow(newVal){
        if (newVal){
          this.controller.setRoadInfoShow('traceability');
          if(this.isBackgroundFlowShow) this.controller.setRoadInfoShow('backTraceability');
        } else{
          this.controller.setRoadInfoHide('traceability');
          if(this.isBackgroundFlowShow) this.controller.setRoadInfoHide('backTraceability');
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../common/common.scss";

  .container {
    flex: 1;
    height: calc(100vh - 4em);
    z-index: 10;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    #leaf-container{
      flex: 1;
      z-index: 10;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .minemap-logo{
        position: absolute;
        bottom: 10px;
        left: 10px;
        z-index: 1000;
        width: 94px;
        height: 26px;
        background-image: url("../../static/images/minemap-logo.png");
        background-size: contain;
        background-repeat: no-repeat;
      }
      #map-container{
        flex: 1;
        position: relative;
        .map-control {
          position: absolute;
          right: 1.5em;
          top: 3.5em;
          z-index: 1;
          .div {
            cursor: pointer;
            margin-bottom: 1rem;
            height: 2rem;
            width: 2rem;
            border-radius: 50%;
            background-color: #242423;
            text-align: center;
            span{
              color: white;
              opacity: 0.8;
              font-size: 1.1em;
              line-height: 2rem;
            }
            .icon{
              color: white;
              opacity: 0.8;
              font-size: 1.2em;
              line-height: 2rem;
              &.icon-compass{
                font-size: 2em;
              }
            }
          }
        }
        .time-ctrl{
          position: absolute;
          left: 1.2em;
          top: 1.2em;
          z-index: 1;
          text-align: left;
          font-weight: bold;
          line-height: 1.8em;
          background-color: rgba(255,255,255,0.8);
          padding: 0.5em;
          .bold{
            font-size: $font-number;
            font-weight: 600;
          }
          .desc{
            font-size: $font-title;
            font-weight: 600;
          }
          .normal{
            font-size: $font-text;
            display: inline-block;
            vertical-align: middle;
          }
          .text{
            font-size: $font-bigger;
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.2em;
          }
        }
      }
    }


  }

  @media (min-width:2000px){
    .container {
      #leaf-container{
        #map-container{
          .time-ctrl{
            line-height: 1.8;
            .bold{
              font-size: $font-number;
              font-weight: 600;
            }
            .desc{
              font-size: $font-title;
              font-weight: 600;
            }
            .normal{
              font-size: $font-text;
              display: inline-block;
              vertical-align: middle;
            }
            .text{
              font-size: $font-bigger;
              display: inline-block;
              vertical-align: middle;
              margin-left: 0.2em;
            }
          }
        }
      }


    }
  }
</style>
