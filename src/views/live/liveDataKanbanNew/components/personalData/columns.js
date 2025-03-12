export const curwordEmployeeOpts = {
  form: {
    ref: null,
    formData: {
      userIdList: [],
      monthYear: '',
      deptId: ''
    },
    optionsObj: {
      status: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 }
      ],
      feedCode: []
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'deptId',
        label: '部门',
        cpn: 'el-cascader',
        slotName: 'deptId',
        className: ['children-ml0']
      },
      {
        prop: 'userIdList',
        label: '员工',
        cpn: 'el-select',
        slotName: 'userIdList',
        className: ['children-ml0']
      },
      {
        prop: 'monthYear',
        label: '月份',
        cpn: 'el-date-picker',
        slotName: 'monthYear',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'id',
        type: 'text',
        label: '反馈ID'
      },
      {
        prop: 'userName',
        type: 'text',
        label: '用户昵称',
        minWidth: 142
      },
      {
        prop: 'phone',
        type: 'text',
        label: '手机号',
        minWidth: 142
      },
      {
        prop: 'feedName',
        type: 'text',
        label: '反馈类型',
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'text',
        label: '反馈内容',
        minWidth: 142
      },
      {
        prop: 'picUrls',
        type: 'slot',
        label: '图片',
        minWidth: 200
      },
      {
        prop: 'createTime',
        type: 'text',
        label: '反馈时间',
        minWidth: 150
      },
      {
        prop: 'status',
        type: 'slot',
        label: '处理状态',
        minWidth: 142
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        minWidth: 142
      }
    ],
    slotArr: ['picUrls', 'action', 'status']
  }
}
