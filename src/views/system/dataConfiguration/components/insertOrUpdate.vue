<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="visibleFlag"
    :title="insertOrEdit?'修改默认分配规则':'新增默认分配规则'"
    width="700px"
    :loading="loading"
    height="auto"
    @success="sure"
  >
    <div v-loading="loading" class="addDialog overflowOuto">
      <el-form ref="form" class="m-t-16" :model="form" label-width="auto" size="small" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="渠道:" prop="expertChannel">
              <el-select v-model="form.expertChannel" filterable placeholder="请选择" :disabled="insertOrEdit" @change="expertChannelChange">
                <el-option
                  v-for="item in channelArray"
                  :key="item.channelSource"
                  :label="item.channelSourceName"
                  :value="item.channelSource"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺名称：" prop="shopId">
              <el-select v-model="form.shopId" filterable placeholder="请选择" :disabled="insertOrEdit" @focus="changeShop">
                <el-option
                  v-for="item in shopArray"
                  :key="item.shopId"
                  :label="item.shopName"
                  :value="item.shopId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="默认归属达人:" prop="expertId">
              <el-select v-model="form.expertId" filterable placeholder="请选择" @focus="expertFoucs" @change="expertIdChange">
                <el-option
                  v-for="item in darenArray"
                  :key="item.expertId"
                  :label="item.expertName"
                  :value="item.expertId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="默认归属达人ID:">
              <p>{{ form.expertId }}</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="默认归属员工:">
              <p>{{ form.operateName }}</p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tips">
        <i class="el-icon-warning tipsIcon" />
        <div class="tipsContent">
          <div class="tipsTitle">说明</div>
          <div class="tipsMsg">1、当前操作，会使得对应店铺的达人带货订单，默认归属于配置的达人，营收、业绩将默认归属于配置的员工。</div>
          <div class="tipsMsg">2、默认分配只影响非直播订单。</div>
          <div class="tipsMsg">3、默认分配机制，将在订单支付后的96小时候生效，即订单支付96小时后，将默认归属于配置的员工和达人。</div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { userNoPage } from '@/api/addressBookApi'
import { getChannelOfHasShelveShop, getShopListByChannel, getDarenData, insertRuleAdd, updateRule } from '@/api/business/financial'
export default {
  components: {
    AppDialog
  },
  props: {
    objectRow: {
      type: Object,
      default: () => {
        return {

        }
      }
    },
    insertOrEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      channelArray: [],
      shopArray: [],
      darenArray: [],
      userArray: [],
      loading: false,
      visibleFlag: false,
      form: {
        id: '',
        expertChannel: '',
        shopId: '',
        expertId: '',
        operateName: ''
      },
      advertiseFlagArray: [
        { label: '自投', value: 0 },
        { label: '代投', value: 1 }
      ],
      rules: {
        expertChannel: [
          { required: true, message: '请选择渠道', trigger: 'blur' }
        ],
        shopId: [
          { required: true, message: '请选择店铺', trigger: 'blur' }
        ],
        expertId: [
          { required: true, message: '请选择达人', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {

  },
  mounted() {
    this.loadUserNoPage()
    this.getChannelOfHasShelveShop()
  },
  methods: {
    expertIdChange() {
      this.darenArray.some(item => {
        if (item.expertId === this.form.expertId) {
          this.form.operateName = item.operateName
        }
      })
    },
    expertFoucs() {
      if (this.form.expertChannel === '') {
        this.$message.error('请先选择渠道！')
        return
      }
    },
    changeShop() {
      if (this.form.expertChannel === '') {
        this.$message.error('请先选择渠道！')
        return
      }
    },
    expertChannelChange() {
      this.form.shopId = ''
      this.form.expertId = ''
      this.form.operateName = ''
      this.getShopListByChannel()
      this.getDarenData()
    },
    getDarenData() {
      const params = {
        hokChannel: this.form.expertChannel
      }
      getDarenData(params).then(res => {
        if (res.code === 1) {
          this.darenArray = res.data
        }
      })
    },
    getShopListByChannel() {
      const params = {
        type: this.form.expertChannel
      }
      getShopListByChannel(params).then(res => {
        if (res.code === 1) {
          this.shopArray = res.data
        }
      })
    },
    getChannelOfHasShelveShop() {
      getChannelOfHasShelveShop().then(res => {
        if (res.code === 1) {
          this.channelArray = res.data
        }
      })
    },
    loadUserNoPage() {
      const params = {
        deptId: '',
        nickName: ''
      }
      userNoPage(params)
        .then((res) => {
          this.userArray = res.data
        })
        .catch(() => {
        })
    },
    // 限制输入英文数字和汉字
    delNoNumber2(e) {
      this.form.expertName // = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    // 限制输入英文和数字
    delNoNumber1(e) {
      this.form.expertId = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    loadData(row) {
      this.form.id = row.id
      this.form.advertiserPutterName = row.advertiserPutterName
      this.form.advertiseChannel = row.advertiseChannel
      this.form.advertiserId = row.advertiserId
      this.form.advertiseFlag = row.advertiseFlag
      this.form.advertiserPutterUid = row.advertiserPutterUid
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            hokChannel: this.form.expertChannel,
            expertId: this.form.expertId,
            shopId: this.form.shopId
          }
          this.loading = true
          if (this.insertOrEdit) {
            params.id = this.form.id
            updateRule(params).then(res => {
              this.$notify.success({ title: '提示', message: '编辑成功！' })
              this.loading = false
              this.$emit('success')
            }).catch(() => {
              this.loading = false
            })
          } else {
            insertRuleAdd(params).then(res => {
              this.$notify.success({ title: '提示', message: '新增成功！' })
              this.loading = false
              this.$emit('success')
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

    <style lang='scss' scoped>
    .addDialog {
        height: 420px;
        padding: 20px;
        .tips {
            width: 100%;
            padding: 20px;
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

