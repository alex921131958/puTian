<template>
  <div class="box">
    <p class="list">
      <span>背景年度</span>
      <i-select v-model="curYear" style="width:10em;" @on-change="setCurYear">
        <i-option v-for="item in yearList" :value="item.value" :key="item.value" :disabled="item.value!=2018">{{ item.label }}</i-option>
      </i-select>
    </p>
    <p class="list">
      <span>预测目标年</span>
      <!--<i-select v-model="aimYear" style="width:10em;" @on-change="setAimYear">-->
        <!--<i-option v-for="item in yearList" :value="item.value" :key="item.value" :disabled="item.value<=2018">{{ item.label }}</i-option>-->
      <!--</i-select>-->
      <span class="response large"><InputNumberComp v-model="aimYear" :min="2018" :max="2050" :step="1"/></span>
    </p>
    <p class="list">
      <span>日期类型</span>
      <RadioGroupComp v-model="curDate">
        <RadioComp :label="item" v-for="item in dateList" :key="item" :disabled="item==='非工作日'"></RadioComp>
      </RadioGroupComp>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import eventBus from '../../../../util/event-bus'

  export default {
    name: "stepTitle",
    data() {
      return {
        dateList: MYCONF.DATE_LIST,
        yearList: MYCONF.YEAR_LIST,
        curDate: MYCONF.DATE_LIST[0],
        curYear: MYCONF.YEAR_LIST[2].label,
        aimYear: MYCONF.TARGET_YEAR,
      }
    },
    props: {
      proDate: {
        type: String
      },
      proYear: {
        type: Number
      }
    },
    mounted() {
      let _this = this;
      /*eventBus.$on("updatePresettingTime",() => {
        console.log(_this.proDate);
        console.log(_this.proYear);
        _this.curDate = this.proDate;
        _this.curYear = this.proYear;
      });*/
      /*setTimeout(() => {
        _this.curDate = this.proDate;
        _this.curYear = this.proYear;
      },150)*/
    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {},
    methods: {
      ...mapMutations([]),
      setCurYear(data){
        this.$emit('updateYear',data);
      },
      setAimYear(data){
        this.$emit('updateAimYear',data);
      },
      updateDate(val){
        this.curDate = val;
      },
      updateYear(val){
        this.curYear = val;
      },
      updateAimYear(val){
        this.aimYear = val;
      }
    },
    watch:{
      curDate(val){
        this.$emit('updateDateType',val);
      },
      aimYear(val){
        if(val){
          this.setAimYear(val);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p{
      &.list{
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        & > span:first-child {
          text-indent: 2.2em;
        }
      }
    }
  }

  .ivu-radio-wrapper-disabled{
    opacity: 0.9;
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
