<template>
  <div id="panel">
    <div class="inner">
      <p class="panel-title">新建交评项目</p>
      <div class="ctl-box">
        <SubTitle :title="title_1" :tip="tip_1"/>
        <SelCaseType :curType="curTypeId" @setCurProType="setCurProType"/>
        <SubTitle :title="title_2" :tip="tip_2"/>
        <CaseList :caseList="caseList" type="new"/>
      </div>
    </div>
    <PanelStepComp proType="new"/>
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
    name: "NewStep",
    data() {
      return {
        title_1:"选择交通影响评价类型",
        tip_1:"新建后不可更改，目前只支持综合交评",//建议选择综合交评
        title_2:"替换以下交评并新建",
        tip_2:"将删除原有交评项目，不可撤销",
        caseList:[],
        curTypeId:"1539844499318",    //当前交评类型
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
      ...mapMutations(['updateCurMenu','updateProCount']),
      setCurProType(data){
        this.curTypeId = data;
      },
      getProjectList(){
        let _this = this;
        let url = MYCONF.service.findProject + `token=${sessionStorage.getItem("token")}&limit=3`;
        this.$http.get(url).then((res) => {
          res = res.body;
          _this.caseList = res.result;
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
