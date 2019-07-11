/**
 * Created by limei on 2018/5/10.
 */
import MYCONF from '../myconf'
import FLOWCONF from '../components/workflow/flowConf'
export default {
  state: {
    cur_step: 1,     //面板时间
    isLandEditable: false,     //用地是否可编辑
    isLinkEditable: false,     //道路是否可编辑
    attributePanel:null,    //null不显示，land地块属性，road道路属性
    cur_pro_type:"1539844499318",    //当前已选类型
    cur_pro_id:null,     //当前已选-已有项目
    cur_project:{       //当前操作的交评项目
      id:"1539844499318"
    },         //当前交评类型

    index_travelVol: JSON.parse(JSON.stringify(FLOWCONF.TRAVEL_VOLUME)),  //土地开发量调整系数预设
    index_trafficVol: JSON.parse(JSON.stringify(FLOWCONF.TRAFFIC_VOLUME)), //交通量预测系数
    stepOneTemp:null,      //step1 B 道路相关出行量系数
    pro_count:0,          //当前交评项目总数

    map_center: {
      lat:25.435871096608345,
      lng:119.01230276903023,
    },      //地图中心点 用于minemap 和 leaflet切换[25.435871096608345, 119.01230276903023]
    map_zoom: 13,          //zoom级别
    lineOnClick: FLOWCONF.LINK_ATTRIBUTE,   //点击线显示可编辑信息
    linkOnClick: FLOWCONF.LINK_TRAFFIC_INFO, //点击线显示可编辑信息
    road_single: 1,      //step3道路是否双向  0单向 1双向
    road_num: 0,          //step3统计道路条数
    road_length: 0,          //step3统计道路总长度
    lineInfo: null,        //点击当前线的详细信息（线要被删除）
    curLine: null,         //当前激活的line的roadId
    polygonInfo: [],       //step2中药转移到3中的数据
    lineNewColor: '#CA2253',       //新增道路颜色
    lineChangeColor: '#388276',    //改建道路颜色
    lineConnectColor: '#DDE939',   //道路连杆颜色
    landConnectColor: '#3B90EE',   //地块颜色
    originalLink: null,     //最原始点击的信息（在取消中使用）
    editLinks: null,          //操作过的线
    lineNewLinks: [],     //新增道路


    //11.14开会后更新
    curLinePool: null,    //当前编辑池
    curJudgeState: null,  //当前编辑池line的判断状态
    curHighlightRoadId: null,   //当前高亮的roadId

    //step1中日期类型
    stepOneDataType: '工作日',
    //step6中早晚高峰
    stepSixTimeTag: '晚高峰',

    //交评方案比选
    comparePlan: JSON.parse(JSON.stringify(FLOWCONF.COMPAREPROHECT)),
    planA: JSON.parse(JSON.stringify(FLOWCONF.PLANITEM)),
    planB: JSON.parse(JSON.stringify(FLOWCONF.PLANITEM)),
    planC: JSON.parse(JSON.stringify(FLOWCONF.PLANITEM)),
    project1: '项目1',
    project2: '项目2',

    //step6-交通分配模型
    factor_type: '背景速度',
    factor_show:true,   //速度饱和度影响结果-图例展示
  },

  getters: {
    cur_step: state => state.cur_step,
    isLandEditable: state => state.isLandEditable,
    isLinkEditable: state => state.isLinkEditable,
    attributePanel: state => state.attributePanel,
    cur_pro_type: state => state.cur_pro_type,
    cur_pro_id: state => state.cur_pro_id,
    cur_project: state => state.cur_project,

    index_travelVol: state => state.index_travelVol,
    index_trafficVol: state => state.index_trafficVol,
    stepOneTemp: state => state.stepOneTemp,
    pro_count: state => state.pro_count,

    map_center: state => state.map_center,
    map_zoom: state => state.map_zoom,
    lineOnClick: state => state.lineOnClick,
    linkOnClick: state => state.linkOnClick,
    road_single: state => state.road_single,
    road_num: state => state.road_num,
    road_length: state => state.road_length,
    lineInfo: state => state.lineInfo,
    curLine: state => state.curLine,
    polygonInfo: state => state.polygonInfo,
    lineNewColor: state => state.lineNewColor,
    lineChangeColor: state => state.lineChangeColor,
    lineConnectColor: state => state.lineConnectColor,
    landConnectColor: state => state.landConnectColor,
    originalLink: state => state.originalLink,
    lineNewLinks: state => state.lineNewLinks,
    editLinks: state => state.editLinks,


    //11.14开会后更新
    curLinePool: state => state.curLinePool,
    curJudgeState: state => state.curJudgeState,
    curHighlightRoadId: state => state.curHighlightRoadId,

    stepOneDataType: state => state.stepOneDataType,
    stepSixTimeTag: state => state.stepSixTimeTag,

    comparePlan: state => state.comparePlan,
    planA: state => state.planA,
    planB: state => state.planB,
    planC: state => state.planC,
    project1: state => state.project1,
    project2: state => state.project2,

    factor_type: state => state.factor_type,
    factor_show: state => state.factor_show,
  },

  mutations: {
    updateCurStep(state, payload) {
      state.cur_step = payload;
    },
    updateLandEditable(state, payload) {
      state.isLandEditable = payload;
    },
    updateLinkEditable(state, payload) {
      state.isLinkEditable = payload;
    },
    updateAttributePanel(state, payload) {
      state.attributePanel = payload;
    },
    updateCurProType(state, payload) {
      state.cur_pro_type = payload;
    },
    updateCurProId(state, payload) {
      state.cur_pro_id = payload;
    },
    updateCurProject(state, payload) {
      state.cur_project = Object.assign({},state.cur_project,payload);
    },
    updateTravelIndex(state, payload) {
      state.index_travelVol = Object.assign({},state.index_travelVol,payload);
    },
    updateTrafficIndex(state, payload) {
      state.index_trafficVol = Object.assign({},state.index_trafficVol,payload);
    },
    updateStepOneTemp(state, payload) {
      state.stepOneTemp = payload;
    },
    updateProCount(state, payload) {
      state.pro_count = payload;
    },

    updateMapCenter(state, payload) {
      state.map_center = payload;
    },
    updateMapZoom(state, payload) {
      state.map_zoom = payload;
    },
    updateLineOnClick(state, payload) {
      state.lineOnClick = Object.assign({},state.lineOnClick,payload);
      // state.lineOnClick = payload;
    },
    updateLinkOnClick(state, payload) {
      state.linkOnClick = Object.assign({},state.linkOnClick,payload);
      // state.lineOnClick = payload;
    },
    updateRoadSingle(state, payload) {
      state.road_single = payload;
    },
    updateRoadNum(state, payload) {
      state.road_num = payload;
    },
    updateRoadLength(state, payload) {
      state.road_length = payload;
    },
    updateLineInfo(state, payload) {
      state.lineInfo = payload;
    },
    updateCurLine(state, payload) {
      state.curLine = payload;
    },
    updatePolygonInfo(state, payload) {
      state.polygonInfo = payload;
    },
    updateLineNewColor(state, payload) {
      state.lineNewColor = payload;
    },
    updateLineChangeColor(state, payload) {
      state.lineChangeColor = payload;
    },
    updateLineConnectColor(state, payload) {
      state.lineConnectColor = payload;
    },
    updateLandChangeColor(state, payload) {
      state.landConnectColor = payload;
    },
    updateOriginalLink(state, payload) {
      state.originalLink = payload;
    },
    updateLineNewLinks(state, payload) {
      state.lineNewLinks = payload;
    },
    updateEditLinks(state, payload) {
      let temp = [];
      if (state.editLinks) {
        // state.editLinks.map()
        for (let i=0; i<state.editLinks.length; i++){
          if (payload.options.road_id !== state.editLinks[i].options.road_id){
            state.editLinks.push(payload)
          }else if (payload.options.road_id === state.editLinks[i].options.road_id) {
            state.editLinks.splice(i, 1, payload)
          }
        }
      }else {
        temp.push(payload);
        state.editLinks = temp;
      }
    },


    //11.14开会后更新
    updateCurLinePool(state, payload) {
      state.curLinePool = payload;
    },
    updateCurJudgeState(state, payload) {
      state.curJudgeState = payload;
    },
    updateCurHighlightRoadId(state, payload) {
      state.curHighlightRoadId = payload;
    },

    updateStepOneDataType(state, payload) {
      state.stepOneDataType = payload;
    },
    updateStepSixTimeTag(state, payload) {
      state.stepSixTimeTag = payload;
    },

    updateComparePlan(state, payload) {
      state.comparePlan = payload;
    },
    updatePlanA(state, payload) {
      state.planA = payload;
    },
    updatePlanB(state, payload) {
      state.planB = payload;
    },
    updatePlanC(state, payload) {
      state.planC = payload;
    },
    updateProject1(state, payload) {
      state.project1 = payload;
    },
    updateProject2(state, payload) {
      state.project2 = payload;
    },

    updateFactorType(state, payload) {
      state.factor_type = payload;
    },
    updateFactorShow(state, payload) {
      state.factor_show = payload;
    },
  },

}

