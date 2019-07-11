<template>
  <div id="data-detail">
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
      <div class="data">
        <p>{{item.value}}</p>
      </div>
      <div class="first" v-for="(main, main_index) in item.data" :key="main_index">
        <div v-for="(secondary, secondary_index) in main.data" class="second" :key="secondary_index">
          <ButtonGroupComp shape="circle" size="small">
            <i-button v-for="(everyMonth, everyMonth_index) in secondary.data" :class="[everyMonth.value ===0?'no-data':'has-data']" :key="everyMonth_index">{{everyMonth.name}}</i-button>
          </ButtonGroupComp>
          &nbsp;<span>{{getRoughNum(secondary.total)}}</span>
        </div>
          <!--&nbsp;{{secondary.total}}</div>-->
      </div>
    </div>

    <div class="add-up">
      <div class="summary">
        <div class="title">
          <div class="num">数据总量</div>
      </div>
        <div class="sum" v-for="item in sumArr">
          <p class="num" v-for="temp in item.data">{{temp.value}}</p>
        </div>
      </div>
      <div class="summary">
        <div class="title">
          <p>季度覆盖率</p>
        </div>
        <div class="sum" v-for="item in sumArr">
          <p class="num" v-for="temp in item.data">{{temp.season}}</p>
        </div>
      </div>
      <div class="summary">
        <div class="title">
          <p>年度覆盖率</p>
        </div>
        <div class="sum" v-for="item in sumArr">
          <p class="num" v-for="temp in item.data">{{temp.year}}</p>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import MYCONF from '../../myconf'
  export default {
    name: "YearDetail",
    data() {
      return {
        item:0,
        dataArr:MYCONF.YEAR_DATA_ARR,
        sumArr:MYCONF.YEAR_SUM_ARR,
        tempArr: MYCONF.DATA_SUM,
      }
    },
    props:{

    },
    mounted() {
      // document.getElementById('year-message').style.height = document.getElementsByClassName('data-details')[0].clientHeight + 'px';
      // document.getElementsByClassName('data')[0].style.height = document.getElementsByClassName('tip')[0].scrollHeight + 'px';
    },
    methods:{
      getRoughNum(num){
        num = !num?'': num.toString().length<4? num: num.toString().length<7?((num/1000).toFixed(0)+'k') : ((num/1000000).toFixed(1)+'m');
        return num
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/common.scss";
  #data-detail{
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
      flex: 0 0 15em;
      background-color: rgba(255, 255, 255, 0.1);
      margin-right: 2em;
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
        text-align: left;
        text-indent: 1em;
        margin-bottom: 1rem;
      }
      .first{
        border:1px solid rgba(255, 255, 255, 0);
        line-height: 3em;
        margin-bottom: 1em;
        .second{
          text-align: left;
          text-indent: 1em;
          .no-data{
            background-color: #666666;
          }
          .has-data{
            background-color: #C7D540;
          }
          .right{
            float: right;
          }
        }
      }
    }
    .add-up{
      flex: 0 0 15em;
      display: flex;
      .summary{
        margin-right: 1.5em;
        line-height: 3em;
        font-size: 1.2em;
        height: 44.7em;
        color: $highlight;
        .title{
          cursor: pointer;
          font-size: 0.9em;
          line-height: 3em;
          text-align: left;
          text-indent: 0.5em;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .sum{
          border:1px solid rgba(255, 255, 255, 0);
          line-height: 3em;
          margin-bottom: 1em;
          .num{
            text-align: left;
            text-indent: 0.5em;
          }
        }
      }
    }

  }
</style>
