<template>
  <div id="left">
    <div class="title">
      <i class="icon iconfont icon-case"></i>
      <span>&nbsp;比选方案选择</span>
    </div>
    <div class="tip">
      <i class="icon iconfont icon-warn"></i>
      <p>各类指标均使用<br/>比选方案2-比选方案1结果生成。</p>
    </div>
    <CompareItem :title="'比选方案1'" :caseItem="caseList"></CompareItem>
    <CompareItem :title="'比选方案2'" :caseItem="caseList"></CompareItem>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import eventBus from '../../../util/event-bus'
  import CompareItem from './sub/CompareItem'
  import MYCONF from '../../../myconf'
  import compareHandler from '../../../service/workflow/compareHandler'

  export default{
    name:'CompareProject',
    data(){
      return{
        caseList:[{
          name:"",
          id:"21548",
          time:"2018-09-26 16:35:22",
          type:"用地交评",
          landNum:null,   //用地开发地块
          landArea:5.4,   //用地面积
          newRoad:null,  //新改建道路
          roadLen:null,  //总里程
        }],
        tempObj:{
          landNum:0,
          landArea:0,
          newRoadnum:0,
          newRoadlength:0,
          reconstructionNum:0,
          reconstructionLength:0,
        },
      }
    },
    components: {
      CompareItem,
    },
    mounted(){
      this.getProjectList();
    },
    computed: {
      ...mapGetters([]),
    },
    methods:{
      ...mapMutations(['updatePlanA','updatePlanB','updatePlanC','updateComparePlan']),
      getProjectList(){
        let project_1 = JSON.parse(JSON.stringify(this.tempObj)),
          project_2 = JSON.parse(JSON.stringify(this.tempObj)),
          project_3 = JSON.parse(JSON.stringify(this.tempObj));
        let projectidArr = [];
        let url = MYCONF.service.findProject + `token=${sessionStorage.getItem("token")}&limit=3`;
        this.$http.get(url).then((res) => {
          res = res.body;
          if(res.result){
            this.caseList = res.result;
            this.caseList.map((item,index)=>{
              projectidArr.push(item.id);
              if (index===0) project_1.landArea = item.landarea;
              if (index===1) project_2.landArea = item.landarea;
              if (index===2) project_3.landArea = item.landarea;
            })
          }
        }).then((res)=>{
          projectidArr.map((item, index)=>{
            this.$http.get(MYCONF.service.roadConfim + `token=${sessionStorage.getItem("token")}&projectid=${item}`).then((res)=>{
              res = res.body.result;
              if (index===0){
                project_1.landNum = res.land_count;
                project_1.newRoadnum = res.road_new_count;
                project_1.newRoadlength = (res.road_new_predict_length + res.road_new_unpredict_length).toFixed(1);
                project_1.reconstructionNum = res.road_edited_count;
                project_1.reconstructionLength = (res.road_edited_predict_length + res.road_edited_unpredict_length).toFixed(1);
              }
              if (index===1){
                project_2.landNum = res.land_count;
                project_2.newRoadnum = res.road_new_count;
                project_2.newRoadlength = (res.road_new_predict_length + res.road_new_unpredict_length).toFixed(1);
                project_2.reconstructionNum = res.road_edited_count;
                project_2.reconstructionLength = (res.road_edited_predict_length + res.road_edited_unpredict_length).toFixed(1);
              }
              if (index===2){
                project_3.landNum = res.land_count;
                project_3.newRoadnum = res.road_new_count;
                project_3.newRoadlength = (res.road_new_predict_length + res.road_new_unpredict_length).toFixed(1);
                project_3.reconstructionNum = res.road_edited_count;
                project_3.reconstructionLength = (res.road_edited_predict_length + res.road_edited_unpredict_length).toFixed(1);
              }
            }).then(()=>{
              this.updatePlanA(project_1);
              this.updatePlanB(project_2);
              this.updatePlanC(project_3);
              let compareObj = compareHandler.compareProject(project_1, project_2);
              this.updateComparePlan(compareObj);
              eventBus.$emit('constructorCompare')
            })
          })
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../common/common";
  #left{
    flex: 0 0 18em;
    background-color: $panel-black;
    overflow-x: hidden;
    text-align: left;
    .title{
      height: 2.5em;
      background: $highlight;
      display: flex;
      i{
        margin-left: 3.5em;
        margin-top: 0.5em;
      }
      span{
        font-size: 1.1em;
        /*text-align: center;*/
        line-height: 2.5em;
      }
    }
    .tip{
      height: 4em;
      background-color: $panel-gray;
      display: flex;
      i{
        margin-left: 0.8em;
        margin-top: 0.5em;
      }
      .iconfont {
        color: $highlight;
      }
      p{
        font-size: 1em;
        color: $highlight;
        margin-left: 0.5em;
        margin-top: 0.7em;
      }
    }
  }

  @media(max-width: 1399px){
    #left {
      flex: 0 0 17.5em;

    }
  }
</style>
