<template>
  <div class="filterTop">
    <el-form
      ref="form"
      :model="search"
      label-width="80px"
      size="small"
      :inline="true"
    >
      <el-form-item label="投放平台">
        <el-select
          v-model="search.platformId"
          class="select"
          placeholder="请选择"
          clearable
          style="width: 90%"
          @clear="onSearch"
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
      <el-form-item label="投放账号ID">
        <el-input
          v-model.trim="search.advertiserId"
          placeholder="请输入投放账号ID"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item label="投放部门">
        <el-cascader
          v-model="search.deptId"
          clearable
          :options="depts"
          :props="{
            checkStrictly: true,
            label: 'label',
            value: 'id',
            emitPath: false
          }"
          style="width: 90%"
          :show-all-levels="false"
          @change="onSearch"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item label="投手">
        <el-select
          v-model="search.userId"
          class="select"
          placeholder="请选择投手"
          filterable
          :filter-method="getUserByName"
          clearable
          style="width: 90%"
          @change="userChange"
          @clear="clearUser"
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
      <el-form-item v-if="status == 1" label="广告组名称">
        <el-input
          v-model.trim="search.campaignName"
          placeholder="请输入广告组名称"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item v-if="status == 1" label="广告组ID">
        <el-input
          v-model.trim="search.campaignId"
          placeholder="请输入广告组ID"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>

      <el-form-item v-if="status == 2" label="计划名称">
        <el-input
          v-model.trim="search.adPlanName"
          placeholder="请输入计划名称"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item v-if="status == 2" label="广告计划ID">
        <el-input
          v-model.trim="search.adPlanId"
          placeholder="请输入广告计划ID"
          class="w-200"
          clearable
          maxlength="30"
          @clear="onSearch"
        />
      </el-form-item>
      <el-form-item v-if="status != 0" label="关联状态">
        <el-select
          v-model="search.interrelatedStatus"
          placeholder="请选择关联状态"
          clearable
          style="width: 90%"
          @change="onSearch"
          @clear="clearUser"
        >
          <el-option :label="'成功'" :value="1"> 成功 </el-option>
          <el-option :label="'失败'" :value="2"> 失败 </el-option>
        </el-select>
      </el-form-item>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" size="small" @click="onSearch">
            查询
          </el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  getPlatformDropdown,
  getUserByName,
  getDeptList,
  getAdvertiserStaffSelfDropdown
} from '@/api/advertisingKanBan'
export default {
  components: {},
  props: {
    status: {
      type: Number,
      default: 0
    },
    search: {
      type: Object,
      default: () => {
        return {}
      }
    },
    activeName: {
      type: String,
      default: 'tuofangzhanghao'
    }
  },
  data() {
    return {
      userList: [],
      launchPlatformOption: [],
      advertiserStaffs: [],
      depts: []
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
    },
    'search.campaignId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.search, 'campaignId', undefined)
        }
      },
      deep: true,
      immediate: true
    },
    'search.adPlanId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.search, 'adPlanId', undefined)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getPlatformDropdown()
    // this.getAdvertiserStaffDropdown()
    this.getDeptList()
  },
  methods: {
    userChange() {
      this.userList = []
      this.onSearch()
    },
    platformIdChange() {
      this.onSearch()
    },
    async getAdvertiserStaffDropdown() {
      const res = await getAdvertiserStaffSelfDropdown({
        discriminate:
          this.activeName === 'tuofangzhanghao'
            ? 1
            : this.activeName === 'guangaozhu'
              ? 2
              : 3
      })
      if (res.code === 1) {
        this.advertiserStaffs = res.data.items
          .filter(f => f.discriminate > 1)
          .map(m => ({
            label: m.advertiserId,
            value: m.advertiserId
          }))
      }
    },
    clearUser() {
      this.search.userId = undefined
      this.onSearch()
    },
    async getDeptList() {
      const res = await getDeptList()
      if (res.code === 1) {
        this.depts = res.data
      }
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
    // 点击查询按钮
    onSearch() {
      this.$emit('onSearch')
    },
    // 点击重置按钮
    onClear() {
      this.$emit('onClear')
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
    font-weight: normal;
    color: #333;
  }
}
</style>
