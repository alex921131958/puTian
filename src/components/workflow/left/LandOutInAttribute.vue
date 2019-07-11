<template>
  <div id="left">
    <EasyScrollbar :barOption="listBar">
      <div class="listBox">
        <p class="edit-title"><i class="icon iconfont icon-edit-panel"></i>编辑面板</p>
        <LandEntry :areaObj="areaObj"/>
        <LandOutInTip/>
        <!--<p class="list highlight"><span class="btn">保存/更新出入口位置 生成编号</span></p>-->
        <LandOutInCar/>
      </div>
    </EasyScrollbar>
    <AttrSaveComp @landOutInSave="landOutInSave" @landOutInCancel="landOutInCancel" @landOutInDelete="landOutInDelete"/>
  </div>
</template>

<script>
  import MYCONF from '../../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../util/event-bus'
  import FLOWCONF from '../flowConf'
  import env from '../../../common/env'
  import AttrSaveComp from './sub/AttrSaveComp'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import LandOutInHandler from '../../../service/workflow/landOutInHandler'
  import LandEntry from './sub/LandEntry'
  import LandOutInTip from './sub/LandOutInTip'
  import LandOutInCar from './sub/LandOutInCar'

  export default {
    name: "LandOutInAttribute",
    data() {
      return {
        listBar: FLOWCONF.EASY_SCROLL_BAR,
        areaObj: JSON.parse(JSON.stringify(FLOWCONF.ENTRANCE_ATTRIBUTE)),
        /*entryList:["未设定","未设定","未设定","未设定"],
        ratioList:[0,0,0,0],*/
      }
    },
    mounted() {
      this.controller = new LandOutInHandler(this);
      eventBus.$on("updateCurEntryLand",(row) => {
        let polygonFeature = {
          id: row.id,
          type: 'Feature',
          geometry: {
            type:'Polygon',
            coordinates:[row.points]
          }
        };
        let curArea = turf.area(polygonFeature);
        this.areaObj={
          name:row.name,
          baseArea:curArea.toFixed(1),
          count:row.count,
        };
        this.controller.getEntryItemInfo(row.id);
      });
      eventBus.$on("deleteCurEntry",(val) => {
        this.$Modal.confirm({
          title: '确认提醒',
          content: `<p>是否确认删除出入口${val}？</p>`,
          okText: '确定',
          cancelText: '取消',
          closable:true,
          onOk:() => {
           this.deleteCurEntry(val);
          }
        });
      });
    },

    computed: {
      ...mapGetters(['entryArr','ratioArr','lngLatArr','linkArr','curLandId']),
    },
    components: {
      AttrSaveComp,
      LandEntry,
      LandOutInTip,
      LandOutInCar
    },
    methods: {
      ...mapMutations(['updateEntryArr','updateRatioArr','updateLngLatArr','updateLinkArr','updateAttributePanel']),
      deleteCurEntry(val){
        let landId = this.curLandId;
        let index = val-1;
        let tempEntry = this.entryArr;
        tempEntry.splice(index,1,'未设定');
        this.updateEntryArr(tempEntry);
        let tempPoint = this.lngLatArr;
        tempPoint.splice(index,1,null);
        this.updateLngLatArr(tempPoint);
        let tempRatio = this.ratioArr;
        tempRatio.splice(index,1,0);
        this.updateRatioArr(tempRatio);
        let tempLink = this.linkArr;
        tempLink.splice(index,1,null);
        this.updateLinkArr(tempLink);

        env.entryMarkers[index].remove();
        env.entryMarkers.splice(index,1,null);
        if (env.map.getLayer('entryLineAll')) env.map.setFilter('entryLineAll', ['!=', 'name', landId+val]);
      },
      landOutInSave(){
        let ratioList = this.ratioArr;
        let entryList = this.entryArr;
        let ratioSum = 0;
        entryList.map((entry,index) => {
          if(entry !=="未设定"){
            ratioSum += parseInt(ratioList[index]);
          }
        });
        if(ratioSum !== 100){
          this.$Message.warning({
            content: '各出入口比例总和应为100%，请确认',
            closable: true
          });
        }else{
          this.controller.saveLandOutIn();
          this.updateAttributePanel(null);
          if(env.map.getLayer("linkRoad")) env.map.setLayoutProperty("linkRoad", 'visibility', 'none');
          env.map.removeMarkers();
          if (env.map.getLayer('entryLayerAll')) env.map.setFilter('entryLayerAll', ['!=', 'linkid', 0]);
        }
      },
      landOutInCancel(){
        if(env.map.getLayer("linkRoad")) env.map.setLayoutProperty("linkRoad", 'visibility', 'none');
        env.map.removeMarkers();
        if (env.map.getLayer('entryLayerAll')) env.map.setFilter('entryLayerAll', ['!=', 'linkid', 0]);
      },
      landOutInDelete(){

      },
    },
    watch: {

    },
    beforeDestroy() {
      eventBus.$off("updateCurEntryLand");
      eventBus.$off("deleteCurEntry");
    }
  }
</script>

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
      /*background-color: #322c00;*/
      .btn{
        color: #666;
        display: inline-block;
        width: 16.8rem;
        margin-top: 1.5rem;
        margin-left: 1.4rem;
        text-align: center;
        height: 2.3rem;
        line-height: 2.5rem;
        background-color: $highlight;
        cursor: pointer;
      }
      &.normal{
        .btn{
          background-color: #fff;
        }
      }
      &.highlight{
        .btn{
          background-color: $highlight;
        }
      }
    }
  }
  @media(max-width: 1399px){
    #left {
      flex: 0 0 17.5em;
      .list{
        .btn{
          color: #666;
          display: inline-block;
          width: 14rem;
        }
      }
    }
  }
</style>
