import moment from 'moment'
export const onlineAndOfflineForm = {
  form: {
    ref: null,
    formData: {
      bizTypes: [3, 1, 2, 4, 5, 9, 12],
      bizTypeActive: 3,
      bizTypeActiveName: 'GMV',
      chooseType: 1,
      time: {
        active: 3,
        time: [moment().format('YYYY-MM-01'), moment().format('YYYY-MM-DD')],
        type: ''
      }
    },
    optionsObj: {
      status: [
        { label: '未处理', value: 1 },
        { label: '已处理', value: 2 }
      ],
      feedCode: []
    },
    operatorSpan: 6,
    fieldList: [
      {
        prop: 'feedCode',
        label: '部门',
        cpn: 'el-select',
        selectOption: {
          label: 'name',
          value: 'code'
        },
        className: ['children-ml0']
      },
      {
        prop: 'status',
        label: '员工姓名',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'status',
        label: 'IP老师',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'status',
        label: '渠道',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'status',
        label: '商品/商品ID',
        cpn: 'el-select',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
    ],
    slotArr: ['picUrls', 'action', 'status']
  }
}
