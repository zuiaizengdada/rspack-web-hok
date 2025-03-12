//人员管理ActiveName
export const staffActiveNameType = new Map([
  ['all', 0],
  ['probation', 1],
  ['regular', 2],
  ['quit', 3]
])

//调动类型
export const transferTypeOption = [
  { label: '调岗', value: 1 },
  { label: '晋升', value: 2 },
  { label: '降级', value: 3 },
  { label: '其他', value: 9 }
]
//离职方式
export const departureTypeOption = [
  { label: '自离', value: 1 },
  { label: '主动离职', value: 2 }
]

//合同类型
export const flieType = new Map([
  [1, '合同协议'],
  [2 ,'公司制度'],
])

//审核状态
export const reviewStatusOption = [
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '被驳回', value: 2 }
]

//落章
export const sealStatusOption = [
  { label: '未落章', value: 1 },
  { label: '已落章', value: 2 }
]
