/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import MapCommonLayer from '../../service/map/mapCommonLayer'
import eventBus from '../../util/event-bus'

export default class dataTableHandler {
  constructor(_view) {
    this._view = _view;
  }

  getColumnData(item){
    let curMenu = this._view.cur_menu.id;
    switch (curMenu) {
      case 'carTraffic-1':
        this.getCarTraffic1TableColumn();
        break;
      case 'carTraffic-2':
        this.getCarTraffic2TableColumn();
        break;
      case 'carTraffic-4':
        this.getCarTraffic4TableColumn();
        break;
      case 'carTraffic-5':
        break;
      case 'carTraffic-6':
        break;

      case 'cmnTraffic-1':
        this.getCmnTraffic1TableColumn();
        break;
      case 'cmnTraffic-3':
        this.getCommonTableColumn();
        break;
      case 'personTrip-1':
        if (this._view.data_details_select===0) {
          this.getPersonTrip1TableColumn1();
        }else{
          this.getPersonTrip1TableColumn2();
        }
        break;
      case 'personTrip-2':
        this.getPersonTrip2TableColumn();
        break;
      case 'personTrip-3':
        this.getPersonTrip3TableColumn();
        break;
      case 'personTrip-4':
        this.getPersonTrip4TableColumn();
        break;
      case 'personTrip-5':
        this.getPersonTrip5TableColumn();
        break;
      default:                            //这里default用于通用表头处理
        this.getCommonTableColumn();
        break;
    }
  }

  getTableData() {
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

  getCommonTableColumn(){
    let that = this._view;
    this._view.linkColumns = [
      {
        key: 'num',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'linkId',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '道路Id',
              innerHTML: '道路Id'
            }
          })
        }
      },
      {
        key: 'roadName',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路名',
              innerHTML: '路名'
            }
          })
        }
      },
      {
        key: 'len',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路长',
              innerHTML: '路长'
            }
          })
        }
      },
      {
        key: 'avgFlow',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: (that.carTraffic_11_tab==='分等级平均流量' || that.carTraffic_11_tab==='平均流量')? '流量': '车公里',
              innerHTML: (that.carTraffic_11_tab==='分等级平均流量' || that.carTraffic_11_tab==='平均流量')? '流量': '车公里'
            }
          })
        }
      },
      {
        key: 'locate',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('IconComp',{
            props: {
              type: 'android-locate',
              size: "20",
              color: "#4A4A4A",
            },
            style: {
              cursor:'pointer'
            },
            on: {
              click: () => {
                let roadId = row.linkId;
                MapCommonLayer.locateCenter(that,roadId);
              }
            }
          })
        }
      }
    ]
  }

  getCarTraffic1TableColumn() {
    let that = this._view;
    this._view.linkColumns = [
      {
        key: 'num',
        width: 36,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'linkId',
        width: 60,
        tooltip:true,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '道路Id',
              innerHTML: '道路Id'
            }
          })
        }
      },
      {
        key: 'roadName',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路名',
              innerHTML: '路名'
            }
          })
        }
      },
      {
        key: 'len',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路长',
              innerHTML: '路长'
            }
          })
        }
      },
      {
        key: 'delayIndex',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '指数',
              innerHTML: '指数'
            }
          })
        }
      },
      {
        key: 'speed',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '速度(km/h)',
              innerHTML: '速度(km/h)'
            }
          })
        }
      },
      {
        key: 'locate',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.linkId;
                MapCommonLayer.locateCenter(that,roadId);
              }
            }
          })
        }
      }];
  }

  getCarTraffic2TableColumn() {
    let that = this._view;
    this._view.linkColumns = [
      {
        key: 'num',
        width: 36,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'linkId',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '道路Id',
              innerHTML: '道路Id'
            }
          })
        }
      },
      {
        key: 'roadName',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路名',
              innerHTML: '路名'
            }
          })
        }
      },
      {
        key: 'jamLen',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: that.carTraffic_11_tab==='拥堵里程'? '拥堵长度': '拥堵占比',
              innerHTML: that.carTraffic_11_tab==='拥堵里程'? '拥堵长度': '拥堵占比'
            }
          })
        },
      },
      {
        key: 'locate',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.linkId;
                MapCommonLayer.locateCenter(that,roadId);
              }
            }
          })
        }
      }];
  }

  getCarTraffic4TableColumn(){
    let that = this._view;
    this._view.linkColumns = [
      {
        key: 'num',
        width:36,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'linkId',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '道路Id',
              innerHTML: '道路Id'
            }
          })
        }
      },
      {
        key: 'roadName',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路名',
              innerHTML: '路名'
            }
          })
        }
      },
      {
        key: 'len',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路长',
              innerHTML: '路长'
            }
          })
        }
      },
      {
        key: 'rank',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '等级',
              innerHTML: '等级'
            }
          })
        }
      },
      {
        key: 'tripflow',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '流量',
              innerHTML: '流量'
            }
          })
        }
      },
      {
        key: 'flowratio',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '流量占比',
              innerHTML: '流量占比'
            }
          })
        }
      },
      {
        key: 'locate',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.linkId;
                MapCommonLayer.locateCenter(that,roadId);
              }
            }
          })
        }
      }
    ]
  }

  getCmnTraffic1TableColumn(){
    let that = this._view;
    let speedType = this._view.bus_speed_type;
    this._view.linkColumns = [
      {
        key: 'num',
        width: 36,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'linkId',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '道路Id',
              innerHTML: '道路Id'
            }
          })
        }
      },
      {
        key: 'roadName',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路名',
              innerHTML: '路名'
            }
          })
        }
      },
      {
        key: 'len',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路长',
              innerHTML: '路长'
            }
          })
        }
      },
      {
        key: 'speed',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: speedType===0?'速度':'速度差',
              innerHTML: speedType===0?'速度':'速度差'
            }
          })
        }
      },
      {
        key: 'locate',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.linkId;
                MapCommonLayer.locateCenter(that,roadId);
              }
            }
          })
        }
      }];
  }

  getPersonTrip1TableColumn1(){
    let that = this._view;
    that.linkColumns = [
      {
        key: 'rank',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'num',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '编号',
              innerHTML: '编号'
            }
          })
        }
      },
      {
        key: 'tazid',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '所在街道',
              innerHTML: '所在街道'
            }
          })
        }
      },
      {
        key: 'o_sum',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '生成量',
              innerHTML: '生成量'
            }
          })
        }
      },
      {
        key: 'd_sum',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '吸引量',
              innerHTML: '吸引量'
            }
          })
        }
      },
      {
        key: 'locate',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.locate;
                MapCommonLayer.locateCenterVillage(that,roadId);
              }
            }
          })
        }
      },
    ]
  }

  getPersonTrip1TableColumn2(){
    let that = this._view;
    that.linkColumns = [
      {
        key: 'rank',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'ogridid',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '起点小区编号',
              innerHTML: '起点小区编号'
            }
          })
        }
      },
      {
        key: 'dgridid',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '终点小区编号',
              innerHTML: '终点小区编号'
            }
          })
        }
      },
      {
        key: 'odsum',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: 'OD量',
              innerHTML: 'OD量'
            }
          })
        }
      },
      {
        key: 'locate',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                // let roadId = row.locate;
                let roadId = row.ogridid + ',' + row.dgridid;
                MapCommonLayer.locateCenterVillageDouble(that,roadId);
              }
            }
          })
        }
      },
    ]
  }

  getPersonTrip2TableColumn(){
    let that = this._view;
    that.linkColumns = [
      {
        key: 'rank',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'num',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '编号',
              innerHTML: '编号'
            }
          })
        }
      },
      {
        key: 'tazid',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '所在街道',
              innerHTML: '所在街道'
            }
          })
        }
      },
      {
        key: 'popup',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '动态人口',
              innerHTML: '动态人口'
            }
          })
        }
      },
      {
        key: 'locate',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.locate;
                MapCommonLayer.locateCenterVillage(that,roadId);
              }
            }
          })
        }
      },
    ]
  }

  getPersonTrip3TableColumn(){
    let that = this._view;
    that.linkColumns = [
      {
        key: 'rank',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'num',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '编号',
              innerHTML: '编号'
            }
          })
        }
      },
      {
        key: 'road',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '路名',
              innerHTML: '路名'
            }
          })
        }
      },
      {
        key: 'length',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '平均出行距离',
              innerHTML: '平均出行距离'
            }
          })
        }
      },
      {
        key: 'time',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '平均出行时间',
              innerHTML: '平均出行时间'
            }
          })
        }
      },
      {
        key: 'pop',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '平均出行人数',
              innerHTML: '平均出行人数'
            }
          })
        }
      },
      {
        key: 'locate',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.locate;
                MapCommonLayer.locateCenterVillage(that,roadId);
              }
            }
          })
        }
      },
    ]
  }

  getPersonTrip4TableColumn(){
    let that = this._view;
    that.linkColumns = [
      {
        key: 'rank',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'num',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '编号',
              innerHTML: '编号'
            }
          })
        }
      },
      {
        key: 'tazid',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '所在社区',
              innerHTML: '所在社区'
            }
          })
        }
      },
      {
        key: 'live',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '居住人口',
              innerHTML: '居住人口'
            }
          })
        }
      },
      {
        key: 'occup',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '就职人口',
              innerHTML: '就职人口'
            }
          })
        }
      },
      {
        key: 'employment',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '职住比',
              innerHTML: '职住比'
            }
          })
        }
      },
      {
        key: 'locate',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '定位',
              innerHTML: '定位'
            }
          })
        },
        render: (h, params) => {
          const row = params.row;
          return h('i', {
            'class': {
              icon: true,
              iconfont: true,
              'icon-locate': true,
            },
            style: {
              fontSize: "1.2em",
              color: "#4A4A4A",
              cursor: 'pointer',
            },
            on: {
              click: () => {
                let roadId = row.locate;
                MapCommonLayer.locateCenterVillage(that,roadId);
              }
            }
          })
        }
      },
    ]
  }

  getPersonTrip5TableColumn(){
    let that = this._view;
    that.linkColumns = [
      {
        key: 'rank',
        width:40,
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '排名',
              innerHTML: '排名'
            }
          })
        }
      },
      {
        key: 'num',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '编号',
              innerHTML: '编号'
            }
          })
        }
      },
      {
        key: 'tazid',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: this._view.adminOption==='区县OD分析'?'区县':'建成区',
              innerHTML: this._view.adminOption==='区县OD分析'?'区县':'建成区'
            }
          })
        }
      },
      {
        key: 'o_sum',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '生成量',
              innerHTML: '生成量'
            }
          })
        }
      },
      {
        key: 'd_sum',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '吸引量',
              innerHTML: '吸引量'
            }
          })
        }
      },
      {
        key: 'sum',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '总量',
              innerHTML: '总量'
            }
          })
        }
      },
    ]
  }

  getCarTraffic_1(){
    let _this = this;
    this._view.isLoading = true;
    this._view.linkData = [];
    this._view.odTableList1 = [];
    this._view.odTableList2 = [];
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.carTraffic_1_table}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response){
        response.listOrderByDelayIndex.map((item,index) => {
          _this._view.odTableList1.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length.toFixed(1),
            delayIndex:item.delayindex.toFixed(1),
            speed:item.speed.toFixed(1),
            locate:'',
          })
        });
        response.listOrderBySpeed.map((item,index) => {
          _this._view.odTableList2.push({
            num:item.rank,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length.toFixed(1),
            delayIndex:item.delayindex.toFixed(1),
            speed:item.speed.toFixed(1),
            locate:'',
          })
        });
        this._view.linkData = this._view.carTraffic_11_tab==='路况指数'?_this._view.odTableList1 : _this._view.odTableList2;
      }
      _this._view.isLoading = false;
    })
  }

  getCarTraffic_2(){
    let _this = this;
    this._view.isLoading = true;
    this._view.linkData = [];
    this._view.odTableList1 = [];
    this._view.odTableList2 = [];
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let dataSource = this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0;  //建成区下是1
    let linkids = this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
      :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
        :this._view.link_id.length>0 ? this._view.link_id.join(",")
          : '';
    let id = this._view.selected_only?linkids:'';
    let hour = time.hour;    //转格式-08
    let url = `${MYCONF.service.carTraffic_2_table}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response){
        response.resultOrderByLength.map((item,index) => {
          _this._view.odTableList1.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            jamLen:item.length.toFixed(1),
            locate:'',
          })
        });
        response.resultOrderByRatio.map((item,index) => {
          _this._view.odTableList2.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            jamLen:(item.ratio*100).toFixed(2) + '%',
            locate:'',
          })
        });
        this._view.linkData = this._view.carTraffic_11_tab==='拥堵里程'?_this._view.odTableList1 : _this._view.odTableList2;
      }
      _this._view.isLoading = false;
    })
  }

  getCarTraffic_3(){
    let _this = this;
    this._view.isLoading = true;
    this._view.linkData = [];
    this._view.odTableList1= [];
    this._view.odTableList2= [];
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
    let url = `${MYCONF.service.carTraffic_3_table}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&tazid=${taz_id}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response){
        response.top50RoadAvgFlow.map((item,index) => {
          _this._view.odTableList1.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length,
            avgFlow:item.avgflow,
          })
        });
        response.top50RoadCarkm.map((item,index) => {
          _this._view.odTableList2.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length,
            avgFlow:item.carkm.toFixed(1),
          })
        });
        this._view.linkData = this._view.carTraffic_11_tab==='分等级平均流量'?_this._view.odTableList1 : _this._view.odTableList2;
      }
      _this._view.isLoading = false;
    })
  }

  getCmnTraffic_1(){
    this._view.isLoading = true;
    this._view.linkData = [];
    let param={
      token:sessionStorage.getItem("token"),
      year:this._view.panel_time.year,
      season:this._view.panel_time.season,
      hour:this._view.panel_time.hour,
      datetag:this._view.panel_time.datetag,
      dataType:this._view.bus_speed_type===0? 'speed': 'speed_diff',
      dataSource:this._view.map_click_disabled&&this._view.panel_v_type===1 ? 2 :
        this._view.map_click_disabled&&this._view.panel_v_type===0?1: 0,
      trackId:this._view.selected_only && this._view.road_sel_type==='line'&&this._view.cur_bus_line&&!isNaN(this._view.cur_bus_line.value)?
        this._view.cur_bus_line.value:'',
      id:this._view.selected_only && this._view.road_sel_type==='road'?
        (this._view.map_click_disabled&&this._view.panel_v_type===0 ? this._view.global_area.value
          :this._view.map_click_disabled&&this._view.panel_village_id.length>0?this._view.panel_village_id.join(",")
            :this._view.link_id.length>0 ? this._view.link_id.join(",")
              : ''):'',
      filtertag: this._view.taz_only? 1:0
    };
    let url = MYCONF.service.cmnTraffic_1_table + MapCommonLayer.urlHandle(param);
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response){
        response.map((item,index) => {
          let speed = this._view.bus_speed_type===0? item.speed : item.speeddiff;
          this._view.linkData.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length.toFixed(1),
            speed:speed.toFixed(1),
            locate:'',
          })
        });
      }
      this._view.isLoading = false;
    })
  }

  getCmnTraffic_3(){
    let _this = this;
    _this._view.isLoading = true;
    _this._view.linkData = [];
    this._view.odTableList1 = [];
    this._view.odTableList2 = [];
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
    let url = `${MYCONF.service.cmnTraffic_3_table}&year=${time.year}&season=${time.season}&hour=${hour}&dataSource=${dataSource}&datetag=${time.datetag}&id=${id}&trackId=${trackId}&token=${token}`;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response){
        response.busDataDetailOrderByFlow.map((item,index) => {
          _this._view.odTableList1.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length,
            avgFlow:item.flow.toFixed(1),
          })
        });
        response.busDataDetailOrderByCarkm.map((item,index) => {
          _this._view.odTableList2.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length,
            avgFlow:item.carkm.toFixed(1),
          })
        });
        this._view.linkData = this._view.carTraffic_11_tab==='平均流量'?_this._view.odTableList1 : _this._view.odTableList2;
      }
      _this._view.isLoading = false;
    })
  }
  //基础溯源
  getCarTraffic_4(){
    let tableSelect = this._view.table_select;
    // this._view.linkColumns = MYCONF.SOURCE_COLUMNS;
    let _this = this;
    _this._view.isLoading = true;
    _this._view.linkData = [];
    _this._view.linkDataElse = [];
    _this._view.linkDataElse1 = [];
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
    let url = `${MYCONF.service.carTraffic_4_table}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&linktag=${linktag}&sortRule=0&id=${id}&token=${token}`;

    let list = [];
    let that = this;
    let funcclass = '';
    this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then(response => {
        response = response.body;
        if(response && response.flow && response.ratio){
          // _this._view.updateGlobalLoading(false);
          let response1 = response.flow;
          let response2 = response.ratio;
          response1.map((item,index) => {
            if (parseInt(item.funcclass) === 1){
              funcclass = '高速公路'
            }else if(parseInt(item.funcclass) === 5){
              funcclass = '其他道路'
            }else{
              funcclass = '主要道路'
            }
            _this._view.linkDataElse.push({
              num:index+1,
              linkId:item.linkid,
              roadName:item.roadname?item.roadname:'-',
              len:item.length,
              rank:funcclass,
              tripflow:item.tripflow?parseFloat(item.tripflow).toFixed(1):'-',
              flowratio:item.flowratio?parseFloat(item.flowratio).toFixed(1):'-',
              locate:item.linkid,
            });
          });
          response2.map((item,index) => {
            if (parseInt(item.funcclass) === 1){
              funcclass = '高速公路'
            }else if(parseInt(item.funcclass) === 5){
              funcclass = '其他道路'
            }else{
              funcclass = '主要道路'
            }
            _this._view.linkDataElse1.push({
              num:index+1,
              linkId:item.linkid,
              roadName:item.roadname?item.roadname:'-',
              len:item.length,
              rank:funcclass,
              tripflow:item.tripflow?parseFloat(item.tripflow).toFixed(1):'-',
              flowratio:item.flowratio?((item.flowratio)*100).toFixed(1)+'%':'-',
              locate:'',
            })
          });
        }
      this._view.linkData = this._view.carTraffic_11_tab==='按溯源流量占比排序'?_this._view.linkDataElse1 : _this._view.linkDataElse;
      // _this._view.linkData = _this._view.linkDataElse;
      _this._view.isLoading = false;
    })
  }

  getCarTraffic_4_advanced(){
    let _this = this;
    this._view.isLoading = true;
    this._view.linkData = [];
    this._view.linkDataElse = [];
    this._view.linkDataElse1 = [];
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

    let url = `${MYCONF.service.carTraffic_4_table_advanced}?year=${time.year}&season=${time.season}&hour=${hour}&datetag=${time.datetag}&linktag1=${advanceA}&dataSource1=${dataSource1}&id1=${linkids1}&linktag2=${advanceB}&dataSource2=${dataSource2}&id2=${linkids2}&token=${token}`;
    let funcclass = '';
    this._view.$http.get(url,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then(response => {
      response = response.body;
      if(response && response.flow && response.ratio){
        let response1 = response.flow;
        let response2 = response.ratio;
        response1.map((item,index) => {
          if (parseInt(item.funcclass) === 1){
            funcclass = '高速公路'
          }else if(parseInt(item.funcclass) === 5){
            funcclass = '其他道路'
          }else{
            funcclass = '主要道路'
          }
          _this._view.linkDataElse.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length,
            rank:funcclass,
            tripflow:item.tripflow?parseFloat(item.tripflow).toFixed(1):'-',
            flowratio:item.flowratio?parseFloat(item.flowratio).toFixed(1):'-',
            locate:item.linkid,
          });
        });
        response2.map((item,index) => {
          if (parseInt(item.funcclass) === 1){
            funcclass = '高速公路'
          }else if(parseInt(item.funcclass) === 5){
            funcclass = '其他道路'
          }else{
            funcclass = '主要道路'
          }
          _this._view.linkDataElse1.push({
            num:index+1,
            linkId:item.linkid,
            roadName:item.roadname?item.roadname:'-',
            len:item.length,
            rank:funcclass,
            tripflow:item.tripflow?parseFloat(item.tripflow).toFixed(1):'-',
            flowratio:item.flowratio?((item.flowratio)*100).toFixed(1)+'%':'-',
            locate:'',
          })
        });
      }
      _this._view.linkData = _this._view.table_select===1? _this._view.linkDataElse1:_this._view.linkDataElse;
      _this._view.isLoading = false;
    })
  }

  getPersonTrip_1(){
    let param = {
      token: sessionStorage.getItem("token"),
      year: this._view.panel_time.year,
      season: this._view.panel_time.season,
      hour: this._view.panel_time.hour,
      dateTag: this._view.panel_time.datetag,
      dataSource: (this._view.overAll && this._view.villageMethod === '全局'&&this._view.global_v_type === 0) ? 1: 0,
      id: !this._view.overAll ? '':
        (this._view.villageMethod === '全局'&&this._view.global_v_type === 0)?this._view.global_area.value:
          this._view.village_id.length>0 ? this._view.village_id.join(","): ''
    };
    let url = MYCONF.service.personTrip_1_table + '?' + MapCommonLayer.urlHandle(param);
    this._view.isLoading = true;
    this._view.linkData = [];
    this._view.odTableList1 = [];
    this._view.odTableList2 = [];
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response){
        let response1 = response.odsum;
        let response2 = response.od;
        response1.map((item,index) => {
          if (index<50){
            this._view.odTableList1.push({
              rank:index +1,
              num:item.gridid,
              tazid:item.name?item.name:'-',
              o_sum:item.osum,
              d_sum:item.dsum,
              locate:item.gridid,
            });
          }
        });
        response2.map((item,index) => {
          if(index<50){
            this._view.odTableList2.push({
              rank:index+1,
              ogridid:item.ogridid,
              dgridid:item.dgridid,
              odsum:item.odsum,
              locate:item.ogridid,
            })
          }
        });
      }
      this._view.isLoading = false;
      this._view.linkData = this._view.data_details_select===0?this._view.odTableList1:this._view.odTableList2;
    })
  }

  getPersonTrip_2(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let dataSource = 0;
    let id = '';
    if (this._view.overAll_2){
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
    let url = `${MYCONF.service.personTrip_2_table}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    _this._view.isLoading = true;
    _this._view.linkData = [];
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response && response.length>0){
        response.map((item,index) => {
          if(index<50){
            _this._view.linkData.push({
              rank:index+1,
              num:item.gridid,
              tazid:item.gridname?item.gridname:'-',
              popup:item.num,
              locate:item.gridid,
            })
          }
        });
      }else{
        // return;
      }
      _this._view.isLoading = false;
    })
  }

  getPersonTrip_3(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
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
    } else {
      id = '';
      dataSource = 0;
    }

    let url = `${MYCONF.service.personTrip_3_table}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    _this._view.isLoading = true;
    _this._view.linkData = [];
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response && response.length>0){
        response.map((item,index) => {
          if(index<50){
            _this._view.linkData.push({
              rank:index+1,
              num:item.gridid,
              road:item.gridname?item.gridname:'-',
              length:item.tvldis,   //出行距离
              time:item.tvltime.toFixed(1),    //出行时间
              pop:item.personnum,    //出行人数
              locate:item.gridid,
            })
          }
        });
      }else{
        // return;
      }
      _this._view.isLoading = false;
    })
  }

  getPersonTrip_4(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08

    let dataSource = 0;
    let id = '';
    if (this._view.overAll_4){
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
    let url = `${MYCONF.service.personTrip_4_table}?year=${time.year}&season=${time.season}&hour=${hour}&dateTag=${time.datetag}&dataSource=${dataSource}&id=${id}&token=${token}`;
    _this._view.isLoading = true;
    _this._view.linkData = [];
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response && response.length>0){
        response.map((item,index) => {
          if(index<50){
            _this._view.linkData.push({
              rank:index+1,
              num:item.gridid,
              tazid:item.gridname?item.gridname:'-',
              live:item.hnum,
              occup:item.wnum,
              employment:item.rnum.toFixed(2),
              locate:item.gridid,
            })
          }
        });
      }else{
        // return;
      }
      _this._view.isLoading = false;
    })
  }

  getPersonTrip_5(){
    let _this = this;
    let time = this._view.panel_time;
    let token = sessionStorage.getItem("token");
    let hour = time.hour;    //转格式-08
    let id = '';
    let dataType = this._view.adminOption;
    if (dataType==='建成区OD分析'){
      dataType = 0;
      id = !this._view.overAll_5 ? '': this._view.buildArea_sel? MapCommonLayer.setNameToTazId(this._view.buildArea_sel): '';
    }else {
      dataType = 1;
      id = !this._view.overAll_5? '': this._view.adminArea_sel? MapCommonLayer.setNameToAdminId(this._view.adminArea_sel): '';
    }
    let url = `${MYCONF.service.personTrip_5_table}?year=${time.year}&season=${time.season}&hour=${hour}&dataType=${dataType}&id=${id}&token=${token}`;
    _this._view.isLoading = true;
    _this._view.linkData = [];
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response && response.length>0){
        response.map((item,index) => {
          _this._view.linkData.push({
            rank:index+1,
            num:item.tazid,
            tazid:item.tazname?item.tazname:'-',
            o_sum:item.osum,
            d_sum:item.dsum,
            sum:item.odsum,
          })
        });
      }else{
      }
      _this._view.isLoading = false;
    })
  }

  stopDiagramRequest(){
    let curRequest = this._view.curRequest;
    if (curRequest) {
      //TODO:中止请求
      curRequest.abort();
      this._view.isLoading =false;
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
