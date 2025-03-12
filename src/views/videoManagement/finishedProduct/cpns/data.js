export const MyTableJson = {
  columns: [
    {
      prop: 'name',
      label: '视频名称',
      width: 400,
      type: 'slot',
      // headerSlot: true,
      visible: true
    },
    {
      prop: 'videoType',
      label: '视频类型',
      type: 'slot',
      width: 150,
      visible: true
    },
    {
      prop: 'teacherName',
      label: 'IP',
      width: 150,
      type: 'text',
      visible: true,
      render: row => {
        return row.teacherName || '--'
      }
    },
    { prop: 'size', label: '视频大小', type: 'slot', visible: true },
    { prop: 'duration', label: '视频时长', type: 'slot', visible: true },
    {
      prop: 'subtitleStatus',
      label: '字幕处理',
      width: 130,
      type: 'slot',
      visible: true
    },
    {
      prop: 'sensitiveWordStatus',
      label: '敏感词处理',
      width: 130,
      type: 'slot',
      visible: true
    },
    { prop: 'createBy', label: '上传者', type: 'text', visible: true },
    {
      prop: 'uploadTime',
      label: '上传时间',
      width: 180,
      type: 'text',
      visible: true
    },
    {
      prop: 'status',
      label: '发布状态',
      type: 'slot',
      width: 130,
      visible: true
    },
    // { prop: 'createName', label: '已发布渠道', type: 'text', visible: true },
    {
      prop: 'publishTime',
      width: 180,
      label: '发布时间',
      type: 'text',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      width: 220,
      visible: true,
      disable: true,
      fixed: 'right'
    }
  ],
  slotArr: [
    'search',
    'name',
    'videoType',
    'subtitleStatus',
    'size',
    'duration',
    'sensitiveWordStatus',
    'status',
    'action',
    'footer',
    'name-header'
  ]
}

export const MeTableJson = {
  columns: [
    {
      prop: 'name',
      label: '视频名称',
      type: 'text',
      visible: true
    },
    {
      prop: 'teacherName',
      label: 'IP',
      type: 'slot',
      width: 150,
      visible: true
    },
    {
      prop: 'supplierOrgName',
      label: '内容来源',
      type: 'text',
      visible: true
    },
    {
      prop: 'deliveryTime',
      label: '分发时间',
      width: 200,
      type: 'text',
      visible: true
    },

    {
      prop: 'size',
      label: '视频大小',
      type: 'slot',
      width: 150,
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      width: 180,
      visible: true,
      disable: true,
      fixed: 'right'
    }
  ],
  slotArr: [
    'search',
    'size',
    'duration',
    'action',
    'teacherName',
    'headerRight',
    'footer'
  ],
  form: {
    channelSource: undefined, // 发布渠道
    // keyWords: undefined, // 	关键字
    status: undefined, // 发布状态 1-已发布 2-未发布
    supplierOrgId: undefined, // 	内容来源供应机构id
    teacherId: undefined, // IP id
    videoName: undefined, // 视频名称
    videoType: undefined, // 视频类型 1-录制 2-数字人
    time: ['', ''] // [开始时间, 结束时间]
  }
}

