<template>
  <!-- 新增规则弹框 -->
  <AppDialog
    v-model="visible"
    title="收费项新增"
    width="783px"
    :loading="loading"
    height="auto"
    @success="sure"
    @close="closeDialog"
  >
    <div class="dialog">
      <el-form
        ref="dialogRef"
        class="dialogForm"
        :inline="true"
        label-position="left"
        :model="form"
        :rules="rules"
      >
        <div class="title mt25 mb25">机构选择</div>
        <el-form-item label="机构名称" label-width="100px" prop="tenantId">
          <el-select
            v-model="form.tenantId"
            placeholder="请选择机构"
            class="w515"
            clearable
            @change="validateTime"
          >
            <el-option
              v-for="item in options.tenantIdList"
              :key="item.organizationId"
              :label="item.name"
              :value="item.organizationId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.billCycle"
          label-width="100px"
          label="账单月份"
          prop="billCycle"
        >
          <el-select
            v-model="form.billCycle"
            placeholder="请选择账单月份"
            class="w515"
          >
            <el-option
              v-for="item in billCycleList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <div class="title mt25 mb25">费用内容</div>
        <el-form-item label="明细收费项" label-width="100px" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择收费项"
            class="w515"
            clearable
            @change="typeChange"
          >
            <el-option
              v-for="item in options.typeList"
              :key="item.productChargesItemNo"
              :label="item.productChargesItemName"
              :value="item.productChargesItemNo"
            />
          </el-select>
        </el-form-item>
        <!-- 收费项具体弹窗 -->
        <template v-if="chargesInfo.fileList.length && form.type">
          <div class="type-cnt">
            <div class="type-title">{{ chargesInfo.name }}</div>
            <div class="flex flex-between flex-wrap">
              <el-form-item
                v-for="item in chargesInfo.fileList"
                :key="item.prop"
                :label="item.label"
                :label-width="item.labelWidth || '100px'"
                :prop="item.prop"
                :class="item.classArr || []"
              >
                <template v-if="item.slotName">
                  <PhoneForm
                    v-if="visible"
                    ref="phonesRef"
                    :title="item.label"
                  />
                </template>
                <component
                  :is="item.cpn"
                  v-else
                  v-model.trim="form[item.prop]"
                  :placeholder="formatPlaceholder(item)"
                  filterable
                  clearable
                  v-bind="{ ...(item.bind || {}) }"
                />
              </el-form-item>
            </div>
            <div class="flex flex-between bt1 pt15">
              <div class="flex relative">
                <el-form-item
                  label="费用凭证"
                  label-width="100px"
                  prop="voucherUrl"
                >
                  <UploadFile @change="voucherUrlChange" />
                </el-form-item>
                <!-- <div class="desc">
                  只能上传.pdf,.jpg,.png,.jpeg格式文件,大小不能超过20M
                </div> -->
              </div>
              <el-form-item
                label="费用金额"
                label-width="100px"
                class="flex fy-price"
                prop="chargesAmount"
              >
                <el-input
                  v-model="form.chargesAmount"
                  type="number"
                  placeholder="请输入费用金额"
                  clearable
                >
                  <span slot="prefix" class="unit">￥</span>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </template>
      </el-form>
    </div>
    <div slot="footer" class="ss-material-box-bottom">
      <el-button size="small" type="primary" @click="sure"> 确认 </el-button>
      <el-button size="small" @click="closeDialog"> 取消 </el-button>
    </div>
  </AppDialog>
</template>

<script>
import { cloneDeep } from 'lodash'
import moment from 'moment'
import AppDialog from '@/components/AppDialog'
import UploadFile from '@/views/orgMgt/orgSettlement/billingCenter/settlement/cpns/uploadFile.vue'
import PhoneForm from './phoneTp.vue'

import {
  listOrganizationByParamApi,
  getAwaitingPaymentBillCycleApi,
  listManualChargesItemApi
} from '@/api/orgSettlement/billingCenter.js'
import { serviceFees } from '../../data.js'
import { codeTransAPpi } from '@/views/orgMgt/orgSettlement/billingCenter/usageDetails/data.js'

export default {
  components: {
    AppDialog,
    UploadFile,
    PhoneForm
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: cloneDeep(serviceFees.addForm),
      rules: cloneDeep(serviceFees.addrules),
      options: {
        tenantIdList: [],
        typeList: []
      },
      chargesInfo: {
        rules: {},
        fileList: [],
        name: ''
      },
      fileList: [],
      billCycleList: [],
      typeName: '',
      apiFn: null
    }
  },
  methods: {
    // codeTransAPpi
    async sure() {
      // 有账号相关 需要单独验证
      const flag = await this.phoneVlidator()
      if (!flag) return
      this.$refs.dialogRef.validate(async valid => {
        if (valid) {
          this.loading = true
          const req = cloneDeep(this.form)
          delete req.type
          if (req.openTime) {
            req.openTime = moment(req.openTime).format('YYYY-MM-DD')
          }
          if (req.billCycle) {
            req.billCycle = req.billCycle + '-01'
          }
          if (req.chargesAmount) {
            req.chargesAmount = Number(req.chargesAmount) * 100
          }
          // 自定义收费项需要传递productChargesItemNo
          if (this.form.type.includes('CUSTOM')) {
            req.productChargesItemNo = this.form.type
          }
          try {
            const { success } = await this.apiFn(req)
            if (success) {
              this.$message.success('新增成功')
              this.$emit('search')
              this.closeDialog()
            }
          } catch (error) {
            console.log('serviceFees-add--------error', error)
          }
          this.loading = true
        }
      })
    },
    // 手机账号相关的验证
    async phoneVlidator() {
      if (this.$refs.phonesRef && this.$refs.phonesRef[0]) {
        const phonesRefDom = this.$refs.phonesRef[0]
        phonesRefDom?.clearValidate()
        const arr = await phonesRefDom.getPhoneForm()
        if (arr && arr.length > 0) {
          this.$set(this.form, 'phones', arr.join(','))
        } else {
          this.$set(this.form, 'phones', '')
          return false
        }
      }
      return true
    },
    // 收费项类型添加
    // 判断当前收费项是否已存在 有历史数据
    async typeChange(key) {
      if (!this.form.billCycle) {
        this.$message.error('请先选择机构')
        this.form.type = undefined
        return
      }
      console.log('typeChange', key)
      this.chargesInfo = { rules: {}, fileList: [], name: '' }
      if (key) {
        try {
          const req = {
            billCycle: this.form.billCycle + '-01',
            tenantId: this.form.tenantId
          }
          const curItem = ''
          // 如果是自定义项收费项 特殊处理 使用CUSTOM获取相关接口
          if (key.includes('CUSTOM')) {
            const curItem = this.options.typeList.find(
              f => f.productChargesItemNo === key
            )
            req['productChargesId'] = curItem.productChargesId
            key = 'CUSTOM'
          }
          const { data } = await codeTransAPpi[key].api.detail(req)
          if (data) {
            this.form.type = undefined
            this.typeCheckInit(key)
            this.$message.error('该收费项已存在，请勿重复录入')
            return
          }
          this.apiFn = codeTransAPpi[key].api.add
          this.typeCheckInit(key, curItem)
        } catch (error) {
          this.form.type = undefined
          this.$message.error(error)
          return
        }
      } else {
        this.emptyCheck()
      }
    },
    // 切换收费项 初始化所需要的值
    typeCheckInit(key, item = {}) {
      this.emptyCheck()
      // this.chargesInfo = cloneDeep(serviceFees.codetranfer[key])
      const { rules, fileList, name } = cloneDeep(serviceFees.codetranfer[key])
      this.$set(this.chargesInfo, 'name', key === 'CUSTOM' ? item.productChargesItemName : name)
      this.$set(this.chargesInfo, 'fileList', fileList)
      this.$set(this.chargesInfo, 'rules', rules)
      Object.entries(this.chargesInfo.rules || {}).forEach(([key, value]) => {
        this.rules[key] = value
      })
      Object.entries(this.chargesInfo.form || {}).forEach(([key, value]) => {
        this.form[key] = value
      })
      this.$refs.dialogRef.validateField('type')
    },
    // 清空非基础form数值
    emptyCheck() {
      const arr = [
        'tenantId',
        'billCycle',
        'type',
        'voucherUrl',
        'chargesAmount'
      ]
      Object.keys(this.form).forEach(key => {
        if (!arr.includes(key)) delete this.form[key]
      })
      this.$set(this.form, 'chargesAmount', '')
      this.$set(this.form, 'voucherUrl', '')
      this.chargesInfo = { rules: {}, fileList: [], name: '' }
      Object.keys(this.rules).forEach(key => {
        if (!arr.includes(key)) delete this.rules[key]
      })
    },
    // 验证是否又可选日期
    validateTime(tenantId) {
      this.form.type = undefined
      this.emptyCheck()
      if (!tenantId) {
        this.form.billCycle = ''
        this.form.tenantId = ''
        return
      }
      getAwaitingPaymentBillCycleApi({ tenantId }).then(res => {
        if (res.data && res.data.length) {
          const list = res.data.map(m => {
            const arr = m.split('-')
            arr.length -= 1
            return arr.join('-')
          })
          this.billCycleList = list || []
          this.form.billCycle = this.billCycleList[0]
        } else {
          this.form.billCycle = ''
          this.billCycleList = []
          this.form.tenantId = ''
          this.$message.error('该机构无待制单账单')
        }
      })
      this.$refs.dialogRef.validateField('tenantId')
    },
    // 打开弹窗
    openDialog() {
      this.getOption()
      this.visible = true
    },
    // 关闭弹窗
    closeDialog() {
      this.$refs.dialogRef.resetFields()
      this.form = cloneDeep(serviceFees.addForm)
      this.chargesInfo = { rules: {}, fileList: [], name: '' }

      this.visible = false
      this.loading = false
    },
    // 获取option
    getOption() {
      listOrganizationByParamApi({ isDeleted: 0, isInPlatform: false }).then(
        res => {
          this.options.tenantIdList = res.data
        }
      )
      listManualChargesItemApi().then(res => {
        this.options.typeList = res.data
      })
    },
    // placeholder转换
    formatPlaceholder(field) {
      if (field.placeholder) {
        return field.placeholder
      } else {
        let txt = ''
        switch (field.cpn) {
          case 'el-input':
            txt = '请输入' + field.label
            break
          case 'el-select':
            txt = '请选择' + field.label
            break
          case 'el-cascader':
            txt = '请选择' + field.label
            break
          case 'el-date-picker':
            txt = '请选择' + field.label
            break
          default:
            break
        }
        return txt
      }
    },
    voucherUrlChange(value) {
      this.$set(this.form, 'voucherUrl', value[0].url)
      this.$nextTick(() => {
        this.$refs.dialogRef.validateField('voucherUrl')
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
    .w206 {
      width: 206px;
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
