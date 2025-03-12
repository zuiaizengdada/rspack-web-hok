// const genderMap = new Map([[0, '男'], [1, '女']])
export function getColumns() {
  return [
    {
      prop: 'characterId',
      label: '数字人形象ID',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    { prop: 'name', label: '形象名称', type: 'text', visible: true },
    {
      prop: 'photoUrl',
      label: '形象定妆照',
      type: 'slot',
      visible: true,
      slotFn: row => {
        return row
      }
    },
    {
      prop: 'thirdType',
      label: '渠道',
      type: 'text',
      visible: true,
      render: row => {
        return row.thirdType === 1
          ? '华为'
          : row.thirdType === 2
            ? '火山'
            : row.thirdType === 3
              ? '硅基'
              : row.thirdType === 4
                ? '媲美'
                : ''
      }
    },
    {
      prop: 'teacherName',
      label: 'IP',
      type: 'text',
      visible: true,
      render: row => {
        return row.teacherName || '--'
      }
    },
    // { prop: 'gender', label: '性别', type: 'text', visible: true, slotFn: (row) => { return genderMap.get(row.gender) } },
    { prop: 'useCount', label: '使用次数', type: 'text', visible: true },
    {
      prop: 'status',
      label: '状态',
      type: 'slot',
      visible: true,
      slotFn: row => {}
    },
    {
      prop: 'externalCreateTime',
      width: 180,
      label: '创建时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'createTime',
      width: 180,
      label: '关联时间',
      type: 'text',
      visible: true
    },
    { prop: 'action', width: 146, label: '操作', type: 'slot', visible: true }
  ]
}
