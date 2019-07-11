<template>
  <div class="box">
    <!--<p class="list">
      <span>出入口颜色</span>
      <span>
      <span class="switch"><ColorPickerComp v-model="tempOdColor" :colors="colors"/></span>
      </span>
    </p>-->

    <p class="list">
      <span class="slide">出入口符号大小</span>
      <span class="response"><InputNumberComp v-model="iconSize" :min="0" :max="100" :step="1"/></span>
    </p>


  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import FLOWCONF from '../../flowConf'
  import eventBus from "../../../../util/event-bus";

  export default {
    name: '',
    data() {
      return{
        tempOdColor: "#ee3d0e",
        colors: MYCONF.COLOR_PICKER,
        iconSize: 1
      }
    },
    mounted() {

    },
    computed: {
      ...mapGetters(['cur_step','stepOneTemp']),
    },
    methods:{},
    watch:{
      iconSize(val){
        this.$emit("iconSizeChange",val);
      }
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
        &.list-item{

        }
        & > span:first-child {
          text-indent: 2.2em;
        }
      }
      &.title {
        line-height: 3rem;
        display: flex;
        justify-content: space-between;
      }
      .btn{
        color: #666;
        height: 2.3rem;
        line-height: 2.5rem;
        margin-top: 0.8rem;
        text-align: center;
        cursor: pointer;
      }
      .btn1 {
        width: 11rem;
        background-color: #FFFFFF;
        margin-left: 2.2rem;
      }
      .btn2 {
        flex: 1;
        background-color: $highlight;
        margin-left: 0.6rem;
      }
      span {
        /*opacity: 0.8;*/
        .content {
          color: $highlight;
          margin-left: 1rem;
        }
        .tip {
          margin-right: 0.2rem;
        }
        .radio{
          margin-top: -0.2rem;
        }
      }
    }
  }
</style>
