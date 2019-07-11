<template>
  <div class="compare-item">
    <p class="title">
      <span>{{title}}</span>
      <i-select v-model="curProject" style="width:7em" v-if="title==='比选方案1'">
        <i-option v-for="item in projectItem" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>

      <i-select v-model="curProjectTwo" style="width:7em" v-if="title==='比选方案2'">
        <i-option v-for="item in projectItem" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </p>
    <p class="project-title">
      <span>{{projectOption.name?projectOption.name:'未命名交评'}}</span>
    </p>
    <p>
      <span>用地开发地块:</span>
      <span class="highlight">{{projectOption.landnum?projectOption.landnum:0}}个</span>
      <span class="highlight">{{projectOption.landarea?(projectOption.landarea/1000000).toFixed(1):0}} km<sup>2</sup></span>
    </p>
    <p>
      <span>新改建道路:&nbsp;&nbsp;&nbsp; </span>
      <span class="highlight">{{projectOption.roadnum?projectOption.roadnum:0}}条</span>
      <span class="highlight">{{projectOption.roadlength?projectOption.roadlength.toFixed(1):0}} km</span>
    </p>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import SwitchTip from '../../common/SwitchTip'
  import MYCONF from '../../../../myconf'
  import eventBus from '../../../../util/event-bus'
  import compareHandler from '../../../../service/workflow/compareHandler'

  export default {
    name: "CompareItem",
    data() {
      return {
        projectItem:[
          {
            value: '项目1',
            label: '项目1'
          },{
            value: '项目2',
            label: '项目2'
          },{
            value: '项目3',
            label: '项目3'
          }
        ],
        curProject:'项目1',
        curProjectTwo:'项目2',
        projectTitle:'未命名交评',
        projectOption:{
          name:"未命名交评",
          id:"21548",
          time:"2018-09-26 16:35:22",
          type:"用地交评",
          landnum:0,   //用地开发地块
          landarea:0,   //用地面积
          roadnum:0,  //新改建道路
          roadlength:0,  //总里程
        },
        caseList:[],
      }
    },
    mounted() {
      this.setInitialValue();
    },
    props: {
      title: {
        type: String
      },
      caseItem:{
        type: Array
      },
    },
    computed: {
      ...mapGetters(['cur_step','planA','planB','planC','project1','project2','comparePlan1_id','comparePlan2_id']),
    },
    components: {
      SwitchTip,
    },
    methods: {
      ...mapMutations(['updateCurStep','updateComparePlan','updateProject1','updateProject2','updateComparePlan1_id','updateComparePlan2_id']),
      setInitialValue(){
        let url = MYCONF.service.findProject + `token=${sessionStorage.getItem("token")}&limit=3`;
        this.$http.get(url).then((res) => {
          res = res.body;
          if(res.result){
            this.caseList = res.result;
            this.projectOption = this.title === '比选方案1'?this.caseList[0]:this.caseList[1];
            this.updateComparePlan1_id(this.caseList[0].id);
            this.updateComparePlan2_id(this.caseList[1].id);
          }
        });
      },
      changeProject(val){
        this.projectOption = val==='项目1'? this.caseList[0] : val==='项目2'? this.caseList[1] : this.caseList[2];
        let projectId = val==='项目1'? this.caseList[0].id : val==='项目2'? this.caseList[1].id : this.caseList[2].id;
        let project_1 = this.project1==='项目1'? this.planA : this.project1==='项目2'? this.planB : this.planC;
        let project_2 = this.project2==='项目1'? this.planA : this.project2==='项目2'? this.planB : this.planC;
        this.updateComparePlan(compareHandler.compareProject(project_1, project_2));
        eventBus.$emit('constructorCompare')
      }
    },
    watch: {
      curProject(val){
        this.projectOption = val==='项目1'? this.caseList[0] : val==='项目2'? this.caseList[1] : this.caseList[2];
        let projectId = val==='项目1'? this.caseList[0].id : val==='项目2'? this.caseList[1].id : this.caseList[2].id;
        this.updateProject1(val);
        this.updateComparePlan1_id(projectId);
        let project_1 = this.project1==='项目1'? this.planA : this.project1==='项目2'? this.planB : this.planC;
        let project_2 = this.project2==='项目1'? this.planA : this.project2==='项目2'? this.planB : this.planC;
        this.updateComparePlan(compareHandler.compareProject(project_1, project_2));
        eventBus.$emit('constructorCompare')
      },
      curProjectTwo(val){
        this.projectOption = val==='项目1'? this.caseList[0] : val==='项目2'? this.caseList[1] : this.caseList[2];
        let projectId = val==='项目1'? this.caseList[0].id : val==='项目2'? this.caseList[1].id : this.caseList[2].id;
        this.updateProject2(val);
        this.updateComparePlan2_id(projectId);
        let project_1 = this.project1==='项目1'? this.planA : this.project1==='项目2'? this.planB : this.planC;
        let project_2 = this.project2==='项目1'? this.planA : this.project2==='项目2'? this.planB : this.planC;
        this.updateComparePlan(compareHandler.compareProject(project_1, project_2));
        eventBus.$emit('constructorCompare')
      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common";

  .compare-item{
    background-color: $bg-attr;
    margin-top: 0.2em;
    padding: 0.5em;
    color: #fff;
    font-size: 1.05em;
    p{
      margin-bottom: 0.2em;
      .highlight{
        color: $highlight;
      }
    }
    .title{
      display: flex;
      justify-content: space-between;
      line-height: 2.1em;
      font-weight: bold;
    }
    .project-title{
      color: $highlight;
      font-size: 1.1em;
      font-weight: bold;
    }
  }
</style>
