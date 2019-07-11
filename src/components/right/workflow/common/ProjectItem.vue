<template>
  <div class="panel fixSty">
    <div>
      <span @click="confirmWorkFlow('new')" :class="{active:curBtn==='use'}">确 定</span>
      <span @click="exitWorkFlow()" :class="{active:curBtn==='clear'}">退出工作流</span>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import env from '../../../../common/env'

  export default {
    name: 'ProjectItem',
    data() {
      return {
        curBtn: 'use',
        beforeLayer:MYCONF.map.topBgLayer,
      }
    },
    props: {
      fixSty: {
        type: String
      },
    },
    computed: {
      ...mapGetters(['menu_list','cur_menu']),

    },
    mounted() {
    },
    methods: {
      ...mapMutations(['updateCurMenu','updateMenuList']),
      confirmWorkFlow(type){

      },
      exitWorkFlow(){

      }
    },
    watch: {
    },
    beforeDestroy() {
      eventBus.$off("getPanelParam");
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";

  .panel {
    width: 34.5em;
    height: 4.2em;
    /*position: absolute;*/
    /*right: 0;*/
    bottom: 0;
    background-color: #707070;
    &.fixSty {
      position: fixed;
    }
    & > div {
      width: 29em;
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
