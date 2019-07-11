/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import MapCommonLayer from "../map/mapCommonLayer";

export default class stepPanelHandler_5 {
  constructor(_view) {
    this._view = _view;
  }

  getEntryInfo(){
    let url = MYCONF.service.findPWStaticsByproject;
    let curProId = this._view.cur_pro_id;
    let _this = this;
    this._view.$http.get(url + `projectid=${curProId}&token=${sessionStorage.getItem("token")}`).then((res) => {
      res = res.body;
      if (res.success) {
        let result = res.result;
        _this._view.entryCount = result.passageway_count;
        _this._view.landCount = result.land_count;
        _this._view.landEntry = result.pwland_count;
      }
    });
  }

  getEditedRoads() {
    let projectId = this._view.cur_pro_id; //roadCenter
    let roadCenter = [];
    let roadFeatures = [];
    let _this = this;
    let map = env.map;
    let url = MYCONF.service.getEditedRoadInfo + `?projectid=${projectId}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url).then((res) => {
      let roadList = res.body.savedUnitList;
      roadList.map((road) => {
        roadCenter.push([road.roadFirstPointLon, road.roadFirstPointLat]);
        roadFeatures.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [road.roadFirstPointLon, road.roadFirstPointLat]
          },
          "properties": {
            "roadname": road.roadname,
            "edittag": road.editroadtype === 'N' ? 0 : 1
          }
        })
      });
      _this._view.roadCenter = roadCenter;
      _this._view.restList = roadCenter;

      if (map.getLayer("roadLineLayerLable")) map.removeLayer("roadLineLayerLable");
      if (map.getSource("roadLineSymbolAll")) map.removeSource("roadLineSymbolAll");
      map.addSource("roadLineSymbolAll", {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": roadFeatures
        }
      });
      map.addLayer({
        "id": "roadLineLayerLable",
        "type": "symbol",
        "source": 'roadLineSymbolAll',
        "layout": {
          "text-field": "{roadname}",
          // "symbol-placement": "line",
          "text-anchor": "center",
          "text-allow-overlap": true,   //图标覆盖文字允许压盖
          "text-ignore-placement": true,
          "text-offset": [0.8, 0.9],
          "text-size": 11,
        },
        "paint": {
          'text-color': {
            "type": "interval",
            "property": "edittag",
            "stops": [
              [0, '#e63d35'],
              [1, '#3b90ee'],
            ]
          },
          "text-halo-color": '#fff',
          "text-halo-width": 1.3,
          "text-opacity": 0.9,
          "text-halo-blur": 0.5,
        },
      });
    });
  }

  addRoadLineLayer() {
    let map = env.map;
    let projectId = this._view.cur_pro_id;
    let url = MYCONF.service.roadLinePbf + `?projectid=${projectId}&token=${sessionStorage.getItem("token")}`;

    if (map.getLayer("roadLineLayerAll")) map.removeLayer("roadLineLayerAll");
    if (map.getSource("roadLineLayerAll")) map.removeSource("roadLineLayerAll");
    map.addSource("roadLineLayerAll", {
      type: "vector",
      tiles: [url]
    });
    map.addLayer({
      'id': 'roadLineLayerAll',
      'type': 'line',
      'source': 'roadLineLayerAll',
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
            [0, '#e63d35'],
            [1, '#3b90ee'],
          ]
        },
        "line-width": 5
      }
    });
    /*if (map.getLayer("roadLineLayerLable")) map.removeLayer("roadLineLayerLable");
    map.addLayer({
      "id": "roadLineLayerLable",
      "type": "symbol",
      "source": 'roadLineLayerAll',
      'source-layer': 'linkLayer',
      "layout": {
        "text-field": "{roadname}",
        // "symbol-placement": "line",
        "text-anchor": "center",
        "text-allow-overlap": false,   //图标覆盖文字允许压盖
        "text-ignore-placement": true,
        "text-offset": [0.8, 0.9],
        "text-size": 13,
      },
      "paint": {
        'text-color': {
          "type": "interval",
          "property": "edittag",
          "stops": [
            [0, '#e63d35'],
            [1, '#3b90ee'],
          ]
        },
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
    });*/
  }

  setEntryNumShow(bool){
    let map = env.map;
    let numOpacity = bool ? 0.8 : 0;
    if(map.getLayer("entryLayerAll")) map.setPaintProperty("entryLayerAll", 'text-opacity', numOpacity);
  }

  setIconSize(count){
    let map = env.map;
    let stopArr = [];
    for (let i=10;i<16;i++){
      stopArr.push([i,parseFloat(((i-10)/10+0.5) * (1+count/10))]);
    }
    let stopObj = {
      "stops":stopArr
    };
    if(map.getLayer("entryLayerAll")) map.setLayoutProperty("entryLayerAll", 'icon-size', stopObj);
  }
}
