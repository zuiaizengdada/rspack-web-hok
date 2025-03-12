<template>
  <el-drawer
    :visible.sync="getDialogVisible"
    size="820px"
    append-to-body
    :title="getDialogTitle"
    :wrapper-closable="false"
    destroy-on-close
    :before-close="dialogBeforeClose"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="auto"
      size="small"
      class="add-form-dialog"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="套餐名称" prop="packageName">
        <el-input
          v-model="form.packageName"
          type="text"
          placeholder="请输入"
          maxlength="80"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="套餐价格" prop="packagePrice" required>
        <el-input-number
          v-model="form.packagePrice"
          :min="0"
          :max="9999999"
          :precision="2"
          :disabled="row && row.id"
          style="width: 430px"
          class="text-left"
          :controls="false"
          label="套餐价格"
        />
        <span class="tips">支持2位小数点，范围大于0小于等于9999999</span>
      </el-form-item>

      <el-form-item label="套餐内容" prop="content">
        <el-row>
          <el-col :span="12">
            <el-form-item label="声音训练" class="custom-label">
              <el-input-number
                v-model="form.trainingTimes"
                :min="0"
                :max="999"
                :disabled="row && row.id"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="声音训练"
              />
              <span class="dw-tips">次</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="形象采购" class="custom-label">
              <el-input-number
                v-model="form.purchaseTimes"
                :min="0"
                :max="9999999"
                :disabled="row && row.id"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="形象采购"
              />
              <span class="dw-tips">次</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="形象训练声音时长" class="custom-label">
              <el-input-number
                v-model="form.trainingDuration"
                :min="0"
                :max="9999999"
                :disabled="row && row.id"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="形象训练声音时长"
              />
              <span class="dw-tips">分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频时长" class="custom-label">
              <el-input-number
                v-model="form.videoDuration"
                :min="0"
                :max="9999999"
                :disabled="row && row.id"
                style="width: 300px"
                class="text-left"
                :controls="false"
                label="视频时长"
              />
              <span class="dw-tips">分钟</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="套餐备注" prop="packageDesc">
        <el-input
          v-model="form.packageDesc"
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          maxlength="300"
          resize="none"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="可用范围" prop="orgIds">
        <el-radio-group v-model="form.orgIds">
          <el-radio :label="1">全部机构</el-radio>
          <el-radio :label="0">部分机构</el-radio>
        </el-radio-group>
        <div v-if="form.orgIds === 0" class="org-list">
          <el-tag
            v-for="tag in tags"
            :key="tag.organizationId"
            closable
            size="small"
            effect="plain"
            style="margin-right: 10px"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag.name }}
          </el-tag>
          <el-link
            type="primary"
            :underline="false"
            @click="orgListDialogVisible = true"
          >
            +选择机构
          </el-link>
        </div>
      </el-form-item>
      <el-form-item label="套餐状态" prop="isDeleted">
        <el-radio-group v-model="form.isDeleted">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="footer">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="dialogBeforeClose">取消</el-button>
    </div>
    <OrgListDialog
      v-model="orgListDialogVisible"
      :ids="getTagsIds"
      @submit="handleOrgSubmit"
    />
  </el-drawer>
</template>
<script>
import OrgListDialog from '../orgListDialog/index.vue'
import { addOperatePackage } from '@/api/aiVideoManage/setMealModule'
export default {
  components: {
    OrgListDialog
  },
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const validateContent = (rule, value, callback) => {
      if (
        !this.form.purchaseTimes &&
        !this.form.trainingDuration &&
        !this.form.trainingTimes &&
        !this.form.videoDuration
      ) {
        return callback(new Error('赠送内容至少1项，且1项内容值大于0'))
      }
      callback()
    }
    const validatePrice = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error('请输入大于0的数字'))
      }
      callback()
    }
    return {
      loading: false,
      orgListDialogVisible: false,
      form: {
        available: '',
        isDeleted: 0,
        packageDesc: '',
        packageName: '',
        packagePrice: 0,
        purchaseTimes: 0,
        trainingDuration: 0,
        trainingTimes: 0,
        videoDuration: 0,
        orgIds: 1
      },
      rules: {
        packageName: [
          { required: true, message: '请输入套餐名称', trigger: 'change' }
        ],
        packagePrice: [{ validator: validatePrice, trigger: 'change' }],
        content: [{ validator: validateContent, trigger: 'change' }],
        orgIds: [
          { required: true, message: '请选择可用范围', trigger: 'change' }
        ],
        isDeleted: [
          { required: true, message: '请选择套餐状态', trigger: 'change' }
        ]
      },
      tags: []
    }
  },
  computed: {
    getDialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    },
    getDialogTitle() {
      return this.row && this.row?.id ? '编辑套餐' : '新增套餐'
    },
    getTagsIds() {
      return this.tags?.map(item => item.organizationId) || []
    }
  },
  watch: {
    getDialogVisible: {
      handler(val) {
        if (val) {
          this.form = {
            available: '',
            isDeleted: 0,
            packageDesc: '',
            packageName: '',
            packagePrice: 0,
            purchaseTimes: 0,
            trainingDuration: 0,
            trainingTimes: 0,
            videoDuration: 0,
            orgIds: 1
          }
          if (this.row && this.row.id) {
            this.form = { ...this.row, orgIds: 1 }
            this.form.packagePrice = this.form.packagePrice
              ? this.form.packagePrice / 100
              : 0
            const availableIds = this.row.available?.split(',') || []
            if (availableIds.length) {
              this.form.orgIds = 0
            }
            const availableNames = this.row.availableName?.split(',') || []
            this.tags = availableIds.map((id, index) => {
              return {
                organizationId: id,
                name: availableNames[index]
              }
            })
          }
        }
      },
      deep: true
    }
  },
  methods: {
    handleClose(tag) {
      this.tags = this.tags.filter(
        item => item.organizationId !== tag.organizationId
      )
    },
    handleOrgSubmit(val) {
      this.tags = val
      this.orgListDialogVisible = false
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form,
            available:
              this.form.orgIds === 0
                ? this.tags.map(item => item.organizationId).join(',')
                : '',
            id: this.row?.id
          }
          delete params.availableName
          addOperatePackage(params).then(res => {
            this.$message.success('操作成功')
            this.$emit('success', res)
          })
        }
      })
    },
    dialogBeforeClose() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  color: #777777;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-left: 8px;
}
.dw-tips {
  color: #000000;
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-left: 15px;
}
.org-list {
  padding: 16px;
  border-radius: 4px;
  background: #f3f3f3;
  margin-top: 20px;
}
.footer {
  position: absolute;
  height: 68px;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep {
  .el-drawer__header {
    padding-bottom: 20px !important;
    margin-bottom: 0 !important;
    border-bottom: 1px solid #eff2f6;
    span {
      font-size: 16px;
      color: #000;
      font-weight: 600;
      font-family: 'Microsoft YaHei';
      letter-spacing: 1px;
    }
  }
  .el-drawer__body {
    padding: 20px 23px 68px 23px;
  }
  .add-form-dialog {
    .el-form-item__label {
      font-weight: 600;
      color: #000;
      font-family: 'Microsoft YaHei';
      padding-left: 0 !important;
      padding-right: 20px !important;
    }
  }

  .text-left {
    .el-input {
      input {
        text-align: left;
      }
    }
  }
  .custom-label {
    .el-form-item__label {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
}
</style>
