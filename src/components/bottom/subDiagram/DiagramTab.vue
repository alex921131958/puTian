<template>
  <div class="tab">

    <p class="list double" v-if="cur_menu.id === 'carTraffic-1' || cur_menu.id === 'carTraffic-2'">
      <RadioGroupComp v-model="curRnage"  @on-change="carTraffic32Change" :class="{disabled:!isGlobal}">
        <RadioComp :label="item" v-for="item in carTraffic_range" :key="item" :title="item" :disabled="!isGlobal"></RadioComp>
      </RadioGroupComp>
    </p>

    <p class="list" v-if="cur_menu.id === 'cmnTraffic-1'">
      <RadioGroupComp v-model="curRnage"  @on-change="cmnTraffic32Change" :class="{disabled:!isGlobal}">
        <RadioComp :label="item" v-for="item in carTraffic_range" :key="item" :disabled="!isGlobal"></RadioComp>
      </RadioGroupComp>
    </p>
    <p class="list double" v-if="cur_menu.id === 'cmnTraffic-3'">
      <RadioGroupComp v-model="cmnCurRnage"  @on-change="carTraffic32Change" :class="{disabled:!isGlobal}">
        <RadioComp :label="item" v-for="item in cmnTraffic_3_range" :key="item" :disabled="!isGlobal"></RadioComp>
      </RadioGroupComp>
    </p>

    <p class="list" v-if="cur_menu.id === 'personTrip-1'">
      <RadioGroupComp v-model="personTrip_1l_tab" @on-change="personTrip1lChange" :class="{disabled:overAll}">
        <RadioComp :label="item" v-for="item in personTrip_1l" :key="item" :disabled="overAll"></RadioComp>
      </RadioGroupComp>
    </p>

    <p class="list" v-if="cur_menu.id === 'personTrip-2'">
      <RadioGroupComp v-model="personTrip_2l_tab" @on-change="personTrip2lChange" :class="{disabled:overAll_2}">
        <RadioComp :label="item" v-for="item in personTrip_2l" :key="item" :disabled="overAll_2"></RadioComp>
      </RadioGroupComp>
    </p>

  </div>
</template>

<script>
  import MYCONF from '../../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../util/event-bus'
  export default {
    name: "DiagramTab",
    data() {
      return {
        carTraffic_11:['路况指数','平均速度'],
        carTraffic_range:['全市(含组团通道)','各建成区比较'],
        cmnTraffic_3_range:['全市(不含组团通道)','各建成区比较'],
        carTraffic_21:['拥堵里程','拥堵占比'],
        carTraffic_31:['分等级平均流量','分等级车公里'],
        carTraffic_41:['按溯源流量占比排序','按溯源流量排序'],
        personTrip_1l:['全市(含组团通道)','各建成区比较(生成吸引总量)'],
        personTrip_2l:['全市(含组团通道)','各建成区比较'],
        personTrip_3l:['无调节选项'],
        personTrip_4l:[],
        personTrip_5l:[],
        cmnTraffic_11:['平均速度','小汽车公交速度差'],
        cmnTraffic_31:['平均流量','车公里'],


        curRnage:'全市(含组团通道)',      //---对应carTraffic_range
        cmnCurRnage:'全市(不含组团通道)',      //---对应carTraffic_range
        carTraffic_11_tab:'路况指数',      //---carTraffic_11
        carTraffic_21_tab:'拥堵里程',      //---carTraffic_21
        carTraffic_31_tab:'分等级平均流量',      //---carTraffic_31
        carTraffic_41_tab:'按溯源流量占比排序',      //---carTraffic_31
        personTrip_1l_tab:'全市(含组团通道)',
        personTrip_2l_tab:'全市(含组团通道)',
        personTrip_3l_tab:'无调节选项',
        cmnTraffic_11_tab:'平均速度',
        cmnTraffic_31_tab:'平均流量',
      }
    },
    props: {
      isGlobal:{
        type:Boolean
      },
      sourceRange:{
        type:Number
      }
    },
    computed: {
      ...mapGetters(['cur_menu','overAll','overAll_2','selected_only']),
    },
    methods:{
      ...mapMutations(['updateTableSelect']),
      carTraffic32Change(data) {
        let count = data === '各建成区比较' ? 4 : 3;
        this.$emit("sourceRange", count);
      },
      cmnTraffic32Change(data) {
        let count = data === '各建成区比较' ? 4 : 3;
        this.$emit("speedChange", count);
      },
      personTrip1lChange(data){
        let count = data==='全市(含组团通道)'?1:2;
        this.$emit("xAxisChange",count);
      },
      personTrip2lChange(data){
        let count = data==='全市(含组团通道)'?1:2;
        this.$emit("xAxisChange",count);
      },
    },
    watch:{
      sourceRange(newVal){
        if(newVal){
          this.curRnage = newVal===3?'全市(含组团通道)':'各建成区比较';
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  .tab {
    .list{
      white-space: nowrap;
      overflow: hidden;
      text-align: left;
      line-height: 1.5em;
      margin-top: 0.4em;
      .tip{
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }

</style>
