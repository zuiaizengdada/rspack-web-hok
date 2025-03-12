<template>
  <div class="entry-box">
    <div class="crumbs-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/business/orderManage' }" class="nav-list">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item class="nav-add">{{ titleTxt }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="common-box">
      <div class="common-title">基本信息</div>
    </div>
    <div class="info-box">
      <div class="info-box-child">
        渠道:<span>线下录单</span>
      </div>
      <div class="info-box-child">
        成交来源：<span>{{ forms.channelLabel }}</span>
      </div>
      <div class="info-box-child">
        订单类型：<span>{{ orderType }}</span>
      </div>
      <div class="info-box-child">
        招生老师：<span>{{ forms.teacherName.name }}</span>
      </div>
    </div>
    <div v-if="orderType === '赠送' && (forms.orderNo || forms.giveParentOrderNo)" class="info-box">
      <div class="info-box-child">
        关联订单号：
        <span v-if="titleTxt === '新增订单确认'">{{ forms.orderNo }}</span>
        <span v-else>{{ forms.giveParentOrderNo }}</span>
      </div>
    </div>
    <div class="common-box">
      <div class="common-title">商品信息</div>
    </div>
    <div v-if="orderType === '预存'">
      <div class="table-box" style="margin-bottom: 20px;">
        <el-table
          :data="depositGoodsObj"
          style="width: 1200px;border-radius: 8px;border: 1px solid #E7E7E7;"
        >
          <el-table-column
            label="商品名称"
            width="300"
          >
            <template slot-scope="scope">
              <div class="table-img-box">
                <div class="table-img-box-l"><img :src="scope.row.coverVerticalUrl" alt="" /></div>
                <div class="table-img-box-r table-txt">{{ scope.row.contentName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品类型">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.goodsTypeName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品单价（元）" width="140">
            <span class="table-txt">0</span>
          </el-table-column>
          <el-table-column label="商品数量">
            <span class="table-txt">1</span>
          </el-table-column>
          <el-table-column label="优惠金额(元)">
            <span class="table-txt">0</span>
          </el-table-column>
          <el-table-column label="小计(元)">
            <span class="table-txt">0</span>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div v-else>
      <div v-for="(item,index) in forms.materialGoodsOrderVoList" :key="index" class="table-box">
        <el-table
          :data="item.goodsData"
          style="width: 100%;border-radius: 8px;border: 1px solid #E7E7E7;"
        >
          <el-table-column
            label="商品名称"
            width="330"
          >
            <template slot-scope="scope">
              <div class="table-img-box">
                <div class="table-img-box-l"><img :src="scope.row.image" alt="" /></div>
                <div class="table-img-box-r table-txt">{{ scope.row.goodsName }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品类型"
            width="180"
          >
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.goodsType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品规格序号" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.materialSpecVo" class="table-txt">{{ scope.row.materialSpecVo.content.sort }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="商品规格名称" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.materialSpecVo" class="table-txt">{{ scope.row.materialSpecVo.label }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="商品单价（元）">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.goodsPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品数量">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.goodsNum }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="orderType === '新购'" label="优惠金额" width="140">
            <template slot-scope="scope">
              <span class="table-txt">- {{ scope.row.goodsPreferentialPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计（元）" width="140">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.subtotal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠原因" width="350">
            <template slot-scope="scope">
              <span class="table-txt">{{ scope.row.preferentialDesc }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="table-box">
      <el-table
        :data="forms.goods.goodsData"
        style="width: 100%;border-radius: 8px;border: 1px solid #E7E7E7;"
      >
        <el-table-column
          label="商品名称"
          width="330"
        >
          <template slot-scope="scope">
            <div class="table-img-box">
              <div class="table-img-box-l"><img :src="scope.row.image" alt=""></div>
              <div class="table-img-box-r table-txt">{{ scope.row.goodsName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品类型"
          width="180"
        >
          <template slot-scope="scope">
            <span class="table-txt">{{ scope.row.goodsType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品单价（元）">
          <template slot-scope="scope">
            <span class="table-txt">{{ scope.row.goodsPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品数量">
          <template slot-scope="scope">
            <span class="table-txt">{{ scope.row.goodsNum }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="orderType === '新购'" label="优惠金额" width="140">
          <template slot-scope="scope">
            <span class="table-txt">- {{ scope.row.goodsPreferentialPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小计（元）" width="140">
          <template slot-scope="scope">
            <span class="table-txt">{{ scope.row.subtotal }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div> -->

      <div class="info-box">
        <div class="info-box-child">
          来源大6P：<span>{{ forms.sixpLabel }}</span>
        </div>
        <div class="info-box-child">
          私域场次：<span>{{ forms.sessions }}</span>
        </div>
        <div class="info-box-child">
          智能销售任务：<span>{{ forms.taskName }}</span>
        </div>
      </div>
      <div v-if="orderType === '赠送'" class="preferential-box">
        <div>赠送原因</div>
        <div class="preferential-info">{{ forms.giveDesc }}</div>
      </div>
      <div v-if="orderType === '赠送'" class="preferential-box m-t20">
        <div>赠单凭证</div>
        <div class="preferential-info preferential-info-flex">
          <div v-for="items in forms.givePhoto" :key="items.uid" class="img-box" @click="imageUrlArr(forms.givePhoto)">
            <el-image
              style="width: 120px;height: 90px;border-radius: 4px;"
              :src="items.url"
              fit="cover"
              :preview-src-list="imageUrlArray"
            />
          </div>
        </div>
      </div>
      <div v-if="forms.remarks && orderType !== '赠送'" class="preferential-box m-t20">
        <div>备注：</div>
        <div class="preferential-info">{{ forms.remarks }}</div>
      </div>
      <div v-if="forms.imageList && orderType !== '赠送'" class="preferential-box m-t20">
        <div>备注资料：</div>
        <div class="preferential-info preferential-info-flex">
          <div v-for="items in forms.imageList" :key="items.uid" class="img-box" @click="imageUrlArr(forms.imageList)">
            <el-image
              style="width: 120px;height: 90px;border-radius: 4px;"
              :src="items.url"
              fit="cover"
              :preview-src-list="imageUrlArray"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="orderType === '新购' || orderType === '预存'" class="common-box m-t32">
      <div class="common-title">交易信息</div>
    </div>
    <div v-if="orderType === '新购' || orderType === '预存'" class="water-box">
      <div v-for="item in lists" :key="item.id" class="water-child">
        <div class="water-title">交易流水{{ item.num }}</div>
        <div class="water-info">
          <div v-if="item.channel === optionsChannelValue" class="water-info-chid">
            <div class="water-info-chid-title">收款渠道：</div>
            <div class="water-info-chid-info">{{ item.channelLabel }}</div>
          </div>
          <div v-if="item.channel === optionsChannelValue" class="water-info-chid">
            <div class="water-info-chid-title">付款账号：</div>
            <div class="water-info-chid-info">{{ item.paymentUserPhone.indexOf('@')>0?'':'(+'+item.phoneAreaCode+') ' }}{{ item.paymentUserPhone }}</div>
          </div>
          <div v-if="item.channel === optionsChannelValue" class="water-info-chid">
            <div class="water-info-chid-title">扣款金额：</div>
            <div class="water-info-chid-info">¥{{ item.price }}</div>
          </div>
          <div v-if="item.channel != optionsChannelValue" class="water-info-chid">
            <div class="water-info-chid-title">收款渠道：</div>
            <div class="water-info-chid-info">{{ item.channelLabel }}</div>
          </div>
          <div v-if="item.channel != optionsChannelValue" class="water-info-chid">
            <div class="water-info-chid-title">收款单位：</div>
            <div class="water-info-chid-info">{{ item.unitLabel }}</div>
          </div>
          <div v-if="item.channel != optionsChannelValue" class="water-info-chid">
            <div class="water-info-chid-title">收款账号：</div>
            <div class="water-info-chid-info">{{ item.account }}</div>
          </div>

        </div>
        <div v-if="item.channel != optionsChannelValue" class="water-info">
          <div class="water-info-chid">
            <div class="water-info-chid-title">交易流水号：</div>
            <div class="water-info-chid-info">{{ item.serialNum }}</div>
          </div>
          <div class="water-info-chid">
            <div class="water-info-chid-title">交易时间：</div>
            <div class="water-info-chid-info">{{ item.time }}</div>
          </div>
          <div class="water-info-chid">
            <div class="water-info-chid-title">流水金额：</div>
            <div class="water-info-chid-info">¥{{ item.price }}</div>
          </div>
        </div>
        <div class="water-info">
          <div class="water-info-chid water-info-chid-img-list">
            <div class="water-info-chid-title">交易凭证：</div>
            <div class="water-info-chid-info water-info-chid-info-flex">
              <div v-for="items in item.imageUrl" :key="items.uid" class="img-box" @click="imageUrlArr(item.imageUrl)">
                <el-image
                  style="width: 120px;height: 90px;border-radius: 4px;"
                  :src="items.url"
                  fit="cover"
                  :preview-src-list="imageUrlArray"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="common-box m-t32">
      <div class="common-title">用户信息</div>
    </div>
    <div class="info-box">
      <div class="info-box-child">
        用户姓名：<span>{{ form.user.name }}</span>
      </div>
      <div v-if="form.userType === 'phone'" class="info-box-child">
        手机号码：<span>(+{{ form.user.phoneAreaCode }}) {{ form.user.phone }}</span>
      </div>
      <div v-if="form.userType === 'email'" class="info-box-child">
        邮箱号码：<span>{{ form.user.email }}</span>
      </div>
    </div>
    <div class="common-box m-t32">
      <div class="common-title">用户公司信息</div>
    </div>
    <div class="firm-box">
      <div class="firm-box-child">
        <div class="firm-box-child-title">公司名称：</div>
        <div class="firm-box-child-info">{{ form.firm.name || '--' }}</div>
      </div>
      <div class="firm-box-child">
        <div class="firm-box-child-title">职位：</div>
        <div class="firm-box-child-info">{{ form.firm.job || '--' }}</div>
      </div>
      <div class="firm-box-child">
        <div class="firm-box-child-title">所在行业：</div>
        <div class="firm-box-child-info"><span v-if="form.firm.industry">{{ form.firm.industry[0] || '--' }}</span></div>
      </div>
    </div>
    <div class="firm-box">
      <div class="firm-box-child">
        <div class="firm-box-child-title">年营业额：</div>
        <div class="firm-box-child-info">{{ form.firm.turnover || '--' }}</div>
      </div>
      <div class="firm-box-child">
        <div class="firm-box-child-title">主营业务：</div>
        <div class="firm-box-child-info">{{ form.firm.business || '--' }}</div>
      </div>
    </div>
    <div class="firm-box">
      <div class="firm-box-child">
        <div class="firm-box-child-title">公司地址：</div>
        <div class="firm-box-child-info"><span v-if="form.firm.firmAddress">{{ form.firm.firmAddress[0] }} {{ form.firm.firmAddress[1] }}  {{ form.firm.firmAddress[2] }} {{ form.firm.detailAddress }}</span></div>
      </div>
    </div>
    <div v-if="orderType === '新购'" class="pay-box">
      <div class="pay-child pay-font1 m-b8">
        <div class="pay-child-title">商品金额：</div>
        <div class="pay-child-num">¥{{ goodsAllPrice }}</div>
      </div>
      <div class="pay-child pay-font1 m-b16">
        <div class="pay-child-title">优惠金额：</div>
        <div class="pay-child-num">¥{{ allYouhuiPay }}</div>
      </div>
      <div class="pay-child pay-font2 m-b8">
        <div class="pay-child-title">应付金额：</div>
        <div class="pay-child-num">¥{{ amountPay }}</div>
      </div>
      <div class="pay-child pay-font2">
        <div class="pay-child-title">实付金额：</div>
        <div class="pay-child-num" :class="paidIn > 0 ?'price-num-green':''">¥{{ paidIn }}</div>
      </div>
    </div>
    <div v-if="orderType === '赠送'" class="pay-box">
      <div class="pay-child pay-font1" :class="orderType === '新购'? ' m-b8' :' m-b16'">
        <div class="pay-child-title">商品金额：</div>
        <div class="pay-child-num">¥{{ goodsAllPrice }}</div>
      </div>
      <div class="pay-child pay-font1 m-b16">
        <div class="pay-child-title">优惠金额：</div>
        <div class="pay-child-num">-¥{{ goodsAllPrice }}</div>
      </div>
      <div class="pay-child pay-font2 m-b8">
        <div class="pay-child-title">应付金额：</div>
        <div class="pay-child-num">¥0.00</div>
      </div>
      <div class="pay-child pay-font2">
        <div class="pay-child-title">实付金额：</div>
        <div class="pay-child-num">¥0.00</div>
      </div>
    </div>
    <div v-if="orderType === '预存'" class="pay-box">
      <div class="pay-child pay-font2 m-b8">
        <div class="pay-child-title">实付金额：</div>
        <div class="pay-child-num">¥{{ paidMoneyNumber }}</div>
      </div>
    </div>
    <div class="foot-box">
      <el-button type="primary" size="medium" :disabled="submitFlag" @click="debounceMethods(submitOK)">提交审核</el-button>
      <el-button size="medium" @click="submitNO()">返回修改</el-button>
    </div>
    <tipsModal ref="tipsModalRef" :amount-pay="amountPay" :paid-in="paidIn" @submit="submitData" />
  </div>
</template>

<script>
import mixin from '../../debounce'
import { parseTime } from '@/utils/index'
import tipsModal from '@/views/business/orderManage/components/confirmOrder/tipsModal'
export default {
  name: 'SearchTop',
  components: {
    tipsModal
  },
  mixins: [mixin],
  // eslint-disable-next-line vue/require-prop-types
  props: {
    titleTxt: {
      type: String,
      default: '新增订单确认'
    },
    submitFlag: {
      type: Boolean,
      default: false
    },
    paidMoneyNumber: {
      type: Number,
      default: 0
    },
    allYouhuiPay: {
      type: String,
      default: '0.00'
    },
    optionsChannelValue: {
      type: String,
      default: ''
    },
    goodsAllPrice: {
      type: String,
      default: '0.00'
    },
    orderType: {
      type: String,
      default: ''
    },
    giftType: {
      type: String,
      default: ''
    },
    amountPay: {
      type: String,
      default: ''
    },
    paidIn: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    },
    depositGoodsObj: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      forms: {},
      lists: [],
      imageUrlArray: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
  },
  watch: {
    form: {
      handler(val) {
        console.log(val, '更新')
        val['channelLabel'] = val.channelName === 8 ? '博商销售成交' : '获客线下收款'
        val['sixpLabel'] = val.sixp === 1 ? '是' : '否'
        /* val.goods.goodsData.map(v => {
          const price = v.goodsPrice > 0 ? Number(v.goodsPrice) * v.goodsNum : 0
          const discountsFee = v.goodsPreferentialPrice > 0 ? Number(v.goodsPreferentialPrice) : 0
          v['subtotal'] = (price - discountsFee).toFixed(2)
        }) */
        val.materialGoodsOrderVoList.some(item => {
          item.goodsData.some(obj => {
            const price = obj.goodsPrice > 0 ? Number(obj.goodsPrice) * obj.goodsNum : 0
            const discountsFee = obj.goodsPreferentialPrice > 0 ? Number(obj.goodsPreferentialPrice) : 0
            obj.subtotal = (price - discountsFee).toFixed(2)
          })
        })
        this.forms = val
      },
      deep: true,
      immediate: true
    },
    list: {
      handler(val) {
        console.log(val, 'val')
        val.map(v => {
          v.time = parseTime(new Date(v.time).getTime(), '{y}-{m}-{d} {h}:{i}:{s}')
          v.optionsUnit.map(e => {
            e.id === v.unit ? v['unitLabel'] = e.label : ''
          })
        })
        this.lists = val
        console.log(val, 'list更新')
      },
      deep: true,
      immediate: true
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    submitOK() {
      if (this.orderType === '预存') {
        this.$emit('submitOK', '')
      } else {
        if (Number(this.paidIn) > Number(this.amountPay)) {
          this.$refs.tipsModalRef.show()
        } else {
          this.$emit('submitOK', '')
        }
      }
    },
    submitData() {
      this.$emit('submitOK', '')
    },
    submitNO() {
      this.$emit('submitNO', '')
    },
    imageUrlArr(e) {
      const imageUrlArray = []
      e.map(e => {
        imageUrlArray.push(e.url)
      })
      this.imageUrlArray = imageUrlArray
    }
  }
}
</script>

<style lang="scss" scoped>
  .entry-box {
    padding: 20px;
    background: #FFFFFF;
    border-radius: 10px;
    .crumbs-box {
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #EFF2F6;
    }
    .common-box {
      .common-title {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        position: relative;
        padding-left: 12px;
        margin-bottom: 16px;
        &:before {
          position: absolute;
          content: '';
          width: 4px;
          height: 24px;
          background: #0C6FFF;
          border-radius: 6px;
          top: 0;
          left: 0;
        }
      }
    }
    .info-box {
      display: flex;
      margin-bottom: 32px;
      .info-box-child {
        width: 33.33%;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        color: #777777;
        span {
          font-size: 14px;
          display: inline-block;
          margin-left: 8px;
          font-family: MicrosoftYaHei;
          color: #333333;
        }
      }
    }
    .order-list {
      background: #FFFFFF;
      // border-radius: 8px;
      // border: 1px solid #E7E7E7;
    }
    .table-box {
      background: #FFFFFF;
      margin-bottom: 16px;
      .table-img-box {
        display:  flex;
        align-items: center;
        .table-img-box-l {
          width: 64px;
          height: 64px;
          img {
              width: 100%;
              height:  100%;
              border-radius: 6px;
              object-fit: cover;
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
        display:-webkit-box;
        text-overflow:ellipsis;
        overflow:hidden;
        -webkit-line-clamp: 3;
        -webkit-box-orient:vertical;
      }
      .table-txt-del {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #F53F3F;
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
    .preferential-box {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      .preferential-info {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
        margin-top: 8px;
        .img-box {
          width: 120px;
          height: 90px;
          border-radius: 4px;
          margin-right: 10px;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .preferential-info-flex {
        display: flex;
      }
    }
    .water-box {
      .water-child {
        padding: 16px 12px;
        background: #F7FBFF;
        border-radius: 8px;
        margin-top: 16px;
        .water-title {
          font-size: 16px;
          font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
          font-weight: bold;
          color: #333333;
        }
        .water-info {
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
          display: flex;
          margin-top: 20px;
          .water-info-chid {
            width: 33.33%;
            display: flex;
            .water-info-chid-title {
              width: 100px;
              text-align: right;
            }
            .water-info-chid-info {
              font-size: 14px;
              font-family: MicrosoftYaHei;
              color: #333333;
              .img-box {
                width: 120px;
                height: 90px;
                border-radius: 4px;
                margin-right: 10px;
                cursor: pointer;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .water-info-chid-info-flex {
              display: flex;
            }
          }
          .water-info-chid-img-list {
            width: 100%;
          }
        }
      }
    }
    .firm-box {
      display: flex;
      .firm-box-child {
        display: flex;
        width: 33.33%;
        margin-bottom: 20px;
        .firm-box-child-title {
          white-space:nowrap;
          width: 80px;
          text-align: right;
          font-size: 16px;
          font-family: MicrosoftYaHei;
          color: #777777;
        }
        .firm-box-child-info {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #333333;
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
                color: #00B42A;
            }
            .price-num-blue {
                color: #0C6FFF;
            }
            .price-num-red {
                color: #F53F3F;
            }
        }
        .price-tomast {
            text-align: right;
            font-size: 12px;
            font-family: MicrosoftYaHei;
            color: #F53F3F;
        }
    }
    .pay-box {
      .pay-child {
        display: flex;
        justify-content: flex-end;
      }
      .pay-font1 {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #777777;
      }
      .pay-font2 {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
      }
      .pay-child-title {
        width: 80px;
        text-align: right;
      }
      .price-num-green {
        color: #00B42A;
      }
      .price-num-blue {
        color: #0C6FFF;
      }
      .price-num-red {
        color: #F53F3F;
      }
    }

    .foot-box {
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
  }
  // main end
  .nav-list ::v-deep  .el-breadcrumb__inner {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold !important;
      color: #777777;
  }
  .nav-add ::v-deep  .el-breadcrumb__inner {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold !important;
      color: #333333;
  }
  ::v-deep .el-icon-arrow-right {
      font-size: 7px !important;
      color: #A9A9A9 !important;
  }
  // crumbs end
  ::v-deep .el-form-item__label {
      min-width: 100px !important;
      // width: 70px !important;
  }
  .el-form-item.el-form-item--medium {
      display: flex;
      justify-content: flex-start;
  }
  .form-box ::v-deep .el-form-item__content {
      margin: 0 !important;
  }
  .table-box ::v-deep .el-table th.el-table__cell {
      background: #F3F3F3;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
  }
  .table-in ::v-deep .el-input__inner{
      width: 92px;
  }
  // table end

  ::v-deep .el-input__inner{
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
  .m-t32 {
    margin-top: 32px;
  }
  .m-b20 {
      margin-bottom: 20px;
  }
  .m-b8 {
    margin-bottom: 8px;
  }
  .m-b16 {
      margin-bottom: 16px;
  }
  .no-txt {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #F53F3F;
      margin: 16px 0 32px 0;
  }
  .ok-txt {
      font-size: 16px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #00B42A;
      margin: 16px 0 32px 0;
  }
  .button-h32 {
      height: 32px;
  }
  .w-200 ::v-deep .el-input__inner{
      width: 200px;
  }
  .w-296 ::v-deep .el-input__inner{
      width: 296px;
  }
  ::v-deep .el-input-number--medium{
      width: 296px;
  }
  .w-496 ::v-deep .el-input__inner{
      width: 496px;
  }
  .m-t10 {
    margin-top: 10px;
  }
</style>
