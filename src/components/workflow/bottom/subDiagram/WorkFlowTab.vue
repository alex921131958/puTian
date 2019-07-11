<template>
  <div id="box" ref="tableBox">
    <p class="title" ref="tableTitle">{{title}}</p>
    <span class="export" @click="exportCSV">
      <i class="icon iconfont icon-export"></i><span>数据表导出</span>
    </span>
    <p class="tip" ref="tableTip">
      <i class="icon iconfont icon-warn"></i><span>&nbsp;&nbsp;{{tableTip}}</span>
    </p>
    <TableComp :loading="isLoading" :data="linkData" :columns="linkColumns" :height=tableHeight ref="linkList"
               :no-data-text="noDataText" :row-class-name="rowClassName" class="project" :header-cell-style="tableHeaderColor"></TableComp>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import workFlowTableHandler from '../../../../service/common/workFlowTableHandler'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import utilHelper from '../../../../util/util-helper'
  import NoData from '../../../common/NoData'
  export default {
    name: "WorkFlowTab",
    data() {
      return {
        noDataText: '暂无数据',
        linkColumns:[],
        linkData:[],
        linkDataElse:[],
        linkDataElse1:[],
        tableHeight:200,
        isLoading:false,
      }
    },
    props:{
      title:{
        type:String
      },
      tableTip:{
        type:String
      },
      tableColumns:{
        type:Array
      },
      tableLinkData:{
        type:Array
      }
    },
    computed: {
      ...mapGetters(['cur_pro_id','stepSixTimeTag','cur_project']),
    },
    components:{
      NoData,
    },
    mounted(){
      // this.linkColumns = this.tableColumns;
      this.controller = new workFlowTableHandler(this);
      let that = this;
      eventBus.$on("trafficPredictionDataSuccess",(data) => {
        this.controller.getTrafficPredictionColumn(data);
        this.controller.getTrafficPrediction(data);
      });
      eventBus.$on("flowModeSortChange",(data) => {
        this.controller.getTrafficPredictionColumn(data);
        this.controller.getTrafficPrediction(data);
      });
      this.$nextTick(() => {
        if(this.$refs['tableBox']){
          this.tableHeight = this.$refs['tableBox'].offsetHeight - this.$refs['tableTitle'].offsetHeight - 2.1*this.$refs['tableTip'].offsetHeight;
        }
      });
    },
    beforeDestroy(){
      eventBus.$off('trafficPredictionDataSuccess');
      eventBus.$off('flowModeSortChange')
    },
    methods:{
      exportCSV(){
        let tableName = this.cur_project.name;
        let fileName = `${tableName}项目-交通影响特征分析`;
        this.$refs.linkList.exportCsv({
          filename: fileName
        });
      },
      rowClassName (row, index) {
        return 'demo-table-info-row';
      },
      tableHeaderColor(){
        return 'background-color: #2f2f2f;color: #fff;'
      }
    },
    watch: {
      tableColumns: {
        handler(){
          this.linkColumns = this.tableColumns;
        },
        deep:true
      },
      tableLinkData: {
        handler(){
          this.linkData = this.tableLinkData;
        },
        deep:true
      },
      sort_type(val){
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../../common/common";

  .demo-table-info-row td{
    color: #fff;
    background-color: #35e449;
  }

  .ivu-table-wrapper{
    .ivu-table-header{
      color: #fff;
      background-color: #2f2f2f;
    }
  }

  .ivu-table-stripe{
    background-color: #35e449;
  }

  #box {
    background-color: #2f2f2f;
    flex: 0.4;
    overflow: hidden;
    margin-left: 0.8em;
    border-radius: 1px;
    padding: 0.5em;
    position: relative;
    .title{
      font-size: 1.2em;
      font-weight: bold;
      text-align: left;
      color: #FBE644;
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
      color: #FBE644;
      margin-top: 0.3em;
      margin-bottom: 0.2em;
      .icon-warn{
        color: #958B39;
        margin-right: 0.3em;
        font-size: 1rem;
      }
      span{
        font-size: 1rem;
      }
    }
  }

</style>
