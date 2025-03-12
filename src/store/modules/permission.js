import { constantRoutes } from '@/router'
import Layout from '@/layout/index'
import path from 'path'
export const filterAsyncRouter = (routes, lastRouter = false, type = false) => { // 遍历后台传来的路由字符串，转换为组件对象
  return routes.filter(router => {
    if (type && router.children) {
      router.children = filterChildren(router.children)
    }
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router?.meta?.redirect) {
      router.redirect = router?.meta?.redirect
    }
    if (router.children != null && router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children, router, type)
    } else {
      delete router['children']
      // delete router['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

const state = {
  routes: constantRoutes,
  addRouters: [],
  sidebarRouters: [],
  pathList: [],
  topHeaderPath: '',
  topRouter: []
}

const mutations = {
  SET_ROUTERS: (state, routes) => {
    state.addRouters = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_SIDEBAR_ROUTERS: (state, routes) => {
    state.sidebarRouters = constantRoutes.concat(routes)
  },
  SET_TOP_ROUTER: (state, routes) => {
    state.topRouter = routes
  },
  SET_PATH_LIST: (state, pathList) => {
    state.pathList = pathList
  },
  SET_TOP_HEADER_PATH: (state, topHeaderPath) => {
    state.topHeaderPath = topHeaderPath
  }
}

const actions = {
  GenerateRoutes({ commit }, asyncRouter) {
    commit('SET_ROUTERS', asyncRouter)
  },
  SetSidebarRouters({ commit }, sidebarRouter) {
    commit('SET_SIDEBAR_ROUTERS', sidebarRouter)
  },
  SetTopRouter({ commit }, topRouter) {
    commit('SET_TOP_ROUTER', topRouter)
  },
  SetPathList({ commit }, asyncRouter) {
    const pathList = actions.GetPathList(asyncRouter)
    commit('SET_PATH_LIST', pathList)
  },
  GetPathList(routes, basePath = '/', prefixTitle = []) {
    let res = []
    for (const router of routes) {
      // skip hidden router
      if (router.hidden) { continue }

      const data = {
        path: path.resolve(basePath, router.path),
        title: [...prefixTitle],
        id: router.id
      }

      if (router.meta && router.meta.title) {
        data.title = [...data.title, router.meta.title]

        if (router.redirect !== 'noRedirect') {
          // only push the routes with title
          // special case: need to exclude parent router without redirect
          res.push(data)
        }
      }

      // recursive child routes
      if (router.children) {
        const tempRoutes = this.GetPathList(router.children, data.path, data.title)
        if (tempRoutes.length >= 1) {
          res = [...res, ...tempRoutes]
        }
      }
    }
    return res
  }
}

export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}.vue`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
