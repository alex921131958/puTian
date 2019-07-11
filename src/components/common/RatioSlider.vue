<template>
  <div class="slider">
    <SliderComp v-model="ratioVal" :min="-20" :max="15" :step="1" show-tip="never"/>
    <InputNumberComp v-model="ratioVal" :min="-20" :max="15" :formatter="ratioSetting" size="default"/>
  </div>
</template>

<script>
  export default {
    name: 'RatioSlider',
    data () {
      return {
        ratioVal: 0,
      }
    },
    props:{
      bufferRatio:Number
    },
    mounted(){
      let _this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          _this.ratioVal = _this.bufferRatio;
        },300);
      })
    },
    methods:{
      ratioSetting(value){
        return value===0?'1:1':value<0?`${Math.abs(value)}:1`:`1:${value}`;
      },
      resetRatio(){
        this.ratioVal = this.bufferRatio;
      }
    },
    watch:{
      ratioVal(val){
        this.$emit("ratioChange",val);
      },
      bufferRatio(val){
        this.ratioVal = val;
      }
    }
  }
</script>

<style scoped lang="scss">
  .slider{
    display: flex;
    .ivu-slider{
      flex: 1;
      margin-right: 1em;
    }
  }
</style>
