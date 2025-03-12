export function getColumns() {
  return [
    {
      prop: 'subjectId',
      label: '主体ID',
      width: 90,
      type: 'text',
      visible: true
    },
    {
      prop: 'contractSubject',
      label: '合同主体名称',
      width: 300,
      type: 'text',
      visible: true
    },
    {
      prop: 'unifiedSocialCreditCode',
      label: '统一社会信用码',
      type: 'text',
      visible: true
    },
    {
      prop: 'legalPerson',
      label: '法人代表',
      type: 'text',
      visible: true
    },
    {
      prop: 'showStatus',
      label: '主体状态',
      type: 'slot',
      visible: true
    },
    {
      prop: 'action',
      label: '操作',
      fixed: 'right',
      width: '180',
      type: 'slot',
      visible: true
    }
  ]
}
