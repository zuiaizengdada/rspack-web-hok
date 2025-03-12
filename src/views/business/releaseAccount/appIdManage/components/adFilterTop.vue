<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-form-item label="开放平台">
        <el-select
          v-model="search.platformId"
          placeholder="请选择"
          clearable
          style="width: 100%"
          @change="onSearch"
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
      <el-form-item label="AppID名称">
        <el-input
          v-model.trim="search.applicationName"
          placeholder="请输入AppID名称"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item label="AppID">
        <el-input
          v-model.trim="search.applicationId"
          placeholder="请输入AppID"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
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
        >新增AppID</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getPlatformDropdown } from '@/api/advertisingKanBan'
export default {
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      launchPlatformOption: [],
      liveChannel: []
    }
  },
  mounted() {
    this.getPlatformDropdown()
  },
  methods: {
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
