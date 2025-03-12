export const statusMap = {
  DELIVERY_OK: '投放中',
  AUDIT: '新建审核中',
  REAUDIT: '修改审核中',
  DELETE: '已删除',
  DISABLE: '已暂停',
  DRAFT: '草稿',
  TIME_NO_REACH: '未到投放时间',
  TIME_DONE: '已完成',
  NO_SCHEDULE: '不在投放时段',
  CREATE: '计划新建',
  OFFLINE_AUDIT: '审核不通过',
  OFFLINE_BUDGET: '广告预算不足（已超出预算）',
  OFFLINE_BALANCE: '账户余额不足',
  PRE_OFFLINE_BUDGET: '广告预算不足（即将超出预算）',
  PRE_ONLINE: '预上线',
  FROZEN: '已终止',
  ERROR: '数据错误',
  AUDIT_STATUS_ERROR: '异常，请联系审核人员',
  ADVERTISER_OFFLINE_BUDGET: '账户超出预算',
  ADVERTISER_PRE_OFFLINE_BUDGET: '账户接近预算',
  EXTERNAL_URL_DISABLE: '落地页暂不可用',
  LIVE_ROOM_OFF: '落地关联直播间未开播页暂不可用',
  CAMPAIGN_DISABLE: '已被广告组暂停',
  CAMPAIGN_OFFLINE_BUDGET: '广告组超出预算',
  CAMPAIGN_PREOFFLINE_BUDGET: '广告组接近预算',
  SYSTEM_DISABLE: '系统暂停',
  QUOTA_DISABLE: '在投计划配额超限'
}

export function getColumns() {
  return [
    { prop: 'platformName', label: '投放平台', type: 'text', visible: true },
    {
      prop: 'advertiserName',
      label: '投放账号',
      type: 'text',
      visible: true
    },
    {
      prop: 'advertiserId',
      label: '投放账号ID ',
      type: 'text',
      visible: true
    },
    { prop: 'departmentName', label: '投放部门', type: 'text', visible: true },
    { prop: 'staffName', label: '投手', type: 'text', visible: true }
  ]
}

export function getColumns1() {
  return [
    { prop: 'platformName', label: '投放平台', type: 'text', visible: true },
    {
      prop: 'advertiserName',
      label: '投放账号',
      type: 'text',
      visible: true
    },
    {
      prop: 'advertiserId',
      label: '投放账号ID ',
      type: 'text',
      visible: true
    },
    { prop: 'departmentName', label: '投放部门', type: 'text', visible: true },
    { prop: 'staffName', label: '投手', type: 'text', visible: true },
    { prop: 'campaignName', label: '广告组名称', type: 'text', visible: true },
    { prop: 'campaignId', label: '广告组ID', type: 'text', visible: true },
    {
      prop: 'status',
      label: '广告组状态',
      type: 'text',
      visible: true,
      render: row => {
        return row.status === 'ENABLE'
          ? '启用计划'
          : row.status === 'REVIVE'
            ? '复活续投计划'
            : row.status === 'DELETE'
              ? '删除计划'
              : row.status === 'DISABLE'
                ? '暂停计划'
                : ''
      }
    },
    {
      prop: 'interrelatedStatus',
      label: '关联状态',
      type: 'text',
      visible: true,
      render: row => {
        return row.interrelatedStatus === 1 ? '关联中' : '未关联'
      }
    },
    { prop: 'action', label: '操作', type: 'slot' }
  ]
}

export function getColumns2() {
  return [
    { prop: 'platformName', label: '投放平台', type: 'text', visible: true },
    {
      prop: 'advertiserName',
      label: '投放账号',
      type: 'text',
      visible: true
    },
    {
      prop: 'advertiserId',
      label: '投放账号ID ',
      type: 'text',
      visible: true
    },
    { prop: 'departmentName', label: '投放部门', type: 'text', visible: true },
    { prop: 'staffName', label: '投手', type: 'text', visible: true },
    { prop: 'adPlanName', label: '广告计划名称', type: 'text', visible: true },
    { prop: 'adPlanId', label: '广告计划ID', type: 'text', visible: true },
    {
      prop: 'status',
      label: '广告计划状态',
      type: 'text',
      visible: true,
      render: row => {
        return statusMap[row.status]
      }
    },
    {
      prop: 'interrelatedStatus',
      label: '关联状态',
      type: 'text',
      visible: true,
      render: row => {
        return row.interrelatedStatus === 1 ? '关联中' : '未关联'
      }
    },
    { prop: 'action', label: '操作', type: 'slot' }
  ]
}
