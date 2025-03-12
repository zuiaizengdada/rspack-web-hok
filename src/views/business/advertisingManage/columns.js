export const statusMap = {
  DELIVERY_OK: '投放中',
  AUDIT: '新建审核中',
  REAUDIT: '修改审核中',
  DELETE: '已删除',
  DISABLE: '已暂停',
  AD_DISABLE: '广告计划已暂停',
  TIME_NO_REACH: '未达到投放时间',
  TIME_DONE: '已完成',
  NO_SCHEDULE: '不在投放时段',
  CREATE: '创意创建',
  FROZEN: '已终止',
  OFFLINE_AUDIT: '审核不通过',
  AD_OFFLINE_BUDGET: '广告计划超出预算',
  OFFLINE_BALANCE: '账户余额不足',
  AD_PRE_OFFLINE_BUDGET: '广告计划接近预算',
  PRE_ONLINE: '预上线',
  AD_REAUDIT: '广告计划修改审核中',
  AD_AUDIT: '广告计划新建审核中',
  AD_OFFLINE_AUDIT: '广告计划审核不通过',
  ERROR: '数据错误',
  AD_EXTERNAL_URL_DISABLE: '计划落地页不可用',
  LIVE_CAN_NOT_LAUNCH: '直播间状态不可投',
  AWEME_ITEM_DISABLED: '关联抖音视频不可投',
  CAMPAIGN_DISABLE: '已被广告组暂停',
  CAMPAIGN_OFFLINE_BUDGET: '广告组超出预算',
  CAMPAIGN_PREOFFLINE_BUDGET: '广告组接近预算'
}
export function getColumns() {
  return [
    { prop: 'platformName', label: '投放平台', type: 'text', visible: true },
    { prop: 'departmentName', label: '投放部门', type: 'text', visible: true },
    { prop: 'staffName', label: '投手', type: 'text', visible: true },
    {
      prop: 'adName',
      label: '广告计划名称 ',
      width: '120',
      type: 'text',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'adId',
      label: '广告计划ID ',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'title',
      label: '广告创意名称',
      type: 'text',
      width: '120',
      'show-overflow-tooltip': true,
      visible: true
    },
    {
      prop: 'creativeId',
      label: '广告创意ID',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'status',
      label: '投放状态',
      type: 'text',
      visible: true,
      render: row => {
        return statusMap[row.status]
      }
    },
    { prop: 'totalShowCnt', label: '曝光数', type: 'text', visible: true },
    { prop: 'totalClickCnt', label: '点击数', type: 'text', visible: true },
    { prop: 'totalClickRatio', label: '点击率', type: 'text', visible: true },
    {
      prop: 'cpcPlatform',
      label: '平均点击单价',
      type: 'text',
      width: '120',
      visible: true
    },
    {
      prop: 'totalCpmPlatform',
      label: '千次展示费用',
      width: '120',
      type: 'text',
      visible: true
    },
    { prop: 'totalStatCost', label: '花费', type: 'text', visible: true },
    {
      prop: 'payOrderCount',
      label: '直接成交数量',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'totalPayOrderCount',
      label: '总成交数量',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'payOrderAmount',
      label: '直接成交业绩',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'totalPayOrderAmount',
      label: '总业绩',
      type: 'text',
      visible: true
    },
    {
      prop: 'totalPrepayAndPayOrderRoi',
      label: '直接支付ROI',
      width: '120',
      type: 'text',
      visible: true
    },
    { prop: 'totalRoi', label: '总ROI', type: 'text', visible: true }
  ]
}
export function getColumns1() {
  return [
    { prop: 'expertChannel', label: '投放平台', type: 'slot', visible: true },
    {
      prop: 'expertName',
      label: '投放账号名称',
      type: 'text',
      width: '120',
      visible: true,
      'show-overflow-tooltip': true
    },
    { prop: 'expertId', label: '投放部门', type: 'text', visible: true },
    { prop: 'operateName', label: '投手', type: 'text', visible: true },
    {
      prop: 'departmentName',
      label: '广告计划名称 ',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'departmentName',
      label: '广告计划ID ',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'departmentName',
      label: '广告创意名称',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'departmentName',
      label: '广告创意ID',
      width: '120',
      type: 'text',
      visible: true
    },
    { prop: 'departmentName', label: '投放状态', type: 'text', visible: true },
    { prop: 'departmentName', label: '曝光数', type: 'text', visible: true },
    { prop: 'departmentName', label: '点击数', type: 'text', visible: true },
    { prop: 'departmentName', label: '点击率', type: 'text', visible: true },
    {
      prop: 'departmentName',
      label: '平均点击单价',
      type: 'text',
      width: '120',
      visible: true
    },
    {
      prop: 'departmentName',
      label: '千次展示费用',
      width: '120',
      type: 'text',
      visible: true
    },
    { prop: 'departmentName', label: '花费', type: 'text', visible: true },
    {
      prop: 'departmentName',
      label: '直接成交数量',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'departmentName',
      label: '总成交数量',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'departmentName',
      label: '直接成交业绩',
      width: '120',
      type: 'text',
      visible: true
    },
    { prop: 'departmentName', label: '总业绩', type: 'text', visible: true },
    {
      prop: 'departmentName',
      label: '直接支付ROI',
      width: '120',
      type: 'text',
      visible: true
    },
    { prop: 'departmentName', label: '总ROI', type: 'text', visible: true }
  ]
}
