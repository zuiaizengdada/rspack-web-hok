
import { parseTime } from '@/utils/index'
import { teacherQueryByName } from '@/api/tearchCenter/index'
export function getColumns() {
  return [
    {
      prop: 'topicId',
      label: '话题ID',
      type: 'text',
      visible: true
    },
    {
      prop: 'teacherName',
      label: '所属IP',
      showInSearch: true,
      valueType: 'select',
      'show-overflow-tooltip': true,
      formProps: {
        filterable: true,
        remote: true,
        defaultValue: '',
        remoteMethod(query) {
          if (!query) {
            return []
          }
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
      prop: 'fieldName',
      label: '所属领域',
      showInSearch: true,
      valueType: 'select',
      formProps: {
        options: [],
        formAliasName: 'fieldId'
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'keyword',
      label: '话题标题',
      'show-overflow-tooltip': true,
      width: 400,
      type: 'text',
      visible: true
    },
    {
      prop: 'keyword',
      label: '话题标题',
      showInSearch: true,
      formProps: {
        labelWidth: '90px'
      },
      type: 'text',
      visible: false
    },
    // {
    //   prop: 'industryName',
    //   label: '所属行业',
    //   showInSearch: true,
    //   valueType: 'cascader',
    //   formProps: {
    //     sort: 3,
    //     options: [],
    //     getChildIds: true,
    //     childIdsKey: 'industryIds'
    //   },
    //   type: 'text',
    //   visible: true
    // },
    {
      prop: 'operateTime',
      label: '操作时间',
      showInSearch: true,
      valueType: 'daterange',
      slotFn: (row) => parseTime(new Date(row.operateTime).getTime(), '{y}-{m}-{d} {h}:{i}'),
      formProps: {
        alias: {
          startTime: 'inputBeginTime',
          endTime: 'inputEndTime'
        }
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'operateBy',
      label: '操作人',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      width: 160,
      type: 'slot',
      visible: true
    }
  ]
}
