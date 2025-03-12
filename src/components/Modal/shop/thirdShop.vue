<!-- 分组页面弹框 -->
<template>
  <div v-loading="loading" :class="`group${type == 2 ? 'Dialog' : 'Drawer'}`">
    <el-form
      ref="form"
      :model="form"
      label-width="140px"
      size="small"
      class="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="渠道平台" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="item in thirdShopTypeArray"
            :key="item.channelSource"
            :value="item.channelSource"
            :label="item.channelSourceName"
          >
            <div class="show-icn-label">
              <img :src="item.channelImg" />
              <span>{{ item.channelSourceName }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input v-model.trim="form.shopName" />
      </el-form-item>
      <el-form-item
        v-if="
          form.type === 16 ||
            form.type === 1 ||
            form.type === 2 ||
            form.type === 10 ||
            form.type === 7 ||
            form.type === 11 ||
            form.type === 4 ||
            form.type === 12 ||
            form.type === 15 ||
            form.type === 14 ||
            form.type === 13 ||
            form.type === 21
        "
        label="SHOP_ID"
        prop="shopId"
      >
        <el-input v-model.trim="form.shopId" />
      </el-form-item>
      <el-form-item v-if="form.type === 20" label="店铺ID" prop="shopIdLabel">
        <el-input v-model.trim="form.shopIdLabel" />
      </el-form-item>
      <el-form-item
        v-if="
          form.type === 16 ||
            form.type === 1 ||
            form.type === 2 ||
            form.type === 10 ||
            form.type === 7 ||
            form.type === 11 ||
            form.type === 4 ||
            form.type === 12 ||
            form.type === 20
        "
        label="AppId"
        prop="appId"
      >
        <el-input v-model.trim="form.appId" />
      </el-form-item>
      <el-form-item
        v-if="
          form.type === 16 ||
            form.type === 1 ||
            form.type === 2 ||
            form.type === 10 ||
            form.type === 7 ||
            form.type === 11 ||
            form.type === 4 ||
            form.type === 12
        "
        label="AppSecret"
        prop="appSecret"
      >
        <el-input v-model.trim="form.appSecret" />
      </el-form-item>
      <el-form-item
        v-if="form.type === 20"
        label="appSecret"
        prop="appSecretLabel"
      >
        <el-input v-model.trim="form.appSecretLabel" />
      </el-form-item>
      <el-form-item
        v-if="form.type === 2 || form.type === 11 || form.type === 7"
        label="appKey"
        prop="appKey"
      >
        <el-input v-model.trim="form.appKey" />
      </el-form-item>
      <el-form-item v-if="form.type === 2" label="签名秘钥" prop="signSecret">
        <el-input v-model.trim="form.signSecret" />
      </el-form-item>
      <el-form-item
        v-if="form.type === 20"
        label="主账号ID"
        prop="signSecretLabel"
      >
        <el-input v-model.trim="form.signSecretLabel" />
      </el-form-item>
      <el-form-item v-if="form.type === 2" label="回调秘钥" prop="reCallSecret">
        <el-input v-model.trim="form.reCallSecret" />
      </el-form-item>
      <el-form-item
        v-if="form.type === 10 || form.type === 7"
        label="解密key"
        prop="encodingAesKey"
      >
        <el-input v-model.trim="form.encodingAesKey" />
      </el-form-item>
      <el-form-item
        v-if="form.type === 10 || form.type === 7"
        label="解密token"
        prop="encodingToken"
      >
        <el-input v-model.trim="form.encodingToken" />
      </el-form-item>
      <el-form-item
        v-if="form.type === 20"
        label="公钥"
        prop="encodingTokenLabel"
      >
        <el-input v-model.trim="form.encodingTokenLabel" />
      </el-form-item>
      <el-form-item v-if="form.type === 10" label="加密key" prop="pullKey">
        <el-input v-model.trim="form.pullKey" />
      </el-form-item>
      <el-form-item
        v-if="form.type === 20"
        label="店铺类型"
        prop="pullKeySelect"
      >
        <el-select v-model="form.pullKeySelect" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          form.type === 16 ||
            form.type === 1 ||
            form.type === 2 ||
            form.type === 10 ||
            form.type === 7 ||
            form.type === 11 ||
            form.type === 14 ||
            form.type === 13 ||
            form.type === 15 ||
            form.type === 12 ||
            form.type === 20 ||
            form.type === 21
        "
        label="是否推送数据"
        prop="toBosumFlag"
      >
        <el-radio-group v-model="form.toBosumFlag">
          <el-radio :label="1" :disabled="!pushStatus">是</el-radio>
          <el-radio :label="0" :disabled="!pushStatus">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="
          form.type === 16 ||
            form.type === 1 ||
            form.type === 2 ||
            form.type === 10 ||
            form.type === 7 ||
            form.type === 11 ||
            form.type === 14 ||
            form.type === 13 ||
            form.type === 15 ||
            form.type === 12 ||
            form.type === 20
        "
        label="消息topics"
        prop="topics"
      >
        <el-input v-model.trim="form.topics" />
      </el-form-item>
      <el-form-item label="是否提供在线开票" prop="supportInvoice">
        <el-radio-group
          v-model="form.supportInvoice"
          @change="changeSupportInvoice"
        >
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.supportInvoice">
        <el-form-item label="收款公司名称" prop="collectingCompany">
          <el-input
            v-model.trim="form.collectingCompany"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="收款账号" prop="companyAccount">
          <el-input
            v-model.trim="form.companyAccount"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </template>
    </el-form>

    <div class="demo-drawer__footer">
      <el-button size="small" @click="$emit('close')">取 消</el-button>
      <el-button
        v-if="type !== 2"
        type="primary"
        size="small"
        @click="send()"
      >提交</el-button>
    </div>
  </div>
</template>

<script>
import {
  selectThridShopChannelData,
  getPushConfigByTenantId
} from '@/api/shop/thirdShop'
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    type: {
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
          id: '',
          appId: '',
          appKey: '',
          appSecret: '',
          encodingAesKey: '',
          encodingToken: '',
          pullKey: '',
          reCallSecret: '',
          shelveFlag: '',
          shopId: '',
          shopName: '',
          signSecret: '',
          toBosumFlag: 0,
          topics: '',
          type: '',
          supportInvoice: true,
          collectingCompany: '',
          companyAccount: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      rules: {
        shopName: [
          { required: true, message: '请输入店铺名称', trigger: 'blur' }
        ],
        topics: [
          { required: true, message: '请输入消息topics信息', trigger: 'blur' }
        ],
        shopId: [{ required: true, message: '请输入店铺ID', trigger: 'blur' }],
        shopIdLabel: [
          { required: true, message: '店铺管理对应店铺的ID', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择渠道平台', trigger: 'blur' }],
        appId: [
          {
            required: true,
            message: '开放平台授权应用，授权信息中AppId',
            trigger: 'blur'
          }
        ],
        toBosumFlag: [
          {
            required: true,
            message: '请选择是否推送数据',
            trigger: 'change'
          }
        ],
        appKey: [{ required: true, message: '请输入appKey', trigger: 'blur' }],
        signSecret: [
          { required: true, message: '请输入signSecret', trigger: 'blur' }
        ],
        signSecretLabel: [
          {
            required: true,
            message: '店铺页面开店主账号对应ID',
            trigger: 'blur'
          }
        ],
        reCallSecret: [
          { required: true, message: '请输入reCallSecret', trigger: 'blur' }
        ],
        encodingAesKey: [
          { required: true, message: '请输入encodingAesKey', trigger: 'blur' }
        ],
        encodingToken: [
          { required: true, message: '请输入encodingToken', trigger: 'blur' }
        ],
        encodingTokenLabel: [
          {
            required: true,
            message: '对应店铺API订单导出配置中公钥',
            trigger: 'blur'
          }
        ],
        pullKey: [
          { required: true, message: '请输入pullKey', trigger: 'blur' }
        ],
        pullKeySelect: [
          { required: true, message: '请输入pullKey', trigger: 'change' }
        ],
        appSecret: [
          { required: true, message: '请输入appSecret', trigger: 'blur' }
        ],
        appSecretLabel: [
          {
            required: true,
            message: '开放平台授权应用，授权信息中APPSecret',
            trigger: 'blur'
          }
        ],
        list: [
          {
            required: true,
            message: '至少1人,至多3人',
            trigger: 'change',
            type: 'array'
          }
        ],
        supportInvoice: [
          { required: true, message: '请选择是否提供发票', trigger: 'change' }
        ],
        collectingCompany: [
          { required: true, message: '请输入收款公司名称', trigger: 'blur' }
        ],
        companyAccount: [
          { required: true, message: '请输入收款账号', trigger: 'blur' }
        ]
      },
      form: {
        id: '',
        appId: '',
        appKey: '',
        appSecret: '',
        encodingAesKey: '',
        encodingToken: '',
        pullKey: '',
        reCallSecret: '',
        shelveFlag: '',
        shopId: '',
        shopName: '',
        signSecret: '',
        toBosumFlag: 0,
        topics: '',
        type: '',
        shopIdLabel: '',
        appSecretLabel: '',
        signSecretLabel: '',
        encodingTokenLabel: '',
        pullKeySelect: '',
        supportInvoice: true,
        collectingCompany: '',
        companyAccount: ''
      },
      options: [
        {
          value: '269',
          label: '本地店铺'
        },
        {
          value: '5',
          label: '综合店铺'
        }
      ],
      resultArr: [],
      thirdShopTypeArray: [],
      pushStatus: false
    }
  },
  computed: {
    ...mapGetters(['thirdShopType'])
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue && this.type === 1) {
          this.form = {
            id: '', // id新增时无
            type: '', // 分组名称
            shopName: '', // 显示顺序
            shopId: '', // 目录图标路径
            appId: '',
            appSecret: '',
            list: [],
            supportInvoice: true,
            collectingCompany: '',
            companyAccount: ''
          }
        } else if (newValue && this.type === 3) {
          const list = this.changeList()
          this.form = {
            ...this.data,
            list
          }
          console.log('this.form:', this.form)
          // this.form.shopIdLabel = JSON.parse(JSON.stringify(this.data.shopId))
          this.$set(this.form, 'shopIdLabel', this.data.shopId)
          this.$set(this.form, 'appSecretLabel', this.data.appSecret)
          this.$set(this.form, 'signSecretLabel', this.data.signSecret)
          this.$set(this.form, 'encodingTokenLabel', this.data.encodingToken)
          this.$set(this.form, 'pullKeySelect', this.data.pullKey)
          this.$set(this.form, 'supportInvoice', this.data.supportInvoice)
          this.$set(this.form, 'collectingCompany', this.data.collectingCompany)
          this.$set(this.form, 'companyAccount', this.data.companyAccount)
          /* this.form.appSecretLabel = this.data.appSecret
          this.form.signSecretLabel = this.data.signSecret
          this.form.encodingTokenLabel = this.data.encodingToken
          this.form.pullKeySelect = this.data.pullKey*/
        }
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.clearValidate()
        })
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {
    this.selectThridShopChannelData()
    const { data } = await getPushConfigByTenantId()
    this.pushStatus = data.pushStatus
    this.rules.toBosumFlag[0].required = this.pushStatus
  },
  methods: {
    selectThridShopChannelData() {
      selectThridShopChannelData().then(res => {
        console.log('res:', res)
        if (res.code === 1) {
          this.thirdShopTypeArray = res.data
        }
      })
    },
    validate() {
      const items = []
      this.$refs.list.forEach(i => {
        i.validate().forEach(validateFn => {
          const val = new Promise((resolve, reject) => {
            validateFn(valid => {
              if (valid) {
                resolve()
              } else {
                reject()
              }
            })
          })
          items.push(val)
        })
      })
      return Promise.all(items)
    },
    changeSupportInvoice() {
      this.form.collectingCompany = ''
      this.form.companyAccount = ''
    },
    send() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form
          }
          if (this.form.type === 20) {
            params.shopId = this.form.shopIdLabel
            params.appSecret = this.form.appSecretLabel
            params.signSecret = this.form.signSecretLabel
            params.encodingToken = this.form.encodingTokenLabel
            params.pullKey = this.form.pullKeySelect
          }
          this.$emit('success', params)
        } else {
          return false
        }
      })
    },
    changeList() {
      if (!this.data.list) {
        return []
      }
      const list = []
      this.data.list.forEach(i => {
        const ids = list.map(i => i.userId)
        if (ids.includes(i.userId)) {
          list.forEach(j => {
            if (j.userId === i.userId) {
              j.items.push(i)
            }
          })
        } else {
          list.push({
            name: `${i.deptName}/${i.userName}`,
            userId: i.userId,
            items: [i]
          })
        }
      })
      return list
    },
    addItems(current) {
      const items = current.items
      const data = items[0]
      items.push({
        deptId: data.deptId,
        remindNum: '',
        remindType: '',
        thirdId: this.data.id,
        type: '',
        userId: data.userId
      })
    },
    delItems({ current, i }) {
      const items = current.items
      items.splice(i, 1)
    },
    deleteList(i) {
      this.form.list.splice(i, 1)
    },
    addPerson() {
      const disabledUser = []
      this.form.list.forEach(i => {
        disabledUser.push(i.items[0].userId + '')
      })
      console.log(disabledUser)
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        checkDept: [],
        checkUserIds: [],
        disabledUser,
        success: res => {
          if (res.user.length > 0) {
            const data = res.user[0]
            const list = [
              ...this.form.list,
              {
                name: `${data.deptName}/${data.userName}`,
                items: [
                  {
                    deptId: data.deptId,
                    remindNum: '',
                    remindType: '',
                    thirdId: this.data.id,
                    type: '',
                    userId: data.userId
                  }
                ]
              }
            ]
            this.form = {
              ...this.form,
              list
            }
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
    padding: 0 20px;
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
.show-icn-label {
  width: 100%;
  padding: 5px 10px;
  img {
    float: left;
    width: 24px;
    height: 24px;
  }
  span {
    float: left;
    margin-left: 10px;
    line-height: 24px;
  }
}
</style>
