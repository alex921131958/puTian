<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
      <span class="tip">(更改参数内容需重新应用)</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">

        <p class="list">
          <span class="slide">期望线最小值</span>
          <span class="response"><SliderComp v-model="expMin" :min="0" :max="50" :step="1" show-input/></span>
        </p>
        <p class="list">
          <span class="slide">期望线最大值</span>
          <span class="response"><SliderComp v-model="expMax" :min="0" :max="300" :step="1" show-input/></span>
        </p>
        <p class="list">
          <span class="slide">期望线最大宽度</span>
          <span class="response"><SliderComp v-model="expWidth" :min="0" :max="50" :step="1" show-input/></span>
        </p>
        <p class="list">
          <span class="slide">形心圆点半径</span>
          <span class="response"><SliderComp v-model="whiteRadius" :min="0" :max="4" :step="0.1" show-input/></span>
        </p>
        <p class="list">
          <span class="slide">热力点单位半径</span>
          <span class="response">
             <SliderComp v-model="heatmap_radius" :min="20" :max="150" :step="10" show-input :disabled="smallShow==='栅格小区'"/>
          </span>
        </p>
        <p class="list">
          <span>显示模式</span>
          <RadioGroupComp v-model="showDate">
            <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>

        <p class="list">
          <span>出行强度显示模式</span>
          <RadioGroupComp v-model="smallShow" :class="{disabled:showDate === '仅期望线'}" @on-change="setGridHeatType">
            <RadioComp :label="item" v-for="item in smallShowList" :key="item" :disabled="showDate === '仅期望线'"></RadioComp>
          </RadioGroupComp>
        </p>

        <p class="list">
          <span>出行强度显示内容</span>
          <i-select v-model="curTravel" style="width:10em;" :disabled="showDate==='仅期望线'">
            <i-option v-for="item in travelIntensity" :value="item.value" :key="item.value" >{{ item.label }}</i-option>
          </i-select>
        </p>
        <p class="list">
          <span>仅显示选定小区OD</span>
          <span class="switch">
            <SwitchComp v-model="switch1"/>
          </span>
        </p>
        <p class="list">
          <span>小区选择方式</span>
          <RadioGroupComp v-model="villMethod" @on-change="applyAll" :class="{disabled:switch1 === false}">
            <RadioComp :label="item" v-for="item in villMethodList" :key="item" :disabled="switch1 === false"></RadioComp>
          </RadioGroupComp>
        </p>

        <p class="list">
          <span>合并显示所选定交通小区</span>
          <span class="switch"><SwitchComp :disabled="switch1===false || (villMethod==='自定义'&&village_id.length===0)" @on-change="mergeDisplay"/></span>
        </p>

        <p class="list">
          <span>期望线类型</span>
          <RadioGroupComp v-model="curShow" :class="{disabled:switch1 === false}">
            <RadioComp :label="item" v-for="item in showList1" :key="item" :disabled="switch1 === false"></RadioComp>
          </RadioGroupComp>
        </p>

        <VillageList villageType1="panel" :noDataVill="noDataVill" :villageTitle="villageTitle" :villageList="villageList" :class="{hidden:((villMethod === '全局' && global_v_type === 0) || switch1 === false)}"/>

      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import RoadList from '../../common/RoadList'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import VillageList from '../../common/VillageList'
  import eventBus from '../../../util/event-bus'

  export default {
    name: 'AllMethodOdPanel',
    data() {
      return {
        isPanelOpen: true,
        defaultColor:'#3b90ee',
        colors: MYCONF.COLOR_PICKER,
        inputNum:10,
        rangeMax:1000,
        rangeMin:500,
        villageList:MYCONF.PRE_VILLAGE_LIST,
        roadTitle:'开始选择交通小区',
        villageTitle: '开始选择交通小区',
        expMin: 0,
        expMax: 300,
        expWidth: 5,
        whiteRadius: 1,
        showDate: MYCONF.SHOW_LIST[0],
        showList: MYCONF.SHOW_LIST,
        showList1:MYCONF.EXPECTATION_LIST,
        curShow: MYCONF.EXPECTATION_LIST[0],

        smallShow: MYCONF.GRIDORHEATMAP['personTrip-1'],
        smallShowList: MYCONF.SMALL_SHOW_LIST,

        villMethodList: MYCONF.VILL_SELECT_METHOD,
        villMethod: MYCONF.VILL_SELECT_METHOD[1],
        switch1: false,
        colorSel1:MYCONF.COLOR_SELECT[0],
        colorList: MYCONF.COLOR_SELECT,
        noDataVill:'暂未选择小区',
        colorChange1: '#3b90ee',
        travelIntensity:MYCONF.TRAVEL_INTENSITY_OD,
        curTravel:MYCONF.TRAVEL_INTENSITY_OD[0].label,
        heatmap_radius:MYCONF.HEATMAP_RADIUS['personTrip-1'],
      }
    },
    mounted() {
      eventBus.$on("getPanelParam",(menuId) => {
        this.setAllMethodOdParam(menuId);
      });
      eventBus.$on("setParamEvent",(type) => {      //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if(type === 'clear'){                //取消
          this.setAllMethodOdParam(menuId);
        }else{                              //初始化
          this.setAllMethodOdParam("init");
        }
      });
      eventBus.$on("changeNoDataVill",() => {
        this.noDataVill = '暂未选择小区'
      });
      eventBus.$on("changeTazNoDataVill",() => {
        this.noDataVill = '已导入预设交通小区：'+ this.global_area.label;
      });
    },
    computed: {
      ...mapGetters(['isRoadEditable','panel_time','link_id','link_list','isVillageEditable','village_id','village_list',
        'distance_type','colorChange','global_v_type','global_area','global_village','exp_min','exp_max',
      'colorSel','travel_sel','villageMethod','grid_heatmap','display_mode','cur_menu','person_trip_1','villageType','v_update_time',
      'global_village_id','overAll']),
    },
    props: {
      title:{
        type:String
      }
    },
    components: {
      RoadList,
      VillageList
    },
    methods: {
      ...mapMutations(['updateRoadEditable','updateDisplayMode','updateTravelMode','updateOnlyDistrict','updateDistrictMode',
        'updateMergeDisplay','updateLineDistrict','updateDistanceType','updateExpMin','updateExpMax','updateExpWidth',
      'updateColorChange','updateColorSel','updateVillageList','updateVillageMethod','updateTravelSel','updateGridHeatmap',
      'updateGlobalArea','updateVillageId','updateOverAll','updateWhiteRadius','updateKernelRadius','updateIsMergeLine']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('allMethodPanel');
      },
      setExpColor(color){
        let id = 'personTrip-1';
        this.updateColorChange(color);
        MapCommonLayer.allMethodColor(id, this.colorChange1);
      },
      applyAll(){
        if (this.villMethod === '全局') {
          if (this.global_v_type === 0) {
            this.noDataVill = '已导入预设交通小区：'+ this.global_area.label ;
            MapCommonLayer.locationBuiltArea(this.global_area.value);
          }else if (this.global_v_type === 1) {
            this.updateVillageList(this.global_village);
            this.updateVillageId(this.global_village_id)
          }
        }else if(this.villMethod === '自定义'){
          this.noDataVill = '暂未选择小区'
        }
      },
      mergeDisplay(status){
        this.updateIsMergeLine(status);
      },
      setGridHeatType(newVal){
        this.updateGridHeatmap({'personTrip-1': newVal})
      },
      setAllMethodOdParam(menuId){
        if(menuId === "personTrip-1"){
          this.expMin = this.person_trip_1.expMin;
          this.expMax = this.person_trip_1.expMax;
          this.showDate = this.person_trip_1.display_mode;
          this.smallShow = this.person_trip_1.grid_heatmap;
          this.curTravel = this.person_trip_1.travel_sel;
          this.colorSel1 = this.person_trip_1.colorSel;
          this.villMethod = (this.person_trip_1.villageType === 'link'&&this.person_trip_1.vilfollow === 0)?'自定义':'全局';
          this.curShow = this.person_trip_1.distance_type === 'a'? '全部':this.person_trip_1.distance_type === 'o'?'出发':'到达';
          this.updateExpMin(this.expMin);
          this.updateExpMax(this.expMax);
          this.updateDisplayMode(this.showDate);
          this.updateGridHeatmap({'personTrip-1': this.smallShow});
          this.updateTravelSel(this.curTravel);
          this.updateColorSel(this.colorSel1);
          this.updateVillageMethod(this.villMethod);
          this.updateDistanceType(this.person_trip_1.distance_type)
        }else if(menuId === "init"){
          this.expMin = MYCONF.PERSONTRIP_1.expMin;
          this.expMax = MYCONF.PERSONTRIP_1.expMax;
          this.showDate = MYCONF.PERSONTRIP_1.display_mode;
          this.smallShow = MYCONF.PERSONTRIP_1.grid_heatmap;
          this.curTravel = MYCONF.PERSONTRIP_1.travel_sel;
          this.colorSel1 = MYCONF.PERSONTRIP_1.colorSel;
          this.villMethod = '自定义';
          this.curShow = '全部';
          this.updateExpMin(MYCONF.PERSONTRIP_1.expMin);
          this.updateExpMax(MYCONF.PERSONTRIP_1.expMax);
          this.updateDisplayMode(MYCONF.PERSONTRIP_1.display_mode);
          this.updateGridHeatmap({'personTrip-1': MYCONF.PERSONTRIP_1.grid_heatmap});
          this.updateTravelSel(MYCONF.PERSONTRIP_1.travel_sel);
          this.updateColorSel(MYCONF.PERSONTRIP_1.colorSel);
          this.updateVillageMethod('自定义');
          this.updateDistanceType(MYCONF.PERSONTRIP_1.distance_type)
        }
      }
    },
    watch:{
      village_list(newVal){
        this.villageList = newVal;
      },
      showDate(newVal){
        this.updateDisplayMode(newVal)
      },
      curShow(newVal) {
        let disType = newVal === '全部'?'a':newVal === '出发'?'o':'d';
        this.updateDistanceType(disType)
      },
      expMin(newVal) {
        this.updateExpMin(newVal);
      },
      expMax(newVal) {
        this.updateExpMax(newVal)
      },
      expWidth(newVal){
        this.updateExpWidth(newVal);
      },
      whiteRadius(newVal){
        this.updateWhiteRadius(newVal)
      },
      colorSel1(newVal){
        this.updateColorSel(newVal);
        if (newVal === '单色') {
          let id = 'personTrip-1';
          MapCommonLayer.allMethodColor(id, this.colorChange1);
        }
      },

      villMethod(newVal){
        this.updateVillageMethod(newVal)
      },
      curTravel(newVal){
        this.updateTravelSel(newVal)
      },
      v_update_time(newVal,oldVal){
        if(newVal && oldVal && newVal!==oldVal){
          this.villMethod = '自定义';
          this.updateVillageMethod('自定义');
        }
      },
      switch1(newVal){
        this.updateOverAll(newVal)
      },
      heatmap_radius(newVal){
        this.updateKernelRadius({'personTrip-1': newVal});
        MapCommonLayer.heatmapRadiusChange('personTrip-1', newVal);
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../common/common.scss";

  .hidden{
    opacity: 0.6;
    pointer-events: none;
  }

  .box {
    margin-bottom: 1em;
    .tip{
      opacity: 0.6;
    }
    hr{
      margin-left: 2.2em;
      opacity: 0.3;
      border-width: 0.01em;
    }
    p {
      margin: 0.6em 0;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        margin-left: 2.2em;
        &.left{
          justify-content: flex-start;
          .opacity{
            opacity: 0.6;
            margin-left: 5px;
          }
        }
        & > span:first-child {
          /*text-indent: 2.2em;*/
        }
        & > .btn{
          width: 12.5em;
          margin-right: 0.7em;
          background-color: #adadad;
          cursor: pointer;
          color: #000;
          letter-spacing: 1px;
          &:hover,&.active{
            background-color: $bg-red;
            color: #fff;
            font-weight: 600;
            transition: all ease-in-out 0.3s;
          }
        }
        & > .clear{
          flex: 1;
          background-color: #fff;
          .icon-clear{
            font-size: 1.6em;
            color: $bg-red;
            cursor: pointer;
          }
        }
        span{
          &.reset{
            width: 2.5em;
            height: 2.5em;
            margin-top: 0.25em;
            margin-left: 0.8em;
            background-color: #666;
            line-height: 2.5em;
            cursor: pointer;
            .icon{
              color: #000;
              font-size: 1.4em;
            }
          }
          &.range{
            width: 10em;
            text-align: left;
          }
          &.slide{
            width: 14em;
            text-align: left;
          }
          &.response{
            flex: 1;
          }
        }
      }
    }
    div.list{
      margin-left: 2.2em;
      p{
        margin: 0;
        background-color: #4a4a4a;
        display: flex;
        line-height: 2.6em;
        display: flex;
        span{
          flex: 1;
          &.icon{
            flex: 0.9;
          }
          &.name{
            flex: 1.7;
          }
        }
      }
    }
  }
</style>
