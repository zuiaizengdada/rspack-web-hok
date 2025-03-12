<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="auto" size="small" :inline="true">
      <el-form-item label="职位" label-width="3em">
        <el-select v-model="search.position" placeholder="请选择" class="w-200" clearable @change="onSearch" @clear="onSearch">
          <el-option label="全部" value="" />
          <el-option v-for="(value, key) in positionOption" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="出单场景">
        <el-select v-model="search.source" placeholder="请选择" class="w-200" clearable @change="onSearch" @clear="onSearch">
          <el-option label="全部" value="" />
          <el-option v-for="(value, key) in issueScenarioType" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="流量类型">
        <el-select v-model="search.classification" placeholder="请选择" class="w-200" clearable @change="onSearch" @clear="onSearch">
          <el-option label="全部" value="" />
          <el-option v-for="(value, key) in flowOption" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="商品价格">-->
      <!--        <el-select v-model="search.goodsPrices" multiple placeholder="请选择" class="w-200" clearable @change="onSearch" @clear="onSearch">-->
      <!--          <el-option v-for="(item) in priceOption" :key="item" :label="item" :value="item" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" size="small" @click="onSearch">查询</el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="onhandleAdd">新增规则</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { issueScenarioType, flowOption, positionOption } from './columns'
import { getGoodsPrices } from '@/api/order/performanceShare'
export default {
  components: {},
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          position: '', // 职位
          goodsPrices: [], // 商品价格,
          source: '', // 出单场景
          classification: '', // 流量类型
          liveType: '' // 直播类型
        }
      }
    }
  },
  data() {
    return {
      issueScenarioType,
      flowOption,
      positionOption,
      priceOption: []
    }
  },
  mounted() {
    this.getPriceOption()
  },
  methods: {
    // 点击查询按钮
    onSearch() {
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.$emit('onAdd')
    },
    getPriceOption() {
      getGoodsPrices().then(res => {
        this.priceOption = res.data
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.filterTop {
  padding-bottom: 20px;
  border-bottom: 1px solid #E7E7E7;
  margin-bottom: 20px;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
