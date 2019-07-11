import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from "../../util/event-bus";
import MapCommonLayer from '../../service/map/mapCommonLayer'

export default class lineAttrHandler {
  constructor(_view) {
    this._view = _view;
  }

  //删除地图上的道路
  deleteRoadFromMap(line){
    let mymap = env.leaf_map;
    //todo 这里需要再删除一次用以测试
    let num = line._leaflet_id - 1;
    mymap.removeLayer(line);
    // mymap.removeLayer(mymap._layers[num])
    if (this._view.curLinePool){
      this._view.updateCurLinePool(null);
      this._view.updateCurJudgeState(null);
    }
  }

  //删除数据库中的道路
  deleteRoadFromServies(roadId, projectid){
    let url = MYCONF.service.deleteRoadByRoadId;
    let _this = this;
    this._view.$http.get(url+`?roadId=${roadId}&projectid=${projectid}&token=${sessionStorage.getItem("token")}`).then((res)=> {
      res = res.body;
      eventBus.$emit('reGetTableList')
    })
  }
}
