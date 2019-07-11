/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import Vue from 'vue'
import eventBus from '../../util/event-bus'
import MapCommonLayer from "../map/mapCommonLayer";

export default class dataBasicHandler {
  constructor(_view) {
    this._view = _view;
  }

  getBasicData() {
    let _this = this;
    let curMenu = _this._view.cur_menu.id;
    switch (curMenu) {
      case'carTraffic-1':
        this.getCarTraffic_1();
        break;
      case'carTraffic-2':
        this.getCarTraffic_2();
        break;
      case'carTraffic-3':
        this.getCarTraffic_3();
        break;
      case'carTraffic-4':
        // if(this._view.tracking_type === 'advance'){
        //   this.getCarTraffic_4_advanced();
        // }else{
        //   this.getCarTraffic_4();
        // }
        break;
      case'carTraffic-5':
        break;

      case'cmnTraffic-1':
        this.getCmnTraffic_1();
        break;
      case'cmnTraffic-3':
        this.getCmnTraffic_3();
        break;
      case'personTrip-1':
        this.getPersonTrip_1();
        break;
      case'personTrip-2':
        this.getPersonTrip_2();
        break;
      case'personTrip-3':
        this.getPersonTrip_3();
        break;
      case'personTrip-4':
        this.getPersonTrip_4();
        break;
      case'personTrip-5':
        this.getPersonTrip_5();
        break;
      default:
        break;
    }
  }

  getCarTraffic_1(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.carTraffic_1_base}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      let res = response.body.result;
      _this._view.count_1 = res.speed ? res.speed:'-';
      _this._view.count_2 = res.index ? res.index:'-';
      if(!res.speed && !res.index){
        _this._view.$Message.warning({
          content: response.body.msg,
          duration: 5,
          closable: true
        });
      }
    })
  }

  getCarTraffic_2(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.carTraffic_2_base}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      _this._view.count_1 = response.alJampLinkLength ? response.alJampLinkLength:'-';
      _this._view.count_2 = response.alJampRatio ? response.alJampRatio:'-';
    })
  }

  getCarTraffic_3(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let tazid = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value : '';  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? ''
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let taz_id = this._view.selected_only?tazid:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.carTraffic_3_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&tazid=${taz_id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      _this._view.count_1 = response&&response.flowAvgResult[0].mainRoadAverage ? parseFloat(response.flowAvgResult[0].mainRoadAverage.toFixed(1)):'-';
      _this._view.count_2 = response&&response.flowAvgResult[0].subRoadAverage ? parseFloat(response.flowAvgResult[0].subRoadAverage.toFixed(1)):'-';
      _this._view.count_1_km = response&&response.carkmTotalResult[0].primaryUnit ? parseFloat(response.carkmTotalResult[0].primaryUnit).toFixed(1):'-';
      _this._view.count_2_km = response&&response.carkmTotalResult[0].secondaryUnit ? parseFloat(response.carkmTotalResult[0].secondaryUnit).toFixed(1):'-';
    })
  }

  getCarTraffic_4(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let id = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let hour = time.hour;    //转格式-08
    // let dataSource = this._view.source_type;
    let linktag = this._view.source_type;
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    let url = `${MYCONF.service.carTraffic_4_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&linktag=${linktag}&id=${id}&token=${token}`;
    this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then(response => {
      response = response.body;
      if(response.flowAverage){
        _this._view.updateGlobalLoading(false);
        _this._view.count_1 = response.tripRatio?parseFloat((response.tripRatio*100).toFixed(1)):'-';
        _this._view.count_2 = response.flowAverage?parseFloat(response.flowAverage.toFixed(2)):'-';
      }
    })
  }

  getCarTraffic_4_advanced(){
    let _this = this;
    let time = this._view.panel_time;
    // let token = this._view.token;
    let token = sessionStorage.getItem("token");
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    let dataSource1 = this._view.map_click_disabled&&this._view.panel_v_type===1&&this._view.click_disabled_type==='A'? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0&&this._view.click_disabled_type==='A'?1: 0;
    let dataSource2 = this._view.map_click_disabled&&this._view.panel_v_type===1&&this._view.click_disabled_type==='B'? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0&&this._view.click_disabled_type==='B'?1: 0;
    let linkids1 = dataSource1===1?this._view.global_area.value:this._view.link_id_A.length>0 ? this._view.link_id_A.join(","):dataSource1===2?this._view.panel_village_id.join(","):'';
    let linkids2 = dataSource2===1?this._view.global_area.value:this._view.link_id_B.length>0 ? this._view.link_id_B.join(","):dataSource2===2?this._view.panel_village_id.join(","):'';
    let hour = time.hour;    //转格式-08
    let advanceA = this._view.advance_typeA;
    let advanceB = this._view.advance_typeB;

    let url = `${MYCONF.service.carTraffic_4_base_advanced}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&linktag1=${advanceA}&dataSource1=${dataSource1}&id1=${linkids1}&linktag2=${advanceB}&dataSource2=${dataSource2}&id2=${linkids2}&token=${token}`;
    this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then(response => {
      response = response.body;
      if(response.flowAverage){
        _this._view.updateGlobalLoading(false);
        _this._view.count_1 = response.tripRatio?parseFloat((response.tripRatio*100).toFixed(1)):'-';
        _this._view.count_2 = response.flowAverage?parseFloat(response.flowAverage.toFixed(2)):'-';
      }
    })
  }

  //9.26  小汽车od
  getCarTraffic_6(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let odType = this._view.distance_type;
    let id = '';
    let dataSource = 0;
    if (this._view.villageMethod === '全局' && this._view.global_v_type === 0) {
      dataSource = 1;
      id = this._view.global_area.value;
    }else {
      dataSource = 0;
      id = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
    }
    let url = `${MYCONF.service.personTrip_1_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&odType=o&&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      let count1 = (response.odsum/10000).toFixed(2);
      let count2 = (response.odRatio*100).toFixed(2);
      _this._view.count_1 = parseFloat(count1);
      _this._view.count_2 = parseFloat(count2);
    })
  }

  getCmnTraffic_1(){
    let _this = this;
    let param = {
      token: sessionStorage.getItem('token'),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      datetag: this._view.panel_time.datetag,
      hour: this._view.panel_time.hour,
      dataSource: this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :
        this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0,
      id:this._view.selected_only && this._view.road_sel_type==='road'?
        (this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
          :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
            :this._view.link_id.length>0 ? this._view.link_id.join(",")
              : ''):'',
      trackId: this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)?
        this._view.cur_bus_line.value:'',
      filtertag: this._view.taz_only? 1:0
    };
    let url = MYCONF.service.cmnTraffic_1_base +'?'+ MapCommonLayer.urlHandle(param);
    this._view.$http.get(url).then(response => {
      if (response){
        response = response.body;
        _this._view.count_1 = response.speedavg ? parseFloat(response.speedavg.toFixed(1)):'-';
      }
    })
  }

  getCmnTraffic_3(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only && this._view.road_sel_type==='road'?linkids:'';
    let trackId = this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)?this._view.cur_bus_line.value:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.cmnTraffic_3_base}?year=${time.year}&season=${time.season}&hour=${hour}&dataSource=${dataSource}&datetag=${time.datetag}&id=${id}&trackId=${trackId}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      _this._view.count_1 = response.flowavg ? parseFloat(response.flowavg.toFixed(1)):'-';
      _this._view.count_2 = response.buskm ? parseFloat(response.buskm.toFixed(1)):'-';
    })
  }

  getPersonTrip_1(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let odType = this._view.distance_type;
    let id = null;
    let dataSource = 0;
    if (this._view.overAll){
      if (this._view.villageMethod === '全局' && this._view.global_v_type === 0) {
        dataSource = 1;
        id = this._view.global_area.value;   //建成区id
      }else {
        dataSource = 0;
        id = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
      }
    } else {
      id = '';
      dataSource = 0;
    }

    // let url = `${MYCONF.service.personTrip_1_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&odType=a&&id=${id}&token=${token}`;
    //对odType进行了修改 添加了o_sum d_sum od_sum
    let url = `${MYCONF.service.personTrip_1_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&odType=o_sum&&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      let count1 = (response.odsum/10000).toFixed(2);
      let count2 = (response.odratio).toFixed(2);
      _this._view.count_1 = parseFloat(count1);
      _this._view.count_2 = parseFloat(count2);
    })
  }

  getPersonTrip_2(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let id = null;
    let dataSource = 0;
    if (this._view.overAll_2){
      if (this._view.villageMethod === '全局' && this._view.global_v_type === 0) {
        dataSource = 1;
        id = this._view.global_area.value;   //建成区id
      }else {
        dataSource = 0;
        id = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
      }
    }else{
      id = '';
      dataSource = 0;
    }
    let url = `${MYCONF.service.personTrip_2_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      let count1 = response.peopleNum ?(response.peopleNum/10000).toFixed(2): '-';
      let count2 = response.peakRatio ?(response.peakRatio*100).toFixed(2): '-';
     /* _this._view.count_1 = parseFloat(count1);
      _this._view.count_2 = parseFloat(count2);*/
      _this._view.count_1 = count1;
      _this._view.count_2 = count2;
    })
  }

  getPersonTrip_3(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let id = null;
    let dataSource = 0;
    if (this._view.overAll_3){
      if (this._view.villageMethod === '全局' && this._view.global_v_type === 0) {
        dataSource = 1;
        id = this._view.global_area.value;   //建成区id
      }else {
        dataSource = 0;
        id = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
      }
    } else {
      id = '';
      dataSource = 0;
    }
    let url = `${MYCONF.service.personTrip_3_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      let count1 = (response.avgDistance).toFixed(2);
      let count2 = (response.avgTime).toFixed(2);
      _this._view.count_1 = parseFloat(count1);
      _this._view.count_2 = parseFloat(count2);
    })
  }

  getPersonTrip_4(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let id = null;
    let dataSource = 0;
    if (this._view.overAll_4){
      if (this._view.villageMethod === '全局' && this._view.global_v_type === 0) {
        dataSource = 1;
        id = this._view.global_area.value;   //建成区id
      }else {
        dataSource = 0;
        id = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
      }
    } else {
      id = '';
      dataSource = 0;
    }
    let url = `${MYCONF.service.personTrip_4_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      let count1 = (response.peopleSum/10000).toFixed(2);
      let count2 = (response.peakRatio*100).toFixed(2);
      _this._view.count_1 = parseFloat(count1);
      // _this._view.count_2 = parseFloat(count2);
    })
  }

  getPersonTrip_5(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let dataType = this._view.adminOption;
    let id = '';
      if (dataType==='建成区OD分析'){
        dataType = 0;
        id = !this._view.overAll_5 ? '': this._view.buildArea_sel? MapCommonLayer.setNameToTazId(this._view.buildArea_sel): '';
      }else {
        dataType = 1;
        id = !this._view.overAll_5? '': this._view.adminArea_sel? MapCommonLayer.setNameToAdminId(this._view.adminArea_sel): '';
      }

    let url = `${MYCONF.service.personTrip_5_base}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataType=${dataType}&odType=o&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      let count1 = (response.hoursum/10000).toFixed(2);
      let count2 = (response.sumRatio*100).toFixed(2);
      _this._view.count_1 = parseFloat(count1);
      _this._view.count_2 = parseFloat(count2);
    })
  }

  stopDiagramRequest(){
    let curRequest = this._view.curRequest;
    if (curRequest) {
      //TODO:中止请求
      curRequest.abort();
      /*this._view.$Message.warning({
        content: '已成功中止该请求',
        duration:3,
        closable: true
      });*/
      let _this = this;
      setTimeout(() => {
        _this._view.updateGlobalLoading(false);
      },500);
    }
  }

}
