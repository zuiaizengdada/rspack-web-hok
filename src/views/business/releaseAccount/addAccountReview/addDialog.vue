<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="{ 1: '新增账号', 2: '编辑账号' }[config.type]"
    width="500px"
    :loading="loading"
    height="200px"
    @success="sure"
  >
    <div v-loading="loading" class="addDialog overflowOuto">
      <el-form
        ref="form"
        class="m-t-16"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
      >
        <el-form-item label="业绩区分" prop="discriminate">
          <el-radio-group v-model="form.discriminate">
            <el-radio :label="1">按投放账号</el-radio>
            <el-radio :label="2">按广告组</el-radio>
            <el-radio :label="3">按广告计划</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联员工" prop="staffs">
          <div
            v-if="
              (form.discriminate === 1 && staffList.length < 1) ||
                form.discriminate !== 1
            "
          >
            <el-select
              v-model="form.staffsId"
              class="select"
              placeholder="请搜索关联员工"
              filterable
              :filter-method="getUserByName"
              clearable
              style="width: 90%"
              @clear="clearUser"
              @change="changeUser"
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              >
                {{ item.nickName }}
              </el-option>
            </el-select>
          </div>
          <div
            v-if="
              (form.discriminate === 1 && staffList.length > 0) ||
                form.discriminate !== 1
            "
            :style="{ 'margin-top': form.discriminate === 1 ? '0px' : '5px' }"
          >
            <el-tag
              v-for="(item, index) in staffList"
              :key="index"
              class="remindPersonListView"
              closable
              @close="delUsers(item.userId)"
            >{{ item.nickName }}</el-tag>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addDiscriminate, getUserByName } from '@/api/advertisingKanBan'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          type: 1, // 1新增 2编辑
          row: {},
          visible: false
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      form: {
        discriminate: 1,
        staffs: ''
      },
      rules: {
        discriminate: [
          { required: true, message: '请选择业绩区分', trigger: 'blur' }
        ],
        staffs: [{ required: true, message: '请选择关联员工', trigger: 'blur' }]
      },
      userList: [],
      staffList: []
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.form = {
              discriminate: '',
              staffs: ''
            }
            this.staffList = []
          } else {
            const r = JSON.parse(JSON.stringify(this.config.row))
            this.form.id = r.id
            this.form.discriminate = r.discriminate === 0 ? 1 : r.discriminate
            this.staffList =
              r.staffRelations.length > 0
                ? r.staffRelations.map(m => ({
                  nickName: m.staffName,
                  userId: m.staffIdStr,
                  deptId: m.departmentId,
                  deptName: m.departmentName
                }))
                : []
            this.form.staffs = r.staffRelations.length > 0 ? 1 : undefined
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    delUsers(id) {
      this.form.staffs = this.staffList.length === 1 ? undefined : 1
      this.staffList.splice(this.staffList.findIndex(f => f.userId === id))
    },
    changeUser(val) {
      const info = this.userList.find(f => f.userId === val)
      if (this.staffList.filter(f => f.userId === info.userId).length > 0) {
        this.form.staffsId = undefined
        this.userList = []
        return
      }
      this.staffList.push(info)
      this.form.staffs = 1
      this.form.staffsId = undefined
      this.userList = []
    },
    clearUser() {
      this.userList = []
      this.form.staffs = undefined
    },
    async getUserByName(val) {
      const res = await getUserByName({ userName: val || undefined })
      if (res.code === 1) {
        this.userList = res.data
      }
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            discriminate: this.form.discriminate,
            id: this.form.id,
            staffs: this.staffList.map(m => ({
              departmentId: m.deptId,
              departmentName: m.deptName,
              staffId: m.userId,
              staffName: m.nickName
            }))
          }
          delete params.userName
          this.loading = true
          addDiscriminate(params)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.$emit('success')
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addDialog {
  height: 306px;
  padding: 20px;
  .tips {
    width: 100%;
    padding: 10px;
    background: #fff2e6;
    border-radius: 8px;
    display: flex;
    .tipsIcon {
      width: 24px;
      color: #ff7d00;
      font-size: 24px;
    }
    .tipsContent {
      flex: 1;
      padding-left: 8px;
      .tipsTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #ff7d00;
        line-height: 24px;
      }
      .tipsMsg {
        margin-top: 8px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #ff7d00;
        line-height: 22px;
      }
    }
  }
}
.m-l-32 {
  margin-left: 32px;
}
.assessBox {
  width: 363px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
}
.remindPersonListView {
  cursor: pointer;
  margin-right: 4px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
