export const tableColumns = [
  { prop: 'jobId', label: '岗位ID', type: 'text', visible: true, width: 110 },
  { prop: 'jobName', label: '岗位名称', type: 'text', visible: true },
  { prop: 'jobDesc', label: '岗位描述', type: 'text', visible: true },
  { prop: 'roleList', label: '伏羲云默认角色', type: 'slot', visible: true, minWidth: 160 },
  { prop: 'userNum', label: '人数', type: 'text', visible: true },
  { prop: 'createTime', label: '创建时间', type: 'text', visible: true },
  { prop: 'action', label: '操作', type: 'slot', visible: true }
]
