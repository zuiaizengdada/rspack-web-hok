<template>
  <AppDialog
    v-model="visible"
    title="学员跟进"
    width="518px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="editRemarks overflowOuto">
      <el-form
        ref="form"
        :rules="rules"
        label-position="top"
        label-width="auto"
        :model="form"
        size="small"
      >
        <el-form-item label="跟进内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="跟进状态">
          <m-select
            v-if="followTypeList.length"
            v-model="form.type"
            :dict-list="followTypeList"
            :param="{ value: 'followType', label: 'followTypeName' }"
          />
          <m-select
            v-else
            v-model="form.type"
            :request="getFollowType"
            :param="{ value: 'followType', label: 'followTypeName' }"
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { followStatus } from '../columns'
import { getFollowType } from '@/api/privateArea/CRM'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      top: '114px',
      followStatus,
      followTypeList: [],
      getFollowType,
      form: {
        content: '',
        type: '',
        clueId: ''
      },
      success: () => {},
      rules: {
        content: [
          { required: true, message: '请输入跟进内容', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.top = Math.abs(document.body.scrollHeight - 410) / 2 + 'px'
  },
  methods: {
    sure() {
      this.$refs.form &&
        this.$refs.form.validate(valid => {
          if (valid) {
            this.success && this.success(this.form)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      // this.visible = false
      // this.success && this.success(this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.editRemarks {
  height: 292px;
  padding: 20px;
}
</style>
