/**
 * Created by limei on 2018/5/10.
 */
import MYCONF from '../myconf'

export default {
  state: {
    panel_show: MYCONF.IS_PANEL_SHOW,
    menu_list: MYCONF.MENU_LIST,
    cur_menu: MYCONF.CUR_MENU,    //左侧菜单
    pre_menu: {},    //左侧菜单
    cur_tab: "",   //top头部激活tab
    isRoadEditable: false,   //基础道路是否可选
    isVillageEditable: false,  //基础小区是否可选
    active_tool:null,    //line-测距，polygon-测面，null-无

    global_v_type:1,    //全局小区：0:预设建成区  1:自定义交通小区
    panel_v_type:1,    //面板：0:预设建成区  1:自定义交通小区
    area_list:MYCONF.AREA_LIST,    //建成区列表
    global_time:MYCONF.GLOBAL_TIME,    //全局时间
    t_update_time:null,    //全局时间更新时间
    v_update_time:null,    //全局小区更新时间
    global_village:MYCONF.GLOBAL_VILLAGE,    //全局小区列表
    global_village_id:[],    //全局小区相关道路id列表
    global_village_name:[],    //全局小区相关道路name列表
    temp_village:MYCONF.GLOBAL_VILLAGE,    //全局小区列表--临时暂存
    temp_village_id:[],    //全局小区相关道路id列表--临时暂存
    temp_village_name:[],    //全局小区相关道路name列表--临时暂存
    global_area:null,    //全局小区已选建成区id

    global_v_active:false,      //是否全局小区面板激活

    map_click_disabled:false,     //是否禁止自定义点选框选道路
    click_disabled_type:'',        //高级溯源：空-无，A:道路级A，B：道路级B
    cur_zoom:MYCONF.map.zoom,
    global_time_follow:false,      //是否跟随全局时间
    global_vil_follow:false,      //是否跟随全局时小区
    bus_line_list:MYCONF.BUS_LINE_LIST,    //建成区列表
    //公交
    road_sel_type:'road',
    cur_bus_line:null,
    cur_route:'workbench',//当前路径
    cur_tra:'history',  //路况模块历史/实时

    global_loading:false,    //全局进度条
    global_mask:false,    //全局加载遮罩
    report_loading:false,    //是否为报告生成

    loading_tip:null,  //懒加载时的过渡提醒
    single_layer:true,  //是否单图层模式
    data_source_page: false,  //是否打开数据资源页面
    data_source_type: 'overview', //overview、details
    data_source_year: 2018,
    layer_legend_type : '',  //全局图层图例
    line_layer_legend: '',  //全局期望线图例
  },

  getters: {
    panel_show: state => state.panel_show,
    menu_list: state => state.menu_list,
    cur_menu: state => state.cur_menu,
    pre_menu: state => state.pre_menu,
    cur_globalTime_follow: state => state.cur_menu.globaltime,
    cur_globalVil_follow: state => state.cur_menu.globalvil,
    cur_tab: state => state.cur_tab,
    isRoadEditable: state => state.isRoadEditable,
    isVillageEditable: state => state.isVillageEditable,
    active_tool: state => state.active_tool,

    activeList(state, getters, rootState, rootGetters) {
      const menuList = rootGetters.menu_list;
      const arrList = [];
      const ids = [];
      if(menuList.length > 0){
        menuList.map((menu) => {
          let menuList = menu.menuList;
          if(menuList){
            // arrList.push(menuList.filter(item => item.active));
            menuList.map((menu) => {
              if(menu.active) ids.push(menu.id);
            })
          }
        });
        // arrList.map((item) => {
        //   ids.push(item.id);
        // });
      }
      return ids;
    },
    global_v_type: state => state.global_v_type,
    panel_v_type: state => state.panel_v_type,
    area_list: state => state.area_list,
    global_time: state => state.global_time,
    global_village: state => state.global_village,
    global_village_id: state => state.global_village_id,
    global_village_name: state => state.global_village_name,
    temp_village: state => state.temp_village,
    temp_village_id: state => state.temp_village_id,
    temp_village_name: state => state.temp_village_name,
    global_area: state => state.global_area,
    global_v_active: state => state.global_v_active,
    map_click_disabled: state => state.map_click_disabled,
    click_disabled_type: state => state.click_disabled_type,
    cur_zoom: state => state.cur_zoom,
    global_time_follow: state => state.global_time_follow,
    global_vil_follow: state => state.global_vil_follow,
    v_update_time: state => state.v_update_time,
    t_update_time: state => state.t_update_time,
    bus_line_list: state => state.bus_line_list,
    //公交
    road_sel_type: state => state.road_sel_type,
    cur_bus_line: state => state.cur_bus_line,
    cur_route: state => state.cur_route,
    cur_tra: state => state.cur_tra,
    global_loading: state => state.global_loading,
    report_loading: state => state.report_loading,
    global_mask: state => state.global_mask,
    loading_tip: state => state.loading_tip,
    single_layer: state => state.single_layer,
    data_source_page: state => state.data_source_page,
    data_source_type: state => state.data_source_type,
    data_source_year: state => state.data_source_year,
    layer_legend_type: state => state.layer_legend_type,
    line_layer_legend: state => state.line_layer_legend,
  },

  mutations: {
    updatePanelSow(state, payload) {
      state.panel_show = payload;
    },
    updateMenuList(state, payload) {
      state.menu_list = payload;
    },
    updateMenuActive(state, payload) {
      const isActive = payload.active;
      state.menu_list.map((menu) => {
        menu.menuList.map((item) => {
          if (payload.id === item.id) {
            item.active = isActive;
          }else{
            if(state.single_layer){
              item.active = false;
              state.cur_menu = payload;
              // this.updateCurMenu(payload);
            }
          }
        })
      })
    },
    updateTimeFollow(state, payload) {
      const isTimeFollow = payload.globaltime;
      state.menu_list.map((menu) => {
        menu.menuList.map((item) => {
          if (payload.id === item.id) {
            item.globaltime = isTimeFollow;
          }
        })
      })
    },
    updateVilFollow(state, payload) {
      const isVilFollow = payload.globalvil;
      state.menu_list.map((menu) => {
        menu.menuList.map((item) => {
          if (payload.id === item.id) {
            item.globalvil = isVilFollow;
          }
        })
      })
    },
    updateCurMenu(state, payload) {
      state.cur_menu = Object.assign({},state.cur_menu,payload);
      // state.cur_menu = payload;
      state.menu_list.map((menu) => {
        menu.menuList.map((item) => {
          if (state.cur_menu.id === item.id) {
            item.active = true;
          }else{
            if(state.single_layer) item.active = false;
          }
        })
      });
    },
    updateCurTab(state, payload) {
      state.cur_tab = payload;
    },
    updateRoadEditable(state, payload) {
      state.isRoadEditable = payload;
    },
    updateVillageEditable(state, payload){
      state.isVillageEditable = payload;
    },
    updateActiveTool(state, payload){
      state.active_tool = payload;
    },
    updateGlobalVType(state, payload){
      state.global_v_type = payload;
    },
    updatePanelVType(state, payload){
      state.panel_v_type = payload;
    },
    updateGlobalTime(state, payload){
      state.global_time = payload;
    },
    updateGlobalVillage(state, payload){
      state.global_village = payload;
    },
    updateGlobalVillageIds(state, payload){
      state.global_village_id = payload;
    },
    updateGlobalVillageNames(state, payload){
      state.global_village_name = payload;
    },
    updateTempVillage(state, payload){
      state.temp_village = payload;
    },
    updateTempVillageIds(state, payload){
      state.temp_village_id = payload;
    },
    updateTempVillageNames(state, payload){
      state.temp_village_name = payload;
    },
    updateGlobalArea(state, payload){
      state.global_area = payload;
    },
    updateAreaList(state, payload){
      state.area_list = payload;
    },
    updateGlobalVActive(state, payload){
      state.global_v_active = payload;
    },
    updateMapClickDisabled(state, payload){
      state.map_click_disabled = payload;
    },
    updateClickDisabledType(state, payload){
      state.click_disabled_type = payload;
    },
    updateCurZoom(state, payload){
      state.cur_zoom = payload;
    },
    updateGlobalFollow(state, payload){
      state.global_time_follow = payload;
    },
    updateVilGlobalFollow(state, payload){
      state.global_vil_follow = payload;
    },
    updateVUpdateTime(state, payload){
      state.v_update_time = payload;
    },
    updateTUpdateTime(state, payload){
      state.t_update_time = payload;
    },
    updatePreMenu(state, payload){
      state.pre_menu = payload;
    },
    updateBusLineList(state, payload){
      state.bus_line_list = payload;
    },
    updateRoadSelType(state, payload){
      state.road_sel_type = payload;
    },
    updateCurBusLine(state, payload){
      state.cur_bus_line = payload;
    },
    updateCurRoute(state, payload){
      state.cur_route = payload;
    },
    updateCurTra(state, payload){
      state.cur_tra = payload;
    },
    updateGlobalLoading(state, payload){
      state.global_loading = payload;
    },
    updateReportLoading(state, payload){
      state.report_loading = payload;
    },
    updateGlobalMask(state, payload){
      state.global_mask = payload;
    },
    updateLoadingTip(state, payload){
      state.loading_tip = payload;
    },
    updateSingleLayer(state, payload){
      state.single_layer = payload;
      if(payload){
        state.menu_list.map((menu) => {
          menu.menuList.map((item) => {
            if (state.cur_menu.id === item.id) {
              item.active = true;
            }else{
              item.active = false;
            }
          })
        })
      }
    },
    updateDataSourcePage(state, payload){
      state.data_source_page = payload;
    },
    updateDataSourceType(state, payload){
      state.data_source_type = payload;
    },
    updateDataSourceYear(state, payload){
      state.data_source_year = payload;
    },
    updateLayerLegendType(state, payload){
      state.layer_legend_type = payload;
    },
    updateLineLayerLegend(state, payload){
      state.line_layer_legend = payload;
    },
  },

}

