const columns = [
  // {
  //   attrs: {
  //     type: 'selection'
  //   }
  // },
  {
    prop: 'code',
    width: 160,
    label: '直播间ID'
  },
  {
    prop: 'name',
    label: '直播间名称',
    width: 180,
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'appearSequence',
    width: 150,
    label: '出场顺序',
    attrs: {
      'show-overflow-tooltip': true
    }
  },
  {
    prop: 'type',
    width: 100,
    type: 'slot',
    label: '直播场景'
  },
  {
    prop: 'feesType',
    width: 100,
    type: 'slot',
    label: '直播类型'
  },
  {
    prop: 'liveModel',
    type: 'slot',
    width: 100,
    label: '直播模式'
  },
  {
    prop: 'teacherInfoDtoList',
    width: 120,
    type: 'slot',
    label: '讲师'
  },
  {
    prop: 'startTime',
    width: 170,
    type: 'slot',
    label: '开播时间'
  },
  {
    prop: 'liveDuration',
    width: 120,
    type: 'slot',
    label: '直播时长(分)'
  },
  {
    prop: 'doneOrderCount',
    label: '已付订单笔数',
    width: 140,
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '该字段数据5分钟更新一次',
              placement: 'top',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: {
                marginLeft: '5px'
              }
            })
          ]
        )
      ])
    }
  },
  {
    prop: 'gmv',
    label: '已付GMV',
    width: 140,
    type: 'slot',
    renderHeader: (h, { column }) => {
      return h('span', [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '该字段数据5分钟更新一次',
              placement: 'top',
              effect: 'dark'
            }
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: {
                marginLeft: '5px'
              }
            })
          ]
        )
      ])
    }
  },
  {
    prop: 'status',
    type: 'slot',
    width: 100,
    label: '直播状态'
  },
  {
    prop: 'createUserName',
    width: 120,
    label: '创建人'
  },
  {
    prop: 'createTime',
    type: 'slot',
    width: 170,
    label: '创建时间'
  },
  {
    prop: 'operate',
    type: 'slot',
    fixed: 'right',
    width: 320,
    label: '操作'
  }
]
const formConfig = {
  ref: null,
  refText: 'myfm',
  formData: {
    liveRoomCodeOrliveRoomName: 'liveRoomName',
    liveRoomCodeOrliveRoomNameVal: '',
    liveRoomCode: undefined, // 直播间ID
    liveRoomName: undefined, // 直播名称
    liveModel: '',
    realityTeacherUserIdOrvideoTeacherId: 'realityTeacherUserId', // 讲师
    realityTeacherUserId: '', // 真人讲师
    videoTeacherId: '', // 录播讲师
    createUserId: '', // 创建人
    teacherId: undefined,
    teacherName: undefined,
    time1ortime2: 'time1',
    time1ortime2Val: undefined,
    status: '', // 直播状态
    time1: '', // 开播时间
    time2: '', // 创建时间
    type: '', // 直播场景
    feesType: '' // 直播类型
  },
  operatorSpan: 24,
  optionsObj: {
    liveModel: [
      {
        value: '',
        label: '全部'
      },
      {
        value: 'PERSON_LIVE',
        label: '真人直播'
      },
      {
        value: 'AI_LIVE',
        label: '数字直播'
      }
    ]
  },
  fieldList: [
    {
      prop: 'liveRoomCodeOrliveRoomName',
      label: '', // 直播间ID,直播名称
      slotName: 'liveRoomCodeOrliveRoomName',
      className: ['children-ml0']
    },
    {
      prop: 'liveModel',
      label: '直播模式',
      cpn: 'el-select',
      eventHandler: {},
      selectOption: {
        label: 'label',
        value: 'value'
      },
      className: ['children-ml0']
    },
    {
      isHide: true,
      slotName: 'js',
      className: ['children-ml0']
    },
    {
      prop: 'status',
      label: '直播状态',
      slotName: 'status',
      className: ['children-ml0']
    },
    {
      prop: 'createUserId',
      label: '创建人',
      slotName: 'createUserId',
      className: ['children-ml0']
    },
    {
      prop: 'time1ortime2',
      slotName: 'time1ortime2',
      className: ['children-ml0']
    },
    {
      prop: 'type',
      label: '直播场景',
      slotName: 'type',
      className: ['children-ml0 ', 'not-bd']
    },
    {
      prop: 'feesType',
      label: '直播类型',
      slotName: 'feesType',
      span: 2.5,
      className: ['children-ml0 ', 'not-bd']
    }
  ]
}
export { columns, formConfig }
