import MYCONF from '../myconf'
export default {
  state: {
    traffic_type: 'traffic',    //公交车OD 交通类型
    bus_od_line_min: '',
    bus_od_line_max: '',
    single_line: '',
    cross_icon:1,  //交叉口尺寸
  },

  getters: {
    traffic_type: state => state.traffic_type,
    bus_od_line_min: state => state.bus_od_line_min,
    bus_od_line_max: state => state.bus_od_line_max,
    single_line: state => state.single_line,
    cross_icon: state => state.cross_icon,
  },

  mutations: {
    updataTrafficType(state, payload) {
      state.traffic_type = payload;
    },
    updataBusOdLineMin(state, payload) {
      state.bus_od_line_min = payload;
    },
    updataBusOdLineMax(state, payload) {
      state.bus_od_line_max = payload;
    },
    updataSingleLine(state, payload) {
      state.single_line = payload;
    },
    updateCrossIcon(state, payload) {
      state.cross_icon = payload;
    },
  },


}
