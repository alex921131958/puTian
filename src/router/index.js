import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/LoginComp'

// import WorkBench from '@/components/WorkBench'
// import WorkFlow from '@/components/WorkFlow'

Vue.use(Router);

export default new Router({
  routes: [
    {path: '/', name: 'login', component: Login, redirect: '/login',},
    {name:'log',path: '/login', component: resolve => require(['../components/LoginComp'], resolve)},    //懒加载
    {name:'workbench',path: '/workbench', component: resolve => require(['../components/WorkBench'], resolve)},
    {name:'workflow',path: '/workflow', component: resolve => require(['../components/WorkFlow'], resolve)},
    // {path: '/login', component: Login, meta:{title:"登录"}},
    // {path: '/workbench', component: WorkBench, meta:{title:"工作台"}},
    // {path: '/workflow', component: WorkFlow, meta:{title:"工作流"}}
  ]
})

