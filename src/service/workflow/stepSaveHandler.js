/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import datetimeHelper from "../../util/datetime-helper";

export default class stepSaveHandler {
  constructor(_view) {
    this._view = _view;
  }

  stateJudge(type){
    switch (type){
      case 'speed':
        this.speedLineLayer();
        break;
      case 'flow':
        this._view.flowProject==='方案比较'?this.flowCompareBufferLayer():this.flowBufferLayer();
        break;
      case 'saturation':
        this.saturationLineLayer();
        break;
      case 'service':
        this.serviceLineLayer();
        break;
    }
  }

  speedLineLayer(){
    let sourceName = 'speed-line';
    let token = sessionStorage.getItem("token");
    let stopRange = this.setFactorStop('speed', this._view.speedProject);
    let primaryprojectid = this._view.speedProject ==='方案2'? this._view.comparePlan2_id : this._view.comparePlan1_id;
    let secondaryprojectid = this._view.speedProject ==='方案比较'? this._view.comparePlan2_id : '';
    let url = MYCONF.service.compareTransformPBF + `?token=${token}&primaryprojectid=${primaryprojectid}&secondaryprojectid=${secondaryprojectid}&flowmaxvol=0&speedmaxvol=50&saturationmaxvol=0&servicemaxvol=0`;
    this.removeLayer();
    let speedType = this._view.speedProject ==='方案比较'?'speedCompare':'speed';
    this._view.updateLayerLegendType(speedType);
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    let text_color = this._view.speedProject === '方案比较'? [[-2, '#333333'], [-0.5, 'rgba(255,255,255,0)'], [0.5, '#333333']]: [[2,'#333333']];
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "source": sourceName,
      "type": "line",
      'source-layer': 'affectedMap',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "affectedspeed",
          "stops": stopRange
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
      "id": sourceName+'-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "visibility": this._view.compareLabelShow.speed?"visible":"none",
        "text-field": "{affectedspeed}",
        "symbol-placement": "line",
        "text-offset": [0, 0],
        "text-anchor": "top",
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
        // "text-color": '#333333',
        "text-color":{
          "type": "interval",
          "property": "affectedspeed",
          "stops": text_color
        },
        "text-halo-color": 'rgba(255,255,255,0)',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
      'filter':["<=","funcclass",maxKind]
    });
  }

  flowBufferLayer(){
    let sourceName = 'flow-buffer';
    let token = sessionStorage.getItem("token");
    let stopRange = this.setFactorStop('speed');
    let primaryprojectid = this._view.flowProject ==='方案2'? this._view.comparePlan2_id : this._view.comparePlan1_id;
    let secondaryprojectid = this._view.flowProject ==='方案比较'? this._view.comparePlan2_id : '';
    let url = MYCONF.service.compareTransformPBF + `?token=${token}&primaryprojectid=${primaryprojectid}&secondaryprojectid=${secondaryprojectid}&flowmaxvol=${this._view.flowCompareHigher}&speedmaxvol=0&saturationmaxvol=0&servicemaxvol=0`;
    this.removeLayer();
    this._view.updateLayerLegendType('');
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });

    //分配流量
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.flowAssignColor,
        "line-width": {
          "type": "interval",
          'property': 'vta',
          'stops': datetimeHelper.setBufferRatio(this._view.flowCompareWidth)
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
      'filter': this._view.flowCompareLower === 0 ? [">", "vta", this._view.flowCompareLower] : [">=", "vta", this._view.flowCompareLower]
    });
    env.map.addLayer({
      "id": sourceName+'-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "visibility": this._view.compareLabelShow.flow?"visible":"none",
        "text-field": "{vta}",
        "symbol-placement": "line",
        "text-offset": [0, 0],
        "text-anchor": "top",
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
        "text-color": '#333333',
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
      'filter': this._view.flowCompareLower === 0 ? [">", "vta", this._view.flowCompareLower] : [">=", "vta", this._view.flowCompareLower]
    });
  }

  flowCompareBufferLayer(){
    let sourceName = 'flow-compare-buffer';
    let token = sessionStorage.getItem("token");
    let primaryprojectid = this._view.comparePlan1_id;
    let secondaryprojectid = this._view.comparePlan2_id;
    let url = MYCONF.service.compareTransformPBF + `?token=${token}&primaryprojectid=${primaryprojectid}&secondaryprojectid=${secondaryprojectid}&flowmaxvol=${this._view.flowCompareHigher}&speedmaxvol=0&saturationmaxvol=0&servicemaxvol=0`;
    this.removeLayer();
    this._view.updateLayerLegendType('');
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": {
          "type": "interval",
          'property': 'vf_diff_alter',
          "stops": [
            [-100, this._view.flowLessthanColor],
            [-0.01, this._view.flowEqualColor],
            [0.01, this._view.flowMorethanColor],
            // [100, this._view.flowMorethanColor],
          ]
        },
        "line-width": {
          "type": "interval",
          'property': 'vf_diff_alter',
          'stops': datetimeHelper.setFlowCompareBufferRatio(this._view.flowCompareWidth)
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
      // 'filter': this._view.flowCompareLower === 0 ? [">", "vf_diff_alter", this._view.flowCompareLower] : [">=", "vf_diff_alter", this._view.flowCompareLower]
    });
    env.map.addLayer({
      "id": sourceName+'-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "visibility": this._view.compareLabelShow.flow?"visible":"none",
        "text-field": "{vf_diff_alter}",
        "symbol-placement": "line",
        "text-offset": [0, 0],
        "text-anchor": "top",
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
        "text-color": '#333333',
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
      'filter': this._view.flowCompareLower === 0 ? ["!=", "vf_diff_alter", this._view.flowCompareLower] : [">=", "vf_diff_alter", this._view.flowCompareLower]
    });
  }

  saturationLineLayer(){
    let sourceName = 'saturation-line';
    let token = sessionStorage.getItem("token");
    let stopRange = this.setFactorStop('saturation',this._view.saturationProject);
    let primaryprojectid = this._view.saturationProject ==='方案2'? this._view.comparePlan2_id : this._view.comparePlan1_id;
    let secondaryprojectid = this._view.saturationProject ==='方案比较'? this._view.comparePlan2_id : '';
    let url = MYCONF.service.compareTransformPBF + `?token=${token}&primaryprojectid=${primaryprojectid}&secondaryprojectid=${secondaryprojectid}&flowmaxvol=0&speedmaxvol=0&saturationmaxvol=50&servicemaxvol=0`;
    this.removeLayer();
    let saturationType = this._view.saturationProject ==='方案比较'? 'saturationCompare':'saturation';
    this._view.updateLayerLegendType(saturationType);
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    let text_color = this._view.saturationProject ==='方案比较'? [[-0.10, '#333333'], [-0.03, 'rgba(255,255,255,0)'], [0.03, '#333333'],] : [[1, '#333333']];
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
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
          "stops": stopRange
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
      "id": sourceName+'-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "visibility": this._view.compareLabelShow.saturation?"visible":"none",
        "text-field": "{affectedsaturation_annotation}",
        "symbol-placement": "line",
        "text-offset": [0, 0],
        "text-anchor": "top",
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
        // "text-color": '#333333',
        "text-color":{
          "type": "interval",
          "property": "affectedsaturation",
          "stops": text_color
        },
        "text-halo-color": 'rgba(255,255,255,0)',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
      'filter':["<=","funcclass",maxKind]
    });
  }

  serviceLineLayer(){
    let sourceName = 'service-line';
    let token = sessionStorage.getItem("token");
    let stopRange = this.setFactorStop('service',this._view.serviceProject);
    let primaryprojectid = this._view.serviceProject ==='方案2'? this._view.comparePlan2_id : this._view.comparePlan1_id;
    let secondaryprojectid = this._view.serviceProject ==='方案比较'? this._view.comparePlan2_id : '';
    let url = MYCONF.service.compareTransformPBF + `?token=${token}&primaryprojectid=${primaryprojectid}&secondaryprojectid=${secondaryprojectid}&flowmaxvol=0&speedmaxvol=0&saturationmaxvol=0&servicemaxvol=50`;
    this.removeLayer();
    let serviceType = this._view.serviceProject ==='方案比较'? 'serviceCompare':'service';
    this._view.updateLayerLegendType(serviceType);
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
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
          "stops": stopRange
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
      "id": sourceName+'-symbol',
      "type": "symbol",
      "source": sourceName,
      "source-layer": "affectedMap",
      "layout": {
        "visibility": this._view.compareLabelShow.service?"visible":"none",
        "text-field": "{affectedlos_annotation}",
        "symbol-placement": "line",
        "text-offset": [0, 0],
        "text-anchor": "top",
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
        "text-color": '#333333',
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
      'filter':["<=","funcclass",maxKind]
    });
  }

  setFactorStop(data, project){
    switch (data){
      case 'speed':
        return project!=='方案比较' ? MYCONF.SPEED_RANGE : MYCONF.SPEED_AFFECTED_COMPARE;
        break;
      case 'saturation':
        return project!=='方案比较' ? MYCONF.SATURATION_TEMP : MYCONF.SATURATION_AFFECTED_TEMP;
        break;
      case 'service':
        return project!=='方案比较' ? MYCONF.SERVICE_RANGE : MYCONF.SERVICE_AFFECTED;
        break;
      default:
        return MYCONF.SPEED_RANGE;
        break;
    }
  }

  removeLayer(){
    let layerId = ['speed-line','speed-line-symbol','flow-buffer','flow-buffer-symbol','saturation-line','saturation-line-symbol',
      'service-line','service-line-symbol','flow-compare-buffer','flow-compare-buffer-symbol'];
    layerId.map(item=>{
      if(env.map.getSource(item)) env.map.removeSource(item);
      if(env.map.getLayer(item)) env.map.removeLayer(item);
    });
    // env.map.on('click', function (e) {
    //   let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: [sourceName]});
    //   if (!features.length) {
    //     return;
    //   }
    //   let feature = features[0];
    //   console.log(features);
    // });
  }
}
