import { getPlayDuration } from '@/utils/index'
export function getColumns() {
  return [
    { prop: 'characterName', label: '形象名称', type: 'text', visible: true },
    {
      prop: 'videoId',
      label: '视频ID',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    {
      prop: 'name',
      label: '视频名称',
      type: 'slot',
      visible: true,
      'show-overflow-tooltip': true
    },
    {
      prop: 'teacherName',
      width: 150,
      label: 'IP',
      type: 'text',
      visible: true,
      render: row => {
        return row.teacherName || '--'
      }
    },
    {
      prop: 'duration',
      width: 120,
      label: '视频时长',
      type: 'text',
      visible: true,
      slotFn: row => {
        return getPlayDuration(Math.round(row.duration) * 1000)
      }
    },
    {
      prop: 'materialType',
      label: '素材类型',
      width: 100,
      type: 'text',
      visible: true,
      slotFn: row => {
        return materialTypes[row.materialType]
      }
    },
    {
      prop: 'status',
      width: 140,
      label: '状态',
      type: 'slot',
      visible: true,
      'render-header': (h, { column }) => {
        const tm = localStorage.getItem('digitalVideoManageStatusShowTooltip')
          ? 0
          : 10000

        if (tm > 0) {
          setTimeout(() => {
            localStorage.setItem('digitalVideoManageStatusShowTooltip', true)
          }, 3000)
        }
        return h('span', [
          column.label,
          h('el-tooltip', {
            props: {
              class: 'item',
              effect: 'dark',
              content: '数字人视频先审批，后生成。等待生成成功后，可预览使用。',
              placement: 'top',
              value: tm > 0,
              'hide-after': tm
            }
          }, [
            h('i', {
              class: 'el-icon-warning-outline',
              style: 'font-size: 14px; color: #999; margin-left: 5px;'
            })
          ])
        ])
      }
    },
    {
      prop: 'creatUserName',
      width: 100,
      label: '创建人',
      type: 'text',
      visible: true
    },
    {
      prop: 'generateTime',
      label: '生成时间',
      type: 'text',
      visible: true,
      'show-overflow-tooltip': true
    },
    {
      prop: 'action',
      width: '200px',
      label: '操作',
      type: 'slot',
      visible: true
    }
  ]
}
export const statusClass = {
  0: 'status-pending',
  1: 'status-generate',
  2: 'status-success',
  3: 'status-fail',
  4: 'status-audit',
  5: 'status-pass',
  6: 'status-reject',
  99: 'status-draft'
}
export const status = {
  0: '排队中',
  1: '生成中',
  2: '生成成功',
  3: '生成失败',
  4: '待审核',
  5: '审核通过',
  6: '审核驳回',
  99: '草稿'
}
export const materialTypes = {
  1: '带货素材',
  2: '流量素材'
  // 3: '音频素材'
}
