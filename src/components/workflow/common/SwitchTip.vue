<template>
    <span :class="[isFixed ? 'fixed':'closed','tog-box']" @click.stop="switchFixed">
      <span class="tog-tip"
            :style="{backgroundColor: isFixed ? switchBg : '#999'}"></span>
    </span>
</template>

<script>
  export default {
    name: 'SwitchTip',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted() {

    },
    props: {
      switchBg: {
        type: String
      },
      isFixed: {
        type: Boolean
      }
    },
    methods: {
      switchFixed() {
        this.$emit('switchToggle');
      }
    }
  }
</script>

<style scoped lang="scss">

  .tog-box {
    width: 2em;
    height: 1.2em;
    border-radius: 1.2em;
    margin: 0 2px;
    position: relative;
    top: 0.8em;
    &.fixed {
      background-color: #484000;
      .tog-tip{
        left: 1em;
        transition: all ease-in-out 0.3s;
      }
    }
    &.closed {
      background-color: #484000;
      .tog-tip{
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
</style>
