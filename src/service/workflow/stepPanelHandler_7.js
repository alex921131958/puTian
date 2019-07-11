/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import datetimeHelper from "../../util/datetime-helper";
import MapCommonLayer from "../map/mapCommonLayer";

export default class stepPanelHandler_7 {
  constructor(_view) {
    this._view = _view;
  }

  addEntryLayer() {
    let url = MYCONF.service.findPWListByProject;
    let curProId = this._view.cur_pro_id;
    let map = env.map;
    let _this = this;
    let pointList = [];
    this._view.$http.get(url + `projectid=${curProId}&token=${sessionStorage.getItem("token")}`).then((res) => {
      res = res.body;
      if (res.success) {
        let result = res.result;

        _this.addLandLayers(result);
        result.map((item) => {
          let pointItem = {
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [item.x, item.y]
            },
            "properties": {
              "landid": item.landid,
              "linkid": item.linkid,
              "ratio": item.ratio,
              "name": item.name,
            }
          };
          pointList.push(pointItem);
        });

        if (map.getLayer("entryLayerAll")) map.removeLayer("entryLayerAll");
        if (map.getSource("entryLayerAll")) map.removeSource("entryLayerAll");
        map.addSource("entryLayerAll", {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": pointList
          }
        });
        map.addLayer({
          'id': 'entryLayerAll',
          'type': 'symbol',
          'source': 'entryLayerAll',
          'layout': {
            'icon-image': 'entry',
            'icon-size': {
              "stops": [
                [10, 0.5],
                [12, 0.7],
                [13, 0.8],
                [14, 1],
                [15, 1.2],
                [16, 1.5]
              ]
            },
            // 'icon-size':1,
            "text-field": "{name}",
            "text-offset": [0, 0.7],
            "text-size": {
              "stops": [
                [12, 9],
                [14, 10],
                [16, 12]
              ]
            },
            "text-anchor": "top",
            "icon-allow-overlap": true,
            "text-allow-overlap": false,
            "icon-ignore-placement": true,
          },
          "paint": {
            "text-color": "#d33027",
            "text-halo-color": '#fff',
            "text-halo-width": 1.3,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          }
        });
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
    let landCenter = [];
    let url = MYCONF.service.findPWLandListByProject + `token=${sessionStorage.getItem("token")}&projectid=${projectId}`;
    this._view.$http.get(url).then((res) => {
      let result = res.body.result;
      result.map((item, index) => {
        landCenter.push([item.center_x, item.center_y]);
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
        let pointFeature = {
          type: 'Feature',
          properties: {
            id: item.id,
            name: item.name
          },
          geometry: {
            type: 'Point',
            coordinates: [item.center_x, item.center_y]
          }
        };
        pointList.push(pointFeature);
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
        })
        polygonList.push(polygonFeature);
        layerLineList.push(lineFeature);
      });
      _this.addPolygonLayer(polygonList);   //地块样式面线
      _this.addLandLine(layerLineList);
      _this.addEntryStyle(pointList, lineList);
      _this._view.landCenter = landCenter;
    }).catch((err) => {
      console.log(err)
    })
  }

  addPolygonLayer(polygonList) {
    let map = env.map;
    let landId = this._view.curLandId;
    if (map.getLayer("polygonLayer")) map.removeLayer("polygonLayer");
    if (map.getSource("polygonLayer")) map.removeSource("polygonLayer");
    map.addSource("polygonLayer", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": polygonList
      }
    });
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

  addLandLine(lineList) {
    let map = env.map;
    if (map.getLayer("landLine")) map.removeLayer("landLine");
    if (map.getSource("landLine")) map.removeSource("landLine");
    map.addSource("landLine", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": lineList
      }
    });
    map.addLayer({
      'id': 'landLine',
      'type': 'line',
      'source': 'landLine',
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

  addEntryStyle(pointList, lineList) {
    let map = env.map;
    if (map.getLayer("entryLineAll")) map.removeLayer("entryLineAll");
    if (map.getSource("entryLineAll")) map.removeSource("entryLineAll");
    map.addSource("entryLineAll", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": lineList
      }
    });
    map.addLayer({
      'id': 'entryLineAll',
      'type': 'line',
      'source': 'entryLineAll',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        "line-color": "#d33027",
        "line-width": 2,
        "line-opacity": 0.6,
      }
    });

    if (map.getLayer("landCenterLayer")) map.removeLayer("landCenterLayer");
    if (map.getLayer("landNameAll")) map.removeLayer("landNameAll");
    if (map.getSource("landCenterLayer")) map.removeSource("landCenterLayer");
    map.addSource("landCenterLayer", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": pointList
      }
    });
    map.addLayer({
      'id': 'landCenterLayer',
      'type': 'circle',
      'source': 'landCenterLayer',
      'paint': {
        "circle-radius": {
          'base': 1,
          'stops': [[12, 2], [16, 3]]
        },
        'circle-color': "#ffffff",      //填充圆形的颜色
        'circle-blur': 0.5,              //模糊程度，默认0
        'circle-opacity': 0.9,             //透明度，默认为1
        'circle-stroke-width':1.5,
        'circle-stroke-color':"#333333",
        'circle-stroke-opacity': 0.8,

      }
    });
    map.addLayer({
      "id": "landNameAll",
      "type": "symbol",
      "source": "landCenterLayer",
      "layout": {
        "text-field": "{name}",
        "text-offset": [0, 0],
        "text-size": 10,
        "text-anchor": "top",
      },
      "paint": {
        "text-color": "#d33027"
      },
      "minzoom": 12.5
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
        roadCenter.push([parseFloat(road.roadFirstPointLon), parseFloat(road.roadFirstPointLat)]);
        roadFeatures.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [parseFloat(road.roadFirstPointLon), parseFloat(road.roadFirstPointLat)]
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

  getStep7Image() {
    let map = env.map;
    let _this = this;
    let landCenter = this._view.landCenter;
    let roadCenter = this._view.roadCenter;
    this._view.imgIndex = 0;
    if (landCenter.length === 0 && roadCenter.length === 0) {
      _this._view.$Message.error({
        content: '暂无规划用地和道路，请确认规划内容！',
        duration: 5,
        closable: true
      });
    } else {
      this._view.updateGlobalMask(true);

      let projectId = this._view.cur_pro_id; //roadCenter
      let _this = this;
      let url = MYCONF.service.teReportCheck + `projectid=${projectId}&token=${sessionStorage.getItem("token")}`;
      this._view.$http.get(url).then((res) => {
        res = res.body;
        let result = res.result;
        let isBaseLoaded = !!result.step7_pic;
        // if(isBaseLoaded){
        //   _this.exportFun();
        // }else{
        //   _this._view.updateReportLoading(false);
          this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 1500);
        // }
      });
    }

  }

  rangeImageFun() {
    let roadLayerList = ['roadLineLayerAll', 'roadLineLayerLable'];
    let landLayerList = ['polygonLayer', 'landLine', 'landCenterLayer', 'landNameAll'];
    let landLayerName = ['landNameAll','projectCenter'];
    let entryLayerList = ['entryLayerAll', 'entryLineAll'];
    let maskLayer = ['mask'];
    let map = env.map;
    let landCenter = this._view.landCenter;
    let roadCenter = this._view.roadCenter;
    let imgIndex = this._view.imgIndex;
    let curId = this._view.cur_pro_id;
    let curProject = this._view.cur_project;
    let _this = this;
    let rangedList = [];
    let ranged = [];
    let restList = landCenter;
    let centerList = landCenter;
    let restRoad = roadCenter;
    let centerRoad = roadCenter;
    let lineStr;
    let bbox;
    let perimeter;
    let isRanged = true;
    let bboxList = [];
    let imageName = null;
    let imageDesc = null;
    switch (imgIndex) {
      case 0:  //项目位置一张图
        this.hideLayerList(roadLayerList);
        this.hideLayerList(landLayerList);
        this.hideLayerList(entryLayerList);
        this.hideLayerList(maskLayer);
        let proCenter = MYCONF.map.center;
        if(!landCenter || landCenter.length===0){
          map.easeTo({
            center: MYCONF.map.center,
            zoom: 12,
            duration: 200
          });
        }else if(landCenter.length===1){
          proCenter = landCenter[0];
          map.easeTo({
            center: landCenter[0],
            zoom: 14,
            duration: 200
          });
        }else if(landCenter.length===2){
          let point1 = turf.point(landCenter[0]);
          let point2 = turf.point(landCenter[1]);
          proCenter = turf.midpoint(point1, point2).geometry.coordinates;
          map.easeTo({
            center: proCenter,
            zoom: 14,
            duration: 200
          });
        }else{
          let featureList = [];
          landCenter.map((item) => {
            featureList.push(turf.point([item[0],item[1]]));
          });
          proCenter = turf.center(turf.featureCollection(featureList)).geometry.coordinates;
          map.easeTo({
            center: proCenter,
            zoom: 14,
            duration: 200
          });
        }
        this.addCircleLayer(proCenter);
        setTimeout(() => {
          _this.saveImage('projectLocation', 'landMap');
        }, 1300);
        this._view.imgIndex += 1;
        break;
      case 1:   //地块1公里规则
        this.showLayerList(landLayerList);
        this.showLayerList(entryLayerList);
        this.hideLayerList(roadLayerList);
        this.hideLayerList(landLayerName);
        if (landCenter.length === 0) {
          _this._view.$Message.warning({
            content: '暂无规划用地！',
            duration: 5,
            closable: true
          });
          this._view.imgIndex += 1;
        } else if (landCenter.length === 1) {
          clearInterval(this._view.imgTimer);
          this._view.imgTimer = null;
          map.easeTo({
            center: landCenter[0],
            zoom: 15.5,
            duration: 100
          });
          this._view.imgIndex += 1;
          _this.showLayerList(roadLayerList);  //打开道路图层
          setTimeout(() => {
            _this.saveImage(`landLocation-1`, `用地位置图1`);
            // _this.hideLayerList(roadLayerList);  //隐藏道路图层
          },600);
          setTimeout(() => {
            _this.saveImage(`entryMap-1`, `用地出入口位置图1`);
            _this.hideLayerList(entryLayerList);  //隐藏出入口样式图层
            map.setZoom(15);
            _this.landUseLayer(true);  //打开用地性质
            let t = setInterval(function () {
              if (map) {
                if (map.areTilesLoaded()) {
                  _this.saveImage(`landMap-1`, `项目用地位置图1`);
                  _this.landUseLayer(false);
                  _this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 1000);
                  clearInterval(t);
                }
              } else {
                clearInterval(t);
              }
            }, 800);
          }, 1500);
        } else {  //用地总数至少2块的情况下
          clearInterval(this._view.imgTimer);
          this._view.imgTimer = null;
          // this.hideLayerList(landLayerList);
          let calIndex = 0;
          while (restList.length > 0) {
            calIndex++;
            rangedList = [];
            centerList = [...restList];

            restList.forEach((item, index) => {
              isRanged = true;
              if (rangedList.length > 0) {
                rangedList.map((rangedLand) => {
                  lineStr = turf.lineString([rangedLand, item]);
                  perimeter = turf.length(lineStr, {units: 'kilometers'});
                  if (perimeter > 1) {
                    isRanged = false;
                  }
                });
              }
              if (isRanged) {
                rangedList.push(item);
                centerList.splice(centerList.findIndex(land => land[0] === item[0]), 1);
              }
            });
            restList = [...centerList];

            bboxList.push(rangedList);
            // _this.getRangedLand(rangedList,calIndex);
          }
          //1公里分配完再下一类别图幅 - bboxList总一公里分配list
          _this.getRangedLand(bboxList,0);
        }
        break;
      case 2:
        this.showLayerList(roadLayerList);
        this.hideLayerList(landLayerList);
        this.hideLayerList(entryLayerList);
        if (roadCenter.length === 0) {
          _this._view.$Message.warning({
            content: '暂无规划道路！',
            duration: 5,
            closable: true
          });
          this._view.imgIndex += 1;
        } else if (roadCenter.length === 1) {
          map.easeTo({
            center: roadCenter[0],
            zoom: 17,
            duration: 200
          });
          this._view.imgIndex += 1;
          setTimeout(() => {
            // _this.saveImage(`roadLocation-1`, `道路位置图1`);
            _this.saveImage('roadMap-1', '项目道路位置图1');
          }, 1200);
        } else {  //道路总数至少2条的情况下
          clearInterval(this._view.imgTimer);
          this._view.imgTimer = null;
          let calIndex = 0;
          while (restRoad.length > 0) {
            calIndex += 1;
            rangedList = [];
            centerRoad = [...restRoad];

            restRoad.forEach((item, index) => {
              isRanged = true;
              if (rangedList.length > 0) {
                rangedList.map((rangedLand) => {
                  lineStr = turf.lineString([rangedLand, item]);
                  perimeter = turf.length(lineStr, {units: 'kilometers'});
                  if (perimeter > 1) {
                    isRanged = false;
                  }
                });
              }
              if (isRanged) {
                rangedList.push(item);
                centerRoad.splice(centerRoad.findIndex(land => land[0] === item[0]), 1);
              }
            });
            restRoad = [...centerRoad];

            bboxList.push(rangedList);
          }
          //1公里分配完再下一类别图幅 - bboxList是总一公里分配list
         _this.getRangedRoad(bboxList,0);
          // this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 1500);
        }
        break;
      default:
        clearInterval(this._view.imgTimer);
        this._view.imgTimer = null;
        this.showLayerList(roadLayerList);
        this.showLayerList(landLayerList);
        this.showLayerList(entryLayerList);
        this.showLayerList(maskLayer);
        setTimeout(() => {
          _this.exportFun();
        }, 1000);
        break;
    }
  }

  exportFun(){
    let map = env.map;
    let curId = this._view.cur_pro_id;
    let curProject = this._view.cur_project;
    let _this = this;
    let url = MYCONF.service.getReport + `token=${sessionStorage.getItem("token")}&projectid=${curId}`;
    //转为报告到处提示
    _this._view.updateReportLoading(true);

    _this._view.$http.get(url, {responseType: 'arraybuffer'}).then(res => {
      //请求二进制文件流
      // resolve to Blob
      if(res.status == 200){
        _this._view.updateGlobalMask(false);
        let blob = new Blob([res.data], {
          type: `application/msword` //word文档为msword,pdf文档为pdf
        });
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        let fname = `${curProject.name}-${curId}`; //下载文件的名字
        link.href = objectUrl;
        link.setAttribute("download", fname);
        document.body.appendChild(link);
        link.click();
      }else {
        _this._view.updateGlobalMask(false);
        _this._view.$Message.warning({
          content:  '简报导出失败，请重试',
          closable: true
        });
      }


    },err => {
      _this._view.updateGlobalMask(false);
      _this._view.$Message.warning({
        content:  '简报导出失败，请重试',
        closable: true
      });
    }).then(blob => {
      // use image Blob
    });
  }

  getRangedLand(boxList,count) {
    let map = env.map;
    let _this = this;
    let entryLayerList = ['entryLayerAll', 'entryLineAll'];

    _this.showLayerList(entryLayerList);  //显示出入口样式图层
    _this.getRangedBox('land', boxList[count], count);
    let t = setInterval(function () {
      if (map && boxList[count]) {
        if (map.areTilesLoaded()) {
          _this.saveLandRoad('land', boxList, count);
          // count = count + 1;
          // if (count > boxList.length - 1) {
          //   _this._view.imgIndex += 1;
          //   if (!_this._view.imgTimer) _this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 3000);
          // }else{
          //   setTimeout(() => {
          //     _this.getRangedLand(boxList,count);
          //   },3000);
          // }
          clearInterval(t);
        }
      } else {
        clearInterval(t);
      }
    }, 500);
  }

  getRangedRoad(boxList,count) {
    let _this = this;
    let roadCenter = this._view.roadCenter;
    // let landCenter = this._view.landCenter;
    let map = env.map;

    _this.getRangedBox('road', boxList[count], count);
    let t = setInterval(function () {
      if (map && boxList[count]) {
        if (map.areTilesLoaded()) {
          _this.saveLandRoad('road', boxList, count);
          count = count + 1;
          if (count > boxList.length - 1) {
            _this._view.imgIndex += 1;
            if (!_this._view.imgTimer) _this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 3000);
            let lineStr = turf.lineString(roadCenter);
            let bbox = turf.bbox(lineStr);
            map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
              linear: true,
              padding: {
                top: 250,
                bottom: 250,
                left: 250,
                right: 250
              }
            });
          }else{
            setTimeout(() => {
              _this.getRangedRoad(boxList,count);
            },3000);
          }
          clearInterval(t);
        }
      } else {
        clearInterval(t);
      }
    }, 500);
  }

  getRangedBox(type, rangedList, calIndex) {
    let map = env.map;
    let _this = this;
    if (rangedList.length > 1) {
      let lineStr = turf.lineString(rangedList);
      let bbox = turf.bbox(lineStr);
      map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
        linear: true,
        padding: {
          top: 300,
          bottom: 300,
          left: 300,
          right: 300
        }
      });
    } else if (rangedList.length === 1) {
      map.easeTo({
        center: rangedList[0],
        zoom: 17,
        duration: 200
      });
    } else {
      return;
    }
  }

  saveLandRoad(type, rangedList, calIndex){
    let tempList = rangedList[calIndex];
    let _this = this;
    let map = env.map;
    let entryLayerList = ['entryLayerAll', 'entryLineAll'];
    if (type === 'land') {
      _this.showLayerList(entryLayerList);  //显示出入口样式图层
      setTimeout(() => {
        _this.saveImage(`entryMap-${calIndex + 1}`, `用地出入口位置图${calIndex + 1}`);
        _this.saveImage(`landLocation-${calIndex + 1}`, `用地位置图${calIndex + 1}`);
        _this.hideLayerList(entryLayerList);  //隐藏出入口样式图层
        _this.landUseLayer(true);
        map.easeTo({
          center: map.getCenter(),
          zoom: map.getZoom()-2,
          duration: 200
        });
        let t = setInterval(function () {
          if (map) {
            if (map.areTilesLoaded()) {
              _this.saveImage(`landMap-${calIndex + 1}`, `项目用地位置图${calIndex + 1}`);
              _this.landUseLayer(false);
              // _this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 1000);

              calIndex = calIndex + 1;
              if (calIndex > rangedList.length - 1) {
                _this._view.imgIndex += 1;
                if (!_this._view.imgTimer) _this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 1000);
              }else{
                _this.getRangedLand(rangedList,calIndex);
              }

              clearInterval(t);
            }
          } else {
            clearInterval(t);
          }
        }, 500);
      }, 2000);

      // setTimeout(() => {
      //   _this.saveImage(`landMap-${calIndex + 1}`, `项目用地位置图${calIndex + 1}`);
      //   _this.saveImage(`landLocation-${calIndex + 1}`, `用地位置图${calIndex + 1}`);
      // }, 2800);
    } else {
      // _this.saveImage(`roadLocation-${calIndex + 1}`, `项目道路位置图${calIndex + 1}`);
      _this.saveImage(`roadMap-${calIndex + 1}`, `道路位置图${calIndex + 1}`);
    }
  }

  saveImage(name, desc) {
    let c = env.map.getCanvas();
    let img_data = Canvas2Image.saveAsJPEG(c, true).getAttribute('src');
    MapCommonLayer.upLoadImage(this, img_data, name, desc);
    //图片下载注释
    // datetimeHelper.saveFile(img_data, `${desc}.jpg`);
  }

  hideLayerList(list) {
    let map = env.map;
    list.map((layer) => {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'none');
      }
    });
  }

  showLayerList(list) {
    let map = env.map;
    list.map((layer) => {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'visible');
      }
    });
  }

  teReportCheck() {
    let projectId = this._view.cur_pro_id; //roadCenter
    let _this = this;
    let url = MYCONF.service.teReportCheck + `projectid=${projectId}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url).then((res) => {
      res = res.body;
      let result = res.result;
      //用地规划
      if(result.land_count === 0){
        _this._view.checkList[0].name = '暂无规划用地';
        _this._view.checkList[0].state = true;
      }else if(result.land_count>0 && result.land_unpredict===0){
        _this._view.checkList[0].name = '用地规划与交通分布预测';
        _this._view.checkList[0].state = true;
      }else{
        _this._view.checkList[0].name = `存在${result.land_unpredict}个用地未进行交通分布预测，请到step3确认`;
        _this._view.checkList[0].state = false;
      }
      //出入口
      if(result.unpwland_count === 0){
        _this._view.checkList[1].name = '出入口设置';
        _this._view.checkList[1].state = true;
      }else{
        _this._view.checkList[1].name = `存在${result.unpwland_count}个用地未进行出入口设置，请到step4确认`;
        _this._view.checkList[1].state = false;
      }

      //道路规划  todo:暂且不检测道路
      // if(result.road_count === 0){
      //   _this._view.checkList[2].name = '暂无新改建道路';
      //   _this._view.checkList[2].state = true;
      // }else if(result.road_edited_unpredict===0 && result.road_new_unpredict===0 && result.road_check_status === '1'){
      //   _this._view.checkList[2].name = '道路规划';
      //   _this._view.checkList[2].state = true;
      // }else if(result.road_check_status === '0'){
      //   // _this._view.checkList[2].name = `存在${result.road_edited_unpredict+result.road_new_unpredict}个新改建道路未进行交通分布预测，请到step3确认`;
      //   _this._view.checkList[2].name = `存在新改建道路未进行交通分布预测，请到step3确认`;
      //   _this._view.checkList[2].state = false;
      // }

      //道路流量速度饱和度服务水平出图
      _this._view.checkList[2].state = !!result.pic_result;
      //交通分布预测出图
      _this._view.checkList[3].state = !!result.te_land_pic;
    });
  }

  landUseLayer(bool){
    let landTypeMap = MYCONF.LAND_TYPE_MAP;
    let map = env.map;
    if(bool){
      let url = MYCONF.service.getLandUse+ `?token=${sessionStorage.getItem("token")}`;
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
    }else{
      if (map.getLayer('landUse')) map.removeLayer('landUse');
      if (map.getSource('landUse')) map.removeSource('landUse');
    }
  }

  addCircleLayer(center){
    let map = env.map;
    if (map.getLayer('projectCenter')) map.removeLayer('projectCenter');
    if (map.getSource('projectCenter')) map.removeSource('projectCenter');
    map.addSource("projectCenter", {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": center
        },
        "properties": {}
      }
    });
    map.addLayer({
      "id": 'projectCenter',
      "type": "circle",
      "source": "projectCenter",
      'paint': {
        'circle-radius': {
          'base': 12,
          'stops': [[10, 14], [16, 16]]
        },

        'circle-color': "#aa2921",      //填充圆形的颜色
        'circle-opacity': 1,             //透明度，默认为1
        'circle-stroke-width':1,
        'circle-stroke-color':"#ffffff",
        'circle-stroke-opacity': 0.6,
      },
    });
  }
}
