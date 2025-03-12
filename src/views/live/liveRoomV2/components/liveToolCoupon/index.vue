<template>
  <!-- 加热领券 -->
  <div class="page_wrap">
    <div v-loading="loading" class="liveToolCoupon">
      <el-scrollbar ref="P5ScrollContainer" :vertical="false" class="liveToolCoupon_scroll">
        <div ref="formView" class="form">
          <el-form ref="form" label-position="left" :rules="rules" :model="form" size="mini">
            <el-form-item label="选择加热优惠券" prop="coupon" class="ptb-4">
              <div style="opacity: 0;">占位内容</div>
              <div v-if="showScroll" class="pagination">
                <div class="previous_page page_btn" @click="onhandlePrevious" />
                <div class="next_page page_btn" @click="onhandleNext" />
              </div>
              <div ref="scrollView" class="couponList" :style="`transform: translateX(${scrollStep}px)`">
                <div v-for="(item, index) in couponlist" :key="index" class="couponItem">
                  <couponView :item="item" :active="item.couponNo === form.coupon.couponNo" @click.native="onSelectCoupon(item)" />
                </div>

                <div class="addCoupon" @click="onhandleAddCoupon">
                  <div class="addCouponIcon"><i class="el-icon-circle-plus" style="margin-right: 4px;font-size: 12px" /><span>添加优惠券</span></div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="停留时长" prop="hotStartDay" label-width="80px">
              <div class="hotStartDay">
                <el-input v-model.trim="form.hotStartDay" style="width: 102px" @input="(e) => delNumber('hotStartDay', e)"><span slot="suffix">分钟</span></el-input>
                <span class="hotStartDayLabel">需要弹幕</span>
                <el-switch v-model="form.heatOrNot" active-color="#065CFF" :width="30" />
              </div>
            </el-form-item>
            <el-form-item v-if="form.heatOrNot" label="预计提升领券量" prop="upSection" label-width="120px">
              <div class="upSection">
                <div v-for="(item) in upSectionOption" :key="item.value" :class="{active: form.upSection === item.value}" class="upSectionItem" @click="onchangeUpSection(item)">
                  {{ item.label }}
                </div>
              </div>
              <div class="form-tips">预计提升热度及时长仅供参考，系统智能推荐给潜在用户</div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <div class="footerBtn">
      <el-button class="footerBtnSure" :loading="loading" @click="sure">发送</el-button>
      <el-button class="footerBtnSure revoke" :loading="loading" @click="revoke">撤回</el-button>
    </div>
  </div>
</template>

<script>
import Dialog from '@/views/live/Dialog/index.js'
import couponView from './couponView.vue'
import { debounce } from '@/utils'
import { liveRoomCouponList, couponRevoke } from '@/api/liveRoom/index.js'
import { liveRoomHeatCreate } from '@/api/liveRoom/liveRoom.js'
import { mapState } from 'vuex'
export default {
  components: {
    couponView
  },
  data() {
    var validateCoupon = (rule, value, callback) => {
      if (!this.form.coupon.liveCouponId) {
        return callback(new Error('请选择加热优惠券'))
      }
      callback()
    }
    return {
      loading: false,
      form: {
        coupon: {
          claimEndTime: null,
          claimStartTime: null,
          couponContent: null,
          couponName: null,
          couponNo: null,
          createdByName: null,
          directReductionAmount: null,
          discountMethod: null,
          expireDays: null,
          issueCount: null,
          liveCouponId: null,
          sale: null,
          satisfiedAmount: null,
          status: null,
          subtractAmount: null,
          useEndTime: null,
          useStartTime: null
        },
        // 停留时长
        hotStartDay: '',
        heatOrNot: false, // 是否需要弹幕
        upSection: ''
      },
      upSectionOption: [
        { label: '1-3', value: 1 },
        { label: '4-10', value: 2 },
        { label: '11-20', value: 3 }
      ],
      timeoptions: [
        { label: '0.5小时', value: 30 },
        { label: '1小时', value: 60 },
        { label: '1.5小时', value: 90 },
        { label: '2小时', value: 120 },
        { label: '2.5小时', value: 150 },
        { label: '3小时', value: 180 }
      ],
      rules: {
        coupon: [
          { required: true, validator: validateCoupon, trigger: 'change' }
        ],
        upSection: [
          { required: true, message: '请选择预计提升领券量', trigger: 'change' }
        ],
        hotStartDay: [
          { required: true, message: '请输入停留时长', trigger: 'change' }
        ]
      },
      couponlist: [],
      scrollStep: 0,
      success: () => {},
      showScroll: false,
      maxWidth: 0,
      liveRoomId: this.$route ? this.$route.params.id : '',
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  computed: {
    ...mapState({
      activeChangeType: state => state.im.activeChangeType
    })
  },
  watch: {
    'activeChangeType': {
      handler(val) {
        if (val.type === 'COUPON_CHANGE') {
          this.getList()
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
      this.$_resizeHandler = debounce(() => {
        this.pageInit()
      }, 100)
      this.$_initResizeEvent()
    })
  },
  methods: {
    delNumber(key, e) {
      this.form[key] = e.replace(/[^0-9]/g, '')
    },
    onSelectCoupon(item) {
      // if (item.status === 0) return
      this.form.coupon = item
      this.$refs.form.validateField('coupon')
    },
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.onSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSubmit() {
      this.loading = true
      console.log(' this.form.coupon-=----', this.form.coupon)
      const data = {
        explaining: this.form.explaining, // 讲解中开关
        liveCouponId: this.form.coupon.liveCouponId, // 商品id
        name: this.form.coupon.couponName, // 商品名字
        heatDuration: this.form.hotStartDay,
        heatOrNot: this.form.heatOrNot, // 是否加热（弹幕飘窗是否展示）
        heatType: 3, // 加热类型，1-加热人气 2-加热下单 3-加热领卷
        liveRoomId: this.liveRoomId,
        upSection: this.form.upSection
      }
      liveRoomHeatCreate(data).then(() => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.loading = false
        this.success && this.success()
      }).catch((err) => {
        if (err.code && err.code === 20220609) {
          this.$delModal({
            width: '505px',
            sureBtnText: '我知道了',
            sureBtnBgColor: '#0C6FFF',
            tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">友情提示</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">您正在加热的直播间过多，请调整已设置的加热直播间。</div>
        `
          })
        } else {
          this.$message.error(err.message || err.msg || err)
        }
        this.loading = false
      })
    },
    // 点击撤回
    revoke() {
      this.onhandleRevoke()
    },
    // 点击撤回按钮
    onhandleRevoke() {
      if (!this.form.coupon.liveCouponId) {
        return this.$message.error('请选择优惠券')
      }
      this.$delModal({
        tips: `是否确定撤回该优惠券?`,
        success: () => {
          this.liveRoomRevokeCoupon()
        }
      })
    },
    // 直播间撤回优惠券
    liveRoomRevokeCoupon(row) {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        type: 1,
        liveCouponId: this.form.coupon.liveCouponId
      }
      couponRevoke(data).then(() => {
        this.loading = false
        this.$notify.success({ title: '提示', message: '撤回成功' })
      }).catch(() => {
        this.loading = false
      })
    },
    getList() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId
      }
      liveRoomCouponList(data).then(res => {
        this.couponlist = res.data
        console.log('获取的优惠券列表数据', res.data)
        this.loading = false
        this.$nextTick(() => {
          if (this.$refs.scrollView) {
            this.showScroll = this.$refs.scrollView.scrollWidth > this.$refs.scrollView.clientWidth
            this.maxWidth = this.$refs.scrollView.scrollWidth - this.$refs.scrollView.clientWidth
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    pageInit() {
      this.$nextTick(() => {
        if (this.$refs.scrollView) {
          this.showScroll = this.$refs.scrollView.scrollWidth > this.$refs.scrollView.clientWidth
          this.maxWidth = this.$refs.scrollView.scrollWidth - this.$refs.scrollView.clientWidth
        }
      })
    },
    // 点击上一页
    onhandlePrevious() {
      this.scrollStep += 240
      if (this.scrollStep >= 0) {
        this.scrollStep = 0
        return
      }
    },
    // 点击下一页
    onhandleNext() {
      this.scrollStep -= 240
      if (Math.abs(this.scrollStep) > this.maxWidth) {
        this.scrollStep = 0 - this.maxWidth
        return
      }
    },
    // 点击添加优惠券
    onhandleAddCoupon() {
      Dialog.open({
        type: 'AddCoupon',
        visible: true,
        defaultCheck: this.couponlist,
        liveRoomId: this.liveRoomId,
        success: () => {
          Dialog.close()
          this.getList()
        }
      })
    },
    onchangeUpSection(item) {
      this.form.upSection = item.value
      this.$refs.form.validateField('upSection')
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .liveToolCoupon {
    height: 100%;
    flex: 1 0 0;
    overflow: hidden;
    .liveToolCoupon_scroll {
      height: 100%;
    }
  }
  .form {
    padding: 4px 15px 15px 15px;
    .hotStartDay {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .hotStartDayLabel {
        margin-left: 50px;
        margin-right: 5px;
        color: #000000;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: bold;
      }
    }
    .upSection {
      display: flex;
      flex-wrap: wrap;
      .upSectionItem {
        width: 92px;
        height: 34px;
        flex-shrink: 0;
        border-radius: 5px;
        background: #F7F7F7;
        color: #333333;
        text-align: center;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-weight: bold;
        line-height: 34px;
        margin-right: 10px;
        cursor: pointer;
      }
      .active {
        background: #DEEBFF;
        color: #0c6fff;
      }
    }
    .form-tips {
      margin-top: 10px;
      color: #999999;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
    }
    .couponList {
      display: flex;
      transition: transform .3s ease;
      padding-top: 4px;
      .addCoupon {
        cursor: pointer;
        width: 230px;
        height: 68px;
        flex-shrink: 0;
        border-radius: 5px;
        border: 1px solid #F2F2F2;
        background: #FFF;
        display: flex;
        align-items: center;
        justify-content: center;
        .addCouponIcon {
          width: 86px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 14.5px;
          background: #F7F7F7;
          color: #4a4a4a;
          font-family: "Microsoft YaHei";
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
        }
        &:hover {
          color: #0C6FFF;
          border-color: #0C6FFF;
          .addCouponIcon {
            color: #0C6FFF;
          }
        }
      }
    }
    .pagination {
      position: absolute;
      right: 0;
      top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      .page_btn {
        cursor: pointer;
        width: 19px;
        height: 19px;
        background-size: cover;
        background-repeat: no-repeat;
      }
      .page_btn + .page_btn {
        margin-left: 10px;
      }
      .previous_page {
        background-image: url(~@/assets/image/liveRoom/previous_page_d.png);
        &:hover {
          background-image: url(~@/assets/image/liveRoom/previous_page_c.png);
        }
      }
      .next_page {
        background-image: url(~@/assets/image/liveRoom/next_page_d.png);
        &:hover {
          background-image: url(~@/assets/image/liveRoom/next_page_c.png);
        }
      }
    }
  }
  .footerBtn {
    width: 100%;
    height: 52px;
    min-height: 52px;
    max-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #DCDEE1;
    background: #fff;
    .footerBtnSure {
      width: 70px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #0C6FFF;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
    .revoke {
      border: 1px solid #DCDFE5;
      background: #F9F9F9;
      color: #000000;
    }
  }
}
::v-deep {
  .hotTimeLabelSelect {
    .el-input__inner {
      border-radius: 0 4px 4px 0;
    }

  }
  .el-form-item {
    padding-bottom: 10px;
    margin-bottom: 0;
  }
  .el-form-item + .el-form-item {
    padding-top: 10px;
    border-top: 1px solid #F2F2F2;
  }
  .el-form-item__label {
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 14px;
    font-weight: bolder;
  }
  .hotStartDay {
    .el-input__suffix {
      color: #000000;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      right: 14px;
    }
  }
}
</style>
