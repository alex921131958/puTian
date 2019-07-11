<template>
  <div class="box">
    <p class="list list-extra">
      <span>规划地块</span>
      <span class="highlight">{{landNum?landNum:0}}个</span>
      <span class="highlight">{{landArea?(landArea/1000000).toFixed(2):0}}平方公里</span>
    </p>
    <p class="list list-item" v-for="(item,index) in trafficIndex">
      <span class="item" v-if="index===0">日出行量(pcu/h)&nbsp;&nbsp;</span>
      <span class="item" v-if="index===1">早高峰出行量(pcu/h)</span>
      <span class="item" v-if="index===2">晚高峰出行量(pcu/h)</span>
      <span class="content">
        <span>生成
        <span class="highlight">{{land[item].generate?parseInt(land[item].generate):0}}</span>
        </span>
        <span>吸引
          <span class="highlight">{{land[item].attract?parseInt(land[item].attract):0}}</span>
        </span>
        <span>总量
          <span class="highlight">{{land[item].count?parseInt(land[item].count):0}}</span>
        </span>
      </span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'

  export default {
    name: "LandUseCount",
    data() {
      return {
        trafficIndex: ['daily', 'earlyPeak', 'latePeak'],
      }
    },
    props: {
      land: {
        type: Object
      },
      landNum: {
        type: Number
      },
      landArea: {
        type: Number
      }
    },
    mounted() {

    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {},
    methods: {
      ...mapMutations([]),
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p {
      &.list {
        display: flex;
        line-height: 3em;
        white-space: nowrap;
        &.list-item {
          justify-content: space-between;

        }
        &.list-extra {
          & > span {
            margin-right: 1.2rem;
          }
        }
        & > span {
          &:first-child {
            text-indent: 2.2em;
            &.item {
              width: 13rem;
            }
          }
          &.content {
            flex: 1;
            margin-left: 1rem;
            display: flex;
            & > span {
              flex: 1;
              text-align: left;
            }
          }
        }
        .highlight {
          color: $highlight;
        }
      }
    }
  }

  @media(max-width: 1599px) {
    .box {
      p {
        &.list {
          & > span:first-child {
            text-indent: 1.2em;
            &.item {
              width: 10.5rem;
            }
          }
        }
      }
    }
  }
</style>
