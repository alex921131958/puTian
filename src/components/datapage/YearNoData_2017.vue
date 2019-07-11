<template>
  <div id="year-message-no-data">
    <div class="headline">
      <div class="data"></div>
      <div class="data-frame" v-for="(item, index) in sumArr" :key="index">
        <div :class="['title','module']"><p>{{item.name}}</p></div>
        <div :class="['title','sub']">
          <p v-for="(detail, detail_index) in item.data" :key="detail_index">{{detail.name}}</p>
        </div>
      </div>
    </div>

    <div v-for="(item,index) in dataArr" class="season" :key="index">
      <p class="data" @click="jumpToDetail('details',item.name)">{{item.name}}年</p>
      <div class="first" v-for="(main,main_index) in item.data" :key="main_index">
        <div></div>
        <div v-for="(detail, detail_index) in main.data" :key="detail_index" class="second">
          <i :class="['icon', 'iconfont', 'icon-yuan',detail.total?'has-data':'no-data']"></i>
          <span> &nbsp;&nbsp;&nbsp;{{detail.total}}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../myconf'

  export default {
    name: "YearNoData_2017",
    data() {
      return {
        tempData:MYCONF.YEAR_SUM_ARR,

        dataArr:[{
          name: 2017,
          data:[
            {
              name:'道路运行数据资源',
              data:[
                {
                  name: '互联网路况数据',
                  total: '',
                },
                {
                  name: '拥堵统计数据',
                  value: '拥堵统计数据',
                  total: '',
                },
                {
                  name: '互联网流量数据',
                  total: '',
                },
                {
                  name: '溯源轨迹数据',
                  total: '',
                }
              ]
            },{
              name:'公共交通数据资源',
              data:[
                {
                  name: '公交IC卡数据',
                  total: '',
                },
                {
                  name: '公交GPS数据',
                  total: '',
                }
              ]
            },{
              name:'个体出行数据资源',
              data:[
                {
                  name: '信令基础数据',
                  total: '',
                },
                {
                  name: '栅格OD数据',
                  total: '',
                },
                {
                  name: '职住平衡数据',
                  total: '',
                },
                {
                  name: '出行特征数据',
                  total: '',
                },{
                  name: '行政区OD数据',
                  total: '',
                }
              ]
            },{
              name:'基础数据资源',
              data:[
                {
                  name: '互联网路网数据',
                  total: '',
                },
                {
                  name: '可编辑路网数据',
                  total: '',
                }
              ]
            }
          ]
        },{
          name: 2018,
          data:[
            {
              name:'道路运行数据资源',
              data:[
                {
                  name: '互联网路况数据',
                  total: 2281708,
                },
                {
                  name: '拥堵统计数据',
                  value: '拥堵统计数据',
                  total: 416129,
                },
                {
                  name: '互联网流量数据',
                  total: 3503273,
                },
                {
                  name: '溯源轨迹数据',
                  total: 995898,
                }
              ]
            },{
              name:'公共交通数据资源',
              data:[
                {
                  name: '公交IC卡数据',
                  total: '',
                },
                {
                  name: '公交GPS数据',
                  total: '',
                }
              ]
            },{
              name:'个体出行数据资源',
              data:[
                {
                  name: '信令基础数据',
                  total: '---',
                },
                {
                  name: '栅格OD数据',
                  total: 2254696,
                },
                {
                  name: '职住平衡数据',
                  total: 2872,
                },
                {
                  name: '出行特征数据',
                  total: 10470,
                },{
                  name: '行政区OD数据',
                  total: 135,
                }
              ]
            },{
              name:'基础数据资源',
              data:[
                {
                  name: '互联网路网数据',
                  total: 995898,
                },
                {
                  name: '可编辑路网数据',
                  total: 88602,
                }
              ]
            }
          ]
        },{
          name: 2019,
          data:[
            {
              name:'道路运行数据资源',
              data:[
                {
                  name: '互联网路况数据',
                  total: '',
                },
                {
                  name: '拥堵统计数据',
                  value: '拥堵统计数据',
                  total: '',
                },
                {
                  name: '互联网流量数据',
                  total: '',
                },
                {
                  name: '溯源轨迹数据',
                  total: '',
                }
              ]
            },{
              name:'公共交通数据资源',
              data:[
                {
                  name: '公交IC卡数据',
                  total: '',
                },
                {
                  name: '公交GPS数据',
                  total: '',
                }
              ]
            },{
              name:'个体出行数据资源',
              data:[
                {
                  name: '信令基础数据',
                  total: '',
                },
                {
                  name: '栅格OD数据',
                  total: '',
                },
                {
                  name: '职住平衡数据',
                  total: '',
                },
                {
                  name: '出行特征数据',
                  total: '',
                },{
                  name: '行政区OD数据',
                  total: '',
                }
              ]
            },{
              name:'基础数据资源',
              data:[
                {
                  name: '互联网路网数据',
                  total: '',
                },
                {
                  name: '可编辑路网数据',
                  total: '',
                }
              ]
            }
          ]
        }],
        sumArr:MYCONF.YEAR_SUM_ARR,
        tempArr: MYCONF.DATA_SUM,
      }
    },
    props:{
      title: Number
    },
    mounted() {
    },
    methods:{
      ...mapMutations(['updateDataSourceType','updateDataSourceYear']),
      jumpToDetail(data, year){
        this.updateDataSourceType(data);
        this.updateDataSourceYear(year)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/common.scss";
  #year-message-no-data{
    position: absolute;
    display: flex;
    .headline{
      flex: 0 0 15em;
      margin-right: 1em;
      font-size: 1.2em;
      .data{
        height: 2rem;
        cursor: pointer;
        font-weight: bold;
        text-align: left;
        text-indent: 1em;
        margin-bottom: 1rem;
      }
      .data-frame{
        display: flex;
        border:1px solid rgba(102,102,102,0);
        margin-bottom: 1em;
        .title{
          text-align: left;
          width: 8em;
          line-height: 3em;
        }
        .module{
          margin: 0 1em;
          color: $highlight;
        }
        .sub{
          color: white;
        }
      }
    }
    .season{
      flex: 0 0 9em;
      background-color: rgba(255, 255, 255, 0.1);
      margin-right: 5em;
      line-height: 3em;
      font-size: 1.2em;
      height: 44.3em;
      color: white;
      .tip{
        color: white;
        height: 3em;
        font-size: 1.2rem;
      }
      .data{
        height: 2rem;
        cursor: pointer;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      .first{
        border:1px solid rgba(255, 255, 255, 0);
        line-height: 3em;
        margin-bottom: 1em;
        .second{
          text-align: left;
          text-indent: 1em;
          color: white;
          .no-data{
            color: #666666;
          }
          .has-data{
            color: #C7D540;
          }
          .right{
            float: right;
          }
        }
      }
    }




/*    .data{
      height: 2.5em;
      cursor: pointer;
    }
    .first{
      border:1px solid rgba(255, 255, 255, 0);
      line-height: 3em;
      margin-bottom: 1em;
      text-indent: -4em;
      .temp{
        color: $highlight;
        height: 1em;
        font-size: 1em;
      }
      .no-data{
        color: #BCBBB7;
        height: 1em;
        font-size: 1em;
      }
    }*/
  }
</style>
