export const couponMgt = {
  form: {
    ref: null,
    formData: {
      couponName: undefined, //  	优惠券名称
      couponNo: '', // 	优惠券编码
      couponType: '', // 优惠券类型(1:机构费用优惠券)
      dataType: '', // 类型：0-我创建的，1-我管理的
      discountMethod: '', // 优惠方式(1:满减，2:直减，3:折扣)
      auditStatus: '' // 审核状态
    },
    optionsObj: {
      auditStatus: [
        { label: '全部', value: '' },
        { label: '待审核', value: 1 },
        { label: '审核驳回', value: 2 },
        { label: '已通过', value: 3 }
      ],
      couponType: [{ message: '全部', code: '' }],
      dataType: [
        { label: '全部', value: '' },
        { label: '我创建的', value: 0 }
      ],
      discountMethod: [{ message: '全部', code: '' }]
    },
    fieldList: [
      {
        prop: 'couponNo',
        slotName: 'couponInfo',
        className: ['children-ml0']
      },
      {
        prop: 'couponType',
        label: '优惠券类型',
        cpn: 'el-select',
        selectOption: {
          label: 'message',
          value: 'code'
        },
        className: ['children-ml0']
      },
      {
        prop: 'discountMethod',
        label: '优惠方式',
        cpn: 'el-select',
        selectOption: {
          label: 'message',
          value: 'code'
        },
        className: ['children-ml0']
      },
      {
        prop: 'auditStatus',
        label: '审核状态',
        cpn: 'el-select',
        className: ['children-ml0']
      },
      {
        prop: 'dataType',
        label: '筛选',
        cpn: 'el-select',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'couponName',
        type: 'slot',
        label: '优惠券信息',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'couponContent',
        type: 'slot',
        label: '优惠内容',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'createdByName',
        type: 'text',
        label: '创建人',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'auditStatus',
        type: 'slot',
        label: '审核状态',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        disable: false,
        visible: true,
        minWidth: 142
      }
    ],
    slotArr: ['couponName', 'couponContent', 'auditStatus', 'action']
  }
}
export const couponAudit = {
  form: {
    ref: null,
    formData: {
      couponName: undefined, //  	优惠券名称
      couponNo: undefined, // 	优惠券编码
      couponType: '', // 优惠券类型(1:机构费用优惠券)
      dataType: 1, // 类型：固定值 我管理的
      discountMethod: '', // 优惠方式(1:满减，2:直减，3:折扣)
      auditStatus: 1 // 审核状态
    },
    optionsObj: {
      discountMethod: [
        { message: '全部', code: '' }
      ],
      couponType: [
        { message: '全部', code: '' }
      ],
      auditStatus: [
        { label: '全部', value: '' },
        { label: '待审核', value: 1 },
        { label: '审核驳回', value: 2 },
        { label: '已通过', value: 3 }
      ]
    },
    fieldList: [
      {
        prop: 'couponInfo',
        slotName: 'couponInfo',
        className: ['children-ml0']
      },
      {
        prop: 'couponType',
        label: '优惠券类型',
        cpn: 'el-select',
        selectOption: {
          label: 'message',
          value: 'code'
        },
        className: ['children-ml0']
      },
      {
        prop: 'discountMethod',
        label: '优惠方式',
        cpn: 'el-select',
        selectOption: {
          label: 'message',
          value: 'code'
        },
        className: ['children-ml0']
      },
      {
        prop: 'auditStatus',
        label: '审核状态',
        cpn: 'el-select',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'couponName',
        type: 'slot',
        label: '优惠券信息',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'couponContent',
        type: 'slot',
        label: '优惠内容',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'createdByName',
        type: 'text',
        label: '创建人',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'auditStatus',
        type: 'slot',
        label: '审核状态',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'action',
        type: 'slot',
        label: '操作',
        disable: false,
        visible: true,
        minWidth: 142
      }
    ],
    slotArr: ['couponName', 'couponContent', 'auditStatus', 'action']
  }
}
