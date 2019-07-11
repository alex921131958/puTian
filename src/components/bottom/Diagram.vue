<template>
  <div id="diagram" :class="[diagram_show?'open':'close']">
    <div class="tog-title">
      <span class="title">数据统计分析面板</span>
      <span :class="['tog-tip',diagram_show?'right':'left']" @click="toggleDiagramShow()">
        <span><i class="icon iconfont icon-right"></i></span>
      </span>
    </div>
    <div class="inner">
      <div class="data-panel">
        <p class="title">数据概况</p>
        <p class="quota" v-if="(cur_menu.id === 'carTraffic-1'|| cur_menu.id === 'carTraffic-2')|| cur_menu.id === 'carTraffic-3'|| cur_menu.id === 'carTraffic-4'|| cur_menu.id === 'cmnTraffic-3'">
          <RadioGroupComp v-model="carTraffic_11_tab" @on-change="carTraffic11Change">
            <RadioComp :label="item" v-for="item in carTraffic_11" :key="item" :title="item"></RadioComp>
          </RadioGroupComp>
        </p>
        <CountTag :title="title_1" :subTitle="subTitle_1" :count="count_1" :unit="unit_1" v-if="carTraffic_11_tab !== '分等级车公里'"/>
        <CountTag :title="title_2" :subTitle="subTitle_2" :count="count_2" :unit="unit_2" v-if="(cur_menu.id !== 'cmnTraffic-1'&& carTraffic_11_tab !== '分等级车公里'&&cur_menu.id !== 'personTrip-4')"/>

        <CountTag :title="title_1_km" :subTitle="subTitle_1_km" :count="count_1_km" :unit="unit_1_km" v-if="carTraffic_11_tab === '分等级车公里'"/>
        <CountTag :title="title_2_km" :subTitle="subTitle_2_km" :count="count_2_km" :unit="unit_2_km" v-if="carTraffic_11_tab === '分等级车公里'"/>
      </div>
      <DiagramPanel :title="diagramTitle" ref="diaxAxis"/>
      <TablePanel :title="tableTitle" :tableTip="tableTip" ref="diaTable" :carTraffic_11_tab="carTraffic_11_tab"/>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import env from '../../common/env'
  import MYCONF from '../../myconf'
  import eventBus from '../../util/event-bus'
  import CountTag from './subDiagram/CounTag'
  import DiagramPanel from './subDiagram/DiagramPanel'
  import TablePanel from './subDiagram/TablePanel'
  import DataBasicHandler from '../../service/common/dataBasicHandler'

  export default {
    name: "Diagram",
    data() {
      return {
        diagram_show: true,
        title_1: "平均速度",
        subTitle_1: "",
        count_1: '-',
        unit_1: "km/h",
        title_2: "拥堵指数",
        subTitle_2: "",
        count_2: '-',
        unit_2: "",

        title_1_km: '高/快速路车公里',
        subTitle_1_km: "单向",
        count_1_km: '-',
        unit_1_km: "vkt",
        title_2_km: '主/次干路车公里',
        subTitle_2_km: "单向",
        count_2_km: '-',
        unit_2_km: "vkt",

        diagramTitle: "全日路况变化曲线",
        tableTitle: "数据详情",
        tableTip: "全网分析时仅显示路况指数排名前50的道路",
        curRequest:null,
        carTraffic_11_tab:'路况指数',
        carTraffic_11:['路况指数','平均速度'],
        flowAvgResult:[],
        carkmTotalResult:[],
      }
    },
    components: {
      CountTag,
      DiagramPanel,
      TablePanel,
    },
    computed: {
      ...mapGetters(['display_time', 'cur_menu','panel_time','map_click_disabled','global_area','link_id','source_type',
      'flow_range_max','flow_range_min','tracking_type','distance_type','village_id','adminOption','selected_only','road_sel_type',
        'cur_bus_line','panel_v_type','panel_village_id', 'link_id_A', 'link_id_B','advance_typeA', 'advance_typeB','click_disabled_type',
      'global_v_type','global_loading','overAll','overAll_2','overAll_3','overAll_4','overAll_5','villageMethod','adminArea_sel',
      'buildArea_sel','taz_only']),
    },
    mounted(){
      this.controller = new DataBasicHandler(this);
      eventBus.$on("updateDiagramData",() => {
        this.controller.getBasicData();
      });
      eventBus.$on("stopRequest",() => {
        this.controller.stopDiagramRequest();
      });
      eventBus.$on('preOrdinarySuccess',(type) => {
        let curMenu = this.cur_menu.id;
        if(curMenu === 'carTraffic-4' && type === 'advance'){
          this.controller.getCarTraffic_4_advanced();
          this.diagramTitle = "高级溯源流量分析";
        }else{
          this.controller.getCarTraffic_4();
          this.diagramTitle = "基础溯源流量分析";
        }
      });
      this.$nextTick(() => {
        let menuId = this.cur_menu.id;
        this.setMenuLab(menuId);
      })
    },

    methods: {
      ...mapMutations(['updateGlobalLoading','updateTableSelect']),
      toggleDiagramShow() {
        this.diagram_show = !this.diagram_show;
        setTimeout(() => {
          env.map.resize();
        }, 250);
      },
      displayHour(hour) {
        return hour === 31 ? '早高峰' : hour === 32 ? '晚高峰' : `${hour}:00` + ' ~ ' + `${hour + 1}:00`;
      },
      displaySeason: function (season) {
        return season === 1 ? '第一季度' :
          season === 2 ? '第二季度' :
            season === 3 ? '第三季度' :
              season === 4 ? '第四季度' : '全年';
      },
      disDateTag(datetag) {
        return datetag === 1?'工作日':'非工作日';
      },
      carTraffic11Change(data){
        let count = 0;
        let curMenu = this.cur_menu.id;
        switch (curMenu) {
          case 'carTraffic-1':
            count = data==='平均速度'?2:1;
            break;
          case 'carTraffic-2':
            count = data==='拥堵里程'||data==='路况指数'||data==='平均速度'||data==='平均流量'?1:2;
            break;
          case 'carTraffic-3':
            count = data==='分等级平均流量'?1:2;
            break;
          case 'carTraffic-4':
            count = data==='按溯源流量占比排序'?1:2;
            this.updateTableSelect(count);
            break;
          case 'cmnTraffic-3':
            count = data==='拥堵里程'||data==='路况指数'||data==='平均速度'||data==='平均流量'?1:2;
            break
        }
        this.$refs.diaxAxis.xAxisChangeOp(count);
        this.$refs.diaTable.quotaChangeTable(count)
      },
      setMenuLab(curMenu){
        switch (curMenu) {
          case'carTraffic-1':
            this.title_1 = "平均速度";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "km/h";
            this.title_2 = "拥堵指数";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "";
            this.diagramTitle = "全日路况变化曲线";
            this.tableTip= "全网分析时仅显示路况指数排名前50的道路";
            this.carTraffic_11_tab = '路况指数';
            this.carTraffic_11 = ['路况指数','平均速度'];
            break;
          case'carTraffic-2':
            this.title_1 = "常发拥堵路段总里程";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "km";
            this.title_2 = "常发拥堵路段占比";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "%";
            this.diagramTitle = "常发拥堵分析";
            this.tableTip= "全网分析时仅显示拥堵里程排名前50的道路";
            this.carTraffic_11_tab = '拥堵里程';
            this.carTraffic_11 = ['拥堵里程','拥堵占比'];

            break;
          case'carTraffic-3':
            this.title_1 = "高/快速路平均流量";
            this.subTitle_1 = "单向";
            this.count_1 = '-';
            this.unit_1 = "pcu/h";
            this.title_2 = "主/次干路平均流量";
            this.subTitle_2 = "单向";
            this.count_2 = '-';
            this.unit_2 = "pcu/h";
            this.diagramTitle = "全日流量变化曲线";
            this.tableTip= "全网分析时仅显示平均流量排名前50的道路";
            this.carTraffic_11_tab = '分等级平均流量';
            this.carTraffic_11 = ['分等级平均流量','分等级车公里'];
            break;
          case'carTraffic-4':
            this.title_1 = "选定路段溯源流量占比";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "%";
            this.title_2 = "选定路段平均溯源流量";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "pcu/h";
            this.diagramTitle = this.tracking_type==='base'?"基础溯源流量分析":"高级溯源流量分析";
            this.tableTip= "全网分析时仅显示溯源流量占比排名前50的道路";
            this.carTraffic_11_tab = '按溯源流量占比排序';
            this.carTraffic_11 = ['按溯源流量占比排序','按溯源流量排序'];
            break;
          case'cmnTraffic-1':
            this.title_1 = "平均速度";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "km/h";
            this.diagramTitle = "全日路况变化曲线";
            this.tableTip= "全网分析时仅显示速度排名前50的道路";
            break;
          case'cmnTraffic-3':
            this.title_1 = "主要道路平均流量";
            this.subTitle_1 = "单向";
            this.count_1 = '-';
            this.unit_1 = "辆";
            this.title_2 = "总车公里";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "vkt";
            this.diagramTitle = "全日流量变化曲线";
            this.tableTip= "全网分析时仅显示平均流量排名前50的道路";
            this.carTraffic_11_tab = '平均流量';
            this.carTraffic_11 = ['平均流量','车公里'];
            break;
          case'carTraffic-5':
            break;

          case'personTrip-1':
            this.title_1 = "个体出行总量";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "万人次";
            this.title_2 = "占全日出行量比例";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "%";
            this.diagramTitle = "全日出行量变化曲线";
            break;

          case'personTrip-2':
            this.title_1 = "总人口";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "万人";
            this.title_2 = "当前人口占峰值比";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "%";
            this.diagramTitle = "全日人口变化曲线";
            this.tableTip= "全网分析时仅显示动态人口排名前50的小区";
            break;

          case'personTrip-3':
            this.title_1 = "平均出行距离";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "km";
            this.title_2 = "平均出行时间";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "min";
            this.diagramTitle = "出行特征分析图 ";
            this.tableTip= "全网分析时仅显示出行距离排名前50的小区";
            break;

          case'personTrip-4':
            this.title_1 = "总居住人口";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "万人";
            this.title_2 = "职住分离水平";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "%";
            this.diagramTitle = "职住平衡分析图";
            this.tableTip= "全网分析时仅显示居住人口排名前50的小区";
            break;

          case'personTrip-5':
            this.title_1 = "出行总量";
            this.subTitle_1 = "";
            this.count_1 = '-';
            this.unit_1 = "万人次";
            this.title_2 = "占全日出行量比例";
            this.subTitle_2 = "";
            this.count_2 = '-';
            this.unit_2 = "%";
            this.diagramTitle = "出行量吸引量分析图";
            this.tableTip= "全网分析时仅显示建成区或区县生成吸引量排名";
            break;

          default:
            break;
        }
      }
    },
    watch: {
      // tracking_type(newVal){
      //   if(newVal){
      //     this.diagramTitle = newVal==='base'?"基础溯源流量分析":"高级溯源流量分析";
      //   }
      // },
      cur_menu(newVal) {
        let curMenu = newVal.id;
        this.setMenuLab(curMenu);
      },
      carTraffic_11_tab(newVal){
        this.tableTip = newVal==='路况指数'?'全网分析时仅显示路况指数排名前50的道路':
          newVal==='平均速度'?'全网分析时仅显示平均速度升序排名前50的道路':
            newVal==='拥堵里程'?'全网分析时仅显示拥堵里程排名前50的道路':
              newVal==='拥堵占比'?'全网分析时仅显示拥堵占比排名前50的道路':
                newVal==='分等级平均流量'?'全网分析时仅显示平均流量排名前50的道路':
                  newVal==='分等级车公里'?'全网分析时仅显示车公里排名前50的道路':
                    newVal==='按溯源流量占比排序'?'全网分析时仅显示溯源流量占比排名前50的道路':
                      newVal==='按溯源流量排序'?'全网分析时仅显示溯源流量排名前50的道路':
                        newVal==='平均流量'?'全网分析时仅显示平均流量排名前50的道路':
                          newVal==='车公里'?'全网分析时仅显示车公里排名前50的道路': '全网分析时仅显示路况指数排名前50的道路'
      },
    },
    beforeDestroy() {
      eventBus.$off("updateDiagramData");
      eventBus.$off("stopRequest");
      eventBus.$off("preOrdinarySuccess");
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../common/common.scss";

  #diagram {
    background-color: #f1f1f1;
    & > div {
      width: 100%;
    }
    &.open {
      height: 24em;
      transition: all ease-in-out 0.2s;
    }
    &.close {
      height: 2em;
      transition: all ease-in-out 0.2s;
    }
    .tog-title {
      height: 2em;
      line-height: 2em;
      background-color: #000;
      text-align: center;
      color: #fff;
      position: relative;
      .title {
        letter-spacing: 1px;
      }
      .tog-tip {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 200;
        width: 2.2em;
        height: 2em;
        line-height: 2.4em;
        background-color: $bg-red;
        cursor: pointer;
        span {
          display: flex;
          width: 1.2em;
          height: 1.2em;
          margin-left: 0.6em;
          margin-top: 0.4em;
          transform: rotate(90deg);
          transition: all ease-in-out 0.2s;
        }
        .icon-right {
          color: #fff;
          line-height: 1.5rem;
        }
        &.left {
          span {
            transform: rotate(270deg);
            transition: all ease-in-out 0.2s;
          }
        }
      }
    }
    .inner {
      height: 22em;
      padding: 0.8em;
      background-color: #f1f1f1;
      /*display: flex;*/

      .data-panel {
        float: left;
        width: 13em;
        padding: 0 0.2em 0 0.5em;
        p {
          text-align: left;
          &.title {
            font-size: 1.3em;
            font-weight: 600;
          }
          &.normal {
            font-size: $font-bigger;
          }
          &.bold {
            font-weight: 600;
          }
          &.quota{
            margin-top: 0.5em;
            line-height: 1.8;
            label{
              margin-left: 0;
            }
          }
        }
      }
    }
  }

  /* .move-enter-active, .move-leave-active {
     transition: all 0.5s linear;
     transform: translate3d(0, 0, 0);
   }
   .move-enter,.move-leave {
     transform: translate3d( 0,-100%, 0);
   }*/

</style>
