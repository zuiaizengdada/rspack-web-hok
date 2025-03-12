<template>
  <div class="header-container flex  items-center relative">
    <!-- <div class="left flex items-center cursor-pointer" @click="handleClickBack">
      <i class="el-icon-arrow-left" />
      <span>返回</span>
    </div> -->
    <h4>{{ projectName }}</h4>
    <div class="right flex items-center">
      <key-board />
      <task-center :is-video-edit="true" />
      <!-- <cloud-desktop ref="cloudDesktop" @openDetails="openDetails" /> --> 
      <!-- <cloudDeskDetails ref="cloudDeskDetails" /> --> 
      <div class="buttons">
        <el-button type="primary" size="small" class="width96" @click="handleClickSave">保存</el-button>
        <el-button
          id="liveVideoExport"
          type="primary"
          size="small"
          class="width96"
          :disabled="isDisableExport"
          @click="handleClickCreateLiveVideo"
        >导出</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import KeyBoard from './KeyBoard/index.vue'
// import CloudDesktop from '@/components/cloudDesktop'
import TaskCenter from '@/components/HeaderTask'
import { videoGenerateDetail } from '../api'

// import cloudDeskDetails from '@/layout/components/cloudDeskDetails'
export default {
  components: { 
    KeyBoard,
    // CloudDesktop,
    TaskCenter 
    // cloudDeskDetails
  },
  inject: ['video'],
  data() {
    return {
      projectName: '',
      isDisableExport: false
    }
  },
  computed: {
    getVideoDetail() {
      return this.video.detail
    },
    getCutLineList() {
      return this.video.cutLineList
    }
  },
  watch: {
    getVideoDetail: {
      handler() {
        this.getProjectName()
      }
    },
    getCutLineList(list) {
      this.isDisableExport = list.length === 0
    }
  },
  methods: {
    handleClickBack() {
      this.$router.go(-1)
    },
    // 打来云桌面详情弹窗
    openDetails(data) {
      console.log('打来云桌面详情弹窗', data)
      this.$refs.cloudDesktop.closePopover()
      this.$refs.cloudDeskDetails.show(data.userEcsId)
      // this.$router.push('/cloudDesktop')
    },
    handleClicKToCreate() {
      this.$uweb && this.$uweb.setAction('Event_onlineEditing_export')
      this.$emit('create')
    },
    async getProjectName() {
      const projectId = this.$route.query.projectId
      const { data } = await videoGenerateDetail({ projectId })
      if (data) {
        this.projectName = data[0].projectName
      }
    },
    handleClickSave() {
      this.$uweb && this.$uweb.setAction('Event_onlineEditing_save')
      this.$message.success('保存成功')
    },
    handleClickCreateLiveVideo() {
      this.$emit('createLiveVideo')
    }
  }
}
</script>
<style lang="scss" scoped>
  .header-container {
    position: fixed;
    display: flex;
    align-items: center;
    z-index: 9;
    left: 0;
    right: 0;
    color: #d9d9d9;
    padding: 0 24px 0 20px;
    height: 48px;
    border-bottom: 4px solid #000000;
    .left {
      position: relative;
      span {
        font-size: 14px;
      }
      i {
        font-size: 16px;
        margin-right: 4px;
        margin-top: -1px;
      }
    }
    h4 {
      font-size: 18px;
      margin-left:32px;
    }
    .right{
      position: absolute;
      right: 24px;
      .buttons{
        margin-left:160px;
      }
    }
  }
  .width96 {
    width: 96px;
  }

  ::v-deep .task-box .header-title{
    color:#D9D9D9;
  }
</style>
