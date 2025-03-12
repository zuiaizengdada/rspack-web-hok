import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
      // {
      //   path: '/problemDetails/:keyword',
      //   name: 'problemDetails',
      //   component: () => import('@/views/productManage/problemManage/keyword.vue'),
      //   hidden: true
      // },
      // {
      //   path: '/caseManage/modal',
      //   name: 'caseManageModal',
      //   component: () => import('@/views/productManage/caseManage/modal'),
      //   hidden: true
      // },
      // {
      //   path: '/caseManage/details/:id',
      //   name: 'caseManageDetails',
      //   component: () => import('@/views/productManage/caseManage/details'),
      //   hidden: true
      // },
      // {
      //   path: '/caseManage/teacherList/:teacherId',
      //   name: 'caseManageTeacherList',
      //   component: () => import('@/views/productManage/teacherCaseManage/index'),
      //   hidden: true
      // }
    ]
  },
  {
    path: '/refresh/:path(.*)',
    component: () => import('@/views/refresh/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // {
  //   path: '/login3',
  //   component: () => import('@/views/login/index3'),
  //   hidden: true
  // },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/formGenerator',
    name: 'formGenerator',
    component: () => import('@/views/formMaking/index.vue'),
    hidden: true
  },
  {
    path: '/pageGenerator',
    name: 'pageGenerator',
    component: () => import('@/views/pageMaking/index.vue'),
    hidden: true
  },
  {
    path: '/subtitleEditor/:videoGroupId',
    name: 'SubtitleEditor',
    component: () => import('@/views/videoManagement/subtitleEditor/index.vue'),
    hidden: true
  },
  {
    path: '/showSemiVideoDetail/:videoGroupId',
    name: 'ShowSemiVideoDetail',
    component: () => import('@/views/videoManagement/showSemiVideoDetail/index.vue'),
    hidden: true
  },
  {
    path: '/videoEditor',
    name: 'VideoEditor',
    component: () => import('@/views/videoEditor/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  {
    path: '/videoEditorLive',
    name: 'VideoEditorLive',
    component: () => import('@/views/videoEditorLive/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // 直播间
  {
    path: '/liveRoom/:id',
    name: 'liveRoom',
    component: () => import('@/views/live/liveRoom/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // 直播间V2
  {
    path: '/liveRoomV2/:id',
    name: 'liveRoomV2',
    component: () => import('@/views/live/liveRoomV2/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // 直播看板
  {
    path: '/liveKanban/:id',
    name: 'LiveKanban',
    component: () => import('@/views/live/liveKanban/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // 直播脚本配置
  {
    path: '/live/scriptConfiguration/:id',
    name: 'ScriptConfiguration',
    component: () => import('@/views/live/script/scriptConfiguration/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // 直播脚本预览
  {
    path: '/live/scriptPreview/:id',
    name: 'ScriptPreview',
    component: () => import('@/views/live/script/scriptPreview/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // 直播备课
  {
    path: '/live/prepareLessons/:id',
    name: 'PrepareLessons',
    component: () => import('@/views/live/script/prepareLessons/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // AI分享页面
  {
    path: '/ai/share',
    name: 'aiShare',
    component: () => import('@/views/aigc/share/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  // 客户端免登进入web中转页面
  {
    path: '/desktopToWeb',
    name: 'DesktopToWeb',
    component: () => import('@/views/desktopToWeb/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  {
    path: '/videoCreate',
    name: 'VideoCreate',
    component: () => import('@/views/videoEditor/create/index.vue'),
    hidden: true,
    meta: {
      keepAlive: false // 设置不缓存
    }
  },
  {
    path: '/componentTest',
    hidden: true,
    component: () => import('@/views/test/componentTest.vue'),
    name: 'componentTest',
    meta: { title: '插件测试模块', affix: false }
  },
  {
    path: '/querysite',
    name: 'VuerySite',
    component: () => import('@/views/querySite/index.vue')
  }
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'dashboard',
  //       redirect: '/shop/material',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: { title: '首页', icon: 'home', affix: true }
  //     }
  //   ]
  // }
  // {
  //   path: '/shop',
  //   component: Layout,
  //   meta: {
  //     title: '我的店铺',
  //     icon: 'shop',
  //     affix: false
  //   },
  //   children: [
  //     {
  //       path: 'material',
  //       component: () => import('@/views/shop/material'),
  //       name: 'Material',
  //       meta: {
  //         title: '素材中心',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'goodsDivision',
  //       component: () => import('@/views/shop/goodsDivision/list'),
  //       name: 'GoodsDivisionList',
  //       // hidden: true,
  //       meta: {
  //         title: '商品分类',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'goodsDivision/:id',
  //       component: () => import('@/views/shop/goodsDivision/edit'),
  //       name: 'GoodsDivisionEdit',
  //       hidden: true,
  //       meta: {
  //         title: '分类内容',
  //         affix: false,
  //         activeMenu: '/goodsDivision'
  //       }
  //     },
  //     {
  //       path: 'goodsGrouping',
  //       component: () => import('@/views/shop/grouping.vue'),
  //       name: 'GoodsGrouping',
  //       meta: {
  //         title: '商品分组',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'goodsGrouping/:id',
  //       component: () => import('@/views/shop/grouping/detail'),
  //       name: 'GoodsGroupingDetail',
  //       hidden: true,
  //       meta: {
  //         title: '分组详情',
  //         affix: false,
  //         activeMenu: '/shop/goodsGrouping'
  //       }
  //     },
  //     {
  //       path: 'teacher',
  //       component: () => import('@/views/shop/teacher'),
  //       name: 'Teacher',
  //       meta: {
  //         title: '讲师管理',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'banner',
  //       component: () => import('@/views/shop/banner'),
  //       name: 'Banner',
  //       meta: {
  //         title: '轮播图',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'search',
  //       component: () => import('@/views/shop/search'),
  //       name: 'Search',
  //       meta: {
  //         title: '搜索管理',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'thirdShop',
  //       component: () => import('@/views/shop/thirdShop'),
  //       name: 'ThirdShop',
  //       meta: {
  //         title: '第三方店铺',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'thirdImputation',
  //       component: () => import('@/views/shop/thirdImputation'),
  //       name: 'ThirdImputation',
  //       meta: {
  //         title: '第三方归集',
  //         affix: false
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/course',
  //   component: Layout,
  //   // name: 'Course',
  //   meta: {
  //     title: '内容管理',
  //     icon: 'neirong',
  //     affix: false
  //   },
  //   children: [
  //     {
  //       path: 'video',
  //       component: () => import('@/views/course/video/list'),
  //       name: 'Video',
  //       meta: {
  //         title: '视频',
  //         affix: false,
  //         noCache: false
  //       }
  //     },
  //     {
  //       path: 'videoDetail/:id',
  //       component: () => import('@/views/course/video/detail'),
  //       name: 'VideoDetail',
  //       hidden: true,
  //       meta: {
  //         title: '视频详情',
  //         affix: false,
  //         activeMenu: '/course/video'
  //       }
  //     },
  //     {
  //       path: 'videoEdit/:id',
  //       component: () => import('@/views/course/video/edit'),
  //       name: 'VideoEdit',
  //       hidden: true,
  //       meta: {
  //         title: '视频编辑',
  //         activeMenu: '/course/video',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'videoAdd',
  //       component: () => import('@/views/course/video/add'),
  //       name: 'VideoAdd',
  //       hidden: true,
  //       meta: {
  //         title: '视频新增',
  //         activeMenu: '/course/video',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'audio',
  //       component: () => import('@/views/course/audio/list'),
  //       name: 'Audio',
  //       meta: {
  //         title: '音频',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'audioDetail/:id',
  //       component: () => import('@/views/course/audio/detail'),
  //       name: 'AudioDetail',
  //       hidden: true,
  //       meta: {
  //         title: '音频详情',
  //         activeMenu: '/course/audio',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'audioEdit/:id',
  //       component: () => import('@/views/course/audio/edit'),
  //       name: 'AudioEdit',
  //       hidden: true,
  //       meta: {
  //         title: '音频编辑',
  //         activeMenu: '/course/audio',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'audioAdd',
  //       component: () => import('@/views/course/audio/add'),
  //       name: 'AudioAdd',
  //       hidden: true,
  //       meta: {
  //         title: '音频新增',
  //         activeMenu: '/course/audio',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'image',
  //       component: () => import('@/views/course/image/list'),
  //       name: 'Image',
  //       meta: {
  //         title: '图文',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'imageDetail/:id',
  //       component: () => import('@/views/course/image/detail'),
  //       name: 'ImageDetail',
  //       hidden: true,
  //       meta: {
  //         title: '图文详情',
  //         activeMenu: '/course/image',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'imageEdit/:id',
  //       component: () => import('@/views/course/image/edit'),
  //       name: 'ImageEdit',
  //       hidden: true,
  //       meta: {
  //         title: '图文编辑',
  //         activeMenu: '/course/image',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'imageAdd',
  //       component: () => import('@/views/course/image/add'),
  //       name: 'ImageAdd',
  //       hidden: true,
  //       meta: {
  //         title: '图文新增',
  //         activeMenu: '/course/image',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'package',
  //       name: 'Package',
  //       component: () => import('@/views/course/package'),
  //       redirect: '/course/package/packageColumn',
  //       meta: {
  //         title: '专栏',
  //         affix: false
  //       },
  //       children: [
  //         {
  //           path: 'packageColumn',
  //           name: 'PackageColumn',
  //           hidden: true,
  //           component: () => import('@/views/course/package/column'),
  //           meta: {
  //             title: '小专栏',
  //             activeMenu: '/course/package',
  //             affix: false
  //           }
  //         },
  //         {
  //           path: 'packageCollegeColumn',
  //           name: 'PackageCollegeColumn',
  //           hidden: true,
  //           component: () => import('@/views/course/package/collegeColumn'),
  //           meta: {
  //             title: '大专栏',
  //             activeMenu: '/course/package',
  //             affix: false
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'columnDetail/:id',
  //       name: 'ColumnDetail',
  //       component: () => import('@/views/course/column/detail'),
  //       hidden: true,
  //       meta: {
  //         title: '专栏详情',
  //         activeMenu: '/course/package',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'columnEdit/:id',
  //       name: 'ColumnEdit',
  //       component: () => import('@/views/course/column/edit'),
  //       hidden: true,
  //       meta: {
  //         title: '专栏编辑',
  //         activeMenu: '/course/package',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'columnAdd',
  //       name: 'ColumnAdd',
  //       component: () => import('@/views/course/column/add'),
  //       hidden: true,
  //       meta: {
  //         title: '专栏新增',
  //         activeMenu: '/course/package',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'collegeColumnDetail/:id',
  //       name: 'CollegeColumnDetail',
  //       component: () => import('@/views/course/collegeColumn/detail'),
  //       hidden: true,
  //       meta: {
  //         title: '大专栏详情',
  //         activeMenu: '/course/package',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'collegeColumnEdit/:id',
  //       name: 'CollegeColumnEdit',
  //       component: () => import('@/views/course/collegeColumn/edit'),
  //       hidden: true,
  //       meta: {
  //         title: '大专栏编辑',
  //         activeMenu: '/course/package',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'collegeColumnAdd',
  //       name: 'CollegeColumnAdd',
  //       component: () => import('@/views/course/collegeColumn/add'),
  //       hidden: true,
  //       meta: {
  //         title: '大专栏新增',
  //         activeMenu: '/course/package',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'offline',
  //       name: 'Offline',
  //       component: () => import('@/views/course/offline/list'),
  //       meta: {
  //         title: '线下课程',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'offlineDetail/:id',
  //       name: 'OfflineDetail',
  //       component: () => import('@/views/course/offline/detail'),
  //       hidden: true,
  //       meta: {
  //         title: '线下课程详情',
  //         activeMenu: '/course/offline',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'offlineAdd',
  //       name: 'OfflineAdd',
  //       component: () => import('@/views/course/offline/add'),
  //       hidden: true,
  //       meta: {
  //         title: '线下课程新增',
  //         activeMenu: '/course/offline',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'offlineEdit/:id',
  //       name: 'OfflineEdit',
  //       component: () => import('@/views/course/offline/edit'),
  //       hidden: true,
  //       meta: {
  //         title: '线下课程编辑',
  //         activeMenu: '/course/offline',
  //         affix: false
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/business',
  //   component: Layout,
  //   // name: 'Business',
  //   meta: {
  //     title: '交易管理',
  //     icon: 'jiaoyi',
  //     affix: false
  //   },
  //   children: [
  //     {
  //       path: 'order',
  //       component: () => import('@/views/business/order/orderList.vue'),
  //       name: 'OrderList',
  //       meta: {
  //         title: '订单管理',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'order/:id',
  //       component: () => import('@/views/business/order/orderDetail.vue'),
  //       name: 'OrderDetail',
  //       hidden: true,
  //       meta: {
  //         title: '订单详情',
  //         activeMenu: '/business/order',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'paySetting',
  //       component: () => import('@/views/business/paySetting/paySettingList'),
  //       name: 'PaySetting',
  //       meta: {
  //         title: '售后维权',
  //         affix: false
  //       }
  //     },
  //     {
  //       path: 'paySetting/:id',
  //       component: () => import('@/views/business/paySetting/paySettingDetail.vue'),
  //       name: 'PaySettingDetail',
  //       hidden: true,
  //       meta: {
  //         title: '订单详情',
  //         activeMenu: '/business/paySetting',
  //         affix: false
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/user',
  //   component: Layout,
  //   meta: { title: '用户管理', icon: 'yonghu', affix: false },
  //   children: [
  //     {
  //       path: 'employee',
  //       component: () => import('@/views/user/employee'),
  //       name: 'EmployeeManage',
  //       meta: { title: '员工管理', affix: false }
  //     },
  //     {
  //       path: 'member',
  //       component: () => import('@/views/user/member'),
  //       name: 'MemberManage',
  //       meta: { title: '用户管理', affix: false }
  //     },
  //     {
  //       path: 'memberDetail/:id',
  //       component: () => import('@/views/user/member/detail'),
  //       hidden: true,
  //       name: 'MemberDetail',
  //       meta: { title: '用户详情', affix: false, activeMenu: '/user/member' }
  //     },
  //     {
  //       path: 'label',
  //       component: () => import('@/views/user/label'),
  //       name: 'Label',
  //       meta: { title: '标签管理', affix: false }
  //     }
  //   ]
  // }
  // {
  //   path: '/messageManager',
  //   component: Layout,
  //   meta: { title: '消息管理', icon: 'el-icon-message', affix: false },
  //   children: [
  //     {
  //       path: 'message',
  //       // component: () => import('@/views/messageManager/message'),
  //       component: (resolve) => require(['@/views/messageManager/message'], resolve),
  //       name: 'Message',
  //       meta: {
  //         title: '留言反馈',
  //         affix: false
  //       }
  //     }
  //   ]
  // }
  // {
  //   path: '/system',
  //   component: Layout,
  //   meta: { title: '系统设置', icon: 'el-icon-message', affix: false },
  //   children: [
  //     {
  //       path: 'menu',
  //       component: () => import('@/views/system/menu'),
  //       name: 'SystemMenu',
  //       meta: { title: '菜单管理', icon: '', affix: false }
  //     }
  //   ]
  // }
]
// export const asyncRoutes = [
//   { path: '*', redirect: '/404', hidden: false },
//   {
//     path: '/test',
//     component: Layout,
//     redirect: '/componentTest',
//     meta: { title: '测试模块', icon: 'dashboard', affix: false, roles: ['develop'] },
//     children: [
//       {
//         path: 'componentTest',
//         component: () => import('@/views/test/componentTest'),
//         name: 'componentTest',
//         meta: { title: '插件测试模块', affix: false, roles: ['develop'] }
//       },
//       {
//         path: 'thirdTest',
//         component: () => import('@/views/test/thirdTest'),
//         name: 'ThirdTest',
//         meta: { title: '第三方测试', affix: false, roles: ['develop'] }
//       },
//       {
//         path: 'upload',
//         component: () => import('@/views/test/upload'),
//         name: 'Upload',
//         meta: { title: 'upload上传测试', affix: false, roles: ['develop'] }
//       }
//     ]
//   }
// ]

const createRouter = () =>
  new Router({
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
