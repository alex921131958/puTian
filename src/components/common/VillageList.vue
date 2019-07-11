<template>
    <div id="road">
      <p class="list">
        <span :class="['btn len',isClickActive?'active':'']" @click="setVillageEditable()">{{village_title}}</span>
        <span :class="['btn',!isClickActive?'active':'']" @click="clearVillage">清空</span>
      </p>
      <p class="list left">
        <span>已选交通小区</span>
        <span class="opacity">已选 <strong>{{villageList.length}}</strong> 小区</span>
      </p>
      <div class="list">
        <p>
          <span>编号</span>
          <span class="name">交通小区</span>

          <span class="icon">地图定位</span>
          <span class="icon">移除</span>
        </p>
        <div class="roadBox">
          <EasyScrollbar :barOption="listBar">
            <div class="nodata" v-if="(villageList.length === 0 || (global_v_type === 0 && villageMethod === '全局'))">
              {{noDataVill}}
            </div>
            <ul class="roadList" v-if="(villageList.length > 0 && !(global_v_type === 0 && villageMethod === '全局'))">
              <li v-for="village in villageList">
                <span>{{village.id}}  <sup></sup></span>
                <span class="name">{{village.name?village.name:'-'}}</span>

                <span class="icon" @click="locateCenter(village)"><i class="icon iconfont icon-locate"></i></span>
                <span class="icon" @click="removeVillageItem(village)"><i class="icon iconfont icon-delete"></i></span>
              </li>
            </ul>
          </EasyScrollbar>
        </div>
      </div>
  </div>
</template>

<script>
  import MYCONF from '../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import MapCommonLayer from '../../service/map/mapCommonLayer'
  import env from '../../common/env'
  import eventBus from '../../util/event-bus'
  import utilHelper from '../../util/util-helper'

    export default {
        name: 'VillageList',
        data() {
            return {
              village:{
                name:''
              },
              vCount:8,
              vLen:5,
              isClickActive:true,
              roadTitle:'点击开始选择小区',
              listBar: {
                barColor: "#707070",   //滚动条颜色
                barWidth: 4,           //滚动条宽度
                railColor: "#242423",     //导轨颜色
                barMarginRight: 2,
                barMaginBottom: 10,
                barMaginTop: 10,
                barOpacityMin: 0.6,
                zIndex: "auto",        //滚动条z-Index
                autohidemode: true,     //自动隐藏模式
                horizrailenabled: false,//是否显示水平滚动条
              },
              // noDataVill:'暂未选择小区',
            }
        },
        mounted() {
          eventBus.$on("getPanelParam",(menuId) => {
            this.setVillageParam(menuId);
          });
          eventBus.$on("setParamEvent",(type) => {      //参数的撤销和初始化操作
            let menuId = this.cur_menu.id;
            if(type === 'clear'){                //取消
              this.setVillageParam(menuId);
            }else{                              //初始化
              this.setVillageParam("init");
            }
          });
        },
      props:{
        villageType1:{
          type:String
        },
        villageList:{
          type:Array
        },
        noDataVill: {
          type:String
        },
      },
      computed:{
        ...mapGetters(['isVillageEditable','village_title', 'global_village','village_list','global_village_id','village_id','villageType','person_trip_1',
        'person_trip_2','person_trip_3','person_trip_4','person_trip_5','cur_menu','global_area','global_v_type','villageMethod','temp_village','temp_village_id']),
      },
      methods:{
        ...mapMutations(['updateVillageEditable','updateVillageId','updateVillageList','updateGlobalVActive', 'updateGlobalVillage','updateGlobalVillageIds',
          'updateGlobalVillageNames','updateGlobalArea']),

        endVillageEdit(){
          this.isClickActive=true;
          this.updateVillageEditable(false);
          this.updateGlobalVActive(false);
        },
        clearVillage(){
          // this.isClickActive=false;
          if(this.villageType1 === 'global'){
            this.updateGlobalVillage([]);
            this.updateGlobalVillageIds([]);
            this.updateGlobalVillageNames([]);
            MapCommonLayer.filterBaseVillage([]);
          }else{
            this.updateVillageId([]);
            this.updateVillageList([]);
            MapCommonLayer.filterBaseVillage([]);
          }
          MapCommonLayer.removeLocateVillageLayer();
        },

        setVillageEditable(){
          this.isClickActive=true;
          this.updateVillageEditable(!this.isVillageEditable);
          if(this.isVillageEditable && this.villageType1 === 'global'){
            this.updateGlobalVActive(true);
          }else{
            this.updateGlobalVActive(false);
          }
          if(this.isVillageEditable){
            let ids = this.villageType1 === 'global'?this.global_village_id:this.village_id;
            MapCommonLayer.filterBaseVillage(ids);
          }else{
            MapCommonLayer.filterBaseVillage([]);
          }
        },

        removeVillageItem(village){
          let villageIds = this.villageType1 === 'global'?this.global_village_id:this.village_id;
          let villageList = this.villageType1 === 'global'?this.global_village:this.village_list;
          villageIds.splice(villageIds.findIndex(id => id === village.id), 1);
          villageList.splice(villageList.findIndex(v => v.id === village.id), 1);
          if(this.villageType1 === 'global'){
            this.updateGlobalVillageIds(villageIds);
            this.updateGlobalVillage(villageList);
          }else{
            this.updateVillageId(villageIds);
            this.updateVillageList(villageList);
          }
          MapCommonLayer.filterBaseVillage(villageIds);
          if(village.id === env.locateVillageId){
            MapCommonLayer.removeLocateVillageLayer();
          }
        },

        locateCenter(village){
          let villageId = village.id;
          MapCommonLayer.locateCenterVillage(this,villageId);
        },

        clearLinks(){
          this.updateVillageId([]);
          this.updateVillageList([]);
          MapCommonLayer.filterBaseVillage([]);
          eventBus.$emit("cleanVillageSelected");
          this.updateVillageEditable(false);
          // this.noDataVill = "暂未选择小区";
          eventBus.$emit("changeNoDataVill");
        },

        setVillageParam(menuId){
          let paramMenu = '';
          switch (menuId){
            case 'personTrip-1':
              paramMenu = this.person_trip_1;
              break;
            case 'personTrip-2':
              paramMenu = this.person_trip_2;
              break;
            case 'personTrip-3':
              paramMenu = this.person_trip_3;
              break;
            case 'personTrip-4':
              paramMenu = this.person_trip_4;
              break;
            case 'carTraffic-6':
              paramMenu = this.car_traffic_6;
            default:
              paramMenu = {
                villageType:'link',
                villages:"",
              };
              this.clearLinks();
              break;
          }
          let linkType = paramMenu.villageType;
          let panelArea = paramMenu.villages;

          if(linkType === "taz" && panelArea !== ""){
            this.updateVillageList([]);
            this.updateVillageId([]);
            this.updateGlobalArea({
              label:panelArea.split("#")[1],
              value:panelArea.split("#")[0]
            });
            // this.noDataVill = '已导入预设交通小区：'+ this.global_area.label;
            eventBus.$emit("changeTazNoDataVill");
          }else if(linkType === "link" && panelArea === ""){
            this.updateVillageList([]);
            this.updateVillageId([]);
          } else{
            this.updateVillageList(utilHelper.getVillageList(panelArea));
            this.updateVillageId(utilHelper.getVillageId(panelArea));
          }
          /*if(linkType === "taz" && this.global_v_type === 0 && panelArea !== ""){
            // this.updateVillageEditable(true);
            this.updateGlobalArea({
              label:panelArea.split("#")[1],
              value:panelArea.split("#")[0]
            });
            // this.noDataVill = '已导入预设交通小区：'+ this.global_area.label;
            eventBus.$emit("changeTazNoDataVill");
          }else if((linkType === "link" && panelArea !== "") || (linkType === "taz" && this.global_v_type === 1 && panelArea !== "")){
            // this.updateVillageEditable(false);
            this.updateVillageList(utilHelper.getVillageList(panelArea));
            this.updateVillageId(utilHelper.getVillageId(panelArea));
          }else{
            // this.updateVillageEditable(false);
            this.updateVillageList([]);
            this.updateVillageId([]);
          }*/
        }
      }
    }
</script>

<style scoped lang="scss">
  @import "../../common/common.scss";
    #road {
        width: 100%;
        height: auto;
      p{
        margin: 0.6em 0;
        &.list {
          display: flex;
          justify-content: space-between;
          line-height: 2.6em;
          &.left{
            justify-content: flex-start;
            .opacity{
              opacity: 0.6;
              margin-left: 5px;
            }
          }
          & > span:first-child {
            /*text-indent: 2.2em;*/
          }
          & > .btn{
            width: 10em;
            margin-right: 0.7em;
            background-color: #adadad;
            cursor: pointer;
            color: #000;
            letter-spacing: 1px;
            &.len{
              flex: 1;
            }
            &:hover,&.active{
              background-color: $bg-red;
              color: #fff;
              font-weight: 600;
              transition: all ease-in-out 0.3s;
            }
          }
          & > .clear{
            flex: 1;
            background-color: #fff;
            .icon-clear{
              font-size: 1.6em;
              color: $bg-red;
              cursor: pointer;
            }
          }
        }
        }
      div.list{
        p{
          margin: 0;
          background-color: #4a4a4a;
          display: flex;
          line-height: 2.6em;
          display: flex;
          span{
            flex: 1;
            &.icon{
              flex: 0.9;
            }
            &.name{
              flex: 1.7;
            }
          }
        }
        .roadBox{
          /*height: 13em;*/
          border: 0.15em solid #4a4a4a;
          padding: 0.5em 0;
          .nodata{
            height: 4em;
            line-height: 4em;
            color: #ccc;
          }
        }
        .roadList{
          height: 9em;
          li{
            display: flex;
            line-height: 2.2em;
            span{
              flex: 1;
              &.icon{
                flex: 0.9;
                cursor: pointer;
              }
              &.name{
                flex: 1.7;
              }
            }
            .iconfont{
              font-weight: $font-bigger;
              &.icon-delete{
                color: $bg-red;
              }
            }
          }
        }
      }
    }
</style>
