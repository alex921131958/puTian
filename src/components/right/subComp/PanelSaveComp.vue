<template>
  <div class="panel fixSty bench-save">
    <div :class="{disabled:disabled}">
      <span @click="panelSave()" :class="{active:curBtn==='use'}">应 用</span>
      <span @click="paramCancel" :class="{active:curBtn==='clear'}">撤销</span>
      <span @click="paramInit" :class="{active:curBtn==='init'}">初始化</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import panelSaveHandler from '../../../service/common/panelSaveHandler'
  import SettingSaveHandler from '../../../service/common/settingSaveHandler'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import eventBus from '../../../util/event-bus'
  import MYCONF from '../../../myconf'
  import env from '../../../common/env'

  export default {
    name: 'PanelSaveComp',
    data() {
      return {
        curBtn: 'use',
        beforeLayer:MYCONF.map.topBgLayer,
        isAllGlobal:false,
      }
    },
    props: {
      fixSty: {
        type: String
      },
      disabled: {
        type: Boolean
      },
    },
    computed: {
      ...mapGetters(['menu_list','cur_menu', 'panel_time', 'link_id', 'link_id_A', 'link_id_B', 'source_type',
        'advance_typeA', 'advance_typeB', 'tracking_type', 'flow_label_show', 'buffer_color', 'buffer_width',
        'selected_only', 'display_mode', 'village_id', 'village_list', 'distance_type', 'traver_analy',
        'residence_list', 'exp_min', 'exp_max', 'flow_range_min', 'flow_range_max', 'global_area','activeList',
        'flow_range_max', 'flow_range_min', 'map_click_disabled', 'click_disabled_type', 'colorSel', 'colorChange',
        'global_v_type','panel_v_type', 'villageMethod', 'adminOption', 'travel_sel', 'buildArea_sel', 'adminArea_sel',
        'link_list', 'grid_heatmap','display_mode_build','global_time_follow','v_update_time','global_time','carOd_curShow',
        'updateDefaultColor','carOdColor','carOd_curExpectation','rangeMax','rangeMin','overAll','overAll_2','overAll_3',
        'overAll_4', 'overAll_5','carOd_curDisplay','road_sel_type','cur_bus_line','adminExpWidth','expWidth',
        'panel_village_id', 'panel_village', 'bus_speed_type','whiteRadius','adminWhiteRadius','cross_icon',
        'flow_background_show', 'flow_background_color', 'flow_background_width','single_layer','taz_only',
        'kernel_radius','isMergeLine']),
    },
    mounted() {
      this.controller = new panelSaveHandler(this);
      this.settingHandler = new SettingSaveHandler(this);
      let _this = this;
      eventBus.$on('hourChange',(hour)=>{
        MapCommonLayer.hideBaseVillageLayer();
        if (_this.grid_heatmap['personTrip-2'] === '热力图') {
          _this.controller.addDynHeatmapLayer(hour);
        }else{
          _this.controller.addDynGridmapLayer(hour);
        }
      })
    },
    methods: {
      ...mapMutations(['updateRoadEditable','updateVillageEditable', 'updateCommonLinkId', 'updateDisplayTime',
        'updateCarTraffic1', 'updateCarTraffic2', 'updateCarTraffic3','updateCarTraffic4','updateCarTraffic5',
        'updateCarTraffic6','updateSelectedOnly','updatePersonTrip1','updatePersonTrip2','updatePersonTrip3',
        'updatePersonTrip4','updatePersonTrip5', 'updateDisplayModeBuild','updateFlowRangeMax','updateFlowRangeMin',
        'updateMenuList','updateTimeFollow','updateVilFollow','updateCmnTraffic1', 'updateCmnTraffic3',
        'updateGlobalLoading','updateCrossIcon','updateCurMenu','updateLayerLegendType','updateLineLayerLegend']),
      // 判断当前是处于哪一个子模块，结果渲染都放在panelSaveHandler这里
      panelSave() {
        this.curBtn = 'use';
        let curMenu = this.cur_menu.id;
        this.updateRoadEditable(false);
        this.updateVillageEditable(false);
        this.updateDisplayTime(this.panel_time); //更新展示时间

        //TODO:此处专门调整图层显示顺序，顺应对应图层顺序（最上面的menu图层在最上面）
        this.setLayerSort(curMenu);

        switch (curMenu) {
          case'carTraffic-1':
            if(this.disabled) return;
            MapCommonLayer.hideBaseRoadLayer();
            this.controller.addHisTrafficLayer();
            break;
          case'carTraffic-2':
            MapCommonLayer.hideBaseRoadLayer();
            this.controller.addAlJamLayer();
            break;
          case'carTraffic-3':
            MapCommonLayer.hideBaseRoadLayer();
            this.controller.addFlowBackgroundLayer();
            this.controller.addFullFlowLayer();
            break;
          case'carTraffic-4':
            if ((this.source_type === "" && this.tracking_type === 'base') || ((this.advance_typeA === "" || this.advance_typeB === "") && this.tracking_type === 'advance')) {
              this.$Message.warning({
                content: '请至少选择一种溯源类型',
                closable: true
              });
              return;
            }else if((!this.map_click_disabled && this.link_id.length === 0 && this.tracking_type === 'base') || ((this.link_id_A.length === 0 && !this.map_click_disabled && this.click_disabled_type !== 'A' || this.link_id_B.length === 0 && !this.map_click_disabled && this.click_disabled_type !== 'B') && this.tracking_type === 'advance')) {
              this.$Message.warning({
                content: '请选择溯源基础link道路',
                closable: true
              });
              return;
            }else if(this.tracking_type === 'advance') {
              let linkIdA = this.link_id_A;
              let linkIdB = this.link_id_B;
              let newLinkId = linkIdA.filter(item => linkIdB.some(linkId => linkId === item));
              this.updateCommonLinkId(newLinkId);
              if (newLinkId.length > 0) {
                this.$Message.warning({
                  content: '道路级A、B有重复项，请处理后应用',
                  closable: true
                });
                return;
              }
            }
            MapCommonLayer.hideBaseRoadLayer();
            this.updateGlobalLoading(true);
            if(env.map.getLayer('carTraffic-4')) env.map.removeLayer('carTraffic-4');
            if (this.tracking_type === 'base') {
              this.controller.calcPreOrdinary();
            } else {
              this.controller.calcPreAdvanced();
            }
            break;
          case'carTraffic-5':
            env.map.flyTo({
              center:MYCONF.map.center
            });
            this.controller.addCrossingLayer();
            break;
          case'cmnTraffic-1':
            MapCommonLayer.hideBaseRoadLayer();
            this.controller.addBusSpeedLayer();
            break;
          case'cmnTraffic-3':
            MapCommonLayer.hideBaseRoadLayer();
            this.controller.addBusFlowLayer();
            break;
          case'personTrip-1':
            MapCommonLayer.hideBaseVillageLayer();
              if (this.display_mode === '全部') {
                this.grid_heatmap['personTrip-1'] === '热力图'?this.controller.addHeatmapLayer():this.controller.addGridLayer();
                this.controller.addAllMethodLine()
              } else if (this.display_mode === '仅期望线') {
                this.controller.addAllMethodLine()
              } else {
                this.grid_heatmap['personTrip-1'] === '热力图'?this.controller.addHeatmapLayer():this.controller.addGridLayer();
              }
            break;
          case'personTrip-2':
            MapCommonLayer.hideBaseVillageLayer();
            if (this.grid_heatmap['personTrip-2'] === '热力图') {
              this.controller.addDynHeatmapLayer();
            } else {
              this.controller.addDynGridmapLayer();
            }
            break;
          case'personTrip-3':
            MapCommonLayer.hideBaseVillageLayer();
            if (this.grid_heatmap['personTrip-3'] === '热力图') {
              this.controller.addTravelHeatmapLayer();
            } else {
              this.controller.addTravelGridmapLayer();
            }
            break;
          case'personTrip-4':
            MapCommonLayer.hideBaseVillageLayer();
            if (this.grid_heatmap['personTrip-4'] === '热力图') {
              this.controller.addResidenceHeatmapLayer();
            } else {
              this.controller.addResidenceGridmapLayer();
            }
            break;
          case'personTrip-5':
            MapCommonLayer.hideBaseVillageLayer();
            if (this.display_mode_build === '全部') {
              this.controller.addBuiltOdLayer();
              this.controller.addBuiltGridLayer();
            } else if (this.display_mode_build === '仅期望线') {
              this.controller.addBuiltOdLayer();
            } else if (this.display_mode_build === '仅小区')
              this.controller.addBuiltGridLayer();
            break;
          default:
            break;
        }

        //面板
        if(!this.disabled) eventBus.$emit("updateDiagramData",this.isAllGlobal);   //点击应用后-传达到分析面板，触发分析面板服务

        //todo:参数存取
        this.settingHandler.savePanelSetting(curMenu);
      },
      paramCancel(){
        this.curBtn='clear';
        eventBus.$emit("setParamEvent","clear");
        this.$Message.info({
          content: '已撤销到上-次保存参数状态，且仅能进行一次撤销操作',
          closable: true,
          duration:3
        });
      },
      paramInit(){
        this.curBtn='init';
        eventBus.$emit("setParamEvent","init");
        this.$Message.info({
          content: '已初始化参数面板',
          closable: true,
          duration:3
        });
      },
      setLayerSort(menuId){
        let layerList = this.activeList;
        let curIndex = layerList.findIndex((value) => {
          return value === menuId;
        });
        if(curIndex !== 0){
          for(let i=curIndex-1;i>=0;i--){
            if(env.map.getLayer(layerList[i])){
              this.beforeLayer = layerList[i];
              return;
            }else{
              this.beforeLayer = MYCONF.map.topBgLayer;
            }
          }
        }else{
          this.beforeLayer = MYCONF.map.topBgLayer;
        }
      }
    },
    watch: {
      isMergeLine(newVal){
        if(env.echartLayer && env.echartLayerOption){
          this.controller.addAllMethodLine()
        }
      }
    },
    beforeDestroy() {
      eventBus.$off("getPanelParam");
      eventBus.$off("hourChange");
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../common/common.scss";

  .panel {
    /*width: 34.5em;*/
    height: 4.2em;
    /*position: absolute;*/
    /*right: 0;*/
    bottom: 0;
    background-color: #707070;
    &.fixSty {
      position: fixed;
    }
    & > div {
      /*width: 29em;*/
      /*margin-left: 3.6em;*/
      display: flex;
      justify-content: space-between;
      &.disabled {
        span {
          color: #000;
          &:hover, &.active {
            background-color: #adadad;
            cursor: not-allowed;
            color: #000;
          }
        }
      }
      span {
        background-color: #adadad;
        flex: 1;
        height: 2.5em;
        line-height: 2.5em;
        margin-right: 10px;
        margin-top: 1em;
        color: #000;
        cursor: pointer;
        transition: all linear 0.3s;
        &:hover, &.active {
          background-color: $bg-red;
          color: #fff;
          transition: all linear 0.3s;
        }
        &.active{
          &:hover{
            background-color: #b92e26;
          }
        }
      }
    }
  }
</style>
