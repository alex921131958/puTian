<template>
  <div id="left">
    <EasyScrollbar :barOption="listBar" :class="fixSty">
      <!--<div class="scroll-inner">-->
      <div class="listBox" ref="panelH">
        <div ref="innerH">
          <draggable class="list-group" tag="ul" v-model="menuList" v-bind="dragOptions" @start="isDragging=true" :class="fixSty">
            <transition-group type="transition">
              <li class="single" key="single">
                <span class="text">单图层模式</span>
                <span class="switch"><SwitchComp v-model="isSingleLayer" @on-change="updateSingleLayer(isSingleLayer)"/></span>
              </li>
              <li class="list-group-item" v-for="element in menuList" :key="element.order"
                  :style="{backgroundColor: element.color}">
                <p>
                  <SwitchTip :switchBg="element.color" :isFixed="element.fixed" @switchToggle="switchToggle(element)"/>
                  <!--<i :class="element.fixed? 'icon iconfont icon-del' : 'icon iconfont icon-add'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>-->
                  <span class="name">{{element.name}}</span>
                  <i :class="['icon iconfont icon-drag',element.fixed?'':'ele-drag']"></i>
                </p>

                <MenuPanel :dataList="element.menuList" :panelBg="element.panel" :switchBg="element.color"
                           :isFixed="element.fixed" :menuOrder="element.order" @updateItemList="updateItemList"/>
              </li>
            </transition-group>
          </draggable>
        </div>

        <div :class="['flow-btn',fixSty]" @click="setPopTog">
          <i class="icon iconfont icon-car"></i>
          <span>交通影响评价</span>
          <span>工作流</span>
          <i class="icon iconfont icon-right"></i>
        </div>
      </div>
      <!--</div>-->
    </EasyScrollbar>

    <ul class="traffic-pop" v-if="isPopShow">
      <li v-for="item in popList" @click="togToTraffic(item)">
        <i :class="['icon','iconfont',`icon-${item.id}`]"></i>
        <span>{{item.name}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import MYCONF from '../../myconf'
  import {mapGetters, mapMutations} from 'vuex'
  import draggable from 'vuedraggable'
  import MenuPanel from './sub/MenuPanel'
  import SwitchTip from '../common/SwitchTip'

  export default {
    name: "LeftComponent",
    data() {
      return {
        editable: true,
        isDragging: false,
        delayedDragging: false,
        // menuList: MYCONF.MENU_LIST,
        menuList: [],
        fullHeight: document.documentElement.clientHeight,
        fixSty: 'normal',
        isPopShow:false,
        isSingleLayer:true,    //是否单图层模式
        listBar: {
          barColor: "#344757",   //滚动条颜色
          barWidth: 2,           //滚动条宽度
          railColor: "#405569",     //导轨颜色
          barMarginRight: 0,     //垂直滚动条距离整个容器右侧距离单位（px）
          barMaginBottom: 0,     //水平滚动条距离底部距离单位（px)
          barOpacityMin: 0.2,      //滚动条非激活状态下的透明度
          zIndex: "auto",        //滚动条z-Index
          autohidemode: false,     //自动隐藏模式
          horizrailenabled: false,//是否显示水平滚动条
        },
        popList:[
          {
            id:'new',
            name:'新建交评项目'
          },
          {
            id:'edit',
            name:'打开/编辑交评项目'
          },
          {
            id:'case',
            name:'交评方案比选'
          },
          {
            id:'report',
            name:'交评简报生成'
          }
        ]
      }
    },
    mounted() {
      const that = this;
      this.getMenuList();
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight;
          that.fullHeight = window.fullHeight;
        })()
      }
      this.$nextTick(() => {
        setTimeout(() => {
          that.fixSty = that.$refs['panelH'].offsetHeight >= that.$refs['innerH'].offsetHeight + 50 ? 'fixSty' : 'normal';
        },600);
      });
    },

    computed: {
      ...mapGetters(['menu_list','single_layer']),
      dragOptions() {
        return {
          animation: 0,
          group: 'description',
          // disabled: !this.editable,
          ghostClass: 'ghost',
          handle: '.ele-drag',
          fixSty: 'normal',
        };
      },
    },
    components: {
      draggable,
      MenuPanel,
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateMenuList','updateTimeFollow','updateVilFollow','updateCurMenu','updatePreMenu','updateCurRoute','updateSingleLayer']),
      switchToggle(element) {
        this.$set(element, 'fixed', !element.fixed);
        this.updateMenuList(this.menuList);
      },
      updateItemList(obj) {
        this.$set(this.menuList[obj.order - 1], 'menuList', obj.list);
        this.updateMenuList(this.menuList);
      },
      getMenuList() {
        let _this = this;
        let url = MYCONF.service.menuList + sessionStorage.getItem("token");
        this.$http.get(url).then(response => {
          response = response.body;
          if (response){
            response.map((item) => {
              item.fixed = item.fixed === '0' ? false :item.fixed === '1' ? true : null;
              item.menuList.map((menu) => {
                menu.active = menu.active === '0' ? false : menu.active === '1' ? true : null;
                menu.globaltime = menu.globaltime === '0' ? false : menu.globaltime === '1' ? true : null;
                menu.globalvil = menu.globalvil === '0' ? false : menu.globalvil === '1' ? true : null;
              })
            });
            _this.menuList = response;
            _this.updateMenuList(response);
            _this.getGlobalTimeFun();
            _this.getGlobalVilFun();
          }
        })

      },
      getGlobalTimeFun() {
        let _this = this;
        let url_time = MYCONF.service.globalFollowed + 'timefollow&token=' + sessionStorage.getItem("token");
        this.$http.get(url_time).then(response => {
          response = response.body;
          if(response && response.result && response.result.length>0){
            response.result.map((item) => {
              if(item.value === '1'){
                _this.updateTimeFollow({
                  id:item.menuid,
                  globaltime:true
                });
              }
            })
          }
        });
      },
      getGlobalVilFun() {
        let _this = this;
        let url_vil = MYCONF.service.globalFollowed + 'vilfollow&token=' + sessionStorage.getItem("token");
        this.$http.get(url_vil).then(response => {
          response = response.body;
          if(response && response.result && response.result.length>0){
            response.result.map((item) => {
              if(item.value === '1'){
                _this.updateVilFollow({
                  id:item.menuid,
                  globalvil:true
                });
              }
            })
          }
        });
      },
      setPopTog(){
        this.isPopShow = !this.isPopShow;
      },
      togToTraffic(item){
        if(item.id==='case'&&item.name==='交评方案比选'){
          let url = MYCONF.service.findProject + `token=${sessionStorage.getItem("token")}&limit=3`;
          this.$http.get(url).then((res) => {
            res = res.body;
            if (res.result.length<2){
              this.$Message.warning({
                content: '请设置至少两个交评项目进行比选',
                duration: 2,
                closable: true
              })
            }else{
              this.$router.push({path: '/workflow'});
              this.updateCurRoute('workflow');
              this.isPopShow = false;
              this.updateCurMenu(item);
              sessionStorage.setItem("workflowType", item.id);
            }
          });
        }else{
          this.isPopShow = false;
          this.updateCurMenu(item);
          sessionStorage.setItem("workflowType", item.id);
        }
      }
    },
    watch: {
      isDragging(newVal) {
        if (newVal) {
          this.delayedDragging = true;
          return;
        }
        this.$nextTick(() => {
          this.delayedDragging = false;
        })
      },
      fullHeight(val) {
        if (!this.timer) {
          this.fullHeight = val;
          this.timer = true;
          let that = this;
          setTimeout(function () {
            that.timer = false;
            that.fixSty = that.$refs['panelH'].offsetHeight >= that.$refs['innerH'].offsetHeight + 50 ? 'fixSty' : 'normal';
          }, 200)
        }
      },
      single_layer(val){
        if(val){
          this.$Message.warning({
            content: '单图层模式开启，只保留当前模块地图渲染图层！',
            duration:3,
            closable: true
          });
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../../common/common.scss";

  #left {
    flex: 0 0 18em;
    background-color: $bg-panel;
    color: #fff;
    overflow-x: hidden;
    display: flex;
    .scroll-inner {
      /*overflow-y: auto;*/
    }
    .listBox {
      height: calc(100vh - 4em);
      width: 18em;
    }
    .list-group {
      &.fixSty{
        margin-bottom: 3em;
      }
      .single{
        line-height: 2.6em;
        display: flex;
        justify-content: space-between;
        span{
          &.text{
            margin-left: 0.6em;
          }
          &.switch{
            margin-right: 0.6em;
          }
        }
      }
      .list-group-item {
        p {
          display: flex;
          line-height: 2.8em;
          .ele-drag {
            cursor: move;
          }
          .name {
            flex: 1;
            text-align: left;
            margin-left: 0.6rem;
            font-weight: 600;
          }
          .icon-drag {
            width: 2.5em
          }
        }
      }
    }

    .flow-btn {
      /*background-color: $bg-red;*/
      background-color: #FBE644;
      width: 18em;
      height: 3em;
      line-height: 3em;
      text-align: center;
      bottom: 0;
      &.fixSty {
        position: fixed;
      }
      /*margin-top: 2em;*/
      /*display: flex;*/
      cursor: pointer;
      .icon-car {
        display: inline-block;
        float: left;
        width: 2.2em;
        /*background-color: #b7302a;*/
        background-color: #C8B736;
        color: #333;
        font-size: 1.1em;
      }
      .icon-right{
        color: #333;
        float: right;
        margin-right: 0.5em;
      }
      span {
        color: #333;
        font-weight: 600;
        letter-spacing: 1px;
        font-size: 1em;
      }
    }

    .traffic-pop{
      position: absolute;
      left: 18em;
      bottom: 1px;
      z-index: 1000;
      background-color: #FBE644;
      border:1px solid #999;
      padding: 0.3em 0;
      li{
        text-align: left;
        line-height: 2rem;
        padding-right: 0.8em;
        cursor: pointer;
        .icon {
          color: #333;
          display: inline-block;
          width: 2em;
          text-align: center;
          font-size: 1em;
        }
        span{
          color: #333;
        }
        &:hover{
          background-color: #E0CD3C;
        }
      }
    }
  }

  @media(max-width: 1399px){
    #left {
      flex: 0 0 16.5em;
      background-color: $bg-panel;
      color: #fff;
      overflow-x: hidden;
      .listBox {
        width: 16.5em;
      }
      .traffic-pop{
        left:16.5em;
      }
      .flow-btn{
        width: 16.5em;
      }
    }
  }

</style>
