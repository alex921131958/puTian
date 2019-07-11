/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";

export default class stepPanelHandler_1 {
  constructor(_view) {
    this._view = _view;
  }

  getProPreSetting(){
    let url = MYCONF.service.findPreSetting;
    let curProId = this._view.cur_pro_id;
    let _this = this;
    this._view.$http.get(url+`token=${sessionStorage.getItem("token")}&projectid=${curProId}`).then((res) => {
      res = res.body;
      let result = res.result;
      if(!result){
        return;
      }else{
        _this._view.proDate = parseInt(result.datetag)===1?'工作日':'非工作日';
        _this._view.proYear = parseInt(result.year);
        _this._view.aimYear = result.tgtyear ? parseInt(result.tgtyear):_this._view.aimYear;
        _this._view.landVolume = {
          daily:{
            generate:result.landDayaoCoefficient,
            attract:result.landDayadCoefficient,
            related:false
          },
          earlyPeak:{
            generate:result.landDaymoCoefficient,
            attract:result.landDaymdCoefficient,
            related:false
          },
          latePeak:{
            generate:result.landDaynoCoefficient,
            attract:result.landDayndCoefficient,
            related:false
          }
        };
        _this._view.roadVolume={
          daily:result.roadDayaCoefficient,
          earlyPeak:result.roadDaymCoefficient,
          latePeak:result.roadDaynCoefficient,
        };
        _this._view.$refs['ratioPreSet'].updateVolume(_this._view.landVolume,_this._view.roadVolume);
        _this._view.updateTravelIndex(_this._view.landVolume);
        _this._view.updateTrafficIndex(_this._view.roadVolume);

      }
    });
  }

  saveStepParam_1(type) {
    let curYear = this._view.proYear;
    let aimYear = this._view.aimYear;
    let curDate = this._view.proDate==='工作日'?1:0;
    let curId = this._view.cur_pro_id;
    let indexTravelVol = this._view.index_travelVol;
    let indexTrafficVol = this._view.index_trafficVol;
    let url = MYCONF.service.savePreSetting + `token=${sessionStorage.getItem("token")}`;
    this._view.$http.post(url, {
        projectid: curId,
        year: curYear,
        tgtyear: aimYear,
        datetag:curDate,
        landDayaoCoefficient:indexTravelVol.daily.generate,
        landDayadCoefficient:indexTravelVol.daily.attract,
        landDaymoCoefficient:indexTravelVol.earlyPeak.generate,
        landDaymdCoefficient:indexTravelVol.earlyPeak.attract,
        landDaynoCoefficient:indexTravelVol.latePeak.generate,
        landDayndCoefficient:indexTravelVol.latePeak.attract,
        roadDayaCoefficient:indexTrafficVol.daily,
        roadDaymCoefficient:indexTrafficVol.earlyPeak,
        roadDaynCoefficient:indexTrafficVol.latePeak,
      },
      {
        'header': {
          'Content-Type': "application/json"
        }
      }).then((res) => {
      res = res.body;
      // this._view.updateCurProject(res.result);
    });
  }

}
