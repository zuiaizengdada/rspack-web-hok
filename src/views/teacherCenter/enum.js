// 评估状态
export const ASSESS_TYPES = [
  { label: '未评估', value: 1 },
  { label: '评估中', value: 2 },
  { label: '已评估', value: 3 }
]

// 个人评估状态
export const ASSESS_STATUS = [
  { label: '未评估', value: 1 },
  { label: '已评估', value: 2 }
]

// 评估结果
export const ASSESS_RESULT = [
  { label: '50分以下', value: 0 },
  { label: '50-60分', value: 1 },
  { label: '60-70分', value: 2 },
  { label: '70-80分', value: 3 },
  { label: '80-100分', value: 4 }
]

// 合同状态
// export const CONTRACT_STATUS = [
//   { label: '已合作', value: 1 },
//   { label: '未合作', value: 2 },
//   { label: '合作到期', value: 3 },
//   { label: '合作解除', value: 4 }
// ]

// 合作状态
export const COOPERATION_TYPE = [
  { label: '已签合同', value: 1 },
  { label: '合同解除', value: 7 },
  { label: '未跟进', value: 0 },
  { label: '测试中', value: 2 },
  { label: '洽谈中', value: 3 },
  { label: '被拒绝', value: 4 },
  { label: '拒绝对方', value: 5 },
  { label: '无法联系', value: 6 }
]

// 合同类型
export const CONTRACT_TYPE = [
  { label: '新签', value: 0 },
  { label: '续签', value: 1 }
]

// 合同状态
export const CONTRACT_STATE = [
  { label: '无效合同', value: 0 },
  { label: '有效合同', value: 1 },
  { label: '合同到期', value: 2 },
  { label: '合同解除', value: 3 }
]

// 结算周期
export const SETTLEMENT_INTERVAL = [
  { label: '月结', value: 0 },
  { label: '季结', value: 1 },
  { label: '年结', value: 2 }
]

// 合同类别
export const CONTRACT_CATEGORY = [
  { label: 'IP流量+课程类', value: 0 },
  { label: 'IP流量类', value: 1 },
  { label: '课程合作类', value: 2 }
]

export const PLATFORM = [
  { label: '百度好看视频', value: 1 },
  { label: 'B站视频', value: 2 },
  { label: '抖音视频', value: 3 },
  { label: '快手视频', value: 4 },
  { label: '小红书视频', value: 5 },
  { label: '微信视频号', value: 6 }
]

export const ASSESS_RESULT_All = [
  { label: '50分以下', value: 0 },
  { label: '50-60分', value: 1 },
  { label: '60-70分', value: 2 },
  { label: '70-80分', value: 3 },
  { label: '80-100分', value: 4 },
  { label: '博商在做', value: 5 },
  { label: '对手在做', value: 6 },
  { label: '合作失败', value: 10 },
  { label: '不考虑合作', value: 7 },
  { label: '不符合', value: 8 },
  { label: '黑名单', value: 9 },
  { label: '其他', value: 11 }
]

export const ASSESS_RESULT_OTHER = [
  { label: '博商在做', value: 5 },
  { label: '对手在做', value: 6 },
  { label: '合作失败', value: 10 },
  { label: '不考虑合作', value: 7 },
  { label: '不符合', value: 8 },
  { label: '黑名单', value: 9 },
  { label: '其他', value: 11 }
]

// 参与评估类型
export const ASSESS_BY_TYPE = [
  { label: '需要我评估的', value: 1 },
  { label: '我参与评估的', value: 2 }
]
