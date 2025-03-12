<template>
  <div class="video-list-container">
    <div class="action-row" :class="desensflag ? '' : 'mg-tops'">
      <div v-if="desensflag && isUploaderFlag" class="action-left flex">
        <div class="mr-5">
          <el-button
            v-if="isTmFlag"
            type="primary"
            size="small"
            @click="toTmShare('tm')"
          >脱敏共享</el-button>
          <div v-else class="left-choose-ac">
            <el-checkbox
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <span
              class="choose-nums-tip"
            >已选{{ checkedVideo.length }}个视频</span>
            <el-button
              class="btns"
              type="primary"
              size="small"
              @click="sureToShare(true)"
            >确认共享</el-button>
            <el-button
              class="btns"
              size="small"
              @click="sureToShare(false)"
            >取消共享</el-button>
            <el-button
              class="btns"
              size="small"
              @click="closeChooseAll('tm')"
            >返回</el-button>
          </div>
        </div>
        <div>
          <el-button
            v-if="isDisFlag"
            v-permission="['web:desenitization:distribute', permsList]"
            type="primary"
            size="small"
            @click="toTmShare('dis')"
          >内容分发</el-button>
          <div v-else class="left-choose-ac">
            <el-checkbox
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <span
              class="choose-nums-tip"
            >已选{{ checkedVideo.length }}个视频</span>
            <el-button
              class="btns"
              type="primary"
              size="small"
              @click="openDisDialog"
            >确认分发</el-button>
            <el-button
              class="btns"
              size="small"
              @click="closeChooseAll('dis')"
            >返回</el-button>
          </div>
        </div>
      </div>
      <div class="action-right">
        <div v-if="type === 2" class="choose-status">
          <span>机位筛选</span>
          <el-select v-model="cameraFlag" size="small" placeholder="状态选择" @change="chooseDesenVideoStatus">
            <el-option
              v-for="item in cameraList"
              :key="item.multiCameraGroupId"
              :label="item.caremaName"
              :value="item.multiCameraGroupId"
            />
          </el-select>
        </div>
        <div class="choose-status">
          <span>视频筛选</span>
          <el-select
            v-model="chooseVideoFlag"
            size="small"
            placeholder="状态选择"
            @change="chooseDesenVideoStatus"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- <el-button v-permission="['web:desenitization:downloadbag', permsList]" size="mini" class="download" @click="handleClickDownload">
          <p v-if="!downLoading">
            <i class="el-icon-download" />
            <span>打包下载</span>
          </p>
          <p v-else>
            <i class="el-icon-loading" />
            <span>下载中</span>
          </p>
        </el-button> -->
      </div>
    </div>
    <div class="wrapper">
      <el-checkbox-group
        v-if="listForData && listForData.length > 0"
        v-model="checkedVideo"
        class="flex flex-wrap justify-between"
        @change="handleCheckedCitiesChange"
      >
        <video-item
          v-for="item in listForData"
          :key="item.id"
          :type="type"
          :istmflag="isFlag"
          :checked-video="checkedVideo"
          :desensflag="desensflag"
          :showstatus="showstatus"
          :groupid="groupid"
          :data="item"
          class="video-item"
          :listtype="listtype"
          :is-uploader-flag="isUploaderFlag"
          :visible-delete="false"
          @loadingData="$emit('loadingData')"
        />
      </el-checkbox-group>
      <div v-else class="resource-item-wrapper-box-noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="m-t-10 noDataText">暂无数据</div>
      </div>
    </div>
    <DisDialog ref="disDialogRef" @success="sureDisSuccess" />
    <ShareDialog ref="shareDialogRef" :teacher-id="teacherId" @success="sureShareSuccess" />
  </div>
</template>
<script>
import { urlVodExportZip } from '@/utils/zip'
import { toChangeShareVideoStatus } from '@/api/product/videoManager'
import VideoItem from './videoItem.vue'
import DisDialog from './disDialog.vue'
import ShareDialog from './shareDialog.vue'
import { videoDownLoadRecord, getGroupByVideoGroupId } from '@/api/videoManagement/origin'
export default {
  components: {
    VideoItem,
    DisDialog,
    ShareDialog
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    listForData: Array,
    listtype: Boolean,
    showstatus: Boolean,
    desensflag: Boolean,
    isUploaderFlag: Boolean,
    teacherName: {
      type: String,
      default: ''
    },
    teacherId: {
      type: String,
      default: ''
    },
    formtitle: {
      type: String,
      default: ''
    },
    isUpload: {
      type: Boolean,
      default: false
    },
    groupid: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      downLoading: false,
      chooseVideoFlag: 0,
      isTmFlag: true,
      isDisFlag: true,
      isFlag: true,
      checkedVideo: [],
      cameraList: [],
      cameraFlag: 0,
      isIndeterminate: true,
      checkAll: false,
      options: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '已脱敏共享'
        },
        {
          value: 2,
          label: '待共享'
        }
      ],
      list: [],
      shareAll: true,
      shareUserList: []
    }
  },
  created() {
    this.$nextTick(() => {
      if (!this.desensflag) {
        this.options = [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 2,
            label: '已自动脱敏'
          },
          {
            value: 1,
            label: '自动脱敏中'
          },
          {
            value: 3,
            label: '自动脱敏失败'
          },
          {
            value: 4,
            label: '无效素材'
          }
        ]
      }
    })
    this.type === 2 && this.getCameraList()
  },
  methods: {
    async getCameraList() {
      const res = await getGroupByVideoGroupId({ videoGroupId: this.groupid })
      // 加一条全部上去
      this.cameraList = [{ multiCameraGroupId: 0, caremaName: '全部', type: 0, sort: 0 }, ...res.data]
      console.log('机位信息', res)
    },
    toTmShare(type) {
      this.checkedVideo = []
      this.checkAll = false
      if (type === 'tm') {
        this.isTmFlag = false
        this.isDisFlag = true
      } else {
        this.isDisFlag = false
        this.isTmFlag = true
      }
      this.isFlag = false
    },
    async handleClickDownload() {
      const list = []
      this.listForData.forEach((item, i) => {
        if (item.status === 2) {
          list.push({ src: item.videoUrl, name: item.name })
          list.push({ src: item.subtitleFileUrl, name: item.name + '.srt' })
        }
      })
      if (list.length <= 0) {
        this.$message.error('没有满足下载要求的视频，请重试！')
        return
      }
      this.downLoading = true
      await urlVodExportZip(list, this.formtitle)
      await videoDownLoadRecord({
        originalVideoId: '',
        videoGroupId: this.groupid,
        videoType: 1
      })
      this.downLoading = false
    },
    sureToShare(flag) {
      if (this.checkedVideo.length <= 0) {
        this.$message.error('请选择需要共享或取消共享的视频！')
        return
      }
      if (flag) {
        this.$refs.shareDialogRef.dialogOperation('open', {})
      } else {
        this.handleChangeShare(false)
      }
    },
    sureShareSuccess(detail) {
      this.shareAll = detail.shareAll
      this.shareUserList = detail.shareUserList
      this.handleChangeShare(true)
    },
    handleChangeShare(flag) {
      const params = {
        isBool: flag,
        videoGroupId: this.groupid,
        desensitizedVideoId: this.checkedVideo,
        shareAll: this.shareAll,
        shareUserList: this.shareAll ? [] : this.shareUserList
      }
      toChangeShareVideoStatus(params).then(res => {
        if (res.success) {
          flag
            ? this.$message.success('共享成功！')
            : this.$message.success('取消共享成功！')
          this.isIndeterminate = true
          this.checkAll = false
          this.checkedVideo = []
          this.$emit('loadingData')
        }
      })
    },
    // 确认分发 回调
    sureDisSuccess() {
      this.isIndeterminate = true
      this.checkAll = false
      this.checkedVideo = []
      this.$emit('loadingData')
    },
    chooseDesenVideoStatus() {
      this.$emit('chooseDatas', this.chooseVideoFlag, this.desensflag, this.cameraFlag)
    },
    clearVideoStatus() {
      this.chooseVideoFlag = 0
      this.cameraFlag = 0
    },
    closeChooseAll(type) {
      this.$nextTick(() => {
        if (type === 'tm') {
          this.isTmFlag = true
        } else {
          this.isDisFlag = true
        }
        this.isFlag = true
        this.checkAll = false
        this.checkedVideo = []
      })
    },
    handleCheckAllChange(val) {
      console.log('vvvvvvvval', val)
      this.isIndeterminate = false
      this.checkAll = val
      this.checkedVideo = []
      if (val) {
        this.listForData.some(item => {
          if (item.status === 2 && item.checkShare) {
            console.log('iiiiiiiiiiiiiiiiiiiiiiiii:', item)
            this.checkedVideo.push(item.originalVideoId)
          }
        })
      }
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.listForData.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.listForData.length
    },
    // 打开确认分发弹窗
    openDisDialog() {
      if (this.checkedVideo.length <= 0) {
        this.$message.error('请选择需要分发的视频！')
        return
      }
      const textArr = this.checkedVideo.map(id => {
        const cur = this.listForData.find(f => f.originalVideoId === id)
        return {
          size: cur.size,
          duration: cur.duration,
          videoName: cur.name,
          teacherName: this.teacherName,
          teacherId: this.teacherId
        }
      })
      this.$refs.disDialogRef.dialogOperation('open', {
        reqInfo: {
          desensitizedVideoIdList: this.checkedVideo,
          videoGroupId: this.groupid
        },
        texts: textArr,
        title: '脱敏视频分发',
        type: 'tm'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.resource-item-wrapper-box-noData {
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > img {
    width: 405px;
    height: 202px;
    background: #fff;
  }
  > .noDataText {
    margin-top: 10px;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #919293;
    line-height: 26px;
  }
}
.list-title {
  position: relative;
  line-height: 1;
  margin-bottom: 20px;
}
.video-item {
  width: calc((100% - 60px) / 4);
  margin: 0 20px 20px 0;
  &:last-child {
    margin-right: auto;
  }
  &:nth-child(4n + 4) {
    margin-right: 0;
  }
}

.action-row {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  .action-left {
    float: left;
    .left-choose-ac {
      float: left;
      .choose-nums-tip {
        color: #0c6fff;
        font-size: 14px;
        margin-left: 16px;
        margin-right: 16px;
      }
      .btns {
        margin-right: 10px;
      }
    }
  }
  .action-right {
    float: right;
    height: 40px;
    .choose-status {
      float: left;
      margin-right: 20px;
      span {
        color: #333;
        font-size: 14px;
        margin-right: 10px;
      }
    }
    .download {
      border-radius: 4px;
      border: 1px solid #0c6fff;
      color: #0c6fff;
      font-size: 14px;
      padding: 8px 15px;
      i {
        margin-right: 6px;
      }
    }
  }
}

.mg-tops {
  margin-top: -50px;
}
</style>
