<template>
  <div class="panel fixSty flow-save">
    <div>
      <span @click="confirmWorkFlow()" :class="{active:curBtn==='use'}">确 定</span>
      <span @click="exitWorkFlow()" :class="{active:curBtn==='clear'}">退出工作流</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import env from '../../../../common/env'
  import ProjectSaveHandler from '../../../../service/workflow/projectSaveHandler'

  export default {
    name: 'PanelStepComp',
    data() {
      return {
        curBtn: 'use',
        beforeLayer:MYCONF.map.topBgLayer,
        isModalShow:false,   //提醒框是否显示
      }
    },
    props: {
      fixSty: {
        type: String
      },
      proType:{
        type: String
      }
    },
    computed: {
      ...mapGetters(['cur_project','pre_menu','cur_pro_type','cur_pro_id','pro_count','loading_tip']),

    },
    mounted() {
      this.controller = new ProjectSaveHandler(this);
      eventBus.$on("confirmCase",() => {
        this.confirmWorkFlow();
      })
    },
    methods: {
      ...mapMutations(['updateCurMenu','updateCurStep','updateCurRoute','updateCurProject','updateCurProId','updateCurProType','updateLoadingTip']),
      confirmWorkFlow(){
        let editType = this.proType==='edit'?'update':this.cur_pro_id&&this.pro_count>0?'replace':'add';
        if(editType === 'replace'){
          this.$Modal.confirm({
            title: '确认提醒',
            content: '<p>替换交评，<br/>将删除当前交评项目下<span class="bold">所有设置内容<span/>，<span class="bold">且不可恢复！<span/></p>' +
            '<p>是否确认替换？</p>',
            okText: '替换',
            cancelText: '取消',
            closable:true,
            onOk:() => {
              this.controller.saveProjectFun(editType);
            }
          });
        }else if(editType === 'add' && this.pro_count===3){
          this.$Modal.warning({
            title: '确认提醒',
            content: '<p>当前只保存<span class="bold">3个交评项目</span>，若要新建，</p>' +
            '<p>请选择一个进行替换？</p>',
            closable:true
          });
        }else{
          this.controller.saveProjectFun(editType);
        }
      },
      exitWorkFlow(){
        this.updateCurMenu(this.pre_menu);
        this.updateCurRoute('workbench');
        this.updateCurProId(null);
      }
    },
    watch: {
    },
    beforeDestroy() {
      eventBus.$off("getPanelParam");
      eventBus.$off("confirmCase");
    },
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
    background-color: #707070;
    &.fixSty {
      position: fixed;
    }
    & > div {
      /*width: 29em;*/
      margin-left: 3.6em;
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
        background-color: #adadad;
        flex: 1;
        height: 2.5em;
        line-height: 2.5em;
        margin-right: 10px;
        margin-top: 1em;
        color: #000;
        cursor: pointer;
        transition: all linear 0.3s;
        &:hover, &.active {
          background-color: $bg-red;
          color: #fff;
          transition: all linear 0.3s;
        }
      }
    }
  }
</style>
