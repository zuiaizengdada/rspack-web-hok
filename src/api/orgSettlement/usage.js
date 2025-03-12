import request2 from '@/utils/request2'
/** 手动录入 */
// AI外呼基础服务、
export const aiCallOpen = {
  add(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/open/add',
      method: 'post',
      data
    })
  },
  del(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/open/del',
      method: 'post',
      data
    })
  },
  detail(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/open/get',
      method: 'post',
      data
    })
  },
  list(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/open/pageList',
      method: 'post',
      data
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/open/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
// AI外呼月租
export const aiCallRent = {
  add(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/rent/add',
      method: 'post',
      data
    })
  },
  del(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/rent/del',
      method: 'post',
      data
    })
  },
  detail(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/rent/get',
      method: 'post',
      data
    })
  },
  list(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/rent/pageList',
      method: 'post',
      data
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/rent/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
// AI外呼电话认证
export const aiCallCertificate = {
  add(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/certificate/add',
      method: 'post',
      data
    })
  },
  del(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/certificate/del',
      method: 'post',
      data
    })
  },
  detail(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/certificate/get',
      method: 'post',
      data
    })
  },
  list(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/certificate/pageList',
      method: 'post',
      data
    })
  },

  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aiCall/certificate/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
// 七鱼客服
export const qiyukf = {
  add(data) {
    return request2({
      url: '/cloud/edata-bill/detail/qiyukf/add',
      method: 'post',
      data
    })
  },
  del(data) {
    return request2({
      url: '/cloud/edata-bill/detail/qiyukf/del',
      method: 'post',
      data
    })
  },
  detail(data) {
    return request2({
      url: '/cloud/edata-bill/detail/qiyukf/get',
      method: 'post',
      data
    })
  },
  list(data) {
    return request2({
      url: '/cloud/edata-bill/detail/qiyukf/pageList',
      method: 'post',
      data
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/qiyukf/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
// 数字人（1、数字人套餐|2、数字人声音|3、数字人形象｜）
export const digitalhuman = function (type) {
  return {
    add(data) {
      return request2({
        url: '/cloud/edata-bill/detail/digitalhuman/add/' + type,
        method: 'post',
        data
      })
    },
    del(data) {
      return request2({
        url: '/cloud/edata-bill/detail/digitalhuman/del/' + type,
        method: 'post',
        data
      })
    },
    detail(data) {
      return request2({
        url: '/cloud/edata-bill/detail/digitalhuman/get/' + type,
        method: 'post',
        data
      })
    },
    list(data) {
      return request2({
        url: '/cloud/edata-bill/detail/digitalhuman/pageList/' + type,
        method: 'post',
        data
      })
    },

    export(params) {
      return request2({
        url: '/cloud/edata-bill/detail/digitalhuman/export',
        method: 'get',
        timeout: 60000,
        params: {
          type,
          ...params
        }
      })
    }
  }
}
// 聚合客服
export const aggregateCustomer = {
  add(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aggregateCustomer/add',
      method: 'post',
      data
    })
  },
  del(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aggregateCustomer/del',
      method: 'post',
      data
    })
  },
  detail(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aggregateCustomer/get',
      method: 'post',
      data
    })
  },
  list(data) {
    return request2({
      url: '/cloud/edata-bill/detail/aggregateCustomer/pageList',
      method: 'post',
      data
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aggregateCustomer/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}

/** AI生成图片明细分页数据 AI助手文字图片服务 */
export const chargesList = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aiAssistant/aiPicPage',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aiAssistant/aiPic/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}

/** AItoken消耗明细分页数据 AI助手文字生成服务 */
export const aiTokenPage = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aiAssistant/aiTokenPage',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/aiAssistant/aiToken/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}

/** AI外呼话费&录音  1、话费|2、录音*/
export const aiCallRecordPage = (type) => {
  return {
    list(params) {
      return request2({
        url: '/cloud/edata-bill/detail/aiCall/record/page',
        method: 'get',
        params: {
          ...params,
          type
        }
      })
    },
    export(params) {
      return request2({
        url: '/cloud/edata-bill/detail/aiCall/export',
        method: 'get',
        timeout: 60000,
        params: {
          ...params,
          type
        }
      })
    }
  }
}

/** 人工外呼坐席费用 */
export const callAgent = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/call/agent',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/call/agent/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}

/** 人工外呼转接费、话费、录音  1、话费|2、录音|3、转接费*/
export const callRecord = (type) => {
  return {
    list(params) {
      return request2({
        url: '/cloud/edata-bill/detail/call/record',
        method: 'get',
        params: {
          ...params,
          type
        }
      })
    },
    export(params) {
      return request2({
        url: '/cloud/edata-bill/detail/call/rent/record',
        method: 'get',
        timeout: 60000,
        params: {
          ...params,
          type
        }
      })
    }
  }
}

/** 人工外呼月租 */
export const callRent = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/call/rent',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/call/rent/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
/** 云桌面明细分页数据 */
export const ecsPage = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/ecs/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/ecs/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
/** 私域明细分页数据 */
export const usagelivePage = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/live/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/live/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
/** 公域明细分页数据 */
export const publicDomainPage = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/public/domain/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/public/domain/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}

/** 订单Api调用明细数据 第三方订单接口调用*/
export const orderApiPage = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/orderApi/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/orderApi/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}

/** 销售企微加微明细 销售企微加微 */
export const saleFriendsRecord = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/saleFriends/record/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/saleFriends/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
/** 短信通知用量明细  MSG0001-加微短信 MSG0002-订单通知短信  MSG0003-抖店解密短信  MSG0004-人工外呼认证短信*/
export const smsRecord = (type) => {
  return {
    list(params) {
      return request2({
        url: '/cloud/edata-bill/detail/sms/record/page',
        method: 'get',
        params: { ...params, type }
      })
    },
    export(params) {
      return request2({
        url: '/cloud/edata-bill/detail/sms/export',
        method: 'get',
        timeout: 60000,
        params: {
          ...params,
          type
        }
      })
    }
  }
}

/** 系统服务明细分页数据 */
export const sysService = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/sysService/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/sysService/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
/** 自媒体运营明细分页数据 */
export const wemedia = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/wemedia/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/wemedia/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}

// 1、企微会话存档服务费|2、企微互通账号
export const qiweiCost = function (type) {
  return {
    add(data) {
      return request2({
        url: '/cloud/edata-bill/detail/qiwei/add/' + type,
        method: 'post',
        data
      })
    },
    del(data) {
      return request2({
        url: '/cloud/edata-bill/detail/qiwei/del/' + type,
        method: 'post',
        data
      })
    },
    detail(data) {
      return request2({
        url: '/cloud/edata-bill/detail/qiwei/get/' + type,
        method: 'post',
        data
      })
    },
    list(data) {
      return request2({
        url: '/cloud/edata-bill/detail/qiwei/pageList/' + type,
        method: 'post',
        data
      })
    },
    export(params) {
      return request2({
        url: '/cloud/edata-bill/detail/qiwei/export',
        method: 'get',
        timeout: 60000,
        params: {
          ...params,
          type
        }
      })
    }
  }
}

// /** 手动录入费用 */
export const custom = {
  add(data) {
    return request2({
      url: '/cloud/edata-bill/detail/custom/add',
      method: 'post',
      data
    })
  },
  del(data) {
    return request2({
      url: '/cloud/edata-bill/detail/custom/del',
      method: 'post',
      data
    })
  },
  list(data) {
    return request2({
      url: '/cloud/edata-bill/detail/custom/pageList',
      method: 'post',
      data
    })
  },
  detail(params) {
    return request2({
      url: '/cloud/edata-bill/detail/custom/get',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/custom/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
// /** 视频素材处理 */

export const videoMaterial = {
  list(params) {
    return request2({
      url: '/cloud/edata-bill/detail/video-material/page',
      method: 'get',
      params
    })
  },
  export(params) {
    return request2({
      url: '/cloud/edata-bill/detail/video-material/export',
      method: 'get',
      timeout: 60000,
      params
    })
  }
}
