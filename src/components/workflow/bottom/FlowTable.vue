<template>
  <div id="diagram" :class="[diagram_show?'open':'close']">
    <div class="tog-title">
      <span class="title">属性统计面板</span>
      <span :class="['tog-tip',diagram_show?'right':'left']" @click="toggleDiagramShow()">
        <span><i class="icon iconfont icon-right"></i></span>
      </span>
    </div>

    <div class="inner">
      <div class="table-container" ref="tableBox">
        <TableComp v-if="cur_step===2||cur_step===4||cur_step===5" :loading="isLoading" :data="linkData" :columns="linkColumns"
                   :height=tableHeight :no-data-text="noDataText"></TableComp>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import env from '../../../common/env'
  import MYCONF from '../../../myconf'
  import eventBus from '../../../util/event-bus'
  import FlowTableHandler from '../../../service/common/flowTableHandler'

  export default {
    name: "FlowTable",
    data() {
      return {
        diagram_show: true,
        isLoading: false,
        noDataText: '暂无数据',
        linkColumns: [],
        linkData: [],
        tableHeight: 200,

        projectOdData:null,   //全部地块OD
        odPointData:null,   //全部地块D点数据
      }
    },
    components: {},
    computed: {
      ...mapGetters(['cur_step', 'cur_pro_id', 'curEditPool', 'curLandId','attributePanel','lineOnClick','linkOnClick','landList','landColor','editLinks',
      'curHighlightRoadId','curLine','landOdType','landOdColor','landOdWidth','odExpMin','odExpMax','time_tag','allOdShow','colorType','curJudgeState',
        'curLinePool','expCircle']),
    },
    mounted() {
      this.controller = new FlowTableHandler(this);
      let _this = this;
      _this.controller.getColumnData();
      _this.controller.getTableData();
      this.$nextTick(() => {
        if (_this.$refs['tableBox']) {
          _this.tableHeight = _this.$refs['tableBox'].offsetHeight;
        }
        //step2post修改后的信息成功后触发
        eventBus.$on("updateTableLand", () => {
          this.controller.getLandItemInfo();
        });
        eventBus.$on("deleteLandItem", (landId) => {
          this.controller.deleteLandItem(landId);
        });
        eventBus.$on("updateTableEntry", () => {
          this.controller.getEntryItemInfo();
          this.controller.addEntryLayer();
        });
        eventBus.$on("curEntrySelected",(landId) => {
          this.controller.curEntrySelected(landId);
        });

        //切到step3时加载之前编辑过的道路
        eventBus.$on('getOldLineInfoSuccess', function (data) {
          _this.controller.getCurStep_3(data[0], data[1]);
        });
        // 选中项selected高亮
        eventBus.$on("highlightCurLand",() => {
          _this.locateToCurLine(_this.curLandId);
        });

        eventBus.$on("landAttrCancel", () => {
          this.linkData.map((item, index) => {
            if (item['_highlight']) {
              item['_highlight'] = false;
            }
          });
        });

        eventBus.$on("updateProjectOdRender",(type,val) => {
          this.controller.updateProjectOdRender(type,val);
        });

        eventBus.$on('removeLinkData', function () {
          _this.controller.removeLinkData();
        });

        eventBus.$on("globalLoadingShow",(type) => {
          this.updateGlobalMask(true);
          if(type === 'step4'){
            this.updateAllOdShow(true);
            //删除step3和step6中的渲染图层
            this.controller.removeRenderLayer();
            this.controller.getStep4Image();
          }else if(type === 'step7'){
            this.controller.getStep7Image();
          }
        });
        eventBus.$on("showAreaMergeOd",() => {
          _this.controller.getProjectMergeOd();
        });
      });
    },
    methods: {
      ...mapMutations(['updateRoadNum','updateRoadLength','updateAttributePanel', 'updateCurEditPool','updateLandBaseArea','updateCurLandId','updateLandList',
      'updateCurHighlightRoadId','updateCurLinePool','updateCurJudgeState','updateAllOdShow','updateGlobalMask']),
      toggleDiagramShow(){
        this.diagram_show = !this.diagram_show;
        setTimeout(() => {
          env.map.resize();
        }, 250);
      },
      locateToCurLine(val){
        this.linkData.map((item, index) => {
          if (item.id === val) {
            item['_highlight'] = true;
            setTimeout(() => {
              let tableObj = document.querySelectorAll(".table-container .ivu-table-overflowY")[0];
              let itemH = document.querySelectorAll(".table-container .ivu-table-row-highlight")[0].offsetHeight;
              if(tableObj) tableObj.scrollTop = itemH * (index - 1);
            }, 200)
          } else {
            item['_highlight'] = false;
          }
        })
      }
    },
    watch: {
      cur_step(val) {
        this.linkData = [];
        let _this = this;
        if (val === 2 || val === 4 || val === 5) {
          setTimeout(() => {
            _this.controller.getColumnData();
            _this.controller.getTableData();
          }, 200);
        }
      },
      curLandId(val) {
        let _this = this;
        if (this.cur_step === 4 && val) {
          this.linkData.map((item, index) => {
            if (item.id === val) {
              item['_highlight'] = true;
              setTimeout(() => {
                let tableObj = document.querySelectorAll(".table-container .ivu-table-overflowY")[0];
                let itemH = document.querySelectorAll(".table-container .ivu-table-row-highlight")[0].offsetHeight;
                if(tableObj) tableObj.scrollTop = itemH * (index - 1);
              }, 200)
            } else {
              item['_highlight'] = false;
            }
          })
        }
       /* if(this.cur_step === 5 && val){
          if(env.entryMarkers.length>0){
            env.map.removeMarkers(env.entryMarkers);
          }
        }*/
      },
      curLine(newVal){
        let _this = this;
        if (this.cur_step === 2 && newVal){
          _this.linkData.map((item, index) => {
            item['_highlight'] = item.id === newVal;
          })
        }
      },
      linkData(newVal){
        this.updateRoadNum(newVal.length);
        let count = 0;
        for (let i=0; i<newVal.length; i++) {
          count += newVal[i].len/1000
        }
        this.updateRoadLength(count)
      },
      allOdShow(val){
        if(val){
          this.controller.getProjectOdLayer();
        }
      }
    },
    beforeDestroy() {
      eventBus.$off("updateTableEntry");
      eventBus.$off("updateTableLand");
      eventBus.$off("globalLoadingShow");
      eventBus.$off("showAreaMergeOd");
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common";

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
      padding: 0.5em;
      background-color: #666;
      display: flex;
      .table-container {
        /*flex: 1;*/
        width: 100%;
        /*height: 100%;*/
      }
    }
  }


</style>
