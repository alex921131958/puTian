<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span class="range">期望线最小值</span>
          <span class="response"><SliderComp v-model="rangeMin" :min="500" :max="10000" :step="500" show-input/></span>
          <span class="reset"><i class="icon iconfont icon-refresh"></i></span>
        </p>
        <p class="list">
          <span class="range">期望线最大值</span>
          <span class="response"><SliderComp v-model="rangeMax" :min="500" :max="10000" :step="500" show-input/></span>
          <span class="reset"><i class="icon iconfont icon-refresh"></i></span>
        </p>
        <p class="list">
          <span class="slide">期望线最大宽度</span>
          <span class="response"><SliderComp v-model="inputNum" :min="1" :max=10 :step="1" show-input/></span>
        </p>

        <p class="list">
          <span>显示模式</span>
          <RadioGroupComp v-model="curShow">
            <RadioComp :label="item" v-for="item in showList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>

        <p class="list">
          <span>出行强度显示模式</span>
          <RadioGroupComp v-model="smallShow" :class="{disabled:curShow === '仅期望线'}" @on-change="setGridHeatType">
            <RadioComp :label="item" v-for="item in smallShowList" :key="item" :disabled="curShow === '仅期望线'"></RadioComp>
          </RadioGroupComp>
        </p>

        <p class="list">
          <span>期望线类型</span>
          <RadioGroupComp v-model="curExpectation" :class="{disabled:curShow === '仅小区'}">
            <RadioComp :label="item" v-for="item in expectationList" :key="item" :disabled="curShow === '仅小区'"></RadioComp>
          </RadioGroupComp>
        </p>

        <p class="list">
          <span>小区出行强度显示</span>
          <RadioGroupComp v-model="curDisplay" :class="{disabled:curShow === '仅期望线'}">
            <RadioComp :label="item" v-for="item in strengthList" :key="item" :disabled="curShow === '仅期望线'"></RadioComp>
          </RadioGroupComp>
        </p>

        <p class="list">
          <span>期望线颜色</span>
          <span class="switch">
            <RadioGroupComp class="time-group" v-model="carOdColor">
            <RadioComp :label="item" v-for="item in colorList" :key="item"></RadioComp>
          </RadioGroupComp>
            <ColorPickerComp v-model="defaultColor" :colors="colors" :disabled="carOdColor!=='单色'" @on-change="setExpColor"/></span>
        </p>

        <p class="list">
          <span>仅显示选定小区OD</span>
          <span class="switch">
            <SwitchComp v-model="switch1"/>
          </span>
        </p>

        <p class="list">
          <span>合并显示选定小区期望线</span>
          <span class="switch"><SwitchComp :disabled="switch1 === false" @on-change="mergeDisplay"/></span>
        </p>


        <p class="list">
          <span>多图层全局小区选取</span>
          <span class="switch"><SwitchComp :disabled="switch1 === false"/></span>
        </p>

        <p class="list">
          <span>小区选择方式</span>
          <RadioGroupComp v-model="villMethod" @on-change="applyAll" :class="{disabled:switch1 === false}">
            <RadioComp :label="item" v-for="item in villMethodList" :key="item" :disabled="switch1 === false"></RadioComp>
          </RadioGroupComp>
        </p>

        <!--<RoadList :roadTitle="roadTitle" :roadList="roadList"/>-->
        <VillageList villageType1="panel" :noDataVill="noDataVill" :villageTitle="villageTitle" :villageList="villageList" :class="{hidden:((villMethod === '全局' && global_v_type === 0) || switch1 === false)}"/>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import RoadList from '../../common/RoadList'
  import VillageList from '../../common/VillageList'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import eventBus from '../../../util/event-bus'

  export default{
    name: 'FlowCtlPanel',
    data() {
      return {
        isPanelOpen: true,
        curDisplay: MYCONF.STRENGTH_LIST[0],
        strengthList: MYCONF.STRENGTH_LIST,
        defaultColor:'#3b90ee',
        colors: MYCONF.COLOR_PICKER,
        inputNum:10,
        rangeMax:1000,
        rangeMin:500,
        expectationList:MYCONF.EXPECTATION_LIST,
        curExpectation: MYCONF.EXPECTATION_LIST[0],
        showList:MYCONF.SHOW_LIST,
        curShow:MYCONF.SHOW_LIST[0],

        smallShow: MYCONF.GRIDORHEATMAP['carTraffic-6'],
        smallShowList: MYCONF.SMALL_SHOW_LIST,

        roadTitle: '开始选择交通小区',
        roadList:MYCONF.ROAD_LIST,
        colorList: MYCONF.COLOR_SELECT,
        carOdColor:MYCONF.COLOR_SELECT[0],
        switch1: true,
        villMethodList: MYCONF.VILL_SELECT_METHOD,
        villMethod: MYCONF.VILL_SELECT_METHOD[1],
        villageTitle: '开始选择交通小区',
        noDataVill:'暂未选择小区',
        villageList:MYCONF.PRE_VILLAGE_LIST,
      }
    },
    props: {
      title:{
        type:String
      }
    },
    components: {
      VillageList,
      RoadList,
    },
    mounted() {
      eventBus.$on("getPanelParam",(menuId) => {
        this.setCarOdParam(menuId);
      });
      eventBus.$on("setParamEvent",(type) => {      //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if(type === 'clear'){                //取消
          this.setCarOdParam(menuId);
        }else{                              //初始化
          this.setCarOdParam("init");
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
      ...mapGetters(['cur_menu','global_v_type','village_list','car_traffic_6','global_area','global_village','panel_time','village_id']),
    },
    methods: {
      ...mapMutations(['updateRangeMin','updateRangeMax','updateCarOdCurShow','updateCarOdCurExpectation','updateCarOdCurDisplay','updateCarOdColor',
      'updateDefaultColor','updateVillageMethod','updateVillageList','updateGridHeatmap']),

      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('odPanel');
      },
      setExpColor(color){
        let id = 'carTraffic-6';
        this.updateDefaultColor(color);
        MapCommonLayer.allMethodColor(id, this.colorChange1);
      },
      applyAll(){
        if (this.villMethod === '全局') {
          if (this.global_v_type === 0) {
            this.noDataVill = '已导入预设交通小区：'+ this.global_area.label;
          }else if (this.global_v_type === 1) {
            this.updateVillageList(this.global_village)
          }
        }else if(this.villMethod === '自定义'){
          this.noDataVill = '暂未选择小区'
        }
      },
      setGridHeatType(newVal){
        this.updateGridHeatmap({'carTraffic-6': newVal})
      },
      mergeDisplay(status){

      },
      setCarOdParam(menuId){
        if(menuId === "carTraffic-6"){
          this.rangeMin = this.car_traffic_6.rangeMin;
          this.rangeMax = this.car_traffic_6.rangeMax;
          this.curShow = this.car_traffic_6.carOd_curShow;
          this.curExpectation = this.car_traffic_6.carOd_curExpectation;
          this.curDisplay = this.car_traffic_6.carOd_curDisplay;
          this.carOdColor = this.car_traffic_6.carOdColor;
          this.smallShow = this.car_traffic_6.grid_heatmap;
          if (this.car_traffic_6.villageType === 'link'){
            this.villMethod = '自定义';
          } else if (this.car_traffic_6.villageType === 'taz') {
            this.villMethod = '全局';
          }

          this.updateRangeMin(this.rangeMin);
          this.updateRangeMax(this.rangeMax);
          this.updateCarOdCurShow(this.curShow);
          this.updateCarOdCurExpectation(this.curExpectation);
          this.updateCarOdCurDisplay(this.curDisplay);
          this.updateCarOdColor(this.carOdColor);
          this.updateGridHeatmap({'carTraffic-6': this.smallShow});
          this.updateVillageMethod(this.villMethod)

        }else if(menuId === "init"){
          this.rangeMin = MYCONF.CAR_TRAFFIC_6.rangeMin;
          this.rangeMax = MYCONF.CAR_TRAFFIC_6.rangeMax;
          this.curShow = MYCONF.CAR_TRAFFIC_6.carOd_curShow;   //显示模式
          this.curExpectation = MYCONF.CAR_TRAFFIC_6.carOd_curExpectation;   //期望线类型
          this.curDisplay = MYCONF.CAR_TRAFFIC_6.carOd_curDisplay;
          this.carOdColor = MYCONF.CAR_TRAFFIC_6.carOdColor;
          this.smallShow = MYCONF.CAR_TRAFFIC_6.grid_heatmap;
          this.villMethod = '自定义';

          this.updateRangeMin(MYCONF.CAR_TRAFFIC_6.rangeMin);
          this.updateRangeMax(MYCONF.CAR_TRAFFIC_6.rangeMax);
          this.updateCarOdCurShow(MYCONF.CAR_TRAFFIC_6.carOd_curShow);
          this.updateCarOdCurExpectation(MYCONF.CAR_TRAFFIC_6.carOd_curExpectation);
          this.updateCarOdCurDisplay(MYCONF.CAR_TRAFFIC_6.carOd_curDisplay);
          this.updateCarOdColor(MYCONF.CAR_TRAFFIC_6.carOdColor);
          this.updateGridHeatmap({'carTraffic-6': MYCONF.CAR_TRAFFIC_6.grid_heatmap});
          this.updateVillageMethod('自定义')
        }
      },
    },
    watch: {
      village_list(newVal){
        this.villageList = newVal;
      },
      rangeMin(newVal){
        this.updateRangeMin(newVal)
      },
      rangeMax(newVal){
        this.updateRangeMax(newVal)
      },
      curShow(newVal){
        this.updateCarOdCurShow(newVal)
      },
      curExpectation(newVal){
        this.updateCarOdCurExpectation(newVal)
      },
      curDisplay(newVal){
        this.updateCarOdCurDisplay(newVal)
      },
      carOdColor(newVal){
        this.updateCarOdColor(newVal)
      },
      villMethod(newVal){
        this.updateVillageMethod(newVal)
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
