import moment from 'moment'
export const quickDateList = [{
  label: '昨天',
  value: [moment().subtract(1, 'day').format('YYYY-MM-DD'), moment().subtract(1, 'day').format('YYYY-MM-DD')]
},
{
  label: '近7天',
  value: [moment().subtract(7 - 1, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
},
{
  label: '近30天',
  value: [moment().subtract(30 - 1, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
}
]
