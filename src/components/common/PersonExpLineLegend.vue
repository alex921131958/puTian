<template>
  <div id="map-legend">
    <p>出行期望D(人次/小时):</p>
    <ul v-for="(item,index) in RoadColors" v-if="cur_menu.id === 'personTrip-1' && line_layer_legend==='全方式od'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> D > 414 </span>
        <span v-if="index === 5"> 242 < D ≤ 414 </span>
        <span v-if="index === 4"> 148 < D ≤ 242 </span>
        <span v-if="index === 3"> 94 < D ≤ 148 </span>
        <span v-if="index === 2"> 58 < D ≤ 94 </span>
        <span v-if="index === 1"> 32 < D ≤ 58 </span>
        <span v-if="index === 0"> 5 < D ≤ 32 </span>
      </li>
    </ul>
    <ul v-for="(item,index) in RoadColors" v-if="cur_menu.id === 'personTrip-5' && line_layer_legend==='建成区od'">
      <li class="road">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span v-if="index === 6"> D > 101 </span>
        <span v-if="index === 5"> 59 < D ≤ 101 </span>
        <span v-if="index === 4"> 36 < D ≤ 59 </span>
        <span v-if="index === 3"> 23 < D ≤ 36 </span>
        <span v-if="index === 2"> 14 < D ≤ 23 </span>
        <span v-if="index === 1"> 8 < D ≤ 14 </span>
        <span v-if="index === 0"> 5 < D ≤ 8 </span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../util/event-bus'
  import MYCONF from '../../myconf'
  export default {
    name: 'PersonExpLineLegend',
    data () {
      return {
        RoadColors: ['#2B83BA', '#80BFAC','#C7E9AD','#FFFFBF','#FEC980','#F17C4A','#D7191C'],
      }
    },
    mounted(){
    },
    computed: {
      ...mapGetters(['cur_menu','line_layer_legend']),
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
    left: 1rem;
    /*top: 20px;*/
    width: 13rem;
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
          height: 0.2rem;
          margin-right: 0.4rem;
        }
      }
    }
  }
</style>
