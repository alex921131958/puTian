<template>
  <div class="box">
    <p class="list">
      <span>交通分配模型</span>
      <i-select v-model="cur_traffic_model" style="width:10em;" @on-change="setTrafficModel">
        <i-option v-for="item in traffic_model" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </p>

    <p class="list">
      <span>迭代次数</span>
      <i-select v-model="cur_iteration_num" style="width:10em;" @on-change="setIterationNum" :disabled="cur_traffic_model==='一次分配'">
        <i-option v-for="item in iteration_num" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </p>

    <p class="list">
      <span>路阻函数</span>
      <i-select v-model="cur_path_function" style="width:10em;" @on-change="setPathFunction">
        <i-option v-for="item in path_function" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import FLOWCONF from '../../flowConf'

  export default {
    name: '',
    data() {
      return{
        traffic_model: FLOWCONF.TRAFFIC_DISTRIBUTION_MODEL,
        cur_traffic_model: FLOWCONF.TRAFFIC_DISTRIBUTION_MODEL[1].label,
        iteration_num: FLOWCONF.ITERATION_NUM,
        cur_iteration_num: FLOWCONF.ITERATION_NUM[0].label,
        path_function:FLOWCONF.PATH_FUNCTION,
        cur_path_function:FLOWCONF.PATH_FUNCTION[0].label,
      }
    },
    props: {
      newTrafficModel: {
        type: String
      },
      newIterationNum: {
        type: String
      },
      newPathFunction: {
        type: String
      },
    },
    mounted(){

    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    methods: {
      ...mapMutations([]),
      setTrafficModel(data){
        this.$emit("setTrafficModel",data);
        if(data === '一次分配'){
          this.cur_iteration_num = '1';
          this.$emit("setIterationNum",'1');
        }
      },
      setIterationNum(data){
        this.$emit("setIterationNum",data);
      },
      setPathFunction(data){
        this.$emit("setPathFunction",data);
      },
    },
    watch:{
      newTrafficModel(val){
        if(val){
          this.cur_traffic_model = val;
        }
      },
      newIterationNum(val){
        if(val){
          this.cur_iteration_num = val;
        }
      },
      newPathFunction(val){
        if(val){
          this.cur_path_function = val;
        }
      },

    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p {
      line-height: 3rem;
      &.list {
        display: flex;
        justify-content: space-between;
        line-height: 3.4em;
        & > span:first-child {
          text-indent: 2.2em;
        }
      }
    }
  }

  @media(max-width: 1599px){
    .box {
      p{
        &.list{
          & > span:first-child {
            text-indent: 1.2em;
          }
        }
      }
    }
  }

</style>
