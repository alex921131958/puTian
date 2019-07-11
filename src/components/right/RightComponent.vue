<template>
  <transition name="move">
    <div id="right" class="box" v-show="panel_show">
      <transition name="fade">
        <EasyScrollbar :barOption="listBar">
          <CarTraffic_1 v-if="cur_menu.id === 'carTraffic-1'"/>
          <CarTraffic_2 v-if="cur_menu.id === 'carTraffic-2'"/>
          <CarTraffic_3 v-if="cur_menu.id === 'carTraffic-3'"/>
          <CarTraffic_4 v-if="cur_menu.id === 'carTraffic-4'"/>
          <CarTraffic_5 v-if="cur_menu.id === 'carTraffic-5'"/>
          <CarTraffic_6 v-if="cur_menu.id === 'carTraffic-6'"/>

          <BusTraffic_1 v-if="cur_menu.id === 'cmnTraffic-1'"/>
          <BusTraffic_2 v-if="cur_menu.id === 'cmnTraffic-2'"/>
          <BusTraffic_3 v-if="cur_menu.id === 'cmnTraffic-3'"/>
          <BusTraffic_4 v-if="cur_menu.id === 'cmnTraffic-4'"/>
          <BusTraffic_5 v-if="cur_menu.id === 'cmnTraffic-5'"/>
          <BusTraffic_6 v-if="cur_menu.id === 'cmnTraffic-6'"/>

          <PerTraffic_1 v-if="cur_menu.id === 'personTrip-1'"/>
          <PerTraffic_2 v-if="cur_menu.id === 'personTrip-2'"/>
          <PerTraffic_3 v-if="cur_menu.id === 'personTrip-3'"/>
          <PerTraffic_4 v-if="cur_menu.id === 'personTrip-4'"/>
          <PerTraffic_5 v-if="cur_menu.id === 'personTrip-5'"/>

          <NewStep v-if="cur_menu.id === 'new'"/>
          <OpenStep v-if="cur_menu.id === 'edit'"/>
        </EasyScrollbar>
      </transition>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../myconf'
  import CarTraffic_1 from './carTraffic/CarTraffic_1'
  import CarTraffic_2 from './carTraffic/CarTraffic_2'
  import CarTraffic_3 from './carTraffic/CarTraffic_3'
  import CarTraffic_4 from './carTraffic/CarTraffic_4'
  import CarTraffic_5 from './carTraffic/CarTraffic_5'
  import CarTraffic_6 from './carTraffic/CarTraffic_6'
  import BusTraffic_1 from './busTraffic/BusTraffic_1'
  import BusTraffic_2 from './busTraffic/BusTraffic_2'
  import BusTraffic_3 from './busTraffic/BusTraffic_3'
  import BusTraffic_4 from './busTraffic/BusTraffic_4'
  import BusTraffic_5 from './busTraffic/BusTraffic_5'
  import BusTraffic_6 from './busTraffic/BusTraffic_6'
  import PerTraffic_1 from './perTraffic/PerTraffic_1'
  import PerTraffic_2 from './perTraffic/PerTraffic_2'
  import PerTraffic_3 from './perTraffic/PerTraffic_3'
  import PerTraffic_4 from './perTraffic/PerTraffic_4'
  import PerTraffic_5 from './perTraffic/PerTraffic_5'
  import NewStep from './workflow/NewStep'
  import OpenStep from './workflow/OpenStep'
  export default {
    name: "RightComponent",
    data() {
      return {
        listBar: {
          barColor: "#464645",   //滚动条颜色
          barWidth: 2,           //滚动条宽度
          railColor: "transparent",     //导轨颜色
          barMarginRight: 1,     //垂直滚动条距离整个容器右侧距离单位（px）
          barMaginBottom: 0,     //水平滚动条距离底部距离单位（px)
          barOpacityMin: 0.6,      //滚动条非激活状态下的透明度
          zIndex: "auto",        //滚动条z-Index
          autohidemode: true,     //自动隐藏模式
          horizrailenabled: false,//是否显示水平滚动条
        },
      }
    },
    components: {
      CarTraffic_1,
      CarTraffic_2,
      CarTraffic_3,
      CarTraffic_4,
      CarTraffic_5,
      CarTraffic_6,
      BusTraffic_1,
      BusTraffic_2,
      BusTraffic_3,
      BusTraffic_4,
      BusTraffic_5,
      BusTraffic_6,
      PerTraffic_1,
      PerTraffic_2,
      PerTraffic_3,
      PerTraffic_4,
      PerTraffic_5,
      NewStep,
      OpenStep,
    },
    computed: {
      ...mapGetters(['panel_show', 'cur_menu','selected_only','cur_route']),
    },
    methods: {
      ...mapMutations(['updatePanelSow','updateSelectedOnly','updatePanelTime','updateGlobalFollow','updateOverAll',
      'updateOverAll2','updateOverAll3','updateOverAll4','updateOverAll5','updateCurBusLine'])
    },
    watch:{
      cur_menu(newVal) {
        // TODO:个体出行因为未存参数，暂置默认值
        this.updatePanelTime(MYCONF.GLOBAL_TIME);
        this.updateSelectedOnly(false);
        this.updateOverAll(false);
        this.updateOverAll2(false);
        this.updateOverAll3(false);
        this.updateOverAll4(false);
        this.updateOverAll5(false);
        this.updateCurBusLine(null);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../common/common.scss";
  @media(max-width: 1399px) {
    #right{
      flex: 0 0 $panel-small;
    }
  }
  @media (min-width:1400px) and (max-width:1599px){
    #right{
      flex: 0 0 $panel-middle;
    }
  }
  @media (min-width:1600px) and (max-width:1919px){
    #right{
      flex: 0 0 $panel-middle;
    }
  }

  @media (min-width:1920px){
    #right{
      flex: 0 0 $panel-large;
    }
  }

  #right {
    background-color: rgba(36, 36, 35, 1);
    /*filter: blur(2px);*/
    position: relative;
    color: #fff;
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
      opacity: 0;
    }

    .box .move-enter-active, .box .move-leave-active {
      transition: all 0.5s linear;
      transform: translate3d(0, 0, 0);
    }
    .box .move-enter, .box .move-leave {
      transform: translate3d(-100%, 0, 0);
    }
  }
</style>
