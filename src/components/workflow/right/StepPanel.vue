<template>
  <transition name="move">
    <div id="right" class="box" v-show="panel_show">
      <transition name="fade">
        <EasyScrollbar :barOption="listBar">
          <PanelStep_1 v-if="cur_step===1 && (workflowType==='new' || workflowType==='edit')"/>
          <PanelStep_2 v-if="cur_step===2 && (workflowType==='new' || workflowType==='edit')"/>
          <PanelStep_3 v-if="cur_step===3 && (workflowType==='new' || workflowType==='edit')"/>
          <PanelStep_4 v-if="cur_step===4 && (workflowType==='new' || workflowType==='edit')"/>
          <PanelStep_5 v-if="cur_step===5 && (workflowType==='new' || workflowType==='edit')"/>
          <PanelStep_6 v-if="cur_step===6 && (workflowType==='new' || workflowType==='edit')"/>
          <PanelStep_7 v-if="cur_step===7 && (workflowType==='new' || workflowType==='edit')"/>

          <ComparePanel v-if="workflowType==='case'"></ComparePanel>
          <!--<ComparePanel></ComparePanel>-->
        </EasyScrollbar>
      </transition>
    </div>
  </transition>
</template>

<script>
  import MYCONF from '../../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import env from '../../../common/env'
  import PanelStep_1 from './sub/PanelStep_1'
  import PanelStep_2 from './sub/PanelStep_2'
  import PanelStep_3 from './sub/PanelStep_3'
  import PanelStep_4 from './sub/PanelStep_4'
  import PanelStep_5 from './sub/PanelStep_5'
  import PanelStep_6 from './sub/PanelStep_6'
  import PanelStep_7 from './sub/PanelStep_7'
  import ComparePanel from './sub/ComparePanel'
    export default {
        name: 'StepPanel',
        data() {
            return {
              listBar: {
                barColor: "#707070",   //滚动条颜色
                barWidth: 4,           //滚动条宽度
                railColor: "transparent",     //导轨颜色
                barMarginRight: 1,     //垂直滚动条距离整个容器右侧距离单位（px）
                barMaginBottom: 0,     //水平滚动条距离底部距离单位（px)
                barOpacityMin: 0.6,      //滚动条非激活状态下的透明度
                zIndex: "auto",        //滚动条z-Index
                autohidemode: true,     //自动隐藏模式
                horizrailenabled: false,//是否显示水平滚动条
              },
            }
        },
      props:{
        workflowType:{
          type: String
        },
      },
        mounted() {

        },
      computed: {
        ...mapGetters(['panel_show','cur_step','landList','cur_menu','cur_route']),
      },
      components:{
        PanelStep_1,
        PanelStep_2,
        PanelStep_3,
        PanelStep_4,
        PanelStep_5,
        PanelStep_6,
        PanelStep_7,
        ComparePanel
      },
      methods: {
        ...mapMutations(['updatePanelSow','updateAttributePanel','updateCurLandId','updateLandEditable','updateLinkEditable','updateGlobalLoading','updateCurEditPool'])
      },
      watch:{
        cur_step(val,oldVal){
          this.updateAttributePanel(null);
          this.updateCurLandId(null);
          this.updateCurEditPool(null);
          this.updateLandEditable(false);
          this.updateLinkEditable(false);
          this.updateGlobalLoading(false);
          if(val !== 4 && this.cur_route=='workflow'){
            if (env.echartLayer) {
              env.echartLayer.remove();
              env.echartLayer = null;
            }
            if(env.edit) env.edit.onBtnCtrlActive('static');  //删除测量路径
            if(env.edit) env.edit.draw.delete(this.landList);  //删除测量路径
          }
          if(val){
            let layerList = ['landLayer-point','polygonLayer','landCenterLayer','landLine','lineLayer','polygonLayer-highlight','entryLine','entryLayerAll','roadLineLayerAll','entryLineAll','entryPointAll','roadLinePaint','landNameAll','roadLineLayerLable'];
            layerList.map((layer) => {
              if(env.map.getLayer(layer)) env.map.removeLayer(layer);
            })
          }
          if(val === 7){
            let layerList = ['factor-layer','factor-layer-symbol','step-traffic-5','step-traffic-5-symbol','step-flow-5','step-flow-5-symbol','traceability','traceability-symbol','backTraceability','backTraceability-symbol'];  //step6渲染隐藏
            layerList.map((layer) => {
              if(env.map.getLayer(layer)) env.map.removeLayer(layer);
            })
          }
          if(oldVal === 4 && env.edit.draw){
            let landIds = env.edit.draw.getSelectedIds();
            if(landIds && landIds.length > 0) env.edit.removeFeatures(landIds);
          }
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../common/common.scss";
  @media(max-width: 1399px) {
    #right{
      flex: 0 0 $panel-small;
    }
  }
  @media (min-width:1400px) and (max-width:1599px){
    #right{
      flex: 0 0 $panel-middle;
    }
  }
  @media (min-width:1600px) and (max-width:1919px){
    #right{
      flex: 0 0 $panel-width;
    }
  }

  @media (min-width:1920px){
    #right{
      flex: 0 0 $panel-large;
    }
  }
  #right {
    /*flex: 0 0 34.5em;*/
    background-color: #000;
    /*filter: blur(2px);*/
    position: relative;
    color: #fff;
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
      opacity: 0;
    }

    .box .move-enter-active, .box .move-leave-active {
      transition: all 0.5s linear;
      transform: translate3d(0, 0, 0);
    }
    .box .move-enter, .box .move-leave {
      transform: translate3d(-100%, 0, 0);
    }
  }
</style>
