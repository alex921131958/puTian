<template>
  <div id="box">
    <p class="title">{{title}}</p>
    <span class="export" @click="saveImage">
      <i class="icon iconfont icon-image"></i><span>分析图导出</span>
    </span>
    <p class="list">
      <span class="sort">影响分析类型:</span>
      <RadioGroupComp v-model="curFlow" @on-change="flowModeSelect">
        <RadioComp :label="item" v-for="item in flowType" :key="item"></RadioComp>
      </RadioGroupComp>

      <!--<span class="sort">排序:</span>-->
      <!--<RadioGroupComp v-model="sortFunc" @on-change="flowSortSelect">-->
        <!--<RadioComp :label="item" v-for="item in sortType" :key="item"></RadioComp>-->
      <!--</RadioGroupComp>-->
    </p>
    <div class="" id="echart" >
    </div>
    <NoData :isTimeout="isTimeout" v-if="xAxis.length === 0" class="dark"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import DiagramTab from '../../../bottom/subDiagram/DiagramTab'
  import workFlowDiagramHandler from '../../../../service/common/workFlowDiagramHandler'
  import eventBus from '../../../../util/event-bus'
  import utilHelper from '../../../../util/util-helper'
  import NoData from '../../../common/NoData'

  export default {
    name: "WorkFlowPanel",
    data() {
      return {
        fullWidth: document.documentElement.clientWidth,
        myChart:null,
        xAxis:[],
        isTimeout:true,
        curFlow: '饱和度',
        flowType:['饱和度','流量','速度'],
        sortFunc:'饱和度影响',
        sortType:['饱和度影响','影响后饱和度'],
        postObj:[],
        tableObj:{},
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
      this.myChart = echarts.init(document.getElementById('echart'));
      this.controller = new workFlowDiagramHandler(this);
      let that = this;
      window.onresize = () => {
        return (() => {
          window.fullWidth = document.documentElement.clientWidth;
          that.fullWidth = window.fullWidth;
        })()
      };
      eventBus.$on("calcTrafficVolSuccess",() => {
        this.isTimeout = false;
        this.controller.trafficPredictionData();
      })
    },
    beforeDestroy(){
      eventBus.$off('calcTrafficVolSuccess')
    },
    computed: {
      ...mapGetters(['cur_pro_id','stepSixTimeTag','cur_project','panel_show']),
    },
    methods: {
      ...mapMutations([]),
      saveImage(){
        let flowType = this.curFlow;
        let sortType = this.sortFunc;
        let proName = this.cur_project.name;

        let fileName = `${proName}项目-${flowType}影响分析-按${sortType}排序`;
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
      flowModeSelect(val){
        this.sortType = val === '饱和度'? ['饱和度影响','影响后饱和度']:val === '流量'?['流量影响','影响后流量']:['速度影响','影响后速度'];
        this.sortFunc = this.sortType[0];
        if (this.postObj[0]) this.controller.trafficPrediction(val, this.sortFunc, this.postObj);
        if (Object.keys(this.tableObj).length !== 0) eventBus.$emit('flowModeSortChange', [val, this.sortFunc, this.tableObj])
      },
      flowSortSelect(val){
        if (this.postObj[0]) this.controller.trafficPrediction(this.curFlow, val, this.postObj);
        if (Object.keys(this.tableObj).length !== 0) {
          eventBus.$emit('flowModeSortChange', [this.curFlow, val, this.tableObj])
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
          this.timer = true;
          let that = this;
          setTimeout(function () {
            that.timer = false;
            that.myChart.resize();
          }, 100)
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../../common/common";

  #box {
    background-color: #2f2f2f;
    /*border: 0.1em solid #d7d7d7;*/
    flex: 0.6;
    /*float: left;*/
    /*width: 60%;*/
    height: 100%;
    /*margin-left: 0.6em;*/
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
      height: 15.6em;
      /*background-color: #ccc;*/
    }
  }

</style>
