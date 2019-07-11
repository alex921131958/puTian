/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";

export default class carTrafficHandler_1 {
  constructor(_view) {
    this._view = _view;
  }

  getPanelParams(){
    let tempObj = {};
    let panelTime = this._view.panel_time;
    let curMenu = this._view.cur_menu.id;
    let url = MYCONF.service.findSettings + `${curMenu}&token=${sessionStorage.getItem("token")}`;
    let _this = this;
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if (res){
        if(res.result.length === 0){
          return ;         //之前没有保存应用记录
        }else{
          let paramList = res.result;
          paramList.map((item) => {
            let key = item.key;
            tempObj[key] = key==='links'||key==='linktype'?item.value:parseInt(item.value);
          });
          this._view.updateCarTraffic1(tempObj);
          let panelVType = tempObj['linktype']==='taz'?0:tempObj['linktype']==='vil'?1:2;
          this._view.updatePanelVType(panelVType);
          if(this._view.cur_menu.id === "carTraffic-1"){
            this._view.updatePanelTime({
              year:tempObj['year'],
              season:tempObj['season'],
              datetag:tempObj['datetag'],
              hour:tempObj['hour'],
            });
          }
          eventBus.$emit("getPanelParam",curMenu);
        }
      }
    });
  }

}
