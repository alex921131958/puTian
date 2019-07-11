/**
 * Created by limei on 2018/5/10.
 */
import MYCONF from '../myconf'
import FLOWCONF from '../components/workflow/flowConf'

export default {
  state: {
    stepParam_5: null,      //当前地块编辑池数据
  },

  getters: {
    stepParam_5: state => state.stepParam_5,
  },

  mutations: {
    updateStep5ParamObj(state, payload) {
      state.stepParam_5 = Object.assign({},state.stepParam_5,payload);
    },
  },

}

