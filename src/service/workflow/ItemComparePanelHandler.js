import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from '../../util/event-bus'
import MapCommonLayer from "../map/mapCommonLayer";

export default class compareTableHandler {
  constructor(_view) {
    this._view = _view;
  }

  getCompareEchartData(){
    let type = this._view.compareShowType;
    let Datatype = type==='speed'? 'sta': type==='flow' ? 'vf' : type==='saturation' ? 'vcta' : 'los';
    let token = sessionStorage.getItem("token");
    let pid1 = this._view.comparePlan1_id;
    let pid2 = this._view.comparePlan2_id;
    let url = MYCONF.service.getComparedDataHistograms + `token=${token}&projectid1=${pid1}&projectid2=${pid2}&Datatype=${Datatype}&limit=10`;
    this._view.$http.get(url).then(res=>{
      res = res.body.result;
      let x_axis1=[], y_axis1_1=[], y_axis1_2=[], y_axis1_3=[];
      let x_axis2=[], y_axis2_1=[], y_axis2_2=[], y_axis2_3=[];
      let x_axis3=[], y_axis3=[];
      if(res.histogram1.length===0 || res.histogram2.length===0){

      }else{
        if(res.histogram1.length!==0){
          res.histogram1.map(item=>{
            x_axis1.push(item.roadname ? item.roadname.replace('公路','') : '-');
            y_axis1_1.push(type==='speed'?item.sta_1.toFixed(1) :
              type==='flow'? item.vf_1.toFixed(1) :
                type==='saturation'? item.vcta_1.toFixed(1) : item.los_1);
            y_axis1_2.push(type==='speed'?item.sta_2.toFixed(1) :
              type==='flow'? item.vf_2.toFixed(1) :
                type==='saturation'? item.vcta_2.toFixed(1) : item.los_2);
            y_axis1_3.push(item.param_diff.toFixed(1));
          });
        }
        if(res.histogram2!==0){
          res.histogram2.map(item=>{
            x_axis2.push(item.roadname ? item.roadname.replace('公路','') : '-');
            y_axis2_1.push(type==='speed'?item.sta_1.toFixed(1) :
              type==='flow'? item.vf_1.toFixed(1) :
                type==='saturation'? item.vcta_1.toFixed(1) : item.los_1);
            y_axis2_2.push(type==='speed'?item.sta_2.toFixed(1) :
              type==='flow'? item.vf_2.toFixed(1) :
                type==='saturation'? item.vcta_2.toFixed(1) : item.los_2);
            y_axis2_3.push(item.param_diff.toFixed(1));
          });
        }
        if(res.histogram3!==0){
          res.histogram3.map(item=>{
            x_axis3.push(item.roadname ? item.roadname.replace('公路','') : '-');
            y_axis3.push({
              name: item.linkid_navinfo,
              value: type==='speed'? item.sta_diff.toFixed(1) :
                type==='flow'? item.vf_diff.toFixed(1) :
                  type==='saturation'? (item.vcta_diff*100).toFixed(0):
                    item.los_diff
            });
          });
        }
      }

      this._view.echartData1 = [x_axis1,y_axis1_1,y_axis1_2,y_axis1_3];
      this._view.echartData2 = [x_axis2,y_axis2_1,y_axis2_2,y_axis2_3];
      this._view.echartData3 = [x_axis3,y_axis3];
      this._view.xAxis = x_axis1;
      let str = this._view.compareFun.substring(0,3);
      let data = str==='方案1'?this._view.echartData1 : str==='方案2'? this._view.echartData2 : this._view.echartData3;
      this.setCompareEchart(data);
    })
  }

  setCompareEchart(data){
    let yAxis={
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
    };
    if(this._view.compareShowType==='service') yAxis.minInterval =1;
    if(this._view.compareShowType==='saturation') {
      yAxis.axisLabel = {
        formatter: function (value) {
          return value + '%'
        }
      }
    }
    let series;
    if (data && data.length === 2){
      series = [{
        name: '方案2-方案1',
        type: 'bar',
        data: data[1],
        barWidth : 20,
        itemStyle:{
          normal:{
            color:function (params) {
              return params.data <= 0 ? '#C7D540' : '#FF6962'
            }
          }
        }
      }]
    }
    else if(data && data.length === 4){
      series = [{
        name: '方案1',
        type: 'bar',
        barGap: 0,
        data: data[1],
        itemStyle:{
          normal:{
            color:'#FF6962',
          }
        }
      },{
        name: '方案2',
        type: 'bar',
        data: data[2],
        itemStyle:{
          normal:{
            color:'#3B90EE',
          }
        }
     },{
        name: '方案2-方案1',
        type: 'bar',
        data: data[3],
        itemStyle:{
          normal:{
            color:'#ADADAD',
          }
        }
      }]
    }
    let option = {
      backgroundColor:'#2f2f2f',
      legend:{
        data: ['方案1','方案2','方案2-方案1'],
        bottom: 5,
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
        top: 20,
        bottom: 55,
        left:45,
        right:15,
      },
      xAxis:{
        type: 'category',
        data: data[0],
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
          },
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
      yAxis: yAxis,
      series: series
    };
    if(this._view.compareShowType==='saturation'){
      option.tooltip={
        trigger: 'axis',
        textStyle:{
          align:'left'
        },
        axisPointer : {
          type : 'shadow'
        },
        formatter: function (params) {
          let res = params[0].name + '<br/>';
          res += '方案2-方案1: &nbsp;' + params[0].data.value + '%';
          return res
        },
      }
    }
    this._view.myChart.clear();
    this._view.myChart.setOption(option);

    this._view.myChart.on('click', (param)=>{
      MapCommonLayer.locateCenter(this._view,param.data.name);
    })
  }

}
