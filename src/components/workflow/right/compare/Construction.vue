<template>
  <div class="box">
    <p class="list">
      <span class="content">建设内容</span>
      <span class="plan1">方案1</span>
      <span class="plan2">方案2</span>
    </p>
    <p v-for="(item,index) in tempList" :class="['list', item.plan1===item.plan2 ? 'identical' : 'different']">
      <span class="text-content">
        <i class="icon iconfont icon-ok" v-if="item.plan1===item.plan2"></i>
        <i class="icon iconfont icon-warn" v-if="item.plan1!==item.plan2"></i>
        {{item.text}}
      </span>
      <span class="plan1-num">{{item.plan1}}
        <span v-if="index===0">个</span>
        <span v-if="index===3||index===5">km</span>
        <span v-if="index===2||index===4">条</span>
        <span v-if="index===1">km<sup>2</sup></span>
      </span>
      <span class="symbol">{{item.plan1===item.plan2? '=': item.plan1>item.plan2? '>' : '<'}}</span>
      <span class="plan2-num">{{item.plan2}}
        <span v-if="index===0">个</span>
        <span v-if="index===3||index===5">km</span>
        <span v-if="index===2||index===4">条</span>
        <span v-if="index===1">km<sup>2</sup></span>
      </span>
    </p>


  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import eventBus from '../../../../util/event-bus'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "Construction",
    data() {
      return {
        tempList:FLOWCONF.COMPAREPROHECT
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
      this.$nextTick(()=>{
        _this.tempList = _this.comparePlan
      });
      eventBus.$on('constructorCompare',()=>{
        _this.tempList = _this.comparePlan
      })
    },
    computed: {
      ...mapGetters(['cur_step','comparePlan']),
    },
    components: {},
    methods: {
      ...mapMutations([]),

    },
    watch:{
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
        &.identical{
          color: $highlight;
        }
        &.different{
          color: #FF6962;
        }
        .iconfont{

        }
        .text-content{
          flex: 3;
        }
        .plan1-num{
          flex: 1.2;
        }
        .symbol{
          flex: 0.9;
        }
        .plan2-num{
          flex: 1.1;
        }
        .content{
          flex: 2.6;
        }
        .plan1{
          flex: 1.8;
        }
        .plan2{
          flex: 1;
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
