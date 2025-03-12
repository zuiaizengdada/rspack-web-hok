const enums = {
  // QA状态
  qaStatus: {
    // 待内容审核
    1: '待审核',
    2: '风控驳回',
    // 待风控审核
    3: '待审核',
    4: '修改中',
    5: '已入库',
    9: '重复问题'
  },
  // 数据来源
  source: {
    1: '手动录入',
    2: '知识库',
    3: '用户提问',
    4: '用户负向反馈'
  }
}

// 根据key转化为枚举数组
export const getMapList = key => {
  return Object.keys(enums[key]).map(item => {
    return {
      label: enums[key][item],
      value: item
    }
  })
}

// 根据key返回对应对象
export const getMapObj = key => {
  return enums[key]
}
