<template>
  <div id="map-legend">
    <p>用地性质:</p>
    <ul>
      <li class="road" v-for="(item,index) in colorList">
        <span class="color-tip" :style="{backgroundColor:item}"></span>
        <span> {{landDesc[index]}}</span>
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
    name: 'LanduseType',
    data() {
      return {
        colorList: ["#fb9a99","#ff1201","#dddddd","#80e96f","#abdda4","#d8f0d4","#a6cee3","#d6e9f2","#96c7ea","#ec9600","#b87400","#865500","#ffffbf","#ffea01","#ffd901","#8c59dd","#b89ce3","#c3c3c3"],
        landType:["A-1/A-2/A-3/A-33/A-4/A-7/A-9","B-1","E-9","A-5","G-1","G-2","G3/S42","H-12","H-14","H-4","M-1","M-2","M-3","R-1","R-2","R-3","S-3","S-9","U-12"],
        landDesc:["行政办公用地/文化设施用地/教育科研用地/中小学用地/体育用地/医疗卫生用地/文物古迹用地宗教用地","商业用地","其它非建设用地","公园绿地","防护绿地","广场用地/社会停车场用地","镇建设用地","村庄建设用地","特殊性质的用地","一类工业用地","二类工业用地","三类工业用地","一类居住用地","二类居住用地","三类居住用地","交通枢纽用地","其他交通设施用地","供电用地"],
      }
    },
    mounted() {
    },
    computed: {
      ...mapGetters(['bus_speed_type', 'colorType', 'cur_step', 'cur_menu', 'layer_legend_type']),
    },
    methods: {},
    watch: {}
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
    /*background-color: #fff;*/
    border: 1px solid rgba(207, 207, 207, 0.7);
    z-index: 100;
    color: #000;
    text-align: left;
    &.bus-speed {
      width: 9rem;
    }
    p {
      text-indent: 2px;
      letter-spacing: 1px;
      /*opacity: 0.9;*/
      .small-tip {
        opacity: 0.8;
      }
    }
    ul {
      list-style: none;
      padding-left: 0.5rem;
      margin-top: 0.6rem;
      li {
        &:first-child{
          height: 6.8rem;
        }
        height: 1.7rem;
        line-height: 1.7rem;
        .color-tip {
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
