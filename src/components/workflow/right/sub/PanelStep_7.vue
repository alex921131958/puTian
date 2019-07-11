<template>
  <div id="panel">
    <div class="inner">
      <StepTitle title="交评简报生成" :step="step"/>
      <SubTitle title="交评报告检查"/>
      <ul>
        <li v-for="item in checkList" :class="item.state?'success':'warn'">
          <i :class="['icon iconfont',item.state?'icon-ok':'icon-warn']"></i>
          <span>{{item.name}}</span>
        </li>
        <li class="success">
          <i class="icon iconfont icon-ok"></i>
          <span>已选{{stepSixTimeTag}}</span>
        </li>
      </ul>

      <span class="single-btn" @click="setBriefing">交评简报生成</span>
    </div>
    <StepSaveComp/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import StepTitle from '../common/StepTitle'
  import SubTitle from '../common/SubTitle'
  import StepSaveComp from '../common/StepSaveComp'
  import MYCONF from '../../../../myconf'
  import StepPanelHandler_7 from '../../../../service/workflow/stepPanelHandler_7'
  import eventBus from '../../../../util/event-bus'

  export default {
    name: "PanelStep_1",
    data() {
      return {
        step: 7,
        landCenter:[],
        roadCenter:[],
        imgIndex:0,
        imgTimer:null,
        restList:[],
        checkList:[
          {
            name:"用地规划与交通分布预测",
            state:true,
          },{
            name:"出入口设置",
            state:true,
          // },{
          //   name:"道路规划",
          //   state:true,
          },{
            name:"道路流量、速度、饱和度、服务水平出图设置(STEP 5)",
            state:false,
          },{
            name:"交通分布预测出图设置(STEP 3)",
            state:false,
          },
          // {
          //   name:"高峰小时选区",
          //   state:true,
          // }
        ],
      }
    },
    mounted() {
      this.controller = new StepPanelHandler_7(this);
      this.controller.teReportCheck();
      this.controller.addEntryLayer();
      this.controller.getEditedRoads();
      this.controller.addRoadLineLayer();
    },
    computed: {
      ...mapGetters(['panel_show','cur_pro_id','global_loading','lineNewColor','lineChangeColor','stepSixTimeTag','cur_project']),
    },
    components: {
      StepTitle,
      SubTitle,
      StepSaveComp,
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateGlobalLoading','updateGlobalMask','updateReportLoading']),
      setBriefing(){
        let isChecked = this.checkList.find(function(value, index) {
          return value.name !='出入口设置' && value.state == false;
        });
        if(!isChecked){
          this.controller.getStep7Image();
        }else{
          this.$Message.warning({
            content: '请先处理以上标红交评报告检查项',
            duration:5,
            closable: true
          });
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  #panel {
    height: calc(100vh - 8em);
    text-align: left;
    .inner {
      padding: 1em 1.5em;
      ul{
        margin: 1em 0;
        li{
          text-indent: 2em;
          line-height: 2.6;
          &.success{
            color: $success;
          }
          &.warn{
            color: $warn;
          }
          .iconfont{
            margin-right: 0.3em;
          }
        }
      }
      .single-btn{
        display: block;
        background-color: $success;
        color: #494C29;
        text-align: center;
        margin-left: 2em;
        height: 2.3rem;
        line-height: 2.5rem;
        cursor: pointer;
        &:hover{
          background-color: #d3e143;
        }
      }
    }
  }

</style>
