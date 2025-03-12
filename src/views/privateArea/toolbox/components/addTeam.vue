<template>
  <!-- 新增/编辑收款渠道 -->
  <AppDialog
    v-if="visible"
    v-model="visible"
    :title="title"
    width="480px"
    height="200px"
    :loading="loading"
    @success="send"
  >
    <div class="payChannelDialog overflowOuto">
      <!-- 新增/编辑收款渠道 -->
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
        label-width="110px"
        size="small"
      >
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="form.deptId"
            :show-all-levels="false"
            style="width: 100%"
            :options="deptList"
            clearable
            :props="{ checkStrictly: true, emitPath: false }"
            filterable
          />
        </el-form-item>
        <el-form-item label="分配规则" prop="assignmentRule">
          <el-radio-group v-model="form.assignmentRule">
            <el-radio :label="1">按权重分配</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分配线索权重" prop="assignmentWeights">
          <el-input-number
            v-model="form.assignmentWeights"
            :precision="0"
            :step="1"
            style="width: 100%"
            controls-position="right"
            :min="0"
            :max="100"
          />
          <div class="assignmentWeightstext">
            请输入0-100之间，全部团队系数之和不能大于100，权重越大，分配线索几率越高
          </div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import { addClueAssign, updateClueAssign } from '@/api/privateArea/toolbox'
import { deptTree } from '@/api/addressBookApi'
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      deptList: [],
      form: {
        deptId: '',
        assignmentWeights: undefined,
        assignmentRule: 1
      },
      companyOptions: [],
      type: 'ADD',
      title: '团队线索设置',
      visible: false,
      rules: {
        deptId: [{ required: true, message: '请选择部门', trigger: 'deptId' }],
        assignmentRule: [
          {
            required: true,
            message: '请选择分配规则',
            trigger: 'assignmentRule'
          }
        ],
        assignmentWeights: [
          {
            required: true,
            message: '请设置分配线索权重',
            trigger: 'assignmentWeights'
          }
        ]
      },
      loading: false
    }
  },
  created() {
    this.getDeptList()
  },
  methods: {
    async getDeptList() {
      const res = await deptTree({ deptId: 0 })
      this.deptList = this.encapsulateData(res?.data) || []
    },
    encapsulateData(array) {
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
      return array
    },
    async open(row, type) {
      this.reset()
      this.type = type
      console.log(row)
      if (type === 'EDIT') {
        const { deptId, assignmentRule, assignmentWeights, id } = row
        this.form = {
          deptId: Number(deptId),
          assignmentWeights,
          assignmentRule,
          id
        }
        this.visible = true
      }
      this.visible = true
    },
    reset() {
      this.form = {
        deptId: '',
        assignmentWeights: undefined,
        assignmentRule: 1
      }
    },
    successFn() {
      this.$emit('success')
      this.$notify.success({ title: '提示', message: '操作成功' })
      this.visible = false
    },
    send() {
      this.$refs.ruleForm.validate(valid => {
        console.log(valid)
        if (valid) {
          this.submitQuery()
        } else {
          return false
        }
      })
    },
    submitQuery() {
      this.loading = true
      const query = this.type === 'ADD' ? addClueAssign : updateClueAssign
      query({ ...this.form })
        .then(res => {
          this.loading = false
          this.successFn()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.payChannelDialog {
  height: 518px;
  padding: 16px;
  box-sizing: border-box;
  .tips {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
    line-height: 20px;
  }
}
.assignmentWeightstext{
  line-height: 1.3;
}
</style>
