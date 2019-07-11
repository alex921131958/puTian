<template>
  <div id="left">
    <EasyScrollbar :barOption="listBar">
      <div class="listBox">
        <p class="edit-title"><i class="icon iconfont icon-edit-panel"></i>编辑面板</p>
        <LinkBaseAttr :linkObj="linkObj" @setCurLinkName="setCurLinkName" @setCurLinkType="setCurLinkType" @setCurLinkLevel="setCurLinkLevel"/>
        <LinkTrafficAttr :trafficInfo="trafficInfo" @linkInfo="linkInfo"/>
      </div>
    </EasyScrollbar>
    <AttrSaveComp @linkAttrSave="linkAttrSave" @linkAttrCancel="linkAttrCancel" @lineAttrDelete="lineAttrDelete"/>
  </div>
</template>

<script>
  import MYCONF from '../../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import FLOWCONF from '../flowConf'
  import AttrSaveComp from './sub/AttrSaveComp'
  import LinkBaseAttr from './sub/LinkBaseAttr'
  import LinkTrafficAttr from './sub/LinkTrafficAttr'
  import eventBus from '../../../util/event-bus'
  import lineAttrHandler from '../../../service/workflow/lineAttrHandler'

  export default {
    name: "LandAttribute",
    data() {
      return {
        listBar: FLOWCONF.EASY_SCROLL_BAR,
        linkObj: FLOWCONF.LINK_ATTRIBUTE,
        trafficInfo:JSON.parse(JSON.stringify(FLOWCONF.LINK_TRAFFIC_INFO)),
      }
    },
    mounted() {
      let _this = this;
      this.controller = new lineAttrHandler(this);
      //下面面板处重新编辑道路
      eventBus.$on('toLocationRoadInfo',function (data) {
        _this.updateLineOnClick(data[0]);
        _this.updateLinkOnClick(data[1]);
      })
    },

    computed: {
      ...mapGetters(['lineOnClick','linkOnClick','lineInfo','cur_pro_id','curLinePool','curJudgeState']),
    },
    components: {
      AttrSaveComp,
      LinkBaseAttr,
      LinkTrafficAttr,
    },
    methods: {
      ...mapMutations(['updateLineOnClick','updateLinkOnClick','updateCurLinePool','updateCurJudgeState','updateCurHighlightRoadId','updateLinkEditable']),
      setCurLinkName(data){
        this.$set(this.linkObj,'name',data);
        this.updateLineOnClick({name: this.linkObj['name']});
      },
      setCurLinkType(data){
        this.$set(this.linkObj,'linkType',data);
        this.updateLineOnClick({linkType: this.linkObj['linkType']});
      },
      setCurLinkLevel(data){
        this.$set(this.linkObj,'linkLevel',data);
        this.updateLineOnClick({linkLevel: this.linkObj['linkLevel']});
      },
      linkInfo(data){
        this.$set(this.trafficInfo,data);
        this.updateLinkOnClick(data);
      },

      //保存道路信息
      linkAttrSave(){
        eventBus.$emit('saveAttributes',[this.lineOnClick, this.linkOnClick, this.cur_pro_id, this.curLinePool]);
        //保存 取消 删除都应该删除pool中的数据
        this.updateLinkEditable(false);
        this.updateCurLinePool(null);
        this.updateCurJudgeState(null);
      },
      //取消功能
      linkAttrCancel(){
        //false时更改step2 panel文字描述
        this.updateLinkEditable(false);
        this.updateCurHighlightRoadId(null);
        if(this.curLinePool){
          if (this.curLinePool.options.road_id) {     //如果是从库里加载的线 不做任何操作 直接取消  TODO 记录点击的时候状态 修改后取消时返回这个状态
            this.controller.deleteRoadFromMap(this.curLinePool);
            eventBus.$emit('cancelChange')
          }else {   //创建的新线就直接从地图上删除
            this.controller.deleteRoadFromMap(this.curLinePool)
          }
        }else {
          this.updateCurLinePool(null);
          this.updateCurJudgeState(null);
        }
        //删除修改后的
        //重新添加修改前的
      },
      //删除道路信息(map和service)
      lineAttrDelete(){
        this.controller.deleteRoadFromMap(this.lineInfo);
        if(this.lineInfo.options.road_id){
          this.controller.deleteRoadFromServies(this.lineInfo.options.road_id, this.cur_pro_id);
        }else {

        }
        this.updateCurLinePool(null);
        this.updateCurJudgeState(null);
      }
    },
    watch: {
      lineOnClick(newVal){
        this.linkObj = newVal
      },
      linkOnClick(newVal){
        this.trafficInfo = newVal
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common";

  #left {
    flex: 0 0 18em;
    background-color: $panel-black;
    color: #fff;
    overflow-x: hidden;
    text-align: left;
    .listBox {
      height: calc(100vh - 7.2em);
      width: 18em;
      background-color: $bg-attr;
    }
    .edit-title{
      height: 2.6rem;
      line-height: 2.7rem;
      background-color: $bg-op;
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 1em;
      & > .icon{
        font-size: 0.8em;
        margin-right: 0.6rem;
        position: relative;
        top: -0.1rem;
      }
    }
    .list{
      line-height: 3rem;
      background-color: #322c00;
      .btn{
        color: #666;
        display: inline-block;
        width: 16.8rem;
        margin-left: 0.8rem;
        margin-bottom: 1.5rem;
        text-align: center;
        height: 2.3rem;
        line-height: 2.5rem;
        background-color: $highlight;
        cursor: pointer;
      }
    }
  }
  @media(max-width: 1399px){
    #left {
      flex: 0 0 17.5em;
    }
  }
</style>
