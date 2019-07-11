<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span class="slide">热力点单位半径</span>
          <span class="response">
             <SliderComp v-model="heatmap_radius" :min="20" :max="150" :step="10" show-input :disabled="smallShow==='栅格小区'"/>
          </span>
        </p>
        <p class="list">
          <span>显示模式</span>
          <RadioGroupComp v-model="smallShow" @on-change="setGridHeatType">
            <RadioComp :label="item" v-for="item in smallShowList" :key="item"></RadioComp>
          </RadioGroupComp>
        </p>
        <p class="list">
          <span>仅显示选定小区OD数据</span>
          <span class="switch">
            <SwitchComp  v-model="switch1"/>
          </span>
        </p>
        <p class="list">
          <span>小区选择方式</span>
          <RadioGroupComp v-model="villMethod" @on-change="applyAll" :class="{disabled:switch1 === false}">
            <RadioComp :label="item" v-for="item in villMethodList" :key="item" :disabled="switch1 === false"></RadioComp>
          </RadioGroupComp>
        </p>
        <VillageList :noDataVill="noDataVill" :villageTitle="villageTitle" :villageList="villageList" :class="{hidden:((villMethod === '全局' && global_v_type === 0) || switch1 === false)}"/>
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
    name: 'FlowCtlPanel',
    data() {
      return {
        isPanelOpen: true,
        smallShow: MYCONF.GRIDORHEATMAP['personTrip-2'],
        smallShowList: MYCONF.SMALL_SHOW_LIST,
        villageTitle: '开始选择交通小区',
        villageList:MYCONF.PRE_VILLAGE_LIST,
        villMethodList: MYCONF.VILL_SELECT_METHOD,
        villMethod: MYCONF.VILL_SELECT_METHOD[1],
        noDataVill:'暂未选择小区',
        switch1: false,
        heatmap_radius:MYCONF.HEATMAP_RADIUS['personTrip-2'],
      }
    },
    mounted() {
      eventBus.$on("getPanelParam",(menuId) => {
        this.setDynamicPopParam(menuId);
      });
      eventBus.$on("setParamEvent",(type) => {      //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if(type === 'clear'){                //取消
          this.setDynamicPopParam(menuId);
        }else{                              //初始化
          this.setDynamicPopParam("init");
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
        'distance_type','global_v_type','global_village','global_area','grid_heatmap','person_trip_2','cur_menu','villageType',
        'v_update_time'
      ]),
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
        'updateMergeDisplay','updateLineDistrict','updateDistanceType','updateVillageList','updateVillageMethod','updateGridHeatmap',
      'updateOverAll2','updateKernelRadius']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('DynamicPopulation');
      },
      applyAll(){
        if (this.villMethod === '全局') {
          if (this.global_v_type === 0) {
            this.noDataVill = '已导入预设交通小区：'+ this.global_area.label;
            MapCommonLayer.locationBuiltArea(this.global_area.value);
          }else {
            this.updateVillageList(this.global_village)
          }
        }else {
          this.noDataVill = '暂未选择小区'
        }
      },
      setGridHeatType(newVal){
        this.updateGridHeatmap({'personTrip-2': newVal})
      },
      setDynamicPopParam(menuId){
        if(menuId === "personTrip-2"){
          this.smallShow = this.person_trip_2.grid_heatmap;
          if (this.person_trip_2.villageType === 'link'){
            this.villMethod = '自定义';
          } else if (this.person_trip_2.villageType === 'taz') {
            this.villMethod = '全局';
          }

          this.updateGridHeatmap({'personTrip-2': this.smallShow});
          this.updateVillageMethod(this.villMethod);

        }else if(menuId === "init"){
          this.smallShow = MYCONF.PERSONTRIP_2.grid_heatmap;
          this.villMethod = '自定义';

          this.updateGridHeatmap({'personTrip-2': MYCONF.PERSONTRIP_2.grid_heatmap});
          this.updateVillageMethod('自定义');
        }
      }
    },
    watch:{
      village_list(newVal){
        this.villageList = newVal;
      },

      villMethod(newVal){
        this.updateVillageMethod(newVal)
      },
      v_update_time(newVal,oldVal){
        if(newVal && oldVal && newVal!==oldVal){
          this.villMethod = '自定义';
          this.updateVillageMethod('自定义');
        }
      },
      switch1(newVal){
        this.updateOverAll2(newVal)
      },
      heatmap_radius(newVal){
        this.updateKernelRadius({'personTrip-2': newVal});
        MapCommonLayer.heatmapRadiusChange('personTrip-2', newVal);
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
