<template>
<p>
  {{title}}
  <!--<span class="switch"><SwitchComp v-model="isShow" @on-change="setSwitchToggle"/></span>-->
  <!--.stop 阻止冒泡事件的发生-->
  <span :class="[isShow ? 'fixed':'closed','tog-box']" @click.stop="setSwitchToggle">
      <span class="tog-tip"></span>
    </span>
</p>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
    export default {
        name: "TitleSwitch",
      data() {
        return {
        }
      },
      props:{
        title:{
          type:String
        },
        isShow:{
          type:Boolean
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
        ...mapMutations([]),
        setSwitchToggle(data){
          this.$emit("setSwitchToggle",data);
        }
      },
    }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";
  p{
    /*font-size: 1.1em;*/
    line-height: 2em;
    font-weight: 600;
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    .tog-box {
      width: 2em;
      height: 1.2em;
      border-radius: 1.2em;
      margin: 0 2px;
      position: relative;
      top: 0.3em;
      cursor: pointer;
      &.fixed {
        background-color: #fbe644;
        .tog-tip{
          background-color: #333;
          left: 1em;
          transition: all ease-in-out 0.3s;
        }
      }
      &.closed {
        background-color: #4a4a4a;
        .tog-tip{
          background-color: #fbe644;
          left: 0.25em;
          transition: all ease-in-out 0.3s;
        }
      }
      .tog-tip {
        position: absolute;
        width: 0.7em;
        height: 0.7em;
        top: 0.25em;
        border-radius: 50%;
      }
    }
  }

</style>
