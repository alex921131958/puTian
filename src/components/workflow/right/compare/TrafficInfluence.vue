<template>
  <div class="box">
    <p class="list">
      <span class="range">分析范围(距项目中心半径)</span>
      <span class="response"><SliderComp v-model="analyRange" :min="1" :max="5" :step="0.1" show-input/></span>
    </p>

    <p v-for="(item,index) in showItemCompare" class="list">
      <span class="title">{{item.label}}</span>
      <span :class="item.planA > item.planB ? 'red':'yellow'">
        方案1&nbsp;&nbsp;{{item.planA}}
        <span v-if="index===1">km/h</span>
        <span v-if="index===2">pcu/h</span>
        <span v-if="index===3">%</span>
        <span v-if="index===4">级</span>
      </span>
      <span class="symbol">{{item.planA===item.planB?'=':item.planA < item.planB? '<':'>'}}</span>
      <span :class="item.planA < item.planB ? 'red':'yellow'">
        方案2&nbsp;&nbsp;{{item.planB}}
        <span v-if="index===1">km/h</span>
        <span v-if="index===2">pcu/h</span>
        <span v-if="index===3">%</span>
        <span v-if="index===4">级</span>
      </span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import eventBus from '../../../../util/event-bus'
  import compareHandler from '../../../../service/workflow/compareHandler'

  export default {
    name: "TrafficInfluence",
    data() {
      return {
        analyRange: 1,
        showItemCompare:[{
          label:'时段',
          planA: '早高峰',
          planB: '早高峰'
        },{
          label:'速度影响',
          planA: 0,
          planB: 0
        },{
          label:'流量影响',
          planA: 0,
          planB: 0
        },{
          label:'饱和度影响',
          planA: 0,
          planB: 0
        },{
          label:'服务水平影响',
          planA: 0,
          planB: 0
        }]
      }
    },
    props: {

    },
    mounted() {
      let _this = this;
      eventBus.$on('comparePlanIdSuccess', function(){
        _this.trafficRangeChange()
      });
    },
    beforeDestroy(){
      eventBus.$off("comparePlanIdSuccess");
    },
    computed: {
      ...mapGetters(['cur_step','project1','project2','comparePlan1_id','comparePlan2_id']),
    },
    components: {},
    methods: {
      ...mapMutations(['updateIsPlan1_isRun','updateIsPlan2_isRun']),
      trafficRangeChange(){
        let url = MYCONF.service.compareInfluence + `?token=${sessionStorage.getItem("token")}&radius=${this.analyRange}&projectid1=${this.comparePlan1_id}&projectid2=${this.comparePlan2_id}`;
        this.$http.get(url).then((res) => {
          res = res.body.result;
          if(res.p1_List.length===0 && res.p2_List.length!==0){
            eventBus.$emit('reRunProject','histogram1');
            this.updateIsPlan1_isRun(false);
          }else if(res.p1_List.length!==0 && res.p2_List.length===0){
            eventBus.$emit('reRunProject','histogram2');
            this.updateIsPlan1_isRun(false);
          }else if(res.p1_List.length===0 && res.p2_List.length===0){
            eventBus.$emit('reRunProject','histogram');
            this.updateIsPlan1_isRun(false);
          }else {
            this.showItemCompare = compareHandler.compareInfo(res);
            this.updateIsPlan1_isRun(true);
          }
        })
      }
    },
    watch:{
      project1(val){
        this.analyRange = 1;
        this.trafficRangeChange()
      },
      project2(val){
        this.analyRange = 1;
        this.trafficRangeChange()
      },
      comparePlan2_id(val){
        this.trafficRangeChange()
      }
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
        line-height: 3em;
        margin-top: 0.5em;
        .title{
          text-indent: 2.2em;
          flex: 1.9;
        }
        .symbol{
          flex: 0.5;
        }
        .red{
          color: #FF6962;
          flex: 2;
        }
        .yellow{
          color: $highlight;
          flex: 2;
        }
      }
      span {
        &.range {
          width: 15em;
          text-align: left;
          text-indent: 2.2em;
        }
        &.response {
          flex: 1;
        }
      }
    }
  }

  @media(max-width: 1599px){
    .box {
      p{
        &.list{
          & > span:first-child {
            text-indent: 1.2em;
          }
        }
      }
    }
  }
</style>
