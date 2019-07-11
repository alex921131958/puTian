<template>
  <div id="left">
    <EasyScrollbar :barOption="listBar">
      <div class="listBox">
        <p class="edit-title"><i class="icon iconfont icon-edit-panel"></i>编辑面板</p>
        <AreaBaseAttr ref="areaAttr" @updateAreaInfo="updateAreaInfo"/>
        <AreaCarInfo :trafficInfo="trafficInfo" :carTrafficVol="carTrafficVol" ref="landInfo" @cimmitLandInfo="cimmitLandInfo" @cimmitAreaAttr="cimmitAreaAttr"/>
        <p class="list normal"><span class="btn" @click="initRatioPre">使用step1预设调整系数</span></p>
        <p class="list highlight"><span class="btn" @click="updateTraResult">计算/更新交通分布预测结果</span></p>
      </div>
    </EasyScrollbar>
    <AttrSaveComp @landAttrSave="landAttrSave" @landAttrCancel="landAttrCancel" @landAttrDelete="landAttrDelete"/>
  </div>
</template>

<script>
  import MYCONF from '../../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../util/event-bus'
  import FLOWCONF from '../flowConf'
  import env from '../../../common/env'
  import AttrSaveComp from './sub/AttrSaveComp'
  import AreaBaseAttr from './sub/AreaBaseAttr'
  import AreaCarInfo from './sub/AreaCarInfo'
  import LandAttrHandler from '../../../service/workflow/landAttrHandler'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'

  export default {
    name: "LinkAttribute",
    data() {
      return {
        caseTitle: '',
        listBar: FLOWCONF.EASY_SCROLL_BAR,
        trafficInfo:JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_INFO)),
        carTrafficVol:JSON.parse(JSON.stringify(FLOWCONF.CAR_TRAVEL_VOLUME)),
        landBaseAttr:{},
        allOdData:[],
        curRequest:null,
      }
    },
    mounted() {
      this.controller = new LandAttrHandler(this);
      this.trafficInfo = JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_INFO));
      let _this = this;
      this.$nextTick(() => {
        if (env.echartLayer) {   //防止挪动时的od
          env.echartLayer.remove();
          env.echartLayer = null;
        }
        if(this.curEditPool && this.landList.indexOf(this.curEditPool.id) === -1){
          this.trafficInfo = JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_INFO));
        }
      });
      eventBus.$on("editCurLandItem",(data) => {
        this.controller.formatLandAttr(data);
        this.updateAreaInfo(data,true);
      });
      eventBus.$on("stopRequest",() => {
        this.controller.stopDiagramRequest();
      });
    },

    computed: {
      ...mapGetters(['cur_pro_id','curEditPool','index_travelVol','landBaseArea','landAreaObj','curLandId','landList','landOdColor',
        'landOdType','landOdWidth','landColor','landOdData','landParamObj','odExpMax','odExpMin','allOdShow','colorType','time_tag']),
    },
    components: {
      AttrSaveComp,
      AreaBaseAttr,
      AreaCarInfo,
    },
    methods: {
      ...mapMutations(['updateCurLandId','updateCurEditPool','updateAttributePanel','updateLandList','updateLandEditable','updateLandOdData',
      'updateAllOdShow','updateGlobalLoading']),
      //保存地块信息
      landAttrSave(){
        this.$refs.areaAttr.cimmitAreaAttr();
        this.$refs.landInfo.cimmitLandInfo();
        //todo 触发post保存
        this.controller.saveLandItem();
        // this.controller.getSubDict();
      },
      landAttrCancel(){
        this.updateLandEditable(false);
        this.controller.landAttrCancel();
        this.updateAllOdShow(true);
      },
      landAttrDelete(){
        eventBus.$emit("deleteUpdateLand"); //更新用地规划内容汇总
        this.updateLandEditable(false);
        this.controller.landAttrDelete();
        this.controller.setItemOdLayerHide(true);
        this.updateAllOdShow(true);
      },
      cimmitLandInfo(data){
        this.carTrafficVol=JSON.parse(JSON.stringify(data));
      },
      cimmitAreaAttr(data){
        this.landBaseAttr = JSON.parse(JSON.stringify(data));
      },
      //调整为step1预设系数
      initRatioPre(){
        this.carTrafficVol = JSON.parse(JSON.stringify(this.index_travelVol));
        this.$refs.landInfo.initRatioPre();
      },
      //计算/更新交通分布预测结果
      updateTraResult(){
        this.$refs.landInfo.cimmitLandInfo();
        this.$refs.areaAttr.cimmitAreaAttr();
        this.updateLandEditable(false);
        //更新出行量信息
        setTimeout(() => {
          this.controller.updateTraInfo();
        },600);
      },


      updateAreaInfo(data,bool){
        let tempInfo = JSON.parse(JSON.stringify(this.trafficInfo));
        this.$set(tempInfo.daily,"generate",parseInt(data.dayaoVol));
        this.$set(tempInfo.daily,"attract",parseInt(data.dayadVol));
        this.$set(tempInfo.daily,"count",parseInt(data.dayaaVol));
        this.$set(tempInfo.earlyPeak,"generate",parseInt(data.daymoVol));
        this.$set(tempInfo.earlyPeak,"attract",parseInt(data.daymdVol));
        this.$set(tempInfo.earlyPeak,"count",parseInt(data.daymaVol));
        this.$set(tempInfo.latePeak,"generate",parseInt(data.daynoVol));
        this.$set(tempInfo.latePeak,"attract",parseInt(data.dayndVol));
        this.$set(tempInfo.latePeak,"count",parseInt(data.daynaVol));
        this.trafficInfo = JSON.parse(JSON.stringify(tempInfo));

        if(bool){
          let carTrafficVol = JSON.parse(JSON.stringify(this.carTrafficVol));
          this.$set(carTrafficVol.daily,"generate",data.dayaoCoefficient);
          this.$set(carTrafficVol.daily,"attract",data.dayadCoefficient);
          this.$set(carTrafficVol.earlyPeak,"generate",data.daymoCoefficient);
          this.$set(carTrafficVol.earlyPeak,"attract",data.daymdCoefficient);
          this.$set(carTrafficVol.latePeak,"generate",data.daynoCoefficient);
          this.$set(carTrafficVol.latePeak,"attract",data.dayndCoefficient);
          this.carTrafficVol = JSON.parse(JSON.stringify(carTrafficVol));
          this.$refs['landInfo'].setCarTrafficVol(carTrafficVol);
        }
      }
    },
    watch: {

    },
    beforeDestroy() {
      eventBus.$off("editCurLandItem");
    },
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
      overflow-x: hidden;
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
  @media(max-width: 1600px){
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
