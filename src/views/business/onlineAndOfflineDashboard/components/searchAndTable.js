import moment from 'moment'
export const onlineAndOfflineForm = {
  form: {
    ref: null,
    formData: {
      employeeDeptId: '',
      employeeSecondDeptId: '',
      employeeUid: '',
      teacherIdList: [],
      teacherId: '',
      lecturerName: '',
      orderChannel: [],
      itemIdList: [],
      offlineFlag: 0, // 线上或者线下状态
      productCategory: 999, // 商品类型 0 视频课、1直播课、2线下课、3组合课
      bizTypes: [3, 1, 2, 4, 5, 9, 12],
      bizTypeActive: 3,
      bizTypeActiveName: 'GMV',
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
        prop: 'deptArray',
        label: '部门',
        cpn: 'el-select',
        slotName: 'deptArray',
        className: ['children-ml0']
      },
      {
        prop: 'employeeUid',
        label: '员工姓名',
        cpn: 'el-select',
        slotName: 'employeeUid',
        className: ['children-ml0']
      },
      {
        prop: 'teacherIdList',
        label: 'IP老师',
        cpn: 'el-select',
        slotName: 'teacherIdList',
        className: ['children-ml0']
      },
      {
        prop: 'orderChannel',
        label: '渠道',
        cpn: 'el-select',
        slotName: 'orderChannel',
        className: ['children-ml0']
      },
      {
        prop: 'itemIdList',
        label: '商品/商品ID',
        cpn: 'el-cascader',
        slotName: 'itemIdList',
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
