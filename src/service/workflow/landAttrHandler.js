/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import MapCommonLayer from '../../service/map/mapCommonLayer'
import datetimeHelper from '../../util/datetime-helper'
import FLOWCONF from "../../components/workflow/flowConf";

export default class landAttrHandler {
  constructor(_view) {
    this._view = _view;
  }

  getSubDict() {
    let url = MYCONF.service.findSubDict;
    let _this = this;
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&key=saveProjectLandInfo`).then((res) => {
      res = res.body;
    });
  }

  saveLandItem() {
    let carRatio = this._view.carTrafficVol;
    let baseAttr = this._view.landAreaObj;
    let curId = this._view.cur_pro_id;
    let curLandId = this._view.curLandId ? this._view.curLandId : '';
    let url = MYCONF.service.saveLandInfo + `token=${sessionStorage.getItem("token")}`;
    let curCoordinate = this._view.curEditPool.geometry.coordinates[0];

    let typeList = this._view.landAreaObj.typeList;
    let ratioList = this._view.landAreaObj.ratioList;
    //TODO:这里是地块性质参数
    let landType = MapCommonLayer.formatLandType(this._view,typeList,ratioList,null);
    if(landType === 0 || landType === 100) return;

    const loadFlaf = this._view.$Message.loading({
      content:'正在保存...',
      duration:0
    });
    this._view.updateAttributePanel(null);   //统一在AttrSave中，由于用地总之100%判断，移至此处
    let landInfo= {
      id: curLandId,
      projectid: curId,
      name: baseAttr.name,
      landarea: baseAttr.baseArea,
      plotratio: baseAttr.volume,
      buildingArea: parseFloat((baseAttr.baseArea * baseAttr.volume).toFixed(2)),
      // population: baseAttr.population,
      type: 'Polygon',
      points: curCoordinate,
      dayaoCoefficient:carRatio.daily.generate,
      dayadCoefficient:carRatio.daily.attract,
      daymoCoefficient:carRatio.earlyPeak.generate,
      daymdCoefficient:carRatio.earlyPeak.attract,
      daynoCoefficient:carRatio.latePeak.generate,
      dayndCoefficient:carRatio.latePeak.attract,
    };
    let landInfoParam = Object.assign(landInfo, ...landType);

    let _this = this;
    let curLandList = this._view.landList;
    this._view.$http.post(url, landInfoParam,
      {
        'header': {
          'Content-Type': "application/json"
        }
      }).then((res) => {
      res = res.body;
      if (res.success) {
        setTimeout(loadFlaf,20);
        if (!curLandId) {  //新建时重绘，编辑时忽略此步骤
          _this.repaintPolygon(res.result.id);
          curLandList.push(res.result.id);
          _this._view.updateLandList(curLandList);
        }else{
          let featureId = env.edit.setSelected([]);
        }
        _this._view.updateCurLandId(res.result.id);

        //执行了保存操作-必然保存的是当前数据池中数据
        eventBus.$emit("saveLandItem");
        eventBus.$emit("updateTableLand");

        MapCommonLayer.onLandEditClick('static');
        // eventBus.$emit("highlightCurLand");  //->table中
      } else {
        setTimeout(loadFlaf,20);
        _this._view.$Message.warning({
          content: res.msg?res.msg:'保存失败',
          duration: 5,
          closable: true
        });
      }
    },(res) => {
      setTimeout(loadFlaf,20);
      _this._view.$Message.warning({
        content: '用地保存请求出错',
        duration: 5,
        closable: true
      });
    });
  }

  landAttrCancel() {
    let curLandId = this._view.curLandId;
    if (curLandId) {
      let url = MYCONF.service.findLandInfo;
      let _this = this;
      this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&landID=${curLandId}`).then((res) => {
        res = res.body;
        let result = res.result;
        let feature = {
          id: result.id,
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [result.points]
          }
        };
        let featureId = env.edit.setSelected([]);
        env.edit.draw.add(feature);
        MapCommonLayer.onLandEditClick('static');
      });
    } else {
      env.edit.draw.delete(this._view.curEditPool.id);
      this.setItemOdLayerHide(true);
    }
    eventBus.$emit("landAttrCancel");  //table->取消高亮
    this._view.updateCurEditPool(null);
    //TODO:恢复全部OD期望线
  }

  landAttrDelete(){
    let curLandId = this._view.curLandId;
    if (curLandId) {
      eventBus.$emit("deleteLandItem",curLandId);  //转到table组件 复用删除
    }
    env.edit.draw.delete(this._view.curEditPool.id);
    this.setItemOdLayerHide(true);
    this._view.updateCurEditPool(null);
  }

  repaintPolygon(id) {
    let color = this._view.landColor;
    let feature = {
      id: id,
      type: 'Feature',
      properties: {},
      geometry: this._view.curEditPool.geometry
    };
    let featureId = env.edit.draw.add(feature);
    env.edit.draw.delete(this._view.curEditPool.id);
    //新建地块颜色设置
    //TODO:地块颜色设置
   /* let styleId = env.edit.setSelected([featureId]);
    env.edit.setCustomStyle({
      "fillColor":color,
      "fillOpacity":0.1,
      "fillOutlineColor":color,
      "lineColor":color,
      "circleColor":color,
    });*/
    this._view.updateCurEditPool(feature);
  }

  //计算、更新出行量信息
  updateTraInfo() {
    let carRatio = this._view.carTrafficVol;
    let proId = this._view.cur_pro_id;
    let timeTag = this._view.time_tag==='早高峰'?'M':'N';
    let typeList = this._view.landAreaObj.typeList;
    let ratioList = this._view.landAreaObj.ratioList;
    let population = this._view.landAreaObj.population;
    let baseAttr = this._view.landAreaObj;
    //TODO:这里是地块性质参数
    let landType = MapCommonLayer.formatLandType(this._view,typeList,ratioList,"&");
    if(landType === 0 || landType === 100) return;

    let url = MYCONF.service.landODPredict;
    let pointList = [];
    let curCoordinate = this._view.curEditPool.geometry.coordinates[0];
    let _this = this;
    let polygon = turf.polygon([[...curCoordinate]]);
    let center = turf.centerOfMass(polygon);

    let centerStr = center.geometry.coordinates;

    this._view.updateGlobalLoading(true);
    this._view.$http.get(url + `token=${sessionStorage.getItem("token")}&projectid=${proId}&timeTag=${timeTag}&${landType}&x=${centerStr[0]}&y=${centerStr[1]}&aoCoefficient=${carRatio.daily.generate}&adCoefficient=${carRatio.daily.attract}&moCoefficient=${carRatio.earlyPeak.generate}&noCoefficient=${carRatio.earlyPeak.attract}&ndCoefficient=${carRatio.latePeak.generate}&mdCoefficient=${carRatio.latePeak.attract}&landarea=${baseAttr.baseArea}&plotratio=${baseAttr.volume}`,{
      before(request) {
        _this._view.curRequest = request;
      }
    }).then((res) => {
      res = res.body;
      if (res.success) {
        _this._view.updateGlobalLoading(false);
        let data = res.result;
        let tempInfo = _this._view.trafficInfo;
        _this._view.$set(tempInfo.daily,"generate",parseInt(data.O_PSG_A));
        _this._view.$set(tempInfo.daily,"attract",parseInt(data.D_PSG_A));
        _this._view.$set(tempInfo.daily,"count",parseInt(data.OD_PSG_A));
        _this._view.$set(tempInfo.earlyPeak,"generate",parseInt(data.O_PSG_M));
        _this._view.$set(tempInfo.earlyPeak,"attract",parseInt(data.D_PSG_M));
        _this._view.$set(tempInfo.earlyPeak,"count",parseInt(data.OD_PSG_M));
        _this._view.$set(tempInfo.latePeak,"generate",parseInt(data.O_PSG_N));
        _this._view.$set(tempInfo.latePeak,"attract",parseInt(data.D_PSG_N));
        _this._view.$set(tempInfo.latePeak,"count",parseInt(data.OD_PSG_N));
        _this._view.trafficInfo = JSON.parse(JSON.stringify(tempInfo));
        _this.renderOdLayer(data.OD);
        MapCommonLayer.onLandEditClick("static");//当前不可编辑
      }else{
        _this._view.updateGlobalLoading(false);
        _this._view.$Message.warning({
          content:res.msg?res.msg:'交通分配失败',
          duration:3,
          closable: true
        });
      }
    },(res) => {
      _this._view.updateGlobalLoading(false);
      _this._view.$Message.warning({
        content: '交通分布预测请求出错！',
        duration:5,
        closable: true
      });
    });
  }

  renderOdLayer(result) {
    let odType = this._view.landOdType === '双向' ? 'OD' : this._view.landOdType === '仅出发' ? 'O' : 'D';
    let lineList = [];
    let pointList = [];
    let allData = [];
    let radioList = [];
    let odColor = this._view.landOdColor;
    let odWidth = this._view.landOdWidth;
    let expMin = this._view.odExpMin;
    let expMax = this._view.odExpMax;
    let colorType = this._view.colorType;
    let colors = FLOWCONF.LANDODCOLORS;

    result.map((item, index) => {
      let psg = parseFloat(item.psg.toFixed(1));
      let psgMax = parseInt(item.psg_max)<parseInt(expMax)? parseInt(item.psg_max):parseInt(expMax);
      radioList.push(psg);
      let odItem = {
        name: `land-${index}`,
        count: psg,
        countMax: psgMax,
        dest: `land-${index}`,
        coords: [[parseFloat(item.o_lon), parseFloat(item.o_lat)], [parseFloat(item.d_lon), parseFloat(item.d_lat)]],
        lineStyle: {
          normal: {
            width: MapCommonLayer.getOdWidth(psg,psgMax,odWidth),
            color: colorType==='彩色'?MapCommonLayer.getOdColor(colors,psg):odColor,
          }
        },
        odTag: item.odtag
      };

      allData.push(odItem);
      this._view.allOdData = allData;
      this._view.updateLandOdData(allData);
      if (odType === 'OD' || odType === item.odtag) {
        let itemPsg = psg > expMax ? expMax : psg;
        if(item.psg >= expMin){    //满足最小阈值
          lineList.push({
            name: `land-${index}`,
            count: itemPsg,
            countMax: psgMax,
            dest: `land-${index}`,
            coords: [[parseFloat(item.o_lon), parseFloat(item.o_lat)], [parseFloat(item.d_lon), parseFloat(item.d_lat)]],
            lineStyle: {
              normal: {
                width: MapCommonLayer.getOdWidth(itemPsg,psgMax,odWidth),
                color: colorType==='彩色'?MapCommonLayer.getOdColor(colors,psg):odColor,
              }
            },
            odTag: item.odtag
          });
          pointList.push({
            name: `land-${index}`,
            value: item.odtag==="D"?[item.o_lon,item.o_lat]:[item.d_lon,item.d_lat],
            // symbolSize:2,
            // symbolSize: itemPsg/20 > 10 ? Math.sqrt(itemPsg)-4 : itemPsg/20+1.5,
            symbolSize: psgMax <= 20 ?2: itemPsg/20 > 20 ? 5+(Math.sqrt(itemPsg)/2 -5)/4
              : itemPsg/20 > 10 ? Math.sqrt(itemPsg)/2-1.5
                : itemPsg/20 > 5 ? Math.sqrt(itemPsg)/2
                  : itemPsg/20,
            itemStyle:{"normal":{"color":"#ffffff"}}
          })
        }
      }
    });

    //添加形星点
    pointList.push({
      name: `land-center`,
      value: result[0].odtag==='D'?[result[0].d_lon,result[0].d_lat]:[result[0].o_lon,result[0].o_lat],
      symbolSize: 15,
      itemStyle:{"normal":{"color":"#fbf5c1"}}
    });

    const series = [{
      name: "step-2",
      type: 'lines',
      coordinateSystem: 'GLMap',
      zlevel: 2,
      lineStyle: {
        normal: {
          // color: odColor,
          width: 1,
          opacity: 0.7,
          curveness: 0.1
        }
      },
      data: lineList
    },
      {
        name: '地点',
        type: 'effectScatter',
        coordinateSystem: 'GLMap',
        zlevel: 2,
        rippleEffect: {
          brushType: 'stroke',
          period:10,
          scale:1
        },
        label: {
          emphasis: {
            show: false,
            position: 'right',
            formatter: '{b}'
          }
        },
        symbolSize: 2,
        showEffectOn: 'render',
        itemStyle: {
          normal: {
            show: true,
            color: '#46bee9',
            shadowBlur: 20,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        data: pointList
      }
    ];
    let option = {
      GLMap: {
        roam: true
      },
      tooltip: {
        trigger: 'item',
        backgroundColor:datetimeHelper.colorToRgba(odColor),
        opacity:0.5,
        // color: '#D7191C',
        formatter: function (param) {
          return param.data.count;
          // return param.data.count;
        }
      },
      series: series
    };

    env.landOdLayerOption = option;
    if (env.echartLayer) {
      env.echartLayer.remove();
      env.echartLayer = null;
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
    } else {
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
    }

    env.echartLayer.chart.setOption(option);
    env.echartLayer.chart.resize({
      width: env.cWidth,
      height: env.cHeight
    });

  }

  formatLandAttr(data) {
    let feature = {
      id: data.id,
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [data.points]
      }
    };
    this._view.updateCurEditPool(feature);
  }


  //控制用地规划期望线显隐
  setItemOdLayerHide(bool){
    if(!bool){
      if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
      env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
      env.echartLayer.chart.setOption(env.landOdLayerOption);
      env.echartLayer.chart.resize({
        width: env.cWidth,
        height: env.cHeight
      });
    }else{
      if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
    }
  }

  stopDiagramRequest(){
    let curRequest = this._view.curRequest;
    let _this = this;
    if (curRequest) {
      //TODO:中止请求
      curRequest.abort();
      this._view.$Message.warning({
        content: '已成功中止该请求',
        duration:3,
        closable: true
      });
      setTimeout(() => {
        _this._view.updateGlobalLoading(false);
      },200)
    }
  }

}


