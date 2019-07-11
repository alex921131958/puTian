<template>
  <div class="box">
    <p class="ctl-title">
      <span @click="setPanelState"><i :class="['icon iconfont icon-Arrow',isPanelOpen?'':'down']"></i>{{title}}</span>
    </p>
    <transition name="fade">
      <div v-if="isPanelOpen">
        <p class="list">
          <span :class="['btn len',isClickActive?'active':'']" @click="setDynamicPlay">{{dynamic_title}}</span>
          <span :class="['btn',!isClickActive?'active':'']" @click="endDynamic">{{suspend_title}}</span>
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
  import dynamicPlayHandler from '../../../service/common/dynamicPlayHandler'


  export default {
    name: 'DynamicPlay',
    data() {
      return {
        isPanelOpen: true,
        isClickActive:true,
        dynamic_title: '逐小时动态播放人口变化',
        timeTemp: null,
        isHourlyShow:false,
        hourTemp:5,
        suspend_title: '暂停',
        isSuspend: false,
      }
    },
    mounted() {
      this.controller = new dynamicPlayHandler(this);
    },
    computed: {
      ...mapGetters(['isRoadEditable','panel_time','link_id','link_list','isVillageEditable','village_id','village_list',
        'distance_type']),
    },
    props: {
      title:{
        type:String
      }
    },
    components: {
      RoadList,
    },
    methods: {
      ...mapMutations(['updateRoadEditable','updateDisplayMode','updateTravelMode','updateOnlyDistrict','updateDistrictMode',
        'updateMergeDisplay','updateLineDistrict','updateDistanceType','updatePanelTime','updateHourlyPlay']),
      setPanelState(){
        this.isPanelOpen=!this.isPanelOpen;
        this.$emit('DynamicPlay');
      },
      setDynamicPlay(){
        this.isHourlyShow = !this.isHourlyShow;
        this.dynamic_title = this.isHourlyShow?'关闭逐小时播放人口变化':'逐小时动态播放人口变化';
        if (this.isHourlyShow){
          this.hourTemp = this.panel_time.hour;
          this.controller.hourlyGridLayer(this.hourTemp);
          this.timeTemp = setInterval(()=>{
            if (this.hourTemp <= 22){
              this.hourTemp = this.hourTemp +1;
            } else if (this.hourTemp === 23) {
              this.hourTemp = 31;
            }else if (this.hourTemp === 31){
              this.hourTemp = 32;
            } else{
              this.hourTemp = 5;
            }
            if (this.panel_time.hour === 33){
              this.hourTemp = 5
            }
            this.controller.hourlyGridLayer(this.hourTemp)
          },3000)
        }else{
          clearInterval(this.timeTemp);
          this.timeTemp = null;
          this.controller.hourlyGridLayer();
        }
      },
      endDynamic(){
        this.isSuspend = !this.isSuspend;
        this.suspend_title = this.isSuspend? '开始':'暂停';
        if(this.isSuspend){
          clearInterval(this.timeTemp);
          this.timeTemp = null;
        }else{
          this.controller.hourlyGridLayer(this.hourTemp + 1);
          this.timeTemp = setInterval(()=>{
            if (this.hourTemp <= 22){
              this.hourTemp = this.hourTemp +1;
            } else if (this.hourTemp === 23) {
              this.hourTemp = 31;
            }else if (this.hourTemp === 31){
              this.hourTemp = 32;
            } else{
              this.hourTemp = 5;
            }
            if (this.panel_time.hour === 33){
              this.hourTemp = 5
            }
            this.controller.hourlyGridLayer(this.hourTemp)
          },3000)
        }
      },
    },
    watch:{

    }
  }

</script>



<style scoped lang="scss">
  @import "../../../common/common.scss";

  .box {
    margin-bottom: 1em;
    hr{
      margin-left: 2.2em;
      opacity: 0.3;
      border-width: 0.01em;
    }
    p {
      margin: 0.6em 0;
      &.ctl-title {
        text-align: left;
        font-weight: bolder;
        margin-top: 2em;
        & > span {
          cursor: pointer;
          letter-spacing: 2px;
          font-size: $font-arrow;
          .icon-Arrow{
            position: relative;
            top: -0.2em;
            display: inline-block;
            font-size: 0.6em;
            opacity: 0.6;
            margin-right: 0.5em;
            transform: rotate(360deg);
            transition: all ease-in-out 0.3s;
            &.down{
              transform: rotate(270deg);
              transition: all ease-in-out 0.3s;
            }
          }
        }

      }
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
          width: 10em;
          margin-right: 0.7em;
          background-color: #adadad;
          cursor: pointer;
          color: #000;
          letter-spacing: 1px;
          &.len{
            flex: 1;
          }
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
