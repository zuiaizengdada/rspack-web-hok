export const formConfig = {
  ref: null,
  refText: 'fm',
  formData: {
    // 形象名称
    name: '',
    // 训练状态
    trainingStatus: '',
    // 采购状态
    purchaseStatus: '',
    // 时间类型
    timeType: 1,
    // 开始时间
    startTime: '',
    // 结束时间
    endTime: '',
    type: 1,
    characterId: ''
  },
  operatorSpan: 24,
  optionsObj: {
    // 训练状态
    trainingStatus: [
      {
        value: 1,
        label: '排队中'
      },
      {
        value: 2,
        label: '训练中'
      },
      {
        value: 3,
        label: '训练失败'
      },
      {
        value: 4,
        label: '已完成'
      }
    ],
    // 采购状态
    purchaseStatus: [
      {
        value: 0,
        label: '未确认'
      },
      {
        value: 1,
        label: '确认采购'
      },
      {
        value: 2,
        label: '确认不采购'
      }
    ]
  },
  fieldList: [
    // 形象名称
    {
      prop: 'name',
      label: '形象名称',
      slotName: 'name'
    },
    // 形象id
    {
      prop: 'characterId',
      label: '形象ID',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    // 训练状态
    {
      prop: 'trainingStatus',
      label: '训练状态',
      cpn: 'el-select',
      slotName: 'trainingStatus',
      className: ['children-ml0']
    },
    // 采购状态
    {
      prop: 'purchaseStatus',
      label: '采购状态',
      cpn: 'el-select',
      slotName: 'purchaseStatus',
      className: ['children-ml0']
    },
    // 创建时间/确认时间
    {
      prop: 'createTimeorconfirmTime',
      slotName: 'createTimeorconfirmTime',
      className: ['children-ml0']
    }
  ]
}

export const voiceFormConfig = {
  ef: null,
  refText: 'fm',
  formData: {
    // 声音名称
    name: '',
    // 训练状态
    trainingStatus: '',
    // 采购状态
    purchaseStatus: '',
    // 时间类型
    timeType: 1,
    // 开始时间
    startTime: '',
    // 结束时间
    endTime: '',
    type: 1,
    voiceId: ''
  },
  operatorSpan: 24,
  optionsObj: {
    // 训练状态
    trainingStatus: [
      {
        value: 1,
        label: '排队中'
      },
      {
        value: 2,
        label: '训练中'
      },
      {
        value: 3,
        label: '训练失败'
      },
      {
        value: 4,
        label: '已完成'
      }
    ],
    // 采购状态
    purchaseStatus: [
      {
        value: 0,
        label: '未确认'
      },
      {
        value: 1,
        label: '确认采购'
      },
      {
        value: 2,
        label: '确认不采购'
      }
    ]
  },
  fieldList: [
    // 声音名称
    {
      prop: 'name',
      label: '声音名称',
      slotName: 'name'
    },
    {
      prop: 'voiceId',
      label: '声音ID',
      cpn: 'el-input',
      className: ['children-ml0']
    },
    // 训练状态
    {
      prop: 'trainingStatus',
      label: '训练状态',
      cpn: 'el-select',
      slotName: 'trainingStatus',
      className: ['children-ml0']
    },
    // 采购状态
    {
      prop: 'purchaseStatus',
      label: '采购状态',
      cpn: 'el-select',
      slotName: 'purchaseStatus',
      className: ['children-ml0']
    },
    // 创建时间/确认时间
    {
      prop: 'createTimeorconfirmTime',
      slotName: 'createTimeorconfirmTime',
      className: ['children-ml0']
    }
  ]
}
