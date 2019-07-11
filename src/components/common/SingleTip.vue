<template>
    <span class="sin-tip-bg" @click="setItemActive">
      <span class="sin-tip"
            :style="{backgroundColor: isActive ? switchBg : '#ddd'}"></span>
    </span>
</template>

<script>
  export default {
    name: 'SingleTip',
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
      isActive: {
        type: Boolean
      }
    },
    methods: {
      setItemActive() {
        this.$emit('setItemActive');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/common.scss";
  @media(max-width: 1599px) {
    .sin-tip-bg {
      width: 1.2rem;
      height: 1.2rem;
      border-radius: 1.2rem;
      margin: 0 2px;
      position: relative;
      top: 0.75em;
      left: 0.4rem;
      .sin-tip {
        width: 0.6rem;
        height: 0.6rem;
        top: 0.2rem;
        left: 0.2rem;
      }
    }
  }
  @media (min-width:1600px) and (max-width:1919px){
    .sin-tip-bg {
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 1.2rem;
      margin: 0 2px;
      position: relative;
      top: 0.75rem;
      left: 0.4rem;
      .sin-tip {
        width: 0.7rem;
        height: 0.7rem;
        top: 0.2rem;
        left: 0.2rem;
      }
    }
  }

  @media (min-width:1920px){
    .sin-tip-bg {
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 1.2rem;
      margin: 0 2px;
      position: relative;
      top: 0.75rem;
      left: 0.4rem;
      .sin-tip {
        width: 0.7rem;
        height: 0.7rem;
        top: 0.2rem;
        left: 0.2rem;
      }
    }
  }

  .sin-tip-bg {
    margin: 0 2px;
    position: relative;
    cursor: pointer;
    background-color: rgb(255, 255, 255);
    border: 0.1em solid #adadad;
    &.global{
      top: 0.8em;
    }
    &.fixed {
      background-color: rgb(255, 255, 255);
      .tog-tip{
        right: 0.25em;
      }
    }
    &.closed {
      background-color: rgba(255, 255, 255, 0.7);
      .tog-tip{
        left: 0.25em;
      }
    }
    .sin-tip {
      position: absolute;
      /*width: 0.7rem;*/
      /*height: 0.7rem;*/
      /*top: 0.2rem;*/
      /*left: 0.2rem;*/
      border-radius: 50%;
    }
  }
</style>
