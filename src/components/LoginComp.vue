<template>
  <div class="box-pre">
    <div class="box">
      <div class="login-bg-pre">
        <div class="login-bg">

        </div>
      </div>
      <div class="right">
        <div class="login">
          <p class="login-logo">
            <img :src="logoSrc" alt="">
          </p>
          <p class="line">
            <i class="icon iconfont icon-user"></i>
            <input type="text" class="input name" v-model="userName" spellcheck="false" autocomplete="new-password" disableautocomplete @keyup.enter="loginPt">
            <!--<input type="text" class="input name" v-model="userName" spellcheck="false" autocomplete="off" disableautocomplete @keyup.enter="loginPt">-->
          </p>
          <p class="line">
            <i class="icon iconfont icon-pwd"></i>
            <input type="password" class="input pwd" v-model="userPwd" autocomplete="new-password" disableautocomplete @keyup.enter="loginPt">
            <!--<input type="password" class="input pwd" v-model="userPwd" autocomplete="off" disableautocomplete @keyup.enter="loginPt">-->
          </p>
          <p class="label">
            <input type="checkbox" value="0" id="checkbox1" name="" :checked="userSaved" v-model="userSaved"/>
            <label for="checkbox1"></label>
            <span @click="setLoginSaved">记住登录信息</span>
          </p>
          <p>
            <span @click="loginPt" class="btn">登 录</span>
          </p>
          <p class="tip">
            <i class="icon iconfont icon-warn-tip"></i>
            <span>遇到问题或需要注册请联系莆田自然资源局</span>
          </p>
        </div>

        <p class="copy-right">
          <span>V1.0</span><br>
          <span>&copy; 2018  中国城市规划设计研究院  关于</span>
          <!--<span>&copy; 2018  北京世纪高通科技有限公司  关于</span>-->
        </p>
      </div>

    </div>
  </div>

</template>

<script>

  import MYCONF from '../myconf'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: "LoginComp",
    data() {
      return {
        userName: '',
        userPwd: '',
        token: '',
        userSaved:true,
        logoSrc: './static/images/login/login-logo.png',
        // logoSrc: './static/images/inner/logo.png',
      }
    },
    mounted(){
      this.$nextTick(() => {
        let isSaved = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")).saved:this.userSaved;
        this.userSaved = isSaved;
        if(isSaved && sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user")).userid){
          this.userName = JSON.parse(sessionStorage.getItem("user")).username;
          this.userPwd = JSON.parse(sessionStorage.getItem("user")).password;
        }else{
           this.userName = '';//admin
           this.userPwd = '';//admin@cennavi
          /*this.userName = 'Cennavi-Test1';
          this.userPwd = 'Cennavi-Test1';*/
          /*this.userName = 'limei';
          this.userPwd = '123456';*/
          // this.userName = 'qiaoao';
          // this.userPwd = '123456';
        }
      });
    },
    computed: {
      ...mapGetters(['loading_tip']),
    },
    methods: {
      ...mapMutations(['updateCurRoute','updateLoadingTip']),
      setLoginSaved(){
        this.userSaved = !this.userSaved;
      },
      loginPt() {
        if (!this.userName && !this.userPwd) {
          this.$Message.warning({
            content: '请完整填写用户名密码',
            closable: true
          });
        } else {
          let _this = this;
          if(!_this.loading_tip){
            let loadingTip = this.$Message.loading({
              content:'正在进行跳转页面配置，请稍等...',
              duration:0
            });
            this.updateLoadingTip(loadingTip);
          }
          this.$http.post(MYCONF.service.login, {
              username: this.userName,
              password: this.userPwd
            },
            {
              emulateJSON: true,
            })
            .then(response => {
              response = response.body;
              if (response && response.success) {
                sessionStorage.setItem("token", response.result.token);
                sessionStorage.setItem("user", JSON.stringify({        //存入用户信息，storage只能存字符串
                  userid: response.result.userid,
                  username: response.result.username,
                  realname: response.result.realname,
                  password: response.result.password,
                  saved:_this.userSaved
                }));
                this.updateCurRoute("workbench");
                this.$router.push({path: '/workbench'});
              } else {
                this.$Message.warning({
                  content: '登录失败，请确认用户名和密码！',
                  closable: true,
                  duration:3
                });
                setTimeout(_this.loading_tip,20);
                _this.updateLoadingTip(null);
              }
            },(res)=>{
              _this.$Message.warning({
                content: '登录失败，请确认用户名和密码！',
                closable: true,
                duration:3
              });
              setTimeout(_this.loading_tip,20);
              _this.updateLoadingTip(null);
            });
        }
      }
    },
    watch:{
    }
  }

</script>

<style scoped lang="scss">
  @import "../common/common.scss";
  .box-pre{
    width: 100vw;
    height: 100vh;
    display: flex;
    /*background: #2c2618 url("../../static/images/login/bg-pre.jpg") no-repeat center;*/
    background-size: cover;
    .box{
      flex: 1;
      display: flex;
      color: #fff;
      font-size: $font-normal;
      /*background: #2c2618 url("../../static/images/login/bg.jpg") no-repeat center;*/
      background-size: cover;
      .login-bg-pre{
        flex: 1;
        background: #2c2618 url("../../static/images/login/login-bg.jpg") no-repeat center;
        background-size: cover;
        .login-bg{
          width: 100%;
          height: 100%;
          background: url("../../static/images/login/login-bg.png") no-repeat center;
          background-size: cover;
        }
      }
      .right{
        width: 43em;
        position: relative;
        background-color: #5c1815;
        /*background: transparent;*/
        .login{
          width: 34em;
          height: 30em;
          /*height: 28em;*/
          padding: 5em 4em;
          position: absolute;
          top: calc(50vh - 17em);
          right: 24em;
          z-index: 100;
          background: rgba(0,0,0,0.85);
          /*background: rgba(0,0,0,0.55);*/
          p{
            text-align: left;
            &.login-logo{
              img{
                width: 22em;
                /*width: 24em;*/
              }
            }
            &.line{
              height: 4em;
              line-height: 5.4em;
              border-bottom: 1px solid rgba(255,255,255,0.5);
              .icon{
                color:#E63D35;
                margin-right: 0.6em;
                font-size: 1.5rem;
              }
            }
            .input{
              width: auto;
              border: none;
              background-color: transparent;
              color: #fff;
              outline: none;
              -webkit-text-fill-color: #ffffff;
              caret-color: #fff; /* 光标颜色 */
            }
            /*-webkit-box-shadow: 0 0 0px 1000px transparent inset;*/
            input:focus { outline: none; }
            input:-webkit-autofill {
              transition: background-color 5000s ease-in-out 0s; }
            &.label{
              line-height: 4.6em;
              position: relative;
              input[type=checkbox] {
                visibility: hidden;
              }
              label {
                cursor: pointer;
                position: absolute;
                width: 1.3em;
                height: 1.3em;
                top: 1.6em;
                left: 0;
                background: transparent;
                border: 1px solid #E63D35;
                border-radius: 3px;           /* W3C syntax */
              }
              label:after {
                opacity: 0;
                content: '';
                position: absolute;
                width: 9px;
                height: 5px;
                background: transparent;
                top: 0.25em;
                left: 0.2em;
                border: 2px solid #E63D35;
                border-top: none;
                border-right: none;
                -webkit-transform: rotate(-45deg);
                transform: rotate(-45deg);
              }
              label:hover::after {
                opacity: 0.5;
              }
              input[type=checkbox]:checked + label:after {
                opacity: 1;
              }
              span{
                line-height: 4em;
                margin-left: 0.8em;
                letter-spacing: 0.08em;
                cursor: pointer;
              }
            }
            &.tip{
              opacity: 0.4;
              font-size: 0.9rem;
              line-height: 4em;
              .icon-warn-tip{
                color: #ccc;
                font-size: 0.9em;
              }
            }
            .btn{
              background-color: #E63D35;
              display: block;
              width: 100%;
              text-align: center;
              height: 2em;
              line-height: 2em;
              cursor: pointer;
            }
          }
        }
        .copy-right{
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          position: fixed;
          bottom: 1em;
          right: 2em;
          text-align: right;
        }
      }
    }
  }

</style>
