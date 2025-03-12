
import { parseTime, getList2Obj } from '@/utils/index'
import { teacherQueryByName } from '@/api/tearchCenter/index'
export function getColumns() {
  return [
    {
      prop: 'teacherName',
      label: 'IP姓名',
      showInSearch: true,
      valueType: 'select',
      'show-overflow-tooltip': true,
      formProps: {
        sort: 1,
        filterable: true,
        defaultValue: '',
        remote: true,
        remoteMethod(query) {
          return teacherQueryByName({ name: query })
        },
        alias: {
          label: 'teacherName',
          value: 'teacherId'
        },
        options: [],
        formAliasName: 'teacherId'
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'planName',
      label: '计划名称',
      width: 200,
      showInSearch: true,
      formProps: {
        sort: 2
      },
      'show-overflow-tooltip': true,
      type: 'text',
      visible: true
    },
    {
      prop: 'type',
      label: '计划类型',
      width: 80,
      slotFn: (row) => (row.type && row.type === 2 ? '话题' : '选题'),
      showInSearch: true,
      formProps: {
        sort: 4,
        options: getList2Obj({ 1: '选题', 2: '话题' })
      },
      valueType: 'select',
      type: 'text',
      align: 'center',
      visible: true
    },
    {
      prop: 'totalCase',
      label: '总数',
      width: 100,
      type: 'text',
      visible: true,
      align: 'center'
    },
    {
      prop: 'retainNumber',
      label: '保留数',
      width: 100,
      type: 'text',
      visible: true,
      align: 'center'
    },
    {
      prop: 'givUpNumber',
      label: '放弃数',
      width: 100,
      type: 'text',
      visible: true,
      align: 'center'
    },
    {
      prop: 'createdAt',
      label: '创建时间',
      width: 150,
      showInSearch: true,
      valueType: 'daterange',
      formProps: {
        sort: 3,
        pickerOptions: {
          disabledDate: function (time) {
            return time.getTime() > Date.now()
          }
        },
        alias: {
          startTime: 'beginTime',
          endTime: 'endTime'
        }
      },
      slotFn: (row) => parseTime(new Date(row.createdAt).getTime(), '{y}-{m}-{d} {h}:{i}'),
      type: 'text',
      visible: true
    },
    {
      prop: 'deadline',
      label: '定版时间',
      width: 150,
      slotFn: (row) => parseTime(new Date(row.deadline).getTime(), '{y}-{m}-{d} {h}:{i}'),
      type: 'text',
      visible: true
    },
    {
      prop: 'operator',
      label: '创建人',
      width: 100,
      type: 'text',
      visible: true,
      align: 'left'
    },
    {
      prop: 'finalized',
      label: '计划状态',
      width: 140,
      slotFn: (row) => (row.finalized ? '已定版' : '未定版'),
      showInSearch: true,
      formProps: {
        sort: 5,
        options: getList2Obj({ false: '未定版', true: '已定版' })
      },
      valueType: 'select',
      type: 'slot',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      width: '240',
      type: 'slot',
      visible: true,
      fixed: 'right'
    }
  ]
}
