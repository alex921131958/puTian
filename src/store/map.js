import MYCONF from '../myconf'
export default {
  state: {
    map_view: MYCONF.MAP_VIEW_DEFAULT,
    display_time: MYCONF.GLOBAL_TIME,    //当前数据对应的展示时间

    map_setting:{
      admin_bounds:true,
      poi_show:true,
      admin_flag:true,
      road_name:true,
      green_water:true,
      land_use:false,
    },
    mask_url:null,
  },

  getters: {
    map_view: state => state.map_view,
    display_time: state => state.display_time,
    map_setting: state => state.map_setting,
    mask_url: state => state.mask_url,
  },

  mutations: {
    updateMapView(state, payload){
      state.map_view = payload;
    },
    updateDisplayTime(state, payload){
      state.display_time = payload;
    },
    updateMapSetting(state, payload){
      state.map_setting = Object.assign({},state.map_setting,payload)
    },
    updateMaskUrl(state, payload){
      state.mask_url = payload;
    },
  },

}
