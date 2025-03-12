export const tabItems = ['推荐模板', '我的模板']
export const tagItems = ['标题生成', '文案改写', '内容提炼']

import { queryTemplateList } from '@/api/aigc/callWord'

const validateRepeat = async (rule, value, callback) => {
  const pageParams = {
    // 	是否是系统模版
    isSystem: true,
    // 用户id
    userId: JSON.parse(localStorage.getItem('UserInfo')).userId,
    // 租户id
    tenantId: JSON.parse(localStorage.getItem('orgInfo')).organizationId,
    // 页数
    pageIndex: 1,
    // 每页大小
    pageSize: 99999
  }
  const {
    code,
    data: { items }
  } = await queryTemplateList(pageParams)

  if (code === 1) {
    if (items.find(item => item.templateTitle === value)) {
      callback(new Error('名称已存在，请尝试使用其他名称'))
    } else {
      callback()
    }
  }
}

const validateMoreThan20 = (rule, value, callback) => {
  if (value.length > 20) {
    callback(new Error('最多只能输入20个字符'))
  } else {
    callback()
  }
}

export const rules = {
  templateTitle: [
    { required: true, message: '未输入模板标题', trigger: 'blur' },
    { validator: validateRepeat, trigger: 'blur' },
    { validator: validateMoreThan20, trigger: 'change' }
  ],
  content: [
    { required: true, message: '未输入提示词内容', trigger: 'blur' },
    { min: 1, max: 2000, message: '最多只能输入2000个字符', trigger: 'blur' }
  ]
}
