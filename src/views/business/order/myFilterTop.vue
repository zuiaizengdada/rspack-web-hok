<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item label="订单搜索">
            <el-select v-model="search.order.label" placeholder="请选择" class="w-120">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model.trim="search.order.value" class="w-250 m-l-20" clearable @clear="sureSearch" @keyup.enter.native="sureSearch" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单时间">
            <div class="fl">
              <el-select v-model="search.time.label" placeholder="请选择" class="w-120">
                <el-option
                  v-for="item in optionsTime"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-date-picker
                v-model="search.time.value"
                class="w-250 m-l-20"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :unlink-panels="true"
              />
            </div>
          </el-form-item>
        </el-row>

        <el-row v-show="searchOpen" :key="1">
          <el-form-item label="订单状态">
            <el-select v-model="search.orderStatus" placeholder="请选择" class="w-200">
              <el-option
                v-for="item in orderStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="渠道平台">
            <el-select v-model="search.channelSource" placeholder="请选择" class="w-200" @change="channelSourceChange()">
              <el-option
                v-for="item in channelSourceType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="search.channelSource && search.channelSource !== 3" label="渠道来源">
            <el-input v-model="search.thirdShopName" disabled class="w-200 m-r-10" />
            <el-button type="primary" @click="selectThirdShop()">选择</el-button>
          </el-form-item>

          <el-form-item v-if="search.channelSource === 3" label="渠道来源">
            <el-select v-model="search.userTerminal" placeholder="请选择" class="w-200">
              <el-option
                v-for="item in optionsUserTerminal"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="支付方式">
            <el-select v-model="search.paymentType" placeholder="请选择" class="w-200">
              <el-option label="全部" value="" />
              <el-option v-for="item in paymentType_options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="售后状态">
            <el-select v-model="search.afterStatus" placeholder="请选择" class="w-200">
              <el-option
                v-for="item in afterStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="推广订单">
            <el-select v-model="search.payPromotion" placeholder="请选择" class="w-200">
              <el-option
                v-for="item in payPromotion"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="filterTopRight">
      <el-button type="primary" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" @click="clear()">清空</el-button>
    </div>

    <div class="fiterTopTagger">
      <el-button type="text" @click="searchOpen = !searchOpen">
        {{ searchOpen ? '收起' : '更多' }}
        <i class="el-icon-arrow-up btn_more" :class="{'btn_close': searchOpen}" />
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userTerminal } from '@/utils/enum'
export default {
  name: 'FilterTop',
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      options: [
        { label: '订单号', value: 'orderNo' },
        { label: '交易单号', value: 'transactionId' },
        { label: '商品名称', value: 'goodsName' },
        { label: '买家昵称', value: 'userName' },
        { label: '买家手机号', value: 'userPhone' },
        { label: '用户ID', value: 'userId' }
      ],
      optionsTime: [
        { label: '下单时间', value: 1 },
        { label: '入账时间', value: 2 }
      ],
      optionsUserTerminal: [
        { label: '全部', value: '' },
        ...userTerminal
      ],
      afterStatus: [
        { label: '全部', value: '' },
        { label: '未处理', value: '0' },
        { label: '退款中', value: 1 },
        { label: '已退款', value: 2 },
        { label: '已关闭', value: 3 },
        { label: '退款异常', value: 4 }
      ],
      payPromotion: [
        { label: '全部', value: '' },
        { label: '推广付费', value: 1 }
      ],
      orderStatus: [
        { label: '全部', value: '' },
        { label: '未支付', value: 1 },
        { label: '已完成', value: 2 },
        { label: '超时已关闭', value: 3 },
        { label: '用户已取消', value: 4 },
        { label: '退款中', value: 5 },
        { label: '部分退款', value: 6 },
        { label: '全部退款', value: 7 },
        { label: '退款异常', value: 8 }
      ],
      searchOpen: true
    }
  },
  computed: {
    ...mapGetters(['channelSourceType', 'paymentType_options'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  methods: {
    sureSearch() {
      this.search.current = 1
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        goodsName: '', // 商品名称
        orderStatus: '', // 订单状态
        orderType: '0', // 订单类型
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        paymentType: '', // 支付方式
        afterStatus: '', // 售后状态
        payPromotion: '', // 筛选推广
        use_collection: '', // 收款方式
        current: 1, // 当前页
        size: 10 // 每页条数
      }
      this.$emit('search', res)
    },
    selectThirdShop() {
      this.$Select({
        type: 'shop',
        visible: true,
        multiple: false,
        params: { type: this.search.channelSource },
        success: (res) => {
          const search = JSON.parse(JSON.stringify(this.search))
          search.thirdShopName = res.shopName
          search.thirdShopId = res.shopId
          this.$emit('search', search)
        }
      })
    },
    channelSourceChange() {
      const search = JSON.parse(JSON.stringify(this.search))
      search.thirdShopName = ''
      search.thirdShopId = ''
      this.$emit('search', search)
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  width: 100%;
  display: flex;
  position: relative;
  .filterTopLeft {
    flex: 1 0 0;
  }
  .filterTopRight {
    border-left: 1px solid  #E7E7E7;
    padding: 20px;
    width: 107px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  .fiterTopTagger {
    position: absolute;
    bottom: 0;
    left: 50%;
  }
}
.filter-module {
  padding: 16px;
  width: 100%;
}

.btn_ground {
  display: flex;
  margin-left: 8px;
  .btn {
    padding: 0 16px;
    color: #333;
    margin-right: 8px;
    margin-bottom: 0;
    float: left;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    border-color: #2A75ED;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
</style>
