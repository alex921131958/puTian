<template>
  <div class="box">
    <p class="title">地块基础属性</p>
    <p class="list large">
      <span>地块名称</span>
      <input type="text" v-model="areaObj.name">
    </p>
    <p class="list normal">
      <span>占地面积 (m<sup>2</sup>)</span>
      <span>
        <input type="text" v-model="areaObj.baseArea">
        <span class="auto" @click="getBaseArea">Auto</span>
      </span>
    </p>
    <p class="list normal">
      <span>容积率</span>
      <!--<input type="text" v-model="areaObj.volume">-->
      <span class="response"><InputNumberComp v-model="areaObj.volume" :min="0" :max="20" :step="0.1"/></span>
    </p>
    <p class="list">
      <span>建筑面积 (m<sup>2</sup>)</span>
      <span>{{parseFloat((areaObj.baseArea * areaObj.volume).toFixed(2))}}</span>
    </p>
    <p class="list small unique">
      <span>用地性质</span>
      <span class="block">
        <span class="ratio-item" v-for="(item,index) in landTypeList">
          <span>%</span>
          <input type="text" class="ratio" v-model="landRatioList[index]" :disabled="landTypeList[index]==='未设定'">
          <i-select v-model="landTypeList[index]" style="width:6.8em;" @on-change="setCurAreaType(index)" class="panel land" label-in-value>
            <i-option v-for="area in areaTypeArr" :value="area.value" :key="area.value" :disabled="area.value!='未设定'&&landTypeList.indexOf(area.value)!=-1">{{ area.label }}</i-option>
          </i-select>
        </span>
      </span>
    </p>
   <!-- <p class="list person">
      <span>使用人口(人)</span>
      <span>
        <input type="text" v-model="areaObj.population">
        <span class="auto" @click="calPopulation()">Auto</span>
      </span>
    </p>-->
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'
  import FLOWCONF from '../../flowConf'
  import MYCONF from '../../../../myconf'
  import eventBus from '../../../../util/event-bus'
  import MapCommonLayer from '../../../../service/map/mapCommonLayer'

  export default {
    name: "AreaBaseAttr",
    data() {
      return {
        areaObj: JSON.parse(JSON.stringify(FLOWCONF.AREA_ATTRIBUTE)),
        areaTypeArr: FLOWCONF.AREA_TYPE_LIST,
        landTypeList:['住宅用地','未设定','未设定'],
        landRatioList:[100,0,0],
      }
    },
    mounted() {
      let _this = this;
      this.$nextTick(() => {
        setTimeout(() => {
          _this.areaObj['baseArea'] = parseFloat(_this.landBaseArea);
          _this.calPopulation();
        },150);
        //第一次出现属性面板计算遗漏(landId-watcher)
        if(_this.curLandId && this.landList.indexOf(_this.curLandId)!=-1){
          _this.editToLandAttr(_this.curLandId);
        }
      });
      eventBus.$on("updatePopulation",() => {
        _this.calPopulation();
      });
      eventBus.$on("editCurLandItem",(data) => {
        this.updateLandBaseArea(data.landarea);
        this.updateLandAttr(data);
      });
      eventBus.$on("editToLandAttr",(data) => {
        this.updateLandBaseArea(data.landarea);
        this.updateLandAttr(data);
      });
    },

    computed: {
      ...mapGetters(['cur_step','landBaseArea','isLandEditable','curEditPool','curLandArea','curLandId','landList']),
    },
    components: {
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateCurStep','updateLandAreaObj','updateLandBaseArea']),
      setCurAreaType(index) {
        let typeList = this.landTypeList;
        typeList.map((item,index) => {
          if(item === '未设定'){
            this.landRatioList[index] = 0;
          }
        });
        this.areaObj['ratioList'] = this.landRatioList;
        this.areaObj['typeList'] = typeList;
        this.updateLandAreaObj({typeList:typeList});
        this.updateLandAreaObj({ratioList:this.landRatioList});
      },
      cimmitAreaAttr(){
        this.updateLandAreaObj(this.areaObj);
        this.$emit("cimmitAreaAttr",this.areaObj);
      },
      getBaseArea(){
        let curArea = turf.area(this.curEditPool);
        this.updateLandBaseArea(parseFloat(curArea.toFixed(1)));
      },
      updateLandAttr(data){
        //TODO:用地性质获取设置format
        let type=data.landtype;
        let typeList = [];
        let ratioList = [];
        if(type.indexOf("%")===-1){
          let typeName = type.split("=");
          typeList=[type,"未设定","未设定"];
          ratioList=[100,0,0];
        }else{
          let areaList = type.split(";");
          for (let i=0;i<3;i++){
            let typeName = areaList[i] ? areaList[i].split("%") : [0,"未设定"];
            typeList.push(typeName[1]);
            ratioList.push(typeName[0]);
          }
        }
        setTimeout(() => {
          this.areaObj = {
            name:data.name,
            baseArea:data.landarea,
            volume:data.plotratio,
            buildArea:(parseFloat(data.landarea)*parseFloat(data.plotratio)).toFixed(1),
            typeList:typeList,
            ratioList:ratioList,
            population:data.population,
          };
          this.landTypeList = typeList;
          this.landRatioList = ratioList;
        },200)
      },
      editToLandAttr(landId){
        let url = MYCONF.service.findLandInfo;
        this.$http.get(url+`token=${sessionStorage.getItem("token")}&landID=${landId}`).then((res) => {
          res = res.body;
          let result = res.result;
          let landType = MapCommonLayer.getLandType(result);
          let curLandItem = {
            name:result.name,
            id:result.id,
            landarea:result.landarea,
            plotratio:result.plotratio,
            buildarea:(parseFloat(result.landarea)*parseFloat(result.plotratio)).toFixed(1),
            landtype:landType,
            population:result.population,
            dayaoVol:result.dayaoVol ? parseInt(result.dayaoVol):0,
            dayadVol:result.dayadVol ? parseInt(result.dayadVol):0,
            daymoVol:result.daymoVol ? parseInt(result.daymoVol):0,
            daymdVol:result.daymdVol ? parseInt(result.daymdVol):0,
            daynoVol:result.daynoVol ? parseInt(result.daynoVol):0,
            dayndVol:result.dayndVol ? parseInt(result.dayndVol):0,
            dayaaVol:result.dayaaVol ? parseInt(result.dayaaVol):0,
            daymaVol:result.daymaVol ? parseInt(result.daymaVol):0,
            daynaVol:result.daynaVol ? parseInt(result.daynaVol):0,
            dayadCoefficient:result.dayadCoefficient ? result.dayadCoefficient:1,
            dayaoCoefficient:result.dayaoCoefficient ? result.dayaoCoefficient:1,
            daymdCoefficient:result.daymdCoefficient ? result.daymdCoefficient:1,
            daymoCoefficient:result.daymoCoefficient ? result.daymoCoefficient:1,
            dayndCoefficient:result.dayndCoefficient ? result.dayndCoefficient:1,
            daynoCoefficient:result.daynoCoefficient ? result.daynoCoefficient:1,
            points:result.points,
          };
          // eventBus.$emit("editToLandAttr",curLandItem); //发送到属性面板操作
          this.updateLandBaseArea(curLandItem.landarea);
          this.updateLandAttr(curLandItem);
          //TODO:传到上级更新出行量预测信息
          this.$emit("updateAreaInfo",curLandItem,false);
        });
      },
      calPopulation(){
        let typeList = this.landTypeList;
        let ratioList = this.landRatioList;
        let landType = MapCommonLayer.formatLandType(this,typeList,ratioList,"&");
        if(landType === 0 || landType === 100) return;
        let plotratio = this.areaObj.volume;
        // let landarea = (this.areaObj.baseArea/1000000).toFixed(6);
        let landarea = this.areaObj.baseArea;
        let _this = this;
        let url = MYCONF.service.getPopulation + `token=${sessionStorage.getItem("token")}&plotratio=${plotratio}&landarea=${landarea}&${landType}`;
        this.$http.get(url).then((res) => {
          if(res.body.success){
            let result = Math.round(res.body.result);
            _this.areaObj['population'] = result;
            _this.updateLandAreaObj({population:result});
          }else{
            this.$Message.warning({
              content: '当前地块使用人口计算失败',
              duration:2,
              closable: true
            });
          }
        });
      },
    },
    watch: {
      landBaseArea(val){
        this.areaObj['baseArea'] = parseFloat(this.landBaseArea);
      },
      curLandId(val){
        this.editToLandAttr(val);
      },
      landRatioList(val){
        this.areaObj['ratioList'] = val;
        this.updateLandAreaObj({ratioList:val});
      }
    },
    beforeDestroy() {
      eventBus.$off("editCurLandItem");
      eventBus.$off("updatePopulation");
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    padding: 1rem;
    overflow: hidden;
    .title {
      color: $highlight;
      font-weight: 600;
      line-height: 3rem;
    }
    .list {
      line-height: 3rem;
      display: flex;
      justify-content: space-between;
      input {
        background-color: #242000;
        border: 2px solid #666;
        border-radius: 2px;
        height: 2.4rem;
        line-height: 2.4rem;
        color: #fff;
        padding: 0 0.6rem;
      }
      span {
        &.auto{
          width:2.4rem;
          height: 2.1rem;
          line-height: 2.2rem;
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          background-color: $highlight;
          color: #333;
          font-size: 0.8em;
          cursor: pointer;
        }
      }
      &.large {
        input {
          width: 12rem;
        }
      }
      &.normal {
        input {
          width: 6rem;
          text-align: right;
        }
      }
      &.small {
        input {
          width: 4rem;
          text-align: right;
        }
      }
      &.person {
        input {
          width: 5.8rem;
          text-align: right;
        }
      }
      &.unique{
        &>span{
          &:first-child{
            /*width: 5em;*/
          }
          &.block{
            width: 11.6em;
            /*text-align: right;*/
            display: flex;
            flex-direction: column;
          }
          .ratio-item{
            display: flex;
            flex-direction: row-reverse;
            .ratio{
              width: 2.5rem;
              padding: 0 3px;
              text-align: center;
              height: 2.3rem;
              border: none;
              border-bottom: 1px solid #fff;
              background-color: #221E00;
              color: #fff;
              margin: 0 2px;
              &:disabled{
                opacity: 0.8;
              }
            }
          }
        }
      }
    }
  }

  @media(max-width: 1599px){
    .box {
      .list {
        span {
          &.auto{
            height: 2.1rem;
            line-height: 2.2rem;
          }
        }
        &.large {
          input {
            width: 10rem;
          }
        }
        &.normal {
          input {
            width: 5rem;
          }
        }
      }
    }
  }
  @media(max-width: 1399px){
    .box {
      padding: 1rem 1rem 1rem 0.5rem;
    }
  }
</style>
