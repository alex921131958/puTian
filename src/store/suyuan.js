/**
 * Created by qiaoao on 2018/8/8.
 */
import MYCONF from '../myconf'
import Vue from 'vue'
export default {
  state: {
    tracking_type: 'base',    //溯源类型(基础/高级)
    source_type: '0',    //基础溯源类型(多选)
    advance_typeA: '0',  //高级溯源A(多选)
    advance_typeB: '0',  //高级溯源B(多选)
    cur_advance_type:'',  //当前高级溯源道路类型
    link_id_A:[],
    link_id_B:[],
    link_list_A:[],
    link_list_B:[],
    common_link_id:[],   //高级溯源中重复的id
    selected_only:MYCONF.SELECTED_ONLY,   //只显示选定道路
    taz_only: true, //只显示建成区内

    table_select: 1,
  },

  getters: {
    tracking_type: state => state.tracking_type,
    source_type: state => state.source_type,
    advance_typeA: state => state.advance_typeA,
    advance_typeB: state => state.advance_typeB,
    cur_advance_type: state => state.cur_advance_type,
    link_id_A: state => state.link_id_A,
    link_id_B: state => state.link_id_B,
    link_list_A: state => state.link_list_A,
    link_list_B: state => state.link_list_B,
    common_link_id: state => state.common_link_id,
    selected_only: state => state.selected_only,
    taz_only: state => state.taz_only,

    table_select: state => state.table_select,
  },

  mutations: {
    updataTrackingType(state, payload) {
      state.tracking_type = payload;
    },
    updataSourceType(state, payload) {
      state.source_type = payload;
      // state.source_type = Object.assign({},state.source_type,payload);
    },
    updataAdvanceA(state, payload) {
      state.advance_typeA = payload;
    },
    updataAdvanceB(state, payload) {
      state.advance_typeB = payload;
    },
    updataCurAdvanceType(state, payload) {
      state.cur_advance_type = payload;
    },
    updateLinkIdA(state, payload) {
      state.link_id_A = payload;
    },
    updateLinkIdB(state, payload) {
      state.link_id_B = payload;
    },
    updateLinkListA(state, payload) {
      state.link_list_A = payload;
    },
    updateCommonLinkId(state, payload) {
      state.common_link_id = payload;
    },
    updateLinkListB(state, payload) {
      state.link_list_B = payload;
    },
    updateSelectedOnly(state, payload) {
      state.selected_only = payload;
    },
    updateTazOnly(state, payload) {
      state.taz_only = payload;
    },
    updateTableSelect(state, payload) {
      state.table_select = payload;
    }
  },

}

