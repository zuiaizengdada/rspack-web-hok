// export const tableColumns = [
//   { prop: 'phoneNumber', label: '手机号', type: 'text', visible: true, disable: false, fixed: 'left' },
//   { prop: 'embryoEndNumber', label: '卡胚编码尾号', type: 'text', visible: true, disable: false, width: 160 },
//   { prop: 'communicationCompany', label: '通信公司', type: 'slot', visible: true, disable: false, width: 110 },
//   { prop: 'issuerName', label: '开卡人', type: 'text', visible: true, disable: false, width: 110 },
//   { prop: 'occupantUserId', label: '使用人编号', type: 'text', disable: false, visible: true, width: 130 },
//   { prop: 'occupantUserName', label: '使用人', type: 'text', disable: false, visible: true, width: 110 },
//   { prop: 'occupantDeptName', label: '使用部门', type: 'text', disable: false, visible: true },
//   { prop: 'occupantDate', label: '领用日期', type: 'text', disable: false, visible: true },
//   { prop: 'originalOccupantUserName', label: '原使用人', type: 'text', disable: false, visible: true, width: 150 },
//   { prop: 'weMediaAccountNumber', label: '自媒体账号', type: 'slot', disable: false, visible: true, width: 130 },
//   { prop: 'userStatus', label: '使用状态', type: 'slot', disable: false, visible: true },
//   { prop: 'remark', label: '备注', type: 'text', disable: false, visible: true },
//   { prop: 'action', label: '操作', type: 'slot', visible: true, fixed: 'right', disable: true, width: 220 }
// ]
import { hasValue } from '@/utils/index'

export const phoneChangeRecordsColumns = [
  {
    prop: 'operateUserName',
    label: '操作人',
    type: 'text',
    visible: true,
    minWidth: 112
  },
  {
    prop: 'createTime',
    label: '记录时间',
    type: 'slot',
    visible: true,
    minWidth: 162,
    sortable: 'custom'
  },
  {
    prop: 'operateType',
    label: '操作类型',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'phoneNumber',
    label: '手机号',
    type: 'slot',
    visible: true,
    minWidth: 132
  },
  {
    prop: 'embryoEndNumber',
    label: '卡胚编码尾号',
    type: 'slot',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'communicationCompany',
    label: '通信公司',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'issuerName',
    label: '开卡人',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'cityName',
    label: '开卡地',
    type: 'slot',
    visible: true,
    minWidth: 160
  },
  {
    prop: 'occupantUserId',
    label: '使用人编号',
    type: 'slot',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'occupantUserName',
    label: '使用人',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'occupantDeptName',
    label: '使用部门',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'occupantDate',
    label: '领用日期',
    type: 'slot',
    disable: false,
    visible: true,
    minWidth: 122
  },
  {
    prop: 'originalOccupantUserName',
    label: '原使用人',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'state',
    label: '使用状态',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  { prop: 'remark', label: '备注', type: 'slot', visible: true, minWidth: 142 }
]
export function getTableColumns() {
  return [
    {
      prop: 'phoneNumber',
      label: '手机号',
      type: 'text',
      visible: true,
      disable: false,
      fixed: 'left',
      minWidth: 132
    },
    {
      prop: 'embryoEndNumber',
      label: '卡胚编码尾号',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 142
    },
    {
      prop: 'communicationCompany',
      label: '通信公司',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 122
    },
    {
      prop: 'issuerName',
      label: '开卡人',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 122
    },
    {
      prop: 'cityName',
      label: '开卡地',
      type: 'slot',
      visible: true,
      minWidth: 160
    },
    {
      prop: 'occupantUserId',
      label: '使用人编号',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 142
    },
    {
      prop: 'occupantUserName',
      label: '使用人',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'occupantChainName',
      label: '使用部门',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'occupantDate',
      label: '领用日期',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'originalOccupantUserName',
      label: '原使用人',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'weMediaAccountNumber',
      label: '自媒体账号',
      type: 'slot',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'state',
      label: '使用状态',
      type: 'slot',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'remark',
      label: '备注',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 142
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      disable: true,
      minWidth: 212
    }
  ]
}

export function filterData(val) {
  if (!hasValue(val)) {
    return '-'
  }
  return val
}

export const phoneComfirmRecordsColumns = [
  { prop: 'userName', label: '使用人', type: 'text' },
  { prop: 'confirmTime', label: '确认时间', type: 'slot' }
]
