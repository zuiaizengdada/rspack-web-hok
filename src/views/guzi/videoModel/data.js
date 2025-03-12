export const curwordOpts = {
  form: {
    ref: null,
    formData: {
      templateName: '',
      tagName: '',
      createTime: ['', '']
    },
    optionsObj: {
      tagName: [],
      feedCode: []
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'templateName',
        label: '模版名称',
        cpn: 'el-input',
        selectOption: {
          label: 'name',
          value: 'code'
        },
        className: ['children-ml0']
      },
      {
        prop: 'tagName',
        label: '标签',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'createTime',
        label: '创建时间',
        cpn: 'el-date-picker',
        bind: {
          type: 'daterange',
          rangeSeparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期'
        },
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'id',
        type: 'text',
        label: '模版ID'
      },
      {
        prop: 'templateName',
        type: 'text',
        label: '模版名称',
        minWidth: 142
      },
      {
        prop: 'templateType',
        type: 'slot',
        label: '模版类型',
        minWidth: 142
      },
      // {
      //   prop: 'image',
      //   type: 'slot',
      //   label: '图片',
      //   minWidth: 120
      // },
      {
        prop: 'video',
        type: 'slot',
        label: '视频',
        minWidth: 160
      },
      {
        prop: 'description',
        type: 'text',
        label: '描述',
        minWidth: 142
      },
      {
        prop: 'tagName',
        type: 'text',
        label: '类型',
        minWidth: 142
      },
      {
        prop: 'templateFileSize',
        type: 'slot',
        label: '大小',
        minWidth: 142
      },
      {
        prop: 'createTime',
        type: 'text',
        label: '创建时间',
        minWidth: 150
      },
      {
        prop: 'isOnline',
        type: 'slot',
        label: '上架状态'
      },
      {
        prop: 'infoJson',
        type: 'slot',
        label: '模版元数据'
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        minWidth: 142
      }
    ],
    slotArr: ['picUrls', 'action', 'isOnline', 'image', 'video', 'templateFileSize', 'infoJson', 'templateType']
  }
}
