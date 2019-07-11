import MYCONF from '../../myconf'
import FLOWCONF from '../../components/workflow/flowConf'
import env from '../../common/env'
import DateHelper from '../../util/datetime-helper'
import eventBus from '../../util/event-bus'

export default class compareHandler {
  static compareProject(planA, planB){
    return [{
      text: planA.landNum === planB.landNum ? '地块数量相同' : '地块数量不同',
      plan1: planA.landNum,
      plan2: planB.landNum
    }, {
      text: planA.landArea === planB.landArea ? '地块总面积相同' : '地块总面积不同',
      plan1: (planA.landArea/1000000).toFixed(2),
      plan2: (planB.landArea/1000000).toFixed(2)
    }, {
      text: planA.newRoadnum === planB.newRoadnum ? '新建道路数量相同' : '新建道路数量不同',
      plan1: planA.newRoadnum,
      plan2: planB.newRoadnum
    }, {
      text: planA.newRoadlength === planB.newRoadlength ? '新建道路里程相同' : '新建道路里程不同',
      plan1: (planA.newRoadlength/1000).toFixed(2),
      plan2: (planB.newRoadlength/1000).toFixed(2)
    }, {
      text: planA.reconstructionNum === planB.reconstructionNum ? '改建道路数量相同' : '改建道路数量不同',
      plan1: planA.reconstructionNum,
      plan2: planB.reconstructionNum
    }, {
      text: planA.reconstructionLength === planB.reconstructionLength ? '改建道路里程相同' : '改建道路里程不同',
      plan1: (planA.reconstructionLength/1000).toFixed(2),
      plan2: (planB.reconstructionLength/1000).toFixed(2)
    }]
  }

  static compareInfo(data={}) {
    return [{
      label:'时段',
      planA: data.p1_List[0] ? (data.p1_List[0].timetag==='M' ? '早高峰' : '晚高峰'):'早高峰',
      planB: data.p2_List[0] ? (data.p2_List[0].timetag==='M' ? '早高峰' : '晚高峰'):'早高峰'
    },{
      label:'速度影响',
      planA: data.p1_List[0] ? data.p1_List[0].f_speed.toFixed(1) : 0,
      planB: data.p2_List[0] ? data.p2_List[0].f_speed.toFixed(1) : 0,
    },{
      label:'流量影响',
      planA: data.p1_List[0] ? data.p1_List[0].f_vol.toFixed(0) : 0,
      planB: data.p2_List[0] ? data.p2_List[0].f_vol.toFixed(0) : 0,
    },{
      label:'饱和度影响',
      planA: data.p1_List[0] ? (data.p1_List[0].f_saturation*100).toFixed(2) : 0,
      planB: data.p2_List[0] ? (data.p2_List[0].f_saturation*100).toFixed(2) : 0,
    },{
      label:'服务水平影响',
      planA: data.p1_List[0] ? data.p1_List[0].f_los : 0,
      planB: data.p2_List[0] ? data.p2_List[0].f_los : 0,
    }]
  }

  static addCompareFlowFilter(id, data){
    let minFlow = data;
    let layerList = [id, id+'-symbol'];
    let filterName = id==='flow-buffer' ? 'vta' : 'vf_diff_alter';
    if (env.map) {
      layerList.map((layerId) => {
        if (env.map.getLayer(layerId)) {
          let filterStr = [];
          if(filterName==='vta') filterStr = minFlow === 0 ? ['>', filterName, minFlow] : ['>=', filterName, minFlow];
          if(filterName==='vf_diff_alter') {
            if(layerId==='flow-compare-buffer') filterStr =['any',["<=",filterName,-minFlow],[">=",filterName,minFlow]];
            if(layerId==='flow-compare-buffer-symbol') filterStr = minFlow === 0? ['!=', filterName, minFlow]: ['any',["<=",filterName,-minFlow],[">=",filterName,minFlow]];
          }
          env.map.setFilter(layerId, filterStr);
        }
      })
    }
  }

  static changeCompareFlowWidth(id, data){
    let layerId = id;
    let propertyName = id==='flow-buffer'? 'vta' : 'vf_diff_alter';
    if (env.map.getLayer(layerId)) {
      env.map.setPaintProperty(layerId, 'line-width', {
        "type": "interval",
        'property': propertyName,
        'stops': DateHelper.setFlowCompareBufferRatio(data)  //datetimeHelper.setBufferRange(count)
      })
    }
  }

  static layerShowHide(data, factor){
    let isShow = factor ? 'visible': 'none';
    let layerList = data==='speed' ? ['speed-line-symbol']:
      data==='flow' ? ['flow-buffer-symbol','flow-compare-buffer-symbol']:
        data==='saturation' ? ['saturation-line-symbol']:['service-line-symbol'];
    if (env.map) {
      layerList.map(layerId => {
        if (env.map.getLayer(layerId)) {
          env.map.setLayoutProperty(layerId, 'visibility', isShow);
        }
      });
    }
  }
}

