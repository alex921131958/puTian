/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import utilHelper from '../../util/util-helper'
import eventBus from '../../util/event-bus'

export default class carTrafficHandler_5 {
  constructor(_view) {
    this._view = _view;
  }

  getPanelParams(){
    let that = this;
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let curMenu = this._view.cur_menu.id;
    let url = MYCONF.service.findSettings + `${curMenu}&token=${sessionStorage.getItem("token")}`
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if(res.result.length === 0){
        that._view.updateCarTraffic5({
          year:2017,
          season:2,
          datetag:1,
          hour:31,
          crossIcon:1,
        });
        eventBus.$emit("getPanelParam",curMenu);
        return ;         //之前没有保存应用记录
      }else{
        let paramList = res.result;
        paramList.map((item) => {
          let key = item.key;
          tempObj[key] = parseInt(item.value);
        });
        that._view.updateCarTraffic5(tempObj);
        if(that._view.cur_menu.id === "carTraffic-5"){
          that._view.updatePanelTime({
            year:tempObj['year'],
            season:tempObj['season'],
            datetag:tempObj['datetag'],
            hour:tempObj['hour'],
          });
          that._view.updateCrossIcon(tempObj['crossIcon']);
        }
        eventBus.$emit("getPanelParam",curMenu);
      }
    });
  }
}
