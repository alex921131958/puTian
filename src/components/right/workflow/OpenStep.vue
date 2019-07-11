<template>
  <div id="panel">
    <div class="inner">
      <p class="panel-title">打开/编辑既有交评</p>
      <div class="ctl-box">
        <SubTitle :title="title_1"/>
        <CaseList :caseList="caseList" type="edit"/>
      </div>
    </div>
    <PanelStepComp proType="edit"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import env from '../../../common/env'
  import PanelStepComp from './common/PanelStepComp'
  import SubTitle from './common/SubTitle'
  import SelCaseType from './subComp/SelCaseType'
  import CaseList from './common/CaseList'
  import eventBus from '../../../util/event-bus'
  export default {
    name: "OpenStep",
    data() {
      return {
        title_1:"选择交评",
        caseList:[{
          name:"",
          id:"21548",
          time:"2018-09-26 16:35:22",
          type:"用地交评",
          landNum:null,   //用地开发地块
          landArea:5.4,   //用地面积
          newRoad:null,  //新改建道路
          roadLen:null,  //总里程
        }]
      }
    },
    components: {
      PanelStepComp,
      SelCaseType,
      SubTitle,
      CaseList
    },

    mounted(){
      this.getProjectList();
    },
    computed: {
      ...mapGetters(['cur_menu']),
    },
    methods: {
      ...mapMutations(['updateCurMenu','updateCurProId','updateCurProject','updateProCount']),
      getProjectList(){
        let _this = this;
        let url = MYCONF.service.findProject + `token=${sessionStorage.getItem("token")}&limit=3`;
        this.$http.get(url).then((res) => {
          res = res.body;
          let list = res.result;
          _this.caseList = res.result;
          //取消默认交评选中项
          // if(list.length > 0){
          //   _this.updateCurProId(res.result[0].id);
          //   _this.updateCurProject(res.result[0]);
          // }
          _this.updateProCount(res.result.length);
        });
      }
    },
    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common";

  #panel {
    height: calc(100vh - 8em);
    .inner{
      padding: 1em 1.5em;
      /*margin-bottom: 5em;*/
      .ctl-box{
        position: relative;
        .ctl-mask{
          position: absolute;
          top: 0;
          left: 0;
          z-index: 500;
          width: 100%;
          height: 100%;
          background: rgba(36, 36, 35,0.5);
        }
      }
    }
    p{
      text-align: left;
      &.panel-title{
        font-size: 1.3rem;
        line-height: 2em;
      }
      &.tab-p{
        line-height: 2em;
        margin: 0.4em 0 1.5em 1.8em;
        span{
          opacity: 0.6;
          font-size: $font-bigger;
          font-weight: bold;
          display: inline-block;
          padding: 3px;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          &:hover,&.active{
            opacity: 1;
            border-color: $bg-red;
          }
        }
      }
    }
  }

</style>
