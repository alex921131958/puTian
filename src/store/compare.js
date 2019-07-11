import MYCONF from '../myconf'
import FLOWCONF from '../components/workflow/flowConf'
export default {
  state:{
    compareShowType: 'speed',
    speedProject: '方案1',
    flowProject: '方案1',
    saturationProject: '方案1',
    serviceProject: '方案1',
    comparePlan1_id: '',
    comparePlan2_id: '',

    flowCompareHigher: 1000,
    flowCompareLower: 0,
    flowCompareWidth: 4,
    flowCompareCoefficient: -60,
    flowAssignColor: '#3B90EE',
    flowCompareBackgroundColor: '#E63D35',
    flowEqualColor: '#2F2F2F',
    flowMorethanColor: '#E63D35',
    flowLessthanColor: '#00B38E',

    isPlan1_isRun: false,
    isPlan2_isRun: false,
    compareLabelShow: {
      speed: true,
      flow: true,
      saturation: true,
      service: true
    }
  },
  getters: {
    compareShowType: state => state.compareShowType,
    speedProject: state => state.speedProject,
    flowProject: state => state.flowProject,
    saturationProject: state => state.saturationProject,
    serviceProject: state => state.serviceProject,
    comparePlan1_id: state => state.comparePlan1_id,
    comparePlan2_id: state => state.comparePlan2_id,

    flowCompareHigher: state => state.flowCompareHigher,
    flowCompareLower: state => state.flowCompareLower,
    flowCompareWidth: state => state.flowCompareWidth,
    flowCompareCoefficient: state => state.flowCompareCoefficient,
    flowAssignColor: state => state.flowAssignColor,
    flowCompareBackgroundColor: state => state.flowCompareBackgroundColor,
    flowEqualColor: state => state.flowEqualColor,
    flowMorethanColor: state => state.flowMorethanColor,
    flowLessthanColor: state => state.flowLessthanColor,

    isPlan1_isRun: state => state.isPlan1_isRun,
    isPlan2_isRun: state => state.isPlan2_isRun,
    compareLabelShow: state => state.compareLabelShow,
  },
  mutations: {
    updateCompareShowType(state, payload) {
      state.compareShowType = payload;
    },
    updateSpeedProject(state, payload) {
      state.speedProject = payload;
    },
    updateFlowProject(state, payload) {
      state.flowProject = payload;
    },
    updateSaturationProject(state, payload) {
      state.saturationProject = payload;
    },
    updateServiceProject(state, payload) {
      state.serviceProject = payload;
    },
    updateComparePlan1_id(state, payload) {
      state.comparePlan1_id = payload;
    },
    updateComparePlan2_id(state, payload) {
      state.comparePlan2_id = payload;
    },

    updateFlowCompareHigher(state, payload) {
      state.flowCompareHigher = payload;
    },
    updateFlowCompareLower(state, payload) {
      state.flowCompareLower = payload;
    },
    updateFlowCompareWidth(state, payload) {
      state.flowCompareWidth = payload;
    },
    updateFlowCompareCoefficient(state, payload) {
      state.flowCompareCoefficient = payload;
    },
    updateFlowAssignColor(state, payload) {
      state.flowAssignColor = payload;
    },
    updateFlowCompareBackgroundColor(state, payload) {
      state.flowCompareBackgroundColor = payload;
    },
    updateFlowEqualColor(state, payload) {
      state.flowEqualColor = payload;
    },
    updateFlowMorethanColor(state, payload) {
      state.flowMorethanColor = payload;
    },
    updateFlowLessthanColor(state, payload) {
      state.flowLessthanColor = payload;
    },

    updateIsPlan1_isRun(state, payload) {
      state.isPlan1_isRun = payload;
    },
    updateIsPlan2_isRun(state, payload) {
      state.isPlan2_isRun = payload;
    },
    updateCompareLabelShow(state, payload) {
      state.compareLabelShow = Object.assign({},state.compareLabelShow,payload);
    },
  }
}
