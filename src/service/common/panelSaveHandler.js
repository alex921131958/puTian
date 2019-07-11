/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import datetimeHelper from '../../util/datetime-helper'
import Vue from 'vue'
import MapCommonLayer from '../map/mapCommonLayer'
import eventBus from "../../util/event-bus";

export default class panelSaveHandler {
  constructor(_view) {
    this._view = _view;
    //todo: 应用后渲染结果图层命名规则：根据模块id: ${id},label命名：${id}-symbol ,--->涉及整体图层显隐
  }

  //历史路况
  addHisTrafficLayer(){
    let sourceName = "carTraffic-1";
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
        :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
        : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.hisTraffic}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&token=${token}&id=${id}`;
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    this._view.updateLayerLegendType('拥堵情况');
    if(this._view.selected_only && dataSource === 0 && id == ''){
      this._view.isAllGlobal = true;
      this._view.$Message.info({
        content: '所选区域路段列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }else{
      this._view.isAllGlobal = !this._view.selected_only ? true : false;
    }
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      'source-layer': 'CNRticLayer',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "los",
          "stops": [
            [1,'#34a034'],
            [2,'#fbe019'],
            [3,'#cc3736'],
          ]
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
    },this._view.beforeLayer);

  }

  //常发拥堵
  addAlJamLayer(){
    let sourceName = "carTraffic-2";
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;

    if(this._view.selected_only && dataSource === 0 && id === ''){
      this._view.isAllGlobal = true;
      this._view.$Message.info({
        content: '所选区域路段列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }else{
      this._view.isAllGlobal = !this._view.selected_only ? true : false;
    }

    let url = `${MYCONF.service.alJam}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&token=${token}&id=${id}`;
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      'source-layer': 'alJampLayer',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#eb0204",
        "line-width": 3
      },
      'filter':["<=","funcclass",maxKind]
    },this._view.beforeLayer);
  }

  // 添加全网流量图层
  addFullFlowLayer() {
    let sourceName = "carTraffic-3";
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    let hour = time.hour;    //转格式-08
    let bufferColor = this._view.buffer_color[sourceName];

    if(this._view.selected_only && dataSource === 0 && id == ''){
      this._view.$Message.info({
        content: '所选区域路段列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }

    let url = `${MYCONF.service.fullFlow}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&maxvol=${maxFlow}&minvol=0&token=${token}&id=${id}`;
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        // "line-color": {
        //   "type": "categorical",
        //   "property": "direction",
        //   "stops": [
        //     [1, '#ff0000'],
        //     [0, '#ffff00']
        //   ]
        // },
        "line-color": this._view.buffer_color[sourceName],
        "line-width": {
          "type": "interval",
          'property': 'linknetvol',
          'stops': datetimeHelper.setBufferRatio(this._view.buffer_width[sourceName])
        },
        // 单侧渲染，该参数设置为true，单侧方向为几何形状点顺序连线的右侧
        'half-render': true,
        //配合half-render,是否正向渲染,默认1是正向渲染，0的话就反向渲染(正向渲染是意味着道路通行方向的右侧，反向渲染意味着道路通行方向的左侧)
        'line-normal-direction': {
          "type": "categorical",
          "property": "direction",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': bufferColor=== '#FFFFFF'?0:1
      },
      filter: minFlow===0?[">", "linknetvol", minFlow]:[">=", "linknetvol", minFlow]
    },this._view.beforeLayer);
    env.map.addLayer({
      "id": `${sourceName}-symbol`,
      "type": "symbol",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "text-field": "{linknetvol}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "direction",
          "stops": [
            [1, [0.2,0.2]],
            [0, [1.2,1.2]]
          ]
        },
        "text-anchor": "top",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops":[
            [12,11],
            [14,12],
            [16,13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.buffer_color[sourceName],
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": bufferColor=== '#FFFFFF'?0:0.9,
        "text-halo-blur": 0.5,
      },
      filter: minFlow===0?[">", "linknetvol", minFlow]:[">=", "linknetvol", minFlow]
    });
    if(!this._view.flow_label_show){
      let t = setInterval(function() {
        if (env.map) {
          if(env.map.getLayer(`${sourceName}-symbol`)) {
            env.map.setLayoutProperty(`${sourceName}-symbol`,'visibility','none');
            env.map.setLayoutProperty(`carTraffic-3-background-symbol`,'visibility','none');
            clearInterval(t);
          }
        } else {
          clearInterval(t);
        }
      }, 200);
    }
  }

  //添加道路流量-背景流量
  addFlowBackgroundLayer(){
    let sourceName = "carTraffic-3-background";
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    // let url = `${MYCONF.service.fullFlow}?year=${time.year}&season=${time.season}&hour=32&datetag=${time.datetag}&dataSource=${dataSource}&maxvol=${maxFlow}&minvol=0&id=${id}&token=${token}`;
    let url = `${MYCONF.service.getRoadBackgroundVol}?maxvol=${maxFlow}&token=${token}`;
    let bufferColor = this._view.flow_background_color;
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        "line-color": this._view.flow_background_color,
        "line-width": {
          "type": "interval",
          'property': 'vol_base',
          'stops': datetimeHelper.setBufferRatio(this._view.buffer_width['carTraffic-3'])
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
        'line-opacity': bufferColor=== '#FFFFFF'?0:1
      },
      filter: minFlow===0?[">", "vol_base", minFlow]:[">=", "vol_base", minFlow]
    },this._view.beforeLayer);
    env.map.addLayer({
      "id": `${sourceName}-symbol`,
      "type": "symbol",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "text-field": "{vol_base}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "buffer_dir",
          "stops": [
            [1, [0.2,0.2]],
            [0, [1.2,1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops":[
            [12,11],
            [14,12],
            [16,13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.flow_background_color,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": bufferColor=== '#FFFFFF'?0:0.9,
        "text-halo-blur": 0.5,
      },
      filter: minFlow===0?[">", "vol_base", minFlow]:[">=", "vol_base", minFlow]
    });

    if(!this._view.flow_background_show){
      env.map.setLayoutProperty(`carTraffic-3-background`,'visibility','none');
      env.map.setLayoutProperty(`carTraffic-3-background-symbol`,'visibility','none');
    }
  }

  //添加溯流基础图层
  calcPreOrdinary(){
    let sourceName = "carTraffic-4";
    let time = this._view.panel_time;
    // let token = this._view.token;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    let hour = time.hour;    //转格式-08
    let source = this._view.source_type;
    let url = `${MYCONF.service.preOrdinary}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&linktag=${source}&dataSource=${dataSource}&maxvol=${maxFlow}&minvol=${minFlow}&token=${token}&id=${linkids}`;
    let _this = this;
    _this._view.updateGlobalLoading(true);
    this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then((res) => {
      res = res.body;
      _this._view.updateGlobalLoading(false);
      if (res.success) {
        let sToken = res.result.stoken;
        _this.addUpstreamBaseLayer(sToken);
        eventBus.$emit('preOrdinarySuccess',"base")
      }else{
        _this._view.$Message.warning({
          content:res.msg?res.msg: '道路溯源计算异常，请再次尝试',
          closable: true
        });
        eventBus.$emit('preOrdinaryFail',"base");
      }
    });
  }

  calcPreAdvanced(){
    let sourceName = "carTraffic-4";
    let time = this._view.panel_time;
    // let token = this._view.token;
    let token = sessionStorage.getItem("token");
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    let dataSource1 = this._view.map_click_disabled&&this._view.panel_v_type===1&&this._view.click_disabled_type==='A'? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0&&this._view.click_disabled_type==='A'?1: 0;
    let dataSource2 = this._view.map_click_disabled&&this._view.panel_v_type===1&&this._view.click_disabled_type==='B'? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0&&this._view.click_disabled_type==='B'?1: 0;
    let linkids1 = dataSource1===1?this._view.global_area.value:this._view.link_id_A.length>0 ? this._view.link_id_A.join(","):dataSource1===2?this._view.panel_village_id.join(","):'';
    let linkids2 = dataSource2===1?this._view.global_area.value:this._view.link_id_B.length>0 ? this._view.link_id_B.join(","):dataSource2===2?this._view.panel_village_id.join(","):'';

    let hour = time.hour;    //转格式-08
    let advanceA = this._view.advance_typeA;
    let advanceB = this._view.advance_typeB;

    let url = `${MYCONF.service.preAdvanced}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&linktag1=${advanceA}&dataSource1=${dataSource1}&linktag2=${advanceB}&dataSource2=${dataSource2}&maxvol=${maxFlow}&minvol=${minFlow}&token=${token}&id1=${linkids1}&id2=${linkids2}`;
    let _this = this;
    _this._view.updateGlobalLoading(true);
    this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then((res) => {
      res = res.body;
      _this._view.updateGlobalLoading(false);
      if (res.success) {
        let sToken = res.result.stoken;
        _this.addUpstreamAdvanceLayer(sToken);
        eventBus.$emit('preOrdinarySuccess',"advance");
      }else{
        _this._view.$Message.warning({
          content:res.msg?res.msg: '道路溯源计算异常，请再次尝试',
          closable: true
        });
        eventBus.$emit('preOrdinaryFail',"advance");
      }
    });
  }

  addUpstreamBaseLayer(stoken){
    let sourceName = "carTraffic-4";
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    let hour = time.hour;    //转格式-08
    let source = this._view.source_type;
    // let url = `${MYCONF.service.baseUpstream}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&linktag=${source}&dataSource=${dataSource}&maxvol=${maxFlow}&minvol=${minFlow}&id=${linkids}&token=${token}`;
    let url = `${MYCONF.service.baseUpstream}?stoken=${stoken}&token=${token}`;
    let bufferColor = this._view.buffer_color[sourceName];
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        // "line-color": '#cb178a',
        "line-color": this._view.buffer_color[sourceName],
        // "line-color": {
        //   "type": "categorical",
        //   "property": "direction",
        //   "stops": [
        //     [1, '#720000'],
        //     [0, '#c10c92']
        //   ]
        // },
        "line-width": {
          "type": "interval",
          'property': 'linknetvol',
          'stops': datetimeHelper.setBufferRatio(this._view.buffer_width[sourceName])
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "direction",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': bufferColor=== '#FFFFFF'?0:1,
      },
      filter: minFlow===0 ? [">", "linknetvol", minFlow]:[">=", "linknetvol", minFlow]
    },this._view.beforeLayer);
    env.map.addLayer({
      "id": `${sourceName}-symbol`,
      "type": "symbol",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "text-field": "{linknetvol}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "direction",
          "stops": [
            [1, [0.2,0.2]],
            [0, [1.2,1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops":[
            [12,11],
            [14,12],
            [16,13]
          ]
        },
        "text-keep-upright": true
      },
      "paint": {
        "text-color": bufferColor?bufferColor:'#333333',
        "text-opacity": bufferColor=== '#FFFFFF'?0:0.9,
      },
      filter: minFlow===0 ? [">", "linknetvol", minFlow]:[">=", "linknetvol", minFlow]
    });
    if(!this._view.flow_label_show){
      let t = setInterval(function() {
        if (env.map) {
          if(env.map.getLayer(`${sourceName}-symbol`)) {
            env.map.setLayoutProperty(`${sourceName}-symbol`,'visibility','none');
            clearInterval(t);
          }
        } else {
          clearInterval(t);
        }
      }, 200);
    }
    if(this._view.selected_only){
      let linkIds = this._view.link_id;
      let t = setInterval(function() {
        if (env.map) {
          if(env.map.getLayer(sourceName) && linkIds.length>0) {
            env.map.setFilter(sourceName, ["in", "linkid", ...linkIds]);
            env.map.setFilter(`${sourceName}-symbol`, ["in", "linkid", ...linkIds]);
            clearInterval(t);
          }
        } else {
          clearInterval(t);
        }
      }, 200);
    }
  }

  //添加溯源高级图层
  addUpstreamAdvanceLayer(stoken){
    let sourceName = "carTraffic-4";
    let time = this._view.panel_time;
    // let token = this._view.token;
    let token = sessionStorage.getItem("token");
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    let dataSource1 = this._view.map_click_disabled&&this._view.panel_v_type===1&&this._view.click_disabled_type==='A'? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0&&this._view.click_disabled_type==='A'?1: 0;
    let dataSource2 = this._view.map_click_disabled&&this._view.panel_v_type===1&&this._view.click_disabled_type==='B'? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0&&this._view.click_disabled_type==='B'?1: 0;
    let linkids1 = dataSource1===1?this._view.global_area.value:this._view.link_id_A.length>0 ? this._view.link_id_A.join(","):dataSource1===2?this._view.panel_village_id.join(","):'';
    let linkids2 = dataSource2===1?this._view.global_area.value:this._view.link_id_B.length>0 ? this._view.link_id_B.join(","):dataSource2===2?this._view.panel_village_id.join(","):'';
    let hour = time.hour;    //转格式-08
    let advanceA = this._view.advance_typeA;
    let advanceB = this._view.advance_typeB;

    // let url = `${MYCONF.service.advanceUpstream}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&linktag1=${advanceA}&dataSource1=${dataSource1}&id1=${linkids1}&linktag2=${advanceB}&dataSource2=${dataSource2}&id2=${linkids2}&maxvol=${maxFlow}&minvol=${minFlow}&token=${token}`;

    let url = `${MYCONF.service.baseUpstream}?stoken=${stoken}&token=${token}`;
    let bufferColor = this._view.buffer_color[sourceName];
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "butt"
      },
      "paint": {
        // "line-color": '#cb178a',
        "line-color": this._view.buffer_color[sourceName],
        "line-width": {
          "type": "interval",
          'property': 'linknetvol',
          'stops': datetimeHelper.setBufferRatio(this._view.buffer_width[sourceName])
        },
        'half-render': true,
        'line-normal-direction': {
          "type": "categorical",
          "property": "direction",
          "stops": [
            [1, true],
            [0, false]
          ]
        },
        'line-opacity': bufferColor=== '#FFFFFF'?0:1,
      }
    });
    env.map.addLayer({
      "id": `${sourceName}-symbol`,
      "type": "symbol",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "text-field": "{linknetvol}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "direction",
          "stops": [
            [1, [0.2,0.2]],
            [0, [1.2,1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops":[
            [12,11],
            [14,12],
            [16,13]
          ]
        },
        "text-keep-upright": true
      },
      "paint": {
        "text-color": bufferColor?bufferColor:'#333333',
        "text-opacity": bufferColor=== '#FFFFFF'?0:0.9,
      }
    },this._view.beforeLayer);
    if(!this._view.flow_label_show){
      let t = setInterval(function() {
        if (env.map) {
          if(env.map.getLayer(`${sourceName}-symbol`)) {
            env.map.setLayoutProperty(`${sourceName}-symbol`,'visibility','none');
            clearInterval(t);
          }
        } else {
          clearInterval(t);
        }
      }, 200);
    }
    let linkIds = [...this._view.link_id_A,...this._view.link_id_B];
    if(this._view.selected_only){
      let t = setInterval(function() {
        if (env.map) {
          if(env.map.getLayer(sourceName)) {
            env.map.setFilter(sourceName, ["in", "linkid", ...linkIds]);
            env.map.setFilter(`${sourceName}-symbol`, ["in", "linkid", ...linkIds]);
            clearInterval(t);
          }
        } else {
          clearInterval(t);
        }
      }, 200);
    }
  }

  //添加交叉口图层
  addCrossingLayer(){
    let sourceName = "carTraffic-5";
    let time = this._view.panel_time;
    let count = this._view.cross_icon;
    let panelTag = time.hour===31?1:2;
    let url = `${MYCONF.service.findRoadCorrosing}year=2018&timetag=&token=${sessionStorage.getItem("token")}`;

    let _this= this;
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if(res.success){
        let features = res.result.features;
        let sopBase = [
          [16, 0.65],
          [17, 1]
        ];
        let stopObj = count===0?{
          "stops":[
            [16, 0.65*(1-count/10)],
            [17, 1*(1-count/10)]
          ]
        }:count===1? {
          "stops":sopBase
        }:{
          "stops":[
            [16, 0.65*(1+count/10)],
            [17, 1*(1+count/10)]
          ]
        };
        if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
        if(env.map.getLayer(sourceName+'-symbol')) env.map.removeLayer(sourceName+'-symbol');
        if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
        env.map.addSource(sourceName, {
          type: "geojson",
          "data": {
            "type": "FeatureCollection",
            "features":features
          }
        });
        env.map.addLayer({
          "id": sourceName,
          "type": "symbol",
          "source": sourceName,
          "layout": {
            "icon-image": "{icon}",
            'icon-size': stopObj,
            "icon-allow-overlap": true,
            // "text-allow-overlap": false,
            "icon-ignore-placement":true,
            "icon-rotation-alignment":"map"
          },
          filter: ["==", "timetag", panelTag],
          "minzoom": 16
        },_this._view.beforeLayer);
        env.map.addLayer({
          "id": sourceName+'-symbol',
          "type": "symbol",
          "source": sourceName,
          "layout": {
            "icon-image": "cross",
            'icon-size': {
              "stops": [
                [12, 0.3],
                [13, 0.5],
                [14, 0.5],
                [15, 0.6],
                [16, 0.6],
              ],
            },
            "icon-allow-overlap": true,
            // "text-allow-overlap": false,
            "icon-ignore-placement":true,
          },
          filter: ["==", "timetag", panelTag],
          "maxzoom": 16
        },_this._view.beforeLayer);
      }
    })
  }

  //公交速度
  addBusSpeedLayer(){
    let sourceName = "cmnTraffic-1";
    let curZoom = env.map.getZoom();
    let maxKind = curZoom < 11 ?2:curZoom < 12 ?3:curZoom < 14 ?4:5;
    let param= {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      datetag: this._view.panel_time.datetag,
      dateType: this._view.bus_speed_type===0?'speed':'speedsub',
      dataSource: this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :
        this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0,
      trackId: this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)?
        this._view.cur_bus_line.value:'',
      id: this._view.selected_only && this._view.road_sel_type==='road'?
        (this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
        :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
          :this._view.link_id.length>0 ? this._view.link_id.join(",")
            : ''):'',
      filtertag: this._view.taz_only? 1:0
    };
    let url = MYCONF.service.busSpeed + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType(this._view.bus_speed_type===0?'公交运行速度':'小汽车-公交速度差');
    if(this._view.selected_only && param.dataSource === 0 && param.id === ''&& param.trackId===''){
      this._view.$Message.info({
        content: '所选区域路段列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
      //todo:只显示建成区公交速度：建成区以外过滤
    }else{
      this._view.isAllGlobal = !this._view.selected_only;
    }
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    if(this._view.bus_speed_type===0){
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'linkLayer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "los",
            "stops": [
              [1,'#2c8c7f'],
              [2,'#fbe019'],
              [3,'#d33027'],
            ]
          },
          "line-width": 2
        },
        // 'filter':['all',["<=","funcclass",maxKind],[">","los",0]]
      },this._view.beforeLayer);
    }else{
      env.map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        'source-layer': 'linkLayer',
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        'paint': {
          'line-color': {
            "type": "interval",
            "property": "speedsub",
            "stops": [
              [-50,'#2c7dbc'],
              [0,'#2c8c7f'],
              [8,'#fbe019'],
              [15,'#d33027'],
            ]
          },
          "line-width": 2
        },
        // 'filter':['all',["<=","funcclass",maxKind],[">","los",0]]
      },this._view.beforeLayer);
    }
    if(this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&this._view.cur_bus_line.value){
      MapCommonLayer.busLineCenter(this._view,this._view.cur_bus_line.value,false,false);
    }
  }

  //公交流量
  addBusFlowLayer() {
    let sourceName = "cmnTraffic-3";
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      datetag: this._view.panel_time.datetag,
      dataSource: this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2
        :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0,
      maxFlow: this._view.flow_range_max,
      minvol: this._view.flow_range_min,
      trackId: this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)?
        this._view.cur_bus_line.value:'',
      id: (this._view.selected_only && this._view.road_sel_type==='road')?linkids:'',
      filtertag: 0
    };
    let url = MYCONF.service.busFlow + '&' + MapCommonLayer.urlHandle(param);
    let bufferColor = this._view.buffer_color[sourceName];
    if(this._view.selected_only && param.dataSource === 0 && param.id === '' && param.trackId===''){
      this._view.isAllGlobal = true;
      this._view.$Message.info({
        content: '所选区域路段列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }else{
      this._view.isAllGlobal = !this._view.selected_only;
    }
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    if(env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer":"linkLayer",
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
        'line-opacity': bufferColor=== '#FFFFFF'?0:1
      },
      filter: [">=", "flow", this._view.flow_range_min]
    },this._view.beforeLayer);
    env.map.addLayer({
      "id": `${sourceName}-symbol`,
      "type": "symbol",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "text-field": "{flow}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "dir",
          "stops": [
            [1, [0,0]],
            [0, [1.2,1.2]]
          ]
        },
        "text-anchor": "bottom",
        "text-ignore-placement": true,
        "text-allow-overlap": false,
        "text-size": {
          "stops":[
            [12,11],
            [14,12],
            [16,13]
          ]
        },
        "text-keep-upright": false
      },
      "paint": {
        "text-color": this._view.buffer_color[sourceName],
        "text-opacity": bufferColor=== '#FFFFFF'?0:0.9,
      },
      filter: [">=", "flow", this._view.flow_range_min]
    });
    if(!this._view.flow_label_show){
      let t = setInterval(function() {
        if (env.map) {
          if(env.map.getLayer(`${sourceName}-symbol`)) {
            env.map.setLayoutProperty(`${sourceName}-symbol`,'visibility','none');
            clearInterval(t);
          }
        } else {
          clearInterval(t);
        }
      }, 200);
    }

    if(this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&this._view.cur_bus_line.value){
      MapCommonLayer.busLineCenter(this._view,this._view.cur_bus_line.value,false,false);
    }
  }

  //全方式OD热力图层
  addHeatmapLayer(){
    let sourceName = "personTrip-1";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      datetag: this._view.panel_time.datetag,
      maptype: 'circle',
      dataSource: (this._view.overAll && this._view.villageMethod === '全局'&&this._view.global_v_type === 0) ? 1: 0,
      odtype: this._view.travel_sel==='交通生成量'?'o':
        this._view.travel_sel==='交通吸引量'?'d':
          this._view.travel_sel==='生成吸引总量'?'a':
            this._view.travel_sel==='生成吸引比'?'r':'o',
      id: !this._view.overAll ? '':
        (this._view.villageMethod === '全局'&&this._view.global_v_type === 0)?this._view.global_area.value:
          this._view.village_id.length>0 ? this._view.village_id.join(","): ''
    };
    let url = MYCONF.service.heatMapOd + '?' + MapCommonLayer.urlHandle(param);
    // this._view.updateLayerLegendType('全方式od');
    this._view.updateLayerLegendType(this._view.travel_sel);
    if (this._view.display_mode === '仅小区') {
      if(env.echartLayer){
        env.echartLayer.remove();
        env.echartLayer = null;
      }
    }
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "heatmap",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "heatmap-radius": this._view.kernel_radius[sourceName],
        "heatmap-weight": {
          "property": "sum",
          "type": "interval",
          "stops": [
            [0, 0],
            [5, 0.1],
            [27, 0.2],
            [81, 0.3],
            [143, 0.4],
            [217, 0.5],
            [327, 0.6],
            [490, 0.1],
            [870, 1],
          ]
        },
        "heatmap-intensity": 1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, 'rgba(0,0,255,0)',
          0.1, '#2B83BA',
          0.2, '#80BFAC',
          0.3, '#C7E9AD',
          0.4, '#FFFFBF',
          0.5, '#FEC980',
          0.6, '#F0733F',
          1, '#cc0000',
        ],
        "heatmap-opacity": 0.5,
      }
    },this._view.beforeLayer);

    if(this._view.travel_sel === '交通生成量' || this._view.travel_sel === '交通吸引量' || this._view.travel_sel === '生成吸引总量'){
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "type": "interval",
        "property": "sum",
        'stops': [
          [0, 0],
          [24, 0.1],
          [128, 0.2],
          [382, 0.3],
          [672, 0.4],
          [1020, 0.5],
          [1538, 0.6],
          [2304, 1],
        ]
      })
    }
    if(this._view.travel_sel === '生成吸引总量'){
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "type": "interval",
        "property": "sum",
        'stops': [
          [0, 0],
          [48, 0.1],
          [256, 0.2],
          [764, 0.3],
          [1344, 0.4],
          [2040, 0.5],
          [3076, 0.6],
          [4608, 1],
        ]
      })
    }
    if(this._view.travel_sel === '生成吸引比'){
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "type": "interval",
        "property": "sum",
        'stops': [
          [0, 0],
          [0.12, 0.1],
          [0.8, 0.2],
          [1.2, 0.3],
          [2.58, 0.4],
          [3.67, 0.5],
          [5.25, 0.6],
          [7.5, 1],
        ]
      })
    }

  }

  //全方式OD栅格图层
  addGridLayer(){
    let sourceName = "personTrip-1";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      datetag: this._view.panel_time.datetag,
      maptype: 'grid',
      dataSource: (this._view.overAll && this._view.villageMethod === '全局'&&this._view.global_v_type === 0) ? 1: 0,
      odtype: this._view.travel_sel==='交通生成量'?'o':
        this._view.travel_sel==='交通吸引量'?'d':
          this._view.travel_sel==='生成吸引总量'?'a':
            this._view.travel_sel==='生成吸引比'?'r':'o',
      id: !this._view.overAll ? '':
        (this._view.villageMethod === '全局'&&this._view.global_v_type === 0)?this._view.global_area.value:
          this._view.village_id.length>0 ? this._view.village_id.join(","): ''
    };
    let url = MYCONF.service.heatMapOd + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType(this._view.travel_sel);
    // this._view.updateLayerLegendType('全方式od');
    if (this._view.display_mode === '仅小区') {
      if(env.echartLayer){
        env.echartLayer.remove();
        env.echartLayer = null;
      }
    }
    if(this._view.overAll && param.dataSource === 0 && param.id === '' && this._view.display_mode !== '仅期望线'){
      this._view.$Message.info({
        content: '所选区域小区列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });

    env.map.addLayer({
      "id": sourceName,
      "type": "fill",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      'paint': {
        'fill-color':{
          "property": "sum",
          "stops": [
            // [0, '#FFFFFF'],
            // [5, '#2B83BA'],
            // [27, '#80BFAC'],
            // [81, '#C7E9AD'],
            // [143, '#FFFFBF'],
            // [217, '#FEC980'],
            // [327, '#F17C4A'],
            // [490, '#cc0000'],
            // [870, '#cc0000'],
            [0, '#FFFFFF'],
            [12, '#2B83BA'],
            [64, '#80BFAC'],
            [191, '#C7E9AD'],
            [336, '#FFFFBF'],
            [510, '#FEC980'],
            [769, '#F17C4A'],
            [1152, '#cc0000'],
            [2046, '#cc0000'],
          ]
        },
        'fill-opacity': {
          "property": "sum",
          "stops": [
            [0, 0],
            [12, 0.8],
          ]
        }
      },
    },this._view.beforeLayer);

    if(this._view.travel_sel === '交通生成量' || this._view.travel_sel === '交通吸引量' || this._view.travel_sel === '生成吸引总量'){
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "sum",
        'stops': [
          // [0, 'rgba(255,255,255,0)'],
          // [5, '#2B83BA'],
          // [27, '#80BFAC'],
          // [81, '#C7E9AD'],
          // [143, '#FFFFBF'],
          // [217, '#FEC980'],
          // [327, '#F17C4A'],
          // [490, '#cc0000'],
          // [870, '#cc0000'],
          [0, 'rgba(255,255,255,0)'],
          [24, '#2B83BA'],
          [128, '#80BFAC'],
          [382, '#C7E9AD'],
          [672, '#FFFFBF'],
          [1020, '#FEC980'],
          [1538, '#F17C4A'],
          [2304, '#cc0000'],
          [4092, '#cc0000'],
        ]
      })
    }
    if(this._view.travel_sel === '生成吸引总量'){
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "sum",
        'stops': [
          // [0, 'rgba(255,255,255,0)'],
          // [10, '#2B83BA'],
          // [54, '#80BFAC'],
          // [162, '#C7E9AD'],
          // [287, '#FFFFBF'],
          // [435, '#FEC980'],
          // [654, '#F17C4A'],
          // [980, '#cc0000'],
          [0, 'rgba(255,255,255,0)'],
          [48, '#2B83BA'],
          [256, '#80BFAC'],
          [764, '#C7E9AD'],
          [1344, '#FFFFBF'],
          [2040, '#FEC980'],
          [3076, '#F17C4A'],
          [4608, '#cc0000'],
          [8184, '#cc0000'],
        ]
      })
    }
    if(this._view.travel_sel === '生成吸引比'){
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "sum",
        'stops': [
          [0, 'rgba(255,255,255,0)'],
          [0.12, '#cc0000'],
          [0.8, '#F17C4A'],
          [1.2, '#FEC980'],
          [2.58, '#FFFFBF'],
          [3.67, '#C7E9AD'],
          [5.25, '#80BFAC'],
          [7.5, '#2B83BA'],
        ]
      });
      env.map.setPaintProperty(sourceName, 'fill-opacity', {
        "property": "sum",
        'stops': [
          [0, 0],
          [0.12, 0.8],
        ]
      });
    }
  }

  //全方式OD期望线图层
  addAllMethodLine(){
    let _this = this;
    let sourceName = "personTrip-1";
    let colors = ['#2B83BA', '#80BFAC', '#C7E9AD', '#FFFFBF', '#FEC980', '#F17C4A', '#D7191C'];
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      datetag: this._view.panel_time.datetag,
      minvol: this._view.exp_min,
      maxvol: this._view.exp_max,
      odType: this._view.overAll ? this._view.distance_type : 'a',
      dataSource:(this._view.overAll&&this._view.villageMethod==='全局'&&this._view.global_v_type===0)?1: 0,
      id: !this._view.overAll ? '':
        (this._view.villageMethod === '全局'&&this._view.global_v_type === 0)?this._view.global_area.value:
          this._view.village_id.length>0 ? this._view.village_id.join(","): ''
    };
    if (this._view.display_mode === '仅期望线'){
      if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
      if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    }
    if(env.echartLayer){
      env.echartLayer.remove();
      env.echartLayer = null;
    }
    let url = MYCONF.service.odMapOd + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLineLayerLegend('全方式od');
    const loadFlaf = this._view.$Message.loading({
      content:'正在加载期望线，请稍等...',
      duration:0
    });
    Vue.http.get(url).then(response=>{
      if (response){
        setTimeout(loadFlaf, 20);
        let odvol = response.body.odvol,
            info = response.body.info,
            grid = response.body.grid,
            gridLon = 0,
            gridLat = 0,
            lineData = [],
            pointData = [];
        grid.map(item=>{
          gridLon += item.lon;
          gridLat += item.lat;
        });
        let gridCenter = [gridLon/grid.length, gridLat/grid.length];
        let centerPonit = [{
          name: '合并小区',
          value: gridCenter,
          symbolSize: 25,
          itemStyle:{"normal":{"color":grid.length>1?"#fcff35":"fff"}}
        }];
        odvol.map(item=>{
          let psg = item.psg;
          if(!_this._view.isMergeLine || param.id===''){
            lineData.push({
              name: item.o_gridtazid,
              count: psg,
              dest: item.d_gridtazid,
              coords: [[item.o_lon,item.o_lat],[item.d_lon,item.d_lat]],
              lineStyle:{
                normal: {width: function (psg) {
                    // return (psg * 0.1)*(_this._view.expWidth/5)}(psg),
                  return (psg * 0.025)*(_this._view.expWidth/5)}(psg),
                  opacity: function (psg) {
                    // return psg <= 10? 0.3:psg <= 20? 0.5:psg <= 30? 0.7:0.7}(psg), *2.048
                    return psg <= 40? 0.3:psg <= 80? 0.5:psg <= 120? 0.7:0.7}(psg),
                }
              }
            })
          }
          if(_this._view.isMergeLine && param.odType==='o'&& param.id!==''){
            if (_this._view.village_id.indexOf(item.d_gridtazid)===-1)
            lineData.push({
              name: item.o_gridtazid,
              count: psg,
              dest: item.d_gridtazid,
              coords: [gridCenter, [item.d_lon, item.d_lat]],
              lineStyle:{
                normal: {width: function (psg) {
                  // return (psg * 0.1)*(_this._view.expWidth/5)}(psg),
                  return (psg * 0.025)*(_this._view.expWidth/5)}(psg),
                  opacity: function (psg) {
                  // return psg <= 10? 0.3:psg <= 20? 0.5:psg <= 30? 0.7:0.7}(psg),
                    return psg <= 40? 0.3:psg <= 80? 0.5:psg <= 120? 0.7:0.7}(psg),
                }
              }
            })
          }
          if(_this._view.isMergeLine && param.odType==='d'&& param.id!==''){
            if (_this._view.village_id.indexOf(item.o_gridtazid)===-1){
              lineData.push({
                name: item.o_gridtazid,
                count: psg,
                dest: item.d_gridtazid,
                coords: [[item.o_lon, item.o_lat], gridCenter],
                lineStyle:{
                  normal: {width: function (psg) {
                      // return (psg * 0.1)*(_this._view.expWidth/5)}(psg),
                      return (psg * 0.025)*(_this._view.expWidth/5)}(psg),
                    opacity: function (psg) {
                      // return psg <= 10? 0.3:psg <= 20? 0.5:psg <= 30? 0.7:0.7}(psg),
                    return psg <= 40? 0.3:psg <= 80? 0.5:psg <= 120? 0.7:0.7}(psg),
                  }
                }
              })
            }
          }
          if(_this._view.isMergeLine && param.odType==='a'&& param.id!==''){
            if (!(_this._view.village_id.indexOf(item.o_gridtazid)!==-1&&_this._view.village_id.indexOf(item.d_gridtazid)!==-1)){
              if(_this._view.village_id.indexOf(item.o_gridtazid)===-1){
                lineData.push({
                  name: item.o_gridtazid,
                  count: psg,
                  dest: item.d_gridtazid,
                  coords: [[item.o_lon, item.o_lat], gridCenter],
                  lineStyle:{
                    normal: {width: function (psg) {
                        // return (psg * 0.1)*(_this._view.expWidth/5)}(psg),
                      return (psg * 0.025)*(_this._view.expWidth/5)}(psg),
                      opacity: function (psg) {
                        // return psg <= 10? 0.3:psg <= 20? 0.5:psg <= 30? 0.7:0.7}(psg),
                        return psg <= 40? 0.3:psg <= 80? 0.5:psg <= 120? 0.7:0.7}(psg),
                    }
                  }
                })
              }
              if(_this._view.village_id.indexOf(item.d_gridtazid)===-1){
                lineData.push({
                  name: item.o_gridtazid,
                  count: psg,
                  dest: item.d_gridtazid,
                  coords: [gridCenter, [item.d_lon, item.d_lat]],
                  lineStyle:{
                    normal: {width: function (psg) {
                        // return (psg * 0.1)*(_this._view.expWidth/5)}(psg),
                        return (psg * 0.025)*(_this._view.expWidth/5)}(psg),
                      opacity: function (psg) {
                        // return psg <= 10? 0.3:psg <= 20? 0.5:psg <= 30? 0.7:0.7}(psg),
                        return psg <= 40? 0.3:psg <= 80? 0.5:psg <= 120? 0.7:0.7}(psg),
                    }
                  }
                })
              }
            }
          }
        });
        info.map(item=>{
          if(!_this._view.isMergeLine){
            pointData.push({
              name: item.psg,
              value: item.value,
              // symbolSize: ((item.psg/20) + 4)*_this._view.whiteRadius.toFixed(2),
              symbolSize: ((item.psg/80) + 4)*_this._view.whiteRadius.toFixed(2),
              itemStyle:{"normal":{"color":"#fff"}}
            })
          }
          if(_this._view.isMergeLine){
            if(_this._view.village_id.indexOf(item.id)===-1){
              pointData.push({
                name: item.name,
                value: item.value,
                // symbolSize: ((item.psg/20) + 4)*_this._view.whiteRadius.toFixed(2),
                symbolSize: ((item.psg/80) + 4)*_this._view.whiteRadius.toFixed(2),
                // symbolSize: (item.psg/50) + 4,
                itemStyle:{"normal":{"color":"#fff"}}
              })
            }
          }
        });
        if(_this._view.isMergeLine) Array.prototype.push.apply(pointData,centerPonit);
        let getColor = function (param) {
          if (_this._view.colorSel === '彩色'){
            let index = param.data.count <= 32? 0:
              param.data.count <= 58? 1:
                param.data.count <= 94? 2:
                  param.data.count <= 148? 3:
                    param.data.count <= 242? 4:
                      param.data.count <= 414? 5:6;
            return colors[index];
          } else if(_this._view.colorSel === '单色'){
            return _this._view.colorChange
          }
        };
        let series = [
          {
            name: sourceName,
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 2,
            lineStyle: {
              normal: {
                color: getColor,
                width: 1,
                opacity: 0.7,
                curveness: 0.1
              }
            },
            // progressiveThreshold: 500,
            // progressive: 50,
            data: lineData
          },
          {
            name: '地点',
            type: 'effectScatter',
            coordinateSystem: 'GLMap',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke',
              period:10,
              scale:2
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
                shadowBlur: 20,
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            },
            data: pointData
          }
        ];
        let option = {
          GLMap: {
            roam: true
          },
          series: series
        };
        env.echartLayerOption = option;
        if(env.echartLayer){
          env.echartLayer.remove();
          env.echartLayer = null;
          env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
        }else{
          env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
        }
        env.echartLayer.chart.setOption(option);
        env.echartLayer.chart.resize({
          width: env.cWidth,
          height: env.cHeight
        });
      }
    })
  }

  //分时动态人口热力
  addDynHeatmapLayer(hour){
    let sourceName = "personTrip-2";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: hour ? hour : this._view.panel_time.hour,
      dateTag: this._view.panel_time.datetag,
      maptype: 'circle',
      dataSources: (this._view.overAll_2 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      gridIds: !this._view.overAll_2 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? '':
          this._view.village_id.length>0 ? this._view.village_id.join(","): '',
      tazIds: !this._view.overAll_2 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? this._view.global_area.value : '',
    };
    let url = MYCONF.service.dynMap + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType('分时动态人口');
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "heatmap",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "paint": {
        "heatmap-radius": this._view.kernel_radius[sourceName],
        "heatmap-weight": {
          "property": "num",
          "type": "interval",
          "stops": [
            // [0, 0],
            // [44, 0.1],
            // [154, 0.2],
            // [461, 0.3],
            // [849, 0.4],
            // [1470, 0.5],
            // [2489, 0.6],
            // [3649, 1],
            [0, 0],
            [220, 0.1],
            [770, 0.2],
            [2305, 0.3],
            [4245, 0.4],
            [7350, 0.5],
            [12445, 0.6],
            [18245, 1],
          ]
        },
        "heatmap-intensity": 1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, 'rgba(0,0,255,0)',
          0.1, '#2B83BA',
          0.2, '#80BFAC',
          0.3, '#C7E9AD',
          0.4, '#FFFFBF',
          0.5, '#FEC980',
          0.6, '#F0733F',
          1, '#cc0000',
        ],
        "heatmap-opacity": 0.5,
      }
    },this._view.beforeLayer)
  }

  //分时动态人口栅格
  addDynGridmapLayer(hour) {
    let sourceName = "personTrip-2";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: hour ? hour : this._view.panel_time.hour,
      dateTag: this._view.panel_time.datetag,
      maptype: 'grid',
      dataSources: (this._view.overAll_2 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      gridIds: !this._view.overAll_2 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? '':
          this._view.village_id.length>0 ? this._view.village_id.join(","): '',
      tazIds: !this._view.overAll_2 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? this._view.global_area.value : '',
    };
    let url = MYCONF.service.dynMap + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType('分时动态人口');
    if(this._view.overAll_2 && this._view.villageMethod==='自定义' && param.gridIds===''){
      this._view.$Message.info({
        content: '所选区域小区列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "fill",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      'paint': {
        'fill-color':{
          "property": "num",
          "stops": [
            // [0, 'rgba(255,255,255,0)'],
            // [44, '#2B83BA'],
            // [154, '#80BFAC'],
            // [461, '#C7E9AD'],
            // [849, '#FFFFBF'],
            // [1470, '#FEC980'],
            // [2489, '#F0733F'],
            // [3649, '#cc0000'],
            [0, 'rgba(255,255,255,0)'],
            [220, '#2B83BA'],
            [770, '#80BFAC'],
            [2305, '#C7E9AD'],
            [4245, '#FFFFBF'],
            [7350, '#FEC980'],
            [12445, '#F0733F'],
            [18245, '#cc0000'],
          ]
        },
        'fill-opacity':
          {
          "property": "num",
          "stops": [
            [0, 0],
            [220, 0.8],
          ]
        },
      },
    },this._view.beforeLayer)
    // env.map.on('click', function (e) {
    //   let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: [sourceName]});
    //   if (!features.length) {
    //     return;
    //   }
    //   let feature = features[0];
    //   console.log(features);
    // });
  }

  //出行特征热力
  addTravelHeatmapLayer(){
    let sourceName = "personTrip-3";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      dateTag: this._view.panel_time.datetag,
      dataType: this._view.traver_analy,
      maptype: 'circle',
      dataSources: (this._view.overAll_3 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      gridIds: !this._view.overAll_3 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? '':
          this._view.village_id.length>0 ? this._view.village_id.join(","): '',
      tazIds: !this._view.overAll_3 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? this._view.global_area.value : '',
    };
    let url = MYCONF.service.travelMap + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType(this._view.traver_analy===0? '平均出行距离':'平均出行时间');
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "heatmap",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "heatmap-radius": this._view.kernel_radius[sourceName],
        "heatmap-weight": {
          "property": "num",
          "type": "interval",
          "stops": [
            [0,0],
            [0.6,0.1],
            [2,0.2],
            [2.7,0.3],
            [3.6,0.4],
            [4.8,0.5],
            [6.7,0.6],
            [9.8,1],
          ]
        },
        "heatmap-intensity": 1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, 'rgba(0, 0, 255, 0)',
          0.1, '#2B83BA',
          0.2, '#80BFAC',
          0.3, '#C7E9AD',
          0.4, '#FFFFBF',
          0.5, '#FEC980',
          0.6, '#F17C4A',
          1, '#cc0000',
        ],
        "heatmap-opacity": 0.5,
      }
    },this._view.beforeLayer);

    if (this._view.traver_analy === 0){
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "property": "num",
        "type": "interval",
        'stops': [
          [0,0],
          [0.6,0.1],
          [2,0.2],
          [2.7,0.3],
          [3.6,0.4],
          [4.8,0.5],
          [6.7,0.6],
          [9.8,1],
        ]
      })
    }else {
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "property": "num",
        "type": "interval",
        'stops': [
          [0,0],
          [11,0.1],
          [50,0.2],
          [61,0.3],
          [72,0.4],
          [86,0.5],
          [105,0.6],
          [134,1],
        ]
      })
    }
  }

  //出行特征栅格
  addTravelGridmapLayer(){
    let sourceName = "personTrip-3";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      dateTag: this._view.panel_time.datetag,
      dataType: this._view.traver_analy,
      maptype: 'grid',
      dataSources: (this._view.overAll_3 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      gridIds: !this._view.overAll_3 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? '':
          this._view.village_id.length>0 ? this._view.village_id.join(","): '',
      tazIds: !this._view.overAll_3 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? this._view.global_area.value : '',
    };
    let url = MYCONF.service.travelMap + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType(this._view.traver_analy===0? '平均出行距离':'平均出行时间');
    if(this._view.overAll_3 && this._view.villageMethod==='自定义' && param.gridIds===''){
      this._view.$Message.info({
        content: '所选区域小区列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "fill",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      'paint': {
        'fill-color':{
          "property": "num",
          "stops": [
            [0, 'rgba(255,255,255,0)'],
            [0.6, '#2B83BA'],
            [2, '#80BFAC'],
            [2.7, '#C7E9AD'],
            [3.6, '#FFFFBF'],
            [4.8, '#FEC980'],
            [6.6, '#F17C4A'],
            [9.8, '#cc0000'],
          ]
        },
        'fill-opacity': {
          "property": "num",
          "stops": [
            [0, 0.8],
            [3, 0.8],
            [40000, 0.8],
          ]
        },
      },
    },this._view.beforeLayer);

    if (this._view.traver_analy === 0){
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "num",
        'stops': [
          [0, 'rgba(255,255,255,0)'],
          [0.6, '#2B83BA'],
          [2, '#80BFAC'],
          [2.7, '#C7E9AD'],
          [3.6, '#FFFFBF'],
          [4.8, '#FEC980'],
          [6.7, '#F17C4A'],
          [9.8, '#cc0000'],
        ]
      })
    }else {
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "num",
        'stops': [
          [0, 'rgba(255,255,255,0)'],
          [11, '#2B83BA'],
          [50, '#80BFAC'],
          [61, '#C7E9AD'],
          [72, '#FFFFBF'],
          [86, '#FEC980'],
          [105, '#F17C4A'],
          [134, '#cc0000'],
        ]
      })
    }
  }

  //职住平衡热力
  addResidenceHeatmapLayer(){
    let sourceName = "personTrip-4";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      dateTag: this._view.panel_time.datetag,
      maptype: 'circle',
      dataType: this._view.residence_list,
      dataSources: (this._view.overAll_4 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      gridIds: !this._view.overAll_4 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? '':
          this._view.village_id.length>0 ? this._view.village_id.join(","): '',
      tazIds: !this._view.overAll_4 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? this._view.global_area.value : '',
    };
    let url = MYCONF.service.zzpeaMap + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType(this._view.residence_list===0? '职住比':this._view.residence_list===1?'居住人口':'就职人口');
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName, {
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "heatmap",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      "paint": {
        "heatmap-radius": this._view.kernel_radius[sourceName],
        "heatmap-weight": {
          "property": "num",
          "type": "interval",
          "stops": [
            [0, 0],
            [10, 0.1],
            [183, 0.2],
            [550, 0.3],
            [1008, 0.4],
            [1713, 0.5],
            [2619, 0.6],
            [3956, 1],
          ]
        },
        "heatmap-intensity": 1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0, 'rgba(0, 0, 255, 0)',
          0.1, '#2B83BA',
          0.2, '#80BFAC',
          0.3, '#C7E9AD',
          0.4, '#FFFFBF',
          0.5, '#FEC980',
          0.6, '#F17C4A',
          1, '#cc0000',
        ],
        "heatmap-opacity": 0.5,
      }
    },this._view.beforeLayer);

    if(this._view.residence_list === 1){  //居住人口
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "property": "num",
        'stops': [
          [0, 0],
          [10, 0.1],
          [833, 0.2],
          [2503, 0.3],
          [4586, 0.4],
          [7794, 0.5],
          [11916, 0.6],
          [18000, 1],
        ]
      })
    }else if(this._view.residence_list === 2){  //就职人口
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "property": "num",
        'stops': [
          [0, 0],
          [3, 0.1],
          [354, 0.2],
          [1038, 0.3],
          [1855, 0.4],
          [2973, 0.5],
          [4389, 0.6],
          [7151, 1],
        ]
      })
    }else if(this._view.residence_list === 0){   //职住比
      env.map.setPaintProperty(sourceName, 'heatmap-weight', {
        "property": "num",
        'stops': [
          [0,0.1],
          [0.47,0.2],
          [0.9,0.3],
          [1.1,0.4],
          [1.59,0.5],
          [2.36,0.6],
          [3.91, 1],
        ]
      });
    }
  }

  //职住平衡栅格
  addResidenceGridmapLayer(){
    let sourceName = "personTrip-4";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      dateTag: this._view.panel_time.datetag,
      maptype: 'grid',
      dataType: this._view.residence_list,
      dataSources: (this._view.overAll_4 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      gridIds: !this._view.overAll_4 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? '':
          this._view.village_id.length>0 ? this._view.village_id.join(","): '',
      tazIds: !this._view.overAll_4 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)? this._view.global_area.value : '',
    };
    let url = MYCONF.service.zzpeaMap + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLayerLegendType(this._view.residence_list===0? '职住比':this._view.residence_list===1?'居住人口':'就职人口');
    if(this._view.overAll_4 && this._view.villageMethod==='自定义' && param.gridIds===''){
      this._view.$Message.info({
        content: '所选区域小区列表为空，这里忽略所选区域,显示全市范围',
        closable: true,
        duration:3
      });
    }
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "fill",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      'paint': {
        'fill-color':{
          "property": "num",
          "stops": [
            [0, 'rgba(255,255,255,0)'],
            [10, '#2B83BA'],
            [833, '#80BFAC'],
            [2503, '#C7E9AD'],
            [4586, '#FFFFBF'],
            [7794, '#FEC980'],
            [11916, '#F17C4A'],
            [18000, '#cc0000'],
          ]
        },
        'fill-opacity': {
          "property": "num",
          "stops": [
            [0, 0],
            [5, 0.8],
          ]
        },
      },
    },this._view.beforeLayer);

    if(this._view.residence_list === 1){  //居住人口
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "num",
        'stops': [
          [0, 'rgba(255,255,255,0)'],
          [10, '#2B83BA'],
          [833, '#80BFAC'],
          [2503, '#C7E9AD'],
          [4586, '#FFFFBF'],
          [7794, '#FEC980'],
          [11916, '#F17C4A'],
          [18000, '#cc0000'],
        ]
      })
    }else if(this._view.residence_list === 2){  //就职人口
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "num",
        'stops': [
          [0, 'rgba(255,255,255,0)'],
          [3, '#2B83BA'],
          [354, '#80BFAC'],
          [1038, '#C7E9AD'],
          [1855, '#FFFFBF'],
          [2973, '#FEC980'],
          [4389, '#F17C4A'],
          [7151, '#cc0000'],
        ]
      })
    }else if(this._view.residence_list === 0){   //职住比
      env.map.setPaintProperty(sourceName, 'fill-color', {
        "property": "num",
        'stops': [
          [0, '#2B83BA'],
          [0.47, '#80BFAC'],
          [0.9, '#C7E9AD'],
          [1.1, '#FFFFBF'],
          [1.59, '#FEC980'],
          [2.36, '#F17C4A'],
          [3.91, '#D7191C'],
        ]
      });
      env.map.setPaintProperty(sourceName, 'fill-opacity', {
        "property": "num",
        'stops': [
          // [0, 0],
          [0, 0.8],
        ]
      })
    }
  }

  //建成区OD栅格
  addBuiltGridLayer(){
    let sourceName = "personTrip-5";
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      dateTag: this._view.panel_time.datetag,
      dataType: this._view.adminOption==='区县OD分析'? 1 : 0,
      gridType: this._view.travel_sel === '交通生成量'? 'o':
        this._view.travel_sel === '交通吸引量'? 'd':
          this._view.travel_sel === '生成吸引总量'?'a':
            this._view.travel_sel === '生成吸引比'?'r':
              this._view.travel_sel === '内部交通量'?'in':'a',
      id: !this._view.overAll_5 ? '':
        this._view.adminOption === '区县OD分析'?
          (this._view.adminArea_sel ? MapCommonLayer.setNameToAdminId(this._view.adminArea_sel) : ''):
          (this._view.buildArea_sel ? MapCommonLayer.setNameToTazId(this._view.buildArea_sel) : ''),
    };
    let url = MYCONF.service.buildOdMap + '?' + MapCommonLayer.urlHandle(param);
    // this._view.updateLayerLegendType('建成区od');
    if (this._view.display_mode_build === '仅小区') {
      if(env.echartLayer){
        env.echartLayer.remove();
        env.echartLayer = null;
      }
    }
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    env.map.addLayer({
      "id": sourceName,
      "type": "fill",
      "source": sourceName,
      "source-layer":"heatMapLayer",
      "layout": {
        "visibility": "visible"
      },
      'paint': {
        'fill-color':{
          "property": "tazcolor",
          "stops": [
            [0, '#FFFFFF'],
            [1, '#2B83BA'],
            [5, '#80BFAC'],
            [10, '#C7E9AD'],
            [30, '#FFFFBF'],
            [50, '#FEC980'],
            [100, '#F17C4A'],
            [40000, '#cc3e31'],
          ]
        },
        'fill-opacity': {
          "property": "sum",
          "stops": [
            [0, 0],
            [1, 0.3],
            [5, 0.3],
            [10, 0.3],
            [30, 0.4],
            [50, 0.7],
            [100, 0.8],
            [40000, 0.9],
          ]
        },
      },
    },this._view.beforeLayer)
  }

  //建成区OD期望线
  addBuiltOdLayer(){
    let sourceName = "personTrip-5";
    let colors = ['#2B83BA', '#80BFAC', '#C7E9AD', '#FFFFBF', '#FEC980', '#F17C4A', '#D7191C'];
    let _this = this;
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      dateTag: this._view.panel_time.datetag,
      odType: this._view.overAll_5?this._view.distance_type:'a',
      dataType: this._view.adminOption==='区县OD分析'?1:0,
      id: !this._view.overAll_5?'':this._view.adminOption==='区县OD分析'?
        (this._view.adminArea_sel? MapCommonLayer.setNameToAdminId(this._view.adminArea_sel): ''):
        (this._view.buildArea_sel? MapCommonLayer.setNameToTazId(this._view.buildArea_sel): '')
    };
    let url = MYCONF.service.buildExpMap + '?' + MapCommonLayer.urlHandle(param);
    this._view.updateLineLayerLegend('建成区od');
    if (this._view.display_mode_build === '仅期望线'){
      if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
      if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    }
    if(env.echartLayer){
      env.echartLayer.remove();
      env.echartLayer = null;
    }
    Vue.http.get(url).then(response => {
      let res = response.body.odvol;
      let info = response.body.info;
      MapCommonLayer.odSetOption(res, info);
      let lineData  = [], pointData = [];
      res.map(item=> {
        const psg = parseInt(item.psg);
        lineData.push({
          name: item.o_taz1id,
          count: psg,
          dest: item.d_taz1id,
          coords: [[parseFloat(item.o_lon), parseFloat(item.o_lat)], [parseFloat(item.d_lon), parseFloat(item.d_lat)]],
          lineStyle:{
            normal: {
              width: function (psg) {
                return Math.sqrt(psg * 0.1)*(_this._view.adminExpWidth /7);
              }(psg),
              opacity: function (psg) {
                let temp;
                temp = psg<=10? 0.5: psg<=20? 0.6: psg<= 30? 0.7: 0.8;
                return temp
              }(psg),
            }
          }
        });
      });
      info.map(item=> {
        let psg = Math.sqrt(item.psg);
        pointData.push({
          name: item.name,
          value: item.value,
          symbolSize: (psg/60) * _this._view.adminWhiteRadius,
          itemStyle:{"normal":{"color":"rgb(255,255,255,1)"}}
        })
      });
      let getColor = function (param) {
        if (_this._view.colorSel === '彩色'){
          let index = param.data.count <= 8? 0:param.data.count <= 14? 1:param.data.count <= 23? 2:param.data.count <= 36? 3:param.data.count <= 59? 4:param.data.count <= 101? 5:6;
          return colors[index];
        } else if(_this._view.colorSel === '单色'){
          return _this._view.colorChange
        }
      };
      const series = [
        {
        name: sourceName,
        type: 'lines',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        lineStyle: {
          normal: {
            color: getColor,
            width: 1,
            opacity: 0.7,
            curveness: 0.1
          }
        },
        data: lineData
      }, {
        name: '地点',
        type: 'effectScatter',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke',
          period:10,
          scale:2
        },
        label: {
          emphasis: {
            show: true,
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
            shadowBlur: 20,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        data: pointData
      }
      ];
      let option = {
        GLMap: {
          roam: true
        },
        series: series
      };
      env.adminOdLayerOption = option;
      if(env.echartLayer){
        env.echartLayer.remove();
        env.echartLayer = null;
        env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
      }else{
        env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
      }
      env.echartLayer.chart.setOption(option);
      env.echartLayer.chart.resize({
        width: env.cWidth,
        height: env.cHeight
      });
    })
  }
}

