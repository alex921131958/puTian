/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";

export default class stepPanelHandler_2 {
  constructor(_view) {
    this._view = _view;
  }

  saveStepParam_2(){
    let newRoadColor = this._view.newRoadColor;
    let editRoadColor = this._view.editRoadColor;
    let lineRoadColor = this._view.lineRoadColor;
    let landRoadColor = this._view.landRoadColor;
    let curShowType = this._view.curShowType;
    let curProId = this._view.cur_pro_id;

    let _this = this;
    this._view.$http.post(MYCONF.service.saveStepSettings+`?token=${sessionStorage.getItem('token')}`, {
      projectid:curProId,
      menuid:'step-2',
      keys:'newRoadColor,editRoadColor,lineRoadColor,landRoadColor,curShowType',
      values:`${newRoadColor},${editRoadColor},${lineRoadColor},${landRoadColor},${curShowType}`,
    }, {emulateJSON: true}).then(response => {
      response= response.body;
      if(response.success){
        _this._view.$Message.success({
          content: '保存成功',
          duration: 2,
          closable: true
        });
      }
    }, response => {
      _this._view.$Message.warning({
        content: '保存失败，请重试',
        duration:2,
        closable: true
      });
    });
  }

  getStepParam(){
    let tempObj = {};
    let curMenu = 'step-2';
    let _this = this;
    let curProId = this._view.cur_pro_id;
    let url = MYCONF.service.findStepSettings + `${curMenu}&projectid=${curProId}&token=${sessionStorage.getItem("token")}`
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if(res.result.length === 0){
        return ;         //之前没有保存应用记录
      }else{
        let paramList = res.result;
        paramList.map((item) => {
          let key = item.key;
          tempObj[key] = item.value;
          _this._view[key] = item.value;
        });
        _this._view.updateLineNewColor(tempObj.newRoadColor);
        _this._view.updateLineChangeColor(tempObj.editRoadColor);
        _this._view.updateLineConnectColor(tempObj.lineRoadColor);
        _this._view.updateLandChangeColor(tempObj.landRoadColor);
      }
    });
  }

  //改变地块颜色
  changePolygonColor(){
    let polygon = env.polygonCoors;
    let color = this._view.landRoadColor;
    for (let i=0; i<polygon.length; i++){
      polygon[i].setStyle({
        color: color,
        fillColor: color,
        opacity: 1
      })
    }
  }
}
