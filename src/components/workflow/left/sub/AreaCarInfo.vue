<template>
  <div class="box">
    <p class="title">地块机动车出行量预测</p>
    <div v-for="type in trafficIndex">
      <p class="sub-title" v-if="type==='daily'"><i class="icon iconfont icon-clock"></i>日交通量(pcu)</p>
      <p class="sub-title" v-if="type==='earlyPeak'"><i class="icon iconfont icon-early"></i>早高峰交通量(pcu/h)</p>
      <p class="sub-title" v-if="type==='latePeak'"><i class="icon iconfont icon-peark"></i>晚高峰交通量(pcu/h)</p>
      <p class="list">
        <span v-for="item in trafficType">{{setTraType(item)}} <span class="highlight">{{trafficInfo[type][item]}}</span></span>
      </p>
      <p class="list index">
        <span v-for="item in trafficType" v-if="tempTrafficVol[type][item]" class="text"><i class="icon iconfont icon-angle"></i>系数
          <!--<input class="index" type="text" v-model="tempTrafficVol[type][item]">-->
          <span class="index"><InputNumberComp v-model="tempTrafficVol[type][item]" :min="0.1" :max="10" :step="0.1"/></span></span>
      </p>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "AreaCarInfo",
    data() {
      return {
        tempTrafficVol: JSON.parse(JSON.stringify(FLOWCONF.CAR_TRAVEL_VOLUME)),
        trafficIndex:['daily','earlyPeak','latePeak'],
        trafficType:['generate','attract','count'],
      }
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
        // _this.tempTrafficVol = JSON.parse(JSON.stringify(_this.carTrafficVol));
      })
    },

    props: {
      trafficInfo: {
        type: Object
      },
      carTrafficVol: {
        type: Object
      }
    },
    computed: {
      ...mapGetters(['cur_step','index_travelVol']),
    },
    components: {
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateCurStep']),
      setTraType(type){
        switch (type){
          case 'generate':
            return '生成';
            break;
          case 'attract':
            return '吸引';
            break;
          case 'count':
            return '总量';
            break;
          default:
            return '生成';
            break;
        }
      },
      cimmitLandInfo(){
        this.$emit("cimmitLandInfo",this.tempTrafficVol);
      },
      initRatioPre(){
        this.tempTrafficVol = JSON.parse(JSON.stringify(this.index_travelVol));
      },
      setCurAreaType() {

      },
      setCarTrafficVol(data){
        this.tempTrafficVol = JSON.parse(JSON.stringify(data));
      }
    },
    watch: {
      tempTrafficVol(val){
        // console.log("tempTrafficVol-改变");
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    padding: 1rem;
    background-color: #322c00;
    p{
      height: 3rem;
      line-height: 3rem;
    }
    .title {
      color: $highlight;
      font-weight: 600;
    }
    .sub-title{
      color: $highlight;
      .icon{
        margin-right: 0.6rem;
      }
      .icon-clock{
        font-size: 1.2em;
      }
      .icon-early,.icon-peark{
        font-size: 0.9em;
      }
    }
    .list {
      line-height: 3rem;
      display: flex;
      justify-content: space-between;
      white-space: nowrap;
      &.index{
        justify-content: left;
        margin-bottom: 0.8rem;
        & > span{
          flex: 0.38;
          &.text{
            position: relative;
            .icon-angle{
              position: absolute;
              top: -1.4rem;
              left: 0;
              color: $highlight;
              opacity: 0.2;
              font-size: 1rem;
              transform: scale(0.5);
            }
          }
          input{
            width: 3rem;
            text-align: center;
            height: 1.8rem;
            border: none;
            border-bottom: 1px solid #fff;
            background-color: #221E00;
            color: #fff;
          }
        }
      }
      .highlight{
        color: $highlight;
        margin-left: 0.4rem;
      }
    }
  }
  @media(max-width: 1399px){
    .box {
      padding: 1rem 1rem 1rem 0.5rem;
    }
  }
</style>
