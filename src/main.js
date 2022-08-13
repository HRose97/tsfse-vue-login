import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false;
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(VueRouter);
Vue.use(ElementUI);

const index = () => import('@/page/home/index');
const login = () => import('@/page/login/index');
const forgot = () => import('@/page/forgot/index');
const regust = () => import('@/page/regust/index');

const routes = [
  { 
    path: '/index',
    name: 'index',
    component: index 
  },
  { 
    path: '/login',
    name: 'login',
    component: login 
  },
  { 
    path: '/forgot',
    name: 'forgot',
    component: forgot
  },
  { 
    path: '/regust',
    name: 'regust',
    component: regust 
  },
  {
    path: '',
    redirect: '/index'
  }
];
const router = new VueRouter({
  routes 
});

import * as api from './network/api';

router.beforeEach((to,from,next) => {
  console.log(to)
    //除了修改密码的phat
    if(to.path !== '/forgot'){
    //检查是否有登录
      api.checkToken().then(result => {
        if(result.code === api.SUCCESS_CODE){
          //登录成功的
          //都要回到首页，显示与用户信息
          let userVo = result.data;
          window.localStorage.setItem("user_name",userVo.userName);
          window.localStorage.setItem("avatar",userVo.avatar);
          console.log(userVo);
          if(from.path !== '/index'){
            next({
              path:'/index'
            });
          }
        }else{
          window.localStorage.setItem("user_name","");
          window.localStorage.setItem("avatar","");        
        }
      })
    }
    next();
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
