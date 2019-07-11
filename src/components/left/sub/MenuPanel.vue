<template>
  <div id="menu" :style="{backgroundColor: panelBg}">
    <draggable class="menu-item" tag="ul" v-model="itemList" v-bind="dragOptions" @start="isDragging=true"
               @end="isDragging=false" @update="dropEvent">
      <!--<transition-group type="transition">-->
        <li :class="['list-menu-item',cur_menu.id === item.id?'active':'',idList.indexOf(item.id)===-1?'':'disabled']" v-for="item in itemList" :key="item.order" :id="item.id">

          <SingleTip :switchBg="switchBg" :isActive="item.active" @setItemActive="setItemActive(item)"/>

          <span class="name" @click="updateCurMenu(item)">{{item.name}}</span>

          <span class="global">
            <i class="icon iconfont icon-clock" :style="{color:item.globaltime?'#fbe644':'#4f5856'}"></i>

            <i v-if="item.globalvil !== null" class="icon iconfont icon-global"
               :style="{color:item.globalvil?'#fbe644':'#4f5856'}"></i>
          </span>
          <i :class="['icon iconfont icon-drag',isFixed?'':'single-drag']"></i>
        </li>
      <!--</transition-group>-->
    </draggable>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import draggable from 'vuedraggable'
  import SingleTip from '../../common/SingleTip'
  import eventBus from '../../../util/event-bus'
  import MYCONF from '../../../myconf'
  import env from '../../../common/env'

  export default {
    name: "MenuPanel",
    data() {
      return {
        isDragging: false,
        itemList: [],
        beforeLayer:MYCONF.map.topBgLayer,
        idList:['carTraffic-6','cmnTraffic-2','cmnTraffic-4','cmnTraffic-5','cmnTraffic-6','landUse-1','landUse-2']
      }
    },
    props: {
      dataList: {
        type: Array
      },
      panelBg: {
        type: String
      },
      switchBg: {
        type: String
      },
      isFixed: {
        type: Boolean
      },
      menuOrder: {
        type: Number
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.itemList = this.dataList;
      });
      // eventBus.$on("updateObjTimeFllow",(bool) => {    //右侧面板时间控制
      //   this.updateCurMenu({globaltime:bool});
      // });
    },
    computed: {
      ...mapGetters([ 'cur_menu','cur_item_active','cur_globalTime_follow','cur_globalVil_follow','activeList']),
      dragOptions() {
        return {
          animation: 0,
          group: 'description' + this.menuOrder,
          disabled: this.isFixed,   //是否可拖拽，由其父元素决定
          ghostClass: 'ghost',
          handle: '.single-drag'
        };
      },
    },
    components: {
      draggable,
      SingleTip,
    },
    methods: {
      ...mapMutations(['updateCurMenu','updateMenuActive','updateTimeFollow','updateVilFollow','updateItemActive']),
      setItemActive(item){
        item.active = !item.active;
        this.updateMenuActive(item);
        this.updateItemActive(item);
      },
      setGlobalTime(item){
        let itemObj = item;
        if(!itemObj.globaltime && itemObj.id!==this.cur_menu.id){
          this.updateCurMenu(item);
        }else{
          itemObj.globaltime = !itemObj.globaltime;
          this.updateCurMenu(itemObj);
          this.updateTimeFollow(itemObj);
        }
      },
      setGlobalVil(item){
        this.updateCurMenu(item);
        item.globalvil = !item.globalvil;
        this.updateVilFollow(item);
      },
      dropEvent(evt){
        //TODO:图层叠加moveLayer

        let layerList = this.activeList;
        let targetLayer = evt.item.id;
        let curIndex = this.activeList.findIndex((value) => {
          return value === evt.item.id;
        });

        setTimeout(() => {
          if(curIndex !== 0){
            for(let i=curIndex-1;i>=0;i--){
              // for(let i=curIndex+1;i<=layerList.length;i++){
              if(env.map.getLayer(targetLayer) && env.map.getLayer(layerList[i])){
                env.map.moveLayer(targetLayer,layerList[i]);
                if(env.map.getLayer(`${targetLayer}-symbol`)){
                  env.map.moveLayer(`${targetLayer}-symbol`,layerList[i]);
                }
                return;
              }
            }
          }else{
            env.map.moveLayer(targetLayer,this.beforeLayer);
            if(env.map.getLayer(`${targetLayer}-symbol`)){
              env.map.moveLayer(`${targetLayer}-symbol`,this.beforeLayer);
            }
          }
        },500);
      }
    },
    watch:{
      itemList(newVal,oldVal){
        if (newVal && oldVal.length > 0){
          this.$emit('updateItemList',{
            order:this.menuOrder,
            list:newVal
          });
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #menu {
    .single-drag {
      cursor: move;
    }
    .menu-item {
      display: block;
      .list-menu-item {
        white-space: nowrap;
        &.disabled{
          opacity: 0.8;
          pointer-events: none;
        }
        &:hover,&.active{
          background-color: $bg-active;
        }
        display: flex;
        height: 3em;
        line-height: 3em;
        .global{
          width: 4em;
          text-align: left;
          i{
            margin-left: 0.5em;
            /*cursor: pointer;*/
          }
        }
        .name {
          flex: 1;
          text-align: left;
          padding-left: 0.6rem;
          cursor: pointer;
        }
        .icon-drag {
          width: 2.5em
        }
      }
    }
  }

</style>
