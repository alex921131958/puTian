/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import utilHelper from '../../util/util-helper'
import Vue from 'vue'

export default class settingSaveHandler {
  constructor(_view) {
    this._view = _view;
  }

  savePanelSetting(menu){
    switch (menu) {
      case 'carTraffic-1':
        this.saveCarTraffic_1(menu);
        break;
      case 'carTraffic-2':
        this.saveCarTraffic_2(menu);
        break;
      case 'carTraffic-3':
        this.saveCarTraffic_3(menu);
        break;
      case 'carTraffic-4':
        this.saveCarTraffic_4(menu);
        break;
      case 'carTraffic-5':
        this.saveCarTraffic_5(menu);
        break;
      case 'carTraffic-6':
        this.saveCarTraffic_6(menu);
        break;

      case 'cmnTraffic-1':
        this.saveBusTraffic_1(menu);
        break;
      case 'cmnTraffic-3':
        this.saveBusTraffic_3(menu);
        break;

      case 'personTrip-1':
        this.savePersonTrip_1(menu);
        break;
      case 'personTrip-2':
        this.savePersonTrip_2(menu);
        break;
      case 'personTrip-3':
        this.savePersonTrip_3(menu);
        break;
      case 'personTrip-4':
        this.savePersonTrip_4(menu);
        break;
        case 'personTrip-5':
        this.savePersonTrip_5(menu);
        break;
      default:                            //这里default用于通用表头处理
        break;
    }
  }

  saveCarTraffic_1(menu){
    let _this = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let linkType = this._view.map_click_disabled&&this._view.panel_v_type===0 ? 'taz':this._view.map_click_disabled&&this._view.panel_v_type===1?'vil':'link';   //建成区/自定义
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    let linkList = this._view.link_list;
    let villageList = this._view.panel_village;
    let links = '';
    if(this._view.map_click_disabled && this._view.panel_v_type===0 && this._view.global_area.value){
      links = this._view.global_area.value+'#'+this._view.global_area.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===1 && villageList.length > 0){
      villageList.map((village,index) => {
        links+=index === 0?`${village.id}#${village.name}`:`+${village.id}#${village.name}`;
      })
    }else if(!this._view.map_click_disabled && linkList.length > 0){
      linkList.map((link,index) => {
        links+=index === 0?`${link.id}#${link.name}#${link.len}`:`+${link.id}#${link.name}#${link.len}`;
      })
    }else{
      links = '';
    }
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,linktype,links,timefollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${linkType},${links},${timeFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{linktype:linkType},{links:links},{globaltime:timeFollow===1?true:false});
        _this._view.updateCarTraffic1(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  saveCarTraffic_2(menu){
    let _this = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let linkType = this._view.map_click_disabled&&this._view.panel_v_type===0 ? 'taz':this._view.map_click_disabled&&this._view.panel_v_type===1?'vil':'link';  //建成区/自定义/link
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    let linkList = this._view.link_list;
    let links = '';
    let villageList = this._view.panel_village;
    if(this._view.map_click_disabled && this._view.panel_v_type===0 && this._view.global_area.value){
      links = this._view.global_area.value+'#'+this._view.global_area.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===1 && villageList.length > 0){
      villageList.map((village,index) => {
        links+=index === 0?`${village.id}#${village.name}`:`+${village.id}#${village.name}`;
      })
    }else if(!this._view.map_click_disabled && linkList.length > 0){
      linkList.map((link,index) => {
        links+=index === 0?`${link.id}#${link.name}#${link.len}`:`+${link.id}#${link.name}#${link.len}`;
      })
    }else{
      links = '';
    }
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,linktype,links,timefollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${linkType},${links},${timeFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{linktype:linkType},{links:links},{globaltime:timeFollow===1?true:false});
        _this._view.updateCarTraffic2(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  saveCarTraffic_3(menu){
    let _this = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let flowMax = this._view.flow_range_max;
    let flowMin = this._view.flow_range_min;
    let linkType = this._view.map_click_disabled&&this._view.panel_v_type===0 ? 'taz':this._view.map_click_disabled&&this._view.panel_v_type===1?'vil':'link';  //建成区/自定义/link
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    let linkList = this._view.link_list;
    let links = '';
    let villageList = this._view.panel_village;
    if(this._view.map_click_disabled && this._view.panel_v_type===0 && this._view.global_area.value){
      links = this._view.global_area.value+'#'+this._view.global_area.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===1 && villageList.length > 0){
      villageList.map((village,index) => {
        links+=index === 0?`${village.id}#${village.name}`:`+${village.id}#${village.name}`;
      })
    }else if(!this._view.map_click_disabled && linkList.length > 0){
      linkList.map((link,index) => {
        links+=index === 0?`${link.id}#${link.name}#${link.len}`:`+${link.id}#${link.name}#${link.len}`;
      })
    }else{
      links = '';
    }
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,flowmax,flowmin,linktype,links,timefollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${flowMax},${flowMin},${linkType},${links},${timeFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{flowmax:flowMax},{flowmin:flowMin},{linktype:linkType},{links:links},{globaltime:timeFollow===1?true:false});
        _this._view.updateCarTraffic3(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  saveCarTraffic_4(menu){
    let _this = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let flowMax = this._view.flow_range_max;
    let flowMin = this._view.flow_range_min;
    let linkType = this._view.map_click_disabled&&this._view.panel_v_type===0 ? 'taz':this._view.map_click_disabled&&this._view.panel_v_type===1?'vil':'link';  //建成区/自定义/link
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    let linkList = this._view.link_list;
    let links = '';
    //溯源类型 多选
    let sourceType = this._view.source_type.split(",").length > 1?this._view.source_type.split(",").join("#"):this._view.source_type;
    let villageList = this._view.panel_village;
    if(this._view.map_click_disabled && this._view.panel_v_type===0 && this._view.global_area.value){
      links = this._view.global_area.value+'#'+this._view.global_area.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===1 && villageList.length > 0){
      villageList.map((village,index) => {
        links+=index === 0?`${village.id}#${village.name}`:`+${village.id}#${village.name}`;
      })
    }else if(!this._view.map_click_disabled && linkList.length > 0){
      linkList.map((link,index) => {
        links+=index === 0?`${link.id}#${link.name}#${link.len}`:`+${link.id}#${link.name}#${link.len}`;
      })
    }else{
      links = '';
    }

    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,flowmax,flowmin,linktype,links,sourcetype,timefollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${flowMax},${flowMin},${linkType},${links},${sourceType},${timeFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{flowmax:flowMax},{flowmin:flowMin},{linktype:linkType},{links:links},{sourcetype:sourceType},{globaltime:timeFollow===1?true:false});
        _this._view.updateCarTraffic4(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  saveCarTraffic_5(menu){
    let _this = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let crossIcon = this._view.cross_icon;
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,crossIcon',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${crossIcon}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{crossIcon:crossIcon});
        _this._view.updateCarTraffic5(tempObj);
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }


  saveCarTraffic_6(menu){
    let _this = this;
    //初始化
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let rangeMin = this._view.rangeMin;
    let rangeMax = this._view.rangeMax;
    let carOd_curShow = this._view.carOd_curShow === '全部' ? '全部' : this._view.carOd_curShow === '仅期望线' ? '仅期望线' : this._view.carOd_curShow === '仅小区'?'仅小区':'全部';
    let grid_heatmap = this._view.grid_heatmap['carTraffic-6'];
    let villageType = this._view.villageMethod === '全局' ? 'taz':'link';   //建成区/自定义
    let carOd_curExpectation = this._view.carOd_curExpectation;  //期望线类型
    let carOdColor = this._view.carOdColor;
    let carOd_curDisplay = this._view.carOd_curDisplay;     //小区出行强度
    let villageList = this._view.village_list;
    let villages = '';
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    let vilFollow = this._view.villageMethod === '全局' ? 1:0;   //是否跟随全局小区

    if (this._view.villageMethod === '全局' && this._view.global_area.value && this._view.global_v_type === 0) {
      villages = this._view.global_area.value+'#'+this._view.global_area.label
    }else if (this._view.villageMethod && villageList.length>0){
      villageList.map((item,index)=> {
        villages+=index === 0 ? `${item.id}#${item.name}`:`+${item.id}#${item.name}`;
      })
    } else {
      let villages = '';
    }
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,rangeMin,rangeMax,carOd_curShow,carOd_curExpectation,carOdColor,carOd_curDisplay,villageType,villages,grid_heatmap,timefollow,vilfollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${rangeMin},${rangeMax},${carOd_curShow},${carOd_curExpectation},${carOdColor},${carOd_curDisplay},${villageType},${villages},${grid_heatmap},${timeFollow},${vilFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{rangeMin:rangeMin},{rangeMax:rangeMax},{carOd_curShow:carOd_curShow},{carOd_curExpectation:carOd_curExpectation},{carOdColor:carOdColor},{carOd_curDisplay:carOd_curDisplay},{villageType:villageType},{villages:villages},{grid_heatmap:grid_heatmap},{globaltime:timeFollow===1?true:false},{globalvil:vilFollow===1?true:false});
        _this._view.updateCarTraffic6(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
        _this._view.updateVilFollow({
          id:menu,
          globalvil:vilFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });

  }

  savePersonTrip_1(menu){
    let _this = this;
    //初始化
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let expMin = this._view.exp_min;
    let expMax = this._view.exp_max;
    let display_mode = this._view.display_mode === '全部' ? '全部' : this._view.display_mode === '仅期望线' ? '仅期望线' : this._view.display_mode === '仅小区'?'仅小区':'全部';
    let grid_heatmap = this._view.grid_heatmap['personTrip-1'];
    // let villageType = this._view.villageMethod === '全局' ? 'taz':'link';   //建成区/自定义
    let villageType = (this._view.villageMethod === '全局'&&this._view.global_v_type === 0)?'taz':'link';
    let travel_sel = this._view.travel_sel;
    let colorSel = this._view.colorSel;
    let distance_type = this._view.distance_type;
    let villageList = this._view.village_list;
    let villages = '';
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    // let vilFollow = this._view.villageMethod === '全局' ? 1:0;   //是否跟随全局小区
    let vilFollow = (this._view.villageMethod === '全局' && this._view.overAll) ? 1:0;   //是否跟随全局小区

    if (this._view.villageMethod === '全局' && this._view.global_area && this._view.global_v_type === 0) {
      villages = this._view.global_area.value+'#'+this._view.global_area.label
    }else if (this._view.villageMethod && villageList.length>0){
      villageList.map((item,index)=> {
        villages+=index === 0 ? `${item.id}#${item.name}`:`+${item.id}#${item.name}`;
      })
    } else {
      let villages = '';
    }
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,expMin,expMax,display_mode,travel_sel,colorSel,distance_type,villageType,villages,grid_heatmap,timefollow,vilfollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${expMin},${expMax},${display_mode},${travel_sel},${colorSel},${distance_type},${villageType},${villages},${grid_heatmap},${timeFollow},${vilFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{expMin:expMin},{expMax:expMax},{display_mode:display_mode},{travel_sel:travel_sel},{colorSel:colorSel},{distance_type:distance_type},{villageType:villageType},{villages:villages},{grid_heatmap:grid_heatmap},{globaltime:timeFollow===1?true:false},{globalvil:vilFollow===1?true:false});
        _this._view.updatePersonTrip1(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1
        });
        _this._view.updateVilFollow({
          id:menu,
          globalvil:vilFollow === 1
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  savePersonTrip_2(menu){
    let _this = this;
    //初始化
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let grid_heatmap = this._view.grid_heatmap['personTrip-2'];
    let villageType = this._view.villageMethod === '全局' ? 'taz':'link';   //建成区/自定义
    let villageList = this._view.village_list;
    let villages = '';
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    // let vilFollow = this._view.villageMethod === '全局' ? 1:0;   //是否跟随全局小区
    let vilFollow = (this._view.villageMethod === '全局' && this._view.overAll_2) ? 1:0;   //是否跟随全局小区

    if (this._view.villageMethod === '全局' && this._view.global_area.value && this._view.global_v_type === 0) {
      villages = this._view.global_area.value+'#'+this._view.global_area.label
    }else if (this._view.villageMethod && villageList.length>0){
      villageList.map((item,index)=> {
        villages+=index === 0 ? `${item.id}#${item.name}`:`+${item.id}#${item.name}`;
      })
    } else {
      let villages = '';
    }

    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,villageType,villages,grid_heatmap,timefollow,vilfollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${villageType},${villages},${grid_heatmap},${timeFollow},${vilFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{villageType:villageType},{villages:villages},{grid_heatmap:grid_heatmap},{globaltime:timeFollow===1?true:false},{globalvil:vilFollow===1?true:false});
        _this._view.updatePersonTrip2(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
        _this._view.updateVilFollow({
          id:menu,
          globalvil:vilFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  savePersonTrip_3(menu){
    let _this = this;
    //初始化
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let traver_analy = this._view.traver_analy;
    let grid_heatmap = this._view.grid_heatmap['personTrip-3'];
    let villageType = this._view.villageMethod === '全局' ? 'taz':'link';   //建成区/自定义
    let villageList = this._view.village_list;
    let villages = '';
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    // let vilFollow = this._view.villageMethod === '全局' ? 1:0;   //是否跟随全局小区
    let vilFollow = (this._view.villageMethod === '全局' && this._view.overAll_3) ? 1:0;   //是否跟随全局小区

    if (this._view.villageMethod === '全局' && this._view.global_area && this._view.global_area.value && this._view.global_v_type === 0) {
      villages = this._view.global_area.value+'#'+this._view.global_area.label
    }else if (this._view.villageMethod && villageList.length>0){
      villageList.map((item,index)=> {
        villages+=index === 0 ? `${item.id}#${item.name}`:`+${item.id}#${item.name}`;
      })
    } else {
      let villages = '';
    }

    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,traver_analy,villageType,villages,grid_heatmap,timefollow,vilfollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${traver_analy},${villageType},${villages},${grid_heatmap},${timeFollow},${vilFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{traver_analy:traver_analy},{villageType:villageType},{villages:villages},{grid_heatmap:grid_heatmap},{globaltime:timeFollow===1?true:false},{globalvil:vilFollow===1?true:false});
        _this._view.updatePersonTrip3(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
        _this._view.updateVilFollow({
          id:menu,
          globalvil:vilFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  savePersonTrip_4(menu){
    let _this = this;
    //初始化
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let residence_list = this._view.residence_list;
    let grid_heatmap = this._view.grid_heatmap['personTrip-4'];
    let villageType = this._view.villageMethod === '全局' ? 'taz':'link';   //建成区/自定义
    let villageList = this._view.village_list;
    let villages = '';
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    // let vilFollow = this._view.villageMethod === '全局' ? 1:0;   //是否跟随全局小区
    let vilFollow = (this._view.villageMethod === '全局' && this._view.overAll_4) ? 1:0;   //是否跟随全局小区

    if (this._view.villageMethod === '全局' && this._view.global_area.value && this._view.global_v_type === 0) {
      villages = this._view.global_area.value+'#'+this._view.global_area.label
    }else if (this._view.villageMethod && villageList.length>0){
      villageList.map((item,index)=> {
        villages+=index === 0 ? `${item.id}#${item.name}`:`+${item.id}#${item.name}`;
      })
    } else {
      let villages = '';
    }

    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,residence_list,villageType,villages,grid_heatmap,timefollow,vilfollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${residence_list},${villageType},${villages},${grid_heatmap},${timeFollow},${vilFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{residence_list:residence_list},{villageType:villageType},{villages:villages},{grid_heatmap:grid_heatmap},{globaltime:timeFollow===1?true:false},{globalvil:vilFollow===1?true:false});
        _this._view.updatePersonTrip4(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
        _this._view.updateVilFollow({
          id:menu,
          globalvil:vilFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  savePersonTrip_5(menu){
    let _this = this;
    //初始化
    let tempObj = {};
    let panelTime = this._view.panel_time;

    let adminOption = this._view.adminOption;                 //分析内容
    let display_mode_build = this._view.display_mode_build;   //建成区OD显示模式
    let colorSel = this._view.colorSel;                       //期望线颜色
    let travel_sel =this._view.travel_sel;                    //出行强度显示内容
    let distance_type = this._view.distance_type;             //期望线类型
    let ids = '';
    if (this._view.adminOption === '建成区OD分析'&& this._view.buildArea_sel){
      ids = this._view.buildArea_sel
    }else if (this._view.adminOption === '区县OD分析'&& this._view.adminArea_sel){
      ids = this._view.adminArea_sel
    }else {
      ids = ''
    }
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    // let vilFollow = this._view.villageMethod === '全局' ? 1:0;   //是否跟随全局小区
    let vilFollow = (this._view.villageMethod === '全局' && this._view.overAll_5) ? 1:0;   //是否跟随全局小区

    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,adminOption,display_mode_build,colorSel,travel_sel,distance_type,ids,timefollow,vilfollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${adminOption},${display_mode_build},${colorSel},${travel_sel},${distance_type},${ids},${timeFollow},${vilFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{adminOption:adminOption},{display_mode_build:display_mode_build},{colorSel:colorSel},{travel_sel:travel_sel},{distance_type:distance_type},{ids:ids},{globaltime:timeFollow===1?true:false},{globalvil:vilFollow===1?true:false});
        _this._view.updatePersonTrip5(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
        _this._view.updateVilFollow({
          id:menu,
          globalvil:vilFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  saveBusTraffic_1(menu){
    let _this = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let roadSelType = this._view.road_sel_type;
    let speedType = this._view.bus_speed_type;
    let BusId = this._view.cur_bus_line?this._view.cur_bus_line.value:'';
    let linkType = this._view.map_click_disabled&&this._view.panel_v_type===0 ? 'taz':this._view.map_click_disabled&&this._view.panel_v_type===1?'vil':'link';  //建成区/自定义/link
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    let linkList = this._view.link_list;
    let links = '';
    let villageList = this._view.panel_village;
    if(roadSelType === 'line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)){
      //TODO:根据新接口说明传参，新增公交线路
      links = this._view.cur_bus_line.value+'#'+this._view.cur_bus_line.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===0 && this._view.global_area.value){
      links = this._view.global_area.value+'#'+this._view.global_area.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===1 && villageList.length > 0){
      villageList.map((village,index) => {
        links+=index === 0?`${village.id}#${village.name}`:`+${village.id}#${village.name}`;
      })
    }else if(!this._view.map_click_disabled && linkList.length > 0){
      linkList.map((link,index) => {
        links+=index === 0?`${link.id}#${link.name}#${link.len}`:`+${link.id}#${link.name}#${link.len}`;
      })
    }else{
      links = '';
    }
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,roadtype,linktype,speedtype,links,timefollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${roadSelType},${linkType},${speedType},${links},${timeFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{roadtype:roadSelType},{linktype:linkType},{speedtype:speedType},{links:links},{globaltime:timeFollow===1?true:false});
        _this._view.updateCmnTraffic1(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

  saveBusTraffic_3(menu){
    let _this = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let flowMax = this._view.flow_range_max;
    let flowMin = this._view.flow_range_min;
    let roadSelType = this._view.road_sel_type;
    let BusId = this._view.cur_bus_line?this._view.cur_bus_line.value:'';
    let linkType = this._view.map_click_disabled&&this._view.panel_v_type===0 ? 'taz':this._view.map_click_disabled&&this._view.panel_v_type===1?'vil':'link';  //建成区/自定义/link
    let timeFollow = this._view.global_time_follow ? 1:0;   //是否跟随全局时间
    let linkList = this._view.link_list;
    let links = '';
    let villageList = this._view.panel_village;
    if(roadSelType === 'line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)){
      //TODO:根据新接口说明传参，新增公交线路
      links = this._view.cur_bus_line.value+'#'+this._view.cur_bus_line.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===0 && this._view.global_area.value){
      links = this._view.global_area.value+'#'+this._view.global_area.label
    }else if(this._view.map_click_disabled && this._view.panel_v_type===1 && villageList.length > 0){
      villageList.map((village,index) => {
        links+=index === 0?`${village.id}#${village.name}`:`+${village.id}#${village.name}`;
      })
    }else if(!this._view.map_click_disabled && linkList.length > 0){
      linkList.map((link,index) => {
        links+=index === 0?`${link.id}#${link.name}#${link.len}`:`+${link.id}#${link.name}#${link.len}`;
      })
    }else{
      links = '';
    }
    this._view.$http.post(MYCONF.service.saveSettings+`?token=${sessionStorage.getItem('token')}`, {
      menuid:menu,
      keys:'year,season,datetag,hour,flowmax,flowmin,roadtype,linktype,links,timefollow',
      values:`${panelTime.year},${panelTime.season},${panelTime.datetag},${panelTime.hour},${flowMax},${flowMin},${roadSelType},${linkType},${links},${timeFollow}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        tempObj = Object.assign(panelTime,{flowmax:flowMax},{flowmin:flowMin},{roadtype:roadSelType},{linktype:linkType},{links:links},{globaltime:timeFollow===1?true:false});
        _this._view.updateCmnTraffic3(tempObj);
        _this._view.updateTimeFollow({
          id:menu,
          globaltime:timeFollow === 1 ? true : false
        });
      }
    }, response => {
      _this._view.$Message.success({
        content: '保存失败，请重试',
        closable: true
      });
    });
  }

}
