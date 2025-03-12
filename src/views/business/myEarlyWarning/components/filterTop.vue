<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="query" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item label="字段查询">
            <el-input
              v-model="query.value"
              clearable
              size="small"
              style="width: 300px"
              placeholder="请输入"
              class="filter-input"
              @keyup.enter.native="sureSearch"
              @clear="sureSearch"
            >
              <el-select slot="prepend" v-model="active" size="small" @change="handleSelectChange">
                <el-option v-for="(item, index) in options" :key="index" :label="item" :value="index" />
              </el-select>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="订单时间">
            <el-date-picker
              v-model="time"
              class="filter-item"
              type="daterange"
              size="small"
              placeholder="请选择申请时间"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleChangeDate"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="售后状态">
            <el-select
              v-model="query.afterSaleStatus"
              clearable
              placeholder="请选择售后状态"
              size="small"
              style="width: 200px"
              class="filter-item"
            >
              <el-option v-for="(item, index) in afterSalestatusType" :key="item" :label="item" :value="+index" />
            </el-select>
          </el-form-item>
          <el-form-item label="预警状态">
            <el-select
              v-model="query.warningOrderStatus"
              clearable
              placeholder="请选择预警状态"
              size="small"
              class="filter-item"
            >
              <el-option v-for="(item, index) in warningOrderStatusType" :key="item" :label="item" :value="+index" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row v-show="searchOpen" :key="1">
          <el-form-item label="渠道平台">
            <el-select
              v-model="query.channelSource"
              clearable
              placeholder="请选择"
              class="w-200"
              @change="channelSourceChange()"
            >
              <el-option v-for="(item) in channelSourceType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="query.channelSource && query.channelSource !== 3"
            label="渠道来源"
          >
            <el-input v-model="query.thirdShopName" disabled class="w-200 m-r-10" />
            <el-button type="primary" @click="selectThirdShop()">选择</el-button>
          </el-form-item>

          <el-form-item v-if="query.channelSource === 3" label="渠道来源">
            <el-select v-model="query.userTerminal" placeholder="请选择" class="w-200" clearable>
              <el-option
                v-for="item in optionsUserTerminal"
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
        <i class="el-icon-arrow-up btn_more" :class="{ btn_close: searchOpen }" />
      </el-button>
    </div>
  </div>
</template>

<script>
const options = {
  orderNo: '订单号',
  transactionId: '交易单号',
  name: '买家昵称',
  userPhone: '买家手机号',
  userId: '用户ID',
  goodsName: '商品名称'
}
import { mapGetters } from 'vuex'
import {
  // channelSourceType,
  afterSalestatusType,
  warningOrderStatusType
} from '../columns.js'
import { userTerminal } from '@/utils/enum'
export default {
  name: 'FilterTop',
  // eslint-disable-next-line vue/require-prop-types
  data() {
    return {
      options,
      time: null,
      searchOpen: true,
      // channelSourceType,
      afterSalestatusType,
      warningOrderStatusType,
      active: 'orderNo',
      optionsUserTerminal: [
        { label: '全部', value: '' },
        ...userTerminal
      ],
      query: {
        afterSaleStatus: '',
        afterSaleEndTime: '',
        afterSaleStartTime: '',
        warningOrderStatus: '',
        value: undefined,
        thirdShopName: '',
        thirdShopId: '',
        userTerminal: ''
      }
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  methods: {
    sureSearch() {
      const params = this.query
      params[this.active] = this.query.value
      this.$emit('search', {
        ...params,
        value: undefined
      })
    },
    handleSelectChange() {
      this.query.value = ''
      for (const key in options) {
        this.query[key] = ''
      }
    },
    clear() {
      this.query = {
        afterSaleStatus: '',
        afterSaleEndTime: '',
        afterSaleStartTime: '',
        warningOrderStatus: '',
        value: undefined,
        thirdShopName: '',
        thirdShopId: '',
        userTerminal: ''
      }
      this.$emit('search')
    },
    handleChangeDate() {
      if (!this.time) return
      this.query.afterSaleStartTime = this.time[0]
      this.query.afterSaleEndTime = this.time[1]
    },
    selectThirdShop() {
      this.$Select({
        type: 'shop',
        visible: true,
        multiple: false,
        params: { type: this.query.channelSource },
        success: (res) => {
          this.query.thirdShopName = res.shopName
          this.query.thirdShopId = res.shopId
        }
      })
    },
    channelSourceChange() {
      this.query.thirdShopName = ''
      this.query.thirdShopId = ''
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
    border-left: 1px solid #e7e7e7;
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

.el-input.filter-input .el-select {
  width: 100px;
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
    border-color: #2a75ed;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
</style>
