<template>
  <div id="box">
    <p class="list">
      <span>统计年度</span>
      <i-select v-model="curYear" style="width:10em;" @on-change="setCurYear">
        <i-option v-for="item in yearList" :value="item.value" :key="item.value" :disabled="item.value!==2018">{{ item.label }}</i-option>
      </i-select>
    </p>
    <p class="list">
      <span>统计季节</span>
      <i-select v-model="curSeason" style="width:10em;" @on-change="setCurSeason">
        <i-option v-for="item in seasonList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </p>
    <p class="list">
      <span>日期类型</span>
      <RadioGroupComp v-model="curDatetag" @on-change="setDateType">
        <RadioComp :label="item" v-for="item in dateList" :key="item"></RadioComp>
      </RadioGroupComp>
    </p>
    <p class="list flex">
      <span>时间范围</span>
      <RadioGroupComp class="time-group" v-model="curTimeSel" @on-change="setTimeType">
        <RadioComp :label="item" v-for="item in timeSel" :key="item"></RadioComp>
      </RadioGroupComp>
      <InputNumberComp v-model="curHour" :min="5" :max="23" :formatter="value => `${value}:00 ~ ${value+1}:00`"
                       size="large" :disabled="curTimeSel!==''" @on-change="setTimeHour"/>
    </p>
    <!--<p class="list">-->
      <!--<span>随调节动态更新 <span class="tip"> 点击取消将放弃本次调节</span></span>-->
      <!--<span class="switch"><SwitchComp/></span>-->
    <!--</p>-->
    <p class="btn">
      <span :class="['btn',curBtn==='confirm'?'active':'']" @click="saveGlobalTime">确  认</span>
      <span :class="['btn',curBtn==='cancel'?'active':'']" @click="updateCurTab('')">取  消</span>
    </p>
  </div>
</template>

<script>
  import MYCONF from '../../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../util/event-bus'

  export default {
    name: "GlobalTime",
    data() {
      return {
        yearList: MYCONF.YEAR_LIST,
        curYear:MYCONF.YEAR_LIST[0].label,
        seasonList: MYCONF.GLOBAL_SEASON_LIST,
        dateList: MYCONF.DATE_LIST,
        curBtn: 'confirm',
        timeSel: ['早高峰', '晚高峰', ''],
        curTimeSel: '',
        curHour:MYCONF.GLOBAL_TIME.hour,
        curSeason:MYCONF.SEASON_LIST[0].label,
        curDatetag:MYCONF.DATE_LIST[0],
        cur_time:{
          year:MYCONF.GLOBAL_TIME.year,
          season:MYCONF.GLOBAL_TIME.season,
          hour:MYCONF.GLOBAL_TIME.hour,
          datetag:MYCONF.GLOBAL_TIME.datetag
        }
      }
    },
    computed: {
      ...mapGetters(['cur_tab','global_time','menu_list']),
    },
    mounted(){
      this.$nextTick(() => {
        this.setPanelTime(this.global_time);
      })
    },
    methods: {
      ...mapMutations(['updateCurTab','updateGlobalTime','updateTUpdateTime','updateMenuList']),
      setCurYear(data) {
        this.cur_time.year =data;
      },
      setTimeType(data){
        if(data === '早高峰'){
          this.cur_time.hour = 31;
        }else if(data === '晚高峰'){
          this.cur_time.hour = 32;
        }else{
          this.cur_time.hour = this.curHour;
        }
      },
      setTimeHour(){
        this.cur_time.hour = this.curHour;
      },
      setDateType(data){
        if(data === '工作日'){
          this.cur_time.datetag = 1;
        }else if(data === '非工作日'){
          this.cur_time.datetag = 0;
        }
      },
      setCurSeason(data) {
        let curSeason = 0;
        switch (data) {
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
        this.cur_time.season =curSeason;
      },
      setPanelTime(obj){
        let year = obj.year;
        let season = obj.season;
        let datetag = obj.datetag;
        let hour = obj.hour;
        this.curYear = year;
        this.curSeason = season === 1?'第一季度':season === 2?'第二季度':season === 3?'第三季度':season === 4?'第四季度':'全年';
        this.curDatetag = datetag===1?'工作日':'非工作日';
        this.curHour = hour===31||hour===32 ? 8:hour;
        this.curTimeSel = hour===31?'早高峰':hour===32?'晚高峰':'';
      },
      saveGlobalTime() {
        let keys = Object.keys(this.cur_time);
        let values = Object.values(this.cur_time);
        let url = MYCONF.service.saveTime + `token=${sessionStorage.getItem('token')}&keys=${keys}&values=${values}`;
        let list = [];
        let that = this;
        if(this.global_time.year === this.cur_time.year && this.global_time.season === this.cur_time.season && this.global_time.datetag === this.cur_time.datetag && this.global_time.hour === this.cur_time.hour){
          this.updateCurTab('');
        }else{
          this.$http.get(url).then(response => {
            response = response.body;
            that.updateGlobalTime(that.cur_time);
            that.updateTUpdateTime(response.msg);
            eventBus.$emit("updateGlobalTime");
          });
          this.updateCurTab('');
          //置灰左侧menu列表全局时间
          this.disabledMenuList();
          //更新所有已存全局时间字段
          this.disabledGlobalTime();
        }
      },
      disabledMenuList(){
        let menuList = this.menu_list;
        menuList.map((item) => {
          let list = item.menuList;
          list.map((menu) => {
            if(menu.globaltime){
              menu.globaltime = false;
            }
          })
        });
        this.updateMenuList(menuList);
      },
      disabledGlobalTime(){
        let that = this;
        let url = MYCONF.service.disabledGlobalUrl + `token=${sessionStorage.getItem('token')}&filter=timefollow&value=0`;
        this.$http.get(url).then(response => {
          response = response.body;
          if(response){
            that.$Message.warning({
              content: '提示：更改全局时间，将导致之前的相关全局设置失效',
              closable: true,
              duration:4
            });
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #box {
    position: absolute;
    top: 4em;
    left: 0;
    width: 30em;
    height: 17.4em;
    background-color: #555;
    z-index: 500;
    padding: 1em 2em;
    .list {
      display: flex;
      justify-content: space-between;
      line-height: 3em;
      .tip {
        color: #eee;
        opacity: 0.5;
      }
      &.flex {
        & > span:first-child {
          min-width: 4em;
          text-align: left;
        }
      }
      .time-group {
        flex: 1;
        display: flex;
        justify-content: space-between;
      }
    }
    p.btn {
      display: flex;
      justify-content: flex-end;
      span.btn {
        width: 8em;
        margin-left: 1em;
        height: 2.8em;
        line-height: 2.8em;
        margin-top: 0.7em;
        background-color: #adadad;
        transition: all ease-in-out 0.3s;
        &.active, &:hover {
          background-color: $bg-red;
          transition: all ease-in-out 0.3s;
        }
      }
    }
  }

</style>
