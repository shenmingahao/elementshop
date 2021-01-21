import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/test'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Test.vue'),
          meta: { title: '系统首页' }
        },
        {
          path: '/type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '分类管理' }
        },
        {
          path: '/brand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Brand.vue'),
          meta: { title: '品牌管理' }
        },
        {
          path: '/attr',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Attr.vue'),
          meta: { title: '属性管理' }
        },
        {
          path: '/goods',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Goods.vue'),
          meta: { title: '添加商品' }
        },
        {
          path: '/product',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Product.vue'),
          meta: { title: '商品列表' }
        }
      ]
    }
  ]
})
