<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import env from './common/env'
  export default {
    name: 'App',
    data() {
      return {
        /*cWidth: window.innerWidth,
        cHeight: window.innerHeight+200,*/
      }
    },
    mounted() {
      this.initClientSize();
      this.updateRouteInfo();
      this.$Message.config({
        top: 100,
        duration: 8
      });
    },
    methods:{
      ...mapMutations(['updateCurRoute','updateCurProId','updateCurStep']),
      updateRouteInfo(){
        let paths = location.href.split('\/');
        let curRoute = paths[paths.length-1];
        if(sessionStorage.getItem("projectid")){
          this.updateCurProId(sessionStorage.getItem("projectid"));
        }
        if(curRoute === "workbench"){
          this.updateCurStep(null);
        }
        this.updateCurRoute(curRoute);
        setTimeout(() => {
          if(env.map) env.map.resize();
        },200)
      },
      initClientSize(){
        let cWidth = window.innerWidth;
        let cHeight = window.innerHeight+200;
        env.cWidth = cWidth;
        env.cHeight = cHeight;
      },
    },
    watch:{
    }
  }
</script>

<style lang="scss">
  @import "./common/common.scss";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    width: 100vw;
    height: 100vh;
    .ivu-table .red-info-column{
      background-color: #42302F;
    }

  }

  @media(max-width: 1399px) {
    #app{
      font-size: 0.9rem;
      /*font-size: 12px;*/
    }
    #panel{
      .inner{
        width: $panel-small;
        padding: 0.6em;
        p.panel-title {
          font-size: 1.3em;
        }
        .single-btn{
          width: 26em;
        }
      }
      p{
        &.tab-p{
          span{
            font-size: 1.1em;
          }
        }
      }
    }
    .panel{
      &.bench-save{
        width: $panel-small;
        &>div{
          margin-left: 1.2rem;
        }
      }
      &.flow-save{
        width: $panel-small;
        &>div{
          margin-left: 1rem;
        }
      }
    }
    #top{
      .help-box {
        width: $panel-small;
      }
    }
  }

  @media (min-width:1400px) and (max-width:1599px){
    #app{
      font-size: 0.9rem;
      /*font-size: 12px;*/
    }
    #panel{
      .inner{
        width: $panel-middle;
        padding: 1em;
        p.panel-title {
          font-size: $font-text;
        }
        .single-btn{
          /*width: 31.5em;*/
          width: 27em;
        }
      }
      p{
        &.tab-p{
          span{
            font-size: 1.1em;
          }
        }
      }
    }
    .panel{
      &.bench-save{
        width: $panel-middle;
        &>div{
          margin-left: 1.2rem;
        }
      }
      &.flow-save{
        width: $panel-middle;
        &>div{
          margin-left: 1rem;
        }
      }
    }
    #top{
      .help-box {
        width: $panel-middle;
      }
    }
  }
  @media (min-width:1600px) and (max-width:1910px){
    #app{
      font-size: 1rem;
      /*font-size: 12px;*/
    }
    #panel{
      .inner{
        width: $panel-width;
        padding: 1em 1.5em;
        p.panel-title {
          font-size: $font-title;
        }
        .single-btn{
          width: 25.5em;
        }
      }
      p{
        &.tab-p{
          span{
            font-size: $font-bigger;
          }
        }
      }
    }
    .panel{
      &.bench-save{
        width: $panel-width;
        &>div{
          margin-left: 1rem;
          margin-right: 0.8rem;
        }
      }
      &.flow-save{
        width: $panel-middle;
        &>div{
          margin-left: 1rem;
        }
      }
    }
    #top{
      .help-box {
        width: $panel-width;
      }
    }
  }

  @media (min-width:1911px) and (max-width:2000px){
    #app{
      font-size: 1.05rem;
      /*font-size: 12px;*/
    }
    #panel{
      .inner{
        width: $panel-large;
        padding: 1em;
        p.panel-title {
          font-size: $font-title;
        }
        .single-btn{
          width: 27em;
        }
      }
      p{
        &.tab-p{
          span{
            font-size: $font-bigger;
          }
        }
      }
    }
    .panel{
      &.bench-save{
        width: $panel-large;
        &>div{
          margin-left: 1.5rem;
          margin-right: 0.5rem;
        }
      }
      &.flow-save{
        width: $panel-large;
        &>div{
          margin-left: 1rem;
        }
      }
    }
    #top{
      .help-box {
        width: $panel-large;
      }
    }
  }

  @media (min-width:2000px){
    #app{
      font-size: 1.1rem;
      /*font-size: 12px;*/
    }
    #panel{
      .inner{
        width: $panel-large;
        padding: 1em;
        p.panel-title {
          font-size: $font-title;
        }
        .single-btn{
          width: 27em;
        }
      }
      p{
        &.tab-p{
          span{
            font-size: $font-bigger;
          }
        }
      }
    }
    .panel{
      &.bench-save{
        width: $panel-large;
        &>div{
          margin-left: 1.5rem;
          margin-right: 0.5rem;
        }
      }
      &.flow-save{
        width: $panel-large;
        &>div{
          margin-left: 1rem;
        }
      }
    }
    #top{
      .help-box {
        width: $panel-large;
      }
    }
  }
</style>
