<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span>分析内容</span>
          <RadioGroupComp v-model="adminOption">
            <RadioComp :label="item" v-for="item in adminList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>
        <p class="list">
          <span class="slide">期望线最大宽度</span>
          <span class="response"><SliderComp v-model="adminExpWidth" :min="0" :max="50" :step="1" show-input /></span>
        </p>
        <p class="list">
          <span class="slide">形心圆点半径</span>
          <span class="response"><SliderComp v-model="adminWhiteRadius" :min="0" :max="5" :step="0.5" show-input/></span>
        </p>
        <p class="list">
          <span>显示模式</span>
          <RadioGroupComp v-model="showDate">
            <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>
        <p class="list">
          <span>出行强度显示内容</span>
          <i-select v-model="curTravel" style="width:10em;">
            <i-option v-for="item in travelIntensity" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-select>
        </p>

        <p class="list">
          <span>仅显示选定小区OD</span>
          <span class="switch">
            <SwitchComp v-model="switch1"/>
          </span>
        </p>

        <p class="list" v-if="adminOption === '建成区OD分析'">
          <span>小区选择</span>
          <i-select v-model="curAnaly" @on-change="setBuildArea" style="width:10em;" :disabled="!switch1">
            <i-option v-for="item in analyList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-select>
        </p>
        <p class="list" v-if="adminOption === '区县OD分析'">
          <span>小区选择</span>
          <i-select v-model="curAnaly1" @on-change="setAdminArea" style="width:10em;" :disabled="!switch1">
            <i-option v-for="item in analyList1" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-select>
        </p>

        <p class="list">
          <span>期望线类型</span>
          <RadioGroupComp v-model="curShow" :class="{disabled:switch1 === false}">
            <RadioComp :label="item" v-for="item in showList1" :key="item" :disabled="switch1 === false"></RadioComp>
          </RadioGroupComp>
        </p>

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
    name: 'AdminOdPanel',
    data() {
      return {
        isPanelOpen: true,
        colors: MYCONF.COLOR_PICKER,
        inputNum:10,

        showDate: MYCONF.SHOW_LIST[0],
        showList: MYCONF.SHOW_LIST,
        showList1:MYCONF.EXPECTATION_LIST,
        curShow: MYCONF.EXPECTATION_LIST[0],
        switch1: false,
        colorSel1:MYCONF.COLOR_SELECT[0],
        colorList: MYCONF.COLOR_SELECT,
        colorChange1: '#3b90ee',
        analyList:MYCONF.BUILTAREA,
        curAnaly:MYCONF.BUILTAREA[0].label,
        analyList1:MYCONF.ADMINAREA,
        curAnaly1:MYCONF.ADMINAREA[0].label,
        adminList:MYCONF.ADMIN_LIST,
        adminOption:MYCONF.ADMIN_LIST[0],
        travelIntensity:MYCONF.TRAVEL_INTENSITY,
        curTravel:MYCONF.TRAVEL_INTENSITY[0].label,
        adminExpWidth: 7,
        adminWhiteRadius: 1,
      }
    },
    mounted() {
      eventBus.$on("getPanelParam",(menuId) => {
        this.setAdminOdParam(menuId);
      });
      eventBus.$on("setParamEvent",(type) => {
        //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if(type === 'clear'){                //取消
          this.setAdminOdParam(menuId);
        }else{                              //初始化
          this.setAdminOdParam("init");
        }
      });
    },
    computed: {
      ...mapGetters(['isRoadEditable','panel_time','link_id','link_list','isVillageEditable','village_id','village_list',
        'distance_type','colorChange','global_v_type','global_area','global_village','exp_min','exp_max',
        'colorSel','travel_sel','cur_menu','person_trip_5','villageType']),
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
        'updateMergeDisplay','updateLineDistrict','updateDistanceType','updateExpMin','updateExpMax','updateAdminExpWidth',
        'updateColorChange','updateColorSel','updateVillageList','updateVillageMethod','updateAdminOption','updateBuildAreaSel',
        'updateAdminAreaSel','updateTravelSel','updateDisplayModeBuild','updateGridHeatmap','updateOverAll5','updateAdminWhiteRadius']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('adminOdPanel');
      },
      // widthChange(val){
      //   this.updateAdminExpWidth(val);
      // },
      setExpColor(color){
        let id = 'personTrip-5';
        this.updateColorChange(color);
        MapCommonLayer.allMethodColor(id, this.colorChange1);
      },
      setBuildArea(data){
        this.updateBuildAreaSel(data);
        MapCommonLayer.locationBuiltArea(MapCommonLayer.setNameToTazId(data))
      },
      setAdminArea(data){
        this.updateAdminAreaSel(data);
        MapCommonLayer.locationDistrictArea(MapCommonLayer.setNameToAdminId(data));
      },
      setAdminOdParam(menuId){
        if(menuId === "personTrip-5"){
          this.adminOption = this.person_trip_5.adminOption;
          this.showDate = this.person_trip_5.display_mode_build;
          this.colorSel1 = this.person_trip_5.colorSel;
          this.curTravel = this.person_trip_5.travel_sel;
          this.curAnaly = this.person_trip_5.ids;
          this.curAnaly1 = this.person_trip_5.ids;
          if(this.person_trip_5.distance_type === 'a'){
            this.curShow = '全部';
          }else if (this.person_trip_5.distance_type === 'o') {
            this.curShow = '出发';
          }else if (this.person_trip_5.distance_type === 'd') {
            this.curShow = '到达';
          }

          this.updateAdminOption(this.adminOption);
          this.updateDisplayModeBuild(this.showDate);
          this.updateColorSel(this.colorSel1);
          this.updateTravelSel(this.curTravel);
          this.updateBuildAreaSel(this.curAnaly);
          this.updateAdminAreaSel(this.curAnaly1);
          this.updateDistanceType(this.person_trip_5.distance_type);
        }else if(menuId === "init"){
          this.adminOption = '建成区OD分析';
          this.showDate = MYCONF.PERSONTRIP_5.display_mode_build;
          this.colorSel1 = MYCONF.PERSONTRIP_5.colorSel;
          this.curTravel = MYCONF.PERSONTRIP_5.travel_sel;
          this.curAnaly = MYCONF.BUILTAREA[0].label;
          this.curAnaly1 = MYCONF.BUILTAREA[0].label;
          this.curShow = '全部';

          this.updateAdminOption(MYCONF.PERSONTRIP_5.adminOption);
          this.updateDisplayModeBuild(MYCONF.PERSONTRIP_5.display_mode_build);
          this.updateColorSel(MYCONF.PERSONTRIP_5.colorSel);
          this.updateTravelSel(MYCONF.PERSONTRIP_5.travel_sel);
          this.updateBuildAreaSel(null);
          this.updateAdminAreaSel(null);
          this.updateDistanceType(MYCONF.PERSONTRIP_5.distance_type)
        }
      },
    },
    watch:{
      showDate(newVal){
        this.updateDisplayModeBuild(newVal)
      },

      curShow(newVal) {
        let disType = 'a';
        if (newVal === '全部'){
          disType = 'a';
        } else if (newVal === '出发'){
          disType = 'o';
        }else {
          disType = 'd';
        }
        this.updateDistanceType(disType)
      },

      colorSel1(newVal){
        this.updateColorSel(newVal);
        if (newVal === '单色') {
          let id = 'personTrip-5';
          MapCommonLayer.allMethodColor(id, this.colorChange1);
        }
      },
      adminOption(newVal){
        this.updateAdminOption(newVal);
      },
      curTravel(newVal){
        this.updateTravelSel(newVal)
      },
      switch1(newVal){
        this.updateOverAll5(newVal)
      },
      adminExpWidth(newVal){
        this.updateAdminExpWidth(newVal);
      },
      adminWhiteRadius(newVal){
        this.updateAdminWhiteRadius(newVal)
      }
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
