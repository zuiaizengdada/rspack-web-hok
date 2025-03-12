import { getOptionsValue } from '@/filters/index'
import dict from '@/strings'
const { PRIORITY_STATUS } = dict
// 状态
export const ChannelOption = [
  { label: '未开始', value: '1', background: '#FEECEC', color: '#F53F3F', icon: 'audit_fail' },
  { label: '进行中', value: '2', background: '#E7F0FF', color: '#0C6FFF', icon: 'jinxingzhong' },
  { label: '暂停中', value: '3', background: '#FEF1EC', color: '#FF7D00', icon: 'liveSuspend' },
  { label: '已关闭', value: '4', background: '#F5F5F5', color: '#777777', icon: 'audit_info' }
]

export const dataTypeOption = [
  { label: '订单', value: 1 },
  { label: '线下表格', value: 2 },
  { label: '信息流表单', value: 4 },
  { label: '信息流加微', value: 5 }
]

export const dataTypeOptionKanban = [
  { label: '订单', value: 1 }
  // { label: '线下表格', value: 2 }
]

export const taskObjectiveOption = [
  { label: '加企业微信', value: 1 }
]

export function getColumns() {
  return [
    {
      width: '180px',
      prop: 'id',
      label: '任务ID',
      type: 'text',
      disable: true,
      visible: true
    },
    { width: '150px', prop: 'taskName', label: '任务名称', type: 'text', visible: true, disable: true, 'show-overflow-tooltip': true },
    { width: '90px', prop: 'taskStatus', label: '状态', type: 'slot', visible: true, 'show-overflow-tooltip': true },
    { width: '100px', prop: 'dataType', label: '数据来源', type: 'text', visible: true, slotFn: (row) => { return getOptionsValue(row.dataType, dataTypeOption) } },
    { width: '150px', prop: 'startTime', label: '任务开始时间', type: 'text', visible: true },
    { width: '150px', prop: 'endTime', label: '任务结束时间', type: 'text', visible: true },
    { width: '80px', prop: 'priority', label: '优先级', type: 'text', visible: true, slotFn: (row) => { return PRIORITY_STATUS.find(item => item.value === row.priority)?.label } },
    { width: '150px', label: '任务目的', type: 'taskObjective', visible: true, slotFn: (row) => { return getOptionsValue(row.taskObjective, taskObjectiveOption) } },
    { width: '150px', label: '最大可分配数', prop: 'maxClueNum', type: 'text' },
    { width: '150px', label: '员工设置可分配数', prop: 'normalMaxClueNum', type: 'text' },
    { width: '150px', label: '兜底设置可分配数', prop: 'defaultMaxClueNum', type: 'text' },
    { width: '300px', prop: 'tagNames', label: '标签', type: 'slot', visible: true, 'show-overflow-tooltip': true },
    // { prop: 'lectureName', label: 'IP老师', type: 'text', visible: true },
    { prop: 'createUserName', label: '创建人', type: 'text', visible: true },
    { prop: 'createTime', width: 160, label: '创建时间', type: 'text', visible: true },
    { width: 160, prop: 'action', label: '操作', type: 'slot', visible: true, fixed: 'right', disable: true }
  ]
}
