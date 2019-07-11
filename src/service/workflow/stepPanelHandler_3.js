/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import MapCommonLayer from "../map/mapCommonLayer";
import datetimeHelper from "../../util/datetime-helper";

export default class stepPanelHandler_3 {
  constructor(_view) {
    this._view = _view;
  }

  saveProjectFun(type) {
    let curType = this._view.cur_pro_type;
    let curName = this._view.cur_project.name;
    let curId = this._view.cur_pro_id;
    let url = MYCONF.service.saveProject + `token=${sessionStorage.getItem("token")}`;
    this._view.$http.post(url, {
        id:curId,
        type: curType,
        name:curName
      },
      {
        'header': {
          'Content-Type': "application/json"
        }
      }).then((res) => {
      res = res.body;
      this._view.updateCurProject(res.result);
    });
  }

  getStepParam(){
    let tempObj = {};
    let roadTrafficModules = {
      daily: 0,
      earlyPeak: 0,
      latePeak: 0
    };
    let curMenu = 'step-3';
    let curProId = this._view.cur_pro_id;
    let _this = this;
    let url = MYCONF.service.findStepSettings + `${curMenu}&projectid=${curProId}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if (res){
        if (res.result.length !== 0) {
          let paramList = res.result;
          paramList.map((item) => {
            let key = item.key;
            if (key === 'roadRadius' || key === 'newFlowMax' || key === 'newFlowMin' || key === 'newFlowWidth' || key === 'newBackgroundWidth') {
              tempObj[key] = parseFloat(item.value);
              _this._view[key] = parseFloat(item.value);
            } else if (key === 'newFlowColor' || key === 'newTrafficColor' || key === 'newDayNight') {
              tempObj[key] = item.value;
              _this._view[key] = item.value;
            } else {
              if (key === 'trafficDay') roadTrafficModules.daily = parseFloat(item.value);
              if (key === 'trafficMorning') roadTrafficModules.earlyPeak = parseFloat(item.value);
              if (key === 'trafficEvening') roadTrafficModules.latePeak = parseFloat(item.value);
            }
          });
          _this._view.trafficTemp = roadTrafficModules;
          _this._view.updateRoadTrafficModules(roadTrafficModules);
          _this._view.updateSearchRadius(tempObj.roadRadius);
          _this._view.updateTimeRange(tempObj.newDayNight);
          _this._view.updateLandFlowMax(tempObj.newFlowMax);
          _this._view.updateLandFlowMin(tempObj.newFlowMin);
          _this._view.updateLandFlowWidth(tempObj.newFlowWidth);
          _this._view.updateLandBackgroundWidth(tempObj.newBackgroundWidth);
          _this._view.updateLandPlanColor(tempObj.newFlowColor);
          _this._view.updateBackgroundPlanColor(tempObj.newTrafficColor);
        } else {
        }
      }
    });
  }

  saveStepParam_3(){
    // let trafficTemp = this._view.trafficTemp;
    let trafficDay = this._view.trafficTemp.daily;
    let trafficMorning = this._view.trafficTemp.earlyPeak;
    let trafficEvening = this._view.trafficTemp.latePeak;

    let roadRadius = this._view.roadRadius;
    let newDayNight = this._view.newDayNight;
    let newFlowMax = this._view.newFlowMax;
    let newFlowMin = this._view.newFlowMin;
    let newFlowWidth = this._view.newFlowWidth;
    let newBackgroundWidth = this._view.newBackgroundWidth;
    let newFlowColor = this._view.newFlowColor;
    let newTrafficColor = this._view.newTrafficColor;
    let curProId = this._view.cur_pro_id;

    let _this = this;
    this._view.$http.post(MYCONF.service.saveStepSettings+`?token=${sessionStorage.getItem('token')}`, {
      projectid:curProId,
      menuid:'step-3',
      keys:'roadRadius,newFlowMax,newFlowMin,newFlowWidth,newBackgroundWidth,newFlowColor,newTrafficColor,newDayNight,trafficDay,trafficMorning,trafficEvening',
      values:`${roadRadius},${newFlowMax},${newFlowMin},${newFlowWidth},${newBackgroundWidth},${newFlowColor},${newTrafficColor},${newDayNight},${trafficDay},${trafficMorning},${trafficEvening}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        _this._view.$Message.success({
          content: '保存成功',
          duration: 2,
          closable: true
        });
      }
    }, response => {
      _this._view.$Message.warning({
        content: '保存失败，请重试',
        duration:2,
        closable: true
      });
    });
  }

  getLandList(){
    let url = MYCONF.service.findPWListByProject;
    let curProId = this._view.cur_pro_id;
    let map = env.map;
    let _this = this;
    this._view.$http.get(url + `projectid=${curProId}&token=${sessionStorage.getItem("token")}`).then((res) => {
      res = res.body;
      if (res.success) {
        let result = res.result;
        _this.addLandLayers(result);
      }
    });

  }

  addLandLayers(entryList) {
    let _this = this;
    let projectId = this._view.cur_pro_id;
    let polygonList = [];  //面空间信息集合
    let layerLineList = [];  //线空间信息集合
    let pointList = [];
    let lineList = [];
    let url = MYCONF.service.findPWLandListByProject + `token=${sessionStorage.getItem("token")}&projectid=${projectId}`;
    this._view.$http.get(url).then((res) => {
      let result = res.body.result;
      result.map((item, index) => {
        let polygonFeature = {
          type: 'Feature',
          properties: {
            landid: item.id,
            name: item.name,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [item.coordinates]
          }
        };
        let lineFeature = {
          type: 'Feature',
          properties: {
            landid: item.id
          },
          geometry: {
            type: 'LineString',
            coordinates: [...item.coordinates]
          }
        };
        entryList.map((entry) => {
          if (item.id === entry.landid) {
            let lineFeature = {
              type: 'Feature',
              properties: {
                landid: entry.landid
              },
              geometry: {
                type: 'LineString',
                coordinates: [[item.center_x, item.center_y], [entry.x, entry.y]]
              }
            };
            lineList.push(lineFeature);
          }
        });
        polygonList.push(polygonFeature);
        layerLineList.push(lineFeature);
      });
      _this.addPolygonLayer(polygonList);   //地块样式面线
      _this.addLineLayer(layerLineList);
    }).catch((err) => {
      console.log(err)
    })
  }

  addPolygonLayer(polygonList) {
    let map = env.map;
    let landId = this._view.curLandId;
    if (map.getSource("polygonLayer")) map.removeSource("polygonLayer");
    map.addSource("polygonLayer", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": polygonList
      }
    });
    if (map.getLayer("polygonLayer")) map.removeLayer("polygonLayer");
    map.addLayer({
      'id': 'polygonLayer',
      'type': 'fill',
      'source': 'polygonLayer',
      'paint': {
        'fill-color': '#000',
        'fill-opacity': 0.1
      }
    });
  }

  addLineLayer(lineList) {
    let map = env.map;
    if (map.getSource("entryLine")) map.removeSource("entryLine");
    map.addSource("entryLine", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": lineList
      }
    });
    if (map.getLayer("entryLine")) map.removeLayer("entryLine");
    map.addLayer({
      'id': 'entryLine',
      'type': 'line',
      'source': 'entryLine',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        "line-color": "#000",
        "line-width": 2
      }
    });
  }

  setLandLayerHide(bool){
    const map = env.map;
    if(bool){
      // this._view.polygonList = env.edit.draw.getAll();
      // env.edit.draw.deleteAll();polygonLayer
      if (map.getLayer('roadLinePaint')) {
        map.setLayoutProperty('roadLinePaint', 'visibility', 'none')
      }
    }else{
      // env.edit.draw.add(this._view.polygonList);
      if (map.getLayer('roadLinePaint')) {
        map.setLayoutProperty('roadLinePaint', 'visibility', 'visible')
      }
    }
  }

  changeFlowWidth(id, count){
    let layerId = id;
    let valName = id==='traceability'?'vro':'vol_base';
    if (env.map.getLayer(layerId)) {
      env.map.setPaintProperty(layerId, 'line-width', {
        "type": "interval",
        'property': valName,
        'stops':  datetimeHelper.setBufferRatio(count)// datetimeHelper.roadBufferRange(count)
      })
    }
  }

  backgroundFlowShow(){
    let attrBool = this._view.isBackgroundFlowShow ? 'visible' : 'none';
    let layerList = [ 'backTraceability'];
    if(this._view.isFlowRemakeShow) layerList.push('backTraceability-symbol');
    if (env.map) {
      layerList.map((layerId) => {
        if (env.map.getLayer(layerId)) {
          env.map.setLayoutProperty(layerId, 'visibility', attrBool);
        }
      });
    }
  }

  setRoadFlowFilter(){
    let minFlow = this._view.newFlowMin;
    let layerList = ['traceability', 'traceability-symbol','backTraceability','backTraceability-symbol'];
    if(env.map){
      layerList.map((layerId) => {
        if(env.map.getLayer(layerId)){
          let filterName = layerId==='traceability'||layerId==='traceability-symbol'?'vro':'vol_base';
          let filterStr = minFlow===0?['>', filterName, minFlow]:['>=', filterName, minFlow];
          env.map.setFilter(layerId,filterStr);
        }
      })
    }
  }

  getRoadLinePaint(){
    let map = env.map;
    let projectId = this._view.cur_pro_id;
    let color = this._view.lineNewColor;
    let color1 = this._view.lineChangeColor;
    let url = MYCONF.service.roadLinePbf + `?projectid=${projectId}&token=${sessionStorage.getItem("token")}`;
    if(map.getSource("roadLinePaint")) map.removeSource("roadLinePaint");
    map.addSource("roadLinePaint",{
      type:"vector",
      tiles: [url]
    });
    if(map.getLayer("roadLinePaint")) map.removeLayer("roadLinePaint");
    map.addLayer({
      'id': 'roadLinePaint',
      'type': 'line',
      'source': 'roadLinePaint',
      'source-layer': 'linkLayer',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "edittag",
          "stops": [
            [0,color],
            [1,color1],
          ]
        },
        "line-width": 8
      }
    });
  }
}
