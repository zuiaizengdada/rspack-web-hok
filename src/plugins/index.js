import Vue from 'vue'

// 高德地图
import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  // 高德的key
  key: process.env.VUE_APP_GAODE_KEY,
  // 插件集合
  plugin: [
    'AMap.Autocomplete',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor'
  ]
  // 高德 sdk 版本，默认为 1.4.4
})
// 图片查看器
import ImageViewer from 'vue2-viewer'
Vue.use(ImageViewer)

// 音频播放器
import AppAudio from '@/components/AppAudio/index.js'
Vue.use(AppAudio)

// 图片裁剪组件
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// 注册拖拽组件
import VueDND from 'awe-dnd'
Vue.use(VueDND)

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 删除操作二次确定弹框插件
import delModal from '@/components/delModal/index.js'
Vue.use(delModal)

// 选择弹框插件
import Select from '@/components/Select/index.js'
Vue.use(Select)

// 修改名称组件
import AppEditName from '@/components/AppEditName/index.js'
Vue.use(AppEditName)

// 自定义图片裁剪组件
import AppImageCropper from '@/components/AppImageCropper/index.js'
Vue.use(AppImageCropper)

// 选择素材插件(多选)
import AppSelectMaterialMultiple from '@/components/AppSelectMaterialMultiple/index.js'
Vue.use(AppSelectMaterialMultiple)

// 选择素材插件(单选)
import AppSelectMaterial from '@/components/AppSelectMaterial/index.js'
Vue.use(AppSelectMaterial)

// 选择商品插件(单选)
import AppSelectGoods from '@/components/AppSelectGoods/index.js'
Vue.use(AppSelectGoods)
// 选择商品插件(单选) 上下架都包含版
import AppSelectAllGoods from '@/components/AppSelectAllGoods/index.js'
Vue.use(AppSelectAllGoods)
// 列表选择组件
// import AppTableFilter from '@/components/AppTableFilter/index.js'
// Vue.use(AppTableFilter)

// 音视频上传组件
import AppUpload from '@/components/AppUpload/index.js'
Vue.use(AppUpload)

// 图文上传组件
import AppUploadImagAndFile from '@/components/AppUploadImagAndFile/index.js'
Vue.use(AppUploadImagAndFile)

// 贴标签
import AppLabel from '@/components/AppLabel/index.js'
Vue.use(AppLabel)

import AppEditGoods from '@/components/Modal/course/index.js'
Vue.use(AppEditGoods)

// 地址本组件
import AddressBook from '@/components/AddressBook3'
Vue.use(AddressBook)
// 地址本组件
import AddressBook2 from '@/components/AddressBook2'
Vue.use(AddressBook2)
// 通讯录，选择部门，实质选择到人员
import AddressBookUser from '@/components/AddressBook'
Vue.use(AddressBookUser)
import OSSUpload from '@/components/OSSUpload/index.js'
Vue.use(OSSUpload)

// 选择发送对象组件
import SendObj from '@/components/AppSendObj'
Vue.use(SendObj)

// 任务中心
import TaskCenter from '@/components/global/taskCenter/index'
Vue.use(TaskCenter)
// 选择线下课程弹框
import SelectOffineCource from '@/components/SelectOffineCource'
Vue.use(SelectOffineCource)

// 视频播放器
import GlobalVideoplayer from '@/components/GlobalVideoplayer'
Vue.use(GlobalVideoplayer)

// 检测是否需要同步数据
import DetectionVideo from '@/components/GlobalDetectionVideo'
Vue.use(DetectionVideo)

// 选择商品插件(单选) 包含商品常用功能
import AppCommonUseGoods from '@/components/AppCommonUseGoods/index.js'
Vue.use(AppCommonUseGoods)
