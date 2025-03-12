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
                v-model="detailForm.userPhone"
                :phone-area-code="detailForm.phoneAreaCode"
                :row-data="{ uid: detailForm.userId }"
                type="user"
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
                :row-data="{ userId: detailForm.userId }"
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
            <div class="detailFormLabel">订单类型：</div>
            <div class="detailFormValue">{{ detailForm.orderTypeName }}</div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">IP：</div>
            <div class="detailFormValue">
              {{ detailForm.lecturerName | filterLecturer }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">课程名称：</div>
            <div class="detailFormValue">{{ detailForm.goodsName }}</div>
          </div>
          <div v-if="detailForm.goodsType === 5" class="detailFormView">
            <div class="detailFormLabel">班期：</div>
            <div class="detailFormValue">
              {{ detailForm.scheduleNum || '未分班' }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">课程金额：</div>
            <div class="detailFormValue">
              ￥{{ detailForm.goodsTotalFee | filtersMoneyByZero }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">招生部门：</div>
            <div class="detailFormValue">
              {{ detailForm.enrollmentDeptName }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">招生老师：</div>
            <div class="detailFormValue">
              {{ detailForm.enrollmentUserName }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">渠道来源：</div>
            <div class="detailFormValue">
              {{ detailForm.channelSourceName }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">助教：</div>
            <div class="detailFormValue">
              {{ detailForm.assistantUserName }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">订单余额：</div>
            <div class="detailFormValue">
              ￥{{ detailForm.balanceFee | filtersMoneyByZero }}
            </div>
          </div>
          <div class="detailFormView">
            <div class="detailFormLabel">优惠金额：</div>
            <div class="detailFormValue">
              ￥{{ detailForm.discountsFee | filtersMoneyByZero }}
            </div>
          </div>
          <div class="detailFormRemake">
            <div class="detailFormLabel">备注：</div>
            <div class="detailFormValue">
              <textShowMore :text="detailForm.remark" :line-clamp="3" />
            </div>
          </div>
        </div>
        <div v-if="!loading" class="tabView">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              v-if="detailForm.goodsType === 5"
              label="班期记录"
              name="classLog"
            />
            <el-tab-pane
              v-if="detailForm.goodsType === 5"
              label="签到记录"
              name="signLog"
            />
            <el-tab-pane
              v-if="detailForm.goodsType === 3 || detailForm.goodsType === 4"
              label="观看记录"
              name="watchLog"
            />
            <el-tab-pane label="操作记录" name="runningLog" />
            <el-tab-pane label="跟进记录" name="updateLog" />
          </el-tabs>
          <components
            :is="activeName"
            :delivery-info-id="id"
            :sub-order-id="detailForm.subOrderId"
            :schedule-id="detailForm.scheduleId"
            :order-no="orderNo"
            :detail-form="detailForm"
          />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import classLog from './classLog.vue'
import runningLog from './runningLog.vue'
import updateLog from './updateLog.vue'
import signLog from './signLog.vue'
import transferListLog from './transferListLog.vue'
import watchLog from './watchLog.vue'
import textShowMore from '../components/textShowMore.vue'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
import { getDeliveryDetailById } from '@/api/deliver/studentManagement'
export default {
  components: {
    classLog,
    runningLog,
    signLog,
    watchLog,
    textShowMore,
    transferListLog,
    updateLog,
    tablePhoneItem,
    tableEmailItem
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
        channelSource: '', // 渠道来源，1.抖店，2.快手，3.获客，4微店，5商学通，6小鹅通，7博商，8获客线下
        channelSourceName: '',
        deliveryEndTime: '', // 交付结束时间
        deliveryInfoId: '', // 交付编号
        deliveryStartTime: '', // 交付开始时间
        deliveryStatus: '', // 交付状态，1.待交付，2.交付中，3.延期交付，4锁定交付，5已交付，6已关闭
        deliveryStatusName: '',
        goodsName: '', // 课程名称
        goodsTotalFee: '', // 课程金额
        lecturerName: '', // 	IP
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
      activeName: 'classLog'
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
      if (val) {
        this.getDeliveryDetailById()
      } else {
        this.detailForm = {
          accountFee: '', // 优惠金额
          amount: '', // 项目金额
          channelSource: '', // 渠道来源，1.抖店，2.快手，3.获客，4微店，5商学通，6小鹅通，7博商，8获客线下
          channelSourceName: '',
          deliveryEndTime: '', // 交付结束时间
          deliveryInfoId: '', // 交付编号
          deliveryStartTime: '', // 交付开始时间
          deliveryStatus: '', // 交付状态，1.待交付，2.交付中，3.延期交付，4锁定交付，5已交付，6已关闭
          deliveryStatusName: '',
          goodsName: '', // 课程名称
          goodsTotalFee: '', // 课程金额
          lecturerName: '', // 	IP
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
    getDeliveryDetailById() {
      this.loading = true
      getDeliveryDetailById(this.id)
        .then(res => {
          this.loading = false
          this.detailForm = {
            ...this.detailForm,
            ...res.data
          }
          if (this.detailForm.goodsType === 5) {
            this.activeName = 'classLog'
          } else if (
            this.detailForm.goodsType === 3 ||
            this.detailForm.goodsType === 4
          ) {
            this.activeName = 'watchLog'
          } else {
            this.activeName = 'runningLog'
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
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
      padding: 20px;
      background: #f2f9ff;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      .detailFormView {
        flex: 33.33% 0 0;
        display: flex;
        margin-bottom: 16px;
        // align-items: center;
      }
      .detailFormLabel {
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        line-height: 24px;
        width: 80px;
        max-width: 80px;
        min-width: 80px;
        text-align: right;
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
