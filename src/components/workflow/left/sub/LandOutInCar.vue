<template>
  <div class="box">
    <p class="title">出入口车辆出入比例</p>
    <p class="highlight">(修改后务必保存)</p>
    <p class="list small" v-for="(item,index) in entryList">
      <span>{{item}}</span>
      <span>
        <input type="text" v-model="ratioList[index]" :disabled="item==='未设定'">%
      </span>
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
    name: "LandOutInCar",
    data() {
      return {
        entryList:["未设定","未设定","未设定","未设定"],
        ratioList:[0,0,0,0],
      }
    },
    mounted() {

    },

    computed: {
      ...mapGetters(['cur_step','landBaseArea','isLandEditable','curEditPool','curLandArea','curLandId','landList','entryArr','ratioArr']),
    },
    components: {
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateCurStep','updateEntryArr','updateRatioArr']),
    },
    watch: {
      entryArr(val){
        this.entryList = val;
      },
      ratioArr(val){
        this.ratioList = val;
      },
      ratioList(val){
        // this.$emit("updateRatio",val);
        this.updateRatioArr(val);
      }
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
    .highlight{
      color:$bg-red;
      font-weight: 600;
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
      &.small {
        input {
          width: 4rem;
          text-align: right;
          &:disabled{
            opacity: 0.6;
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
