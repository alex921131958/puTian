<template>
  <div class="sel-sty">
    <RadioGroup v-model="animal">
      <Radio label="金斑蝶"></Radio>
      <Radio label="爪哇犀牛"></Radio>
      <Radio label="印度黑羚"></Radio>
    </RadioGroup>
  </div>
</template>

<script>
  import MYCONF from '../../myconf'

  export default {
    name: 'SelectComp',
    data() {
      return {
        DateList:
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.curItem = this.curData;
      })
    },
    computed:{

    },
    props: {
      dataList: {
        type: Array
      },
      curData: {
        type: Object
      }
    },
    methods: {
      setCurData(item) {
        this.curItem = item;
        this.isDrop = !this.isDrop;
        this.$emit("setCurData",item);   //返回父组件修改当前值
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/common.scss";

  .sel-sty {
    display: flex;
    width: 9em;
    height: 2.9em;
    line-height: 1.8;
    border: 0.15em solid #717170;
    position: relative;
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
    .text {
      flex: 1;
      padding: 0 0.8em;
      line-height: 2.6;
      text-align: left;
      letter-spacing: 2px;
      text-indent: 0.2em;
    }
    .icon-Arrow {
      width: 2.8em;
      font-size: 0.6rem;
      color: #929290;
      line-height: 3em;
      transform: scale(0.8);
      transition: all ease-in-out 0.3s;
      cursor: pointer;
      &.down {
        transform: rotate(180deg);
        line-height: 3.4em;
        transition: all ease-in-out 0.3s;
      }
    }
    ul {
      width: 10em;
      position: absolute;
      top: 2.9em;
      left: -0.2em;
      border: 0.15em solid #717170;
      padding: 0.5em 0;
      li {
        width: 100%;
        line-height: 2em;
        cursor: pointer;
        opacity: 0.8;
        &:hover {
          opacity: 1;
          background-color: #2f2f2e;
        }
      }
    }
  }
</style>
