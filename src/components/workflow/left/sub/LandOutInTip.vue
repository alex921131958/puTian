<template>
  <div class="box">
    <p class="title"><i class="icon iconfont icon-warn"></i> 出入口编辑说明</p>
    <p class="sub-title">新建: 单机地块周边道路节点;</p>
    <p class="sub-title">删除: 双击既有出入口可移除;</p>
    <p class="sub-title">编号: 自动编号,不可更改;</p>
    <p class="sub-title">数量: 每小区最多设置4个出入口。</p>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "AreaCarInfo",
    data() {
      return {
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    padding: 1.5rem 1rem;
    background-color: #322c00;
    p{
      height: 2rem;
      line-height: 1rem;
    }
    .title {
      color: $highlight;
      font-weight: 600;
    }
    .sub-title{
      color: $highlight;
      line-height: 1.5em;
      opacity: 0.9;
      letter-spacing: 0.5px;
      .icon{
        margin-right: 0.6rem;
      }
    }
  }
</style>
