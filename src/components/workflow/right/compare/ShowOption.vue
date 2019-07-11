<template>
  <div class="box">
    <p class="tab-p">
      <span @click="setCurShowTab('speed')" :class="{active:curShowTab==='speed'}">速度影响</span>
      <span @click="setCurShowTab('flow')" :class="{active:curShowTab==='flow'}">流量影响</span>
      <span @click="setCurShowTab('saturation')" :class="{active:curShowTab==='saturation'}">饱和度影响</span>
      <span @click="setCurShowTab('service')" :class="{active:curShowTab==='service'}">服务水平影响</span>
    </p>

    <div v-if="curShowTab==='speed'">
      <p class="list">
        <span>显示内容</span>
        <i-select v-model="speedShowItem" style="width:10em;" @on-change="setSpeedType">
          <i-option v-for="item in speedShowOption" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </p>
      <SubSwitch title="显示速度标注值" :isShow="isSpeedShow" @setSubSwitchToggle="setSubSwitchToggle('speed')"/>
    </div>
    <div v-if="curShowTab==='flow'">
      <p class="list">
        <span>显示内容</span>
        <i-select v-model="flowShowItem" style="width:10em;" @on-change="setFlowType">
          <i-option v-for="item in flowShowOption" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </p>
      <p class="list">
        <span class="range">流量显示上限(pcu/h)</span>
        <span class="response"><SliderComp v-model="flowMax" :min="500" :max="2000" :step="5" show-input @on-change="putFlowMax"/></span>
      </p>
      <p class="list">
        <span class="range">流量显示下限(pcu/h)</span>
        <span class="response"><SliderComp v-model="flowMin" :min="1" :max="500" :step="1" show-input @on-change="putFlowMin"/></span>
      </p>
      <p class="list">
        <span class="range">分配流量显示比例</span>
        <RatioSlider :bufferRatio="flow_width" ref="addSlider" @ratioChange="putFlowWidth"/>
      </p>

      <p class="list" v-if="flowShowItem!=='方案比较'">
        <span class="range">交通分配流量颜色</span>
        <span class="switch"><ColorPickerComp v-model="trafficAssignColor" :colors="colors" @on-change="putFlowColor"/></span>
      </p>

      <p class="list" v-if="flowShowItem==='方案比较'">
        <span class="range">两方案相同流量颜色</span>
        <span class="switch"><ColorPickerComp v-model="planSameColor" :colors="colors" @on-change="putSameColor"/></span>
      </p>
      <p class="list" v-if="flowShowItem==='方案比较'">
        <span class="range">方案2相比方案1增多流量</span>
        <span class="switch"><ColorPickerComp v-model="planLargeColor" :colors="colors" @on-change="putLargeColor"/></span>
      </p>
      <p class="list" v-if="flowShowItem==='方案比较'">
        <span class="range">方案2相比方案1减少流量</span>
        <span class="switch"><ColorPickerComp v-model="planSmallColor" :colors="colors" @on-change="putSmallColor"/></span>
      </p>
      <SubSwitch title="显示流量标注值" :isShow="isFlowShow" @setSubSwitchToggle="setSubSwitchToggle('flow')"/>
    </div>
    <div v-if="curShowTab==='saturation'">
      <p class="list">
        <span>显示内容</span>
        <i-select v-model="saturationShowItem" style="width:10em;" @on-change="setSaturationType">
          <i-option v-for="item in saturationShowOption" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </p>
      <SubSwitch title="显示饱和度标注值" :isShow="isSaturationShow" @setSubSwitchToggle="setSubSwitchToggle('saturation')"/>
    </div>
    <div v-if="curShowTab==='service'">
      <p class="list">
        <span>显示内容</span>
        <i-select v-model="serviceShowItem" style="width:10em;" @on-change="setServiceType">
          <i-option v-for="item in serviceShowOption" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </p>
      <SubSwitch title="显示服务水平标注值" :isShow="isServiceShow" @setSubSwitchToggle="setSubSwitchToggle('service')"/>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import eventBus from '../../../../util/event-bus'
  import FLOWCONF from '../../flowConf'
  import SubSwitch from '../common/SubSwitch'
  import mapCommonLayer from '../../../../service/map/mapCommonLayer'
  import compareHandler from '../../../../service/workflow/compareHandler'
  import RatioSlider from '../../../common/RatioSlider'

  export default {
    name: "ShowOption",
    data() {
      return {
        curShowTab: 'speed',
        isSpeedShow: true,
        isFlowShow: true,
        isSaturationShow: true,
        isServiceShow: true,
        flowShowOption: JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM)),
        flowShowItem: JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM))[0].label,
        speedShowOption: JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM)),
        speedShowItem: JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM))[0].label,
        saturationShowOption:JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM)),
        saturationShowItem: JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM))[0].label,
        serviceShowOption: JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM)),
        serviceShowItem: JSON.parse(JSON.stringify(FLOWCONF.COMPAREITEM))[0].label,
        flowMax: 1000,
        flowMin: 1,
        // flow_width: FLOWCONF.ADD_WIDTH,  //交通分配  0
        flow_width: 4,  //交通分配  0
        base_width: FLOWCONF.BASE_WIDTH,  //背景
        flowWidthMax: 1,
        assignLarge: 1,
        trafficAssignColor: '#3B90EE',
        planYearColor: '#E63D35',
        planSameColor: '#2F2F2F',
        planLargeColor: '#E63D35',
        planSmallColor: '#00B38E',
        colors: MYCONF.COLOR_PICKER,
      }
    },
    props: {

    },
    mounted() {

    },
    computed: {
      ...mapGetters(['cur_step']),
      compareColors: function (){
        return [
          [-100, this.planSmallColor],
          [-0.01, this.planSameColor],
          [0.01, this.planLargeColor],]
      }
    },
    components: {
      SubSwitch,
      RatioSlider,
    },
    methods: {
      ...mapMutations(['updateCompareShowType','updateSpeedProject','updateFlowProject','updateSaturationProject',
        'updateServiceProject', 'updateFlowCompareHigher','updateFlowCompareLower','updateFlowCompareWidth',
        'updateFlowCompareCoefficient','updateFlowAssignColor', 'updateFlowCompareBackgroundColor','updateFlowEqualColor',
        'updateFlowMorethanColor','updateFlowLessthanColor','updateLayerLegendType','updateCompareLabelShow'
      ]),
      setCurShowTab(type){
        this.curShowTab = type;
        this.updateCompareShowType(type)
      },
      putFlowMax(data){
        this.updateFlowCompareHigher(data)
      },
      putFlowMin(data){
        this.updateFlowCompareLower(data);
        let layerId = this.flowShowItem ==='方案比较'? 'flow-compare-buffer': 'flow-buffer';
        compareHandler.addCompareFlowFilter(layerId, data);
      },
      putFlowWidth(data){
        this.updateFlowCompareWidth(data);
        let layerId = this.flowShowItem ==='方案比较'? 'flow-compare-buffer': 'flow-buffer';
        compareHandler.changeCompareFlowWidth(layerId, data)
      },
      //交通分配
      putFlowColor(data){
        this.updateFlowAssignColor(data);
        mapCommonLayer.setBufferColor('flow-buffer', data)
      },
      putSameColor(data){
        this.updateFlowEqualColor(data);
        mapCommonLayer.setCompareBufferColor('flow-compare-buffer', this.compareColors)
      },
      putLargeColor(data){
        this.updateFlowMorethanColor(data);
        mapCommonLayer.setCompareBufferColor('flow-compare-buffer', this.compareColors)
      },
      putSmallColor(data){
        this.updateFlowLessthanColor(data);
        mapCommonLayer.setCompareBufferColor('flow-compare-buffer', this.compareColors)
      },
      setSubSwitchToggle(data){

        switch (data){
          case 'speed':
            this.isSpeedShow = !this.isSpeedShow;
            compareHandler.layerShowHide(data, this.isSpeedShow);
            this.updateCompareLabelShow({'speed': this.isSpeedShow});
            break;
          case 'flow':
            this.isFlowShow = !this.isFlowShow;
            compareHandler.layerShowHide(data, this.isFlowShow);
            this.updateCompareLabelShow({'flow': this.isFlowShow});
            break;
          case 'saturation':
            this.isSaturationShow = !this.isSaturationShow;
            compareHandler.layerShowHide(data, this.isSaturationShow);
            this.updateCompareLabelShow({'saturation': this.isSaturationShow});
            break;
          case 'service':
            this.isServiceShow = !this.isServiceShow;
            compareHandler.layerShowHide(data, this.isServiceShow);
            this.updateCompareLabelShow({'service': this.isServiceShow});
            break
        }
      },

      setSpeedType(data){
        this.updateSpeedProject(data)
      },
      setFlowType(data){
        if(data === '方案比较'){
          this.flow_width = 7;
        }else{
          this.flow_width =4;
        }
        this.updateFlowProject(data)
      },
      setSaturationType(data){
        this.updateSaturationProject(data)
      },
      setServiceType(data){
        this.updateServiceProject(data)
      },
    },
    watch:{
      // curShowTab(val){
      //   this.updateLayerLegendType('')
      // }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p{
      &.list{
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        & > span:first-child {
          text-indent: 2.2em;
        }
      }
      span {
        &.range {
          width: 14em;
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
      &.tab-p{
        line-height: 2em;
        margin: 0.4em 0 1.5em 1em;
        span{
          opacity: 0.6;
          font-weight: bold;
          display: inline-block;
          padding: 3px;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          &:hover,&.active{
            opacity: 1;
            border-color: $bg-red;
          }
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
