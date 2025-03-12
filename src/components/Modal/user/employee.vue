<!-- 员工管理页面弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      size="small"
      class="form"
      :rules="rules"
      label-position="right"
    >
      <el-form-item v-if="type === 3" label="账号ID" prop="userId">
        <span>{{ form.userId }}</span>
      </el-form-item>
      <el-form-item label="员工姓名" prop="nickName">
        <el-input v-model.trim="form.nickName" placeholder="员工姓名" />
      </el-form-item>
      <!-- <el-form-item label="英文名称" prop="userName">
        <el-input v-model.trim="form.userName" maxlength="30" show-word-limit />
        <div class="tips">(只能输入英文开头,纯英文或者英文+数字的账号,长度不大于30,不能输入特殊字符)</div>
      </el-form-item> -->
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
          v-model.trim="form.phoneNumber"
          :disabled="type === 3"
          type="tel"
          maxlength="11"
          placeholder="手机号"
          :min="0"
          @input="e => delNoNumber(e, 'phoneNumber')"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model.trim="form.email"
          :disabled="type === 3 && disableEmail"
          placeholder="邮箱"
        />
      </el-form-item>
      <el-form-item v-if="type !== 3" label="登录密码" prop="password">
        <el-input
          v-model.trim="form.password"
          :min="0"
          show-word-limit
          @input="e => nickNameInput(e)"
        />
        <div class="tips">（密码必须包含英文和数字，长度不能少于8位。）</div>
      </el-form-item>
      <el-form-item label="所在部门" prop="deptName">
        <el-input
          v-model="form.deptName"
          style="width: calc(100% - 78px)"
          :disabled="true"
        />
        <el-button
          style="width: 68px"
          class="m-l-10"
          @click="selectDept"
        >选择</el-button>
        <!-- :disabled="type === 3 && permsList.includes('system:user:hokOrgAuth')" -->
      </el-form-item>
      <!-- <el-form-item label="适用岗位" prop="postId">
        <el-select
          v-model="form.postId"
          clearable
          filterable
          placeholder="请选择"
          multiple
        >
          <el-option
            v-for="item in postList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="岗位名称" prop="jobIds">
        <el-select
          v-model="form.jobIds"
          clearable
          filterable
          placeholder="请选择"
          multiple
          style="width: 100%"
          @change="selectJob"
        >
          <!-- :disabled="type === 3 && permsList.includes('system:user:hokOrgAuth')" -->
          <el-option
            v-for="item in job_options"
            :key="item.jobId"
            :label="item.jobName"
            :value="item.jobId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="角色组" prop="roleIds">
        <el-select
          v-model="form.roleIds"
          clearable
          filterable
          placeholder="请选择"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in role_options"
            :key="item.dictValue"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-if="type === 3" label="获课一下公众号">
        <div class="publicNumber">
          <template v-if="pubilcCode.focusFlag === 0">
            <div v-loading="bindLoading" class="publicNumberCode">
              <el-image :src="pubilcCode.url" style="width: 100%;height: 100%" />
            </div>
            <div class="publicBtn" style="width: 120px">
              <span v-loading="bindLoading" element-loading-spinner="el-icon-loading" class="a_link" @click="userBindDetail">刷新</span>绑定结果
            </div>
          </template>
          <template v-else>
            <div>
              <div v-loading="bindLoading" class="weChatImage">
                <svg-icon style="width: 100%;height: 100%" icon-class="bindAvatar" />
              </div>
            </div>
            <div v-loading="bindLoading" element-loading-spinner="el-icon-loading" class="publicBtn a_link" @click="clickUnBind">解除绑定</div>
          </template>
        </div>
      </el-form-item> -->
      <!-- <el-form-item label="开通客服功能" prop="customerFlag">
        <el-switch v-model="form.customerFlag" :active-value="1" :inactive-value="2" />
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="0"
          :inactive-value="1"
        />
        <span class="m-l-10">{{ { 0: '启用', 1: '禁用' }[form.status] }}</span>
      </el-form-item>
      <el-form-item label="员工类型">
        <el-radio-group v-model="form.employeeType">
          <el-radio :label="1">负责人</el-radio>
          <el-radio :label="2">小伙伴</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="0" />
      <div class="thirdAccounts">
        <span
          style="
            font-size: 14px;
            font-weight: 700;
            display: inline-block;
            width: 120px;
            text-align: right;
            color: #606266;
          "
        >
          智能销售账号绑定
        </span>
        <el-button
          v-if="form.thirdAccounts.length < 2"
          style="background: #e7f0ff; border: 1px solid #dae9ff; color: #0c6fff"
          type="primary"
          size="small"
          icon="el-icon-plus"
          class="m-l-10"
          @click="addThirdAccounts"
        >
          新增
        </el-button>
      </div>
      <div
        v-for="(item, index) in form.thirdAccounts"
        :key="index"
        class="thirdAccountsList"
      >
        <div class="thirdAccountsListHeader">
          <span>
            智能销售平台：{{
              getOptionsValueByKey(
                'type',
                'name',
                item.type,
                thirdAccountsTypeOption
              )
            }}
          </span>
          <span class="Unbinding" @click="delThirdAccounts(item, index)">
            解绑
          </span>
        </div>
        <div v-if="item.type === 2" class="thirdAccountsListContent">
          <el-image :src="item.weChat.bizWechatAvatar" class="imgAvater">
            <template slot="error">
              <img
                src="~@/assets/image/imgloadError.png"
                alt=""
                style="width: 58px; height: 58px"
              />
            </template>
          </el-image>
          <div class="userInfo">
            <span>{{ item.weChat.bizWechatName }}</span>
            <span>{{ item.weChat.bizWechatAlias }}</span>
          </div>
        </div>
        <div v-else-if="item.type === 1" class="thirdAccountsListContent">
          <span>ERP员工编号: {{ item.erpCode }}</span>
        </div>
      </div>

      <el-form-item v-if="type === 3 && feishuAccount.account" label-width="0">
        <div class="thirdAccounts">
          <span
            style="
              font-size: 14px;
              font-weight: 700;
              display: inline-block;
              width: 110px;
              text-align: right;
              color: #606266;
            "
          >飞书登录绑定</span>
          <el-button
            v-if="!feishuAccount.ifBindUser"
            style="
              background: #e7f0ff;
              border: 1px solid #dae9ff;
              color: #0c6fff;
            "
            type="primary"
            size="small"
            class="m-l-10"
            @click="addbind('feishu')"
          >绑定飞书登录</el-button>
          <template v-else>
            <div class="feishuBindUser">
              <AppAvatar
                :avatar="feishuAccount.userInfo.avatar_big"
                :name="feishuAccount.userInfo.name"
                :width="48"
                class="m-r-10"
                :no-name="true"
              />
              <div class="feishuBindUserContent">
                <div class="feishuBindUserName">
                  {{ feishuAccount.userInfo.name }}
                </div>
                <div class="feishuBindmobile">
                  {{ feishuAccount.userInfo.mobile }}
                </div>
              </div>

              <div class="feishuBindUserBtn">
                <el-button
                  type="text"
                  style="color: #f53f3f"
                  @click="unBindUser('feishu')"
                >解绑</el-button>
              </div>
            </div>
          </template>
        </div>
      </el-form-item>
      <el-form-item v-if="type === 3 && wecomAccount.account" label-width="0">
        <div class="thirdAccounts">
          <span
            style="
              font-size: 14px;
              font-weight: 700;
              display: inline-block;
              width: 110px;
              text-align: right;
              color: #606266;
            "
          >
            企微登录绑定
          </span>
          <el-button
            v-if="!wecomAccount.ifBindUser"
            style="
              background: #e7f0ff;
              border: 1px solid #dae9ff;
              color: #0c6fff;
            "
            type="primary"
            size="small"
            class="m-l-10"
            @click="addbind('wecom')"
          >
            绑定企微登录
          </el-button>
          <template v-else>
            <div class="feishuBindUser">
              <AppAvatar
                :avatar="wecomAccount.userInfo.avatar_big"
                :name="wecomAccount.userInfo.name"
                :width="48"
                class="m-r-10"
                :no-name="true"
              />
              <div class="feishuBindUserContent">
                <div class="feishuBindUserName">
                  {{ wecomAccount.userInfo.name }}
                </div>
                <div class="feishuBindmobile">
                  {{ wecomAccount.userInfo.mobile }}
                </div>
              </div>

              <div class="feishuBindUserBtn">
                <el-button
                  type="text"
                  style="color: #f53f3f"
                  @click="unBindUser('wecom')"
                >
                  解绑
                </el-button>
              </div>
            </div>
          </template>
        </div>
      </el-form-item>
    </el-form>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
      <el-button type="primary" size="small" @click="send()">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  // getCodeUrl,
  unBind
  // getUserDetail
} from '@/api/addressBookApi'

import { queryRoleByJobId } from '@/api/businessAdmin/talentFile'
import Dialog from '@/components/Dialog/index.js'
import {
  getUserBindList,
  unbindCheckAjax,
  sendPhoneCode,
  getUserInfoByUserId,
  unBindUser,
  getOrganizationIdByAppId,
  unBindWechatUser,
  wechatUserInfoApi,
  orgToWecomAppIdApi,
  getBindUserInfoApi
} from '@/api/user/member'
import { getOptionsValueByKey } from '@/filters/index'
import { getItem } from '@/utils/localStorage'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
// import { sendCode } from '@/api/login'
export default {
  components: {
    AppAvatar
  },
  props: {
    type: {
      // 2: 是弹框: 1:是新增抽屉 3：是编辑抽屉
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
        return {
          userId: '',
          nickName: '',
          password: '',
          phoneNumber: '',
          email: '',
          roleIds: [],
          jobIds: [],
          userName: '',
          customerFlag: 2,
          deptName: '',
          deptId: '',
          status: 0,
          thirdAccounts: [] // 第三方账号的数组
        }
      }
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!/^[0-9]{11}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var validateNewPass = (rule, value, callback) => {
      if (value === '' && this.type !== 3) {
        callback(new Error('请输入登录密码'))
      } else if (
        !/^(?![0-9]+$)(?![a-zA-Z]+$)(?![\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]+$)[0-9A-Za-z\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{8,}$/.test(
          value
        ) &&
        this.type !== 3
      ) {
        callback(new Error('密码格式不正确!'))
      } else {
        callback()
      }
    }
    // var validateUserName = (rule, value, callback) => {
    //   if (!/^[a-zA-Z][a-zA-Z0-9]{0,29}$/.test(value)) {
    //     callback(new Error('请输入正确的英文名称'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      time: 60,
      btnText: '发送验证码',
      btnLoading: false,
      bindLoading: false,
      sendDisabled: false,
      loading: false,
      rules: {
        // userName: [
        //   { required: true, trigger: 'blur', validator: validateUserName }
        // ],
        nickName: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        roleIds: [{ required: true, message: '请选择角色组', trigger: 'blur' }],
        jobIds: [
          { required: true, message: '请选择岗位名称', trigger: 'blur' }
        ],
        deptName: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        password: [
          { required: true, trigger: 'blur', validator: validateNewPass }
        ],
        phoneNumber: [
          { required: true, trigger: 'blur', validator: validatePhone }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur']
          }
        ]
        // postId: [{ required: true, message: '请选择岗位', trigger: 'blur' }]
      },
      form: {
        nickName: '',
        password: '',
        phoneNumber: '',
        roleIds: [],
        jobIds: [],
        userName: '',
        customerFlag: 2,
        deptName: '',
        deptId: '',
        status: 0,
        userId: '',
        userType: 1,
        thirdAccounts: [], // 第三方账号的数组
        email: ''
      },
      // 关注公众号信息
      pubilcCode: {
        focusFlag: 0, // 1是 0否
        userId: '',
        openId: ''
      },
      feishuAccount: {
        // 飞书账号信息
        loading: false,
        account: false, // 当前机构是否开启了飞书扫码的配置
        ifBindUser: false, // 是否绑定了飞书账号
        userInfo: {
          avatar_big: '',
          avatar_middle: '',
          mobile: '',
          name: '',
          open_id: ''
        } // 绑定的飞书账号信息
      },
      wecomAccount: {
        // 企微账号信息
        loading: false,
        account: false, // 当前机构是否开启了企微扫码的配置
        ifBindUser: false, // 是否绑定了企微账号
        userInfo: {
          avatar_big: '',
          avatar_middle: '',
          mobile: '',
          name: '',
          open_id: ''
        } // 绑定的企微账号信息
      },
      thirdAccountsTypeOption: [],
      postList: [],
      disableEmail: false,
      permsList: this.$route.meta.permsList || []
      // role_options: []
    }
  },
  computed: {
    ...mapGetters(['role_options', 'job_options'])
  },
  watch: {
    visible: {
      handler(newValue) {
        this.getUserBindList()

        if (newValue && this.type === 1) {
          this._getRoleOptions()
          this._getJobOptions()
          this.form = {
            nickName: '',
            password: '',
            phoneNumber: '',
            roleIds: [],
            jobIds: [],
            userName: '',
            customerFlag: 2,
            deptName: '',
            deptId: '',
            status: 0,
            userType: 1,
            employeeType: 2,
            thirdAccounts: [], // 第三方账号的数组
            email: ''
          }
          this.disableEmail = false
        } else if (newValue && this.type === 3) {
          this._getRoleOptions()
          this._getJobOptions()
          this.form = {
            ...this.data,
            thirdAccounts: JSON.parse(JSON.stringify(this.data.thirdAccounts)) // 第三方账号的数组
          }
          if (this.data.email) {
            this.disableEmail = true
          }
          this.getBindUserInfo()
          // this.getOrghas('feishu')
          // this.getOrghas('wecom')
          // this.userBindDetail()
          queryRoleByJobId(this.form.jobIds).then(res => {
            this.form.roleIds = [
              ...new Set([
                ...this.data.roleIds,
                ...res.data.map(item => item.roleId)
              ])
            ]
          })
        }
        this.$refs.form && this.$refs.form.clearValidate()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},

  methods: {
    async selectJob(val) {
      const res = await queryRoleByJobId(val)
      this.form.roleIds = [
        ...new Set([...this.data.roleIds, ...res.data.map(item => item.roleId)])
      ]
    },
    // 获取是否有飞书和企微方式
    async getBindUserInfo() {
      this.feishuAccount.loading = true
      try {
        const orgInfo = getItem('orgInfo')
        const { data } = await getBindUserInfoApi({
          tenantId: orgInfo.organizationId,
          userId: this.data.userId
        })
        data.forEach(f => {
          if (f.type === 1) {
            // 飞书
            this.feishuAccount = {
              loading: false,
              account: true,
              ifBindUser: !!f.status,
              userInfo: f
            }
          } else if (f.type === 2) {
            // 企微
            this.wecomAccount = {
              loading: false,
              account: true,
              ifBindUser: !!f.status,
              userInfo: f
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
      this.feishuAccount.loading = false
    },
    // 飞书 / 企微解绑
    async unBindUser(type = 'feishu') {
      this.$delModal({
        visible: true,
        tips: '确定解除绑定?',
        success: async () => {
          const orgInfo = getItem('orgInfo')
          const data = {
            tenantId: orgInfo.organizationId,
            userId: this.form.userId
          }
          try {
            if (type === 'feishu') {
              await unBindUser(data)
            } else if (type === 'wecom') {
              await unBindWechatUser(data)
            }
            this.$set(this[`${type}Account`], 'userInfo', {
              avatar_big: '',
              avatar_middle: '',
              mobile: '',
              name: '',
              open_id: ''
            })
            this.$set(this[`${type}Account`], 'ifBindUser', false)
            // this[`${type}Account`].ifBindUser = false
            this.$notify.success({ title: '提示', message: '操作成功' })
          } catch (error) {
            console.log(error)
          }
        }
      })
    },
    // 飞书 / 企微解绑
    addbind(type) {
      const keyToDialog = {
        feishu: 'FeisuApply',
        wecom: 'WecomApply'
      }
      Dialog.open({
        type: keyToDialog[type],
        visible: true,
        userId: this.form.userId,
        success: res => {
          Dialog.close()
          if (res) {
            this.$set(this[`${type}Account`], 'userInfo', res.userInfoDto)
            this.$set(this[`${type}Account`], 'ifBindUser', true)
            this.$set(this[`${type}Account`], 'loading', false)
          }
        }
      })
    },
    // 获取当前机构获取是否开启飞书 / 企微扫码登录
    async getOrghas(type) {
      const orgInfo = getItem('orgInfo')
      const params = {
        tenantId: orgInfo.organizationId
      }
      let res = {}
      if (type === 'feishu') {
        res = await getOrganizationIdByAppId(params)
      } else {
        res = await orgToWecomAppIdApi(params)
      }

      if (res.data.appId) {
        this.$set(this[`${type}Account`], 'account', true)
        await this.getUserByUserId(type)
      }
    },
    // 通过飞书/ 企微 获取绑定信息
    async getUserByUserId(type) {
      const orgInfo = getItem('orgInfo')
      const data = {
        tenantId: orgInfo.organizationId,
        userId: this.form.userId,
        isCheckLogin: false
      }
      try {
        let res = {}
        if (type === 'feishu') {
          res = await getUserInfoByUserId(data)
        } else {
          res = await wechatUserInfoApi(data)
        }
        if (res.data) {
          this.$set(this[`${type}Account`], 'userInfo', res.data)
          this.$set(this[`${type}Account`], 'ifBindUser', true)
          // this[`${type}Account`].userInfo = res.data
          // this[`${type}Account`].ifBindUser = true
        } else {
          // this[`${type}Account`].ifBindUser = false
          this.$set(this[`${type}Account`], 'ifBindUser', false)
        }
      } catch (error) {
        this.$message.error(error.msg || '系统错误')
      }
    },

    _sendCode() {
      this.$refs.form.validateField('phoneNumber', valid => {
        if (!valid) {
          this.btnLoading = true
          sendPhoneCode({ phone: this.form.phoneNumber })
            .then(res => {
              console.log(res, 'ress+++++++++')
              const _this = this
              _this.sendDisabled = true
              const interval = setInterval(function () {
                if (_this.time-- <= 0) {
                  _this.time = 60
                  _this.sendDisabled = false
                  _this.btnLoading = false
                  _this.btnText = '重新发送'
                  clearInterval(interval)
                }
              }, 1000)
            })
            .catch(() => {
              this.sendDisabled = false
              this.btnLoading = false
              this.btnText = '重新发送'
            })
        }
      })
    },
    getOptionsValueByKey,
    getUserBindList() {
      getUserBindList().then(res => {
        this.thirdAccountsTypeOption = res.data
      })
    },
    delNoNumber(e, key) {
      this.form[key] = e.replace(/\D/g, '')
    },
    nickNameInput(e) {
      this.form.password = e.replace(/(?:[\u4e00-\u9fa5·])/g, '')
    },
    send() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const obj = {
            ...this.form,
            erpCode: '',
            wechatPhone: ''
          }
          this.form.thirdAccounts.map(v => {
            if (v.type === 1) {
              // 博商erp
              obj.erpCode = v.erpCode
            } else if (v.type === 2) {
              // 企业微信
              obj.wechatPhone = v.wechatPhone
              obj.bizWechatId = v.bizWechatId
            }
          })
          delete obj.thirdAccounts
          const params = {
            ...this.data,
            ...obj
          }
          this.$emit('success', params)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 获取角色下拉框
    async _getRoleOptions() {
      await this.$store.dispatch('option/getRoleOptions')
    },
    // 获取岗位下拉框
    async _getJobOptions() {
      await this.$store.dispatch('option/getJobOptions')
    },
    // 获取用户绑定信息
    // userBindDetail() {
    //   this.bindLoading = true
    //   getUserDetail(this.data.userId).then(res => {
    //     console.log('获取用户绑定信息', res)
    //     this.pubilcCode = res.data
    //     if (res.data.focusFlag === 0) {
    //       return this.getCodeUrl()
    //     } else {
    //       this.bindLoading = false
    //     }
    //   }).catch(() => {
    //     this.bindLoading = false
    //   })
    // },
    // 获取关注公众号得二维码地址
    // getCodeUrl() {
    //   return getCodeUrl(this.data.userId).then(res => {
    //     console.log(res, '获取二维码地址')
    //     this.pubilcCode = res.data
    //     this.bindLoading = false
    //   }).catch(() => {
    //     this.bindLoading = false
    //   })
    // },
    // 点击选择部门
    selectDept() {
      const _this = this
      this.$AddressBook({
        type: [0],
        visible: true,
        multiple: false,
        checkDept: [
          {
            name: _this.form.deptName,
            deptId: _this.form.deptId
          }
        ],
        checkUserIds: [],
        success: res => {
          console.log(res)
          if (res.dept.length > 0) {
            _this.$set(this.form, 'deptName', res.dept[0].name)
            _this.$set(this.form, 'deptId', res.dept[0].id)
          }
        }
      })
    },
    // 点击解除绑定
    clickUnBind() {
      this.$delModal({
        tips: '确定解除绑定?',
        success: () => {
          this.bindLoading = true
          unBind(this.data.userId)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.userBindDetail()
              this.bindLoading = false
            })
            .catch(() => {
              this.bindLoading = false
            })
        }
      })
    },
    // 点击新增第三方账号绑定
    addThirdAccounts() {
      console.log(this.type)
      Dialog.open({
        type: 'ThirdAccountsBind',
        phone: this.form.phoneNumber || '',
        handleDisabledFn: res => {
          const index = this.form.thirdAccounts.findIndex(v => v.type === res)
          return index !== -1
        },
        success: res => {
          this.form.thirdAccounts.push(res)
        }
      })
    },
    // 点击解绑第三方账号
    delThirdAccounts(item, index) {
      const tips = {
        1: '是否确认解绑？解绑后对应绑定的博商ERP将失效！',
        2: '是否确认解绑？解绑后对应绑定的企业微信将失效！'
      }
      this.$delModal({
        tips: tips[item.type],
        success: () => {
          if (item.type === 2) {
            unbindCheckAjax(this.data.userId).then(res => {
              if (res.code === 1) {
                this.form.thirdAccounts.splice(index, 1)
              }
            })
          } else {
            this.form.thirdAccounts.splice(index, 1)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .form {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 37px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%),
      0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
  .form_avatar {
    display: flex;
    align-items: center;
    .form_btn {
      height: 30px;
      margin-left: 10px;
    }
  }
  .form_textarea {
    width: 600px;
    margin-right: 10px;
  }
  .thirdAccounts {
    margin-top: 17px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  .thirdAccountsList {
    margin-top: 20px;
    padding: 20px;
    background: #f2f9ff;
    border-radius: 8px;
    .thirdAccountsListHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .Unbinding {
        cursor: pointer;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #f53f3f;
        line-height: 22px;
      }
    }
    .thirdAccountsListContent {
      margin-top: 16px;
      display: flex;
      .imgAvater {
        width: 58px;
        height: 58px;
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
  }
}
.image_poster {
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #dcdcdc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > span {
    margin-top: 13px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #1472ff;
  }
}
.tips {
  // margin-top: 20px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 22px;
}
.publicNumber {
  .publicNumberCode {
    width: 120px;
    height: 120px;
    background: #ccc;
  }
  .publicBtn {
    width: 80px;
    text-align: center;
    font-size: 14px;
    color: #777;
    line-height: 22px;
  }
  .weChatImage {
    width: 80px;
    height: 80px;
    border-radius: 4px;
    // background: #ccc;
  }
  .weChatUserNmae {
    width: 80px;
    text-align: center;
    font-size: 14px;
    color: #777;
    line-height: 22px;
  }
}
.getSendCode {
  font-size: 14px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #0c6fff;
  line-height: 20px;
  cursor: pointer;
  margin-right: 16px;
}
.getSendCodetime {
  font-size: 12px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 17px;
}
.feishuBindUser {
  float: right;
  width: calc(100% - 120px);
  height: 80px;
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  .feishuBindUserContent {
    flex: 1 0 0;
    .feishuBindUserName {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #44474d;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 4px;
    }
    .feishuBindmobile {
      font-size: 14px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #44474d;
      line-height: 20px;
    }
  }
  .feishuBindUserBtn {
    width: 44px;
    text-align: right;
  }
}
</style>
