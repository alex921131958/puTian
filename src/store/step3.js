import MYCONF from '../myconf'
import FLOWCONF from '../components/workflow/flowConf'

export default {
  state: {
    roadTrafficModules: FLOWCONF.TRAFFIC_VOLUME,
    dayTraffic: 1.0,
    morningTraffic: 1.0,
    eveningTraffic: 1.0,
    searchRadius: 0.5,
    timeRange: '早高峰',
    landFlowMax: 1000,
    landFlowMin: 0,
    landFlowWidth: -20,
    landBackgroundWidth: -20,
    landPlanColor: '#3B90EE',
    backgroundPlanColor: '#ee1b36',
    isLandPlanShow: true,
    isBackgroundFlowShow: false,
    isFlowRemakeShow: true,
    roadTrafficDis : FLOWCONF.TRAFFICYELLOW
  },

  getters: {
    roadTrafficModules: state => state.roadTrafficModules,
    dayTraffic: state => state.dayTraffic,
    morningTraffic: state => state.morningTraffic,
    eveningTraffic: state => state.eveningTraffic,
    searchRadius: state => state.searchRadius,
    timeRange: state => state.timeRange,
    landFlowMax: state => state.landFlowMax,
    landFlowMin: state => state.landFlowMin,
    landFlowWidth: state => state.landFlowWidth,
    landBackgroundWidth: state => state.landBackgroundWidth,
    landPlanColor: state => state.landPlanColor,
    backgroundPlanColor: state => state.backgroundPlanColor,
    isLandPlanShow: state => state.isLandPlanShow,
    isBackgroundFlowShow: state => state.isBackgroundFlowShow,
    isFlowRemakeShow: state => state.isFlowRemakeShow,
    roadTrafficDis: state => state.roadTrafficDis,
  },

  mutations: {
    updateRoadTrafficModules(state, payload) {
      state.roadTrafficModules = payload;
    },
    updateDayTraffic(state, payload) {
      state.dayTraffic = payload;
    },
    updateMorningTraffic(state, payload) {
      state.morningTraffic = payload;
    },
    updateEveningTraffic(state, payload) {
      state.eveningTraffic = payload;
    },
    updateSearchRadius(state, payload) {
      state.searchRadius = payload;
    },
    updateTimeRange(state, payload) {
      state.timeRange = payload;
    },
    updateLandFlowMax(state, payload) {
      state.landFlowMax = payload;
    },
    updateLandFlowMin(state, payload) {
      state.landFlowMin = payload;
    },
    updateLandFlowWidth(state, payload) {
      state.landFlowWidth = payload;
    },
    updateLandBackgroundWidth(state, payload) {
      state.landBackgroundWidth = payload;
    },
    updateLandPlanColor(state, payload) {
      state.landPlanColor = payload;
    },
    updateBackgroundPlanColor(state, payload) {
      state.backgroundPlanColor = payload;
    },
    updateIsLandPlanShow(state, payload) {
      state.isLandPlanShow = payload;
    },
    updateIsBackgroundFlowShow(state, payload) {
      state.isBackgroundFlowShow = payload;
    },
    updateIsFlowRemakeShow(state, payload) {
      state.isFlowRemakeShow = payload;
    },
    updateRoadTrafficDis(state, payload) {
      state.roadTrafficDis = payload;
    },
  },

}

