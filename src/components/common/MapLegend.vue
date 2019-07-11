<template>
  <div id="map-legend" :class="{'bus-speed':layer_legend_type==='公交运行速度'&& cur_step!==4}">
    <p v-if="cur_menu.id==='cmnTraffic-1' && layer_legend_type==='公交运行速度' || cur_menu.id==='carTraffic-1'">拥堵情况:</p>
    <p v-if="cur_menu.id==='cmnTraffic-1' && layer_legend_type==='小汽车-公交速度差'">小汽车-公交速度差S(km/h):</p>
    <p v-if="colorType==='彩色' && cur_step===4">交通量预测T(pcu/h):</p>
    <ul v-for="(item,index) in RoadColors" v-if="cur_menu.id==='cmnTraffic-1' && layer_legend_type==='公交运行速度' || cur_menu.id==='carTraffic-1'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 2"> 拥堵 </span>
        <span v-if="index === 1"> 缓慢 </span>
        <span v-if="index === 0"> 畅通 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in colors" v-if="cur_menu.id==='cmnTraffic-1' && layer_legend_type==='小汽车-公交速度差'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 3">  S > 15 </span>
        <span v-if="index === 2"> 8 < S ≤  15 </span>
        <span v-if="index === 1"> 0 < S ≤  8 </span>
        <span v-if="index === 0"> S ≤ 0 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in landOdColors" v-if="colorType==='彩色' && cur_step===4">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 0"> T < {{landOdRange[0]}} </span>
        <span v-if="index === 1"> {{landOdRange[0]}} ≤ T <  {{landOdRange[1]}} </span>
        <span v-if="index === 2"> {{landOdRange[1]}} ≤ T <  {{landOdRange[2]}} </span>
        <span v-if="index === 3"> {{landOdRange[2]}} ≤ T <  {{landOdRange[3]}} </span>
        <span v-if="index === 4">  T ≥ {{landOdRange[3]}} </span>
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
    name: 'MapLegend',
    data () {
      return {
        title: '延时指数',
        colors: ['#2c7dbc','#2c8c7f', '#fbe019','#d33027'],
        RoadColors: ['#2c8c7f', '#fbe019','#d33027'],
        index_range:[],   //指标值集合
        isRoadShow:false,   //自动切换-道路
        isPoygonShow:false,   //自动切换-行政区
        landOdColors:FLOWCONF.LANDODCOLORS,
        landOdRange:FLOWCONF.LANDODRANGE,
      }
    },
    mounted(){
    },
    computed: {
      ...mapGetters(['bus_speed_type','colorType','cur_step','cur_menu','layer_legend_type']),
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
