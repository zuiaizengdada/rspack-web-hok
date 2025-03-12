
export const originColumns = [
  { prop: 'title', label: '视频组标题', width: 200, type: 'text', visible: true, disable: true },
  { prop: 'teacherName', label: 'IP', type: 'text', visible: true, disable: true, render: row => {
    return row.teacherName || '--'
  } },
  { prop: 'type', label: '视频组类型', type: 'text', visible: true, disable: true, render: row => {
    return Number(row.type) === 2 ? '多机位视频组' : '单机位视频组'
  } },
  { prop: 'videoNameList', label: '视频列表', width: 320, type: 'slot', visible: true },
  { prop: 'shareTotal', width: 230, label: '共享数/手动脱敏数/视频总数', type: 'slot', visible: true },
  { prop: 'sceneName', label: '交付场景', type: 'text', visible: true },
  // { prop: 'planName', label: '关联选题计划', width: 150, type: 'text', visible: true },
  { prop: 'createUserName', label: '创建者', type: 'text', visible: true },
  { prop: 'createTime', label: '创建时间', width: 180, type: 'slot', visible: true },
  { prop: 'action', label: '操作', type: 'slot', visible: true, disable: true, width: 160, fixed: 'right' }
]
