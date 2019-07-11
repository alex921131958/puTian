<template>
  <div id="box">
    <div class="vill-switch">
      <p class="list" v-for="item in villageType">
        <SingleTip :switchBg="singleBg" :isActive="item.value === globalVType"
                   @setItemActive="setGlobalVType(item.value)" class="global"/>
        <span class="label" @click="setGlobalVType(item.value)">{{item.label}}</span>
        <i-select v-model="curArea" style="width:10em;" @on-change="setCurArea" :label-in-value="labelInValue"
                  v-if="item.value === 0" :disabled="globalVType !== 0">
          <i-option v-for="item in area_list" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>
      </p>
    </div>

    <VillageList villageTitle="点击开始选择交通小区" villageType1="global" :villageList="global_village"  noDataVill="未选择交通小区" ref="villageList"
                 :class="{disabled:globalVType === 0}"/>

    <p class="btn">
      <span :class="['btn',curBtn==='confirm'?'active':'']" @click="confirmGlobalVillage">确  认</span>
      <!--<span :class="['btn',curBtn==='cancel'?'active':'']" @click="updateCurTab('')">更新全局小区</span>-->
      <span :class="['btn',curBtn==='cancel'?'active':'']" @click="cancelGlobalVillage">取  消</span>
    </p>
  </div>
</template>

<script>
  import MYCONF from '../../../myconf'
  import VillageList from '../../common/VillageList'
  import SingleTip from '../../common/SingleTip'
  import {mapGetters, mapMutations} from 'vuex'
  import MapCommonLayer from '../../../service/map/mapCommonLayer'
  import eventBus from '../../../util/event-bus'

  export default {
    name: "GlobalVillage",
    data() {
      return {
        curBtn: 'confirm',
        villageList: MYCONF.PRE_VILLAGE_LIST,
        villageType: MYCONF.VILLAGE_TYPE,
        curType: MYCONF.VILLAGE_TYPE[0],
        villageFist: '',
        preVillageList: MYCONF.PRE_VILLAGE_LIST,
        curArea: 0,
        curAreaObj: null,
        singleBg: '#d33027',
        labelInValue: true,
        globalVType:1,
        tempGlobalVil:[],    //暂存已存自定义交通小区
      }
    },
    components: {
      VillageList,
      SingleTip,
    },
    mounted() {
      this.$nextTick(() => {
        this.getGlobalVillage();
        // this.curArea = this.global_area&&this.global_area.value?this.global_area.value:0;
      });
    },
    computed: {
      ...mapGetters(['cur_tab', 'global_v_type', 'global_village', 'area_list', 'global_v_active', 'isVillageEditable','global_area',
        'global_village_id','global_village_name','v_update_time','menu_list','temp_village','temp_village_id']),
    },
    methods: {
      ...mapMutations(['updateCurTab', 'updateGlobalVType', 'updateGlobalVillage', 'updateGlobalVActive', 'updateVillageEditable',
        'updateGlobalArea','updateGlobalVillageIds','updateGlobalVillageNames','updateVUpdateTime','updateMenuList','updateVillageTitle',
        'updateTempVillage','updateTempVillageIds','updateTempVillageNames']),
      setCurArea(data) {
        this.curAreaObj = data;
      },
      setGlobalVType(val) {
        this.globalVType = val;
      },
      confirmGlobalVillage() {
        let that = this;
        if(this.globalVType === 1 && this.global_village.length === 0){
          this.$Message.warning({
            content: '请自定义全局交通小区列表',
            closable: true
          });
          return;
        }
        let vType = this.globalVType === 0?'taz':'gridtaz';
        let vIds = this.globalVType === 0?this.curAreaObj.value:this.global_village_id.join(",");
        let vNames = this.globalVType === 0?this.curAreaObj.label:this.global_village_name.join(",");
        let url = MYCONF.service.saveVil + `type=${vType}&token=${sessionStorage.getItem('token')}&id=${vIds}&name=${vNames}`;

        if((this.global_v_type===this.globalVType&&this.global_v_type===0&&this.curAreaObj.value===this.global_area.value)||(this.global_v_type===this.globalVType&&this.global_v_type===1&&this.temp_village.length===this.global_village.length&&(this.temp_village_id[this.temp_village_id.length-1]===this.global_village_id[this.global_village_id.length-1]||this.temp_village_id.toString()===this.global_village_id.toString()))){
          this.updateCurTab('');
        }else{
          this.$http.get(url).then(response => {
            response = response.body;
            that.updateTempVillage(that.global_village);
            that.updateTempVillageIds(that.global_village_id);
            that.updateVUpdateTime(response.msg);
            // that.updateGlobalTime(that.cur_time);
            // eventBus.$emit("updateGlobalTime");
          });
          this.updateCurTab('');
          //置灰menu列表
          this.disabledMenuList();
          //更新所有已存全局小区字段
          this.disabledGlobalVil();
        }

        this.updateVillageEditable(false);
        this.updateGlobalVType(this.globalVType);
        this.updateGlobalArea(this.curAreaObj);
        this.updateCurTab('');
        MapCommonLayer.hideBaseVillageLayer();
      },
      cancelGlobalVillage(){
        this.getGlobalVillage();
        this.updateCurTab('');
        MapCommonLayer.hideBaseVillageLayer();
        this.$refs['villageList'].endVillageEdit();
      },
      getGlobalVillage(){
        let url = MYCONF.service.globalVil+`&token=${sessionStorage.getItem('token')}`;
        let villageList = [];
        let idList = [];
        let nameList = [];
        let that = this;
        this.$http.get(url).then(response => {
          response = response.body;
          if(response && response.result){
            let result = response.result;
            let type = response.type === 'taz'?0:1;
            this.globalVType = type;
            that.updateVUpdateTime(result[0].updatetime);
            that.updateGlobalVType(type);
            if(type === 0){
              that.updateGlobalArea({
                label:result[0].value,
                value:result[0].key
              });
              that.curAreaObj = {
                label:result[0].value,
                value:result[0].key
              };
              that.curArea = result[0].key;
              that.updateTempVillage([]);   //清空全局小区非选项
              that.updateTempVillageIds([]);
              that.updateGlobalVillage([]);   //清空全局小区非选项
              that.updateGlobalVillageIds([]);
              that.updateGlobalVillageNames([]);
            }else{
              result.map((item) => {
                idList.push(item.key);
                nameList.push(item.value);
                villageList.push({
                  id: item.key,
                  name: item.value,
                })
              });

              that.updateTempVillage(JSON.parse(JSON.stringify(villageList)));
              that.updateTempVillageIds(JSON.parse(JSON.stringify(idList)));
              that.updateGlobalVillage(villageList);
              that.updateGlobalVillageIds(idList);
              that.updateGlobalVillageNames(nameList);
            }
          }else{
            that.$Message.warning({
              content: '暂未设置全局小区',
              closable: true
            });
          }

        })
      },
      disabledMenuList(){
        let menuList = this.menu_list;
        menuList.map((item) => {
          let list = item.menuList;
          list.map((menu) => {
            if(menu.globalvil){
              menu.globalvil = false;
            }
          })
        });
        this.updateMenuList(menuList);
      },
      disabledGlobalVil(){
        let that = this;
        let url = MYCONF.service.disabledGlobalUrl + `token=${sessionStorage.getItem('token')}&filter=vilfollow&value=0`;
        this.$http.get(url).then(response => {
          response = response.body;
          if(response){
            that.$Message.warning({
              content: '提示：更改全局时间，将导致之前的相关全局设置失效',
              closable: true,
              duration:4
            });
          }
        });
      }

    },
    watch:{
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../../common/common.scss";

  #box {
    position: absolute;
    top: 4em;
    left: 0;
    width: 32em;
    /*height: 36em;*/
    background-color: #555;
    z-index: 500;
    padding: 1em 1.6em;
    .disabled {
      opacity: 0.6;
      pointer-events: none;
    }
    .vill-switch {
      p.list {
        display: flex;
        .label {
          display: inline-block;
          vertical-align: middle;
          line-height: 3em;
          margin-left: 0.5em;
          margin-right: 2.5em;
        }
      }
    }

    .ivu-radio-group-item {
      margin-left: -10em;
    }

    p.btn {
      display: flex;
      justify-content: flex-end;
      span.btn {
        /*width: 8em;*/
        flex: 1;
        margin-left: 1em;
        height: 2.6em;
        line-height: 2.6em;
        margin-top: 1.5em;
        background-color: #adadad;
        transition: all ease-in-out 0.3s;
        &.active, &:hover {
          background-color: $bg-red;
          transition: all ease-in-out 0.3s;
        }
      }
    }

  }

</style>
