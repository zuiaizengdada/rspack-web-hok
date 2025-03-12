export const desensitizationTableJson = {
  columns: [
    { prop: 'name', type: 'slot', label: '视频名称', disable: false, visible: true, minWidth: 160 },
    { prop: 'size', type: 'slot', label: '视频大小', disable: false, visible: true, minWidth: 100 },
    { prop: 'duration', type: 'slot', label: '视频时长', disable: false, visible: true, minWidth: 100 },
    { prop: 'supplierOrgName', type: 'text', label: '供应机构', disable: false, visible: true, minWidth: 142 },
    { prop: 'cpOrgList', type: 'slot', label: '合作机构', disable: false, visible: true, minWidth: 142 },
    { prop: 'teacherName', type: 'slot', label: 'IP', disable: false, visible: true, minWidth: 142 },
    { prop: 'videoGroupName', type: 'slot', label: '视频组', disable: false, visible: true, minWidth: 142 },
    { prop: 'createUserName', type: 'text', label: '分发人', disable: false, visible: true, minWidth: 100 },
    { prop: 'createTime', type: 'text', label: '分发时间', disable: false, klvisible: true, minWidth: 160 },
    {
      prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 80,
      fixed: 'right'
    }
  ],
  slotArr: ['search', 'action', 'footer', 'name', 'videoGroupName', 'size', 'duration', 'cpOrgList', 'teacherName'],
  searchInfo: {
    name: undefined, // 视频名称
    title: undefined, // 视频组标题
    teacherId: undefined, // 讲师ID
    createUserId: undefined, // 	分发人
    supplierOrgId: undefined, // 供应机构ID
    cpOrgId: undefined, //  合作机构ID
    time: [] // [开始时间， 结束时间] [startTime, endTime]
  }
}

export const finishedTableJson = {
  columns: [
    { prop: 'name', type: 'slot', label: '视频名称', disable: false, visible: true },
    { prop: 'size', type: 'slot', label: '视频大小', disable: false, visible: true, minWidth: 142 },
    { prop: 'duration', type: 'slot', label: '视频时长', disable: false, visible: true, minWidth: 142 },
    { prop: 'supplierOrgName', type: 'slot', label: '供应机构', disable: false, visible: true, minWidth: 142 },
    { prop: 'cpOrgList', type: 'slot', label: '合作机构', disable: false, visible: true, minWidth: 142 },
    { prop: 'teacherName', type: 'slot', label: 'IP', disable: false, visible: true, minWidth: 142 },
    { prop: 'createUserName', type: 'slot', label: '分发人', disable: false, visible: true, minWidth: 102 },
    { prop: 'createTime', type: 'text', label: '分发时间', disable: false, visible: true, minWidth: 150 },
    { prop: 'assignList', type: 'slot', label: '指派人员', disable: false, visible: true, minWidth: 182 },
    {
      prop: 'action', type: 'slot', label: '操作', disable: false, visible: true, minWidth: 142, fixed: 'right'
    }
  ],
  slotArr: ['search', 'action', 'footer', 'name', 'title', 'size', 'duration', 'cpOrgList', 'teacherName', 'createUserName', 'supplierOrgName', 'assignList'],
  searchInfo: {
    name: undefined, // 视频名称
    teacherId: undefined, // 讲师ID
    createUserId: undefined, // 	分发人
    supplierOrgId: undefined, // 供应机构ID
    cpOrgId: undefined, //  合作机构ID
    time: [] // [开始时间， 结束时间] [startTime, endTime]
  }
}

export const rangeCheckList = [
  {
    name: '内容合作',
    code: 'coop_content',
    checked: false,
    curIndex: -1, // 第三层是否展示
    isAll: false, // 第三层是否全选
    radioValue: [], // 第三层指定 数据
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
  },
  {
    name: '达人合作',
    code: 'coop_intelligent',
    curIndex: -1, // 第三层是否展示
    isAll: false, // 第三层是否全选
    radioValue: [], // 第三层指定 数据
    checked: false,
    children: [
      {
        name: '商品达人',
        code: 'product_inteligent',
        checked: false,
        children: [
          {
            name: '达人账号',
            code: 'inteligent_account',
            isAll: false,
            allTxt: '所有达人',
            childrenValue: []
          }
        ]
      }
    ]
  }
]
