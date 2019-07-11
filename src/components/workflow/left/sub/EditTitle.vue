<template>
  <div class="title">
    <i class="icon iconfont icon-pen-circle" @click="isEditable=!isEditable"></i>
    <input type="text" :class="[isEditable?'editable':'disabled','input-title']" v-model="tempTitle" :disabled="!isEditable" ref="caseTitle" @keyup.enter="doEdit(true)"/>

    <Tooltip content="确定" theme="light" v-if="isEditable">
      <i class="icon iconfont icon-confirm" @click="doEdit(true)"></i>
    </Tooltip>
    <Tooltip content="取消" theme="light" v-if="isEditable">
      <i class="icon iconfont icon-return" @click="doEdit(false)"></i>
    </Tooltip>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "EditTitle",
    data() {
      return {
        tempTitle:'-',
        isEditable:false,      //标题是否可编辑状态
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.tempTitle = this.caseTitle;
        },100);
      })
    },
    props:{
      caseTitle:{
        type:String
      }
    },
    directives: {
      focus: {
        inserted (el,{value}) {
          if(value){
            el.focus()
          }
        }
      }
    },
    computed: {
      ...mapGetters(['menu_list']),
    },
    components: {},
    methods: {
      ...mapMutations([]),
      doEdit(bool){
        if(bool){
          this.$emit("changeTitle",this.tempTitle);
        }else{
          this.tempTitle = this.caseTitle;
        }
        this.isEditable = false;
      }
    },
    watch: {
      isEditable(val){
        if(val){
          let _this = this;
          setTimeout(() => {
            this.$refs['caseTitle'].focus();
          },200);
        }
      },
      caseTitle(val){
        if(val){
          this.tempTitle = this.caseTitle;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../common/common.scss";
  .title{
    text-align: left;
    line-height: 2rem;
    padding: 0.6rem 0;
    .icon{
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      &.icon-pen-circle{
        margin-left: 0.5rem;
        margin-right: 0.2rem;
        &:hover{
          color: #eee;
        }
      }
      &.icon-confirm{
        font-size: 1.5em;
        color: $bg-green;
        &:hover{
        transform: scale(1.1);
      }
        &:hover{
          color: $bg-green;
        }
      }
      &.icon-return{
        font-size: 1.5em;
        color: $bg-red;
        &:hover{
        transform: scale(1.1);
      }
        &:hover{
          color: $bg-red;
        }
      }
    }
    .input-title{
      background-color: transparent;
      color: $highlight;
      font-size: 1.2rem;
      width: 9em;
      height: 2.2rem;
      line-height: 2.2rem;
      padding: 0 0.3rem;
      &.disabled{
        border: none;
        border-bottom: 1px solid transparent;
        /*outline: none;*/
      }
      &.editable{
        border:none;
        border-bottom: 1px solid #666;
      }
    }
  }

  @media(max-width: 1366px){
    .title{
      .input-title{
        background-color: transparent;
        color: $highlight;
        font-size: 1.1em;
        width: 8.2em;
      }
    }
  }
</style>
