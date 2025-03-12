
import { readFlag } from '@/utils/enum'
import { getList2Obj } from '@/utils/index'
const sex = { 0: '女', 1: '男' }
export function getColumns() {
  return [
    {
      prop: 'userName',
      label: '用户姓名',
      type: 'text',
      visible: true
    },
    {
      prop: 'questionContent',
      label: '用户想解决的核心问题',
      'show-overflow-tooltip': true,
      width: '250',
      type: 'text',
      visible: true
    },
    {
      prop: 'age',
      label: '年龄',
      width: '60',
      type: 'text',
      visible: true
    },
    {
      prop: 'sex',
      label: '性别',
      width: '60',
      showInSearch: true,
      valueType: 'select',
      slotFn: (row) => sex[row.sex],
      formProps: {
        defaultValue: '',
        options: [
          {
            label: '男',
            value: 1
          },
          {
            label: '女',
            value: 0
          }
        ]
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'position',
      label: '职位',
      width: '140',
      type: 'text',
      visible: true
    },
    {
      prop: 'industry',
      label: '所属行业',
      showInSearch: true,
      width: '160',
      valueType: 'cascader',
      'show-overflow-tooltip': true,
      formProps: {
        defaultValue: '',
        options: [],
        getChildIds: true,
        childIdsKey: 'industryList',
        childParamsKey: 'label'
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'companyName',
      label: '企业名称',
      width: '120',
      'show-overflow-tooltip': true,
      type: 'text',
      visible: true
    },
    {
      prop: 'companySize',
      label: '企业规模（人）',
      showInSearch: true,
      valueType: 'select',
      formProps: {
        defaultValue: '',
        label: '企业规模',
        options: []
      },
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'turnover',
      label: '年营业额（万）',
      showInSearch: true,
      formProps: {
        defaultValue: '',
        label: '年营业额',
        options: []
      },
      valueType: 'select',
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'product',
      label: '产品/核心业务',
      width: '120',
      'show-overflow-tooltip': true,
      type: 'text',
      visible: true
    },
    {
      prop: 'deptName',
      label: '来源部门',
      width: '100',
      showInSearch: true,
      valueType: 'cascader',
      formProps: {
        sort: 3,
        defaultValue: '',
        options: [],
        getChildIds: true,
        childIdsKey: 'deptNameList',
        childParamsKey: 'label'
      },
      type: 'text',
      visible: true
    },
    {
      prop: 'channelSource',
      label: '来源渠道',
      showInSearch: true,
      valueType: 'select',
      'show-overflow-tooltip': true,
      formProps: {
        sort: 4,
        defaultValue: '',
        options: []
      },
      width: '150',
      type: 'text',
      visible: true
    },
    {
      prop: 'channelTime',
      label: '来源日期',
      showInSearch: true,
      valueType: 'daterange',
      formProps: {
        sort: 2,
        defaultValue: [],
        pickerOptions: {
          disabledDate: (time) => {
            // 先限制今天之前
            if (time.getTime() > Date.now()) {
              return true
            }
            // eslint-disable-next-line eqeqeq
            if (this.currentTime != '') {
            // 一年以内
              const one = 30 * 24 * 3600 * 1000
              // 月份为30 * 24 * 3600 *1000
              const minTime = this.currentTime - one
              const maxTime = this.currentTime + one
              return time.getTime() < minTime || time.getTime() > maxTime
            }
          },
          onPick: ({ maxDate, minDate }) => {
            this.currentTime = minDate.getTime()
            if (maxDate) {
              this.currentTime = ''
            }
          }
        }
      },
      width: '120',
      type: 'text',
      visible: true
    },
    {
      prop: 'readFlag',
      label: '阅读状态',
      slotFn: (row) => readFlag[row.readFlag],
      showInSearch: true,
      formProps: {
        defaultValue: '',
        options: getList2Obj(readFlag)
      },
      valueType: 'select',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      type: 'slot',
      visible: true
    }
  ]
}
