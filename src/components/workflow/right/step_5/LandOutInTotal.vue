<template>
  <div class="box">
    <p class="list">
      <span>已设置出入口地块/规划地块 <span class="content">{{landEntry}}<span>/</span>{{landCount}} 个</span></span>
    </p>

    <p class="list">
      <span>总出入口数量<span class="content">{{entryCount}} 个</span></span>
    </p>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import FLOWCONF from '../../flowConf'
  import eventBus from "../../../../util/event-bus";

  export default {
    name: 'LandOutInTotal',
    data() {
      return{
      }
    },
    props: {
      landCount:{
        type: Number
      },
      entryCount:{
        type: Number
      },
      landEntry:{
        type: Number
      }
    },
    mounted() {

    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    methods:{
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
