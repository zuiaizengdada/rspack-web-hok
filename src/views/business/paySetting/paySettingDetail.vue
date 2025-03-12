<template>
  <div class="page_wrap">
    <div class="header">
      <span class="pointer" @click="$router.go(-1)">售后维权</span>
      > 订单详情
    </div>

    <div v-loading="loading" class="order-detail clearfix">
      <div>
        <div class="deliver-info">
          <div>
            <i
              v-if="detail.status === 2"
              class="el-icon-success"
              style="color: #21c11f; font-size: 18px"
              :style="{ color: orderStatus[detail.status || 0].color }"
            />
            <span
              class="m-l-10 deliverTips"
              :style="{ color: orderStatus[detail.status || 0].color }"
            >
              {{ orderStatus[detail.status || 0].name }}
            </span>

            <el-tooltip
              v-if="
                detail.status && detail.status === 1 && time === 0 && num === 0
              "
              class="item"
              effect="dark"
              content="点击刷新订单数据"
              placement="top-start"
            >
              <i class="el-icon-refresh-right a_link" @click="refresh()" />
            </el-tooltip>
            <el-tooltip
              v-if="detail.status && detail.status === 1 && time > 0 && num > 0"
              class="item"
              effect="dark"
              content="处理中请稍后"
              placement="top-start"
            >
              <i class="el-icon-loading" />
            </el-tooltip>
            <span
              v-if="showTips"
              style="color: red; font-size: 13px; margin-left: 20px"
            >当前退款订单为抖音伏羲云发货商品类型，请确保赠送的书籍已经退回再退款，未退回书籍可点击拒绝退款，拒绝退款必须在客户申请退款72小时内处理，否则会自动退款。</span>
          </div>
        </div>
      </div>

      <el-card
        v-if="
          detail.status === 0 &&
            detail.goodsType !== 7 &&
            (detail.channelSource === 3 ||
              detail.channelSource === 12 ||
              detail.channelSource === 13 ||
              detail.channelSource === 14 ||
              detail.channelSource === 15 ||
              detail.channelSource === 21)
        "
        shadow="always"
      >
        <el-form ref="form" label-width="80px" :model="form" :inline="true">
          <div>
            <el-form-item label="可退金额: ">
              <div>{{ (detail.balanceFee || 0) | filtersMoney }}元</div>
            </el-form-item>
            <el-form-item label="退款金额:">
              <el-input v-model="form.refundFee" type="number" :min="0">
                <span slot="suffix" class="m-r-10">元</span>
              </el-input>
            </el-form-item>
            <el-form-item label="备注说明: ">
              <el-input v-model="form.remark" class="w-300" />
              <span
                v-if="text"
                style="
                  margin-left: 10px;
                  color: red;
                  font-size: 20px;
                  font-weight: bold;
                "
              >*{{ text }}</span>
            </el-form-item>
          </div>

          <div class="single-line">
            <el-radio-group v-model="form.permissions">
              <el-radio :label="1">保留课程权限</el-radio>
              <el-radio :label="2">解除课程权限</el-radio>
            </el-radio-group>
          </div>

          <div class="single-line m-t-20">
            <div>
              <el-button
                v-permission="['system:after:confirm', permsList]"
                type="primary"
                class="m-r-10"
                :loading="loading"
                @click="sure()"
              >确认退款
              </el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="退款原路返回,退款金额不能大于申请金额."
                placement="right"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
            <div
              v-if="[12, 13, 14, 15, 21].includes(detail.channelSource)"
              style="margin-top: 16px"
            >
              <el-button
                type="danger"
                class="m-r-10"
                :loading="loading"
                @click="refuse()"
              >拒绝退款
              </el-button>
              <el-form-item label="拒绝说明: ">
                <el-input v-model="form.refuseRemark" class="w-300" />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
      <!--  套餐课 明细   -->
      <el-card
        v-else-if="detail.goodsType === 7 && [0, 1].includes(detail.status)"
        shadow="always"
      >
        <el-form ref="form" :model="form" :inline="true">
          <div class="flex mb-5">
            <div class="flex items-end mr-20">
              <div class="text-sm mr-3">可退金额:</div>
              <span
                class="text-3xl"
              >{{ (detail.balanceFee || 0) | filtersMoney }}元</span>
            </div>
            <div class="flex items-end" style="color: #f1330d">
              <div class="text-sm mr-3">退款分摊金额合计:</div>
              <span
                class="text-3xl"
              >{{ (form.refundFee * 100) | filtersMoney }}元</span>
            </div>
          </div>
          <div class="mb-5">
            <el-table
              :data="detail.packageDetailList"
              style="width: 100%"
              border
              :header-cell-style="{ background: '#f5f5f5' }"
            >
              <el-table-column label="交付单号" prop="goodsName" width="200">
                <template slot-scope="{ row }">
                  {{ row.deliveryNo || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="goodsPrices">
                <template slot-scope="{ row }">
                  {{ row.goodsName || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="商品类型" prop="discountsFee" width="100">
                <template slot-scope="{ row }">
                  {{ row.goodsTypeName }}
                </template>
              </el-table-column>
              <el-table-column label="商品单价" prop="materialDes" width="100">
                <template slot-scope="{ row }">
                  ¥ {{ (row.salePrice || 0) | filtersMoney }}
                </template>
              </el-table-column>
              <el-table-column label="交付状态" prop="duration" width="80">
                <template slot-scope="{ row }">
                  {{ row.deliveryStatusName }}
                </template>
              </el-table-column>
              <el-table-column label="累计观看时长" prop="duration" width="120">
                <template slot-scope="{ row }">
                  {{ row.duration }}
                </template>
              </el-table-column>
              <el-table-column label="商品套餐单价" prop="duration" width="120">
                <template slot-scope="{ row }">
                  ¥ {{ (row.packagePrice || 0) | filtersMoney }}
                </template>
              </el-table-column>
              <el-table-column label="看课权限" prop="duration" width="300">
                <template slot-scope="{ row }">
                  <!--                  {{ row.permission }}-->
                  <div v-if="row.goodsType !== 5">
                    <el-radio-group
                      v-model="tableFormData.rules[row.deliveryNo]"
                      class="flex"
                      :disabled="detail.status !== 0"
                    >
                      <el-radio :label="1">保留看课</el-radio>
                      <el-radio :label="2">不保留看课</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="row.goodsType === 5">
                    <el-radio-group
                      v-model="tableFormData.rules[row.deliveryNo]"
                      class="flex"
                      :disabled="detail.status !== 0"
                    >
                      <el-radio :label="1">维持现状</el-radio>
                      <el-radio :label="2">关闭交付</el-radio>
                    </el-radio-group>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="退款分摊金额" prop="duration">
                <template slot-scope="{ row }">
                  <el-input
                    v-model="tableFormData.prices[row.deliveryNo]"
                    :class="
                      !checkInputValue(row.deliveryNo, row.packagePrice)
                        ? 'border-fail'
                        : ''
                    "
                    :disabled="detail.status !== 0"
                    type="number"
                    :min="0"
                    @focus="onFocusPriceInput"
                  >
                    <!--                    <el-input type="number" :min="0" :value="deliveryFormData[row.deliveryInfoNo]" @input="value => onChangePrice(value, row.deliveryInfoNo)">-->
                    <span slot="suffix" class="m-r-10 leading-8">元</span>
                  </el-input>
                  <span
                    v-if="!checkInputValue(row.deliveryNo, row.packagePrice)"
                    class="text-sm mt-1 pt-1 text-red-400"
                  >退款分摊金额应小于等于商品套餐单价</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-form-item label="备注说明: " class="mt-2">
            <el-input v-model="form.remark" class="w-500" type="textarea" />
            <span
              v-if="text"
              style="
                margin-left: 10px;
                color: red;
                font-size: 20px;
                font-weight: bold;
              "
            >*{{ text }}</span>
          </el-form-item>

          <!--          <div class="single-line">-->
          <!--            <el-radio-group v-model="form.permissions">-->
          <!--              <el-radio :label="1">保留课程权限</el-radio>-->
          <!--              <el-radio :label="2">解除课程权限</el-radio>-->
          <!--            </el-radio-group>-->
          <!--          </div>-->

          <div class="single-line m-t-20">
            <div>
              <el-button
                v-permission="['system:after:confirm', permsList]"
                :disabled="detail.status !== 0"
                type="primary"
                class="m-r-10"
                :loading="loading"
                @click="sure()"
              >确认退款
              </el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="退款原路返回,退款金额不能大于申请金额."
                placement="right"
              >
                <i class="el-icon-info" />
              </el-tooltip>
            </div>
            <div
              v-if="[12, 13, 14, 15].includes(detail.channelSource)"
              style="margin-top: 16px"
            >
              <el-button
                :disabled="detail.status !== 0"
                type="danger"
                class="m-r-10"
                :loading="loading"
                @click="refuse()"
              >拒绝退款
              </el-button>
              <el-form-item label="拒绝说明: ">
                <el-input v-model="form.refuseRemark" class="w-300" />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
      <!-- 套餐课 已退款 退款详情 -->
      <el-card
        v-else-if="
          detail.goodsType === 7 && [2, 3, 5, 6, 7].includes(detail.status)
        "
        shadow="always"
      >
        <el-form ref="form" :model="form" :inline="true">
          <div class="flex mb-5">
            <div class="flex items-end mr-20">
              <div class="text-sm mr-3">退款金额:</div>
              <span
                class="text-3xl"
              >{{ (detail.refundFee || 0) | filtersMoney }}元</span>
            </div>
          </div>
          <div class="mb-5">
            <el-table
              :key="detail.status"
              :data="detail.packageDetailList"
              style="width: 100%"
              border
              :header-cell-style="{ background: '#f5f5f5' }"
            >
              <el-table-column label="交付单号" prop="goodsName" width="200">
                <template slot-scope="{ row }">
                  {{ row.deliveryNo || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="goodsPrices">
                <template slot-scope="{ row }">
                  {{ row.goodsName || 0 }}
                </template>
              </el-table-column>
              <el-table-column label="商品类型" prop="discountsFee" width="100">
                <template slot-scope="{ row }">
                  {{ row.goodsTypeName }}
                </template>
              </el-table-column>
              <el-table-column label="商品单价" prop="materialDes" width="100">
                <template slot-scope="{ row }">
                  ¥ {{ (row.salePrice || 0) | filtersMoney }}
                </template>
              </el-table-column>
              <el-table-column label="交付状态" prop="duration" width="80">
                <template slot-scope="{ row }">
                  {{ row.deliveryStatusName }}
                </template>
              </el-table-column>
              <el-table-column label="累计观看时长" prop="duration" width="120">
                <template slot-scope="{ row }">
                  {{ row.duration }}
                </template>
              </el-table-column>
              <el-table-column label="商品套餐单价" prop="duration" width="120">
                <template slot-scope="{ row }">
                  ¥ {{ (row.packagePrice || 0) | filtersMoney }}
                </template>
              </el-table-column>
              <el-table-column label="看课权限" prop="duration" width="300">
                <template slot-scope="{ row }">
                  <!--                  {{ row.permission }}-->
                  <div v-if="row.goodsType !== 5">
                    <el-radio-group
                      :value="detail.status === 3 ? 0 : row.permission"
                      disabled
                    >
                      <el-radio :label="1">保留看课</el-radio>
                      <el-radio :label="2">不保留看课</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="row.goodsType === 5">
                    <el-radio-group
                      :value="detail.status === 3 ? 0 : row.permission"
                      disabled
                    >
                      <el-radio :label="1">维持现状</el-radio>
                      <el-radio :label="2">关闭交付</el-radio>
                    </el-radio-group>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="退款分摊金额" prop="duration">
                <template slot-scope="{ row }">
                  <el-input :value="getPakcageReturnPrice(row)" disabled>
                    <span slot="suffix" class="m-r-10 leading-8">元</span>
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
      </el-card>

      <div v-else class="module-item m-t-20 clearfix">
        <div class="module-title">
          <div class="module-title-text">退款信息</div>
        </div>
        <div class="module-content">
          <div class="single-line">
            <div class="info-item">
              退款金额:
              <span>{{ (detail.refundFee || 0) | filtersMoney }}元</span>
            </div>
            <div class="info-item">
              课程权限:
              <span>{{
                { 1: '保留课程权限', 2: '解除课程权限' }[detail.permissions]
              }}</span>
            </div>
            <div class="info-item">
              说明: <span>{{ detail.remark }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="module-item m-t-20 clearfix">
        <div class="module-title">
          <div class="module-title-text">售后信息</div>
        </div>
        <div class="module-content">
          <div class="single-line">
            <div class="info-item">
              售后单号: <span>{{ detail.afterSaleNo || '--' }}</span>
            </div>
            <div class="info-item">
              退款方式: <span>{{ { 1: '仅退款' }[detail.afterSaleMode] }}</span>
            </div>
            <div class="info-item">
              售后类型:
              <span>{{
                {
                  1: '用户主动退款',
                  2: '平台仲裁退款',
                  3: '财务操作退款',
                  4: '系统自动退款'
                }[detail.afterSaleType]
              }}</span>
            </div>
          </div>
          <div class="single-line">
            <div class="info-item">
              申请时间: <span>{{ detail.afterCreateTime || '--' }}</span>
            </div>
          </div>
          <hr />
          <div class="single-line">
            <div class="info-item" :title="detail.userName">
              客户昵称: <span>{{ detail.userName || '--' }}</span>
            </div>
            <div class="info-item flex">
              客户手机:
              <tablePhoneItem
                v-model="detail.userPhone"
                :phone-area-code="detail.phoneAreaCode"
                :row-data="{ uid: detail.userId }"
                type="user"
              />
            </div>
            <div class="info-item flex">
              客户邮箱:
              <tableEmailItem
                v-model="detail.email"
                :row-data="{ userId: detail.userId }"
                type="user"
              />
            </div>
          </div>
          <div class="single-line">
            <div class="info-item">
              申请金额:
              <span>{{ (detail.appliedFee || 0) | filtersMoney }}元</span>
            </div>
            <div class="info-item" style="width: 66.6%" :title="detail.reason">
              退款原因: <span>{{ detail.reason }}</span>
            </div>
          </div>
          <div class="single-line">
            <div class="info-item">
              客户补充描述: <span>{{ detail.supplement || '--' }}</span>
            </div>
          </div>
          <div class="single-line w-100p clearfix voucherUrlsBox">
            <div class="voucherUrlslabel">
              <span>客户上传凭证:</span>
              <div class="m-l-10 voucherUrlsValue">
                <el-image
                  v-for="(item, index) in detail.voucherUrls"
                  :key="index"
                  class="voucherImgage"
                  style="width: 100px; height: 100px"
                  :src="item"
                  fit="contain"
                  :preview-src-list="detail.voucherUrls"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="detail.goodsType !== 7" class="module-item">
        <div class="module-title">
          <div class="module-title-text">售后商品</div>
        </div>
        <el-table
          :data="detail.list"
          style="width: 100%"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column label="商品名称" prop="goodsName">
            <template slot-scope="{ row }">
              <div class="goods-img-info">
                <div class="goods-img">
                  <ImagePreviewer
                    :src="row.coverUrl"
                    fit="contain"
                    :scale-width="64"
                    :scale-height="64"
                    style="width: 100%; height: 100%"
                  />
                </div>
                <div class="goods-info">
                  <div class="EC3" :title="row.goodsName">
                    {{ row.goodsName }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品价格（元）" prop="goodsPrices">
            <template slot-scope="{ row }">
              {{ (row.goodsPrices || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column label="优惠价格（元）" prop="discountsFee">
            <template slot-scope="{ row }">
              {{ (row.discountsFee || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column label="课程时长" prop="materialDes">
            <template slot-scope="{ row }">
              {{ row.materialDes | filterTime }}
            </template>
          </el-table-column>
          <el-table-column label="学习时长" prop="duration">
            <template slot-scope="{ row }">
              {{ row.duration | filterTime }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="module-item">
        <div class="module-title">
          <div class="module-title-text">售后订单</div>
        </div>
        <div class="module-content">
          <div class="single-line">
            <div class="info-item">
              订单号:
              <AppIconClipboard :src="detail.orderNo">
                <!-- <span class="a_link">{{ row.orderNo }}</span> -->
                <span>{{ detail.orderNo || '--' }}</span>
              </AppIconClipboard>
            </div>
            <div class="info-item">
              银行卡优惠:
              <span>{{ (detail.bankDiscountsFee || 0) | filtersMoney }} 元</span>
            </div>
            <div class="info-item">
              下单时间:
              <span>{{ detail.orderCreateTime || '--' }}</span>
            </div>
          </div>

          <div class="single-line">
            <div class="info-item">
              订单金额:
              <span>{{ (detail.goodsTotalFee || 0) | filtersMoney }} 元</span>
            </div>
            <div class="info-item">
              订单实付:
              <span>{{ (detail.payerTotal || 0) | filtersMoney }} 元</span>
            </div>
            <div class="info-item">
              订单优惠:
              <span>{{ (detail.discountsFee || 0) | filtersMoney }} 元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSaleDetail,
  // getDeliveryInfoApi,
  sureGoodsAfterSale,
  rejectRefund,
  getDeliveryText
} from '@/api/business'
import { mapGetters } from 'vuex'
import AppIconClipboard from '@/components/AppIconClipboard'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import Decimal from 'decimal.js'
import { filtersMoney, filtersMoneyByZeroNoSplit } from '@/filters'

export default {
  name: 'PaySettingDetail',
  components: {
    AppIconClipboard,
    tablePhoneItem,
    tableEmailItem
  },
  data() {
    return {
      loading: true,
      text: '',
      form: {
        permissions: 2, // 课程权限 1:保留 2:解除
        refundFee: 0, // 退款金额【单位：分】
        remark: '',
        refuseRemark: ''
      },
      formValidate: true,
      showTips: false,
      detail: {
        channelSource: '',
        afterSaleMode: '', // 退款方式 1:仅退款
        afterSaleNo: '', // 售后单号
        afterSaleType: '', // 售后类型 1:用户主动退款 2:平台仲裁退款
        appliedFee: 0, // 申请金额【单位：分】
        balanceFee: 0, // 可退金额【单位：分】
        discountsFee: 0, // 优惠金额【单位：分】
        list: [],
        goodsSubVo: {
          // 售后商品
          coverUrl: '', // 横版封面存储路径
          discountsFee: 0, // 优惠金额【单位：分】
          duration: 0, // 学习时长【单位：秒】
          goodsName: '', // 商品名称
          materialDes: '', // 课程时长【单位：秒】
          goodsPrices: 0, // 商品价格
          payerTotal: 0 // 商品价格【单位：分】
        },
        goodsTotalFee: 0, // 订单总价【单位：分】
        orderNo: '', // 商户订单号
        payerTotal: 0, // 订单实付【单位：分】
        reason: '', // 退款原因
        remark: '', // 备注
        status: null, // 售后状态 1:未处理 2: 退款中 3: 已退款 4:已关闭
        supplement: '', // 补充描述
        userName: '', // 用户昵称
        userPhone: '', // 用户手机号
        voucherUrls: [], // 凭证url 多个使用【,】分割
        userId: '',
        bankDiscountsFee: 0,
        orderCreateTime: '',
        afterCreateTime: ''
      },
      // 套餐交付单数据
      deliveryInfo: [],
      tableFormData: {
        rules: {
          // look rule
          // key orderNo value rule
        },
        prices: {
          // split price
          // key orderNo value price
        }
      },
      tableFormValidateStatus: {},
      afterSaleList: [], // 退款记录
      orderStatus: {
        0: {
          color: '#F56C6C',
          name: '未处理'
        },
        1: {
          color: '#E6A23C',
          name: '退款中'
        },
        2: {
          color: '#409EFF',
          name: '已退款'
        },
        3: {
          color: '#909399',
          name: '已关闭'
        },
        4: {
          color: '#F56C6C',
          name: '退款异常'
        },
        5: {
          color: '#E6A23C',
          name: '处理中'
        },
        6: {
          color: '#909399',
          name: '商家拒绝退款'
        },
        7: {
          color: '#409EFF',
          name: '部分退款'
        }
      },
      time: 5,
      num: 0,
      interval: null,
      permsList: this.$route.meta.permsList || [],
      // event call back
      unEvent: []
    }
  },
  computed: {
    ...mapGetters([
      'userTerminal_options',
      'orderStatus_options',
      'goodsType_options',
      'paymentType_options'
    ])
  },
  created() {
    this.getDetail()
  },
  beforeDestroyed: () => {
    console.log('页面销毁')
    // clearInterval(this.interval)
  },
  destroyed() {
    if (this.unEvent.length > 0) {
      this.unEvent.forEach(item => {
        item()
      })
    }
  },
  methods: {
    filtersMoney,
    refresh() {
      this.time = 30
      this.num = 2
      this.getDetail()
    },
    refuse() {
      if (!this.form.refuseRemark) {
        this.$notify.error({
          title: '提示',
          message: '拒绝原因不能为空'
        })
        return
      }
      const params = {
        afterSaleNo: this.$route.params.id,
        remark: this.form.refuseRemark
      }
      this.loading = true
      this.$delModal({
        tips: `是否确认拒绝退款操作?`,
        success: () => {
          rejectRefund(params)
            .then(res => {
              this.$notify.success({
                title: '提示',
                message: '操作成功'
              })
              this.getDetail()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        },
        fail: () => {
          this.loading = false
        }
      })
    },
    async getDeliveryText() {
      console.log(this.detail)
      const params = {
        afterSaleNo: this.detail.afterSaleNo
      }
      const res = await getDeliveryText(params)
      if (res.code === 1 && res.data) {
        this.text = res.data
      }
    },
    getDetail() {
      this.loading = true
      const params = {
        afterSaleNo: this.$route.params.id
      }
      getSaleDetail(params)
        .then(res => {
          console.log(res, '详情信息')
          let voucherUrls = []
          if (res.data.voucherUrls && res.data.voucherUrls.length > 0) {
            voucherUrls = res.data.voucherUrls.replace(/,$/gi, '').split(',')
          }
          this.detail = {
            channelSource: res.data.channelSource,
            afterSaleMode: res.data.afterSaleMode || '',
            afterSaleNo: res.data.afterSaleNo || '',
            afterSaleType: res.data.afterSaleType || '',
            appliedFee: res.data.appliedFee,
            balanceFee: res.data.balanceFee,
            email: res.data.email,
            phoneAreaCode: res.data.phoneAreaCode,
            discountsFee: res.data.discountsFee || '',
            list: [
              {
                coverUrl: res.data.goodsSubVo?.coverUrl || '',
                discountsFee: res.data.goodsSubVo?.discountsFee || '',
                duration: res.data.goodsSubVo?.duration || '',
                goodsName: res.data.goodsSubVo?.goodsName || '',
                materialDes: res.data.goodsSubVo?.materialDes || '',
                payerTotal: res.data.goodsSubVo?.payerTotal || '',
                goodsPrices: res.data.goodsSubVo?.goodsPrices || ''
              }
            ],
            userId: res.data.userId || '',
            goodsTotalFee: res.data.goodsTotalFee || '',
            orderNo: res.data.orderNo || '',
            payerTotal: res.data.payerTotal || '',
            reason: res.data.reason || '',
            remark: res.data.remark || '',
            status: res.data.status,
            supplement: res.data.supplement || '',
            userName: res.data.userName || '',
            userPhone: res.data.userPhone || '',
            refundFee: res.data.refundFee || 0,
            permissions: res.data.permissions || '',
            voucherUrls,
            bankDiscountsFee: res.data.bankDiscountsFee || 0,
            goodsType: res.data.goodsType,
            orderCreateTime: res.data.orderCreateTime || '',
            afterCreateTime: res.data.afterCreateTime || '',
            packageDetailList: res.data.packageDetailVOList || []
          }
          if (res.data.giftsCode) {
            this.showTips = true
          }
          if (this.detail.goodsType === 7) {
            this.form.refundFee = 0
          } else {
            this.form.refundFee = this.detail.balanceFee / 100
          }
          this.getDeliveryText()
          this.loading = false

          const _this = this
          if (res.data.status === 1 && this.num !== 0 && !this.interval) {
            this.interval = setInterval(function () {
              console.log(_this.time, _this.num)
              _this.time--
              if (_this.time <= 0 && _this.num > 0) {
                _this.time = 3
                _this.num = _this.num - 1
                _this.getDetail()
              }
              if (_this.time <= 30 && _this.num <= 0) {
                clearInterval(_this.interval)
                _this.time = 0
                _this.num = 0
              }
            }, 1000)
          }

          if (res.data.status !== 1 && !!this.interval) {
            clearInterval(this.interval)
            this.interval = null
          }

          this.detail.packageDetailList.forEach((item, index) => {
            if ([0, 1].includes(this.detail.status)) {
              this.$set(
                this.$data.tableFormData.prices,
                item.deliveryNo,
                filtersMoneyByZeroNoSplit(item.balance || 0)
              )
              this.$set(this.$data.tableFormData.rules, item.deliveryNo, 2)
              this.$set(
                this.$data.tableFormValidateStatus,
                item.deliveryNo,
                true
              )
              this.unEvent.push(
                this.$watch(
                  `tableFormData.prices.${item.deliveryNo}`,
                  this.getTotalReturnPrice
                )
              )
            }
          })
          // 套餐课 计算分摊金额合计
          if (
            this.detail.goodsType === 7 &&
            [0, 1].includes(this.detail.status)
          ) {
            this.getTotalReturnPrice()
          }
          // if (this.detail.goodsType === 7) {
          //   this.getDeliveryInfo(this.$route.params.id)
          // }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // getDeliveryInfo(afterSaleNo) {
    //   // MOCK
    //   // this.deliveryInfo = [
    //   //   {
    //   //     deliveryInfoNo: '202107010001',
    //   //     deliveryStatus: 1,
    //   //     duration: 3600,
    //   //     goodsName: '商品名称',
    //   //     goodsType: 1,
    //   //     packagePrice: 200,
    //   //     permission: 1,
    //   //     salePrice: 100
    //   //   },
    //   //   {
    //   //     deliveryInfoNo: '202107010002',
    //   //     deliveryStatus: 1,
    //   //     duration: 1600,
    //   //     goodsName: '商品名称2',
    //   //     goodsType: 5,
    //   //     packagePrice: 200,
    //   //     permission: 1,
    //   //     salePrice: 100
    //   //   }
    //   // ]
    //   // // init data
    //   // this.form.refundFee = 0
    //   // this.deliveryInfo.forEach(item => {
    //   //   this.$set(this.$data.tableFormData.prices, item.deliveryInfoNo, 0)
    //   //   this.$set(this.$data.tableFormData.rules, item.deliveryInfoNo, 0)
    //   //   this.unEvent.push(this.$watch(`tableFormData.prices.${item.deliveryInfoNo}`, this.getTotalReturnPrice))
    //   // })
    //   // this.deliveryPrice = {
    //   //   '202107010001': 0,
    //   //   '202107010002': 0
    //   // }
    //   // return
    //   this.loading = true
    //   const params = {
    //     // orderNo
    //     afterSaleNo
    //   }
    //   getDeliveryInfoApi(params)
    //     .then(res => {
    //       console.log(res, '套餐课 交付单信息')
    //       this.deliveryInfo = res.data
    //       if (this.deliveryInfo.length > 0) {
    //         this.deliveryInfo.forEach((item, index) => {
    //           if (this.detail.status === 0) {
    //             this.$set(this.$data.tableFormData.prices, item.deliveryNo, 0)
    //             this.$set(this.$data.tableFormData.rules, item.deliveryNo, 2)
    //             this.$set(this.$data.tableFormValidateStatus, item.deliveryNo, true)
    //             this.unEvent.push(this.$watch(`tableFormData.prices.${item.deliveryNo}`, this.getTotalReturnPrice))
    //           }
    //         })
    //       }
    //       // TODO: 需要使用res
    //       // this.deliveryInfo = res.data
    //       this.loading = false
    //     })
    //     .catch(() => {
    //       this.loading = false
    //     })
    // },
    sure() {
      // 套餐课校验
      if (this.detail.goodsType === 7) {
        if (this.form.refundFee === 0) {
          this.$notify.error({
            title: '提示',
            message: '退款金额不能为0'
          })
          return
        }
        if (this.form.refundFee > this.detail.balanceFee / 100) {
          this.$notify.error({
            title: '提示',
            message: '退款金额必须小于等于可退金额'
          })
          return
        }
        let ruleCheckResult = false
        for (const key in this.tableFormData.rules) {
          const value = this.tableFormData.rules[key]
          if (value === 0) {
            ruleCheckResult = true
          }
        }
        if (ruleCheckResult) {
          this.$notify.error({
            title: '提示',
            message: '请选择交付单看课权限'
          })
          return
        }
        for (const key in this.tableFormData.prices) {
          const value = this.tableFormData.prices[key]
          if (!/^-?\d+(\.\d{1,2})?$/.test(value)) {
            ruleCheckResult = true
          }
        }
        if (ruleCheckResult) {
          this.$notify.error({
            title: '提示',
            message: '请填写正确的金额'
          })
          return
        }
      }

      this.$delModal({
        tips: `是否确认退款操作?`,
        success: () => {
          if (this.loading) {
            return
          }
          if (this.form.refundFee > this.detail.balanceFee / 100) {
            return this.$message.error('退款金额不能大于可退金额')
          }
          if (
            !Object.keys(this.tableFormValidateStatus).every(
              key => this.tableFormValidateStatus[key]
            )
          ) {
            return this.$message.error('请检查所有输入的退款金额是否正确')
          }
          this.loading = true
          const data = {
            afterSaleNo: this.detail.afterSaleNo,
            permissions: this.form.permissions, // 课程权限 1:保留 2:解除
            refundFee: this.form.refundFee
              ? new Decimal(this.form.refundFee).mul(100).toNumber()
              : 0, // 退款金额【单位：分】
            remark: this.form.remark
          }
          if (this.detail.goodsType === 7) {
            // 套餐课
            data.packageRefundEditReq = this.detail.packageDetailList.map(
              item => {
                return {
                  deliveryNo: item.deliveryNo,
                  apportionFee:
                    this.tableFormData.prices[item.deliveryNo] * 100,
                  permission: this.tableFormData.rules[item.deliveryNo],
                  goodsId: item.goodsId
                }
              }
            )
          }
          sureGoodsAfterSale(data)
            .then(res => {
              this.$notify.success({
                title: '提示',
                message: '操作成功'
              })
              this.num = 5
              this.detail = {}
              this.getDetail()
            })
            .catch(() => {
              this.loading = false
            })
            .catch(() => {})
        }
      })
    },
    onChangePrice(value, orderNo) {
      console.log(value, orderNo)
      this.tableFormData[orderNo] = value
      // this.$set(this.$data.deliveryPrice, orderNo, value)
    },
    getTotalReturnPrice(val) {
      let sum = 0
      for (const key in this.tableFormData.prices) {
        sum += Number(this.tableFormData.prices[key])
      }
      this.form.refundFee = sum
    },
    onFocusPriceInput(e) {
      e.currentTarget.select()
    },
    parseGoodsType(type) {
      // 0:图片,1:音频，2视频,3专栏，4大专栏，5线下课程 6直播专栏
      switch (type) {
        case 0:
          return '图片'
        case 1:
          return '音频'
        case 2:
          return '视频'
        case 3:
          return '专栏'
        case 4:
          return '大专栏'
        case 5:
          return '线下课程'
        case 6:
          return '直播专栏'
        case 7:
          return '套餐课'
        default:
          return '未知'
      }
    },
    parseDeliveryStatus(status) {
      switch (status) {
        case 1:
          return '待交付'
        case 2:
          return '交付中'
        case 3:
          return '交付延期'
        case 4:
          return '锁定交付'
        case 5:
          return '已交付'
        case 6:
          return '已关闭'
        case 7:
          return '关闭'
        default:
          return '未知'
      }
    },
    checkInputValue(deliveryNo, packagePrice) {
      const inputPriceNumber = parseFloat(this.tableFormData.prices[deliveryNo])
      const packagePriceNumber = packagePrice
      let result = true
      if (!/^\d*\.\d{1,2}$|^\d+$/.test(inputPriceNumber)) {
        result = false
      } else if (inputPriceNumber * 100 > packagePriceNumber) {
        result = false
      }
      this.tableFormValidateStatus[deliveryNo] = result
      return result
    },
    getPakcageReturnPrice(item) {
      let price = 0
      switch (item.status) {
        case 1:
        case 2:
        case 7:
          price = item.apportionFee
          break
        default:
          price = item.balance
          break
      }
      return filtersMoney(price)
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('路由离开')
    clearInterval(this.interval)
    next()
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 21px;

  .header {
    font-size: 16px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 0.9);
    line-height: 24px;
    margin-bottom: 30px;
  }

  .header_tips {
    font-size: 20px;
    font-family: MicrosoftYaHei;
    color: rgba(51, 51, 51, 0.9);
    line-height: 28px;
    position: relative;
    padding-left: 10px;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 5px;
      width: 4px;
      height: 20px;
      background: #0c6fff;
      border-radius: 3px;
    }
  }

  .tips {
    // margin-top: 20px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #777777;
    line-height: 22px;
  }

  .order-detail {
    .deliver-info {
      padding: 20px;
      margin-bottom: 40px;
      width: 100%;
      background: #f5f7fa;

      .deliverTips {
        align-items: center;
        height: 22px;
        font-size: 20px;
        font-weight: bold;
        color: #21c11f;
        line-height: 22px;
      }
    }
  }

  .module-item {
    width: 100%;
    padding-bottom: 20px;

    .module-title {
      height: 22px;
      line-height: 22px;
      margin: 0 0 24px 0;

      .module-title-text {
        float: left;
        font-size: 16px;
        font-weight: bold;
        padding: 0 8px 0 8px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
        color: #353535;

        &::before {
          content: '';
          position: absolute;
          width: 2px;
          height: 14px;
          margin: 3px 0;
          background: #1b8afa;
          left: 0;
        }
      }
    }
  }

  .module-content {
    padding: 0;

    .single-line {
      width: 100%;
      height: 40px;
      padding: 0 10px;
      font-size: 14px;

      > .info-item {
        width: 33.3%;
        height: 20px;
        line-height: 20px;
        padding-right: 10px;
        float: left;
        color: #666666;
        // -o-text-overflow: ellipsis;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        > span {
          color: #353535;
        }
      }
    }

    > hr {
      margin: 0 10px 17px;
      border: 0;
      height: 0;
      border-top: 1px solid #eee;
    }
  }

  .main-table {
    width: 100%;
    position: relative;

    .table-header {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 600;
      background-color: #f5f7fa;
      text-align: center;
      color: #353535;

      .header-item {
        float: left;
        box-sizing: border-box;

        &:nth-child(1) {
          width: 20%;
          text-align: left;
          padding-left: 10px;
        }

        &:nth-child(2) {
          width: 10%;
        }

        &:nth-child(3) {
          width: 6%;
        }

        &:nth-child(4) {
          width: 7%;
        }

        &:nth-child(5) {
          width: 20%;
        }

        &:nth-child(6) {
          width: 11%;
        }

        &:nth-child(7) {
          width: 11%;
        }

        &:nth-child(8) {
          width: 15%;
        }
      }
    }

    .table-body {
      width: 100%;
      height: 106px;
      font-size: 14px;
      display: flex;

      .body-item {
        position: relative;
        line-height: 90px;
        text-align: center;

        &:nth-child(1) {
          overflow: hidden;
          white-space: nowrap;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          text-align: left;
          padding-left: 10px;
          width: 20%;

          .goods-img-info {
            display: flex;
            align-items: center;

            .goods-img {
              width: 64px;
              height: 64px;
              min-width: 64px;
              background: #999;
            }

            .goods-info {
              padding-left: 8px;
              width: 100%;
              height: 80px;
              line-height: 20px;
              vertical-align: top;
              display: inline-block;
              overflow: hidden;
              margin-top: 15px;

              .goods-type {
                width: 100%;
                height: 18px;
                font-size: 14px;
                color: #999999;
                margin-right: 8px;
              }

              .goods-period {
                margin-top: 4px;
                width: 100%;
                height: 16px;
                font-size: 12px;
                color: #b2b2b2;
                line-height: 16px;
                overflow: hidden;
                -o-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }

        &:nth-child(2) {
          width: 10%;
        }

        &:nth-child(3) {
          width: 6%;
        }

        &:nth-child(4) {
          width: 7%;
        }

        &:nth-child(5) {
          width: 20%;
        }

        &:nth-child(6) {
          width: 11%;
        }

        &:nth-child(7) {
          width: 11%;
        }

        &:nth-child(8) {
          width: 15%;
          border-left: 1px solid #eee;
        }
      }
    }
  }

  .page_footer {
    height: 80px;

    .price-summary {
      margin-top: 15px;
      float: right;

      .summary-item {
        margin-bottom: 8px;

        .title {
          display: inline-block;
          width: 200px;
          text-align: right;
          color: #333333;
        }

        .content {
          // float: right;
          display: inline-block;
          // width: 100px;
          margin-left: 35px;
        }
      }

      .total {
        color: #333333;
        font-weight: bolder;
      }
    }
  }
}

.goods-img-info {
  display: flex;
  align-items: center;

  .goods-img {
    width: 64px;
    height: 64px;
    min-width: 64px;
    background: #eee;
  }

  .goods-info {
    min-height: 60px;
    padding-left: 8px;
    display: grid;

    .goods-type {
      width: 100%;
      height: 18px;
      line-height: 18px;
      font-size: 14px;
      color: #999999;
      margin-right: 8px;
    }

    .goods-period {
      width: 100%;
      height: 16px;
      font-size: 12px;
      color: #b2b2b2;
      line-height: 16px;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.voucherUrlsBox {
  height: 100% !important;

  .voucherUrlslabel {
    display: flex;
    flex-wrap: wrap;

    .voucherUrlsValue {
      flex: 1;

      .voucherImgage {
        margin-right: 10px;
        background: rgb(245, 247, 250);
      }
    }
  }
}

.border-fail {
  ::v-deep .el-input__inner {
    border: 1px solid red;
  }
}
</style>
