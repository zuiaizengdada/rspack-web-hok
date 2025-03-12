import singleLineTextPng from '@/assets/image/oa/singleLineText.png'
import numberPng from '@/assets/image/oa/number.png'
import officialSealPng from '@/assets/image/oa/officialSeal.png'
import multilineTextPng from '@/assets/image/oa/multilineText.png'
import autographPng from '@/assets/image/oa/autograph.png'
import emailPng from '@/assets/image/oa/email.png'
import idCardPng from '@/assets/image/oa/idCard.png'
// 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1
}

export const commonAttr = {
  animations: [],
  events: {},
  groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
  isLock: false, // 是否锁定组件
  collapseName: 'style', // 编辑组件时记录当前使用的是哪个折叠面板，再次回来时恢复上次打开的折叠面板，优化用户体验
  linkage: {
    duration: 0, // 过渡持续时间
    data: [
      // 组件联动
      {
        id: '', // 联动的组件 id
        label: '', // 联动的组件名称
        event: '', // 监听事件
        style: [{ key: '', value: '' }] // 监听的事件触发时，需要改变的属性
      }
    ]
  }
}

// 编辑器左侧组件列表 type（1-单行文本，2-多行文本，3-数字，4-邮箱，5-日期，6-身份证号码，7-签名，8-公章）
const list = [
  {
    component: 'VText',
    label: '单行文本',
    propValue: '双击编辑文字',
    icon: singleLineTextPng,
    pageNum: '',
    type: 1,
    fontId: 1,
    isRequired: 0,
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 180,
      height: 24,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 2,
      top: 0,
      left: 0
    }
  },
  {
    component: 'VText',
    label: '多行文本',
    propValue: '双击编辑文字',
    icon: multilineTextPng,
    type: 2,
    fontId: 1,
    pageNum: '',
    textExample: 2,
    textExampleContent: '',
    isRequired: 0,
    maxLength: '',
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 180,
      height: 40,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 4
    }
  },
  {
    component: 'VText',
    label: '身份证',
    propValue: '双击编辑文字',
    icon: idCardPng,
    type: 6,
    fontId: 1,
    pageNum: '',
    isRequired: 0,
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 180,
      height: 24,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 2
    }
  },
  {
    component: 'VText',
    label: '数字',
    propValue: '双击编辑文字',
    icon: numberPng,
    type: 3,
    fontId: 1,
    pageNum: '',
    isRequired: 0,
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 180,
      height: 24,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 2
    }
  },
  {
    component: 'VText',
    label: '日期',
    propValue: '双击编辑文字',
    icon: numberPng,
    type: 5,
    pageNum: '',
    fontId: 1,
    isRequired: 0,
    dateUnit: 3, //3-年，2-月，1-日
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 180,
      height: 24,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 2
    }
  },
  {
    component: 'VText',
    label: '邮箱',
    propValue: '双击编辑文字',
    icon: emailPng,
    type: 4,
    fontId: 1,
    pageNum: '',
    isRequired: 0,
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 180,
      height: 24,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 2
    }
  },
  {
    component: 'VText',
    label: '签名',
    propValue: '双击编辑文字',
    icon: autographPng,
    type: 7,
    fontId: 1,
    isRequired: 1,
    pageNum: '',
    signatureType: 1, //1-乙方，2-甲方
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 180,
      height: 24,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 2
    }
  },
  {
    component: 'VText',
    label: '公章',
    propValue: '双击编辑文字',
    icon: officialSealPng,
    type: 8,
    fontId: 1,
    isRequired: 1,
    pageNum: '',
    request: {
      method: 'GET',
      data: [],
      url: '',
      series: false, // 是否定时发送请求
      time: 1000, // 定时更新时间
      paramType: '', // string object array
      requestCount: 0 // 请求次数限制，0 为无限
    },
    style: {
      width: 100,
      height: 100,
      fontSize: 14,
      fontWeight: 400,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'left',
      color: 'rgb(0,0,0)',
      padding: 4
    }
  }
]

for (let i = 0, len = list.length; i < len; i++) {
  const item = list[i]
  item.style = { ...commonStyle, ...item.style }
  list[i] = { ...commonAttr, ...item }
}

export default list
