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

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
