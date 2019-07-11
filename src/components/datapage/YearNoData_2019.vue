<template>
  <div id="year-message-no-data">
    <div class="data" @click="jumpToDetail('details')">
      <p>{{title}}年</p>
    </div>
    <div class="first" v-for="item in tempData" :key="item.name">
      <p v-for="detail in item.data" :key="detail.name">
        <i :class="['icon', 'iconfont', 'icon-yuan','temp']"></i>
      </p>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../myconf'

  export default {
    name: "YearNoData_2019",
    data() {
      return {
        tempData:MYCONF.YEAR_SUM_ARR
      }
    },
    props:{
      title: Number
    },
    mounted() {
    },
    methods:{
      ...mapMutations(['updateDataSourceType','updateDataSourceYear']),
      jumpToDetail(data){
        this.updateDataSourceType(data);
        this.updateDataSourceYear(2019)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/common.scss";
  #year-message-no-data{
    position: absolute;
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    left: 70em;
    line-height: 3em;
    width: 10em;
    font-size: 1.2em;
    height: 44.7em;
    .data{
      /*margin-bottom: 1em;*/
      height: 2.5em;
      cursor: pointer;
    }
    .first{
      border:1px solid rgba(255, 255, 255, 0);
      line-height: 3em;
      margin-bottom: 1em;
      text-indent: -4em;
      /*margin-top: 1em;*/
      .temp{
        color: #BCBBB7;
        height: 1em;
        font-size: 1em;
      }
    }
  }
</style>
