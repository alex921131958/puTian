import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from '../../util/event-bus'
import MapCommonLayer from "../map/mapCommonLayer";

export default class workFlowDiagramHandler {
  constructor(_view) {
    this._view = _view;
  }

  //交通影响预测数据
  trafficPredictionData(){
    let _this = this;
    let curId = this._view.cur_pro_id;
    let timeTag = this._view.stepSixTimeTag==='早高峰'?'M':'N';
    let mode = this._view.curFlow;
    let sort = this._view.sortFunc;
    let url = `${MYCONF.service.trafficPredictionEcharts}projectid=${curId}&timetag=${timeTag}&token=${sessionStorage.getItem("token")}`;
    this._view.$http.get(url,{
      before(request){
        request.headers.set('Cache-Control','max-age=36000')
      }
    }).then(res => {
      let result = res.body.result;
      let tempObj = {
        speed_predict: [],
        speed_add: [],
        vc_predict: [],  //饱和度
        vc_add: [],
        vol_predict: [],
        vol_add: [],
      };
      let baseObj = JSON.parse(JSON.stringify(tempObj));
      let roadNameObj = JSON.parse(JSON.stringify(tempObj));
      let tableData = JSON.parse(JSON.stringify(tempObj));
      const temp = Object.keys(tempObj);
      temp.map((item)=>{
        if (result[item]){
          result[item].map((res, index)=>{
            if(index<10) {   //取前10项数据
              // tempObj[item].push(res.predict);
              tempObj[item].push({
                name:res.linkid,
                value:res.predict.toFixed(2)});
              roadNameObj[item].push(res.roadname ? res.roadname.replace('公路','') : '未命名道路');
              // baseObj[item].push(res.base);
              baseObj[item].push({
                name:res.linkid,
                value:res.base.toFixed(2)});
            }
            tableData[item].push(res)
          })
        }
      });
      _this._view.tableObj = tableData;
      _this._view.postObj = [baseObj,tempObj,roadNameObj];
      _this._view.isTimeout = true;
      this._view.xAxis = roadNameObj;
      _this.trafficPrediction(mode, sort, _this._view.postObj);
      eventBus.$emit('trafficPredictionDataSuccess',[mode, sort, tableData])
    }).catch((err)=> {
      console.log(err)
    })
  }


  //交通影响预测图
  trafficPrediction(mode, sort, data){
    let curId = this._view.cur_pro_id;
    let obj = {
      base: [],
      after:[],
      name: []
    };
    const temp = Object.keys(obj);
    temp.map((item, index)=>{
      obj[item] = (mode==='饱和度' && sort==='影响后饱和度')?data[index].vc_predict :
        (mode==='饱和度' && sort==='饱和度影响')?data[index].vc_add :
          (mode==='流量' && sort==='影响后流量')?data[index].vol_predict :
            (mode==='流量' && sort==='流量影响')?data[index].vol_add :
              (mode==='速度' && sort==='影响后速度')?data[index].speed_predict :
                (mode==='速度' && sort==='速度影响')?data[index].speed_add : [];
    });
    let option = {
      backgroundColor:'#2f2f2f',
      legend:{
        data: ['背景','影响后'],
        bottom: -5,
        textStyle:{
          color:'#fff'
        }
      },
      tooltip: {
        trigger: 'axis',
        textStyle:{
          align:'left'
        },
        axisPointer : {
          type : 'shadow'
        }
      },
      grid: {
        top: 10,
        bottom: 40,
        left:45,
        right:15,
      },
      yAxis:{
        type: 'value',
        axisLine:{
          lineStyle:{
            color: '#eee',
            opacity: 0.2
          }
        },
        axisTick:{
          lineStyle:{
            color: '#eee',
            opacity: 0.5,
            width:0.6
          }
        },
        splitLine:{
          lineStyle:{
            color: '#eee',
            opacity: 0.1
          }
        }
      },
      xAxis:{
        type: 'category',
        data: obj.name,
        axisLine:{
          lineStyle:{
            color: '#eee',
            opacity: 0.2
          }
        },
        axisTick:{
          lineStyle:{
            color: '#eee',
            opacity: 0.2,
            width:0.6
          }
        },
        axisLabel:{
          interval: 0,
          // rotate: 10
        },
        splitLine:{
          lineStyle:{
            color: '#eee',
            opacity: 0.1
          }
        }
      },
      series:[{
        name: '背景',
        type: 'bar',
        data: obj.base,
        itemStyle:{
          normal:{
            color:'#80BFAC',
          }
        }
      },{
        name: '影响后',
        type: 'bar',
        data: obj.after,
        itemStyle:{
          normal:{
            color:'#F17C4A',
          }
        }
      }]
    };
    this._view.myChart.clear();
    this._view.myChart.setOption(option);
    this._view.myChart.on('click', (param)=>{
      MapCommonLayer.locateRoadCenter(this._view,param.data.name,curId);
    })
  }

}
