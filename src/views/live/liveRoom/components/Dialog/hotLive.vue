<template>
  <AppDialog
    v-model="visible"
    title="直播间加热"
    width="949px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div v-loading="loading" class="hotlive overflowOuto">
      <div class="heatType">
        <div
          v-for="(item, index) in heatTypeOption"
          :key="index"
          class="heatTypeView "
          :class="{active: form.heatType === item.value}"
          @click="onhandleTypeChange(item)"
        >
          <div v-if="item.value === 1" class="ifHeatIng">{{ {0: '未加热', 1: '未开始', 2: '加热中', 3: '加热结束'}[ifHeatIng || 0] }}</div>
          <img v-if="form.heatType === item.value" class="gouxuan" src="~@/assets/image/live/gouxuan.png" />
          <svg-icon class-name="size-icon" :icon-class="item.icon" />
          {{ item.label }}
        </div>
      </div>

      <div class="hotMsg">
        <div class="hotMsgTitle">加热说明</div>
        <div class="tips">当直播间开启加热后，系统将自动在我们平台的终端上展示对应的直播间广告，直播间将根据加热时长进行定时推广 ，实际加热效果受到直播间内容质量、投放时间等因素影响，预计提升观众数和下单数仅供参考，不作为加热效果的保证。</div>
      </div>

      <!-- 添加商品 -->
      <el-form ref="ruleForm" :model="form" :rules="rules" class="m-t-20">
        <el-form-item v-if="form.heatType === 2" label="直播间商品" prop="goodsId" class="m-b-10">
          <div v-if="!form.goodsId" class="goodsView" @click="selectGoods">
            <i class="el-icon-plus" />
            选择加热商品
          </div>

          <div v-else class="goodsViewSetting">
            <div class="goods-info-wrapper">
              <ImagePreviewer style="width: 100%; height: 100%;" :src="form.goodsImg" fit="contain" :preview-src-list="[form.goodsImg]" />
              <div class="goods-info-detail">
                <div class="titleOptions">
                  {{ form.goodsName }}
                </div>
                <div class="goods-info-Price"><unitPrice :price="form.goodsPromotionPrice" /></div>
              </div>

              <div v-if="form.heatType === 2" class="maskdShow">
                <el-button type="text" class="maskdShowText maskdAginText" @click="selectGoods">重新选择</el-button>
              </div>
            </div>
            <div class="m-l-20 goodsSendSetting">
              <el-radio-group v-model="form.showQuotaRadio">
                <div class="showQuotaRadio-container">
                  <div class="showQuotaRadio-item">
                    <el-radio :label="-1">不限名额，学员端不展示名额</el-radio>
                  </div>
                  <div class="showQuotaRadio-itemcenter">
                    <el-radio :label="1">
                      <span style="line-height: 32px;">限名额&nbsp;</span>
                      <el-input v-model="form.showQuotaVal" placeholder="最大输入999" style="width: 152px" size="small" @focus="() => { form.showQuotaRadio = 1}" @input="delShowQuotaNumber($event, form)">
                        <el-button slot="append" icon="el-icon-minus" size="mini" @click="() => { form.showQuotaRadio = 1, form.showQuotaVal > 1 && form.showQuotaVal--}" />
                      </el-input>
                      <span style="line-height: 32px;">&nbsp;个</span>
                    </el-radio>
                  </div>
                  <div class="showQuotaRadio-item">
                    <el-radio :label="0">已抢光，学员端不能购买</el-radio>
                  </div>
                </div>
              </el-radio-group>
            </div>
          </div>
          <el-button v-share="`pages/courseDetails/${form.goodsType ===8?'live':'online'}/index?id=${form.goodsId}&shopId=${organizationId}&liveId=${liveRoomId}&shareUser=${shareUser}&active=1`" type="text" class="share-link">分享链接</el-button>
        </el-form-item>

        <el-form-item v-if="form.heatType === 3" label="选择加热优惠券" prop="liveCouponId">
          <div v-if="!form.liveCouponId" class="goodsView" @click="selectLiveCoupon">
            <i class="el-icon-plus" />
            选择加热优惠券
          </div>

          <div v-else class="goods-info-wrapper" style="width: 234px">
            <div class="liveRoomPop-container">
              <img class="liveRoomPop-img" fit="contain" src="~@/assets/image/live/coupon_icon.png" />
              <div class="liveRoomPop-contant">
                <div class="liveRoomPop-title text_hidden_1">{{ form.coupon.couponName }}</div>
                <template v-if="form.coupon.discountMethod === 1">
                  <!-- 满减 -->
                  <el-tag size="mini">满减券</el-tag>
                  <div class="coupons-content">
                    满{{ form.coupon.satisfiedAmount | filtersMoneyByZero }}元减{{ form.coupon.subtractAmount| filtersMoneyByZero }}元
                  </div>
                </template>
                <template v-if="form.coupon.discountMethod === 2">
                  <!-- 直减 -->
                  <el-tag size="mini">直减券</el-tag>
                  <div class="coupons-content">购买立减{{ form.coupon.directReductionAmount| filtersMoneyByZero }}元
                  </div>
                </template>
                <template v-if="form.coupon.discountMethod === 3">
                  <!-- 折扣 -->
                  <el-tag size="mini">折扣券</el-tag>
                  <span class="coupons-content m-l-10">{{ form.coupon.sale }}折</span>
                </template>
              </div>
            </div>

            <div class="maskdShow">
              <el-button type="text" class="maskdShowText maskdAginText" @click="selectLiveCoupon">重新选择</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.heatType !== 1" label="展示停留时间" prop="heatDuration">
          <el-input v-model="form.heatDuration" style="width: 120px" size="small" @input="delNumber">
            <el-button slot="append" size="small">分钟</el-button>
          </el-input>
        </el-form-item>

        <el-form-item v-if="form.heatType === 1" label="加热时长" prop="hotTime">
          <el-date-picker v-if="liveRoomDetail.status === 0" v-model="form.hotStartDay" value-format="yyyy-MM-dd" :picker-options="pickerOptions" type="date" placeholder="选择日期" style="width: 150px;margin-right: 10px;" />
          <el-time-picker v-if="liveRoomDetail.status === 0" v-model="form.hotStartTime" value-format="HH:mm:ss" placeholder="选择时间" style="width: 130px;margin-right: 10px;" />
          <el-select v-model="form.hotTime" placeholder="请选择" style="width: 130px;margin-right: 10px;">
            <el-option
              v-for="item in timeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div class="hotBox">
        <div class="hotBoxTitle">{{ typeOption[form.heatType] }}<span class="tips m-l-10">预计提升观众数及投放时长仅供参考</span></div>

        <div class="upSection_box">
          <div v-for="(item) in upSectionOption" :key="item.value" class="hotBoxItem" :class="{active: item.value === form.upSection, disabledClick: form.heatType === 1}" @click="onhandleSelect(item)">
            <svg-icon class-name="bg-fff" :icon-class="{1: 'hotPeopleNum_c', 2: 'hotOrder_c', 3: 'hotOrder_c'}[form.heatType]" />
            <div class="hotBoxItem_content">
              <div class="hotBoxItem_title">
                {{ typeOption[form.heatType] }}
              </div>
              <div class="hotBoxItem_title_Number">
                <template v-if="form.heatType !== 3">
                  {{ getOptionsValueByKey('value', {1: 'label', 2: 'label2', 3: 'label3'}[form.heatType], item.value, upSectionOption) }}
                </template>
                <div v-if="form.heatType === 3" class="hotBoxItem_title_Number_time">{{ item.tips }}</div>
              </div>
              <div class="tips hotBoxItem_title_tips">
                系统智能推荐给潜在用户
              </div>
            </div>
            <img v-if="item.value === form.upSection" class="gouxuan" src="~@/assets/image/live/gouxuan.png" />
          </div>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import { getItem } from '@/utils/localStorage'
import { getOptionsValueByKey } from '@/filters/index'
import AppDialog from '@/components/AppDialog'
import { getLiveRoomHeatDetail, createLiveRoomHeat, getGoodsPage, liveRoomCouponList } from '@/api/liveRoom/index.js'
import moment from 'moment'
import unitPrice from '@/views/live/liveList/component/price'
import Dialog from '@/views/live/Dialog/index.js'
import { mapState } from 'vuex'
export default {
  components: {
    AppDialog,
    unitPrice
  },
  data() {
    var validateStartTime = (rule, value, callback) => {
      if (this.liveRoomDetail.status !== 0) {
        return callback()
      }
      if (!this.form.hotStartDay) {
        return callback('请选择开始加热时间')
      }
      if (!this.form.hotStartTime) {
        return callback('请选择开始加热时间')
      }
      if (!this.form.hotTime) {
        return callback('请选择加热持续时间')
      }
      const starTime = (this.form.hotStartDay + ' ' + this.form.hotStartTime)
      console.log(starTime, moment().format('YYYY-MM-DD HH:mm:ss'))

      if (starTime < moment().format('YYYY-MM-DD HH:mm:ss')) {
        return callback('开始加热时间需要大于当前时间')
      }
      return callback()
    }
    var validateHeatDuration = (rule, value, callback) => {
      if (!value) {
        return callback('请输入展示停留时间')
      }
      if (this.form.heatType === 2) {
        if (Number(value) > 180 || Number(value) < 1) {
          return callback('展示停留时间需再1-180分钟之间')
        }
      }
      if (this.form.heatType === 3) {
        if (Number(value) > 60 || Number(value) < 1) {
          return callback('展示停留时间需再1-60分钟之间')
        }
      }
      return callback()
    }
    return {
      loading: false,
      visible: true,
      value: '',
      liveStatus: '',
      liveStartTime: '',
      liveRoomId: '',
      top: '70px',
      success: () => {},
      form: {
        heatType: 1, // 加热类型:1.加热人气 2.加热订单
        hotStartDay: '', // 加热开始日期
        hotStartTime: '', // 加热开始时间
        goodsId: '',
        goodsName: '',
        goodsImg: '',
        goodsType:'',
        goodsPromotionPrice: '',
        showQuota: -1,
        showQuotaRadio: -1,
        showQuotaVal: '',
        liveCouponId: '',
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
        hotTime: 30, // 加热持续时间
        heatDuration: 1, // 展示停留时间(分钟)
        upSection: ''
      },
      rules: {
        hotTime: [{ validator: validateStartTime, required: true, trigger: 'blur' }],
        goodsId: [{ required: true, message: '请选择加热商品', trigger: 'change' }],
        liveCouponId: [{ required: true, message: '请选择加热优惠券', trigger: 'change' }],
        heatDuration: [
          { required: true, validator: validateHeatDuration, trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
      },
      heatTypeOption: [
        { label: '加热人气', value: 1, icon: 'hotPeopleNum' },
        { label: '加热下单', value: 2, icon: 'hotOrder' },
        { label: '加热领券', value: 3, icon: 'hotOrder' }
      ],
      typeOption: {
        1: '预计提升观众数',
        2: '预计提升下单热度',
        3: '预计提升领券热度'
      },
      upSectionOption: [
        { label: '100-200', value: 1, label2: '1-3', label3: '1-5', tips: '低' },
        { label: '200-300', value: 2, label2: '4-10', label3: '5-10', tips: '中' },
        { label: '300-500', value: 3, label2: '11-20', label3: '10-20', tips: '高' }
      ],
      timeoptions: [
        { label: '0.5小时', value: 30 },
        { label: '1小时', value: 60 },
        { label: '1.5小时', value: 90 },
        { label: '2小时', value: 120 },
        { label: '2.5小时', value: 150 },
        { label: '3小时', value: 180 }
      ],
      ifHeatIng: 0 // 正在加热的类型 0-未加热 1-未开始 2-加热中 3-加热结束
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    }),
    organizationId() {
      return getItem('orgInfo').organizationId
    },
    shareUser() {
      return getItem('UserInfo').userId
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.loading = true
          this.$nextTick(() => {
            this.init()
          })
        }
      },
      deep: true,
      immediate: true
    },
    'form.hotTime': {
      handler(val) {
        if (val <= 60) {
          this.form.upSection = 1
        } else if (val <= 120) {
          this.form.upSection = 2
        } else {
          this.form.upSection = 3
        }
      },
      immediate: true
    }
  },
  mounted() {
    // this.top = Math.abs(window.innerHeight - 638) / 2 + 'px'
  },
  methods: {
    selectGoods() {
      Dialog.open({
        visible: true,
        type: 'SelectGoods',
        liveRoomId: this.liveRoomId,
        select: this.form.goodsId,
        // value: this.showTimeLength,
        success: (res) => {
          this.form.goodsId = res.goodsId
          this.form.goodsImg = res.goodsImg
          this.form.goodsName = res.goodsName
          this.form.goodsType = res.goodsType
          this.form.goodsPromotionPrice = res.goodsType === 5 ? Number(res.goodsSpecPrice) : Number(res.goodsPromotionPrice)
          this.form.showQuota = res.showQuota
          this.form.showQuotaRadio = res.showQuotaRadio
          this.form.showQuotaVal = res.showQuotaVal
          // this.$notify.success({ title: '提示', message: '发送成功' })
          // this.showTimeLength = res?.showTimeLength / 60
          // Dialog.close()
        }
      })
    },
    selectLiveCoupon() {
      Dialog.open({
        visible: true,
        type: 'SelectCoupon',
        liveRoomId: this.liveRoomId,
        select: this.form.liveCouponId,
        success: (res) => {
          console.log(res, 'res')
          this.form.liveCouponId = res.liveCouponId
          this.form.coupon = res
        }
      })
    },
    init() {
      console.log(this.liveRoomId, 'liveRoomId')
      this.getDetail()
    },
    // 限制只能输入数字
    delNumber(e) {
      this.form.heatDuration = e.replace(/[^0-9]/g, '')
    },
    getDetail() {
      this.loading = true
      getLiveRoomHeatDetail(this.liveRoomId).then(res => {
        console.log(res, '直播间加热详情res')
        this.ifHeatIng = res.data.heatStatus
        console.log(this.liveStatus, 'this.liveStatus', this.liveStartTime)
        // 其他取当前时间
        // this.form.hotStartDay = moment().add(10, 's').format('YYYY-MM-DD')
        // this.form.hotStartTime = moment().add(10, 's').format('HH:mm:ss')

        // 取开播时间
        this.form.hotStartDay = moment(this.liveStartTime).format('YYYY-MM-DD')
        this.form.hotStartTime = moment(this.liveStartTime).format('HH:mm:ss')

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getOptionsValueByKey,
    sure() {
      // this.visible = false
      // this.success && this.success(this.value)
      if (!this.form.upSection) {
        return this.$message.error('请选择预计提升观众数')
      }
      if (this.form.heatType === 2 && !this.form.goodsId) {
        return this.$message.error('请选择直播间商品')
      }
      if (this.form.heatType === 3 && !this.form.liveCouponId) {
        return this.$message.error('请选择加热优惠券')
      }
      if (this.form.heatType === 2 || this.form.heatType === 3) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.loading = true
            let showQuota = this.form.showQuotaRadio
            if (this.form.showQuotaRadio === 1) {
              showQuota = Number(this.form.showQuotaVal)
            }
            const data = {
              heatType: this.form.heatType,
              liveRoomId: this.liveRoomId,
              liveCouponId: this.form.heatType === 3 ? this.form.liveCouponId : '',
              heatDuration: this.form.heatDuration,
              goodsId: this.form.heatType === 2 ? this.form.goodsId : '',
              upSection: this.form.upSection,
              showQuota: showQuota
            }
            createLiveRoomHeat(data).then(res => {
              console.log(res, 'res')
              // if (res)
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.visible = false
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
            // this.visible = false
            // this.success && this.success(this.value)
          } else {
            console.log('error submit!!')
            return false
          }
        })
        return
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // alert('submit!')
            this.loading = true
            const data = {
              heatDuration: this.form.hotTime,
              heatStartTime: this.form.hotStartDay + ' ' + this.form.hotStartTime,
              heatType: this.form.heatType,
              liveRoomId: this.liveRoomId,
              upSection: this.form.upSection
            }
            createLiveRoomHeat(data).then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
              this.visible = false
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
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    },
    onhandleSelect(item) {
      console.log(item)
      if (this.form.heatType === 1) {
        return
      }
      this.form.upSection = item.value
    },
    // 处理商品余额回显
    handleShowQuotaVal(data) {
      data.forEach((item) => {
        if (item.showQuota === -1 || item.showQuota === 0) {
          item.showQuotaRadio = item.showQuota
          item.showQuotaVal = ''
        } else if (item.showQuota > 0) {
          item.showQuotaRadio = 1
          item.showQuotaVal = item.showQuota
        }
      })
    },
    onhandleTypeChange(item) {
      console.log(item, 'item')
      this.form.heatType = item.value
      this.form.heatDuration = 1
      if (item.value !== 2) {
        this.form.upSection = 1
      } else {
        if (this.form.hotTime <= 60) {
          this.form.upSection = 1
        } else if (this.form.hotTime <= 120) {
          this.form.upSection = 2
        } else {
          this.form.upSection = 3
        }
      }
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()

      if (item.value === 2 && !this.form.goodsId) {
        const params = {
          liveRoomId: this.liveRoomId,
          pageSize: 1
        }
        getGoodsPage(params).then(res => {
          console.log(res, 'res')
          if (!this.form.goodsId && res.data && res.data.items.length > 0) {
            this.handleShowQuotaVal(res.data.items)
            const result = res.data.items[0]
            this.form.goodsId = result.goodsId
            this.form.goodsName = result.goodsName
            this.form.goodsImg = result.goodsImg
            this.form.goodsType = result.goodsType
            this.form.goodsPromotionPrice = result.goodsType === 5 ? Number(result.goodsSpecPrice) : Number(result.goodsPromotionPrice)
            this.form.showQuota = result.showQuota
            this.form.showQuotaRadio = result.showQuotaRadio
            this.form.showQuotaVal = result.showQuotaVal
          }
        })
      } else if (item.value === 3 && !this.form.liveCouponId) {
        const params = {
          liveRoomId: this.liveRoomId
        }
        liveRoomCouponList(params).then(res => {
          if (!this.form.liveCouponId && res.data && res.data.length > 0) {
            const result = res.data.find(v => v.status !== 0)
            console.log(result, 'result')
            if (result) {
              this.form.liveCouponId = result.liveCouponId
              this.form.coupon = result
            }
          }
        })
      }
    },
    // 商品余额显示
    delShowQuotaNumber(e, row) {
      if (e === '') {
        row.showQuotaVal = ''
        return
      }
      if (Number(e) < 1) {
        row.showQuotaVal = 1
        return
      }
      if (Number(e) > 999) {
        row.showQuotaVal = 999
        return
      }
      row.showQuotaVal = e.replace(/[^0-9]/g, '')
    }
  }
}
</script>

<style lang='scss' scoped>
.share-link{
  padding-left: 90px;
  padding-bottom: -10px;
  color: #1890ff;
}
.hotlive {
  // height: 520px;
  padding: 20px;
  .heatType {
    display: flex;
    .heatTypeView {
        width: 200px;
        height: 100px;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 2px 8px 0px rgba(150,150,150,0.3);
        border-radius: 10px;
        line-height: 100px;
        text-align: center;
        font-weight: 500;
        font-size: 16px;
        color: #333333;
        position: relative;
        cursor: pointer;
        .gouxuan {
            position: absolute;
            right: -2px;
            top: -2px;
            width: 24px;
            height: 22px;
        }
        .size-icon {
            font-size: 24px;
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
    }
    .heatTypeView + .heatTypeView {
        margin-left: 20px;
    }
    >.active {
        background: #F4FBFF;
        box-shadow: 0px 2px 8px 0px rgba(150,150,150,0.3);
        border-radius: 10px;
        border: 1px solid #00A3FF;
    }
  }
  .hotMsg {
    margin-top: 16px;
    .hotMsgTitle {
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 12px;
      color: #000000;
      line-height: 17px;
      text-align: left;
      margin-bottom: 8px;
    }
  }
  .hotBox {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #E7E7E7;
    padding: 20px;
    .hotBoxTitle {
      display: flex;
      align-items: center;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      line-height: 22px;
      text-align: right;
      font-style: normal;
      text-transform: none;
    }
    .upSection_box {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      .hotBoxItem {
        padding: 20px;
        width: 272px;
        height: 144px;
        background: #FFFFFF;
        box-shadow: 0px 2px 8px 0px rgba(150,150,150,0.3);
        border-radius: 10px;
        display: flex;
        position: relative;
        cursor: pointer;
        border-width: 1px;
        .hotBoxItem_content {
          flex: 1 0 0;
          .hotBoxItem_title {
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 16px;
            color: #000000;
            line-height: 22px;
            text-align: left;
            font-style: normal;
          }
          .hotBoxItem_title_Number {
            margin-top: 16px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
            font-size: 16px;
            color: #000000;
            line-height: 22px;
            text-align: center;
            font-style: normal;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .hotBoxItem_title_Number_time {
              width: 118px;
              height: 32px;
              text-align: center;
              background: #FFFFFF;
              border-radius: 4px;
              border: 1px solid #D8DCE6;
              font-weight: 400;
              font-size: 14px;
              color: #000000;
              line-height: 32px;
              font-style: normal;
              text-transform: none;
            }
          }
          .hotBoxItem_title_tips {
            margin-top: 16px;
          }
        }
        .gouxuan {
          width: 24px;
          height: 22px;
          position: absolute;
          right: -2px;
          top: -1px;
        }

      }
      .active {
        background: #F4FBFF;
        border-radius: 10px;
        border: 1px solid #00A3FF;
      }
      .bg-fff {
        width: 24px;
        height: 24px;
        color: #fff;
        background: #01A3FF;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
  }
  .goodsView {
    width: 200px;
    height: 112px;
    background: #fafafa;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    line-height: 20px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
      border: 1px solid #0c6fff;
    }
  }
}
.tips {
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #777777;
    line-height: 20px;
    text-align: justify;
    font-style: normal;
}
.tipsError {
  margin-bottom: 10px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #F53F3F;
  line-height: 22px;
}
.ifHeatIng {
  position: absolute;
  left: -1px;
  top: -1px;
  width: 65px;
  height: 22px;
  background: #FF7D00;
  border-radius: 9px 0px 6px 0px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  line-height: 22px;
  text-align: center;
  font-style: normal;
}
.disabledClick {
  cursor: not-allowed!important;
}
.goodsViewSetting {
  display: flex;
  align-items: center;
  .goodsSendSetting {
    border-radius: 10px;
    border: 1px solid #E7E7E7;
    padding: 20px;
    width: 280px;
    height: 112px;
    display: flex;
    flex-direction: column;
  }
  .showQuotaRadio-itemcenter {
    padding: 8px 0;
  }
   .showQuotaRadio-itemcenter ::v-deep .el-input__inner {
    padding: 0 0 0 10px;
  }
  .showQuotaRadio-itemcenter ::v-deep .el-input__inner::placeholder {
    font-size: 12px;
  }
  .showQuotaRadio-item ::v-deep .el-radio__label, .showQuotaRadio-itemcenter ::v-deep .el-radio__label{
    font-size: 13px !important;
  }
}
.goods-info-wrapper {
  width: 200px;
  height: 112px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  border: 1px solid #0c6fff;
  border-radius: 6px;
  overflow: hidden;
  .goods-info-detail {
    width: 200px;
    height: 100%;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    .titleOptions {
      display: flex;
      // width: 100%;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word;
      font-size: 14px;
      color: #353535;
      line-height: 23px;
      cursor: pointer;
    }
    .goods-info-Price {
      margin-left: 10px;
      font-size: 14px;
    }
  }
  .liveRoomPop-container {
    width: 100%;
    height: 100%;
    padding-bottom: 32px;
    display: flex;
    .liveRoomPop-img {
      width: 76px;
      height: 76px;
      min-width: 76px;
      min-height: 76px;
      border-radius: 2px;
      background: #fafafa;
    }
    .liveRoomPop-contant {
      margin-left: 16px;
      width: 100%;
    }
    .liveRoomPop-title {
      font-size: 15px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 550;
      color: #333333;
    }
    .coupons-content {
      font-size: 12px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #999999;
    }
  }
}
.maskdShow {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  height: 32px;
  background: #333333;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  .maskdShowText {
    flex: 1 0 0;
    cursor: pointer;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 32px;
    pointer-events: none;
  }
  .maskdAginText {
    pointer-events: auto;
  }
}
</style>
