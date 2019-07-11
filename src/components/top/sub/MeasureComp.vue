<template>
  <div id="box" :class="cur_route==='workflow'&&parseInt(cur_step)!=2&&parseInt(cur_step)!=4 || cur_route==='workbench'?'active':'disabled'">
    <p class="list">
      <span class="btn" @click="changeActiveTool('line')"><i class="icon iconfont icon-ruler"></i>测量距离</span>
      <span class="btn" @click="changeActiveTool('polygon')"><i class="icon iconfont icon-area"></i>测量面积</span>
    </p>
    <p class="list">
      <span class="clear" @click="clearDraw"><i class="icon iconfont icon-clear"></i>删除所有测量图形</span>
    </p>
    <div class="tip-panel">
      <i class="icon iconfont icon-warn"></i>
      <p>测距：单击设置节点，双击结束</p>
      <p>测面：单击设置节点，双击结束；单击选中节点，编辑面图形</p>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import eventBus from '../../../util/event-bus'
  import env from '../../../common/env'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import MeasureCompHandler from '../../../service/common/measureCompHandler'
  export default {
    name: "MeasureComp",
    data() {
      return {
      }
    },
    computed: {
      ...mapGetters(['cur_tab','active_tool','cur_route','cur_step']),
    },
    mounted(){
      this.controller = new MeasureCompHandler(this);
      this.$nextTick(() => {

      });
    },
    methods:{
      ...mapMutations(['updateCurTab','updateActiveTool']),
      changeActiveTool(type){
        let edit = env.edit;
        if (edit && type) {
          edit.onBtnCtrlActive(type);
          this.updateActiveTool(type);
        }
      },
      clearDraw(){
        let edit = env.edit;
        // edit.draw.deleteAll();
        eventBus.$emit("deleteAllMeasure");
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  #box {
    position: absolute;
    top: 4em;
    left: 0;
    width: 24em;
    height: 14em;
    background-color: #555;
    z-index: 500;
    padding: 1em 1.6em;
    .list{
      display: flex;
      justify-content:space-between;
      margin-bottom: 1em;
      .iconfont{
        margin-right: 0.2em;
      }
      span{
        height: 2.6em;
        line-height: 2.6em;
        letter-spacing: 0.1em;
        &.btn{
          width: 9.5em;
          background-color: #fff;
          color: #000;
        }
        &.clear{
          flex: 1;
          background-color: #d33027;
        }
      }
    }
    .tip-panel{
      text-align: left;
      font-size: 0.85em;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      line-height: 1.6;
      opacity: 0.9;
      .icon{
        float: left;
      }
      p{
        margin: 0 0 0 1.8em;
        &.highlight{
          color: #fbe644;
          /*margin-left: 0;*/
        }
      }
    }
    &.disabled{
      .list{
        span{
          pointer-events: none;
          cursor: not-allowed;
          &.btn{
            background-color: #adadad;
            color: #000;
          }
          &.clear{
            background-color: #d33027;
            opacity: 0.6;
          }
        }
      }
    }
  }

</style>
