<template>
  <div class="box">
    <p class="list">
      <span class="large">方案汇总</span>
      <span v-for="item in programList">
        <span>{{item.label}}</span>
        <span>{{item.value}}</span>
        <span v-if="item.label !== '规划地块'">条</span>
        <span v-if="item.label === '规划地块'">个</span>
      </span>
    </p>



  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import FLOWCONF from '../../flowConf'

  export default {
    name: 'ProgramCheck',
    data() {
      return{
        programList: FLOWCONF.PROGRAMSUMMARY,
      }
    },
    props:{
      statisticItem:{
        type: Object
      }
    },
    mounted(){
      let _this = this;
      setTimeout(() => {
        _this.programList = _this.statisticItem;
      },300);
    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    methods: {
      ...mapMutations([]),

    },
    watch: {

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
        & > span {
          color: $highlight;
          margin-right: 1.2rem;
        }
        & > span:first-child {
          text-indent: 1.2em;
          color: white;
          &.large{
            width: 12rem;
          }
        }

      }
    }
  }

</style>
