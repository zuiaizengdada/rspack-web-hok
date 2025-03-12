
const type = {
  1: '非带货',
  2: '带货'
}
const size = {
  1: '小选题',
  2: '大选题'
}
import { getList2Obj } from '@/utils/index'
import { parseTime } from '@/utils/index'
import { teacherQueryByName } from '@/api/tearchCenter/index'
export function getColumns() {
  return [
    {
      prop: 'suitableTeachers',
      label: '所属IP',
      width: 130,
      showInSearch: true,
      valueType: 'select',
      'show-overflow-tooltip': true,
      formProps: {
        sort: 1,
        filterable: true,
        remote: true,
        defaultValue: '',
        remoteMethod(query) {
          return teacherQueryByName({ name: query })
        },
        label: '所属IP',
        alias: {
          label: 'teacherName',
          value: 'teacherId'
        },
        options: [],
        formAliasName: 'suitableTeacherId'
      },
      slotFn: (row) => row.suitableTeachers?.map((i) => i.teacherName)?.join('、'),
      type: 'text',
      visible: true
    },
    {
      prop: 'caseName',
      label: '选题标题',
      width: 250,
      type: 'text',
      formProps: {
        sort: 7
      },
      'show-overflow-tooltip': true,
      showInSearch: true,
      visible: true
    },
    {
      prop: 'fieldName',
      label: '所属领域',
      showInSearch: true,
      valueType: 'select',
      formProps: {
        sort: 6,
        options: [],
        formAliasName: 'fieldId'
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'type',
      label: '选题类别',
      showInSearch: true,
      width: 100,
      valueType: 'select',
      slotFn: (row) => type[row.type],
      formProps: {
        options: getList2Obj(type),
        sort: 5
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'size',
      label: '选题大小',
      slotFn: (row) => size[row.size],
      showInSearch: true,
      width: 100,
      valueType: 'select',
      formProps: {
        sort: 5,
        options: getList2Obj(size)
      },
      type: 'text',
      visible: true
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
      prop: 'keywords',
      label: '选题关键词',
      showInSearch: true,
      width: 140,
      formProps: {
        sort: 8,
        formAliasName: 'keyword',
        labelWidth: '90px'
      },
      'show-overflow-tooltip': true,
      slotFn: (row) => row.keywords?.join('、'),
      type: 'text',
      visible: true
    },

    // {
    //   prop: 'quoteTeachers',
    //   label: '被引用老师',
    //   showInSearch: true,
    //   valueType: 'select',
    //   width: 100,
    //   'show-overflow-tooltip': true,
    //   formProps: {
    //     sort: 2,
    //     filterable: true,
    //     remote: true,
    //     labelWidth: '90px',
    //     remoteMethod(query) {
    //       return teacherQueryByName({ name: query })
    //     },
    //     alias: {
    //       label: 'teacherName',
    //       value: 'teacherId'
    //     },
    //     options: [],
    //     formAliasName: 'quoteTeacherId'
    //   },
    //   slotFn: (row) => row.quoteTeachers?.map((i) => i.teacherName)?.join('、'),
    //   type: 'text',
    //   visible: true
    // },
    {
      prop: 'quoteTimes',
      label: '被引用次数',
      width: 100,
      type: 'text',
      align: 'center',
      visible: true
    },
    {
      prop: 'adoptNums',
      label: '被采纳次数',
      width: 100,
      type: 'text',
      align: 'center',
      visible: true
    },
    {
      prop: 'deptName',
      label: '所属组织',
      showInSearch: true,
      valueType: 'cascader',
      formProps: {
        sort: 6,
        defaultValue: '',
        options: [],
        getChildIds: true,
        childIdsKey: 'deptIdList',
        childParamsKey: 'label'
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'createBy',
      label: '创建人',
      width: 100,
      'show-overflow-tooltip': true,
      type: 'text',
      visible: true
    },
    {
      prop: 'createTime',
      label: '创建时间',
      width: 150,
      showInSearch: true,
      valueType: 'daterange',
      formProps: {
        sort: 4,
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
      slotFn: (row) => parseTime(new Date(row.createTime).getTime(), '{y}-{m}-{d} {h}:{i}'),
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      width: '150',
      type: 'slot',
      visible: true
    }
  ]
}
