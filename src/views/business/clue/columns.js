// 投放平台
export const launchPlatformOption = [
  { label: '巨量广告', value: 1, icon: 'juliangqianchuang' },
  { label: '腾讯广告', value: 3, icon: 'juliangqianchuang' },
  { label: '百度广告', value: 4, icon: 'juliangqianchuang' },
  { label: '巨量本地推', value: 6, icon: 'juliangqianchuang' },
  { label: '抖音企业号', value: 7, icon: 'juliangqianchuang' }
]

// 投放类型
export const launchPlatOption = [
  // 巨量广告
  [
    { label: '字节-表单提交', value: 0 },
    { label: '字节-在线咨询', value: 1 },
    { label: '字节-智能电话', value: 2 },
    { label: '字节-网页回呼', value: 3 },
    { label: '字节-卡券', value: 4 },
    { label: '字节-抽奖', value: 5 }
  ],
  // 腾讯广告
  [
    { label: '腾讯-表单预约', value: 1 },
    { label: '腾讯-在线咨询', value: 2 },
    { label: '腾讯-普通电话', value: 3 },
    { label: '腾讯-智能电话', value: 4 },
    { label: '腾讯-发券', value: 5 },
    { label: '腾讯-智能咨询', value: 6 },
    { label: '腾讯-抽奖', value: 7 },
    { label: '腾讯-落地页点击', value: 8 },
    { label: '腾讯-一键授权', value: 9 },
    { label: '腾讯-加企业微信客服', value: 10 },
    { label: '腾讯-公众号关注', value: 11 },
    { label: '腾讯-个人微信加好友授权', value: 12 }
  ],
  // 百度广告
  [
    { label: '百度-咨询', value: 1 },
    { label: '百度-电话', value: 2 },
    { label: '百度-表单', value: 0 },
    { label: '百度-抽奖', value: 5 },
    { label: '百度-卡券', value: 4 },
    { label: '百度-回呼', value: 3 },
    { label: '百度-粉丝关注', value: 7 },
    { label: '百度-微信', value: 8 }
  ],
  [
    { label: '表单提交', value: 0 },
    { label: '在线咨询', value: 1 },
    { label: '智能电话', value: 2 },
    { label: '团购留资', value: 13 }
  ]
]

// 时间类型
export const searTimeOption = [
  { label: '线索入库时间', value: 1 },
  { label: '分配时间', value: 2 },
  { label: '首次跟单时间', value: 3 },
  { label: '首次出单时间', value: 4 }
]

// 成交意向
export const dealIntentionOption = [
  { label: '大6P', value: 1 },
  { label: '空', value: 0 }
]

// 线索信息
export const clueInfoOption = [
  { label: '姓名', value: 1 },
  { label: '手机号', value: 2 }
]

// 线索状态
export const clueTypeOption = [
  { label: '分配状态', value: 1 },
  { label: '转化状态', value: 2 },
  { label: '到场状态', value: 3 }
]

// 线索状态
// export const clueTypeStatus = [
//   { label: '已分配', value: 1 },
//   { label: '未分配', value: 0 }
// ]
export const clueTypeStatus = {
  1: [
    { label: '已分配', value: 1 },
    { label: '未分配', value: 0 }
  ],
  2: [
    { label: '已转化', value: 1 },
    { label: '未转化', value: 0 }
  ],
  3: [
    { label: '已到场', value: 1 },
    { label: '未到场', value: 0 }
  ]
}

export function getColumns() {
  return [
    { prop: 'clueId', label: '线索ID', type: 'text', width: '200px' },
    {
      prop: 'adPlatform',
      label: '投放平台',
      type: 'text',
      width: '200px',
      render: row => {
        return getOptionsValue(row.adPlatform, launchPlatformOption)
      }
    },
    { prop: 'advertiserId', label: '广告主ID', type: 'text', width: '200px' },
    { prop: 'userName', label: '推广人', type: 'text', width: '200px' },
    { prop: 'adName', label: '广告名称', type: 'text', width: '230px' },
    {
      prop: 'advertiserAccount',
      label: '账号ID',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'adProductDeptName',
      label: '投放部门',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'ocClueType',
      label: '投放类型',
      type: 'text',
      width: '200px',
      render: row => {
        const list =
        row.adPlatform === 1 ? launchPlatOption[0] : row.adPlatform === 3 ? launchPlatOption[1] : (row.adPlatform === 6 || row.adPlatform === 7) ? launchPlatOption[3] : launchPlatOption[2]
        return getOptionsValue(row.ocClueType, list)
      }
    },
    { prop: 'name', label: '姓名', type: 'text', width: '200px' },
    { prop: 'telephone', label: '手机号', type: 'slot', width: '200px' },
    {
      prop: 'likelyAddress',
      label: '意向上课地点',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'enterpriseProblem',
      label: '企业难题',
      type: 'text',
      width: '200px'
    },
    { prop: 'fromProblemDtos', label: '其他问题', align: 'center', type: 'slot', width: '200px' },
    { prop: 'clueCompany', label: '公司名称', type: 'text', width: '200px' },
    { prop: 'createdAt', label: '线索入库时间', type: 'text', width: '200px' },
    { prop: 'isDistributed', label: '分配状态', type: 'slot', align: 'center', width: '120px' },
    { prop: 'isSameContact', label: '是否撞单', type: 'slot', align: 'center', width: '120px' },
    {
      prop: 'erpDistributeUserName',
      label: '分配销售人员',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'erpDistributeTime',
      label: '分配时间',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'erpDistributeDeptName',
      label: '分配团队',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'erpFirstTrailTime',
      label: '首次跟单时间',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'erpPurchaseIntention',
      label: '成交意向',
      type: 'text',
      width: '200px',
      render: row => {
        return row.erpPurchaseIntention === 1 ? '大6P' : '空'
      }
    },
    { prop: 'isPurchased', label: '转化状态', width: '200px', type: 'slot' },
    {
      prop: 'erpConfirmTime',
      label: '首次转化时间',
      type: 'text',
      width: '200px'
    },
    {
      prop: 'erpPrice',
      label: '成交课程价格',
      width: '200px',
      type: 'slot',
      className: 'item-column'
    },
    {
      prop: 'erpGoodsName',
      label: '下单商品名称',
      width: '200px'
    },
    {
      prop: 'erpActualAmount',
      label: '实付金额',
      width: '200px'
    },
    { prop: 'hasCheckIn', label: '到场状态', width: '200px', type: 'slot' }
  ]
}

// option根据value取label
function getOptionsValue(value, arr) {
  // console.log(value, arr, 'value, arr')
  const obj = arr.find(v => v.value === value)
  if (obj) {
    return obj.label
  } else {
    return ''
  }
}
