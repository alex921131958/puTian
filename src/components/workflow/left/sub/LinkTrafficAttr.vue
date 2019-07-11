<template>
  <div class="box">
    <p class="list">
      <span>通行能力/限速/车道
      <i class="icon iconfont icon-warn"></i>
      </span>
    </p>
    <p class="list" v-for="type in listType">
      <span>上/下</span>
      <input class="index" type="text" v-model.lazy="tempTrafficInfo[type]['upper']" :input="upperChange(type)">
      <input class="index" type="text" v-model.lazy="tempTrafficInfo[type]['lower']" v-if="road_single === 1">
      <input class="index" type="text" v-model="temp" v-if="road_single === 0" :disabled="road_single===0">
      <span v-if="type==='traffic'">pcu/h</span>
      <span v-if="type==='speed'">km/h</span>
      <span v-if="type==='roadWay'">车道</span>
      <span class="auto" @click="linkAttrAuto(type)">Auto</span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "LinkBaseAttr",
    data() {
      return {
        tempTrafficInfo: FLOWCONF.LINK_TRAFFIC_INFO,
        temp: 0,
        listType:['traffic','speed','roadWay']
      }
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          _this.tempTrafficInfo = Object.assign({}, _this.trafficInfo)
        },150);
      })
    },
    props: {
      trafficInfo: {
        type: Object
      }
    },
    computed: {
      ...mapGetters(['cur_step','road_single']),
    },
    components: {
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateCurStep']),
      linkAttrAuto(type){
        this.tempTrafficInfo[type]['lower'] = this.tempTrafficInfo[type]['upper']
      },
      upperChange(data){
      }
    },
    watch: {
      trafficInfo(newVal){
        this.tempTrafficInfo = newVal
      },
      'tempTrafficInfo.traffic.upper': {
        handler(newVal) {
          this.$emit('linkInfo',this.tempTrafficInfo);
        },
      },
      'tempTrafficInfo.traffic.lower': {
        handler(newVal) {
          this.$emit('linkInfo',this.tempTrafficInfo);
        },
      },
      'tempTrafficInfo.speed.upper': {
        handler(newVal) {
          this.$emit('linkInfo',this.tempTrafficInfo);
        },
      },
      'tempTrafficInfo.speed.lower': {
        handler(newVal) {
          this.$emit('linkInfo',this.tempTrafficInfo);
        },
      },
      'tempTrafficInfo.roadWay.upper': {
        handler(newVal) {
          this.$emit('linkInfo',this.tempTrafficInfo);
        },
      },
      'tempTrafficInfo.roadWay.lower': {
        handler(newVal) {
          this.$emit('linkInfo',this.tempTrafficInfo);
        },
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    padding: 1.5rem 1rem;
    .title {
      color: $highlight;
      font-weight: 600;
    }
    .list {
      line-height: 2rem;
      margin-top: 1rem;
      display: flex;
      justify-content: space-between;
      input{
        width: 3.6rem;
        text-align: center;
        height: 1.8rem;
        border: none;
        border-bottom: 1px solid #fff;
        background-color: #322c00;
        color: #fff;
      }
      span {
        &.auto{
          width:2.4rem;
          height: 2.1rem;
          line-height: 2.2rem;
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          background-color: $highlight;
          color: #333;
          font-size: 0.8em;
          cursor: pointer;
        }
      }
      &.large {
        input {
          width: 12rem;
        }
      }
      &.normal {
        input {
          width: 6rem;
          text-align: right;
        }
      }
      &.small {
        input {
          width: 4rem;
          text-align: right;
        }
      }
    }
  }

  @media(max-width: 1599px){
    .box{
      .list{
        input{
          width: 2.8rem;
        }
      }
    }
  }
  @media(max-width: 1399px){
    .box {
      padding: 1.5rem 1rem 1.5rem 0.5rem;
    }
  }
</style>
