<template>
  <div class="box">

    <p class="list">
      <span>地块颜色</span>
      <span class="switch"><ColorPickerComp v-model="tempLandColor" :colors="colors" @on-change="setLandColor"/></span>
    </p>

  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "LoadDisplay",
    data() {
      return {
        colors: MYCONF.COLOR_PICKER,
        tempLandColor:"#3B90EE",
      }
    },
    props: {
      landRoadColor: {
        type: String
      },
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          _this.tempLandColor = _this.landRoadColor;
        },150);
      })
    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {},
    methods: {
      ...mapMutations([]),
      setLandColor(data){
        this.$emit("setLandColor",data);
      },
    },
    watch:{

      landRoadColor(val){
        if(val){
          this.tempLandColor = val;
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

</style>
