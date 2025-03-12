const envList = {
  development: 'dev',
  beta: 'beta',
  test: 'test',
  production: ''
}
const env = envList[process.env.NODE_ENV] || ''
const institutionConfig = [
  {
    key: 'hok',
    title: '获课文化',
    checked: true,
    tenantId: 1000,
    vue_app_h5_url: `https://${env ? env + '.' : ''}h5.hokkj.cn/`
  },
  {
    key: 'qianyan',
    title: '前沿流量',
    checked: true,
    tenantId: 1001,
    vue_app_h5_url: `https://bosum.hokkj.cn/qianyan${env}/`
  },
  {
    key: 'bowen',
    title: '博文书院',
    checked: true,
    tenantId: 1002,
    vue_app_h5_url: `https://bosum.hokkj.cn/bowen${env}/`
  },
  {
    key: 'qianyi',
    title: '千易咨询',
    checked: true,
    tenantId: 1005,
    vue_app_h5_url: `https://bosum.hokkj.cn/qianyi${env}/`
  },
  {
    key: 'quanyu',
    title: '全域文化',
    checked: true,
    tenantId: 1006,
    vue_app_h5_url: `https://bosum.hokkj.cn/quanyu${env}/`
  },
  {
    key: 'boshang',
    title: '博商',
    checked: true,
    tenantId: 1011,
    vue_app_h5_url: `https://bosum.hokkj.cn/boshang${env}/`
  }
]
export default institutionConfig

