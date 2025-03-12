export default [
  { width: '150px', prop: 'userPhone', label: '学员电话', type: 'phone', visible: true, isPhone: true, phoneType: 'clueLinkThread', copy: true },
  { width: '200px', prop: 'followerDeptName', label: '跟进部门', type: 'text', visible: true },
  { prop: 'followerName', label: '跟进人姓名', type: 'text', visible: true },
  { width: '150px', prop: 'followerPhone', label: '跟进人手机号', type: 'text' },
  { prop: 'createAt', label: '分配时间', type: 'text', visible: true },
  { prop: 'repair', label: '修复状态', type: 'text', slotFn: (row) => { return row?.repair ? '已修复' : '未修复' } },
  { prop: 'action', label: '操作', type: 'slot' }
]

