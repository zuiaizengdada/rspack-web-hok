<template>
  <!-- 学员详情弹框 -->
  <el-drawer
    :size="1000"
    :visible.sync="visibleDialog"
    v-bind="$attrs"
    :with-header="false"
    :destroy-on-close="true"
    :wrapper-closable="true"
    :close-on-press-escape="false"
    v-on="$listeners"
  >
    <div v-if="visible" v-loading="loading" class="drawerBody">
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">详情</div>
        <i class="el-icon-close close" @click="close()" />
      </div>
      <div class="drawerContent overflowOuto">
        <div class="detailForm">
          <div class="detailFormView">
            <div class="detailFormLabel">学员姓名：</div>
            <div class="detailFormValue">{{ detailForm.userName }}</div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">学员电话：</div>
            <div class="detailFormValue">
              <tablePhoneItem
                :key="2"
                v-model="detailForm.userPhone"
                :phone-area-code="detailForm.phoneAreaCode"
                type="user"
                :row-data="{ uid: userId }"
              />
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">学员邮箱：</div>
            <div class="detailFormValue">
              <tableEmailItem
                :key="2"
                v-model="detailForm.email"
                type="user"
                :row-data="{ userId: userId }"
              />
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">交付状态：</div>
            <div class="detailFormValue">
              {{ detailForm.deliveryStatusName }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">累计观看时长：</div>
            <div class="detailFormValue">
              {{ detailForm.duration | filterTime }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">课程IP：</div>
            <div class="detailFormValue">
              {{ detailForm.lecturerName | filterLecturer }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">课程名称：</div>
            <div class="detailFormValue">{{ detailForm.goodsName }}</div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">订单余额：</div>
            <div class="detailFormValue">
              ￥{{ detailForm.balanceFee | filtersMoneyByZero }}
            </div>
          </div>
        </div>
        <div v-if="!loading" class="tabView">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基本信息" name="basicInfoLog" />
            <el-tab-pane label="观看记录" name="watchLog" />
            <!--            <el-tab-pane label="学员动态" name="studentDynamics" />-->
            <!-- <el-tab-pane label="交付信息" name="deliveryInfo" /> -->
            <!-- <el-tab-pane label="转课信息" name="transferInfo" /> -->
            <el-tab-pane label="操作记录" name="runningRecordedLog" />
          </el-tabs>
          <components
            :is="activeName"
            :delivery-info-id="$props.id"
            :sub-order-id="detailForm.subOrderId"
            :user-id="userId"
            type="1"
            :student-dynamic-id="id"
            :schedule-id="detailForm.scheduleId"
            :order-no="orderNo"
            :detail-form="detailForm"
            :is-package="true"
            :goods-id="detailForm.goodsId"
            :delivery-no="detailForm.deliveryInfoId"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import basicInfoLog from './basicInfoLog.vue'
import runningRecordedLog from './runningRecordedLog.vue'
import deliveryInfo from './deliveryInfo.vue'
import transferInfo from './transferInfo.vue'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem/index.vue'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import { getDeliveryLiveInfo, progressTreeLiveCourse } from '@/api/deliver/studentManagement'
import watchLog from './watchLog.vue'
export default {
  components: {
    basicInfoLog,
    runningRecordedLog,
    deliveryInfo,
    transferInfo,
    tablePhoneItem,
    tableEmailItem,
    watchLog
  },
  filters: {
    filterLecturer(val) {
      if (!val || val.length === 0) {
        return '--'
      } else {
        return val.join(',')
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Number],
      default: ''
    },
    userId: {
      type: [String, Number],
      default: ''
    },
    subOrderId: {
      type: [String, Number],
      default: ''
    },
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      detailForm: {
        accountFee: '', // 优惠金额
        amount: '', // 项目金额
        userCopyPhone: '',
        channelSource: '', // 渠道来源，1.抖店，2.快手，3.获客，4微店，5商学通，6小鹅通，7博商，8获客线下
        channelSourceName: '',
        deliveryEndTime: '', // 交付结束时间
        deliveryInfoId: '', // 交付编号
        deliveryStartTime: '', // 交付开始时间
        deliveryStatus: '', // 交付状态，1.待交付，2.交付中，3.延期交付，4锁定交付，5已交付，6已关闭
        deliveryStatusName: '',
        goodsName: '', // 课程名称
        goodsTotalFee: '', // 课程金额
        email: '', // 邮箱
        lecturerName: '', // 	讲师
        orderBalance: '', // 订单余额，单位分
        orderType: '', // 订单类型编号
        orderTypeName: '', // 	订单类型名字
        originScheduleNum: '', // 班期数
        enrollmentDeptName: '', // 招生部门
        enrollmentUserName: '', // 	招生老师
        remark: '', // 备注
        userId: '', // 学员编号
        userName: '', // 学员名称
        userPhone: '', // 学员电话
        subOrderId: '', // 子订单id
        onlineFlag: '' // 是否线上课, 0: 线下 1：线上
      },
      show: true,
      activeName: 'basicInfoLog'
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.activeName = 'basicInfoLog'
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.activeName = 'basicInfoLog'
        this.getDeliveryOnlineInfo()
      } else {
        this.detailForm = {
          accountFee: '', // 优惠金额
          amount: '', // 项目金额
          userCopyPhone: '',
          channelSource: '', // 渠道来源，1.抖店，2.快手，3.获客，4微店，5商学通，6小鹅通，7博商，8获客线下
          channelSourceName: '',
          deliveryEndTime: '', // 交付结束时间
          deliveryInfoId: '', // 交付编号
          deliveryStartTime: '', // 交付开始时间
          deliveryStatus: '', // 交付状态，1.待交付，2.交付中，3.延期交付，4锁定交付，5已交付，6已关闭
          deliveryStatusName: '',
          goodsName: '', // 课程名称
          goodsTotalFee: '', // 课程金额
          lecturerName: '', // 	讲师
          email: '',
          orderBalance: '', // 订单余额，单位分
          orderType: '', // 订单类型编号
          orderTypeName: '', // 	订单类型名字
          originScheduleNum: '', // 班期数
          enrollmentDeptName: '', // 招生部门
          enrollmentUserName: '', // 	招生老师
          remark: '', // 备注
          userId: '', // 学员编号
          userName: '', // 学员名称
          userPhone: '', // 学员电话
          subOrderId: '', // 子订单id
          onlineFlag: '' // 是否线上课, 0: 线下 1：线上
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 点击关闭
    close() {
      this.$emit('update:visible', false)
    },
    // tab栏切换
    handleClick() {},
    // 获取学员详情数据
    getDeliveryOnlineInfo() {
      this.loading = true
      getDeliveryLiveInfo(this.id)
        .then(async res => {
          this.detailForm = {
            ...this.detailForm,
            userCopyPhone: res.data.userPhone,
            ...res.data,
            newEmail: res.data.email
          }
          await this.getDuration()
          console.log('====================')
          console.log(this.detailForm)
          console.log('====================')
          // if (this.detailForm.goodsType === 5) {
          //   this.activeName = 'basicInfoLog'
          // } else if (
          //   this.detailForm.goodsType === 3 ||
          //   this.detailForm.goodsType === 4
          // ) {
          //   this.activeName = 'watchLog'
          // } else {
          //   this.activeName = 'runningLog'
          // }
        })
        .catch(() => {
          this.loading = false
        })
    },
    async getDuration() {
      const res = await progressTreeLiveCourse({
        current: 1,
        size: 100,
        subOrderId: this.detailForm.subOrderId,
        goodsId: this.detailForm.goodsId,
        userId: this.userId
      })
      this.detailForm.duration = res.data.sum.accumulatedDuration
      this.loading = false
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
    .detailForm {
      margin: 20px 20px 0 20px;
      padding: 12px 20px;
      background: #f2f9ff;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      .detailFormView {
        flex: 50% 0 0;
        display: flex;
        align-items: center;
      }
      .detailFormLabel {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
        height: 36px;
        min-width: 70px;
        text-align: right;
        display: flex;
        align-items: center;
      }
      .detailFormValue {
        padding-top: 2px;
        flex: 1 0 0;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
      }
      .detailFormRemake {
        width: 100%;
        display: flex;
        .detailFormValue {
          flex: 1 0 0;
          display: flex;
          .text {
            font-size: 14px;
            &::before {
              content: '';
              float: right;
              width: 0;
              height: 100%;
              margin-bottom: -19px;
            }
          }
          .jyfwbtn {
            float: right;
            clear: both;
            cursor: pointer;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #0c6fff;
            line-height: 16px;
          }
          .showMore {
            /* 设置多行文本溢出省略 */
            display: -webkit-box;
            /* 默认最多显示3行 */
            -webkit-line-clamp: 3;
            overflow: hidden;
            -webkit-box-orient: vertical;
            font-size: 14px;
            &::before {
              content: '';
              float: right;
              width: 0;
              height: 100%;
              margin-bottom: -19px;
            }
          }
        }
      }
    }
    .tabView {
      padding: 0 20px;
    }
  }
}
.btn_close {
  transform: rotate(180deg);
}
</style>
