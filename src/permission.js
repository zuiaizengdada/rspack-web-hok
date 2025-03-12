import router, { resetRouter } from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUserInfo, accountAllBackUrl } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getRouterList } from '@/api/login'
import globalQuery from './global'
import { userSysShortcutMenus } from '@/api/home'
import { filterAsyncRouter } from '@/store/modules/permission'
import Dialog from '@/components/Dialog/index.js'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [
  '/login3',
  '/login',
  '/auth-redirect',
  '/loginByPassword',
  '/desktopToWeb',
  '/ai/share'
] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // 处理进入首页白屏问题
  if (to.name === 'liveRoom' || !from.name) {
    Dialog.open({ type: 'PageLoading', visible: true })
  }
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()
  if (hasToken) {
    if (
      to.path === '/business/accountAuthCallBack' &&
      to.query &&
      to.query.auth_code &&
      to.query.state
    ) {
      accountAllBackUrl(to.query)
        .then(() => {
          next('/business/release/releaseAccount?callType=2')
          store.commit('user/SET_HISTORY', {
            type: 'add',
            data: {
              path: '/business/release/releaseAccount',
              query: { callType: 2 },
              title: '投放账号管理', // 这里需要固定跳转name
              name: 'ReleaseAccount',
              activeMenu: ''
            }
          })
        })
        .catch(() => {
          next(`/login`)
        })
      return
    }
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else if (to.path === '/desktopToWeb') {
      next()
    } else {
      const userInfo = await store.dispatch('user/getInfo')
      if (userInfo.token) {
        // 判断当前用户是否已拉取完user_info信息
        next()
        // 添加历史记录 需要过滤重定向的
        if (!to.meta.redirect) {
          store.commit('user/SET_HISTORY', {
            type: 'add', data: {
              path: to.path,
              query: to.query,
              title: to.meta.title,
              activeMenu: to.meta.activeMenu || '',
              name: to.name
            }
          })
        }
      } else {
        const userInfo = getUserInfo()
        store.commit('user/SET_USERINFO', userInfo)
        loadMenus(next, to)
        globalQuery()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      if (to.path === '/' && to.query && to.query.name) {
        next(`/login?name=${to.query.name}`)
      } else {
        next(`/login`)
      }
      NProgress.done()
    }
  }
})

export const loadMenus = async (next, to) => {
  store.dispatch('user/getEnableLecturer')
  try {
    const res = await getRouterList()
    // 延迟查询是否需要签订协议
    setTimeout(() => {
      store.dispatch('user/checkSign', 1)
    }, 1500)
    store.dispatch('videoManage/getMediaImitateConfig')
    store.dispatch('user/qrySyncAccountNum')
    setInterval(() => {
      store.dispatch('user/qrySyncAccountNum')
    }, 1000 * 60)
    store.dispatch('user/qryPublishSuccessInfo')
    setInterval(() => {
      store.dispatch('user/qryPublishSuccessInfo')
    }, 1000 * 60 * 30)
    // || res.data.length === 0
    if (!res.data) {
      if (next) {
        next('/401')
      } else {
        router.push({ path: '/401' })
      }
    } else {
      // WEBPERMISSION => component
      const index = res.data.findIndex(v => v.path === '/')
      index > -1 && (res.data[index].path = 'component')
      let allRouter = []
      // 把所有的子集加到一个数组里面
      res.data.forEach(v => {
        if (v.children && v.children.length > 0 && !v.hidden) {
          allRouter = allRouter.concat(v.children)
        }
      })
      const sdata = JSON.parse(JSON.stringify(res.data))[0]?.children || []
      const rdata = JSON.parse(JSON.stringify(allRouter))
      await store.dispatch('permission/SetTopRouter', res.data)
      await store.dispatch('user/setHistoryWhiteList', res.data)
      // 第一次进来默认展示第一个路由
      const sidebarRoutes = filterAsyncRouter(sdata)
      const rewriteRoutes = filterAsyncRouter(rdata, false, true)
      rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
      await store.dispatch('permission/SetPathList', rewriteRoutes)
      const userMenu = await userSysShortcutMenus()
      let redirect = '/home'
      if (userMenu.data && userMenu.data.length > 0) {
        console.log('store.getters.permission_pathList---------', store.getters.permission_pathList)
        const userMenuId = store.getters.permission_pathList.find(i => i.id === userMenu.data[0].menuId)
        store.commit('user/SET_USERMENUID', userMenuId ? userMenuId.id : 0)
        redirect = userMenuId ? userMenuId.path : '/home'
      }
      rewriteRoutes.push({
        path: '/',
        component: () => import('@/layout'),
        hidden: true,
        redirect,
        children: [
          {
            path: 'home',
            component: () => import('@/views/home/index'),
            name: 'Home',
            meta: { title: '首页', icon: 'home', affix: true }
          }
        ]
      })
      await store.dispatch('permission/GenerateRoutes', rewriteRoutes)
      // 重置路由（切换机构之后重复添加了路由）
      resetRouter()
      router.addRoutes(rewriteRoutes) // 动态添加可访问路由表
      // next({ ...to })
      if (next) {
        next({ ...to, replace: true })
      }
      await store.dispatch('permission/SetSidebarRouters', sidebarRoutes)
    }
  } catch (e) {
    console.log(e, 'erroe')
    if (next) {
      next('/401')
    }
  }
}

router.afterEach(() => {
  Dialog.close()
  // finish progress bar
  NProgress.done()
})

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (!router?.current?.fullPath) {
    window.location.reload()
    return
  }
  const targetPath = router.current.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})
