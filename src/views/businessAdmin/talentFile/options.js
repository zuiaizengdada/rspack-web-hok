//证件类型
import moment from 'moment'

export const certificateType = new Map([
  ['idCardFront', 1],
  ['idCardBack', 1],
  ['graduationCard', 2],
  ['academicCard', 3],
  ['bankCard', 4],
  ['leaveCard', 5],
  ['eleDocumenst', 7],
  ['checkupCard', 6],
  ['otherCertificateCard', 99],
  ['socialSecurityCard', 8]
])
const relationshipOption2 = [
  { label: '父子/女', value: 1 },
  { label: '母子/女', value: 2 },
  { label: '夫妻', value: 3 },
  { label: '亲戚', value: 4 },
  { label: '朋友', value: 5 },
  { label: '其他', value: 6 }
]

const certificateType2 = new Map([
  ['idCardFront', 1],
  ['idCardBack', 1],
  ['graduationCard', 2],
  ['academicCard', 3],
  ['bankCard', 4],
  ['leaveCard', 5],
  ['eleDocumenst', 7],
  ['checkupCard', 6],
  ['otherCertificateCard', 99],
  ['socialSecurityCard', 8]
])
//性别
export const sexType = new Map([
  [0, '男'],
  [1, '女']
])
//是否
export const sureType = new Map([
  [1, '是'],
  [2, '否']
])
//婚姻
export const maritalStatusType = new Map([
  [0, '未婚'],
  [1, '已婚'],
  [2, '其他']
])

//亲属关系
export const relationshipType = new Map([
  [1, '父子/女'],
  [2, '母子/女'],
  [3, '夫妻'],
  [4, '亲戚'],
  [5, '朋友'],
  [6, '其他']
])
const relationshipType2 = new Map([
  [1, '父子/女'],
  [2, '母子/女'],
  [3, '夫妻'],
  [4, '亲戚'],
  [5, '朋友'],
  [6, '其他']
])

export const sourceMap = new Map([
  [1, 'BOSS直聘'],
  [2, '智联招聘'],
  [3, '前程无忧'],
  [4, '拉勾'],
  [5, '猎聘'],
  [6, '内推'],
  [7, '公众号/朋友圈'],
  [8, '其他']
])

//学历类型
export const educationType = new Map([
  [0, '全日制'],
  [1, '非全日制'],
  [2, '培训']
])
const educationType2 = new Map([
  [0, '全日制'],
  [1, '非全日制'],
  [2, '培训']
])

//学业状态
export const academicStatusType = new Map([
  [0, '毕业'],
  [1, '结业'],
  [2, '肄业']
])
const academicStatusType2 = new Map([
  [0, '毕业'],
  [1, '结业'],
  [2, '肄业']
])
//有，没有
export const hasType = new Map([
  [1, '有'],
  [2, '无']
])
//健康状况
export const healthStatusType = new Map([
  [1, '有传染性疾病'],
  [2, '无传染性疾病'],
  [3, '其他']
])
//最高学历
export const educationTypeMap = new Map([
  [1, '小学'],
  [2, '初中'],
  [3, '高中'],
  [4, '中专'],
  [5, '大专'],
  [6, '学士'],
  [7, '硕士'],
  [8, '博士']
])
const educationTypeMap2 = new Map([
  [1, '小学'],
  [2, '初中'],
  [3, '高中'],
  [4, '中专'],
  [5, '大专'],
  [6, '学士'],
  [7, '硕士'],
  [8, '博士']
])
export function getWorkColumns() {
  return [
    {
      prop: 'entryTime',
      type: 'text',
      label: '在职期间',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row =>
        `${moment(row.entryTime).format('YYYY.MM')}至${moment(
          row.departureTime
        ).format('YYYY.MM')}`
    },
    {
      prop: 'companyName',
      type: 'text',
      label: '机构名称',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    {
      prop: 'positionName',
      type: 'text',
      label: '岗位',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    // {
    //   prop: 'treatment',
    //   type: 'text',
    //   label: '待遇（元）',
    //   fixed: true,
    //   dataType: 'String',
    //   disable: true,
    //   visible: true,
    //   render: row => row.treatment.toFixed(2)
    // },
    {
      prop: 'departureReason',
      type: 'text',
      label: '离职原因',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    {
      prop: 'witness',
      type: 'text',
      label: '证明人及电话',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => row.witness + '/' + row.witnessPhone
    }
    // {
    //   prop: 'witnessPhone',
    //   type: 'text',
    //   label: '证明人电话',
    //   fixed: true,
    //   dataType: 'String',
    //   disable: true,
    //   visible: true
    // }
  ]
}

export function getEducationColumns() {
  return [
    {
      prop: 'entryTime',
      type: 'text',
      label: '学习期间',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row =>
        `${moment(row.entryTime).format('YYYY.MM')}至${moment(
          row.graduationTime
        ).format('YYYY.MM')}`
    },
    {
      prop: 'schoolName',
      type: 'text',
      label: '学校名称',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    // {
    //   prop: 'educationType',
    //   type: 'text',
    //   label: '是否全日制',
    //   fixed: true,
    //   dataType: 'String',
    //   disable: true,
    //   visible: true,
    //   render: row => educationType2.get(row.educationType)
    // },
    {
      prop: 'major',
      type: 'text',
      label: '专业',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    {
      prop: 'education',
      type: 'text',
      label: '学位',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => educationTypeMap2.get(row.education)
    }
    // {
    //   prop: 'academicStatus',
    //   type: 'text',
    //   label: '毕/肄/结业',
    //   fixed: true,
    //   dataType: 'String',
    //   disable: true,
    //   visible: true,
    //   render: row => academicStatusType2.get(row.academicStatus)
    // }
  ]
}

export function getFamilyColumns() {
  return [
    {
      prop: 'name',
      type: 'text',
      label: '姓名',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    {
      prop: 'relationship',
      type: 'text',
      label: '关系',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => relationshipType2.get(row.relationship)
    },
    {
      prop: 'workUnit',
      type: 'text',
      label: '工作单位及联系电话',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => (row.workUnit ? row.workUnit + '/' + row.phone : row.phone)
    },
    {
      prop: 'position',
      type: 'text',
      label: '职务',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true // {
      //   prop: 'phone',
      //   type: 'text',
      //   label: '联系电话',
      //   fixed: true,
      //   dataType: 'String',
      //   disable: true,
      //   visible: true
      // }
    }
  ]
}

//亲属关系
export const relationshipOption = [
  { label: '父子/女', value: 1 },
  { label: '母子/女', value: 2 },
  { label: '夫妻', value: 3 },
  { label: '亲戚', value: 4 },
  { label: '朋友', value: 5 },
  { label: '其他', value: 6 }
]

//入职登记表审核状态
export const entryRegisterAuditStatusOption = [
  { label: '待提交', value: 0 },
  { label: '待审核', value: 1 },
  { label: '已通过', value: 2 },
  { label: '被驳回', value: 3 }
]
