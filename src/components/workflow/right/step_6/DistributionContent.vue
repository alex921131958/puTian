<template>
  <div class="box">
    <!--<p class="list">-->
      <!--<span class="large">OD分配内容(可多选)</span>-->
      <!--<ChkGroupComp v-model="odTypeList" @on-change="setOdTypeList">-->
        <!--<ChkComp label="用地相关OD"></ChkComp>-->
        <!--<ChkComp label="道路相关OD"></ChkComp>-->
      <!--</ChkGroupComp>-->
    <!--</p>-->

    <p class="list">
      <span>交通预测时段</span>
      <RadioGroupComp v-model="timeTag" @on-change="setTimeTag">
        <RadioComp :label="item" v-for="item in timeTagList" :key="item"></RadioComp>
      </RadioGroupComp>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import FLOWCONF from '../../flowConf'

  export default {
    name: '',
    data() {
      return{
        odTypeList: ['用地相关OD'],
        timeTag: '晚高峰',
        timeTagList: ['早高峰','晚高峰'],
        trafficIndex:['daily','earlyPeak','latePeak'],
        temp_trafficVol: JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_VOLUME)),
      }
    },
    props:{
      newOdTypeList: {
        type: Array
      },
      newTimeTag: {
        type: String
      }
    },
    mounted(){

    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    methods: {
      ...mapMutations([]),
      setOdTypeList(data){
        this.$emit("setOdTypeList",data);
      },
      setTimeTag(data){
        this.$emit("setTimeTag",data);
      },
      getTimeTag(data){
        this.timeTag = data;
      }
    },
    watch: {
      newOdTypeList(val){
        if(val){
          this.odTypeList = val;
        }
      },
      newTimeTag(val){
        if(val){
          this.timeTag = val;
        }
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
        line-height: 3.4em;
        white-space: nowrap;
        & > span:first-child {
          text-indent: 1.2em;
          &.large{
            width: 12rem;
          }
        }
      }
    }
  }

</style>
