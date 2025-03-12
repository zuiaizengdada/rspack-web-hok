
const type = {
  1: '非带货',
  2: '带货'
}
const size = {
  1: '小选题',
  2: '大选题'
}
const reviewStatus = {
  WAIT: '未审核',
  RETAIN: '保留',
  GIVE_UP: '放弃'
}
import { getList2Obj } from '@/utils/index'
export function getColumns() {
  return [
    {
      prop: 'caseName',
      label: '选题标题',
      type: 'text',
      width: 200,
      formProps: {
        sort: 5
      },
      'show-overflow-tooltip': true,
      showInSearch: true,
      visible: true
    },
    {
      prop: 'fieldName',
      label: '所属领域',
      showInSearch: true,
      width: 120,
      'show-overflow-tooltip': true,
      valueType: 'select',
      formProps: {
        sort: 2,
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
      valueType: 'select',
      width: 90,
      slotFn: (row) => type[row.type],
      formProps: {
        options: getList2Obj(type)
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'size',
      label: '选题大小',
      slotFn: (row) => size[row.size],
      showInSearch: true,
      width: 90,
      valueType: 'select',
      formProps: {
        options: getList2Obj(size)
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'planName',
      label: '所属计划',
      showInSearch: true,
      width: 200,
      'show-overflow-tooltip': true,
      valueType: 'select',
      formProps: {
        sort: 1,
        options: [],
        formAliasName: 'planId',
        defaultValue: ''
      },
      type: 'text',
      visible: true
    },
    /* {
      prop: 'industryName',
      label: '所属行业',
      showInSearch: true,
      valueType: 'cascader',
      width: 120,
      'show-overflow-tooltip': true,
      formProps: {
        sort: 3,
        options: [],
        formAliasName: 'industryId'
      },
      type: 'text',
      visible: true
    }, */
    {
      prop: 'keywords',
      label: '选题关键词',
      showInSearch: true,
      width: 180,
      'show-overflow-tooltip': true,
      formProps: {
        sort: 6,
        labelWidth: '90px'
      },
      slotFn: (row) => row.keywords.join('、'),
      type: 'text',
      visible: true
    },
    {
      prop: 'productReviewStatus',
      label: '产品审核状态',
      showInSearch: true,
      valueType: 'select',
      formProps: {
        sort: 1,
        labelWidth: '100px',
        options: getList2Obj(reviewStatus)
      },
      slotFn: (row) => reviewStatus[row.productReviewStatus],
      type: 'text',
      visible: true
    },
    {
      prop: 'operator',
      label: '操作人',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      width: '180',
      type: 'slot',
      visible: true,
      fixed: 'right'
    }
  ]
}
