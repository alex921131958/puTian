<template>
  <div class="box">
    <p class="list list-extra">
      <span>规划道路</span>
      <span class="highlight">{{roadInfo.count}}个</span>
      <span class="highlight">{{roadInfo.length}}公里</span>
    </p>

    <p class="list1">
      <span>编辑道路是否双向</span>
      <RadioGroupComp v-model="whetherTwoWay" @on-change="setRoadSinglePath">
        <RadioComp :label="item" v-for="item in whetherTwoWayList" :key="item"></RadioComp>
      </RadioGroupComp>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'

  export default {
    name: "RoadCount",
    data() {
      return {
        trafficIndex:[],
        whetherTwoWay:'双向路',
        whetherTwoWayList:['单向路','双向路']
      }
    },
    props: {
      roadInfo: {
        type: Object
      },
    },
    mounted() {

    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {
    },
    methods: {
      ...mapMutations(['updateRoadSingle']),
      setRoadSinglePath(data){
        let path = data==='单向路'? 0 : 1;
        this.updateRoadSingle(path)
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p{
      &.list{
        display: flex;
        line-height: 3em;
        &.list-item{
          justify-content: space-between;
        }
        &.list-extra{
          & > span{
            margin-right: 1.2rem;
          }
        }
        & > span:first-child {
          text-indent: 2.2em;
          &.item{
            width: 12rem;
          }
        }
        .highlight{
          color: $highlight;
        }
      }
      &.list1{
        display: flex;
        line-height: 3em;
        margin-top: 0.5em;
        justify-content: space-between;
        &.list-item{
          justify-content: space-between;
        }
        &.list-extra{
          & > span{
            margin-right: 1.2rem;
          }
        }
        & > span:first-child {
          text-indent: 2.2em;
          &.item{
            width: 12rem;
          }
        }
        .highlight{
          color: $highlight;
        }
      }
    }
  }

</style>
