<template>
  <!-- 批量更换班主任 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['保存', '取消']"
    title="批量更换班主任"
    width="518px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div class="replaceHeadTeacher overflowOuto">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="81px" size="small">
        <el-form-item label="班主任" prop="userId">
          <el-select v-model="form.userId" filterable>
            <el-option v-for="item in options" :key="item.userId" :label="item.userName" :value="item.userId" />
          </el-select>
          <div class="tips">保存之后将所选学员全部更新到新的班主任名下。</div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getsScheduleHeadteacherList, batchReplaceHeadTeacher } from '@/api/deliver/studentManagement'
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
          deliveryInfoId: [],
          scheduleId: ''
        }
      }
    }
  },
  data() {
    return {
      options: [],
      form: {
        userId: ''
      },
      loading: false,
      rules: {
        userId: [
          { required: true, message: '请选择助教', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'config.visible'(val) {
      this.form.userId = ''
      val && this.getOption()
    }
  },
  mounted() {},
  methods: {
    getOption() {
      this.loading = true
      getsScheduleHeadteacherList(this.config.scheduleId).then(res => {
        this.options = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    sure() {
      if (!this.form.userId) {
        return this.$message.error('请选择班主任')
      }
      this.loading = true
      const data = {
        deliveryInfoIdList: this.config.deliveryInfoId,
        userId: this.form.userId
      }
      batchReplaceHeadTeacher(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.$emit('success')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.replaceHeadTeacher {
  padding-top: 20px;
  min-height: 100px;
  max-height: 200px;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
    margin-top: 8px;
  }
}
</style>
