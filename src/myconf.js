/**
 * Created by limei on 2018/7/17.
 * http://172.20.80.196/operate/view?solution=4637&accessToken=d4b0c0c8ad3f43abbf1b449e059deccc
 */
export default {
  map_service:'//minedata.cn/service/solu/',
  map: {
    domain: '//minedata.cn',
    dataDomainUrl: '//datahive.minedata.cn',
    solu: 8410,
    token: 'b141ca81b7f14b08ab59a4622bf2ec90',
    get style() {
      return `${this.domain}/service/solu/style/id/${this.solu}`;
    },
    center: [119.01230276903023,25.435871096608345],
    zoom: 12,
    topBgLayer:'f6c0ac44f6254636915439284c9788e6',   //最上层地图图层
    maskBgLayer:'0d68b6c5304f4f54b9ddbb564bcbde71',   //底图第二层-加蒙版
    traffic_layers:['7eff30294f6f48adbdc4fdbc70e633f6','999f1f2ba0914189b6da936f067186c0','f3eaa0f4c00743b78a760e822882018e'],
  },
  // 莆田本地
  // map_service:'//172.20.80.196/service/solu/',
  // map: {
  //   domain: '//172.20.80.196',
  //   spriteUrl: `//172.20.80.196/minemapapi/v2.0.0/sprite/sprite`,
  //   fontUrl: `//172.20.80.196/minemapapi/v2.0.0/fonts`,
  //   solu: 4637,
  //   token: 'd4b0c0c8ad3f43abbf1b449e059deccc',
  //   get style() {
  //     return `//172.20.80.196/service/solu/style/id/${this.solu}`;
  //   },
  //   center: [119.01230276903023,25.435871096608345],
  //   zoom: 12,
  //   topBgLayer:'dee470fde7774428b5511b1b917c2052',   //最上层地图图层
  //   maskBgLayer:'f9eeb0f9440b41a78f57aca46b56de44',   //底图第二层-加蒙版
  //   traffic_layers:['792de9e4354642fe916c730c941236c3','ebe6b3a097e2487680068287ab4c5f09','d133b05974de416087d8e8e69a46e371','52e98bc2d6a8499fa1753d94cd503a7c'],
  // },

  leaflet_map:{
    center: [25.435871096608345,119.01230276903023],
    zoom: 12,
  },

  service:{
    //莆田本地
    root:'//117.51.149.90:8002/putianService/',     //滴滴云
    get login() {
      return this.root + 'user/login'
    },
    get logout() {
      return this.root + 'user/logout'
    },
    get menuList() {
      return this.root + 'menuService/findSubMenu?menuid=root1&token='
    },
    get globalFollowed() {
      return this.root + 'userMenuSetting/findSetting/key?filter='
    },
    get baseRoad() {
      return this.root + 'baseService/linkview/{z}/{x}/{y}'
    },
    get fullFlow() {
      return this.root + 'carService/linknetvol/{z}/{x}/{y}'
    },
    get saveSettings() {
      return this.root + 'userMenuSetting/saveSettings'
    },
    get findSettings() {
      return this.root + 'userMenuSetting/findSettings?menuids='
    },
    //交评模块参数存取
    get saveStepSettings() {
      return this.root + 'trafficEvaluateService/saveTrafficEvaluateMenuSettings'
    },
    get findStepSettings() {
      return this.root + 'trafficEvaluateService/findTrafficEvaluateMenuSettings?menuids='
    },
    //道路流量道路定位接口
    get carLink() {
      return this.root + 'baseService/getLinkInfo?linkid='
    },
    //道路流量道路定位接口
    get villagePos() {
      return this.root + 'gridService/findGridtazByTazById?gridids='
    },
    //道路流量背景流量
    get getRoadBackgroundVol(){
      return this.root + 'carService/getRoadBackgroundVol/{z}/{x}/{y}'
    },
    //公交线路定位
    get busLine() {
      return this.root + 'busService/linkDataByTrackid'
    },
    //基础溯源-计算过程
    get preOrdinary() {
      return this.root + 'carService/trace/preOrdinary'
    },
    //高级溯源-计算过程
    get preAdvanced() {
      return this.root + 'carService/trace/preAdvanced'
    },
    //基础溯源
    get baseUpstream() {
      return this.root + 'carService/trace/buffer/{z}/{x}/{y}'
    },
    //高级溯源
    get advanceUpstream() {
      return this.root + 'carService/trace/buffer/{z}/{x}/{y}'
    },

    //小汽车OD OD
    get carOd() {
      return this.root + 'carService/carodqwx'
    },
    //小汽车OD 栅格热力
    get carGrid(){
      return this.root + 'carService/heatcarodmap/{z}/{x}/{y}'
    },

    //删获取交叉口
    get findRoadCorrosing(){
      return this.root + 'carService/findRoadCorrosing?'
    },
    //基础小区
    get baseVillage() {
      return this.root + 'cellod/gridtaz/{z}/{x}/{y}'
    },
    //全方式OD 热力/栅格
    get heatMapOd() {
      return this.root + 'cellod/heatmap/{z}/{x}/{y}'
    },

    //全方式OD OD
    get odMapOd() {
      return this.root + 'cellod/qwx'
    },

    //全局小区-建成区列表
    get areaList() {
      return this.root + 'tazService/getTazList'
    },
    //全局小区-建成区列表
    get busLineList() {
      return this.root + 'tazService/getBusList'
    },

    //全局时间-建成区列表
    get globalTime() {
      return this.root + 'commonService/findUserGlobal?type=gtime'
    },

    //全局小区-建成区列表
    get globalVil() {
      return this.root + 'commonService/findUserGlobal?type=ggridtaz'
    },

    //保存全局时间-建成区列表
    get saveTime() {
      return this.root + 'commonService/saveGlobal/time?'
    },

    //保存全局小区-建成区列表
    get saveVil() {
      return this.root + 'commonService/saveUserGlobal/gridtaz?'
    },

    get disabledGlobalUrl() {
      return this.root + 'userMenuSetting/modifySetting/key?'
    },

    //根据小区ID
    get getLinkByVil() {
      return this.root + 'baseService/getLinklist?gridtazIds='
    },

    //分时动态人口
    get dynMap() {
      return this.root + 'cellod/odpopheatmap/{z}/{x}/{y}';
    },

    //出行特征
    get travelMap() {
      return this.root + 'cellod/odtravelheatmap/{z}/{x}/{y}'
    },

    //职住平衡分析
    get zzpeaMap() {
      return this.root + 'cellod/hwheatmap/{z}/{x}/{y}';
    },

    //建成区栅格
    get buildOdMap() {
      return this.root + 'cellod/heattazmap/{z}/{x}/{y}'
    },

    //建成区期望线
    get buildExpMap(){
      return this.root + 'cellod/tazqwx'
    },

    //常发拥堵
    get alJam(){
      return this.root + 'alJampService/getalJam/{z}/{x}/{y}'
    },

    //历史路况分析
    get hisTraffic(){
      return this.root + 'trafficAnalysisService/hisTraffic/{z}/{x}/{y}'
    },
    //公交速度
    get busSpeed(){
      return this.root + 'busService/busspeedorflowheatmap/{z}/{x}/{y}?'
    },
    //公交流量
    get busFlow(){
      return this.root + 'busService/busspeedorflowheatmap/{z}/{x}/{y}?dateType=flow'
    },
    //公交线路列表查询
    get getBusLine(){
      return this.root + 'busService/trackidData'
    },

    //base64图片上传
    get baseImage() {
      return this.root + 'trafficEvaluateService/savePic'
    },


    //--------------------------------------分析面板

    // 数据概况-拥堵识别
    get carTraffic_2_base() {
      return this.root + 'alJampService/getalJamBasic';
    },
    // 数据详情table-拥堵识别
    get carTraffic_2_table() {
      return this.root + 'alJampService/getalJamRanking';
    },
    // 数据分析echart-拥堵识别
    get carTraffic_2_echart() {
      return this.root + 'alJampService/getalJamByKindList';
    },
    // 数据概况
    get carTraffic_3_base() {
      return this.root + 'carService/getAverageFlow';
    },
    // 数据详情
    get carTraffic_3_table() {
      return this.root + 'carService/getCarLinkdataDetails';
    },
    // 数据分析
    get carTraffic_3_echart() {
      return this.root + 'carService/getGraphNetFlow';
    },

    //溯源分析
    get carTraffic_4_base() {
      return this.root + 'carService/getCarTripRatio';
    },
    //溯源中间面板
    get carTraffic_4_echart(){
      return this.root + 'carService/getCarTripGraph';
    },
    //溯源右侧面板
    get carTraffic_4_table() {
      return this.root + 'carService/getCarTripDate';
    },

    //溯源分析-高级溯源
    get carTraffic_4_base_advanced() {
      return this.root + 'carService/getCarTripAdvancedRatio';
    },
    //溯源中间面板-高级溯源
    get carTraffic_4_echart_advanced(){
      return this.root + 'carService/getCarTripAdvancedGraph';
    },
    //溯源右侧面板-高级溯源
    get carTraffic_4_table_advanced() {
      return this.root + 'carService/getCarTripAdvancedDate';
    },

    //全方式OD
    get personTrip_1_base(){
      return this.root + 'cellod/getOdProfile';
    },
    get personTrip_1_echart(){
      return this.root + 'cellod/getOdGraph';
    },
    get personTrip_1_table(){
      return this.root + 'cellod/getOdData';
    },

    //分时动态
    get personTrip_2_base(){
      return this.root + 'cellod/getHourpopProfile';
    },
    get personTrip_2_echart(){
      return this.root + 'cellod/getHourpopGraph';
    },
    get personTrip_2_table(){
      return this.root + 'cellod/getHurpopData';
    },

    //出行特征
    get personTrip_3_base(){
      return this.root + 'cellod/getOdtazdisProfile';
    },
    get personTrip_3_echart(){
      return this.root + 'cellod/getOdtazdisGraph';
    },
    get personTrip_3_table(){
      return this.root + 'cellod/getOdtazdisData';
    },

    //职住分析
    get personTrip_4_base(){
      return this.root + 'cellod/getOdhwProfile';
    },
    get personTrip_4_echart(){
      return this.root + 'cellod/getOdhwGraph';
    },
    get personTrip_4_table(){
      return this.root + 'cellod/getOdhwData';
    },

    //建成区OD
    get personTrip_5_base(){
      return this.root + 'cellod/getOdTazProfile';
    },
    get personTrip_5_echart(){
      return this.root + 'cellod/getOdTazGraph';
    },
    get personTrip_5_table(){
      return this.root + 'cellod/getOdTazData';
    },
    //历史路况排名
    get carTraffic_1_table() {
      return this.root + 'trafficAnalysisService/linkIndexRanking';
    },
    //历史路况数据概况
    get carTraffic_1_base() {
      return this.root + 'trafficAnalysisService/basicTraffic';
    },

    //历史路况变化
    get carTraffic_1_echart() {
      return this.root + 'trafficAnalysisService/getTrafficList';
    },

    // 数据概况-公交速度
    get cmnTraffic_1_base() {
      return this.root + 'busService/busSpeedProfile';
    },
    // 数据详情table-公交速度
    get cmnTraffic_1_table() {
      return this.root + 'busService/busFlowAndSpeedData?';
    },
    // 数据分析echart-公交速度
    get cmnTraffic_1_echart() {
      return this.root + 'busService/busSpeedGraph';
    },
    // 数据概况-公交流量
    get cmnTraffic_3_base() {
      return this.root + 'busService/busFlowProfile';
    },
    // 数据详情table-公交流量
    get cmnTraffic_3_table() {
      return this.root + 'busService/busFlowAndSpeedData?dataType=flow';
    },
    // 数据分析echart-公交流量
    get cmnTraffic_3_echart() {
      return this.root + 'busService/busFlowGraph';
    },




    //------------------------交评
    //字典查询接口
    get findSubDict() {
      return this.root + 'commonService/findSubDictionary?'
    },
    //字典保存接口
    get saveSubDict(){
      return this.root + 'commonService/saveDictionary?'
    },
    //查询/修改交评项目
    get findProject() {
      return this.root + 'trafficEvaluateService/findProject?'
    },
    get saveProject() {
      return this.root + 'trafficEvaluateService/saveProject?'
    },

    //查询/修改预设系数
    get findPreSetting() {
      return this.root + 'trafficEvaluateService/findProjectPreSetting?'
    },
    get savePreSetting() {
      return this.root + 'trafficEvaluateService/saveProjectPreSetting?'
    },
    get saveLandInfo() {
      return this.root + 'trafficEvaluateService/saveProjectLandInfo?'
    },
    //step3中需要用到的接口

    //step3 查询道路信息
    get inquireRoadInfo(){
      return this.root + 'baseService/getLinkInfoBySelectedRoad'
    },
    //step4 查询地块信息
    get findLandInfo() {
      return this.root + 'trafficEvaluateService/findProjectLandInfo?'
    },
    get delLandInfo() {
      return this.root + 'trafficEvaluateService/deleteProjectLandInfo?'
    },
    get findLandList() {
      return this.root + 'trafficEvaluateService/findProjectLandList?'
    },
    get landODPredict() {
      // return this.root + 'trafficEvaluateService/landODTest?'
      return this.root + 'trafficEvaluateService/landODPredict?'
    },
    get findLandOD() {
      return this.root + 'trafficEvaluateService/findLandOD?'
    },
    get getPopulation() {
      return this.root + 'trafficEvaluateService/getPopulation?'
    },
    get addEntrance() {
      return this.root + 'tepwService/addList?'
    },
    //道路分布预测前删除记录
    get deleteRoadTrafficDis() {
      return this.root + 'trafficEvaluateService/cleanPsgRelate2Project?'
    },
    //step3 日/早/晚出行量
    get queryEffectRoadsPsgWhenGetInS3(){
      return this.root + 'trafficEvaluateService/queryEffectRoadsPsgWhenGetInS3'
    },
    //step3 分布预测流量
    get queryEffectRoadsPBFWhenGetInS3(){
      return this.root + 'trafficEvaluateService/queryEffectRoadsPBFWhenGetInS3/{z}/{x}/{y}'
    },

    //step6计算
    get redistributeTrafficVol() {
      return this.root + 'trafficEvaluateService/redistributeTrafficVol?'
    },

    //是否已分配的检查
    get checkTeProjectTestatus() {
      return this.root + 'trafficEvaluateService/checkTeProjectTestatus?'
    },

    //step6流量
    get teBuffer() {
      return this.root + 'trafficEvaluateService/teVolBuffer/{z}/{x}/{y}'
    },

    //step6速度/饱和度
    get teResultBuffer() {
      return this.root + 'trafficEvaluateService/teResultBuffer/{z}/{x}/{y}'
    },

    //基础路网矢量数据
    get baseRoadLine(){
      return this.root + 'baseService/getLinkInfoByView'
    },

    //新增线段
    get addCreateLink(){
      return this.root + 'baseService/createLink'
    },

    //切割线段
    get splitLink(){
      return this.root + 'baseService/splitLink'
    },

    //删除线段
    get deleteLink(){
      return this.root + 'baseService/deleteLink'
    },

    //平移线段
    get moveLink(){
      return this.root + 'baseService/moveLink'
    },

    //保存线的编辑操作
    get updateLink(){
      return this.root + 'baseService/updateLink'
    },

    //线的吸附
    get dragLink_c(){
      return this.root + 'baseService/dragLink_c'
    },

    get dragLink_s(){
      return this.root + 'baseService/dragLink_s'
    },

    //根据roadId删除道路
    get deleteRoadByRoadId(){
      return this.root + 'baseService/removeRoad'
    },

    //获取之前编辑线的记录
    get getEditedRoadInfo(){
      return this.root + 'baseService/getEditedRoadInfo'
    },

    //预测更新道路相关交通分布
    get getRoadTrafficDis() {
      return this.root + 'trafficEvaluateService/calculateEffectRoadsTrafficPsg?'
    },

    //道路交通分布预测溯源
    get setTrace() {
      return this.root + 'trafficEvaluateService/ordinaryTraceTransform2PBFAlter/{z}/{x}/{y}'
    },

    //背景流量溯源
    get backgroundTrace(){
      return this.root + 'trafficEvaluateService/backgroundLinkPsgTransform2PBF/{z}/{x}/{y}'
    },

    //保存step2操作
    get saveStepTwo() {
      return this.root + 'baseService/updateEditedRoadGeneralization?'
    },

    //查询所有地块出入口信息列表
    get findPWLandListByProject(){
      return this.root + 'tepwService/findPWLandListByProject?'
    },

    //按地块查询出入口信息
    get findPWListByLand(){
      return this.root + 'tepwService/findPWListByLand?'
    },

    //按地块查询出入口集合
    get findPWListByProject(){
      return this.root + 'tepwService/findPWListByProject?'
    },

    //按地块查询出入口信息
    get landBaseLink(){
      return this.root + 'teLinkService/linkEditedPDF/'
    },

    //按地块查询出入口信息
    get findPWStaticsByproject(){
      return this.root + 'tepwService/findPWStaticsByproject?'
    },

    //删除地块的出入口信息
    get deletePWByLand(){
      return this.root + 'tepwService/deletePWByLand?'
    },

    //查询所有道路是否被溯源
    get roadConfim(){
      return this.root + 'trafficEvaluateService/checkTEStatus?'
    },

    //线pbf
    get roadLinePbf(){
      return this.root + 'trafficEvaluateService/editedRoadTransform2PBF/{z}/{x}/{y}'
    },

    //step6交通影响预测图
    get trafficPredictionEcharts() {
      return this.root + 'trafficEvaluateService/getTeRanking?'
    },

    //step6交通影响预测表
    get trafficPredictionTable(){
      return ''
    },
    //step6 点击echarts跳转道路定位
    get newGetLinkInfo(){
      return this.root + 'teLinkService/getLinkInfo?'
    },

    //step2编辑面板道路长度
    get editLinePanelLength(){
      return this.root + 'baseService/calculateVirtualLineStringLength'
    },

    get copyProject(){
      return this.root + 'trafficEvaluateService/copyRProject?'
    },
    //判断是否已进行过交通分配
    get teReportCheck(){
      return this.root + 'TeReportService/teReportCheck?'
    },

    //现状流量/速度/饱和度/服务水平pbf
    get presentPBF(){
      return this.root + 'trafficEvaluateService/getActualMapTransform2PBF/{z}/{x}/{y}'
    },

    //年预测流量/速度/饱和度/服务水平pbf
    get predictedPBF(){
      return this.root + 'trafficEvaluateService/getInfluenceMapTransform2PBF/{z}/{x}/{y}'
    },

    //影响后流量/速度/饱和度/服务水平pbf
    get distributePBF(){
      return this.root + 'trafficEvaluateService/getAffectedMapTransform2PBF/{z}/{x}/{y}'
    },

    //测距功能-测面积
    get calcVirtualPolygonArea(){
      return this.root + 'baseService/calculateVirtualPolygonArea'
    },

    //------------------------交评比选

    // 交通影响比较
    get compareInfluence(){
      return this.root + 'trafficEvaluateService/getComparedDataSet'
    },

    //显示选项比较
    get compareTransformPBF(){
      return this.root + 'trafficEvaluateService/getComparedMapTransform2PBF/{z}/{x}/{y}'
    },

    //中间面板
    get getComparedDataHistograms(){
      return this.root + 'trafficEvaluateService/getComparedDataHistograms?'
    },

    //交通简报生成
    get getReport(){
      return this.root + 'TeReportService/exportReport?'
    },

    //用地性质
    get getLandUse(){
      return this.root + 'commonService/landtype/{z}/{x}/{y}'
    },

    //差值处理
    get getDiffMap(){
      return this.root + 'trafficEvaluateService/getDiffMapTransform2PBF/{z}/{x}/{y}'
    },
  },



  // 组件常量
  IS_PANEL_SHOW:true,      //右侧面板是否打开
  IS_DIAGRAM_SHOW:true,      //下方分析面板是否打开
  CUR_MENU:{
    id:"carTraffic-1",
    order:1,
    active:true,
    globalTime:true,
    name:"路况分析"
  },
  DATE_LIST:['工作日','非工作日'],   //1,0
  CROSS_LIST:['流量','比例'],
  // STRENGTH_LIST:['总量','仅出发','仅到达','隐藏'],
  STRENGTH_LIST:['总量','仅出发','仅到达'],
  EXPECTATION_LIST:['全部','出发','到达'],
  SHOW_LIST:['全部','仅期望线','仅小区'],
  DISPLAY_LIST: ['全部','上车','下车'],

  // ANALYSIS_LIST: ['平均出行距离','平均出行时间'],
  ADMIN_LIST:['建成区OD分析','区县OD分析'],
  //道路框选的最大长度
  MAX_LINK_LEN:300,

  TRAVEL_INTENSITY:[{
    label:'交通生成量',
    value:'交通生成量',
  },{
    label:'交通吸引量',
    value:'交通吸引量',
  },{
    label:'生成吸引总量',
    value:'生成吸引总量',
  // },{
  //   label:'生成吸引比',
  //   value:'生成吸引比'
  // },{
  //   label:'内部交通量',
  //   value:'内部交通量',
  }],

  //全方式OD出行强度显示内容
  TRAVEL_INTENSITY_OD:[{
    label:'交通生成量',
    value:'交通生成量',
  },{
    label:'交通吸引量',
    value:'交通吸引量',
  },{
    label:'生成吸引总量',
    value:'生成吸引总量',
  },{
    label:'生成吸引比',
    value:'生成吸引比'
  }],

  ANALYSIS_LIST:[{
    label:'平均出行距离',
    value:'平均出行距离',
  },{
    label:'平均出行时间',
    value:'平均出行时间',
  }],
  RESIDENCE_LIST:[{
    label:'职住比',
    value:'职住比',
  },{
    label:'居住人口',
    value:'居住人口',
  },{
    label:'就职人口',
    value:'就职人口',
  }],
  // VILLAGE_TYPE: ['使用预设交通小区','使用自定义交通小区'],
  VILLAGE_TYPE: [{
    label:'使用预设交通小区',
    value:0,
  },{
    label:'使用自定义交通小区',
    value:1,
  }],
  VILL_SELECT_METHOD: ['全局','自定义'],
  FLOW_LABEL_SHOW:true,
  SELECTED_ONLY:false,
  FLOW_RANGE_MAX:1000,   //流量显示上限
  FLOW_RANGE_MIN:0,    //流量显示下限-默认
  GRIDORHEATMAP:{      //出行强度显示模式： 栅格小区,热力图
    'carTraffic-6': '栅格小区',
    'personTrip-1': '栅格小区',
    'personTrip-2': '栅格小区',
    'personTrip-3': '栅格小区',
    'personTrip-4': '栅格小区',
  },
  HEATMAP_RADIUS:{
    'personTrip-1': 80,
    'personTrip-2': 80,
    'personTrip-3': 80,
    'personTrip-4': 80,
  },
  SMALL_SHOW_LIST: ['热力图','栅格小区'],
  BUFFER_COLOR:{
    'carTraffic-3':'#1c485b',
    'carTraffic-4':'#cb178a',
    'cmnTraffic-3':'#1c485b',
  },
  BUFFER_WIDTH:{
    'carTraffic-3':0,
    'carTraffic-4':0,
    'cmnTraffic-3':8,
    'common':0,
  },
  HEATMAP_WIDTH:{
    'personTrip-1':20,
    'personTrip-2':20,
    'personTrip-3':20,
    'personTrip-4':20,
  },
  COLOR_SELECT:['彩色','单色'],
  TARGET_YEAR:2020,
  YEAR_LIST:[
    {
      label: 2020,
      value: 2020
    },{
      label: 2019,
      value: 2019
    },
    {
      label: 2018,
      value: 2018
    },
    {
      label: 2017,
      value: 2017
    }
  ],
  GLOBAL_SEASON_LIST:[
    {
      label: '第一季度',
      value: '第一季度',
      index: 1
    },
    {
      label: '第二季度',
      value: '第二季度',
      index: 2
    },
    {
      label: '第三季度',
      value: '第三季度',
      index: 3
    },
    {
      label: '第四季度',
      value: '第四季度',
      index: 4
    }
  ],
  SEASON_LIST: [
    /*{
      label: '全年',
      value: '全年',
      index: 0
    },*/
    {
      label: '第一季度',
      value: '第一季度',
      index: 1
    },
    {
      label: '第二季度',
      value: '第二季度',
      index: 2
    },
    {
      label: '第三季度',
      value: '第三季度',
      index: 3
    },
    {
      label: '第四季度',
      value: '第四季度',
      index: 4
    }
  ],

  AREA_LIST:[
    {
      label: '荔城城厢主城',
      value: 1
    },{
      label: '涵江主城',
      value: 2
    },{
      label: '仙游主城',
      value: 3
    }
  ],
  BUS_LINE_LIST:[
    {
      label: '10路',
      value: 10
    },{
      label: '211路',
      value: 211
    },{
      label: '985路',
      value: 985
    }
  ],

  ROAD_LIST:[],

  PRE_VILLAGE_LIST: [],


  COLOR_PICKER: ['#e63d35', '#da215b', '#8d2ca6', '#5d3bad', '#3d4dab', '#3b90ee', '#38a3f0', '#3bb5ce', '#2c8c7f', '#52a54c', '#87ba49', '#c7d540', '#fbe644', '#f8b827', '#f58d20', '#f34e29', '#6c4d42', '#959595', '#5b7481','#cb178a','#1c485b','#ffffff'],

  MENU_LIST:[],

  BUILTAREA:[{
      label:'全部小区',
      value:'全部小区',
    },{
      label: '荔城城厢主城',
      value: '荔城城厢主城',
    },{
      label: '西天尾主城区',
      value: '西天尾主城区',
    },{
      label: '华林主城',
      value: '华林主城',
    },{
      label: '黄石主城',
      value: '黄石主城',
    },{
      label: '仙游主城',
      value: '仙游主城',
    },{
      label: '湄洲岛',
      value: '湄洲岛',
    },{
      label: '涵江主城',
      value: '涵江主城',
    },{
      label: '芴石主城',
      value: '芴石主城',
    }
  ],

  ADMINAREA:[
    {
      label: '全部小区',
      value: '全部小区'
    },
    {
      label: '荔城',
      value: '荔城'
    },{
      label: '涵江',
      value: '涵江'
    },{
      label: '秀屿',
      value: '秀屿'
    },{
      label: '城厢',
      value: '城厢'
    },{
      label: '仙游',
      value: '仙游'
    },
  ],


  GLOBAL_TIME:{
    year:2018,
    season:2,
    hour:31,
    datetag:1,
  },
  GLOBAL_VILLAGE:[],

  SOURCE_TYPE:{

  },

  MAP_VIEW_DEFAULT:[
    {
      center:[119.01230276903023,25.435871096608345],
      zoom:12,
      imgUrl:'./static/images/tab/img-1.png'
    },{
      center:[119.11076949651624,25.454356990145627],
      zoom:13,
      imgUrl:'./static/images/tab/img-2.png'
    },{
      center:[118.69936686262326,25.362294240938354],
      zoom:12,
      imgUrl:'./static/images/tab/img-3.png'
    },{
      center:[119.08890799909682,25.44086537258876],
      zoom:11.5,
      imgUrl:'./static/images/tab/img-4.png'
    }
  ],

  LINK_COLUMNS:[
    {
      title: '编号',
      key: 'num',
      width:40
    },
    {
      title: '道路Id',
      key: 'linkId',
    },
    {
      title: '路名',
      key: 'roadName',
    },
    {
      title: '路长',
      key: 'len',
    },
    {
      title: '流量',
      key: 'avgFlow',
    },
    {
      title: '定位',
      key: 'locate',
      render: (h, params) => {
        const row = params.row;
        return h('IconComp',{
          props: {
            type: 'android-locate',
            size: "20",
            color: "#4A4A4A",
          },
          style: {
            cursor:'pointer'
          },
          on: {
            click: () => {
            }
          }
        })
      }
     },

  ],

  SOURCE_COLUMNS:[],


  //右侧面板默认参数
  CAR_TRAFFIC_2:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    linktype:"link",
    links:"",
  },
  //右侧面板默认参数
  CAR_TRAFFIC_3:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    flowmax: 1000,
    flowmin: 0,
    linktype:"link",
    links:"",
  },
  CAR_TRAFFIC_5:{
    year:2017,
    season:2,
    hour:31,
    crossIcon:1,
  },
  CAR_TRAFFIC_4_BASE:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    flowmax: 1000,
    flowmin: 0,
    linktype:"link",
    links:"",
    sourcetype:"0"
  },
  CAR_TRAFFIC_6:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    rangeMin: 500,
    rangeMax: 1000,
    carOd_curShow:'全部',
    carOd_curExpectation:'全部',
    carOdColor:'彩色',
    carOd_curDisplay:'总量',
    villageType:"link",
    villages:'',
    grid_heatmap:"栅格小区",
  },

  PERSON_TRIP_1:[
    {
      title: '排名',
      key: 'rank',
      width:40
    },
    {
      title: '编号',
      key: 'num'
    },
    {
      title: '所在街道',
      key: 'tazid'
    },
    {
      title: '生成量',
      key: 'o_sum'
    },
    {
      title: '吸引量',
      key: 'd_sum'
    },
    {
      title: '定位',
      key: 'locate',
      render: (h, params) => {
        const row = params.row;
        return h('IconComp',{
          props: {
            type: 'android-locate',
            size: "20",
            color: "#4A4A4A",
          },
          style: {
            cursor:'pointer'
          },
          on: {
            click: () => {
            }
          }
        })
      }
    },
  ],

  PERSON_TRIP_2:[
    {
      title: '排名',
      key: 'rank',
      width:40
    },
    {
      title: '编号',
      key: 'num'
    },
    {
      title: '所在街道',
      key: 'tazid'
    },
    {
      title: '动态人口',
      key: 'popup'
    },
    {
      title: '定位',
      key: 'locate',
      render: (h, params) => {
        const row = params.row;
        return h('IconComp',{
          props: {
            type: 'android-locate',
            size: "20",
            color: "#4A4A4A",
          },
          style: {
            cursor:'pointer'
          },
          on: {
            click: () => {
            }
          }
        })
      }
    },
  ],

  PERSON_TRIP_3:[
    {
      title: '排名',
      key: 'rank',
      width:40
    },
    {
      title: '编号',
      key: 'num'
    },
    {
      title: '路名',
      key: 'road'
    },
    {
      title: '路长',
      key: 'length'
    },
    {
      title: '指数',
      key: 'index'
    },
    {
      title: '速度',
      key: 'speed'
    },
    {
      title: '定位',
      key: 'locate',
      render: (h, params) => {
        const row = params.row;
        return h('IconComp',{
          props: {
            type: 'android-locate',
            size: "20",
            color: "#4A4A4A",
          },
          style: {
            cursor:'pointer'
          },
          on: {
            click: () => {
            }
          }
        })
      }
    },
  ],

  PERSON_TRIP_4:[
    {
      title: '排名',
      key: 'rank',
      width:40
    },
    {
      title: '编号',
      key: 'num'
    },
    {
      title: '所在社区',
      key: 'tazid'
    },
    {
      title: '居住人口',
      key: 'live'
    },
    {
      title: '就职人口',
      key: 'occup'
    },
    {
      title: '职住比',
      key: 'employment'
    },
    {
      title: '定位',
      key: 'locate',
      render: (h, params) => {
        const row = params.row;
        return h('IconComp',{
          props: {
            type: 'android-locate',
            size: "20",
            color: "#4A4A4A",
          },
          style: {
            cursor:'pointer'
          },
          on: {
            click: () => {
            }
          }
        })
      }
    },
  ],

  PERSON_TRIP_5:[
    {
      title: '排名',
      key: 'rank',
      width:40
    },
    {
      title: '编号',
      key: 'num'
    },
    {
      title: '小区名',
      key: 'tazid'
    },
    {
      title: '生成量',
      key: 'o_sum'
    },
    {
      title: '吸引量',
      key: 'd_sum'
    },
    {
      title: '总量',
      key: 'sum'
    },
    {
      title: '定位',
      key: 'locate',
      render: (h, params) => {
        const row = params.row;
        return h('IconComp',{
          props: {
            type: 'android-locate',
            size: "20",
            color: "#4A4A4A",
          },
          style: {
            cursor:'pointer'
          },
          on: {
            click: () => {
            }
          }
        })
      }
    },
  ],


  // CAR_TRAFFIC_3:{
  //   year:2018,
  //   season:2,
  //   hour:8,
  //   datetag:1,
  //   flowmax: 1000,
  //   flowmin: 0,
  //   linktype:"link",
  //   links:"",
  // },
  PERSONTRIP_1:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    villageType: 'link',
    villages: '',
    grid_heatmap:"栅格小区",
    expMin: 0,
    expMax: 300,
    display_mode: '全部',
    travel_sel: '交通生成量',
    colorSel: '彩色',
    distance_type: 'a',
  },
  PERSONTRIP_2:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    villageType: 'link',
    villages: '',
    grid_heatmap:"栅格小区",
  },
  PERSONTRIP_3:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    traver_analy: 0,
    villageType: 'link',
    villages: '',
    grid_heatmap:"栅格小区",
  },
  PERSONTRIP_4:{
    year:2018,
    season:2,
    datetag:1,
    residence_list: 1,
    villageType: 'link',
    villages: '',
    grid_heatmap:"栅格小区",
  },
  PERSONTRIP_5:{
    year:2018,
    season:2,
    hour:8,
    datetag:1,
    adminOption: '建成区OD分析',
    display_mode_build: '全部',
    colorSel: '彩色',
    travel_sel:"交通生成量",
    distance_type:"a",
    ids:"全部小区",
  },
  //速度图例
  SPEED_RANGE:[
    [0, '#8d211a'],
    [10, '#e80e0e'],
    [20, '#fbe019'],
    [35, '#2c8c7f'],
  ],
  //速度影响(step3)
  SPEED_AFFECTED_OTHER:[
    [-50, '#e80e0e'],
    [-3, '#fbe019'],
    [-1, 'rgba(255,255,255,0)'],
    [1, '#2c8c7f'],
    [3, '#3b90ee'],
  ],
  //速度影响(交评比选)
  SPEED_AFFECTED_COMPARE:[
    [-50, '#e80e0e'],
    [-2, '#fbe019'],
    [-0.5, 'rgba(255,255,255,0)'],
    [0.5, '#2c8c7f'],
    [2, '#3b90ee'],
  ],
  //饱和度临时
  SATURATION_TEMP:[
    [-1000, '#2c8c7f'],
    [0.6, '#fbe019'],
    [0.8, '#e80e0e'],
    [1, '#8d211a']
  ],
  //影响后饱和度临时
  SATURATION_AFFECTED_TEMP:[
    [-1000, '#3b90ee'],
    [-0.10, '#2c8c7f'],
    [-0.03, 'rgba(255,255,255,0)'],
    [0.03, '#fbe019'],
    [0.10, '#e80e0e']
  ],
  //服务水平
  SERVICE_RANGE:[
    [1, '#2c8c7f'],
    [2, '#2c8c7f'],
    [3, '#fbe019'],
    [4, '#fbe019'],
    [5, '#e80e0e'],
    [6, '#e80e0e'],
  ],
  //服务水平影响量
  SERVICE_AFFECTED:[
    [-2, '#8d211a'],
    [-1, '#e80e0e'],
    [0, 'rgba(255,255,255,0)'],
    [1, '#87BA49'],
    [2, '#2C8C7F'],
  ],
  ALL_METHOD_RANGE:[
    [0, '#FFFFFF'],
    [31, '#2B83BA'],
    [93, '#80BFAC'],
    [165, '#C7E9AD'],
    [250, '#FFFFBF'],
    [376, '#FEC980'],
    [563, '#F17C4A'],
    [40000, '#cc0000']
  ],
  AFFECTED_DIFF:[
    [-1000, 0.9],
    [0, 0],
    [1000, 0.9],
  ],
  YEAR_SUM_ARR:[
    {
      name:'道路运行数据资源',
      data:[{
        name:'互联网路况数据',
        value:2281708,
        season: '100%',
        year:'100%'
      },{
        name:'拥堵统计数据',
        value:416129,
        season: '100%',
        year:'100%'
      },{
        name:'互联网流量数据',
        value:3503273,
        season: '100%',
        year:'100%'
      },{
        name:'溯源轨迹数据',
        value:995898,
        season: '100%',
        year:'100%'
      }]
    },{
      name:'公共交通数据资源',
      data:[{
        name:'公交IC卡数据',
        value:0,
        season: '0',
        year:'0'
      },{
        name:'公交GPS数据',
        value:0,
        season: '0',
        year:'0'
      }]
    },{
      name:'个体出行数据资源',
      data:[{
        name:'信令基础数据',
        value:0,
        season: '0',
        year:'0'
      },{
        name:'栅格OD数据',
        value:2254696,
        season: '25%',
        year:'25%'
      },{
        name:'职住平衡数据',
        value:2872,
        season: '25%',
        year:'25%'
      },{
        name:'出行特征数据',
        value:10470,
        season: '25%',
        year:'25%'
      },{
        name:'行政区OD数据',
        value:135,
        season: '25%',
        year:'25%'
      }]
    },{
      name:'基础数据资源',
      data:[{
        name:'互联网路网数据',
        value:995898,
        season: '25%',
        year:'25%'
      },{
        name:'可编辑路网数据',
        value:88602,
        season: '25%',
        year:'25%'
      }]
    }
  ],
  YEAR_DATA_ARR:[
    {
      name:'第一季度',
      value:'第一季度',
      data:[
        {
          name:'道路运行数据资源',
          value:'道路运行数据资源',
          data:[
            {
              name: '互联网路况数据',
              value: '互联网路况数据',
              total: 501138,
              data:[
                {
                  name: '1月',
                  value: 1,
                },{
                  name: '2月',
                  value: 1,
                },{
                  name: '3月',
                  value: 1,
                }
              ]
            },
            {
              name: '拥堵统计数据',
              value: '拥堵统计数据',
              total: 98687,
              data:[
                {
                  name: '1月',
                  value: 1,
                },{
                  name: '2月',
                  value: 1,
                },{
                  name: '3月',
                  value: 1,
                }
              ]
            },
            {
              name: '互联网流量数据',
              value: '互联网流量数据',
              total: 1248833,
              data:[
                {
                  name: '1月',
                  value: 1,
                },{
                  name: '2月',
                  value: 1,
                },{
                  name: '3月',
                  value: 1,
                }
              ]
            },
            {
              name: '溯源轨迹数据',
              value: '溯源轨迹数据',
              total: 251065,
              data:[
                {
                  name: '1月',
                  value: 1,
                },{
                  name: '2月',
                  value: 1,
                },{
                  name: '3月',
                  value: 1,
                }
              ]
            }
          ]
        },{
          name:'公共交通数据资源',
          value:'公共交通数据资源',
          data:[
            {
              name: '公交IC卡数据',
              value: '公交IC卡数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            },
            {
              name: '公交GPS数据',
              value: '公交GPS数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            }
          ]
        },{
          name:'个体出行数据资源',
          value:'个体出行数据资源',
          data:[
            {
              name: '信令基础数据',
              value: '信令基础数据',
              total: '---',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 9999,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            },
            {
              name: '栅格OD数据',
              value: '栅格OD数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            },
            {
              name: '职住平衡数据',
              value: '职住平衡数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            },
            {
              name: '出行特征数据',
              value: '出行特征数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            },{
              name: '行政区OD数据',
              value: '行政区OD数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            }
          ]
        },{
          name:'基础数据资源',
          value:'基础数据资源',
          data:[
            {
              name: '互联网路网数据',
              value: '互联网路网数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            },
            {
              name: '可编辑路网数据',
              value: '可编辑路网数据',
              total: '',
              data:[
                {
                  name: '1月',
                  value: 0,
                },{
                  name: '2月',
                  value: 0,
                },{
                  name: '3月',
                  value: 0,
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name:'第二季度',
      value:'第二季度',
      data:[
        {
          name:'道路运行数据资源',
          value:'道路运行数据资源',
          data:[
            {
              name: '互联网路况数据',
              value: '互联网路况数据',
              total: 517473,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            },
            {
              name: '拥堵统计数据',
              value: '拥堵统计数据',
              total: 99804,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            },
            {
              name: '互联网流量数据',
              value: '互联网流量数据',
              total: 1115563,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            },
            {
              name: '溯源轨迹数据',
              value: '溯源轨迹数据',
              total: 279263,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            }
          ]
        },{
          name:'公共交通数据资源',
          value:'公共交通数据资源',
          data:[
            {
              name: '公交IC卡数据',
              value: '公交IC卡数据',
              total: '',
              data:[
                {
                  name: '4月',
                  value: 0,
                },{
                  name: '5月',
                  value: 0,
                },{
                  name: '6月',
                  value: 0,
                }
              ]
            },
            {
              name: '公交GPS数据',
              value: '公交GPS数据',
              total: '',
              data:[
                {
                  name: '4月',
                  value: 0,
                },{
                  name: '5月',
                  value: 0,
                },{
                  name: '6月',
                  value: 0,
                }
              ]
            }
          ]
        },{
          name:'个体出行数据资源',
          value:'个体出行数据资源',
          data:[
            {
              name: '信令基础数据',
              value: '信令基础数据',
              total: '---',
              data:[
                {
                  name: '4月',
                  value: 0,
                },{
                  name: '5月',
                  value: 9999,
                },{
                  name: '6月',
                  value: 0,
                }
              ]
            },
            {
              name: '栅格OD数据',
              value: '栅格OD数据',
              total: 2254696,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            },
            {
              name: '职住平衡数据',
              value: '职住平衡数据',
              total: 2872,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            },
            {
              name: '出行特征数据',
              value: '出行特征数据',
              total: 10470,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            },{
              name: '行政区OD数据',
              value: '行政区OD数据',
              total: 135,
              data:[
                {
                  name: '4月',
                  value: 1,
                },{
                  name: '5月',
                  value: 1,
                },{
                  name: '6月',
                  value: 1,
                }
              ]
            }
          ]
        },{
          name:'基础数据资源',
          value:'基础数据资源',
          data:[
            {
              name: '互联网路网数据',
              value: '互联网路网数据',
              total: '',
              data:[
                {
                  name: '4月',
                  value: 0,
                },{
                  name: '5月',
                  value: 0,
                },{
                  name: '6月',
                  value: 0,
                }
              ]
            },
            {
              name: '可编辑路网数据',
              value: '可编辑路网数据',
              total: '',
              data:[
                {
                  name: '4月',
                  value: 0,
                },{
                  name: '5月',
                  value: 0,
                },{
                  name: '6月',
                  value: 0,
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name:'第三季度',
      value:'第三季度',
      data:[
        {
          name:'道路运行数据资源',
          value:'道路运行数据资源',
          data:[
            {
              name: '互联网路况数据',
              value: '互联网路况数据',
              total: 636686,
              data:[
                {
                  name: '7月',
                  value: 1,
                },{
                  name: '8月',
                  value: 1,
                },{
                  name: '9月',
                  value: 1,
                }
              ]
            },
            {
              name: '拥堵统计数据',
              value: '拥堵统计数据',
              total: 114500,
              data:[
                {
                  name: '7月',
                  value: 1,
                },{
                  name: '8月',
                  value: 1,
                },{
                  name: '9月',
                  value: 1,
                }
              ]
            },
            {
              name: '互联网流量数据',
              value: '互联网流量数据',
              total: 1017304,
              data:[
                {
                  name: '7月',
                  value: 1,
                },{
                  name: '8月',
                  value: 1,
                },{
                  name: '9月',
                  value: 1,
                }
              ]
            },
            {
              name: '溯源轨迹数据',
              value: '溯源轨迹数据',
              total: 229039,
              data:[
                {
                  name: '7月',
                  value: 1,
                },{
                  name: '8月',
                  value: 1,
                },{
                  name: '9月',
                  value: 1,
                }
              ]
            }
          ]
        },{
          name:'公共交通数据资源',
          value:'公共交通数据资源',
          data:[
            {
              name: '公交IC卡数据',
              value: '公交IC卡数据',
              total: '',
              data:[
                {
                  name: '7月',
                  value: 0,
                },{
                  name: '8月',
                  value: 0,
                },{
                  name: '9月',
                  value: 0,
                }
              ]
            },
            {
              name: '公交GPS数据',
              value: '公交GPS数据',
              total: '',
              data:[
                {
                  name: '7月',
                  value: 0,
                },{
                  name: '8月',
                  value: 0,
                },{
                  name: '9月',
                  value: 0,
                }
              ]
            }
          ]
        },{
          name:'个体出行数据资源',
          value:'个体出行数据资源',
          data:[
            {
              name: '信令基础数据',
              value: '信令基础数据',
              total: '---',
              data:[
                {
                  name: '7月',
                  value: 0,
                },{
                  name: '8月',
                  value: 9999,
                },{
                  name: '9月',
                  value: 0,
                }
              ]
            },
            {
              name: '栅格OD数据',
              value: '栅格OD数据',
              total: '',
              data:[
                {
                  name: '7月',
                  value: 0,
                },{
                  name: '8月',
                  value: 0,
                },{
                  name: '9月',
                  value: 0,
                }
              ]
            },
            {
              name: '职住平衡数据',
              value: '职住平衡数据',
              total: '',
              data:[
                {
                  name: '7月',
                  value: 0,
                },{
                  name: '8月',
                  value: 0,
                },{
                  name: '9月',
                  value: 0,
                }
              ]
            },
            {
              name: '出行特征数据',
              value: '出行特征数据',
              total: '',
              data:[
                {
                  name: '7月',
                  value: 0,
                },{
                  name: '8月',
                  value: 0,
                },{
                  name: '9月',
                  value: 0,
                }
              ]
            },{
              name: '行政区OD数据',
              value: '行政区OD数据',
              total: '',
              data:[
                {
                  name: '7月',
                  value: 0,
                },{
                  name: '8月',
                  value: 0,
                },{
                  name: '9月',
                  value: 0,
                }
              ]
            }
          ]
        },{
          name:'基础数据资源',
          value:'基础数据资源',
          data:[
            {
              name: '互联网路网数据',
              value: '互联网路网数据',
              total: 88602,
              data:[
                {
                  name: '7月',
                  value: 1,
                },{
                  name: '8月',
                  value: 1,
                },{
                  name: '9月',
                  value: 1,
                }
              ]
            },
            {
              name: '可编辑路网数据',
              value: '可编辑路网数据',
              total: 64304,
              data:[
                {
                  name: '7月',
                  value: 1,
                },{
                  name: '8月',
                  value: 1,
                },{
                  name: '9月',
                  value: 1,
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name:'第四季度',
      value:'第四季度',
      data:[
        {
          name:'道路运行数据资源',
          value:'道路运行数据资源',
          data:[
            {
              name: '互联网路况数据',
              value: '互联网路况数据',
              total: 626411,
              data:[
                {
                  name: '10月',
                  value: 1,
                },{
                  name: '11月',
                  value: 1,
                },{
                  name: '12月',
                  value: 1,
                }
              ]
            },
            {
              name: '拥堵统计数据',
              value: '拥堵统计数据',
              total: 103138,
              data:[
                {
                  name: '10月',
                  value: 1,
                },{
                  name: '11月',
                  value: 1,
                },{
                  name: '12月',
                  value: 1,
                }
              ]
            },
            {
              name: '互联网流量数据',
              value: '互联网流量数据',
              total: 121573,
              data:[
                {
                  name: '10月',
                  value: 1,
                },{
                  name: '11月',
                  value: 1,
                },{
                  name: '12月',
                  value: 1,
                }
              ]
            },
            {
              name: '溯源轨迹数据',
              value: '溯源轨迹数据',
              total: 236531,
              data:[
                {
                  name: '10月',
                  value: 1,
                },{
                  name: '11月',
                  value: 1,
                },{
                  name: '12月',
                  value: 1,
                }
              ]
            }
          ]
        },{
          name:'公共交通数据资源',
          value:'公共交通数据资源',
          data:[
            {
              name: '公交IC卡数据',
              value: '公交IC卡数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            },
            {
              name: '公交GPS数据',
              value: '公交GPS数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            }
          ]
        },{
          name:'个体出行数据资源',
          value:'个体出行数据资源',
          data:[
            {
              name: '信令基础数据',
              value: '信令基础数据',
              total: '---',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 9999,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            },
            {
              name: '栅格OD数据',
              value: '栅格OD数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            },
            {
              name: '职住平衡数据',
              value: '职住平衡数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            },
            {
              name: '出行特征数据',
              value: '出行特征数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            },{
              name: '行政区OD数据',
              value: '行政区OD数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            }
          ]
        },{
          name:'基础数据资源',
          value:'基础数据资源',
          data:[
            {
              name: '互联网路网数据',
              value: '互联网路网数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            },
            {
              name: '可编辑路网数据',
              value: '可编辑路网数据',
              total: '',
              data:[
                {
                  name: '10月',
                  value: 0,
                },{
                  name: '11月',
                  value: 0,
                },{
                  name: '12月',
                  value: 0,
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  DATA_SUM:[
    {
      name: '数据总量',
      value: '数据总量',
  },{
    name: '季度覆盖率',
    value: '季度覆盖率',
  },{
    name: '年度覆盖率',
    value: '年度覆盖率',
  }],
  LAND_TYPE_MAP:[
    [1,'#8ef0b1'],
    [2,'#fb9a99'],
    [3,'#fb9a99'],
    [4,'#fb9a99'],
    [5,'#fb9a99'],
    [6,'#fb9a99'],
    [7,'#fb9a99'],
    [8,'#fb9a99'],
    [9,'#ff1201'],
    [10,'#dddddd'],
    [11,'#80e96f'],
    [12,'#abdda4'],
    [13,'#d8f0d4'],
    [14,'#a6cee3'],
    [15,'#d6e9f2'],
    [16,'#96c7ea'],
    [17,'#ec9600'],
    [18,'#b87400'],
    [19,'#865500'],
    [20,'#ffffbf'],
    [21,'#ffea01'],
    [22,'#ffd901'],
    [23,'#8c59dd'],
    [24,'#b89ce3'],
    [25,'#c3c3c3']
  ]
}
