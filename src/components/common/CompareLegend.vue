<template>
  <div id="map-legend">
    <p v-if="layer_legend_type==='speed'">影响后速度D(km/h):</p>
    <p v-if="layer_legend_type==='speedCompare'">影响后速度差D(km/h):</p>
    <!--<p v-if="compareShowType==='flow'">影响后流量S:</p>-->
    <p v-if="layer_legend_type==='saturation'">影响后饱和度D:</p>
    <p v-if="layer_legend_type==='saturationCompare'">影响后饱和度差D:</p>
    <p v-if="layer_legend_type==='service'">影响后服务水平S:</p>
    <p v-if="layer_legend_type==='serviceCompare'">影响后服务水平差S:</p>
    <ul v-if="layer_legend_type==='speed'" v-for="(item,index) in speedColors">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0"> 0 ≤ D ≤  10 </span>
        <span v-if="index === 1"> 10 < D ≤  20 </span>
        <span v-if="index === 2"> 20 < D ≤  35 </span>
        <span v-if="index === 3"> D >  35 </span>
      </li>
    </ul>
    <ul v-if="layer_legend_type==='speedCompare'" v-for="(item,index) in diffColors">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0">  D ≤ -2 </span>
        <span v-if="index === 1"> -2 < D ≤  -0.5 </span>
        <span v-if="index === 2"> -0.5 < D ≤  0.5 </span>
        <span v-if="index === 3"> 0.5 < D ≤  2 </span>
        <span v-if="index === 4"> D > 2 </span>
      </li>
    </ul>
    <ul v-if="layer_legend_type==='saturation'" v-for="(item,index) in saturationColors">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0">  D ≤ 60% </span>
        <span v-if="index === 1"> 60% < D ≤  80% </span>
        <span v-if="index === 2"> 80% < D ≤  100% </span>
        <span v-if="index === 3"> D > 100% </span>
      </li>
    </ul>
    <ul v-if="layer_legend_type==='saturationCompare'" v-for="(item,index) in saturationDifferColors">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0">  D ≤ -10% </span>
        <span v-if="index === 1"> -10% < D ≤  -3% </span>
        <span v-if="index === 2"> -3% < D ≤  3% </span>
        <span v-if="index === 3"> 3% < D ≤  10% </span>
        <span v-if="index === 4"> D > 10% </span>
      </li>
    </ul>
    <ul v-if="layer_legend_type==='service'" v-for="(item,index) in serviceColor">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0"> 等级A、B </span>
        <span v-if="index === 1"> 等级C、D </span>
        <span v-if="index === 2"> 等级E、F </span>
      </li>
    </ul>
    <ul v-if="layer_legend_type==='serviceCompare'" v-for="(item,index) in serviceDifferColor">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0"> 恶化两级及以上 </span>
        <span v-if="index === 1"> 恶化一级 </span>
        <span v-if="index === 2"> 未改变 </span>
        <span v-if="index === 3"> 改善一级 </span>
        <span v-if="index === 4"> 改善两级及以上 </span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../util/event-bus'
  import MYCONF from '../../myconf'
  import FLOWCONF from '../../components/workflow/flowConf'
  export default {
    name: 'CompareLegend',
    data () {
      return {
        title: '延时指数',
        speedColors: ['#8d211a','#e80e0e','#fbe019','#2c8c7f'],
        diffColors: ['#e80e0e','#fbe019','#ffffff','#2c8c7f','#3b90ee'],
        saturationColors: ['#2c8c7f','#fbe019','#e80e0e','#8d211a'],
        saturationDifferColors: ['#3b90ee','#2c8c7f','#ffffff','#fbe019','#e80e0e'],
        serviceColor:['#2c8c7f','#fbe019','#e80e0e'],
        serviceDifferColor:['#8d211a','#e80e0e','#ffffff','#87BA49','#2C8C7F'],
      }
    },
    mounted(){
    },
    computed: {
      ...mapGetters(['cur_step','cur_menu','compareShowType','speedProject','flowProject','saturationProject',
        'serviceProject','layer_legend_type']),
    },
    methods: {
    },
    watch: {
    }
  }
</script>

<style scoped lang="scss">
  #map-legend {
    position: absolute;
    /*left: 15px;*/
    bottom: 2rem;
    right: 1rem;
    /*top: 20px;*/
    width: 15rem;
    padding: 0.8rem 0.3rem;
    min-height: 10rem;
    background-color: rgba(242, 242, 242, 0.5);
    border: 1px solid rgba(207, 207, 207, 0.7);
    z-index: 100;
    color: #000;
    text-align: left;
    &.bus-speed{
      width: 9rem;
    }
    p{
      text-indent: 2px;
      letter-spacing: 1px;
      /*opacity: 0.9;*/
      .small-tip{
        opacity: 0.8;
      }
    }
    ul{
      list-style: none;
      padding-left: 0.5rem;
      margin-top: 0.6rem;
      li{
        height: 1.8rem;
        line-height: 1.8rem;
        .color-tip{
          display: inline-block;
          vertical-align: middle;
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.4rem;
        }
      }
    }
  }
</style>
