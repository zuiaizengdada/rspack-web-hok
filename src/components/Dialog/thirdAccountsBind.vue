<template>
  <AppDialog
    v-model="visible"
    title="智能销售账号绑定"
    width="518px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="editRemarks overflowOuto">
      <el-form
        ref="form"
        label-width="auto"
        :model="form"
        size="small"
        style="margin-top: 12px"
        :rules="rules"
      >
        <el-form-item label="智能销售平台：" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择"
            style="width: 168px"
            clearable
            @change="onhandleTypeChang"
          >
            <el-option
              v-for="(item, index) in option"
              :key="index"
              :label="item.name"
              :value="item.type"
              :disabled="handleDisabledFn(item.type)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.type === 2"
          label="根据手机号绑定："
          prop="wechatPhone"
        >
          <span
            v-if="!phone"
            class="tips"
          >您还未填写员工手机号码，请先填写员工手机</span>
          <span
            v-else-if="!form.weChat.bizWechatName"
            class="tips"
          >当前员工手机号码未对应到企业微信</span>
          <div v-else class="thirdAccountsListContent">
            <el-image :src="form.weChat.bizWechatAvatar" class="imgAvater">
              <template slot="error">
                <img
                  src="~@/assets/image/imgloadError.png"
                  alt=""
                  style="width: 100px; height: 100px"
                />
              </template>
            </el-image>
            <div class="userInfo">
              <span>{{ form.weChat.bizWechatName }}</span>
              <span>{{ form.weChat.bizWechatAlias }}</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          v-if="form.type === 1"
          label="ERP员工编号："
          prop="erpCode"
        >
          <el-input
            v-model.trim="form.erpCode"
            placeholder="请输入"
            style="width: 100%"
            maxlength="50"
            show-word-limit
            @input="delNumber"
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getUserBindList, getWeChatByPhone } from '@/api/user/member'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      visible: true,
      option: [],
      top: '114px',
      phone: '',
      form: {
        status: '',
        wechatPhone: '',
        weChat: {
          bizWechatAvatar: '',
          bizWechatName: '',
          bizWechatAlias: ''
        },
        erpCode: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择智能销售账号', trigger: 'change' }
        ],
        wechatPhone: [
          { required: true, message: '请选择企微账号', trigger: 'change' }
        ],
        erpCode: [
          { required: true, message: '请输入ERP员工编号', trigger: 'change' }
        ]
      },
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        val && this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(document.body.clientHeight - 333) / 2 + 'px'
  },
  methods: {
    getList() {
      getUserBindList().then(res => {
        this.option = res.data
      })
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.visible = false
          this.success && this.success(this.form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 限制只能输入英文和数字
    delNumber(e) {
      this.form.erpCode = e.replace(/[^\a-\z\A-\Z0-9]/g, '')
    },
    handleDisabledFn(item) {
      this.disabledFn && this.disabledFn(item)
    },
    // 第三方平台切换触发
    onhandleTypeChang(res) {
      if (res === 2 && this.phone) {
        this.loading = true
        getWeChatByPhone(this.phone)
          .then(res => {
            console.log(res)
            if (res && res.data && res.data.bizWechatName) {
              this.form.weChat = {
                bizWechatAvatar: res.data.bizWechatAvatar || '',
                bizWechatName: res.data.bizWechatName || '',
                bizWechatAlias: res.data.bizWechatAlias || ''
              }
              this.form.status='add'
              this.form.wechatPhone = this.phone
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editRemarks {
  height: 215px;
  padding: 20px;
}
.tips {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
}
.thirdAccountsListContent {
  display: flex;
  .imgAvater {
    width: 100px;
    height: 100px;
    margin-right: 4px;
    overflow: hidden;
  }
  .userInfo {
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    > span:nth-child(1) {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 20px;
    }
    > span:nth-child(2) {
      margin-top: 8px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 17px;
    }
  }
}
</style>
