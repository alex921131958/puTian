<template>
  <div class="box">
    <p class="title">道路基础属性</p>
    <p class="list large">
      <span>道路名称</span>
      <input type="text" v-model="tempLinkObj.name">
    </p>

    <p class="list">
      <span>道路类型</span>
      <i-select v-model="tempLinkObj.linkType" style="width:7.8rem;" @on-change="setCurLinkType" class="panel">
        <i-option v-for="item in linkTypeList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </p>

    <p class="list">
      <span>道路等级</span>
      <i-select v-model="tempLinkObj.linkLevel" style="width:10em;" @on-change="setCurLinkLevel" class="panel">
        <i-option v-for="item in areaLevelList" :value="item.value" :key="item.value">{{ item.label}}</i-option>
      </i-select>
    </p>
    <p class="list">
      <span>道路长度</span>
      <span>{{parseFloat(tempLinkObj.linkLen).toFixed(1)}}m
        <span class="auto" @click="autoRoadLength">Auto</span>
      </span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'
  import FLOWCONF from '../../flowConf'
  import dictionariesHandler  from '../../../../service/workflow/dictionariesHandler'
  import MYCONF from '../../../../myconf'

  export default {
    name: "LinkBaseAttr",
    data() {
      return {
        tempLinkObj: FLOWCONF.LINK_ATTRIBUTE,
        linkTypeList: FLOWCONF.LINK_TYPE_LIST,
        areaLevelList: FLOWCONF.AREA_LEVEL_LIST,
      }
    },
    mounted() {
      let _this = this;
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     _this.tempLinkObj = Object.assign({}, _this.linkObj)
      //   },150);
      // })
    },

    props: {
      linkObj: {
        type: Object
      }
    },
    computed: {
      ...mapGetters(['cur_step','curLinePool']),
      linkName() {
        return this.tempLinkObj.name
      }
    },
    components: {
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateCurStep']),
      setCurLinkType(data) {
        this.$emit('setCurLinkType',data);
      },
      setCurLinkLevel(data) {
        this.$emit('setCurLinkLevel',data);
      },
      autoRoadLength(){
        let _this = this;
        let url = MYCONF.service.editLinePanelLength;
        let projectId = this.cur_pro_id;
        if (this.curLinePool._latlngs) {
          let postData = {
            linkPointList: JSON.parse(JSON.stringify(this.curLinePool._latlngs, ['lat','lng']))
          };
          this.$http.post(url+`?projectid=${projectId}&token=${sessionStorage.getItem('token')}`,postData,{
            'header': {
              'Content-Type': "application/json"
            }
          }).then((res)=>{
            _this.tempLinkObj.linkLen = res.body.result
          }).catch(err=>{
            console.log(err)
          })
        }
      }
    },
    watch: {
      linkObj(newVal){
        this.tempLinkObj = newVal
      },
      linkName(newVal){
        this.$emit('setCurLinkName',newVal);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .box {
    padding: 1.5rem 1rem;
    .title {
      color: $highlight;
      font-weight: 600;
      margin-bottom: 0.5rem;
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
      }
    }
  }
  @media(max-width: 1399px){
    .box {
      padding: 1.5rem 1rem 1.5rem 0.5rem;
    }
  }
</style>
