<template>
<p>
  <i class="icon iconfont icon-step"></i><span class="step">{{step}}</span>
  <span>{{title}}</span>
</p>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "stepTitle",
      data() {
        return {
        }
      },
      props:{
        title:{
          type:String
        },
        step:{
          type:Number
        }
      },
      mounted() {

      },
      computed: {
        ...mapGetters(['cur_step']),
      },
      components:{
      },
      methods: {
        ...mapMutations([])
      },
    }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";
  p{
    font-size: 1.4em;
    line-height: 2em;
    .iconfont{
      color: $highlight;
      margin-left: -0.8em;
    }
    .step{
      font-size: 1.1em;
      font-weight: 600;
      color: $highlight;
      margin: 0 1rem 0 0.3rem;
    }
  }

</style>
