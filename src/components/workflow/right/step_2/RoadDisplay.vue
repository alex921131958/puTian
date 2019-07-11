<template>
  <div class="box">
    <p class="list">
      <span>新建道路颜色</span>
      <span class="switch"><ColorPickerComp v-model="tempNewColor" :colors="colors" @on-change="setNewColor"/></span>
    </p>
    <p class="list">
      <span>改建道路颜色</span>
      <span class="switch"><ColorPickerComp v-model="tempEditColor" :colors="colors" @on-change="setEditColor"/></span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import MYCONF from '../../../../myconf'
  import FLOWCONF from '../../flowConf'

  export default {
    name: "RoadDisplay",
    data() {
      return {
        trafficIndex:['daily','earlyPeak','latePeak'],
        colors: MYCONF.COLOR_PICKER,
        roadTypeList:FLOWCONF.ROAD_SHOW_TYPE,
        curShowType:FLOWCONF.ROAD_SHOW_TYPE[0].label,
        tempNewColor:"#3B90EE",
        tempEditColor:"#ee1b36",
        tempLineColor:"#e1ee29",
        whetherTwoWay:'双向路',
        whetherTwoWayList:['单向路','双向路']
      }
    },
    props: {
      newRoadColor: {
        type: String
      },
      editRoadColor: {
        type: String
      },
      lineRoadColor: {
        type: String
      },
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
       setTimeout(() => {
         _this.tempNewColor = _this.newRoadColor;
         _this.tempEditColor = _this.editRoadColor;
         _this.tempLineColor = _this.lineRoadColor;
       },150);
      })
    },
    computed: {
      ...mapGetters(['cur_step']),
    },
    components: {},
    methods: {
      ...mapMutations(['updateRoadSingle']),
      setNewColor(data){
        this.$emit("setNewColor",data);
      },
      setEditColor(data){
        this.$emit("setEditColor",data);
      },
      setLineColor(data){
        this.$emit("setLineColor",data);
      },
      setCurRoadType(data) {
        this.$emit("setRoadType",data);
      },
      setRoadSinglePath(data){
        let path = data==='单向路'? 0 : 1;
        this.updateRoadSingle(path)
      }
    },
    watch:{
      newRoadColor(val){
        if(val){
          this.tempNewColor = val;
        }
      },
      editRoadColor(val){
        if(val){
          this.tempEditColor = val;
        }
      },
      lineRoadColor(val){
        if(val){
          this.tempLineColor = val;
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
