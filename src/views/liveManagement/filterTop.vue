<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item label="直播搜索">
            <el-select v-model="search.live.label" placeholder="请选择" class="w-120">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input v-model.trim="search.live.value" class="w-250 m-l-20" />
          </el-form-item>
        </el-row>
        <el-row />

        <el-row v-show="searchOpen" :key="1">
          <el-form-item label="直播模式">
            <el-select v-model="search.liveMode" placeholder="请选择" class="w-200" clearable>
              <el-option
                v-for="item in liveMode"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="直播状态">
            <el-select v-model="search.state" placeholder="请选择" class="w-200" clearable>
              <el-option
                v-for="item in liveStatusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="上架状态">
            <el-select v-model="search.shelveFlag" placeholder="请选择" class="w-200" clearable>
              <el-option
                v-for="item in liveTypeOption"
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
export default {
  name: 'FilterTop',
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      options: [
        { label: '直播名称', value: 'liveName' }
      ],
      searchOpen: true
    }
  },
  computed: {
    ...mapGetters([
      'liveMode',
      'channelSourceType',
      'liveStatusOption',
      'liveTypeOption'
    ])
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
        live: { label: 'liveName', value: '' }, // 订单搜索
        liveMode: '', // 直播模式
        status: '', // 直播状态
        shelveFlag: '' // 上架状态
      }
      this.$emit('search', res)
    }
    // channelSourceChange() {
    //   const search = JSON.parse(JSON.stringify(this.search))
    //   search.thirdShopName = ''
    //   search.thirdShopId = ''
    //   this.$emit('search', search)
    // }
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
    blive-left: 1px solid  #E7E7E7;
    padding: 20px;
    width: 107px;
    box-sizing: blive-box;
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
    blive-radius: 4px;
    blive: 1px solid #dcdfe6;
    background: #fff;
    cursor: pointer;
  }
  .active {
    blive-color: #2A75ED;
  }
}
.btn_more {
  transition: all 0.4s;
}
.btn_close {
  transform: rotate(180deg);
}
</style>
