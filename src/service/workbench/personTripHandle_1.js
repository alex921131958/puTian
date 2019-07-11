/**
 * Created by qiaoao on 2018/8/02.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";

export default class personTripHandle_1 {
  constructor(_view) {
    this._view = _view;
  }

  getPanelParams(){
    let tempObj = {};
    let that = this;
    let panelTime = this._view.panel_time;
    let curMenu = this._view.cur_menu.id;
    let url = MYCONF.service.findSettings + `${curMenu}&token=${sessionStorage.getItem("token")}`
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if(res.result.length === 0){
        return ;         //之前没有保存应用记录
      }else{
        let paramList = res.result;
        paramList.map((item) => {
          let key = item.key;
          tempObj[key] = key==='villageType'||key==='villages'||key==='grid_heatmap'||key==='display_mode'||key==='travel_sel'||key==='distance_type'||key==='colorSel'?item.value:parseInt(item.value);
        });
        that._view.updatePersonTrip1(tempObj);
        if(that._view.cur_menu.id === "personTrip-1"){
          that._view.updatePanelTime({
            year:tempObj['year'],
            season:tempObj['season'],
            datetag:tempObj['datetag'],
            hour:tempObj['hour'],
          });
        }
        eventBus.$emit("getPanelParam",curMenu);
      }
    });
  }

}
