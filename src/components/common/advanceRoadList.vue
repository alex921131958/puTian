<template>
    <div id="road">
      <p class="list">
        <span :class="['btn',roadWay==='click'?'active':'',map_click_disabled&&advanceType===click_disabled_type?'disabled':'']" @click="setRoadEditable()">{{roadTitle}}</span>
        <span :class="['btn',roadWay==='load'?'active':'',map_click_disabled&&advanceType!=click_disabled_type?'disabled':'']" @click="loadRelateRoad()">载入全局小区相关道路</span>
        <span class="clear" @click="clearLinks"><i class="icon iconfont icon-clear"></i></span>
      </p>
      <p class="list left" v-if="tableType==='road'">
        <span>已选路段</span>
          <span class="opacity">已选 <strong>{{roadList.length}}</strong> 条 总长<strong> {{roadLen}} </strong>km</span>
      </p>
      <p class="list left" v-if="tableType==='village'">
        <span>已选交通小区</span>
        <span class="opacity">已选 <strong>{{panelVillageList.length}}</strong> 个</span>
      </p>
      <div class="list">
        <p>
          <span>编号</span>
          <span class="name">{{tableType==='village'?'交通小区':'路名'}}</span>
          <span v-if="tableType!='village'">长度</span>
          <span class="icon">地图定位</span>
          <span class="icon">移除</span>
        </p>
        <div class="roadBox" v-if="tableType==='road'">
          <EasyScrollbar :barOption="listBar">
            <div class="nodata" v-if="roadList.length === 0">
              {{noDataText}}
            </div>
            <ul class="roadList" v-if="roadList.length > 0">
              <li v-for="(road, index) in roadList" :class="{highlight:common_link_id.indexOf(road.id)!==-1}">
                <span class="text">{{road.id}}</span>
                <span class="name text">{{road.name?road.name:'-'}}</span>
                <span class="text">{{road.len}}m</span>
                <span class="icon" @click="turnRoad(index)"><i class="icon iconfont icon-locate"></i></span>
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

  import env from '../../common/env'
  import MapCommonLayer from '../../service/map/mapCommonLayer'
    export default {
        name: 'AdvanceRoadList',
        data() {
            return {
              roadLen:0,
              roadWay:'click',
              noDataText:'暂未选择道路',
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

        },
      props:{
        advanceType:{
          type:String
        },
        roadTitle:{
          type:String
        },
        roadList:{
          type:Array
        }
      },
      computed:{
        ...mapGetters(['isRoadEditable','link_id_A','link_id_B','link_list_A','link_list_B','common_link_id','global_v_type','global_village_id',
          'global_area','map_click_disabled','click_disabled_type', 'panel_village', 'panel_village_id','temp_village','temp_village_id']),
      },
      methods:{
        ...mapMutations(['updateRoadEditable','updateLinkListA','updateLinkIdA','updateLinkListB','updateLinkIdB','updateCommonLinkId',
          'updateMapClickDisabled','updateClickDisabledType', 'updatePanelVillage', 'updatePanelVillageIds','updatePanelVType']),
        setRoadEditable(){
          this.roadWay='click';
          this.updateRoadEditable(!this.isRoadEditable);
          this.$emit("setAdvanceEdit",this.advanceType);
        },
        loadRelateRoad(){
          this.roadWay='load';
          let ids = this.global_village_id.join(',');
          let url = MYCONF.service.getLinkByVil + `${ids}&token=${sessionStorage.getItem('token')}`;
          let that = this;
          let linkList = [];
          let idList = [];
          if(this.global_v_type === 1){
            // that.$http.get(url).then(response => {
            //   response = response.body;
            //   response.map((item) => {
            //     idList.push(item.linkid);
            //     linkList.push({
            //       id:item.linkid,
            //       name:item.roadname?item.roadname:'-',
            //       len:item.length,
            //     })
            //   });
            //   if(this.advanceType === 'A'){
            //     that.updateLinkIdA(idList);
            //     that.updateLinkListA(linkList);
            //   }else{
            //     that.updateLinkIdB(idList);
            //     that.updateLinkListB(linkList);
            //   }
            // });

            this.tableType = 'village';
            let panelVillage = this.temp_village;
            let panelVillageIds = this.temp_village_id;
            this.panelVillageList = panelVillage;
            this.updatePanelVillageIds(JSON.parse(JSON.stringify(panelVillageIds)));
            this.updatePanelVillage(JSON.parse(JSON.stringify(panelVillage)));
            this.updatePanelVType(1);  //自定义小区
          }else{
            this.noDataText = '已导入预设交通小区：' + this.global_area.label;
            this.tableType = 'road';
            this.updatePanelVType(0);  //建成区下
            if(this.advanceType === 'A'){
              that.updateLinkIdA([]);
              that.updateLinkListA([]);
            }else{
              that.updateLinkIdB([]);
              that.updateLinkListB([]);
            }
          }
          this.updateMapClickDisabled(true);   //禁用点选框选
          this.updateClickDisabledType(this.advanceType);   //不可选道路级类型
        },
        removeRoadItem(road,type){
          if(type === 'road'){
            let linkIds = this.advanceType === 'A'?this.link_id_A:this.link_id_B;
            let linkList = this.advanceType === 'A'?this.link_list_A:this.link_list_B;
            linkIds.splice(linkIds.findIndex(id => id === road.id), 1);
            linkList.splice(linkList.findIndex(link => link.id === road.id), 1);
            if(this.advanceType === 'A'){
              this.updateLinkIdA(linkIds);
              this.updateLinkListA(linkList);
            }else{
              this.updateLinkIdB(linkIds);
              this.updateLinkListB(linkList);
            }
            let commonId = this.common_link_id;
            commonId.splice(commonId.findIndex(id => id === road.id),1);
            this.updateCommonLinkId(commonId);
            MapCommonLayer.filterBaseRoad(linkIds);
          }else{
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
        turnRoad(index){
          let roadId = this.roadList[index].id;
          MapCommonLayer.locateCenter(this, roadId);
        },
        locateVCenter(village) {
          let villageId = village.id;
          MapCommonLayer.locateCenterVillage(this, villageId);
        },
        clearLinks(){
          if(this.map_click_disabled && this.advanceType === this.click_disabled_type){
            this.updateMapClickDisabled(false);
          }
          if(this.advanceType === 'A'){
            this.updateLinkIdA([]);
            this.updateLinkListA([]);
          }else{
            this.updateLinkIdB([]);
            this.updateLinkListB([]);
          }
          if(this.tableType = 'village'&& this.panelVillageList.length > 0){
            this.updateMapClickDisabled(false);
            this.updatePanelVillageIds([]);
            this.updatePanelVillage([]);
          }else{
            this.noDataText = '暂未选择道路';
          }
          this.tableType = 'road';
          this.panelVillageList = [];
          MapCommonLayer.filterBaseRoad([]);
          //导致清除连带bug，故隐藏掉
          // eventBus.$emit("clearLinkSelected");
        }
      },
      watch:{
        roadList(newVal){
          let roadLen = 0;
          if(newVal){
            newVal.map((road) => {
              roadLen += road.len;
            });
            this.roadLen = roadLen.toFixed(3);
          }
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
          line-height: 3em;
          margin-left: 2.2em;
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
            width: 12.5em;
            margin-right: 0.7em;
            background-color: #adadad;
            cursor: pointer;
            color: #000;
            letter-spacing: 1px;
            &:hover,&.active{
              background-color: $bg-red;
              color: #fff;
              font-weight: 600;
              transition: all ease-in-out 0.3s;
            }
            &.disabled{
              pointer-events: none;
              opacity: 0.5;
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
        margin-left: 2.2em;
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
          max-height: 13em;
          border: 0.15em solid #4a4a4a;
          padding: 0.5em 0;
          .nodata{
            height: 4em;
            line-height: 4em;
            color: #ccc;
          }
        }
        .roadList{
          height: 12em;
          li{
            &.highlight{
              span.text{
                color:$bg-red
              }
            }
            display: flex;
            line-height: 3em;
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
