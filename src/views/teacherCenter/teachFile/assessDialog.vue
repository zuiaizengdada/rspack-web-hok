<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="694px"
    height="auto"
    @success="submit"
  >
    <div v-loading="loading" class="remindDialog">
      <el-row>
        <el-col :span="12">
          <div>
            到时间前
            <el-input
              v-model="form.beforeEnd"
              class="m-r-8 m-l-8"
              size="mini"
              style="width: 116px"
              @input="e => delNoNumber(e, 'beforeEnd')"
            >
              <el-button slot="append" size="mini">小时</el-button>
            </el-input>
            提醒
          </div>

          <div class="m-t-32">
            共提醒
            {{ parseInt((form.beforeEnd * 60) / form.intervalTime) || '-' }} 次
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            每隔
            <el-select
              v-model="form.intervalTime"
              class="m-r-8 m-l-8"
              style="width: 126px"
              size="mini"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            分钟提醒
          </div>
          <div class="m-t-32 formView">
            <span class="m-r-8 formlabel">通知类型</span>
            <el-checkbox-group v-model="form.isFeishu">
              <el-checkbox :label="1" :true-label="1" :false-label="0">
                通知
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  teacherAssessSettings,
  teacherAssessSettingsInfo
} from '@/api/tearchCenter'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      form: {
        beforeEnd: 2,
        intervalTime: 1,
        isFeishu: 0
      },
      options: [{ value: 15 }, { value: 30 }, { value: 60 }],
      visible: false,
      title: '评估提醒设置'
    }
  },
  methods: {
    async open() {
      try {
        this.visible = true
        this.loading = true
        const { data } = await teacherAssessSettingsInfo()
        this.form = {
          beforeEnd: data?.beforeEnd ?? 2,
          intervalTime: data?.intervalTime ?? 1,
          isFeishu: data?.isFeishu ?? 0
        }
        this.loading = false
      } catch (e) {
        console.log(e)
        this.form = {
          beforeEnd: 2,
          intervalTime: 1,
          isFeishu: 0
        }
        this.loading = false
      }
    },
    delNoNumber(e, key) {
      this.form[key] = e.replace(/\D/g, '')
    },
    // 点击确定
    async submit() {
      if (!this.form.beforeEnd) {
        return this.$message.error('请输入到期前时间')
      }
      if (!this.form.intervalTime) {
        return this.$message.error('请输入提醒间隔')
      }
      this.loading = true
      const params = {
        beforeEnd: this.form.beforeEnd,
        intervalTime: this.form.intervalTime,
        isFeishu: this.form.isFeishu
      }
      try {
        await teacherAssessSettings(params)
        this.visible = false
        this.loading = false
        this.$notify.success({ title: '提示', message: '操作成功' })
      } catch (e) {
        this.loading = false
      }
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
  .remindPersonListView {
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
