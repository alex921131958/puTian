<template>
  <div id="box">
    <p class="title">{{title}}</p>
    <span class="export" @click="saveImage">
      <i class="icon iconfont icon-image"></i><span>分析图导出</span>
    </span>
    <DiagramTab @xAxisChange="xAxisChangeOp" @sourceRange="setSourceRange" @speedChange="setSpeedChange" :isGlobal="isGlobal" :sourceRange="sourceRange"/>
    <div :class="{'single':cur_menu.id==='carTraffic-3'||cur_menu.id==='carTraffic-4'||cur_menu.id==='personTrip-3'||cur_menu.id==='personTrip-4'||cur_menu.id==='personTrip-5'}" id="echart" >
    </div>
    <NoData :isTimeout="isTimeout" v-if="xAxis_1.length === 0"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import DiagramTab from './DiagramTab'
  import DataDiagramHandler from '../../../service/common/dataDiagramHandler'
  import eventBus from '../../../util/event-bus'
  import utilHelper from '../../../util/util-helper'
  import NoData from '../../common/NoData'
  export default {
    name: "DiagramPanel",
    data() {
      return {
        fullWidth: document.documentElement.clientWidth,
        myChart:null,
        legend:[],     //图例
        legend_2:[],     //图例
        xAxis_1: [],        //横轴标注1
        yAxis_obj_1:{          //道路流量-平均流量
          highRoad:[],
          mainRoad:[],
          otherRoad:[]
        },
        yAxis_obj_2:{           //道路流量-平均车公里
          highRoad:[],
          mainRoad:[],
          otherRoad:[]
        },
        yAxis_obj_3:{},
        yAxis_obj_4:{},
        chartType:1,
        sourceRange:3,    // 全市/各建成区
        isTimeout:true,
        curRequest:null,
        isGlobal:true
      }
    },
    props:{
      title:{
        type:String
      }
    },
    components:{
      DiagramTab,
      NoData,
    },
    mounted(){
      this.myChart = echarts ? echarts.init(document.getElementById('echart')) : null;
      this.controller = new DataDiagramHandler(this);
      let that = this;
      window.onresize = () => {
        return (() => {
          window.fullWidth = document.documentElement.clientWidth;
          that.fullWidth = window.fullWidth;
        })()
      };
      eventBus.$on("updateDiagramData",(isGlobal) => {
        this.isGlobal = isGlobal;
        if(!isGlobal) this.sourceRange=3;
        if(!this.myChart){
          this.myChart = echarts.init(document.getElementById('echart'));
        }else{
          that.isTimeout = false;
          this.controller.getDiagramData();
        }
      });
      eventBus.$on('preOrdinarySuccess',(type) => {
        let curMenu = this.cur_menu.id;
        if(curMenu === 'carTraffic-4' && type === 'advance'){
          this.controller.getCarTraffic_4_advanced();
        }else{
          this.controller.getCarTraffic_4();
        }
      });
      eventBus.$on('preOrdinaryFail',(type) => {
        this.isTimeout = true;
      });
      eventBus.$on("stopRequest",() => {
        this.controller.stopDiagramRequest();
      });
    },

    computed: {
      ...mapGetters(['cur_menu','display_time','panel_time','map_click_disabled','global_area','link_id','source_type',
        'flow_range_max','flow_range_min','table_select','village_id','villageMethod','adminOption','adminArea_sel','buildArea_sel',
        'selected_only','road_sel_type','cur_bus_line','panel_v_type','panel_village_id','bus_speed_type','tracking_type',
        'link_id_A', 'link_id_B','advance_typeA', 'advance_typeB','click_disabled_type','global_v_type','cur_pro_id',
        'overAll','overAll_2','overAll_3','overAll_4','overAll_5','taz_only','panel_show']),
    },
    methods: {
      ...mapMutations(['updateGlobalLoading']),
      saveImage(){
        let tableName = this.cur_menu.name;
        let timeObj = utilHelper.setPanelObj(this.display_time);
        let timeSel = timeObj.hour === 31?"早高峰":timeObj.hour === 32?"晚高峰":timeObj.hour+"点";
        let fileName = `${tableName}-${timeObj.year}-${timeObj.season}-${timeObj.datetag}-${timeSel}`;
        let dataUrl = this.myChart.getDataURL({
          type:'png',
          backgroundColor:'white'
          // 导出的图片分辨率比例，默认为 1。
          //pixelRatio: number,
        });
        let aTag = document.createElement("a");
        aTag.href = dataUrl;
        aTag.download = fileName+".png";
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
      },

      xAxisChangeOp(data){
        this.chartType = data;  //指标：1/2
        if(data === 1 && this.sourceRange!==4){
          this.controller.initDiagramChart(this.yAxis_obj_1,data);
        }else if(data === 2 && this.sourceRange!==4){
          this.controller.initDiagramChart(this.yAxis_obj_2,data);
        }else{
          let curData = data === 1?this.yAxis_obj_3:this.yAxis_obj_4;
          this.controller.initDiagramChart(curData);
        }
      },

      setSourceRange(data){
        this.sourceRange = data;
        if(data === 3){
          let curData = this.chartType === 1?this.yAxis_obj_1:this.yAxis_obj_2;
          this.controller.initDiagramChart(curData);
        }else if(data === 4){
          let curData = this.chartType === 1?this.yAxis_obj_3:this.yAxis_obj_4;
          if(curData && curData.length){
            this.controller.initDiagramChart(curData);
          }else {
            return;
          }
        }
      },
      setSpeedChange(data){
        this.sourceRange = data;
        if(data === 3){
          let curData = this.bus_speed_type === 0?this.yAxis_obj_1:this.yAxis_obj_2;
          this.controller.initDiagramChart(curData);
        }else if(data === 4){
          let curData = this.bus_speed_type === 0?this.yAxis_obj_3:this.yAxis_obj_4;
          if(curData && curData.length){
            this.controller.initDiagramChart(curData);
          }else {
            return;
          }
        }
      }
    },
    watch:{
      fullWidth(val) {
        if (!this.timer) {
          this.fullWidth = val;
          this.timer = true;
          let that = this;
          setTimeout(function () {
            that.timer = false;
            that.myChart.resize();
          }, 200)
        }
      },
      panel_show(val) {
        if (!this.timer) {
          this.fullWidth = val;
          this.timer = true;
          let that = this;
          setTimeout(function () {
            that.timer = false;
            that.myChart.resize();
          }, 100)
        }
      },
      cur_menu(newVal) {
        this.chartType = 1;     //menu改变，切换类型重置
        this.myChart.clear();
        this.xAxis_1 = [];
        this.yAxis_obj_1={          //道路流量-平均流量
          highRoad:[],
            mainRoad:[],
            otherRoad:[]
        };
        this.yAxis_obj_2={          //道路流量-平均流量
          highRoad:[],
          mainRoad:[],
          otherRoad:[]
        };
        this.yAxis_obj_3 ={};
        this.yAxis_obj_4 ={};
      },
      selected_only(newVal,oldVal){
        if(oldVal && !newVal){
          this.isGlobal = true;
        }
      }
    },
    beforeDestroy() {
      eventBus.$off("updateDiagramData");
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #box {
    background-color: #fff;
    border: 0.1em solid #d7d7d7;
    /*flex: 1.3;*/
    float: left;
    width: calc(55% - 8.5em);
    height: 100%;
    margin-left: 0.6em;
    border-radius: 1px;
    padding: 0.5em;
    position: relative;
    overflow-x: auto;
    .title{
      font-weight: bold;
      text-align: left;
    }
    .export{
      background-color: #666;
      color: #fff;
      padding: 0.2em 0.5em;
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      cursor: pointer;
      font-size: 1rem;
      .icon-image{
        font-size: 0.9rem;
        margin-right: 0.3em;
      }
    }

    #echart{
      width: 100%;
      height: 15.6em;
      /*background-color: #ccc;*/
      &.single{
        top: 1em;
        height: 17em;
      }
    }
  }

</style>
