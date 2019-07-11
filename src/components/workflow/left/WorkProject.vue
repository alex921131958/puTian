<template>
  <div id="left">
    <EditTitle :caseTitle="caseTitle" @changeTitle="changeTitle"/>
    <p>
      <span>用地开发地块:</span>
      <span class="highlight">{{formatInt(cur_project.landnum)}}个</span>
      <span class="highlight">{{formatFun(cur_project.landarea)}} 平方公里</span>
    </p>
    <p>
      <span>新改建道路:</span>
      <span class="highlight">{{formatInt(cur_project.roadnum)}}条</span>
      <span class="highlight">{{formatFun(cur_project.roadlength)}} 公里</span>
    </p>
    <ul class="step-list">
      <StepItem v-for="(step,index) in stepList" :stepContent="step" @updateStepList="updateStepList(step)" :key="index"/>
    </ul>
  </div>
</template>

<script>
  import MYCONF from '../../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import EditTitle from './sub/EditTitle'
  import StepItem from './sub/StepItem'
  import WorkProjectHandler from '../../../service/workflow/workProjectHandler'
  import eventBus from '../../../util/event-bus'

  export default {
    name: "WorkProject",
    data() {
      return {
        caseTitle: null,
        stepList: [{
          id: 1,
          name: '交评时间与预设',
          content: false
        }, {
          id: 2,
          name: '道路规划',
          content: true
        }, {
          id: 3,
          name: '规划道路交通分布预测',
          content: true
        }, {
          id: 4,
          name: '用地规划与交通分布预测',
          content: true
        }, {
          id: 5,
          name: '地块出入口设定',
          content: true
        }, {
          id: 6,
          name: '交通影响预测',
          content: true
        }, {
          id: 7,
          name: '交评简报生成',
          content: false
        }
        ],
      }
    },
    mounted() {
      this.controller = new WorkProjectHandler(this);
      let _this = this;
      this.$nextTick(() => {
        this.controller.getProjectInfo();
        setTimeout(() => {
          _this.caseTitle = _this.cur_project.name?_this.cur_project.name:'未命名';
        },150)
      });
      eventBus.$on("updateLandInfo",(name,num,area) => {
        this.updateCurProject({
          landnum:num,
          landarea:area?(area/1000000).toFixed(2):0,
          name:name,
        });
        this.caseTitle = name;
      });
      eventBus.$on("saveLinkItem",() => {
        _this.controller.getProjectInfo();
      });
      // eventBus.$on("deleteUpdateLand",() => {
      //   console.log("deleteUpdateLand---删除地块");
      //   _this.controller.getProjectInfo();
      // });
    },
    computed: {
      ...mapGetters(['cur_project','cur_pro_id','isFlowRemakeShow','isBackgroundFlowShow','isLandPlanShow']),
    },
    components: {
      EditTitle,
      StepItem,
    },
    methods: {
      ...mapMutations(['updateCurStep','updateCurProject']),
      changeTitle(data) {
        this.caseTitle = data;
        this.updateCurProject({
          name:data
        });
        this.controller.saveProjectFun(data);
      },
      updateStepList(data){
        this.$set(data, 'content', !data.content);
        this.controller.changeDisplay(data);
      },
      formatFun(type){
        return type?parseFloat(type).toFixed(2):0;
      },
      formatInt(type){
        return type?parseInt(type):0;
      }
    },
    watch: {},
    beforeDestroy() {
      eventBus.$off("updateLandInfo");
      eventBus.$off("saveLinkItem");
      // eventBus.$off("deleteUpdateLand");
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common";

  #left {
    flex: 0 0 18em;
    background-color: $panel-black;
    color: #fff;
    overflow-x: hidden;
    text-align: left;
    & > p{
      line-height: 2rem;
      & > span{
        margin-left: 0.4rem;
        &.highlight{
          color: $highlight;
        }
      }
    }
    .step-list{
      margin-top: 0.6em;
    }
  }
  @media(max-width: 1399px){
    #left {
      flex: 0 0 17.5em;
    }
  }
</style>
