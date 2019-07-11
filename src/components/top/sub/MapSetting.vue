<template>
  <div id="box">
    <p class="list">
      <span>基础要素图层</span>
      <span class="switch"><SwitchComp v-model="baseLayer"/></span>
    </p>
    <p class="list sub">
      <span>县区边界</span>
      <span class="switch"><SwitchComp v-model="adminBoundsShow"/></span>
    </p>
    <p class="list sub">
      <span>设施POI</span>
      <span class="switch"><SwitchComp v-model="poiShow"/></span>
    </p>
    <p class="list sub">
      <span>地名</span>
      <span class="switch"><SwitchComp v-model="adminFlagShow"/></span>
    </p>
    <p class="list sub">
      <span>路名</span>
      <span class="switch"><SwitchComp v-model="roadNameShow"/></span>
    </p>
    <p class="list">
      <span>绿地、水体、功能用地</span>
      <span class="switch"><SwitchComp v-model="greenWaterShow"/></span>
    </p>
    <p class="list">
      <span>地图蒙版(黑)</span>
      <span class="switch"><SwitchComp v-model="mapMaskShow"/></span>
    </p>
    <p class="list">
      <span>地图蒙版(白)</span>
      <span class="switch"><SwitchComp v-model="lightMaskShow"/></span>
    </p>
    <p class="list">
      <span>现状用地</span>
      <span class="switch"><SwitchComp v-model="landUseShow"/></span>
    </p>
    <p class="btn">
      <span :class="['btn',curBtn==='confirm'?'active':'']" @click="setMapSetting">确  认</span>
      <span :class="['btn',curBtn==='cancel'?'active':'']" @click="cancelMapSetting">取  消</span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../myconf'
  import eventBus from '../../../util/event-bus'
  export default {
    name: "MapSetting",
    data() {
      return {
        curBtn:'confirm',
        adminBoundsShow:true,
        poiShow:true,
        adminFlagShow:true,
        roadNameShow:true,
        greenWaterShow:true,
        mapMaskShow:false,
        lightMaskShow:false,
        landUseShow:false,
        baseLayer:true,
      }
    },
    computed: {
      ...mapGetters(['cur_tab','map_setting','cur_route']),
    },
    mounted(){
      this.$nextTick(() => {
        this.resetSetting();
      });
    },
    methods:{
      ...mapMutations(['updateCurTab','updateMapSetting']),
      setMapSetting(){
        this.updateMapSetting({
          admin_bounds:this.adminBoundsShow,
          poi_show:this.poiShow,
          admin_flag:this.adminFlagShow,
          road_name:this.roadNameShow,
          green_water:this.greenWaterShow,
          map_mask:this.mapMaskShow,
          light_mask:this.lightMaskShow,
          land_use:this.landUseShow,
        });
        eventBus.$emit("displayMapSetting");
        this.updateCurTab('');
      },
      cancelMapSetting(){
        this.resetSetting();
        this.updateCurTab('');
      },
      resetSetting(){
        this.adminBoundsShow = this.map_setting.admin_bounds;
        this.poiShow = this.map_setting.poi_show;
        this.adminFlagShow = this.map_setting.admin_flag;
        this.roadNameShow = this.map_setting.road_name;
        this.greenWaterShow = this.map_setting.green_water;
        this.mapMaskShow = this.map_setting.map_mask;
        this.lightMaskShow = this.map_setting.light_mask;
        this.landUseShow = this.map_setting.land_use;
      }
    },
    watch:{
      baseLayer(newVal){
        this.adminBoundsShow = newVal;
        this.poiShow = newVal;
        this.adminFlagShow = newVal;
        this.roadNameShow = newVal;
      },
      mapMaskShow(newVal){
        if(newVal){
          this.lightMaskShow = false;
        }
      },
      lightMaskShow(newVal){
        if(newVal){
          this.mapMaskShow = false;
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #box {
    position: absolute;
    top: 4em;
    left: 0;
    width: 21em;
    height: 29em;
    background-color: #555;
    z-index: 500;
    padding: 1em 1.5em;
    p{
      margin: 0.2em 0;
      &.list{
        display: flex;
        justify-content: space-between;
        line-height: 2.5em;
        span:first-child{

        }
        &.sub{
          text-indent: 1.5em;
          span:first-child{
            opacity: 0.9;
          }
        }
      }
      &.btn {
        display: flex;
        justify-content: flex-end;
        span.btn {
          width: 8em;
          margin-left: 1em;
          height: 2.6em;
          line-height: 2.6em;
          margin-top: 0.2em;
          background-color: #adadad;
          transition: all ease-in-out 0.3s;
          &.active,&:hover{
            background-color: $bg-red;
            transition: all ease-in-out 0.3s;
          }
        }
      }
    }
  }

</style>
