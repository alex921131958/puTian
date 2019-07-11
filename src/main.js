// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import EasyScroll from 'easyscroll';

// import iView from 'iview';
import 'iview/dist/styles/iview.css';
import '../static/css/index.scss';
import {
  Checkbox,
  CheckboxGroup,
  Slider,
  InputNumber,
  ColorPicker,
  ButtonGroup,
  Button,
  Switch,
  RadioGroup,
  Radio,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message,
  Select,
  Option,
  OptionGroup,
  Table,
  Icon,
  Tooltip,
  Modal
} from 'iview';   //iView按需引用
Vue.component('ChkGroupComp', CheckboxGroup);
Vue.component('ChkComp', Checkbox);
Vue.component('SliderComp', Slider);
Vue.component('InputNumberComp', InputNumber);
Vue.component('ColorPickerComp', ColorPicker);
Vue.component('SwitchComp', Switch);
Vue.component('RadioGroupComp', RadioGroup);
Vue.component('RadioComp', Radio);
Vue.component('ButtonGroupComp', ButtonGroup);
Vue.component('i-button', Button);
Vue.component('i-dropdown', Dropdown);
Vue.component('i-dropdown-menu', DropdownMenu);
Vue.component('i-dropdown-item', DropdownItem);
Vue.component('i-select', Select);
Vue.component('i-option', Option);
Vue.component('OptionGroup', OptionGroup);
Vue.component('TableComp', Table);
Vue.component('IconComp', Icon);
Vue.component('Tooltip', Tooltip);
Vue.component('Modal', Modal);
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;

Vue.config.productionTip = false;

Vue.use(VueResource);
Vue.use(EasyScroll);

let token = window.sessionStorage.getItem("token");
// Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push(function (request, next) {
  // request.headers.set('token', token); //setting request.headers
  let reqUrl = request.url;
  request.credentials = reqUrl.indexOf("minedata") === -1;  //解决session不一致问题(过滤掉minedata的相关请求)
  //莆田本地
  // request.credentials = (reqUrl.indexOf("minedata") === -1 && reqUrl.indexOf("172.20.80.196") === -1);  //解决session不一致问题(过滤掉minedata的相关请求)
  // request.credentials = true;
  next(function (response) {
    if (response.body.retCode === 'login_003') { //与后台约定登录失效的返回码
      this.$router.push({path: '/login'});
    }
    return response
  })
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});


router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem("token")) {
    this.$router.push({path: '/login'});
  } else {
    next();
  }
});
