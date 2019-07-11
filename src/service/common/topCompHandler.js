/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from '../../util/event-bus'
import mapCommonLayer from '../map/mapCommonLayer'

export default class topCompHandler {
  constructor(_view) {
    this._view = _view;
    this.token = sessionStorage.getItem('token');
    this.lineList = [];
    this.polygonList = [];
  }

  initEditPlugin() {
    let map = env.map;
    let edit = new minemap.edit.init(map, {
      boxSelect: true,
      touchEnabled: false,
      displayControlsDefault: false,
      showButtons: false,
      keybindings: false
    });
    env.edit = edit;
    this.regMeasureEvent();
  }

  regMeasureEvent() {
    let map = env.map;
    let edit = env.edit;
    let lineList = this.lineList;
    let polygonList = this.polygonList;
    let _this = this;
    map.on("edit.record.create", (e) => {
      if (!_this._view.active_tool || _this._view.active_tool === 'polygon') return;
      if (parseInt(e.record.type) === 2 && parseInt(e.record.action) === 3) {
        return;
      }//修改propertiew-更改颜色操作后
      let measureIds = _this._view.measureIds;
      let curId = e.record.features[0].id;
      if (measureIds.indexOf(curId) === -1) {
        _this._view.measureIds.push(curId);
      }
      let lineArr = ['0.00'];
      let geojson = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": []
        }
      };
      let lineMarker;

      if (e.record.features[0].geometry.type !== 'LineString') return;
      if (e.record.type === 2) {   //修改
        lineList.map((item, index) => {
          if (item.lineId === e.record.features[0].id) {
            item.markers.map((marker) => {
              map.removeMarker(marker);
            });
          }
        });
      }
      let lineItem = {
        lineId: null,
        markers: [],
      };

      lineItem.lineId = e.record.features[0].id;

      let coords = e.record.features[0].geometry.coordinates;

      let promise = new Promise((resolve, reject) => {
        for (let i = 1; i < coords.length; i++) {
          let url = MYCONF.service.editLinePanelLength;
          let postData = {
            linkPointList: JSON.parse(JSON.stringify([{lat: coords[i][1], lng: coords[i][0]}, {
              lat: coords[i - 1][1],
              lng: coords[i - 1][0]
            }], ['lat', 'lng']))
          };
          _this._view.$http.post(url + `?projectid=''&token=${sessionStorage.getItem('token')}`, postData, {
            'header': {
              'Content-Type': "application/json"
            }
          }).then((res) => {
            let result = parseFloat(res.body.result / 1000).toFixed(2);
            lineArr.push(result);
            setTimeout(() => {
              resolve(lineArr);
            },300);
          }).catch(err => {
            console.log(err)
          })
        }
      });
      // for (let i = 0; i < coords.length - 1; i++) {
        /*let curLen = _this.autoRoadLength(coords[i], coords[i + 1]);
        lineArr.push(curLen);*/
        // geojson.geometry.coordinates = coords.slice(0, i + 2);
        // lineArr.push(turf.length(geojson, {units: 'kilometers'}).toFixed(2));
      // }
      promise.then(() => {
        for (let j = 1; j < lineArr.length; j++) {
          let itemBox = j === 0 ? mapCommonLayer.createItemMarker(0) : mapCommonLayer.createItemMarker(lineArr[j]);
          lineMarker = new minemap.Marker(itemBox, {offset: [-5, 5]})
            .setLngLat(coords[j])
            .addTo(map);
          lineItem.markers.push(lineMarker);
        }
      });

      let closeBox = mapCommonLayer.createCloseMarker();
      let marker = new minemap.Marker(closeBox, {offset: [8, -8]})
        .setLngLat(coords[lineArr.length - 1])
        .addTo(map);
      lineItem.markers.push(marker);

      _this.lineList.push(lineItem);

      closeBox.onclick = function () {
        _this.clearLineItem(lineItem);
      };
      setTimeout(() => {
        let featureId = env.edit.setSelected([curId]);
        env.edit.setCustomStyle({
          "lineColor": "#E63D35",
          "lineWidth": 2
        });
        return;
      }, 200)
    });

    map.on("edit.record.create", (e) => {
      if (!_this._view.active_tool || _this._view.active_tool === 'line') return;
      if (parseInt(e.record.type) === 2 && parseInt(e.record.action) === 3) {
        return;
      }//修改propertiew-更改颜色操作后
      let measureIds = _this._view.measureIds;
      let curId = e.record.features[0].id;
      if (measureIds.indexOf(curId) === -1) {
        _this._view.measureIds.push(curId);
      }
      let geojson = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": []
        }
      };
      let lenMarker;
      let areaMarker;
      let perimeter;
      let center;
      let area;

      if (e.record.features[0].geometry.type !== 'Polygon') return;
      if (e.record.type === 2) {   //修改
        polygonList.map((item, index) => {
          if (item.polyId === e.record.features[0].id) {
            item.markers.map((marker) => {
              map.removeMarker(marker);
            });
          }
        });
      }
      let polyItem = {
        polyId: null,
        markers: [],
      };

      polyItem.polyId = e.record.features[0].id;

      let coords = e.record.features[0].geometry.coordinates[0];
      geojson.geometry.coordinates = [coords];

      let promise = new Promise((resolve, reject) => {
        let coordList = [];
        for (let i=0;i<coords.length;i++){
          coordList.push({lat: coords[i][1], lng: coords[i][0]});
        }
        let url = MYCONF.service.editLinePanelLength;
        let areaUrl = MYCONF.service.calcVirtualPolygonArea;
        let postData = {
          linkPointList: JSON.parse(JSON.stringify(coordList, ['lat', 'lng']))
        };
        _this._view.$http.post(url + `?projectid=''&token=${sessionStorage.getItem('token')}`, postData, {
          'header': {
            'Content-Type': "application/json"
          }
        }).then((res) => {
          perimeter = parseFloat(res.body.result / 1000).toFixed(2);
        }).catch(err => {
          console.log(err)
        });
        _this._view.$http.post(areaUrl + `?projectid=''&token=${sessionStorage.getItem('token')}`, postData, {
          'header': {
            'Content-Type': "application/json"
          }
        }).then((res) => {
          area = parseFloat(res.body.result / 1000000).toFixed(2);
          setTimeout(() => {
            resolve();
          },200)
        }).catch(err => {
          console.log(err)
        })
      });

      promise.then(() => {
        center = turf.centerOfMass(geojson).geometry.coordinates;
        // area = parseFloat(turf.area(geojson) / 1000000).toFixed(2);

        let lenBox = mapCommonLayer.createTextMarker('周长', perimeter);
        lenMarker = new minemap.Marker(lenBox, {offset: [-40, -5]})
          .setLngLat(center)
          .addTo(map);
        polyItem.markers.push(lenMarker);

        let areaBox = mapCommonLayer.createTextMarker('面积', area);
        areaMarker = new minemap.Marker(areaBox, {offset: [-40, 5]})
          .setLngLat(center)
          .addTo(map);
        polyItem.markers.push(areaMarker);
      });


      let closeBox = mapCommonLayer.createCloseMarker();
      let marker = new minemap.Marker(closeBox, {offset: [2, -18]})
        .setLngLat(coords[coords.length - 1])
        .addTo(map);
      polyItem.markers.push(marker);

      _this.polygonList.push(polyItem);

      closeBox.onclick = function () {
        _this.clearPolyItem(polyItem);
      };
      setTimeout(() => {
        let featureId = env.edit.setSelected([e.record.features[0].id]);
        env.edit.setCustomStyle({
          "fillColor": "#E63D35",
          "fillOpacity": 0.1,
          "fillOutlineColor": "#E63D35",
          "lineColor": "#E63D35",
          "circleColor": "#E63D35",
        });
        return;
      }, 200)
    });
  }

  clearLineItem(lineItem) {
    let map = env.map;
    let edit = env.edit;
    edit.draw.delete(lineItem.lineId);
    lineItem.markers.map((marker) => {
      map.removeMarker(marker);
    });
    let _this = this;
    this.lineList.map((item, index) => {
      if (item.lineId === lineItem.lineId) {
        _this.lineList.splice(index, 1);
      }
    });
  }

  clearPolyItem(polyItem) {
    let map = env.map;
    let edit = env.edit;
    edit.draw.delete(polyItem.polyId);
    polyItem.markers.map((marker) => {
      map.removeMarker(marker);
    });
    let _this = this;
    this.polygonList.map((item, index) => {
      if (item.polyId === polyItem.polyId) {
        _this.polygonList.splice(index, 1);
      }
    });
  }

  deleteAllMeasure() {
    let map = env.map;
    if(env.edit) env.edit.draw.delete(this._view.measureIds);
    this.lineList.map((item, index) => {
      map.removeMarkers(item.markers);
    });
    this.polygonList.map((item, index) => {
      map.removeMarkers(item.markers);
    });
  }

  getMapView(){
    let preStr = 'data:image/jpeg;base64,';
    let curMenu = '';
    for (let i=0;i<4;i++){
      curMenu = `map_view${i+1}`;
      let url = MYCONF.service.findSettings + `${curMenu}&token=${sessionStorage.getItem("token")}`;
      this._view.$http.get(url).then((res) => {
        res = res.body;
        if (res.result){
          if(res.result.length === 0){
            return ;         //之前没有保存应用记录
          }else{
            let mapView = this._view.map_view;
            res.result.map((item) => {
              if(item.key === 'imgUrl'){
                mapView[i].imgUrl = preStr + item.value;
              }else if(item.key === 'zoom'){
                mapView[i].zoom = item.value;
              }else if(item.key === 'center'){
                let centerStr = item.value.split("&");
                mapView[i].center = [parseFloat(centerStr[0]),parseFloat(centerStr[1])];
              }
            });
            this._view.updateMapView(mapView);
          }
        }
      });
    }
  }
}
