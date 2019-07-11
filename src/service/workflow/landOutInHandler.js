/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import MapCommonLayer from '../../service/map/mapCommonLayer'
import datetimeHelper from '../../util/datetime-helper'
import FLOWCONF from "../../components/workflow/flowConf";

export default class landOutInHandler {
  constructor(_view) {
    this._view = _view;
  }

  saveLandOutIn(){
    let url = MYCONF.service.addEntrance;
    let tempEntry = this._view.entryArr;
    let tempPoint = this._view.lngLatArr;
    let tempRatio = this._view.ratioArr;
    let tempLink = this._view.linkArr;
    let curLandId = this._view.curLandId;
    let _this = this;
    let entranceList = [];

    tempEntry.map((entry,index) => {
      if(entry !== "未设定"){
        let entranceItem = {
          landid:curLandId,
          name:index+1,   //tempEntry[index],
          linkid:tempLink[index],
          x:tempPoint[index][0],
          y:tempPoint[index][1],
          ratio:parseInt(tempRatio[index])
        };
        entranceList.push(entranceItem);
      }
    });

    this._view.$http.post(url+`token=${sessionStorage.getItem('token')}`, entranceList,
      {
        'header': {
          'Content-Type': "application/json"
        }
      }).then(response => {
      if(response.body.success){
        eventBus.$emit("updateTableEntry");
        eventBus.$emit("saveEntryItem");
      }else{
        _this._view.$Message.warning({
          content: response.body.msg,
          duration:3,
          closable: true
        });
      }
    })
  }

  getEntryItemInfo(id){
    let url = MYCONF.service.findPWListByLand;
    let landId = id ? id : this._view.curLandId;
    let _this = this;
    this._view.$http.get(url+`token=${sessionStorage.getItem("token")}&landid=${landId}`).then((res) => {
      res = res.body;
      let result = res.result;
      if(res.success){
        if(env.entryMarkers.length>0){
          env.map.removeMarkers(env.entryMarkers);
        }

        let entryList = ["未设定","未设定","未设定","未设定"];
        let ratioList = [0,0,0,0];
        let lngLatList = [null,null,null,null];
        let linkList = [null,null,null,null];
        result.map((item,index) => {
          entryList.splice(index,1,`出入口${index+1}`);
          ratioList.splice(index,1,item.ratio);
          lngLatList.splice(index,1,[item.x,item.y]);
          linkList.splice(index,1,item.linkid);

          //批量添加当前地块marker
          let closeBox = MapCommonLayer.createEntryMarker(index+1);
          let marker = new minemap.Marker(closeBox, {offset: [-15, -15]})
            .setLngLat([item.x,item.y])
            .addTo(env.map);
          env.entryMarkers.splice(index,1,marker);
        });
        _this._view.updateEntryArr(entryList);
        _this._view.updateRatioArr(ratioList);
        _this._view.updateLngLatArr(lngLatList);
        _this._view.updateLinkArr(linkList);
      }
    });
  }

}


