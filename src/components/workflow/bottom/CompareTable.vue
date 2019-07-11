<template>
  <div id="diagram" :class="[diagram_show?'open':'close']">
    <div class="tog-title">
      <span class="title">数据统计分析面板</span>
      <span :class="['tog-tip',diagram_show?'right':'left']" @click="toggleDiagramShow()">
        <span><i class="icon iconfont icon-right"></i></span>
      </span>
    </div>
    <div class="inner">
      <ItemComparePanel :echartData="echartData" @compareSortChange="compareSortChange"/>
      <WorkFlowTab :title="tableTitle" :tableTip="tableTip" :tableColumns="tableColumns" :tableLinkData="tableLinkData"/>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import env from '../../../common/env'
  import MYCONF from '../../../myconf'
  import eventBus from '../../../util/event-bus'
  import CountTag from '../../bottom/subDiagram/CounTag'
  import WorkFlowTab from './subDiagram/WorkFlowTab'
  import ItemComparePanel from './subDiagram/ItemComparePanel'
  import compareTableHandler from '../../../service/common/compareTableHandler'

  export default {
    name: "CompareTable",
    data() {
      return {
        diagram_show: true,
        tableTitle: "数据详情",
        tableTip: "排序跟随分析图设置，仅显示前30条数据",
        diagramTitle: "流量影响比选分析",
        compareSort: '速度影响差异(方案2-方案1)',
        sortType:['方案1影响后速度','方案2影响后速度','速度影响差异(方案2-方案1)'],
        styleObject: {},
        curCompareSelect: '方案1影响后速度',
        //右侧表
        tableColumns: [],
        tableLinkData: [],
        tableLinkData1: [],
        tableLinkData2: [],
        tableLinkData3: [],
        //左侧图
        echartData:[],
      }
    },
    components: {
      CountTag,
      WorkFlowTab,
      ItemComparePanel
    },
    computed: {
      ...mapGetters(['display_time','comparePlan1_id','comparePlan2_id','compareShowType','isPlan1_isRun']),
    },
    mounted(){
      this.controller = new compareTableHandler(this);
      let _this = this;
      eventBus.$on('compareMidPanel',()=>{
        if (_this.tableLinkData.length===0){
          _this.controller.compareDataCancel();
          _this.controller.getCompareColumn();
        }
      });
      eventBus.$on('reRunProject',(data)=>{
        let message = data==='histogram'?'项目1项目2未进行交通分配请返回交评项目进行分配':
          data==='histogram1'?'项目1未进行交通分配请返回交评项目进行分配':
            data==='histogram'?'项目2未进行交通分配请返回交评项目进行分配':
              '请返回交评项目进行分配';
        _this.$Message.warning({
          content: message,
          duration:2,
          closable: false
        });
      });
    },
    beforeDestroy(){
      eventBus.$off('reRunProject');
      eventBus.$off('compareMidPanel')
    },
    methods: {
      ...mapMutations([]),
      toggleDiagramShow() {
        this.diagram_show = !this.diagram_show;
        setTimeout(() => {
          env.map.resize();
        }, 250);
      },
      compareSortChange(data){
        this.curCompareSelect = data;
        let str = data.substring(0,3);
        this.tableLinkData = str==='方案1'?this.tableLinkData1 : str==='方案2'? this.tableLinkData2 : this.tableLinkData3;
      },
    },
    watch: {
      compareShowType(val){
        this.tableColumns=[];
        this.tableLinkData=[];
        this.tableLinkData1=[];
        this.tableLinkData2=[];
        this.tableLinkData3=[];
      },
      compareSort(val){

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common";

  #diagram {
    background-color: #f1f1f1;
    & > div {
      width: 100%;
    }
    &.open {
      height: 24em;
      transition: all ease-in-out 0.2s;
    }
    &.close {
      height: 2em;
      transition: all ease-in-out 0.2s;
    }
    .tog-title {
      height: 2em;
      line-height: 2em;
      background-color: #000;
      text-align: center;
      color: #fff;
      position: relative;
      .title {
        letter-spacing: 1px;
      }
      .tog-tip {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 200;
        width: 2.2em;
        height: 2em;
        line-height: 2.4em;
        background-color: $bg-red;
        cursor: pointer;
        span {
          display: flex;
          width: 1.2em;
          height: 1.2em;
          margin-left: 0.6em;
          margin-top: 0.4em;
          transform: rotate(90deg);
          transition: all ease-in-out 0.2s;
        }
        .icon-right {
          color: #fff;
          line-height: 1.5rem;
        }
        &.left {
          span {
            transform: rotate(270deg);
            transition: all ease-in-out 0.2s;
          }
        }
      }
    }
    .inner {
      height: 22em;
      padding: 0.8em;
      background-color: #666;
      display: flex;
    }
  }

</style>
