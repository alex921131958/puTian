<template>
  <div id="box">
    <p class="title">{{compareTitle}}</p>
    <span class="export" @click="saveImage">
      <i class="icon iconfont icon-image"></i><span>分析图导出</span>
    </span>
    <div class="" id="echart" ref="echartbox">
    </div>
    <NoData :isTimeout="isTimeout" v-if="xAxis.length === 0" class="dark"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import DiagramTab from '../../../bottom/subDiagram/DiagramTab'
  import eventBus from '../../../../util/event-bus'
  import utilHelper from '../../../../util/util-helper'
  import NoData from '../../../common/NoData'
  import ItemComparePanelHandler from '../../../../service/workflow/ItemComparePanelHandler'

  export default {
    name: "WorkFlowPanel",
    data() {
      return {
        fullWidth: document.documentElement.clientWidth,
        myChart:null,
        xAxis:[],
        isTimeout:true,
        compareTitle:'速度影响比选分析(方案2-方案1)',
        compareFun: '速度影响差异(方案2-方案1)',
        compareArr: ['方案1影响后速度','方案2影响后速度','速度影响差异(方案2-方案1)'],
        postObj:[],
        tableObj:{},
        // echartData:[],
        echartData1:[],
        echartData2:[],
        echartData3:[],
      }
    },
    props:{
      diagramTitle:{
        type: String
      },
      sortType:{
        type: Array
      },
      compareSort:{
        type: String
      },
      echartData:{
        type: Array
      },
    },
    components:{
      DiagramTab,
      NoData,
    },
    mounted(){
      this.controller = new ItemComparePanelHandler(this);
      this.myChart = echarts.init(document.getElementById('echart'));
      let that = this;
      window.onresize = () => {
        return (() => {
          window.fullWidth = document.documentElement.clientWidth;
          that.fullWidth = window.fullWidth;
        })()
      };
      eventBus.$on('compareMidPanel',()=>{
        if (that.echartData1.length===0){
          that.controller.getCompareEchartData();
        }
      })
    },
    beforeDestroy(){
      eventBus.$off('compareMidPanel')
    },
    computed: {
      ...mapGetters(['compareShowType','comparePlan1_id','comparePlan2_id']),
    },
    methods: {
      ...mapMutations([]),
      saveImage(){
        let tableName = this.cur_menu.name;
        let timeObj = utilHelper.setPanelObj(this.display_time);
        let timeSel = timeObj.hour === 31?"早高峰":timeObj.hour === 32?"晚高峰":timeObj.hour+"点";
        let fileName = `${tableName}-${timeObj.year}-${timeObj.season}-${timeObj.datetag}-${timeSel}`;
        let dataUrl = this.myChart.getDataURL({
          type:'png',
          backgroundColor:'white'
        });
        let aTag = document.createElement("a");
        aTag.href = dataUrl;
        aTag.download = fileName+".png";
        document.body.appendChild(aTag);
        aTag.click();
        document.body.removeChild(aTag);
      },
      compareSortSelect(val){
      }
    },
    watch:{
      compareShowType(val){
        this.compareTitle = val==='speed'?'速度影响比选分析':
          val==='flow'?'流量影响比选分析':
            val==='saturation'?'饱和度影响比选分析':
              '服务水平影响比选分析';
        this.compareFun = val==='speed'?'速度影响差异(方案2-方案1)':
          val==='flow'?'流量影响差异(方案2-方案1)':
            val==='saturation'?'饱和度影响差异(方案2-方案1)':
              '服务水平影响差异(方案2-方案1)';
        this.compareArr = val==='speed'?['方案1影响后速度','方案2影响后速度','速度影响差异(方案2-方案1)']:
          val==='flow'?['方案1影响后流量','方案2影响后流量','流量影响差异(方案2-方案1)']:
            val==='saturation'?['方案1影响后饱和度','方案2影响后饱和度','饱和度影响差异(方案2-方案1)']:
              ['方案1影响后服务水平','方案2影响后服务水平','服务水平影响差异(方案2-方案1)'];
        let data = val==='speed'? '速度影响': val==='flow'? '流量影响':val==='saturation'? '饱和度影响': '服务水平影响';
        this.compareTitle = data+ '比选分析';
        this.xAxis=[];
        this.echartData1=[];
        this.echartData2=[];
        this.echartData3=[];
      },
      compareFun(val){
        this.$emit("compareSortChange",val);
        let str = val.substring(0,3);
        let data = str==='方案1'?this.echartData1 : str==='方案2'? this.echartData2 : this.echartData3;
        this.controller.setCompareEchart(data);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../../common/common";

  #box {
    background-color: #2f2f2f;
    flex: 0.6;
    /*width: 60%;*/
    height: 100%;
    border-radius: 1px;
    padding: 0.5em;
    position: relative;
    overflow-x: auto;
    .title{
      color: #FBE644;
      font-size: 1.2em;
      font-weight: bold;
      text-align: left;
    }
    .list{
      white-space: nowrap;
      text-align: left;
      line-height: 1.5em;
      margin-top: 0.1em;
      color: #FBE644;
      .ivu-radio-inner:after{
        background-color: #FBE644;
      }
      .sort{
        color: white;
        font-weight: bold;
        margin-left: 0.7em;
        font-size: 1em;
      }
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
      height: 17.6em;
      /*background-color: #ccc;*/
    }
  }
</style>
