/**
 * Created by limei on 2018/5/10.
 */
import MYCONF from '../myconf'
export default {
  state: {
    panel_time: MYCONF.GLOBAL_TIME,     //面板时间
    cur_time_sel:'',                   //面板时间选择
    link_id:[],                   //link道路id集合-已选
    link_list:[],                   //link道路集合-已选
    road_title:'点击开始选择道路',
    cur_item_active:'',       //当前点击更改激活状态的menu项
    buffer_stops:0,           //单侧buffer显示宽度比例：>0:w*(x+1); <0:num*1/(1-x)
    flow_label_show:MYCONF.FLOW_LABEL_SHOW,
    buffer_color:MYCONF.BUFFER_COLOR,
    buffer_width:MYCONF.BUFFER_WIDTH,
    flow_range_max:MYCONF.FLOW_RANGE_MAX,
    flow_range_min:MYCONF.FLOW_RANGE_MIN,
    heatmap_width:MYCONF.HEATMAP_WIDTH,
    flow_background_show: false,
    flow_background_color: '#cb178a',
    flow_background_width: 0,

    //小汽车OD
    rangeMin: 500,                    //期望线最小值
    rangeMax: 1000,                   //期望线最大值
    carOd_curShow: '全部',            //显示模式
    carOd_curExpectation:'全部',      //期望线类型
    carOd_curDisplay:'总量',          //小区出行强度
    carOdColor: '彩色',               //期望线颜色
    defaultColor: '3b90ee',            //单色初始颜色

    panel_village:MYCONF.GLOBAL_VILLAGE,    //全局小区列表
    panel_village_id:[],    //全局小区相关道路id列表
    bus_speed_type:0,      //公交速度显示内容：公交运行速度/小汽车公交速度差
  },

  getters: {
    panel_time: state => state.panel_time,
    cur_time_sel: state => state.cur_time_sel,
    link_id: state => state.link_id,
    link_list: state => state.link_list,
    road_title: state => state.road_title,
    cur_item_active: state => state.cur_item_active,
    buffer_stops: state => state.buffer_stops,
    flow_label_show: state => state.flow_label_show,
    buffer_color: state => state.buffer_color,
    buffer_width: state => state.buffer_width,
    flow_range_max: state => state.flow_range_max,
    flow_range_min: state => state.flow_range_min,
    flow_background_show: state => state.flow_background_show,
    flow_background_color: state => state.flow_background_color,
    flow_background_width: state => state.flow_background_width,

    //8.21热力宽度
    heatmap_width : state => state.heatmap_width,

    //小汽车OD
    rangeMin : state => state.rangeMin,
    rangeMax : state => state.rangeMax,
    carOd_curShow : state => state.carOd_curShow,
    carOd_curExpectation : state => state.carOd_curExpectation,
    carOd_curDisplay : state => state.carOd_curDisplay,
    carOdColor : state => state.carOdColor,
    defaultColor : state => state.defaultColor,

    panel_village: state => state.panel_village,
    panel_village_id: state => state.panel_village_id,
    bus_speed_type: state => state.bus_speed_type,
  },

  mutations: {
    updatePanelTime(state, payload) {
      state.panel_time = Object.assign({},state.panel_time,payload);
    },
    updateCurTimeSel(state, payload) {
      state.cur_time_sel = payload;
    },
    updateLinkId(state, payload) {
      state.link_id = payload;
    },
    updateLinkList(state, payload) {
      state.link_list = payload;
    },
    updateRoadTitle(state, payload) {
      state.road_title = payload;
    },
    updateItemActive(state, payload) {
      state.cur_item_active = payload;
    },
    updateBufferStops(state, payload) {
      state.buffer_stops = payload;
    },
    updateFlowLabel(state, payload) {
      state.flow_label_show = payload;
    },
    updateFlowRangeMax(state, payload) {
      state.flow_range_max = payload;
    },
    updateFlowRangeMin(state, payload) {
      state.flow_range_min = payload;
    },
    updateBufferColor(state, payload) {
      state.buffer_color = Object.assign({},state.buffer_color,payload);
    },
    updateBufferWidth(state, payload) {
      state.buffer_width = Object.assign({},state.buffer_width,payload);
    },
    updateFlowBackgroundShow(state, payload) {
      state.flow_background_show = payload;
    },
    updateFlowBackgroundColor(state, payload) {
      state.flow_background_color = payload;
    },
    updateFlowBackgroundWidth(state, payload) {
      state.flow_background_width = payload;
    },


    updateHeatmap_width(state, payload) {
      state.heatmap_width = payload;
    },

    //小汽车OD
    updateRangeMin(state, payload) {
      state.rangeMin = payload;
    },
    updateRangeMax(state, payload) {
      state.rangeMax = payload;
    },
    updateCarOdCurShow(state, payload) {
      state.carOd_curShow = payload;
    },
    updateCarOdCurExpectation(state, payload) {
      state.carOd_curExpectation = payload;
    },
    updateCarOdCurDisplay(state, payload) {
      state.carOd_curDisplay = payload;
    },
    updateCarOdColor(state, payload) {
      state.carOdColor = payload;
    },
    updateDefaultColor(state, payload) {
      state.defaultColor = payload;
    },
    updatePanelVillage(state, payload){
      state.panel_village = payload;
    },
    updatePanelVillageIds(state, payload){
      state.panel_village_id = payload;
    },
    updateBusSpeedType(state, payload){
      state.bus_speed_type = payload;
    },
  },

}

