import moment from 'moment'
import {
  educationType,
  academicStatusType,
  relationshipType,
  educationTypeMap
} from '@/views/businessAdmin/talentFile/options'

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
      label: '单位名称',
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
    {
      prop: 'treatment',
      type: 'text',
      label: '待遇（元）',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => row.treatment.toFixed(2)
    },
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
      label: '证明人',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    {
      prop: 'witnessPhone',
      type: 'text',
      label: '证明人电话',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    }
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
    {
      prop: 'educationType',
      type: 'text',
      label: '是否全日制',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => educationType.get(row.educationType)
    },
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
      prop: 'educationType',
      type: 'text',
      label: '学位',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => educationTypeMap.get(row.education)
    },
    {
      prop: 'academicStatus',
      type: 'text',
      label: '毕/肄/结业',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true,
      render: row => academicStatusType.get(row.academicStatus)
    }
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
      render: row => relationshipType.get(row.relationship)
    },
    {
      prop: 'workUnit',
      type: 'text',
      label: '工作单位',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    {
      prop: 'position',
      type: 'text',
      label: '职务',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    },
    {
      prop: 'phone',
      type: 'text',
      label: '联系电话',
      fixed: true,
      dataType: 'String',
      disable: true,
      visible: true
    }
  ]
}
