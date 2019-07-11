/**
 * Created by limei on 2018/5/11.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import globals from './globals'
import panels from './panels'
import suyuan from './suyuan'
import chart from './chart'
import travel from './travel'
import map from './map'
import settings from './settings'
import workflow from './workflow'
import landuse from './landuse'
import step5 from './step5'
import step3 from './step3'
import bus from './bus'
import compare from './compare'

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    globals,
    panels,
    suyuan,
    chart,
    travel,
    map,
    settings,
    workflow,
    landuse,
    step5,
    step3,
    bus,
    compare
  }
})
