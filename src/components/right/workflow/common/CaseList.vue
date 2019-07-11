<template>
  <div class="box">
    <ul>
      <li v-for="(item,index) in caseList" :class="{active:cur_pro_id===item.id}" @click="setCurProType(item,index)" @dblclick="confirmCase(item,index)">
        <p class="title">
          <span class="case-title">{{`交评${index+1}: ${item.name?item.name:'未命名'}`}}</span>
          <span class="case-time">{{item.updatetime}}</span>
        </p>
        <p>
          <span>交评ID: <span>{{item.id}}</span></span>
        </p>
        <div class="empty-copy">
          <div class="empty" v-if="cur_menu.id==='edit'" @click="cleanTrafficItem(item,index)">
            <i class="icon iconfont icon-clear"></i>
            <span>清空</span>
          </div>
          <div class="copy-project" v-if="cur_menu.id==='edit'" @click="setCopyItemShow(item,index)">
            <i class="icon iconfont icon-fuzhi"></i>
            <span>复制</span>
            <div class="qwdsada" v-if="index===0 && toPlanA && caseList.length>=2">至项目2</div>
            <div class="qwdsada" v-if="index===0 && toPlanA && caseList.length>=3">至项目3</div>
            <div class="qwdsada" v-if="index===1 && toPlanB">至项目1</div>
            <div class="qwdsada" v-if="index===1 && toPlanB && caseList.length>=3">至项目3</div>
            <div class="qwdsada" v-if="index===2 && toPlanC">至项目1</div>
            <div class="qwdsada" v-if="index===2 && toPlanC">至项目2</div>
          </div>
        </div>

        <p>
          <span>交评类型: <span>{{setProType(item.type)}}</span></span>
        </p>

        <p class="mid">
          <span>用地开发地块: <span>{{item.landnum?item.landnum+"个":"-"}}</span></span>
          <span>总面积: <span>{{item.landarea?(item.landarea/1000000).toFixed(2):"-"}}km<sup>2</sup></span></span>
          <!--<span>总面积: <span>{{item.landarea?(item.landarea/1000000).toFixed(2)+"平方公里":"-"}}</span></span>-->
        </p>
        <p class="mid">
          <span>新改建道路: <span>{{item.roadnum?item.roadnum+"条":"-"}}</span></span>
          <span>总里程: <span>{{item.roadlength?item.roadlength.toFixed(1)+"km":"-"}}</span></span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../../util/event-bus'
  import MYCONF from '../../../../myconf'
  import env from '../../../../common/env'

  export default {
    name: 'CaseList',
    data() {
      return {
        activeIndex:null,
        copyItemShow: false,
        toPlanA: false,
        toPlanB: false,
        toPlanC: false,
        // isLoading: false,
      }
    },
    props: {
      caseList:{
        type:Array
      },
      type:{
        type:String
      },
    },
    computed: {
      ...mapGetters(['cur_pro_id','cur_menu']),

    },
    mounted() {
      this.$nextTick(() => {
        this.updateCurProId(null);
         this.updateCurProject({});
      })
    },
    methods: {
      ...mapMutations(['updateCurProject','updateCurProId']),
      setCurProType(item,index){
          if(this.cur_pro_id === item.id && this.type==="new"){
            this.updateCurProId(null);
            this.updateCurProject({});
          }else{
            this.updateCurProId(item.id);
            this.updateCurProject(item);
          }
      },
      setProType(type){
        return type==='1539844499318'?'用地与道路规划综合交评':type==='1539844431883'?'用地规划交评':type==='1539844475968'?'用道路规划交评':'-'
      },
      cleanTrafficItem(item, index){
        this.$Modal.confirm({
          title: '确认提醒',
          content: '<p>清空交评，<br/>将删除当前交评项目下<span class="bold">所有设置内容<span/>，<span class="bold">且不可恢复！<span/></p>' +
          '<p>是否确认清空？</p>',
          okText: '清空',
          cancelText: '取消',
          closable:true,
          onOk:() => {
            const loadFlaf = this.$Message.loading({
              content:'正在清空项目，请稍等...',
              duration:0
            });
            let url = MYCONF.service.saveProject + `token=${sessionStorage.getItem("token")}&editType=replace`;
            this.$http.post(url,{
              id:item.id,
              type: item.type,
              name:item.name,
            }).then(res=>{
              if(res.body.success){
                setTimeout(loadFlaf,20);
              }
              // if (this.copySuccess) this.copySuccess();
              this.$parent.getProjectList();
              this.isLoading = false;
            }).catch(err=>{
              console.log(err)
            })
          }
        });
      },
      setCopyItemShow(item, index){
        let _this = this;
        if (index===0) this.toPlanA = !this.toPlanA;
        if (index===1) this.toPlanB = !this.toPlanB;
        if (index===2) this.toPlanC = !this.toPlanC;
        if (this.copyItemShow) {
          let nProjectid = window.event.target.innerHTML==='至项目1'?this.caseList[0].id:
            window.event.target.innerHTML==='至项目2'?this.caseList[1].id :
              window.event.target.innerHTML==='至项目3'?this.caseList[2].id : '';
          let oProjectid = item.id;
          if (oProjectid && nProjectid){
            this.$Modal.confirm({
              title: '确认提醒',
              content: '<p>复制交评，<br/>将替换当前交评项目下<span class="bold">所有设置内容<span/>，<span class="bold">且不可恢复！<span/></p>' +
              '<p>是否确认复制？</p>',
              okText: '复制',
              cancelText: '取消',
              closable:true,
              onOk:() => {
                const loadFlaf = _this.$Message.loading({
                  content:'正在复制项目，请稍等...',
                  duration:0
                });
                let url = MYCONF.service.copyProject + `oProjectid=${oProjectid}&nProjectid=${nProjectid}&token=${sessionStorage.getItem("token")}`;
                this.$http.get(url).then(res=>{
                  if(res.body.success){
                    setTimeout(loadFlaf,20);
                    _this.$Message.success({
                      content:  '项目复制成功',
                      closable: true,
                      duration:3
                    });
                  }
                  // if (this.copySuccess) this.copySuccess();
                  this.$parent.getProjectList()
                },err => {
                  setTimeout(loadFlaf,20);
                  _this.$Message.warning({
                    content:  '项目复制失败，请重试',
                    closable: true,
                    duration:3
                  });
                }).catch(err=>{
                  console.log(err)
                })
              }
            })
          }
        }
        this.copyItemShow = !this.copyItemShow;
      },
      confirmCase(item,index){
        this.updateCurProId(item.id);
        this.updateCurProject(item);
        eventBus.$emit("confirmCase");
      }
    },
    watch: {

    },
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";

  .box{
    ul{
      li{
        line-height: 2.2rem;
        border: 0.1rem solid $bg-case;
        background-color: $bg-case;
        padding: 1rem;
        text-align: left;
        margin: 1rem 2rem;
        cursor: pointer;
        &.active{
          border: 0.1rem solid #fff;
          background-color: $item-active;
        }
        p{
          span{
            span{
              color: $highlight;
            }
          }
          &.title{
            .case-title{
              font-size: 1.2rem;
              font-weight: 600;
              color: $highlight;
            }
            .case-time{
              float: right;
            }
          }
          &.mid{
            white-space: nowrap;
            &>span{
              display: inline-block;
              width: 40%;
            }
          }
          .copyPlan{
            color: $highlight;
            z-index: 1000;
          }
        }

      }
    }

    .empty-copy{
      position: absolute;
      /*left: 18.5em;*/
      /*bottom: 2em;*/
      right: 2.9em;
      height: 0;
      width: 4.5em;
      div{
        width: 4.5em;
        height: 2.3em;
        line-height: 2.3em;
        text-align: center;
        &.empty{
          background-color: #E63D35;
          color: white;
          margin-bottom: 0.9em;

        }
        &.copy-project{
          background-color: #FBE644;
          color: black;
          .qwdsada{
            background-color: #9F8D00;
            color: #FBE644;
          }
          .qwdsada:hover{
            background-color: #E63D35;
          }
        }
      }

    }
  }

</style>
