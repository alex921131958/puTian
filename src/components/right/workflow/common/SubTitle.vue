<template>
  <p>
    <span class="title">{{title}}</span>
    <span class="tip" v-if="tip">({{tip}})</span>
    <i class="icon iconfont icon-cancel" title="重置选中" v-if="title==='替换以下交评并新建'" @click="updateCurProId(null)"></i>
  </p>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import env from '../../../../common/env'

  export default {
    name: 'SubTitle',
    data() {
      return {
      }
    },
    props: {
      title: {
        type: String
      },
      tip: {
        type: String
      }
    },
    computed: {
      ...mapGetters(['menu_list','cur_menu']),

    },
    mounted() {
    },
    methods: {
      ...mapMutations(['updateCurMenu','updateMenuList','updateCurProId']),
    },
    watch: {
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";

  p{
    font-size: $font-normal;
    margin: 0.6rem;
    .title{
      font-weight: bold;
    }
    .tip{
      color: $highlight;
      opacity: 0.8;
    }
    .icon-cancel{
      color: #666;
      cursor: pointer;
      &:hover{
        color:#ddd;
      }
    }
  }
</style>
