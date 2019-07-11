/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import FLOWCONF from '../../components/workflow/flowConf'
import env from '../../common/env'
import MapCommonLayer from '../../service/map/mapCommonLayer'
import eventBus from '../../util/event-bus'
import datetimeHelper from "../../util/datetime-helper";

export default class flowTableHandler {
  constructor(_view) {
    this._view = _view;
  }

  getColumnData(item) {
    let _this = this;
    let curStep = _this._view.cur_step;
    switch (curStep) {
      case 2:
        this.getStep2TableColumn();
        break;
      case 4:
        this.getStep4TableColumn();
        break;
      case 5:
        this.getStep5TableColumn();
        break;
      default:                            //这里default用于通用表头处理
        this.getCommonTableColumn();
        break;
    }
  }

  getTableData(data1, data2) {
    let _this = this;
    let curStep = _this._view.cur_step;
    switch (curStep) {
      case 2:
        // this.getCurStep_3(data1, data2);
        this.getStep2TableData();
        break;
      case 4:
        this.getStep4TableData();
        this.getProjectOdLayer();
        break;
      case 5:
        this.getStep5TableData();
        this.addBaseLink();  //基础路网图层
        this.addEntryLayer();
        break;
      default:                            //这里default用于通用表头处理
        break;
    }
  }

  getCommonTableColumn() {
    let that = this._view;
    this._view.linkColumns = [
      {
        title: '编号',
        key: 'num',
        width: 40
      },
      {
        title: '道路Id',
        key: 'linkId',
      },
      {
        title: '路名',
        key: 'roadName',
      },
      {
        title: '路长',
        key: 'len',
      },
      {
        title: '流量',
        key: 'avgFlow',
      },
      {
        title: '定位',
        key: 'locate',
        render: (h, params) => {
          const row = params.row;
          return h('IconComp', {
            props: {
              type: 'android-locate',
              size: "18",
              color: "#fbe644",
            },
            style: {
              cursor: 'pointer'
            },
            on: {
              click: () => {
                let roadId = row.linkId;
                MapCommonLayer.locateCenter(that, roadId);
              }
            }
          })
        }
      }
    ]
  }

  getStep4TableColumn() {
    let that = this._view;
    let _this = this;
    this._view.linkColumns = [
      {
        title: '序号',
        key: 'num',
        width: 28
      },
      {
        title: '名称',
        key: 'name',
      },
      {
        title: 'ID',
        key: 'id',
        width: 90
      },
      {
        title: '用地面积',
        key: 'landarea',
        sortable: true
      },
      {
        title: '容积率',
        key: 'plotratio',
        width: 48,
      },
      {
        title: '建筑面积',
        key: 'buildarea',
      },
      {
        title: '用地性质',
        key: 'landtype',
      },
      {
        title: '使用人口(人)',
        key: 'population',
        sortable: true
      },
      {
        title: '日生成量',
        key: 'dayaoVol',
        sortable: true,
        className: 'red-right-column'
      },
      {
        title: '吸引量(pcu)',
        key: 'dayadVol',
        sortable: true,
        className: 'red-left-column'
      },
      {
        title: '早高峰生成量',
        key: 'daymoVol',
        sortable: true,
        className: 'red-right-column'
      },
      {
        title: '吸引量(pcu/h)',
        key: 'daymdVol',
        sortable: true,
        className: 'red-left-column'
      },
      {
        title: '晚高峰生成量',
        key: 'daynoVol',
        sortable: true,
        className: 'red-right-column'
      },
      {
        title: '吸引量(pcu/h)',
        key: 'dayndVol',
        sortable: true,
        className: 'red-left-column'
      },
      {
        title: '操作',
        key: 'locate',
        width: 106,
        render: (h, params) => {
          const row = params.row;
          return h('div', [
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-locate': true,
              },
              style: {
                fontSize: "1em",
                color: "#fbe644",
                cursor: 'pointer',
                position: 'relative',
                marginRight: '8px'
              },
              on: {
                click: () => {
                  let landId = row.id;
                  if (that.attributePanel && landId !== that.curLandId) {
                    that.$Message.warning({
                      content: '请先完成当前地块的编辑',
                      duration: 2,
                      closable: true
                    });
                    return false;
                  } else {
                    MapCommonLayer.onLandEditClick('static');

                    if (env.echartLayer) {   //防止挪动时的od
                      env.echartLayer.remove();
                      env.echartLayer = null;
                    }
                    _this.getLandOdLayer(landId);  //画当前地块OD
                    that.updateAllOdShow(false);
                  }
                  MapCommonLayer.toLandCenter(that, landId);
                  // let curId = env.edit.setSelected([landId]);
                  that.updateCurLandId(landId);
                  that.updateAttributePanel(null);
                  that.linkData.map((item, index) => {
                    if (item.id === landId) {
                      that.linkData[index]._highlight = true;
                    } else {
                      that.linkData[index]._highlight = false;
                    }
                  })
                }
              }
            }),
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-edit-panel': true,
              },
              style: {
                fontSize: "1em",
                color: "#00BFFF",
                cursor: 'pointer',
                position: 'relative',
                top: '-1px',
                marginRight: '8px'
              },
              on: {
                click: () => {
                  let landId = row.id;
                  MapCommonLayer.toLandCenter(that, landId);
                  let curId = env.edit.setSelected([landId]);
                  that.updateCurLandId(landId);
                  let feature = {
                    id: row.id,
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Polygon',
                      coordinates: [row.points]
                    }
                  };
                  that.updateCurEditPool(feature);
                  that.updateAttributePanel("land");
                  setTimeout(() => {
                    eventBus.$emit("editCurLandItem", row); //发送到属性面板操作
                  }, 200);

                  that.linkData.map((item, index) => {
                    if (item.id === landId) {
                      that.linkData[index]._highlight = true;
                    } else {
                      that.linkData[index]._highlight = false;
                    }
                  });
                }
              }
            }),
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-delete': true,
              },
              style: {
                fontSize: "1em",
                color: "#d33027",
                cursor: 'pointer',
              },
              on: {
                click: () => {
                  let landId = row.id;
                  _this._view.$Modal.confirm({
                    title: '确认提醒',
                    content: '<p>是否确认删除？</p>',
                    okText: '确定',
                    cancelText: '取消',
                    closable: true,
                    onOk: () => {
                      _this.deleteLandItem(landId);
                      MapCommonLayer.onLandEditClick('static');
                    }
                  });
                }
              }
            })
          ])
        }
      }];
  }

  getStep2TableColumn() {
    let that = this._view;
    let _this = this;
    this._view.linkColumns = [
      {
        title: '序号:',
        key: 'num',
        width: 36
      },
      {
        title: '道路名称:',
        key: 'name',
      },
      {
        title: 'ID:',
        key: 'id',
      },
      {
        title: '道路类型:',
        key: 'type',
        sortable: true
      },
      {
        title: '道路等级:',
        key: 'level',
        sortable: true
      },
      {
        title: '道路长度:',
        key: 'len',
        sortable: true,
        sortMethod: function (a, b, type) {
          let _a = parseFloat(a);
          let _b = parseFloat(b);
          if (type === 'asc') {
            return _a < _b ? a : b
          } else {
            return _a > _b ? a : b
          }
        }
      },
      {
        title: '通行能力 上行:',
        key: 'tUpper',
        sortable: true,
        className: 'red-info-column'
      },
      {
        title: '下行:(pcu/h)',
        key: 'tLower',
        sortable: true,
        className: 'red-info-column'
      },
      {
        title: '自由流速度 上行:',
        key: 'sUpper',
        sortable: true,
        className: 'red-info-column'
      },
      {
        title: '下行:(km/h)',
        key: 'sLower',
        sortable: true,
        className: 'red-info-column'
      },
      {
        title: '车道 上行:',
        key: 'wUpper',
        sortable: true,
        className: 'red-info-column'
      },
      {
        title: '下行:(pcu/h)',
        key: 'wLower',
        sortable: true,
        className: 'red-info-column'
      },
      {
        title: '操作',
        key: 'locate',
        width: 106,
        render: (h, params) => {
          const row = params.row;
          return h('div', [
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-locate': true,
              },
              style: {
                fontSize: "1em",
                color: "#fbe644",
                cursor: 'pointer',
                position: 'relative',
                marginRight: '8px'
              },
              on: {
                click: () => {
                  if (that.curLinePool || that.curJudgeState) {
                    eventBus.$emit('paintWarning')
                  } else {
                    let roadId = row.id;
                    that.updateCurHighlightRoadId(roadId);
                    MapCommonLayer.toRoadCenter(that, roadId, that.cur_pro_id);
                    // _this.highlightRoad(roadId);
                    // let curId = env.edit.setSelected([landId]);
                    that.updateAttributePanel(null);
                    that.linkData.map((item, index) => {
                      that.linkData[index]._highlight = item.id === roadId;
                    })
                  }
                }
              }
            }),
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-edit-panel': true,
              },
              style: {
                fontSize: "1em",
                color: "#00BFFF",
                cursor: 'pointer',
                position: 'relative',
                top: '-1px',
                marginRight: '8px'
              },
              on: {
                click: () => {
                  if (that.curLinePool || that.curJudgeState) {
                    eventBus.$emit('paintWarning')
                  } else {
                    let roadId = row.id;
                    that.updateCurHighlightRoadId(roadId);
                    MapCommonLayer.toRoadCenter(that, roadId, that.cur_pro_id);
                    that.updateAttributePanel("road");
                    that.updateCurJudgeState("oldLine");
                    that.linkData.map((item, index) => {
                      that.linkData[index]._highlight = item.id === roadId;
                    })
                  }
                }
              }
            }),
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-delete': true,
              },
              style: {
                fontSize: "1em",
                color: "#d33027",
                cursor: 'pointer',
              },
              on: {
                click: () => {
                  let roadId = row.id;
                  _this._view.$Modal.confirm({
                    title: '确认提醒',
                    content: '<p>是否确认删除？</p>',
                    okText: '确定',
                    cancelText: '取消',
                    closable: true,
                    onOk: () => {
                      _this.deleteRoadItem(roadId);
                    }
                  });
                }
              }
            })
          ])
        }
      }];
  }

  getStep5TableColumn() {
    let that = this._view;
    let _this = this;
    this._view.linkColumns = [
      {
        title: '序号',
        key: 'num',
        width: 60
      },
      {
        title: '地块名称',
        key: 'name',
      },
      {
        title: 'ID',
        key: 'id',
      },
      {
        title: '已设定出入口',
        key: 'tag',
        // sortable: true,
        render: (h, params) => {
          const row = params.row;
          return h('div', [
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-success': parseInt(row.tag) === 1 ? true : false,
                'icon-none': parseInt(row.tag) === 1 ? false : true,
              },
              style: {
                fontSize: "1em",
                color: parseInt(row.tag) === 1 ? '#c7d540' : '#e63d35',
                cursor: 'pointer',
                position: 'relative',
                top: '-1px',
                marginRight: '8px'
              },
            }),
          ])
        }
      },
      {
        title: '出入口数量',
        key: 'count',
        sortable: true
      },
      {
        title: '操作',
        key: 'locate',
        width: 106,
        render: (h, params) => {
          const row = params.row;
          return h('div', [
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-locate': true,
              },
              style: {
                fontSize: "1em",
                color: "#fbe644",
                cursor: 'pointer',
                position: 'relative',
                marginRight: '8px'
              },
              on: {
                click: () => {
                  if (that.attributePanel === "outin" && row.id !== that.curLandId) {
                    that.$Message.warning({
                      content: '请先完成当前地块出入口编辑',
                      duration: 5,
                      closable: true
                    });
                    return;
                  }
                  _this.highlightLand(row);
                  that.updateCurLandId(row.id);
                  // eventBus.$emit("updateCurEntryLand",row)
                  let landId = row.id;
                  that.linkData.map((item, index) => {
                    if (item.id === landId) {
                      that.linkData[index]._highlight = true;
                    } else {
                      that.linkData[index]._highlight = false;
                    }
                  })
                }
              }
            }),
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-edit-panel': true,
              },
              style: {
                fontSize: "1em",
                color: "#00BFFF",
                cursor: 'pointer',
                position: 'relative',
                top: '-1px',
                marginRight: '6px'
              },
              on: {
                click: () => {
                  that.updateAttributePanel("outin");
                  _this.highlightLand(row);
                  that.updateCurLandId(row.id);
                  if (env.map.getLayer('entryLayerAll')) env.map.setFilter('entryLayerAll', ['!=', 'landid', row.id]);
                  if (env.map.getLayer('entryLineLayer')) env.map.setFilter('entryLineLayer', ['!=', 'landid', row.id]);
                  let timeInterval = that.attributePanel !== "outin" ? 500 : 10;
                  setTimeout(() => {
                    eventBus.$emit("updateCurEntryLand", row);   //编辑面板更新属性 --- marker替换getEntryItemInfo
                  }, timeInterval);
                  let landId = row.id;
                  that.linkData.map((item, index) => {
                    if (item.id === landId) {
                      that.linkData[index]._highlight = true;
                    } else {
                      that.linkData[index]._highlight = false;
                    }
                  });
                  if (env.map.getLayer("linkRoad")) env.map.setLayoutProperty("linkRoad", 'visibility', 'visible');
                  if (env.map.getLayer('linkRoad')) env.map.setFilter('linkRoad', ['!=', 'linkid', 0]);
                }
              }
            }),
            h('i', {
              'class': {
                icon: true,
                iconfont: true,
                'icon-delete': true,
              },
              style: {
                fontSize: "1em",
                color: "#d33027",
                cursor: 'pointer',
              },
              on: {
                click: () => {
                  _this._view.$Modal.confirm({
                    title: '确认提醒',
                    content: `<p>是否确认删除地块<span style="color:#d33027">${row.name}</span>的全部出入口信息？</p>`,
                    okText: '确定',
                    cancelText: '取消',
                    closable: true,
                    onOk: () => {
                      _this.deleteLandEntry(row.id);
                    }
                  });
                }
              }
            })
          ])
        }
      }
    ]
  }

  getStep2TableData() {

  }

  getStep4TableData() {
    let url = MYCONF.service.findLandList;
    let projectId = this._view.cur_pro_id;
    let landColor = this._view.landColor;
    let polygonList = [];  //面空间信息集合
    let _this = this;
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&projectID=${projectId}`).then((res) => {
      res = res.body;
      let result = res.result;
      result.map((item, index) => {
        let landType = MapCommonLayer.getLandType(item);
        _this._view.linkData.push({
          num: _this._view.linkData.length + 1,
          name: item.name,
          id: item.id,
          landarea: parseFloat(item.landarea),
          plotratio: item.plotratio,
          buildarea: (parseFloat(item.landarea) * parseFloat(item.plotratio)).toFixed(1),
          landtype: landType,
          // landtype:item.landtype,
          population: item.population,
          dayaoVol: item.dayaoVol ? parseInt(item.dayaoVol) : 0,
          dayadVol: item.dayadVol ? parseInt(item.dayadVol) : 0,
          daymoVol: item.daymoVol ? parseInt(item.daymoVol) : 0,
          daymdVol: item.daymdVol ? parseInt(item.daymdVol) : 0,
          daynoVol: item.daynoVol ? parseInt(item.daynoVol) : 0,
          dayndVol: item.dayndVol ? parseInt(item.dayndVol) : 0,
          dayaaVol: item.dayaaVol ? parseInt(item.dayaaVol) : 0,
          daymaVol: item.daymaVol ? parseInt(item.daymaVol) : 0,
          daynaVol: item.daynaVol ? parseInt(item.daynaVol) : 0,

          dayaoCoefficient: item.dayaoCoefficient ? item.dayaoCoefficient : 1,
          dayadCoefficient: item.dayadCoefficient ? item.dayadCoefficient : 1,
          daymoCoefficient: item.daymoCoefficient ? item.daymoCoefficient : 1,
          daymdCoefficient: item.daymdCoefficient ? item.daymdCoefficient : 1,
          daynoCoefficient: item.daynoCoefficient ? item.daynoCoefficient : 1,
          dayndCoefficient: item.dayndCoefficient ? item.dayndCoefficient : 1,
          points: item.points,
          _highlight: false
        });

        let feature = {
          id: item.id,
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [item.points]
          }
        };
        polygonList.push(feature);
      });
      let ids = env.edit.draw.add({
        type: 'FeatureCollection',
        features: polygonList
      });
      _this._view.updateLandList(ids);
      //TODO:地块颜色设置
      MapCommonLayer.onLandEditClick("static");
      /*let featureId = env.edit.setSelected(ids);
      env.edit.setCustomStyle({
        "fillColor":landColor,
        "fillOpacity":0.1,
        "fillOutlineColor":landColor,
        "lineColor":landColor,
        "circleColor":landColor,
      })*/
    });
  }

  getStep5TableData() {
    let url = MYCONF.service.findPWLandListByProject;
    let projectId = this._view.cur_pro_id;
    let polygonList = [];  //面空间信息集合
    let lineList = [];  //线空间信息集合
    let _this = this;
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&projectid=${projectId}`).then((res) => {
      res = res.body;
      let result = res.result;
      result.map((item, index) => {
        _this._view.linkData.push({
          num: _this._view.linkData.length + 1,
          name: item.name,
          id: item.id,
          count: item.passageway_count,
          tag: item.passageway_tag,
          points: item.coordinates,
          center: [item.center_x, item.center_y],
          _highlight: false
        });
        let polygonFeature = {
          "type": "Feature",
          "properties": {
            "landid": item.id
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [item.coordinates]
          }
        };
        let lineFeature = {
          "type": "Feature",
          "properties": {
            "landid": item.id
          },
          "geometry": {
            "type": "LineString",
            "coordinates": [...item.coordinates]
          }
        };
        polygonList.push(polygonFeature);
        lineList.push(lineFeature);
      });
      _this.addPolygonLayer(polygonList);
      _this.addLineLayer(lineList);
      _this.addPointLayer(_this._view.linkData);
    });
  }

  addPolygonLayer(polygonList) {
    let map = env.map;
    let landId = this._view.curLandId;
    if (map.getLayer("polygonLayer")) map.removeLayer("polygonLayer");
    if (map.getLayer("polygonLayer-highlight")) map.removeLayer("polygonLayer-highlight");
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
    map.addLayer({
      'id': 'polygonLayer-highlight',
      'type': 'fill',
      'source': 'polygonLayer',
      'paint': {
        'fill-color': '#3b90ee',
        'fill-opacity': 0.5
      },
      "filter": ["==", "landid", landId ? landId : 0]
    });
  }

  addLineLayer(lineList) {
    let map = env.map;
    if (map.getLayer("entryLine")) map.removeLayer("entryLine");
    if (map.getSource("entryLine")) map.removeSource("entryLine");
    map.addSource("entryLine", {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": lineList
      }
    });
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

  addPointLayer(linkData) {
    let map = env.map;
    let pointList = [];
    linkData.forEach((item) => {
      let pointFeature = {
        type: 'Feature',
        properties: {
          id: item.id
        },
        geometry: {
          type: 'Point',
          coordinates: item.center
        }
      };
      pointList.push(pointFeature);
      if (map.getLayer("entryPointAll")) map.removeLayer("entryPointAll");
      if (map.getSource("entryPointAll")) map.removeSource("entryPointAll");
      map.addSource("entryPointAll", {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": pointList
        }
      });
      map.addLayer({
        'id': 'entryPointAll',
        'type': 'circle',
        'source': 'entryPointAll',
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
    });
  }

  getLandItemInfo() {
    let url = MYCONF.service.findLandInfo;
    let landId = this._view.curLandId;
    let editIndex = -1;  //新增标志
    editIndex = this.isAddFun(landId);
    let _this = this;
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&landID=${landId}`).then((res) => {
      res = res.body;
      let result = res.result;
      let landType = MapCommonLayer.getLandType(result);
      let curLandItem = {
        num: editIndex < 0 ? _this._view.linkData.length + 1 : editIndex + 1,
        name: result.name,
        id: result.id,
        landarea: result.landarea,
        plotratio: result.plotratio,
        buildarea: (parseFloat(result.landarea) * parseFloat(result.plotratio)).toFixed(1),
        landtype: landType,
        population: result.population,
        dayaoVol: result.dayaoVol ? parseInt(result.dayaoVol) : 0,
        dayadVol: result.dayadVol ? parseInt(result.dayadVol) : 0,
        daymoVol: result.daymoVol ? parseInt(result.daymoVol) : 0,
        daymdVol: result.daymdVol ? parseInt(result.daymdVol) : 0,
        daynoVol: result.daynoVol ? parseInt(result.daynoVol) : 0,
        dayndVol: result.dayndVol ? parseInt(result.dayndVol) : 0,
        dayaaVol: result.dayaaVol ? parseInt(result.dayaaVol) : 0,
        daymaVol: result.daymaVol ? parseInt(result.daymaVol) : 0,
        daynaVol: result.daynaVol ? parseInt(result.daynaVol) : 0,
        dayadCoefficient:result.dayadCoefficient ? result.dayadCoefficient:1,
        dayaoCoefficient:result.dayaoCoefficient ? result.dayaoCoefficient:1,
        daymdCoefficient:result.daymdCoefficient ? result.daymdCoefficient:1,
        daymoCoefficient:result.daymoCoefficient ? result.daymoCoefficient:1,
        dayndCoefficient:result.dayndCoefficient ? result.dayndCoefficient:1,
        daynoCoefficient:result.daynoCoefficient ? result.daynoCoefficient:1,
      };
      if (editIndex < 0) {
        _this._view.linkData.push(curLandItem);
      } else {
        _this._view.linkData.splice(editIndex, 1, curLandItem);
      }
      // _this._view.linkData[curLandItem.num-1]._highlight = true;
      _this._view.locateToCurLine(result.id);
    });
  }

  getEntryItemInfo(id) {
    let url = MYCONF.service.findPWListByLand;
    let landId = id ? id : this._view.curLandId;
    let _this = this;
    let editIndex = -1;  //新增标志
    editIndex = this.isAddFun(landId);
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&landid=${landId}`).then((res) => {
      res = res.body;
      let result = res.result;
      let tempItem = _this._view.linkData[editIndex];
      if (tempItem) {
        tempItem["count"] = result.length;
        tempItem["tag"] = result.length === 0 ? 0 : 1;
        _this._view.linkData.splice(editIndex, 1, tempItem);
      }
    });
  }

  isAddFun(landId) {
    let bool = -1;
    this._view.linkData.map((item, index) => {
      if (item.id === landId) {
        bool = index;
      }
    });
    return bool;
  }

  //删除地块
  deleteLandItem(landId) {
    let url = MYCONF.service.delLandInfo;
    let _this = this;
    let linkData = _this._view.linkData;
    let landList = _this._view.landList;
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&landID=${landId}`).then((res) => {
      res = res.body;
      if (res.success) {
        eventBus.$emit("deleteUpdateLand");  //更新用地规划内容汇总
        landList.map((item, index) => {
          if (item === landId) {
            landList.splice(index, 1);
          }
        });

        linkData.map((item, index) => {
          if (item.id === landId) {
            linkData.splice(index, 1);
            env.edit.removeFeatures([landId]);    //地图上移除当前地块
            for (let i = index; i < linkData.length; i++) {
              linkData[i].num -= 1;
            }
            _this._view.linkData = linkData;
            //更新之后的序号
            return;
          }
        });
        if (_this._view.allOdShow) {
          _this.getProjectOdLayer(); //删除已保存地块，更新全部od
        }else{
          _this._view.updateAllOdShow(true);
        }
      }
    });
  }

  //删除数据库中的道路和table上的道路
  deleteRoadItem(roadId) {
    let url = MYCONF.service.deleteRoadByRoadId;
    let _this = this;
    let linkData = _this._view.linkData;
    this._view.$http.get(url + `?roadId=${roadId}&projectid=${_this._view.cur_pro_id}&token=${sessionStorage.getItem("token")}`).then((response) => {
      response = response.body;
      if (linkData) {
        linkData.map((item, index) => {
          if (item.id === roadId) {
            linkData.splice(index, 1);
            // env.edit.removeFeatures([landId]);    //地图上移除当前地块
            for (let i = index; i < linkData.length; i++) {
              linkData[i].num -= 1;
            }
            _this._view.linkData = linkData;
            //更新之后的序号
            return;
          }
        });
      }
      _this._view.updateAttributePanel(null);
      eventBus.$emit("createSuccess");
      eventBus.$emit('reGetTableList')
    })
  }


  getCurStep_3(data1, data2) {
    let num = parseFloat(data1.linkLen).toFixed(1);
    let editIndex = this.isAddFun(data1.linkId);
    let lineInfo = {
      num: editIndex < 0 ? this._view.linkData.length + 1 : editIndex + 1,
      name: data1.name,
      id: data1.linkId,
      type: data1.linkType === 'N' ? '新建道路' : data1.linkType === 'C' ? '改建道路' : data1.linkType === 'O' ? '原有道路' : data1.linkType,
      level: data1.linkLevel === '1' ? '高速公路' : data1.linkLevel === '2' ? '国省道' : data1.linkLevel === '3' ? '城市主干路' : data1.linkLevel === '4' ? '城市次干路' : data1.linkLevel === '5' ? '城市支路和县乡道' : data1.linkLevel,
      len: num,
      tUpper: data2.traffic.upper,
      tLower: data2.traffic.lower,
      sUpper: data2.speed.upper,
      sLower: data2.speed.lower,
      wUpper: data2.roadWay.upper,
      wLower: data2.roadWay.lower,
      _highlight: false
    };
    if (editIndex < 0) {
      this._view.linkData.push(lineInfo);
    } else {
      this._view.linkData.splice(editIndex, 1, lineInfo);
    }

  }

  removeLinkData() {
    this._view.linkData = []
  }

  highlightRoad(roadId) {
    eventBus.$emit('highlightRoad', roadId);

    // let links = this._view.editLinks;
    // for (let i=0; i<links.length; i++){
    //   if (roadId === links[i].options.road_id) {
    //     links.setStyle({
    //       color: '#FF3399'
    //     })
    //   }
    // }
  }

  highlightLand(item) {
    let map = env.map;
    // let landId = this._view.curLandId;
    let centerStr = item.center;
    map.flyTo({
      center: centerStr,
      zoom: map.getZoom() >= 15 ? map.getZoom() : 15
    });
    if (env.map.getLayer('polygonLayer-highlight')) env.map.setFilter('polygonLayer-highlight', ['==', 'landid', item.id]);
  }

  addBaseLink() {
    let map = env.map;
    let token = sessionStorage.getItem("token");
    let projectId = this._view.cur_pro_id;
    let url = `${MYCONF.service.landBaseLink}${projectId}/{z}/{x}/{y}?token=${token}`;
    if (map.getLayer("linkRoad")) map.removeLayer("linkRoad");
    if (map.getSource("linkRoad")) map.removeSource("linkRoad");
    map.addSource("linkRoad", {
      type: "vector",
      tiles: [url]
    });
    map.addLayer({
      "id": "linkRoad",
      "type": "line",
      "source": "linkRoad",
      "source-layer": "linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": '#525f6d',
        "line-width": 3,
        'line-opacity': 0.9
      },
      filter: ["==", "linkid", 0]
    });
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

        _this.addEntryLines(result);
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
                [12, 10],
                [14, 14]
              ]
            },
            "text-anchor": "top",
            "icon-allow-overlap": true,
            "text-allow-overlap": false,
            "icon-ignore-placement": true,
          },
          "paint": {
            "text-color": "#D33027",
            "text-halo-color": '#fff',
            "text-halo-width": 1.3,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          }
        });
      }
    });
  }

  getProjectOdLayer() {
    let url = MYCONF.service.findLandOD;
    let curProId = this._view.cur_pro_id;
    let timeTag = this._view.time_tag === '早高峰' ? 'M' : 'N';
    let _this = this;
    this._view.$http.get(url + `type=project&id=${curProId}&timeTag=${timeTag}&token=${sessionStorage.getItem("token")}`).then((res) => {
      res = res.body;
      if (res.success) {
        let result = res.result;
        _this.renderOdLayer(result);
      }
    });
  }

  getProjectMergeOd(type='merge'){
    let url = MYCONF.service.findLandOD;
    let curProId = this._view.cur_pro_id;
    let timeTag = this._view.time_tag === '早高峰' ? 'M' : 'N';
    let _this = this;
    this._view.$http.get(url + `type=project&id=${curProId}&timeTag=${timeTag}&isMerge=1&token=${sessionStorage.getItem("token")}`).then((res) => {
      res = res.body;
      if (res.success) {
        let result = res.result;
        _this.renderOdLayer(result,type);
      }
    });
  }

  getLandOdLayer(landId) {
    let url = MYCONF.service.findLandOD;
    let curLandId = landId ? landId : this._view.curLandId;
    let timeTag = this._view.time_tag === '早高峰' ? 'M' : 'N';
    let _this = this;
    this._view.$http.get(url + `type=land&id=${curLandId}&timeTag=${timeTag}&token=${sessionStorage.getItem("token")}`).then((res) => {
      res = res.body;
      if (res.success) {
        let result = res.result;
        _this.renderOdLayer(result);
      }
    });
  }

  renderOdLayer(result,type) {
    let odType = this._view.landOdType === '双向' ? 'OD' : this._view.landOdType === '仅出发' ? 'O' : 'D';
    let lineList = [];
    let pointList = [];
    let centerList = [];
    let allData = [];
    let allDPoint = [];
    let idList = [];
    let landList = this._view.landList;
    let odColor = this._view.landOdColor;
    let odWidth = this._view.landOdWidth;
    let expMin = this._view.odExpMin;
    let expMax = this._view.odExpMax;
    let colorType = this._view.colorType;
    let colors = FLOWCONF.LANDODCOLORS;
    result.map((item, index) => {
      let psg = parseFloat(item.psg.toFixed(1));
      let itemPsg = psg > expMax ? expMax : psg;
      let psgMax = parseInt(item.psg_max) < parseInt(expMax) ? parseInt(item.psg_max) : parseInt(expMax);
      let landId = item.id;
      let odItem = {
        name: `land-${index}`,
        count: psg,
        countMax: parseInt(item.psg_max),
        dest: `land-${index}`,
        coords: [[parseFloat(item.o_lon), parseFloat(item.o_lat)], [parseFloat(item.d_lon), parseFloat(item.d_lat)]],
        lineStyle: {
          normal: {
            width: MapCommonLayer.getOdWidth(psg, psgMax, odWidth),
            color: colorType === '单色' ? odColor : MapCommonLayer.getOdColor(colors, psg),
          }
        },
        odTag: item.odtag
      };
      let dItem = {
        name: `land-${index}`,
        value: item.odtag === "D" ? [item.o_lon, item.o_lat] : [item.d_lon, item.d_lat],
        count: psg,
        symbolSize: ((itemPsg/20) + 4) * this._view.expCircle,
        // symbolSize: psgMax <= 20 ? 2 : itemPsg / 20 > 20 ? 5 + (Math.sqrt(itemPsg) / 2 - 5) / 4
        //   : itemPsg / 20 > 10 ? Math.sqrt(itemPsg) / 2 - 1.5
        //     : itemPsg / 20 > 5 ? Math.sqrt(itemPsg) / 2
        //       : itemPsg / 20,
        itemStyle: {"normal": {"color": "#ffffff"}}
      }

      allData.push(odItem);
      this._view.projectOdData = allData;
      allDPoint.push(dItem);
      this._view.odPointData = allDPoint;
      if (odType === 'OD' || odType === item.odtag) {
        if (psg >= expMin) {    //满足最小阈值
          lineList.push({
            name: `land-${index}`,
            count: itemPsg,
            countMax: psgMax,
            dest: `land-${index}`,
            coords: [[parseFloat(item.o_lon), parseFloat(item.o_lat)], [parseFloat(item.d_lon), parseFloat(item.d_lat)]],
            lineStyle: {
              normal: {
                width: MapCommonLayer.getOdWidth(itemPsg, psgMax, odWidth),
                color: colorType === '单色' ? odColor : MapCommonLayer.getOdColor(colors, itemPsg),
              }
            },
            odTag: item.odtag
          });
          pointList.push({
            name: `land-${index}`,
            value: item.odtag === "D" ? [item.o_lon, item.o_lat] : [item.d_lon, item.d_lat],
            // count: itemPsg,
            // symbolSize: psgMax <= 20 ? 2 : itemPsg / 20 > 20 ? 5 + (Math.sqrt(itemPsg) / 2 - 5) / 4
            //   : itemPsg / 20 > 10 ? Math.sqrt(itemPsg) / 2 - 1.5
            //     : itemPsg / 20 > 5 ? Math.sqrt(itemPsg) / 2
            //       : itemPsg / 20,
            symbolSize: ((itemPsg/20) + 4) * this._view.expCircle,
            itemStyle: {"normal": {"color": "#ffffff"}}
          })
        }
      }

      if (landList.indexOf(landId) !== -1 && idList.indexOf(landId) === -1) {
        idList.push(landId);
        //添加形星点
        centerList.push({
          name: `${item.id}`,
          value: item.odtag === 'D' ? [item.d_lon, item.d_lat] : [item.o_lon, item.o_lat],
          symbolSize: 12,
          label: {
            emphasis: {
              show: false,
              position: 'right',
              formatter: '{b}',
              backgroundColor: datetimeHelper.colorToRgba(odColor),
              color: '#ffffff',
              padding: 5,
            }
          },
          itemStyle: {"normal": {"color": "#fbf5c1"}}
        });
      }
    });

    if(type === 'merge' || type === 'image'){
      centerList.push({
        name: `${result[0].projectid}`,
        value: result[0].odtag === 'D' ? [result[0].d_lon, result[0].d_lat] : [result[0].o_lon, result[0].o_lat],
        symbolSize: 12,
        label: {
          emphasis: {
            show: false,
            position: 'right',
            formatter: '{b}',
            backgroundColor: datetimeHelper.colorToRgba(odColor),
            color: '#ffffff',
            padding: 5,
          }
        },
        itemStyle: {"normal": {"color": "#fbf5c1"}}
      });
    }

    const series = [{
      name: "step-4",
      type: 'lines',
      coordinateSystem: 'GLMap',
      zlevel: 2,
      lineStyle: {
        normal: {
          // color: odColor,
          width: 1,
          opacity: 0.7,
          curveness: 0.1
        }
      },
      data: lineList
    },
      {
        name: '地点',
        type: 'effectScatter',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke',
          period: 10,
          scale: 1
        },
        label: {
          emphasis: {
            show: false,
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: 2,
        showEffectOn: 'render',
        itemStyle: {
          normal: {
            show: true,
            color: '#46bee9',
            shadowBlur: 15,
            shadowColor: 'rgba(0,0,0,0.4)'
          }
        },
        data: pointList
      },
      {
        name: '地点',
        type: 'effectScatter',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        itemStyle: {
          normal: {
            show: true,
            color: '#46bee9',
            shadowBlur: 15,
            shadowColor: 'rgba(0,0,0,0.4)'
          }
        },
        data: centerList
      }
    ];
    let option = {
      GLMap: {
        roam: true
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: datetimeHelper.colorToRgba(odColor),
        opacity: 0.5,
        // color: '#D7191C',
        formatter: function (param) {
          return param.data.count;
          // return param.data.count;
        }
      },
      series: series
    };

    env.projectOdLayerOption = option;
    if (env.echartLayer) {
      env.echartLayer.remove();
      env.echartLayer = null;
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
    } else {
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
    }

    env.echartLayer.chart.setOption(option);
    env.echartLayer.chart.resize({
      width: env.cWidth,
      height: env.cHeight
    });

    //合并交通分布OD截图
    if(type === 'image'){
      setTimeout(() => {
        this.saveImage("merge");
        this._view.updateAllOdShow(true);
        this.getProjectOdLayer();
        this._view.updateGlobalMask(false);
      },3000);
    }
  }

  updateProjectOdRender(lineType, count) {
    if (!env.echartLayer || !env.projectOdLayerOption) {
      return;
    }
    let expMax = this._view.odExpMax;
    let expMin = this._view.odExpMin;
    let odType = this._view.landOdType === '双向' ? 'OD' : this._view.landOdType === '仅出发' ? 'O' : 'D';
    // let odData = this._view.projectOdData;
    // let odPoint = this._view.odPointData;
    let odData = JSON.parse(JSON.stringify(this._view.projectOdData));
    let odPoint = JSON.parse(JSON.stringify(this._view.odPointData));
    let odColor = this._view.landOdColor;
    let colors = FLOWCONF.LANDODCOLORS;
    let odWidth = this._view.landOdWidth;
    let odList = [];
    let pointList = [];
    switch (lineType) {
      case 'color':
        /*env.projectOdLayerOption.series[0].lineStyle.normal.color = count;
        env.projectOdLayerOption.tooltip.backgroundColor = datetimeHelper.colorToRgba(count);*/
        odData = env.projectOdLayerOption.series[0].data;
        odData.map((item) => {
          let color = count === '彩色' ? MapCommonLayer.getOdColor(colors, item.count) : odColor;
          item.lineStyle.normal.color = color;
        });
        env.projectOdLayerOption.series[0].data = odData;
        break;
      case 'type':
        odType = count === '双向' ? 'OD' : count === '仅出发' ? 'O' : 'D';
        if (odData) odData.map((item) => {
          if (odType === 'OD' || odType === item.odTag) {
            if (item.count > expMax) {
              let tempItem = item;
              tempItem.count = expMax;
              tempItem.lineStyle.normal.width = MapCommonLayer.getOdWidth(tempItem.count, tempItem.countMax, odWidth);
              odList.push(tempItem);
            } else if (item.count >= expMin) {
              item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count, item.countMax, odWidth);
              odList.push(item);
            }
          }
        });
        env.projectOdLayerOption.series[0].data = odList;
        break;
      case 'width':
        odData = env.projectOdLayerOption.series[0].data;
        odData.map((item) => {
          item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count, item.countMax, count);
        });
        env.projectOdLayerOption.series[0].data = odData;
        break;
      case 'expMax':
        odData.map((item) => {
          if (odType === 'OD' || odType === item.odTag) {
            if (item.count > count) {
              let tempItem = item;
              tempItem.count = count;
              tempItem.lineStyle.normal.width = MapCommonLayer.getOdWidth(tempItem.count, tempItem.countMax, odWidth);
              odList.push(tempItem);
            } else if (item.count >= expMin) {
              item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count, item.countMax, odWidth);
              odList.push(item);
            }
          }
        });
        env.projectOdLayerOption.series[0].data = odList;
        break;
      case 'expMin':
        odData.map((item) => {
          if (odType === 'OD' || odType === item.odTag) {
            if (item.count > expMax) {
              let tempItem = item;
              tempItem.count = expMax;
              tempItem.lineStyle.normal.width = MapCommonLayer.getOdWidth(tempItem.count, tempItem.countMax, odWidth);
              odList.push(tempItem);
            } else if (item.count >= count) {
              item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count, item.countMax, odWidth);
              odList.push(item);
            }
          }
        });
        env.projectOdLayerOption.series[0].data = odList;

        odPoint.map((item) => {
          if (item.count > expMax) {
            let tempItem = item;
            tempItem.count = expMax;
            pointList.push(tempItem);
          } else if (item.count >= count) {
            pointList.push(item);
          }
        });
        env.projectOdLayerOption.series[1].data = pointList;
        break;
      case'colorType':
        odData = env.projectOdLayerOption.series[0].data;
        odData.map((item) => {
          let color = count === '彩色' ? MapCommonLayer.getOdColor(colors, item.count) : odColor;
          item.lineStyle.normal.color = color;
        });
        env.projectOdLayerOption.series[0].data = odData;
        break;
      case'circle':
        let tempData = env.projectOdLayerOption.series[0].data;
        odData = env.projectOdLayerOption.series[1].data;
        odData.map((item,index) => {
          item.symbolSize = ((tempData[index].count/20) + 4) * this._view.expCircle;
        });
        env.projectOdLayerOption.series[1].data = odData;
        break;
      default:
        break;
    }
    env.echartLayer.chart.setOption(env.projectOdLayerOption);
    env.echartLayer.chart.resize({
      width: env.cWidth,
      height: env.cHeight
    });

  }

  deleteLandEntry(landId) {
    let url = MYCONF.service.deletePWByLand;
    let _this = this;
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&landid=${landId}`).then((res) => {
      res = res.body;
      let result = res.result;
      if (res.success) {
        _this.getEntryItemInfo(landId);
        _this.addEntryLayer();
        eventBus.$emit("deleteLandEntry");
      }
    });
  }

  addEntryLines(entryList) {
    let map = env.map;
    let linkData = this._view.linkData;
    let lineList = [];
    linkData.forEach((land) => {
      entryList.map((entry) => {
        if (land.id === entry.landid) {
          let lineFeature = {
            type: 'Feature',
            properties: {
              landid: entry.landid,
              name:entry.landid + entry.name
            },
            geometry: {
              type: 'LineString',
              coordinates: [land.center, [entry.x, entry.y]]
            }
          };
          lineList.push(lineFeature);
        }
      })
    });
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
  }

  curEntrySelected(landId) {
    let linkData = this._view.linkData;
    let _this = this;
    let that = this._view;
    let row = null;
    linkData.map((item, index) => {
      if (parseInt(item.id) === parseInt(landId)) {
        row = item;
        that.linkData[index]._highlight = true;
      } else {
        that.linkData[index]._highlight = false;
      }
    });
    if (that.attributePanel === "outin") {
      if (env.map.getLayer('entryLayerAll')) env.map.setFilter('entryLayerAll', ['!=', 'landid', row.id]);
      if (env.map.getLayer('entryLineLayer')) env.map.setFilter('entryLineLayer', ['!=', 'landid', row.id]);
      eventBus.$emit("updateCurEntryLand", row);   //编辑面板更新属性 --- marker替换getEntryItemInfo
      if (env.map.getLayer("linkRoad")) env.map.setLayoutProperty("linkRoad", 'visibility', 'visible');
      if (env.map.getLayer('linkRoad')) env.map.setFilter('linkRoad', ['!=', 'linkid', 0]);
    }
    _this.highlightLand(row);
    that.updateCurLandId(row.id);
  }

  removeRenderLayer(){
    let layerList = ['factor-layer','factor-layer-symbol','step-traffic-5','step-traffic-5-symbol','step-flow-5','step-flow-5-symbol','traceability','traceability-symbol','backTraceability','backTraceability-symbol'];  //step6渲染隐藏
    if(env.map){
      layerList.map((layer) => {
        if(env.map.getLayer(layer)) env.map.removeLayer(layer);
      })
    }
  }

  getStep4Image(){
    let map = env.map;
    if(map.getLayer("roadLinePaint")) map.setLayoutProperty('roadLinePaint', 'visibility', 'none');

    if(map.getLayer("roadLineLayerAll")) map.removeLayer("roadLineLayerAll");
    let url = MYCONF.service.findPWLandListByProject;
    let projectId = this._view.cur_pro_id;
    let lineList = [];  //线空间信息集合
    let _this = this;
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&projectid=${projectId}`).then((res) => {
      res = res.body;
      let result = res.result;
      if(result.length <= 1){
        map.flyTo({
          center: [result[0].center_x,result[0].center_y],
        });
        setTimeout(() => {
          _this.saveImage("all");
          _this.getProjectMergeOd("image");
        },1000);
      }else{
        result.map((item, index) => {
          let center = [item.center_x,item.center_y];
          lineList.push(center);
        });
        let lineStr = turf.lineString(lineList);
        let bbox = turf.bbox(lineStr);
        map.fitBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
          linear: true,
          padding: {
            top: 250,
            bottom: 250,
            left:250,
            right: 250
          }
        });
        // env.map.zoomOut();
        setTimeout(() => {
          _this.saveImage("all");
          _this.getProjectMergeOd("image");
        },1000);
      }
    });
  }

  saveImage(type){
    let c = env.map.getCanvas();
    let w = c.width;
    let h = c.height;
    let desc = type==='all'? '项目总体交通分布图':'项目总体交通分布图(强制合并交通小区)';
    let odName = type==='all'? 'villageMap':'villageMerge';
    let pixRatio = this.getPixRatio();
    if (env.echartLayer) {
      let offcanvas = env.echartLayer.chart.getRenderedCanvas({
        pixelRatio: pixRatio,
        backgroundColor: 'transparent'
      });
      let asd = document.getElementsByClassName('minemap-canvas')[0];
      let cheight = asd.height;
      let cwidth = asd.width;
      // let cx = 0;
      // if(cwidth > cheight*1.5){
      //   cwidth = cheight*1.5;
      //   cx = (asd.width - cwidth)/2;
      // }
      let mycanvas = document.createElement('canvas');
      mycanvas.height = cheight;
      mycanvas.width = cwidth;
      mycanvas.getContext("2d").drawImage(c, 0, 0);
      mycanvas.getContext("2d").drawImage(offcanvas, 0, 0, cwidth, cheight, 0 , 0, cwidth, cheight);
      let img_data = Canvas2Image.saveAsJPEG(mycanvas, true).getAttribute('src');
      MapCommonLayer.upLoadImage(this,img_data,odName,desc);
      // datetimeHelper.saveFile(img_data, `${odName}.jpg`);
    }else {
      let img_data = Canvas2Image.saveAsJPEG(c, true).getAttribute('src');
      MapCommonLayer.upLoadImage(this,img_data,odName,desc);
      //图片下载注释
      // datetimeHelper.saveFile(img_data, `${odName}.jpg`);
    }
  }

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
  }

}
