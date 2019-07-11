/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";

export default class workProjectHandler {
  constructor(_view) {
    this._view = _view;
  }

  saveProjectFun(data) {
    let curId = this._view.cur_pro_id;
    let url = MYCONF.service.saveProject + `token=${sessionStorage.getItem("token")}&editType=update`;
    this._view.$http.post(url, {
        id:curId,
        name: data,
      },
      {
        'header': {
          'Content-Type': "application/json"
        }
      }).then((res) => {
      res = res.body;
      this._view.updateCurProject({id:res.result.id});
    });
  }

  getProjectInfo(){
    let proId = sessionStorage.getItem("projectid");
    let curProId = proId ? proId : this._view.cur_pro_id;
    let _this = this;
    let url = MYCONF.service.findProject + `token=${sessionStorage.getItem("token")}&projectID=${curProId}`;
    this._view.$http.get(url).then((res) => {
      if(res.body.success){
        let data = res.body.result;
        _this._view.updateCurProject({
          id:data.id,
          landnum:data.landnum,
          landarea:data.landarea?(data.landarea/1000000).toFixed(2):0,
          roadnum:data.roadnum,
          roadlength:data.roadlength,
          name:data.name,
        });
        _this._view.caseTitle = data.name;
      }else{
        _this._view.$Message.warning({
          content: '地块汇总信息获取失败',
          duration:2,
          closable: true
        });
      }
    });
  }

  changeDisplay(data){
    switch (data.id) {
      case 1:

      case 2:
        this.step2Visible(data.content);
        break;
      case 3:
        this.step3Visible(data.content);
        break;
      case 4:
        this.step4Visible(data.content);
        break;
      case 5:
        this.step5Visible(data.content);
        break;
      case 6:
        this.step6Visible(data.content);
        break;
    }
  }

  step2Visible(data){
    const map = env.map;
    let layerList = ['roadLineLayerAll','roadLineLayerLable'];
    let attrBool = data ?  'visible':'none';
    if (map) {
      layerList.map((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', attrBool);
        }
      });
    }
  }

  step3Visible(data){
    const map = env.map;
    // ['traceability', 'traceability-symbol','backTraceability','backTraceability-symbol','roadLinePaint']
    let layerList = ['traceability','traceability-symbol'];
    if (this._view.isBackgroundFlowShow) layerList.push('backTraceability');
    if (this._view.isFlowRemakeShow) layerList.push('traceability-symbol');
    if (this._view.isBackgroundFlowShow&&this._view.isFlowRemakeShow) layerList.push('backTraceability-symbol');
    if (this._view.isLandPlanShow) layerList.push('roadLinePaint');
    let attrBool = data ?  'visible':'none';
    if (map) {
      layerList.map((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', attrBool);
        }
      });
    }
  }

  step4Visible(data){
    // let editData = env.edit.draw.getAll();
    // console.log("+++++++++++++++++++++++++++++");
    // console.log(env.landOdLayerOption);
    // console.log(env.projectOdLayerOption);
    if(data){
      // env.edit.draw.add(editData);
      if(env.projectOdLayerOption || env.landOdLayerOption){
        env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
        let option = env.projectOdLayerOption ? env.projectOdLayerOption : env.landOdLayerOption;
        env.echartLayer.chart.setOption(option);
      }
    }else{
      //env.edit.draw.deleteAll();
      if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
    }

    const map = env.map;
    let layerList = ['polygonLayer', 'landLine', 'landCenterLayer', 'landNameAll','entryLine'];
    let attrBool = data ?  'visible':'none';
    if (map) {
      layerList.map((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', attrBool);
        }
      });
    }

  }

  step5Visible(data){
    const map = env.map;
    let layerList = ['entryLayerAll','roadLinePaint','entryLineAll','entryPointAll'];
    let attrBool = data ?  'visible':'none';
    if (map) {
      layerList.map((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', attrBool);
        }
      });
    }
  }

  step6Visible(data){
    const map = env.map;
    let layerList = ['step-flow-5', 'step-flow-5-symbol','step-traffic-5','step-traffic-5-symbol','factor-layer','factor-layer-symbol'];
    let imageLayers = [ 'flowPresent','speedPresent','speedPresent-symbol','saturationPresent', 'saturationPresent-symbol','servicePresent', 'servicePresent-symbol','speedDistribute', 'speedDistribute-symbol', 'flowDistribute','saturationDistribute', 'saturationDistribute-symbol','serviceDistribute', 'serviceDistribute-symbol', 'flowDistribute-symbol','flowPresent-symbol'];
    //off全隐藏，on需参考右侧面板
    if(!data && map){
      layerList.map((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'none');
        }
      });
      imageLayers.map((layer) => {
        if (map.getLayer(layer)) {
          map.setLayoutProperty(layer, 'visibility', 'none');
        }
      });
    }else{
      eventBus.$emit("step6LayerShow");
    }
  }
}
