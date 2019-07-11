<template>
  <div class="box">
    <p class="list">
      <span class="range">流量显示上限(辆/h)</span>
      <span class="response"><SliderComp v-model="rangeMax" :min="500" :max="10000" :step="5" show-input @on-change="setFlowMax"/></span>
      <span class="reset"><i class="icon iconfont icon-refresh"></i></span>
    </p>

    <p class="list">
      <span class="range">流量显示下限(辆/h)</span>
      <span class="response"><SliderComp v-model="rangeMin" :min="0" :max="1000" :step="1" show-input @on-change="setFlowMin"/></span>
      <span class="reset"><i class="icon iconfont icon-refresh"></i></span>
    </p>

    <p class="list">
      <span class="slide">道路流量显示比例</span>
      <!--<span class="response"><SliderComp v-model="flow_width" :min="-100" :max="50" :step="1" show-input @on-change="setFlowWidth"/></span>-->
      <RatioSlider :bufferRatio="flow_width" ref="ratioSlider" @ratioChange="setFlowWidth"/>
    </p>

    <p class="list">
      <span class="slide">参考现状交通量显示比例</span>
      <!--<span class="response"><SliderComp v-model="background_width" :min="-100" :max="50" :step="1" show-input @on-change="setBackgroundWidth"/></span>-->
      <RatioSlider :bufferRatio="background_width" ref="ratioSlider" @ratioChange="setBackgroundWidth"/>
    </p>

    <p class="list">
      <span class="range">规划道路相关流量颜色</span>
      <span class="switch"><ColorPickerComp v-model="flow_color" :colors="colors" @on-change="setFlowColor"/></span>
    </p>

    <p class="list">
      <span class="range">参考现状交通量颜色</span>
      <span class="switch"><ColorPickerComp v-model="background_color" :colors="colors" @on-change="setTrafficColor"/></span>
    </p>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import FLOWCONF from '../../flowConf'
  import MYCONF from '../../../../myconf'
  import TitleSwitch from '../common/TitleSwitch'
  import RatioSlider from '../../../common/RatioSlider'

  export default {
    name: '',
    data() {
      return{
        rangeMax: 1000,
        rangeMin: 1,
        flow_width: FLOWCONF.BUFFER_COMMON,
        background_width: FLOWCONF.BUFFER_COMMON,
        trafficIndex:['daily','earlyPeak','latePeak'],
        temp_trafficVol: JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_VOLUME)),
        flow_color: '#3B90EE',
        background_color:'#E63D35',
        colors: MYCONF.COLOR_PICKER,
        isLabelShow: true,
        isAreaShow: true
      }
    },
    props: {
      newFlowMax: {
        type: Number
      },
      newFlowMin: {
        type: Number
      },
      newFlowWidth: {
        type: Number
      },
      newBackgroundWidth: {
        type: Number
      },
      newFlowColor: {
        type: String
      },
      newTrafficColor: {
        type: String
      },
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          _this.rangeMax = _this.newFlowMax;
          _this.rangeMin = _this.newFlowMin;
          _this.flow_width = _this.newFlowWidth;
          _this.background_width = _this.newBackgroundWidth;
          _this.flow_color = _this.newFlowColor;
          _this.background_color = _this.newTrafficColor;
        },150);
      })
    },
    components: {
      TitleSwitch,
      RatioSlider
    },
    methods: {
      ...mapMutations([]),
      setFlowMax(data){
        this.$emit("setFlowMax",data);
      },
      setFlowMin(data){
        this.$emit("setFlowMin",data);
      },
      setFlowWidth(data){
        this.flow_width = data;
        this.$emit("setFlowWidth",data);
      },
      setBackgroundWidth(data){
        this.background_width = data;
        this.$emit("setBackgroundWidth",data);
      },
      setFlowColor(data){
        this.$emit("setFlowColor",data);
      },
      setTrafficColor(data){
        this.$emit("setTrafficColor",data);
      },
    },
    watch:{
      newFlowMax(val){
        if(val){
          this.rangeMax = val;
        }
      },
      newFlowMin(val){
        if(val){
          this.rangeMin = val;
        }
      },
      newFlowWidth(val){
        if(val){
          this.flow_width = val;
        }
      },
      newBackgroundWidth(val){
        if(val){
          this.background_width = val;
        }
      },
      newFlowColor(val){
        if(val){
          this.flow_color = val;
        }
      },
      newTrafficColor(val){
        if(val){
          this.background_color = val;
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p {
      line-height: 3rem;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        margin-top: 0.5em;
        /*text-indent: 2.2em;*/
      }
      span {
        &.range {
          width: 13em;
          text-align: left;
          text-indent: 2.2em;
        }
        &.response {
          flex: 1;
        }
        &.reset{
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          width: 2.5em;
          height: 2.5em;
          margin-left: 0.5em;
          margin-top: 0.3rem;
          background-color: #666;
          line-height: 2.5em;
          cursor: pointer;
          .icon{
            color: #000;
            font-size: 1.4em;
          }
        }
        &.slide {
          text-indent: 2.2em;
          width: 16em;
          text-align: left;
        }
      }
    }


  }

</style>
