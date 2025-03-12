
import { parseTime } from '@/utils/index'
// 投放平台
export const launchPlatformOption = [
  { label: '巨量广告', value: 1, icon: 'juliangqianchuang' },
  { label: '腾讯广告', value: 3, icon: 'juliangqianchuang' },
  { label: '百度广告', value: 4, icon: 'juliangqianchuang' },
  { label: '巨量本地推', value: 6, icon: 'juliangqianchuang' },
  { label: '抖音企业号', value: 7, icon: 'juliangqianchuang' }
]

export function getColumns() {
  return [
    {
      prop: 'adPlatform',
      label: '投放平台',
      type: 'text',
      render: row => {
        return getOptionsValue(row.adPlatform, launchPlatformOption)
      }
    },
    { prop: 'advertiserId', label: '广告主ID', type: 'text' },
    { prop: 'fyAccount', label: '账号名称', type: 'text' },
    { prop: 'fyId', label: '账号ID', type: 'text' },
    { prop: 'userName', label: '员工姓名', type: 'text' },
    { prop: 'orgName', label: '投放部门', type: 'text' },
    { prop: 'action', label: '操作', type: 'slot' }
  ]
}

export function getColumns1() {
  return [
    { prop: 'platformName', label: '投放平台', type: 'text', visible: true },
    {
      prop: 'advertiserName',
      label: '账号名称',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    { prop: 'advertiserId', label: '账号ID', type: 'text', visible: true },
    {
      prop: 'accountRole',
      label: '账号类型',
      type: 'text',
      visible: true,
      render: row => {
        return row.accountRole === 1
          ? '代理商'
          : row.accountRole === 2
            ? '店铺'
            : row.accountRole === 3
              ? '抖音'
              : ''
      }
    },
    {
      prop: 'applicationName',
      label: '关联AppID名称 ',
      type: 'text',
      visible: true
    },
    {
      prop: 'interrelatedStatus',
      label: '关联状态',
      type: 'text',
      visible: true,
      render: row => {
        return row.interrelatedStatus === 1 ? '成功' : '失败'
      }
    },
    {
      prop: 'authorizedStatus',
      label: '授权状态',
      type: 'text',
      visible: true,
      render: row => {
        return row.authorizedStatus === 1 ? '成功' : '失败'
      }
    },
    {
      prop: 'tokenValid',
      label: 'token',
      type: 'text',
      visible: true,
      render: row => {
        return row.tokenValid ? '有效' : '失效'
      }
    },
    {
      prop: 'modifiedByName',
      label: '最近操作人',
      type: 'text',
      visible: true
    },
    {
      prop: 'lastModified',
      label: '最近操作时间',
      type: 'text',
      visible: true,
      slotFn: (row) => parseTime(row.lastModified)
    },
    {
      prop: 'action',
      width: '146px',
      label: '操作',
      type: 'slot',
      visible: true
    }
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
