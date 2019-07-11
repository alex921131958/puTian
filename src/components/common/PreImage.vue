<template>
  <div class="mask" v-if="mask_url">
    <p></p>
    <img :src="mask_url" alt="">
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: 'PreImage',
    data () {
      return {
        title: '暂无数据',
      }
    },
    mounted(){
    },
    computed: {
      ...mapGetters([ 'mask_url']),
    },
  }
</script>

<style scoped lang="scss">
  .mask{
    position: absolute;
    top: 100px;
    left: 200px;
    z-index: 10000;
    min-width: 800px;
    min-height: 500px;
    border: 1px solid #3a8ee8;
    overflow: hidden;
    background-color: #fff;
    padding:2em;
    img{
      /*width: 100%;*/
      /*height: 100%;*/
    }
  }
</style>
