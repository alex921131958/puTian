<template>
  <div class="box">
    <p class="title"><span>A.土地开发出行量 调整系数预设</span> <i class="icon iconfont icon-warn"></i></p>
    <p class="list list-item" v-for="(item,index) in trafficIndex">
      <span v-if="index===0">日出行量</span>
      <span v-if="index===1">早高峰出行量</span>
      <span v-if="index===2">晚高峰出行量</span>
      <span>
        <span class="tip">生成</span>
        <InputNumberComp v-model="temp_travelVol[item].generate" :min="0" :max="50" :step="0.1" size="large" :formatter="value => value.toFixed(1)" class="radio"
                         @on-change="landItemChange(temp_travelVol[item].related,item,'generate',temp_travelVol[item].generate)"/>
        <i :class="['icon iconfont icon-lujing',temp_travelVol[item].related?'active':'']" @click="changeRelated(item)"></i>
        <span class="tip">吸引</span>
      <InputNumberComp v-model="temp_travelVol[item].attract" :min="0" :max="50" :step="0.1" size="large" :formatter="value => value.toFixed(1)" class="radio"
                       @on-change="landItemChange(temp_travelVol[item].related,item,'attract',temp_travelVol[item].attract)"/>
      <span class="reset" @click="resetLandItem(item)"><i class="icon iconfont icon-refresh"></i></span>
      </span>
    </p>
    <p class="title"><span>B.规划道路相关出行量/背景交通量 调整系数预设</span> <i class="icon iconfont icon-warn"></i></p>
    <p class="list list-item" v-for="(item,index) in trafficIndex">
      <span v-if="index===0">日相关交通量</span>
      <span v-if="index===1">早高峰相关交通量</span>
      <span v-if="index===2">晚高峰相关交通量</span>
      <span>
        <InputNumberComp v-model="temp_trafficVol[item]" :min="0" :max="50" :step="0.1" size="large" :formatter="value => value.toFixed(1)"
                         class="radio" @on-change="updateTraVol(item,temp_trafficVol[item])"/>
        <span class="reset"  @click="resetRoadItem(item)"><i class="icon iconfont icon-refresh"></i></span>
      </span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "RatioPreSetting",
    data() {
      return {
        temp_travelVol: JSON.parse(JSON.stringify(FLOWCONF.TRAVEL_VOLUME)),
        temp_trafficVol: JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_VOLUME)),
        trafficIndex:['daily','earlyPeak','latePeak'],
      }
    },
    props: {
      landVolume: {
        type: Object
      },
      roadVolume: {
        type: Object
      }
    },
    mounted() {
      let _this = this;
      /*setTimeout(() => {
        // _this.updateVolume();
      },300)*/
    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {},
    methods: {
      ...mapMutations(['updateTravelIndex','updateTrafficIndex']),
      isInteger(obj) {
        return obj % 1 === 0;
      },
      updateVolume(land,road){
        let landVolume = land?land:this.landVolume;
        let roadVolume = road?road:this.roadVolume;
        this.temp_travelVol = JSON.parse(JSON.stringify(landVolume));
        this.temp_trafficVol = JSON.parse(JSON.stringify(roadVolume));
      },
      changeRelated(item){
        let type = this.temp_travelVol[item].related;
        this.$set(this.temp_travelVol[item],'related',!type);
      },
      resetLandItem(item){
        let travelObj = this.landVolume;
        this.$set(this.temp_travelVol[item],'generate',travelObj[item].generate);
        this.$set(this.temp_travelVol[item],'attract',travelObj[item].attract);
      },
      resetRoadItem(item){
        let trafficObj = this.roadVolume;
        this.$set(this.temp_trafficVol,item,trafficObj[item]);
      },
      landItemChange(bool,type,item,val){   //是否关联，类型，字段，值
        let otherItem = item==='generate'?'attract':'generate';
        if(bool){
          this.$set(this.temp_travelVol[type],otherItem,val);
        }
        // this.$emit("landItemChange", bool,type,item,val);
      },
      updateTraVol(key,val) {
        // let obj = {};
        // obj[key] = val;
        // this.$emit("updateTrafficVol", obj);
      },
      updateRatioPreSetting(){
        this.$emit("landItemChange", this.temp_travelVol);
        this.$emit("updateTrafficVol", this.temp_trafficVol);
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p {
      line-height: 3rem;
      &.title {
        font-weight: 600;
        text-indent: 2.2em;
        margin-top: 0.8rem;
        .icon-warn{
          color: #666;
          margin-left: 0.6rem;
          font-size: 1.1em;
        }
      }
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3.4em;
        white-space: nowrap;
        &.list-item{
          opacity: 0.8;
          .icon-lujing{
            font-size: 0.6rem;
            margin: 0 1em;
            cursor: pointer;
            &.active{
              color: $highlight;
            }
          }
          .tip{
            margin-right: 0.2rem;
          }
          .radio{
            margin-top: -0.2rem;
          }
        }
        & > span:first-child {
          text-indent: 2.2em;
        }
        span{
          &.reset{
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            width: 2.5em;
            height: 2.5em;
            margin-left: 0.5em;
            background-color: #666;
            line-height: 2.5em;
            cursor: pointer;
            .icon{
              color: #000;
              font-size: 1.4em;
            }
          }
        }
      }
    }
  }

  @media(max-width: 1399px) {
    .box{
      p{
        &.title {
          text-indent: 1.2em;
        }
        &.list{
          & > span:first-child {
            text-indent: 1.2em;
          }
          &.list-item{
            .icon-lujing{
              margin: 0 0.1em;
            }
          }
          span{
            &.reset{
              margin-left: 0.1em;
            }
          }
        }
      }
    }
  }

  @media (min-width:1600px) and (max-width:1910px){
    .box{
      p{
        &.list{
          &.list-item{
            .icon-lujing{
              margin: 0 0.3em;
            }
          }
          span{
            &.reset{
              margin-left: 0.1em;
            }
          }
        }
      }
    }
  }
</style>
