/**
 * Created by limei on 2018/7/20.
 */
import MYCONF from '../../myconf'
import env from '../../common/env'

export default function mapInit(){
  let _this = this;
  /*let t = setInterval(function () {
    //if (map && 其它业务判断) {
    if (minemap) {
      //加载成功后业务处理
      clearInterval(t);

    }
  }, 500);*/

  // minemap.spriteUrl = '//minedata.cn/minemapapi/v2.0.0/sprite/sprite';
  minemap.serviceUrl = MYCONF.map.domain + '/service';
  minemap.accessToken = MYCONF.map.token;
  minemap.solution = MYCONF.map.solu;
  minemap.domainUrl = MYCONF.map.domain;
  minemap.spriteUrl = MYCONF.map.spriteUrl;
  minemap.fontsUrl = MYCONF.map.fontUrl;
  minemap.dataDomainUrl = MYCONF.map.dataDomainUrl;//'//datahive.minedata.cn';
  env.map = new minemap.Map({
    container: 'map-container',
    style: MYCONF.map.style,
    center: MYCONF.map.center,
    zoom: MYCONF.map.zoom,
    pitch: 0,
    maxZoom: 17.4, //地图最大缩放级别限制
    minZoom: 3,
    preserveDrawingBuffer: true    //截取canvas图片功能
  });
  // env.map.repaint = true;
  // env.map.showTileBoundaries = true;

  env.map.on("load",() => {
    _this.controller.setRoadEvent();

    _this.controller.loadImages();
    //获取底图图层信息
    _this.controller.getMapLayerList();

    _this.controller.getMapContainer();
    env.map.resize();
  })

}

