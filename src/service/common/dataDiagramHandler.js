/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import MapCommonLayer from "../map/mapCommonLayer";

export default class dataDiagramHandler {
  constructor(_view) {
    this._view = _view;
  }
  getDiagramData(){
    let _this = this;
    let curMenu = _this._view.cur_menu.id;
    _this._view.myChart.clear();
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
        // if (this._view.tracking_type === 'advance') {
        //   this.getCarTraffic_4_advanced();
        // } else {
        //   this.getCarTraffic_4();
        // }
        break;
      case'carTraffic-5':
        break;
      case'carTraffic-6':
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

  initDiagramChart(obj,data){
    let _this = this;
    let curMenu = _this._view.cur_menu.id;
    switch (curMenu) {
      case'carTraffic-1':
        if(_this._view.sourceRange === 4){
          this.echartCarTraffic_2_city(obj);
        }else{
          this.echartCarTraffic_2(obj);
        }
        break;
      case'carTraffic-2':
        if(_this._view.sourceRange === 4){
          this.echartCarTraffic_2_city(obj);
        }else{
          this.echartCarTraffic_2(obj);
        }
        break;
      case'carTraffic-3':
        this.echartCarTraffic_3(obj);
        break;
      case'carTraffic-4':
        this.echartCarTraffic_4(obj);
        break;
      case'carTraffic-5':
        break;
      case'carTraffic-6':
        break;
      case'cmnTraffic-1':
        if(_this._view.sourceRange === 4){
          this.echartCarTraffic_2_city(obj);
        }else{
          this.echartCmnTraffic_1(obj);
        }
        break;
      case'cmnTraffic-3':
        if(_this._view.sourceRange === 4){
          this.echartCarTraffic_2_city(obj);
        }else{
          this.echartCmnTraffic_1(obj);
        }
        break;
      case'personTrip-1':
        if (data === 1){
          this.echartPersonTrip_1(obj);
        } else if (data === 2){
          this.echartPersonTrip_11(obj);
        }
        break;
      case'personTrip-2':
        if (data === 1){
          this.echartPersonTrip_2(obj);
        } else if (data === 2){
          this.echartPersonTrip_22(obj);
        }
        break;
      case'personTrip-3':
        break;
      case'personTrip-4':
        break;
      default:
        break;
    }
  }

  // 路况分析数据
  getCarTraffic_1(){
    let _this = this;
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      highRoad:[],
      mainRoad:[],
      otherRoad:[]
    };
    let yAxis_obj_2 = {
      highRoad:[],
      mainRoad:[],
      otherRoad:[]
    };
    this._view.linkData = [];
    this._view.isTimeout = false;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let url_1 = `${MYCONF.service.carTraffic_1_echart}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    let url_2 = `${MYCONF.service.carTraffic_1_echart}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=4&id=${id}&token=${token}`;
    _this._view.$http.get(url_1).then(response => {
      response = response.body;
      if(response && response.length > 0){
        //todo 改为05 -23
        this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        this._view.legend = ["高速路","主次干道","支路及其它"];
        response.map((item) => {
          if(parseInt(item.caupd_kind) === 1){
            item.result.map((item) => {
              yAxis_obj_1.highRoad.push(item.index.toFixed(2));
              yAxis_obj_2.highRoad.push(item.speed.toFixed(2));
            });
          }else if(parseInt(item.caupd_kind) === 2){
            item.result.map((item) => {
              yAxis_obj_1.mainRoad.push(item.index.toFixed(2));
              yAxis_obj_2.mainRoad.push(item.speed.toFixed(2));
            });
          }else{
            item.result.map((item) => {
              yAxis_obj_1.otherRoad.push(item.index.toFixed(2));
              yAxis_obj_2.otherRoad.push(item.speed.toFixed(2));
            });
          }
        });
        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        let curData = _this._view.chartType===1?yAxis_obj_1:yAxis_obj_2;
        if(_this._view.sourceRange === 3) { _this.echartCarTraffic_2(curData);}
      }
      _this._view.isTimeout = true;
    });
    _this._view.$http.get(url_2).then(response => {
      response = response.body;
      if(response && response.length > 0){
        let series_1 = [];
        let series_2 = [];
        response.map((item) => {
          _this._view.legend_2.push(item.tazname);
          let indexData = [];
          let speedData = [];
          item.result.map((item) => {
            indexData.push(item.index.toFixed(2));
            speedData.push(item.speed.toFixed(2));
          });
          series_1.push({
            name:item.tazname,
            type:'line',
            smooth:true,
            data:indexData,
          });
          series_2.push({
            name:item.tazname,
            type:'line',
            smooth:true,
            data:speedData,
          });
          _this._view.yAxis_obj_3 = series_1;
          _this._view.yAxis_obj_4 = series_2;
          let curData = _this._view.chartType===1?series_1:series_2;
          if(_this._view.sourceRange === 4) _this.echartCarTraffic_2_city(curData);
        });
      }
      _this._view.isTimeout = true;
    })
  }

  // 拥堵识别数据
  getCarTraffic_2(){
    let _this = this;
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      highRoad:[],
      mainRoad:[],
      otherRoad:[]
    };
    let yAxis_obj_2 = {
      highRoad:[],
      mainRoad:[],
      otherRoad:[]
    };
    _this._view.linkData = [];
    _this._view.isTimeout = false;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let tazid = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value : '';  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let url_1 = `${MYCONF.service.carTraffic_2_echart}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    let url_2 = `${MYCONF.service.carTraffic_2_echart}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=4&id=${id}&token=${token}`;
    _this._view.$http.get(url_1).then(response => {
      response = response.body;
      if(response && response.length > 0){
        this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        this._view.legend = ["高速路","主次干道","支路及其它"];
        response.map((item) => {
          if(parseInt(item.caupd_kind) === 1){
            item.jampList.map((item) => {
              yAxis_obj_1.highRoad.push(item.length.toFixed(2));
            });
            item.jampRatioList.map((item) => {
              yAxis_obj_2.highRoad.push(item.jampRatio.toFixed(2));
            });
          }else if(parseInt(item.caupd_kind) === 2){
            item.jampList.map((item) => {
              yAxis_obj_1.mainRoad.push(item.length.toFixed(2));
            });
            item.jampRatioList.map((item) => {
              yAxis_obj_2.mainRoad.push(item.jampRatio.toFixed(2));
            });
          }else{
            item.jampList.map((item) => {
              yAxis_obj_1.otherRoad.push(item.length.toFixed(2));
            });
            item.jampRatioList.map((item) => {
              yAxis_obj_2.otherRoad.push(item.jampRatio.toFixed(2));
            });
          }
        });
        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        let curData = _this._view.chartType===1?yAxis_obj_1:yAxis_obj_2;
        if(_this._view.sourceRange === 3) { _this.echartCarTraffic_2(curData);}
      }else{
        // return;
      }
      _this._view.isTimeout = true;
    });
    _this._view.$http.get(url_2).then(response => {
      response = response.body;
      if(response && response.length > 0){
        this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        let series_1 = [];
        let series_2 = [];
        response.map((item) => {
          _this._view.legend_2.push(item.taz1name);
          let jampData = [];
          let jampRatio = [];
          item.jampList.map((item) => {
            jampData.push(item.length.toFixed(2));
          });
          series_1.push({
            name:item.taz1name,
            type:'line',
            smooth:true,
            data:jampData,
          });
          item.jampRatioList.map((item) => {
            jampRatio.push(item.jampRatio.toFixed(2));
          });
          series_2.push({
            name:item.taz1name,
            type:'line',
            smooth:true,
            data:jampRatio,
          });
          _this._view.yAxis_obj_3 = series_1;
          _this._view.yAxis_obj_4 = series_2;
          let curData = _this._view.chartType===1?series_1:series_2;
          if(_this._view.sourceRange === 4) _this.echartCarTraffic_2_city(curData);
        });
      }else{
        // return;
      }
      _this._view.isTimeout = true;
    })
  }

  //拥堵识别图表
  echartCarTraffic_2(obj){
    let _this = this;
    let curMenu = _this._view.cur_menu.id;
    let curType = _this._view.chartType;
    let name = (curMenu==='cmnTraffic-3'&& curType===1)?'pcu/h':(curMenu==='cmnTraffic-3'&& curType===2)?'vkt':(curMenu==='carTraffic-1'&& curType===1)?'':(curMenu==='carTraffic-1'&& curType===2)?'km/h':(curMenu==='carTraffic-2'&& curType===1)?'km':(curMenu==='carTraffic-2'&& curType===2)?'%':'';
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        show:true,
        trigger: 'axis',
        textStyle:{
          align:'left'
        }
      },
      legend: {
        data: _this._view.legend,
        bottom: -2,
      },
      xAxis: {
        name: 'h',
        nameLocation:'end',
        nameGap:5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        data: _this._view.xAxis_1
      },
      yAxis: {
        name: name,
        type: 'value',
        // name:this.yAxisTip,
        nameLocation:'end',
        nameGap:8,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        min: function(value) {
          return (curMenu==='carTraffic-1'&& curType===1)? value.min - 0.2 : (curMenu==='carTraffic-1'&& curType===2) ? value.min - 5:0;
        },
      },
      grid: {
        top: 20,
        left: 15,
        right:15,
        bottom: 40
      },
      series: [
        {
          name:'高速路',
          type:'line',
          smooth:true,
          data:obj.highRoad,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(231,66,58, 0.5)'},
                  {offset: 1, color: 'rgba(231,66,58, 0)'}
                ]),
            }
          },
        },
        {
          name:'主次干道',
          type:'line',
          smooth:true,
          data:obj.mainRoad,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(59,144,238, 0.5)'},
                  {offset: 1, color: 'rgba(59,144,238, 0)'}
                ]),
            }
          },
        },
        {
          name:'支路及其它',
          type:'line',
          smooth:true,
          data:obj.otherRoad,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(49,142,129, 0.5)'},
                  {offset: 1, color: 'rgba(49,142,129, 0)'}
                ]),
            }
          },
        }
      ]
    };
    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }
  //拥堵识别图表
  echartCarTraffic_2_city(obj){
    let _this = this;
    let curMenu = _this._view.cur_menu.id;
    let curType = _this._view.chartType;
    let name = curMenu==='cmnTraffic-1'?'km/h':(curMenu==='cmnTraffic-3'&& curType===1)?'辆':(curMenu==='cmnTraffic-3'&& curType===2)?'vkt':(curMenu==='carTraffic-1'&& curType===1)?'':(curMenu==='carTraffic-1'&& curType===2)?'km/h':(curMenu==='carTraffic-2'&& curType===1)?'km':(curMenu==='carTraffic-2'&& curType===2)?'%':'';
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        show:true,
        trigger: 'axis',
        confine:true,
        textStyle:{
          align:'left'
        }
      },
      legend: {
        data: _this._view.legend_2,
        bottom: -2,
        /*textStyle:{
          fontSize:'150%'
        }*/
      },
      xAxis: {
        name: 'h',
        nameLocation:'end',
        nameGap:5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        data: _this._view.xAxis_1
      },
      yAxis: {
        name: name,
        type: 'value',
        // name:this.yAxisTip,
        min: function(value) {
          return (curMenu==='carTraffic-1'&& curType===1)? value.min - 0.2 : (curMenu==='carTraffic-1'&& curType===2) ? parseInt(value.min - 5):0;
        },
        nameLocation:'end',
        nameGap:8,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
      },
      grid: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 60
      },
      series: obj
    };
    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  //公交速度图表
  echartCmnTraffic_1(obj){
    let _this = this;
    let curMenu = _this._view.cur_menu.id;
    let curType = _this._view.chartType;
    let name = (curMenu==='cmnTraffic-3'&& curType===1)?'辆':(curMenu==='cmnTraffic-3'&& curType===2)?'vkt': curMenu==='cmnTraffic-1'?'km/h':'';
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        show:true,
        trigger: 'axis',
        textStyle:{
          align:'left'
        }
      },
      legend: {
        data: _this._view.legend,
        bottom: -2,
      },
      xAxis: {
        name: 'h',
        nameLocation:'end',
        nameGap:5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        data: _this._view.xAxis_1
      },
      yAxis: {
        type: 'value',
        name: name,
        nameLocation:'end',
        nameGap:8,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
      },
      grid: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 40
      },
      series: [
        {
          name:'综合道路',
          type:'line',
          smooth:true,
          data:obj.avgRoad,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(231,66,58, 0.5)'},
                  {offset: 1, color: 'rgba(231,66,58, 0)'}
                ]),
            }
          },
        }
      ]
    };
    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  // 道路流量数据
  getCarTraffic_3(){
    let _this = this;
    this._view.xAxis_1 = [];
    this._view.legend = ["高速路","主次干道","支路及其它"];
    let yAxis_obj_1 = {
      highRoad:[],
      mainRoad:[],
      otherRoad:[]
    };
    let yAxis_obj_2 = {
      highRoad:[],
      mainRoad:[],
      otherRoad:[]
    };
    this._view.linkData = [];
    this._view.isTimeout = false;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let tazid = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value : '';  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===1&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :!this._view.map_click_disabled&&this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let taz_id = this._view.selected_only?tazid:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.carTraffic_3_echart}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&tazid=${taz_id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response && response.city && response.city.otherroad){
        _this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        let highRoad = response.city.highroad;
        let mainRoad = response.city.mainroad;
        let otherRoad = response.city.otherroad;
        highRoad.sort(function (a,b) {
          return (a.hour - b.hour)
        });
        mainRoad.sort(function (a,b) {
          return (a.hour - b.hour)
        });
        otherRoad.sort(function (a,b) {
          return (a.hour - b.hour)
        });
        highRoad.map((item) => {
          yAxis_obj_1.highRoad.push(item.flowavg);
          yAxis_obj_2.highRoad.push(item.kmtavg);
        });
        mainRoad.map((item) => {
          yAxis_obj_1.mainRoad.push(item.flowavg);
          yAxis_obj_2.mainRoad.push(item.kmtavg);
        });
        otherRoad.map((item) => {
          yAxis_obj_1.otherRoad.push(item.flowavg);
          yAxis_obj_2.otherRoad.push(item.kmtavg);
        });
        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        let curData = _this._view.chartType===1?yAxis_obj_1:yAxis_obj_2;
        _this.echartCarTraffic_3(curData);
      }else{
        // return;
      }
      _this._view.isTimeout = true;
    })
  }

  //全网流量图表初始化
  echartCarTraffic_3(obj){
    let _this = this;
    let name = _this._view.chartType===1?'pcu/h':'vkt';
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        show:true,
        trigger: 'axis',
        textStyle:{
          align:'left'
        }
      },
      legend: {
        data: _this._view.legend,
        bottom: -2,
      },
      xAxis: {
        name: 'h',
        nameLocation:'end',
        nameGap: 5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        data: _this._view.xAxis_1
      },
      yAxis: {
        name: name,
        nameTextStyle:{
          padding: [0,0,0,20]
        },
        type: 'value',
        // name:this.yAxisTip,
        nameLocation:'end',
        nameGap:10,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
      },
      grid: {
        top: 30,
        left: 15,
        right: 15,
        bottom: 40
      },
      series: [
        {
          name:'高速路',
          type:'line',
          smooth:true,
          data:obj.highRoad,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(231,66,58, 0.3)'},
                  {offset: 1, color: 'rgba(231,66,58, 0)'}
                ]),
            }
          },
        },
        {
          name:'主次干道',
          type:'line',
          smooth:true,
          data:obj.mainRoad,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(59,144,238, 0.3)'},
                  {offset: 1, color: 'rgba(59,144,238, 0)'}
                ]),
            }
          },
        },
        {
          name:'支路及其它',
          type:'line',
          smooth:true,
          data:obj.otherRoad,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(49,142,129, 0.3)'},
                  {offset: 1, color: 'rgba(49,142,129, 0)'}
                ]),
            }
          },
        }
      ]
    };
    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  // 公交速度
  getCmnTraffic_1(){
    let _this = this;
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      avgRoad:[],
    };
    let yAxis_obj_2 = JSON.parse(JSON.stringify(yAxis_obj_1));
    this._view.linkData = [];
    this._view.isTimeout = false;
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
    let url = MYCONF.service.cmnTraffic_1_echart +'?'+ MapCommonLayer.urlHandle(param);
    this._view.$http.get(url).then(response => {
      response = response.body;
      let city =response.city;
      if(city && city.length > 0){
        this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20'];
        // this._view.legend = ["高速路","主次干道","支路及其它"];
        this._view.legend = [];
        city.map((item) => {
          yAxis_obj_1.avgRoad.push(item.speedavg?item.speedavg.toFixed(2):0);
          yAxis_obj_2.avgRoad.push(item.subtractval?item.subtractval.toFixed(2):0);
        });
        this._view.yAxis_obj_1 = yAxis_obj_1;
        this._view.yAxis_obj_2 = yAxis_obj_2;
        if(_this._view.sourceRange === 3) { _this.echartCmnTraffic_1(this._view.bus_speed_type===0?yAxis_obj_1:yAxis_obj_2);}
      }

      let tazData = response.taz;
      if(tazData){
        _this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20'];
        let series_1 = [];
        let series_2 = [];
        let tazList = Object.keys(tazData);
        for(let i=0;i<tazList.length;i++){
          let tazItem = tazList[i];
          let taz = tazData[tazItem];
          _this._view.legend_2.push(tazData[tazItem][0].tazname);

          let speedAvg = [];
          let vktSpeed = [];
          taz.map((item) =>{
            speedAvg.push(item.speedavg?item.speedavg.toFixed(2):0);
            vktSpeed.push(item.subtractVal?item.subtractVal.toFixed(2):0);
          });
          series_1.push({
            name:tazData[tazItem][0].tazname,
            type:'line',
            smooth:true,
            data:speedAvg,
          });
          series_2.push({
            name:tazData[tazItem][0].tazname,
            type:'line',
            smooth:true,
            data:vktSpeed,
          });
        }
        _this._view.yAxis_obj_3 = series_1;
        _this._view.yAxis_obj_4 = series_2;
        if(_this._view.sourceRange === 4) _this.echartCarTraffic_2_city(this._view.bus_speed_type===0?series_1:series_2);
      }
      _this._view.isTimeout = true;
    });
  }

  // 公交流量
  getCmnTraffic_3(){
    let _this = this;
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      avgRoad:[]
    };
    let yAxis_obj_2 = JSON.parse(JSON.stringify(yAxis_obj_1));
    this._view.linkData = [];
    this._view.isTimeout = false;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only && this._view.road_sel_type==='road'?linkids:'';
    let trackId = this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)?
      this._view.cur_bus_line.value :'';
    let hour = time.hour;    //转格式-08
    let url_1 = `${MYCONF.service.cmnTraffic_3_echart}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&id=${id}&trackId=${trackId}&token=${token}`;
    this._view.$http.get(url_1).then(response => {
      response = response.body;
      if(response){
        _this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20'];
        this._view.legend = ["综合道路"];
        if(response.city){
          let cityData = response.city;
          cityData.CityLineChart.sort(function (a,b) {
            return (a.hour - b.hour)
          });
          cityData.CityLineChart.map(item=>{
            yAxis_obj_1.avgRoad.push(item.pcu_perh.toFixed(2));
            yAxis_obj_2.avgRoad.push(item.vkt_sum.toFixed(2));
          })
        }
        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        let curData = _this._view.chartType === 1 ? yAxis_obj_1 : yAxis_obj_2;
        if(_this._view.sourceRange === 3) { _this.echartCmnTraffic_1(curData);}

        if(response.taz){
          let tazData = response.taz;
          _this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20'];
          let series_1 = [];
          let series_2 = [];
          let tazList = Object.keys(tazData);

          for(let i=0;i<tazList.length;i++){
            let tazItem = tazList[i];
            let taz = tazData[tazItem];

            let speedAvg = [];
            let busKm = [];
            taz.map((item) =>{
              speedAvg.push(item.speedavg?item.speedavg.toFixed(2):0);
              busKm.push(item.buskm?item.buskm.toFixed(2):0);
            });
            series_1.push({
              name:tazData[tazItem][0].tazname,
              type:'line',
              smooth:true,
              data:speedAvg,
            });
            series_2.push({
              name:tazData[tazItem][0].tazname,
              type:'line',
              smooth:true,
              data:busKm,
            });
          }
          _this._view.yAxis_obj_3 = series_1;
          _this._view.yAxis_obj_4 = series_2;
          let curData = _this._view.chartType===1?series_1:series_2;
          if(_this._view.sourceRange === 4) _this.echartCarTraffic_2_city(curData);
        }
      }else{
        // return;
      }
      _this._view.isTimeout = true;
    });
  }


  //基础溯源数据
  getCarTraffic_4(){
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      tripflow:[],
      linkflow:[],
      num:[],
      linkid:[],
      tooltip: [],
      name: []
    };
    let yAxis_obj_2 = {
      tripflow:[],
      linkflow:[],
      num:[],
      linkid:[],
      tooltip: [],
      name: []
    };

    let _this = this;
    let token = sessionStorage.getItem("token");
    let time = this._view.panel_time;
    let hour = time.hour;    //转格式-08
    // let tazid = this._view.map_click_disabled ? this._view.global_area.value : '';  //建成区下是1
    // let linkids = this._view.map_click_disabled ? '' : this._view.link_id.length>0 ? this._view.link_id.join(","): '';
    let id = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let linktag = this._view.source_type;
    let maxFlow = this._view.flow_range_max;
    let minFlow = this._view.flow_range_min;
    // let dataSource = this._view.map_click_disabled ? 1 : 0;
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1

      let url = `${MYCONF.service.carTraffic_4_echart}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&linktag=${linktag}&sortRule=0&id=${id}&token=${token}`;
    this._view.requestUrl = url;
    _this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then(response => {
      response = response.body;
      let response1 = response.ratio;
      let response2 = response.flow;
      if(response && response1 && response2){
        response1.map((item) => {
          yAxis_obj_1.tripflow.push({name:item.linkid, value:item.tripflow.toFixed(2)});
          yAxis_obj_1.linkflow.push({name:item.linkid, value:item.linkflow.toFixed(2)});
          yAxis_obj_1.num.push(item.flowratio.toFixed(2)*100);
          // yAxis_obj_1.linkid.push(item.linkid);
          yAxis_obj_1.name.push(item.roadname?item.roadname:'-');
          yAxis_obj_1.tooltip.push(1);
        });
        response2.map((item) => {
          yAxis_obj_2.tripflow.push({name:item.linkid, value:item.tripflow.toFixed(2)});
          yAxis_obj_2.linkflow.push({name:item.linkid, value:item.linkflow.toFixed(2)});
          yAxis_obj_2.num.push(item.flowratio.toFixed(2)*100);
          // yAxis_obj_2.linkid.push(item.linkid);
          yAxis_obj_2.name.push(item.roadname?item.roadname:'-');
          yAxis_obj_2.tooltip.push(1);
        });

        _this._view.xAxis_1 = yAxis_obj_1.name;
        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        let curData = _this._view.chartType===1?yAxis_obj_1:yAxis_obj_2;
        _this.echartCarTraffic_4(curData);
      }
      _this._view.isTimeout = true;
    });
  }

  //高级溯源
  getCarTraffic_4_advanced(){
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      tripflow:[],
      linkflow:[],
      num:[],
      linkid:[],
      name: []
    };
    let yAxis_obj_2 = {
      tripflow:[],
      linkflow:[],
      num:[],
      linkid:[],
      name: []
    };
    let _this = this;
    let time = this._view.panel_time;
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

    let url = `${MYCONF.service.carTraffic_4_echart_advanced}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&linktag1=${advanceA}&dataSource1=${dataSource1}&id1=${linkids1}&linktag2=${advanceB}&dataSource2=${dataSource2}&id2=${linkids2}&token=${token}`;
    this._view.requestUrl = url;
    _this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then(response => {
      response = response.body;
      let response1 = response.ratio;
      let response2 = response.flow;
      if(response && response1 && response2){
        // _this._view.updateGlobalLoading(false);
        response1.map((item) => {
          yAxis_obj_1.tripflow.push({name:item.linkid, value:item.tripflow.toFixed(2)});
          yAxis_obj_1.linkflow.push({name:item.linkid, value:item.linkflow.toFixed(2)});
          yAxis_obj_1.name.push(item.roadname?item.roadname:'-');
          // yAxis_obj_1.tripflow.push(item.tripflow.toFixed(2));
          // yAxis_obj_1.linkflow.push(item.linkflow.toFixed(2));
          yAxis_obj_1.num.push(item.flowratio.toFixed(2)*100);
          yAxis_obj_1.linkid.push(item.linkid);
        });
        response2.map((item) => {
          yAxis_obj_2.tripflow.push({name:item.linkid, value:item.tripflow.toFixed(2)});
          yAxis_obj_2.linkflow.push({name:item.linkid, value:item.linkflow.toFixed(2)});
          yAxis_obj_2.name.push(item.roadname?item.roadname:'-');
          // yAxis_obj_2.tripflow.push(item.tripflow.toFixed(2));
          // yAxis_obj_2.linkflow.push(item.linkflow.toFixed(2));
          yAxis_obj_2.num.push(item.flowratio.toFixed(2)*100);
          yAxis_obj_2.linkid.push(item.linkid);
        });

        _this._view.xAxis_1 = yAxis_obj_1.name;
        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        let curData = _this._view.chartType===1?yAxis_obj_1:yAxis_obj_2;
        _this.echartCarTraffic_4(curData);
      }
      _this._view.isTimeout = true;
    });
  }

  //溯源图表
  echartCarTraffic_4(obj){
    let _this = this;
    let option = {
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: function (params) {
          let res = '路名:' + params[0].name + '<br/>';
          for (let i=0; i<params.length; i++){
            res += params[i].seriesName + ':' + params[i].value + '<br/>'
          }
          res += '溯源流量占比:' + (params[0].value/params[1].value*100).toFixed(1) + '%' + '<br/>';
          return res
        },
        textStyle:{
          align:'left'
        },
      },
      legend: {
        data: ['溯源流量', '背景流量'],
        bottom: -2,
      },
      grid: {
        top: 30,
        left: 25,
        right: 15,
        bottom: 40
      },
      xAxis: {
        data: obj.name,
        // offset: 5,
        axisTick: {
          show: true
        },
        axisLine: {
          show: true,
          lineStyle:{
            color:'#ccc'
          }
        },
        axisLabel: {
          color: '#333',
          fontSize: 10,
          interval:0,
          rotate:20,
        }
      },
      yAxis: {
        name:'pcu/h',
        nameTextStyle:{
          padding: [0,0,0,20]
        },
        min: 0,
        // max: 300,
        splitLine: {
          show: true
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true
        }
      },
      series: [{
        type: 'bar',
        name:'溯源流量',
        label: {
          normal:{
            show: true,
            position: 'top',
            distance:-30,
            padding: 5,
            color: '#fff',
            fontSize: 11,
            fontFamily:'Courier New',
            formatter: function(params){
              return parseInt(obj.num[params.dataIndex]) + '%';
            },

          },
        },
        itemStyle: {
          normal: {
            color: '#d33027'
          }
        },
        barWidth: '70%',
        data: obj.tripflow,
        z: 10,
      },
        {
          type: 'bar',
          name:'背景流量',
          barGap: '-100%',
          itemStyle: {
            normal:{
              color: '#BFBFBF',
              opacity: 0.9
            }
          },
          barWidth: '70%',
          data: obj.linkflow,
          z: 5,
        }],
    };
    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
    _this._view.myChart.on('click', (param)=>{
      MapCommonLayer.locateCenter(_this._view,param.data.name);
    })
  }

  //全方式OD数据
  getPersonTrip_1(){
    let _this = this;
    this._view.xAxis_1 = [];
    this._view.legend = ["出发","到达","全部"];
    let yAxis_obj_1 = {
      dGraph:[],
      oGraph:[],
      odGraph:[],
    };
    let yAxis_obj_2 = {
      taz1:[],
      taz2:[],
      taz3:[],
      taz4:[],
      taz5:[],
      taz6:[],
      taz7:[],
      taz8:[],
    };

    let time = this._view.panel_time;
    let hour = time.hour;    //转格式-08
    let token = sessionStorage.getItem("token");
    let dataSource = 0;
    let id = '';
    if (this._view.overAll){
      if (this._view.villageMethod === '全局' && this._view.global_v_type === 0) {
        dataSource = 1;
        id = this._view.global_area.value>0 ? this._view.global_area.value: '';
      }else {
        dataSource = 0;
        id = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
      }
    } else {
      id = '';
      dataSource = 0;
    }
    let url = `${MYCONF.service.personTrip_1_echart}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    _this._view.$http.get(url).then(response => {
      response = response.body;
      if (response){
        _this._view.xAxis_1 = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
        let city = response.city;
        let taz = response.taz;
        city.dGraph.sort(function (a,b) {
          return (a.hour - b.hour)
        });
        city.oGraph.sort(function (a,b) {
          return (a.hour - b.hour)
        });
        city.odGraph.sort(function (a,b) {
          return (a.hour - b.hour)
        });

        city.dGraph.map((item)=> {
          yAxis_obj_1.dGraph.push(item.value.toFixed());
        });
        city.oGraph.map((item)=> {
          yAxis_obj_1.oGraph.push(item.value.toFixed());
        });
        city.odGraph.map((item)=> {
          yAxis_obj_1.odGraph.push(item.value.toFixed());
        });

        taz[1].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[2].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[3].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[4].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[5].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[6].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[7].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[8].sort(function (a,b) {
          return (a.hour - b.hour)
        });

        taz[1].map((item)=> {
          yAxis_obj_2.taz1.push(item.sum.toFixed());
        });
        taz[2].map((item)=> {
          yAxis_obj_2.taz2.push(item.sum.toFixed());
        });
        taz[3].map((item)=> {
          yAxis_obj_2.taz3.push(item.sum.toFixed());
        });
        taz[4].map((item)=> {
          yAxis_obj_2.taz4.push(item.sum.toFixed());
        });
        taz[5].map((item)=> {
          yAxis_obj_2.taz5.push(item.sum.toFixed());
        });
        taz[6].map((item)=> {
          yAxis_obj_2.taz6.push(item.sum.toFixed());
        });
        taz[7].map((item)=> {
          yAxis_obj_2.taz7.push(item.sum.toFixed());
        });
        taz[8].map((item)=> {
          yAxis_obj_2.taz8.push(item.sum.toFixed());
        });

        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        if(_this._view.chartType===1){
          _this.echartPersonTrip_1(yAxis_obj_1);
        }else{
          _this.echartPersonTrip_11(yAxis_obj_2);
        }
      }
      _this._view.isTimeout = true;
    })
  }

  //全方式OD图表
  echartPersonTrip_1(obj){
    let _this = this;
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: this.getTooltipObj(),
      legend: {
        data: _this._view.legend,
        bottom: -2,
      },
      xAxis: {
        name:'h',
        nameLocation:'end',
        nameGap:5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        data: _this._view.xAxis_1
      },
      yAxis: {
        type: 'value',
        name:'人次',
        nameLocation:'end',
        nameGap:10,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
      },
      grid: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 40
      },
      series: [
        {
          name:'出发',
          type:'line',
          // stack: '总量',
          smooth:true,
          data:obj.oGraph,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(231,66,58, 0.7)'},
                  {offset: 1, color: 'rgba(231,66,58, 0)'}
                ]),
            }
          },
        },
        {
          name:'到达',
          type:'line',
          // stack: '总量',
          smooth:true,
          data:obj.dGraph,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(59,144,238, 0.7)'},
                  {offset: 1, color: 'rgba(59,144,238, 0)'}
                ]),
            }
          },
        },
        {
          name:'全部',
          type:'line',
          // stack: '总量',
          smooth:true,
          data:obj.odGraph,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(49,142,129, 0.7)'},
                  {offset: 1, color: 'rgba(49,142,129, 0)'}
                ]),
            }
          },
        }
      ]
    };

    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  echartPersonTrip_11(obj){
    let _this = this;
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: this.getTooltipObj(),
      legend: {
        data: ['荔城城厢主城','涵江主城','仙游主城','西天尾主城','华林主城','笏石主城','黄石主城','湄洲岛'],
        bottom: -5,
      },
      xAxis: {
        name: 'h',
        nameLocation:'end',
        nameGap:5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        data: _this._view.xAxis_1
        // data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
      },
      yAxis: {
        type: 'value',
        name:'人次',
        nameLocation:'end',
        nameGap:8,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
      },
      grid: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 55
      },
      series: [
        {
          name:'荔城城厢主城',
          type:'line',
          smooth:true,
          data:obj.taz1,
        },
        {
          name:'涵江主城',
          type:'line',
          smooth:true,
          data:obj.taz2,
        },
        {
          name:'仙游主城',
          type:'line',
          smooth:true,
          data:obj.taz3,
        },
        {
          name:'西天尾主城',
          type:'line',
          smooth:true,
          data:obj.taz4,
        },
        {
          name:'华林主城',
          type:'line',
          smooth:true,
          data:obj.taz5,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(23,142,129, 0.7)'},
                  {offset: 1, color: 'rgba(23,142,129, 0)'}
                ]),
            }
          },
        },
        {
          name:'笏石主城',
          type:'line',
          smooth:true,
          data:obj.taz6,
        },
        {
          name:'黄石主城',
          type:'line',
          smooth:true,
          data:obj.taz7,
        },
        {
          name:'湄洲岛',
          type:'line',
          smooth:true,
          data:obj.taz8,
        },
      ]
    };

    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  //动态人口数据
  getPersonTrip_2(){
    let _this = this;
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      data:[],
    };
    let yAxis_obj_2 = {
      taz1:[],
      taz2:[],
      taz3:[],
      taz4:[],
      taz5:[],
      taz6:[],
      taz7:[],
      taz8:[],
    };
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      dateTag: this._view.panel_time.datetag,
      maptype: 'grid',
      dataSource: (this._view.overAll_2 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      id: !this._view.overAll_2 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)?
          (this._view.global_area.value>0 ? this._view.global_area.value: ''):
          (this._view.village_id.length>0 ? this._view.village_id.join(","): ''),
    };
    let url = MYCONF.service.personTrip_2_echart + '?' + MapCommonLayer.urlHandle(param);
    this._view.$http.get(url).then(response => {
      response = response.body;
      if (response){
        let city = response.city;
        let taz = response.taz;
        city.sort(function (a,b) {
          return (a.hour - b.hour)
        });
        city.map((item,index)=> {
          if (index>5){
            yAxis_obj_1.data.push(item.num);
            _this._view.xAxis_1.push(item.hour);
          }
        });
        taz[1].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[2].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[3].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[4].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[5].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[6].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[7].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[8].sort(function (a,b) {
          return (a.hour - b.hour)
        });
        taz[1].map((item)=> {
          yAxis_obj_2.taz1.push(item.num);
        });
        taz[2].map((item)=> {
          yAxis_obj_2.taz2.push(item.num);
        });
        taz[3].map((item)=> {
          yAxis_obj_2.taz3.push(item.num);
        });
        taz[4].map((item)=> {
          yAxis_obj_2.taz4.push(item.num);
        });
        taz[5].map((item)=> {
          yAxis_obj_2.taz5.push(item.num);
        });
        taz[6].map((item)=> {
          yAxis_obj_2.taz6.push(item.num);
        });
        taz[7].map((item)=> {
          yAxis_obj_2.taz7.push(item.num);
        });
        taz[8].map((item)=> {
          yAxis_obj_2.taz8.push(item.num);
        });
        _this._view.yAxis_obj_1 = yAxis_obj_1;
        _this._view.yAxis_obj_2 = yAxis_obj_2;
        if(_this._view.chartType===1){
          _this.echartPersonTrip_2(yAxis_obj_1);
        }else{
          _this.echartPersonTrip_22(yAxis_obj_2);
        }
      }
      _this._view.isTimeout = true;
    })
  }
  //动态人口图表
  echartPersonTrip_2(obj){
    let _this = this;
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: this.getTooltipObj(),
      legend: {
        data: ['当前人口'],
        bottom: -2,
      },
      xAxis: {
        name: 'h',
        nameLocation:'end',
        nameGap:5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        data: _this._view.xAxis_1
      },
      yAxis: {
        type: 'value',
        name: '人',
        // min: 2000000,
        nameLocation:'end',
        nameGap:8,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
      },
      grid: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 40
      },
      series: [
        {
          name:'当前人口',
          type:'line',
          stack: '总量',
          data:obj.data,
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8,
                [
                  {offset: 0, color: 'rgba(231,66,58, 0.7)'},
                  {offset: 1, color: 'rgba(231,66,58, 0)'}
                ]),
            }
          },
        },
      ]
    };

    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  echartPersonTrip_22(obj){
    let _this = this;
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: this.getTooltipObj(),
      legend: {
        data: ['荔城城厢主城','涵江主城','仙游主城','西天尾主城','华林主城','笏石主城','黄石主城','湄洲岛'],
        bottom: -5,
      },
      xAxis: {
        name: 'h',
        nameLocation:'end',
        nameGap:5,
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
        // data: _this._view.xAxis_1
        data: ['06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
      },
      yAxis: {
        type: 'value',
        name: '人',
        nameLocation:'end',
        nameGap:8,
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0.5)'
          }
        },
        axisLabel:{
          inside:true
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ['rgba(0,0,0,0.10)'],
          }
        },
      },
      grid: {
        top: 20,
        left: 15,
        right: 15,
        bottom: 55
      },
      series: [
        {
          name:'荔城城厢主城',
          type:'line',
          // stack: '总量',
          smooth:true,
          data:obj.taz1,
        },
        {
          name:'涵江主城',
          type:'line',
          data:obj.taz2,
          smooth:true,
        },
        {
          name:'仙游主城',
          type:'line',
          data:obj.taz3,
          smooth:true,
        },
        {
          name:'西天尾主城',
          type:'line',
          data:obj.taz4,
          smooth:true,
        },
        {
          name:'华林主城',
          type:'line',
          data:obj.taz5,
          smooth:true,
        },
        {
          name:'笏石主城',
          type:'line',
          data:obj.taz6,
          smooth:true,
        },
        {
          name:'黄石主城',
          type:'line',
          data:obj.taz7,
          smooth:true,
        },
        {
          name:'湄洲岛',
          type:'line',
          // stack: '总量',
          smooth:true,
          data:obj.taz8,
        },
      ]
    };

    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  //出行特征数据
  getPersonTrip_3(){
    let _this = this;
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      avgDistance:[],
      avgTime:[],
      name:[],
      tazid:[],
    };
    let token = sessionStorage.getItem("token");
    let time = this._view.panel_time;
    let hour = time.hour;    //转格式-08
    let dataSource = 0;
    let id = '';
    if (this._view.overAll_3){
      if (this._view.villageMethod === '全局' && this._view.global_v_type === 0) {
        dataSource = 1;
        id = this._view.global_area.value>0 ? this._view.global_area.value: '';
      }else {
        dataSource = 0;
        id = this._view.village_id.length>0 ? this._view.village_id.join(","): '';
      }
    }else {
      id = '';
      dataSource = 0;
    }
    let url = `${MYCONF.service.personTrip_3_echart}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if (response){
        response.map((item)=> {
          yAxis_obj_1.avgDistance.push({
            value:item.avgDistance.toFixed(1),
            name:item.tazid
          });
          yAxis_obj_1.avgTime.push({
            value:item.avgTime.toFixed(1),
            name:item.tazid
          });
          yAxis_obj_1.name.push(item.name);
          yAxis_obj_1.tazid.push(item.tazid);
          _this._view.xAxis_1.push(item.name);
        });
        if (response.length === 1){
          yAxis_obj_1.name = ['平均出行']
        }
      }
      this._view.isTimeout = true;
      this._view.yAxis_obj_1 = yAxis_obj_1;
     if (id) {
       _this.echartPersonTrip_33(yAxis_obj_1);
     }else {
       _this.echartPersonTrip_3(yAxis_obj_1);
     }
    })
  }

  //出行特征图表
  echartPersonTrip_3(obj){
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: this.getTooltipObj(),
      legend: {
        data:['出行距离','出行时间']
      },
      xAxis: {
        type: 'category',
        data: ['湄洲岛','华林','涵江','荔城城厢','黄石','仙游','西天尾','笏石'],
        // data: obj.name,
        // axisLabel: {
        //   interval:0,
        //   rotate:0
        // }
      },
      yAxis: [
        {
          type: 'value',
          name: 'km',
          axisLine:{
            lineStyle:{
              color:'#80BFAC'
            },
          },
          axisLabel:{
            color:'#80BFAC'
          }
        },
        {
          type: 'value',
          name: 'min',
          axisLine:{
            lineStyle:{
              color:'#F17C4A'
            },
          },
          axisLabel:{
            color:'#F17C4A'
          }
        },
      ],
      grid: {
        top: 35,
        left: 25,
        right: 25,
        bottom: 20
      },
      series: [
        {
          name:'出行距离',
          type:'bar',
          data:obj.avgDistance,
          itemStyle:{
            normal:{
              color:'#80BFAC',
            }
          }
        },
        {
          name:'出行时间',
          type:'bar',
          yAxisIndex: 1,
          itemStyle:{
            normal:{
              color:'#F17C4A',
            }
          },
          data:obj.avgTime,
        }
      ]
    };
    this._view.myChart.clear();
    this._view.myChart.setOption(option);
    this._view.myChart.on('click', (param)=>{
      MapCommonLayer.locationBuiltArea(param.data.name);
    })
  }

  echartPersonTrip_33(obj){
    let _this = this;
    let option = {
      tooltip: this.getTooltipObj(),
      legend: {
        data:['出行距离','出行时间']
      },
      xAxis: {
        type: 'category',
        data: obj.name,
      },
      yAxis: [
        {
          type: 'value',
          name: 'km',
          interval: 1,
          axisLine:{
            lineStyle:{
              color:'#80BFAC'
            },
          },
          axisLabel:{
            color:'#80BFAC'
          }
        },
        {
          type: 'value',
          name: 'min',
          axisLine:{
            lineStyle:{
              color:'#F17C4A'
            },
          },
          axisLabel:{
            color:'#F17C4A'
          }
        },
      ],
      grid: {
        top: 35,
        left: 25,
        right: 25,
        bottom: 20
      },
      series: [{
          name:'出行距离',
          type:'bar',
          data:obj.avgDistance,
          barWidth: 50,
          itemStyle:{
            normal:{
              color:'#80BFAC',
            }
          }
        },{
          name:'出行时间',
          type:'bar',
          yAxisIndex: 1,
          data:obj.avgTime,
          barWidth: 50,
          itemStyle:{
            normal:{
              color:'#F17C4A',
            }
          }
        }]
    };

    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  //职住平衡数据
  getPersonTrip_4(){
    let _this = this;
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      hsum:[],
      rsum:[],
      wsum:[],
      hsum_change: [],
      tazid:[],
      tazname:[],
    };

    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      dateTag: this._view.panel_time.datetag,
      dataType: this._view.residence_list,
      dataSource: (this._view.overAll_4 && this._view.villageMethod === '全局' && this._view.global_v_type === 0)? 1:0,
      id: !this._view.overAll_4 ? '':
        (this._view.villageMethod === '全局' && this._view.global_v_type === 0)?
          (this._view.global_area.value>0 ? this._view.global_area.value: ''):
          (this._view.village_id.length>0 ? this._view.village_id.join(","): ''),
    };
    let url = MYCONF.service.personTrip_4_echart + '?' + MapCommonLayer.urlHandle(param);
    this._view.$http.get(url).then(response => {
      response = response.body;
      if (response){
        response.map((item)=> {
          yAxis_obj_1.hsum.push({
            value:item.hsum,
            name:item.tazid
          });
          yAxis_obj_1.hsum_change.push({
            value:(item.hsum*0.379).toFixed(),
            name:item.tazid
          });
          yAxis_obj_1.rsum.push(item.rsum);
          yAxis_obj_1.wsum.push({
            value:item.wsum,
            name:item.tazid
          });
          yAxis_obj_1.tazid.push(item.tazid);
          yAxis_obj_1.tazname.push(item.tazname);
          _this._view.xAxis_1.push(item.tazname);
        });
        if (response.length === 1){
          yAxis_obj_1.tazname = ['总计算量']
        }
      }
      _this._view.isTimeout = true;
      _this._view.yAxis_obj_1 = yAxis_obj_1;
      param.id ? _this.echartPersonTrip_44(yAxis_obj_1) : _this.echartPersonTrip_4(yAxis_obj_1);
    })
  }

  //职住平衡图表
  echartPersonTrip_4(obj){
    let option = {
      tooltip: this.getTooltipObj(),
      legend: {
        data:['居住人口','居住人口(职住修正)','就职人口']
      },
      xAxis: {
        type: 'category',
        data: ['华林','涵江','荔城城厢','西天尾','仙游','黄石','笏石','湄洲岛'],
        // data: obj.tazname,
        axisLabel: {
          interval:0,
          rotate:0
        }
      },
      yAxis: {
        name: '人',
        type: 'value',
        nameLocation:'end',
        nameGap:8,
        // axisLabel:{
        //   inside:true
        // },
      },
      grid: {
        top: 20,
        right: 15,
        bottom: 20
      },
      series: [{
        name:'居住人口',
        type:'bar',
        data:obj.hsum,
        itemStyle:{
          normal:{
            color:'#566566',
          }
        }
      },{
        name:'居住人口(职住修正)',
        type:'bar',
        data:obj.hsum_change,
        itemStyle:{
          normal:{
            color:'#80BFAC',
          }
        }
      },{
          name:'就职人口',
          type:'bar',
          data:obj.wsum,
          itemStyle:{
            normal:{
              color:'#F17C4A',
            }
          }
        }]
    };
    this._view.myChart.clear();
    this._view.myChart.setOption(option);
    this._view.myChart.on('click', (param)=>{
      MapCommonLayer.locationBuiltArea(param.data.name);
    })
  }

  echartPersonTrip_44(obj){
    let _this = this;
    let option = {
      color: ['#e63e36', '#3c90ee', '#2f8d81', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: this.getTooltipObj(),
      legend: {
        data:['居住人口','居住人口(职住修正)','就职人口']
      },
      xAxis: {
        type: 'category',
        data: obj.tazname,
      },
      yAxis: {
        name: '人',
        type: 'value',
        axisLabel:{
          inside:false
        },
      },
      grid: {
        top: 20,
        right: 15,
        bottom: 20
      },
      series: [{
          name:'居住人口',
          type:'bar',
          data:obj.hsum,
          barWidth : 80,
          itemStyle:{
            normal:{
              color:'#566566',
            }
          }
        },{
        name:'居住人口(职住修正)',
        type:'bar',
        data:obj.hsum_change,
        itemStyle:{
          normal:{
            color:'#80BFAC',
          }
        }
      },{
          name:'就职人口',
          type:'bar',
          data:obj.wsum,
          barWidth : 80,
          itemStyle:{
            normal:{
              color:'#F17C4A',
            }
          }
        }]
    };
    _this._view.myChart.clear();
    _this._view.myChart.setOption(option);
  }

  //建成区OD分析数据
  getPersonTrip_5(){
    this._view.xAxis_1 = [];
    let yAxis_obj_1 = {
      dsum:[],
      osum:[],
      tazid:[],
      tazname:[],
    };
    let token = sessionStorage.getItem("token");
    let time = this._view.panel_time;
    let hour = time.hour;    //转格式-08
    let index = -1;
    let id = '';
    let dataType = this._view.adminOption;
    if (dataType==='建成区OD分析'){
      dataType = 0;
      id = !this._view.overAll_5 ? '': this._view.buildArea_sel? MapCommonLayer.setNameToTazId(this._view.buildArea_sel): '';
    }else {
      dataType = 1;
      id = !this._view.overAll_5? '': this._view.adminArea_sel? MapCommonLayer.setNameToAdminId(this._view.adminArea_sel): '';
    }
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      dateTag: this._view.panel_time.dateTag,
      dataType: this._view.adminOption === '建成区OD分析' ? 0 : 1,
      id: !this._view.overAll_5 ? '' :
        this._view.adminOption === '建成区OD分析' ?
          (this._view.buildArea_sel ? MapCommonLayer.setNameToTazId(this._view.buildArea_sel) : '') :
          (this._view.adminArea_sel ? MapCommonLayer.setNameToAdminId(this._view.adminArea_sel) : ''),

    };

    let url1 = MapCommonLayer.urlHandle(param);
    let url = `${MYCONF.service.personTrip_5_echart}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataType=${dataType}&id=&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if (response){
        response.map((item)=> {
          yAxis_obj_1.dsum.push({
            value:item.dsum,
            name:item.tazid
          });
          yAxis_obj_1.osum.push({
            value:item.osum,
            name:item.tazid
          });
          yAxis_obj_1.tazid.push(item.tazid);
          yAxis_obj_1.tazname.push(item.tazname);
          this._view.xAxis_1.push(item.tazname);
        })
      }
      index = id?yAxis_obj_1.tazid.indexOf(id.toString()) : -1;
      this._view.isTimeout = true;
      this._view.yAxis_obj_1 = yAxis_obj_1;
      this.echartPersonTrip_5(yAxis_obj_1, index);
    })
  }

  //建成区OD分析图
  echartPersonTrip_5(obj,index){
    let option = {
      tooltip: this.getTooltipObj(),
      legend: {
        data:['生成量','吸引量']
      },
      xAxis: {
        type: 'category',
        data: obj.tazname,
        axisLabel: {
          interval:0,
          rotate:0
        }
      },
      yAxis: {
        name:'人次',
        nameLocation:'end',
        nameGap:8,
      },
      grid: {
        top: 30,
        right: 15,
        bottom: 20
      },
      series: [{
          name:'总生成量',
          type:'bar',
          data:obj.dsum,
          itemStyle:{
            normal:{
              color: function(param){
                return index === -1?'#80BFAC':param.dataIndex === index?'#5C87A5':'#80BFAC'
              }
            }
          }
        }, {
          name:'总吸引量',
          type:'bar',
          data:obj.osum,
          itemStyle:{
            normal:{
              color: function(param){
                return index===-1? '#F17C4A':param.dataIndex === index? '#D53A35': '#F17C4A';
              }
            }
          }
        }]
    };
    this._view.myChart.clear();
    this._view.myChart.setOption(option);
    this._view.myChart.on('click', (param)=>{
      if (this._view.adminOption==='建成区OD分析') MapCommonLayer.locationBuiltArea(param.data.name);
      if (this._view.adminOption==='区县OD分析') MapCommonLayer.locationDistrictArea(param.data.name);
    })
  }

  getTooltipObj(){
    let curMenu = this._view.cur_menu.id;
    return {
      trigger: 'axis',
      axisPointer : {
        type : 'shadow'
      },
      textStyle:{
        align:'left'
      }
    }
  }

  stopDiagramRequest(){
    let curRequest = this._view.curRequest;
    if (curRequest) {
      //TODO:中止请求
      curRequest.abort();
      this._view.isTimeout = true;
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
