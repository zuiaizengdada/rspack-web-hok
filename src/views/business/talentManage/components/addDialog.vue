<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="{1: '新增达人', 2: '编辑达人'}[config.type]"
    width="486px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div v-loading="loading" class="addDialog overflowOuto">
      <div class="tips">
        <i class="el-icon-warning tipsIcon" />
        <div class="tipsContent">
          <div class="tipsTitle">注意</div>
          <div class="tipsMsg">请正确填写【达人账号信息】，一旦输入错误将影响运营人员业绩核算，请慎重填写。</div>
        </div>
      </div>
      <el-form ref="form" class="m-t-16" :model="form" label-width="auto" size="small" :rules="rules">
        <el-form-item label="运营人员" prop="operateUid">
          <div>
            <el-tag
              v-if="form.operateUid"
              class="remindPersonListView"
              closable
              @close="delAssessUsers()"
              @click.native="selectUser"
            >{{ form.operateName }}</el-tag>
            <el-button v-else size="mini" class="remindPersonListView" @click="selectUser"><i class="el-icon-plus el-icon--left" />请选择</el-button>
          </div>
        </el-form-item>
        <el-form-item label="达人渠道" prop="expertChannel">
          <el-select v-model="form.expertChannel" placeholder="请选择" clearable style="width: 100%">
            <el-option v-for="(item) in liveChannel" :key="item.value" :label="item.label" :value="item.value">
              <svg-icon :icon-class="item.icon" />
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="达人ID" prop="expertId">
          <el-input v-model.trim="form.expertId" placeholder="请输入达人ID" class="w-120" maxlength="30" show-word-limit style="width: 100%" @input="delNoNumber1" />
        </el-form-item>
        <el-form-item label="达人昵称" prop="expertName">
          <el-input v-model.trim="form.expertName" placeholder="请输入达人昵称" class="w-120" maxlength="30" show-word-limit style="width: 100%" @input="delNoNumber2" />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { liveChannel } from '../columns'
import { expertManAdd, expertManEdit } from '@/api/order/performanceShare'
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
      liveChannel,
      loading: false,
      form: {
        operateName: '', // 运营人员名称
        operateUid: '', // 运营人员ID
        expertChannel: '', // 达人渠道
        expertName: '', // 达人昵称
        expertId: '' // 达人ID
      },
      rules: {
        operateUid: [
          { required: true, message: '请选择运营人员', trigger: 'blur' }
        ],
        expertChannel: [
          { required: true, message: '请选择达人渠道', trigger: 'blur' }
        ],
        expertName: [
          { required: true, message: '请正确填写达人昵称', trigger: 'blur' }
        ],
        expertId: [
          { required: true, message: '请正确填写达人ID', trigger: 'blur' }
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
              operateName: '', // 运营人员名称
              operateUid: '', // 运营人员ID
              expertChannel: '', // 达人渠道
              expertName: '', // 达人昵称
              expertId: '' // 达人ID
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
    delNoNumber2(e) {
      this.form.expertName // = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 限制输入英文和数字
    delNoNumber1(e) {
      this.form.expertId = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form
          }
          delete params.operateName
          this.loading = true
          const apiFn = this.config.type === 1 ? expertManAdd : expertManEdit
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
      this.form.operateName = ''
      this.form.operateUid = ''
    },
    // 点击添加人员
    selectUser() {
      const checkUser = []
      if (this.form.operateUid && this.form.operateName) {
        checkUser.push({ userId: this.form.operateUid, nickName: this.form.operateName })
      }
      this.$AddressBook({
        visible: true,
        multiple: false,
        checkUser,
        type: [1],
        success: (res) => {
          if (res.user.length > 0) {
            this.form.operateName = res.user[0].nickName // 运营人员名称
            this.form.operateUid = res.user[0].userId // 运营人员ID
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.addDialog {
    height: 360px;
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
</style>
