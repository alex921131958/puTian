<template>
  <div class="box">
    <ul>
      <li v-for="item in list" @click="setCurCase(item)" :class="[curType===item.id?'active':'',item.id==='1539844431883'||item.id==='1539844475968'?'disabled':'']" :title="[item.id==='1539844431883'||item.id==='1539844475968'?'建设中...':'']">
        <span class="item-icon">
          <i :class="['icon iconfont',item.icon]"></i>
        </span>
        <span class="item-name">{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import env from '../../../../common/env'

  export default {
    name: 'SelCaseType',
    data() {
      return {
        curCase:"icon-all",
        list:[
          {
            id:"1539844431883",
            pid: "1539844102622",
            key: "tat1",
            name:"用地规划交评",
            icon:"icon-home",
          },{
          //todo:道路规划暂时去掉
            id:"1539844475968",
            pid: "1539844102622",
            key: "tat2",
            name:"道路规划交评",
            icon:"icon-road",
          },{
            id:"1539844499318",
            pid: "1539844102622",
            key: "tat3",
            name:"用地与道路规划综合交评",
            icon:"icon-all",
          }
        ]
      }
    },
    props: {
      fixSty: {
        type: String
      },
      curType:{
        type:String
      }
    },
    computed: {
      ...mapGetters(['cur_pro_type']),

    },
    mounted() {
    },
    methods: {
      ...mapMutations(['updateCurProType']),
      setCurCase(item){
        if(item.key==="tat1" || item.key==="tat2"){
          return;
        }else{
          this.curCase=item.icon;
          this.updateCurProType(item.id);
          this.$emit('setCurProType',item.id);
        }
      },
      confirmWorkFlow(type){

      },
      exitWorkFlow(){

      }
    },
    watch: {
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";

  .box{
    ul{
      margin-top:1rem;
      margin-bottom: 2rem;
      li{
        text-align: left;
        margin-bottom: 0.8rem;
        cursor: pointer;
        span{
          display: inline-block;
          line-height: 3.2rem;
          vertical-align: middle;
          text-align: center;
        }
        .item-icon{
          width:3.2rem;
          height: 3.2rem;
          border: 0.1rem solid $bg-case;
          background-color: $bg-case;
          margin-left: 2rem;
          margin-right: 0.8rem;
          .iconfont{
            color: #999;
            font-size: 1.6em;
            &.icon-all{
              font-size: 0.9em;
            }
          }
        }
        .item-name{
          color: $font-case;
        }

        &.active{
          .item-icon{
            border: 0.1rem solid #fff;
            background-color: $item-active;
            .iconfont{
              color: #fff;
            }
          }
          .item-name{
            color: #fff;
          }
        }
        &.disabled{
          cursor: default;
          /*pointer-events: none;*/
        }
      }
    }
  }
</style>
