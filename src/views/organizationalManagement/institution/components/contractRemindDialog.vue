<template>
  <AppDialog
    v-model="visible"
    title="合同到期提醒设置"
    width="694px"
    height="auto"
    @success="send"
  >
    <div v-loading="loading" class="remindDialog">
      <el-row>
        <el-col :span="12">
          <div>
            合同到期前
            <el-input
              v-model="form.beforeDays"
              class="m-r-8 m-l-8"
              size="mini"
              style="width: 116px"
              @input="e => delNoNumber(e, 'beforeDays')"
            >
              <el-button slot="append" size="mini">天</el-button>
            </el-input>
            提醒
          </div>

          <div class="m-t-32">
            共提醒 {{ parseInt(form.beforeDays / form.intervalDays) || '-' }} 次
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            每隔
            <el-input
              v-model="form.intervalDays"
              class="m-r-8 m-l-8"
              style="width: 126px"
              size="mini"
              @input="e => delNoNumber(e, 'intervalDays')"
            >
              <el-button slot="append" size="mini">天</el-button>
            </el-input>
            提醒
          </div>
          <div class="m-t-32 formView">
            <span class="m-r-8 formlabel">通知类型</span>
            <el-checkbox-group v-model="form.status">
              <!-- <el-checkbox :label="0">短信通知</el-checkbox> -->
              <el-checkbox :label="1">通知</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>

      <div class="m-t-32 formView">
        <span class="m-r-8 formlabel">通知对象</span>
        <div>
          <div :class="{ assessBox: form.noticeUserIds.length > 0 }">
            <el-tag
              v-for="(tag, index) in form.noticeUserIds"
              :key="tag.userId"
              class="noticeUserIdsView"
              closable
              @close="delAssessUsers(tag, index)"
            >
              {{ tag.nickName }}
            </el-tag>
            <el-button
              size="mini"
              class="noticeUserIdsView"
              @click="selectUser"
            >
              <i class="el-icon-plus el-icon--left" />添加通知对象
            </el-button>
          </div>
          <div v-if="form.noticeUserIds.length > 0" class="tips m-t-8">
            已选{{ form.noticeUserIds.length }}人
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  orgContractNoticeDetailApi,
  orgContractNoticeSaveApi
} from '@/api/organization/settings.js'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: false,
      form: {
        beforeDays: '',
        intervalDays: '',
        status: [],
        noticeUserIds: [],
        organizationId: ''
      }
    }
  },
  methods: {
    openDialog({ organizationId }) {
      this.form.organizationId = organizationId
      this.getRuleInfo()
      this.visible = true
      console.log(' this.form.------', this.form)
    },
    delNoNumber(e, key) {
      this.form[key] = e.replace(/\D/g, '')
    },
    // 点击添加通知人员
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: true,
        type: [1],
        checkUser: this.form.noticeUserIds,
        maxlength: 10,
        success: res => {
          this.form.noticeUserIds = res.user
        }
      })
    },
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.form.noticeUserIds.splice(index, 1)
    },
    // 获取合同到期设置详情
    getRuleInfo() {
      this.loading = true
      orgContractNoticeDetailApi(this.form.organizationId)
        .then(res => {
          console.log(res)
          const obj = {
            0: [0],
            1: [1],
            2: [0, 1]
          }
          const noticeUserIds = []
          res.data.noticeUserList &&
            res.data.noticeUserList.map(v => {
              noticeUserIds.push({
                userId: v.userId,
                nickName: v.userName
                // feishuOpenId: v.feishuOpenId
              })
            })
          this.form = {
            beforeDays: res.data.beforeDays,
            intervalDays: res.data.intervalDays,
            status: obj[res.data.status],
            noticeUserIds: noticeUserIds,
            organizationId: this.form.organizationId
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击确定
    send() {
      if (!this.form.beforeDays) {
        return this.$message.error('请输入到期前时间')
      }
      if (!this.form.intervalDays) {
        return this.$message.error('请输入提醒间隔')
      }
      if (this.form.beforeDays < this.form.intervalDays) {
        return this.$message.error('合同到期前多少天的值要大于每隔多少天的值')
      }
      let status = ''
      if (this.form.status.length === 2) {
        status = 2
      } else if (this.form.status.length === 1) {
        status = this.form.status[0]
      } else {
        return this.$message.error('请选择通知类型')
      }

      this.loading = true
      const data = {
        beforeDays: this.form.beforeDays,
        intervalDays: this.form.intervalDays,
        remindNumber: parseInt(this.form.beforeDays / this.form.intervalDays),
        noticeUserIds: this.form.noticeUserIds
          .reduce((t, v) => [...t, v.userId], [])
          .join(','),
        status: status,
        organizationId: this.form.organizationId
      }
      console.log(
        'this.form.organizationId------',
        this.form,
        this.form.organizationId
      )
      orgContractNoticeSaveApi(data)
        .then(res => {
          this.visible = false
          this.loading = false
          this.$notify.success({ title: '提示', message: '操作成功' })
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.remindDialog {
  padding: 20px 34px;
  box-sizing: border-box;
  color: #333;
}
.m-t-32 {
  margin-top: 32px;
}
.formView {
  display: flex;
  // align-items: center;
  .formlabel {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
    line-height: 22px;
  }
}
.assessBox {
  width: 503px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .noticeUserIdsView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
}
</style>
