<template>
  <div id="box" ref="tableBox">
    <p class="title" ref="tableTitle">{{title}}</p>
    <span class="export" @click="exportCSV">
      <i class="icon iconfont icon-export"></i><span>数据表导出</span>
    </span>
    <p class="tip" ref="tableTip">
      <i class="icon iconfont icon-warn" v-if="cur_menu.id !== 'personTrip-1'"></i>
      <span v-if="cur_menu.id !== 'personTrip-1'">{{tableTip}}</span>

      <RadioGroupComp v-model="personTrip_11_tab" @on-change="carTraffic31Change" v-if="cur_menu.id === 'personTrip-1'">
        <RadioComp :label="item" v-for="item in personTrip_11" :key="item"></RadioComp>
      </RadioGroupComp>
    </p>
    <TableComp :loading="isLoading" :data="linkData" :columns="linkColumns" :height=tableHeight ref="linkList"
               :no-data-text="noDataText"></TableComp>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import DataTableHandler from '../../../service/common/dataTableHandler'
  import eventBus from '../../../util/event-bus'
  import MYCONF from '../../../myconf'
  import utilHelper from '../../../util/util-helper'
  import NoData from '../../common/NoData'
  export default {
    name: "TablePanel",
    data() {
      return {
        noDataText: '暂无link数据',
        linkColumns:[],
        linkData:[],
        linkDataElse:[],
        linkDataElse1:[],
        tableHeight:200,
        isLoading:false,
        curRequest:null,
        personTrip_11:['生成吸引总量','OD数据'],
        personTrip_11_tab: '生成吸引总量',
        odTableList1: [],
        odTableList2: [],
      }
    },
    props:{
      title:{
        type:String
      },
      tableTip:{
        type:String
      },
      carTraffic_11_tab:{
        type: String
      }
    },
    computed: {
      ...mapGetters(['display_time', 'cur_menu','panel_time','map_click_disabled','global_area','link_id','source_type',
      'flow_range_max','flow_range_min','table_select','village_id','villageMethod','adminOption','adminArea_sel','buildArea_sel',
        'selected_only','road_sel_type','cur_bus_line','panel_v_type','panel_village_id','tracking_type', 'link_id_A', 'link_id_B',
        'advance_typeA', 'advance_typeB','click_disabled_type','global_v_type','overAll','overAll_2','overAll_3','overAll_4','overAll_5',
        'bus_speed_type','data_details_select','taz_only','taz_only'
      ]),
    },
    components:{
      NoData,
    },
    mounted(){
      this.controller = new DataTableHandler(this);
      eventBus.$on("updateDiagramData",() => {
        this.isLoading = true;
        this.controller.getColumnData();
        //请求面板数据
        this.controller.getTableData();
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
        this.isLoading = false;
      });
      eventBus.$on("stopRequest",() => {
        this.controller.stopDiagramRequest();
      });
      this.$nextTick(() => {
        if(this.$refs['tableBox']){
          this.tableHeight = this.$refs['tableBox'].offsetHeight - this.$refs['tableTitle'].offsetHeight - 2.1*this.$refs['tableTip'].offsetHeight;
        }
      });
    },
    methods:{
      ...mapMutations(['updateGlobalLoading','updateDataDetailsSelect']),
      exportCSV(){
        let tableName = this.cur_menu.name;
        let timeObj = utilHelper.setPanelObj(this.display_time);
        let timeSel = timeObj.hour === 31?"早高峰":timeObj.hour === 32?"晚高峰":timeObj.hour+"点";
        let fileName = `${tableName}-${timeObj.year}-${timeObj.season}-${timeObj.datetag}-${timeSel}`;
        this.$refs.linkList.exportCsv({
          filename: fileName,
          columns: this.linkColumns.filter((col,index) => col.key != 'locate'),
          // data: this.linkData.filter((data,index) => data.locate == '')
        });
      },
      carTraffic31Change(){
        this.updateDataDetailsSelect(this.personTrip_11_tab==='生成吸引总量'?0:1);
        this.controller.getColumnData(this.personTrip_11_tab);
        this.linkData= this.personTrip_11_tab === 'OD数据'? this.odTableList2 : this.odTableList1;
      },
      quotaChangeTable(data){
        this.linkData = data===1 ? this.odTableList1 : this.odTableList2;
      }
    },
    watch: {
      table_select(newVal){
        this.linkData = newVal === 1 ? this.linkDataElse1 : this.linkDataElse;
      },
      cur_menu(newVal){
        let curMenu = newVal.id;
        this.linkColumns=[];
        this.linkData=[];
        this.odTableList1=[];
        this.odTableList2=[];
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #box {
    background-color: #fff;
    border: 0.1em solid #d7d7d7;
    /*flex: 1;*/
    float: left;
    width: calc(45% - 6em);
    height: 100%;
    margin-left: 0.8em;
    border-radius: 1px;
    padding: 0.5em;
    position: relative;
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
      .icon-export{
        font-size: 1.1rem;
        margin-right: 0.2em;
      }
    }
    .tip{
      text-align: left;
      color: #999;
      margin-top: 0.4em;
      .icon-warn{
        color: #bbb;
        margin-right: 0.3em;
        font-size: 1rem;
      }
      span{
        font-size: 1rem;
      }
    }
  }

</style>
