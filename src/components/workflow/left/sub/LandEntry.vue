<template>
  <div class="box">
    <p class="title">地块出入口</p>
    <p class="list large">
      <span>选定小区</span>
      <span>{{areaObj.name}}</span>
    </p>
    <p class="list normal">
      <span>占地面积 (m<sup>2</sup>)</span>
      <span>{{areaObj.baseArea}}</span>
    </p>
    <p class="list normal">
      <span>已设定出入口数量</span>
      <span>{{areaObj.count}}</span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'
  import FLOWCONF from '../../flowConf'
  import MYCONF from '../../../../myconf'
  import eventBus from '../../../../util/event-bus'

  export default {
    name: "LandEntry",
    data() {
      return {

      }
    },
    mounted() {
    },
    props:{
      areaObj:{
        type:Object
      }
    },

    computed: {
      ...mapGetters([]),
    },
    methods: {
      ...mapMutations([]),
    },
    watch: {
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    padding: 1.5rem 1rem;
    .title {
      color: $highlight;
      font-weight: 600;
      line-height: 3rem;
    }
    .list {
      line-height: 3rem;
      display: flex;
      justify-content: space-between;
      input {
        background-color: #242000;
        border: 2px solid #666;
        border-radius: 2px;
        height: 2.4rem;
        line-height: 2.4rem;
        color: #fff;
        padding: 0 0.6rem;
      }
      span {
        &.auto{
          width:2.4rem;
          height: 2.1rem;
          line-height: 2.2rem;
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          background-color: $highlight;
          color: #333;
          font-size: 0.8em;
          cursor: pointer;
        }
      }
      &.large {
        input {
          width: 12rem;
        }
      }
      &.normal {
        input {
          width: 6rem;
          text-align: right;
        }
      }
      &.small {
        input {
          width: 4rem;
          text-align: right;
        }
      }
      &.unique{
        &>span{
          &:first-child{
            /*width: 5em;*/
          }
          &.block{
            width: 12em;
            text-align: right;
          }
          .ratio-item{
            .ratio{
              width: 2.5rem;
              padding: 0 3px;
              text-align: center;
              height: 2.2rem;
              border: none;
              border-bottom: 1px solid #fff;
              background-color: #221E00;
              color: #fff;
            }
          }
        }
      }
    }
  }

  @media(max-width: 1599px){
    .box {
      .list {
        span {
          &.auto{
            height: 2.1rem;
            line-height: 2.2rem;
          }
        }
        &.large {
          input {
            width: 10rem;
          }
        }
      }
    }
  }
</style>
