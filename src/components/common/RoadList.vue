<template>
  <div id="road" :class="{disable:disabled}">
    <p class="list">
      <span :class="['btn',roadWay==='click'?'active':'',map_click_disabled?'disabled':'']" @click="setRoadEditable()">{{road_title}}</span>
      <span :class="['btn',roadWay==='load'?'active':'',isLoadActive?'':'disabled']" @click="loadRelateRoad()">载入全局小区相关道路</span>
      <span class="clear" @click="clearLinks"><i class="icon iconfont icon-clear"></i></span>
    </p>
    <p class="list left" v-if="tableType==='road'">
      <span>已选路段</span>
      <span class="opacity">已选 <strong>{{roadList.length}}</strong> 条 总长<strong> {{roadLen}} </strong>m</span>
    </p>
    <p class="list left" v-if="tableType==='village'">
      <span>已选交通小区</span>
      <span class="opacity">已选 <strong>{{panelVillageList.length}}</strong> 个</span>
    </p>
    <div class="list">
      <p>
        <span>编号</span>
        <span class="name">{{tableType==='village'?'交通小区':'路名'}}</span>
        <span v-if="tableType!=='village'">长度</span>
        <span class="icon">地图定位</span>
        <span class="icon">移除</span>
      </p>
      <div class="roadBox" v-if="tableType==='road'">
        <EasyScrollbar :barOption="listBar">
          <div class="nodata" v-if="roadList.length === 0">
            {{noDataText}}
          </div>
          <ul class="roadList" v-if="roadList.length > 0">
            <li v-for="(road, index) in roadList">
              <span>{{road.id}}</span>
              <span class="name">{{road.name?road.name:'-'}}</span>
              <span>{{road.len}}m</span>
              <span class="icon" @click="locateCenter(road)"><i class="icon iconfont icon-locate"></i></span>
              <span class="icon" @click="removeRoadItem(road,'road')"><i class="icon iconfont icon-delete"></i></span>
            </li>
          </ul>
        </EasyScrollbar>
      </div>
      <div class="roadBox" v-if="tableType==='village'">
        <EasyScrollbar :barOption="listBar">
          <div class="nodata" v-if="panelVillageList.length === 0">
            {{noDataText}}
          </div>
          <ul class="roadList" v-if="panelVillageList.length > 0">
            <li v-for="(village, index) in panelVillageList">
              <span>{{village.id}}</span>
              <span class="name">{{village.name?village.name:'-'}}</span>
              <span class="icon" @click="locateVCenter(village)"><i class="icon iconfont icon-locate"></i></span>
              <span class="icon" @click="removeRoadItem(village,'village')"><i
                class="icon iconfont icon-delete"></i></span>
            </li>
          </ul>
        </EasyScrollbar>
      </div>

    </div>
  </div>
</template>

<script>
  import MYCONF from '../../myconf'
  import eventBus from '../../util/event-bus'
  import {mapGetters, mapMutations} from 'vuex'
  import utilHelper from '../../util/util-helper'

  import env from '../../common/env'
  import MapCommonLayer from '../../service/map/mapCommonLayer'

  export default {
    name: 'RoadList',
    data() {
      return {
        roadLen: 0,
        roadWay: 'click',
        isClickActive: true,
        isLoadActive: true,
        noDataText: '暂未选择道路',
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
        tableType: 'road',
        panelVillageList: [],   //交通小区集合
      }
    },
    mounted() {
      eventBus.$on("getPanelParam", (menuId) => {
        this.setRoadParam(menuId);
      });
      eventBus.$on("setParamEvent", (type) => {      //参数的撤销和初始化操作
        let menuId = this.cur_menu.id;
        if (type === 'clear') {                //取消
          this.setRoadParam(menuId);
        } else {                              //初始化
          this.setRoadParam("init");
        }
      });
    },
    props: {
      roadList: {
        type: Array
      },
      disabled: {
        type: Boolean
      }
    },
    computed: {
      ...mapGetters(['cur_menu', 'isRoadEditable', 'road_title', 'link_id', 'link_list', 'global_v_type', 'panel_v_type', 'global_village', 'global_village_id', 'global_area',
        'map_click_disabled', 'car_traffic_1', 'car_traffic_2', 'car_traffic_3', 'car_traffic_4', 'cmn_traffic_1', 'cmn_traffic_3', 'panel_village',
        'panel_village_id','temp_village','temp_village_id']),
    },
    methods: {
      ...mapMutations(['updateRoadEditable', 'updateLinkId', 'updateLinkList', 'updateMapClickDisabled', 'updateGlobalArea', 'updatePanelVillage', 'updatePanelVillageIds',
        'updatePanelVType','updateGlobalVillage','updateGlobalVillageIds','updateGlobalVillageNames']),
      setRoadEditable() {
        this.roadWay = 'click';
        this.updateRoadEditable(!this.isRoadEditable);
      },
      loadRelateRoad() {
        this.roadWay = 'load';
        let ids = this.global_village_id.join(',')
        let url = MYCONF.service.globalVil+`&token=${sessionStorage.getItem('token')}`;
        this.updatePanelVType(parseInt(this.global_v_type));

        let that = this;
        if (this.global_v_type === 1) {
          this.tableType = 'village';
          let panelVillage = this.temp_village;
          let panelVillageIds = this.temp_village_id;
          this.panelVillageList = panelVillage;
          this.updatePanelVillageIds(panelVillageIds);
          this.updatePanelVillage(panelVillage);
        } else {
          // this.isLoadActive = false;
          this.tableType = 'road';
          that.updateLinkId([]);
          that.updateLinkList([]);
          this.noDataText = '已导入预设交通小区：' + this.global_area.label;
          MapCommonLayer.locationBuiltArea(this.global_area.value)
        }
        this.updateMapClickDisabled(true);   //禁用点选框选
      },
      removeRoadItem(road, type) {
        if (type === 'road') {
          let linkIds = this.link_id;
          let linkList = this.link_list;
          linkIds.splice(linkIds.findIndex(id => id === road.id), 1);
          linkList.splice(linkList.findIndex(link => link.id === road.id), 1);
          this.updateLinkId(linkIds);
          this.updateLinkList(linkList);
          MapCommonLayer.filterBaseRoad(linkIds);
          if (road.id === env.locateRoadId) {
            MapCommonLayer.removeLocateLayer();
          }
        } else {
          let villageIds = this.panel_village_id;
          let villageList = this.panel_village;
          villageIds.splice(villageIds.findIndex(id => id === road.id), 1);
          villageList.splice(villageList.findIndex(link => link.id === road.id), 1);
          this.panelVillageList = villageList;
          this.updatePanelVillageIds(villageIds);
          this.updatePanelVillage(villageList);
          if (road.id === env.locateVillageId) {
            MapCommonLayer.removeLocateVillageLayer();
          }
        }
      },
      //点击地图定位请求服务跳转道路
      locateCenter(road) {
        let roadId = road.id;
        MapCommonLayer.locateCenter(this, roadId);
      },
      locateVCenter(village) {
        let villageId = village.id;
        MapCommonLayer.locateCenterVillage(this, villageId);
      },
      clearLinks() {
        if (this.tableType === 'road') {
          this.updateLinkId([]);
          this.updateLinkList([]);
          MapCommonLayer.filterBaseRoad([]);
          eventBus.$emit("clearLinkSelected");
        } else {
          this.updatePanelVillageIds([]);
          this.updatePanelVillage([]);
          MapCommonLayer.filterBaseVillage([]);
        }
        this.tableType = 'road';
        this.updateMapClickDisabled(false);
        this.noDataText = "暂未选择道路";
        this.roadWay = 'click';
      },

      //存取linkList参数
      setRoadParam(menuId) {
        let paramMenu = '';
        switch (menuId) {
          case 'carTraffic-1':
            paramMenu = this.car_traffic_1;
            break;
          case 'carTraffic-2':
            paramMenu = this.car_traffic_2;
            break;
          case 'carTraffic-3':
            paramMenu = this.car_traffic_3;
            break;
          case 'carTraffic-4':
            paramMenu = this.car_traffic_4;
            break;
          case 'cmnTraffic-1':
            paramMenu = this.cmn_traffic_1;
            break;
          case 'cmnTraffic-3':
            paramMenu = this.cmn_traffic_3;
            break;
          default:
            paramMenu = {
              linktype: 'link',
              links: "",
            };
            this.clearLinks();
            break;
        }
        let linkType = paramMenu.linktype;
        let panelArea = paramMenu.links;
        if ((menuId === 'cmnTraffic-1' || menuId === 'cmnTraffic-3') && paramMenu.roadtype === 'line') {   //针对公交速度和流量：公交线路选择
          this.updateMapClickDisabled(false);
          this.updateLinkList([]);
          this.updateLinkId([]);
        } else if (linkType === "vil" && panelArea !== "") {
          this.updateMapClickDisabled(true);
          this.tableType = 'village';
          this.roadWay = 'load';
          this.panelVillageList = utilHelper.getlinkList(panelArea);
          this.updatePanelVillage(utilHelper.getlinkList(panelArea));
          this.updatePanelVillageIds(utilHelper.getlinkId(panelArea));
        } else if (linkType === "taz" && panelArea !== "") {
          this.updateMapClickDisabled(true);
          this.updateGlobalArea({
            label: panelArea.split("#")[1],
            value: panelArea.split("#")[0]
          });
          this.noDataText = '已导入预设交通小区：' + this.global_area.label;
        } else if (linkType === "link" && panelArea !== "") {
          this.updateMapClickDisabled(false);
          this.updateLinkList(utilHelper.getlinkList(panelArea));
          this.updateLinkId(utilHelper.getlinkId(panelArea));
        } else {
          this.updateMapClickDisabled(false);
          this.roadWay = 'click';
          this.tableType = 'road';
          this.updateLinkList([]);
          this.updateLinkId([]);
          this.updatePanelVillage([]);
          this.updatePanelVillageIds([]);
        }
      }
    },
    watch: {
      roadList(newVal) {
        let roadLen = 0;
        if (newVal) {
          newVal.map((road) => {
            roadLen += road.len;
          });
          this.roadLen = roadLen.toFixed(3);
        }
      }
    },
    beforeDestroy() {
      eventBus.$off("getPanelParam");
    },
  }
</script>

<style scoped lang="scss">
  @import "../../common/common.scss";

  #road {
    width: 100%;
    height: auto;
    &.disable {
      pointer-events: none;
      opacity: 0.7;
    }
    p {
      margin: 0.6em 0;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3em;
        margin-left: 2.2em;
        &.left {
          justify-content: flex-start;
          .opacity {
            opacity: 0.6;
            margin-left: 5px;
          }
        }
        & > span:first-child {
          /*text-indent: 2.2em;*/
        }
        & > .btn {
          &:first-child{
            width: 10em;
          }
          width: 12.5em;
          margin-right: 0.7em;
          background-color: #adadad;
          cursor: pointer;
          color: #000;
          letter-spacing: 1px;
          &:hover, &.active {
            background-color: $bg-red;
            color: #fff;
            font-weight: 600;
            transition: all ease-in-out 0.3s;
          }
          &.disabled {
            pointer-events: none;
            opacity: 0.5;
          }
        }
        & > .clear {
          flex: 1;
          background-color: #fff;
          .icon-clear {
            font-size: 1.6em;
            color: $bg-red;
            cursor: pointer;
          }
        }
      }
    }
    div.list {
      margin-left: 2.2em;
      p {
        margin: 0;
        background-color: #4a4a4a;
        display: flex;
        line-height: 2.6em;
        display: flex;
        span {
          flex: 1;
          &.icon {
            flex: 0.9;
          }
          &.name {
            flex: 1.7;
          }
        }
      }
      .roadBox {
        max-height: 13em;
        border: 0.15em solid #4a4a4a;
        padding: 0.5em 0;
        .nodata {
          height: 4em;
          line-height: 4em;
          color: #ccc;
        }
      }
      .roadList {
        height: 12em;
        li {
          display: flex;
          line-height: 3em;
          span {
            flex: 1;
            &.icon {
              flex: 0.9;
              cursor: pointer;
            }
            &.name {
              flex: 1.7;
            }
          }
          .iconfont {
            font-weight: $font-bigger;
            &.icon-delete {
              color: $bg-red;
            }
          }
        }
      }
    }
  }

  @media (min-width:1600px) and (max-width:1910px){
    #road{
      p{
        &.list{
          & > .btn {
            &:first-child{
              width: 10em;
            }
            width: 12em;
          }
        }
      }
    }
  }

  @media(min-width: 1911px){
    #road{
      p{
        &.list{
          & > .btn {
            &:first-child{
              width: 11.5em;
            }
            width: 12.5em;
          }
        }
      }
    }
  }

  @media(min-width: 1900px){
    #road{
      p{
        &.list{
          & > .btn {
            &:first-child{
              width: 11.5em;
            }
            width: 12.5em;
          }
        }
      }
    }
  }
</style>
