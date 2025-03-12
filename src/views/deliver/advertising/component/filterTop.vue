<template>
  <!-- 顶部搜索栏 -->
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="支付流水号">
            <el-input v-model.trim="search.transactionId" placeholder="请输入" clearable @keyup.enter.native="$emit('searchFn')" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="支付时间">
            <el-date-picker
              v-model="search.payTime"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码">
            <el-input
              v-model.trim="search.phone"
              placeholder="请输入"
              clearable
              el-form-item
              @keyup.enter.native="$emit('searchFn')"
              @input="(e) => delNoNumber(e)"
            /></el-form-item></el-col>
        <el-col :span="6">
          <el-form-item label="获课订单ID">
            <el-input
              v-model.trim="search.orderNo"
              placeholder="请输入"
              clearable
              el-form-item
              @keyup.enter.native="$emit('searchFn')"
            /></el-form-item></el-col>
      </el-row>
      <el-row v-if="show" :gutter="20">
        <el-col :span="6">
          <el-form-item label="渠道">
            <el-select v-model="search.channelSource" style="width: 100%" clearable placeholder="请选择">
              <el-option value="" label="全部" />
              <el-option v-for="(item) in channelsource" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="投放平台">
            <el-select v-model="search.adPlatformId" style="width: 100%" clearable placeholder="请选择">
              <el-option v-for="(item) in adPlatformSimpleList" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否退款">
            <el-select v-model="search.refundFlag" style="width: 100%" clearable placeholder="请选择">
              <el-option :value="1" label="否" />
              <el-option :value="2" label="是" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="课程名称">
            <el-input v-model.trim="search.goodsName" placeholder="请输入" clearable @keyup.enter.native="$emit('searchFn')" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label-width="0px">
        <el-row :gutter="20" class="filterFooter" type="flex" justify="center">
          <el-col :span="18">
            <el-button size="small" type="primary" @click="handleClickSearch">查询</el-button>
            <el-button size="small" @click="clear">重置</el-button>
            <!-- <el-button size="medium" type="text" @click="show = !show">
              {{ show ? '收起' : '更多' }}
              <i class="el-icon-arrow-up btn_more" :class="{ btn_close: show }" />
            </el-button> -->
          </el-col>
          <el-col :span="6" class="custom">
            <CustomTabelHeader :columns="columns" v-bind="$attrs" v-on="$listeners" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CustomTabelHeader from './CustomTabelHeader'
import { mapGetters } from 'vuex'
export default {
  components: {
    CustomTabelHeader
  },
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          transactionId: '',
          payTime: '',
          phone: '',
          orderNo: '',
          channelSource: '',
          adPlatformId: '',
          refundFlag: '',
          goodsName: ''
        }
      }
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: true,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters(['channelsource', 'adPlatformSimpleList'])
  },
  created() {
    this.$store.dispatch('option/getConfigChannelsource')
    this.$store.dispatch('option/getAdPlatformSimpleList')
  },
  mounted() {},
  methods: {
    delNoNumber(e) {
      this.search.phone = e.replace(/[^0-9]/g, '')
    },
    clear() {
      console.log('点击重置')
      this.$emit('clear')
    },
    handleClickSearch() {
      this.$emit('searchFn')
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
    margin-top: 16px;
    margin-bottom: 20px;
    border-bottom: 1px solid #E7E7E7;
    .filterFooter {
        .custom {
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .filterBottom {
          display: flex;
          align-items: center;
        }
    }
}
.btn_close {
  transform: rotate(180deg);
}
::v-deep {
  .tearchInput {
    width: 100%;
  }
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
