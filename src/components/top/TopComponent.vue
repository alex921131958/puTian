<template>
  <div id="top">
    <LogoComponent/>
    <div class="box mid-box">
      <div class="left">
        <span class="span">
          <span @click="updateCurTabOp('globalTime')">
            <i class="icon iconfont icon-clock"></i>全局时间
          </span>
          <transition name="fade">
            <GlobalTime v-if="cur_tab==='globalTime'"/>
          </transition>
        </span>
        <span class="span">
          <span @click="updateCurTabOp('globalVillage')">
            <i class="icon iconfont icon-global"></i>全局小区
          </span>
          <transition name="fade">
            <GlobalVillage v-if="cur_tab==='globalVillage'"/>
          </transition>
        </span>
      </div>

      <div class="right">
        <i :class="['lock-tip',mapLocked?'active':'']" @click="setMapLock()"><i
          :class="['icon iconfont',mapLocked?'icon-locked':'icon-lock']"></i></i>
        <span class="span">
          <span @click="updateCurTabOp('viewControl')">
            <i class="icon iconfont icon-view"></i>视图控制
          </span>
          <transition name="fade">
            <ViewControl v-if="cur_tab==='viewControl'"/>
          </transition>
        </span>
        <!--<span class="span">-->
        <!--<span><i class="icon iconfont icon-export"></i>数据导出</span>-->
        <!--</span>-->
        <span class="span">
          <span @click="downMap('jpeg')"><i class="icon iconfont icon-image"></i>图像导出</span>
        </span>
        <span class="span">
          <span @click="updateCurTabOp('mapSetting')"><i class="icon iconfont icon-earth"></i>地图设置</span>
          <transition name="fade">
            <MapSetting v-if="cur_tab==='mapSetting'"/>
          </transition>
        </span>
        <span class="span">
          <span @click="updateCurTabOp('measure')"><i class="icon iconfont icon-measure"></i>测量工具</span>
          <transition name="fade">
            <MeasureComp v-if="cur_tab==='measure'"/>
          </transition>
        </span>
      </div>
    </div>
    <div class="box help-box">
      <!--<div class="user-box" @mouseover="isLogout=true" @mouseout="isLogout=false">-->
      <div class="user-box"  @click="isLogout=!isLogout">
        <i class="user-icon"><img src="../../../static/images/portrait.png" alt=""></i>
        <span>{{userName}}<span v-if="nameTip"> [ {{nameTip}} ]</span></span>
        <i class="arrow icon iconfont icon-triangle-bottom"></i>
        <ul :class="['login-out',isLogout?'show':'hide']">
          <!--<li>用户中心</li>-->
          <li @click="logout">退出登录</li>
        </ul>
      </div>
      <div class="tip" title="建设中"><i class="icon iconfont icon-tip"></i>关于和帮助</div>
      <div class="tip" @click="openDataSourcePage()"><i class="icon iconfont icon-source"></i>数据资源</div>
    </div>
    <span :class="[cur_route==='workbench'?'red':'highlight','tog-tip',panel_show?'right':'left']" @click="togglePanelShow()" v-if="!dataResource">
      <span><i class="icon iconfont icon-right"></i></span>
    </span>

    <span v-if="dataResource" :class="['red', 'tog-tip']" @click="closeDataResource()">
      <i class="icon iconfont icon-delete"></i>
    </span>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import LogoComponent from './sub/logo'
  import GlobalTime from './sub/GlobalTime'
  import GlobalVillage from './sub/GlobalVillage'
  import MapSetting from './sub/MapSetting'
  import MeasureComp from './sub/MeasureComp'
  import ViewControl from './sub/ViewControl'
  import env from '../../common/env'
  import MYCONF from '../../myconf'
  import utilHelper from '../../util/util-helper'
  import topCompHandler from '../../service/common/topCompHandler'
  import eventBus from '../../util/event-bus'
  import datetimeHelper from "../../util/datetime-helper";

  export default {
    name: "TopComponent",
    data() {
      return {
        userName: JSON.parse(sessionStorage.getItem("user")).realname ? JSON.parse(sessionStorage.getItem("user")).realname : JSON.parse(sessionStorage.getItem("user")).username,
        nameTip: null,
        mapLocked: false,
        isLogout:false,
        measureIds:[],
        dataResource: false,
      }
    },
    mounted(){
      this.controller = new topCompHandler(this);
      let _this = this;
      this.$nextTick(() => {
        _this.controller.getMapView();
        _this.resetMapSetting();
        _this.getAreaList();
        let t = setInterval(function() {
          if (env.map && minemap.edit) {
            //加载成功后业务处理
            clearInterval(t);
            _this.controller.initEditPlugin();
          }
        }, 1000);
      });
      eventBus.$on("deleteAllMeasure",() => {
        _this.controller.deleteAllMeasure();
      });
    },
    components: {
      LogoComponent,
      GlobalTime,
      GlobalVillage,
      MapSetting,
      MeasureComp,
      ViewControl,
    },
    computed: {
      ...mapGetters(['display_time','panel_show', 'cur_tab','cur_route','active_tool','map_view']),
    },
    methods: {
      ...mapMutations(['updatePanelSow', 'updateCurTab','updateGlobalVActive','updateMaskUrl', 'updateMapView','updateDataSourcePage',
        'updateMapSetting','updateAreaList','updateGlobalTime','updateTUpdateTime']),
      togglePanelShow() {
        this.updatePanelSow(!this.panel_show);
        env.map.resize();
      },
      setMapLock() {
        this.mapLocked = !this.mapLocked;
        if (this.mapLocked) {
          if(env.edit){
            this.controller.deleteAllMeasure();
            env.edit.dispose();
            env.edit = null;
          }
          env.map.dragPan.disable();
          env.map.dragRotate.disable();
          env.map.scrollZoom.disable();
          env.map.boxZoom.disable();
          env.map.doubleClickZoom.disable();
        } else {
          env.map.dragPan.enable();
          env.map.dragRotate.enable();
          env.map.scrollZoom.enable();
          env.map.boxZoom.enable();
          env.map.doubleClickZoom.enable();
        }
      },
      getPixRatio() {
        let ratio = 0,
          screen = window.screen,
          ua = navigator.userAgent.toLowerCase();

        if (window.devicePixelRatio !== undefined) {
          ratio = window.devicePixelRatio;
        }
        else if (~ua.indexOf('msie')) {
          if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
          }
        }
        else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
          ratio = window.outerWidth / window.innerWidth;
        }
        if (ratio) {
          ratio = Math.round(ratio * 100)/100;
        }
        return ratio;
      },
      downMap(mode) {
        if (env.map.isStyleLoaded()) {//判断地图是否加载完成
          let timeObj = utilHelper.setPanelObj(this.display_time);
          let timeSel = timeObj.hour === 31?"早高峰":timeObj.hour === 32?"晚高峰":timeObj.hour+"点";
          let fileName = `map-${timeObj.year}-${timeObj.season}-${timeObj.datetag}-${timeSel}`;

          let c = env.map.getCanvas();
          let w = c.width;
          let h = c.height;
          let pixRatio = this.getPixRatio();
          if (mode === 'png') {
            let img_data1 = Canvas2Image.saveAsPNG(c, true).getAttribute('src');
            datetimeHelper.saveFile(img_data1, `${fileName}.png`);
          } else if (mode === 'jpeg') {
            if (env.echartLayer) {
              let offcanvas = env.echartLayer.chart.getRenderedCanvas({
                pixelRatio: pixRatio,
                backgroundColor: 'transparent'
              });
              let asd = document.getElementsByClassName('minemap-canvas')[0];
              // let cwidth = parseFloat(asd.style.width), cheight = parseFloat(asd.style.height);
              let cwidth = asd.width, cheight = asd.height;
              let mycanvas = document.createElement('canvas');
              mycanvas.height = cheight;
              mycanvas.width = cwidth;
              mycanvas.getContext("2d").drawImage(c, 0, 0);
              mycanvas.getContext("2d").drawImage(offcanvas, 0, 0, cwidth, cheight, 0 , 0, cwidth, cheight);
              let img_data1 = Canvas2Image.saveAsJPEG(mycanvas, true).getAttribute('src');
              datetimeHelper.saveFile(img_data1, `${fileName}.jpg`);
              this.updateMaskUrl(img_data1);
            }else {
              let img_data1 = Canvas2Image.saveAsJPEG(c, true).getAttribute('src');
              datetimeHelper.saveFile(img_data1, `${fileName}.jpg`);
              this.updateMaskUrl(img_data1);
              // let legend = document.getElementById('map-legend');
              // let width = legend.offsetWidth;
              // let height = legend.offsetHeight;
              // let canvas = document.createElement("canvas"); //创建一个canvas节点
              // let scale = 2;
              // canvas.width = width * scale;
              // canvas.height = height * scale;
              // canvas.getContext("2d").scale(scale, scale);
              // let opts = {
              //   scale: scale, // 添加的scale 参数
              //   canvas: canvas, //自定义 canvas
              //   width: width, //dom 原始宽度
              //   height: height,
              // };
              //
              // html2canvas(legend, opts).then(canvas =>{
              //   let img_data1 = Canvas2Image.saveAsJPEG(canvas, true).getAttribute('src');
              //   datetimeHelper.saveFile(img_data1, `${fileName}.jpg`);
              //   this.updateMaskUrl(img_data1);
              // })
            }
          }
        }
      },

      saveFile(data, filename) {
        let save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;

        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
      },
      logout(){
        this.$http.get(MYCONF.service.logout+`?token=${sessionStorage.getItem('token')}`)
          .then(response => {
            response = response.body;
            if (response && response.success) {
              this.$router.push({path: '/login'});
              // sessionStorage.removeItem('user');
            } else {
              this.$Message.warning({
                content: '退出失败，请再次尝试',
                closable: true
              });
            }
          });
      },
      updateCurTabOp(type){
        if(this.cur_tab === type){
          this.updateCurTab('');
        }else{
          this.updateCurTab(type);
          if(type === 'measure' && !env.edit){
            //测量工具时:若lock过，需重新init
            let edit = new minemap.edit.init(env.map, {
              boxSelect: true,
              touchEnabled: false,
              displayControlsDefault: true,
              showButtons: false,
              keybindings: false
            });
            env.edit = edit;
          }
        }
      },
      openDataSourcePage(){
        this.dataResource = !this.dataResource;
        this.updateDataSourcePage(this.dataResource)
      },
      closeDataResource(){
        this.dataResource = false;
        this.updateDataSourcePage(this.dataResource)
      },
      resetMapSetting(){
        this.updateMapSetting({
          admin_bounds:true,
          poi_show:true,
          admin_flag:true,
          road_name:true,
          green_water:true,
          map_mask:false,
          light_mask:false,
          land_use:false,
        });
      },
      getAreaList(){
        let url = MYCONF.service.areaList+`?token=${sessionStorage.getItem('token')}`;
        let list = [];
        this.$http.get(url).then(response => {
          response = response.body;
          if (response){
            response.map((item) => {
              list.push({
                label:item.taz1name,
                value:item.taz1id
              })
            });
            this.updateAreaList(list);
          }
        })
      }
    },
    watch:{
      cur_tab(newVal,oldVal){
        if(newVal !== oldVal && newVal !== 'globalVillage'){
          this.updateGlobalVActive(false);
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../common/common.scss";

  #top {
    display: flex;
    height: 4em;
    background-color: #000;
    color: #fff;
    .box {
      display: flex;
      flex-direction: row;
      .fade-enter-active, .fade-leave-active {
        transition: opacity .2s;
      }
      .fade-enter, .fade-leave-to {
        opacity: 0;
      }
      .span {
        line-height: 4em;
        padding: 0 0.8em;
        cursor: pointer;
        position: relative;
        & > span {
          display: block;
          opacity: 0.8;
        }
        .icon {
          margin: 0 0.4em 0 0.6em;
          opacity: 0.8;
        }
        &:hover, &.active {
          background-color: #461210;
          border-bottom: 2px solid $bg-red;
        }
      }
    }
    .mid-box {
      flex: 1;
      .left {
        display: flex;
        justify-content: flex-start;
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;
        & > i {
          line-height: 4em;
          padding: 0 0.8em;
          cursor: pointer;
          text-align: center;
        }
        .lock-tip {
          width: 4em;
          padding: 0;
          background-color: $bg-gray;
          cursor: pointer;
          &.active {
            color: $highlight;
          }
          .icon-lock {
            font-size: 1.6em;
          }
          .icon-locked {
            font-size: 1.8rem;
          }
          &:hover {
            color: $highlight;
          }
        }
      }
    }
    .help-box {
      display: flex;
      flex-direction: row-reverse;
      & > .user-box {
        min-width: 12em;
        background-color: $bg-green;
        position: relative;
        & > span {
          font-weight: 600;
          line-height: 4em;
          padding: 0 0.5em;
          letter-spacing: 1px;
          & > span {
            font-weight: normal;
          }
        }
        .login-out{
          position: absolute;
          top: 3.8em;
          left: 0;
          z-index: 1000;
          width: 100%;
          background-color: #000;
          /*padding: 0.8em 0;*/
          overflow: hidden;
          &.show{
            height: 3.8em;
            transition: height linear 0.3s;
          }
          &.hide{
            height: 0;
            transition: height linear 0.3s;
          }
          li{
            line-height: 2.4em;
            cursor: pointer;
            &:first-child{
              margin-top: 0.8em;
            }
            &:hover{
             color: #2c8c7f;
              transition: all linear 0.2s;
            }
          }
        }
        img {
          width: 2.4em;
        }
        .user-icon {
          display: inline-block;
          vertical-align: middle;
        }
        .arrow {
          cursor: pointer;
        }
      }
      & > .tip {
        /*width: 6.5em;*/
        line-height: 4em;
        opacity: 0.6;
        cursor: pointer;
        margin-right: 1em;
        .icon {
          margin-right: 0.5em;
        }
        &:hover, &.active {
          opacity: 0.8;
        }
      }
    }
    .tog-tip {
      position: absolute;
      top: 4em;
      right: 0;
      z-index: 200;
      width: 2.2em;
      height: 2.4em;
      line-height: 2.4em;
      &.red{
        background-color: $bg-red;
      }
      &.highlight{
        background-color: $highlight;
        color: #333;
      }
      cursor: pointer;
      span {
        display: flex;
        width: 1.2em;
        height: 1.6em;
        margin-left: 0.5em;
        margin-top: 0.4em;
        transition: all ease-in-out 0.5s;

      }
      .icon-right {
        line-height: 21px;
      }
      &.left {
        span {
          transform: rotate(180deg);
          transition: all ease-in-out 0.5s;
        }
      }
    }
  }

</style>
