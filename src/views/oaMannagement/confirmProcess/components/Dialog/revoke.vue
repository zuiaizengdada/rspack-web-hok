<template>
  <base-dialog
    v-bind="$attrs"
    title="撤销"
    :append-to-body="true"
    width="573px"
    :visible-footer="true"
    top="25vh"
    v-on="$listeners"
    @cancel="cancelDialog"
  >
    <el-form
      ref="form"
      slot="content"
      v-loading="loading"
      :model="form"
      label-width="65px"
      :rules="rules"
      size="small"
    >
      <p class="revoke-tip">
        确认撤销该批次资产确认，确认后员工将不能再进行该资产确认提交。
      </p>
      <el-form-item label="备注：" prop="remark">
        <el-input
          v-model="form.remark"
          clearable
          type="textarea"
          :maxlength="100"
          show-word-limit
          :autosize="{ minRows: 6, maxRows: 6 }"
          placeholder="请输入原因"
        />
      </el-form-item>
      <div style="text-align: right">
        <el-button
          type="primary"
          size="small"
          style="width: 82px"
          @click="confimDialog"
          >知道了</el-button
        >
      </div>
    </el-form>
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog.vue'
import { userNoPage, getUserDetailAjax } from '@/api/addressBookApi'
import { confirmProcessRevokeAjax } from '../../../api/confirmProcess.js'

export default {
  components: {
    BaseDialog
  },
  props: {
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        id: '', // 流程编号
        remark: '' // 备注
      },
      showForm: {
        deptName: '',
        jobName: '',
        occupantUserId: ''
      },
      rules: {
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      occupantUserOptions: [],
      loading: false
    }
  },
  watch: {
    '$attrs.visible'(newVal) {
      if (newVal === true) {
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.form = {
        id: '', // 流程编号
        remark: '' // 备注
      }
      this.loading = false
      console.log(this.row, '6666')
      this.form.id = this.row.id
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    confimDialog() {
      this.$refs.form.validate(valid => {
        this.$uweb?.setAction('Event_oa_confirmProcess_revoke')
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.form))
          this.loading = true
          confirmProcessRevokeAjax(params)
            .then(res => {
              if (res.code === 1) {
                this.$notify.success({ title: '提示', message: '操作成功' })
                this.$emit('success')
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    handleChangeOccupantUser(val) {
      if (val === null || val === undefined || val === '') {
        // 清空数据
        this.init()
        this.form.cardId = this.row.cardId
        return
      }
      const obj =
        this.occupantUserOptions.find(item => item.userId === val) || {}
      const params = {
        userId: obj.userId
      }
      this.loading = true
      getUserDetailAjax(params)
        .then(res => {
          if (res.code === 1) {
            const { data } = res
            const jobNameStr = data.jobVoList
              .map(item => item.jobName)
              .join('、')
            this.showForm = {
              deptName: data.deptChain,
              jobName: jobNameStr,
              occupantUserId: obj.userId
            }
            this.form.occupantDeptId = obj.deptId
            this.form.occupantDeptName = obj.deptName
            this.form.occupantUserName = obj.nickName
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    async remoteMethodOccupantUser(query) {
      const res = await userNoPage({ nickName: query })
      this.occupantUserOptions = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.revoke-tip {
  color: #333333;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
