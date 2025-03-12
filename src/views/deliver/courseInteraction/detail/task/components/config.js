export const formConfig = {
  ref: null,
  refText: 'fm',
  formData: {
    user: { label: 'userPhone', value: '' }, // 学员搜索
    time: [], // 提交日期
    // 训练状态
    punchTaskId: '', // 任务
    isFeatured: '',//是否精选
    // 采购状态
    isCommend: '', // 点评状态
    // 时间类型
    content: '', // 打卡内容
    // 开始时间
    startTime: '',
    // 结束时间
    endTime: ''
  },
  operatorSpan: 6,
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
    isCommendList: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 0,
        label: '未点评'
      },
      {
        value: 1,
        label: '已点评'
      }
    ]
  },
  fieldList: [
    // 形象名称
    {
      prop: 'user',
      label: '',
      slotName: 'user'
    },
    {
      prop: 'time',
      label: '提交日期',
      slotName: 'time'
    },
    // 训练状态
    {
      prop: 'punchTaskId',
      label: '任务',
      cpn: 'el-select',
      slotName: 'punchTaskId',
      className: ['children-ml0']
    },
    // 采购状态
    {
      prop: 'isCommend',
      label: '点评状态',
      cpn: 'el-select',
      slotName: 'isCommend',
      className: ['children-ml0']
    },
    {
      prop: 'isFeatured',
      label: '是否精选',
      cpn: 'el-select',
      slotName: 'isFeatured',
      className: ['children-ml0']
    },
    {
      prop: 'content',
      label: '打卡内容',
      slotName: 'content'
    },
  ]
}