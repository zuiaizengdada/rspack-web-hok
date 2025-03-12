<template>
  <!-- 批量下载作业 -->
  <AppDialog
    ref="appDialog"
    v-model="config.visible"
    title="批量下载"
    width="518px"
    height="auto"
    :btn-footer="false"
    :before-close="(done) => beforeClose(done)"
  >
    <div class="downJobDialogContent">
      <div class="height201">
        <div v-if="showDownJobTip" class="downJobDialogLoading">
          <img :src="showDownJobLoading ? require('@/assets/image/loading_1s.gif'):require('@/assets/image/success.png')" alt="" width="120" height="120">
          <div class="showDownJobLoadingText">
            {{ showDownJobLoading ? '作业打包中...' : '作业打包完成' }}
          </div>
        </div>
      </div>
      <div v-if="showDownJobLoading" class="downJobDialogNum">
        当前共选择<span class="fontWeight600">&nbsp;{{ totalNum }}&nbsp;</span>个学员，其中<span class="color0C6FFF fontWeight600">&nbsp;{{ hasWorkNum }}&nbsp;</span>个学员有作业，<span class="fontWeight600">{{ withoutWorkNum }}&nbsp;</span>个学员无作业
      </div>
      <div v-else>
        稍后将自动下载
        <!-- <el-button type="text" @click="batchDownloadInfo">{{ scheduleNumFileName }}点击下载</el-button> -->
      </div>
    </div>
    <slot name="footer">
      <div class="downJobDialogBottom">
        <el-button v-if="showDownJobTip && showDownJobLoading" size="small" @click="close()">取消打包下载</el-button>
        <el-button v-if="!showDownJobTip && showDownJobLoading" size="small" @click="batchDownloadInfo()">重新下载</el-button>
      </div>
    </slot>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { batchDownloadJobAjax, batchDownloadInfoAjax } from '@/api/deliver/studentManagement'
import FileSaver from 'file-saver'
import axios from 'axios'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          deliveryInfoId: []
        }
      }
    }
  },
  data() {
    return {
      showDownJobLoading: true,
      showDownJobTip: false, // 显示正在打包
      totalNum: 0,
      hasWorkNum: 0,
      withoutWorkNum: 0,
      scheduleNumFileName: '.zip',
      CancelToken: axios.CancelToken,
      source: null
    }
  },
  computed: {
    // // 总人数
    // sumJob() {
    //   return this.config.deliveryInfoId || []
    // },
    // // 有作业
    // hasJob() {
    //   return this.config.hasJob || []
    // },
    // // 无作业
    // noJob() {
    //   return this.config.noJob || []
    // }
  },
  watch: {
    'config.visible' (val) {
      if (val) {
        this.batchDownloadInfo()
      } else {
        this.restShowState()
        this.restSoure()
      }
    }
  },
  methods: {
    close() {
      this.config.visible = false
    },
    // 批量下载作业
    batchDownloadJob(data, scheduleNumFileName) {
      this.restSoure()
      this.source = this.CancelToken.source()
      this.showDownJobTip = true
      batchDownloadJobAjax(data, this.source.token).then(res => {
        this.showDownJobLoading = false
        this.restSoure()
        FileSaver.saveAs(res, scheduleNumFileName)
      }).catch(() => {
        this.$message.error('下载失败,请重试')
        this.restShowState()
        this.restSoure()
      })
    },
    // 获取作业的下载信息
    batchDownloadInfo() {
      const data = this.config.deliveryInfoId
      batchDownloadInfoAjax(data).then(res => {
        const { totalNum, hasWorkNum, withoutWorkNum, scheduleNumFileName } = res.data
        this.totalNum = totalNum
        this.hasWorkNum = hasWorkNum
        this.withoutWorkNum = withoutWorkNum
        this.scheduleNumFileName = scheduleNumFileName
        // 有作业就下载
        if (hasWorkNum > 0) {
          this.batchDownloadJob(data, scheduleNumFileName)
        }
      })
    },
    // 关闭弹窗时中断下载提示
    beforeClose(done) {
      // 有打包才提示
      if (this.source) {
        return this.$confirm('当前还有文件正在下载，是否确认关闭弹框？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.restSoure()
          done()
        })
      } else {
        done()
      }
    },
    // 重置显示状态
    restShowState() {
      this.showDownJobLoading = true
      this.showDownJobTip = false
      this.totalNum = 0
      this.hasWorkNum = 0
      this.withoutWorkNum = 0
      this.scheduleNumFileName = '.zip'
    },
    // 取消上一次发出的请求
    restSoure() {
      if (this.source) {
        this.source.cancel('cancel')
        this.source = null
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  .downJobDialogContent {
    text-align: center;
    height: 250px;
    padding-top: 20px;
    color: #333;
    .downJobDialogLoading {
      padding: 20px 0;
      transition: all 0.2s;
      img {
        margin: 0 auto;
      }
    }
    .showDownJobLoadingText {
      font-size: 24px;
      font-weight: 600;
      margin-top: 16px;
      transition: all 0.2s;
    }
    .downJobDialogNum {
      font-weight: 400;
      font-size: 16px;
      margin-top: 10px;
      transition: all 0.2s;
    }
  }
  .downJobDialogBottom {
    display: flex;
    padding-right: 20px;
    padding-left: 20px;
    justify-content: flex-end;
    align-items: center;
    margin-top: auto;
    width: 100%;
    height: 66px;
    border-radius: 2px 2px 0 0;
    transition: all 0.2s;
  }
  .color0C6FFF {
    color: #0C6FFF;
  }
  .fontWeight600 {
    font-weight: 600;
  }
  .height201 {
    height: 201px;
  }
  ::v-deep .ss-material-box-bottom {
    height: 0 !important;
  }
</style>
