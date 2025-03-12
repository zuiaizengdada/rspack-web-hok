<template>
  <!-- 锁单弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['确定锁单', '取消']"
    title="锁单"
    width="750px"
    :loading="loading"
    height="560px"
    @success="sure"
  >
    <div class="lockOrderDialog overflowOuto">
      <div class="lockOrderTitle">锁单原因</div>
      <el-input
        v-model="reason"
        type="textarea"
        :rows="4"
        maxlength="200"
        show-word-limit
        placeholder="请输入锁单原因"
      />
      <div class="tips m-t-8">
        {{ tips }}
      </div>
      <div class="lockOrderTitle m-t-20">
        上传图片（必填）：请上传锁单的证据，如聊天记录，审批记录等
      </div>
      <upload
        ref="upload"
        v-model="fileList"
        :limit="6"
        :max-m="2"
        tips="仅支持jpg、png、jpeg格式图片"
        @change="handleChange"
      />
      <div class="lockOrderTitle m-t-20">
        通知
        <el-tooltip class="item" effect="dark" placement="top">
          <div slot="content">
            通知内容模版为：<br />
            {学员姓名}学员已锁单，请知悉！<br />
            订单号：{100000}<br />
            课程名称：{课程名称}<br />
            锁单原因：{这是原因}<br />
          </div>
          <i class="el-icon-warning-outline" />
        </el-tooltip>
      </div>

      <div>
        <div :class="{ assessBox: remindPersonList.length > 0 }">
          <el-tag
            v-for="(tag, index) in remindPersonList"
            :key="tag.userId"
            class="remindPersonListView"
            closable
            @close="delAssessUsers(tag, index)"
            >{{ tag.nickName }}</el-tag
          >
          <el-button
            v-if="remindPersonList.length < 10"
            size="mini"
            class="remindPersonListView"
            @click="selectUser"
            ><i class="el-icon-plus el-icon--left" />添加通知人员</el-button
          >
        </div>
        <div v-if="remindPersonList.length > 0" class="tips m-t-8 font-right">
          已选{{ remindPersonList.length }}人
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  lockDelivery,
  lockPackageDelivery
} from '@/api/deliver/studentManagement'
import { getHeadTeacherAssistant } from '@/api/deliver/studentManagement'
import upload from '@/components/AppTemplate/Upload2OSS'
import { getLiveOssCConfig } from '@/api/liveRoom/index'
export default {
  components: {
    AppDialog,
    upload
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          deliveryInfoId: ''
        }
      }
    },
    isPackage: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visibleDialogOssUpload: false,
      fileList: [],
      getLiveOssCConfig,
      reason: '',
      uploadInfo: {},
      userList: [],
      loading: false,
      remindPersonList: []
    }
  },
  computed: {
    tips() {
      if (this.$props.isPackage) {
        return '是否确定对此单进行锁单操作？ 锁单之后学员不能观看直播和回放，线下课不能代签和学员签到，请谨慎操作！'
      }
      if (this.type === 'live') {
        return '是否对此单进行锁单操作？锁单后不能再进行交付动作!'
      }
      return '是否对此单进行锁单操作？锁单后不能再进行打卡、代签等交付动作。'
    }
  },
  watch: {
    'config.visible'(val) {
      if (!val) {
        this.init()
      } else {
        this.getHeadTeacherAssistant()
      }
    }
  },
  methods: {
    handleChange(fileList) {
      this.fileList = fileList
    },
    // 点击添加通知人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.remindPersonList,
        maxlength: 10,
        success: res => {
          this.remindPersonList = res.user
        }
      })
    },
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.remindPersonList.splice(index, 1)
    },
    // 点击锁单
    sure() {
      if (!this.reason) {
        this.$message.error('锁单原因不能为空')
        return
      }
      if (!this.fileList.length) {
        this.$message.error('上传图片不能为空')
        return
      }
      this.$delModal({
        tips: this.tips,
        success: () => {
          this.loading = true
          const notifyUserId = this.remindPersonList.reduce((pre, next) => {
            return pre.concat([next.userId])
          }, [])
          const data = {
            deliveryInfoId: this.config.deliveryInfoId,
            reason: this.reason,
            notifyUserId: notifyUserId,
            images: this.fileList.map(i => i.resourceUrl.url)
          }
          if (this.isPackage) {
            delete data.deliveryInfoId
            data.id = this.config.deliveryInfoId
            data.urls = data.images
            data.remark = data.reason
          }
          const api = this.isPackage ? lockPackageDelivery : lockDelivery
          api(data)
            .then(res => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.$emit('success')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    init() {
      this.reason = ''
      this.userList = []
      this.remindPersonList = []
      this.loading = false
      this.$nextTick(() => {
        this.$refs.upload.fileList = []
      })
    },
    // 获取当前学员的班主任和助教
    getHeadTeacherAssistant() {
      this.loading = true
      getHeadTeacherAssistant(this.config.deliveryInfoId)
        .then(res => {
          console.log(res, 'res')
          this.remindPersonList = res.data.reduce((pre, next) => {
            pre.push({ nickName: next.userName, userId: next.userId })
            return pre
          }, [])
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.lockOrderDialog {
  height: 526px;
  padding: 16px;
  box-sizing: border-box;
  .lockOrderTitle {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
  .font-right {
    text-align: right;
  }
  .assessBox {
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    .remindPersonListView {
      margin-right: 16px;
      margin-bottom: 16px;
    }
  }
}
</style>
