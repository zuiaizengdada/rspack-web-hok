<template>
  <!-- 新增产品 -->
  <AppDialog
    v-model="visible"
    :title="title"
    width="640px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addProduct overflowOuto">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
        :validate-on-rule-change="true"
        @submit.native.prevent
      >
        <el-form-item label="交付主体" prop="deliveryMainBody">
          <el-select
            v-model="form.deliveryMainBody"
            :disabled="ifReview"
            style="width: 450px"
            size="small"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in deliveryMainBodyArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.deliveryMainBody === 1"
          label="伏羲云分配人"
        >
          <el-input
            v-if="ifReview"
            v-model="form.distributionUser"
            style="width: 450px"
            :disabled="ifReview"
          />
          <div v-else>
            <el-input v-model="form.distributionUser" style="display: none" />
            <AppUserSelect
              ref="appUserSelect"
              style="width: 450px"
              :placeholder-string="appPlaceholder"
              @change="changeUser"
            />
          </div>
        </el-form-item>
        <el-form-item label="ERP分配人">
          <el-input
            v-model.trim="form.erpDistributionUser"
            :disabled="ifReview"
            style="width: 450px"
            clearable
            maxlength="10"
            show-word-limit
            placeholder="请输入ERP分配人"
          />
        </el-form-item>
        <el-form-item
          v-if="sortLabelList.includes('1') || sortLabelList.includes('5')"
          label="ERP兜底销售团队"
        >
          <el-input
            v-model.trim="form.erpSalesTeam"
            :disabled="ifReview"
            style="width: 450px"
            clearable
            maxlength="10"
            show-word-limit
            placeholder="请输入ERP兜底销售团队"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model.trim="form.allocationRemark"
            :disabled="ifReview"
            style="width: 450px"
            clearable
            placeholder="请输入备注"
            type="textarea"
            maxlength="180"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
  </AppDialog>
</template>

<script>
import AppUserSelect from '@/components/AppUserSelect'
import AppDialog from '@/components/AppDialog'
import {
  researchProgressOption,
  deliveryMainBodyArray
} from '@/views/product/columns.js'
import { productAllocation } from '@/api/product/productManage.js'
// import { filtersMoneyByZero } from '@/filters/index'

export default {
  components: {
    AppDialog,
    AppUserSelect
  },
  data() {
    var validateResearchProgress = (rule, value, callback) => {
      if (!this.form.researchProgress) {
        return callback('请选择研发进度')
      } else if (this.form.researchProgress === 7 && !this.form.shelfDate) {
        return callback('请选择上架日期')
      } else {
        return callback()
      }
    }
    var validateShelfAddress = (rule, value, callback) => {
      if (!this.form.shelfAddress) {
        return callback()
      }
      // var expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
      // var objExp = new RegExp(expression)
      // if (objExp.test(this.form.shelfAddress) === true) {
      //   return callback()
      // } else {
      //   return callback('请输入有效的上架地址, 格式http(s)://xxx')
      // }
      try {
        new URL(this.form.shelfAddress)
        return callback()
      } catch (err) {
        console.log(err)
        return callback('请输入有效的上架地址')
      }
    }
    return {
      appPlaceholder: '请输入关键字查询并选择分配人',
      deliveryMainBodyArray,
      loading: false,
      visible: false,
      title: '产品分配',
      ifEdit: false,
      ifReview: false,
      row: {},
      form: {
        allocationRemark: '',
        deliveryMainBody: 1,
        distributionUser: '',
        erpDistributionUser: '',
        giveawayHas: 1,
        erpSalesTeam: '',
        productId: ''
      },
      rules: {
        distributionUser: [
          {
            required: true,
            message: '请输入关键字查询并选择分配人',
            trigger: 'change'
          }
        ],
        erpDistributionUser: [
          { required: true, message: '请填写ERP分配人', trigger: 'change' }
        ],
        deliveryMainBody: [
          { required: true, message: '请选择交付主体', trigger: 'change' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        researchProgress: [
          {
            required: true,
            validator: validateResearchProgress,
            trigger: 'change'
          }
        ],
        researcherList: [
          {
            required: true,
            type: 'array',
            message: '请输入研发人员',
            trigger: 'blur'
          }
        ],
        shelfAddress: [{ validator: validateShelfAddress, trigger: 'blur' }]
      },
      top: '114px',
      sortable: null,
      researchProgressOption,
      success: () => {},
      // 设置选择今天以及今天之前的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      sortLabelList: []
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    loadData(row) {
      this.row = { ...row }
      this.initEdit()
    },
    initEdit() {
      console.log('sssssssss', this.row)
      this.$nextTick(() => {
        this.$refs.form.resetFields()

        this.$nextTick(() => {
          this.$refs.appUserSelect.value = this.row.distributionUserName
        })

        this.sortLabelList = this.row.sortLabel?.split(',') || []
        this.row.sortLabel = this.row.sortLabel?.split(',')
          ? this.row.sortLabel?.split(',')[0]
          : ''
        this.form = { ...this.row }
        this.form.deliveryMainBody = this.row.deliveryMainBody
          ? this.row.deliveryMainBody
          : 1
        setTimeout(() => {
          this.$refs.form.clearValidate()
        }, 100)
      })
    },
    // 点击员工
    changeUser(res, info) {
      this.form.distributionUser = res
      // this.$refs['form'].resetFields('distributionUser')
      console.log('ssssssss:', res)
      console.log('ssssssss:', info)
    },
    sure() {
      if (this.ifReview) {
        this.visible = false
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.edit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    edit() {
      const data = {
        allocationRemark: this.form.allocationRemark,
        deliveryMainBody: this.form.deliveryMainBody,
        distributionUser:
          Number(this.form.deliveryMainBody) === 1
            ? this.form.distributionUser
            : '',
        erpDistributionUser: this.form.erpDistributionUser,
        erpSalesTeam: this.form.erpSalesTeam,
        productId: this.form.id
        // editFlag: true
      }
      this.loading = true
      productAllocation(data)
        .then(res => {
          if (res.code === 1) {
            this.visible = false
            this.$emit('successAdd')
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.addProduct {
  max-height: 604px;
  padding: 20px 34px;
}
.tips {
  margin-top: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 17px;
}
.myLotteryTable {
  width: 100%;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbcfd3;
  font-size: 12px;
  overflow: hidden;
}
.assessBox {
  margin-top: 16px;
  width: 450px;
  box-sizing: border-box;
  padding: 18px 16px 2px;
  height: auto;
  background: #ffffff;
  border-radius: 6px;
  border: 1px dashed #979797;
  .remindPersonListView {
    margin-right: 16px;
    margin-bottom: 16px;
  }
}
.hide {
  ::v-deep .fileBtnIcon {
    display: none;
  }
}
</style>
