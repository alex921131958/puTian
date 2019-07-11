/**
 * Created by limei on 2018/5/10.
 */
import MYCONF from '../myconf'
import FLOWCONF from '../components/workflow/flowConf'

export default {
  state: {
    curEditPool: null,      //当前地块编辑池数据
    landBaseArea: 0,        //当前激活块用地面积
    landAreaObj: JSON.parse(JSON.stringify(FLOWCONF.AREA_ATTRIBUTE)),  //当前地块基本信息
    landParamObj: {},        //当前地块已保存参数
    curLandId: '',       //当前激活态land_id
    landList: [],       //已保存地块id列表
    landOdColor: '#ee3d0e',   //期望线颜色
    landOdType: '双向',   //期望线颜色
    landOdWidth: 5,   //期望线最大宽度
    landColor: '',   //期望线颜色
    landOdData: null,   //期望线总数据暂存
    landPointData: null,   //期望线d点据暂存
    odExpMax: FLOWCONF.DEFAULT_EXP_MAX,   //期望线最大阈值
    odExpMin: FLOWCONF.DEFAULT_EXP_MIN,   //期望线最小阈值
    time_tag: '早高峰',   //step2交通预测时段(早/晚高峰)
    allOdShow: true,   //是否显示全部期望线
    colorType: '单色',  //期望线颜色选择(彩色/单色)
    expCircle:1,  //期望线中心圆点半径

    entryArr:["未设定","未设定","未设定","未设定"],
    ratioArr:[0,0,0,0],
    lngLatArr:[null,null,null,null],  //车辆出入比例
    linkArr:[null,null,null,null],  //出入口所在link
  },

  getters: {
    curEditPool: state => state.curEditPool,
    landBaseArea: state => state.landBaseArea,
    landAreaObj: state => state.landAreaObj,
    landParamObj: state => state.landParamObj,
    curLandId: state => state.curLandId,
    landList: state => state.landList,
    landOdColor: state => state.landOdColor,
    landOdType: state => state.landOdType,
    landOdWidth: state => state.landOdWidth,
    landColor: state => state.landColor,
    landOdData: state => state.landOdData,
    landPointData: state => state.landPointData,
    odExpMax: state => state.odExpMax,
    odExpMin: state => state.odExpMin,
    time_tag: state => state.time_tag,
    allOdShow: state => state.allOdShow,
    colorType: state => state.colorType,
    expCircle: state => state.expCircle,

    entryArr: state => state.entryArr,
    ratioArr: state => state.ratioArr,
    lngLatArr: state => state.lngLatArr,
    linkArr: state => state.linkArr,
  },

  mutations: {
    updateCurEditPool(state, payload) {
      state.curEditPool = payload;
    },
    updateLandBaseArea(state, payload) {
      state.landBaseArea = payload;
    },
    updateLandAreaObj(state, payload) {
      state.landAreaObj = Object.assign({}, state.landAreaObj, payload);
    },
    updateLandParamObj(state, payload) {
      state.landParamObj = Object.assign({}, state.landParamObj, payload);
    },
    updateCurLandId(state, payload) {
      state.curLandId = payload;
    },
    updateLandList(state, payload) {
      state.landList = payload;
    },
    updateLandOdColor(state, payload) {
      state.landOdColor = payload;
    },
    updateLandOdType(state, payload) {
      state.landOdType = payload;
    },
    updateLandOdWidth(state, payload) {
      state.landOdWidth = payload;
    },
    updateLandColor(state, payload) {
      state.landColor = payload;
    },
    updateLandOdData(state, payload) {
      state.landOdData = payload;
    },
    updateLandPointData(state, payload) {
      state.landPointData = payload;
    },
    updateOdExpMax(state, payload) {
      state.odExpMax = payload;
    },
    updateOdExpMin(state, payload) {
      state.odExpMin = payload;
    },
    updateTimeTag(state, payload) {
      state.time_tag = payload;
    },
    updateAllOdShow(state, payload) {
      state.allOdShow = payload;
    },
    updateColorType(state, payload) {
      state.colorType = payload;
    },
    updateOdExpCircle(state, payload) {
      state.expCircle = payload;
    },
    updateEntryArr(state, payload) {
      state.entryArr = payload;
    },
    updateRatioArr(state, payload) {
      state.ratioArr = payload;
    },
    updateLngLatArr(state, payload) {
      state.lngLatArr = payload;
    },
    updateLinkArr(state, payload) {
      state.linkArr = payload;
    },
  },

}

