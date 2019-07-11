/**
 * Created by limei on 2018/7/17.
 */
export default {
  service: {
    // root:'//36.111.84.127:8001/putianService/',
    root: '//172.21.5.10:8001/putianService/',


  },
  ADD_WIDTH:4,
  BASE_WIDTH:0,
  FACTOR_WIDTH:10,
  FACTOR_WIDTH_MIN:0,

  BUFFER_COMMON:0,

  TRAVEL_VOLUME:{   //出行量预设系数
    daily:{
      generate:1.0,
      attract:1.0,
      related:false
    },
    earlyPeak:{
      generate:1.0,
      attract:1.0,
      related:false
    },
    latePeak:{
      generate:1.0,
      attract:1.0,
      related:false
    }
  },
  TRAFFIC_VOLUME:{   //交通量预设系数
    daily:1.0,
    earlyPeak:1.0,
    latePeak:1.0,
  },
  ROADRADIUS: 0.5,
  TRAFFICYELLOW:{
    daily: 0,
    earlyPeak: 0,
    latePeak: 0
  },
  LANDUSE_COUNT:{
    land:{
      count:5,
      area:5.6
    },
    daily:{
      generate:11250,
      attract:1435,
      count:132555
    },
    earlyPeak:{
      generate:11250,
      attract:1435,
      count:132555
    },
    latePeak:{
      generate:11250,
      attract:1435,
      count:132555
    }
  },
  ROAD_COUNT:{
    count:0,
    length:0
  },
  AREA_SHOW_TYPE: [
    {
      label: '地块名称',
      value: '地块名称',
      index: 0
    },
    {
      label: '地块位置',
      value: '地块位置',
      index: 1
    },
    {
      label: '地块面积',
      value: '地块面积',
      index: 2
    }
  ],
  ROAD_SHOW_TYPE: [
    {
      label: '道路名称',
      value: '道路名称',
      index: 0
    },
    {
      label: '道路长度',
      value: '道路长度',
      index: 1
    }
  ],
  SHOW_CONTENT:['双向','仅出发','仅到达'],
  DEFAULT_EXP_MIN:1,
  DEFAULT_EXP_MAX:1000,
  DEFAULT_EXP_WIDTH:5,
  EASY_SCROLL_BAR:{
    barColor: "#344757",   //滚动条颜色
    barWidth: 2,           //滚动条宽度
    railColor: "#405569",     //导轨颜色
    barMarginRight: 0,     //垂直滚动条距离整个容器右侧距离单位（px）
    barMaginBottom: 0,     //水平滚动条距离底部距离单位（px)
    barOpacityMin: 0.2,      //滚动条非激活状态下的透明度
    zIndex: "auto",        //滚动条z-Index
    autohidemode: true,     //自动隐藏模式
    horizrailenabled: false,//是否显示水平滚动条
  },
  AREA_ATTRIBUTE:{
    name:'未命名',
    baseArea:0,
    volume:3.5,
    buildArea:'-',
    typeList:['住宅用地','未设定','未设定'],
    ratioList:[100,0,0],
    population:1,
  },
  ENTRANCE_ATTRIBUTE:{
    name:'未命名',
    baseArea:0,
    count:0,
  },
  LINK_ATTRIBUTE:{
    name:'未命名',
    linkId:'12345',
    linkType:'新建道路',
    lineId:'22345',
    linkLevel:'城市主干路',
    linkLen: 0,
  },
  AREA_TYPE_LIST:[{
    label: '住宅用地',
    value: '住宅用地',
    index: 0
  },{
    label: '商业用地',
    value: '商业用地',
    index:1
  },{
    label: '行政办公',
    value: '行政办公',
    index: 2
  },{
    label: '文化设施',
    value: '文化设施',
    index: 3
  },{
    label: '教育科研',
    value: '教育科研',
    index: 4
  },{
    label: '中小学',
    value: '中小学',
    index: 5
  },{
    label: '医疗卫生',
    value: '医疗卫生',
    index: 6
  },{
    label: '公园绿地',
    value: '公园绿地',
    index: 7
  },{
    label: '工业',
    value: '工业',
    index: 8
  },{
    label: '交通枢纽',
    value: '交通枢纽',
    index: 9
  },{
    label: '未设定',
    value: '未设定',
    index: 10
  }],
  AREA_LEVEL_LIST:[{
    label: '高速公路',
    value: '高速公路',
    index: 0
  },{
    label: '国省道',
    value: '国省道',
    index:1
  },{
    label: '城市主干路',
    value: '城市主干路',
    index: 2
  },{
    label: '城市次干路',
    value: '城市次干路',
    index: 3
  },{
    label: '城市支路和县乡道',
    value: '城市支路和县乡道',
    index: 4
  }],
  LINK_TYPE_LIST:[{
    label: '新建道路',
    value: '新建道路',
    index: 0
  },{
    label: '改建道路',
    value: '改建道路',
    index: 1
  },{
    label: '原有道路',
    value: '原有道路',
    index: 3
  }],
  TRAFFIC_INFO:{
    daily:{
      generate:0,
      attract:0,
      count:0
    },
    earlyPeak:{
      generate:0,
      attract:0,
      count:0
    },
    latePeak:{
      generate:0,
      attract:0,
      count:0
    }
  },
  CAR_TRAVEL_VOLUME:{   //地块机动车出行量预设系数
    daily:{
      generate:1,
      attract:1,
    },
    earlyPeak:{
      generate:1,
      attract:1,
    },
    latePeak:{
      generate:1,
      attract:1,
    }
  },
  LINK_TRAFFIC_INFO:{
    traffic:{   //通行能力
      upper:1100,
      lower:1100,
    },
    speed:{     //限速
      upper:30,
      lower:30,
    },
    roadWay:{   //车道
      upper:1,
      lower:1,
    },
  },

  TRAFFIC_DISTRIBUTION_MODEL: [{
    label: '一次分配',
    value: '一次分配',
    index: 0
  },{
    label: '增量分配',
    value: '增量分配',
    index: 1
  }],
  ITERATION_NUM:[{
    label: '1',
    value: '1',
    index: 1
  },{
    label: '2',
    value: '2',
    index: 2
  },{
    label: '3',
    value: '3',
    index: 3
  },{
    label: '4',
    value: '4',
    index: 4
  },{
    label: '5',
    value: '5',
    index: 5
  }],
  PATH_FUNCTION:[{
    label: '莆田2018',
    value: '莆田2018',
    index: 0
  },{
    label: 'xxxxxx',
    value: 'xxxxxx',
    index: 1
  }],

  LANDODRANGE:[10,50,120,200],  //用地规划OD彩色图例区间
  LANDODCOLORS:[
    '#2B83BA',
    '#80BFAC',
    '#FFFFBF',
    '#FEC980',
    '#D7191C'
  ],  //用地规划OD彩色图例区间

  FACTOR_MODEL:[
    {
      label: '背景速度',
      value: '背景速度',
      index: 0
    },{
      label: '影响后速度',
      value: '影响后速度',
      index: 1
    },{
      label: '速度影响',
      value: '速度影响',
      index: 2
    },{
      label: '背景饱和度',
      value: '背景饱和度',
      index: 3
    },{
      label: '影响后饱和度',
      value: '影响后饱和度',
      index: 4
    },{
      label: '饱和度影响',
      value: '饱和度影响',
      index: 5
    },{
      label: '通行能力',
      value: '通行能力',
      index: 6
    },{
      label: '自由流速度',
      value: '自由流速度',
      index: 7
    },{
      label: '背景反算流量',
      value: '背景反算流量',
      index: 8
    },{
      label: '影响后流量',
      value: '影响后流量',
      index: 9
    },{
      label: '背景服务水平',
      value: '背景服务水平',
      index: 10
    },{
      label: '影响后服务水平',
      value: '影响后服务水平',
      index: 11
    },{
      label: '服务水平变化',
      value: '服务水平变化',
      index: 12
    }
  ],
  PROGRAMSUMMARY:{
    planningLand: {
      label: '规划地块',
      value: 0
    },
    newRoad:{
      label: '新建道路',
      value: 0
    },
    reconstruction:{
      label: '改建道路',
      value: 0
    }
  },

  COMPAREPROHECT:[{
    text:'地块数量相同',
    plan1: 0,
    plan2: 1
  },{
    text:'地块总面积相同',
    plan1: 0,
    plan2: 0
  },{
    text:'新建道路数量相同',
    plan1: 0,
    plan2: 0
  },{
    text:'新建道路里程相同',
    plan1: 0,
    plan2: 0
  },{
    text:'改建道路数量相同',
    plan1: 0,
    plan2: 0
  },{
    text:'改建道路里程相同',
    plan1: 0,
    plan2: 0
  }],
  PLANITEM:{
    landNum:0,
    landArea:0,
    newRoadnum:0,
    newRoadlength:0,
    reconstructionNum:0,
    reconstructionLength:0,
  },
  COMPAREITEM:[{
    label: '方案1',
    value: '方案1'
  },{
    label: '方案2',
    value: '方案2'
  },{
    label: '方案比较',
    value: '方案比较'
  }]
}
