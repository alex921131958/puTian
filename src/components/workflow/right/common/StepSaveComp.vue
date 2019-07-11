<template>
  <div class="panel fixSty flow-save">
    <div :class="{disabled:disabled}">
      <span @click="stepSave()" class="save" v-if="cur_step!==7 && (workflowType==='edit'||workflowType==='new')">(保存)下一步</span>
      <span @click="stepCancel" class="cancel" v-if="cur_step!==1 && (workflowType==='edit'||workflowType==='new')">(放弃)上一步</span>
      <span @click="compareConfirm" class="save" v-if="workflowType==='case'">应用</span>
      <span @click="exitFlow" class="exit">退出工作流</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import env from '../../../../common/env'
  import StepPanelHandler from '../../../../service/workflow/stepSaveHandler'

  export default {
    name: 'StepSaveComp',
    data() {
      return {
        curBtn: 'use',
        beforeLayer: MYCONF.map.topBgLayer,
        workflowType: '',
      }
    },
    props: {
      fixSty: {
        type: String
      },
      disabled: {
        type: Boolean
      },
    },
    computed: {
      ...mapGetters(['menu_list', 'cur_step','pre_menu','cur_menu','compareShowType','speedProject','flowProject','saturationProject',
      'serviceProject','comparePlan1_id','comparePlan2_id','flowCompareHigher','flowCompareLower','flowCompareWidth','flowCompareCoefficient',
      'flowAssignColor','flowCompareBackgroundColor','flowEqualColor','flowMorethanColor','flowLessthanColor','isPlan1_isRun',
      'compareLabelShow']),

    },
    mounted() {
      this.controller = new StepPanelHandler(this);
      this.workflowType = sessionStorage.getItem("workflowType")
    },
    methods: {
      ...mapMutations(['updateCurStep','updateCurRoute','updateCurMenu','updateCurProId','updateAttributePanel',
      'updateLayerLegendType']),
      stepSave() {
        let curStep = parseInt(this.cur_step);
        //TODO:后面改成6，目前测试交通分配结果
        this.$emit("stepSave",this.cur_step);
        if(curStep < 7){
          this.updateCurStep(curStep+1);
        }
      },
      stepCancel() {
        let curStep = parseInt(this.cur_step);
        if(curStep > 1){
          this.updateCurStep(curStep-1);
        }
      },
      exitFlow() {
        this.updateCurMenu(this.pre_menu);
        this.updateCurRoute('workbench');
        this.updateCurProId(null);
        this.updateAttributePanel(null);
        this.updateCurStep(0);
        this.$router.push({path: '/workbench'});
        env.edit.dispose();    //销毁地图编辑器(画面)
      },
      compareConfirm(){
        if(this.isPlan1_isRun){
          //点击应用时交通影响比较更新
          eventBus.$emit('comparePlanIdSuccess');
          //点击应用时触发数据分析面板
          eventBus.$emit('compareMidPanel');
          this.controller.stateJudge(this.compareShowType)
        }else{
          eventBus.$emit('reRunProject')
        }
      }
    },
    watch: {},
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";

  .panel {
    /*width: 34.5em;*/
    height: 4.2em;
    /*position: absolute;*/
    /*right: 0;*/
    bottom: 0;
    background-color: #4A4A4A;
    &.fixSty {
      position: fixed;
    }
    & > div {
      /*width: 30em;*/
      /*margin-left: 2.8em;*/
      display: flex;
      justify-content: space-between;
      &.disabled {
        span {
          color: #000;
          &:hover, &.active {
            background-color: #adadad;
            cursor: not-allowed;
            color: #000;
          }
        }
      }
      span {
        text-align: center;
        letter-spacing: 1px;
        padding: 0 0.5em;
        flex: 1;
        height: 2.5em;
        line-height: 2.5em;
        margin-right: 0.5rem;
        margin-top: 1em;
        color: #000;
        cursor: pointer;
        transition: all linear 0.3s;
        &.save {
          background-color: $highlight;
          color: #333;
          transition: all linear 0.3s;
        }
        &.cancel {
          background-color: #adadad;
          color: #333;
          transition: all linear 0.3s;
        }
        &.exit {
          background-color: $bg-red;
          color: #fff;
          transition: all linear 0.3s;
        }
      }
    }
  }
</style>
