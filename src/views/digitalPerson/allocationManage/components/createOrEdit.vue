<template>
  <el-dialog
    v-loading="loading"
    :title="getTitle"
    :visible.sync="getVisible"
    width="40%"
    :before-close="handleClose"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="ruleForm.type">
          <el-radio v-if="ruleForm.type===1" :label="1" rule-form-type :disabled="true">通用配置</el-radio>
          <el-radio v-else :label="2" :disabled="true">独立配置</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="ruleForm.type === 2" label="员工" prop="userIds">
        <template v-if="!row.id">
          <el-button type="primary" @click="selectUserOpen">选择</el-button>
          <div v-if="dynamicTags.length > 0" class="staff-list">
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag.userId"
              class="staff-tag"
              closable
              :disable-transitions="false"
              @close="delTag(tag)"
            >
              {{ tag.nickName }}
            </el-tag>
            <el-button
              class="button-new-tag"
              size="small"
              @click="selectUserOpen"
            >
              + 添加人员
            </el-button>
          </div>
        </template>
        <span v-else>
          <el-tag>{{ ruleForm.userInfo.name }}</el-tag>
        </span>
      </el-form-item>
      <el-form-item label="IP老师" prop="teacherId">
        <div v-if="ruleForm.type===1">
          <span style="color: #777777"> 已配置的老师不可重复添加 </span>
        </div>
        <el-radio-group v-model="ruleForm.teacherId">
          <el-radio
            v-for="item in teacherList"
            :key="item.teacherId"
            :disabled="item.isDisabled || !!row.id"
            :label="item.teacherId"
          >
            {{ item.teacherName }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item required label="选择配置" prop="periodical">
        <el-radio-group v-model="ruleForm.periodical">
          <div class="flex flex-center" style="margin-bottom: 10px">
            <el-radio :label="1">
              每天
              <el-input-number
                v-model="ruleForm.dayCount"
                :min="1"
                :max="1000"
                :controls="false"
                style="width: 150px; margin: 0 8px"
                :class="{
                  'is-border-color-number': ruleForm.periodical !== 1
                }"
                @focus="() => (ruleForm.periodical = 1)"
              />
              <span>次</span>
            </el-radio>
          </div>
          <div class="flex flex-center" style="margin-bottom: 10px">
            <el-radio :label="2">
              每周
              <el-input-number
                v-model="ruleForm.weekCount"
                :min="1"
                :max="1000"
                :controls="false"
                style="width: 150px; margin: 0 8px"
                :class="{
                  'is-border-color-number': ruleForm.periodical !== 2
                }"
                @focus="() => (ruleForm.periodical = 2)"
              />
              <span>次</span>
            </el-radio>
          </div>
          <div class="flex flex-center">
            <el-radio :label="3">
              每月
              <el-input-number
                v-model="ruleForm.monthCount"
                :min="1"
                :max="1000"
                :controls="false"
                style="width: 150px; margin: 0 8px"
                :class="{
                  'is-border-color-number': ruleForm.periodical !== 3
                }"
                @focus="() => (ruleForm.periodical = 3)"
              />
              <span>次</span>
            </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  addGenerateFrequencyConfig,
  editGenerateFrequencyConfig,
  configuredTeacherList
} from '@/api/aiVideoManage/generate'
import { getCharactersTeacherList } from '@/api/aiVideoManage'
export default {
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
    const validateConfig = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择配置'))
      } else if (value === 1 && !this.ruleForm.dayCount) {
        callback(new Error('请填写次数'))
      } else if (value === 2 && !this.ruleForm.weekCount) {
        callback(new Error('请填写次数'))
      } else if (value === 3 && !this.ruleForm.monthCount) {
        callback(new Error('请填写次数'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        type: 1,
        userInfo: {
          id: undefined,
          name: undefined
        },
        userIds: [],
        teacherId: undefined,
        periodical: undefined,
        weekCount: undefined,
        monthCount: undefined,
        dayCount: undefined
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        userIds: [{ required: true, message: '请选择员工', trigger: 'change' }],
        teacherId: [
          { required: true, message: '请选择老师', trigger: 'change' }
        ],
        periodical: [{ validator: validateConfig, trigger: 'change' }]
      },
      dynamicTags: [],
      teacherList: [],
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('change', val)
      }
    },
    getTitle() {
      return this.row.id ? '编辑' : '新增'
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.ruleForm.type = this.row.type
          this.getConfiguredTeacherList()
        } else {
          this.dynamicTags = []
          this.ruleForm = {
            type: 1,
            userIds: [],
            userInfo: {
              id: undefined,
              name: undefined
            },
            teacherId: undefined,
            periodical: undefined,
            weekCount: undefined,
            monthCount: undefined,
            dayCount: undefined
          }
          this.$refs.ruleForm.resetFields()
        }
      },
      deep: true
    },
    dynamicTags: {
      handler(val) {
        this.ruleForm.userIds = val.length ? val.map(item => item.userId) : []
      },
      deep: true
    }
  },
  methods: {
    async getConfiguredTeacherList() {
      this.loading = true
      const ls = await configuredTeacherList().catch(() => {
        this.loading = false
      })
      if (!ls) {
        return
      }
      getCharactersTeacherList({ type: 1, status: 1 })
        .then(res => {
          this.loading = false
          if (res.data) {
            this.teacherList = res.data.map(m => ({
              ...m,
              isDisabled:
                ls.data && ls.data.length
                  ? this.row.type === 2
                    ? false
                    : !!ls.data.filter(item => item.teacherId === m.teacherId)
                      .length
                  : false
            }))
            if (this.row.id) {
              const count = Number(this.row.periodicalCount || 0)
              const fnCount = {
                1: () => {
                  this.ruleForm.dayCount = count
                },
                2: () => {
                  this.ruleForm.weekCount = count
                },
                3: () => {
                  this.ruleForm.monthCount = count
                }
              }
              this.ruleForm.type = this.row.type
              this.ruleForm.userInfo = {
                id: this.row.userId,
                name: this.row.userName
              }
              this.ruleForm.userIds = [this.row.userId]
              this.ruleForm.teacherId = this.row.teacherId
              this.ruleForm.periodical = Number(this.row.periodical || 1)
              fnCount[this.ruleForm.periodical]()
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    delTag(record) {
      const index = this.dynamicTags.findIndex(
        item => item.userId === record.userId
      )
      this.dynamicTags.splice(index, 1)
    },
    selectUserOpen() {
      if (this.dynamicTags.length === 50) {
        this.$message.warning('最多添加50个人员')
        return
      }
      this.$AddressBook({
        visible: true,
        multiple: true,
        maxlength: 50,
        minlength: 1,
        type: [1],
        checkUser: this.dynamicTags || [],
        success: res => {
          res.user.forEach(item => {
            if (this.dynamicTags.length < 50) {
              this.dynamicTags.push({ ...item })
            }
          })
        }
      })
    },
    addOrEdit(params) {
      const api = this.row.id
        ? editGenerateFrequencyConfig
        : addGenerateFrequencyConfig
      api(params).then(() => {
        this.$message.success('新增成功')
        this.$emit('success')
        this.handleClose()
      })
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const count = {
            1: this.ruleForm.dayCount,
            2: this.ruleForm.weekCount,
            3: this.ruleForm.monthCount
          }
          const params = {
            periodical: this.ruleForm.periodical,
            periodicalCount: count[this.ruleForm.periodical],
            teacherId: this.ruleForm.teacherId,
            type: this.ruleForm.type,
            userIds:
              this.ruleForm.userIds && this.ruleForm.userIds.length
                ? this.ruleForm.userIds
                : undefined,
            id: this.row.id || undefined
          }
          this.addOrEdit(params)
        }
      })
    },
    handleClose() {
      this.$emit('change', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.staff-list {
  width: 100%;
  height: 128px;
  padding: 16px;
  margin-top: 16px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  .staff-tag {
    margin: 0 16px 6px 0;
  }
}
::v-deep {
  .el-dialog__header {
    border-bottom: 1px solid #e7e7e7;
    padding: 20px !important;
  }
  .el-radio {
    line-height: 36px !important;
  }
  .is-border-color-number {
    .el-input {
      input {
        border: 1px solid #dcdfe6 !important;
      }
    }
  }
}
</style>
