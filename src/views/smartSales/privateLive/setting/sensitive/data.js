// Ip老师敏感词配置
export const ipConfig = {
  form: {
    ref: null,
    formData: {
      sceneType: 1, // 场景分类：1、IP老师 2、视频敏感词 3、分组敏感词
      groupName: '', // IP老师
      groupId: '', // IP老师
      content: undefined // 敏感词
    },
    operatorSpan: 12,
    fieldList: [
      {
        prop: 'groupId',
        label: 'IP老师',
        slotName: 'groupId',
        className: ['children-ml0']
      },
      {
        prop: 'content',
        label: '敏感词',
        cpn: 'el-input',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'groupName',
        type: 'text',
        label: 'IP老师',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'text',
        label: '敏感词内容',
        disable: false,
        visible: true,
        minWidth: 'auto'
      },
      {
        prop: 'operator',
        type: 'text',
        label: '操作人',
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
    slotArr: ['content', 'action', 'footer']
  }
}

// 视频敏感词配置
export const videoConfig = {
  form: {
    ref: null,
    formData: {
      sceneType: 2, // 场景分类：1、IP老师 2、视频敏感词 3、分组敏感词
      groupName: '', // 视频素材名称
      groupId: '', // 视频素材id
      content: undefined // 敏感词
    },
    operatorSpan: 12,
    fieldList: [
      {
        prop: 'groupId',
        label: '视频素材名称',
        slotName: 'groupId',
        className: ['children-ml0']
      },
      {
        prop: 'content',
        label: '敏感词',
        cpn: 'el-input',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'groupName',
        type: 'text',
        label: '视频素材名称',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'text',
        label: '敏感词内容',
        disable: false,
        visible: true,
        minWidth: 'auto'
      },
      {
        prop: 'operator',
        type: 'text',
        label: '操作人',
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
    slotArr: ['content', 'action', 'footer']
  }
}

// 分组敏感词配置
export const groupConfig = {
  form: {
    ref: null,
    formData: {
      sceneType: 3, // 场景分类：1、IP老师 2、视频敏感词 3、分组敏感词
      groupName: '', // IP老师
      // groupId: '', // IP老师
      content: undefined // 敏感词
    },
    operatorSpan: 12,
    fieldList: [
      {
        prop: 'groupName',
        label: '分组名称',
        cpn: 'el-input',
        className: ['children-ml0']
      },
      {
        prop: 'content',
        label: '敏感词',
        cpn: 'el-input',
        className: ['children-ml0']
      }
    ]
  },
  table: {
    columns: [
      {
        prop: 'groupName',
        type: 'text',
        label: '分组名称',
        disable: false,
        visible: true,
        minWidth: 142
      },
      {
        prop: 'content',
        type: 'text',
        label: '敏感词内容',
        disable: false,
        visible: true,
        minWidth: 'auto'
      },
      {
        prop: 'operator',
        type: 'text',
        label: '操作人',
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
    slotArr: ['content', 'action', 'footer']
  }
}
