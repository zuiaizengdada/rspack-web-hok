<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-form-item label="投放平台">
        <el-select
          v-model="search.platformId"
          placeholder="请选择"
          clearable
          style="width: 100%"
          @change="platformIdChange"
        >
          <el-option
            v-for="item in launchPlatformOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联AppID名称">
        <el-select
          v-model="search.oauthId"
          placeholder="请选择"
          clearable
          style="width: 100%"
          :disabled="!search.platformId"
          @change="onSearch"
        >
          <el-option
            v-for="(item, index) in applications"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
            {{ item.label }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账号名称">
        <el-input
          v-model.trim="search.advertiserName"
          placeholder="请输入账号名称"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item label="账号ID">
        <el-input
          v-model.trim="search.advertiserId"
          placeholder="请输入账号ID"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item label="账号类型">
        <el-select
          v-model="search.accountRole"
          placeholder="请选择"
          clearable
          style="width: 100%"
          @change="onSearch"
        >
          <el-option label="代理商" :value="1"> 代理商</el-option>
          <el-option label="店铺" :value="2"> 店铺</el-option>
          <el-option label="抖音" :value="3"> 抖音</el-option>
        </el-select>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button
            type="primary"
            size="small"
            @click="onSearch"
          >查询</el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="onhandleAdd"
        >新增账号</el-button>
        <el-button
          size="small"
          type="primary"
          @click="onhandlegoPage"
        >AppID管理</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  getPlatformDropdown,
  getApplicationDropdown
} from '@/api/advertisingKanBan'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {
          accountRole: '',
          advertiserId: '',
          advertiserName: '',
          oauthId: '',
          platformId: ''
        }
      }
    }
  },
  data() {
    return {
      launchPlatformOption: [],
      applications: [],
      liveChannel: []
    }
  },
  watch: {
    'search.advertiserId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.search, 'advertiserId', undefined)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getPlatformDropdown()
  },
  methods: {
    platformIdChange(val) {
      if (val) {
        this.$set(this.search, 'oauthId', undefined)
        this.getApplicationDropdown()
      } else {
        this.search.oauthId = undefined
        this.applications = []
      }
      this.onSearch()
    },
    async getApplicationDropdown() {
      const res = await getApplicationDropdown({
        platformId: this.search.platformId
      })
      if (res.code === 1) {
        this.applications = res.data.map(m => ({
          label: m.applicationName,
          value: m.oauthId
        }))
      }
    },
    async getPlatformDropdown() {
      const res = await getPlatformDropdown()
      if (res.code === 1) {
        this.launchPlatformOption = res.data.items.map(m => ({
          label: m.platformName,
          value: m.platformId
        }))
      }
    },
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
    // 跳转页面
    onhandlegoPage() {
      this.$emit('gopage')
    },
    // 点击选择
    handleSelect(item) {
      console.log(item)
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.filterTop {
  padding-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
  margin-bottom: 20px;
}
::v-deep {
  label {
    font-weight: 700;
    color: #333;
  }
}
</style>
