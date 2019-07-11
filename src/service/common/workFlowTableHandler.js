import MYCONF from '../../myconf'
import env from '../../common/env'

export default class workFlowTableHandler {
  constructor(_view) {
    this._view = _view;
  }

  getTrafficPredictionColumn(data){
    let type = data[0];
    this._view.linkColumns = [];
    this._view.linkColumns = [
      {
        title: '排名',
        key: 'rank',
        width:40
      },
      {
        title: '编号',
        key: 'num'
      },
      {
        title: '路名',
        key: 'roadName'
      },
      {
        title: '等级',
        key: 'roadRank'
      },
      {
        title: type==='流量'?'背景流量':type==='速度'?'背景速度':type==='饱和度'?'背景饱和度':'',
        key: 'backgroundFlow',
        sortable: true,
      },
      {
        title: '影响后',
        key: 'flowInfluence',
        sortable: true,
      },
      {
        title: '变化量',
        key: 'flowChange',
        sortable: true,
      },
      {
        title: '百分比',
        key: 'percentage',
        sortable: true,
      }
    ]
  }

  getTrafficPrediction(data){
    this._view.linkData = [];
    let _this = this;
    let mode = data[0];
    let sort = data[1];
    let result  = data[2];
    let temp = (mode==='饱和度' && sort==='影响后饱和度')?'vc_predict' :
      (mode==='饱和度' && sort==='饱和度影响')?'vc_add' :
        (mode==='流量' && sort==='影响后流量')?'vol_predict' :
          (mode==='流量' && sort==='流量影响')?'vol_add' :
            (mode==='速度' && sort==='影响后速度')?'speed_predict' :
              (mode==='速度' && sort==='速度影响')?'speed_add' : 'vc_predict';
    result[temp].map((item, index)=>{
      _this._view.linkData.push({
        rank:index+1,
        num:item.linkid,
        roadName:item.roadname?item.roadname:'-',
        roadRank:item.funcclass,
        backgroundFlow:item.base.toFixed(1),
        flowInfluence:item.predict.toFixed(1),
        flowChange:item.add.toFixed(1),
        percentage:item.ratio.toFixed(1),
      })
    });

    // let curId = this._view.cur_pro_id;
    // let timeTag = this._view.stepSixTimeTag==='早高峰'?'M':'N';
    // let url = `${MYCONF.service.trafficPredictionEcharts}projectid=${curId}&timetag=${timeTag}&token=${sessionStorage.getItem("token")}`;
    // this._view.$http.get(url).then(res => {
    //   let result = res.body.result;
    //   result.vc_predict.map((item, index)=>{
    //     _this._view.linkData.push({
    //       rank:index+1,
    //       num:item.linkid,
    //       roadName:item.roadname?item.roadname:'-',
    //       roadRank:item.funcclass,
    //       backgroundFlow:item.base,
    //       flowInfluence:item.predict,
    //       percentage:item.ratio,
    //     })
    //   })
    // }).catch(err=>{
    //   console.log(err)
    // })
  }
}
