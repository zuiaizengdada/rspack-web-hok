<template>
  <div class="filterTop">
    <el-form ref="form" :model="search" label-width="6em" size="small" inline>
      <el-row>
        <el-form-item label="投放平台">
          <el-select
            v-model="search.platformId"
            class="select"
            placeholder="请选择"
            clearable
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
        <el-form-item label="投放状态">
          <el-select
            v-model="search.status"
            placeholder="请选择"
            class="w-200"
            clearable
            @change="onSearch"
            @clear="onSearch"
          >
            <el-option
              v-for="(item, index) in statusMapList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告计划ID">
          <el-input
            v-model.trim="search.adId"
            placeholder="请输入广告计划ID"
            class="w-200"
            clearable
            maxlength="30"
            @clear="onSearch"
          />
        </el-form-item>
        <el-form-item label="广告创意ID">
          <el-input
            v-model.trim="search.creativeId"
            placeholder="请输入广告创意ID"
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
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-col>
          <el-button type="primary" size="small" @click="onSearch">
            查询
          </el-button>
          <el-button size="small" @click="onClear">重置</el-button>
        </el-col>
        <el-button size="small" type="primary" @click="onhandlegoPage">
          查看关联广告
        </el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="onhandleAdd"
        >
          新增关联广告
        </el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  getPlatformDropdown,
  getUserByName,
  getDeptList
} from '@/api/advertisingKanBan'
import { statusMap } from './columns'
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
      statusMap,
      userList: [],
      launchPlatformOption: [],
      depts: [],
      statusMapList: []
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
    'search.adId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.search, 'adId', undefined)
        }
      },
      deep: true,
      immediate: true
    },
    'search.creativeId': {
      handler(val) {
        if (val && !/^[A-Za-z0-9]+$/g.test(val)) {
          this.$set(this.search, 'creativeId', undefined)
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getPlatformDropdown()
    this.getDeptList()
    Object.keys(this.statusMap).forEach(r => {
      this.statusMapList.push({ label: this.statusMap[r], value: r })
    })
  },
  methods: {
    userChange() {
      this.userList = []
      this.onSearch()
    },
    platformIdChange(val) {
      if (val) {
        this.getAdvertiserStaffDropdown()
        this.onSearch()
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
    // 限制只能输入英文和数字
    delNumber(e) {
      this.search.expertId = e.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
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
  position: relative;
}
::v-deep {
  label {
    font-weight: normal;
    color: #333;
  }
}
</style>
