/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from '../../util/event-bus'
import mapCommonLayer from '../map/mapCommonLayer'

export default class workBenchHandler {
  constructor(_view) {
    this._view = _view;
    this.token = sessionStorage.getItem('token');
    this.lineList = [];
    this.polygonList = [];
  }
  getBusLineList(){
    let url = MYCONF.service.getBusLine+`?year=2018&season=0&token=${sessionStorage.getItem('token')}`;
    let list = [];
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response){
        response.map((item) => {
          list.push({
            label:item.trackid + '路',
            value:item.trackid
          })
        });
        this._view.updateBusLineList(list);
      }
    })
  }
  getGlobalTime(){
    let url = MYCONF.service.globalTime+`&token=${this.token}`;
    let timeObj = {};
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response.result && response.result.length > 0){
        response.result.map((item) => {
          timeObj[item.key] = parseInt(item.value);
        });
        this._view.updateGlobalTime(timeObj);
        this._view.updateTUpdateTime(response.result[0].updatetime);
      }else{
        return;
      }
    })
  }
  getGlobalVillage(){
    let url = MYCONF.service.globalVil+`&token=${sessionStorage.getItem('token')}`;
    let villageList = [];
    let idList = [];
    let nameList = [];
    let that = this._view;
    this._view.$http.get(url).then(response => {
      response = response.body;
      if(response && response.result){
        let result = response.result;
        let type = response.type === 'taz'?0:1;
        that.updateVUpdateTime(result[0].updatetime);
        that.updateGlobalVType(type);
        if(type === 0){
          that.updateGlobalArea({
            label:result[0].value,
            value:result[0].key
          });
          that.updateTempVillage([]);   //清空全局小区非选项
          that.updateTempVillageIds([]);
          that.updateGlobalVillage([]);   //清空全局小区非选项
          that.updateGlobalVillageIds([]);
          that.updateGlobalVillageNames([]);
        }else{
          result.map((item) => {
            idList.push(item.key);
            nameList.push(item.value);
            villageList.push({
              id: item.key,
              name: item.value,
            })
          });
          that.updateTempVillage(JSON.parse(JSON.stringify(villageList))); //深拷贝-传的是数组地址
          that.updateTempVillageIds(JSON.parse(JSON.stringify(idList)));
          that.updateGlobalVillage(villageList);
          that.updateGlobalVillageIds(idList);
          that.updateGlobalVillageNames(nameList);
        }
      }else{
        // that.$Message.warning({
        //   content: '获取全局小区失败',
        //   closable: true
        // });
      }

    })
  }

  asynScript(){
    // mapCommonLayer.addScript('//minedata.cn/minemapapi/v2.0.0/plugins/edit/minemap-edit.js');
    // mapCommonLayer.addScript('static/leaflet/js/leaflet.js');
    // mapCommonLayer.addScript('static/leaflet/js/leaflet-tool.min.js');
    // mapCommonLayer.addScript('static/lib/turf/turf.min.js');
    // mapCommonLayer.addScript('static/leaflet/js/math.min.js');

    // mapCommonLayer.addScript('static/leaflet/js/leaflet-src.js');
    // mapCommonLayer.addScript('static/leaflet/js/Path.Drag.js');
    // mapCommonLayer.addScript('static/leaflet/js/Leaflet.Editable.js');
    // mapCommonLayer.addScript('static/leaflet/js/leaflet.geometryutil.js');
    // mapCommonLayer.addScript('static/leaflet/js/leaflet.snap.js');
    // mapCommonLayer.addScript('static/leaflet/js/math.js');

    // mapCommonLayer.addCss('static/leaflet/css/leaflet.css');
    // mapCommonLayer.addCss('//minedata.cn/minemapapi/v2.0.0/plugins/edit/minemap-edit.css');
  }
}
