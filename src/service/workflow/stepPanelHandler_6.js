/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import datetimeHelper from "../../util/datetime-helper";
import MapCommonLayer from "../map/mapCommonLayer";

export default class stepPanelHandler_6 {
  constructor(_view) {
    this._view = _view;
  }

  calcTrafficVol() {
    let curId = this._view.cur_pro_id;
    let newOdType = this._view.newOdType;
    let newTimeTag = this._view.newTimeTag;
    // let odType = newOdType.length === 2 ? 'A' : newOdType[0] === '道路相关OD' ? 'R' : 'L';
    //todo:道路相关暂时去掉
    let odType = 'L';
    let timeTag = newTimeTag === '早高峰' ? 'M' : 'N';
    let newTrafficModel = this._view.newTrafficModel;
    let newIterationNum = parseInt(this._view.newIterationNum);
    let newPathFunction = this._view.newPathFunction;

    this._view.updateGlobalLoading(true);
    let _this = this;
    let url = MYCONF.service.redistributeTrafficVol + `token=${sessionStorage.getItem("token")}&projectid=${curId}&distributionType=${odType}&timetag=${timeTag}&distributionModel=1&distributionNum=${newIterationNum}&distributionFunc=1`;
    this._view.$http.get(url, {
      before(request) {
        _this._view.curRequest = request;
      }
    }).then((res) => {
      res = res.body;
      _this._view.updateGlobalLoading(false);
      if(_this._view.cur_route !=='workflow') return;
      if (res.success) {
        _this.setTrafficLayer();
        _this.setFactorLayer(_this._view.setFactorLayer);
        eventBus.$emit('calcTrafficVolSuccess')

      } else {
        _this._view.$Message.warning({
          content: res.msg ? res.msg : '交通分配计算异常，请再次尝试',
          closable: true
        });
      }
    });
  }

  checkRedistribute(bool,str) {
    let curId = this._view.cur_pro_id;
    let newOdType = this._view.newOdType;
    let newTimeTag = this._view.newTimeTag;
    // let odType = newOdType.length === 2 ? 'A' : newOdType[0] === '道路相关OD' ? 'R' : 'L';
    //todo:道路相关暂时去掉
    let odType = 'L';
    let timeTag = newTimeTag === '早高峰' ? 'M' : 'N';
    let newTrafficModel = this._view.newTrafficModel;
    let newIterationNum = parseInt(this._view.newIterationNum);
    let newPathFunction = this._view.newPathFunction;
    let map = env.map;

    let redistrictLayer = ['step-traffic-5', 'step-flow-5', 'step-traffic-5-symbol', 'step-flow-5-symbol'];
    let factorLayer = ['factor-layer', 'factor-layer-symbol'];
    let _this = this;
    let url = MYCONF.service.checkTeProjectTestatus + `token=${sessionStorage.getItem("token")}&projectid=${curId}&distributionType=${odType}&timetag=${timeTag}&distributionModel=1&distributionNum=${newIterationNum}&distributionFunc=1`;
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if (res.success && res.retCode==='te-001') {
        //预览
        if(!bool && str==='open'){
          _this.addPresentPBF();
          // _this.addPredictedPBF();
          // _this.addDistributePBF();
          // _this.addDiffMapPBF();
          //关闭预览
        }else if(!bool && str==='close'){
          _this.setAllLayerHide();
        }

       if(bool){
         this._view.updateGlobalMask(true);
         _this.setStep6LayerHide();
         _this.removeAllLayer();
         _this.addLayerSource();
         _this.loadStep6Image();
       }

      } else {
        _this._view.preViewed = false;
        _this._view.$Message.warning({
          content: res.msg?res.msg:'尚未进行过交通分配，请先运行交通分配',
          closable: true,
          duration: 5
        });
      }
    });
  }

  setTrafficLayer() {
    let sourceName1 = "step-traffic-5";
    let sourceName2 = "step-flow-5";
    let flowWidth = this._view.newFlowWidth;
    let bgWidth = this._view.newBaseWidth;
    let token = sessionStorage.getItem("token");
    let maxFlow = this._view.newFlowMax;
    let minFlow = this._view.newFlowMin;
    let curId = this._view.cur_pro_id;
    let newTimeTag = this._view.newTimeTag;
    let timeTag = newTimeTag === '早高峰' ? 'M' : 'N';
    let url = `${MYCONF.service.teBuffer}?token=${token}&projectid=${curId}&timetag=${timeTag}&minVol=0&maxVol=${maxFlow}`;
    let baseUrl = `${MYCONF.service.getRoadBackgroundVol}?maxvol=${maxFlow}&token=${token}`;
    let bufferColor = this._view.newFlowColor;
    let baseColor = this._view.newBaseColor;

    if (env.map.getLayer(sourceName1)) env.map.removeLayer(sourceName1);
    if (env.map.getSource(sourceName1)) env.map.removeSource(sourceName1);
    if (env.map.getLayer(`${sourceName1}-symbol`)) env.map.removeLayer(`${sourceName1}-symbol`);
    env.map.addSource(sourceName1, {
      type: "vector",
      tiles: [baseUrl]
    });
    if (env.map.getLayer(sourceName2)) env.map.removeLayer(sourceName2);
    if (env.map.getSource(sourceName2)) env.map.removeSource(sourceName2);
    if (env.map.getLayer(`${sourceName2}-symbol`)) env.map.removeLayer(`${sourceName2}-symbol`);
    env.map.addSource(sourceName2, {
      type: "vector",
      tiles: [url]
    });

    // 年背景交通量
    env.map.addLayer({
      "id": sourceName1,
      "type": "line",
      "source": sourceName1,
      "source-layer": "linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.newBaseColor,
        "line-width": {
          "type": "interval",
          'property': 'vol_base',
          'stops': datetimeHelper.setBufferRatio(this._view.newBaseWidth)
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': baseColor==='#FFFFFF'?0:1
      },
      'filter': [">", "vol_base", 0]
    });

    //交通分配
    env.map.addLayer({
      "id": sourceName2,
      "type": "line",
      "source": sourceName2,
      "source-layer": "teBuffer",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.newFlowColor,
        "line-width": {
          "type": "interval",
          'property': 'vol_add',
          // 'stops': datetimeHelper.setStopRange(this._view.newFlowWidth)
          'stops': datetimeHelper.setBufferRatio(this._view.newFlowWidth)
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
        'line-opacity': bufferColor==='#FFFFFF'?0:1
      },
      'filter': minFlow === 0 ? [">", "vol_add", minFlow] : [">=", "vol_add", minFlow]
    });

    env.map.addLayer({
      "id": `${sourceName1}-symbol`,
      "type": "symbol",
      "source": sourceName1,
      "source-layer": "linkLayer",
      "layout": {
        "text-field": "{vol_base}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "dir",
          "stops": [
            [1, [0, 0]],
            [0, [1.2, 1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops": [
            [12, 11],
            [14, 12],
            [16, 13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.newBaseColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": baseColor==='#FFFFFF'?0:0.9,
        "text-halo-blur": 0.5,
      },
      'filter': [">", "vol_base", 0]
    });

    env.map.addLayer({
      "id": `${sourceName2}-symbol`,
      "type": "symbol",
      "source": sourceName2,
      "source-layer": "teBuffer",
      "layout": {
        "text-field": "{vol_add}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "dir",
          "stops": [
            [1, [0.2, 0.2]],
            [0, [1.2, 1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops": [
            [12, 11],
            [14, 12],
            [16, 13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.newFlowColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": bufferColor==='#FFFFFF'?0:0.9,
        "text-halo-blur": 0.5,
      },
      'filter': minFlow === 0 ? [">", "vol_add", minFlow] : [">=", "vol_add", minFlow]
    });

    if (!this._view.isBgFlowShow) {
      if (env.map) {
        if (env.map.getLayer(`${sourceName1}`)) {
          env.map.setLayoutProperty(`${sourceName1}`, 'visibility', 'none');
          env.map.setLayoutProperty(`${sourceName1}-symbol`, 'visibility', 'none');
        }
      }
    }

    if (!this._view.isFlowShow) {
      let t = setInterval(function () {
        if (env.map) {
          if (env.map.getLayer(`${sourceName2}-symbol`)) {
            env.map.setLayoutProperty(`${sourceName2}-symbol`, 'visibility', 'none');
            env.map.setLayoutProperty(`${sourceName1}-symbol`, 'visibility', 'none');
            clearInterval(t);
          }
        } else {
          clearInterval(t);
        }
      }, 200);
    }

    if (!this._view.isAreaShow) {   //不显示交通分配结果
      // let layerList = [sourceName1, sourceName2, `${sourceName1}-symbol`, `${sourceName2}-symbol`];
      let layerList = [sourceName1, `${sourceName1}-symbol`];
      let t = setInterval(function () {
        if (env.map) {
          layerList.map((layerId) => {
            if (env.map.getLayer(layerId)) {
              env.map.setLayoutProperty(layerId, 'visibility', 'none');
            }
          });
          clearInterval(t);
        } else {
          clearInterval(t);
        }
      }, 200);
    }
  }

  setFactorStop(data){
    switch (data){
      case '背景速度':
        return MYCONF.SPEED_RANGE;
        break;
      case '影响后速度':
        return MYCONF.SPEED_RANGE;
        break;
      case '速度影响':
        return MYCONF.SPEED_AFFECTED_OTHER;
        break;
      case '背景饱和度':
        return MYCONF.SATURATION_TEMP;
        break;
      case '影响后饱和度':
        return MYCONF.SATURATION_TEMP;
        break;
      case '饱和度影响':
        return MYCONF.SATURATION_AFFECTED_TEMP;
        break;
      default:
        return MYCONF.SPEED_RANGE;
        break;
    }
  }

  isRedistribute(type,factorType) {
    let curId = this._view.cur_pro_id;
    let newOdType = this._view.newOdType;
    let newTimeTag = this._view.newTimeTag;
    // let odType = newOdType.length === 2 ? 'A' : newOdType[0] === '道路相关OD' ? 'R' : 'L';
    //todo:道路相关暂时去掉
    let odType = 'L';
    let timeTag = newTimeTag === '早高峰' ? 'M' : 'N';
    let newIterationNum = parseInt(this._view.newIterationNum);
    let map = env.map;

    let _this = this;
    let url = MYCONF.service.checkTeProjectTestatus + `token=${sessionStorage.getItem("token")}&projectid=${curId}&distributionType=${odType}&timetag=${timeTag}&distributionModel=1&distributionNum=${newIterationNum}&distributionFunc=1`;
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if (res.success && res.retCode==='te-001') {
        if(type === 'factor'){
          _this.setFactorLayer(factorType);
        }else{
          this.setTrafficLayer();
          eventBus.$emit('calcTrafficVolSuccess')
        }
      } else {
        if(type === 'distribute') return;
        _this._view.$Message.warning({
          content: res.msg?res.msg:'尚未进行过交通分配，请先运行交通分配',
          closable: true,
          duration: 2
        });
        return false;
      }
    });
  }

  setFactorLayer(type) {
    let sourceName = "factor-layer";
    let factorWidth = this._view.factorWidth;
    let factorColor = this._view.factorColor;
    let token = sessionStorage.getItem("token");
    let curId = this._view.cur_pro_id;
    let newTimeTag = this._view.newTimeTag;
    let timeTag = newTimeTag === '早高峰' ? 'M' : 'N';
    let factorType = this._view.setFactorType(this._view.factorType);
    let stopRange = this.setFactorStop(this._view.factorType);
    let baseColor = this._view.newBaseColor;
    let url = `${MYCONF.service.teResultBuffer}?token=${token}&projectid=${curId}&timetag=${timeTag}&type=${factorType}`;
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ? 2 : curZoom < 12 ? 3 : curZoom < 14 ? 4 : 5;
    let text_color = type==='速度影响'? [[-3, '#333333'], [-1, 'rgba(255,255,255,0)'], [1, '#333333'],]:
      type==='饱和度影响'? [[-0.10, '#333333'], [-0.03, 'rgba(255,255,255,0)'], [0.03, '#333333'],] : [[1, '#333333']];
    if (env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if (env.map.getLayer('factor-layer-symbol')) env.map.removeLayer('factor-layer-symbol');
    if (env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });

    if (type === '通行能力') {
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'teBuffer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "capprt",
            "stops": [
              [0.1, '#19514a'],
              [1, '#8d211a'],
            ]
          },
          // 'line-color':'#ab261f',
          "line-width": {
            "type": "interval",
            "property": "funcclass",
            "stops": [
              [2, 3],
              [4, 3],
              [5, 1],
            ]
          },
        },
        'filter': ["<=", "funcclass", maxKind]
      });
      env.map.addLayer({
        "id": "factor-layer-symbol",
        "type": "symbol",
        "source": sourceName,
        "source-layer": "teBuffer",
        "layout": {
          "text-field": "{capprt}",
          "symbol-placement": "line",
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          "text-color": '#666',
          "text-halo-color": '#fff',
          "text-halo-width": 1,
          "text-opacity": 0.9,
          "text-halo-blur": 0.5,
        },
        'filter': ["<=", "funcclass", maxKind]
      });
    }
    else if(type === '背景服务水平'){
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'teBuffer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "los_origin",
            "stops": MYCONF.SERVICE_RANGE
          },
          // 'line-color':'#ab261f',
          "line-width": {
            "type": "interval",
            "property": "funcclass",
            "stops": [
              [2, 3],
              [4, 3],
              [5, 1],
            ]
          },
        },
        'filter': ["<=", "funcclass", maxKind]
      });
      env.map.addLayer({
        "id": "factor-layer-symbol",
        "type": "symbol",
        "source": sourceName,
        "source-layer": "teBuffer",
        "layout": {
          "text-field": "{los_origin_annotation}",
          "symbol-placement": "line",
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          "text-color": '#666',
          "text-halo-color": '#fff',
          "text-halo-width": 1,
          "text-opacity": 0.9,
          "text-halo-blur": 0.5,
        },
        'filter': ["<=", "funcclass", maxKind]
      });
    }
    else if(type === '影响后服务水平'){
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'teBuffer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "los_affected",
            "stops": MYCONF.SERVICE_RANGE
          },
          // 'line-color':'#ab261f',
          "line-width": {
            "type": "interval",
            "property": "funcclass",
            "stops": [
              [2, 3],
              [4, 3],
              [5, 1],
            ]
          },
        },
        'filter': ["<=", "funcclass", maxKind]
      });
      env.map.addLayer({
        "id": "factor-layer-symbol",
        "type": "symbol",
        "source": sourceName,
        "source-layer": "teBuffer",
        "layout": {
          "text-field": "{los_affected_annotation}",
          "symbol-placement": "line",
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          "text-color": '#666',
          "text-halo-color": '#fff',
          "text-halo-width": 1,
          "text-opacity": 0.9,
          "text-halo-blur": 0.5,
        },
        'filter': ["<=", "funcclass", maxKind]
      });
    }
    else if(type === '服务水平变化'){
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'teBuffer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "los_diff",
            "stops": MYCONF.SERVICE_AFFECTED
          },
          // 'line-color':'#ab261f',
          "line-width": {
            "type": "interval",
            "property": "funcclass",
            "stops": [
              [2, 3],
              [4, 3],
              [5, 1],
            ]
          },
        },
        'filter': ["<=", "funcclass", maxKind]
      });
      env.map.addLayer({
        "id": "factor-layer-symbol",
        "type": "symbol",
        "source": sourceName,
        "source-layer": "teBuffer",
        "layout": {
          "text-field": "{los_diff}",
          "symbol-placement": "line",
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          "text-color": '#666',
          "text-halo-color": '#fff',
          "text-halo-width": 1,
          "text-opacity": 0,
          "text-halo-blur": 0.5,
        },
        'filter': ["<=", "funcclass", maxKind]
      });
    }
    else if(type === '自由流速度'){
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'teBuffer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "freespeed",
            "stops": MYCONF.SPEED_RANGE
          },
          // 'line-color':'#ab261f',
          "line-width": {
            "type": "interval",
            "property": "funcclass",
            "stops": [
              [2, 3],
              [4, 3],
              [5, 1],
            ]
          },
        },
        'filter': ["<=", "funcclass", maxKind]
      });
      env.map.addLayer({
        "id": "factor-layer-symbol",
        "type": "symbol",
        "source": sourceName,
        "source-layer": "teBuffer",
        "layout": {
          "text-field": "{freespeed}",
          "symbol-placement": "line",
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          "text-color": '#666',
          "text-halo-color": '#fff',
          "text-halo-width": 1,
          "text-opacity": 0.9,
          "text-halo-blur": 0.5,
        },
        'filter': ["<=", "funcclass", maxKind]
      });
    }
    else if(type === '背景反算流量'){
      env.map.addLayer({
        "id": 'factor-layer',
        "type": "line",
        "source": 'factor-layer',
        "source-layer": "teBuffer",
        "layout": {
          "line-join": "round",
          "line-cap": "butt"
        },
        "paint": {
          "line-color": this._view.newBaseColor,
          "line-width": {
            "type": "interval",
            'property': 'vbe',
            'stops': datetimeHelper.setBufferRatio(this._view.newBaseWidth)
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
          'line-opacity': baseColor==='#FFFFFF'?0:1
        },
      });
      env.map.addLayer({
        "id": `factor-layer-symbol`,
        "type": "symbol",
        "source": 'factor-layer',
        "source-layer": "teBuffer",
        "layout": {
          "text-field": "{vbe}",
          "symbol-placement": "line",
          "text-offset": {
            "type": "categorical",
            "property": "dir",
            "stops": [
              [1, [0, 0]],
              [0, [1.2, 1.2]]
            ]
          },
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          "text-color": this._view.newBaseColor,
          "text-halo-color": '#fff',
          "text-halo-width": 1.3,
          "text-opacity": baseColor==='#FFFFFF'?0:0.9,
          "text-halo-blur": 0.5,
        },
      });
    }
    else if(type === '影响后流量'){
      env.map.addLayer({
        "id": 'factor-layer',
        "type": "line",
        "source": 'factor-layer',
        "source-layer": "teBuffer",
        "layout": {
          "line-join": "round",
          "line-cap": "butt"
        },
        "paint": {
          "line-color": this._view.newBaseColor,
          "line-width": {
            "type": "interval",
            'property': 'vf',
            'stops': datetimeHelper.setBufferRatio(this._view.newBaseWidth)
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
          'line-opacity': baseColor==='#FFFFFF'?0:1
        },
      });
      env.map.addLayer({
        "id": `factor-layer-symbol`,
        "type": "symbol",
        "source": 'factor-layer',
        "source-layer": "teBuffer",
        "layout": {
          "text-field": "{vf}",
          "symbol-placement": "line",
          "text-offset": {
            "type": "categorical",
            "property": "dir",
            "stops": [
              [1, [0, 0]],
              [0, [1.2, 1.2]]
            ]
          },
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          "text-color": this._view.newBaseColor,
          "text-halo-color": '#fff',
          "text-halo-width": 1.3,
          "text-opacity": baseColor==='#FFFFFF'?0:0.9,
          "text-halo-blur": 0.5,
        },
      });
    }
    else {
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'teBuffer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "val",
            "stops": stopRange
          },
          // 'line-color':'#ab261f',
          "line-width": {
            "type": "interval",
            "property": "funcclass",
            "stops": [
              [2, 3],
              [4, 3],
              [5, 1],
            ]
          },
        },
        'filter': ["<=", "funcclass", maxKind]
      });
      env.map.addLayer({
        "id": "factor-layer-symbol",
        "type": "symbol",
        "source": sourceName,
        "source-layer": "teBuffer",
        "layout": {
          "text-field": type === '背景饱和度'?"{vco_annotation}":type === '影响后饱和度'?"{vcta_annotation}":type === '饱和度影响'?"{vcd_annotation}":"{val}",
          "symbol-placement": "line",
          "text-anchor": "bottom",
          "text-ignore-placement": true,
          "text-allow-overlap": false,
          "text-size": {
            "stops": [
              [12, 11],
              [14, 12],
              [16, 13]
            ]
          },
          "text-keep-upright": false
        },
        "paint": {
          // "text-color": '#666',
          "text-color": {
            "type": "interval",
            "property": "val",
            "stops": text_color
          },
          "text-halo-color": 'rgba(255,255,255,0)',
          "text-halo-width": 1,
          "text-opacity": 0.9,
          "text-halo-blur": 0.5,
        },
        'filter': type === '速度影响'||type === '饱和度影响'?['all',["<=", "funcclass", maxKind],["!=", "val", 0]]:["<=", "funcclass", maxKind]
      });

      if (!this._view.isFactorShow) {
        let layerList = ['factor-layer', 'factor-layer-symbol'];
        if (env.map) {
          layerList.map((layerId) => {
            if (env.map.getLayer(layerId)) {
              env.map.setLayoutProperty(layerId, 'visibility', 'none');
            }
          });
        }
      }
      if (!this._view.isFactorLabelShow) {
        if (env.map) {
          if (env.map.getLayer('factor-layer-symbol')) {
            env.map.setLayoutProperty('factor-layer-symbol', 'visibility', 'none');
          }
        }
      }
    }

    env.map.on('click', function (e) {
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['factor-layer']});
      // let feature = features[0];
      console.log(features);
    })
  }

  setFlowLabelShow(){
    let attrBool = this._view.isFlowShow ? 'visible' : 'none';
    if(!this._view.isAreaShow){
      return;
    }else{
      let layerList = !this._view.isBgFlowShow && this._view.isFlowShow?['step-flow-5-symbol']: ['step-flow-5-symbol', 'step-traffic-5-symbol'];
      if (env.map) {
        layerList.map((layerId) => {
          if (env.map.getLayer(layerId)) {
            env.map.setLayoutProperty(layerId, 'visibility', attrBool);
          }
        });
      }
    }
  }

  setTypeFlowShow(type) {
    if (type === 'flow') {
      let attrBool = this._view.isAreaShow ? 'visible' : 'none';
      let layerList = this._view.isFlowShow ?['step-flow-5', 'step-flow-5-symbol']:['step-flow-5'];
      if (env.map) {
        layerList.map((layerId) => {
          if (env.map.getLayer(layerId)) {
            env.map.setLayoutProperty(layerId, 'visibility', attrBool);
          }
        });
        if(this._view.isBgFlowShow){
          let layerIds = this._view.isFlowShow ?['step-traffic-5', 'step-traffic-5-symbol']:['step-traffic-5'];
          layerIds.map((layerId) => {
            if (env.map.getLayer(layerId)) {
              env.map.setLayoutProperty(layerId, 'visibility', attrBool);
            }
          });
        }
      }
    } else if (type === 'bg') {
      let attrBool = this._view.isBgFlowShow&&this._view.isAreaShow ? 'visible' : 'none';
      let layerList = this._view.isFlowShow?['step-traffic-5', 'step-traffic-5-symbol']:['step-traffic-5'];
      if (env.map) {
        layerList.map((layerId) => {
          if (env.map.getLayer(layerId)) {
            env.map.setLayoutProperty(layerId, 'visibility', attrBool);
          }
        });
      }
    } else if (type === 'factor') {
      let attrBool = this._view.isFactorShow ? 'visible' : 'none';
      let layerList = this._view.isFactorShow && !this._view.isFactorLabelShow?['factor-layer']:['factor-layer', 'factor-layer-symbol'];
      if (env.map) {
        layerList.map((layerId) => {
          if (env.map.getLayer(layerId)) {
            env.map.setLayoutProperty(layerId, 'visibility', attrBool);
          }
        });
      }
    } else if (type === 'factorLabel') {
      if(!this._view.isFactorShow) return;
      let attrBool = this._view.isFactorLabelShow ? 'visible' : 'none';
      let layerList = ['factor-layer-symbol'];
      if (env.map) {
        layerList.map((layerId) => {
          if (env.map.getLayer(layerId)) {
            env.map.setLayoutProperty(layerId, 'visibility', attrBool);
          }
        });
      }
    }
  }

  updateBufferWidth(type, count) {
    // let layerId = type === 'base' ? 'step-traffic-5' : type === 'factor' ? 'factor-layer' : 'step-flow-5';
    let layerId = type === 'base' ? 'step-traffic-5' : 'step-flow-5';
    let valName = `vol_${type}`;
    if (env.map.getLayer(layerId)) {
      env.map.setPaintProperty(layerId, 'line-width', {
        "type": "interval",
        'property': valName,
        'stops': datetimeHelper.setBufferRatio(count)  //datetimeHelper.setBufferRange(count)
      })
    }
    let layerList = ['flowPresent', 'flowPredicted', 'flowDistribute'];
    if (type === 'factor') {
      if (env.map.getLayer('flowPresent')) {
        env.map.setPaintProperty('flowPresent', 'line-width', {
          "type": "interval",
          'property': 'actualflow',
          'stops': datetimeHelper.setBufferRatio(count)  //datetimeHelper.setBufferRange(count)
        })
      }
      if (env.map.getLayer('flowDistribute')) {
        env.map.setPaintProperty('flowDistribute', 'line-width', {
          "type": "interval",
          'property': 'vd',
          'stops': datetimeHelper.setFlowCompareBufferRatio(count)  //datetimeHelper.setBufferRange(count)
        })
      }
    }
  }

  setFlowFilter() {
    let minFlow = this._view.newFlowMin;
    let layerList = ['step-flow-5', 'step-flow-5-symbol','step-traffic-5','step-traffic-5-symbol'];
    // let layerList = ['step-flow-5', 'step-flow-5-symbol'];
    if (env.map) {
      layerList.map((layerId) => {
        if (env.map.getLayer(layerId)) {
          let filterName = layerId === 'step-traffic-5' || layerId === 'step-traffic-5-symbol' ? 'vol_base' : 'vol_add';
          let filterStr = minFlow === 0 ? ['>', filterName, minFlow] : ['>=', filterName, minFlow];
          env.map.setFilter(layerId, filterStr);
        }
      })
    }
  }

  saveStepParam_6() {
    let newFlowMin = this._view.newFlowMin;
    let newFlowMax = this._view.newFlowMax;
    let newFlowWidth = this._view.newFlowWidth;
    let newBaseWidth = this._view.newBaseWidth;
    let newFlowColor = this._view.newFlowColor;
    let newBaseColor = this._view.newBaseColor;
    let newTimeTag = this._view.newTimeTag;
    let newOdType = this._view.newOdType.join("#");
    let factorWidth = this._view.factorWidth;
    let factorColor = this._view.factorColor;
    let factorType = this._view.factorType;

    let newTrafficModel = this._view.newTrafficModel;
    let newIterationNum = this._view.newIterationNum;
    let newPathFunction = this._view.newPathFunction;
    let curProId = this._view.cur_pro_id;
    // let newOdType = this._view.newOdType.length===1?this._view.newOdType[0]:`${this._view.newOdType[0]}#${this._view.newOdType[1]}`;
    let _this = this;
    this._view.$http.post(MYCONF.service.saveStepSettings + `?token=${sessionStorage.getItem('token')}`, {
      projectid:curProId,
      menuid: 'step-6',
      keys: 'newFlowMin,newFlowMax,newFlowWidth,newBaseWidth,newFlowColor,newBaseColor,newTimeTag,factorWidth,factorColor,newTrafficModel,newIterationNum,newPathFunction',
      values: `${newFlowMin},${newFlowMax},${newFlowWidth},${newBaseWidth},${newFlowColor},${newBaseColor},${newTimeTag},${factorWidth},${factorColor},${newTrafficModel},${newIterationNum},${newPathFunction}`,
    }, {emulateJSON: true}).then(response => {
      response = response.body;
      if (response.success) {
        // _this._view.$Message.success({
        //   content: '保存成功',
        //   duration: 2,
        //   closable: true
        // });
      }
    }, response => {
      _this._view.$Message.warning({
        content: '面板参数保存失败，请重试',
        duration: 2,
        closable: true
      });
    });
  }

  getStepParam() {
    let tempObj = {};
    let curMenu = 'step-6';
    let curProId = this._view.cur_pro_id;
    let _this = this;
    let url = MYCONF.service.findStepSettings + `${curMenu}&projectid=${curProId}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if (res.result.length === 0) {
        return;         //之前没有保存应用记录
      } else {
        let paramList = res.result;
        paramList.map((item) => {
          let key = item.key;
          tempObj[key] = key === 'newFlowMin' || key === 'newFlowMax' || key === 'newFlowWidth' || key === 'newBaseWidth' || key === 'factorWidth' ? parseInt(item.value) : item.value;
          _this._view[key] = key === 'newOdType' ? item.value.split("#") : key === 'newFlowMin' || key === 'newFlowMax' || key === 'newFlowWidth' || key === 'newBaseWidth' || key === 'factorWidth' ? parseInt(item.value) : item.value;
        });
        _this._view.$refs['contentSet'].getTimeTag(_this._view['newTimeTag']);
        _this._view.updateStepSixTimeTag(_this._view['newTimeTag']);
        _this._view.updateStep5ParamObj();

        if(_this._view.isFactorShow){
          _this._view.controller.isRedistribute('factor',_this._view.factorType);
        }
        if(_this._view.isAreaShow){
          _this._view.controller.isRedistribute('distribute');
        }
      }
    });
  }

  stopDiagramRequest() {
    let curRequest = this._view.curRequest;
    let _this = this;
    if (curRequest) {
      //TODO:中止请求
      curRequest.abort();
      this._view.$Message.warning({
        content: '已成功中止该请求',
        duration: 3,
        closable: true
      });
      setTimeout(() => {
        _this._view.updateGlobalLoading(false);
      }, 200)
    }
  }

  confimRoad() {
    let _this = this;
    let curId = this._view.cur_pro_id;
    let url = MYCONF.service.roadConfim + `projectid=${curId}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url).then((res) => {
      res = res.body.result;
      _this._view.statisticItem.planningLand.value = res.land_count;
      _this._view.statisticItem.newRoad.value = res.road_new_count;
      _this._view.statisticItem.reconstruction.value = res.road_edited_count;
      let itemRoad = res.road_new_unpredict + res.road_edited_unpredict;
      let itemLand = res.land_unpredict;
      let itemLandEntry = res.unpwland_count;
      //todo:暂且不检测道路
      // _this._view.tipItem.road.value = res.road_check_status === '1'||(res.road_edited_count===0&&res.road_new_count===0) ? 0 : 1;
      _this._view.tipItem.land.value = itemLand;
      _this._view.tipItem.landEntry.value = itemLandEntry;
      //todo:暂且不检测道路
      // if (res.road_check_status) {
      //   _this._view.tipItem.road.tip = res.road_check_status === '1' ? '各道路均已进行交通量预测' :(res.road_edited_count===0&&res.road_new_count===0)?'此项目无新改建道路': '存在新/改建道路未纳入预测，建议重新运行STEP3';
      // }
      if (_this._view.tipItem.land.value !== 0) {
        _this._view.tipItem.land.tip = itemLand === 0 ? '各地块均已进行交通预测' : itemLand + '个地块未预测交通分布，需在STEP4中完成';
      }
      if (_this._view.tipItem.landEntry.value !== 0) {
        _this._view.tipItem.landEntry.tip = itemLandEntry === 0 ? '各地块均已设置出入口' : itemLandEntry + '个地块未设置出入口，建议返回STEP5进行设置';
      }

    }).catch((err) => {
      console.log(err)
    })
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
        });
        polygonList.push(polygonFeature);
        layerLineList.push(lineFeature);
      });
      _this.addPolygonLayer(polygonList);   //地块样式面线
      _this.addLineLayer(layerLineList);
      _this.addEntryStyle(pointList, lineList);
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

  addRoadLineLayer() {
    let map = env.map;
    let color = this._view.lineNewColor;
    let color1 = this._view.lineChangeColor;
    let projectId = this._view.cur_pro_id;
    let url = MYCONF.service.roadLinePbf + `?projectid=${projectId}&token=${sessionStorage.getItem("token")}`;
    if (map.getLayer("roadLineLayerAll")) map.removeLayer("roadLineLayerAll");
    if (map.getLayer("roadLineLayerLable")) map.removeLayer("roadLineLayerLable");
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
    map.addLayer({
      "id": "roadLineLayerLable",
      "type": "symbol",
      "source": 'roadLineLayerAll',
      'source-layer': 'linkLayer',
      "layout": {
        "text-field": "{roadname}",
        "symbol-placement": "line",
        "text-anchor": "center",
        "text-offset": [0, 0.6],
        "text-size": 13,
        "text-allow-overlap": true,   //图标覆盖文字允许压盖
        "text-ignore-placement": true,
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

    if (map.getLayer("entryPointAll")) map.removeLayer("entryPointAll");
    if (map.getLayer("landNameAll")) map.removeLayer("landNameAll");
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
    map.addLayer({
      "id": "landNameAll",
      "type": "symbol",
      "source": "entryPointAll",
      "layout": {
        "text-field": "{name}",
        "text-offset": [0, 0],
        "text-size": 10,
        "text-anchor": "top",
      },
      "paint": {
        "text-color": "#d33027",
      },
      "minzoom": 12.5
    });
  }

  addPresentPBF() {
    let map = env.map;
    let curId = this._view.cur_pro_id;
    let timeTag = this._view.newTimeTag === '早高峰' ? 'M' : 'N';
    let flowMax = this._view.newFlowMax;
    let url = MYCONF.service.presentPBF + `?token=${sessionStorage.getItem("token")}&projectid=${curId}&timetag=${timeTag}&flowmaxvol=${flowMax}&speedmaxvol=3000&saturationmaxvol=3000&servicemaxvol=3000`;
    let sourceName = 'presentPBF';
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;

    let layerList = ['flowPresent','speedPresent','saturationPresent','servicePresent'];
    layerList.map((layer) => {
      if(env.map.getLayer(layer)) env.map.removeLayer(layer);
      if(env.map.getLayer(`${layer}-symbol`)) env.map.removeLayer(`${layer}-symbol`);
    });

    if (map.getSource(sourceName)) map.removeSource(sourceName);
    map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": 'flowPresent',
      "type": "line",
      "source": sourceName,
      "source-layer": "actualMap",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.factorColor,
        "line-width": {
          "type": "interval",
          'property': 'actualflow',
          'stops': datetimeHelper.setBufferRatio(this._view.factorWidth)//datetimeHelper.setBufferRange(this._view.factorWidth)
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': 1
      },
      // 'filter':[">","actualflow",0]
    });
    env.map.addLayer({
      "id": 'flowPresent-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "actualMap",
      "layout": {
        "text-field": "{actualflow}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, [0, 0]],
            [0, [1.2, 1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops": [
            [12, 11],
            [14, 12],
            [16, 13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.factorColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
      // 'filter':[">","actualflow",0]
    });

    //  env.map.addLayer({
    //    "id": 'speedPresent',
    //    "type": "line",
    //    "source": sourceName,
    //    'source-layer': 'actualMap',
    //    "layout": {
    //      "line-join": "round",
    //      "line-cap": "round"
    //    },
    //    'paint': {
    //      'line-color': {
    //        "type": "interval",
    //        "property": "actualspeed",
    //        "stops": MYCONF.SPEED_RANGE
    //      },
    //      // 'line-color': '#ab261f',
    //      "line-width": {
    //        "type": "interval",
    //        "property": "funcclass",
    //        "stops": [
    //          [2,3],
    //          [4,3],
    //          [5,1],
    //        ]
    //      },
    //    },
    //    'filter':["<=","funcclass",maxKind]
    //  });
    // env.map.addLayer({
    //   "id":"speedPresent-symbol",
    //   "type": "symbol",
    //   "source": sourceName,
    //   "source-layer": "actualMap",
    //   "layout": {
    //     "text-field": "{actualspeed}",
    //     "symbol-placement": "line",
    //     "text-anchor": "bottom",
    //     "text-ignore-placement": true,
    //     "text-allow-overlap": false,
    //     "text-size": {
    //       "stops": [
    //         [12, 11],
    //         [14, 12],
    //         [16, 13]
    //       ]
    //     },
    //     "text-keep-upright": false
    //   },
    //   "paint": {
    //     "text-color": '#666',
    //     "text-halo-color": '#fff',
    //     "text-halo-width": 1,
    //     "text-opacity": 0.9,
    //     "text-halo-blur": 0.5,
    //   },
    //   'filter':["<=","funcclass",maxKind]
    // });
    //
    //  env.map.addLayer({
    //    "id": 'saturationPresent',
    //    "type": "line",
    //    "source": sourceName,
    //    'source-layer': 'actualMap',
    //    "layout": {
    //      "line-join": "round",
    //      "line-cap": "round"
    //    },
    //    'paint': {
    //      'line-color': {
    //        "type": "interval",
    //        "property": "actualsaturation",
    //        "stops": MYCONF.SATURATION_TEMP
    //      },
    //      // 'line-color': '#f8b827',
    //      "line-width": {
    //        "type": "interval",
    //        "property": "funcclass",
    //        "stops": [
    //          [2,3],
    //          [4,3],
    //          [5,1],
    //        ]
    //      },
    //    },
    //    'filter':["<=","funcclass",maxKind]
    //  });
    // env.map.addLayer({
    //   "id":"saturationPresent-symbol",
    //   "type": "symbol",
    //   "source": sourceName,
    //   "source-layer": "actualMap",
    //   "layout": {
    //     "text-field": "{actualsaturation_annotation}",
    //     "symbol-placement": "line",
    //     "text-anchor": "bottom",
    //     "text-ignore-placement": true,
    //     "text-allow-overlap": false,
    //     "text-size": {
    //       "stops": [
    //         [12, 11],
    //         [14, 12],
    //         [16, 13]
    //       ]
    //     },
    //     "text-keep-upright": false
    //   },
    //   "paint": {
    //     "text-color": '#666',
    //     "text-halo-color": '#fff',
    //     "text-halo-width": 1,
    //     "text-opacity": 0.9,
    //     "text-halo-blur": 0.5,
    //   },
    //   'filter':["<=","funcclass",maxKind]
    // });
    //
    //  env.map.addLayer({
    //    "id": 'servicePresent',
    //    "type": "line",
    //    "source": sourceName,
    //    'source-layer': 'actualMap',
    //    "layout": {
    //      "line-join": "round",
    //      "line-cap": "round"
    //    },
    //    'paint': {
    //      'line-color': {
    //        "type": "interval",
    //        "property": "actuallos",
    //        "stops": MYCONF.SERVICE_RANGE
    //      },
    //      "line-width": {
    //        "type": "interval",
    //        "property": "funcclass",
    //        "stops": [
    //          [2,3],
    //          [4,3],
    //          [5,1],
    //        ]
    //      },
    //    },
    //    'filter':["<=","funcclass",maxKind]
    //  });
    // env.map.addLayer({
    //   "id":"servicePresent-symbol",
    //   "type": "symbol",
    //   "source": sourceName,
    //   "source-layer": "actualMap",
    //   "layout": {
    //     "text-field": "{los_origin_annotation}",
    //     "symbol-placement": "line",
    //     "text-anchor": "bottom",
    //     "text-ignore-placement": true,
    //     "text-allow-overlap": false,
    //     "text-size": {
    //       "stops": [
    //         [12, 11],
    //         [14, 12],
    //         [16, 13]
    //       ]
    //     },
    //     "text-keep-upright": false
    //   },
    //   "paint": {
    //     "text-color": '#666',
    //     "text-halo-color": '#fff',
    //     "text-halo-width": 1,
    //     "text-opacity": 0.9,
    //     "text-halo-blur": 0.5,
    //   },
    //   'filter':["<=","funcclass",maxKind]
    // });
  }

  addPredictedPBF() {
    let map = env.map;
    let curId = this._view.cur_pro_id;
    let timeTag = this._view.newTimeTag === '早高峰' ? 'M' : 'N';
    let flowMax = this._view.newFlowMax;
    let url = MYCONF.service.predictedPBF + `?token=${sessionStorage.getItem("token")}&projectid=${curId}&timetag=${timeTag}&flowmaxvol=${flowMax}&speedmaxvol=3000&saturationmaxvol=3000&servicemaxvol=3000`;
    let sourceName = 'predictedPBF';
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;

    let layerList = ['flowPredicted','speedPredicted','saturationPredicted','servicePredicted'];
    layerList.map((layer) => {
      if(env.map.getLayer(layer)) env.map.removeLayer(layer);
      if(env.map.getLayer(`${layer}-symbol`)) env.map.removeLayer(`${layer}-symbol`);
    });
    if (map.getSource(sourceName)) map.removeSource(sourceName);
    map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });

    env.map.addLayer({
      "id": 'flowPredicted',
      "type": "line",
      "source": sourceName,
      "source-layer": "influenceMap",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.factorColor,
        "line-width": {
          "type": "interval",
          'property': 'influenceflow',
          'stops': datetimeHelper.setBufferRatio(this._view.factorWidth)//datetimeHelper.setBufferRange(this._view.factorWidth)
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': 1
      },
    });
    env.map.addLayer({
      "id": 'flowPredicted-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "influenceMap",
      "layout": {
        "text-field": "{influenceflow}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, [0, 0]],
            [0, [1.2, 1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops": [
            [12, 11],
            [14, 12],
            [16, 13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.factorColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
    });

    env.map.addLayer({
      "id": 'speedPredicted',
      "type": "line",
      "source": sourceName,
      'source-layer': 'influenceMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "influencespeed",
          "stops": MYCONF.SPEED_RANGE
        },
        // 'line-color': '#ab261f',
        "line-width": {
          "type": "interval",
          "property": "funcclass",
          "stops": [
            [2,3],
            [4,3],
            [5,1],
          ]
        },
      },
      'filter':["<=","funcclass",maxKind]
    });
    env.map.addLayer({
      "id": 'saturationPredicted',
      "type": "line",
      "source": sourceName,
      'source-layer': 'influenceMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "influencesaturation",
          "stops": MYCONF.SATURATION_TEMP
        },
        // 'line-color': '#f8b827',
        "line-width": {
          "type": "interval",
          "property": "funcclass",
          "stops": [
            [2,3],
            [4,3],
            [5,1],
          ]
        },
      },
      'filter':["<=","funcclass",maxKind]
    });
    env.map.addLayer({
      "id": 'servicePredicted',
      "type": "line",
      "source": sourceName,
      'source-layer': 'influenceMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "influencelos",
          "stops": MYCONF.SERVICE_RANGE
        },
        "line-width": {
          "type": "interval",
          "property": "funcclass",
          "stops": [
            [2,3],
            [4,3],
            [5,1],
          ]
        },
      },
      'filter':["<=","funcclass",maxKind]
    });
  }

  addDistributePBF() {
    let map = env.map;
    let curId = this._view.cur_pro_id;
    let timeTag = this._view.newTimeTag === '早高峰' ? 'M' : 'N';
    let flowMax = this._view.newFlowMax;
    let url = MYCONF.service.distributePBF + `?token=${sessionStorage.getItem("token")}&projectid=${curId}&timetag=${timeTag}&flowmaxvol=${flowMax}&speedmaxvol=3000&saturationmaxvol=3000&servicemaxvol=3000`;
    let sourceName = 'distributePBF';
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    if (map.getSource(sourceName)) map.removeSource(sourceName);
    map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });

    if (env.map.getLayer('flowDistribute')) env.map.removeLayer('flowDistribute');
    env.map.addLayer({
      "id": 'flowDistribute',
      "type": "line",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.factorColor,
        "line-width": {
          "type": "interval",
          'property': 'affectedflow',
          'stops': datetimeHelper.setBufferRatio(this._view.factorWidth)//datetimeHelper.setBufferRange(this._view.factorWidth)
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': 1
      },
    });
    if (env.map.getLayer('flowDistribute-symbol')) env.map.removeLayer('flowDistribute-symbol');
    env.map.addLayer({
      "id": 'flowDistribute-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "text-field": "{affectedflow}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, [0, 0]],
            [0, [1.2, 1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops": [
            [12, 11],
            [14, 12],
            [16, 13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.factorColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
    });

    if (env.map.getLayer('speedDistribute')) env.map.removeLayer('speedDistribute');
    env.map.addLayer({
      "id": 'speedDistribute',
      "type": "line",
      "source": sourceName,
      'source-layer': 'affectedMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "affectedspeed",
          "stops": MYCONF.SPEED_RANGE
        },
        "line-width": {
          "type": "interval",
          "property": "funcclass",
          "stops": [
            [2,3],
            [4,3],
            [5,1],
          ]
        },
      },
      'filter':["<=","funcclass",maxKind]
    });
    if (env.map.getLayer('saturationDistribute')) env.map.removeLayer('saturationDistribute');
    env.map.addLayer({
      "id": 'saturationDistribute',
      "type": "line",
      "source": sourceName,
      'source-layer': 'affectedMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "affectedsaturation",
          "stops": MYCONF.SATURATION_AFFECTED_TEMP
        },
        "line-width": {
          "type": "interval",
          "property": "funcclass",
          "stops": [
            [2,3],
            [4,3],
            [5,1],
          ]
        },
      },
      'filter':["<=","funcclass",maxKind]
    });
    if (env.map.getLayer('serviceDistribute')) env.map.removeLayer('serviceDistribute');
    env.map.addLayer({
      "id": 'serviceDistribute',
      "type": "line",
      "source": sourceName,
      'source-layer': 'affectedMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "affectedlos",
          "stops": MYCONF.SERVICE_RANGE
        },
        "line-width": {
          "type": "interval",
          "property": "funcclass",
          "stops": [
            [2,3],
            [4,3],
            [5,1],
          ]
        },
      },
      'filter':["<=","funcclass",maxKind]
    });
  }

  addDiffMapPBF() {
    let map = env.map;
    let curId = this._view.cur_pro_id;
    let timeTag = this._view.newTimeTag === '早高峰' ? 'M' : 'N';
    let flowMax = this._view.newFlowMax;
    let url = MYCONF.service.getDiffMap + `?token=${sessionStorage.getItem("token")}&projectid=${curId}&flowDiffMaxvol=3000&speedDiffMaxvol=3000&saturationDiffMaxvol=3000&serviceDiffMaxvol=10`;
    let sourceName = 'distributePBF';
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    let stopRange = [
      [-0.01,0],
      [1,0.9],
    ];

    let layerList = ['flowDistribute','speedDistribute','saturationDistribute','serviceDistribute'];
    layerList.map((layer) => {
      if(env.map.getLayer(layer)) env.map.removeLayer(layer);
      if(env.map.getLayer(`${layer}-symbol`)) env.map.removeLayer(`${layer}-symbol`);
    });
    if (map.getSource(sourceName)) map.removeSource(sourceName);
    map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });

   /* env.map.addLayer({
      "id": 'flowDistribute',
      "type": "line",
      "source": sourceName,
      "source-layer": "diffMap",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": {
          "type": "interval",
          'property': 'vd',
          "stops": [
            [-100, '#19514a'],
            [-0.01,  '#3b90ee'],
            [0.01, '#e80e0e'],
            // [100, this._view.flowMorethanColor],
          ]
        },
        "line-width": {
          "type": "interval",
          'property': 'vd',
          'stops': datetimeHelper.setFlowCompareBufferRatio(this._view.factorWidth)
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': 1
      },
    });
    env.map.addLayer({
      "id": 'flowDistribute-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "diffMap",
      "layout": {
        "text-field": "{vd}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, [0, 0]],
            [0, [1.2, 1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops": [
            [12, 11],
            [14, 12],
            [16, 13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.factorColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
    });

    env.map.addLayer({
      "id": 'speedDistribute',
      "type": "line",
      "source": sourceName,
      'source-layer': 'diffMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "sd",
          "stops": MYCONF.SPEED_AFFECTED_OTHER
        },
        "line-width": {
          "type": "interval",
          "property": "funcclass",
          "stops": [
            [2,3],
            [4,3],
            [5,1],
          ]
        },
      },
      'filter':["<=","funcclass",maxKind]
    });
    env.map.addLayer({
      "id":"speedDistribute-symbol",
      "type": "symbol",
      "source": sourceName,
      "source-layer": "diffMap",
      "layout": {
        "text-field": "{sd}",
        "symbol-placement": "line",
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops": [
            [12, 11],
            [14, 12],
            [16, 13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": '#666',
        "text-halo-color": '#fff',
        "text-halo-width": 1,
        "text-opacity": {
          "type": "interval",
          "property": "sd",
          "stops": stopRange
        },
        "text-halo-blur": 0.5,
      },
      'filter':["<=","funcclass",maxKind]
    });*/

    // env.map.addLayer({
    //   "id": 'saturationDistribute',
    //   "type": "line",
    //   "source": sourceName,
    //   'source-layer': 'diffMap',
    //   "layout": {
    //     "line-join": "round",
    //     "line-cap": "round"
    //   },
    //   'paint': {
    //     'line-color': {
    //       "type": "interval",
    //       "property": "vcd",
    //       "stops": MYCONF.SATURATION_AFFECTED_TEMP
    //     },
    //     "line-width": {
    //       "type": "interval",
    //       "property": "funcclass",
    //       "stops": [
    //         [2,3],
    //         [4,3],
    //         [5,1],
    //       ]
    //     },
    //   },
    //   'filter':["<=","funcclass",maxKind]
    // });
    // env.map.addLayer({
    //   "id":"saturationDistribute-symbol",
    //   "type": "symbol",
    //   "source": sourceName,
    //   "source-layer": "diffMap",
    //   "layout": {
    //     "text-field": "{vcd_annotation}",
    //     "symbol-placement": "line",
    //     "text-anchor": "bottom",
    //     "text-ignore-placement": true,
    //     "text-allow-overlap": false,
    //     "text-size": {
    //       "stops": [
    //         [12, 11],
    //         [14, 12],
    //         [16, 13]
    //       ]
    //     },
    //     "text-keep-upright": false
    //   },
    //   "paint": {
    //     "text-color": '#666',
    //     "text-halo-color": '#fff',
    //     "text-halo-width": 1,
    //     "text-opacity": 0.9,
    //     "text-halo-blur": 0.5,
    //   },
    //   'filter':["all",["<=","funcclass",maxKind],[">","vcd",0]]
    // });

    // env.map.addLayer({
    //   "id": 'serviceDistribute',
    //   "type": "line",
    //   "source": sourceName,
    //   'source-layer': 'diffMap',
    //   "layout": {
    //     "line-join": "round",
    //     "line-cap": "round"
    //   },
    //   'paint': {
    //     'line-color': {
    //       "type": "interval",
    //       "property": "los_diff",
    //       "stops": MYCONF.SERVICE_AFFECTED
    //     },
    //     "line-width": {
    //       "type": "interval",
    //       "property": "funcclass",
    //       "stops": [
    //         [2,3],
    //         [4,3],
    //         [5,1],
    //       ]
    //     },
    //   },
    //   'filter':["<=","funcclass",maxKind]
    // });
    // env.map.addLayer({
    //   "id":"serviceDistribute-symbol",
    //   "type": "symbol",
    //   "source": sourceName,
    //   "source-layer": "diffMap",
    //   "layout": {
    //     "text-field": "{los_diff}",
    //     "symbol-placement": "line",
    //     "text-anchor": "bottom",
    //     "text-ignore-placement": true,
    //     "text-allow-overlap": false,
    //     "text-size": {
    //       "stops": [
    //         [12, 11],
    //         [14, 12],
    //         [16, 13]
    //       ]
    //     },
    //     "text-keep-upright": false
    //   },
    //   "paint": {
    //     "text-color": '#666',
    //     "text-halo-color": '#fff',
    //     "text-halo-width": 1,
    //     "text-opacity": 0,
    //     "text-halo-blur": 0.5,
    //   },
    //   'filter': ['all',["<=", "funcclass", maxKind],["!=", "los_diff", 0]]
    // });
  }

  addLayerSource(){
    let map = env.map;
    let curId = this._view.cur_pro_id;
    let timeTag = this._view.newTimeTag === '早高峰' ? 'M' : 'N';
    let flowMax = this._view.newFlowMax;

    let presentUrl = MYCONF.service.presentPBF + `?token=${sessionStorage.getItem("token")}&projectid=${curId}&timetag=${timeTag}&flowmaxvol=${flowMax}&speedmaxvol=3000&saturationmaxvol=3000&servicemaxvol=3000`;
    let presentName = 'presentPBF';
    if (map.getSource(presentName)) map.removeSource(presentName);
    map.addSource(presentName, {
      type: "vector",
      tiles: [presentUrl]
    });

    /*let predictedUrl = MYCONF.service.predictedPBF + `?token=${sessionStorage.getItem("token")}&projectid=${curId}&timetag=${timeTag}&flowmaxvol=${flowMax}&speedmaxvol=3000&saturationmaxvol=3000&servicemaxvol=3000`;
    let predictedName = 'predictedPBF';
    if (map.getSource(predictedName)) map.removeSource(predictedName);
    map.addSource(predictedName, {
      type: "vector",
      tiles: [predictedUrl]
    });*/

    let distributeUrl = MYCONF.service.getDiffMap + `?token=${sessionStorage.getItem("token")}&projectid=${curId}&flowDiffMaxvol=3000&speedDiffMaxvol=3000&saturationDiffMaxvol=3000&serviceDiffMaxvol=10`;
    let distributeName = 'distributePBF';
    if (map.getSource(distributeName)) map.removeSource(distributeName);
    map.addSource(distributeName, {
      type: "vector",
      tiles: [distributeUrl]
    });
  }

//TODO:净流量变化图添加
  loadStep6Image(count=0){
    let _this = this;
    let map = env.map;

    let imageLayers = ['flowPresent','speedPresent', 'saturationPresent', 'servicePresent','flowDistribute', 'speedDistribute', 'saturationDistribute', 'serviceDistribute','flowDistribution'];
    _this.addImageLayer(imageLayers[count]);
    let t = setInterval(function () {
      if (map && imageLayers[count]) {
        if (map.areTilesLoaded()) {
          _this.getStep6Image(imageLayers[count]);
          count++;
          _this.loadStep6Image(count);
          clearInterval(t);
        }
      } else {
        clearInterval(t);
      }
    }, 500);
  }


  addImageLayer(layerId){
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    let presentSource = 'presentPBF';
    let predictedSource = 'predictedPBF';
    let distributeSource = 'distributePBF';

    switch (layerId){
      case 'flowPresent':
        if(env.map.getLayer('flowPresent')) env.map.removeLayer('flowPresent');
        env.map.addLayer({
          "id": 'flowPresent',
          "type": "line",
          "source": presentSource,
          "source-layer": "actualMap",
          "layout": {
            "line-join": "round",
            "line-cap": "butt"
          },
          "paint": {
            "line-color": this._view.factorColor,
            "line-width": {
              "type": "interval",
              'property': 'actualflow',
              'stops': datetimeHelper.setBufferRatio(this._view.factorWidth)//datetimeHelper.setBufferRange(this._view.factorWidth)
            },
            'half-render': true,
            'line-normal-direction': {
              "type": "categorical",
              "property": "buffer_dir",
              "stops": [
                [1, true],
                [0, false]
              ]
            },
            'line-opacity': 1
          },
          // 'filter':[">","actualflow",0]
        });

        if (env.map.getLayer('flowPresent-symbol')) env.map.removeLayer('flowPresent-symbol');
        env.map.addLayer({
          "id": 'flowPresent-symbol',
          "type": "symbol",
          "source": presentSource,
          "source-layer": "actualMap",
          "layout": {
            "text-field": "{actualflow}",
            "symbol-placement": "line",
            "text-offset": {
              "type": "categorical",
              "property": "buffer_dir",
              "stops": [
                [1, [0, 0]],
                [0, [1.2, 1.2]]
              ]
            },
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": this._view.factorColor,
            "text-halo-color": '#fff',
            "text-halo-width": 1.3,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
          // 'filter':[">","actualflow",0]
        });
        break;
      case 'speedPresent':
        if(env.map.getLayer('flowPresent')){
          env.map.removeLayer('flowPresent');
          env.map.removeLayer('flowPresent-symbol');
        }
        if (env.map.getLayer('speedPresent')) env.map.removeLayer('speedPresent');
        env.map.addLayer({
          "id": 'speedPresent',
          "type": "line",
          "source": presentSource,
          'source-layer': 'actualMap',
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          'paint': {
            'line-color': {
              "type": "interval",
              "property": "actualspeed",
              "stops": MYCONF.SPEED_RANGE
            },
            // 'line-color': '#ab261f',
            "line-width": {
              "type": "interval",
              "property": "funcclass",
              "stops": [
                [2,3],
                [4,3],
                [5,1.5],
              ]
            },
          },
          'filter':["<=","funcclass",maxKind]
        });
        if (env.map.getLayer('speedPresent-symbol')) env.map.removeLayer('speedPresent-symbol');
        env.map.addLayer({
          "id":"speedPresent-symbol",
          "type": "symbol",
          "source": presentSource,
          "source-layer": "actualMap",
          "layout": {
            "text-field": "{actualspeed}",
            "symbol-placement": "line",
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": '#666',
            "text-halo-color": '#fff',
            "text-halo-width": 1,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
          'filter':["<=","funcclass",maxKind]
        });
        break;
      case 'saturationPresent':
        if(env.map.getLayer('speedPresent')){
          env.map.removeLayer('speedPresent');
          env.map.removeLayer('speedPresent-symbol');
        }
        if (env.map.getLayer('saturationPresent')) env.map.removeLayer('saturationPresent');
        env.map.addLayer({
          "id": 'saturationPresent',
          "type": "line",
          "source": presentSource,
          'source-layer': 'actualMap',
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          'paint': {
            'line-color': {
              "type": "interval",
              "property": "actualsaturation",
              "stops": MYCONF.SATURATION_TEMP
            },
            // 'line-color': '#f8b827',
            "line-width": {
              "type": "interval",
              "property": "funcclass",
              "stops": [
                [2,3],
                [4,3],
                [5,1.5],
              ]
            },
          },
          'filter':["<=","funcclass",maxKind]
        });
        if (env.map.getLayer('saturationPresent-symbol')) env.map.removeLayer('saturationPresent-symbol');
        env.map.addLayer({
          "id":"saturationPresent-symbol",
          "type": "symbol",
          "source": presentSource,
          "source-layer": "actualMap",
          "layout": {
            "text-field": "{actualsaturation_annotation}",
            "symbol-placement": "line",
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": '#666',
            "text-halo-color": '#fff',
            "text-halo-width": 1,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
          'filter':["<=","funcclass",maxKind]
        });
        break;
      case 'servicePresent':
        if(env.map.getLayer('saturationPresent')){
          env.map.removeLayer('saturationPresent');
          env.map.removeLayer('saturationPresent-symbol');
        }
        if (env.map.getLayer('servicePresent')) env.map.removeLayer('servicePresent');
        env.map.addLayer({
          "id": 'servicePresent',
          "type": "line",
          "source": presentSource,
          'source-layer': 'actualMap',
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          'paint': {
            'line-color': {
              "type": "interval",
              "property": "actuallos",
              "stops": MYCONF.SERVICE_RANGE
            },
            "line-width": {
              "type": "interval",
              "property": "funcclass",
              "stops": [
                [2,3],
                [4,3],
                [5,1.5],
              ]
            },
          },
          'filter':["<=","funcclass",maxKind]
        });
        if (env.map.getLayer('servicePresent-symbol')) env.map.removeLayer('servicePresent-symbol');
        env.map.addLayer({
          "id":"servicePresent-symbol",
          "type": "symbol",
          "source": presentSource,
          "source-layer": "actualMap",
          "layout": {
            "text-field": "{actuallos}",
            "symbol-placement": "line",
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": '#666',
            "text-halo-color": '#fff',
            "text-halo-width": 1,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
          'filter':["<=","funcclass",maxKind]
        });
        break;
      case 'flowDistribute':
        if(env.map.getLayer('servicePresent')){
          env.map.removeLayer('servicePresent');
          env.map.removeLayer('servicePresent-symbol');
        }
        if (env.map.getLayer('flowDistribute')) env.map.removeLayer('flowDistribute');
        env.map.addLayer({
          "id": 'flowDistribute',
          "type": "line",
          "source": distributeSource,
          "source-layer": "diffMap",
          "layout": {
            "line-join": "round",
            "line-cap": "butt"
          },
          "paint": {
            "line-color": {
              "type": "interval",
              'property': 'vd',
              "stops": [
                [-100, '#19514a'],
                [-0.01,  '#3b90ee'],
                [0.01, '#e80e0e'],
              ]
            },
            "line-width": {
              "type": "interval",
              'property': 'vd',
              'stops': datetimeHelper.setFlowCompareBufferRatio(this._view.factorWidth)
            },
            'half-render': true,
            'line-normal-direction': {
              "type": "categorical",
              "property": "buffer_dir",
              "stops": [
                [1, true],
                [0, false]
              ]
            },
            'line-opacity': 1
          },
        });
        if (env.map.getLayer('flowDistribute-symbol')) env.map.removeLayer('flowDistribute-symbol');
        env.map.addLayer({
          "id": 'flowDistribute-symbol',
          "type": "symbol",
          "source": distributeSource,
          "source-layer": "diffMap",
          "layout": {
            "text-field": "{vd}",
            "symbol-placement": "line",
            "text-offset": {
              "type": "categorical",
              "property": "buffer_dir",
              "stops": [
                [1, [0, 0]],
                [0, [1.2, 1.2]]
              ]
            },
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": this._view.factorColor,
            "text-halo-color": '#fff',
            "text-halo-width": 1.3,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
        });
        break;
      case 'speedDistribute':
        if(env.map.getLayer('flowDistribute')){
          env.map.removeLayer('flowDistribute');
          env.map.removeLayer('flowDistribute-symbol');
        }
        if (env.map.getLayer('speedDistribute')) env.map.removeLayer('speedDistribute');
        env.map.addLayer({
          "id": 'speedDistribute',
          "type": "line",
          "source": distributeSource,
          'source-layer': 'diffMap',
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          'paint': {
            'line-color': {
              "type": "interval",
              "property": "sd",
              "stops": MYCONF.SPEED_AFFECTED_OTHER
            },
            "line-width": {
              "type": "interval",
              "property": "funcclass",
              "stops": [
                [2,3],
                [4,3],
                [5,1],
              ]
            },
          },
          'filter':["<=","funcclass",maxKind]
        });
        if (env.map.getLayer('speedDistribute-symbol')) env.map.removeLayer('speedDistribute-symbol');
        env.map.addLayer({
          "id":"speedDistribute-symbol",
          "type": "symbol",
          "source": distributeSource,
          "source-layer": "diffMap",
          "layout": {
            "text-field": "{sd}",
            "symbol-placement": "line",
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": '#666',
            "text-halo-color": '#fff',
            "text-halo-width": 1,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
          'filter':["all",["<=","funcclass",maxKind],["!=","sd",0]]
        });
      break;
      case 'saturationDistribute':
        if(env.map.getLayer('speedDistribute')){
          env.map.removeLayer('speedDistribute');
          env.map.removeLayer('speedDistribute-symbol');
        }
        if (env.map.getLayer('saturationDistribute')) env.map.removeLayer('saturationDistribute');
        env.map.addLayer({
          "id": 'saturationDistribute',
          "type": "line",
          "source": distributeSource,
          'source-layer': 'diffMap',
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          'paint': {
            'line-color': {
              "type": "interval",
              "property": "vcd",
              "stops": MYCONF.SATURATION_AFFECTED_TEMP
            },
            "line-width": {
              "type": "interval",
              "property": "funcclass",
              "stops": [
                [2,3],
                [4,3],
                [5,1],
              ]
            },
          },
          'filter':["<=","funcclass",maxKind]
        });
        if (env.map.getLayer('saturationDistribute-symbol')) env.map.removeLayer('saturationDistribute-symbol');
        env.map.addLayer({
          "id":"saturationDistribute-symbol",
          "type": "symbol",
          "source": distributeSource,
          "source-layer": "diffMap",
          "layout": {
            "text-field": "{vcd_annotation}",
            "symbol-placement": "line",
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": '#666',
            "text-halo-color": '#fff',
            "text-halo-width": 1,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
          'filter':["all",["<=","funcclass",maxKind],["!=","vcd",0]]
        });
        break;
      case 'serviceDistribute':
        if(env.map.getLayer('saturationDistribute')){
          env.map.removeLayer('saturationDistribute');
          env.map.removeLayer('saturationDistribute-symbol');
        }
        if (env.map.getLayer('serviceDistribute')) env.map.removeLayer('serviceDistribute');
        env.map.addLayer({
          "id": 'serviceDistribute',
          "type": "line",
          "source": distributeSource,
          'source-layer': 'diffMap',
          "layout": {
            "line-join": "round",
            "line-cap": "round"
          },
          'paint': {
            'line-color': {
              "type": "interval",
              "property": "los_diff",
              "stops": MYCONF.SERVICE_AFFECTED
            },
            "line-width": {
              "type": "interval",
              "property": "funcclass",
              "stops": [
                [2,3],
                [4,3],
                [5,1],
              ]
            },
          },
          'filter':["<=","funcclass",maxKind]
        });
        // if (env.map.getLayer('serviceDistribute-symbol')) env.map.removeLayer('serviceDistribute-symbol');
        // env.map.addLayer({
        //   "id":"serviceDistribute-symbol",
        //   "type": "symbol",
        //   "source": distributeSource,
        //   "source-layer": "diffMap",
        //   "layout": {
        //     "text-field": "{los_diff}",
        //     "symbol-placement": "line",
        //     "text-anchor": "bottom",
        //     "text-ignore-placement": true,
        //     "text-allow-overlap": false,
        //     "text-size": {
        //       "stops": [
        //         [12, 11],
        //         [14, 12],
        //         [16, 13]
        //       ]
        //     },
        //     "text-keep-upright": false
        //   },
        //   "paint": {
        //     "text-color": '#666',
        //     "text-halo-color": '#fff',
        //     "text-halo-width": 1,
        //     "text-opacity": 0,
        //     "text-halo-blur": 0.5,
        //   },
        //   'filter':["<=","funcclass",maxKind]
        // });
        break;
      default:
        if(env.map.getLayer('serviceDistribute')){
          env.map.removeLayer('serviceDistribute');
          // env.map.removeLayer('serviceDistribute-symbol');
        }
        let sourceName = "step-flow-5";
        let token = sessionStorage.getItem("token");
        let maxFlow = this._view.newFlowMax;
        let minFlow = this._view.newFlowMin;
        let curId = this._view.cur_pro_id;
        let newTimeTag = this._view.newTimeTag;
        let timeTag = newTimeTag === '早高峰' ? 'M' : 'N';
        let url = `${MYCONF.service.teBuffer}?token=${token}&projectid=${curId}&timetag=${timeTag}&minVol=0&maxVol=${maxFlow}`;
        if (env.map.getSource(sourceName)) env.map.removeSource(sourceName);
        env.map.addSource(sourceName, {
          type: "vector",
          tiles: [url]
        });
        //交通分配
        if (env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
        env.map.addLayer({
          "id": sourceName,
          "type": "line",
          "source": sourceName,
          "source-layer": "teBuffer",
          "layout": {
            "line-join": "round",
            "line-cap": "butt"
          },
          "paint": {
            "line-color": this._view.newFlowColor,
            "line-width": {
              "type": "interval",
              'property': 'vol_add',
              // 'stops': datetimeHelper.setStopRange(this._view.newFlowWidth)
              'stops': datetimeHelper.setBufferRatio(this._view.newFlowWidth)
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
          'filter': minFlow === 0 ? [">", "vol_add", minFlow] : [">=", "vol_add", minFlow]
        });

        if (env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
        env.map.addLayer({
          "id": `${sourceName}-symbol`,
          "type": "symbol",
          "source": sourceName,
          "source-layer": "teBuffer",
          "layout": {
            "text-field": "{vol_add}",
            "symbol-placement": "line",
            "text-offset": {
              "type": "categorical",
              "property": "dir",
              "stops": [
                [1, [0.2, 0.2]],
                [0, [1.2, 1.2]]
              ]
            },
            "text-anchor": "bottom",
            "text-ignore-placement": true,
            "text-allow-overlap": false,
            "text-size": {
              "stops": [
                [12, 11],
                [14, 12],
                [16, 13]
              ]
            },
            "text-keep-upright": false
          },
          "paint": {
            "text-color": this._view.newFlowColor,
            "text-halo-color": '#fff',
            "text-halo-width": 1.3,
            "text-opacity": 0.9,
            "text-halo-blur": 0.5,
          },
          'filter': minFlow === 0 ? [">", "vol_add", minFlow] : [">=", "vol_add", minFlow]
        });
        break;


    }
  }

  getStep6Image(layerId) {
    let _this = this;
    // this._view.imgIndex = 0;
    // this._view.imgTimer = setInterval(_this.rangeImageFun.bind(_this), 1000);
    switch (layerId){
      case 'flowPresent':
        _this.saveImage('flowMap', '背景流量分布图');
        break;
      case 'speedPresent':
        _this.saveImage('speedMap', '背景速度分布图');
        break;
      case 'saturationPresent':
        _this.saveImage('saturationMap', '背景饱和度分布图');
        break;
      case 'servicePresent':
        _this.saveImage('serviceMap', '背景服务水平分布图');
        break;
      // case 'flowPredicted':
      //   _this.saveImage('flowInfluence', '目标年预测流量分布图');
      //   break;
      // case 'speedPredicted':
      //   _this.saveImage('speedInfluence', '目标年预测速度分布图');
      //   break;
      // case 'saturationPredicted':
      //   _this.saveImage('saturationInfluence', '目标年预测饱和度分布图');
      //   break;
      // case 'servicePredicted':
      //   _this.saveImage('serviceInfluence', '目标年预测服务水平分布图');
      //   break;
      case 'flowDistribute':
        _this.saveImage('flowAffected', '流量差值(影响后-背景)分布图');
        break;
      case 'speedDistribute':
        _this.saveImage('speedAffected', '速度差值(影响后-背景)分布图');
        break;
      case 'saturationDistribute':
        _this.saveImage('saturationAffected', '饱和度差值(影响后-背景)分布图');
        break;
      case 'serviceDistribute':
        _this.saveImage('serviceAffected', '服务水平差值(影响后-背景)分布图');
        if(env.map.getLayer('serviceDistribute')){
          env.map.removeLayer('serviceDistribute');
          // env.map.removeLayer('serviceDistribute-symbol');
        }
        break;
      default:
        _this.saveImage('flowDistribution', '净流量变化分布图');
        _this.setStep6LayerShow();
        _this._view.updateGlobalMask(false);
        break;


    }
  }

  setLayerShow(layerId){
    let map = env.map;
    if (map.getLayer(layerId)){
      map.setLayoutProperty(layerId, 'visibility', 'visible');
      if(layerId === 'flowPresent' || layerId === 'flowPredicted' || layerId === 'flowDistribute'){
        map.setLayoutProperty(`${layerId}-symbol`, 'visibility', 'visible');
      }
    }
  }
  setLayerHide(layerId){
    let map = env.map;
    if (map.getLayer(layerId)){
      map.setLayoutProperty(layerId, 'visibility', 'none');
      if(layerId === 'flowPresent' || layerId === 'flowPredicted' || layerId === 'flowDistribute'){
        map.setLayoutProperty(`${layerId}-symbol`, 'visibility', 'none');
      }
    }
  }
  setSingleLayerShow(layerId) {
    let map = env.map;
    let imageLayers = [ 'flowPresent','speedPresent', 'saturationPresent', 'servicePresent', 'speedPredicted', 'flowPredicted', 'saturationPredicted', 'servicePredicted', 'speedDistribute', 'flowDistribute', 'saturationDistribute', 'serviceDistribute', 'flowPresent-symbol', 'flowPredicted-symbol', 'flowDistribute-symbol'];
    let symbolLayers = ['flowPresent-symbol', 'flowPredicted-symbol', 'flowDistribute-symbol'];

    imageLayers.map((layer) => {
      if (map.getLayer(layer)) {
        if (layer === layerId) {
          map.setLayoutProperty(layer, 'visibility', 'visible');
          if (symbolLayers.indexOf(`${layerId}-symbol`) != -1) {
            map.setLayoutProperty(`${layerId}-symbol`, 'visibility', 'visible');
          }
        } else {
          map.setLayoutProperty(layer, 'visibility', 'none');
          if (symbolLayers.indexOf(`${layerId}-symbol`) != -1) {
            map.setLayoutProperty(`${layerId}-symbol`, 'visibility', 'none');
          }
        }
      }
    });
  }

  setBufferColor(color){
    let flowLayers = [ 'flowPresent', 'flowPredicted'];
    flowLayers.map((layerId) => {
      if (env.map.getLayer(layerId) && color !== '#FFFFFF') {
        env.map.setPaintProperty(layerId, 'line-color', color);
        env.map.setPaintProperty(layerId, 'line-opacity', 1);
        env.map.setPaintProperty(`${layerId}-symbol`, 'text-color', color);
        env.map.setPaintProperty(`${layerId}-symbol`, 'text-opacity', 0.9);
      } else if (color === '#FFFFFF') {
        env.map.setPaintProperty(layerId, 'line-opacity', 0);
        env.map.setPaintProperty(`${layerId}-symbol`, 'text-color', color);
        env.map.setPaintProperty(`${layerId}-symbol`, 'text-opacity', 0);
      }
    })
  }

  removeAllLayer(){
    let map = env.map;
    let imageLayers = ['flowPresent','flowPresent-symbol','speedPresent', 'saturationPresent', 'servicePresent', 'speedPredicted', 'flowPredicted', 'saturationPredicted', 'servicePredicted', 'speedDistribute', 'flowDistribute', 'saturationDistribute', 'serviceDistribute', 'flowPredicted-symbol', 'flowDistribute-symbol'];
    imageLayers.map((layerId) => {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
    });
  }

  setAllLayerHide() {
    let map = env.map;
    // 'flowPresent','flowPresent-symbol'
    let imageLayers = [ 'flowPresent','speedPresent','speedPresent-symbol','saturationPresent', 'saturationPresent-symbol','servicePresent', 'servicePresent-symbol','flowDistribute','speedDistribute','speedDistribute-symbol','saturationDistribute','saturationDistribute-symbol','serviceDistribute', 'serviceDistribute-symbol',  'flowDistribute-symbol','flowPresent-symbol'];
    imageLayers.map((layer) => {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'none');
      }
    });
  }

  setStep6LayerHide(){
    let map = env.map;
    // let imageLayers = ['step-traffic-5', 'step-flow-5', 'step-traffic-5-symbol', 'step-flow-5-symbol','factor-layer', 'factor-layer-symbol','polygonLayer','entryLayerAll','entryLineAll','entryPointAll','landNameAll','roadLineLayerLable','roadLineLayerAll','entryLine'];
    let imageLayers = [ 'step-flow-5', 'step-flow-5-symbol', 'step-traffic-5', 'step-traffic-5-symbol','factor-layer', 'factor-layer-symbol'];
    imageLayers.map((layer) => {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'none');
      }
    });
  }

  setStep6LayerShow(){
    let map = env.map;
    let imageLayers = ['polygonLayer','entryLayerAll','entryLineAll','entryPointAll','landNameAll','roadLineLayerLable','roadLineLayerAll','entryLine'];
    imageLayers.map((layer) => {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'visible');
      }
    });

    let factorList = !this._view.isFactorLabelShow?['factor-layer']:['factor-layer', 'factor-layer-symbol'];
    let flowLayerList = !this._view.isFlowShow?['step-flow-5']:['step-flow-5',  'step-flow-5-symbol'];
    let bgLayerList = !this._view.isFlowShow?['step-traffic-5']:['step-traffic-5', 'step-traffic-5-symbol'];
    let factorLayers = ['factor-layer', 'factor-layer-symbol'];
    let flowLayerLayers = ['step-flow-5',  'step-flow-5-symbol'];
    let bgLayerLayers = ['step-traffic-5', 'step-traffic-5-symbol'];
    if(this._view.isAreaShow){
      flowLayerList.map((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, 'visibility', 'visible');
        }
      });
    }else{
      flowLayerLayers.map((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, 'visibility', 'none');
        }
      });
    }
    if(this._view.isAreaShow && this._view.isBgFlowShow){
      bgLayerList.map((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, 'visibility', 'visible');
        }
      });
    }else{
      bgLayerLayers.map((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, 'visibility', 'none');
        }
      });
    }
    if(this._view.isFactorShow){
      factorList.map((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, 'visibility', 'visible');
        }
      });
    }else{
      factorLayers.map((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, 'visibility', 'none');
        }
      });
    }
  }

  saveImage(name, desc) {
    let asd = env.map.getCanvas();
    let cheight = asd.height;
    let cwidth = asd.width;
    let cx = 0;
    if(cwidth > cheight*1.5){
      cwidth = cheight*1.5;
      cx = (asd.width - cwidth)/2;
    }
    let mycanvas = document.createElement('canvas');
    mycanvas.height = cheight;
    mycanvas.width = cwidth;
    mycanvas.getContext("2d").drawImage(asd, 0, 0);
    mycanvas.getContext("2d").drawImage(asd, cx, 0, cwidth, cheight, 0 , 0, cwidth, cheight);
    let img_data = Canvas2Image.saveAsJPEG(mycanvas, true, cx, 0, cwidth, cheight).getAttribute('src');
    MapCommonLayer.upLoadImage(this,img_data,name,desc);
    // datetimeHelper.saveFile(img_data, `${name}.jpg`);
  }
  // html2canvas(document.querySelector('#map-legend')).then(canvas =>{
  //   let img_data1 = Canvas2Image.saveAsJPEG(canvas, true).getAttribute('src');
  //   datetimeHelper.saveFile(img_data1, `${fileName}.jpg`);
  //   this.updateMaskUrl(img_data1);
  // })
}
