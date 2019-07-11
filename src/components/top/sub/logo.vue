<template>
  <div id="top">
    <img src="../../../../static/images/login/logo.png" alt="" @click="routeToWorkbench">
    <!--<img src="../../../../static/images/inner/logo.png" alt="" @click="routeToWorkbench">-->
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import env from '../../../common/env'
  export default {
    name: "Logo",
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed: {
      ...mapGetters([]),
    },
    methods:{
      ...mapMutations(['updateCurMenu','updateCurRoute','updateCurProId','updateAttributePanel','updateCurStep']),
      routeToWorkbench(){
        this.updateCurMenu(this.pre_menu);
        this.updateCurRoute('workbench');
        this.updateCurProId(null);
        this.updateAttributePanel(null);
        this.updateCurStep(0);
        this.$router.push({path: '/workbench'});
        env.edit.dispose();    //销毁地图编辑器(画面)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #top {
    display: flex;
    width: 18em;
    height: 4em;
    background-color: $bg-red;
    img{
      width: 15em;
      height: 2.8em;
      margin-left: 0.8em;
      margin-top: 0.6em;
    }
  }
  @media(max-width: 1399px){
    #top{
      width: 16.5em;
    }
  }

</style>
