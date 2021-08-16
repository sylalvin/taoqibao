  import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/pms',
    component: Layout,
    name: 'ProductManagementSystem',
    meta: {
      title: '商品管理',
      icon: 'nested'
    },
    children: [{
        path: 'product',
        component: () => import('@/views/pms/product/index'), // Parent router-view
        name: 'Product',
        meta: { title: '商品列表' },
      },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/pms/product/add'),
        meta: { title: '添加商品' },
        hidden: true
      },
      {
        path: 'updateProduct',
        name: 'updateProduct',
        component: () => import('@/views/pms/product/update'),
        meta: { title: '更新商品' },
        hidden: true
      },
      {
        path: 'editRelation',
        name: 'editRelation',
        component: () => import('@/views/pms/product/editRelation'),
        meta: { title: '编辑商品关联' },
        hidden: true
      },
      {
        path: 'spec',
        name: 'spec',
        component: () => import('@/views/pms/spec/index'),
        meta: { title: '规格管理' },
        hidden: false
      },
      {
        path: 'addSpec',
        name: 'addSpec',
        component: () => import('@/views/pms/spec/add'),
        meta: { title: '添加规格' },
        hidden: true
      },
      {
        path: 'updateSpec',
        name: 'updateSpec',
        component: () => import('@/views/pms/spec/update'),
        meta: { title: '更新规格' },
        hidden: true
      }
    ]
  },

  {
    path: '/sms',
    component: Layout,
    name: 'SalesManagement',
    meta: {
      title: '销售管理',
      icon: 'nested'
    },
    children: [{
        path: 'sales',
        component: () => import('@/views/sms/sales/index'), // Parent router-view
        name: 'Sales',
        meta: { title: '销售列表' },
      },
      {
        path: 'addSales',
        name: 'addSales',
        component: () => import('@/views/sms/sales/add'),
        meta: { title: '添加销售' },
        hidden: true
      },
      {
        path: 'updateSales',
        name: 'updateSales',
        component: () => import('@/views/sms/sales/update'),
        meta: { title: '更新销售' },
        hidden: true
      },
    ]
  },
  {
    path: '/mms',
    component: Layout,
    name: 'MchntManagement',
    meta: {
      title: '商户管理',
      icon: 'nested'
    },
    children: [{
        path: 'mchnt',
        component: () => import('@/views/mms/mchnt/index'), // Parent router-view
        name: 'Mchnt',
        meta: { title: '商户列表' },
      },
      {
        path: 'addMchnt',
        name: 'addMchnt',
        component: () => import('@/views/mms/mchnt/add'),
        meta: { title: '添加客户' },
        hidden: true
      },
      {
        path: 'updateMchnt',
        name: 'updateMchnt',
        component: () => import('@/views/mms/mchnt/update'),
        meta: { title: '更新客户' },
        hidden: true
      },
      {
        path: 'receipt',
        name: 'receipt',
        component: () => import('@/views/mms/mchnt/receipt'),
        meta: { title: '商户开票' },
        hidden: false
      },
      {
        path: 'showReceipt',
        name: 'showReceipt',
        component: () => import('@/views/mms/mchnt/showReceipt'),
        meta: { title: '开票记录' },
        hidden: false
      },
    ]
  },
  {
    path: '/oms',
    component: Layout,
    name: 'OrderManagement',
    meta: {
      title: '订单管理',
      icon: 'nested'
    },
    children: [{
        path: 'order',
        component: () => import('@/views/oms/order/index'), // Parent router-view
        name: 'Order',
        meta: { title: '订单列表' },
      },
      {
        path: 'orderRefund',
        component: () => import('@/views/oms/order/refund'), // Parent router-view
        name: 'OrderRefund',
        meta: { title: '订单退款申请' },
      },
      {
        path: 'addOrder',
        name: 'addOrder',
        component: () => import('@/views/oms/order/add'),
        meta: { title: '添加订单' },
        hidden: true
      },
      {
        path: 'updateOrder',
        name: 'updateOrder',
        component: () => import('@/views/oms/order/update'),
        meta: { title: '更新订单' },
        hidden: true
      },
    ]
  },
  {
    path:'/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: {title: '权限', icon: 'nested', roles: ['admin']},
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index'),
        meta: {title: '用户列表', roles: ['admin']}
      },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/ums/role/index'),
  //       meta: {title: '角色列表'}
  //     },
  //     {
  //       path: 'allocMenu',
  //       name: 'allocMenu',
  //       component: () => import('@/views/ums/role/allocMenu'),
  //       meta: {title: '分配菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'allocResource',
  //       name: 'allocResource',
  //       component: () => import('@/views/ums/role/allocResource'),
  //       meta: {title: '分配资源'},
  //       hidden: true
  //     },
  //     {
  //       path: 'menu',
  //       name: 'menu',
  //       component: () => import('@/views/ums/menu/index'),
  //       meta: {title: '菜单列表'}
  //     },
  //     {
  //       path: 'addMenu',
  //       name: 'addMenu',
  //       component: () => import('@/views/ums/menu/add'),
  //       meta: {title: '添加菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'updateMenu',
  //       name: 'updateMenu',
  //       component: () => import('@/views/ums/menu/update'),
  //       meta: {title: '修改菜单'},
  //       hidden: true
  //     },
  //     {
  //       path: 'resource',
  //       name: 'resource',
  //       component: () => import('@/views/ums/resource/index'),
  //       meta: {title: '资源列表'}
  //     },
  //     {
  //       path: 'resourceCategory',
  //       name: 'resourceCategory',
  //       component: () => import('@/views/ums/resource/categoryList'),
  //       meta: {title: '资源分类'},
  //       hidden: true
      // }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
