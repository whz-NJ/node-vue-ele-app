import Vue from 'vue';
import Router from 'vue-router';
import Index from './views/Index.vue';
import Register from './views/Register.vue';
import Login from './views/Login.vue';
import NotFound from './views/404.vue';
import Home from './views/Home.vue';
import InfoShow from './views/InfoShow.vue';
import FundList from './views/FundList.vue';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL, //注意，这里引用了BASE_URL
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
      {
          path: '/index',
          name: 'index',
          component: Index,
          // Home组件作为Index组件的二级路由
          children:[
              {path: "", component: Home},
              {path: "/home", name:"home", component: Home},
              {path: "/infoshow", name:"infoshow", component: InfoShow},
              // 需要和LeftMenu里的path保持一致
              {path: "/fundlist", name:"fundlist", component: FundList}
          ]
      },
      {
          path: '/register',
          name: 'register',
          component: Register
      },
      {
          path: '/login',
          name: 'login',
          component: Login
      },
      {
          path: '*',
          name: '/404',
          component: NotFound
      }
  ]
})

//路由守卫
router.beforeEach((to, from, next) =>{
    const isLogin = localStorage.eleToken ? true:false;
    if(to.path == '/login' || to.path == '/register') {
        next();
    } else {
        console.log("isLogin: " + isLogin);
        isLogin ? next(): next('/login');
    }

})
export default router;
