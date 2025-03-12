const router = [
  {
    path: '/shop',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '我的店铺',
      icon: 'shop',
      affix: false
    },
    children: [
      {
        path: 'material',
        component: 'shop/material',
        name: 'Material',
        meta: {
          title: '素材中心',
          affix: false
        }
      },
      {
        path: 'goodsDivision',
        component: 'shop/goodsDivision/index',
        name: 'GoodsDivision',
        // hidden: true,
        meta: {
          title: '商品分类',
          affix: false
        },
        children: [
          {
            path: 'list',
            name: 'GoodsDivisionList',
            component: 'shop/goodsDivision/list',
            meta: {
              title: '商品分类列表',
              activeMenu: '/shop/goodsDivision',
              affix: false
            }
          },
          {
            path: 'goodsDivision/:id',
            component: 'shop/goodsDivision/edit',
            name: 'GoodsDivisionEdit',
            hidden: true,
            meta: {
              title: '分类内容',
              affix: false,
              activeMenu: '/shop/goodsDivision',
              permsList: ['system:grouping:add']
            }
          }
        ]
      },
      {
        path: 'goodsGrouping',
        component: 'shop/grouping/index',
        name: 'GoodsGrouping',
        meta: {
          title: '商品分组',
          affix: false
        },
        children: [
          {
            path: 'list',
            component: 'shop/grouping/list',
            name: 'GoodsGroupingList',
            meta: {
              title: '分组列表',
              affix: false,
              activeMenu: '/shop/goodsGrouping'
            }
          },
          {
            path: 'goodsGrouping/:id',
            component: 'shop/grouping/detail',
            name: 'GoodsGroupingDetail',
            hidden: true,
            meta: {
              title: '分组详情',
              affix: false,
              activeMenu: '/shop/goodsGrouping',
              permsList: ['system:grouping:add']
            }
          }
        ]
      },
      {
        path: 'teacher',
        component: 'shop/teacher',
        name: 'Teacher',
        meta: {
          title: '讲师管理',
          affix: false,
          permsList: ['system:lecturer:edit', 'system:lecturer:add']
        }
      },
      {
        path: 'banner',
        component: 'shop/banner',
        name: 'Banner',
        meta: {
          title: '轮播图',
          affix: false
        }
      },
      {
        path: 'search',
        component: 'shop/search',
        name: 'Search',
        meta: {
          title: '搜索管理',
          affix: false
        }
      },
      {
        path: 'thirdShop',
        component: 'shop/thirdShop',
        name: 'ThirdShop',
        meta: {
          title: '第三方店铺',
          affix: false
        }
      },
      {
        path: 'thirdShopCheck',
        component: 'shop/thirdShop/shopCheck',
        name: 'ThirdShopCheck',
        hidden: true,
        meta: {
          title: '三方商品核对',
          affix: false,
          activeMenu: '/shop/thirdShop',
          noCache: true
        }
      },
      {
        path: 'thirdImputation',
        component: 'shop/thirdImputation',
        name: 'ThirdImputation',
        meta: {
          title: '第三方归集',
          affix: false
        }
      },
      {
        path: 'shopDetail',
        component: 'shop/thirdShop/shopDetail',
        name: 'ShopDetail',
        hidden: true,
        meta: {
          title: '售后单数量详情',
          affix: false,
          activeMenu: '/shop/thirdShop'
        }
      }
    ]
  },
  {
    path: '/course',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '内容管理',
      icon: 'neirong',
      affix: false
    },
    children: [
      {
        path: 'video',
        component: 'course/video/index',
        name: 'Video',
        meta: {
          title: '视频',
          affix: false,
          noCache: false
        },
        children: [
          {
            path: 'list',
            alwaysShow: null,
            component: 'course/video/list',
            name: 'VideoList',
            hidden: true,
            meta: {
              title: '视频列表',
              affix: false,
              activeMenu: '/course/video',
              permsList: ['system:goods:add', 'system:goods:edit', 'system:goods:remove', 'system:goods:query']
            }
          },
          {
            path: 'videoDetail/:id',
            alwaysShow: null,
            component: 'course/video/detail',
            name: 'VideoDetail',
            hidden: true,
            meta: {
              title: '视频详情',
              affix: false,
              activeMenu: '/course/video'
            }
          },
          {
            path: 'videoEdit/:id',
            component: 'course/video/edit',
            name: 'VideoEdit',
            hidden: true,
            meta: {
              title: '视频编辑',
              activeMenu: '/course/video',
              affix: false
            }
          },
          {
            path: 'videoAdd',
            component: 'course/video/add',
            name: 'VideoAdd',
            hidden: true,
            meta: {
              title: '视频新增',
              activeMenu: '/course/video',
              affix: false
            }
          }
        ]
      },
      {
        path: 'audio',
        component: 'course/audio/index',
        name: 'Audio',
        meta: {
          title: '音频',
          affix: false
        },
        children: [
          {
            path: 'list',
            alwaysShow: null,
            component: 'course/audio/list',
            name: 'AudioDetail',
            hidden: true,
            meta: {
              title: '音频列表',
              affix: false,
              activeMenu: '/course/audio',
              permsList: ['system:goods:add', 'system:goods:edit', 'system:goods:remove', 'system:goods:query']
            }
          },
          {
            path: 'audioDetail/:id',
            component: 'course/audio/detail',
            name: 'AudioDetail',
            hidden: true,
            meta: {
              title: '音频详情',
              activeMenu: '/course/audio',
              affix: false
            }
          },
          {
            path: 'audioEdit/:id',
            component: 'course/audio/edit',
            name: 'AudioEdit',
            hidden: true,
            meta: {
              title: '音频编辑',
              activeMenu: '/course/audio',
              affix: false
            }
          },
          {
            path: 'audioAdd',
            component: 'course/audio/add',
            name: 'AudioAdd',
            hidden: true,
            meta: {
              title: '音频新增',
              activeMenu: '/course/audio',
              affix: false
            }
          }
        ]
      },
      {
        path: 'image',
        component: 'course/image/index',
        name: 'Image',
        meta: {
          title: '图文',
          affix: false
        },
        children: [
          {
            path: 'list',
            alwaysShow: null,
            component: 'course/image/list',
            name: 'ImageDetail',
            hidden: true,
            meta: {
              title: '图文列表',
              affix: false,
              activeMenu: '/course/image',
              permsList: ['system:goods:add', 'system:goods:edit', 'system:goods:remove', 'system:goods:query']
            }
          },
          {
            path: 'imageDetail/:id',
            component: 'course/image/detail',
            name: 'ImageDetail',
            hidden: true,
            meta: {
              title: '图文详情',
              activeMenu: '/course/image',
              affix: false
            }
          },
          {
            path: 'imageEdit/:id',
            component: 'course/image/edit',
            name: 'ImageEdit',
            hidden: true,
            meta: {
              title: '图文编辑',
              activeMenu: '/course/image',
              affix: false
            }
          },
          {
            path: 'imageAdd',
            component: 'course/image/add',
            name: 'ImageAdd',
            hidden: true,
            meta: {
              title: '图文新增',
              activeMenu: '/course/image',
              affix: false
            }
          }
        ]
      },
      {
        path: 'packageColumn',
        name: 'PackageColumn',
        component: 'course/column/index',
        meta: { title: '专栏', affix: false },
        children: [
          {
            path: 'list',
            name: 'PackageColumnList',
            component: 'course/column/list',
            hidden: true,
            meta: {
              title: '专栏列表',
              activeMenu: '/course/packageColumn',
              affix: false,
              permsList: ['system:goods:add', 'system:goods:edit', 'system:goods:remove', 'system:goods:query']
            }
          },
          {
            path: 'columnDetail/:id',
            name: 'ColumnDetail',
            component: 'course/column/detail',
            hidden: true,
            meta: {
              title: '专栏详情',
              activeMenu: '/course/packageColumn',
              affix: false,
              permsList: [
                'system:practice:add',
                'system:recommend:query',
                'system:practice:query',
                'system:comment:query',
                'user:query',
                'system:dou:query',
                'system:shop:third:query',
                'system:recommend:add',
                'system:practice:add',
                'system:comment:add',
                'user:add',
                'system:dou:add',
                'system:recommend:edit',
                'system:practice:edit',
                'system:comment:edit',
                'user:edit',
                'system:recommend:remove',
                'system:practice:remove',
                'system:comment:remove',
                'user:remove',
                'system:dou:remove',
                'user:export',
                'user:import',
                'user:label:add',
                'system:goods:query',
                'system:goods:edit',
                'system:goods:remove',
                'web:goods:share',
                'system:order:expired',
                'web:user:add',
                'web:content:add',
                'web:content:edit',
                'web:content:remove',
                'web:content:watch',
                'system:goods:shelf'
              ]
            }
          },
          {
            path: 'columnEdit/:id',
            name: 'ColumnEdit',
            component: 'course/column/edit',
            hidden: true,
            meta: {
              title: '专栏编辑',
              activeMenu: '/course/packageColumn',
              affix: false
            }
          },
          {
            path: 'columnAdd',
            name: 'ColumnAdd',
            component: 'course/column/add',
            hidden: true,
            meta: {
              title: '专栏新增',
              activeMenu: '/course/packageColumn',
              affix: false
            }
          },
          {
            path: 'liveColumnDetail/:id',
            name: 'liveColumnDetail',
            component: 'course/liveColumn/detail',
            hidden: true,
            meta: {
              title: '直播专栏详情',
              activeMenu: '/course/packageColumn',
              affix: false,
              permsList: [
                'system:practice:add',
                'system:recommend:query',
                'system:practice:query',
                'system:comment:query',
                'user:query',
                'system:dou:query',
                'system:shop:third:query',
                'system:recommend:add',
                'system:practice:add',
                'system:comment:add',
                'user:add',
                'system:dou:add',
                'system:recommend:edit',
                'system:practice:edit',
                'system:comment:edit',
                'user:edit',
                'system:recommend:remove',
                'system:practice:remove',
                'system:comment:remove',
                'user:remove',
                'system:dou:remove',
                'user:export',
                'user:import',
                'user:label:add',
                'system:goods:query',
                'system:goods:edit',
                'system:goods:remove',
                'web:goods:share',
                'system:order:expired',
                'web:user:add',
                'web:content:add',
                'web:content:edit',
                'web:content:remove',
                'web:content:watch',
                'system:goods:shelf'
              ]
            }
          }
        ]
      },
      {
        path: 'packageCollegeColumn',
        name: 'PackageCollegeColumn',
        component: 'course/collegeColumn/index',
        meta: { title: '大专栏', affix: false },
        children: [
          {
            path: 'list',
            alwaysShow: null,
            component: 'course/collegeColumn/list',
            name: 'packageCollegeColumnList',
            hidden: true,
            meta: {
              title: '大专栏列表',
              affix: false,
              activeMenu: '/course/packageCollegeColumn',
              permsList: ['system:goods:add', 'system:goods:edit', 'system:goods:remove', 'system:goods:query']
            }
          },
          {
            path: 'collegeColumnDetail/:id',
            name: 'CollegeColumnDetail',
            component: 'course/collegeColumn/detail',
            hidden: true,
            meta: {
              title: '大专栏详情',
              activeMenu: '/course/packageCollegeColumn',
              affix: false
            }
          },
          {
            path: 'collegeColumnEdit/:id',
            name: 'CollegeColumnEdit',
            component: 'course/collegeColumn/edit',
            hidden: true,
            meta: {
              title: '大专栏编辑',
              activeMenu: '/course/packageCollegeColumn',
              affix: false
            }
          },
          {
            path: 'collegeColumnAdd',
            name: 'CollegeColumnAdd',
            component: 'course/collegeColumn/add',
            hidden: true,
            meta: {
              title: '大专栏新增',
              activeMenu: '/course/packageCollegeColumn',
              affix: false
            }
          }
        ]
      },
      {
        path: 'offline',
        name: 'Offline',
        component: 'course/offline/index',
        meta: {
          title: '线下课程',
          affix: false
        },
        children: [
          {
            path: 'list',
            alwaysShow: null,
            component: 'course/offline/list',
            name: 'OfflineList',
            hidden: true,
            meta: {
              title: '视频列表',
              affix: false,
              activeMenu: '/course/offline',
              permsList: ['system:goods:add', 'system:goods:edit', 'system:goods:remove', 'system:goods:query']
            }
          },
          {
            path: 'offlineDetail/:id',
            name: 'OfflineDetail',
            component: 'course/offline/detail',
            hidden: true,
            meta: {
              title: '线下课程详情',
              activeMenu: '/course/offline',
              affix: false
            }
          },
          {
            path: 'offlineAdd',
            name: 'OfflineAdd',
            component: 'course/offline/add',
            hidden: true,
            meta: {
              title: '线下课程新增',
              activeMenu: '/course/offline',
              affix: false
            }
          },
          {
            path: 'offlineEdit/:id',
            name: 'OfflineEdit',
            component: 'course/offline/edit',
            hidden: true,
            meta: {
              title: '线下课程编辑',
              activeMenu: '/course/offline',
              affix: false
            }
          }
        ]
      },
      {
        path: 'live',
        name: 'Live',
        component: 'liveManagement/index',
        hidden: false,
        meta: {
          title: '直播管理',
          affix: false
        },
        children: [
          {
            path: 'list',
            name: 'LiveList',
            component: 'liveManagement/liveRoom',
            hidden: true,
            meta: {
              title: '直播列表',
              affix: false,
              activeMenu: '/course/live'
            }
          },
          {
            path: 'live/detail/:id',
            name: 'LiveDetail',
            component: 'liveManagement/detail',
            hidden: true,
            meta: {
              title: '直播详情',
              affix: false,
              activeMenu: '/course/live'
            }
          }
        ]
      }
      // {
      //   path: 'liveColumn',
      //   name: 'liveColumn',
      //   component: 'course/liveColumn/index',
      //   meta: { title: '直播专栏', affix: false },
      //   children: [
      //     {
      //       path: 'list',
      //       name: 'liveColumnList',
      //       component: 'course/liveColumn/list',
      //       hidden: true,
      //       meta: {
      //         title: '直播专栏列表',
      //         activeMenu: '/course/liveColumn',
      //         affix: false
      //       }
      //     },
      //     {
      //       path: 'add',
      //       name: 'liveColumnAdd',
      //       component: 'course/liveColumn/add',
      //       hidden: true,
      //       meta: {
      //         title: '直播专栏新增',
      //         activeMenu: '/course/liveColumn',
      //         affix: false
      //       }
      //     },
      //     {
      //       path: 'detail/:id',
      //       name: 'liveColumnDetail',
      //       component: 'course/liveColumn/detail',
      //       hidden: true,
      //       meta: {
      //         title: '直播专栏详情',
      //         activeMenu: '/course/liveColumn',
      //         affix: false,
      //         permsList: [
      //           'system:practice:add',
      //           'system:recommend:query',
      //           'system:practice:query',
      //           'system:comment:query',
      //           'user:query',
      //           'system:dou:query',
      //           'system:shop:third:query',
      //           'system:recommend:add',
      //           'system:practice:add',
      //           'system:comment:add',
      //           'user:add',
      //           'system:dou:add',
      //           'system:recommend:edit',
      //           'system:practice:edit',
      //           'system:comment:edit',
      //           'user:edit',
      //           'system:recommend:remove',
      //           'system:practice:remove',
      //           'system:comment:remove',
      //           'user:remove',
      //           'system:dou:remove',
      //           'user:export',
      //           'user:import',
      //           'user:label:add',
      //           'system:goods:query',
      //           'system:goods:edit',
      //           'system:goods:remove',
      //           'web:goods:share',
      //           'system:order:expired',
      //           'web:user:add',
      //           'web:content:add',
      //           'web:content:edit',
      //           'web:content:remove',
      //           'web:content:watch',
      //           'system:goods:shelf'
      //         ]
      //       }
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '/business',
    component: 'Layout',
    alwaysShow: true,
    // name: 'Business',
    meta: {
      title: '交易管理',
      icon: 'jiaoyi',
      affix: false
    },
    children: [
      {
        path: 'order',
        component: 'business/order/index',
        name: 'OrderList',
        meta: {
          title: '订单管理',
          affix: false
        },
        children: [
          {
            path: 'orderList',
            name: 'OrderList',
            component: 'business/order/orderList',
            meta: { title: '订单列表', affix: false, activeMenu: '/business/order' }
          },
          {
            path: 'order/:id',
            component: 'business/order/orderDetail',
            name: 'OrderDetail',
            hidden: true,
            meta: {
              title: '订单详情',
              activeMenu: '/business/order',
              affix: false,
              noCache: true
            }
          }
        ]
      },
      {
        path: 'myOrder',
        component: 'business/order/myOrder/index',
        name: 'MyOrder',
        meta: {
          title: '我的订单',
          affix: false
        },
        children: [
          {
            path: 'list',
            name: 'myOrderList',
            component: 'business/order/myOrder/list',
            meta: { title: '我的订单列表', affix: false, activeMenu: '/business/myOrder' }
          },
          {
            path: 'myOrder/:id',
            component: 'business/order/myOrder/detail',
            name: 'MyOrderDetail',
            hidden: true,
            meta: {
              title: '订单详情',
              activeMenu: '/business/myOrder',
              affix: false,
              noCache: true
            }
          }
        ]
      },
      {
        path: 'paySetting',
        component: 'business/paySetting/index',
        name: 'PaySetting',
        meta: {
          title: '售后维权',
          affix: false
        },
        children: [
          {
            path: 'list',
            component: 'business/paySetting/paySettingList',
            name: 'paySettingList',
            meta: { title: '售后列表', affix: false, activeMenu: '/business/paySetting' }
          },
          {
            path: 'paySetting/:id',
            component: 'business/paySetting/paySettingDetail',
            name: 'PaySettingDetail',
            hidden: true,
            meta: {
              title: '售后详情',
              activeMenu: '/business/paySetting',
              affix: false
            }
          }
        ]
      },
      // {
      //   path: 'paySetting/:id',
      //   component: 'business/paySetting/paySettingDetail',
      //   name: 'PaySettingDetail',
      //   hidden: true,
      //   meta: {
      //     title: '售后详情',
      //     activeMenu: '/business/paySetting',
      //     affix: false
      //   }
      // },
      {
        path: 'earlyWarning',
        component: 'business/earlyWarning/index',
        name: 'EarlyWarning',
        meta: {
          title: '全部预警订单',
          affix: false
        }
      },
      {
        path: 'MyEarlyWarning',
        component: 'business/myEarlyWarning/index',
        name: 'MyEarlyWarning',
        meta: {
          title: '我的预警订单',
          affix: false
        }
      }
    ]
  },
  {
    path: '/messageManager',
    component: 'Layout',
    alwaysShow: true,
    meta: { title: '消息管理', icon: 'el-icon-message', affix: false },
    children: [
      {
        path: 'message',
        component: 'messageManager/message',
        name: 'Message',
        meta: {
          title: '留言反馈',
          affix: false
        }
      },
      {
        path: 'blacklist',
        component: 'messageManager/blacklist',
        name: 'Blacklist',
        meta: {
          title: '黑白名单'
        }
      },
      {
        path: 'messageTemplate',
        component: 'messageManager/template',
        name: 'MessageTemplate',
        meta: {
          title: '消息模板'
        }
      },
      {
        path: 'messageLog',
        component: 'messageManager/messageLog',
        name: 'MessageLog',
        meta: {
          title: '消息记录'
        }
      },
      {
        path: 'messagesetup',
        component: 'messageManager/messagesetup',
        name: 'Messagesetup',
        meta: {
          title: '消息设置'
        }
      }
    ]
  },
  {
    component: 'Layout',
    hidden: false,
    alwaysShow: true,
    meta: {
      icon: 'el-icon-setting',
      noCache: true,
      title: '系统管理',
      affix: false
    },
    name: '系统管理',
    path: '/system',
    children: [
      {
        component: 'system/menu',
        meta: {
          noCache: true,
          title: '菜单管理',
          affix: false,
          permsList: ['system:menu:query', 'system:menu:add', 'system:menu:edit', 'system:menu:remove']
        },
        name: 'SystemMenu',
        path: 'menu'
      },
      {
        path: 'employee',
        component: 'system/employee',
        name: 'EmployeeManage',
        meta: { title: '员工管理', affix: false }
      },
      {
        path: 'role',
        component: 'system/role',
        name: 'Role',
        meta: { title: '角色管理', affix: false }
      },
      {
        path: 'member',
        component: 'system/member/index',
        name: 'MemberManage',
        meta: { title: '用户管理', affix: false },
        children: [
          {
            path: 'list',
            component: 'system/member/member',
            hidden: true,
            name: 'MemberList',
            meta: { title: '用户列表', affix: false, activeMenu: '/system/member' }
          },
          {
            path: 'memberDetail/:id',
            component: 'system/member/detail',
            hidden: true,
            name: 'MemberDetail',
            meta: { title: '用户详情', affix: false, activeMenu: '/system/member' }
          }
        ]
      },
      {
        path: 'modules',
        component: 'system/package/index',
        name: 'modulesManage',
        meta: { title: '套餐管理', affix: false }
      },
      {
        path: 'label',
        component: 'system/label',
        name: 'Label',
        meta: { title: '标签管理', affix: false }
      }
    ]
  },
  {
    path: '/test',
    component: 'Layout',
    alwaysShow: true,
    redirect: '/componentTest',
    meta: { title: '测试模块', icon: 'dashboard', affix: false },
    children: [
      {
        path: 'componentTest',
        component: 'test/componentTest',
        name: 'componentTest',
        meta: { title: '插件测试模块', affix: false }
      },
      {
        path: 'thirdTest',
        component: 'test/thirdTest',
        name: 'ThirdTest',
        meta: { title: '第三方测试', affix: false }
      },
      {
        path: 'upload',
        component: 'test/thirdTest',
        name: 'Upload',
        meta: { title: 'upload上传测试', affix: false }
      },
      {
        path: 'uploadTask',
        component: 'test/uploadTask',
        name: 'UploadTask',
        meta: { title: '任务上传测试', affix: false }
      }
    ]
  },
  {
    path: '/finance',
    component: 'Layout',
    name: '财务管理',
    hidden: false,
    alwaysShow: true,
    meta: { title: '财务管理', icon: 'dashboard', affix: false },
    children: [
      {
        path: 'virtualCurrency',
        component: 'finance/virtualCurrency/index',
        name: 'virtualCurrency',
        meta: { title: '虚拟币', affix: false }
      }
    ]
  },
  {
    path: '/marketingManagement',
    component: 'Layout',
    name: 'MarketingManagement',
    hidden: false,
    alwaysShow: true,
    meta: { title: '营销管理', icon: 'dashboard', affix: false },
    children: [
      {
        path: 'distribution',
        alwaysShow: null,
        component: 'marketingManagement/distribution/index',
        name: 'Distribution',
        meta: { title: '分销', affix: false },
        children: [
          {
            path: 'promoteProducts',
            // hidden: true,
            component: 'marketingManagement/distribution/promoteProducts',
            name: 'PromoteProducts',
            meta: { title: '推广商品', affix: false, activeMenu: '/marketingManagement/distribution' }
          },
          {
            path: 'promoter',
            // hidden: true,
            component: 'marketingManagement/distribution/promoter',
            name: 'Promoter',
            meta: { title: '推广员', affix: false, activeMenu: '/marketingManagement/distribution' }
          },
          {
            path: 'promotionPerformance',
            // hidden: true,
            component: 'marketingManagement/distribution/promotionPerformance',
            name: 'PromotionPerformance',
            meta: { title: '推广业绩', affix: false, activeMenu: '/marketingManagement/distribution' }
          },
          {
            path: 'promotionStatistics',
            // hidden: true,
            component: 'marketingManagement/distribution/promotionStatistics',
            name: 'PromotionStatistics',
            meta: { title: '推广统计', affix: false, activeMenu: '/marketingManagement/distribution' }
          }
        ]
      },
      {
        path: 'CWActivateTask',
        name: 'cWActivateTask',
        component: 'marketingManagement/CWActivateTask',
        alwaysShow: false,
        meta: { title: '企微激活任务', affix: false }
      }
    ]
  },
  {
    path: '/privateArea',
    component: 'Layout',
    name: 'PrivateArea',
    hidden: false,
    alwaysShow: true,
    meta: { title: '私域管理', affix: false },
    children: [
      {
        path: 'CWChat',
        component: 'privateArea/CWChat',
        name: 'CWChat',
        meta: { title: '企微设置', affix: false }
      },
      {
        path: 'CWRobot',
        component: 'privateArea/CWRobot',
        name: 'CWRobot',
        meta: { title: '企微机器人', affix: false }
      },
      {
        path: 'CWUser',
        component: 'privateArea/CWUser',
        name: 'CWUser',
        meta: { title: '企微员工', affix: false }
      },
      {
        path: 'CWClass',
        component: 'privateArea/CWClass',
        name: 'CWClass',
        meta: { title: '我的班级', affix: false }
      },
      {
        path: 'group',
        component: 'privateArea/group/index',
        name: 'Group',
        meta: { title: '企微群发', affix: false, activeMenu: '/privateArea/group' },
        children: [
          {
            path: 'list',
            component: 'privateArea/group/list',
            name: 'PrivateAreaGroupList',
            meta: { title: '企微群发列表', affix: false, activeMenu: '/privateArea/group' }
          },
          {
            path: 'detail',
            component: 'privateArea/group/detail',
            name: 'PrivateAreaGroupDetail',
            meta: { title: '群发详情', affix: false, activeMenu: '/privateArea/group' }
          },
          {
            path: 'add',
            component: 'privateArea/group/add',
            name: 'PrivateAreaGroupAdd',
            meta: { title: '群发添加', affix: false, activeMenu: '/privateArea/group' }
          }
        ]
      },
      {
        path: 'class',
        component: 'privateArea/class/index',
        name: 'PrivateAreaClass',
        meta: { title: '我的班级', affix: false, activeMenu: '/privateArea/class' },
        children: [
          {
            path: 'allClass',
            component: 'privateArea/class/allClass',
            name: 'PrivateAreaAllClass',
            meta: { title: '全部班级', affix: false, activeMenu: '/privateArea/class' }
          },
          {
            path: 'deptClass',
            component: 'privateArea/class/deptClass',
            name: 'PrivateAreaDeptClass',
            meta: { title: '部门班级', affix: false, activeMenu: '/privateArea/class' }
          },
          {
            path: 'myClass',
            component: 'privateArea/class/myClass',
            name: 'PrivateAreaMyClass',
            meta: { title: '我的班级', affix: false, activeMenu: '/privateArea/class' }
          }
        ]
      }
    ]
  },
  {
    path: '/tools',
    component: 'Layout',
    name: 'Tools',
    hidden: false,
    alwaysShow: true,
    meta: { title: '工具', affix: false },
    children: [
      {
        path: 'questionnaire',
        component: 'tools/questionnaire/index',
        name: 'Questionnaire',
        meta: { title: '问卷', affix: false },
        children: [
          {
            path: 'list',
            name: 'QuestionnaireList',
            component: 'tools/questionnaire/list',
            alwaysShow: false,
            meta: { title: '问卷列表', affix: false, activeMenu: '/tools/questionnaire' }
          },
          {
            path: 'detail',
            component: 'tools/questionnaire/detail',
            name: 'QuestionnaireDetail',
            alwaysShow: false,
            meta: { title: '问卷数据', affix: false, activeMenu: '/tools/questionnaire' }
          },
          {
            component: 'teacherCenter/findTeacher/list',
            name: 'FindTeacherList',
            meta: {
              title: '寻找师资列表',
              affix: false,
              activeMenu: '/teacherCenter/findTeacher'
            }
          }
        ]
      },
      {
        path: 'teachFile',
        component: 'teacherCenter/teachFile/index',
        name: 'TeachFile',
        meta: { title: '师资档案', affix: false },
        children: [
          {
            path: 'list',
            component: 'teacherCenter/teachFile/list',
            name: 'TeachFileList',
            meta: {
              title: '师资档案列表',
              affix: false,
              activeMenu: '/teacherCenter/teachFile',
              noCache: true,
              permsList: [
                'web:teachFileList:page',
                'web:teachFileList:add',
                'web:teachFileList:detail',
                'web:teachFileList:edit',
                'web:teachFileList:schedule',
                'web:teachFileList:assessment',
                'web:teachFileList:authorization',
                'web:teachFileList:plan',
                'web:teachFileList:case',
                'web:teachFileList:courseware',
                'web:teachFileList:order'
              ]
            }
          },
          {
            path: 'detail/:id',
            component: 'teacherCenter/teachFile/detail',
            name: 'TeachFileDetail',
            meta: {
              title: '师资档案详情',
              affix: false,
              activeMenu: '/teacherCenter/teachFile',
              permsList: ['web:teachFileDetail:page', 'web:teachFileDetail:edit']
            }
          },
          {
            path: 'add',
            component: 'teacherCenter/teachFile/add',
            name: 'TeachFileAdd',
            meta: {
              title: '新增师资',
              affix: false,
              isCache: true,
              activeMenu: '/teacherCenter/teachFile'
            }
          },
          {
            path: 'edit/:id',
            component: 'teacherCenter/teachFile/edit',
            name: 'TeachFileEdit',
            meta: {
              title: '编辑师资',
              affix: false,
              activeMenu: '/teacherCenter/teachFile'
            }
          }
        ]
      },
      {
        path: 'teacherAssessment',
        component: 'teacherCenter/teacherAssessment/index',
        name: 'TeacherAssessment',
        meta: { title: '师资评估', affix: false },
        children: [
          {
            path: 'list',
            component: 'teacherCenter/teacherAssessment/list',
            name: 'TeacherAssessmentList',
            meta: {
              title: '师资评估列表',
              affix: false,
              noCache: true,
              activeMenu: '/teacherCenter/teacherAssessment',
              permsList: ['web:teacherAssessmentList:page', 'web:teacherAssessmentList:detail']
            }
          },
          {
            path: 'detail/:id',
            component: 'teacherCenter/teacherAssessment/detail',
            name: 'TeachFileDetail',
            meta: {
              title: '师资评估详情',
              affix: false,
              activeMenu: '/teacherCenter/teacherAssessment'
            }
          },
          {
            path: 'assess/:id',
            component: 'teacherCenter/teacherAssessment/assess',
            name: 'TeachFileAssess',
            meta: {
              title: '师资评估',
              affix: false,
              activeMenu: '/teacherCenter/teacherAssessment'
            }
          }
        ]
      },
      {
        path: 'teacherAuthorization',
        component: 'teacherCenter/teacherAuthorization/index',
        name: 'TeacherAuthorization',
        meta: { title: '师资授权', affix: false },
        children: [
          {
            path: 'list',
            component: 'teacherCenter/teacherAuthorization/list',
            name: 'teacherAuthorizationList',
            meta: {
              title: '师资授权列表',
              affix: false,
              activeMenu: '/teacherCenter/teacherAuthorization',
              permsList: [
                'web:teacherAuthorizationList:page',
                'web:teacherAuthorizationList:detail',
                'web:teacherAuthorizationList:edit'
              ]
            }
          },
          {
            path: 'detail/:id',
            component: 'teacherCenter/teacherAuthorization/detail',
            name: 'teacherAuthorizationDetail',
            meta: {
              title: '师资授权详情',
              affix: false,
              activeMenu: '/teacherCenter/teacherAuthorization',
              permsList: ['web:teacherAuthorizationDetail:page', 'web:teacherAuthorizationDetail:export']
            }
          },
          {
            path: 'edit/:id',
            component: 'teacherCenter/teacherAuthorization/edit',
            name: 'teacherAuthorizationEdit',
            meta: {
              title: '师资授权编辑',
              affix: false,
              activeMenu: '/teacherCenter/teacherAuthorization'
            }
          }
        ]
      },
      {
        path: 'contractFile',
        component: 'teacherCenter/contractFile/index',
        name: 'ContractFile',
        meta: { title: '合同档案', affix: false },
        children: [
          {
            path: 'list',
            component: 'teacherCenter/contractFile/list',
            name: 'ContractFileList',
            meta: {
              title: '合同档案列表',
              affix: false,
              activeMenu: '/teacherCenter/contractFile',
              permsList: [
                'web:contractFileList:page',
                'web:contractFileList:add',
                'web:contractFileList:edit',
                'web:contractFileList:setting'
              ]
            }
          },
          {
            path: 'detail/:id',
            component: 'teacherCenter/contractFile/detail',
            name: 'ContractFileDetail',
            meta: {
              title: '合同档案详情',
              affix: false,
              activeMenu: '/teacherCenter/contractFile',
              permsList: ['web:contractFileDetail:page', 'web:contractFileDetail:remove']
            }
          },
          {
            path: 'add',
            component: 'teacherCenter/contractFile/add',
            name: 'ContractFileAdd',
            meta: {
              title: '合同档案新增',
              affix: false,
              activeMenu: '/teacherCenter/contractFile'
            }
          },
          {
            path: 'edit/:id',
            component: 'teacherCenter/contractFile/edit',
            name: 'ContractFileEdit',
            meta: {
              title: '合同档案编辑',
              affix: false,
              activeMenu: '/teacherCenter/contractFile'
            }
          },
          {
            path: 'rescind/:id',
            component: 'teacherCenter/contractFile/rescind',
            name: 'RescindContract',
            meta: {
              title: '解除合同档案',
              affix: false,
              activeMenu: '/teacherCenter/contractFile'
            }
          }
        ]
      },
      {
        path: 'schedule',
        component: 'teacherCenter/schedule/index',
        name: 'Schedule',
        meta: { title: '排班表', affix: false },
        permsList: ['web:teacherSchedule:page', 'web:teacherSchedule:setting']
      }
      // ,{
      //   path: 'liveList',
      //   component: 'privateArea/liveList/index',
      //   name: 'LiveList',
      //   meta: { title: '直播列表', affix: false, activeMenu: '/privateArea/liveList' },
      //   children: [
      //     {
      //       path: 'allLiveList',
      //       component: 'privateArea/liveList/allLiveList',
      //       name: 'AllLiveList',
      //       meta: { title: '全部专栏直播', affix: false, activeMenu: '/privateArea/liveList' }
      //     },
      //     {
      //       path: 'myDeptLive',
      //       component: 'privateArea/liveList/myDeptLive',
      //       name: 'MyDeptLive',
      //       meta: { title: '部门专栏直播', affix: false, activeMenu: '/privateArea/liveList' }
      //     },
      //     {
      //       path: 'myLive',
      //       component: 'privateArea/liveList/myLive',
      //       name: 'MyLive',
      //       meta: { title: '我的门专栏直播', affix: false, activeMenu: '/privateArea/liveList' }
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '/productManage',
    component: 'Layout',
    name: 'ProductManage',
    hidden: false,
    alwaysShow: true,
    meta: { title: '产品管理', affix: false },
    children: [
      {
        path: 'caseFinding',
        component: 'productManage/caseFinding/index',
        name: 'CaseFinding',
        meta: { title: '寻找选题', affix: false },
        children: [
          // {
          //   path: 'index',
          //   name: 'QuestionnaireList',
          //   component: 'tools/questionnaire/list',
          //   alwaysShow: false,
          //   meta: { title: '问卷列表', affix: false, activeMenu: '/tools/questionnaire' }
          // },
        ]
      },
      {
        path: 'courseDoc',
        component: 'productManage/courseDoc/index',
        name: 'CourseDoc',
        meta: { title: '课程文件', affix: false },
        children: [
          // {
          //   path: 'recycleBin',
          //   component: 'productManage/courseDoc/recycleBin/index',
          //   name: 'recycleBin',
          //   meta: { title: '回收站', affix: false, activeMenu: 'productManage/courseDoc' }
          // }
        ]
      },
      {
        path: 'wordsManage',
        component: 'productManage/wordsManage/index',
        name: 'WordsManage',
        meta: { title: '分词管理', affix: false }
      },
      {
        path: 'deliveryScenario',
        component: 'productManage/deliveryScenario/index',
        name: 'DeliveryScenario',
        meta: { title: '交付场景管理', affix: false }
      },
      {
        path: 'casePlatform',
        component: 'productManage/casePlatform/index',
        name: 'CasePlatform',
        meta: { title: '选题平台管理', affix: false }
      },
      {
        path: 'courseManage',
        component: 'productManage/courseManage/index',
        name: 'CourseManage',
        meta: { title: '课件管理', affix: false }
      },
      {
        path: 'productDataBoard',
        component: 'productManage/productDataBoard/index',
        name: 'ProductDataBoard',
        meta: { title: '数据看板', affix: false }
      },
      {
        path: 'courseInsert',
        component: 'productManage/courseManage/courseInsert',
        name: 'CourseInsert',
        meta: { title: '课件新增', affix: false },
        hidden: true
      },
      {
        path: 'courseDetail',
        component: 'productManage/courseManage/courseDetail',
        name: 'CourseDetail',
        meta: { title: '课件详情', affix: false },
        hidden: true
      },
      {
        path: 'iframeTest',
        component: 'productManage/iframeTest/index',
        name: 'IframeTest',
        meta: { title: '选题ppt的编辑样例', affix: false }
      }
    ]
  }
]

module.exports = {
  router
}
