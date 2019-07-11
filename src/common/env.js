/**
 * Created by limei on 2018/7/23.
 */
import datetimeHelper from '../util/datetime-helper'
const env = {
  map: null,
  edit:null,     //地块编辑edit插件
  base_stops: datetimeHelper.setStopRange(0),
  buffer_stops: datetimeHelper.setStopRange(0),
  locateRoadId:'',           //定位Id
  locateVillageId:'',       //小区当前定位id
  echartLayer:null,
  echartLayerOption:null,  //全方式OD
  adminOdLayerOption:null,  //建成区OD
  carOdLayerOption:null,  //小汽车OD
  landOdLayerOption:null,  //用地规划预测OD
  projectOdLayerOption:null,  //用地规划全部OD
  land_stops: datetimeHelper.setFlowRange(0),
  entryMarkers:[null,null,null,null],   //出入口标注

  //echartLayer图层可配置化 -> 默认设置-mounted时重置
  cWidth:1920,
  cHeight:1080,

  leaf_map: null,  //leaflet map
  leaf_marker: null,  //全局吸附店
  leaf_handler: null, //吸附监听器
  lineInfo: null,    //新增线返回roadid
  changeLine: null,   //线的修改成功状态
  polygonCoors: [],    //

  bugLines : [],
};

export default env;
