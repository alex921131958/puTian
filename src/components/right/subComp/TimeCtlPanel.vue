<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>时间控制</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span>多图层全局时间控制</span>
          <span class="switch"><SwitchComp v-model="isTimeGlobal_tip" @on-change="updatePanelGlobal"/></span>
        </p>
        <div :class="{disabled:isTimeGlobal_tip}">
          <p class="list">
            <span>统计年度</span>
            <i-select v-model="curYear" style="width:10em;" @on-change="setCurYear">
              <i-option v-for="item in yearList" :value="item.value" :key="item.value" :disabled="item.value!==2018">{{ item.label }}</i-option>
            </i-select>
          </p>
          <p class="list">
            <span>统计季节</span>
            <i-select v-model="curSeason" style="width:10em;" @on-change="setCurSeason">
              <i-option v-for="item in seasonList" :value="item.value" :key="item.value" :disabled="item.value!=='第三季度'&&cur_menu.id==='carTraffic-5'||item.value!=='第二季度'&&(cur_menu.id==='cmnTraffic-1'||cur_menu.id==='cmnTraffic-3')">{{ item.label }}</i-option>
            </i-select>
          </p>
          <p class="list">
            <span>日期类型</span>
            <RadioGroupComp v-model="curDate">
              <RadioComp :label="item" v-for="item in dateList" :key="item" :disabled="cur_menu.id==='carTraffic-5'||cur_menu.id==='personTrip-1'||cur_menu.id==='personTrip-2'||cur_menu.id==='personTrip-3'||cur_menu.id==='personTrip-4'||cur_menu.id==='personTrip-5'"></RadioComp>
            </RadioGroupComp>
          </p>
          <p class="list flex"  v-if="!(cur_menu.id==='personTrip-3'||cur_menu.id==='personTrip-4')">
            <span>时间范围</span>
            <RadioGroupComp class="time-group" v-model="curTimeSel" @on-change="setDateType">
              <RadioComp :label="item" v-for="item in timeSel" :key="item" :disabled="cur_menu.id==='carTraffic-5'&&item===''"></RadioComp>
            </RadioGroupComp>
            <InputNumberComp v-model="curTime" :min="6" :max="23" :formatter="value => `${value}:00 ~ ${value+1}:00`" size="large" :disabled="curTimeSel!==''||cur_menu.id==='carTraffic-5'"/>
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import eventBus from '../../../util/event-bus'
  import env from '../../../common/env'
  import SelectComp from '../../common/SelectComp'

  export default {
    name: 'TimeCtlPanel',
    data() {
      return {
        isPanelOpen: true,
        curTime:8,
        yearList: MYCONF.YEAR_LIST,
        curYear: MYCONF.YEAR_LIST[0].label,
        seasonList: MYCONF.SEASON_LIST,
        curSeason: MYCONF.SEASON_LIST[1].label,
        dateList: MYCONF.DATE_LIST,
        curDate: MYCONF.DATE_LIST[0],
        timeSel:['早高峰','晚高峰',''],
        curTimeSel:'早高峰',
        isTimeGlobal_tip:false,    //是否跟随全局时间
      }
    },
    mounted() {
      let that = this;
      eventBus.$on("updateGlobalTime",() => {    //全局时间保存时触发
        if(that.isTimeGlobal){
          this.setPanelTime(that.global_time);
        }
      });
      eventBus.$on("getPanelParam",(menuId) => {
        this.setPanelParam(menuId);
      });

      eventBus.$on("setParamEvent",(type) => {      //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if(type === 'clear'){                //取消
          this.setPanelParam(menuId);
        }else{                              //初始化
          this.setPanelParam("init");
        }
      });
    },
    computed: {
      ...mapGetters(['panel_time','cur_time_sel','global_time','cur_menu','car_traffic_1','car_traffic_2','car_traffic_3','car_traffic_4',
        'car_traffic_5','bus_traffic_1','bus_traffic_3','global_time_follow','car_traffic_6','cmn_traffic_1','cmn_traffic_3',
      'person_trip_1','person_trip_2','person_trip_3','person_trip_4','person_trip_5','t_update_time']),
      isTimeGlobal:function () {
        this.isTimeGlobal_tip = this.cur_menu.globaltime;
        return this.cur_menu.globaltime;
      }
    },
    props: {
    },
    components: {
      // SelectComp,
    },
    methods: {
      ...mapMutations(['updatePanelTime','updateCurTimeSel','updateGlobalFollow','updateVilGlobalFollow']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
      },
      setDateType() {
        // console.log(this.curTimeSel);
      },
      setCurYear(data) {
        this.updatePanelTime({year:data});
      },
      setCurSeason(data) {
        let curSeason = 0;
        switch (data){
          case '第一季度':
            curSeason = 1;
            break;
          case '第二季度':
            curSeason = 2;
            break;
          case '第三季度':
            curSeason = 3;
            break;
          case '第四季度':
            curSeason = 4;
            break;
          default:
            curSeason = 0;
            break;
        }
        this.updatePanelTime({season:curSeason});
      },
      updatePanelGlobal(bool){
        //eventBus.$emit("panelToMenu",bool);   //右侧面板关联菜单栏全局时间
        this.updateGlobalFollow(bool);
        let timeObj = bool ? this.global_time : MYCONF.GLOBAL_TIME;
        this.updatePanelTime(timeObj);
        this.setPanelTime(timeObj);
      },
      setPanelTime(obj){
        let year = obj.year;
        let season = obj.season;
        let datetag = obj.datetag;
        let hour = obj.hour;
        this.curYear = year;
        this.curSeason = season === 1?'第一季度':season === 2?'第二季度':season === 3?'第三季度':season === 4?'第四季度':'全年';
        this.curDate = datetag===1?'工作日':'非工作日';
        this.curTime = hour===31||hour===32 ? 8:hour;
        this.curTimeSel = hour===31?'早高峰':hour===32?'晚高峰':'';
      },
      filterCrossLayer(count){
        let crossLayer = 'carTraffic-5';
        if (env.map.getLayer(crossLayer)) env.map.setFilter(crossLayer, ["==", "timetag",count]);
        if (env.map.getLayer(crossLayer+'-symbol')) env.map.setFilter(crossLayer+'-symbol', ["==", "timetag",count]);
      },

      setPanelParam(menuId){
        let paramObj = MYCONF.GLOBAL_TIME;
        switch (menuId){
          case 'carTraffic-1':
            paramObj = this.car_traffic_1;
            break;
          case 'carTraffic-2':
            paramObj = this.car_traffic_2;
            break;
          case 'carTraffic-3':
            paramObj = this.car_traffic_3;
            break;
          case 'carTraffic-4':
            paramObj = this.car_traffic_4;
            break;
          case 'carTraffic-5':
            paramObj = this.car_traffic_5;
            break;
          case 'carTraffic-6':
            paramObj = this.car_traffic_6;
            break;

          case 'cmnTraffic-1':
            paramObj = this.cmn_traffic_1;
            break;
          case 'cmnTraffic-3':
            paramObj = this.cmn_traffic_3;
            break;

          case 'personTrip-1':
            paramObj = this.person_trip_1;
            break;
          case 'personTrip-2':
            paramObj = this.person_trip_2;
            break;
          case 'personTrip-3':
            paramObj = this.person_trip_3;
            break;
          case 'personTrip-4':
            paramObj = this.person_trip_4;
            break;
          case 'personTrip-5':
            paramObj = this.person_trip_5;
            break;
          default:
            paramObj = MYCONF.GLOBAL_TIME;
            break;
        }
        let paramTime = {
          year:paramObj.year,
          season:paramObj.season,
          datetag:paramObj.datetag,
          hour:paramObj.hour,
        };
        this.setPanelTime(paramTime);
        // if(paramObj.timefollow){

          let bool = parseInt(paramObj.timefollow)===1?true:false;
          this.isTimeGlobal_tip = bool;
          this.updateGlobalFollow(bool)
        // }

        // if(paramObj.vilfollow && parseInt(paramObj.vilfollow) ===1){
        //   this.updateVilGlobalFollow(true);
        // }else{
        //   this.updateVilGlobalFollow(false);
        // }
      }

    },
    watch:{
      curDate(newVal){
        let dateTag = 0;
        switch (newVal) {
          case '非工作日':
            dateTag = 0;
            break;
          case '工作日':
            dateTag = 1;
            break;
          default:
            dateTag = 1;
            break;
        }
        this.updatePanelTime({datetag:dateTag});
      },
      curTime(newVal){
        this.updatePanelTime({hour:newVal});
      },
      curTimeSel(newVal){
        let hour = this.curTime;
        let timeTag = 1;
        switch (newVal) {
          case '早高峰':
            hour = 31;
            timeTag = 1;
            // this.curTime = 7;
            break;
          case '晚高峰':
            hour = 32;
            timeTag = 2;
            // this.curTime = 17;
            break;
          default:
            hour = this.curTime;
            break;
        }
        if(this.cur_menu.id === 'carTraffic-5'){
          this.filterCrossLayer(timeTag);
        }
        this.updatePanelTime({hour:hour});
        this.updateCurTimeSel(newVal);
      },
      isTimeGlobal_tip(newVal){
        this.updatePanelGlobal(newVal);
        this.updateGlobalFollow(newVal);
        // eventBus.$emit("updateObjTimeFllow",newVal);
      },
      t_update_time(newVal,oldVal){
        if(newVal && oldVal){
          this.isTimeGlobal_tip = false;
          this.updateGlobalFollow(false);
        }
      },

    },
    beforeDestroy() {
      eventBus.$off("getPanelParam");
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../common/common.scss";

  .box {
    margin-bottom: 1em;
    .disabled{
      pointer-events: none;
      opacity: 0.7;
    }
    p {
      margin: 0.6em 0;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        & > span:first-child {
          text-indent: 2.2em;
        }
        &.flex{
          & > span:first-child{
            min-width: 4.2em;
            text-align: left;
            white-space: nowrap;
          }
        }
        .time-group{
          flex: 1;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>
