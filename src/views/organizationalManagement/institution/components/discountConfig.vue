<template>
  <div class="discount-config">
    <div class="discount-config-cnt">
      <el-form
        ref="discountRef"
        class="discountForm"
        label-position="right"
        label-width="140px"
        size="mini"
        :model="form"
        :rules="rules"
      >
        <div class="title pt-20">账号配置</div>
        <el-form-item label="结算周期：" prop="payPeriod">
          <!-- <el-input v-model="form.teacherName" /> -->
          <el-radio-group v-model="form.payPeriod">
            <el-radio
              v-for="(item, index) in options.payPeriod"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开通账号：" prop="accountNum">
          <el-input
            v-model="form.accountNum"
            style="width: 324px"
            type="number"
            placeholder="根据起止日期，自动计算"
          >
            <template slot="append">个</template>
          </el-input>
          <div class="desc">输入账号数是企业当前同时启用账号</div>
        </el-form-item>
        <el-form-item label="优惠折扣：" prop="accountDiscount">
          <el-input
            v-model="form.accountDiscount"
            style="width: 324px"
            type="number"
            placeholder="根据起止日期，自动计算"
          >
            <template slot="append">折</template>
          </el-input>
          <div class="desc">
            折扣比例默认不打折，10.00代表不打折，只能输入0.00~10.00之间数字
          </div>
        </el-form-item>
        <div class="title">公域成交</div>
        <el-form-item label="优惠折扣：" prop="developMini">
          <div class="list">
            <div>代开发独立小程序履约</div>
            <div
              v-for="(item, index) in form.developMini"
              :key="index"
              class="flex item"
            >
              <el-input
                v-model.number="item.stepStartPrice"
                type="number"
                placeholder="请输入"
                class="w100 mr-10"
              />-
              <el-input
                v-model.number="item.stepEndPrice"
                type="number"
                placeholder="请输入"
                class="w100 mr-10 ml-10"
              />万<el-input
                v-model.number="item.ratio"
                type="number"
                placeholder="请输入"
                class="w100 mr-10 ml-10"
              />%
              <i
                v-if="index !== 0"
                class="el-icon-close close"
                @click="delItem(1, index)"
              />
            </div>
            <el-button type="text" @click="addItem(1)">添加规则</el-button>
          </div>
        </el-form-item>
        <el-form-item label="" prop="hokMini">
          <div class="list">
            <div>获课平台小程序履约</div>
            <div
              v-for="(item, index) in form.hokMini"
              :key="index"
              class="flex item"
            >
              <el-input
                v-model.number="item.stepStartPrice"
                type="number"
                placeholder="请输入"
                class="w100 mr-10"
              />-
              <el-input
                v-model.number="item.stepEndPrice"
                type="number"
                placeholder="请输入"
                class="w100 mr-10 ml-10"
              />万
              <el-input
                v-model.number="item.ratio"
                type="number"
                placeholder="请输入"
                class="w100 mr-10 ml-10"
              />%
              <i
                v-if="index !== 0"
                class="el-icon-close close"
                @click="delItem(2, index)"
              />
            </div>
            <el-button type="text" @click="addItem(2)">添加规则</el-button>
          </div>
          <div class="desc flex lh-20">
            <div>注</div>
            <div class="ml-10">
              1、以上为默认规则，各机构可以进行修改 <br />
              2、最后规则结束框不填写，代表无上限，比如：1000万以上<br />
              3、第一个规则开始值必须为 0<br />
            </div>
          </div>
        </el-form-item>
        <div class="title">私域成交</div>
        <el-form-item label="收费规则：" prop="stepPrices">
          <div class="list">
            <div
              v-for="(item, index) in form.stepPrices"
              :key="index"
              class="flex item"
            >
              <el-input
                v-model.number="item.stepStartPrice"
                type="number"
                placeholder="请输入"
                class="w100 mr-10"
              />-
              <el-input
                v-model.number="item.stepEndPrice"
                type="number"
                placeholder="请输入"
                class="w100 mr-10 ml-10"
              />万
              <el-input
                v-model.number="item.ratio"
                type="number"
                placeholder="请输入"
                class="w100 mr-10 ml-10"
              />%
              <i
                v-if="index !== 0"
                class="el-icon-close close"
                @click="delItem(3, index)"
              />
            </div>
            <el-button type="text" @click="addItem(3)">添加规则</el-button>
            <div class="desc">
              默认规则按私域GMV成交比例2%收费，可按机构设置
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="discount-config-btn">
      <el-button type="primary" @click="saveFn">保存</el-button>
    </div>
  </div>
</template>
<script>
import {
  tenantBillGetApi,
  tenantBillUpdApi
} from '@/api/organization/settings.js'
import Decimal from 'decimal.js'
export default {
  props: {
    tenantId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    const validatorCommon = {
      validator: (rule, value, callback) => {
        // 验证第一行的 stepStartPrice 必须是 0
        if (value[0].stepStartPrice !== 0) {
          callback(new Error('第一行的 开始项 必须是 0'))
          return
        }
        // 验证 stepEndPrice 必须大于 stepStartPrice
        for (let i = 0; i < value.length; i++) {
          if (
            value[i].stepEndPrice &&
            value[i].stepEndPrice <= value[i].stepStartPrice
          ) {
            callback(new Error(`第 ${i + 1} 行的 结束项 必须大于 开始项`))
            return
          }
          if (typeof value[i].stepStartPrice !== 'number') {
            callback(new Error(`第 ${i + 1} 行的开始项不能为空`))
            return
          }
          if (
            i !== value.length - 1 &&
            typeof value[i].stepEndPrice !== 'number'
          ) {
            callback(new Error(`第 ${i + 1} 行的结束项不能为空`))
            return
          }
          if (
            value[i].stepEndPrice &&
            !/^\d+(\.\d{1,2})?$/.test(value[i].stepEndPrice)
          ) {
            callback(new Error('开始项最多只能有两位小数'))
            return
          }
          if (
            value[i].stepStartPrice &&
            !/^\d+(\.\d{1,2})?$/.test(value[i].stepStartPrice)
          ) {
            callback(new Error('结束项最多只能有两位小数'))
            return
          }
          if (value[i].ratio && !/^\d+(\.\d{1,2})?$/.test(value[i].ratio)) {
            callback(new Error('比例最多只能有两位小数'))
            return
          }
          if (
            i === value.length - 1 &&
            typeof value[i].stepEndPrice === 'number'
          ) {
            callback(new Error(`最后规则结束框不填写`))
            return
          }
          if (typeof value[i].ratio !== 'number') {
            callback(new Error(`第 ${i + 1} 行的 比例不能为空`))
            return
          }
          if (value[i].ratio < 0) {
            callback(new Error(`第 ${i + 1} 行的 比例不能小于0`))
            return
          }
          // 验证 stepEndPrice 与下一项的 stepStartPrice 必须相等
          if (
            i < value.length - 1 &&
            value[i].stepEndPrice !== value[i + 1].stepStartPrice
          ) {
            callback(
              new Error(`第 ${i + 1} 行的 结束项必须等于下一行的 开始项`)
            )
            return
          }
        }
        // 验证 stepStartPrice 到 stepEndPrice 的值区间不能重合
        const ranges = value.map(item => [
          item.stepStartPrice,
          item.stepEndPrice
        ])
        for (let i = 0; i < ranges.length; i++) {
          for (let j = i + 1; j < ranges.length; j++) {
            const endPriceJ = ranges[j][1] === '' ? Infinity : ranges[j][1]
            if (ranges[i][0] < endPriceJ && ranges[j][0] < ranges[i][1]) {
              callback(new Error(`第 ${i + 1} 行和第 ${j + 1} 行的区间重合`))
              return
            }
          }
        }
        callback()
      },
      trigger: 'blur'
    }
    return {
      options: {
        payPeriod: [
          { label: '月付', value: 1 },
          { label: '季付', value: 2 },
          { label: '年付', value: 3 }
        ]
      },
      rules: {
        // payPeriod: [
        //   { required: true, message: '请选择结算周期', trigger: 'change' }
        // ],
        // accountNum: [
        //   { required: true, message: '请输入账号数', trigger: 'blur' }
        // ],
        accountDiscount: [
          // { required: true, message: '请输入优惠折扣', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < 0.0 || value > 10.0) {
                callback(new Error('优惠折扣必须在 0.00 到 10.00 之间'))
              } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                // 添加的验证逻辑
                callback(new Error('优惠折扣最多只能有两位小数'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        stepPrices: [validatorCommon],
        developMini: [validatorCommon],
        hokMini: [validatorCommon]
      },
      form: {
        accountDiscount: '', // 账号优惠折扣
        accountNum: '',
        payPeriod: '', //
        stepPrices: [
          {
            ratio: '',
            stepEndPrice: '',
            stepStartPrice: 0
          }
        ],
        developMini: [
          {
            ratio: '',
            stepEndPrice: '',
            stepStartPrice: 0
          }
        ],
        hokMini: [
          {
            ratio: '',
            stepEndPrice: '',
            stepStartPrice: 0
          }
        ]
        // privateStepRule: {
        //   stepPrices: [
        //     {
        //       ratio: '',
        //       stepEndPrice: '',
        //       stepStartPrice: 0
        //     }
        //   ]
        // },
        // publicStepRule: {
        //   developMini: [
        //     {
        //       ratio: '',
        //       stepEndPrice: '',
        //       stepStartPrice: 0
        //     }
        //   ],
        //   hokMini: [
        //     {
        //       ratio: '',
        //       stepEndPrice: '',
        //       stepStartPrice: 0
        //     }
        //   ]
        // }
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      console.log('this.for----', this.form)
      const res = await tenantBillGetApi({ tenantId: this.tenantId })
      if (res.data) {
        const num = 1 / (10000 * 100)
        this.form = {
          accountDiscount: res.data.accountDiscount, // 账号优惠折扣
          accountNum: res.data.accountNum,
          payPeriod: res.data.payPeriod, //
          stepPrices: this.count(res.data.privateStepRule.stepPrices, num, 100),
          developMini: this.count(
            res.data.publicStepRule.developMini,
            num,
            100
          ),
          hokMini: this.count(res.data.publicStepRule.hokMini, num, 100)
        }
      }
      console.log('this.for----', this.form)
    },
    count(arr, num, num2) {
      console.log('arr----', arr)
      const newArr = arr.map(item => {
        return {
          // ratio: item.ratio * num2,
          // stepEndPrice: item.stepEndPrice * num || '',
          // stepStartPrice: item.stepStartPrice * num
          ratio: Decimal(item.ratio).mul(num2).toNumber(), // 使用 Decimal.js
          stepEndPrice: item.stepEndPrice
            ? Decimal(item.stepEndPrice).mul(num).toNumber()
            : '', // 使用 Decimal.js
          stepStartPrice: Decimal(item.stepStartPrice).mul(num).toNumber() // 使用 Decimal.js
        }
      })
      return newArr
    },
    addItem(num) {
      const obj = {
        ratio: '',
        stepEndPrice: '',
        stepStartPrice: ''
      }
      if (num === 1) {
        this.form.developMini.push(obj)
      } else if (num === 2) {
        this.form.hokMini.push(obj)
      } else if (num === 3) {
        this.form.stepPrices.push(obj)
      }
      console.log(this.form)
    },
    delItem(num, index) {
      if (num === 1) {
        this.form.developMini.splice(index, 1)
        this.$refs.discountRef.validateField('developMini')
      } else if (num === 2) {
        this.form.hokMini.splice(index, 1)
        this.$refs.discountRef.validateField('hokMini')
      } else if (num === 3) {
        this.form.stepPrices.splice(index, 1)
        this.$refs.discountRef.validateField('stepPrices')
      }
    },
    saveFn() {
      this.$refs.discountRef.validate(async valid => {
        if (valid) {
          const { code } = await tenantBillUpdApi({
            payPeriod: this.form.payPeriod,
            accountDiscount: this.form.accountDiscount,
            accountNum: this.form.accountNum,
            tenantId: this.tenantId,
            privateStepRule: {
              stepPrices: this.count(this.form.stepPrices, 10000 * 100, 0.01)
            },
            publicStepRule: {
              developMini: this.count(this.form.developMini, 10000 * 100, 0.01),
              hokMini: this.count(this.form.hokMini, 10000 * 100, 0.01)
            }
          })
          if (code === 1) {
            this.$message.success('保存成功')
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.discount-config-btn {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  margin-bottom: -60px;
}
.discount-config-cnt {
  max-height: 500px;
  overflow-y: auto;
}
.w100 {
  width: 100px;
}
.mr-10 {
  margin-right: 10px;
}
.ml-10 {
  margin-left: 10px;
}
.pt-20 {
  padding-top: 20px;
}
.lh-20 {
  line-height: 20px;
}

.list {
  .item {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .close {
    margin-left: 10px;
    font-size: 20px;
    line-height: 28px;
  }
}

.title {
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 30px;
  padding-left: 30px;
  color: #000;
}
.desc {
  font-size: 12px;
  color: #777777;
}
::v-deep {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  input[type='number'] {
    -moz-appearance: textfield !important;
  }
}
</style>
