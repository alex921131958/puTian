<template>
  <div id="container">
    <TopComponent/>
    <div id="content">
      <LeftComponent/>
      <MapContainer v-show="!data_source_page"/>
      <RightComponent v-show="!data_source_page"/>
      <DataResource v-show="data_source_page"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import TopComponent from './top/TopComponent'
  import LeftComponent from './left/LeftComponent'
  import RightComponent from './right/RightComponent'
  import MapContainer from './MapContainer'
  import DataResource from './DataResource'
  import workBenchHandler from '../service/common/workBenchHandler'
  import MYCONF from '../myconf'
  import env from '../common/env'
  export default {
    name: 'WorkBench',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
      }
    },
    created(){
      let _this = this;
      if(!sessionStorage.getItem("token")){
        setTimeout(() => {
          _this.$router.push({path: '/login'});
          let paths = location.href.split('\/');
          paths[paths.length-1] = 'login';
          window.location.href=paths.join("/");
          window.location.reload();
        },200);
      }
    },
    components:{
      TopComponent,
      LeftComponent,
      RightComponent,
      MapContainer,
      DataResource,
    },
    mounted(){
      setTimeout(this.loading_tip,20);
      this.updateLoadingTip(null);
      this.controller = new workBenchHandler(this);
      this.getGlobalList();
      this.updateCurMenu(MYCONF.CUR_MENU);
      this.updateCurTab('');//初始化头部全局设置

      let _this= this;
      if(this.loading_tip){
        setTimeout(_this.loading_tip,0);
        _this.updateLoadingTip(null);
      }
    },
    computed: {
      ...mapGetters(['area_list','global_time','global_village','global_area', 'global_v_type','v_update_time','bus_line_list','loading_tip'
      ,'data_source_page']),
    },
    methods: {
      ...mapMutations(['updateGlobalTime', 'updateGlobalVillage','updateAreaList','updateGlobalArea','updateGlobalVType',
      'updateGlobalVillageIds','updateGlobalVillageNames','updateVUpdateTime','updateTUpdateTime','updateBusLineList',
        'updateTempVillage','updateTempVillageIds','updateTempVillageNames','updateCurMenu','updateCurTab','updateLoadingTip']),
      getGlobalList(){
        // this.controller.getAreaList();
        this.controller.getBusLineList();
        this.controller.getGlobalTime();
        this.controller.getGlobalVillage();
        //this.controller.asynScript();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../common/common.scss";
  #container{
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    #content{
      display: flex;
      height: calc(100vh - 4em);
      /*flex: 1;*/
      /*z-index: -1;*/
    }
  }

</style>
