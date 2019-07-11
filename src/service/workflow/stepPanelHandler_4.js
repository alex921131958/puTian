/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import datetimeHelper from "../../util/datetime-helper";
import MapCommonLayer from "../map/mapCommonLayer";
import FLOWCONF from '../../components/workflow/flowConf'

export default class stepPanelHandler_4 {
  constructor(_view) {
    this._view = _view;
  }

  regEditEvent(){
    let map = env.map;
    let edit = env.edit;
    let _this = this;
    map.on("edit.record.create", (e) => {
      if(_this._view.active_tool) return;
      let landList = _this._view.landList;
      let curEditPool = _this._view.curEditPool;
      let actionType = e.record.type;
      let geometry = e.record.features[0].geometry;
      let coordinates = geometry.coordinates;
      if(actionType === 3){
        _this._view.setLandEdit();
      }
      if(actionType === 1){
        if(curEditPool && landList.indexOf(curEditPool.id)===-1){  //如果对新建未保存地块进行delete删除
          _this._view.updateLandEditable(false);
          _this._view.$Message.warning({
            content: '当前新建地块已通过delete删除',
            duration:2,
            closable: true
          });
          MapCommonLayer.onLandEditClick('static');
        }
        _this._view.updateCurEditPool(null);
        //删除地块-取消左侧属性面板
        _this._view.updateAttributePanel("");
      }else{
        _this._view.updateCurEditPool(e.record.features[0]);

        //如果修改
        if(actionType === 2 && e.record.features.length === 1){
          let iTime;
          clearTimeout(iTime);
          iTime = setTimeout(function () {
            _this._view.updateLandBaseArea(parseFloat(turf.area(_this._view.curEditPool).toFixed(2)));
            if(_this._view.attributePanel==="land"){
              eventBus.$emit("updatePopulation");
            }
            /*if(_this._view.landList.indexOf(_this._view.curEditPool.id) !== -1){  //对已保存地块编辑
              _this._view.updateAttributePanel("land");
              _this.editToLandAttr(_this._view.curEditPool.id);
              _this.setEchartLayerHide(true);
            }*/
          }, 500);
        }
      }
    });
    map.on("edit.selected", (e) => {
      if(_this._view.active_tool) return;
      let curEditPool = _this._view.curEditPool;
      let landList = _this._view.landList;
      if(landList.indexOf(curEditPool.id)===-1){
        let selId = env.edit.setSelected([curEditPool.id]);
        _this._view.$Message.warning({
          content: '请点击结束当前新建地块编辑',
          duration:2,
          closable: true
        });
        return false;
      }
      let selData = env.edit.draw.getSelected();
      let geometry = selData.features[0].geometry;
      _this._view.updateCurEditPool(selData.features[0]);
      _this._view.updateCurLandId(selData.features[0].id);   //flowTable中做的变化监听

     eventBus.$emit("highlightCurLand");   //->table中，scrollTop相应位置
    });
  }

  calcLandInfo(){
    this.calcRealArea();
  }

  //计算占地面积
  calcRealArea(){
    let curArea = turf.area(this._view.curEditPool);
    this._view.updateLandBaseArea(parseFloat(curArea.toFixed(1)));
  }

  getStepParam(){
    let tempObj = {};
    let curMenu = 'step-4';
    let curProId = this._view.cur_pro_id;
    let _this = this;
    let url = MYCONF.service.findStepSettings + `${curMenu}&projectid=${curProId}&token=${sessionStorage.getItem("token")}`
    this._view.$http.get(url).then((res) => {
      res = res.body;
      if(res.result.length === 0){
        return ;         //之前没有保存应用记录
      }else{
        let paramList = res.result;

        paramList.map((item) => {
          let key = item.key;
          tempObj[key] = key==='expMin'||key==='expMax'||key==='expWidth'?parseInt(item.value):item.value;
          if(key!=='colorType') _this._view[key] = key==='expMin'||key==='expMax'||key==='expWidth'?parseInt(item.value):item.value;
        });
        _this._view.updateLandParamObj(tempObj);
        _this._view.updateLandColor(tempObj.areaColor);
        _this._view.updateLandOdColor(tempObj.odColor);
        _this._view.updateLandOdType(tempObj.odContent);
        _this._view.updateLandOdWidth(tempObj.expWidth);
        _this._view.updateOdExpMax(tempObj.expMax);
        _this._view.updateOdExpMin(tempObj.expMin);
        _this._view.updateTimeTag(tempObj.timeTag);
        _this._view.updateColorType(tempObj.colorType);
        if(_this._view.$refs['odDisplay']) _this._view.$refs['odDisplay'].setColorType(tempObj.colorType);
      }
    });
  }

  saveStepParam_4() {
    let landColor = this._view.areaColor;
    let landLabel = this._view.curShowType;
    let expMin = this._view.expMin;
    let expMax = this._view.expMax;
    let expWidth = this._view.expWidth;
    let odContent = this._view.odContent;
    let odColor = this._view.odColor;
    let timeTag = this._view.timeTag;
    let colorType = this._view.colorType;
    let curProId = this._view.cur_pro_id;
    let _this = this;
    this._view.$http.post(MYCONF.service.saveStepSettings+`?token=${sessionStorage.getItem('token')}`, {
      projectid:curProId,
      menuid:'step-4',
      keys:'areaColor,curShowType,expMin,expMax,expWidth,odContent,odColor,timeTag,colorType',
      values:`${landColor},${landLabel},${expMin},${expMax},${expWidth},${odContent},${odColor},${timeTag},${colorType}`,
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

  //控制用地规划期望线显隐
  setEchartLayerHide(bool){
    if(!bool){
      /*if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
      let echartOption = this._view.attributePanel==="land"?env.landOdLayerOption:env.projectOdLayerOption;
      if(this._view.attributePanel==="land"){
        env.echartLayer = minemap.Template.create({map: env.map, type: 'od'});
        env.echartLayer.chart.setOption(env.landOdLayerOption);
        env.echartLayer.chart.resize({
          width: env.cWidth,
          height: env.cHeight
        });
      }*/
    }else{
      if (env.echartLayer) {
        env.echartLayer.remove();
        env.echartLayer = null;
      }
    }
  }

  changeLandColor(color){
    //edit插件只能对已选中项进行修改
    let landList = this._view.curEditPool?[...this._view.landList,this._view.curEditPool.id]:this._view.landList;
    //TODO:地块颜色设置
    /*let featureId = env.edit.setSelected(landList);
    env.edit.setCustomStyle({
      "fillColor":color,
      "fillOpacity":0.1,
      "fillOutlineColor":color,
      "fillOutlineWidth":2,
      "lineColor":color,
      "lineWidth": 2,
      "circleBorderColor":"#ffffff",
      "circleBorderRadius":2,
      "circleColor":color,
      "circleRadius":4
    })*/
  }
  setLandLayerHide(bool){
    if(bool){
      this._view.editDrawList = env.edit.draw.getAll();
      env.edit.draw.delete(this._view.landList);
    }else{
      env.edit.draw.add(this._view.editDrawList);
    }
  }

  updateOdLineRender(lineType,count){
    if(!env.echartLayer || !env.landOdLayerOption){
      return ;
    }
    let expMax = this._view.odExpMax;
    let expMin = this._view.odExpMin;
    let odType = this._view.landOdType === '双向' ? 'OD' : this._view.landOdType === '仅出发' ? 'O' : 'D';
    let odData = this._view.landOdData;
    let odColor = this._view.landOdColor;
    let colorType = this._view.colorType;
    let colors = FLOWCONF.LANDODCOLORS;
    let odWidth = this._view.landOdWidth;
    let odList = [];
    switch (lineType){
      case 'color':
        /*env.landOdLayerOption.series[0].lineStyle.normal.color = count;
        env.landOdLayerOption.tooltip.backgroundColor = datetimeHelper.colorToRgba(count);*/
        odData = env.landOdLayerOption.series[0].data ;
        odData.map((item) => {
          let color = count==='彩色'?MapCommonLayer.getOdColor(colors,item.count):odColor;
          item.lineStyle.normal.color = color;
        });
        env.landOdLayerOption.series[0].data = odData;
        break;
      case 'type':
        odType = count === '双向' ? 'OD' : count === '仅出发' ? 'O' : 'D';
        odData.map((item) => {
          if (odType === 'OD' || odType === item.odTag) {
            if (item.count > expMax) {
              let tempItem = item;
              tempItem.count = expMax;
              tempItem.lineStyle.normal.width = MapCommonLayer.getOdWidth(tempItem.count,tempItem.countMax,odWidth);
              odList.push(tempItem);
            }else if (item.count >= expMin){
              item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count,item.countMax,odWidth);
              odList.push(item);
            }
          }
        });
        env.landOdLayerOption.series[0].data = odList;
        break;
      case 'width':
        odData = env.landOdLayerOption.series[0].data ;
        odData.map((item) => {
          item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count,item.countMax,count);
        });
        env.landOdLayerOption.series[0].data = odData;
        break;
      case 'expMax':
        odData.map((item) => {
          if (odType === 'OD' || odType === item.odTag){
            if (item.count > count) {
              let tempItem = item;
              tempItem.count = count;
              tempItem.lineStyle.normal.width = MapCommonLayer.getOdWidth(tempItem.count,tempItem.countMax,odWidth);
              odList.push(tempItem);
            }else if (item.count >= expMin){
              item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count,item.countMax,odWidth);
              odList.push(item);
            }
          }
        });
        env.landOdLayerOption.series[0].data = odList;
        break;
      case 'expMin':
        odData.map((item) => {
          if (odType === 'OD' || odType === item.odTag){
            if (item.count > expMax) {
              let tempItem = item;
              tempItem.count = expMax;
              tempItem.lineStyle.normal.width = MapCommonLayer.getOdWidth(tempItem.count,tempItem.countMax,odWidth);
              odList.push(tempItem);
            }else if (item.count >= count){
              item.lineStyle.normal.width = MapCommonLayer.getOdWidth(item.count,item.countMax,odWidth);
              odList.push(item);
            }
          }
        });
        env.landOdLayerOption.series[0].data = odList;
        break;

      case'colorType':
        odData = env.landOdLayerOption.series[0].data ;
        odData.map((item) => {
          let color = count==='彩色'?MapCommonLayer.getOdColor(colors,item.count):odColor;
          item.lineStyle.normal.color = color;
        });
        env.landOdLayerOption.series[0].data = odData;
        break;
      case'circle':
        let tempData = env.landOdLayerOption.series[0].data;
        odData = env.landOdLayerOption.series[1].data;
        odData.map((item,index) => {
          if(index < tempData.length) item.symbolSize = ((tempData[index].count/20) + 4) * this._view.expCircle;
        });
        env.landOdLayerOption.series[1].data = odData;
        break;
      default:
        break;
    }
    env.echartLayer.chart.setOption(env.landOdLayerOption);
    env.echartLayer.chart.resize({
      width: env.cWidth,
      height: env.cHeight
    });

  }


  getLandInfo(){
    let curProId = this._view.cur_pro_id;
    let _this = this;
    let url = MYCONF.service.findProject + `token=${sessionStorage.getItem("token")}&projectID=${curProId}`;
    this._view.$http.get(url).then((res) => {
      if(res.body.success){
        let data = res.body.result;
        let tempInfo = _this._view.landUse;
        _this._view.landNum = data.landnum;
        _this._view.landArea = data.landarea;
        _this._view.$set(tempInfo.daily,"generate",data.landdayao);
        _this._view.$set(tempInfo.daily,"attract",data.landdayad);
        _this._view.$set(tempInfo.daily,"count",data.landdayaa);
        _this._view.$set(tempInfo.earlyPeak,"generate",data.landdaymo);
        _this._view.$set(tempInfo.earlyPeak,"attract",data.landdaymd);
        _this._view.$set(tempInfo.earlyPeak,"count",data.landdayma);
        _this._view.$set(tempInfo.latePeak,"generate",data.landdayno);
        _this._view.$set(tempInfo.latePeak,"attract",data.landdaynd);
        _this._view.$set(tempInfo.latePeak,"count",data.landdayna);
        _this._view.landUse = JSON.parse(JSON.stringify(tempInfo));
        eventBus.$emit("updateLandInfo",data.name,data.landnum,data.landarea);

      }else{
        _this._view.$Message.warning({
          content: '地块汇总信息获取失败',
          duration:2,
          closable: true
        });
      }
    });
  }

  addRoadLineLayer() {
    let map = env.map;
    let projectId = this._view.cur_pro_id;
    let url = MYCONF.service.roadLinePbf + `?projectid=${projectId}&token=${sessionStorage.getItem("token")}`;
    if (map.getSource("roadLineLayerAll")) map.removeSource("roadLineLayerAll");
    map.addSource("roadLineLayerAll", {
      type: "vector",
      tiles: [url]
    });
    if (map.getLayer("roadLineLayerAll")) map.removeLayer("roadLineLayerAll");
    map.addLayer({
      'id': 'roadLineLayerAll',
      'type': 'line',
      'source': 'roadLineLayerAll',
      'source-layer': 'linkLayer',
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      'paint': {
        'line-color': {
          "type": "interval",
          "property": "edittag",
          "stops": [
            [0, '#e63d35'],
            [1, '#3b90ee'],
          ]
        },
        "line-width": 5
      }
    });
    if (map.getLayer("roadLineLayerLable")) map.removeLayer("roadLineLayerLable");
    map.addLayer({
      "id": "roadLineLayerLable",
      "type": "symbol",
      "source": 'roadLineLayerAll',
      'source-layer': 'linkLayer',
      "layout": {
        "text-field": "{roadname}",
        "symbol-placement": "line",
        "text-anchor": "center",
        "text-offset": [0, 0.6],
        "text-size": 13,
        "text-allow-overlap": true,   //图标覆盖文字允许压盖
        "text-ignore-placement": true,
      },
      "paint": {
        'text-color': {
          "type": "interval",
          "property": "edittag",
          "stops": [
            [0, '#e63d35'],
            [1, '#3b90ee'],
          ]
        },
        "text-halo-color": '#fff',
        "text-halo-width": 1.3,
        "text-opacity": 0.9,
        "text-halo-blur": 0.5,
      },
    });
  }

}
