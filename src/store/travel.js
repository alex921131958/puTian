import MYCONF from '../myconf'
export default {
  state: {
    //公共
    village_title: '点击开始选择小区',
    global_v_title: '点击开始选择小区',
    village_id: [],                //小区id --已选
    village_list: [],              //小区List --已选
    villageMethod: '自定义',  //小区选择方式  自定义或者全局
    grid_heatmap: MYCONF.GRIDORHEATMAP,   //热力或栅格
    kernel_radius: MYCONF.HEATMAP_RADIUS,  //热力单位圆半径
    //全方式OD
    display_mode: '全部',           //显示模式
    only_district:false,             //仅显示选定小区OD
    district_mode: '全局',          //小区选择方式
    merge_display:false,            //合并显示所选定通小区
    line_district: '全部',          //期望线和小区出行强度
    distance_type: 'a',            //期望线出行强度
    exp_min:0,
    exp_max:300,
    expWidth:7,
    whiteRadius:1,
    colorChange: '#3b90ee',         //单色初始颜色
    colorSel: MYCONF.COLOR_SELECT[0],
    overAll: false,
    data_details_select: 0,
    isMergeLine: false,

    //分时动态人口
    overAll_2: false,
    hourlyPlay: false,

    //出行特征
    traver_analy: 0,      //出行特征 分析内容
    overAll_3: false,

    //职住平衡
    residence_list:1,     //职住平衡 分析内容
    overAll_4: false,

    //建成区OD分析
    adminOption:'建成区OD分析',          //分析内容
    buildArea_sel: null,       //建成区选择
    adminArea_sel: null,       //区县选择
    display_mode_build: '全部',      //显示模式
    travel_sel:'交通生成量',    //全方式OD出行强度显示内容
    travel_selOd:'a',
    overAll_5: false,
    adminExpWidth: 7,           //期望线宽度
    adminWhiteRadius: 1,
  },

  getters: {
    traver_analy: state => state.traver_analy,
    residence_list: state => state.residence_list,
    exp_min: state => state.exp_min,
    exp_max: state => state.exp_max,
    expWidth: state => state.expWidth,
    whiteRadius: state => state.whiteRadius,
    colorChange: state => state.colorChange,
    colorSel: state => state.colorSel,
    villageMethod: state => state.villageMethod,
    adminOption: state => state.adminOption,
    buildArea_sel: state => state.buildArea_sel,
    adminArea_sel: state => state.adminArea_sel,
    travel_sel: state => state.travel_sel,
    travel_selOd: state => state.travel_selOd,
    grid_heatmap: state => state.grid_heatmap,
    kernel_radius: state => state.kernel_radius,
    //8.14 全方式od
    display_mode: state => state.display_mode,
    only_district: state => state.only_district,
    district_mode: state => state.district_mode,
    merge_display: state => state.merge_display,
    line_district: state => state.line_district,
    overAll: state => state.overAll,
    overAll_2: state => state.overAll_2,
    overAll_3: state => state.overAll_3,
    overAll_4: state => state.overAll_4,
    overAll_5: state => state.overAll_5,
    data_details_select: state => state.data_details_select,
    isMergeLine: state => state.isMergeLine,
    //8.15小区
    village_title : state => state.village_title,
    global_v_title : state => state.global_v_title,
    village_id : state => state.village_id,
    village_list : state => state.village_list,
    distance_type : state => state.distance_type,
    hourlyPlay : state => state.hourlyPlay,
    display_mode_build : state => state.display_mode_build,
    adminExpWidth : state => state.adminExpWidth,
    adminWhiteRadius : state => state.adminWhiteRadius,
  },

  mutations: {
    updateTravelAnaly(state, payload) {
      state.traver_analy = payload;
    },
    updateResidenceList(state, payload) {
      state.residence_list = payload;
    },
    updateExpMin(state, payload) {
      state.exp_min = payload;
    },
    updateExpMax(state, payload) {
      state.exp_max = payload;
    },
    updateExpWidth(state, payload) {
      state.expWidth = payload;
    },
    updateWhiteRadius(state, payload) {
      state.whiteRadius = payload;
    },
    updateColorChange(state, payload) {
      state.colorChange = payload;
    },
    updateColorSel(state, payload) {
      state.colorSel = payload;
    },
    updateHourlyPlay(state, payload) {
      state.hourlyPlay = payload;
    },

    updateVillageMethod(state, payload) {
      state.villageMethod = payload;
    },
    updateAdminOption(state, payload) {
      state.adminOption = payload;
    },

    updateBuildAreaSel(state, payload) {
      state.buildArea_sel = payload;
    },
    updateAdminAreaSel(state, payload) {
      state.adminArea_sel = payload;
    },
    updateTravelSel(state, payload) {
      state.travel_sel = payload;
    },
    updateTravelOdSel(state, payload) {
      state.travel_selOd = payload;
    },
    updateGridHeatmap(state, payload) {
      state.grid_heatmap = Object.assign({},state.grid_heatmap,payload);
    },
    updateKernelRadius(state, payload) {
      state.kernel_radius = Object.assign({},state.kernel_radius,payload);
    },
    //8.14 全方式od
    updateDisplayMode(state, payload) {
      state.display_mode = payload;
    },
    updateOnlyDistrict(state, payload) {
      state.only_district = payload;
    },
    updateDistrictMode(state, payload) {
      state.district_mode = payload;
    },
    updateMergeDisplay(state, payload) {
      state.merge_display = payload;
    },
    updateLineDistrict(state, payload) {
      state.line_district = payload;
    },
    updateOverAll(state, payload) {
      state.overAll = payload;
    },
    updateOverAll2(state, payload) {
      state.overAll_2 = payload;
    },
    updateOverAll3(state, payload) {
      state.overAll_3 = payload;
    },
    updateOverAll4(state, payload) {
      state.overAll_4 = payload;
    },
    updateOverAll5(state, payload) {
      state.overAll_5 = payload;
    },
    updateDataDetailsSelect(state, payload) {
      state.data_details_select = payload;
    },
    updateIsMergeLine(state, payload) {
      state.isMergeLine = payload;
    },

    updateVillageTitle(state, payload) {
      state.village_title = payload;
    },
    updateGlobalVTitle(state, payload) {
      state.global_v_title = payload;
    },
    updateVillageId(state, payload) {
      state.village_id = payload;
    },
    updateVillageList(state, payload) {
      state.village_list = payload;
    },
    updateDistanceType(state, payload) {
      state.distance_type = payload;
    },

    updateDisplayModeBuild(state, payload) {
      state.display_mode_build = payload;
    },
    updateAdminExpWidth(state, payload) {
      state.adminExpWidth = payload;
    },
    updateAdminWhiteRadius(state, payload) {
      state.adminWhiteRadius = payload;
    },
  },

}
