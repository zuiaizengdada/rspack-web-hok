<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="{1: '新增账号', 2: '编辑账号'}[config.type]"
    width="694px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div v-loading="loading" class="addDialog overflowOuto">
      <div class="tips">
        <i class="el-icon-warning tipsIcon" />
        <div class="tipsContent">
          <div class="tipsTitle">注意</div>
          <div class="tipsMsg">请正确填写【投放账号信息】，一旦输入错误将影响线索产出溯源。</div>
        </div>
      </div>
      <el-form ref="form" class="m-t-16" :model="form" label-width="auto" size="small" :rules="rules">
        <el-form-item label="员工姓名" prop="userId">
          <div>
            <el-tag
              v-if="form.userId"
              class="remindPersonListView"
              closable
              @close="delAssessUsers()"
              @click.native="selectUser"
            >{{ form.userName }}</el-tag>
            <el-button v-else size="mini" class="remindPersonListView" @click="selectUser"><i class="el-icon-plus el-icon--left" />请选择</el-button>
          </div>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号渠道" prop="accountChannel">
              <el-select v-model="form.accountChannel" placeholder="请选择" clearable class="w-200">
                <el-option v-for="(item) in launchPlatformOption" :key="item.value" :label="item.label" :value="item.value">
                  <svg-icon :icon-class="item.icon" />
                  {{ item.label }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号名称" prop="fyAccount">
              <el-input v-model.trim="form.fyAccount" placeholder="请输入飞鱼昵称" maxlength="30" show-word-limit class="w-200" @input="(e) => delNoNumber(e, 'fyAccount')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告主ID" prop="advertiserId">
              <el-input v-model.trim="form.advertiserId" placeholder="请输入广告主ID" maxlength="30" show-word-limit class="w-200" @input="(e) => delNoNumber2(e, 'advertiserId')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号ID" prop="fyId">
              <el-input v-model.trim="form.fyId" placeholder="请输入账号ID" maxlength="30" show-word-limit class="w-200" @input="(e) => delNoNumber2(e, 'fyId')" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { launchPlatformOption } from './columns'
import { addAccount, editAccount } from '@/api/business/clue'
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
      launchPlatformOption,
      loading: false,
      form: {
        userId: '', // 员工Id
        userName: '', // 员工姓名
        deptId: '', // 员工部门ID
        fyId: '', // 飞鱼账号ID
        fyAccount: '', // 飞鱼账号
        advertiserId: '', // 广告主ID
        accountChannel: '' // 账号渠道
      },
      rules: {
        userId: [
          { required: true, message: '请选择员工姓名', trigger: 'blur' }
        ],
        accountChannel: [
          { required: true, message: '请选择账号渠道', trigger: 'blur' }
        ],
        advertiserId: [
          { required: true, message: '请正确填写广告主ID', trigger: 'blur' }
        ],
        fyId: [
          { required: true, message: '请正确填写账号ID', trigger: 'blur' }
        ],
        fyAccount: [
          { required: true, message: '请正确填写账号名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'config.visible': {
      handler(val) {
        if (val) {
          this.$refs.form && this.$refs.form.resetFields()
          if (this.config.type === 1) {
            this.form = {
              userId: '', // 员工Id
              userName: '', // 员工姓名
              deptId: '', // 员工部门ID
              fyId: '', // 飞鱼账号ID
              fyAccount: '', // 飞鱼账号
              advertiserId: '', // 广告主ID
              accountChannel: '' // 账号渠道
            }
          } else {
            this.form = JSON.parse(JSON.stringify(this.config.row))
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 限制输入英文数字和汉字
    delNoNumber(e, key) {
      this.form[key] = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 限制输入英文数字
    delNoNumber2(e, key) {
      this.form[key] = e.replace(/[^\a-\z\A-\Z0-9]/g, '')
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form
          }
          delete params.userName
          this.loading = true
          const apiFn = this.config.type === 1 ? addAccount : editAccount
          apiFn(params).then(res => {
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.loading = false
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 点击删除通知人员
    delAssessUsers() {
      this.form.userName = ''
      this.form.userId = ''
      this.form.deptId = ''
    },
    // 点击添加人员
    selectUser() {
      const checkUser = []
      if (this.form.userId && this.form.userName) {
        checkUser.push({ userId: this.form.userId, nickName: this.form.userName, deptId: this.form.deptId })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        checkUser,
        type: [1],
        success: (res) => {
          if (res.user.length > 0) {
            this.form.userName = res.user[0].nickName // 运营人员名称
            this.form.userId = res.user[0].userId // 运营人员ID
            this.form.deptId = res.user[0].deptId
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.addDialog {
    height: 306px;
    padding: 20px;
    .tips {
        width: 100%;
        padding: 10px;
        background: #FFF2E6;
        border-radius: 8px;
        display: flex;
        .tipsIcon {
            width: 24px;
            color: #FF7D00;
            font-size: 24px;
        }
        .tipsContent {
            flex: 1;
            padding-left: 8px;
            .tipsTitle {
                font-size: 16px;
                font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
                font-weight: bold;
                color: #FF7D00;
                line-height: 24px;
            }
            .tipsMsg {
                margin-top: 8px;
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #FF7D00;
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
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
