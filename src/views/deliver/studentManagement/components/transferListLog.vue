<template>
  <div class="">
    <el-button
      v-if="availableShiftFee > 0"
      :loading="loading"
      type="primary"
      size="small"
      @click="handleAddTransfer"
    >新增转课</el-button>
    <div>
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

    <!-- 新增转课弹框 -->
    <addTransferDialog
      :config="addTransferConfig"
      :detail="detail"
      :order-no="orderNo"
      @success="closeDialog"
    />
  </div>
</template>

<script>
import transferList from './transferList.vue'
import addTransferDialog from './addTransferDialog.vue'
import {
  getDeliveryShiftDetail,
  confirmDeliveryShift,
  delDeliveryShift,
  getAvailableShiftFee
} from '@/api/deliver/studentManagement'
import { deliveryGetPhone } from '@/api/phoneEncrypt'
export default {
  components: {
    transferList,
    addTransferDialog
  },
  props: {
    deliveryInfoId: {
      type: [Number, String],
      default: ''
    },
    orderNo: {
      type: String,
      default: ''
    },
    detailForm: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    addTransferConfig: {
      type: 1, // 1新增，2编辑
      addTransferConfig: '',
      row: {},
      visible: false
    },
    detail: {
      discountsFee: 0, // 优惠金额
      deliverShiftListVoList: [], // 转课记录
      deliveryInfoId: 0, // 交付订单编号
      balanceFee: 0, // 	订单余额
      goodsName: '', // 课程名称
      goodsTotalFee: 0, // 	课程金额
      userName: '', // 学员姓名
      userId: '', // 学员id
      userPhone: '', // 学员手机号
      lecturerNameList: [] // 	讲师名称
    },
    loading: false,
    availableShiftFee: 0 // 可转金额
  }),
  created() {
    this.init()
  },
  methods: {
    // 关闭新增/编辑转课弹框
    closeDialog() {
      this.init()
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
    },
    getAvailableShiftFee() {
      return getAvailableShiftFee(this.deliveryInfoId).then(res => {
        this.availableShiftFee = res.data
        return res
      })
    },
    // 获取转课详情
    async getDetail() {
      const { code, data } = getDeliveryShiftDetail(this.deliveryInfoId)
      if ((code === 1, data)) {
        this.detail = {
          discountsFee: data.discountsFee || 0, // 优惠金额
          deliverShiftListVoList: data.deliverShiftListVoList || [], // 转课记录
          deliveryInfoId: data.deliveryInfoId || '', // 交付订单编号
          balanceFee: data.balanceFee || '', // 	订单余额
          goodsName: data.goodsName || '', // 课程名称
          goodsTotalFee: data.goodsTotalFee || '', // 	课程金额
          userName: this.detailForm.userName || '', // 学员姓名
          userId: this.detailForm.userId || '', // 学员id
          userPhone: this.detailForm.userPhone || '', // 学员手机号
          lecturerNameList: data.lecturerNameList || '' // 	讲师名称
        }
      }
    },
    handleAddTransfer() {
      this.addTransferConfig = {
        visible: true,
        type: 1,
        deliveryInfoId: this.deliveryInfoId,
        row: {}
      }
    },
    // 点击重新修改
    async handleClickRevise(row) {
      const { data } = await deliveryGetPhone(row.shiftId)
      this.addTransferConfig = {
        visible: true,
        type: 2,
        deliveryInfoId: this.deliveryInfoId,
        row: {
          ...row,
          userPhone: data
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
          confirmDeliveryShift(row.shiftId)
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
