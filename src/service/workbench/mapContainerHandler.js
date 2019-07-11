/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import MapCommonLayer from '../../service/map/mapCommonLayer'
import DateHelper from '../../util/datetime-helper'
import eventBus from '../../util/event-bus'

export default class mapContainerHandler {
  constructor(_view) {
    this._view = _view;
  }

  toggleFullMap() {
    let map = env.map;
    if (!this.isFullScreen) {
      if (map.getContainer().requestFullscreen) {
        map.getContainer().requestFullscreen();
      } else if (map.getContainer().mozRequestFullScreen) {
        map.getContainer().mozRequestFullScreen();
      } else if (map.getContainer().msRequestFullscreen) {
        map.getContainer().msRequestFullscreen();
      } else if (map.getContainer().webkitRequestFullscreen) {
        map.getContainer().webkitRequestFullscreen();
      }
      this.isFullScreen = true;
      // let canvas = document.getElementsByClassName('minemap-canvas')[0];
      // canvas.style.width="100vw";
      // canvas.style.height="100vh";
      setTimeout(() => {
        env.map.resize();
      }, 250)
    } else {
      let menuId = this._view.cur_menu.id;
      let curStep = this._view.cur_step;
      let OdLayerOption = menuId === 'carTraffic-6' ? env.carOdLayerOption : menuId === 'personTrip-1' ? env.echartLayerOption : menuId === 'personTrip-5' ? env.adminOdLayerOption : curStep === 4 && this._view.attributePanel === 'land' ? env.landOdLayerOption : curStep === 4 ? env.projectOdLayerOption : env.carOdLayerOption;
      if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
      if (window.document.exitFullscreen) {
        window.document.exitFullscreen();
      } else if (window.document.mozCancelFullScreen) {
        window.document.mozCancelFullScreen();

      } else if (window.document.msExitFullscreen) {
        window.document.msExitFullscreen();

      } else if (window.document.webkitCancelFullScreen) {
        window.document.webkitCancelFullScreen();
      }
      this.isFullScreen = false;
      setTimeout(() => {
        env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
        env.echartLayer.chart.setOption(OdLayerOption);
        env.echartLayer.chart.resize({
          width: env.cWidth,
          height: env.cHeight
        });
      }, 800)
    }
  }

  setRoadEvent() {
    let _this = this;

    this.boxSelectFunc();
    env.map.on('mousemove', function (e) {
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['baseRoad']});
      env.map.getCanvas().style.cursor = (features.length && _this._view.isRoadEditable) ? 'pointer' : '';

      let featureId = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['linkRoad']});
      env.map.getCanvas().style.cursor = featureId.length ? 'pointer' : '';
    });

    //地块出入口设定点选
    env.map.on('click', function (e) {
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['linkRoad']});
      if (!features.length || _this._view.attributePanel !== 'outin' || _this._view.entryArr.indexOf("未设定") === -1) {
        return;
      }
      let lngLat = [e.lngLat.lng, e.lngLat.lat];
      let feature = features[0];
      let linkId = feature.properties.linkid;
      let entryIndex = _this._view.entryArr.findIndex((val, index) => {
        return val === '未设定';
      });

      let closeBox = MapCommonLayer.createEntryMarker(entryIndex + 1);

      let marker = new minemap.Marker(closeBox, {offset: [-15, -15]})
        .setLngLat(lngLat)
        .addTo(env.map);
      let tempEntry = _this._view.entryArr;
      tempEntry.splice(entryIndex, 1, `出入口${entryIndex + 1}`)
      _this._view.updateEntryArr(tempEntry);
      let tempPoint = _this._view.lngLatArr;
      tempPoint.splice(entryIndex, 1, lngLat);
      _this._view.updateLngLatArr(tempPoint);
      let tempLink = _this._view.linkArr;
      tempLink.splice(entryIndex, 1, linkId);
      _this._view.updateLinkArr(tempLink);
      env.entryMarkers.splice(entryIndex, 1, marker)
    });

    //基础路网点选逻辑
    env.map.on('click', function (e) {

      let linkIds = _this._view.cur_advance_type === 'A' ? _this._view.link_id_A : _this._view.cur_advance_type === 'B' ? _this._view.link_id_B : _this._view.link_id;
      let linkList = _this._view.cur_advance_type === 'A' ? _this._view.link_list_A : _this._view.cur_advance_type === 'B' ? _this._view.link_list_B : _this._view.link_list;

      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['baseRoad']});
      if (!features.length || !_this._view.isRoadEditable) {
        return;
      }
      let feature = features[0];
      let linkId = feature.properties.linkid;
      let linkLen = feature.properties.length;
      let linkName = feature.properties.roadname ? feature.properties.roadname : '-';
      if (linkIds.indexOf(linkId) === -1) {
        linkIds.push(linkId);
        linkList.push({
          id: linkId,
          name: linkName,
          len: linkLen,
        });
      } else {
        linkIds.splice(linkIds.findIndex(id => id === linkId), 1);
        linkList.splice(linkList.findIndex(link => link.id === linkId), 1);
      }
      //道路长度截取
      if (linkList.length > MYCONF.MAX_LINK_LEN) {
        linkList = linkList.slice(0, MYCONF.MAX_LINK_LEN);
        linkIds = linkIds.slice(0, MYCONF.MAX_LINK_LEN);
        _this._view.$Message.warning({
          content: `路段上限为${MYCONF.MAX_LINK_LEN}条，超出部分已截取;操作范围过大，请尝试交通小区选取`,
          closable: true
        });
      }

      if (_this._view.cur_advance_type === 'A') {
        _this._view.updateLinkListA(linkList);
        _this._view.updateLinkIdA(linkIds);
      } else if (_this._view.cur_advance_type === 'B') {
        _this._view.updateLinkListB(linkList);
        _this._view.updateLinkIdB(linkIds);
      } else {
        _this._view.updateLinkList(linkList);
        _this._view.updateLinkId(linkIds);
      }
      if (env.map.getLayer('baseRoadHighlight')) env.map.setFilter('baseRoadHighlight', ["in", "linkid", ...linkIds]);

    });

    env.map.on('click', function (e) {
      let linkIds = ['6999', '8243', '8247'];
      // console.log('carTraffic-2')   //step-flow-5
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['flow-buffer']});
      // let features = env.map.querySourceFeatures('step-traffic-5', {
      //   sourceLayer: 'teBuffer',
      //   // filter:['>','vol_add',0]
      //   filter: ['==', 'linkid', 62232]
      // });
      if (!features.length) {
        return;
      }
      // let feature = features[0];
      console.log(features);
    });

    //溯源图层要素测试
    env.map.on('click', function (e) {
      // console.log('carTraffic-2')   //step-flow-5
      //carTraffic-2 , factor-layer ,speedPresent
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['traceability']});
      // let features = env.map.querySourceFeatures('presentPBF',{
      //   sourceLayer:'actualMap',
      // //   // filter:['>','vol_add',0]
      // });
      if (!features.length) {
        return;
      }
      // let feature = features[0];
      console.log(features);
    });
    env.map.on('click', function (e) {
      // console.log('carTraffic-2')   //step-flow-5
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['baseRoadHighlight']});
      // let features = env.map.querySourceFeatures('presentPBF',{
      //   sourceLayer:'actualMap'
      // });
      if (!features.length) {
        return;
      }
      // let feature = features[0];
      console.log(features);
    });

    //地块出入口面点选
    env.map.on('click', function (e) {
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['polygonLayer']});
      if (!features.length) {
        return;
      }
      let feature = features[0];
      eventBus.$emit("curEntrySelected", feature.id);   //到table筛选此条记录
    });

    //小区点选
    env.map.on('click', function (e) {
      let villageIds = [];
      let villageList = [];
      let villageNames = [];
      if (_this._view.global_v_active) {
        villageIds = _this._view.global_village_id;
        villageList = _this._view.global_village;
        villageNames = _this._view.global_village_name;
      } else {
        villageIds = _this._view.village_id;
        villageList = _this._view.village_list;
      }
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['baseVillage']});
      if (!features.length || !_this._view.isVillageEditable) {
        return;
      }
      let feature = features[0];
      let villageId = feature.properties.gridtazid;
      let villLen = feature.properties.length;
      let villName = feature.properties.name ? feature.properties.name : '-';

      if (villageIds.indexOf(villageId) === -1) {
        villageIds.push(villageId);
        villageNames.push(villName);
        villageList.push({
          id: villageId,
          name: villName,
          // len: villLen,
        });
      } else {
        villageIds.splice(villageIds.findIndex(id => id === villageId), 1);
        villageList.splice(villageList.findIndex(link => link.id === villageId), 1);
      }

      if (_this._view.global_v_active) {
        _this._view.updateGlobalVillage(villageList);
        _this._view.updateGlobalVillageIds(villageIds);
        _this._view.updateGlobalVillageNames(villageNames);
      } else {
        _this._view.updateVillageList(villageList);
      }

      if (env.map.getLayer('baseVillageHighlight')) env.map.setFilter('baseVillageHighlight', ["in", "gridtazid", ...villageIds]);
    });

    //zoom级别跟随
    env.map.on("zoomend", () => {
      let curZoom = DateHelper.setMidZoom(env.map.getZoom());
      if (_this._view.cur_zoom === curZoom) {
        return;
      } else {
        _this._view.updateCurZoom(curZoom);
      }
      if (_this._view.cur_menu.id === 'carTraffic-3' && env.map.getLayer('carTraffic-3') || _this._view.cur_menu.id === 'carTraffic-4' && env.map.getLayer('carTraffic-4')) {

        // if(_this._view.cur_menu.id === 'carTraffic-3'){
        if (env.map.getLayer('carTraffic-3')) {
          let id = 'carTraffic-3';
          let width = _this._view.buffer_width[id];
          MapCommonLayer.setBufferWidth(id, width);
        }
        if (env.map.getLayer('carTraffic-4')) {
          let id = 'carTraffic-4';
          let width = _this._view.buffer_width[id];
          MapCommonLayer.setBufferWidth(id, width);
        }
      }

      //个体出行热力
      // if (_this._view.grid_heatmap['personTrip-1'] === '热力图' || _this._view.grid_heatmap['personTrip-2'] === '热力图' || _this._view.grid_heatmap['personTrip-3'] === '热力图' || _this._view.grid_heatmap['personTrip-4'] === '热力图') {
      //   if (_this._view.cur_menu.id === 'personTrip-1' && env.map.getLayer('personTrip-1') || _this._view.cur_menu.id === 'personTrip-2' && env.map.getLayer('personTrip-2') || _this._view.cur_menu.id === 'personTrip-3' && env.map.getLayer('personTrip-3') || _this._view.cur_menu.id === 'personTrip-4' && env.map.getLayer('personTrip-4')) {
      //     if (_this._view.cur_menu.id === 'personTrip-1') {
      //       let id = 'personTrip-1';
      //       let width = _this._view.heatmap_width[id];
      //       MapCommonLayer.setHeatmapWidth(id, width);
      //     } else if (_this._view.cur_menu.id === 'personTrip-2') {
      //       let id = 'personTrip-2';
      //       let width = _this._view.heatmap_width[id];
      //       MapCommonLayer.setHeatmapWidth(id, width);
      //     } else if (_this._view.cur_menu.id === 'personTrip-3') {
      //       let id = 'personTrip-3';
      //       let width = _this._view.heatmap_width[id];
      //       MapCommonLayer.setHeatmapWidth(id, width);
      //     } else {
      //       let id = 'personTrip-4';
      //       let width = _this._view.heatmap_width[id];
      //       MapCommonLayer.setHeatmapWidth(id, width);
      //     }
      //   }
      // }


      let maxKind = curZoom < 11 ? 2 : curZoom < 12 ? 3 : curZoom < 14 ? 4 : 5;
      if (env.map.getLayer('carTraffic-1')) env.map.setFilter('carTraffic-1', ['<=', 'funcclass', maxKind]);
      // if (env.map.getLayer('cmnTraffic-1') && _this._view.bus_speed_type === 0) env.map.setFilter('cmnTraffic-1', ['all', ["<=", "funcclass", maxKind], [">", "los", 0]]);
      if (env.map.getLayer('carTraffic-2')) env.map.setFilter('carTraffic-2', ['<=', 'funcclass', maxKind]);
      if (env.map.getLayer('factor-layer')){
        env.map.setFilter('factor-layer', ['<=', 'funcclass', maxKind]);
        env.map.setFilter('factor-layer-symbol', ['<=', 'funcclass', maxKind]);
      };

      let lineLayers = ['speedPresent','saturationPresent','servicePresent','speedPresent-symbol','saturationPresent-symbol','servicePresent-symbol','speedDistribute','saturationDistribute','serviceDistribute','speedDistribute-symbol','saturationDistribute-symbol','serviceDistribute-symbol'];
      lineLayers.map((layerId) => {
        if(env.map.getLayer(layerId)){
          if(layerId == 'saturationDistribute-symbol'){
            env.map.setFilter(layerId, ["all",["<=","funcclass",maxKind],["!=","vcd",0]]);
          }else if(layerId == 'speedDistribute-symbol'){
            env.map.setFilter(layerId, ["all",["<=","funcclass",maxKind],["!=","sd",0]]);
          }else{
            env.map.setFilter(layerId, ['<=', 'funcclass', maxKind]);
          }
        }
      });
      //marker尺寸调整

      let intZoom = Math.round(env.map.getZoom());
      let markers = env.map.getAllMarkers();
      if (markers.length > 0) {
        markers.map((item) => {
          let entryEl = item.getElement();
          let el = entryEl.querySelectorAll(".entry_marker")[0];
          let count = intZoom <= 12 ? 6 : intZoom > 15 ? 30 : (intZoom - 10) * 5;
          if (el) {
            el.style.width = count + 'px';
            el.style.height = count + 'px';
          }
        })
      }
    })

  }

  loadImages() {
    const map = env.map;
    let mapIMgs = [];
    let crossImgs = [];
    if (this._view.cur_route !== 'workflow') {
      crossImgs = ["entry", "cross", "1_1", "2_1", "3_1", "3_2", "4_1", "6_1", "6_2", "7_1", "8_1", "9_1", "10_1", "11_1", "12_1", "14_1", "15_1", "16_1", "17_1", "18_1", "19_1", "20_1", "21_1", "21_2", "33_1", "34_1", "35_1", "35_2", "36_1", "36_2", "37_1", "39_1", "39_2", "40_1", "40_2", "41_1", "41_2", "42_1", "42_2", "43_1", "43_2", "44_1", "44_2", "45_1", "46_1", "46_2", "47_1", "47_2", "49_2", "50_1", "51_1", "51_2"];
    } else {
      crossImgs = ["entry", "cross"];
    }
    crossImgs.map((item) => {
      let imgUrl = `./static/images/cross/${item}.png`;
      map.loadImage(imgUrl, function (error, image) {
        if (error) throw error;
        if (!map.hasImage(item)) map.addImage(item, image);
      })
    });
  }

  //隐藏所有模块可见图层
  setOtherLayerHide() {
    const map = env.map;
    let sourceIds = this._view.activeList;

    let symbolIds = sourceIds.map((item) => {
      return item + '-symbol';
    });

    sourceIds.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', 'none');
      }
    });
    symbolIds.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', 'none')
      }
    });
    if (env.map.isStyleLoaded) {

    }
    MapCommonLayer.setRealTrafficHide();
  }

  //获取地图设置图层信息
  getMapLayerList() {
    let token = sessionStorage.getItem("token");
    this._view.$http.get(MYCONF.map_service + +MYCONF.map.solu + '?token=' + MYCONF.map.token)
      .then(response => {
        response = response.body;
        let roadLineLayer = [];
        let trafficLayers = response.data.rows[0].layers;
        trafficLayers.map((item) => {
          let content = JSON.parse(item.content || '{}')
          if (content['source'] === 'Road' && content['source-layer'] === 'Road' && content['type'] === 'line') {
            roadLineLayer.push(item.id);
            this._view.roadLineLayer.push(item.id);
          }
          if (content['source'] === 'Adminbound' && content['source-layer'] === 'Adminbound') {
            this._view.adminBoundLayer.push(item.id)
            // this._view.map.setLayoutProperty(item.id, 'visibility', 'none');
          }
          if (content['source'] === 'Poi' && content['source-layer'] === 'Poi' || content['source'] === 'Ptstop' && content['source-layer'] === 'Ptstop') {
            this._view.poiLayer.push(item.id)
          }
          if (content['source'] === 'Adminflag' && content['source-layer'] === 'Adminflag' || content['source'] === 'Annotation' && content['source-layer'] === 'Annotation' || content['source'] === 'Villtown' && content['source-layer'] === 'Villtown') {
            this._view.adminLayer.push(item.id)
          }
          if (content['source'] === 'Road' && content['source-layer'] === 'Road' && content['type'] != 'line' || content['source'] === 'Railway' && content['source-layer'] === 'Railway' && content['type'] != 'line' || content['source'] === 'Trafficlight' && content['source-layer'] === 'Trafficlight') {
            this._view.roadLayer.push(item.id)
          }
          if (content['source'] === 'Landuse' && content['source-layer'] === 'Landuse' || content['source'] === 'ResidentialPolygon' && content['source-layer'] === 'ResidentialPolygon') {
            this._view.landUseLayer.push(item.id)
          }
          if (content['source'] === 'Greenface' && content['source-layer'] === 'Greenface') {
            this._view.greenFaceLayer.push(item.id)
          }
          if (content['source'] === 'Waterface' && content['source-layer'] === 'Waterface' || content['source'] === 'Waterline' && content['source-layer'] === 'Waterline') {
            this._view.waterLayer.push(item.id)
          }
        });
        /* env.map.on('mousemove', function (e) {
           let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: roadLineLayer});
           env.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
         });
         env.map.on('click', function (e) {
           let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: roadLineLayer});
           console.log(features);
         });*/
      }, response => {
        // error callback
      });
  }

  displayMapSetting() {
    let adminBoundsShow = this._view.map_setting.admin_bounds;
    let poiShow = this._view.map_setting.poi_show;
    let adminFlagShow = this._view.map_setting.admin_flag;
    let roadNameShow = this._view.map_setting.road_name;
    let greenWaterShow = this._view.map_setting.green_water;
    let mapMaskShow = this._view.map_setting.map_mask;
    let lightMaskShow = this._view.map_setting.light_mask;
    let landUseShow = this._view.map_setting.land_use;

    this.adminBoundsLayers(adminBoundsShow);
    this.poiLayers(poiShow);
    this.adminFlagLayers(adminFlagShow);
    this.roadNameLayers(roadNameShow);
    this.greenWaterLayers(greenWaterShow);
    let bool = mapMaskShow || lightMaskShow;
    let maskType = lightMaskShow ? 'light':'mask';
    this.mapMaskLayers(bool,maskType);
    this.landUseLayers(landUseShow);
  }

  adminBoundsLayers(bool) {
    let map = env.map;
    let layers = this._view.adminBoundLayer;
    let layerDis = bool ? 'visible' : 'none';
    layers.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', layerDis)
      }
    });
  }

  poiLayers(bool) {
    let map = env.map;
    let layers = this._view.poiLayer;
    let layerDis = bool ? 'visible' : 'none';
    layers.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', layerDis)
      }
    });
  }

  adminFlagLayers(bool) {
    let map = env.map;
    let layers = this._view.adminLayer;
    let layerDis = bool ? 'visible' : 'none';
    layers.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', layerDis)
      }
    });
  }

  roadNameLayers(bool) {
    let map = env.map;
    let layers = this._view.roadLayer;
    let layerDis = bool ? 'visible' : 'none';
    layers.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', layerDis)
      }
    });
  }

  greenWaterLayers(bool) {
    let map = env.map;
    let layers = [...this._view.landUseLayer, ...this._view.greenFaceLayer, ...this._view.waterLayer];
    let layerDis = bool ? 'visible' : 'none';
    layers.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', layerDis)
      }
    });
  }

  mapMaskLayers(bool,maskType) {
    let map = env.map;
    if (bool) {
      if (map.getLayer('mask')) {
        map.removeLayer('mask');
      }
      map.addLayer({
        type: 'background',
        id: 'mask',
        paint: {
          'background-color': maskType==='light'?'#ffffff':'#020b0f',
          'background-opacity': 0.7
        }
      }, MYCONF.map.maskBgLayer)

    } else {
      if (map.getLayer('mask')) {
        map.removeLayer('mask');
      }
    }
  }

  landUseLayers(bool){
    let landTypeMap = MYCONF.LAND_TYPE_MAP;
    let map = env.map;
    if(bool){
      let url = MYCONF.service.getLandUse+ `?token=${sessionStorage.getItem("token")}`;
      if (map.getSource('landUse')){
        return
      }else{
        if (map.getLayer('landUse')) map.removeLayer('landUse');
        if (map.getSource('landUse')) map.removeSource('landUse');
        map.addSource("landUse", {
          type: "vector",
          tiles: [url]
        });

        map.addLayer({
          'id': 'landUse',
          'type': 'fill',
          'source': 'landUse',
          'source-layer': 'landTypeLayer',
          'layout': {},

          'paint': {
            'fill-color': {
              "type": "interval",
              "property": "lu_sub_num",
              "stops": landTypeMap
            },
            'fill-opacity': 0.8,
            'fill-outline-color': 'rgba(255, 255, 255, 0.4)'
          },
        },MYCONF.map.maskBgLayer);
      }
    }else{
      if (map.getLayer('landUse')) map.removeLayer('landUse');
      if (map.getSource('landUse')) map.removeSource('landUse');
    }
  }

  //显示所有模块可见图层
  setOtherLayerShow() {
    const map = env.map;
    let sourceIds = this._view.activeList;
    let symbolIds = sourceIds.map((item) => {
      return item + '-symbol';
    });

    sourceIds.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', 'visible')
      }
    });
    symbolIds.map((item) => {
      if (map.getLayer(item)) {
        map.setLayoutProperty(item, 'visibility', 'visible')
      }
    });
  }

  //设置当前操作显隐图层
  setObjectLayerShow() {
    const map = env.map;
    let _this = this;
    let layerList = _this._view.activeList;
    let layerId = this._view.cur_item_active.id ? this._view.cur_item_active.id : this._view.cur_menu.id;
    let symbolId = layerId + '-symbol';
    let ids = [layerId, symbolId];
    let layerOption = null;
    ids.map((item) => {
      if (map.getLayer(item) && map.getLayoutProperty(item, 'visibility') !== 'visible') {
        map.setLayoutProperty(item, 'visibility', 'visible');

        let curIndex = _this._view.activeList.findIndex((value) => {
          return value === layerId;
        });

        setTimeout(() => {
          if (curIndex !== 0) {
            for (let i = curIndex - 1; i >= 0; i--) {
              if (map.getLayer(layerId) && map.getLayer(layerList[i])) {
                map.moveLayer(layerId, layerList[i]);
                if (map.getLayer(`${layerId}-symbol`)) {
                  map.moveLayer(`${layerId}-symbol`, layerList[i]);
                }
                return;
              }
            }
          } else {
            map.moveLayer(layerId, MYCONF.map.topBgLayer);
            if (map.getLayer(`${layerId}-symbol`)) {
              map.moveLayer(`${layerId}-symbol`, MYCONF.map.topBgLayer);
            }
          }
        }, 500);
      }
    });
    if (layerId === 'personTrip-1' || layerId === 'personTrip-5' || layerId === 'carTraffic-6') {
      if (layerId === 'personTrip-1' && env.echartLayerOption) {
        layerOption = env.echartLayerOption;
      } else if (layerId === 'personTrip-5' && env.adminOdLayerOption) {
        layerOption = env.adminOdLayerOption;
      } else if (layerId === 'carTraffic-6' && env.carOdLayerOption) {
        layerOption = env.carOdLayerOption;
      }
      if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
      env.echartLayer.chart.setOption(layerOption);
      env.echartLayer.chart.resize({
        width: env.cWidth,
        height: env.cHeight
      });
    }
    if (layerId === 'carTraffic-3') {
      let backLayerIds = this._view.flow_background_show && this._view.flow_label_show ? ['carTraffic-3-background', 'carTraffic-3-background-symbol',symbolId]
        :this._view.flow_background_show ? ['carTraffic-3-background']
        :this._view.flow_label_show ? [symbolId]
          :[];
      [layerId,...backLayerIds].map((item) => {
        if (map.getLayer(item) && map.getLayoutProperty(item, 'visibility') !== 'visible') {
          map.setLayoutProperty(item, 'visibility', 'visible')
        }
      })
    }
  }

  setMultitLayerHide(list,curLayer){
    const map = env.map;
    list.map((layerId) => {
      if (map.getLayer(layerId) && map.getLayoutProperty(layerId, 'visibility') !== 'none'&& curLayer[0] != layerId) {
        map.setLayoutProperty(layerId, 'visibility', 'none');
        if (map.getLayer(`${layerId}-symbol`)) {
          map.setLayoutProperty(`${layerId}-symbol`, 'visibility', 'none')
        }
      }
      if (layerId === 'carTraffic-1' && map.isStyleLoaded()) {
        MapCommonLayer.setRealTrafficHide();
      }
      if (layerId === 'carTraffic-3') {
        [layerId, `${layerId}-symbol`, 'carTraffic-3-background', 'carTraffic-3-background-symbol'].map((item) => {
          if (map.getLayer(item) && map.getLayoutProperty(item, 'visibility') !== 'none') {
            map.setLayoutProperty(item, 'visibility', 'none');
          }
        })
      }
      if ((layerId === 'personTrip-1' && env.echartLayerOption) || (layerId === 'personTrip-5' && env.adminOdLayerOption) || (layerId === 'carTraffic-6' && env.carOdLayerOption)) {
        if (env.echartLayer) {
          env.echartLayer.remove();
          env.echartLayer = null;
        }
      }
    })
  }

  setObjectLayerHide() {
    const map = env.map;
    let layerId = this._view.cur_item_active.id ? this._view.cur_item_active.id : this._view.cur_menu.id;
    let symbolId = layerId + '-symbol';
    let ids = [layerId, symbolId];
    ids.map((item) => {
      if (map.getLayer(item) && map.getLayoutProperty(item, 'visibility') !== 'none') {
        map.setLayoutProperty(item, 'visibility', 'none')
      }
    });
    if (layerId === 'carTraffic-1' && map.isStyleLoaded()) {
      MapCommonLayer.setRealTrafficHide();
    }
    if (layerId === 'carTraffic-3') {
      [layerId, symbolId, 'carTraffic-3-background', 'carTraffic-3-background-symbol'].map((item) => {
        if (map.getLayer(item) && map.getLayoutProperty(item, 'visibility') !== 'none') {
          map.setLayoutProperty(item, 'visibility', 'none')
        }
      })
    }
    if ((layerId === 'personTrip-1' && env.echartLayerOption) || (layerId === 'personTrip-5' && env.adminOdLayerOption) || (layerId === 'carTraffic-6' && env.carOdLayerOption)) {
      if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
    }
  }

  setEchartLayerShow() {
    let layerList = this._view.activeList;
    let layerId = this._view.cur_item_active.id ? this._view.cur_item_active.id : this._view.cur_menu.id;
    if (env.echartLayer) {
      env.echartLayer.remove();
      env.echartLayer = null;
    }
    if (layerList.indexOf("personTrip-1") !== -1 && (this._view.display_mode === '仅期望线' || this._view.display_mode === '全部')) {
      if (env.echartLayerOption) {
        env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
        env.echartLayer.chart.setOption(env.echartLayerOption);
        env.echartLayer.chart.resize({
          width: env.cWidth,
          height: env.cHeight
        });
      }
    } else if (layerList.indexOf("personTrip-5") !== -1 && env.adminOdLayerOption) {
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
      env.echartLayer.chart.setOption(env.adminOdLayerOption);
      env.echartLayer.chart.resize({
        width: env.cWidth,
        height: env.cHeight
      });
    } else if (layerList.indexOf("carTraffic-6") !== -1 && env.carOdLayerOption) {
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
      env.echartLayer.chart.setOption(env.carOdLayerOption);
      env.echartLayer.chart.resize({
        width: env.cWidth,
        height: env.cHeight
      });
    }

  }

  setEchartLayerHide() {    //选择基础道路，基础小区时
    let layerList = this._view.activeList;
    if (env.echartLayer && (layerList.indexOf("personTrip-1") !== -1 || layerList.indexOf("personTrip-5") !== -1)) {
      env.echartLayer.remove();
      env.echartLayer = null;
    }
  }

  setFlowLabelShow() {
    const map = env.map;
    let symbolId = this._view.cur_menu.id + '-symbol';
    if (map.getLayer(symbolId)) {
      map.setLayoutProperty(symbolId, 'visibility', 'visible')
    }
    if (map.getLayer('carTraffic-3-background-symbol') && this._view.flow_background_show) {
      map.setLayoutProperty('carTraffic-3-background-symbol', 'visibility', 'visible')
    }
  }

  setFlowLabelHide() {
    const map = env.map;
    let symbolId = this._view.cur_menu.id + '-symbol';
    if (map.getLayer(symbolId)) {
      map.setLayoutProperty(symbolId, 'visibility', 'none')
    }
    if (map.getLayer('carTraffic-3-background-symbol')) {
      map.setLayoutProperty('carTraffic-3-background-symbol', 'visibility', 'none')
    }
  }

  setRoadInfoShow(id) {
    const map = env.map;
    let symbolId = id + '-symbol';
    if (map.getLayer(symbolId)) {
      map.setLayoutProperty(symbolId, 'visibility', 'visible')
    }
  }

  setRoadInfoHide(id) {
    const map = env.map;
    let symbolId = id + '-symbol';
    if (map.getLayer(symbolId)) {
      map.setLayoutProperty(symbolId, 'visibility', 'none')
    }
  }


  setFlowSelected() {
    const map = env.map;
    let layerId = this._view.cur_menu.id;
    let trackType = this._view.tracking_type;
    let linkIds = layerId === 'carTraffic-4' && trackType === 'advance' ? [...this._view.link_id_A, ...this._view.link_id_B] : this._view.link_id;
    if (layerId === 'carTraffic-4' && env.map.getLayer(layerId) && linkIds.length > 0) {
      env.map.setFilter(layerId, ["in", "linkid", ...linkIds]);
      if (this._view.flow_label_show) env.map.setFilter(`${layerId}-symbol`, ["in", "linkid", ...linkIds]);
    }
  }

  setFlowAll() {
    const map = env.map;
    let layerId = this._view.cur_menu.id;
    let trackType = this._view.tracking_type;
    if (layerId === 'carTraffic-4' && env.map.getLayer(layerId) && linkIds.length > 0) {
      env.map.setFilter(layerId, ["!=", "linkid", '']);
      if (this._view.flow_label_show) env.map.setFilter(`${layerId}-symbol`, ["!=", "linkid", '']);
    }
  }


  //地图框选
  boxSelectFunc() {
    let map = env.map;
    let _this = this;
    //canvas容器，用来存放选框
    let container = map.getCanvasContainer();
    // 起始点和动态移动点
    let startPoint;
    let currentPoint;
    let boxContainer;
    //注册mousedown事件
    container.addEventListener('mousedown', mouseDown, true);

    function mousePos(e) {
      let rect = container.getBoundingClientRect();
      return new minemap.Point(
        e.clientX - rect.left - container.clientLeft,
        e.clientY - rect.top - container.clientTop
      );
    }

    function mouseDown(e) {
      // 检测shift按键是否按下
      if (!(e.shiftKey && e.button === 0)) return;
      // 获取起始点坐标
      startPoint = mousePos(e);
      //禁止拖拽
      map.dragPan.disable();
      // 注册事件
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('keydown', onKeyDown);
    }

    function onMouseMove(e) {
      // 获取当前点坐标
      currentPoint = mousePos(e);
      // 检测box的Dom容器是否存在
      if (!boxContainer) {
        boxContainer = document.createElement('div');
        boxContainer.classList.add('box-select');
        container.appendChild(boxContainer);
      }
      let minX = Math.min(startPoint.x, currentPoint.x),
        maxX = Math.max(startPoint.x, currentPoint.x),
        minY = Math.min(startPoint.y, currentPoint.y),
        maxY = Math.max(startPoint.y, currentPoint.y);

      let pos = 'translate(' + minX + 'px,' + minY + 'px)';
      boxContainer.style.transform = pos;
      boxContainer.style.WebkitTransform = pos;
      boxContainer.style.width = maxX - minX + 'px';
      boxContainer.style.height = maxY - minY + 'px';
    }

    function onMouseUp(e) {
      finish([startPoint, mousePos(e)]);
    }

    function onKeyDown(e) {
      // 当ESC按键被按下时
      if (e.keyCode === 27) finish();
    }

    function finish(bbox) {
      let layerId = _this._view.isRoadEditable ? 'baseRoad' : _this._view.isVillageEditable ? 'baseVillage' : '';
      let layerHighId = _this._view.isRoadEditable ? 'baseRoadHighlight' : _this._view.isVillageEditable ? 'baseVillageHighlight' : '';
      let itemId = _this._view.isRoadEditable ? 'linkid' : _this._view.isVillageEditable ? 'gridtazid' : '';
      // 注销事件
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mouseup', onMouseUp);
      if (boxContainer) {
        boxContainer.parentNode.removeChild(boxContainer);
        boxContainer = null;
      }
      // 如果选框存在那么执行查询几何信息
      if (bbox) {
        if (_this._view.isRoadEditable) {
          let features = map.queryRenderedFeatures(bbox, {layers: [layerId]});
          let baseIds = _this._view.cur_advance_type === 'A' ? _this._view.link_id_A : _this._view.cur_advance_type === 'B' ? _this._view.link_id_B : _this._view.link_id;
          let baseList = _this._view.cur_advance_type === 'A' ? _this._view.link_list_A : _this._view.cur_advance_type === 'B' ? _this._view.link_list_B : _this._view.link_list;
          let linkIds = baseIds;
          if (features) {
            features.map((feature) => {
              // linkIds.push(feature.properties.linkid);
              let linkId = feature.properties.linkid;
              let linkLen = feature.properties.length;
              let linkName = feature.properties.roadname ? feature.properties.roadname : '-';
              if (baseIds.indexOf(linkId) === -1) {
                linkIds.push(linkId);
                baseList.push({
                  id: linkId,
                  name: linkName,
                  len: linkLen,
                });
              }
            })
          }
          // let new_linkIds = Array.from(new Set(linkIds));
          _this._view.linkIds = linkIds;
          _this._view.linkList = baseList;
          //done://框选道路长度截取
          if (baseList.length > MYCONF.MAX_LINK_LEN) {
            baseList = baseList.slice(0, MYCONF.MAX_LINK_LEN);
            linkIds = linkIds.slice(0, MYCONF.MAX_LINK_LEN);
            _this._view.$Message.warning({
              content: `路段上限为${MYCONF.MAX_LINK_LEN}条，超出部分已截取;操作范围过大，请尝试交通小区选取`,
              closable: true
            });
          }
          if (env.map.getLayer(layerHighId)) env.map.setFilter(layerHighId, ["in", itemId, ...linkIds]);
          if (_this._view.cur_advance_type === 'A') {
            _this._view.updateLinkListA(baseList);
            _this._view.updateLinkIdA(linkIds);
          } else if (_this._view.cur_advance_type === 'B') {
            _this._view.updateLinkListB(baseList);
            _this._view.updateLinkIdB(linkIds);
          } else {
            _this._view.updateLinkList(baseList);
            _this._view.updateLinkId(linkIds);
          }
        } else if (_this._view.isVillageEditable) {
          let features = map.queryRenderedFeatures(bbox, {layers: [layerId]});
          let baseIds = _this._view.global_v_active ? _this._view.global_village_id : _this._view.village_id;
          let baseList = _this._view.global_v_active ? _this._view.global_village : _this._view.village_list;
          let baseNames = _this._view.global_village_name;
          let linkIds = baseIds;
          if (features) {
            features.map((feature) => {
              // linkIds.push(feature.properties.linkid);
              let linkId = feature.properties.gridtazid;
              let linkName = feature.properties.name ? feature.properties.name : '-';
              if (baseIds.indexOf(linkId) === -1) {
                linkIds.push(linkId);
                baseNames.push(linkName);
                baseList.push({
                  id: linkId,
                  name: linkName,
                  // len: linkLen,
                });
              }
            })
          }
          // let new_linkIds = Array.from(new Set(linkIds));
          _this._view.linkIds = linkIds;
          _this._view.linkList = baseList;
          if (env.map.getLayer(layerHighId)) env.map.setFilter(layerHighId, ["in", itemId, ...linkIds]);

          if (_this._view.global_v_active) {
            _this._view.updateGlobalVillage(baseList);
            _this._view.updateGlobalVillageIds(baseIds);
            _this._view.updateGlobalVillageNames(baseNames);
          } else {
            _this._view.updateVillageList(baseList);
          }
        }
      }
      map.dragPan.enable();
    }
  }

  getMapContainer() {
    let _this = this;
    const map = env.map;
    map.on('moveend', function () {
      let map_center = map.getCenter();
      let map_zoom = map.getZoom();
      _this._view.updateMapCenter(map_center)
      _this._view.updateMapZoom(map_zoom)
    })

  }
}
