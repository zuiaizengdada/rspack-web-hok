import { hasValue } from '@/utils/index'

export const fixedAssetsTableColumns = [
  {
    prop: 'assetName',
    label: '资产名称',
    type: 'text',
    visible: true,
    minWidth: 142,
    fixed: 'left'
  },
  {
    prop: 'assetCode',
    label: '资产编号',
    type: 'slot',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'specification',
    label: '规格/型号',
    type: 'text',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'assetTypeName',
    label: '资产类型',
    type: 'text',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'assetSubtypeName',
    label: '资产子类型',
    type: 'text',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'configuration',
    label: '配置',
    type: 'text',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'cityName',
    label: '资产使用/存放城市',
    type: 'slot',
    visible: true,
    minWidth: 160
  },
  {
    prop: 'occupantChainName',
    label: '使用部门',
    type: 'text',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'occupantUserId',
    label: '使用人编号',
    type: 'text',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'occupantUserName',
    label: '使用人',
    type: 'text',
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
    prop: 'assetsPhotoUrl',
    label: '编码照片',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'lastNoticeTime',
    label: '上次通知时间',
    type: 'slot',
    visible: true,
    minWidth: 162
  },
  {
    prop: 'confirmStatus',
    label: '确认状态',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'action',
    label: '操作',
    type: 'slot',
    visible: true,
    fixed: 'right',
    disable: true,
    minWidth: 160
  }
]
export const phoneCardTableColumns = [
  {
    prop: 'phoneNumber',
    label: '手机号',
    type: 'text',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'embryoEndNumber',
    label: '卡胚编码尾号',
    type: 'text',
    visible: true,
    minWidth: 162
  },
  {
    prop: 'communicationCompany',
    label: '通信公司',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'cityName',
    label: '开卡地',
    type: 'slot',
    visible: true,
    minWidth: 132
  },
  {
    prop: 'issuerName',
    label: '开卡人',
    type: 'text',
    visible: true,
    minWidth: 142
  },
  {
    prop: 'occupantUserId',
    label: '使用人编号',
    type: 'text',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'occupantUserName',
    label: '使用人',
    type: 'text',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'occupantChainName',
    label: '使用部门',
    type: 'text',
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
    visible: true,
    minWidth: 122
  },
  {
    prop: 'lastNoticeTime',
    label: '上次通知时间',
    type: 'slot',
    visible: true,
    minWidth: 162
  },
  {
    prop: 'confirmStatus',
    label: '确认状态',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'action',
    label: '操作',
    type: 'slot',
    visible: true,
    fixed: 'right',
    disable: true,
    minWidth: 160
  }
]
export function getTableColumns() {
  return [
    {
      prop: 'id',
      label: '流程编号',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 132
    },
    {
      prop: 'createUser',
      label: '创建人',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 142
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 142
    },
    {
      prop: 'assetType',
      label: '类型',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 122
    },
    {
      prop: 'assetCount',
      label: '资产数',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 122
    },
    {
      prop: 'waitConfirm',
      label: '待确认数',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 142
    },
    {
      prop: 'confirmCount',
      label: '已确认数',
      type: 'text',
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
      prop: 'confirmStatus',
      label: '确认状态',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 122
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      disable: true,
      minWidth: 160
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
