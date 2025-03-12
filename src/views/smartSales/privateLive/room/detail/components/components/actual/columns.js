const columns = [
  {
    prop: 'teacherName',
    label: '邀请人',
    fixed: true
  },
  {
    prop: 'studentAvatarUrl',
    label: '学员头像',
    type: 'slot',
    fixed: true
  },
  {
    prop: 'studentName',
    label: '学员昵称',
    width: 140,
    atts: {
      'show-overflow-tooltip': true
    },
    fixed: true
  },
  {
    prop: 'studentPhone',
    label: '手机号码',
    width: 160,
    type: 'slot',
    fixed: true
  },
  {
    prop: 'email',
    type: 'slot',
    width: 230,
    label: '邮箱'
  },
  {
    prop: 'isApply',
    label: '是否报名'
  },
  {
    prop: 'applyTime',
    label: '报名时间',
    width: 140
  },
  {
    prop: 'userType',
    label: '是否游客'
  },
  {
    prop: 'firstEntryTime',
    label: '首次进入时间',
    width: 140
  },
  {
    prop: 'lastDepartureTime',
    label: '最后离开时间',
    width: 140
  },
  {
    prop: 'listenClassTime',
    label: '直播听课时长（分）',
    width: 180,
    attrs: {
      sortable: 'custom'
    }
  },
  {
    prop: 'playbackListenClassTime',
    label: '回放听课时长（分）',
    width: 180,
    attrs: {
      sortable: 'custom'
    }
  },
  {
    prop: 'totalListenClassTime',
    label: '总听课时长（分）',
    width: 180,
    attrs: {
      sortable: 'custom'
    }
  },
  {
    prop: 'isAttendClass',
    label: '是否到课'
  },
  {
    prop: 'isFinishClass',
    label: '是否完课'
  },
  {
    prop: 'isWatchPlayback',
    label: '是否看回放',
    width: 140
  }
]
const formConfig = {
  ref: null,
  formData: {
    teacherId: '', // 邀请人
    keywordVal: undefined, //
    keyword: 'studentPhone', //   学员昵称,手机号，邮箱
    isAttendClass: '', // 是否到课
    isFinishClass: '', // 是否完课
    isWatchPlayback: '', // 是否看回看
    userType: undefined, // 是否游客
    time1: undefined, // 首次进入时间
    time2: undefined, // 回看听课时长
    time3: undefined, // 总听课时长
    studentUserId: undefined, // 学员用户ID
    existInviteTeacher: true // 仅查看邀约学员
  },
  operatorSpan: 21,
  optionsObj: {
    isAttendClass: [
      {
        value: '',
        label: '全部'
      },
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ],
    isFinishClass: [
      {
        value: '',
        label: '全部'
      },
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ],
    isWatchPlayback: [
      {
        value: '',
        label: '全部'
      },
      {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      }
    ],
    userType: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 2,
        label: '是'
      },
      {
        value: 1,
        label: '否'
      }
    ]
  },
  fieldList: [
    {
      prop: 'teacherId',
      label: '邀请人',
      slotName: 'teacherId',
      className: ['children-ml0']
    },
    {
      prop: 'keyword',
      label: '',
      slotName: 'keyword',
      className: ['children-ml0']
    },
    {
      prop: 'isAttendClass',
      label: '是否到课',
      cpn: 'el-select',
      placeholder: '请选择',
      span: 3,
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'isFinishClass',
      label: '是否完课',
      cpn: 'el-select',
      placeholder: '请选择',
      span: 3,
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'isWatchPlayback',
      label: '是否看回看',
      placeholder: '请选择',
      cpn: 'el-select',
      span: 3,
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'userType',
      label: '是否游客',
      cpn: 'el-select',
      placeholder: '请选择',
      span: 3,
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      prop: 'time1',
      label: '首次进入时间',
      cpn: 'el-date-picker',
      bind: {
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '请输入',
        'default-time': ['00:00:00', '23:59:59'],
        format: 'yyyy-MM-dd HH:mm',
        'value-format': 'yyyy-MM-dd HH:mm',
        endPlaceholder: '请输入'
      },
      className: ['children-ml0']
    },
    {
      prop: 'time4',
      label: '直播听课时长',
      slotName: 'time4',
      className: ['children-ml0']
    },
    {
      prop: 'time2',
      label: '回看听课时长',
      slotName: 'time2',
      className: ['children-ml0']
    },
    {
      prop: 'time3',
      label: '总听课时长',
      slotName: 'time3',
      className: ['children-ml0']
    },
    {
      prop: 'existInviteTeacher',
      label: '仅查看邀约学员',
      cpn: 'el-checkbox',
      eventHandler: {},
      span: 3,
      className: ['children-ml0', 'not-bd']
    }
  ]
}
export { columns, formConfig }
