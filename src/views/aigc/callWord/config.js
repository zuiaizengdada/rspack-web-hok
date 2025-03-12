// 提示词管理
export const getColumns = () => {
  return [
    {
      prop: 'templateTitle',
      label: '模板名称',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'templateClassifyName',
      label: '提示词分类',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      disable: true
    }
  ]
}

// 提示词管理分类
export const getCategoryColumns = () => {
  return [
    {
      prop: 'classifyName',
      label: '分类名称',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'weight',
      label: '分类权重',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'createTime',
      label: '创建时间',
      type: 'text',
      visible: true,
      disable: false
    },
    {
      prop: 'action',
      label: '操作',
      type: 'slot',
      visible: true,
      disable: true
    }
  ]
}

// 提示词模板创建规则
export const templateRules = {
  templateTitle: [
    { required: true, message: '未输入模板标题', trigger: 'blur' },
    { min: 1, max: 20, message: '限制最多输入20个字符', trigger: 'blur' }
  ],
  templateClassifyId: {
    required: true,
    message: '未选择模板分类',
    trigger: 'change'
  },
  content: [
    { required: true, message: '未输入提示词内容', trigger: 'blur' },
    { min: 1, max: 2000, message: '限制最多输入2000个字符', trigger: 'blur' }
  ]
}

// 提示词分类创建规则
export const categoryRules = {
  classifyName: [
    { required: true, message: '未输入分类名称', trigger: 'blur' },
    { min: 1, max: 20, message: '限制最多输入20个字符', trigger: 'blur' }
  ],
  weight: [{ required: true, message: '未输入分类权重', trigger: 'blur' }]
}
