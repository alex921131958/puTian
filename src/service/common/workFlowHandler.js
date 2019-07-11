/**
 * Created by limei on 2018/6/12.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'
import eventBus from '../../util/event-bus'
import mapCommonLayer from '../map/mapCommonLayer'

export default class workFlowHandler {
  constructor(_view) {
    this._view = _view;
    this.token = sessionStorage.getItem('token');
    this.lineList = [];
    this.polygonList = [];
  }
}
