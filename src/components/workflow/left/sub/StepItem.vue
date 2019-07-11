<template>
  <li :class="[cur_step===stepContent.id?'active':'','step-item']"  @click="updateCurStep(stepContent.id)">
    <span class="pre-tip">
      <i :class="['icon iconfont','icon-step'+stepContent.id]"></i>
    </span>
    <dl>
      <dt>{{stepContent.name}}</dt>
      <dd>内容显示</dd>
    </dl>
    <span class="next-tip"></span>
    <div :class="['switch',stepContent.id===1||stepContent.id===7?'disabled':'']">
      <SwitchTip :isFixed="stepContent.content" :switchBg="switchBg" @switchToggle="switchToggle"/>
    </div>
  </li>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'

  export default {
    name: "stepItem",
    data() {
      return {
        switchBg:'#fbe644'
      }
    },
    mounted() {
    },

    props: {
      stepContent: {
        type: Object
      }
    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateCurStep']),
      switchToggle(){
        this.$emit('updateStepList');
      }
    },
    watch: {}
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .step-item {
    height: 4.8rem;
    line-height: 4.8rem;
    background-color: rgba(251, 230, 68, 0.36);
    margin-top: 2px;
    display: flex;
    flex-direction: row;
    position: relative;
    cursor: pointer;
    &.active{
      background-color: rgba(251, 230, 68, 1);
      & > dl{
        color: #000;
      }
    }
    &.disabled{
      opacity: 0.6;
      pointer-events: none;
      display: none;
    }

    & > .pre-tip{
      background-color: rgba(0, 0, 0, 0.4);
      width: 2.3rem;
      text-align: center;
      & > .iconfont {
        font-size: 1.4em;
        color: $highlight;
      }
    }
    & > dl{
      line-height: 2rem;
      color: $highlight;
      opacity: 0.7;
      padding: 0.5rem 0.8rem;
      dt{
        white-space: nowrap;
        font-size: 1.2em;
        font-weight: 600;
      }
      dd{

      }
    }
    .next-tip{
      width: 0.4rem;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      position: absolute;
      right: 0;
    }
    .switch{
      width: 3rem;
      height: 2rem;
      position: absolute;
      right: 0.5rem;
      bottom: 0.8rem;
      display: flex;
      cursor: pointer;
      &.disabled{
        pointer-events: none;
        cursor: not-allowed;
      }
    }
  }

  @media(max-width: 1399px) {
    .step-item {
      & > .pre-tip{
        background-color: rgba(0, 0, 0, 0.4);
        width: 1.8rem;
        & > .iconfont {
          font-size: 1.4em;
        }
      }
      & > dl{
        padding: 0.5rem 0.6rem;
      }
    }
  }

  @media (min-width:1911px){
    .step-item {
      & > dl{
        dt{
          font-size: 1.15em;
          letter-spacing: 1px;
          font-weight: 600;
        }
      }
    }
  }
</style>
