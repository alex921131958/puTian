<template>
  <div id="map-legend">
    <p v-if="cur_menu.id === 'personTrip-1' && layer_legend_type==='交通生成量'">交通生成量T(人次/小时):</p>
    <p v-if="cur_menu.id === 'personTrip-1' && layer_legend_type==='交通吸引量'">交通吸引量T(人次/小时):</p>
    <p v-if="cur_menu.id === 'personTrip-1' && layer_legend_type==='生成吸引总量'">生成吸引总量T(人次/小时):</p>
    <p v-if="cur_menu.id === 'personTrip-1' && layer_legend_type==='生成吸引比'">生成吸引比T(人次/小时):</p>
    <p v-if="cur_menu.id === 'personTrip-2' && layer_legend_type==='分时动态人口'">人口数量P(人):</p>
    <p v-if="cur_menu.id === 'personTrip-3' && layer_legend_type==='平均出行距离'">出行距离D(千米):</p>
    <p v-if="cur_menu.id === 'personTrip-3' && layer_legend_type==='平均出行时间'">出行时间T(分钟):</p>
    <p v-if="cur_menu.id === 'personTrip-4' && layer_legend_type==='居住人口'">居住人口P(人):</p>
    <p v-if="cur_menu.id === 'personTrip-4' && layer_legend_type==='就职人口'">就职人口P(人):</p>
    <p v-if="cur_menu.id === 'personTrip-4' && layer_legend_type==='职住比'">职住比R:</p>
    <!--<p v-if="cur_menu.id === 'personTrip-5' && layer_legend_type==='建成区od'">出行强度T(人次/小时):</p>-->
    <ul v-for="(item,index) in RoadColors"  v-if="cur_menu.id === 'personTrip-1' && (layer_legend_type==='交通生成量'||layer_legend_type==='交通吸引量')">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> T > 2304 </span>
        <span v-if="index === 5"> 1538 < T ≤ 2304 </span>
        <span v-if="index === 4"> 1020 < T ≤ 1538 </span>
        <span v-if="index === 3"> 672 < T ≤ 1020 </span>
        <span v-if="index === 2"> 382 < T ≤ 672 </span>
        <span v-if="index === 1"> 128 < T ≤ 382 </span>
        <span v-if="index === 0"> 24 < T ≤ 128 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in RoadColors"  v-if="cur_menu.id === 'personTrip-1' && (layer_legend_type==='生成吸引总量')">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> T > 4608 </span>
        <span v-if="index === 5"> 3076 < T ≤ 4608 </span>
        <span v-if="index === 4"> 2040 < T ≤ 3076 </span>
        <span v-if="index === 3"> 1344 < T ≤ 2040 </span>
        <span v-if="index === 2"> 764 < T ≤ 1344 </span>
        <span v-if="index === 1"> 256 < T ≤ 764 </span>
        <span v-if="index === 0"> 48 < T ≤ 256 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in rangeColors"  v-if="cur_menu.id === 'personTrip-1' && (layer_legend_type==='生成吸引比')">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> T > 7.5 </span>
        <span v-if="index === 5"> 5.25 < T ≤ 7.5 </span>
        <span v-if="index === 4"> 3.67 < T ≤ 5.25 </span>
        <span v-if="index === 3"> 2.58 < T ≤ 3.67 </span>
        <span v-if="index === 2"> 1.2 < T ≤ 2.58 </span>
        <span v-if="index === 1"> 0.8 < T ≤ 1.2 </span>
        <span v-if="index === 0"> 0.12 < T ≤ 0.8 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in personTrip2" v-if="cur_menu.id === 'personTrip-2' && layer_legend_type==='分时动态人口'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> P > 18245 </span>
        <span v-if="index === 5"> 12445 < P ≤ 18245 </span>
        <span v-if="index === 4"> 7350 < P ≤ 12445 </span>
        <span v-if="index === 3"> 4245 < P ≤ 7350 </span>
        <span v-if="index === 2"> 2305 < P ≤ 4245 </span>
        <span v-if="index === 1"> 770 < P ≤ 2305 </span>
        <span v-if="index === 0"> 220 < P ≤ 770 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in RoadColors"  v-if="cur_menu.id === 'personTrip-3' && layer_legend_type==='平均出行距离'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> D > 9.8 </span>
        <span v-if="index === 5"> 6.7 < D ≤ 9.8 </span>
        <span v-if="index === 4"> 4.8 < D ≤ 6.7 </span>
        <span v-if="index === 3"> 3.6 < D ≤ 4.8 </span>
        <span v-if="index === 2"> 2.7 < D ≤ 3.6 </span>
        <span v-if="index === 1"> 2 < D ≤ 2.7 </span>
        <span v-if="index === 0"> 0.6 < D ≤ 2 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in RoadColors"  v-if="cur_menu.id === 'personTrip-3' && layer_legend_type==='平均出行时间'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> T > 134 </span>
        <span v-if="index === 5"> 105 < T ≤ 134 </span>
        <span v-if="index === 4"> 86 < T ≤ 105 </span>
        <span v-if="index === 3"> 72 < T ≤ 86 </span>
        <span v-if="index === 2"> 61 < T ≤ 72 </span>
        <span v-if="index === 1"> 50 < T ≤ 61 </span>
        <span v-if="index === 0"> 11 < T ≤ 50 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in RoadColors" v-if="cur_menu.id === 'personTrip-4' && layer_legend_type==='居住人口'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> P > 18000 </span>
        <span v-if="index === 5"> 11916 < P ≤ 18000 </span>
        <span v-if="index === 4"> 7794 < P ≤ 11916 </span>
        <span v-if="index === 3"> 4586 < P ≤ 7794 </span>
        <span v-if="index === 2"> 2503 < P ≤ 4586 </span>
        <span v-if="index === 1"> 833 < P ≤ 2503 </span>
        <span v-if="index === 0"> 10< P ≤ 833 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in RoadColors" v-if="cur_menu.id === 'personTrip-4' && layer_legend_type==='就职人口'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> P > 7151 </span>
        <span v-if="index === 5"> 4389 < P ≤ 7151 </span>
        <span v-if="index === 4"> 2973 < P ≤ 4389 </span>
        <span v-if="index === 3"> 1855 < P ≤ 2973 </span>
        <span v-if="index === 2"> 1038 < P ≤ 1855 </span>
        <span v-if="index === 1"> 354 < P ≤ 1038 </span>
        <span v-if="index === 0"> 3 < P ≤ 354 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in personTrip2" v-if="cur_menu.id === 'personTrip-4' && layer_legend_type==='职住比'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> R > 3.91 </span>
        <span v-if="index === 5"> 2.36 < R ≤ 3.91 </span>
        <span v-if="index === 4"> 1.59 < R ≤ 2.36 </span>
        <span v-if="index === 3"> 1.1 < R ≤ 1.59 </span>
        <span v-if="index === 2"> 0.9 < R ≤ 1.1 </span>
        <span v-if="index === 1"> 0.47 < R ≤ 0.9 </span>
        <span v-if="index === 0"> R ≤ 0.47 </span>
      </li>
    </ul>
    <!--<ul v-for="(item,index) in RoadColors"  v-if="cur_menu.id === 'personTrip-5' && layer_legend_type==='建成区od'">-->
      <!--<li class="road">-->
        <!--<span class="color-tip" :style="{backgroundColor:item}"></span>-->
        <!--<span v-if="index === 5"> T > 100 </span>-->
        <!--<span v-if="index === 4"> 50 < T ≤ 100 </span>-->
        <!--<span v-if="index === 3"> 30 < T ≤ 50 </span>-->
        <!--<span v-if="index === 2"> 10 < T ≤ 30 </span>-->
        <!--<span v-if="index === 1"> 5 < T ≤ 10 </span>-->
        <!--<span v-if="index === 0"> 1 < T ≤ 5 </span>-->
      <!--</li>-->
    <!--</ul>-->
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../util/event-bus'
  import MYCONF from '../../myconf'
  export default {
    name: 'PersonTripLegend',
    data () {
      return {
        RoadColors: ['#2B83BA', '#80BFAC','#C7E9AD','#FFFFBF','#FEC980','#F17C4A','#cc0000'],
        rangeColors: ['#cc0000','#F17C4A','#FEC980','#FFFFBF','#C7E9AD','#80BFAC','#2B83BA'],
        personTrip2: ['#2B83BA', '#80BFAC','#C7E9AD','#FFFFBF','#FEC980','#F17C4A','#cc0000'],
        personTrip3: ['#2B83BA', '#ABDDA4','#FFFFBF','#FDAE61','#D7191C'],
      }
    },
    mounted(){
    },
    computed: {
      ...mapGetters(['cur_menu','traver_analy','residence_list','layer_legend_type']),
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
    bottom: 2rem;
    right: 1rem;
    width: 13rem;
    /*width: 173px;*/
    /*height: 268px;*/
    padding: 0.8rem 0.3rem;
    min-height: 10rem;
    background-color: rgba(242, 242, 242, 0.5);
    border: 1px solid rgba(207, 207, 207, 0.6);
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
