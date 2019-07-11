<template>
  <div class="box">
    <p class="list">
      <span>地块颜色</span>
      <span class="switch"><ColorPickerComp v-model="tempAreaColor" :colors="colors" @on-change="setAreaColor"/></span>
    </p>
    <p class="list">
      <span>地块文字标签</span>
      <i-select v-model="landType" style="width:10em;" @on-change="setCurAreaType">
        <i-option v-for="item in areaTypeList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "AreaDisplay",
    data() {
      return {
        trafficIndex:['daily','earlyPeak','latePeak'],
        colors: MYCONF.COLOR_PICKER,
        areaTypeList:FLOWCONF.AREA_SHOW_TYPE,
        landType:FLOWCONF.AREA_SHOW_TYPE[0].label,
        tempAreaColor:"#3B90EE",
      }
    },
    props: {
      areaColor: {
        type: String
      },
      labelType: {
        type: String
      }
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
       setTimeout(() => {
         _this.tempAreaColor = _this.areaColor;
         _this.landType = _this.labelType;
       },150);
      })
    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {},
    methods: {
      ...mapMutations([]),
      setAreaColor(data){
        this.$emit("setAreaColor",data);
      },
      setCurAreaType(data) {
        this.$emit("setAreaType",data);
      },
    },
    watch:{
      areaColor(val){
        if(val){
          this.tempAreaColor = val;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p{
      &.list{
        display: flex;
        line-height: 3em;
        margin-top: 0.5em;
        justify-content: space-between;
        &.list-item{
          justify-content: space-between;
        }
        &.list-extra{
          & > span{
            margin-right: 1.2rem;
          }
        }
        & > span:first-child {
          text-indent: 2.2em;
          &.item{
            width: 12rem;
          }
        }
        .highlight{
          color: $highlight;
        }
      }
    }
  }

  @media(max-width: 1599px){
    .box {
      p{
        &.list{
          & > span:first-child {
            text-indent: 1.2em;
          }
        }
      }
    }
  }

</style>
