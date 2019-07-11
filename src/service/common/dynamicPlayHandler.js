import MYCONF from '../../myconf'
import env from '../../common/env'
import datetimeHelper from '../../util/datetime-helper'
import Vue from 'vue'
import MapCommonLayer from '../map/mapCommonLayer'

export default class dynamicPlayHandler {
  constructor(_view) {
    this._view = _view;
    //todo: 应用后渲染结果图层命名规则：根据模块id: ${id},label命名：${id}-symbol ,--->涉及整体图层显隐
  }

  //分时动态人口栅格
  hourlyGridLayer(hour) {
    let sourceName = "personTrip-2";
    let time = this._view.panel_time;
    let gridtazids = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
    let token = sessionStorage.getItem("token");
    // let hour = datetimeHelper.formTime(time.hour);    //转格式-08
    let odType = this._view.distance_type;
    let village = this._view.villageMethod;
    let url = '';
    if(!hour) hour = datetimeHelper.formTime(time.hour);

    if (this._view.overAll_2){
      if (village === '全局' && this._view.global_v_type === 0) {
        let globalArea = this._view.global_area.value;
        url = `${MYCONF.service.dynMap}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&maptype=grid&dataSources=1&gridIds=&tazIds=${globalArea}&token=${token}`;
      }else{
        url = `${MYCONF.service.dynMap}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&maptype=grid&dataSources=0&gridIds=${gridtazids}&tazIds=&token=${token}`;
      }
    } else {
      url = `${MYCONF.service.dynMap}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&maptype=grid&dataSources=0&gridIds=&tazIds=&token=${token}`;
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
            [0, '#ffffff'],
            [50, '#2B83BA'],
            [173, '#80BFAC'],
            [522, '#C7E9AD'],
            [961, '#FFFFBF'],
            [1663, '#FEC980'],
            [2816, '#F0733F'],
            [4130, '#cc0000'],
            [7000, '#cc0000'],
          ]
        },
        'fill-opacity':
          {
            "property": "num",
            "stops": [
              [0, 0],
              [50, 0.8],
              [500, 0.8],
              [1000, 0.8],
              [3000, 0.8],
              [5000, 0.8],
              [20000, 0.8],
              [30000, 0.8],
              [40000, 0.8],
            ]
          },
      },
    },this._view.beforeLayer)
  }
}
