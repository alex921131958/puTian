import MYCONF from '../../myconf'
import env from '../../common/env'
// import L from '../../../static/leaflet/js/leaflet'

export default function leafLetMapInit(center, zoom) {
  let leaf_center = [];
  if (center){
    leaf_center = center
  }
  env.leaf_map = L.map('leaf-container', {
    editable: true,
    minZoom: 3,
    maxZoom: 18,
    doubleClickZoom: false,   //禁止双击改变zoom 并且禁止双击地图移动
    // preferCanvas: true,       //是否应在Canvas渲染器上渲染路径。 默认情况下，所有路径都在SVG渲染器中呈现。
    //todo 这里存在一个问题 当转换成canvas时无法选取道路
    zoomControl: false,
    //TODO 里有个问题 zoom级别没有被正确保存 误差为1
  }).setView(leaf_center, zoom+1);
  //高德
  // let gdmap = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
  //   subdomains: "1234",
  //   maxZoom: 18, //25
  //   minZoom: 1,
  //   tileSize: 256,  默认瓦片大小256*256
  // });

  // minemap  leaflet默认瓦片大小256*256 minemap默认大小512*512
  const gdmap = L.tileLayer('http://36.111.84.98:8087/minemap-data/view/{z}/{x}/{y}', {
  // const gdmap = L.tileLayer('http://172.20.80.197:8087/minemap-data/view/{z}/{x}/{y}', {
    subdomains: "1234",
    maxZoom: 18, //25
    minZoom: 3,
    tileSize: 512,
    zoomOffset: -1
  });
  const gdmap1 = L.tileLayer('http://36.111.84.98:8087/minemap-data/view/t/{z}/{x}/{y}', {
  // const gdmap1 = L.tileLayer('http://172.20.80.197:8087/minemap-data/view/t/{z}/{x}/{y}', {
    subdomains: "1234",
    maxZoom: 18, //25
    minZoom: 3,
    tileSize: 512,
    zoomOffset: -1
  });
  //莆田本地
  // const gdmap = L.tileLayer('http://172.20.80.197:8087/minemap-data/view/{z}/{x}/{y}', {
  //   subdomains: "1234",
  //   maxZoom: 18, //25
  //   minZoom: 3,
  //   tileSize: 512,
  //   zoomOffset: -1
  // });
  // const gdmap1 = L.tileLayer('http://172.20.80.197:8087/minemap-data/view/t/{z}/{x}/{y}', {
  //   subdomains: "1234",
  //   maxZoom: 18, //25
  //   minZoom: 3,
  //   tileSize: 512,
  //   zoomOffset: -1
  // });
  gdmap.addTo(env.leaf_map);
  gdmap1.addTo(env.leaf_map);
}
