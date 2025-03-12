<template>
  <!-- 顶部筛选栏 -->
  <div class="filterTop">
    <div class="filterTopLeft">
      <el-form ref="form" class="filter-module" :model="search" label-width="150px" size="small" :inline="true">
        <el-row>
          <el-form-item label="渠道平台">
            <el-select v-model="search.platformType" clearable placeholder="请选择" class="w-200" @change="sureSearch">
              <el-option
                v-for="(item) in thirdShopType"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="开放平台应用名称" prop="platformAccount">
            <el-input v-model="search.platformAccount" clearable class="w-200 m-r-10" />
          </el-form-item>

        </el-row>
        <el-row>
          <el-form-item label="归集接收地址url" prop="platformUrl">
            <el-input v-model="search.platformUrl" clearable class="w-200 m-r-10" />
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="filterTopRight">
      <el-button type="primary" size="small" @click="sureSearch">筛选</el-button>
      <el-button style="margin-left: 0px" class="m-t-20" size="small" @click="clear()">清空</el-button>
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
    ...mapGetters([
      'thirdShopType'
    ])
  },
  created() {
  },
  methods: {
    sureSearch() {
      this.$emit('search', this.search)
    },
    clear() {
      const res = {
        platformType: '',
        platformAccount: '',
        platformUrl: '',
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
</style>
