/**
 * Created by qiaoao on 2018/8/02.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";

export default class personTripHandle_5 {
  constructor(_view) {
    this._view = _view;
  }

  getPanelParams(){
    let that =this;
    let tempObj = {};
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
          tempObj[key] = key==='adminOption'||key==='display_mode_build'||key==='colorSel'||key==='travel_sel'||key==='distance_type'||key==='ids'?item.value:parseInt(item.value);
        });
        that._view.updatePersonTrip5(tempObj);
        if(that._view.cur_menu.id === "personTrip-5"){
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
