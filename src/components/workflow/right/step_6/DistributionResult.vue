<template>
  <div class="box">
    <p class="list">
      <span class="range">流量显示上限(pcu/h)</span>
      <span class="response"><SliderComp v-model="rangeMax" :min="500" :max="2000" :step="5" show-input @on-change="putFlowMax"/></span>
      <span class="reset" @click="resetFlowMax"><i class="icon iconfont icon-refresh"></i></span>
    </p>

    <p class="list">
      <span class="range">流量显示下限(pcu/h)</span>
      <span class="response"><SliderComp v-model="rangeMin" :min="1" :max="500" :step="1" show-input @on-change="putFlowMin"/></span>
      <span class="reset" @click="resetFlowMin"><i class="icon iconfont icon-refresh"></i></span>
    </p>

    <p class="list">
      <span class="slide">分配流量显示比例</span>
      <!--<span class="response"><SliderComp v-model="flow_width" :min="-100" :max="50" :step="1" show-input @on-change="putFlowWidth"/></span>-->
      <RatioSlider :bufferRatio="flow_width" ref="addSlider" @ratioChange="putFlowWidth"/>
    </p>

    <p class="list">
      <span class="slide">参考现状交通量显示比例</span>
      <!--<span class="response"><SliderComp v-model="base_width" :min="-100" :max="50" :step="1" show-input @on-change="putBaseWidth"/></span>-->
      <RatioSlider :bufferRatio="base_width" ref="baseSlider" @ratioChange="putBaseWidth"/>
    </p>

    <p class="list">
      <span class="range">交通分配流量颜色</span>
      <span class="switch"><ColorPickerComp v-model="flow_color['road']" :colors="colors" @on-change="putFlowColor"/></span>
    </p>

    <p class="list">
      <span class="range">参考现状交通量颜色</span>
      <span class="switch"><ColorPickerComp v-model="flow_color['year']" :colors="colors" @on-change="putBaseColor"/></span>
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
        flow_width: FLOWCONF.ADD_WIDTH,  //交通分配
        base_width: FLOWCONF.BASE_WIDTH,  //背景
        flow_color:{
          road: '#111111',
          year: '#3B90EE'
        },
        colors: MYCONF.COLOR_PICKER,
        isLabelShow: true,
        isAreaShow: true,
      }
    },
    props: {
      newFlowMax: {
        type: Number
      },
      newFlowMin: {
        type: Number
      },
      //flow-交通分配
      newFlowWidth: {
        type: Number
      },
      newBaseWidth: {
        type: Number
      },
      newFlowColor: {
        type: String
      },
      newBaseColor: {
        type: String
      },
    },
    components: {
      TitleSwitch,
      RatioSlider
    },
    methods: {
      ...mapMutations([]),
      putFlowMax(data){
        this.$emit("putFlowMax",data);
      },
      putFlowMin(data){
        this.$emit("putFlowMin",data);
      },
      putFlowWidth(data){
        this.$emit("putFlowWidth",data);
      },
      putBaseWidth(data){
        this.$emit("putBaseWidth",data);
      },
      putFlowColor(data){
        this.$emit("putFlowColor",data);
      },
      putBaseColor(data){
        this.$emit("putBaseColor",data);
      },

      resetFlowMax(){

      },
      resetFlowMin(){

      },
    },
    watch:{
      newFlowMax(val){
          this.rangeMax = val;
      },
      newFlowMin(val){
          this.rangeMin = val;
      },
      newFlowWidth(val){
          this.flow_width = val;
      },
      newBaseWidth(val){
          this.base_width = val;
      },
      newFlowColor(val){
        if(val){
          this.flow_color['road'] = val;
        }
      },
      newBaseColor(val){
        if(val){
          this.flow_color['year'] = val;
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

  @media(max-width: 1599px){
    .box {
      p{
        &.list{
          & > span:first-child {
            text-indent: 1.2em;
          }
        }
      }
    }
  }
</style>
