/**
 * Created by limei on 2018/7/20.
 */
import MYCONF from '../../myconf'
import FLOWCONF from '../../components/workflow/flowConf'
import env from '../../common/env'
import DateHelper from '../../util/datetime-helper'
import eventBus from '../../util/event-bus'

export default class MapCommonLayer {
  static urlHandle(param){
    let paramArr = [];
    for (let i in param){
      paramArr.push(i + '=' + param[i])
    }
    return paramArr.join('&')
  }

  static bufferLayerTemplate(sourceName, sourceLayer, ){
    return{
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer":sourceLayer,
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.buffer_color[sourceName],
        "line-width": {
          "type": "interval",
          'property': 'flow',
          'stops': datetimeHelper.setBufferRatio(this._view.buffer_width[sourceName])
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "dir",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': 1
      },
      filter: [">=", "flow", this._view.flow_range_min]
    }
  }

  static gridLayerTemplate(sourceName, sourceLayer, property){
    return {
      "id": sourceName,
      "type": "fill",
      "source": sourceName,
      "source-layer":sourceLayer,
      "layout": {
        "visibility": "visible"
      },
      'paint': {
        'fill-color':'#2B83BA',
        'fill-opacity': 1
      }
    }
  }

  static heatmapRadiusChange(layerId, data){
    if (env.map.getLayer(layerId)){
      if(env.map.getLayer(layerId).type === "heatmap"){
        env.map.setPaintProperty(layerId, 'heatmap-radius', data);
      }
    }
  }

  //link选择时-其他图层不可见
  static setOtherLayerHide() {
    const map = env.map;
    // sourceIds.map((item) => {
    //   if (map.getSource(item)) {
    //     map.removeSource(item)
    //   }
    // });
    env.layerIds.map((item) => {
      if (map.getLayer(item)) {
        // map.removeLayer(item)
        // map.setLayerProperty(item,'visibility','none')
      }
    })
  }

  static setOtherLayerShow() {
    const map = env.map;
    // sourceIds.map((item) => {
    //   if (map.getSource(item)) {
    //     map.removeSource(item)
    //   }
    // });
    env.layerIds.map((item) => {
      if (map.getLayer(item)) {
        // map.removeLayer(item)
        // map.setLayerProperty(item,'visibility','visible')
      }
    })

    // if(env.echartLayer){
    //   env.echartLayer.remove();
    //   env.echartLayer = null;
    //   console.log(env.echartLayer);
    //   console.log(env.echartLayerOption);
    // }
    // env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
    //
    // env.echartLayer.chart.setOption(env.echartLayerOption);
    // env.echartLayer.chart.resize({
    //   width: 1900,
    //   height: 1080
    // });
  }

  // 添加基础路网图层
  static addBaseRoadLayer(time, list) {
    let token = sessionStorage.getItem("token");
    let url = `${MYCONF.service.baseRoad}?token=${token}`;
    if (env.map.getSource("baseRoad")) env.map.removeSource("baseRoad");
    env.map.addSource("baseRoad", {
      type: "vector",
      tiles: [url]
    });
    if (env.map.getLayer("baseRoadHighlight")) env.map.removeLayer("baseRoadHighlight");
    env.map.addLayer({
      "id": "baseRoadHighlight",
      "type": "line",
      "source": "baseRoad",
      "source-layer": "linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": '#f1103a',
        "line-width": 3,
        'line-opacity': 0.8
      },
      "filter": ["in", "linkid", ...list]
    });
    if (env.map.getLayer("baseRoad")) env.map.removeLayer("baseRoad");
    env.map.addLayer({
      "id": "baseRoad",
      "type": "line",
      "source": "baseRoad",
      "source-layer": "linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": '#525e6d',
        "line-width": 3,
        'line-opacity': 0.9
      }
    },'baseRoadHighlight');
  }

  // 删除基础路网图层
  static hideBaseRoadLayer() {
    let layerIds = ['baseRoad', 'baseRoadHighlight', 'roadLocate'];
    if(env.map){
      layerIds.map((item) => {
        if (env.map.getSource(item)) {
          env.map.removeSource(item)
        }
        if (env.map.getLayer(item)) {
          env.map.removeLayer(item)
        }
      });
    }
  }

  //基础路网选定路段过滤
  static filterBaseRoad(linkIds) {
    if (env.map.getLayer('baseRoadHighlight')) env.map.setFilter('baseRoadHighlight', ["in", "linkid", ...linkIds]);
  }

  //修改单侧buffer宽度
  static setBufferWidth(id, count) {
    let zoom = DateHelper.setMidZoom(env.map.getZoom());
    let stopsArr = env.base_stops;
    let layerId = id;
    let stops = [];
    count = count -10;
    for (let i = 0; i < 3000; i++) {
      // stops.push([i, count === 0 ?i : count > 0 ? i*(1+count/10) : i*(1/(Math.abs(count)/2+1))]);
      stops.push([i, count === 0 ?i : count > 0 ? i*(1+Math.pow(count,2)/10) : i*(1/(Math.pow(Math.abs(count),2)+1))]);
    }

    if (env.map.getLayer(layerId)) {
      //公交流量：流量字段不同
      // let sourceLayerName = layerId === 'cmnTraffic-3' ? 'flow' : 'linknetvol';
      let sourceLayerName = layerId === 'cmnTraffic-3' ? 'flow' : layerId === 'traceability' ? 'vro':layerId === 'carTraffic-3-background'?'vol_base': 'linknetvol';
      env.map.setPaintProperty(layerId, 'line-width', {
        "type": "interval",
        'property': sourceLayerName,
        // 'stops': env.buffer_stops
        'stops': stops
      })
    }
  }

  //修改单侧buffer颜色
  static setBufferColor(id, color) {
    let layerId = id;
    if (env.map.getLayer(layerId) && color !== '#FFFFFF') {
      env.map.setPaintProperty(layerId, 'line-color', color);
      env.map.setPaintProperty(layerId, 'line-opacity', 1);
      env.map.setPaintProperty(`${layerId}-symbol`, 'text-color', color);
      env.map.setPaintProperty(`${layerId}-symbol`, 'text-opacity', 0.9);
    } else if (env.map.getLayer(layerId) && color === '#FFFFFF') {
      env.map.setPaintProperty(layerId, 'line-opacity', 0);
      env.map.setPaintProperty(`${layerId}-symbol`, 'text-color', color);
      env.map.setPaintProperty(`${layerId}-symbol`, 'text-opacity', 0);
    }
  }

  //修改compare时单侧buffer颜色
  static setCompareBufferColor(id, data){
    if (env.map.getLayer(id)){
      env.map.setPaintProperty(id, 'line-color', {
        "type": "interval",
        'property': 'affectedflow',
        "stops": data
      });
      env.map.setPaintProperty(id, 'line-opacity', 1);
      env.map.setPaintProperty(`${id}-symbol`, 'text-opacity', 0.9);
    }
  }

  //添加基础小区图层
  static addVillageLayer(time, list) {
    let token = sessionStorage.getItem("token");
    let url = `${MYCONF.service.baseVillage}?token=${token}`;
    if (env.map.getSource("baseVillage")) return;
    env.map.addSource("baseVillage", {
      type: "vector",
      tiles: [url]
    });

    env.map.addLayer({
      "id": "baseVillage",
      "type": "fill",
      "source": "baseVillage",
      "source-layer": "gridtazLayer",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "fill-color": '#1c485b',
        'fill-opacity': 0.8,
      }
    });

    env.map.addLayer({
      "id": "baseVillageHighlight",
      "type": "fill",
      "source": "baseVillage",
      "source-layer": "gridtazLayer",
      "paint": {
        "fill-color": '#f16118',
        'fill-opacity': 0.8,
      },
      "filter": ["in", "gridtazid", ...list]
    });
  }

  //删除基础小区图层
  static hideBaseVillageLayer() {
    let layerIds = ['baseVillage', 'baseVillageHighlight','villageLocate'];
    if(env.map){
      layerIds.map((item) => {
        if (env.map.getSource(item)) {
          env.map.removeSource(item)
        }
        if (env.map.getLayer(item)) {
          env.map.removeLayer(item)
        }
      });
    }
  }

  //基础交通小区选定小区过滤
  static filterBaseVillage(villageIds) {
    if (env.map.getLayer('baseVillageHighlight')) env.map.setFilter('baseVillageHighlight', ["in", "gridtazid", ...villageIds]);
    if (env.map.getLayer('villageLocate')) env.map.setFilter('villageLocate', ["in", "gridtazid", ...villageIds]);
  }

  //飞到指定位置
  static locateCenter(that, roadId) {
    let map = env.map;
    env.locateRoadId = roadId;
    let url = MYCONF.service.carLink + roadId + `&token=${sessionStorage.getItem('token')}`;
    that.$http.get(url).then((res) => {
      res = res.body;
      let center = [res.centerX, res.centerY];
      let coordinates = res.geometry.coordinates;
      if (map.getSource("roadLocate")) map.removeSource("roadLocate");
      map.addSource("roadLocate", {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {
            "linkid": roadId
          },
          "geometry": {
            "type": "LineString",
            "coordinates": coordinates
          }
        }
      });
      if (map.getLayer("roadLocate")) map.removeLayer("roadLocate");
      map.addLayer({
        "id": "roadLocate",
        "type": "line",
        "source": "roadLocate",
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#00FFFF",
          "line-width": 4,
        }
      });
      map.flyTo({
        center: center,
        zoom: 17
      })
    });
  }

  //step6道路定位
  static locateRoadCenter(that, roadId, curId){
    let map = env.map;
    env.locateRoadId = roadId;
    let url = MYCONF.service.newGetLinkInfo + `projectid=${curId}&linkid=${roadId}&token=${sessionStorage.getItem('token')}`;
    that.$http.get(url).then((res) => {
      res = res.body;
      let center = [res.centerX, res.centerY];
      let coordinates = res.geometry.coordinates;
      if (map.getSource("roadLocate")) map.removeSource("roadLocate");
      map.addSource("roadLocate", {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {
            "linkid": roadId
          },
          "geometry": {
            "type": "LineString",
            "coordinates": coordinates
          }
        }
      });
      if (map.getLayer("roadLocate")) map.removeLayer("roadLocate");
      map.addLayer({
        "id": "roadLocate",
        "type": "line",
        "source": "roadLocate",
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#00FFFF",
          "line-width": 4,
        }
      });
      map.flyTo({
        center: center,
        zoom: 17
      })
    });
  }

  //公交线路定位
  static busLineCenter(that, roadId, bool,fitBool=true) {
    let time = that.panel_time;
    let map = env.map;
    env.locateRoadId = roadId;
    let url = MYCONF.service.busLine + `?year=${time.year}&season=${time.season}&hour=${time.hour}&dateTag=${time.datetag}&trackId=${roadId}&token=${sessionStorage.getItem('token')}`;
    let busGeo = {
      "type": "MultiLineString",
      "coordinates": []
    };
    let coorList = [];
    let pointList = [];
    that.$http.get(url).then((res) => {
      res = res.body;
      if (res && res.length > 0) {
        res.map((item) => {
          let coorItem = item.geometry.coordinates;
          busGeo.coordinates.push(coorItem);
          coorList.push(...coorItem);
        });
        coorList.map((item) => {
          pointList.push([item[0], item[1]]);
        });
      }
      if (bool) {
        if (map.getSource("roadLocate")) map.removeSource("roadLocate");
        map.addSource("roadLocate", {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": busGeo
          }
        });
        if (map.getLayer("roadLocate")) map.removeLayer("roadLocate");
        map.addLayer({

          "id": "roadLocate",
          "type": "line",
          "source": "roadLocate",
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          "paint": {
            "line-color": "#00FFFF",
            "line-width": 4,
          }
        });
      }

      if(fitBool){
        let roadLine = turf.lineString(pointList);
        let bbox = turf.bbox(roadLine);

        map.stop();//停止正在进行的动画渐变
        map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
          linear: false,
          padding: {
            top: 200,
            bottom: 200,
            left: 200,
            right: 200
          },
          speed: 1.6,
          maxZoom: 15
        });
      }
    });
  }

  //飞到指定位置(单个)
  static locateCenterVillage(that, vId) {
    let map = env.map;
    env.locateRoadId = vId;
    let url = MYCONF.service.villagePos + vId + `&token=${sessionStorage.getItem('token')}`;
    that.$http.get(url).then((res) => {
      res = res.body;
      let center = [res[0].centerX, res[0].centerY];
      let id = res[0].gridtazid;
      let name = res[0].taz1name;
      let coordinates = res[0].geomtory.coordinates[0];
      env.locateVillageId = id;

      if (map.getSource("villageLocate")) map.removeSource("villageLocate");
      map.addSource('villageLocate', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': coordinates
          },
          "properties": {
            "id": id,
            "name": name
          }
        }
      });

      map.addLayer({
        'id': 'villageLocate',
        'type': 'fill',
        'source': 'villageLocate',
        'layout': {},
        'paint': {
          'fill-color': '#f18',
          'fill-opacity': 0.8
        }
      });
      map.flyTo({
        center: center,
        zoom: 14
      })
    });
  }

  //飞到指定位置(两个)
  static locateCenterVillageDouble(that, vId) {
    let map = env.map;
    env.locateRoadId = vId;
    let url = MYCONF.service.villagePos + vId + `&token=${sessionStorage.getItem('token')}`;
    that.$http.get(url).then((res) => {
      res = res.body;
      let center = [];
      let id = [];
      let name = [];
      let coordinates = [];
      res.map((item, index)=>{
        center.push([item.centerX, item.centerY]);
        id.push(item.gridtazid);
        name.push(item.taz1name);
        coordinates.push(item.geomtory.coordinates[0])
      });
      if (map.getSource("villageLocate")) map.removeSource("villageLocate");
      map.addSource('villageLocate', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [{
            'geometry': {
              'type': 'Polygon',
              'coordinates': coordinates[0]
            },
            "properties": {
              "id": id[0],
              "name": name[0]
            },
            "type": "polygon"
          },{
            'geometry': {
              'type': 'Polygon',
              'coordinates': coordinates[1]
            },
            "properties": {
              "id": id[1],
              "name": name[1]
            },
            "type": "polygon"
          }],

        }
      });

      map.addLayer({
        'id': 'villageLocate',
        'type': 'fill',
        'source': 'villageLocate',
        'layout': {},
        'paint': {
          'fill-color': '#f18',
          'fill-opacity': 0.8
        }
      });
      map.flyTo({
        center: center[0],
        zoom: 13
      })
    });
  }

  //飞到指定建成区
  static locationBuiltArea(id){
    let map = env.map;
    let center = (id==="3503001"||id===3503001)? [119.0159, 25.4362]:
      (id==="35030010"||id===35030010)? [119.0369, 25.4763]:
        (id==="3503002"||id===3503002)? [119.1092, 25.4555]:
          (id==="3503003"||id===3503003)? [118.6947, 25.3587]:
            (id==="3503004"||id===3503004)? [119.0999, 25.3132]:
              (id==="3503005"||id===3503005)? [119.1273, 25.0686]:
                (id==="3503006"||id===3503006)? [118.9600, 25.3955]:
                  (id==="3503008"||id===3503008)? [119.0789, 25.3724]:[119.01230276903023,25.435871096608345];
    map.flyTo({
      center: center,
      zoom: 12
    })
  }

  //飞到指定区县
  static locationDistrictArea(id){
    let map = env.map;
    let center = (id==="3503001"||id===3503001)? [119.04699, 25.42794]:
      (id==="3503002"||id===3503002)? [118.94358, 25.43485]:
        (id==="3503003"||id===3503003)? [119.08453, 25.57488]:
          (id==="3503004"||id===3503004)? [119.10802, 25.26396]:
            (id==="3503005"||id===3503005)? [118.72893, 25.46571]:[119.01230276903023,25.435871096608345];
    map.flyTo({
      center: center,
      zoom: 12
    })
  }

  //地块定位
  static toLandCenter(that, landId) {
    let map = env.map;
    let url = MYCONF.service.findLandInfo + `token=${sessionStorage.getItem("token")}&landID=${landId}`;
    that.$http.get(url).then((res) => {
      res = res.body;
      let centerStr = res.result.centerString;
      let center = centerStr.substring(centerStr.indexOf("(") + 1, centerStr.indexOf(")")).split(" ");
      let coordinates = [parseFloat(center[0]), parseFloat(center[1])];

      map.flyTo({
        center: coordinates,
        zoom: env.map.getZoom()>=13?env.map.getZoom():13
      })
    });

  }

  //删除道路locate高亮图层
  static removeLocateLayer() {
    let map = env.map;
    if (map.getSource("roadLocate")) map.removeSource("roadLocate");
    if (map.getLayer("roadLocate")) map.removeLayer("roadLocate");
  }

  //删除小区locate高亮图层
  static removeLocateVillageLayer() {
    let map = env.map;
    if (map.getSource("villageLocate")) map.removeSource("villageLocate");
    if (map.getLayer("villageLocate")) map.removeLayer("villageLocate");
  }

  //修改热力宽度 count = 20
  static setHeatmapWidth(id, count) {
    // let zoom = DateHelper.setMidZoom(env.map.getZoom());
    let zoom = env.map.getZoom();
    let stopsArr = env.base_stops;
    let layerId = id;
    let zoomRate = (zoom - 2) / 10;
    let rate = count > 0 ? count * zoomRate / (2 + 1) : zoomRate / (1 + Math.abs(count / 2));
    env.buffer_stops = stopsArr.map((item) => {
      return [item[0], item[1] * rate];
    });
    let heatWidth = 30;
    if (zoom < 11.5) {
      heatWidth = 20;
    } else if (zoom <= 12) {
      heatWidth = 30
    } else if (zoom <= 12.5) {
      heatWidth = 40
    } else if (zoom <= 13) {
      heatWidth = 50
    } else if (zoom <= 13.5) {
      heatWidth = 60
    } else if (zoom <= 14) {
      heatWidth = 80
    } else if (zoom <= 14.5) {
      heatWidth = 110
    } else if (zoom <= 15) {
      heatWidth = 150
    } else if (zoom <= 15.5) {
      heatWidth = 210
    } else if (zoom <= 16) {
      heatWidth = 320
    } else {
      heatWidth = 180
    }


    // if (zoom === 16){
    //   heatWidth = 180
    // } else if(zoom === 15.5){
    //   heatWidth = 140
    // } else if (zoom === 15){
    //   heatWidth = 100
    // } else if (zoom === 14.5){
    //   heatWidth = 75
    // } else if (zoom === 14){
    //   heatWidth = 50
    // } else if (zoom === 13.5){
    //   heatWidth = 35
    // } else if (zoom === 13){
    //   heatWidth = 25
    // } else if (zoom === 12.5){
    //   heatWidth = 18
    // } else if (zoom === 12){
    //   heatWidth = 15
    // } else if (zoom === 11.5){
    //   heatWidth = 20 + 20 * (zoom - 12)
    // }if (zoom < 11.5){
    //   heatWidth = 10;
    // }
    // let heatWidth = 30 + 20 * (zoom - 12);


    // console.log(zoom, heatWidth)
    if (env.map.getLayer(layerId)) {
      env.map.setPaintProperty(layerId, 'heatmap-radius', heatWidth)
    }
  }

  static filterMenuLayer(layerId, count) {
    let flowName = layerId === 'cmnTraffic-3' ? "flow" : "linknetvol";
    if (env.map.getLayer(layerId)) env.map.setFilter(layerId, [">=", flowName, parseInt(count)]);
    if (env.map.getLayer(layerId + '-symbol')) env.map.setFilter(layerId + '-symbol', [">=", flowName, parseInt(count)]);
  }

  //建成区od setoption
  static odSetOption(res, info){

  }

  //修改OD期望线颜色
  static allMethodColor(id, color) {
    let layerId = id;
    let colorChange = env.colorChange;
    if (env.map.getLayer(layerId)) {
      env.map.setPaintProperty(layerId, 'fill-color', color);
      env.map.setPaintProperty(layerId, 'fill-opacity', {
        "property": "sum",
        'stops': [
          [0, 0],
          [31, 0.3],
          [93, 0.5],
          [165, 0.6],
          [250, 0.7],
          [376, 0.8],
          [563, 0.9],
          [40000, 1],
        ]
      })
    }
  }

  //显示实时路况
  static setRealTrafficShow() {
    let layerIds = [...MYCONF.map.traffic_layers];
    layerIds.map((item) => {
      env.map.setLayoutProperty(item, 'visibility', 'visible');
    });
  }

  //隐藏实时路况
  static setRealTrafficHide() {
    let layerIds = [...MYCONF.map.traffic_layers];
    layerIds.map((item) => {
      env.map.setLayoutProperty(item, 'visibility', 'none');
    });
  }

  //出行特征栅格颜色区间
  static setPersonTrip4GridColor(id, val) {
    let layerId = id;
    if (val === 1) {
      if (env.map.getLayer(layerId)) {
        env.map.setPaintProperty(layerId, 'fill-color', {
          "property": "sum",
          'stops': [
            [0, '#FFFFFF'],
            [11.11, '#2B83BA'],
            [49.78, '#80BFAC'],
            [60.76, '#C7E9AD'],
            [72.1, '#FFFFBF'],
            [85.61, '#FEC980'],
            [104.94, '#F17C4A'],
            [134.46, '#cc0000'],
            [180, '#cc0000'],
          ]
        })
      }
    } else if (val === 0) {
      if (env.map.getLayer(layerId)) {
        env.map.setPaintProperty(layerId, 'fill-color', {
          "property": "sum",
          'stops': [
            [0, '#FFFFFF'],
            [0.56, '#2B83BA'],
            [2.01, '#80BFAC'],
            [2.74, '#C7E9AD'],
            [3.6, '#FFFFBF'],
            [4.8, '#FEC980'],
            [6.66, '#F17C4A'],
            [9.78, '#cc0000'],
            [15, '#cc0000'],
          ]
        })
      }
    }

  }

  //建成区转id
  static setNameToTazId(name) {
    if (name === '荔城城厢主城') {
      return 3503001;
    } else if (name === '西天尾主城区') {
      return 35030010;
    } else if (name === '华林主城') {
      return 3503006;
    } else if (name === '黄石主城') {
      return 3503008;
    } else if (name === '仙游主城') {
      return 3503003;
    } else if (name === '湄洲岛') {
      return 3503005;
    } else if (name === '涵江主城') {
      return 3503002;
    } else if (name === '芴石主城') {
      return 3503004;
    } else{
      return ''
    }
  }

  //区县转id
  static setNameToAdminId(name) {
    if (name === '荔城') {
      return 3503001;
    } else if (name === '涵江') {
      return 3503003;
    } else if (name === '秀屿') {
      return 3503004;
    } else if (name === '城厢') {
      return 3503002;
    } else if (name === '仙游') {
      return 3503005;
    } else{
      return ''
    }
  }

  //清空所有已存在图层
  static cleanAllmapLayer() {
    let map = env.map;
    let layerList = ['carTraffic-1', 'carTraffic-2', 'carTraffic-5', 'carTraffic-6', 'cmnTraffic-1', 'cmnTraffic-2', 'cmnTraffic-4', 'cmnTraffic-5', 'cmnTraffic-6', 'personTrip-1', 'personTrip-2', 'personTrip-3', 'personTrip-4', 'personTrip-5', 'baseRoad', 'baseVillage', 'baseRoadHighlight', 'baseVillageHighlight', 'loadLocate', 'villageLocate'];
    let bufferLayer = ['carTraffic-3', 'carTraffic-4', 'cmnTraffic-3'];
    layerList.map((item) => {
      if (map.getLayer(item)) {
        map.removeLayer(item)
      }
      if (map.getSource(item)) {
        map.removeSource(item)
      }
    });
    bufferLayer.map((item) => {
      if (map.getLayer(item)) {
        map.removeLayer(item)
      }
    });
    if (env.echartLayer) {
      env.echartLayer.remove();
      env.echartLayer = null;
    }
  }

  //道路规划道路定位  todo 这里跳转的点是线段的端点 后续要改成线的中心点
  static toRoadCenter(that, roadId, projectID) {
    let mymap = env.leaf_map;
    let url = `${MYCONF.service.inquireRoadInfo}?linkid_o=${roadId}&token=${sessionStorage.getItem("token")}&projectid=${projectID}`;
    that.$http.get(url).then((res) => {
      res = res.body;
      let num = parseFloat(res.length).toFixed(1);

      let line_info = {
        name: res.roadname ? res.roadname : '未命名道路',
        linkId: res.linkid_o,           //道路ID
        linkType: res.editroadtype === 'N' ? '新建道路' : res.editroadtype === 'O' ? '原有道路' : res.editroadtype === 'C' ? '改建道路' : res.editroadtype,
        lineId: res.linkagedtazid ? res.linkagedtazid : '--',  //道路连杆
        linkLevel: res.funcclass === '1' ? '高速公路' : res.funcclass === '2' ? '国省道' : res.funcclass === '3' ? '城市主干路' : res.funcclass === '4' ? '城市次干路' : '城市支路和县乡道',
        linkLen: res.length,
      };
      let list_length = res.linkPropertiesUnitList.length;
      let line_message = {
        traffic: {
          upper: res.linkPropertiesUnitList[0].capprt,
          lower: res.linkPropertiesUnitList[list_length - 1].capprt,
        },
        speed: {
          upper: res.linkPropertiesUnitList[0].limitspeed ? res.linkPropertiesUnitList[0].limitspeed : 30,
          lower: res.linkPropertiesUnitList[list_length - 1].limitspeed ? res.linkPropertiesUnitList[list_length - 1].limitspeed : 30,
        },
        roadWay: {
          upper: res.linkPropertiesUnitList[0].lanenum,
          lower: res.linkPropertiesUnitList[list_length - 1].lanenum,
        },
      };
      let temp = [line_info, line_message];
      eventBus.$emit('toLocationRoadInfo', temp);

      mymap.flyTo([res.roadFirstPointLat, res.roadFirstPointLon], 17);
      eventBus.$emit('highlightRoad', roadId);
    });
  }

  static getOdWidth(psg, psgMax, maxWidth) {
    let unit = psgMax * (1 / maxWidth);
    return parseFloat((psg / unit).toFixed(2)) < 0.5 ? 0.5 : parseFloat((psg / unit).toFixed(2));
  }

  static onLandEditClick(mode) {
    let edit = env.edit;
    if (edit && mode) {
      edit.onBtnCtrlActive(mode);
    }
  }

  static getOdColor(colors, psg) {
    let index = 0;
    let odRange = FLOWCONF.LANDODRANGE;
    if (psg < odRange[0]) {
      index = 0;
    } else if (psg > odRange[odRange.length - 1]) {
      index = odRange.length;
    } else {
      odRange.map((item, val) => {
        if (psg >= item && item < odRange[val + 1]) {
          index = val + 1;
        }
      })
    }
    return colors[index];
  }

  static changeExceptWidth() {
    let option = {};
    env.echartLayer.chart.setOption(option);
  }

  static formatLandType(that,typeList, ratioList, linkTip) {
    let typeName = 'r1';
    let typeStr = [];
    let typeArr = [];
    let typeSum = 0;
    typeList.map((item, index) => {
      switch (item) {
        case '未设定':
          typeName = null;
          break;
        case '住宅用地':
          typeName = 'r1';
          typeArr.push({r1: ratioList[index]});
          break;
        case '商业用地':
          typeName = 'r2';
          typeArr.push({r2: ratioList[index]});
          break;
        case '行政办公':
          typeName = 'r3';
          typeArr.push({r3: ratioList[index]});
          break;
        case '文化设施':
          typeName = 'r4';
          typeArr.push({r4: ratioList[index]});
          break;
        case '教育科研':
          typeName = 'r5';
          typeArr.push({r5: ratioList[index]});
          break;
        case '中小学':
          typeName = 'r6';
          typeArr.push({r6: ratioList[index]});
          break;
        case '医疗卫生':
          typeName = 'r7';
          typeArr.push({r7: ratioList[index]});
          break;
        case '公园绿地':
          typeName = 'r8';
          typeArr.push({r8: ratioList[index]});
          break;
        case '工业':
          typeName = 'r9';
          typeArr.push({r8: ratioList[index]});
          break;
        case '交通枢纽':
          typeName = 'r10';
          typeArr.push({r8: ratioList[index]});
          break;

        default:
          break;
      }
      if (typeName) {
        let tempStr = `${typeName}=${ratioList[index]}`;
        typeSum += parseFloat(ratioList[index]);
        typeStr.push(tempStr);
      }
    });
    if (parseInt(typeSum) !== 100) {
      that.$Message.warning({
        content: '请求失败，用地性质占比总和应为100%，请核实！',
        duration: 5,
        closable: true
      });
      return 100;
    } else if (typeStr.length === 0) {
      that.$Message.warning({
        content: '请求失败，请至少设置一项用地性质参数！',
        duration: 5,
        closable: true
      });
      return 0;
    } else if (typeStr.length === 1) {
      return linkTip ? typeStr[0] : typeArr;
    } else {
      return linkTip ? typeStr.join(linkTip) : typeArr;
    }
  }

  static getLandType(result) {
    let typeList = ['住宅用地','商业用地','行政办公','文化设施','教育科研','中小学','医疗卫生','公园绿地'];
    let keyList = [];
    typeList.map((item,index) => {
      let itemRate = result[`r${index+1}`];
      if (itemRate != 0) {
        keyList.push(itemRate === 100 ? typeList[index] : `${itemRate}%${typeList[index]}`)
        if(itemRate === 100) return keyList[0];
      }
    });

    /*if (result.r1 != 0) {
      keyList.push(result.r1 === 100 ? "住宅用地" : `${result.r1}%住宅用地`)
      if(result.r1 === 100) return keyList[0];
    }
    if (result.r2 != 0) {
      keyList.push(result.r2 === 100 ? "商业用地" : `${result.r2}%商业用地`)
      if(result.r2 === 100) return keyList[0];
    }
    if (result.r3 != 0) {
      keyList.push(result.r3 === 100 ? "工业用地" : `${result.r3}%工业用地`)
      if(result.r3 === 100) return keyList[0];
    }
    if (result.r4 != 0) {
      keyList.push(result.r4 === 100 ? "公共服务" : `${result.r4}%公共服务`)
      if(result.r4 === 100) return keyList[0];
    }*/
    return keyList.join(";");
  }

  static addScript(url){
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
  }
  static addCss(url) {
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    head.appendChild(link);
  }

  static createEntryMarker(val){
    let el = document.createElement('div');
    el.className = 'entry_marker';
    el.style["background-image"] = "url(\'./static/images/entry-icon.png\')";
    el.style["background-size"] = "cover";
    el.style.width = "30px";
    el.style.height = "30px";
    el.style.position = "relative";
    el.style.cursor = "pointer";
    let span = document.createElement('span');
    span.className = 'entry_marker';
    span.style["background-image"] = "url(\'./static/images/close_marker.png\')";
    span.style["background-size"] = "cover";
    span.style.width = "10px";
    span.style.height = "10px";
    span.style.position = "absolute";
    span.style.top = "-5px";
    span.style.right = "-14px";
    span.style.cursor = "pointer";
    // span.style.display = "none";
    el.appendChild(span);
    let text = document.createElement('span');
    text.className = 'entry_text';
    text.style.color = "#d33027";
    text.style["font-size"] = "10px";
    text.style.width = "40px";
    text.style.height = "11px";
    text.style.position = "absolute";
    text.style.top = "-15px";
    text.style.left = "-8px";
    text.innerHTML = `出入口${val}`;
    el.appendChild(text);

   /* el.onmouseover=function(){
      span.style.display = "block";
    };
    el.onmouseout=function(){
      span.style.display = "none";
    };*/

    span.onclick=function(){
      eventBus.$emit("deleteCurEntry",val);
    };
    return el;
  }

  static createItemMarker(count){
    let el = document.createElement('div');
    el.style.color = "#E63D35";
    el.style.width = "auto";
    el.style.height = "12px";
    el.innerHTML=`${count}km`;
    el.style.position = "absolute";
    return el;
  }

  static createCloseMarker(){
    let el = document.createElement('div');
    el.id = 'close_marker';
    el.style["background-image"] = "url(\'./static/images/close_marker.png\')";
    el.style["background-size"] = "cover";
    el.style.width = "10px";
    el.style.height = "10px";
    el.style.position = "absolute";
    el.style.cursor = "pointer";
    return el;
  }

  static createTextMarker(name,count){
    let el = document.createElement('div');
    el.style.color = "#E63D35";
    el.style.width = "auto";
    el.style.height = "20px";
    el.style.whiteSpace = "nowrap";
    el.style.lineHeight = "20px";
    el.innerHTML=name==='面积'? `${name}：${count}km<sup>2</sup>` : `${name}：${count}km`;
    if(name === '周长'){
      el.style.position = "relative";
      el.style.top = "-6px";
    }
    return el;
  }

  static upLoadImage(that,img_data,imgName,desc){
    let _this = that._view;
    let curProId = _this.cur_pro_id;
    _this.$http.post(MYCONF.service.baseImage + `?token=${sessionStorage.getItem('token')}`, {
      projectid: curProId,
      // timetag: 'M',
      picname:imgName,
      picdes:desc,
      picdata: img_data,
    },{
        'header': {
          'Content-Type': "application/json"
        }
      }).then(response => {
      response = response.body;
      if (response.success) {
        _this.$Message.success({
          content: `${desc}上传成功`,
          duration: 3,
          closable: true
        });
        return true;
      }else{
        _this.$Message.warning({
          content: `${desc}上传失败`,
          duration: 3,
          closable: true
        });
        return false;
      }
    }, response => {
      _this.$Message.error({
        content: `${desc}上传出错，请重试`,
        duration: 3,
        closable: true
      });
      return false;
    });

  }
}

