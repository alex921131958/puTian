<template>
  <div class="box">
    <p class="list">
      <span class="slide">期望线最小交通量阈值(pcu/h)</span>
      <span class="response"><InputNumberComp v-model="tempExpMin" :min="0" :max="1000" :step="1"
                                              @on-change="setExpMin"/>
        <span class="reset" @click="resetExpCount('min')"><i class="icon iconfont icon-refresh"></i></span>
      </span>
    </p>

    <p class="list">
      <span class="slide">期望线最大交通量阈值(pcu/h)</span>
      <span class="response">
        <InputNumberComp v-model="tempExpMax" :min="1" :max="2000" :step="5" @on-change="setExpMax"/>
        <span class="reset" @click="resetExpCount('max')"><i class="icon iconfont icon-refresh"></i></span>
      </span>
    </p>

    <p class="list">
      <span class="slide">期望线最大宽度</span>
      <span class="response"><InputNumberComp v-model="tempExpWidth" :min="0" :max="100" :step="1"
                                              @on-change="setExpWidth"/></span>
    </p>

    <p class="list">
      <span>期望线显示内容</span>
      <RadioGroupComp v-model="tempCurContent">
        <RadioComp :label="item" v-for="item in contentList" :key="item"></RadioComp>
      </RadioGroupComp>
    </p>
    <p class="list">
      <span>期望线颜色</span>
      <span>
        <RadioGroupComp v-model="colorSel">
        <RadioComp :label="item" v-for="item in colorList" :key="item"></RadioComp>
      </RadioGroupComp>
      <span class="switch"><ColorPickerComp v-model="tempOdColor" :colors="colors" @on-change="setOdColor" :disabled="colorSel==='彩色'"/></span>
      </span>
    </p>
    <p class="list">
      <span class="slide1">形心圆点半径</span>
      <span class="response1"><SliderComp v-model="landRadius" :min="1" :max="10" :step="1" show-input/></span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import FLOWCONF from '../../flowConf'

  export default {
      name: "OdDisplay",
    data() {
      return {
        trafficIndex: ['daily', 'earlyPeak', 'latePeak'],
        colors: MYCONF.COLOR_PICKER,
        areaTypeList: FLOWCONF.AREA_SHOW_TYPE,
        curShowType: FLOWCONF.AREA_SHOW_TYPE[0].label,
        tempOdColor: "#ee3d0e",
        contentList: FLOWCONF.SHOW_CONTENT,
        tempCurContent: FLOWCONF.SHOW_CONTENT[0],
        tempExpMin: FLOWCONF.DEFAULT_EXP_MIN,
        tempExpMax: FLOWCONF.DEFAULT_EXP_MAX,
        tempExpWidth: FLOWCONF.DEFAULT_EXP_WIDTH,
        colorList:['彩色','单色'],
        colorSel:'单色',
        landRadius:1,    //形心圆点半径
      }
    },
    props: {
      odColor: {
        type: String
      },
      curContent: {
        type: String
      },
      expMin: {
        type: Number
      },
      expMax: {
        type: Number
      },
      expWidth: {
        type: Number
      },
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          _this.tempOdColor = _this.odColor;
          _this.tempCurContent = _this.curContent;
          _this.tempExpMin = _this.expMin;
          _this.tempExpMax = _this.expMax;
          _this.tempExpWidth = _this.expWidth;
          _this.landRadius = _this.expCircle;
        }, 200);
      })
    },
    computed: {
      ...mapGetters(['cur_step', 'landParamObj']),
    },
    components: {},
    methods: {
      ...mapMutations(['updateColorType','updateOdExpCircle']),
      setOdColor(data) {
        this.$emit("setOdColor", data);
      },
      setExpMin(data) {
        this.$emit("setExpMin", data);
      },
      setExpMax(data) {
        this.$emit("setExpMax", data);
      },
      setExpWidth(data) {
        this.$emit("setExpWidth", data);
      },
      resetExpCount(type) {
        if (type === 'min') {
          this.tempExpMin = this.landParamObj.expMin ? this.landParamObj.expMin : this.expMin;
          this.$emit("setExpMin", this.tempExpMin);
        } else {
          this.tempExpMax = this.landParamObj.expMin ? this.landParamObj.expMax : this.expMax;
          this.$emit("setExpMax", this.tempExpMax);
        }
      },
      setColorType(color){
        this.colorSel = color;
      }
    },
    watch: {
      odColor(val) {
        if (val) {
          this.tempOdColor = val;
        }
      },
      curContent(val) {
        if (val) {
          this.tempCurContent = val;
        }
      },
      tempCurContent(val) {
        if (val) {
          this.$emit("setCurContent", val);
        }
      },
      colorSel(val){
        this.updateColorType(val);
      },
      landRadius(val){
        if(val){
          this.updateOdExpCircle(val);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    p {
      &.list {
        display: flex;
        line-height: 3em;
        margin-top: 0.5em;
        justify-content: space-between;
        &.list-item {
          justify-content: space-between;
        }
        &.list-extra {
          & > span {
            margin-right: 1.2rem;
          }
        }
        & > span:first-child {
          text-indent: 2.2em;
          &.item {
            width: 12rem;
          }
        }
        .highlight {
          color: $highlight;
        }
        span {
          &.reset {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
            width: 2.5em;
            height: 2.5em;
            margin-left: 0.5em;
            background-color: #666;
            line-height: 2.5em;
            cursor: pointer;
            .icon {
              color: #000;
              font-size: 1.4em;
            }
          }
          &.slide1{
            width: 14em;
            text-align: left;
          }
          &.response1{
            flex: 1;
          }
        }
      }
    }
  }

  @media(max-width: 1599px) {
    .box {
      p {
        &.list {
          & > span:first-child {
            text-indent: 1.2em;
          }
        }
      }
    }
  }

</style>
