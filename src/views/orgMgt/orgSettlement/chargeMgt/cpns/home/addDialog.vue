<template>
  <AppDialog
    v-model="visible"
    :title="`${isAdd ? '新增' : '编辑'}收费项`"
    width="583px"
    height="auto"
    @success="sure"
    @close="closeDialog"
  >
    <div class="dialog">
      <el-form
        ref="dialogFormRef"
        class="dialogForm"
        label-position="right"
        label-width="120px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="计费方式" class="fy-price" prop="billingMethod">
          <el-select
            v-model="billingMethod"
            class="w365"
            placeholder="请选择收费类型"
            disabled
          >
            <el-option
              v-for="item in options.billingMethod"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收费项" class="fy-price" prop="productChargesName">
          <el-input
            v-model="form.productChargesName"
            class="w350"
            placeholder="请输入收费项名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="明细收费项"
          class="fy-price"
          prop="productChargesItemName"
        >
          <el-input
            v-model="form.productChargesItemName"
            class="w350"
            placeholder="请输入明细收费项名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="收费类型" class="fy-price" prop="expenseType">
          <el-select
            v-model="form.expenseType"
            class="w365"
            placeholder="请选择收费类型"
          >
            <el-option
              v-for="item in options.expenseType"
              :key="item.value"
              class="w350"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="form.unitPriceUnit === '%' ? '收费比例' : '单价'"
          prop="unitPrice"
        >
          <el-input
            v-model="form.unitPrice"
            placeholder="请输入"
            type="number"
            class="input-with-select w350"
          >
            <!-- <template slot="prepend">
              <el-select
                v-model="form.unitPriceUnit"
                style="width: 109px"
                placeholder="请选择"
                disabled
              >
                <el-option
                  v-for="item in options.billing"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template> -->
            <template slot="append">
              {{ form.unitPriceUnit }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="单价单位" class="fy-price" prop="billingUnit">
          <el-input
            v-model="form.billingUnit"
            class="w350"
            placeholder="请输入单价单位，比如元/月"
            clearable
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button :loading="loading" size="small" type="primary" @click="sure">
        确认
      </el-button>
      <el-button size="small" @click="closeDialog"> 取消 </el-button>
    </div>
  </AppDialog>
</template>

<script>
import { cloneDeep } from 'lodash'
import AppDialog from '@/components/AppDialog'
import {
  chargesAddApi,
  chargesUpdApi
} from '@/api/orgSettlement/billingCenter.js'

export default {
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      isAdd: true,
      loading: false,
      billingMethod: 1,
      form: {
        productChargesName: '', // 产品名称
        productChargesItemName: '', // 明细收费项
        expenseType: '', // 收费类型
        unitPrice: '', // 单价/收费比例
        unitPriceUnit: '', // 单价/收费比例类型
        billingUnit: '' // 单价单位
      },
      rules: {
        productChargesName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        productChargesItemName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        expenseType: [
          { required: true, message: '请选择收费类型', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '单价/收费比例', trigger: 'blur' }
        ],
        billingUnit: [
          { required: true, message: '请输入单价单位', trigger: 'blur' }
        ],
        productChargesItemNo: []
      },
      options: {
        billingMethod: [
          { label: '手动计费', value: 1 },
          { label: '按量计费', value: 2 }
        ],
        billing: [
          { label: '收费比例', value: '%', unit: '%' },
          { label: '单价', value: '元', unit: '元' }
        ],
        expenseType: [
          { label: '账号付费', value: 1 },
          { label: '按量付费', value: 2 },
          { label: 'GMV付费', value: 3 }
        ]
      },
      select: 1,
      chargesInfo: {
        rules: {},
        fileList: [],
        name: ''
      },
      fileList: [],
      billCycleList: [],
      typeName: ''
    }
  },
  watch: {
    'form.expenseType': {
      handler(value) {
        if (value === 3) {
          this.form.unitPriceUnit = '%'
        } else {
          this.form.unitPriceUnit = '元'
        }
      },
      immediate: true
    }
  },
  methods: {
    // codeTransAPpi
    async sure() {
      this.$refs.dialogFormRef.validate(async valid => {
        if (valid) {
          if (this.loading) return
          this.loading = true
          const req = cloneDeep(this.form)
          try {
            const apiFn = this.isAdd ? chargesAddApi : chargesUpdApi
            const { success } = await apiFn(req)
            if (success) {
              this.$message.success((this.isAdd ? '新增' : '修改') + '成功')
              this.$emit('search')
              this.closeDialog()
            }
          } catch (error) {
            console.log('serviceFees-add--------error', error)
          }
          this.loading = false
        }
      })
    },

    // 打开弹窗
    openDialog(val) {
      console.log('val---', val)
      if (val) {
        this.form = {
          productChargesName: val.productChargesName, // 产品名称
          productChargesItemName: val.productChargesItemName, // 明细收费项
          expenseType: val.expenseType, // 收费类型
          unitPrice: val.unitPrice / 100, // 单价/收费比例
          unitPriceUnit: val.unitPriceUnit, // 单价/收费比例类型
          billingUnit: val.billingUnit, // 单价单位
          id: val.id
        }

        this.isAdd = false
      } else {
        this.form = {
          productChargesName: '', // 产品名称
          productChargesItemName: '', // 明细收费项
          expenseType: '', // 收费类型
          unitPrice: '', // 单价/收费比例
          unitPriceUnit: '', // 单价/收费比例类型
          billingUnit: '' // 单价单位
        }
        this.isAdd = true
      }
      this.visible = true
    },
    // 关闭弹窗
    closeDialog() {
      this.visible = false
      this.loading = false
      this.$nextTick(() => {
        this.$refs.dialogFormRef.resetFields()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  max-height: 600px;
  height: auto;
  padding: 20px;
  overflow-y: auto;
  .dialogForm {
    width: 100%;
    .mb25 {
      margin-bottom: 25px;
    }
    .w515 {
      width: 515px;
    }
    .w350 {
      width: 350px;
    }
    .w365 {
      width: 365px;
    }
    .w100 {
      width: 100%;
      &.flex {
        display: inline-flex !important;
        ::v-deep .el-form-item__content {
          flex: 1;
        }
      }
    }
    .title {
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      padding-left: 11px;
      text-align: left;
      position: relative;

      &::before {
        content: '';
        height: 100%;
        width: 2px;
        background: #0c6fff;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .desc {
      color: #c2c6ce;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
      padding: 10px 0 2px 0;
      /* position: absolute;
      bottom: 0;
      left: 0; */
    }
    ::v-deep .el-form-item__label {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
  .type-cnt {
    height: auto;
    flex-shrink: 0;
    border-radius: 8px;
    border: 1px solid #dcdee1;
    background: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    padding: 20px 20px 0 20px;
    height: auto;
    .type-title {
      color: #000000;
      text-align: center;
      font-family: 'Microsoft YaHei';
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px;
      padding: 0 20px 15px 0;
      text-align: left;
      position: relative;
    }
    .pt15 {
      padding-top: 15px;
    }
    .bt1 {
      border-top: 1px solid #dcdee1;
    }
    .settlement-txt {
      color: rgb(0, 0, 0);
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
      margin-right: 16px;
    }
    .desc {
      color: rgb(119, 119, 119);
      font-size: 14px;
      line-height: 32px;
      margin-left: 20px;
    }
    .unit {
      color: #000000;
      font-size: 14px;
      margin-left: 4px;
    }
  }
}
::v-deep {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  .fy-price {
    margin-right: 5px;
    .el-input {
      width: calc(100% - 15px);
    }
  }
}
</style>
