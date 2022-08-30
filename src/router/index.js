import Vue from 'vue'
import Router from 'vue-router'
import { getStorage } from '@/lib'
// import systemManagement from '@/views/systemManagement'

Vue.use(Router)

// 解决路由重复点击报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export const constantRouters = [
  // {
  //   path: '/systemManagement',
  //   name:"systemManagement",
  //   component: systemManagement
  // },
    {
      path: '/',
      name:"portal",
      component: () => import('../views/Portal/portal1.vue')
    },
    {
      path: '/login',
      name:"login",
      component: () => import('../views/Portal/login.vue')
    },
    {
      path: '/portal',
      name:"portal",
      component: () => import('../views/Portal/portal.vue')
    },
    {
      path: '/bigScreen',
      name:"bigScreen",
      component: () => import('../views/BigScreenStatistics/index.vue')
    },
]

const createRouter = () =>  new Router({
  // mode: 'history',
  routes: [...constantRouters]
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
