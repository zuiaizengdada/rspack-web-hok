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
        <el-row v-show="searchOpen" :key="1">
          <el-form-item label="渠道平台">
            <el-select v-model="search.channelSource" placeholder="请选择" clearable class="w-200" @change="channelSourceChange">
              <el-option
                v-for="item in thirdShopType"
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
        </el-row>
      </el-form>
    </div>
    <div class="filterTopRight">
      <el-button type="primary" :loading="search.loading" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" :loading="search.loading" @click="clear()">清空</el-button>
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
export default {
  name: 'FilterTop',
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      options: [
        { label: '获课商品名', value: 'contentName' }
      ],
      searchOpen: true
    }
  },
  computed: {
    ...mapGetters([
      'thirdShopType'
    ])
  },
  created() {
  },
  methods: {
    sureSearch() {
      this.search.current = 1
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        order: { label: 'contentName', value: '' }, // 订单搜索
        userTerminal: '', // 渠道来源
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        current: 1, // 当前页
        size: 10, // 每页条数
        loading: false
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
      console.log('123')
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
    // display: flex;
    // flex-direction: column;
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
