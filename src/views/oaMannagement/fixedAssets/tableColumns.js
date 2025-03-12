// export const tableColumns = [
//   { prop: 'assetName', label: '资产名称', type: 'text', visible: true, disable: false, fixed: 'left' },
//   { prop: 'assetCode', label: '资产编号', type: 'text', disable: false, visible: true },
//   // { prop: 'originalAssetCode', label: '原资产编号', type: 'text', visible: true, disable: false, width: 110 },
//   { prop: 'specification', label: '规格/型号', type: 'text', visible: true, disable: false, width: 110 },
//   { prop: 'assetTypeName', label: '资产类型', type: 'text', disable: false, visible: true },
//   { prop: 'assetSubtypeName', label: '资产子类型', type: 'text', visible: true, disable: false, width: 110 },
//   { prop: 'configuration', label: '配置', type: 'text', disable: false, visible: true },
//   { prop: 'purchaseUserName', label: '购置人', type: 'text', disable: false, visible: true },
//   { prop: 'usableDuration', label: '可使用时长(单位/月)', type: 'text', visible: true, disable: false, width: 150 },
//   { prop: 'purchaseMoney', label: '购置金额', type: 'text', disable: false, visible: true },
//   { prop: 'depreciationMoney', label: '折旧后金额', type: 'text', visible: true, disable: false, width: 110 },
//   { prop: 'occupantDeptName', label: '使用部门', type: 'text', disable: false, visible: true },
//   { prop: 'occupantUserId', label: '使用人编号', type: 'text', visible: true, disable: false, width: 110 },
//   { prop: 'occupantUserName', label: '使用人', type: 'text', disable: false, visible: true },
//   { prop: 'originalOccupantUserName', label: '原使用人', type: 'text', disable: false, visible: true },
//   { prop: 'state', label: '使用状态', type: 'slot', visible: true, disable: false },
//   { prop: 'action', label: '操作', type: 'slot', visible: true, fixed: 'right', disable: true, width: 300 }
// ]

export const assetChangeRecordsColumns = [
  {
    prop: 'operateUserName',
    label: '操作人',
    type: 'text',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'createTime',
    label: '记录时间',
    type: 'slot',
    visible: true,
    sortable: 'custom',
    minWidth: 162
  },
  {
    prop: 'operateType',
    label: '操作类型',
    type: 'slot',
    visible: true,
    minWidth: 122
  },
  {
    prop: 'assetName',
    label: '资产名称',
    type: 'slot',
    visible: true,
    minWidth: 162,
    isHighlight: true
  },
  {
    prop: 'assetCode',
    label: '资产编号',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 130
  },
  {
    prop: 'originalAssetCode',
    label: '原资产编号',
    type: 'slot',
    visible: true,
    minWidth: 130,
    isHighlight: true
  },
  {
    prop: 'specification',
    label: '规格/型号',
    type: 'slot',
    visible: true,
    minWidth: 142,
    isHighlight: true
  },
  {
    prop: 'assetTypeName',
    label: '资产类型',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 142
  },
  {
    prop: 'assetSubtypeName',
    label: '资产子类型',
    type: 'slot',
    visible: true,
    minWidth: 142,
    isHighlight: true
  },
  {
    prop: 'configuration',
    label: '配置',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 142
  },
  {
    prop: 'number',
    label: '数量',
    type: 'slot',
    visible: true,
    minWidth: 122,
    isHighlight: true
  },
  {
    prop: 'purchaseDate',
    label: '购置日期',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'purchaseChannel',
    label: '购置渠道',
    type: 'slot',
    visible: true,
    minWidth: 132,
    isHighlight: true
  },
  {
    prop: 'purchaseCode',
    label: '购置编号',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 132
  },
  {
    prop: 'purchaseUserName',
    label: '购置人',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'usableDuration',
    label: '可使用时长(单位/月)',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 162
  },
  {
    prop: 'depreciationFormula',
    label: '折旧公式',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'purchaseMoney',
    label: '购置金额',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'depreciationMoney',
    label: '折旧后金额',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'state',
    label: '使用状态',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'occupantChainName',
    label: '使用部门',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 142
  },
  {
    prop: 'occupantUserId',
    label: '使用人编号',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 132
  },
  {
    prop: 'occupantUserName',
    label: '使用人',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'originalOccupantUserName',
    label: '原使用人',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 122
  },
  {
    prop: 'cityName',
    label: '资产使用/存放城市',
    type: 'slot',
    visible: true,
    minWidth: 160
  },
  {
    prop: 'assetLocation',
    label: '资产使用/存放详细地点',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 152
  },
  {
    prop: 'remark',
    label: '备注',
    type: 'slot',
    visible: true,
    isHighlight: true,
    minWidth: 152
  }
]

export function getTableColumns() {
  return [
    {
      prop: 'assetName',
      label: '资产名称',
      type: 'text',
      visible: true,
      disable: false,
      fixed: 'left',
      minWidth: 162
    },
    {
      prop: 'assetCode',
      label: '资产编号',
      type: 'slot',
      disable: false,
      visible: true,
      minWidth: 142
    },
    // { prop: 'originalAssetCode', label: '原资产编号', type: 'text', visible: true, disable: false, width: 110 },
    {
      prop: 'specification',
      label: '规格/型号',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 142
    },
    {
      prop: 'assetTypeName',
      label: '资产类型',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 142
    },
    {
      prop: 'assetSubtypeName',
      label: '资产子类型',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 142
    },
    {
      prop: 'configuration',
      label: '配置',
      type: 'text',
      disable: false,
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
      prop: 'purchaseUserName',
      label: '购置人',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'usableDuration',
      label: '可使用时长(单位/月)',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 162
    },
    {
      prop: 'purchaseMoney',
      label: '购置金额',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'depreciationMoney',
      label: '折旧后金额',
      type: 'text',
      visible: true,
      disable: false,
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
      prop: 'occupantUserId',
      label: '使用人编号',
      type: 'text',
      visible: true,
      disable: false,
      minWidth: 132
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
      prop: 'originalOccupantUserName',
      label: '原使用人',
      type: 'text',
      disable: false,
      visible: true,
      minWidth: 122
    },
    {
      prop: 'state',
      label: '使用状态',
      type: 'slot',
      visible: true,
      disable: false,
      minWidth: 132
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      fixed: 'right',
      disable: true,
      minWidth: 252
    }
  ]
}

export const assetConfirmRecordsColumns = [
  { prop: 'userName', label: '使用人', type: 'text' },
  { prop: 'assetsPhotoUrl', label: '编码照片', type: 'slot' },
  { prop: 'confirmTime', label: '确认时间', type: 'slot' }
]
