const columns = [
  {
    attrs: {
      type: 'selection'
    }
  },
  {
    prop: 'groupName',
    width: 180,
    label: 'IP老师'
  },
  {
    prop: 'content',
    label: '敏感词内容',
    type: 'slot'
    // attrs: {
    //   'show-overflow-tooltip': true
    // }
  },
  {
    prop: 'operator',
    width: 150,
    label: '操作人'
  },
  {
    prop: 'operate',
    type: 'slot',
    fixed: 'right',
    width: 320,
    label: '操作'
  }
]
export { columns }
