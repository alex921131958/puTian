<template>
  <div id="diagram" :class="[diagram_show?'open':'close']">
    <div class="tog-title">
      <span class="title">数据统计分析面板</span>
      <span :class="['tog-tip',diagram_show?'right':'left']" @click="toggleDiagramShow()">
        <span><i class="icon iconfont icon-right"></i></span>
      </span>
    </div>
    <div class="inner">
      <WorkFlowPanel :title="diagramTitle"/>
      <WorkFlowTab :title="tableTitle" :tableTip="tableTip"/>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import env from '../../../common/env'
  import MYCONF from '../../../myconf'
  import eventBus from '../../../util/event-bus'
  import CountTag from '../../bottom/subDiagram/CounTag'
  import WorkFlowPanel from './subDiagram/WorkFlowPanel'
  import WorkFlowTab from './subDiagram/WorkFlowTab'

  export default {
    name: "FlowLastTable",
    data() {
      return {
        diagram_show: true,
        diagramTitle: "交通影响特征分析(按影响量排序)",
        tableTitle: "数据详情",
        tableTip: "排序跟随分析图设置，仅显示前30条数据",
        styleObject: {
        }
      }
    },
    components: {
      CountTag,
      WorkFlowPanel,
      WorkFlowTab
    },
    computed: {
      ...mapGetters(['display_time']),
    },
    mounted(){
    },
    methods: {
      ...mapMutations([]),
      toggleDiagramShow() {
        this.diagram_show = !this.diagram_show;
        setTimeout(() => {
          env.map.resize();
        }, 250);
      },
    },
    watch: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common";

  #diagram {
    background-color: #f1f1f1;
    & > div {
      width: 100%;
    }
    &.open {
      height: 24em;
      transition: all ease-in-out 0.2s;
    }
    &.close {
      height: 2em;
      transition: all ease-in-out 0.2s;
    }
    .tog-title {
      height: 2em;
      line-height: 2em;
      background-color: #000;
      text-align: center;
      color: #fff;
      position: relative;
      .title {
        letter-spacing: 1px;
      }
      .tog-tip {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 200;
        width: 2.2em;
        height: 2em;
        line-height: 2.4em;
        background-color: $bg-red;
        cursor: pointer;
        span {
          display: flex;
          width: 1.2em;
          height: 1.2em;
          margin-left: 0.6em;
          margin-top: 0.4em;
          transform: rotate(90deg);
          transition: all ease-in-out 0.2s;
        }
        .icon-right {
          color: #fff;
          line-height: 1.5rem;
        }
        &.left {
          span {
            transform: rotate(270deg);
            transition: all ease-in-out 0.2s;
          }
        }
      }
    }
    .inner {
      height: 22em;
      padding: 0.8em;
      background-color: #666;
      display: flex;
    }
  }

</style>
