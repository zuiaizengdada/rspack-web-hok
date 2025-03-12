<template>
  <base-dialog
    v-bind="$attrs"
    :title="title"
    :append-to-body="true"
    width="600px"
    :loading="btnLoading"
    v-on="$listeners"
    @cancel="cancelDialog"
    @confirm="confimDialog"
  >
    <el-form
      ref="form"
      slot="content"
      v-loading="loading"
      :model="form"
      label-width="140px"
      :rules="rules"
      size="small"
    >
      <el-form-item label="接收人" prop="occupantUserId">
        <el-select
          v-model="form.occupantUserId"
          filterable
          remote
          clearable
          :remote-method="remoteMethodOccupantUser"
          @change="handleChangeOccupantUser"
        >
          <el-option
            v-for="item in occupantUserOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="接收部门">
        <p>{{ showForm.deptName }}</p>
      </el-form-item>
      <el-form-item v-if="showForm.jobName" label="员工岗位">
        <p>{{ showForm.jobName }}</p>
      </el-form-item>
      <el-form-item label="接收ID">
        <p>{{ showForm.occupantUserId }}</p>
      </el-form-item>
    </el-form>
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/BaseDialog.vue'
import { cardAllot, cardBatchAllotAjax } from '../../../api/card.js'
import { userNoPage, getUserDetailAjax } from '@/api/addressBookApi'
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
    },
    selectList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        cardId: '',
        occupantDeptId: '', // 使用部门ID
        occupantDeptName: '', // 使用部门名称
        occupantUserId: '', // 使用人编号
        occupantUserName: '', // 使用人
        cardIds: []
      },
      showForm: {
        deptName: '',
        jobName: '',
        occupantUserId: ''
      },
      rules: {
        occupantUserId: [
          { required: true, message: '请输入接收人', trigger: 'change' }
        ]
      },
      occupantUserOptions: [],
      loading: false,
      btnLoading: false,
      type: 1 // 1 单个 2批量
    }
  },
  computed: {
    title() {
      return this.type === 2 ? '批量调拨' : '调拨'
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
        cardId: '',
        occupantDeptId: '', // 使用部门ID
        occupantDeptName: '', // 使用部门名称
        occupantUserId: '', // 使用人编号
        occupantUserName: '' // 使用人
      }
      this.showForm = {
        deptName: '',
        jobName: '',
        occupantUserId: ''
      }
      this.occupantUserOptions = []
      this.loading = false
      this.btnLoading = false
      if (Object.keys(this.row).length === 0 && this.selectList.length > 0) {
        // 批量
        this.form.cardIds = this.selectList.map(v => v.cardId)
        this.type = 2
      } else {
        // 单个
        this.form.cardId = this.row.cardId
        this.type = 1
      }
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    confimDialog() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // const params = JSON.parse(JSON.stringify(this.form))
          if (this.type === 1) {
            this.$uweb?.setAction('Event_oa_phoneCard_allot')
          } else if (this.type === 2) {
            this.$uweb?.setAction('Event_oa_phoneCard_batchAllot')
          }
          const params = {
            ...(this.type === 1 && { cardId: this.form.cardId }),
            ...(this.type === 2 && { cardIds: this.form.cardIds }),
            occupantDeptId: this.form.occupantDeptId,
            occupantDeptName: this.form.occupantDeptName,
            occupantUserId: this.form.occupantUserId,
            occupantUserName: this.form.occupantUserName
          }
          const ajax = this.type === 1 ? cardAllot : cardBatchAllotAjax
          this.loading = true
          this.btnLoading = true
          ajax(params)
            .then(res => {
              if (res.code === 1) {
                this.$notify.success({ title: '提示', message: '操作成功' })
                this.$emit('success')
              }
            })
            .finally(() => {
              this.loading = false
              this.btnLoading = false
            })
        }
      })
    },
    handleChangeOccupantUser(val) {
      if (val === null || val === undefined || val === '') {
        // 清空数据
        this.init()
        // this.form.cardId = this.row.cardId
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
