<template>
  <div class="panel fixSty">
    <div :class="{disabled:disabled}">
      <span @click="stepSave()" class="save">保存</span>
      <span @click="stepCancel()" class="cancel" v-if="cur_step!==1">取消</span>
      <span @click="stepDelete()" class="clear" v-if="attributePanel!=='outin'"><i class="icon iconfont icon-clear"></i></span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import env from '../../../../common/env'
  import FlowTableHandler from '../../../../service/common/flowTableHandler'

  export default {
    name: 'AttrSaveComp',
    data() {
      return {
        curBtn: 'use',
        beforeLayer: MYCONF.map.topBgLayer,
        linesData: [],
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
      ...mapGetters(['menu_list', 'cur_step','pre_menu','lineOnClick','linkOnClick','lineInfo','attributePanel']),

    },
    mounted() {
      this.controller = new FlowTableHandler(this);
    },
    methods: {
      ...mapMutations(['updateCurStep','updateCurRoute','updateAttributePanel']),
      stepSave() {
        if(this.cur_step===4){
          this.$emit("landAttrSave");
          // this.updateAttributePanel(null);  //统一此处，由于用地总和100%判断，移至用地保存操作处
        }else if(this.cur_step===2){
          this.$emit("linkAttrSave");
          this.updateAttributePanel(null);
        }else if (this.cur_step===5) {
          this.$emit('landOutInSave')
        }
      },
      stepCancel() {
        if(this.cur_step===4){
          this.$emit("landAttrCancel");
        }else if(this.cur_step===2){
          this.$emit("linkAttrCancel");
        }else if (this.cur_step===5) {
          this.$emit("landOutInCancel");
        }
        this.updateAttributePanel(null);
      },
      stepDelete(){
        this.$Modal.confirm({
          title: '确认提醒',
          content: '<p>是否确认删除？</p>',
          okText: '确定',
          cancelText: '取消',
          closable:true,
          onOk:() => {
            if(this.cur_step===4){
              this.$emit("landAttrDelete");
            }else if(this.cur_step===2){
              this.$emit("lineAttrDelete");
              eventBus.$emit('deleteLine')
            }else if (this.cur_step===5){
              this.$emit("landOutInDelete");
            }
            this.updateAttributePanel(null);
          }
        });
      },
      exitFlow() {
        this.updateCurMenu(this.pre_menu);
        this.updateCurRoute('workbench');
        this.$router.push({path: '/workbench'});
      },
    },
    watch: {},
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";

  .panel {
    width: 18em;
    height: 4rem;
    left: 0;
    bottom: 0;
    background-color: #231F00;
    &.fixSty {
      position: fixed;
    }
    & > div {
      width: 16.8em;
      margin-left: 1.2em;
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
        height: 2.2em;
        line-height: 2.4rem;
        margin-right: 0.5rem;
        margin-top:0.9rem;
        color: #666;
        cursor: pointer;
        transition: all linear 0.3s;
        &.save {
          flex: 1;
          background-color: $highlight;
          transition: all linear 0.3s;
        }
        &.cancel {
          flex: 1;
          background-color: #cccccc;
          transition: all linear 0.3s;
        }
        &.clear {
          width: 2.4rem;
          margin-right: 1.2rem;
          background-color: $bg-red;
          color: #fff;
          transition: all linear 0.3s;
        }
      }
    }
  }
</style>
