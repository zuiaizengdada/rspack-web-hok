<template>
  <el-form
    ref="formAssets"
    v-loading="loading"
    :model="formAssets"
    size="small"
    :rules="rules"
    inline
    label-width="160px"
    label-position="right"
  >
    <div class="form-assets">
      <h4 class="item-title">基本信息</h4>
      <el-form-item label="资产名称" prop="assetName" class="is-required">
        <el-input
          v-model="formAssets.assetName"
          placeholder="请输入资产名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="资产类型" prop="assetType">
        <el-select
          v-model="formAssets.assetType"
          placeholder="请选择资产类型"
          clearable
          @change="handleChangeAssetType"
        >
          <el-option
            v-for="item in assetTypeOptions"
            :key="item.id"
            :value="item.id"
            :label="item.typeName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="资产编号" prop="assetCode" class="is-required">
        <el-input
          v-model="formAssets.assetCode"
          placeholder="请输入资产编号"
          clearable
        />
      </el-form-item>
      <el-form-item label="资产子类型" prop="assetSubtype">
        <el-select
          v-model="formAssets.assetSubtype"
          placeholder="请选择资产子类型"
          clearable
        >
          <el-option
            v-for="item in assetSubTypeOptions"
            :key="item.id"
            :value="item.id"
            :label="item.typeName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原资产编号" prop="originalAssetCode">
        <el-input
          v-model="formAssets.originalAssetCode"
          placeholder="请输入原资产编号"
          clearable
        />
      </el-form-item>
      <el-form-item label="配置" prop="configuration">
        <el-input
          v-model="formAssets.configuration"
          placeholder="请输入配置"
          clearable
        />
      </el-form-item>
      <el-form-item label="规格/型号" prop="specification">
        <el-input
          v-model="formAssets.specification"
          placeholder="请输入规格/型号"
          clearable
        />
      </el-form-item>
      <el-form-item label="数量" prop="number" class="is-required">
        <el-input
          v-model="formAssets.number"
          placeholder="请输入数量"
          clearable
          @input="e => delNumber(e, 'number')"
        >
          <el-select
            slot="append"
            v-model="formAssets.unit"
            placeholder="请选择"
            class="item-unit"
          >
            <el-option
              v-for="item in constantsUnitList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-input>
      </el-form-item>
      <h4 class="item-title">购置信息</h4>
      <el-form-item label="购置日期" prop="purchaseDate">
        <el-date-picker
          v-model="formAssets.purchaseDate"
          clearable
          :picker-options="purchaseDateOptions"
          placeholder="请选择购置日期"
        />
      </el-form-item>
      <el-form-item
        label="可使用时长"
        prop="usableDuration"
        class="is-required"
      >
        <el-input
          v-model="formAssets.usableDuration"
          placeholder="请输入可使用时长"
          clearable
          @input="e => delNumber(e, 'usableDuration')"
        >
          <template slot="append">月</template>
        </el-input>
      </el-form-item>
      <el-form-item label="购置渠道" prop="purchaseChannel">
        <el-input
          v-model="formAssets.purchaseChannel"
          clearable
          placeholder="请输入购置渠道"
        />
      </el-form-item>
      <el-form-item label="折旧公式" prop="depreciationFormula">
        <el-select v-model="formAssets.depreciationFormula">
          <el-option
            v-for="item in depreciationFormulaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="购置编号" prop="purchaseCode">
        <el-input
          v-model="formAssets.purchaseCode"
          placeholder="请输入购置编号"
          clearable
        />
      </el-form-item>
      <el-form-item label="购置金额" prop="purchaseMoney" class="is-required">
        <el-input
          v-model="formAssets.purchaseMoney"
          placeholder="请输入购置金额"
          clearable
          @input="e => delNumber(e, 'purchaseMoney')"
        />
      </el-form-item>
      <el-form-item label="购置人" prop="purchaseUserId">
        <el-select
          v-model="formAssets.purchaseUserId"
          filterable
          clearable
          placeholder="请输入购置人"
          remote
          :remote-method="remoteMethodPurchaseUser"
          @change="handleChangePurchaseUser"
        >
          <el-option
            v-for="item in purchaseUserOptions"
            :key="item.userId"
            :label="`${item.nickName} (${item.deptName})`"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="折旧后金额" prop="depreciationMoney">
        <el-input :value="formAssets.depreciationMoney" disabled />
      </el-form-item>
      <h4 class="item-title">使用信息</h4>
      <el-form-item label="使用状态" prop="state">
        <el-select
          v-model="formAssets.state"
          clearable
          placeholder="请选择使用状态"
          @change="changeHandleState"
        >
          <el-option
            v-for="item in userStatusList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formAssets.state !== 6"
        :required="formAssets.state === 1"
        label="使用人"
        prop="occupantUserId"
      >
        <el-select
          v-model="formAssets.occupantUserId"
          placeholder="请输入使用人"
          filterable
          remote
          clearable
          :remote-method="remoteMethodOccupantUser"
          @change="changeHandleoccupantUser"
        >
          <el-option
            v-for="item in occupantUserOptions"
            :key="item.userId"
            :label="`${item.nickName} (${item.deptName})`"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="原使用人" prop="originalOccupantUserId">
        <el-select
          v-model="formAssets.originalOccupantUserId"
          filterable
          placeholder="请输入原使用人"
          clearable
          remote
          :remote-method="remoteMethodOriginalOccupantUser"
          @change="changeHandleOriginalOccupantUser"
        >
          <el-option
            v-for="item in originalOccupantUserOptions"
            :key="item.userId"
            :label="`${item.nickName} (${item.deptName})`"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formAssets.state !== 6" label="使用人编号">
        <el-input v-model="formAssets.occupantUserId" disabled />
      </el-form-item>
      <el-form-item label="资产使用/存放城市" prop="addressArr">
        <AppAreaSelect
          ref="cascader"
          v-model="formAssets.addressArr"
          :maxlevel="1"
          @change="handleChangeCity"
        />
      </el-form-item>
      <el-form-item label="资产使用/存放详细地点" prop="assetLocation">
        <el-input
          v-model="formAssets.assetLocation"
          type="textarea"
          clearable
          placeholder="请输入资产使用/存放详细地点"
          :autosize="{ minRows: 2, maxRows: 5 }"
        />
      </el-form-item>
      <el-form-item
        v-if="formAssets.state !== 6"
        label="使用部门"
        prop="occupantDeptName"
      >
        <el-input v-model="formAssets.occupantDeptName" disabled />
      </el-form-item>

      <h4 class="item-title">其他信息</h4>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formAssets.remark"
          type="textarea"
          clearable
          placeholder="请输入备注"
          :autosize="{ minRows: 2, maxRows: 5 }"
        />
      </el-form-item>
    </div>
    <div class="flex justify-end" style="width: 100%; padding-top: 18px">
      <el-button size="small" :loading="loading" @click="handleClickCancel"
        >取消</el-button
      >
      <el-button
        size="small"
        :loading="loading"
        type="primary"
        @click="handleClickSubmit"
        >确定</el-button
      >
    </div>
  </el-form>
</template>
<script>
import moment from 'moment'
import { constantsUnitList } from './constantsUnitList'
import { userStatus, userGoodStatus } from '../../constants'
import { assetTypeList } from '../../../api/assets.js'
import { userNoPage } from '@/api/addressBookApi'
import AppAreaSelect from '@/components/AppTemplate/AppAreaSelect/index'

export default {
  components: { AppAreaSelect },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const validOccupantUserName = (rule, value, callback) => {
      if (this.formAssets.state === 1) {
        if (!value) {
          callback(new Error('请选择使用人'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      constantsUnitList,
      formAssets: {
        assetCode: '', // 资产编号
        assetLocation: '', // 资产使用/存放地点
        assetName: '', // 资产名称
        originalAssetCode: '', // 原资产编号
        specification: '', // 规格/型号
        assetType: '', // 资产类型ID
        assetSubtype: '', // 资产子类型ID
        configuration: '', // 配置
        unit: '台', // 单位
        number: '', // 数量
        purchaseChannel: '', // 购置渠道
        purchaseCode: '', // 购置编号
        purchaseUserId: '', // 购置人ID
        purchaseUserName: '', // 购置人名称
        purchaseDate: '', // 购置日期
        depreciationFormula: '年限法', // 折旧公式
        occupantDeptName: '', // 使用部门名称
        usableDuration: '', // 可使用时长(单位/月)
        purchaseMoney: '', // 购置金额
        depreciationMoney: '', // 折旧后金额
        state: '', // 使用状态：1-良好，2-闲置，3-报废，4-损坏未废，5-丢失，6-闲置无归属，7-丢失已赔偿
        occupantDeptId: '', // 使用部门ID
        occupantUserId: '', // 使用人编号
        occupantUserName: '', //  使用人
        originalOccupantUserId: '', // 原使用人ID
        originalOccupantUserName: '', // 原使用人名称
        remark: '', // 备注
        addressArr: [],
        provinceCode: '',
        cityCode: '',
        cityName: '',
        provinceName: ''
      },
      rules: {
        assetName: [
          {
            trigger: 'change',
            validator: (rule, value, callback) =>
              this.validateWords2(rule, value, callback, '资产名称')
          }
        ],
        assetCode: [
          {
            trigger: 'change',
            validator: (rule, value, callback) =>
              this.validateWords2(rule, value, callback, '资产编号')
          }
        ],
        originalAssetCode: [
          {
            trigger: 'change',
            validator: (rule, value, callback) =>
              this.validateWords2(rule, value, callback)
          }
        ],
        number: [
          {
            trigger: 'change',
            validator: (rule, value, callback) =>
              this.validateWords2(rule, value, callback, '数量')
          }
        ],
        usableDuration: [
          {
            trigger: 'change',
            validator: (rule, value, callback) =>
              this.validateWords2(rule, value, callback, '可使用时长')
          }
        ],
        // purchaseCode: [
        //   {
        //     trigger: 'change',
        //     validator: (rule, value, callback) =>
        //       this.validateWords2(rule, value, callback, '购置编号')
        //   }
        // ],
        specification: [
          {
            trigger: 'change',
            validator: this.validateWords
          }
        ],
        configuration: [
          {
            trigger: 'change',
            validator: this.validateWords
          }
        ],
        purchaseChannel: [
          {
            trigger: 'change',
            validator: this.validateWords
          }
        ],
        assetLocation: [
          {
            trigger: 'change',
            validator: this.validateWords
          }
        ],
        remark: [
          {
            trigger: 'change',
            validator: this.validateWords
          }
        ],
        assetType: [
          { required: true, message: '请选择资产类型', trigger: 'change' }
        ],
        assetSubtype: [
          { required: true, message: '请选择资产子类型', trigger: 'change' }
        ],
        purchaseDate: [
          {
            type: 'date',
            required: true,
            message: '请选择购置日期',
            trigger: 'change'
          }
        ],
        purchaseUserId: [
          { required: true, message: '请输入购置人', trigger: 'change' }
        ],
        depreciationFormula: [
          { required: true, message: '请选择折旧公式', trigger: 'change' }
        ],

        state: [
          { required: true, message: '请选择使用状态', trigger: 'change' }
        ],
        // occupantUserName: [
        //   { required: true, message: '请输入使用人', trigger: 'change' }
        // ],
        occupantDeptId: [
          { required: true, message: '请输入使用部门', trigger: 'change' }
        ],
        addressArr: [
          {
            required: true,
            message: '请选择资产使用/存放城市',
            trigger: 'change'
          }
        ],
        occupantUserId: [
          {
            trigger: 'change',
            validator: validOccupantUserName
          }
        ]
      },
      depreciationFormulaOptions: [{ label: '年限法', value: 0 }],
      assetTypeOptions: [],
      assetSubTypeOptions: [],
      userStatusList: [],
      userGoodStatus,
      userStatus,
      purchaseUserOptions: [],
      occupantUserOptions: [],
      originalOccupantUserOptions: [],
      loading: false,
      purchaseDateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    depreciationMoney() {
      const { purchaseDate, usableDuration, purchaseMoney } = this.formAssets
      if (!purchaseMoney) {
        return ''
      }
      if (!purchaseDate || !usableDuration) {
        return Math.max(0, purchaseMoney).toFixed(2)
      }
      const start = moment(purchaseDate)
      const end = moment() // 当前日期
      const monthDiff =
        (end.year() - start.year()) * 12 + end.month() - start.month()
      // if (now.isSame(moment(purchaseDate), 'month')) {
      //   // 如果是同一个月份，说明还没过去一个完整月，已使用时长为0
      //   monthDiff = 0
      // }
      console.log(start.year(), end.year(), end.month(), start.month())
      console.log(purchaseMoney, purchaseMoney, usableDuration, monthDiff)
      const money = purchaseMoney - (purchaseMoney / usableDuration) * monthDiff

      return Math.max(0, money).toFixed(2)
    }
  },
  watch: {
    depreciationMoney: {
      handler(val) {
        this.formAssets.depreciationMoney = val
      },
      deep: true
    }
  },
  mounted() {
    this.loading = false
    this.userStatusList = this.userGoodStatus
    if (this.form.assetId !== null && this.form.assetId !== undefined) {
      // 编辑
      this.formAssets = {
        ...this.form,
        addressArr: this.form.provinceName
          ? [this.form.provinceName, this.form.cityName]
          : []
      }
      this.userStatusList = this.userStatus
      this.setAllUserList()
      // 获取子资产选项
      this.queryAssetTypeList().then(() => {
        this.findAssetType(this.formAssets.assetType)
      })
    } else {
      // 新增
      this.queryAssetTypeList()
    }
  },
  methods: {
    handleChangeCity(value) {
      if (value.length === 0) return
      const options = this.$refs.cascader?.$refs.cascader?.options
      const parent = options.find(option => option.value === value[0])
      const current = parent.children.find(option => option.value === value[1])
      this.formAssets.cityCode = current.id
      this.formAssets.provinceCode = parent.id
    },
    changeHandleState(val) {
      this.$nextTick(() => {
        this.$refs.formAssets.validateField('occupantUserId')
      })
    },
    validateWords(rule, value, callback) {
      if (value.length > 100) {
        callback(new Error('超过最大限制字数100'))
      } else {
        callback()
      }
    },
    validateWords2(rule, value, callback, msg) {
      console.log(msg)
      if (value.length > 30) {
        callback(new Error('超过最大限制字数30'))
      } else if (msg && !value) {
        callback(new Error(`请输入${msg}`))
      } else {
        callback()
      }
    },
    // 只输入数字 0不保存
    delNumber(e, key) {
      if (e === '') {
        this.formAssets[key] = ''
        return
      }
      if (Number(e) < 1) {
        this.formAssets[key] = 1
        return
      }
      this.formAssets[key] = e.replace(/[^0-9]/g, '')
    },
    // 设置所有user option
    setAllUserList() {
      userNoPage().then(res => {
        if (res.code === 1) {
          this.originalOccupantUserOptions = res.data
        }
      })
      // 在职的
      userNoPage().then(res => {
        if (res.code === 1) {
          this.purchaseUserOptions = res.data
          this.occupantUserOptions = res.data
          if (this.form.occupantUserId) {
            this.changeHandleoccupantUser(this.form.occupantUserId)
          }
        }
      })
    },
    // 获取资产类型
    queryAssetTypeList() {
      return assetTypeList().then(res => {
        if (res.code === 1) {
          this.assetTypeOptions = res.data
        }
      })
    },
    // 获取子资产选项
    findAssetType(val) {
      let list = []
      this.assetTypeOptions.forEach(item => {
        if (item.id === val) {
          list = item.children
        }
      })
      this.assetSubTypeOptions = list
    },
    handleChangeAssetType(val) {
      this.formAssets.assetSubtype = undefined
      // 清空指定字段的验证信息
      // this.$refs.formAssets.clearValidate(['assetSubtype'])
      this.findAssetType(val)
    },
    async remoteMethodPurchaseUser(query) {
      // status 0 查在职人员
      const res = await userNoPage({ nickName: query, status: 0 })
      this.purchaseUserOptions = res.data
    },
    handleChangePurchaseUser(val) {
      const obj =
        this.purchaseUserOptions.find(item => item.userId === val) || {}
      this.formAssets.purchaseUserName = obj.nickName
    },
    handleChangePurchaseMoney(val) {
      const usableDuration = this.formAssets.usableDuration
      const purchaseDate = this.formAssets.purchaseDate
      const purchaseMoney = Number(val)
      if (usableDuration && purchaseDate) {
        const now = moment()
        const monthDiff = now.diff(moment(purchaseDate), 'months')
        const money =
          purchaseMoney - (purchaseMoney / usableDuration) * monthDiff
        this.formAssets.depreciationMoney = money
      }
      // 折旧后金额=购置金额-{(购置金额/可使用时长)*已使用时长}
    },
    async remoteMethodOccupantUser(query) {
      const res = await userNoPage({ nickName: query })
      this.occupantUserOptions = res.data
    },
    changeHandleoccupantUser(val) {
      const obj =
        this.occupantUserOptions.find(item => item.userId === val) || {}
      this.formAssets.occupantDeptId = obj.deptId
      this.formAssets.occupantDeptName = obj.deptName
      this.formAssets.occupantUserName = obj.nickName
    },
    async remoteMethodOriginalOccupantUser(query) {
      const res = await userNoPage({ nickName: query })
      this.originalOccupantUserOptions = res.data
    },
    changeHandleOriginalOccupantUser(value) {
      const obj =
        this.originalOccupantUserOptions.find(item => item.userId === value) ||
        {}
      this.formAssets.originalOccupantUserName = obj?.nickName
    },
    handleClickCancel() {
      this.$refs.formAssets.resetFields()
      this.$emit('cancel')
    },
    handleClickSubmit() {
      this.$refs.formAssets.validate(valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.formAssets))
          const addressArr = form.addressArr
          if (addressArr.length) {
            form.provinceName = addressArr[0]
            form.cityName = addressArr[1]
          }
          delete form.addressArr
          form.purchaseDate = moment(form.purchaseDate).format('YYYY-MM-DD')
          this.loading = true
          this.$emit('submit', {
            form,
            success: () => {
              this.loading = false
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-select,
::v-deep .el-date-editor,
::v-deep .el-input,
::v-deep .el-textarea {
  width: 240px !important;
}
::v-deep .item-unit.el-select {
  width: 60px !important;
}
::v-deep .item-unit .el-input {
  width: 60px !important;
}
.form-assets {
  height: 600px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.item-title {
  padding-left: 20px;
  font-size: 16px;
  color: #333;
  line-height: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}
</style>
