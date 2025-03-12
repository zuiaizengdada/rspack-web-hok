<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" size="small" :inline="true">
      <el-row>
        <el-form-item label="投放平台:" label-width="5em">
          <span>{{ search.adPlatform }}</span>
        </el-form-item>
        <el-form-item label="账号ID:" label-width="6em">
          <span>{{ search.accountParent }}</span>
        </el-form-item>
        <el-form-item label="账号类型:" label-width="6em">
          <span>{{ search.accountRoleName }}</span>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-form-item label="投放账号ID" label-width="6em">
            <el-input
              v-model.trim="search.advertiserId"
              placeholder="请输入投放账号ID"
              class="w-200"
              clearable
              maxlength="30"
              @clear="handleSearch"
            />
          </el-form-item>
          <el-form-item label="业绩区分" label-width="5em">
            <el-select
              v-model="search.discriminate"
              placeholder="请选择"
              clearable
              style="width: 100%"
              @change="handleSearch"
            >
              <el-option
                v-for="(item, index) in discriminateOption"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联员工" label-width="5em">
            <el-select
              v-model="search.staffId"
              class="select"
              placeholder="请选择关联员工"
              filterable
              :filter-method="getUserByName"
              clearable
              style="width: 90%"
              @clear="clearUser"
              @change="handleSearch"
            >
              <el-option
                v-for="item in userList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号类型">
            <el-select
              v-model="search.accountType"
              placeholder="请选择"
              clearable
              style="width: 100%"
              @change="handleSearch"
            >
              <el-option label="运营团队" :value="0"> 运营团队</el-option>
              <el-option label="直播团队" :value="1"> 直播团队</el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-permission="['web:systemMenu:putInType', permsList]" label="投放类型">
            <el-select
              v-model="search.deliveryType"
              placeholder="请选择"
              clearable
              style="width: 100%"
              @change="handleSearch"
            >
              <el-option label="自投" :value="0">自投</el-option>
              <el-option label="代投" :value="1">代投</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleClear">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getPlatformDropdown, getUserByName } from '@/api/advertisingKanBan'
import { discriminateOption } from './columns.js'
export default {
  components: {},
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
      permsList: this.$route.meta.permsList || [],
      discriminateOption,
      launchPlatformOption: [],
      userList: []
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
    // this.getPlatformDropdown()
    this.$nextTick(() => {
      if (!this.search.platformId) {
        return
      }
    })
  },
  methods: {
    clearUser() {
      this.search.userId = undefined
    },
    async getUserByName(val) {
      const res = await getUserByName({ userName: val || undefined })
      if (res.code === 1) {
        this.userList = res.data.map(m => ({
          label: m.nickName,
          value: m.userId
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
    // 点击查询
    handleSearch() {
      this.$emit('onSearch')
    },
    // 点击重置
    handleClear() {
      this.$emit('onClear')
    },
    onhandleAdd() {
      this.$emit('onhandleAdd')
    }
  }
}
</script>

<style lang="scss" scoped>
.fonter_btn {
  width: 200px;
  display: flex;
  justify-content: flex-end;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
