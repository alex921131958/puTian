<template>
  <div id="map-legend" v-if="factor_show">
    <p v-if="factor_type==='背景速度' || factor_type==='影响后速度'">速度S(km/h):</p>
    <p v-if="factor_type==='背景饱和度' || factor_type==='影响后饱和度'">饱和度S:</p>
    <p v-if="factor_type==='速度影响'">影响后速度-背景速度D(km/h):</p>
    <p v-if="factor_type==='饱和度影响'">影响后饱和度-背景饱和度D:</p>
    <p v-if="factor_type==='背景服务水平' || factor_type==='影响后服务水平'">服务水平:</p>
    <p v-if="factor_type==='服务水平变化'">服务水平变化:</p>
    <ul v-if="factor_type==='背景速度' || factor_type==='影响后速度'">
      <li class="road" v-for="(item,index) in speedColors">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0"> S ≤ 10 </span>
        <span v-if="index === 1"> 10 < S ≤  20 </span>
        <span v-if="index === 2"> 20 < S ≤  35 </span>
        <span v-if="index === 3">  S > 35 </span>
      </li>
    </ul>
    <ul v-if="factor_type==='背景饱和度' || factor_type==='影响后饱和度'">
      <li class="road" v-for="(item,index) in saturationColors">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0">  S ≤ 60% </span>
        <span v-if="index === 1"> 60% < S ≤  80% </span>
        <span v-if="index === 2"> 80% < S ≤  100% </span>
        <span v-if="index === 3"> S > 100% </span>
      </li>
    </ul>
    <ul v-if="factor_type==='速度影响'">
      <li class="road" v-for="(item,index) in diffColors">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0">  D ≤ -3 </span>
        <span v-if="index === 1"> -3 < D ≤  -1 </span>
        <span v-if="index === 2"> -1 < D ≤  1 </span>
        <span v-if="index === 3"> 1 < D ≤  3 </span>
        <span v-if="index === 4"> D > 3 </span>
      </li>
    </ul>
    <ul v-if="factor_type==='饱和度影响'">
      <li class="road" v-for="(item,index) in saturationDifferColors">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0">  D ≤ -10% </span>
        <span v-if="index === 1"> -10% < D ≤  -3% </span>
        <span v-if="index === 2"> -3% < D ≤  3% </span>
        <span v-if="index === 3"> 3% < D ≤  10% </span>
        <span v-if="index === 4"> D > 10% </span>
      </li>
    </ul>
    <ul v-if="factor_type==='背景服务水平' || factor_type==='影响后服务水平'">
      <li class="road" v-for="(item,index) in serviceColor">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0"> 等级A、B </span>
        <span v-if="index === 1"> 等级C、D </span>
        <span v-if="index === 2"> 等级E、F </span>
      </li>
    </ul>
    <ul v-if="factor_type==='服务水平变化'">
      <li class="road" v-for="(item,index) in serviceDifferColor">
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
    name: 'WorkflowLegend',
    data () {
      return {
        title: '延时指数',
        speedColors: ['#8d211a','#e80e0e','#fbe019','#2c8c7f'],
        diffColors: ['#e80e0e','#fbe019','#ffffff','#2c8c7f','#3b90ee'],
        saturationColors: ['#2c8c7f','#fbe019','#e80e0e','#8d211a'],
        saturationDifferColors: ['#3b90ee','#2c8c7f','#ffffff','#fbe019','#e80e0e'],
        serviceColor:['#52A54C','#fbe019','#e80e0e'],
        serviceDifferColor:['#8d211a','#e80e0e','#ffffff','#87BA49','#2C8C7F'],
      }
    },
    mounted(){
    },
    computed: {
      ...mapGetters(['cur_step','cur_menu','factor_type','factor_show']),
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
