export const curwordOpts = {
  form: {
    ref: null,
    formData: {
      title: '' // 关键词名称
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'title',
        label: '提示词标题',
        cpn: 'el-input',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'id',
        type: 'text',
        label: '提示词ID',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'title',
        type: 'text',
        label: '提示词标题',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'slot',
        label: '提示词内容',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        disable: false,
        visible: true,
        minWidth: 142
      }
    ],
    slotArr: ['content', 'action']
  }
}
