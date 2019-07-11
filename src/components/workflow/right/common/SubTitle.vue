<template>
<p>
  {{title}}
</p>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "SubTitle",
      data() {
        return {
        }
      },
      props:{
        title:{
          type:String
        },
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
    font-size: 1.1em;
    line-height: 2em;
    font-weight: 600;
    margin-top: 0.5rem;
  }

</style>
