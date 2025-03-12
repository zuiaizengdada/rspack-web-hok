export function getColumns() {
  return [
    { prop: 'characterName', label: '形象名称', type: 'text', visible: true },
    {
      prop: 'name',
      width: 240,
      label: '视频名称',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    { prop: 'teacherName', label: 'IP', type: 'text', visible: true, render: (row) => {
      return row.teacherName || '--'
    } },
    // {
    //   prop: 'duration',
    //   width: 240,
    //   label: '视频时长',
    //   type: 'text',
    //   visible: true,
    //   slotFn: row => {
    //     return row.duration ? (row.duration / 60).toFixed(2) + '分钟' : '-'
    //   }
    // },
    {
      prop: 'materialType',
      label: '素材类型',
      type: 'text',
      visible: true,
      slotFn: row => {
        return materialTypes[row.materialType]
      }
    },
    { prop: 'creatUserName', label: '申请者', type: 'text', visible: true },
    { prop: 'deptChainNames', label: '所在部门', type: 'text', visible: true },
    {
      prop: 'lastSubmitApproveTime',
      label: '申请时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'status',
      label: '审批状态',
      type: 'text',
      visible: true,
      slotFn: row => {
        return status[row.status]
      }
    },
    {
      prop: 'action',
      width: '220px',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
export function getColumns2() {
  return [
    { prop: 'characterName', label: '形象名称', type: 'text', visible: true },
    {
      prop: 'name',
      label: '视频名称',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    { prop: 'teacherName', label: 'IP', type: 'text', visible: true, render: (row) => {
      return row.teacherName || '--'
    } },
    {
      prop: 'materialType',
      label: '素材类型',
      type: 'text',
      visible: true,
      slotFn: row => {
        return materialTypes[row.materialType]
      }
    },
    { prop: 'creatUserName', label: '申请者', type: 'text', visible: true },
    { prop: 'deptChainNames', label: '所在部门', type: 'text', visible: true },
    {
      prop: 'lastSubmitApproveTime',
      label: '申请时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'status',
      label: '审批状态',
      type: 'text',
      visible: true,
      slotFn: row => {
        return status[row.status]
      }
    },
    {
      prop: 'approveUserName',
      label: '审批者',
      type: 'text',
      visible: true
    },
    {
      prop: 'lastApprovedTime',
      label: '审批时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      width: '220px',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
export function getColumns3() {
  return [
    { prop: 'characterName', label: '形象名称', type: 'text', visible: true },
    {
      prop: 'name',
      label: '视频名称',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    { prop: 'teacherName', label: 'IP', type: 'text', visible: true, render: (row) => {
      return row.teacherName || '--'
    } },
    {
      prop: 'materialType',
      label: '素材类型',
      type: 'text',
      visible: true,
      slotFn: row => {
        return materialTypes[row.materialType]
      }
    },
    { prop: 'creatUserName', label: '申请者', type: 'text', visible: true },
    { prop: 'deptChainNames', label: '所在部门', type: 'text', visible: true },
    {
      prop: 'lastSubmitApproveTime',
      label: '申请时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'status',
      label: '审批状态',
      type: 'text',
      visible: true,
      slotFn: row => {
        return status[row.status]
      }
    },
    {
      prop: 'approveOpinion',
      label: '驳回原因',
      type: 'text',
      visible: true
    },
    {
      prop: 'approveUserName',
      label: '审批者',
      type: 'text',
      visible: true
    },
    {
      prop: 'lastApprovedTime',
      label: '审批时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      width: '220px',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
export const status = {
  0: '排队中',
  1: '生成中',
  2: '生成成功',
  3: '生成失败',
  4: '待审核',
  5: '审核通过',
  6: '审核驳回'
}
export const materialTypes = {
  1: '带货素材',
  2: '流量素材',
  3: '音频素材'
}
