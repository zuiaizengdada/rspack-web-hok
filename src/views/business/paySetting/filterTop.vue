<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="80px" size="small" :inline="true">
        <el-row>
          <el-form-item label="订单搜索">
            <m-select v-model="search.order.label" dict-key="OERDER_TYPE" class="w-120" />
            <el-input v-model.trim="search.order.value" class="w-250 m-l-20" clearable />
          </el-form-item>

          <el-form-item label="申请时间">
            <el-date-picker
              v-model="search.time"
              class="w-250 m-l-20"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :unlink-panels="true"
            />
          </el-form-item>

          <el-form-item label="售后状态">
            <m-select v-model="search.status" dict-key="ORDER_STATUS" class="w-200" :multiple="true" />
          </el-form-item>

          <el-form-item label="渠道平台">
            <m-select v-model="search.channelSource" :dict-list="channelSourceType" class="w-200" />
          </el-form-item>
          <!-- <el-form-item style="float:right">
            <el-button type="text" @click="searchOpen = !searchOpen">
              {{ searchOpen ? '收起' : '更多' }}
              <i class="el-icon-arrow-up btn_more" :class="{'btn_close': searchOpen}" />
            </el-button>
          </el-form-item> -->
        </el-row>

        <el-row v-show="searchOpen" :key="1">
          <!-- <el-form-item label="售后状态">
            <el-select v-model="search.use_collection" placeholder="请选择" class="w-200">
              <el-option
                v-for="item in use_collection"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        </el-row>

        <!-- <el-row type="flex" justify="end">
          <el-form-item>
            <el-button type="primary" @click="sureSearch">筛选</el-button>
            <el-button icon="el-icon-refresh" @click="clear()">清空</el-button>
          </el-form-item>
        </el-row> -->
      </el-form>
    </div>

    <div class="filterTopRight">
      <el-button type="primary" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" @click="clear()">清空</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      searchOpen: false
    }
  },
  computed: {
    ...mapGetters(['channelSourceType'])
  },
  created() {
    this.$store.dispatch('option/getChannelsourceType')
  },
  methods: {
    channelSourceChange() {
      const obj = {
        ...this.search,
        current: 1,
        size: 10
      }
      this.$emit('search', obj)
    },
    sureSearch() {
      this.search.current = 1
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        order: { label: 'orderNo', value: '' },
        time: ['', ''],
        status: '',
        current: 1,
        size: 10,
        loading: false
      }
      this.$emit('search', res)
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
  // min-width: 1122px;
  // background-color: #f5f7fa;
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
.w-120{
  width:120px !important;
}
</style>
