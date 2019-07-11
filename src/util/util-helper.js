
class utilHelper {

  static setMidZoom(zoom){
    let IntNum = parseInt(zoom);   //取整
    let remNum = zoom % 1 >= 0.5 ? 0.5 : 0;   //取整
    return IntNum + remNum;
  }

  static setPanelObj(obj){       //时间转文字对象
    let curYear = null;
    let curSeason = null;
    let curDate = null;
    let curTime = null;
    curYear = obj.year;
    curSeason = obj.season === 1?'第一季度':obj.season === 2?'第二季度':obj.season === 3?'第三季度':obj.season === 4?'第四季度':'全年';
    curDate = obj.datetag===1?'工作日':'非工作日';
    curTime = obj.hour;
    return {
      year:curYear,
      season:curSeason,
      datetag:curDate,
      hour:curTime,
    }
  }

  static setTimeObj(obj){      //对象转时间
    let curYear = null;
    let curSeason = null;
    let curDate = null;
    let curTime = null;
    let curTimeSel = null;
    curYear = obj.year;
    curSeason = obj.season === '第一季度'?1:obj.season === '第二季度'?2:obj.season === '第三季度'?3:obj.season === '第四季度'?4:0;
    curDate = obj.datetag==='工作日'? 1 : 0;
    curTime = obj.hour===31||obj.hour===32 ? 8:obj.hour;
    curTimeSel = obj.hour===31?'早高峰':obj.hour===32 ? '晚高峰':'';
    return {
      year:curYear,
      season:curSeason,
      datetag:curDate,
      hour:curTime,
      cursel:curTimeSel
    }
  }

  // 拼接link信息转idList
  static getlinkId(str){
    let idList = [];
    let list = str.split("+");
    list.map((item) => {
      let linkItem = item.split("#");
      idList.push(linkItem[0]);
    });
    return idList;
  }

  // 拼接link信息转linkList
  static getlinkList(str){
    let linkList = [];
    let list = str.split("+");
    list.map((item) => {
      let linkItem = item.split("#");
      linkList.push({
        id:linkItem[0],
        name:linkItem[1],
        len:linkItem[2]?parseInt(linkItem[2]):null,
      })
    });
    return linkList;
  }

  //拼接Village信息转idList
  static getVillageId(str){
    let villageList = [];
    let list = str.split("+");
    list.map((item)=> {
      let villageItem = item.split("#");
      villageList.push(villageItem[0]);
    });
    return villageList;
  }

  //拼接village信息转villageList
  static getVillageList(str){
    let villageList = [];
    let list = str.split("+");
    list.map((item)=> {
      let villageItem = item.split("#");
      villageList.push({
        id:villageItem[0],
        name:villageItem[1],
      })
    });
    return villageList;
  }
}

export default utilHelper;
