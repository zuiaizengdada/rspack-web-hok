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

        <template v-if="searchOpen">
          <el-row>
            <el-form-item label="渠道平台">
              <el-select v-model="search.channelSource" clearable placeholder="请选择" class="w-200" @change="clearData">
                <el-option
                  v-for="item in channelSourceType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item v-if="search.channelSource === 1 || search.channelSource === 2 || search.channelSource === 4" label="渠道来源">
              <el-input v-model="search.thirdShopName" disabled class="w-200 m-r-10" />
              <el-button type="primary" @click="selectThirdShop()">选择</el-button>
            </el-form-item>

            <el-form-item v-if="search.channelSource === 3" label="渠道来源">
              <el-select v-model="search.userTerminal" clearable placeholder="请选择" class="w-200">
                <el-option
                  v-for="item in optionsUserTerminal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="支付方式">
              <el-select v-model="search.paymentType" clearable placeholder="请选择" class="w-200">
                <el-option
                  v-for="item in paymentType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->
          </el-row>
          <!-- <el-row>
            <el-form-item label="跟进人员">
              <el-tag v-if="search.folowerId" closable @close="delFolower">{{ search.folowername }}</el-tag>
              <el-button v-else @click="selectUser">选择人员</el-button>
            </el-form-item>
          </el-row> -->
          <el-row>
            <el-form-item label="售后状态">
              <el-select v-model="search.afterSaleStatus" placeholder="请选择" class="w-200" clearable @change="sureSearch" @clear="sureSearch">
                <el-option
                  v-for="item in payPromotion"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="签到状态">
              <el-select v-model="search.signedIn" placeholder="请选择" clearable class="w-200">
                <el-option
                  v-for="item in orderStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="选择商品">
              <el-select v-model="search.goodsId" clearable placeholder="请选择" class="w-200" @change="toSearchClassData">
                <el-option
                  v-for="item in goods"
                  :key="item.goodsId"
                  :label="item.goodsName"
                  :value="item.goodsId"
                />
              </el-select>
            </el-form-item>

            <el-form-item v-if="classData.length > 0" label="选择期数">
              <el-select v-model="search.classId" clearable placeholder="请选择" class="w-200">
                <el-option
                  v-for="item in classData"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId"
                />
              </el-select>
            </el-form-item>
          </el-row>
        </template>
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
import { getClassDataByGoodId } from '@/api/liveDeliver'
import { userTerminal } from '@/utils/enum'
export default {
  name: 'FilterTop',
  // eslint-disable-next-line vue/require-prop-types
  props: ['search', 'goods'],
  data() {
    return {
      classData: [],
      options: [
        { label: '订单号', value: 'orderNo' },
        { label: '买家昵称', value: 'userName' },
        { label: '买家手机号', value: 'userPhone' },
        { label: '用户ID', value: 'userId' }
      ],
      optionsTime: [
        { label: '支付时间', value: 1 },
        { label: '签到时间', value: 2 }
      ],
      optionsUserTerminal: [
        { label: '全部', value: '' },

        ...userTerminal,
        { label: '线下课', value: 'OFFLINE' }
      ],
      paymentType: [
        { label: '全部', value: '' },
        { label: '微信', value: 1 },
        { label: '支付宝', value: 2 }
      ],
      orderStatus: [
        { label: '全部', value: '' },
        { label: '未签到', value: 0 },
        { label: '已签到', value: 1 }
      ],
      payPromotion: [
        { label: '全部', value: '' },
        { label: '可申请', value: 1 },
        { label: '申请中', value: 2 },
        { label: '已完成', value: 3 },
        { label: '用户关闭', value: 4 },
        { label: '超时关闭', value: 5 }
      ],
      searchOpen: true
    }
  },
  computed: {
    ...mapGetters([
      'channelSourceType'
    ])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  methods: {
    clearData() {
      this.search.thirdShopName = ''
      this.search.thirdShopId = ''
      this.search.userTerminal = ''
    },
    toSearchClassData() {
      const params = {
        goodsId: this.search.goodsId
      }
      getClassDataByGoodId(params).then(res => {
        if (res.code === 1) {
          this.classData = res.data
        }
      })
    },
    sureSearch() {
      this.search.current = 1
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        order: { label: 'orderNo', value: '' }, // 订单搜索
        time: { label: 1, value: ['', ''] }, // 订单时间
        afterSaleStatus: '', // 售后状态
        channelSource: '', // 渠道来源
        classId: '', // 班期Id
        className: '', // 班期名称
        current: 1, // 当前第几页
        startPayTime: '', // 支付开始时间
        endPayTime: '', // 支付结束时间
        startSignedTime: '', // 签到开始时间
        endSignedTime: '', // 签到结束时间
        goodsId: '', // 商品id
        orderNo: '', // 订单号
        signedIn: '', // 签到状态
        size: 10, // 每页显示条数
        userId: '', // 客户id
        userName: '', // 客户姓名
        userPhone: '', // 客户手机号
        userTerminal: '', // 用户终端
        thirdShopId: '',
        thirdShopName: ''
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
          search.current = 1
          search.thirdShopName = res.shopName
          search.thirdShopId = res.shopId
          this.$emit('search', search)
        }
      })
    },
    channelSourceChange() {
      const search = JSON.parse(JSON.stringify(this.search))
      search.current = 1
      search.thirdShopName = ''
      search.thirdShopId = ''
      this.$emit('search', search)
    },
    delFolower() {
      const search = JSON.parse(JSON.stringify(this.search))
      search.folowerId = ''
      search.folowername = ''
      search.current = 1
      this.$emit('search', search)
    },
    selectUser() {
      this.$AddressBook({
        visible: true,
        multiple: false,
        type: [1],
        success: (res) => {
          if (res.user.length > 0) {
            const search = JSON.parse(JSON.stringify(this.search))
            search.current = 1
            search.folowerId = res.user[0].userId
            search.folowername = res.user[0].userName
            this.$emit('search', search)
          }
        }
      })
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
