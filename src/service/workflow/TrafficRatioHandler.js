import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import datetimeHelper from "../../util/datetime-helper";
import MapCommonLayer from "../map/mapCommonLayer";

export default class stepPanelHandler_3 {
  constructor(_view) {
    this._view = _view;
  }

  roadTrafficDistributed(){
    let _this = this;
    let curProId = this._view.cur_pro_id;
    let url= MYCONF.service.roadConfim + `projectid=${curProId}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url).then(res=>{
      res = res.body.result;
      let road_count = res.road_count;
      let unpredict = res.road_edited_unpredict + res.road_new_unpredict;
      if (road_count===0){
        _this._view.$Message.warning({
          content: '请先进行道路规划',
          duration:2,
          closable: true
        });
      }else if(road_count===unpredict){
        this.setTripVolume()
      }else if(unpredict===0){
        //todo 这里应该改为第一次计算结果存储
        this.setTripVolume()
        // this._view.$http.get(`http://172.21.12.223:8001/putianService/trafficEvaluateService/queryEffectRoadsPsgAndCoefficients?projectid=${curProId}&token=${sessionStorage.getItem("token")}`).then(res=>{
        //   _this.setTraceability();
        //   _this.setBackgroundTrace();
        // })

      }else if(unpredict!==0){
        let url = MYCONF.service.deleteRoadTrafficDis + `projectid=${curProId}&token=${sessionStorage.getItem("token")}`;
        this._view.$http.get(url).then((res) => {
          _this.setTripVolume()
        })
      }
    });
  }

  //交通量出行量
  setTripVolume(){
    let _this = this;
    let curProId = this._view.cur_pro_id;
    let roadTrafficModules = this._view.roadTrafficModules;
    let searchRadius = this._view.searchRadius;
    let daily = roadTrafficModules.daily + '';
    let earlyPeak = roadTrafficModules.earlyPeak + '';
    let latePeak = roadTrafficModules.latePeak + '';
    let url = MYCONF.service.getRoadTrafficDis + `projectid=${curProId}&token=${sessionStorage.getItem("token")}&radius=${searchRadius}&coefficient_a=${daily}&coefficient_m=${earlyPeak}&coefficient_n=${latePeak}&year=${'2018'}&season=${'2'}&datetag=${'1'}`;
    this._view.updateGlobalLoading(true);
    this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then((res) => {
      if(res.status === 200){
        _this._view.updateGlobalLoading(false);
        let data = res.body;
        _this._view.updateRoadTrafficDis({
          daily: parseFloat(data.psg_a).toFixed(1),
          earlyPeak: parseFloat(data.psg_m_perh).toFixed(1),
          latePeak: parseFloat(data.psg_n_perh).toFixed(1)
        });
        _this.setTraceability();
        _this.setBackgroundTrace();
      }else{
        _this._view.updateGlobalLoading(false);
        _this._view.$Message.warning({
          content: '道路相关交通分布信息获取失败',
          duration:2,
          closable: true
        });
      }
    });
  }

  //规划道路流量
  setTraceability(){
    let sourceName = 'traceability';
    let minvol = this._view.landFlowMin;
    let color = this._view.landPlanColor;
    let param={
      token: sessionStorage.getItem("token"),
      projectid: this._view.cur_pro_id,
      hour: this._view.timeRange==='早高峰'?'31':'32',
      maxvol: this._view.landFlowMax,
      minvol: this._view.landFlowMin
    };
    // let url = MYCONF.service.setTrace + `?projectid=${curProId}&token=${sessionStorage.getItem("token")}&hour=${hour}&maxvol=${maxvol}&minvol=0`;
    let url = MYCONF.service.queryEffectRoadsPBFWhenGetInS3 + '?' + MapCommonLayer.urlHandle(param);

    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
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
        "line-color": color,
        "line-width": {
          "type": "interval",
          'property': 'vro',
          'stops': datetimeHelper.setBufferRatio(this._view.landFlowWidth) //datetimeHelper.roadBufferRange(this._view.landFlowWidth)
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
        'line-opacity': color==='#FFFFFF'?0:1
      },
      'filter':[">=","vro",minvol]
    });
    if(env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
    env.map.addLayer({
      "id": `${sourceName}-symbol`,
      "type": "symbol",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "text-field": "{vro}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "buffer_dir",
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
        "text-color": this._view.landPlanColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": color=== '#FFFFFF'?0:0.9,
        "text-halo-blur": 0.5,
      },
      filter: [">=", "vro", minvol]
    });
    if (!this._view.isFlowRemakeShow) {
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

    env.map.on('click', function (e) {
      let features = env.map.queryRenderedFeatures([[e.point.x - 2, e.point.y - 2], [e.point.x + 2, e.point.y + 2]], {layers: ['traceability']});
      // let feature = features[0];
      console.log(features);
    })
  }

  //背景流量
  setBackgroundTrace(){
    let sourceName = 'backTraceability';
    let curProId = this._view.cur_pro_id;
    let hour = this._view.timeRange==='早高峰'?'31':'32';
    let maxvol = this._view.landFlowMax;
    let minvol = this._view.landFlowMin;
    let color = this._view.backgroundPlanColor;
    let url = MYCONF.service.backgroundTrace + `?projectid=${curProId}&token=${sessionStorage.getItem("token")}&hour=${hour}&maxvol=${maxvol}`;
    if(env.map.getSource(sourceName)) env.map.removeSource(sourceName);
    env.map.addSource(sourceName,{
      type: "vector",
      tiles: [url]
    });
    if(env.map.getLayer(sourceName)) env.map.removeLayer(sourceName);
    env.map.addLayer({
      "id": sourceName,
      "type": "line",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "line-join": "round",
        "line-cap": "butt",
        "visibility":this._view.isBackgroundFlowShow ? 'visible':'none',
      },
      "paint": {
        "line-color": color,
        "line-width": {
          "type": "interval",
          'property': 'vol_base',
          'stops': datetimeHelper.setBufferRatio(this._view.landBackgroundWidth) // datetimeHelper.roadBufferRange(this._view.landBackgroundWidth)
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
        'line-opacity': color=== '#FFFFFF'?0:1,
      },
      'filter':[">","vol_base",0]
    },'traceability');
    if(env.map.getLayer(`${sourceName}-symbol`)) env.map.removeLayer(`${sourceName}-symbol`);
    env.map.addLayer({
      "id": `${sourceName}-symbol`,
      "type": "symbol",
      "source": sourceName,
      "source-layer":"linkLayer",
      "layout": {
        "visibility":this._view.isBackgroundFlowShow ? 'visible':'none',
        "text-field": "{vol_base}",
        "symbol-placement": "line",
        "text-offset": {
          "type": "categorical",
          "property": "buffer_dir",
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
        "text-color": this._view.backgroundPlanColor,
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": color=== '#FFFFFF'?0:0.9,
        "text-halo-blur": 0.5,
      },
      filter: [">", "vol_base", 0]
    },'traceability-symbol');
    if (!this._view.isFlowRemakeShow) {
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
  }

  deleteRoadTrafficRecording(){
    let curProId = this._view.cur_pro_id;
    let url = MYCONF.service.deleteRoadTrafficDis + `projectid=${curProId}&token=${sessionStorage.getItem("token")}`;
    let url1= MYCONF.service.roadConfim + `projectid=${curProId}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url1).then((res) => {
      res = res.body.result;

    })
  }

  stopDiagramRequest(){
    let curRequest = this._view.curRequest;
    let _this = this;
    if (curRequest) {
      //TODO:中止请求
      curRequest.abort();
      this._view.$Message.warning({
        content: '已成功中止该请求',
        duration:3,
        closable: true
      });
      setTimeout(() => {
        _this._view.updateGlobalLoading(false);
      },200)
    }
  }

  getTripsList(){
    let param ={
      token: sessionStorage.getItem("token"),
      projectid: this._view.cur_pro_id
    };
    let url = MYCONF.service.queryEffectRoadsPsgWhenGetInS3 + '?' + MapCommonLayer.urlHandle(param);
    this._view.$http.get(url).then(res=>{
      res = res.body;
      if (res.success){
        this._view.updateRoadTrafficDis({
          daily: res.result&&res.result.psg_a_weighting ? parseFloat(res.result.psg_a_weighting).toFixed(1):0,
          earlyPeak: res.result&&res.result.psg_m_weighting ? parseFloat(res.result.psg_m_weighting).toFixed(1):0,
          latePeak: res.result&&res.result.psg_n_weighting ? parseFloat(res.result.psg_n_weighting).toFixed(1):0
        });
        this.setTraceability();
        this.setBackgroundTrace();
      }

    })
  }
}
