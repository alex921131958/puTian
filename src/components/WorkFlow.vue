<template>
  <div id="container">
    <TopComponent/>
    <div id="content">
      <WorkProject v-if="!attributePanel&&(workflowType==='new' || workflowType==='edit')"/>
      <CompareProject v-if="workflowType==='case'"/>
      <!--<CompareProject/>-->

      <LandAttribute v-if="attributePanel==='land' && (workflowType==='new' || workflowType==='edit')"/>
      <LinkAttribute v-if="attributePanel==='road' && (workflowType==='new' || workflowType==='edit')"/>
      <LandOutInAttribute v-if="attributePanel==='outin' && (workflowType==='new' || workflowType==='edit')"/>

      <MapContainer v-show="!data_source_page"/>
      <StepPanel :workflowType="workflowType"  v-show="!data_source_page"/>
      <DataResource v-show="data_source_page"></DataResource>
    </div>
    <GlobalLoading v-if="global_mask"/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import TopComponent from './top/TopComponent'
  import WorkProject from './workflow/left/WorkProject'
  import LandAttribute from './workflow/left/LandAttribute'
  import LinkAttribute from './workflow/left/LinkAttribute'
  import StepPanel from './workflow/right/StepPanel'
  import MapContainer from './MapContainer'
  import workFlowHandler from '../service/common/workFlowHandler'
  import LandOutInAttribute from './workflow/left/LandOutInAttribute'
  import GlobalLoading from './common/globalLoading'
  import CompareProject from './workflow/left/CompareProject'
  import DataResource from './DataResource'
  import eventBus from '../util/event-bus'
  import env from '../common/env'
  export default {
    name: 'WorkFlow',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        measureIds:[],
        workflowType: '',
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
    mounted(){
      if(this.loading_tip){
        if(this.loading_tip) setTimeout(this.loading_tip,0);
        this.updateLoadingTip(null);
      }

      setTimeout(() => {
        if(env.map){
          env.map.resize();
        }
      },50)
      this.updateLoadingTip(null);
      this.controller = new workFlowHandler(this);
      this.updateAttributePanel(null);
      this.updateCurTab('');//初始化头部全局设置
      this.workflowType = sessionStorage.getItem("workflowType")
    },
    components:{
      TopComponent,
      WorkProject,
      StepPanel,
      MapContainer,
      LandAttribute,
      LinkAttribute,
      LandOutInAttribute,
      GlobalLoading,
      CompareProject,
      DataResource,
    },
    computed: {
      ...mapGetters(['attributePanel','cur_step','active_tool','global_mask','cur_menu','loading_tip','data_source_page']),
    },
    methods: {
      ...mapMutations(['updateAttributePanel','updateCurTab','updateLoadingTip']),

    },
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
      flex: 1;
      /*z-index: -1;*/
    }
  }
</style>
