export const finishTableJson = {
  columns: [
    { prop: 'agreementName', type: 'slot', label: '协议名称', disable: false, visible: true, minWidth: 142 },
    { prop: 'agreementCode', type: 'text', label: '协议编号', disable: false, visible: true, minWidth: 142 },
    { prop: 'supplierOrgName', type: 'text', label: '供应机构', disable: false, visible: true, minWidth: 142 },
    { prop: 'cpOrgName', type: 'text', label: '合作机构', disable: false, visible: true, minWidth: 142 },
    { prop: 'coopScopeList', type: 'slot', label: '合作范围', disable: false, visible: true, minWidth: 142 },
    { prop: 'startDate', type: 'slot', label: '协议日期', disable: false, visible: true, minWidth: 182 },
    { prop: 'status', type: 'slot', label: '状态', disable: false, visible: true, minWidth: 100 },
    { prop: 'createUserName', type: 'text', label: '创建人', disable: false, visible: true, minWidth: 100 },
    { prop: 'createTime', type: 'text', label: '创建时间', disable: false, visible: true, minWidth: 150 },
    { prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 142, fixed: 'right' }
  ],
  slotArr: [
    'search',
    'headerLeft',
    'headerRight',
    'footer',
    'action',
    'status',
    'coopScopeList',
    'startDate',
    'agreementName'
  ],
  searchInfo: {
    agreementCode: '', // 协议编号
    agreementName: '', // 协议名称
    cpOrgId: undefined, // 合作机构ID
    coopScope: '', // 合作范围
    supplierOrgId: undefined, //	供应机构ID
    status: undefined, // 审核状态
    time: [] // 	开始日期 + 结束日期
  }
}
export const statusTansforIcon = [
  {
  },
  {
    text: '草稿',
    icon: 'cg',
    detailIcon: 'cg',
    bgColor: '#F7F7F7',
    color: '#78ACFA'
  },
  {
    text: '待审核',
    icon: 'dsh',
    bgColor: '#FFF5ED',
    color: '#FCA368'
  },
  {
    text: '审核通过',
    icon: 'shtg',
    bgColor: '#EFFFED',
    color: '#00D435'
  },
  {
    text: '审核驳回',
    icon: 'shbh',
    bgColor: '#FFEDED',
    color: '#FF7575'
  },
  {
    text: '待签署',
    icon: 'dqs',
    bgColor: '#EDF6FF',
    color: '#6F68FC'
  },
  {
    text: '已拒绝',
    icon: 'yjj',
    bgColor: '#FFEDED',
    color: '#F74545'
  },
  {
    text: '已签署',
    icon: 'yqs',
    bgColor: '#F8FFED',
    color: '#71D400'
  },
  {
    text: '待终止',
    icon: 'dzz',
    bgColor: '#FFF5ED',
    color: '#FCA368'
  },
  {
    text: '已终止',
    icon: 'yzz',
    bgColor: '#FFEDED',
    color: '#FF2020'
  },
  {
    text: '已失效',
    icon: 'ysx',
    bgColor: '#FFEDED',
    color: '#FF2020'
  }
]
export const statusTransforBtn = {
  Tjsh: {
    title: '提交审核',
    btnName: '提交审核',
    desc: '确认提交审核吗？'
  },
  Chxy: {
    title: '撤回协议',
    btnName: '撤回',
    desc: '确认撤回协议吗？'
  },
  Chsh: {
    title: '撤回审核',
    btnName: '撤回',
    desc: '确认撤回审核吗？'
  },
  Shtg: {
    title: '审核通过',
    btnName: '通过',
    desc: '确认审核通过吗？'
  },
  Shbh: {
    title: '审核驳回',
    btnName: '驳回'
  },
  Fsxy: {
    title: '发送协议',
    btnName: '发送',
    desc: '确认发送吗？'
  },
  Jsxy: {
    title: '接受协议',
    btnName: '接受',
    desc: '确认接受协议吗？'
  },
  Bhxy: {
    title: '驳回协议',
    btnName: '驳回'
  },
  Zzxy: {
    title: '终止协议',
    btnName: '发送'
  },
  Jszzxy: {
    title: '接受终止协议',
    btnName: '接受',
    desc: '确认接受终止协议吗？'
  },
  Bhzzxy: {
    title: '驳回终止协议',
    btnName: '驳回'
  }
}
export const rangeCheckList = [
  {
    name: '内容合作',
    code: 'coop_content',
    checked: false,
    curIndex: -1, // 第三层是否展示
    isAll: null, // 第三层指定 全选还是
    childrenValue: [], // 第三层指定 数据
    children: [
      {
        name: '视频脱敏',
        code: 'desensitization_video',
        checked: false,
        children: [
          {
            name: 'IP',
            code: 'desensitization_video_ip',
            isAll: false,
            allTxt: '所有IP',
            childrenValue: []
          }
        ]
      },
      {
        name: '成品视频',
        code: 'finish_video',
        checked: false,
        children: [
          {
            name: 'IP',
            code: 'finish_video_ip',
            isAll: false,
            allTxt: '所有IP',
            childrenValue: []
          }
        ]
      }
    ]
  }
  // {
  //   name: '达人合作',
  //   code: 'coop_intelligent',
  //   curIndex: -1, // 第三层是否展示
  //   isAll: null, // 第三层指定 全选还是
  //   childrenValue: [], // 第三层指定 数据
  //   checked: false,
  //   children: [
  //     {
  //       name: '商品达人',
  //       code: 'product_inteligent',
  //       checked: false,
  //       children: [
  //         {
  //           name: '达人账号',
  //           code: 'inteligent_account',
  //           isAll: false,
  //           allTxt: '所有达人',
  //           childrenValue: []
  //         }
  //       ]
  //     }
  //   ]
  // }
]
export const detailsTableJson = {
  columns: [
    { prop: 'typeName', type: 'text', label: '操作类型', disable: false, visible: true, minWidth: 142 },
    { prop: 'createUserName', type: 'text', label: '操作者', disable: false, visible: true, minWidth: 142 },
    { prop: 'createTime', type: 'text', label: '操作时间', disable: false, visible: true, minWidth: 142 },
    { prop: 'remark', type: 'text', label: '备注', disable: false, visible: true, minWidth: 142 }
  ],
  slotArr: [
    'footer'
  ]
}
