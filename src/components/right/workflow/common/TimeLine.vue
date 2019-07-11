<template>
  <div id="time-line">
    <div class="time-line-control">
      <span @click="deleteTime"><i class="icon iconfont icon-del"></i></span>
      <span @click="changeEndStart">
        <i class="icon iconfont icon-pause" v-if="timeStatus"></i>
        <i class="icon iconfont icon-play" v-if="!timeStatus"></i>
      </span>
      <span @click="addTime"><i class="icon iconfont icon-add"></i></span>
    </div>
    <SliderComp v-model="sliderTime" :min="5" :max="25" :step="1" class="timeConf" show-tip="hover"></SliderComp>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'

  export default {
    name: 'TimeLine',
    data () {
      return {
        sliderTime: 5,
        timeStatus: false,
        timeControl: null,
      }
    },
    mounted(){
      // this.changeTimeFunc()
    },
    computed: {
      ...mapGetters(['cur_step','cur_menu']),
    },
    methods: {
      changeEndStart(){
        this.timeStatus = !this.timeStatus;
        if (this.timeStatus) {

        }
      },
      changeTimeFunc(){
        this.sliderTime += 1;
        let _this = this;
        this.timeControl = setInterval(()=>{
          if (_this.sliderTime === 25) _this.sliderTime = 4;
          _this.sliderTime += 1
        },3000);
      },
      deleteTime(){
        if (this.sliderTime === 5) this.sliderTime = 26;
        this.sliderTime -= 1
      },
      addTime(){
        if (this.sliderTime === 25) this.sliderTime = 4;
        this.sliderTime += 1
      },
    },
    watch: {
      timeStatus(val){
        if (val){
          this.changeTimeFunc()
        } else {
          clearInterval(this.timeControl)
        }
      },
      sliderTime(val){
        let data = val;
        if (val === 24) data = 31;
        if (val === 25) data = 32;
        eventBus.$emit('hourChange',data)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";
  #time-line{
    position: absolute;
    bottom: 1em;
    left: 32em;
    z-index: 1;
    width: 40em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
    .time-line-control{
      display: flex;
      justify-content: center;
      span{
        position: relative;
        top: 0.5em;
        margin-left: 1.5em;
        margin-right: 1.5em;
      }
      .icon{
        cursor: pointer;
      }
    }

  }
</style>
