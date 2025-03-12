<template>
  <div v-loading="loading" class="coupon-center-add">
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="gray">
        <span @click="goBack">优惠券</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>新建机构费用优惠券</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="hok-main">
      <el-form
        ref="form"
        class="hok-main-form"
        :model="form"
        :rules="rules"
        label-width="100px"
        size="small"
      >
        <div class="title mb25">基础信息</div>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input
            v-model.trim="form.couponName"
            placeholder="请输入优惠券名称"
            maxlength="50"
            class="w515"
          />
          <div class="desc">该名称仅用于管理，不对用户展示</div>
        </el-form-item>
        <div class="title mt25 mb25">机构选择</div>
        <el-form-item label="机构名称" prop="tenantIds">
          <el-select
            v-model="form.tenantIds"
            placeholder="请选择机构"
            class="w515"
            @change="validateTime"
          >
            <el-option
              v-for="item in tenantIdsList"
              :key="item.organizationId"
              :label="item.name"
              :value="item.organizationId"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="time" label="适用月份">
          <el-select
            v-model="time"
            placeholder="请选择适用月份"
            class="w515"
            @change="timeChange"
          >
            <el-option
              v-for="item in timeList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- <el-input v-model="time" class="w515" disabled /> -->
        </el-form-item>
        <div class="title mt25 mb25">优惠设置</div>
        <el-form-item label="优惠方式" prop="discountMethod">
          <el-select
            v-model="form.discountMethod"
            placeholder="请选择优惠方式"
            class="w515"
            @change="validateFn('discountMethod')"
          >
            <el-option
              v-for="item in discountMethodsList"
              :key="String(item.code)"
              :label="item.message"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="直减金额" prop="discountContent">
          <el-input
            v-model="form.discountContent"
            type="number"
            placeholder="请输入直减金额"
            class="w515"
          >
            <span slot="prefix"> ￥ </span>
          </el-input>
          <div class="desc">直减优惠范围￥1000.00-￥999,999.00</div>
        </el-form-item>
        <el-form-item label="发放数量" prop="issueCount">
          <el-input
            v-model="form.issueCount"
            :disabled="true"
            type="numebr"
            placeholder="请输入数量"
            class="w515"
          >
            <span slot="suffix"> 张 </span>
          </el-input>
        </el-form-item>
        <div class="title mt25 mb25">优惠说明</div>
        <el-form-item label="优惠说明" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入优惠说明"
            maxlength="300"
            show-word-limit
            class="w515"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="btns">
      <el-button type="primary" class="btn" size="small" @click="handleSubmit">
        提交审核
      </el-button>
      <el-button class="btn" size="small" @click="cancelFn">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  discountMethodsApi,
  addOrUpdateCouponInfoApi,
  getCouponInfoDetailApi
} from '@/api/orgSettlement/couponCenter.js'
import {
  listOrganizationByParamApi,
  getAwaitingPaymentBillCycleApi
} from '@/api/orgSettlement/billingCenter.js'
import { getFirstAndLastDayOfMonth } from '@/utils/common.js'
export default {
  name: 'CouponCenterAdd',
  data() {
    var discountContentValid = (rule, value, callback) => {
      const number = Number(this.form.discountContent)
      if (!(number >= 1000 && number <= 999999)) {
        callback(new Error('请输入￥1000-￥999,999'))
      } else if (!/^\d+(\.\d{1,2})?$/.test(number)) {
        callback(new Error('仅限输入2位小数'))
      } else {
        callback()
      }
    }
    return {
      form: {
        couponName: undefined, // 优惠券名称
        remark: undefined, // 优惠说明
        couponType: undefined, // 优惠券种类(1:机构费用优惠券) url携带过来
        issueCount: 1, // 发放数量
        claimCount: 1, // 限领数量
        tenantIds: undefined, // 机构Id集合
        discountMethod: undefined, // 优惠方式(1:满减，2:直减，3:折扣)
        discountContent: undefined, //  优惠信息 即立减
        useStartTime: undefined, // 使用截止时间
        useEndTime: undefined // 使用开始时间
      },
      rules: {
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        discountMethod: [
          { required: true, message: '请选择优惠方式', trigger: 'blur' }
        ],
        discountContent: [
          { required: true, message: '请输入直减金额', trigger: 'blur' },
          { validator: discountContentValid, trigger: 'blur' }
        ],
        issueCount: [
          { required: true, message: '请输入优惠券发放数量', trigger: 'blur' }
        ],
        tenantIds: [{ required: true, message: '请选择机构', trigger: 'blur' }]
      },
      discountMethodsList: [],
      tenantIdsList: [],
      time: undefined,
      timeList: [], // 使用月期
      loading: false
    }
  },
  created() {
    if (this.$route.query?.couponType) {
      this.form.couponType = Number(this.$route.query?.couponType)
    }
    this.getDiscountMethods()
  },
  methods: {
    // 获取优惠券种类
    getDiscountMethods() {
      discountMethodsApi().then(res => {
        this.discountMethodsList = res.data
        if (this.discountMethodsList.some(item => item.code === 2)) {
          this.form.discountMethod = 2 // 默认直减
        }
      })
      listOrganizationByParamApi({ isDeleted: 0, isInPlatform: false }).then(
        res => {
          this.tenantIdsList = res.data
          // 存在 couponNo 代表走的复制 新增
          if (this.$route.query?.couponNo) {
            this.getCouponInfoDetail(this.$route.query.couponNo)
          }
        }
      )
    },
    // 获取详情填充
    async getCouponInfoDetail(couponNo) {
      try {
        const { success, data } = await getCouponInfoDetailApi({ couponNo })
        if (success) {
          for (const key in this.form) {
            if (data[key]) {
              if (key === 'tenantIds') {
                this.form[key] = data[key][0]
                const timeArr = data['useStartTime'].split('-')
                timeArr.length -= 1
                this.validateTime(this.form[key], timeArr.join('-'))
              } else if (key === 'discountContent') {
                this.form[key] = Number(data[key]) / 100 // 分 转换到元
              } else {
                this.form[key] = data[key]
              }
            }
          }
        }
      } catch (error) {
        console.log('getCouponInfoDetailApi------error', error)
      }
    },
    // 提交
    handleSubmit() {
      this.$refs.form.validate(async validate => {
        if (validate) {
          this.loading = true
          try {
            await addOrUpdateCouponInfoApi({
              ...this.form,
              issueCount: Number(this.form.issueCount),
              discountContent: Number(this.form.discountContent) * 100,
              tenantIds: [this.form.tenantIds]
            })
            this.$message.success('新增成功')
            this.goBack()
          } catch (error) {
            console.log('addOrUpdateCouponInfoApi-----error', error)
          }
          this.loading = false
        }
      })
    },
    // 验证是否又可选日期
    validateTime(tenantId, key) {
      getAwaitingPaymentBillCycleApi({ tenantId }).then(res => {
        if (res.data && res.data.length) {
          if (res.data) {
            this.timeList = res.data.map(m => {
              const arr = m.split('-')
              arr.length -= 1
              return arr.join('-')
            })
          } else {
            this.timeList = []
          }
          // 回填 如果有就选前面填写 否则选第一个
          if (this.timeList.some(item => item === key)) {
            this.time = key
          } else {
            this.time = this.timeList[0]
          }
          this.timeChange(this.time)
        } else {
          this.timeList = []
          this.time = undefined
          this.timeChange(this.time)
          this.form.tenantIds = undefined
          this.$message.error('该机构无待制单账单')
        }
        this.validateFn('tenantIds')
      })
    },
    // 时间切换回调
    timeChange(value) {
      console.log('value-------', value)
      if (value) {
        const { firstDay, lastDay } = getFirstAndLastDayOfMonth(value)
        this.form.useStartTime = firstDay + ' 00:00:00'
        this.form.useEndTime = lastDay + ' 23:59:59'
      } else {
        this.form.useStartTime = ''
        this.form.useEndTime = ''
      }
    },
    validateFn(key) {
      this.$refs.form.validateField(key)
    },
    cancelFn() {
      const flag = Object.keys(this.form).some(key => {
        console.log('key------', key, !!this.form[key])
        if (
          ['issueCount', 'claimCount', 'couponType', 'discountMethod'].includes(
            key
          )
        ) {
          return false
        }
        return !!this.form[key]
      })
      if (flag) {
        this.$delModal({
          tips: `您有已编辑的优惠券内容，确认关闭吗？`,
          success: () => {
            this.goBack()
          }
        })
      } else {
        this.goBack()
      }
    },
    goBack() {
      const prevPath = this.$route.query?.prevPath
      if (prevPath) {
        this.$router.replace({
          path: prevPath
        })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.coupon-center-add {
  min-width: 1100px;
  width: 100%;
  background: #fff;
  padding: 0;
  border-radius: 5px;
  position: relative;
  .breadcrumb {
    height: 48px;
    border-bottom: 1px solid #dfe4ed;
    padding: 0 20px;
    ::v-deep .el-breadcrumb__inner {
      font-size: 15px;
      font-weight: 500;
      line-height: 48px;
      color: #000;
    }
    .gray {
      ::v-deep .el-breadcrumb__inner {
        color: #777777;
        cursor: pointer;
      }
    }
  }
  .hok-main {
    @include responsive-height(68px);
    overflow-y: auto;
    padding: 25px 20px 92px 20px;
    .mb25 {
      margin-bottom: 25px;
    }
    .mt25 {
      margin-top: 25px;
    }
    .w515 {
      width: 515px;
    }
    &-form {
      width: 100%;
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
      }
      ::v-deep .el-form-item__label {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
      }
    }
  }
  .btns {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 5%);
    border-radius: 0 0 5px 5px;
    background: #fff;
    z-index: 1;
  }
}
::v-deep {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
}
</style>
