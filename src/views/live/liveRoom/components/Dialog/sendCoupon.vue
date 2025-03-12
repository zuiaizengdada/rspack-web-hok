<template>
  <AppDialog
    v-model="visible"
    title="选择优惠券"
    width="1000px"
    :loading="loading"
    height="auto"
    :top="top"
    :drag="drag"
    :modal="false"
    @success="sure"
  >
    <div class="btnview">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addCoupon">添加优惠券</el-button>
      <el-button size="small" class="btn_primary" @click="anhandleRecord">领券记录</el-button>
    </div>
    <div v-loading="loading" class="sendCoupon overflowOuto">
      <div class="couponList">
        <div v-for="(item, index) in list" :key="index" class="couponCard" :class="`status${item.status}`" @click="selectFn(item)">
          <div :class="[0].includes(item.status) ? 'bg2' : 'bg1'" />
          <img v-if="(selectCoupon && item.couponNo === selectCoupon.couponNo)" src="~@/assets/image/coupon/selectIcon.png" class="selectIcon" />
          <div v-if="selectCoupon && item.couponNo === selectCoupon.couponNo" class="selectBox" />
          <div class="couponView">
            <div class="leftMoney">
              <template v-if="item.discountMethod === 1">
                <div class="couponMoney">
                  <div class="couponFullReduction">
                    <span class="couponUnit">￥</span>
                    <span class="couponMoney">{{ item.subtractAmount | filtersMoneyByZeroNoSplit }}</span>
                  </div>
                  <div class="couponTips">满{{ item.satisfiedAmount | filtersMoneyByZeroNoSplit }}元减{{ item.subtractAmount | filtersMoneyByZeroNoSplit }}元</div>
                </div>
                <div class="couponTypeText">满减券</div>
              </template>
              <template v-else-if="item.discountMethod === 2">
                <div class="couponMoney">
                  <div class="couponFullReduction">
                    <span class="couponUnit">￥</span>
                    <span class="couponMoney">{{ item.directReductionAmount | filtersMoneyByZero }}</span>
                  </div>
                </div>
                <div class="couponTypeText">直减券</div>
              </template>
              <template v-else-if="item.discountMethod === 3">
                <div class="couponMoney">
                  <div class="couponFullReduction">
                    <span class="couponMoney">{{ item.sale }}</span>
                    <span class="couponUnit">折</span>
                  </div>
                </div>
                <div class="couponTypeText">折扣券</div>
              </template>
            </div>
            <div class="couponContent">
              <div class="couponContentName">
                <textShowMore :key="index" :text="`${item.couponName}(${item.couponNo})`" :line-clamp="1" style="width: 274px" />
              </div>
              <div class="couponContentTips">券有效时间</div>
              <div class="couponContentTime">
                <template v-if="item.expireDays && item.expireDays > 0">
                  自领取之日{{ item.expireDays }}天内有效
                </template>
                <template v-else>
                  {{ item.useStartTime | parseTime }}~{{ item.useEndTime | parseTime }}
                </template>
              </div>
              <div class="couponContentTips m-t-8">券领取时间</div>
              <div class="couponContentTime">{{ item.claimStartTime | parseTime }}~{{ item.claimEndTime | parseTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="list.length === 0" class="noData">
        <img src="~@/assets/image/zanwusousuoneirong2.png" alt="" />
        <div class="noDataText">暂无数据</div>
      </div>
    </div>

    <div slot="footer" class="ss-material-box-bottom">
      <div class="w-100p">
        <span v-if="showRevoke" style="margin-right: 16px">停留时间</span>
        <!-- <el-select v-if="showRevoke" v-model="stayTime" size="small" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
        <el-input v-if="showRevoke" v-model="stayTime" placeholder="请输入" style="width: 120px" size="small" @input="delNumber">
          <el-button slot="append" size="small">分钟</el-button>
        </el-input>

        <div class="btnView m-l-10">
          <el-button size="small" type="primary" :loading="loading" @click="onhandleSend">发送</el-button>
          <el-button v-if="showRevoke" size="small" :loading="loading" @click="onhandleRevoke">撤回</el-button>
        </div>
      </div>
      <el-row class="cancelBtn">
        <el-button size="small" :loading="loading" @click="visible = false">取消</el-button>
      </el-row>
    </div>

    <!-- <div slot="title" class="ss-material-box-title">
      <div @click="anhandleRecord">领卷记录</div>
      <span class="m-r-10" @click="addCoupon">添加优惠券</span>
    </div> -->
  </AppDialog>
</template>

<script>
import textShowMore from '@/components/textShowMore/index2.vue'
import { liveRoomCouponList } from '@/api/liveRoom/index.js'
import AppDialog from '@/components/AppDialog'
import { filtersMoney } from '@/filters/index'
import Dialog from '@/views/live/Dialog/index.js'
export default {
  filters: {
    filtersMyMoney: (res) => {
      if (!res) {
        return ''
      }
      return '￥' + filtersMoney(res)
    }
  },
  components: {
    AppDialog,
    textShowMore
  },
  data() {
    return {
      drag: true,
      visible: false,
      loading: false,
      showRevoke: false,
      liveRoomId: '',
      list: [],
      top: '114px',
      stayTime: 1, // 停留时间
      selectCoupon: null, // 当前选中的优惠券ID
      options: [
        { label: '30秒', value: 30 },
        { label: '60秒', value: 60 },
        { label: '120秒', value: 120 },
        { label: '180秒', value: 180 }
      ],
      success: () => {}
    }
  },
  watch: {
    visible: {
      handler(val) {
        val && this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 678) / 2 + 'px'
  },
  methods: {
    // 点击领取记录按钮
    anhandleRecord() {
      Dialog.open({
        type: 'CouponRecord',
        visible: true,
        liveRoomId: this.liveRoomId
      })
    },
    // 限制只能输入数字
    delNumber(e) {
      if (Number(e) < 1) {
        this.stayTime = 1
        return
      }
      if (Number(e) > 60) {
        this.stayTime = 60
        return
      }
      this.stayTime = e.replace(/[^0-9]/g, '')
    },
    addCoupon() {
      Dialog.open({
        type: 'AddCoupon',
        visible: true,
        defaultCheck: this.list,
        liveRoomId: this.liveRoomId,
        success: () => {
          Dialog.close()
          this.getList()
        }
      })
    },
    sure() {},
    selectFn(item) {
      if (item.status === 0) {
        return
      }
      this.selectCoupon = item
    },
    getList() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId
      }
      liveRoomCouponList(data).then(res => {
        this.list = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击发送按钮
    onhandleSend() {
      if (!this.selectCoupon) {
        return this.$message.error('请选择优惠券')
      }
      this.loading = true
      this.success && this.success({ data: this.selectCoupon, type: 'send', stayTime: this.stayTime * 60 }).then(res => {
        this.loading = false
        this.$notify.success({ title: '提示', message: `发送成功,发送${res.data}张。` })
        this.visible = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击撤回按钮
    onhandleRevoke() {
      if (!this.selectCoupon) {
        return this.$message.error('请选择优惠券')
      }
      this.$delModal({
        tips: `是否确定撤回该优惠券?`,
        success: () => {
          this.loading = true
          this.success && this.success({ data: this.selectCoupon, type: 'revoke' }).then(res => {
            this.loading = false
            this.$notify.success({ title: '提示', message: '撤回成功' })
            this.visible = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.btnview {
  padding: 20px 37px 0;
}
.sendCoupon {
  max-height: 560px;
  padding: 20px 37px 12px;
  display: flex;
  flex-wrap: wrap;
  .couponList {
    display: flex;
    flex-wrap: wrap;
  }
  // 过期
  .status0 {
    cursor: not-allowed;
    .couponUnit,.couponMoney,.couponTypeText,.couponContentName {
      color: #999999!important;
    }
  }
  // 未过期
  .status1 {
    cursor: pointer;
  }
  .couponCard {
    position: relative;
    width: 449px;
    height: 160px;
    margin-bottom: 20px;
    box-shadow: 0px 0px 8px 0px rgba(210,209,209,0.5);
    .bg1 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background-image: url(../../../../../assets/image/coupon/couponBg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .bg2 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
      background-image: url(../../../../../assets/image/coupon/blackBg.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .selectIcon {
      position: absolute;
      right: 0;
      top: 0;
      width: 24px;
      height: 24px;
      z-index: 3;
    }
    .selectBox {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      background-image: url(../../../../../assets/image/coupon/selectBoder.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .couponView {
      width: 449px;
      height: 160px;
      position: relative;
      display: flex;
      z-index: 2;
      .leftMoney {
        width: 150px;
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        position: relative;
        .couponMoney {
          flex: 1 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .couponFullReduction {
          height: 33px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          margin-top: 24px;
          .couponUnit {
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FF7D00;
            line-height: 22px;
          }
          .couponMoney {
            font-size: 32px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FF7D00;
            line-height: 33px;
          }
        }
        .couponTips {
          flex: 1 0 0;
          margin-top: 4px;
          font-size: 12px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #777777;
          line-height: 17px;
        }
        .couponTypeText {
          margin-bottom: 18px;
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #666666;
          line-height: 33px;
        }
      }
      .couponContent {
        flex: 1;
        height: 100%;
        padding-left: 15px;
        position: relative;
        .usageRules {
          position: absolute;
          bottom: 10px;
          left: 15px;
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #777777;
          line-height: 14px;
          display: flex;
          align-items: center;
          .usageRulesText {
            margin-right: 4px;
          }
        }
        .couponContentName {
          margin-top: 19px;
          margin-bottom: 16px;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 20px;
        }
        .couponContentTips {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
        .couponContentTime {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
      }
    }
  }
  .couponCard:nth-child(2n + 1) {
    margin-right: 20px;
  }
  .noData {
    width: 100%;
    height: 560px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > img {
      width: 250px;
    }
    .noDataText {
      margin-top: 16px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 22px;
    }
  }
}
.ss-material-box-bottom {
  display: flex;
  height: 104px!important;
  flex-direction: column;
  justify-content: space-between!important;
  .cancelBtn {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.m-t-8 {
  margin-top: 8px;
}
.ss-material-box-title {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 500;
  color: #0c6fff;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  padding-left: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
::v-deep {
  .ss-material-box-header-title {
    position: relative;
    width: 100%;
  }
}
.btnView {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  color: #0c6fff;
  font-size: 16px;
  cursor: pointer;
}
</style>
