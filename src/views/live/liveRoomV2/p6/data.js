// 实际看播用户
export const actualWatchusersOpts = (onChange = () => { }) => {
  return {
    form: {
      ref: null,
      formData: {
        teacherId: '',
        userInfo: {
          label: 'phone',
          options: [
            { label: '手机号', value: 'phone' },
            { label: '学员昵称', value: 'studentUserId' },
            { label: '邮箱', value: 'email' }
          ],
          value: {
            phone: '',
            studentUserId: '',
            nickName: '',
            email: ''
          }
        },
        isApply: '',
        isAttendClass: '',
        isFinishClass: '',
        isWatchPlayback: '',
        userType: '',
        existInviteTeacher: true
      },
      operatorSpan: 6,
      optionsObj: {
        teacherId: [],
        billStatus: [{ code: '', message: '全部' }],
        isApply: [
          { label: '全部', value: '' },
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        isAttendClass: [
          { label: '全部', value: '' },
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        isFinishClass: [
          { label: '全部', value: '' },
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        isWatchPlayback: [
          { label: '全部', value: '' },
          { label: '是', value: true },
          { label: '否', value: false }
        ],
        userType: [
          { label: '全部', value: '' },
          { label: '是', value: 2 },
          { label: '否', value: 1 }
        ]
      },
      fieldList: [
        {
          prop: 'teacherId',
          label: '邀请人',
          cpn: 'el-select',
          selectOption: { label: 'nickName', value: 'userId' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'userInfo',
          slotName: 'userInfo',
          className: ['children-ml0'],
          onChange: onChange,
          span: 5
        },
        {
          prop: 'isApply',
          label: '是否报名',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'isAttendClass',
          label: '是否到课',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'isFinishClass',
          label: '是否完课',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'isWatchPlayback',
          label: '是否看回放',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'userType',
          label: '是否游客',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'existInviteTeacher',
          label: '仅查看邀约学员',
          span: 2.5,
          cpn: 'el-checkbox',
          className: ['children-ml0', 'not-bd'],
          eventHandler: { change: onChange }
        }
      ]
    }
  }
}

// 领券记录
export const couponRecordOpts = (onChange = () => { }) => {
  return {
    form: {
      ref: null,
      formData: {
        userInfo: {
          label: 'phone',
          options: [
            { label: '手机号', value: 'phone' },
            { label: '学员昵称', value: 'studentUserId' },
            { label: '邮箱', value: 'email' }
          ],
          value: {
            phone: '',
            studentUserId: '',
            nickName: '',
            email: ''
          }
        },
        applyStatus: '',
        inviteTeacherId: '',
        existInviteTeacher: true
      },
      // operatorSpan: 4,
      operatorSpan: 6,
      optionsObj: {
        inviteTeacherId: [],
        applyStatus: [
          { label: '全部', value: '' },
          { label: '未使用', value: 0 },
          { label: '已使用', value: 1 }
        ]
      },
      fieldList: [
        {
          prop: 'userInfo',
          slotName: 'userInfo',
          className: ['children-ml0'],
          onChange: onChange,
          span: 5
        },
        {
          prop: 'applyStatus',
          label: '使用状态',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'inviteTeacherId',
          label: '邀请人',
          cpn: 'el-select',
          selectOption: { label: 'nickName', value: 'userId' },
          className: ['children-ml0'],
          eventHandler: { change: onChange },
          span: 5
        },
        {
          prop: 'existInviteTeacher',
          label: '仅查看邀约学员',
          span: 2.5,
          cpn: 'el-checkbox',
          className: ['children-ml0', 'not-bd'],
          eventHandler: { change: onChange }
        }
      ]
    }
  }
}

// 计划看播用户-关联任务线索
export const relatedTaskCluesOpts = (onChange = () => { }) => {
  return {
    form: {
      ref: null,
      formData: {
        teacherId: '',
        userInfo: {
          label: 'phone',
          options: [
            { label: '手机号', value: 'phone' },
            { label: '学员昵称', value: 'studentUserId' },
            { label: '邮箱', value: 'email' }
          ],
          value: {
            phone: '',
            studentUserId: '',
            nickName: '',
            email: ''
          }
        },
        taskName: '',
        taskId: '',
        orderStatus: '',
        isAttendance: 2,
        channelId: ''
      },
      operatorSpan: 6,
      optionsObj: {
        teacherId: [],
        isAttendance: [
          { label: '全部', value: 2 },
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ],
        taskName: [],
        // 1:未支付 2:支付成功 3:超时已关闭 4:用户已取消 5:退款中 6:部分退款 7:全部退款 8:交易结束 9:没有向第三方发起支付请求 10:退款金额异常
        orderStatus: [
          {
            value: '',
            label: '全部'
          },
          {
            value: 1,
            label: '未支付'
          },
          {
            value: 2,
            label: '支付成功'
          },
          {
            value: 3,
            label: '超时已关闭'
          },
          {
            value: 4,
            label: '用户已取消'
          },
          {
            value: 5,
            label: '退款中'
          },
          {
            value: 6,
            label: '部分退款'
          },
          {
            value: 7,
            label: '全部退款'
          },
          {
            value: 8,
            label: '交易结束'
          },
          {
            value: 9,
            label: '没有向第三方发起支付请求'
          },
          {
            value: 10,
            label: '退款金额异常'
          }
        ],
        channelId: [
          { value: '', label: '全部' },
          { value: 1, label: '抖店' },
          { value: 2, label: '快手小店' },
          { value: 4, label: '微店' },
          { value: 7, label: '小鹅通' },
          { value: 10, label: '视频号小店' },
          { value: 11, label: '枫叶小店' },
          { value: 12, label: '抖音小程序' },
          { value: 13, label: '直播间' },
          { value: 14, label: '平台自营' },
          { value: 15, label: '微信小程序' },
          { value: 16, label: '小红书' },
          { value: 17, label: '线下录单' },
          { value: 18, label: 'B站' },
          { value: 20, label: '百度小店' }
        ]
      },
      fieldList: [
        {
          prop: 'teacherId',
          label: '跟进人',
          cpn: 'el-select',
          selectOption: { label: 'nickName', value: 'userId' },
          className: ['children-ml0'],
          eventHandler: { change: onChange }
        },
        {
          prop: 'userInfo',
          slotName: 'userInfo',
          className: ['children-ml0'],
          onChange: onChange
        },
        {
          prop: 'isAttendance',
          label: '是否到课',
          cpn: 'el-select',
          bind: { clearable: false },
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange }
        },
        {
          prop: 'taskName',
          slotName: 'taskName',
          label: '任务名称',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange }
        },
        {
          prop: 'orderStatus',
          label: '导流订单状态',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange }
        },
        {
          prop: 'channelId',
          label: '渠道来源',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange }
        }
      ]
    }
  }
}

// 计划看播用户-导入用户
export const clueImportUsersOpts = (onChange = () => { }) => {
  return {
    form: {
      ref: null,
      formData: {
        teacherId: '',
        userInfo: {
          label: 'phone',
          options: [
            { label: '手机号', value: 'phone' },
            { label: '学员昵称', value: 'userName' },
            { label: '邮箱', value: 'email' }
          ],
          value: {
            phone: '',
            studentUserId: '',
            userName: '',
            email: ''
          }
        },
        isAttendance: 2
      },
      operatorSpan: 6,
      optionsObj: {
        isAttendance: [
          { label: '全部', value: 2 },
          { label: '是', value: 1 },
          { label: '否', value: 0 }
        ]
      },
      fieldList: [
        {
          prop: 'userInfo',
          slotName: 'userInfo',
          className: ['children-ml0'],
          onChange: onChange
        },
        {
          prop: 'isAttendance',
          label: '是否到课',
          cpn: 'el-select',
          selectOption: { label: 'label', value: 'value' },
          className: ['children-ml0'],
          eventHandler: { change: onChange }
        }
      ]
    }
  }
}
// 中控台-操作记录
export const operationLogOpts = (onChange = () => { }) => {
  return {
    form: {
      formData: {
        time: '',
        userId: ''
      },
      // operatorSpan: 4,
      operatorSpan: 6,
      fieldList: [
        {
          prop: 'time',
          label: '操作时间',
          cpn: 'el-date-picker',
          eventHandler: { change: onChange },
          bind: {
            type: 'datetimerange',
            rangeSeparator: '至',
            startPlaceholder: '请输入',
            format: 'yyyy-MM-dd HH:mm:ss',
            'value-format': 'yyyy-MM-dd HH:mm:ss',
            endPlaceholder: '请输入'
          },
          className: ['children-ml0']
        },
        {
          prop: 'userId',
          label: '操作人员',
          cpn: 'el-select',
          selectOption: { label: 'nickName', value: 'userId' },
          className: ['children-ml0'],
          eventHandler: { change: onChange }
        }
      ],
      optionsObj: {
        userId: []
      }
    }
  }
}

// 中控台 页面tab权限
export const liveRoomMenuOpts = () => {
  return [
    {
      label: '计划看播用户',
      key: 'planWatchusers',
      perms: 'menu:liveRoomV2:viewerProfile'
    },
    {
      label: '实际看播用户',
      key: 'actualWatchusers',
      perms: 'menu:liveRoomV2:activeProfile'
    },
    {
      label: '商品记录',
      key: 'productRecord',
      perms: 'menu:liveRoomV2:goodsRecord'
    },
    {
      label: '签到记录',
      key: 'signRecord',
      perms: 'menu:liveRoomV2:signRecord'
    },
    {
      label: '领券记录',
      key: 'couponRecord',
      perms: 'menu:liveRoomV2:getCouponsRecord'
    },
    {
      label: '抽奖记录',
      key: 'lotteryRecords',
      perms: 'menu:liveRoomV2:luckDrawRecord'
    },
    {
      label: '连麦记录',
      key: 'lianmaiRecord',
      perms: 'menu:liveRoomV2:lianmaiRecord'
    },
    {
      label: '跟课记录',
      key: 'followUpNotes',
      perms: 'menu:liveRoomV2:followClassRecord'
    },
    {
      label: '操作日志',
      key: 'operationLog',
      perms: 'menu:liveRoomV2:operationLog'
    }
  ]
}

