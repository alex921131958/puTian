import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from '../../util/event-bus'

export default class compareTableHandler {
  constructor(_view) {
    this._view = _view;
  }

  compareDataCancel(){
    let type = this._view.compareShowType;
    let Datatype = type==='speed'? 'sta': type==='flow' ? 'vf' : type==='saturation' ? 'vcta' : 'los';
    let token = sessionStorage.getItem("token");
    let pid1 = this._view.comparePlan1_id;
    let pid2 = this._view.comparePlan2_id;
    let url = MYCONF.service.getComparedDataHistograms + `token=${token}&projectid1=${pid1}&projectid2=${pid2}&Datatype=${Datatype}&limit=30`;
    this._view.$http.get(url).then(res=>{
      res = res.body.result;
      if(res.histogram1.length===0 || res.histogram2.length===0){

      }else{
        res.histogram1.map((item,index)=>{
          this._view.tableLinkData1.push({
            rank:index+1,
            roadName:item.roadname?item.roadname:'-',
            pid1flow:type==='speed'?item.sta_1.toFixed(1) : type==='flow'? item.vf_1.toFixed(1) : type==='saturation'? item.vcta_1.toFixed(1) : this.changeNum2Letter(item.los_1),
            pid2flow:type==='speed'?item.sta_2.toFixed(1) : type==='flow'? item.vf_2.toFixed(1) : type==='saturation'? item.vcta_2.toFixed(1) : this.changeNum2Letter(item.los_2),
            predictionFlow:type==='speed'? item.so.toFixed(1) : type==='flow'? item.vb.toFixed(1) : type==='saturation'? item.vco.toFixed(1) : this.changeNum2Letter(item.los_origin),
            flowDifference:type!=='service'?item.param_diff.toFixed(1):item.param_diff,
          });
        });
        res.histogram2.map((item,index)=>{
          this._view.tableLinkData2.push({
            rank:index+1,
            roadName:item.roadname?item.roadname:'-',
            pid1flow:type==='speed'?item.sta_1.toFixed(1) : type==='flow'? item.vf_1.toFixed(1) : type==='saturation'? item.vcta_1.toFixed(1) : this.changeNum2Letter(item.los_1),
            pid2flow:type==='speed'?item.sta_2.toFixed(1) : type==='flow'? item.vf_2.toFixed(1) : type==='saturation'? item.vcta_2.toFixed(1) : this.changeNum2Letter(item.los_2),
            predictionFlow:type==='speed'? item.so.toFixed(1) : type==='flow'? item.vb.toFixed(1) : type==='saturation'? item.vco.toFixed(1) : this.changeNum2Letter(item.los_origin),
            flowDifference:type!=='service'?item.param_diff.toFixed(1):item.param_diff,
            // flowDifference:item.param_diff.toFixed(1),
          });
        });
        res.histogram3.map((item,index)=>{
          this._view.tableLinkData3.push({
            rank:index+1,
            roadName:item.roadname?item.roadname:'-',
            pid1flow:type==='speed'?item.sta_1.toFixed(1) : type==='flow'? item.vf_1.toFixed(1) : type==='saturation'? item.vcta_1.toFixed(1) : this.changeNum2Letter(item.los_1),
            pid2flow:type==='speed'?item.sta_2.toFixed(1) : type==='flow'? item.vf_2.toFixed(1) : type==='saturation'? item.vcta_2.toFixed(1) : this.changeNum2Letter(item.los_2),
            predictionFlow:type==='speed'? item.so.toFixed(1) : type==='flow'? item.vb.toFixed(1) : type==='saturation'? item.vco.toFixed(1) : this.changeNum2Letter(item.los_origin),
            // flowDifference:type==='speed'? item.sta_diff.toFixed(1) : type==='flow'? item.vf_diff.toFixed(1) : type==='saturation'? item.vcta_diff.toFixed(1) : this.changeNum2Letter(item.los_diff),
            flowDifference:type==='speed'? item.sta_diff.toFixed(1) : type==='flow'? item.vf_diff.toFixed(1) : type==='saturation'? item.vcta_diff.toFixed(1) : item.los_diff,
          });
        });
        let str = this._view.curCompareSelect.substring(0,3);
        this._view.tableLinkData = str==='方案1'?this._view.tableLinkData1 : str==='方案2'? this._view.tableLinkData2 : this._view.tableLinkData3;
      }
    })
  }

  getCompareColumn(){
    let type = this._view.compareShowType;
    this._view.tableColumns=[];
    this._view.tableColumns = [
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
        key: 'pid1flow',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '方案1影响后',
              innerHTML: '方案1影响后'
            }
          })
        }
      },
      {
        key: 'pid2flow',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: '方案2影响后',
              innerHTML: '方案2影响后'
            }
          })
        }
      },
      {
        key: 'predictionFlow',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: type==='speed'?'背景速度':type==='flow'?'背景流量':type==='saturation'?'背景饱和度':'背景服务水平',
              innerHTML: type==='speed'?'背景速度':type==='flow'?'背景流量':type==='saturation'?'背景饱和度':'背景服务水平',
            }
          })
        }
      },
      {
        key: 'flowDifference',
        renderHeader: (h, param)=>{
          return h('span',{
            domProps:{
              title: type==='speed'?'速度影响差异':type==='flow'?'流量影响差异':type==='saturation'?'饱和度影响差异':'服务水平影响差异',
              innerHTML: type==='speed'?'速度影响差异':type==='flow'?'流量影响差异':type==='saturation'?'饱和度影响差异':'服务水平影响差异',
            }
          })
        }
      }
    ]
  }

  changeNum2Letter(data){
    let type = this._view.compareShowType;
    if (type==='service'){
      return data===-6?'-F':data===-5?'-E':data===-4?'-D':data===-3?'-C':data===-2?'-B':data===-1?'-A':
        data===0? 0:data===1?'A':data===2?'B':data===3?'C':data===4?'D':data===5?'E':'F'
    }
  }


}
