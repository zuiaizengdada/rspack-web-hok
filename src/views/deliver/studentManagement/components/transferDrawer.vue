<template>
  <!-- 转课详情弹框 -->
  <el-drawer
    :size="828"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">转课详情</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <MTitle class="m-b-20">原课程</MTitle>
        <div class="detail">
          <el-row type="flex">
            <el-col :span="8" class="formView">
              <div class="formViewLabel">IP：</div>
              <div class="formViewValue">
                {{ detail.lecturerNameList | filterTearch }}
              </div>
            </el-col>
            <el-col :span="16" class="formView">
              <div class="formViewLabel">课程名称：</div>
              <div class="formViewValue">{{ detail.goodsName }}</div>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8" class="formView">
              <div class="formViewLabel">学员姓名：</div>
              <div class="formViewValue">{{ detail.userName }}</div>
            </el-col>
            <el-col :span="8" class="formView">
              <div class="formViewLabel">学员电话：</div>
              <div class="formViewValue">
                <tablePhoneItem
                  v-model="detail.userPhone"
                  :phone-area-code="detail.shiftPhoneAreaCode"
                  :row-data="{ uid: userId }"
                  type="user"
                />
              </div>
            </el-col>
            <el-col :span="8" class="formView">
              <div class="formViewLabel">学员邮箱：</div>
              <div class="formViewValue">
                <tableEmailItem
                  :key="2"
                  v-model="detail.shiftEmail"
                  type="user"
                  :row-data="{ userId: userId }"
                />
              </div>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8" class="formView">
              <div class="formViewLabel">课程金额：</div>
              <div class="formViewValue">
                ￥{{ detail.goodsTotalFee | filtersMoneyByZero }}
              </div>
            </el-col>
            <el-col :span="8" class="formView">
              <div class="formViewLabel">订单余额：</div>
              <div class="formViewValue">
                ￥{{ detail.balanceFee | filtersMoneyByZero }}
              </div>
            </el-col>
            <el-col :span="8" class="formView">
              <div class="formViewLabel">优惠金额：</div>
              <div class="formViewValue">
                ￥{{ detail.discountsFee | filtersMoneyByZero }}
              </div>
            </el-col>
          </el-row>
        </div>
        <el-row class="m-t-16" type="flex" justify="space-between">
          <MTitle class="m-b-20">转入课程</MTitle>
          <div>
            <el-button
              v-if="availableShiftFee > 0"
              :loading="loading"
              type="primary"
              size="small"
              @click="handleAddTransfer"
            >新增转课</el-button>
          </div>
        </el-row>
        <div v-if="detail.deliverShiftListVoList.length === 0" class="noData">
          <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
          <div class="m-t-10 noDataText">暂无转入课程</div>
        </div>
        <template v-for="(item, index) in detail.deliverShiftListVoList">
          <transferList
            :key="item.id"
            class="m-b-20"
            :title="`转入${index + 1}`"
            :item="item"
            @handleClickRevise="handleClickRevise(item)"
            @handleClickDel="handleClickDel(item)"
            @handleClickSubmit="handleClickSubmit(item)"
          />
        </template>
      </div>
    </div>

    <!-- 新增转课弹框 -->
    <addTransferDialog
      :config="addTransferConfig"
      :detail="detail"
      :order-no="orderNo"
      :is-package="isPackage"
      @success="closeDialog"
    />
  </el-drawer>
</template>

<script>
import transferList from './transferList.vue'
import addTransferDialog from './addTransferDialog.vue'
import {
  getDeliveryShiftDetail,
  getPackageDeliveryShiftDetail,
  confirmDeliveryShift,
  confirmPackageDeliveryShift,
  delDeliveryShift,
  getAvailableShiftFee,
  getPackageAvailableShiftFee
} from '@/api/deliver/studentManagement'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import { userGetPhone, getDecryptByUser } from '@/api/phoneEncrypt'
import { deliveryDetailsGetPhone } from '@/api/phoneEncrypt'
export default {
  components: {
    transferList,
    addTransferDialog,
    tablePhoneItem,
    tableEmailItem
  },
  filters: {
    filterTearch(val) {
      if (!val || val.length === 0) {
        return ''
      }
      return val.join(',')
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    deliveryInfoId: {
      type: [Number, String],
      default: ''
    },
    orderNo: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    userPhone: {
      type: String,
      default: ''
    },
    userId: {
      type: [String, Number],
      default: ''
    },
    isPackage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      detail: {
        discountsFee: 0, // 优惠金额
        deliverShiftListVoList: [], // 转课记录
        deliveryInfoId: 0, // 交付订单编号
        balanceFee: 0, // 	订单余额
        goodsName: '', // 课程名称
        goodsTotalFee: 0, // 	课程金额
        userName: '', // 学员姓名
        shiftEmail: '',
        userId: '', // 学员id
        userPhone: '', // 学员手机号
        lecturerNameList: [] // 	讲师名称
      },
      addTransferConfig: {
        type: 1, // 1新增，2编辑\
        phoneAreaCode: '',
        userPhone: '',
        email: '',
        row: {},
        visible: false
      },
      loading: false,
      userRealPhoneNumber: '',
      availableShiftFee: 0 // 可转金额
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      val && this.init()
    }
  },
  mounted() {},
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
    // 点击新增转课按钮
    async handleAddTransfer() {
      userGetPhone(this.userId).then(res => {
        if (res.code === 1) {
          this.addTransferConfig = {
            ...this.addTransferConfig,
            visible: true,
            type: 1,
            userPhone: res.data,
            phoneAreaCode: this.detail.shiftPhoneAreaCode,
            deliveryInfoId: this.deliveryInfoId,
            row: {}
          }
        }
      })
      const { data } = await getDecryptByUser({ userId: this.userId, type: 2 })
      if (data) {
        this.addTransferConfig = {
          ...this.addTransferConfig,
          email: data
        }
      }
    },
    // 点击重新修改
    async handleClickRevise(row) {
      const res = await getDecryptByUser({ userId: row.userId, type: 2 })
      const { data } = await deliveryDetailsGetPhone({ shiftId: row.shiftId })
      this.addTransferConfig = {
        visible: true,
        type: 2,
        deliveryInfoId: this.deliveryInfoId,
        row: {
          ...row,
          userPhone: data.shiftUserPhone,
          email: res.data,
          ...data
        }
      }
    },
    // 点击删除
    handleClickDel(row) {
      this.$delModal({
        tips: '确认要删除?',
        success: () => {
          this.loading = true
          delDeliveryShift(row.shiftId)
            .then(res => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.init()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击确认提交审核
    handleClickSubmit(row) {
      this.$delModal({
        tips: '是否确认提交审核？',
        sureBtnBgColor: '#409EFF',
        iconClassName: 'c_FF7D00',
        success: () => {
          this.loading = true
          const api = this.isPackage
            ? confirmPackageDeliveryShift
            : confirmDeliveryShift
          api(row.shiftId)
            .then(res => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.init()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 获取转课详情
    getDetail() {
      const api = this.isPackage
        ? getPackageDeliveryShiftDetail
        : getDeliveryShiftDetail
      return api(this.deliveryInfoId).then(res => {
        if (res.data) {
          this.detail = {
            discountsFee: res.data.discountsFee || 0, // 优惠金额
            deliverShiftListVoList: res.data.deliverShiftListVoList || [], // 转课记录
            deliveryInfoId: res.data.deliveryInfoId || '', // 交付订单编号
            balanceFee: res.data.balanceFee || '', // 	订单余额
            shiftPhoneAreaCode: res.data.shiftPhoneAreaCode || '', // 区号
            goodsName: res.data.goodsName || '', // 课程名称
            shiftEmail: res.data.shiftEmail || '',
            goodsTotalFee: res.data.goodsTotalFee || '', // 	课程金额
            userName: this.userName || '', // 学员姓名
            userId: this.userId || '', // 学员id
            userPhone: this.userPhone || '', // 学员手机号
            lecturerNameList: res.data.lecturerNameList || '' // 	讲师名称
          }
        }
        return
      })
    },
    // 关闭新增/编辑转课弹框
    closeDialog() {
      this.addTransferConfig.visible = false
      this.init()
    },
    // 获取可转金额
    getAvailableShiftFee() {
      const api = this.isPackage
        ? getPackageAvailableShiftFee
        : getAvailableShiftFee
      return api(this.deliveryInfoId).then(res => {
        this.availableShiftFee = res.data
        return res
      })
    },
    init() {
      this.loading = true
      Promise.all([this.getDetail(), this.getAvailableShiftFee()])
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawerBody {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .ss-material-box-header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 52px;
    padding: 15px 20px;
    background: #ffffff;
    border-radius: 2px 2px 0 0;
    border-bottom: 1px solid #f2f2f2;
    color: #353535;
    font-size: 16px;
    font-weight: bold;
    .ss-material-box-header-title {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
  .close {
    color: #b2b2b2;
    margin-left: auto;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
  .drawerContent {
    flex: 1 0 0;
    padding: 20px;
    box-sizing: border-box;
    .detail {
      .formView {
        display: flex;
        margin-bottom: 16px;
        .formViewLabel {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
          line-height: 24px;
          margin-right: 8px;
          width: 80px;
          text-align: right;
        }
        .formViewValue {
          flex: 1 0 0;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
          line-height: 24px;
        }
      }
    }
    .noData {
      padding-top: 187px;
      display: flex;
      flex-direction: column;
      align-items: center;
      > img {
        width: 405px;
        height: 202px;
      }
      > .noDataText {
        margin-top: 10px;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: #919293;
        line-height: 26px;
      }
    }
  }
}
</style>
