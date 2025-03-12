
export const operateTypes = {
  1: '充值',
  2: '消费',
  3: '冻结',
  4: '赠送',
  5: '冻结复充',
  6: '退款'
}
export const statuss = {
  0: '未支付',
  1: '充值成功',
  2: '充值失败',
  3: '取消充值',
  4: '已消费',
  5: '已冻结',
  6: '已赠送',
  7: '已复充',
  8: '已冻结',
  9: '已退款'
}
export const auditStatus = {
  0: '未审核',
  1: '审核通过',
  2: '审核拒绝'
}
export const userStatus = {
  1: '正常',
  2: '失效'
}

export const goodsType = {
  0: '图文',
  1: '音频',
  2: '视频',
  3: '专栏',
  4: '大专栏',
  5: '线下课程',
  7: '套餐课',
  8: '直播课'
}

export const readFlag = {
  false: '未读',
  true: '已读'
}

export const size = {
  1: '小选题',
  2: '大选题'
}
export const channelSource = {
  0: '正式课课前问卷调研',
  1: '短视频账号后台私信',
  2: '短视频账号评论',
  3: '直播间弹幕问题',
  4: '店铺咨询',
  5: '社群课前问卷调研'
}

export const type = {
  1: '非带货',
  2: '带货'
}

export const cooperateStatus = {
  1: '已签合同',
  7: '合同解除',
  0: '未跟进',
  2: '测试中',
  3: '洽谈中',
  4: '被拒绝',
  5: '拒绝对方',
  6: '无法联系'
}

export const userTerminal = [
  // { label: '全部', value: '' },
  { label: '安卓', value: 'ANDROID' },
  { label: 'IOS', value: 'IOS' },
  { label: 'H5', value: 'H5' },
  { label: '微信小程序', value: 'APPLET' },
  { label: '抖音小程序', value: 'DOUAPPLET' }
]

export const terminalList = [
  {
    value: 1,
    label: '抖音小程序安卓'
  },
  {
    value: 2,
    label: '抖音小程序苹果'
  },
  {
    value: 3,
    label: '微信小程序安卓'
  },
  {
    value: 4,
    label: '安卓APP'
  },
  {
    value: 5,
    label: '苹果APP'
  },
  {
    value: 6,
    label: 'H5'
  }
]

export const userSourceType = [
  { label: '获课安卓', value: 1 },
  { label: '获课IOS', value: 2 },
  { label: '获课H5', value: 3 },
  { label: '微信小程序', value: 4 },
  { label: '抖音小程序', value: 7 },
  { label: '后台导入', value: 5 }
]

export const operateModule = {
  1: '评估维度管理'
}

export const courseWorkStatus = {
  1: '未收集',
  2: '已收集'
}

export const deliveryStatus = {
  1: '待交付',
  2: '交付中',
  3: '延期交付',
  4: '锁定交付',
  5: '已交付',
  6: '已关闭'
}
// 下单场景
export const orderSource = {
  1: '内容带货',
  2: '直播带货',
  0: '自然成交'
}
// 流量类型
export const orderClassification = {
  0: '免费',
  1: '付费'
}

// 带货信息
export const commerceEnum = {
  0: '达人昵称',
  1: '达人ID',
  2: '达人运营',
  3: '主播',
  4: '直播运营',
  5: '中控',
  6: '投手',
  7: '直播排班ID'
}

export const typeText = {
  0: '较上周期',
  1: '较昨日',
  2: '较上7天',
  3: '较上周期',
  4: '较上周期'
}

// 任务状态
export const taskStatus = {
  0: '未开始',
  1: '进行中',
  4: '已关闭',
  3: '暂停中'
}
//	分配状态
export const receptionStatus = {
  1: '正常分配',
  2: '暂停分配'
}

export const liveModel = {
  'PERSON_LIVE': '真人直播',
  'AI_LIVE': '数字直播',
  'DIGITAL_PERSON_LIVE': '数字人直播'
}
export const afterSaleStatus = {
  1: '未处理',
  2: '退款中',
  3: '已退款',
  4: '已关闭',
  5: '超时关闭'
}
export const examineStatusOptions = [{
  value: 1,
  label: '抖音',
  children: [
    {
      value: 1,
      label: '待审核'
    },
    {
      value: 2,
      label: '审核中'
    },
    {
      value: 3,
      label: '审核通过'
    },
    {
      value: 4,
      label: '审核不通过'
    }
  ]
}]

export const evaluationLevel = [
  {
    value: 1,
    label: '好评'
  },
  {
    value: 2,
    label: '中评'
  },
  {
    value: 3,
    label: '差评'
  }
]

export const evaluationContent = [
  {
    value: 1,
    label: '有图片'
  },
  {
    value: 2,
    label: '有内容'
  },
  {
    value: 2,
    label: '有评价且有图片'
  }
]

export const platformList = {
  19: '抖音',
  15: 'b站',
  32: '视频号',
  24: '快手',
  31: '小红书',
  20: 'TikTok'
}
