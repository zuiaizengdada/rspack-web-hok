<template>
  <!-- 加热下单 -->
  <div class="page_wrap">
    <div v-loading="loading" class="liveToolGoods">
      <el-scrollbar
        ref="P5ScrollContainer"
        :vertical="false"
        class="liveToolGoods_scroll"
      >
        <div ref="formView" class="form">
          <el-form
            ref="form"
            label-position="left"
            :rules="rules"
            :model="form"
            size="mini"
          >
            <el-form-item label="选择加热商品" prop="goods">
              <div style="opacity: 0">占位内容</div>
              <div v-if="showScroll" class="pagination">
                <div class="previous_page page_btn" @click="onhandlePrevious" />
                <div class="next_page page_btn" @click="onhandleNext" />
              </div>
              <div
                ref="scrollView"
                class="goodsList"
                :style="`transform: translateX(${scrollStep}px)`"
              >
                <div
                  v-for="(item, index) in goodslist"
                  :key="index"
                  class="goodsItem"
                >
                  <goodsView
                    :item="item"
                    :active="item.goodsId === form.goods.goodsId"
                    @click.native="form.goods = item"
                  />
                </div>

                <div class="addGoods" @click="onhandleAddGoods">
                  <div class="addGoodsIcon">
                    <i
                      class="el-icon-circle-plus"
                      style="margin-right: 4px; font-size: 12px"
                    /><span>添加商品</span>
                  </div>
                </div>
              </div>
              <div class="goodsQuotaRadio">
                <el-radio-group
                  v-model="form.goods.showQuotaRadio"
                  class="hok-radio-group"
                >
                  <div style="display: flex; align-items: center">
                    <el-radio :label="-1">不限名额</el-radio>
                    <el-radio
                      :label="1"
                      style="display: flex; align-items: center"
                    >
                      <span class="m-r-10">限名额</span>
                      <el-input-number
                        v-model.trim="form.goods.showQuotaVal"
                        placeholder="最大输入999"
                        :max="999"
                        :min="1"
                        @focus="
                          () => {
                            form.goods.showQuotaRadio = 1
                          }
                        "
                      >
                        <!-- @input="delShowQuotaNumber($event, form.goods)" -->
                        <!--   <span slot="suffix">个</span> -->
                      </el-input-number>
                      <span class="pl-2">个</span>
                    </el-radio>
                    <el-radio :label="0">已抢光</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item
              label="停留时长"
              prop="hotStartDay"
              label-width="80px"
            >
              <div class="hotStartDay">
                <el-input
                  v-model.trim="form.hotStartDay"
                  style="width: 102px"
                  @input="e => delNumber('hotStartDay', e)"
                >
                  <span slot="suffix">分钟</span>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item prop="heatOrNot" label-width="0">
              <div class="switch">
                <span class="hotStartDayLabel">需要弹幕</span>
                <el-switch
                  v-model="form.heatOrNot"
                  active-color="#065CFF"
                  :width="30"
                />
                <span class="hotStartDayLabel" style="margin-left: 47px">
                  讲解中
                </span>
                <el-switch
                  v-model="form.explaining"
                  active-color="#065CFF"
                  :width="30"
                />
                <span class="hotStartDayLabel" style="margin-left: 47px">
                  热卖
                </span>
                <el-switch
                  v-model="form.saleHot"
                  active-color="#065CFF"
                  :width="30"
                />
                <el-input
                  v-model.trim="form.saleNum"
                  style="width: 78px; margin-left: 17px"
                  placeholder="数量"
                  @input="e => delNumber('saleNum', e)"
                />
              </div>
            </el-form-item>
            <el-form-item
              v-if="form.heatOrNot"
              label="预计提升下单量"
              prop="upSection"
              label-width="120px"
            >
              <div class="upSection">
                <div
                  v-for="item in upSectionOption"
                  :key="item.value"
                  :class="{ active: form.upSection === item.value }"
                  class="upSectionItem"
                  @click="onchangeUpSection(item)"
                >
                  {{ item.label }}
                </div>
              </div>
              <div class="form-tips">
                预计提升热度及时长仅供参考，系统智能推荐给潜在用户
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </div>
    <div class="footerBtn">
      <el-button class="footerBtnSure" :loading="loading" @click="sure">
        发送
      </el-button>
      <el-button
        class="footerBtnSure revoke"
        :loading="loading"
        @click="revoke"
      >
        撤回
      </el-button>
    </div>
  </div>
</template>

<script>
import goodsView from './goodsView.vue'
import { debounce } from '@/utils'
import {
  getGoodsPage,
  addLiveRoomGoods,
  withdrawPushGoods
} from '@/api/liveRoom/index.js'
import { liveRoomHeatCreate } from '@/api/liveRoom/liveRoom.js'
import { mapState } from 'vuex'
export default {
  name: 'LiveToolPlaceOrder',
  components: {
    goodsView
  },
  data() {
    var validateGoods = (rule, value, callback) => {
      if (!this.form.goods.goodsId) {
        return callback(new Error('请选择加热商品'))
      } else if (![-1, 1, 0].includes(this.form.goods.showQuotaRadio)) {
        return callback(new Error('请选择名额'))
      } else if (
        this.form.goods.showQuotaRadio === 1 &&
        !this.form.goods.showQuotaVal
      ) {
        return callback(new Error('请输入名额'))
      }
      callback()
    }
    var validateHeatOrNot = (rule, value, callback) => {
      if (this.form.saleHot && !this.form.saleNum) {
        return callback(new Error('请输入热卖数量'))
      }
      callback()
    }
    return {
      loading: false,
      form: {
        goods: {
          goodsId: '',
          goodsName: '',
          goodsImg: '',
          goodsPromotionPrice: '',
          showQuota: '',
          showQuotaRadio: '',
          showQuotaVal: ''
        },
        // 停留时长
        hotStartDay: '',
        heatOrNot: false, // 是否需要弹幕
        explaining: false, // 是否讲解中
        saleHot: false, // 是否热卖
        saleNum: '', // 热卖数量
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
        goods: [
          { required: true, validator: validateGoods, trigger: 'change' }
        ],
        hotStartDay: [
          { required: true, message: '请输入停留时长', trigger: 'change' }
        ],
        heatOrNot: [{ validator: validateHeatOrNot, trigger: 'change' }],
        upSection: [
          { required: true, message: '请选择预计提升下单量', trigger: 'blur' }
        ]
      },
      goodslist: [],
      scrollStep: 0,
      showScroll: false,
      liveRoomId: this.$route ? this.$route.params.id : '',
      maxWidth: 0,
      success: () => {},
      $_resizeHandler: null // 页面尺寸变化回调函数
    }
  },
  computed: {
    ...mapState({
      activeChangeType: state => state.im.activeChangeType
    })
  },
  watch: {
    activeChangeType: {
      handler(val) {
        if (val.type === 'GOODS_CHANGE') {
          this.getList()
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log('页面首次打开11111111111', this, this.liveRoomId)
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
    // 注册页面变化监听
    $_initResizeEvent() {
      window.addEventListener('resize', this.$_resizeHandler)
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.onSubmit()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击撤回
    revoke() {
      this.onhandleWithdraw()
    },
    onhandleWithdraw() {
      this.$delModal({
        tips: '确定撤回正在推送的商品?',
        success: () => {
          this.loading = true
          const data = {
            liveRoomId: this.liveRoomId
          }
          withdrawPushGoods(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    getList() {
      this.loading = true
      const data = {
        liveRoomId: this.liveRoomId,
        pageSize: 9999
      }
      getGoodsPage(data)
        .then(res => {
          console.log(res, '商品列表res')
          res.data?.items && this.handleShowQuotaVal(res.data.items)
          this.goodslist = res.data.items
          this.loading = false
          this.$nextTick(() => {
            if (this.$refs.scrollView) {
              this.showScroll =
                this.$refs.scrollView.scrollWidth >
                this.$refs.scrollView.clientWidth
              this.maxWidth =
                this.$refs.scrollView.scrollWidth -
                this.$refs.scrollView.clientWidth
            }
          })
          if (!this.form.goods.goodsId && this.goodslist.length > 0) {
            this.form.goods = this.goodslist[0]
          } else if (this.form.goods.goodsId) {
            this.form.goods = this.goodslist.find(
              f => f.goodsId === this.form.goods.goodsId
            )
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    pageInit() {
      this.$nextTick(() => {
        if (this.$refs.scrollView) {
          this.showScroll =
            this.$refs.scrollView.scrollWidth >
            this.$refs.scrollView.clientWidth
          this.maxWidth =
            this.$refs.scrollView.scrollWidth -
            this.$refs.scrollView.clientWidth
        }
      })
    },
    // 点击上一页
    onhandlePrevious() {
      this.scrollStep += 223
      if (this.scrollStep >= 0) {
        this.scrollStep = 0
        return
      }
    },
    // 点击下一页
    onhandleNext() {
      this.scrollStep -= 223
      if (Math.abs(this.scrollStep) > this.maxWidth) {
        this.scrollStep = 0 - this.maxWidth
        return
      }
    },
    // 点击添加商品
    onhandleAddGoods() {
      // 做禁选
      this.btnLoading = true
      const params = {
        liveRoomId: this.liveRoomId,
        pageIndex: this.pageIndex,
        pageSize: 1000
      }
      getGoodsPage(params)
        .then(res => {
          const check = res.data.items.reduce((pre, next) => {
            pre.push(next.goodsId)
            return pre
          }, [])
          this.$SelectGoods({
            visible: true,
            multiple: true,
            check,
            initSearch: {
              tagType: 5
            },
            tabList: [
              { id: '3', name: '普通专栏', api: '' },
              { id: '4', name: '大专栏', api: '' },
              { id: '5', name: '线下课', api: '' },
              { id: '7', name: '套餐课', api: '' },
              { id: '10', name: '直播课', api: '' }
            ],
            disabledFn: row => {
              console.log(row, 'row')
              if (row.specId) {
                const obj = res.data.items.find(v => {
                  return (
                    v.goodsSpecId === row.specId && v.goodsId === row.goodsId
                  )
                })
                return Boolean(obj)
              }
              return row.saleType === 0
            },
            currentId: '3',
            success: res => {
              console.log(res, 'res')
              this.loading = true
              const goodsInfoRequestList = res.reduce((pre, next) => {
                let goodsPrice = 0
                let goodsSpecPrice
                if (next.goodsType === 5 && next.onlineList.length > 0) {
                  goodsPrice = 0
                  // 线下课价格
                  const onlineListPrice = next?.onlineList
                    .map(item => item.salePrice)
                    .sort((a, b) => a - b)
                  onlineListPrice.length === 1
                    ? (goodsSpecPrice = `${onlineListPrice[0]}`)
                    : (goodsSpecPrice = `${onlineListPrice[0]},
                    ${onlineListPrice[onlineListPrice.length - 1]}`)
                } else if (next.goodsType !== 5) {
                  goodsPrice = next.salePrice
                }
                pre.push({
                  goodsId: next.goodsId,
                  goodsImg: next.coverUrl || next.contentUrl,
                  goodsName: next.contentName || next.goodsName,
                  goodsPrice: goodsPrice,
                  goodsPromotionPrice: goodsPrice,
                  goodsSpecId: next.specId || '',
                  goodsType: next.goodsType || 5,
                  goodsSpecPrice
                })
                return pre
              }, [])
              const data = {
                liveRoomId: this.liveRoomId,
                goodsInfoRequestList
              }
              addLiveRoomGoods(data)
                .then(res => {
                  this.loading = false
                  this.getList()
                })
                .catch(() => {
                  this.loading = false
                })
            }
          })
        })
        .catch(() => {
          this.loading = false
        })
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
    },
    // 提交
    onSubmit() {
      this.loading = true
      // 处理商品余额显示
      const showQuota = this.handleShowQuota()
      console.log(this.form.goods)
      const data = {
        explaining: this.form.explaining, // 讲解中开关
        goodsId: this.form.goods.goodsId, // 商品id
        name: this.form.goods.goodsName, // 商品名字
        heatDuration: this.form.hotStartDay, // 停留时长
        heatOrNot: this.form.heatOrNot, // 是否加热
        // heatStartTime: this.form.hotStartDay + ' ' + this.form.hotStartTime, // 加热开始时间
        heatType: 2, // 加热类型，1-加热人气 2-加热下单 3-加热领卷
        liveRoomId: this.liveRoomId,
        saleHot: this.form.saleHot,
        saleNum: this.form.saleNum,
        showQuota: showQuota,
        upSection: this.form.upSection
      }
      liveRoomHeatCreate(data)
        .then(() => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          // this.init()
          this.loading = false
          this.success && this.success()
        })
        .catch(err => {
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
    init() {
      this.$refs.form && this.$refs.form.resetFields()
    },
    onchangeUpSection(item) {
      this.form.upSection = item.value
      this.$refs.form.validateField('upSection')
    },
    // 处理商品余额回显
    handleShowQuotaVal(data) {
      data.forEach(item => {
        if (item.showQuota === -1 || item.showQuota === 0) {
          item.showQuotaRadio = item.showQuota
          item.showQuotaVal = ''
        } else if (item.showQuota > 0) {
          item.showQuotaRadio = 1
          item.showQuotaVal = item.showQuota
        }
      })
    },
    // 处理商品余额显示
    handleShowQuota() {
      const obj = this.goodslist.find(
        v => v.goodsId === this.form.goods.goodsId
      )
      console.log('obj------', obj)
      if (obj.showQuotaRadio === -1 || obj.showQuotaRadio === 0) {
        return obj.showQuotaRadio
      } else {
        return obj.showQuotaVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pl-2 {
  margin-left: 2px;
}
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .liveToolGoods {
    height: 100%;
    flex: 1 0 0;
    overflow: hidden;
    .liveToolGoods_scroll {
      height: 100%;
    }
  }
  .form {
    padding: 4px 15px 0 15px;
    .hotStartDay {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .switch {
      display: flex;
      align-items: center;
      .hotStartDayLabel {
        margin-right: 5px;
        color: #000000;
        font-family: 'Microsoft YaHei';
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
        background: #f7f7f7;
        color: #333333;
        text-align: center;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-weight: bold;
        line-height: 34px;
        margin-right: 10px;
        cursor: pointer;
      }
      .active {
        background: #deebff;
        color: #0c6fff;
      }
    }
    .form-tips {
      margin-top: 10px;
      color: #999999;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
    }
    .goodsList {
      display: flex;
      transition: transform 0.3s ease;
      padding-top: 4px;
      .addGoods {
        cursor: pointer;
        width: 213px;
        height: 56px;
        flex-shrink: 0;
        border-radius: 5px;
        border: 1px solid #f2f2f2;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        .addGoodsIcon {
          width: 86px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border-radius: 14.5px;
          background: #f7f7f7;
          color: #4a4a4a;
          font-family: 'Microsoft YaHei';
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
        }
        &:hover {
          color: #0c6fff;
          border-color: #0c6fff;
          .addGoodsIcon {
            color: #0c6fff;
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
    border-top: 1px solid #dcdee1;
    background: #fff;
    .footerBtnSure {
      width: 70px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #0c6fff;
      color: #fff;
      line-height: 32px;
      padding: 0;
    }
    .revoke {
      border: 1px solid #dcdfe5;
      background: #f9f9f9;
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
    border-top: 1px solid #f2f2f2;
  }
  .el-form-item__label {
    color: #000000;
    font-family: 'Microsoft YaHei';
    font-size: 14px;
    font-weight: bolder;
  }
  .goodsQuotaRadio {
    margin-top: 10px;
    .el-radio__label {
      display: flex;
      align-items: center;
      color: #000000;
      font-weight: bolder;
      font-size: 12px;
    }
    .el-radio {
      display: flex;
      align-items: center;
    }
    .el-input__suffix {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      right: 14px;
      line-height: 32px;
    }
    /* .el-input__inner {
      padding-left: 8px;
    } */
    input::-webkit-input-placeholder {
      color: #c2c6ce;
      font-size: 12px;
      font-weight: 400;
    }
  }
  .hotStartDay {
    .el-input__suffix {
      color: #000000;
      font-family: 'Microsoft YaHei';
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      right: 14px;
    }
  }
}
</style>
