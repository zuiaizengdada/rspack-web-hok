export function getColumns() {
  return [
    {
      prop: 'operateUserName',
      label: '操作人',
      visible: true,
      width: 140
    },
    {
      prop: 'createTime',
      label: '操作时间',
      type: 'text',
      visible: true,
      width: 160
    },
    {
      prop: 'editType',
      label: '操作类型',
      type: 'text',
      visible: true,
      showInSearch: true,
      valueType: 'select',
      formProps: {
        options: []
      },
      slotFn: row => this.options[row.editType],
      width: 120
    },
    {
      prop: 'content',
      label: '操作内容',
      type: 'text',
      visible: true

    }
  ]
}
