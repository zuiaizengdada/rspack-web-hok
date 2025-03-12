<template>
  <div class="entry-box">
    <div class="add-order-warp">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="gray">
          <span @click="goBack">优惠券</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <div class="crumbs-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="{ path: '/marketingTools/couponManager' }"
            class="nav-list"
          >优惠券</el-breadcrumb-item>
          <el-breadcrumb-item class="nav-add">{{ title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      <p v-if="form && form.couponType === '3'" class="form-tips">
        注：您创建的直播专享优惠券只能用于私域直播间，不能使用于其他场景。
      </p>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
        class="form-box"
      >
        <div class="add-coupon-row">
          <div class="common-box">
            <div class="common-title">基本信息</div>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="优惠券名称" prop="couponName">
              <el-input
                v-model="form.couponName"
                class="input-width"
                maxlength="50"
                placeholder="请输入优惠券名称"
              />
              <p class="tips-form">优惠券名称会显示到用户端，请认真填写</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="领取时间" prop="collenTimeArray">
              <el-date-picker
                v-model="form.collenTimeArray"
                style="width: 362px"
                range-separator="至"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="券有效期">
              <el-select
                v-model="form.periodType"
                placeholder="请选择优惠券类型"
                class="input-width"
                @change="changePeriodType"
              >
                <el-option
                  v-for="item in couponTimeArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.periodType === 1"
              label="领取后"
              prop="expireDays"
            >
              <el-input
                v-model="form.expireDays"
                class="long-input"
                placeholder="请输入天数"
              >
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
            <el-form-item v-else label="自定义时间" prop="useTimeArray">
              <el-date-picker
                v-model="form.useTimeArray"
                style="width: 362px"
                range-separator="至"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="add-coupon-row">
          <div class="common-box">
            <div class="common-title">优惠设置</div>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="优惠方式" prop="discountMethod">
              <el-select
                v-model="form.discountMethod"
                placeholder="请选择优惠券类型"
                class="input-width"
                @change="changeDiscountMethod"
              >
                <el-option
                  v-for="item in preferentialTypeArray"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="8.2">
                <el-form-item
                  v-if="form.discountMethod === 1"
                  label="满减面额"
                  prop="goodsMaxValue"
                >
                  <span style="color: #0c6fff; font-weight: blod">满</span>
                  <el-input
                    v-model="form.goodsMaxValue"
                    placeholder="请输入金额"
                    class="short-input"
                    @blur="changeGoodMaxVlaue"
                  >
                    <template slot="prepend">¥</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  v-if="form.discountMethod === 1"
                  prop="goodsMinValue"
                >
                  <span style="color: #ff7d00; font-weight: blod">减</span>
                  <el-input
                    v-model="form.goodsMinValue"
                    placeholder="请输入金额"
                    class="short-input"
                  >
                    <template slot="prepend">¥</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              v-if="form.discountMethod === 2"
              label="直减金额"
              prop="zhijianValue"
            >
              <el-input
                v-model="form.zhijianValue"
                placeholder="请输入金额"
                type="number"
                class="long-input"
              >
                <template slot="prepend">¥</template>
              </el-input>
              <p class="tips-form">商品原价低于直减金额不可参与优惠</p>
            </el-form-item>
            <el-form-item
              v-if="form.discountMethod === 3"
              label="折扣比例"
              prop="zhekoubili"
            >
              <el-input
                v-model="form.zhekoubili"
                placeholder="请输入金额"
                class="long-input"
              >
                <template slot="append">折</template>
              </el-input>
              <p class="tips-form">商品折扣不得低于1折，支持1位小数</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="发放数量" prop="issueCount">
              <el-input
                v-model="form.issueCount"
                placeholder="请输入数量"
                class="input-width"
              >
                <template slot="append">张</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每人限领" prop="claimCount">
              <el-input
                v-model="form.claimCount"
                placeholder="请输入数量"
                class="long-input"
              >
                <template slot="append">张</template>
              </el-input>
              <p class="tips-form">限制单人可领取该券的最大数量</p>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="add-coupon-row">
          <div class="common-box">
            <div class="common-title">商品选择</div>
          </div>
        </div>
        <el-row>
          <el-col :span="24" class="add-goods-row flex items-center">
            <em
              style="color: #ff4949; font-size: 16px; margin-right: 4px"
            >*</em>
            <el-button
              type="primary"
              size="small"
              @click="addGoods"
            ><i
              class="el-icon-plus"
              style="margin-right: 5px"
            />添加商品</el-button>
            <span
              v-if="chooseGoodsArray.length > 0"
              class="tips-gs"
            >已选择<em>{{ chooseGoodsArray.length }}</em>个商品</span>
          </el-col>
        </el-row>
        <el-row
          v-if="chooseGoodsArray.length > 0"
          style="width: 1000px; margin-top: 15px"
        >
          <div class="goods-search-row">
            <el-input
              v-model.trim="goodSearch.goodsValue"
              placeholder="请输入内容"
              class="input-with-input"
              clearable
              @input="searchForChooseGoods"
            >
              <el-select
                slot="prepend"
                v-model="goodSearch.goodsLabel"
                placeholder="请选择"
                class="input-with-select"
              >
                <el-option
                  v-for="item in optionsGoods"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-input>
            <el-button
              size="small"
              type="primary"
              @click="searchForChooseGoods"
            >查询</el-button>
            <el-button size="small" @click="clearSeachGoods">重置</el-button>
          </div>
          <el-table
            ref="goodsDataTable"
            :data="config.tableData"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="headerCellStyle"
          >
            <el-table-column label="商品信息" width="460">
              <template slot-scope="scope">
                <div class="goods-mess-row">
                  <ImagePreviewer
                    v-if="scope.row.coverUrl"
                    class="image-previewer"
                    :src="scope.row.coverUrl"
                    alt=""
                    fit="contain"
                  />
                  <span class="good-mess-detail">
                    <p>{{ scope.row.contentName }}</p>
                    <span v-if="scope.row.disabled" class="tips">{{
                      drawerTips
                    }}</span>
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品价格" header-align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.goodsType === 5" class="goods-types-row">
                  <el-popover
                    placement="bottom"
                    trigger="hover"
                    popper-class="message-popover"
                  >
                    <el-table
                      :data="scope.row.materialSpecVos"
                      :header-cell-style="headerCellStyle"
                      style="width: 100%; border: 1px solid rgb(245, 245, 245)"
                    >
                      <el-table-column prop="specName" label="规格" />
                      <el-table-column label="价格">
                        <!-- eslint-disable-next-line vue/no-template-shadow -->
                        <template slot-scope="scope">
                          <p>¥ {{ (scope.row.salePrice / 100).toFixed(2) }}</p>
                        </template>
                      </el-table-column>
                    </el-table>
                    <p slot="reference" class="search-price-p">查看规格报价</p>
                  </el-popover>
                </div>
                <p v-else class="goods-type-price">
                  <em>¥</em>{{
                    scope.row.salePrice
                      ? (scope.row.salePrice / 100).toFixed(2)
                      : 0
                  }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="150">
              <template slot-scope="scope">
                <p v-if="scope.row.goodsType === 3">专栏</p>
                <p v-if="scope.row.goodsType === 4">大专栏</p>
                <p v-if="scope.row.goodsType === 5">线下课</p>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <p
                  style="color: #f53f3f; cursor: pointer"
                  @click="deleteDataInTable(scope.row)"
                >
                  删除
                </p>
              </template>
            </el-table-column>
          </el-table>
          <div class="page-row-cls-bt">
            <el-pagination
              :current-page="config.current"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="config.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="config.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-row>
        <el-row v-if="couponReexamineTEXT !== -1" class="mt-4">
          <el-col :span="24">
            <el-form-item label="初审人员" class="mb-2">
              <div :class="['person-text', 'gray-text']">
                {{ couponReexamineTEXT || '暂无初审人员' }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="复审人员">
              <div :class="['person-text', 'gray-text']">
                {{ couponPreliminaryExaminationTEXT || '暂无复审人员' }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="submit-row-cls">
          <el-form-item class="submit-row-cls-submit">
            <el-button
              style="margin-right: 20px"
              type="primary"
              size="small"
              @click="submitForm('form')"
            >提交审核</el-button>
            <!-- cancelToBack -->
            <el-button size="small" @click="goBack">取消</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div v-if="drawerFlag" class="add-goods-block">
      <addGoodsDrawer
        :discont-type="form.discountMethod"
        :drawer="drawerFlag"
        :choose-goods-array="chooseGoodsArray"
        :drawer-tips="drawerTips"
        :coupon-price="couponPrice"
        @closeDrawer="closeDrawer"
        @chooseGoodsMethod="chooseGoodsMethod"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import addGoodsDrawer from '@/views/marketingTools/couponManager/addCouponIndex/components/addGoodsDrawer'
import {
  addOrUpdateCouponInfo,
  getCouponInfoDetail,
  getGoodsDataForCoupon
} from '@/api/marketingTools/coupon.js'
import { couponAuditorSearch } from '@/api/deliver/baseSeeting'
export default {
  name: 'AddCouponIndex',
  components: {
    addGoodsDrawer
  },
  // eslint-disable-next-line vue/require-prop-types
  props: [],
  data() {
    const zhekoubiliFormatter = (rule, value, callback) => {
      if (value === '') {
        callback('请输入优惠券折扣')
        return
      } else {
        if (value < 1) {
          callback('请输入1~9.9的折扣数据')
          return
        } else {
          const reg = /^((0\.[1-9]{1})|(([1-9]{1})(\.\d{1})?))$/
          if (!reg.test(value)) {
            callback('请输入1~9.9的折扣数据')
            return
          } else {
            callback()
            return
          }
        }
      }
    }
    const forTimeChoose = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'expireDays') {
          callback('请输入优惠券领取后有效天数！')
        } else if (rule.field === 'claimCount') {
          callback('请输入限领的数额')
        } else if (rule.field === 'issueCount') {
          callback('请输入发放的数额')
        } else if (rule.field === 'zhijianValue') {
          callback('请输入直减金额')
        } else if (rule.field === 'goodsMaxValue') {
          callback('请输入满多少的金额')
        } else if (rule.field === 'goodsMinValue') {
          callback('请输入减多少的金额')
        }
        return
      } else if (!Number.isInteger(Number(value))) {
        callback('请输入正整数')
        return
      } else if (rule.field === 'claimCount' && (value > 99 || value < 1)) {
        callback('限领张数不能大于99!')
        return
      } else if (rule.field === 'issueCount' && value > 99999) {
        callback('发放数量不能大于99999!')
        return
      } else if (rule.field === 'expireDays' && value >= 366) {
        callback('券有效期需大于等于1天小于366天')
        return
      } else if (
        rule.field === 'zhijianValue' &&
        (value > 99999 || value < 1)
      ) {
        callback('直减金额范围是1-99999')
        return
      } else if (
        rule.field === 'goodsMaxValue' &&
        (value > 99999 || value < 1)
      ) {
        callback('直减金额范围是1-99999')
        return
      } else if (
        rule.field === 'goodsMinValue' &&
        (value > 99999 || value < 1)
      ) {
        callback('直减金额范围是1-99999')
        return
      } else if (
        rule.field === 'goodsMinValue' &&
        value > this.form.goodsMaxValue * 0.8
      ) {
        callback('直减金额要小于满减金额的80%')
        return
      } else {
        callback()
      }
    }

    const getDefaultTime = () => {
      const now = moment()
      const oneMinuteLater = now.clone().add(1, 'minutes')
      return [oneMinuteLater.format('HH:mm:ss'), '00:00:00']
    }
    return {
      goodsSearchDataArray: [],
      goodSearch: {
        goodsLabel: 'couponName',
        goodsValue: ''
      },
      optionsGoods: [{ label: '商品名称', value: 'couponName' }],
      config: {
        current: 1,
        pageSize: 5,
        total: 0,
        tableData: []
      },
      isCopy: 0,
      couponNo: '',
      editObject: '',
      headerCellStyle: {
        'background-color': 'rgb(245, 245, 245)'
      },
      drawerFlag: false,
      drawerTips: '',
      title: this.$route.query.type === '3' ? '新建直播优惠券' : '新建商品优惠券',
      chooseGoodsArray: [],
      couponPrice: 0, // 传入商品查询组件的价格值
      form: {
        couponType: this.$route.query.type,
        couponName: '',
        collenTimeArray: ['00:00:00', '23:59:59'],
        periodType: 1,
        expireDays: '',
        useTimeArray: [],
        discountMethod: 1,
        claimCount: 10,
        issueCount: '',
        goodsMaxValue: '',
        goodsMinValue: '',
        zhijianValue: '',
        zhekoubili: ''
      },
      rules: {
        couponName: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        collenTimeArray: [
          {
            required: true,
            message: '请选择优惠券能够领取的时间段',
            trigger: 'change'
          }
        ],
        discountMethod: [
          { required: true, message: '请选择优惠方式', trigger: 'change' }
        ],
        claimCount: [
          { required: true, validator: forTimeChoose, trigger: 'blur' }
        ],
        issueCount: [
          { required: true, validator: forTimeChoose, trigger: 'blur' }
        ],
        goodsMaxValue: [
          { required: true, validator: forTimeChoose, trigger: 'blur' }
        ],
        goodsMinValue: [
          { required: true, validator: forTimeChoose, trigger: 'blur' }
        ],
        zhijianValue: [
          { required: true, validator: forTimeChoose, trigger: 'blur' }
        ],
        expireDays: [
          { required: true, validator: forTimeChoose, trigger: 'blur' }
        ],
        zhekoubili: [
          { required: true, validator: zhekoubiliFormatter, trigger: 'blur' }
        ],
        useTimeArray: [
          { required: true, message: '请选择优惠券的有效日期', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      preferentialTypeArray: [
        { label: '指定商品满减券', value: 1 },
        { label: '指定商品直减券', value: 2 },
        { label: '指定商品折扣券', value: 3 }
      ],
      couponTimeArray: [
        { label: '设置领取后有效天数', value: 1 },
        { label: '设置优惠券有效日期时间段', value: 2 }
      ],
      priceErrorArray: [],
      defaultTime: getDefaultTime(),
      couponReexamineTEXT: -1,
      couponPreliminaryExaminationTEXT: -1
    }
  },
  computed: {
    goodsMaxValue() {
      return this.form.goodsMaxValue
    },
    zhijianValue() {
      return this.form.zhijianValue
    },
    zhekoubili() {
      return this.form.zhekoubili
    }
  },
  watch: {
    chooseGoodsArray: {
      handler(val, oldVal) {
        this.config.total = val.length
        this.config.tableData = []
        for (
          var i = (this.config.current - 1) * this.config.pageSize;
          i <
          (val.length > this.config.current * this.config.pageSize
            ? this.config.current * this.config.pageSize
            : val.length);
          i++
        ) {
          this.config.tableData.push(val[i])
        }
      },
      deep: true
    },
    goodsMaxValue: {
      handler(val, oldVal) {
        this.updatePrice(1)
      }
    },
    zhijianValue: {
      handler(val, oldVal) {
        this.updatePrice(2)
      }
    },
    zhekoubili: {
      handler(val, oldVal) {
        this.updatePrice(3)
      }
    }
  },
  created() {},
  mounted() {
    this.couponNo = this.$route.query.couponNo
    this.isCopy = this.$route.query.isCopy
    if (this.couponNo) {
      this.title = '编辑优惠券'
      this.loadDetailData()
      if (this.isCopy === 1) {
        this.title = '复制优惠券'
      }
    }
    // this.setInitialDateRange()
    this.getCouponAuditorList()
    this.loadTreeData()
  },
  methods: {
    // 获取优惠券审核人员列表
    getCouponAuditorList() {
      couponAuditorSearch().then(res => {
        if (res.code === 1) {
          const couponReexamine = []
          const couponPreliminaryExamination = []
          res.data.some(item => {
            if (item.auditStage === 1) {
              couponReexamine.push(item.auditNickName)
            } else if (item.auditStage === 2) {
              couponPreliminaryExamination.push(item.auditNickName)
            }
          })
          this.couponReexamineTEXT = couponReexamine.join('，')
          this.couponPreliminaryExaminationTEXT =
            couponPreliminaryExamination.join('，')
        }
      })
    },
    changeGoodMaxVlaue() {
      this.$refs.form.validateField('goodsMinValue')
    },
    searchForChooseGoods() {
      this.goodsSearchDataArray = []
      if (this.goodSearch.goodsLabel === 'couponName') {
        this.chooseGoodsArray.some(item => {
          if (item.contentName.indexOf(this.goodSearch.goodsValue) >= 0) {
            this.goodsSearchDataArray.push(item)
          }
        })
      } else {
        this.chooseGoodsArray.some(item => {
          if (item.goodsId.indexOf(this.goodSearch.goodsValue) >= 0) {
            this.goodsSearchDataArray.push(item)
          }
        })
      }
      this.config.total = this.goodsSearchDataArray.length
      this.handleCurrentChange(1)
    },
    clearSeachGoods() {
      this.config.current = 1
      this.goodSearch.goodsValue = ''
      this.goodSearch.goodsLabel = 'couponName'
      this.config.total = this.chooseGoodsArray.length
      this.config.tableData = []
      for (
        var i = (this.config.current - 1) * this.config.pageSize;
        i <
        (this.chooseGoodsArray.length >
        this.config.current * this.config.pageSize
          ? this.config.current * this.config.pageSize
          : this.chooseGoodsArray.length);
        i++
      ) {
        this.config.tableData.push(this.chooseGoodsArray[i])
      }
    },
    updatePrice(type) {
      if (this.chooseGoodsArray?.length <= 0) {
        return
      }
      this.changeDataStatus(type)
    },
    changeDataStatus(type) {
      this.priceErrorArray = []
      this.chooseGoodsArray.some(item => {
        this.$set(item, 'disabled', false)
      })
      const couponPriceT = type === 1 ? this.goodsMaxValue : this.zhijianValue
      if (this.form.discountMethod === 2) {
        this.chooseGoodsArray.some(item => {
          if (item.goodsType === 5) {
            item.materialSpecVos.some(obj => {
              if (obj.salePrice <= parseFloat(couponPriceT) * 100) {
                this.$set(item, 'disabled', true)
                this.priceErrorArray.push(item)
                return
              }
            })
          } else {
            if (item.salePrice <= parseFloat(couponPriceT) * 100) {
              this.$set(item, 'disabled', true)
              this.priceErrorArray.push(item)
            } else {
              this.$set(item, 'disabled', false)
            }
          }
        })
      } else if (this.form.discountMethod === 1) {
        this.chooseGoodsArray.some(item => {
          if (item.goodsType === 5) {
            item.materialSpecVos.some(obj => {
              if (obj.salePrice < parseFloat(couponPriceT) * 100) {
                this.$set(item, 'disabled', true)
                this.priceErrorArray.push(item)
                return
              }
            })
          } else {
            if (item.salePrice < parseFloat(couponPriceT) * 100) {
              this.$set(item, 'disabled', true)
              this.priceErrorArray.push(item)
            } else {
              this.$set(item, 'disabled', false)
            }
          }
        })
      }
    },
    cancelToBack() {
      if (this.couponNo) {
        this.$router.push({
          name: 'couponManager',
          query: { fromTab: 'couponManager' }
        })
      } else {
        this.$router.push({
          name: 'couponManager'
        })
      }
    },
    deleteDataInTable(row) {
      this.chooseGoodsArray = this.chooseGoodsArray.filter(
        item => item.goodsId !== row.goodsId
      )
      this.priceErrorArray = this.priceErrorArray.filter(
        item => item.goodsId !== row.goodsId
      )
      this.config.total = this.chooseGoodsArray.length
      if (
        (this.config.current - 1) * this.config.pageSize ===
        this.chooseGoodsArray.length
      ) {
        this.config.current--
      }
      this.handleCurrentChange(this.config.current)
      this.updatePrice(this.form.discountMethod)
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.tableData = []
      if (this.goodSearch.goodsValue) {
        for (
          var i = (this.config.current - 1) * this.config.pageSize;
          i <
          (this.goodsSearchDataArray.length >
          this.config.current * this.config.pageSize
            ? this.config.current * this.config.pageSize
            : this.goodsSearchDataArray.length);
          i++
        ) {
          this.config.tableData.push(this.goodsSearchDataArray[i])
        }
      } else {
        for (
          var j = (this.config.current - 1) * this.config.pageSize;
          j <
          (this.chooseGoodsArray.length >
          this.config.current * this.config.pageSize
            ? this.config.current * this.config.pageSize
            : this.chooseGoodsArray.length);
          j++
        ) {
          this.config.tableData.push(this.chooseGoodsArray[j])
        }
      }
    },
    handleCurrentChange(val) {
      this.config.current = val
      this.config.tableData = []
      if (this.goodSearch.goodsValue) {
        for (
          var i = (this.config.current - 1) * this.config.pageSize;
          i <
          (this.goodsSearchDataArray.length >
          this.config.current * this.config.pageSize
            ? this.config.current * this.config.pageSize
            : this.goodsSearchDataArray.length);
          i++
        ) {
          this.config.tableData.push(this.goodsSearchDataArray[i])
        }
      } else {
        for (
          var j = (this.config.current - 1) * this.config.pageSize;
          j <
          (this.chooseGoodsArray.length >
          this.config.current * this.config.pageSize
            ? this.config.current * this.config.pageSize
            : this.chooseGoodsArray.length);
          j++
        ) {
          this.config.tableData.push(this.chooseGoodsArray[j])
        }
      }
    },
    loadDetailData() {
      const params = {
        couponNo: this.couponNo
      }
      getCouponInfoDetail(params).then(res => {
        console.log(res, 'getCouponInfoDetail')
        if (res.code === 1) {
          this.editObject = res.data
          this.fillDetailData()
        }
      })
    },
    fillDetailData() {
      this.form.couponName = this.editObject.couponName
      this.form.discountMethod = this.editObject.discountMethod
      console.log(
        999999999999,
        this.editObject.claimStartTime,
        this.editObject.claimEndTime
      )
      this.$set(this.form, 'collenTimeArray', [
        this.editObject.claimStartTime,
        this.editObject.claimEndTime
      ])
      if (this.editObject.expireDays) {
        this.form.periodType = 1
        this.form.expireDays = this.editObject.expireDays
      } else {
        this.form.periodType = 2
        this.$set(this.form, 'useTimeArray', [
          this.editObject.useStartTime,
          this.editObject.useEndTime
        ])
      }
      this.form.claimCount = this.editObject.claimCount
      this.form.issueCount = this.editObject.issueCount
      this.form.discountMethod = this.editObject.discountMethod
      if (this.form.discountMethod === 1) {
        const priceArray = this.editObject.discountContent.split(',')
        this.form.goodsMaxValue = parseFloat(priceArray[0]) / 100
        this.form.goodsMinValue = parseFloat(priceArray[1]) / 100
        this.couponPrice = this.form.goodsMaxValue
        this.drawerTips = '满减金额高于商品原价，不可参与优惠'
      } else if (this.form.discountMethod === 2) {
        this.form.zhijianValue =
          parseFloat(this.editObject.discountContent) / 100
        this.couponPrice = this.form.zhijianValue + ''
        this.drawerTips = '直减金额高于商品原价，不可参与优惠'
      } else if (this.form.discountMethod === 3) {
        this.form.zhekoubili = parseFloat(this.editObject.discountContent)
        this.couponPrice = '0'
        this.drawerTips = '满减金额高于商品原价，不可参与优惠'
      }
      this.form.goodsIds = this.editObject.goodsIds
      this.loadGoodsData()
    },
    loadGoodsData() {
      const params = {
        current: 1,
        size: 1000,
        goodsTypes: [3, 4, 5, 8],
        goodIds: this.form.goodsIds
      }
      getGoodsDataForCoupon(params).then(res => {
        if (res.code === 1) {
          this.chooseGoodsArray = res.data.records
          if (this.chooseGoodsArray) {
            this.changeDataStatus(this.editObject.discountMethod)
          }
        }
      })
    },
    addGoods() {
      if (this.form.discountMethod === 1) {
        if (this.form.goodsMaxValue === '' || this.form.goodsMinValue === '') {
          this.$message.error('请填写优惠券的满减金额值！')
          return false
        } else if (
          parseFloat(this.form.goodsMinValue) >
          parseFloat(this.form.goodsMaxValue)
        ) {
          this.$message.error('优惠金额不能超过满减金额设置的最大值,请修改！')
          return false
        }
        this.couponPrice = this.form.goodsMaxValue.toString()
        this.drawerTips = '满减金额高于商品原价，不可参与优惠'
      } else if (this.form.discountMethod === 2) {
        if (this.form.zhijianValue === '') {
          this.$message.error('请填写优惠券的直减金额！')
          return false
        }
        this.couponPrice = this.form.zhijianValue.toString()
        this.drawerTips = '直减金额高于商品原价，不可参与优惠'
      } else if (this.form.discountMethod === 3) {
        if (this.form.zhekoubili === '') {
          this.$message.error('请填写优惠券的折扣值！')
          return false
        }
        this.couponPrice = '0'
        this.drawerTips = '满减金额高于商品原价，不可参与优惠'
      }
      this.drawerFlag = true
    },
    changePeriodType() {
      if (this.form.periodType === 1) {
        this.form.useTimeArray = []
        this.$refs.form.clearValidate('useTimeArray')
      } else if (this.form.periodType === 2) {
        this.form.expireDays = ''
        this.$refs.form.clearValidate('expireDays')
      }
    },
    changeDiscountMethod() {
      if (this.form.discountMethod === 1) {
        this.form.zhijianValue = ''
        this.form.zhekoubili = ''
        this.$refs.form.clearValidate('goodsMaxValue')
        this.$refs.form.clearValidate('zhijianValue')
        this.$refs.form.clearValidate('zhekoubili')
      } else if (this.form.discountMethod === 2) {
        this.form.goodsMaxValue = ''
        this.form.goodsMinValue = ''
        this.form.zhekoubili = ''
        this.$refs.form.clearValidate('goodsMaxValue')
        this.$refs.form.clearValidate('zhijianValue')
        this.$refs.form.clearValidate('zhekoubili')
      } else if (this.form.discountMethod === 3) {
        this.form.goodsMaxValue = ''
        this.form.goodsMinValue = ''
        this.form.zhijianValue = ''
        this.$refs.form.clearValidate('goodsMaxValue')
        this.$refs.form.clearValidate('zhijianValue')
        this.$refs.form.clearValidate('zhekoubili')
      }
    },
    closeDrawer() {
      this.drawerFlag = false
    },
    chooseGoodsMethod(dataArray) {
      this.chooseGoodsArray = dataArray
      this.handleCurrentChange(1)
      this.drawerFlag = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (
            new Date().getTime() >
            new Date(this.form.collenTimeArray[0]).getTime()
          ) {
            this.$message.error('领取时间不能早于当前时间！')
            return
          }
          if (this.form.periodType === 2) {
            if (
              new Date(this.form.useTimeArray[0]).getTime() <
                new Date(this.form.collenTimeArray[0]).getTime() ||
              new Date(this.form.collenTimeArray[1]).getTime() >
                new Date(this.form.useTimeArray[1]).getTime()
            ) {
              this.$message.error('券有效期时间段选择有误！')
              return
            }
          }
          if (this.priceErrorArray?.length > 0) {
            this.$message.error('当前存在不满足创建优惠券金额的商品，请修改')
            return
          }
          let discountContent = ''
          if (this.form.discountMethod === 1) {
            discountContent =
              parseFloat(this.form.goodsMaxValue) * 100 +
              ',' +
              parseFloat(this.form.goodsMinValue) * 100
          } else if (this.form.discountMethod === 2) {
            discountContent = this.form.zhijianValue * 100
          } else if (this.form.discountMethod === 3) {
            discountContent = this.form.zhekoubili
          }
          const goodsArray = []
          this.chooseGoodsArray.some(item => {
            goodsArray.push(item.goodsId)
          })
          const params = {
            claimCount: this.form.claimCount,
            couponName: this.form.couponName,
            couponType: this.form.couponType,
            discountMethod: this.form.discountMethod,
            expireDays: this.form.expireDays,
            issueCount: this.form.issueCount,
            goodIds: goodsArray,
            claimStartTime: this.form.collenTimeArray[0],
            claimEndTime: this.form.collenTimeArray[1],
            useStartTime: this.form.useTimeArray[0],
            useEndTime: this.form.useTimeArray[1],
            discountContent: discountContent
          }
          if (this.couponNo && this.isCopy !== 1) {
            params.couponNo = this.couponNo
            params.couponType = this.editObject.couponType
          } else if (this.couponNo && this.isCopy === 1) {
            params.couponType = this.editObject.couponType
          }
          if (this.chooseGoodsArray.length === 0) {
            this.$message.error('请添加商品！')
            return
          }
          addOrUpdateCouponInfo(params).then(res => {
            if (res.code === 1) {
              this.$message.success('添加成功！')
              this.$router.push({
                path: '/privateLive/setting/couponMg',
                query: { fromTab: 'couponManager' }
              })
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    setInitialDateRange() {
      const now = moment()
      const startOfDay = now.clone().startOf('day').toDate()
      const endOfDay = now.clone().endOf('day').toDate()

      this.defaultTime = [
        [
          startOfDay.getHours(),
          startOfDay.getMinutes(),
          startOfDay.getSeconds()
        ],
        [endOfDay.getHours(), endOfDay.getMinutes(), endOfDay.getSeconds()]
      ]
      console.log(this.defaultTime, 'defautl')
    },
    goBack() {
      const prevPath = this.$route.query?.prevPath
      if (prevPath) {
        this.$router.replace({
          path: prevPath
        })
      } else {
        this.$router.replace({
          path: '/privateLive/setting/couponMg',
          query: { fromTab: 'couponManager' }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  height: 48px;
  border-bottom: 1px solid #dfe4ed;
  padding: 0 20px;
  margin: 0 -20px 20px -20px;
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
.entry-box {
  overflow: hidden;
  .form-tips {
    margin: -6px 0 14px 0;
    color: red;
  }
  .add-order-warp {
    padding: 0 20px 20px 20px;
    background: #ffffff;
    min-height: 750px;
    border-radius: 10px;
    .crumbs-box {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #eff2f6;
    }
    .person-text {
      color: #000000;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      max-width: 910px;
      &.gray-text {
        color: #999;
      }
    }
    .common-box {
      .common-title {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #000;
        position: relative;
        padding-left: 12px;
        margin-bottom: 16px;
        font-weight: 700;
        &:before {
          position: absolute;
          content: '';
          width: 4px;
          height: 24px;
          background: #0c6fff;
          border-radius: 6px;
          top: 0;
          left: 0;
        }
      }
    }
    .search-order {
      display: flex;
      .search-in {
        margin-right: 10px;
      }
    }
    .order-list {
      max-width: 1200px;
      overflow-x: auto;
      // overflow: scroll;
      // height: 186px;
      background: #ffffff;
    }
    .table-box {
      background: #ffffff;
      max-width: 1200px;
      overflow-x: auto;
      .table-img-box {
        display: flex;
        align-items: center;
        .table-img-box-l {
          width: 64px;
          height: 64px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
          }
        }
        .table-img-box-r {
          flex: 1;
          margin-left: 8px;
        }
      }
      .table-txt {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 22px;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .table-txt-del {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #f53f3f;
        cursor: pointer;
      }
      .table-in {
        display: flex;
        align-items: center;
        align-content: space-around;
        :nth-child(1) {
          margin-right: 6px;
        }
        :nth-child(3) {
          margin-left: 2px;
        }
      }
    }

    .input-box {
      width: 296px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      font-family: MicrosoftYaHei;
      color: #dcdfe6;
      padding: 0 15px;
    }

    .label-ps {
      margin-top: 8px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #999999;
    }
    .water-header {
      display: flex;
      align-items: center;
      padding-bottom: 16px;
      .water-title {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        position: relative;
        padding-left: 10px;
        &::before {
          position: absolute;
          top: 2px;
          left: 24px;
          content: '*';
          color: #f53f3f;
        }
      }
      .common-title-width {
        width: 92px !important;
        font-size: 14px;
        color: #606266;
        font-weight: bold;
        padding-left: 34px;
      }
      .water-btn {
        width: 132px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        margin-left: 8px;
        cursor: pointer;
        .icon-plus {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .water-list {
      .water-child {
        padding: 20px 12px 16px 12px;
        background: #f7fbff;
        border-radius: 8px;
        margin-bottom: 20px;
        overflow: hidden;
        min-width: 1000px;
        .water-child-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .water-child-header-l {
            font-size: 16px;
            font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
            font-weight: bold;
            color: #333333;
          }
          .water-child-header-r {
            width: 68px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: #ffffff;
            border-radius: 4px;
            border: 1px solid #f53f3f;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #f53f3f;
            cursor: pointer;
          }
        }
      }
      .water-child-box {
        .water-child-box-title {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          padding-right: 8px;
          text-align: right;
          white-space: nowrap;
          display: inline-block;
          width: 78px;
        }
        .water-child-box-title-max {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
        }
      }
    }
    .pay-box {
      .price-num {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        text-align: right;
      }
      .price-common-title {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        text-align: right;
        .price-num-green {
          color: #00b42a;
        }
        .price-num-blue {
          color: #0c6fff;
        }
        .price-num-red {
          color: #f53f3f;
        }
      }
      .price-tomast {
        text-align: right;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #f53f3f;
      }
    }
    .foot-box {
      display: flex;
      justify-content: center;
      margin-top: 40px;
    }
    .upload-img {
      display: flex;
      .avatar-uploader-icon-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 90px;
        border-radius: 4px;
        background-color: #f3f3f3;
        margin-right: 10px;
      }
    }
  }
}
// main end
.nav-list ::v-deep .el-breadcrumb__inner {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #777777;
}
.nav-add ::v-deep .el-breadcrumb__inner {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold !important;
  color: #333333;
}
::v-deep .el-icon-arrow-right {
  font-size: 12px !important;
  color: #a9a9a9 !important;
}
// crumbs end
::v-deep .el-form-item__label {
  min-width: 100px !important;
  color: #000000;
  font-size: 14px;
  font-style: normal;
  font-weight: 550;
  // width: 70px !important;
}
.water-child-box ::v-deep .el-form-item {
  margin: 0;
}
.el-form-item.el-form-item--medium {
  display: flex;
  justify-content: flex-start;
}
.form-box {
  min-width: 1600px;
}
.form-box ::v-deep .el-form-item__content {
  margin: 0 !important;
}

.table-box ::v-deep .el-table th.el-table__cell {
  background: #f3f3f3;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
.table-in ::v-deep .el-input__inner {
  width: 92px;
}
// table end

.goods-in-num50 ::v-deep .el-input__inner {
  width: 50px;
  text-align: center;
}
.goods-in-num80 ::v-deep .el-input__inner {
  width: 80px;
  text-align: center;
}

.goods-in-num-red ::v-deep .el-input__inner {
  border: 1px solid #f53f3f;
}
::v-deep .el-input__inner {
  height: 32px;
}
.flex-box {
  display: flex;
}
.flex-item {
  align-items: center;
}
.m-r8 {
  margin-right: 8px;
}
.m-r32 {
  margin-right: 32px;
}
.m-t10 {
  margin-top: 10px;
}
.m-t20 {
  margin-top: 20px;
}
.m-b20 {
  margin-bottom: 20px;
}
.m-b16 {
  margin-bottom: 16px;
}
.no-txt {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #f53f3f;
  margin: 16px 0 32px 0;
}
.ok-txt {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #00b42a;
  margin: 16px 0 32px 0;
}
.button-h32 {
  height: 32px;
}
.w-200 ::v-deep .el-input__inner {
  width: 200px;
}
.w-296 ::v-deep .el-input__inner {
  width: 296px;
}
::v-deep .el-input-number--medium {
  width: 296px;
}
.w-496 ::v-deep .el-input__inner {
  width: 496px;
}
::v-deep .table-module {
  padding: 0 !important;
}
::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
::v-deep input[type='number'] {
  -moz-appearance: textfield;
}
::v-deep ::-webkit-scrollbar-track {
  background: #ededed;
  border-radius: 0;
}
::v-deep ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}
::v-deep :hover ::-webkit-scrollbar-track-piece {
  cursor: pointer;
  background: #ededed;
  border-radius: 0;
}

::v-deep :hover::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}

::v-deep :hover::-webkit-scrollbar-thumb:vertical {
  cursor: pointer;
  border-radius: 5px;
  background: #acacac;
  transition: color 0.2s ease;
}

.text-area-cls {
  width: 100%;
  float: left;
  ::v-deep .el-form-item__content {
    width: 700px;
  }
  ::v-deep .el-textarea textarea {
    float: left;
    width: 100%;
  }
}
.add-goods-cls {
  width: 100%;
  padding-bottom: 20px;
  padding-left: 25px;
}

.add-coupon-row {
  width: 100%;
}

.submit-row-cls {
  text-align: center;
  width: 1100px;
  margin-top: 30px;
  .submit-row-cls-submit {
    width: 180px;
    margin: 0 auto;
    text-align: center;
  }
}

.input-width {
  width: 296px;
}

.link-in {
  width: 210px;
  margin-left: 10px;
}

.time-zdy {
  margin-left: 103px;
}

::v-deep .el-radio__label {
  font-weight: bold;
}

.short-input {
  width: 150px;
  margin-left: 11px;
  margin-right: 11px;
}

.long-input {
  width: 362px;
}

.add-goods-row {
  margin-left: 10px;
  margin-top: 10px;
}
.tips-gs {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
  em {
    padding: 0 5px;
    color: #0c6fff;
    font-style: normal;
  }
}

.add-goods-block {
  width: 100%;
}

.image-previewer {
  float: left;
  width: 80px;
  height: 80px;
  border-radius: 2px;
  margin-right: 10px;
  border: 0;
  vertical-align: middle;
  background: rgb(245, 247, 250);
}
.good-mess-detail {
  float: left;
  width: 320px;
  height: 60px;
  margin-left: 15px;
  p {
    width: 100%;
    line-height: 20px;
    min-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .tips {
    color: #f53f3f;
    line-height: 20px;
    font-size: 12px;
  }
}
.goods-type-price {
  text-align: center;
  font-size: 14px;
  color: #333;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  em {
    font-style: normal;
    margin-right: 10px;
  }
}
.search-price-p {
  width: 100%;
  cursor: pointer;
  text-align: center;
  color: #0c6fff;
}
.page-row-cls-bt {
  width: 100%;
  margin-top: 10px;
  text-align: right;
}
.tips-form {
  margin-top: 0px;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  margin-top: 2px;
  color: #999;
}
.goods-search-row {
  margin-bottom: 20px;
  padding-left: 10px;
}
.input-with-select {
  width: 120px;
  height: 32px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  border-radius: 3px 0px 0px 3px;
}
.input-with-input {
  width: 308px;
  margin-right: 10px;
}
</style>
<style>
.message-popover {
  padding: 0 !important;
  width: 360px !important;
}
</style>
