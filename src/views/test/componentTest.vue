<template lang="">
  <div>
    测试模块
    <el-button @click="play">点击播放音频</el-button>
    <el-button @click="playVideo">点击播放视频</el-button>

    <div>
      测试
      <el-button @click="openMaterial">打开选择素材(单选)</el-button>
      <el-button @click="openMaterialMultiple">打开选择素材(多选)</el-button>

      <el-button @click="openSelectGoods">打开选择商品</el-button>

      <!-- <el-button @click="openTableFilter">打开表格筛选弹框</el-button> -->

      <!-- <el-button @click="openUpload">打开上传音视频组件弹框</el-button> -->

      <el-button @click="openAppLabel">打开贴标签组件</el-button>

      <el-button @click="openAdressBook">打开选择部门组件</el-button>

      <el-button @click="openAdressBook2">打开选择人员组件</el-button>

      <el-button @click="openSendObj">打开发送对象组件</el-button>
      <el-button @click="openDetectionVideo">检测视频管理功能</el-button>
    </div>

    <div>
      <clipboard />
    </div>

    <div>
      <el-button @click="uwbClick()">测试埋点</el-button>

    </div>
    <AppChinaArea v-model="arr" :maxlevel="maxLeve" propsvalue="name" @change="change" />
    <AppSelect :get-api-fn="getAssistantPage" search-key="sysUserName" :value="appSelct.value" :label="appSelct.label" :props="appSelct.props" @selected="selected" />

    <div>
      <MVolume v-model="volume" />
    </div>

    <div>
      <el-button @click="openVideoExport">打开视频导出弹框</el-button>
    </div>

    <div>
      <el-button @click="openTextFile">打开文本文件</el-button>
    </div>

    <div>
      <upload
        ref="MUpload"
        width="160"
        height="120"
        accept=".jpg,.jpeg,.png"
        :before-upload="beforeUpload"
        :max-length="2"
        :cropper-option="{ // 裁剪设置
          fixed: true, // 是否开启截图框宽高固定比例
          infoTrue: false, // 为展示真实输出图片宽高 false 展示看到的截图框宽高	false	true | false
          centerBox: false, // 截图框是否被限制在图片里面	false	true | false
          canMoveBox: true, // 截图框能否拖动	true	true | false
          fixedNumber: [16, 9], // 截图框的宽高比例 [宽度, 高度]
          autoCropWidth: 640,
        }"
        @onClick="onUploadClick"
        @change="fileChange"
      />
    </div>
  </div>
</template>
<script>
import { getLiveOssCConfig } from '@/api/liveRoom/index'
import AppVideo from '@/components/AppVideo'
import { mapGetters } from 'vuex'
import clipboard from './clipboard'
import AppChinaArea from '@/components/AppChinaArea'
import AppSelect from '@/components/AppSelect'
import { getAssistantPage } from '@/api/deliver/assistant'
import videoExport from '@/views/videoEditor/components/videoExport/index.js'
import Dialog from '@/components/Dialog/index.js'
import upload from '@/components/AppUploadViewCropper/upload'
export default {
  components: {
    upload,
    clipboard,
    AppChinaArea,
    AppSelect
  },
  data() {
    return {
      arr: [],
      maxLeve: 4,
      appSelct: {
        label: '',
        value: '',
        props: {
          label: 'tearchName',
          value: 'tearchId'
        }
      },
      fileList: [],
      volume: 10
    }
  },
  computed: {
    ...mapGetters(['videoClass']),
    treeSelectData() {
      if (this.videoClass.length > 0) {
        return this.videoClass[0].children
      } else {
        return []
      }
    }
  },
  created() {
    this.$store.dispatch('option/getClass')
  },
  methods: {
    getLiveOssCConfig,
    openTextFile() {
      Dialog.open({
        type: 'TxtPreview',
        visible: true,
        src: 'https://dev.oss.hokkj.cn/hok_ai/file/5tt0lmaj6v8000031/gu.txt'
      })
    },
    play() {
      this.$AppAudio({
        visible: true,
        src: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4'
      })
    },
    playVideo() {
      AppVideo.play({
        url: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4'
      })
    },
    openMaterial() {
      this.$SelectMaterial({
        visible: true,
        types: [0, 1, 2, 4],
        success: (res) => {
          console.log(res, 'res')
        }
      })
    },
    openDetectionVideo() {
      this.$DetectionVideo({
        visible: true,
        nums: 4,
        success: (res) => {
          console.log(res, 'res')
        }
      })
    },
    openMaterialMultiple() {
      this.$SelectMaterialMultiple({
        visible: true,
        type: 'fileView',
        types: [0, 1, 2, 4],
        imageList: [{ materialId: '47d622c2a19a435b8c9a5f50ad0dbfea' }],
        success: (res) => {
          console.log(res, 'res')
        }
      })
    },
    openSelectGoods() {
      this.$SelectGoods({
        visible: true,
        multiple: true,
        isPlaform: true,
        showCourseType: true, // 开启标签筛选
        tearchSearch: true, // 是否开启查询条件IP
        isSearchPrice: true, // 是否开启查询条件按价格
        packagePrice: true, // 是否开启套餐单价的输入,只有图文，音频，视频，专栏，大专栏，线下课生效，返回结果带packagePrice参数，单位为元；
        check: ['9de2b9f0bb7a41e793b01975e64ab990'],
        success: (res) => {
          console.log(res, 'res')
        }
      })
    },
    // openTableFilter() {
    //   console.log('11')
    //   this.$TableFilter({
    //     visible: true
    //   })
    // },
    openUpload() {
      this.$AppUpload({
        treeSelectData: this.treeSelectData,
        visible: true,
        type: 2
      })
    },
    // 贴标签
    openAppLabel() {
      console.log('打开贴标签')
      this.$AppLabel({
        visible: true,
        success: (res) => {
          console.log(res)
        }
      })
    },
    // 打开地址本组件
    openAdressBook() {
      this.$AddressBook({
        visible: true,
        defultCheck: [],
        success: (res) => {
          console.log(res)
        }
      })
    },
    // 打开地址本组件
    openAdressBook2() {
      this.$AddressBook({
        visible: true,
        type: [1],
        success: (res) => {
          console.log(res)
        }
      })
    },
    // 打开发送对象组件
    openSendObj() {
      // const myArray = ['1', '2']
      this.$SendObj({
        visible: true,
        columnDisabledFn: (row, index) => {
          // console.log()
          return !(row.id === '1')
          // return false
        },
        userDisabledFn: (row, index) => {
          return !(row.uid === 'ca552f319da54d76922c6cd41a458b83')
          // return false
        },
        success: (res) => {
          console.log(res, '返回的数据')
        }
      })
    },
    change(e) {
      console.log(e)
    },
    selected(e) {
      console.log(e, 'e')
      this.appSelct.label = e.tearchName
      this.appSelct.value = e.tearchId
    },
    getAssistantPage(params) {
      return getAssistantPage(params).then(res => {
        return {
          items: [
            {
              tearchName: '张三',
              tearchId: '001'
            },
            {
              tearchName: '李四',
              tearchId: '002'
            },
            {
              tearchName: '王五',
              tearchId: '003'
            },
            {
              tearchName: '张三',
              tearchId: '004'
            },
            {
              tearchName: '张三',
              tearchId: '005'
            }
          ],
          total: 5
        }
      })
    },
    // 测试埋点
    uwbClick() {
      this.$uweb.setAction('Event_dabaiClick')
    },
    // 打开视频导出弹框
    openVideoExport() {
      videoExport.open({ projectId: '1611987299397144576' })
    },
    fileChange(res) {
      console.log(res)
      this.fileList = res
    },
    onUploadClick(res) {
      console.log(res, 'res')
      this.fileList.splice(res, 1)
    },
    beforeUpload() {
      return true
    }
  }
}
</script>
<style lang='scss' scoped>
::v-deep {
  .el-upload {
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fbfcfe;
      width: 160px;
      height: 120px;
    }
  }
}
</style>
