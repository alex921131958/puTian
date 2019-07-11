<template>
  <div id="data-source">
    <p class="panel-title">数据资源概况</p>
    <p class="tab-p">
      <span @click="setCurTab('overview')" :class="{active:data_source_type==='overview'}">年度概况</span>
      <span @click="setCurTab('details')" :class="{active:data_source_type==='details'}">资源详情</span>
    </p>

    <div class="data-details">
      <YearStatistics v-if="data_source_type==='overview'"></YearStatistics>
      <!--<YearNoData_2017 v-if="data_source_type==='overview'" :title='2017'></YearNoData_2017>-->
      <!--<YearNoData_2019 v-if="data_source_type==='overview'" :title='2019'></YearNoData_2019>-->
      <YearDetail v-if="data_source_type==='details'&&data_source_year===2018"></YearDetail>
      <YearDetailNoData v-if="data_source_type==='details'&&(data_source_year===2019||data_source_year===2017)"></YearDetailNoData>
      <!--<test v-if="data_source_type==='details'&&(data_source_year===2019||data_source_year===2017)"></test>-->
      <p class="tip" v-if="data_source_type==='overview'">
        <i class="icon iconfont icon-warn"></i>
        <span>点击年度可跳转至资源详情</span>
      </p>
      <p class="tip" v-if="data_source_type==='details'">
        <span>统计年度</span>
        <i-select v-model="curYear" style="width:10em;">
          <i-option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </p>

      <div class="data-frame">
        <div class="module-title"><p>道路运行数据资源</p></div>
        <div class="sub-title">
          <p>互联网路况数据</p>
          <p>拥堵统计数据</p>
          <p>互联网流量数据</p>
          <p>溯源轨迹数据</p>
        </div>

      </div>
      <div class="data-frame">
        <div class="module-title"><p>公共交通数据资源</p></div>
        <div class="sub-title">
          <p>公交IC卡数据</p>
          <p>公交GPS数据</p>
        </div>

      </div>
      <div class="data-frame">
        <div class="module-title"><p>个体出行数据资源</p></div>
        <div class="sub-title">
          <p>信令基础数据</p>
          <p>栅格OD数据</p>
          <p>职住平衡数据</p>
          <p>出行特征数据</p>
          <p>行政区OD数据</p>
        </div>

      </div>
      <div class="data-frame">
        <div class="module-title"><p>基础数据资源</p></div>
        <div class="sub-title">
          <p>互联网路网数据</p>
          <p>可编辑路网数据</p>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../myconf'
  import env from '../common/env'
  import YearStatistics from './datapage/YearStatistics'
  import YearNoData_2017 from './datapage/YearNoData_2017'
  import YearNoData_2019 from './datapage/YearNoData_2019'
  import YearDetail from './datapage/YearDetail'
  import YearDetailNoData from './datapage/YearDetailNoData'
  import test from './datapage/test'
  export default {
    name: 'DataResource',
    data() {
      return {
        yearList: MYCONF.YEAR_LIST,
        curYear: MYCONF.YEAR_LIST[1].label,
      }
    },
    created(){

    },
    components:{
      YearStatistics,
      YearNoData_2017,
      YearNoData_2019,
      YearDetail,
      YearDetailNoData,test
    },
    mounted(){

    },
    computed: {
      ...mapGetters(['data_source_type','data_source_year']),
    },
    methods: {
      ...mapMutations(['updateDataSourceType','updateDataSourceYear']),
      setCurTab(type){
        this.updateDataSourceType(type)
      },
    },
    watch:{
      curYear(newVal){
        this.updateDataSourceYear(newVal)
      },
      data_source_year(newVal){
        this.curYear = newVal
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../common/common.scss";
  #data-source{
    flex: 1;
    background-color: #2E2E2E;
    padding: 2em;
    p{
      text-align: left;
      &.panel-title{
        color:$highlight;
        font-weight: bold;
        font-size: 2em;
        margin-bottom: 0.6em;
      }
      &.tab-p{
        line-height: 2em;
        margin-bottom: 2em;
        span{
          font-size: 1.2em;
          opacity: 0.6;
          color: white;
          font-weight: bold;
          display: inline-block;
          padding: 3px;
          margin: 0 12px 0 0;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          &:hover,&.active{
            opacity: 1;
            border-color: $bg-red;
          }
        }
      }
      &.tip{
        color: white;
        margin-bottom: 1em;
        margin-top: 1em;
        height: 2em;
        span{
          margin-right: 2em;
        }
      }
    }
    .data-details{
      width: 100%;
      margin: 0 auto;
    }
    .data-frame{
      display: flex;
      font-size: 1.2em;
      border:1px solid #666666;
      margin-bottom: 1em;
      .module-title{
        /*flex: 0 0 10em;*/
        /*float: left;*/
        width: 8em;
        line-height: 3em;
        color: $highlight;
        /*margin-left: 1em;*/
        /*margin-right: 1em;*/
        margin: 0 1em;
        opacity: 0;
      }
      .sub-title{
        /*flex: 0 0 10em;*/
        /*float: right;*/
        width: 8em;
        color: white;
        line-height: 3em;
        opacity: 0;
      }
    }
  }

</style>
