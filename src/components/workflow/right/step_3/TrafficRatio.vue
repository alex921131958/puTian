<template>
  <div class="box">
    <p class="list list-item" v-for="(item, index) in trafficIndex">
      <span v-if="index===0">日总交通量&nbsp;&nbsp;&nbsp;<span class="content"> {{roadTrafficDis.daily?roadTrafficDis.daily:0}} pcu</span></span>
      <span v-if="index===1">早高峰出行量 <span class="content">{{roadTrafficDis.earlyPeak?roadTrafficDis.earlyPeak:0}} pcu/h</span></span>
      <span v-if="index===2">晚高峰出行量 <span class="content">{{roadTrafficDis.latePeak?roadTrafficDis.latePeak:0}} pcu/h</span></span>
      <span>
        <span class="tip">调整系数</span>
        <InputNumberComp v-model="temp_trafficVol[item]" :min="0" :max="50" :step="0.1" size="large" :formatter="value => value.toFixed(1)" class="radio"
        @on-change="trafficVolChange(temp_trafficVol[item], item)"/>
      </span>
    </p>

    <p class="list">
      <span>潜在影响道路搜索半径(km)</span>
      <span>
        <InputNumberComp v-model="temp_roadRadius" :min="0" :max="50" :step="0.1" size="large" :formatter="value => value.toFixed(1)" class="radio"/>
      </span>
    </p>

    <p class="list">
      <span>时间范围</span>
      <RadioGroupComp v-model="curDayNight">
        <RadioComp :label="item" v-for="item in dayNightList" :key="item"></RadioComp>
      </RadioGroupComp>
    </p>

    <p class="title">
      <span class="btn btn1" @click="setStepOneTemp">使用Step1预设系数</span>
      <span class="btn btn2" @click="setRoadTrafficDistribute">预测/更新道路相关交通分布</span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import FLOWCONF from '../../flowConf'
  import eventBus from "../../../../util/event-bus";
  import TrafficRatioHandler from '../../../../service/workflow/TrafficRatioHandler'

  export default {
    name: '',
    data() {
      return{
        trafficIndex:['daily','earlyPeak','latePeak'],
        temp_trafficVol: JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_VOLUME)),
        temp_roadRadius: 0.5,
        curDayNight: '晚高峰',
        dayNightList: ['早高峰','晚高峰'],
        curRequest: '',
      }
    },
    props: {
      trafficTemp:{
        type: Object
      },
      roadRadius:{
        type: Number
      },
      trafficYell:{
        type: Object
      },
      newDayNight:{
        type: String
      }
    },
    mounted() {
      let _this = this;
      setTimeout(() => {
        _this.temp_trafficVol = JSON.parse(JSON.stringify(_this.trafficTemp));
        _this.temp_roadRadius = JSON.parse(JSON.stringify(_this.roadRadius));
        _this.curDayNight = _this.newDayNight;
      },300);
      this.controller = new TrafficRatioHandler(this);
      //todo 元宵节bug
      // this.controller.deleteRoadTrafficRecording();
      this.controller.getTripsList();
      eventBus.$on("stopRequest",() => {
        this.controller.stopDiagramRequest();
      });
    },
    computed: {
      ...mapGetters(['cur_step','stepOneTemp','index_trafficVol','cur_pro_id','roadTrafficDis','roadTrafficModules',
        'searchRadius','stepOneDataType', 'landFlowMax','landFlowMin','landFlowWidth','isFlowRemakeShow',
        'landBackgroundWidth','landPlanColor','backgroundPlanColor','timeRange', 'global_loading','road_num',
        'cur_project','isBackgroundFlowShow']),
    },
    methods:{
      ...mapMutations(['updateRoadTrafficModules','updateRoadTrafficDis','updateGlobalLoading']),
      setStepOneTemp(){
        this.temp_trafficVol = this.index_trafficVol;
        this.updateRoadTrafficModules(this.index_trafficVol)
      },
      trafficVolChange(bool, item){
        this.$emit('trafficVolChange',this.temp_trafficVol);
      },
      setRoadTrafficDistribute(){
        this.controller.roadTrafficDistributed()
      }
    },
    watch: {
      temp_roadRadius(newVal){
        this.$emit("roadRadiusChange", newVal)
      },
      curDayNight(newVal){
        this.$emit("dayNightChange", newVal)
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p {
      line-height: 3rem;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3.4em;
        &.list-item{

        }
        & > span:first-child {
          text-indent: 2.2em;
        }
      }
      &.title {
        line-height: 3rem;
        display: flex;
        justify-content: space-between;
      }
      .btn{
        color: #666;
        height: 2.3rem;
        line-height: 2.5rem;
        margin-top: 0.8rem;
        text-align: center;
        cursor: pointer;
      }
      .btn1 {
        width: 11rem;
        background-color: #FFFFFF;
        margin-left: 2.2rem;
      }
      .btn2 {
        flex: 1;
        background-color: $highlight;
        margin-left: 0.6rem;
      }
      span {
        /*opacity: 0.8;*/
        .content {
          color: $highlight;
          margin-left: 1rem;
        }
        .tip {
          margin-right: 0.2rem;
        }
        .radio{
          margin-top: -0.2rem;
        }
      }
    }
  }
</style>
