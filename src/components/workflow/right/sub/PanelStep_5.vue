<template>
  <div id="panel">
    <div class="inner">
      <StepTitle title="地块出入口设置" :step="step"/>
      <SubTitle title="地块出入口设置汇总"/>

      <LandOutInTotal :landCount="landCount" :entryCount="entryCount" :landEntry="landEntry"/>
      <div class="tip-panel">
        <i class="icon iconfont icon-warn"></i>
        <p>从属性列表中点击各地块按钮开始编辑该地块出入口</p>
      </div>
      <SubTitle title="出入口显示设置"/>
      <LandOutInView @iconSizeChange="iconSizeChange"/>
      <SubSwitch title="显示出入口编号" :isShow="isNumShow" @setSubSwitchToggle="setSubSwitchToggle"/>

    </div>
    <StepSaveComp/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import StepTitle from '../common/StepTitle'
  import SubTitle from '../common/SubTitle'
  import StepSaveComp from '../common/StepSaveComp'
  import SubSwitch from '../common/SubSwitch'
  import FLOWCONF from '../../flowConf'
  import StepPanelHandler_5 from '../../../../service/workflow/stepPanelHandler_5'
  import env from '../../../../common/env'
  import eventBus from '../../../../util/event-bus'

  import LandOutInTotal from '../step_5/LandOutInTotal'
  import LandOutInView from '../step_5/LandOutInView'

  export default {
    name: "PanelStep_5",
    data() {
      return {
        step: 5,
        landEntry: 0,
        landCount: 0,
        entryCount: 0,
        isNumShow: true,
        landCenter:[],
        roadCenter:[],
        imgIndex:0,
        restList:[],
      }
    },
    mounted() {
      this.controller = new StepPanelHandler_5(this);

      this.controller.getEntryInfo();
      this.controller.getEditedRoads();
      this.controller.addRoadLineLayer();
      //step2post修改后的信息成功后触发
      eventBus.$on("saveEntryItem", () => {
        this.controller.getEntryInfo();
      });
      eventBus.$on("deleteLandEntry",() => {
        this.controller.getEntryInfo();
      });
    },
    computed: {
      ...mapGetters(['panel_show','cur_pro_id']),
    },
    components: {
      StepTitle,
      SubTitle,
      StepSaveComp,
      SubSwitch,
      LandOutInTotal,
      LandOutInView
    },
    methods: {
      ...mapMutations(['updatePanelSow']),
      setSubSwitchToggle(){
        this.isNumShow = !this.isNumShow;
        this.controller.setEntryNumShow(this.isNumShow );
      },
      iconSizeChange(count){
        this.controller.setIconSize(count);
      }
    },
    beforeDestroy() {
      eventBus.$off("saveEntryItem");
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  #panel {
    height: calc(100vh - 8em);
    text-align: left;
    .inner {
      padding: 1em 1.5em;
      .list{
        line-height: 1.8em;
        margin-top: 1.5rem;
        &.single{
          .bold{
            font-weight: 600;
            font-size: 1.1em;
          }
        }
      }
      .tip-panel{
        /*background-color: #d7d7d7;*/
        background-color: rgba(251,230,68,.2);
        padding: 0.6em 0.5em;
        text-align: left;
        color: $highlight;
        font-size: 0.95em;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        margin-left: 2.2em;
        .icon{
          float: left;
          /*color:#333;*/
          margin-top: -0.2em;
        }
        p{
          margin: 0 0 0 1.8em;
          line-height: 1.5em;
          /*color:#333;*/
        }
      }
    }
  }

</style>
