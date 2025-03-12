<template>
  <div class="wrapper">
    <div class="guid-i" style="border-top-left-radius: 0">
      <!-- 筛选 -->
      <dataOverview
        :search="search"
        :search-active="searchActive"
        :title="'数据大盘'"
        @submit="queryList"
      />
      <el-row class="row-e">
        <el-form label-width="70px">
          <el-col :span="5">
            <el-form-item label="投放平台">
              <el-select
                v-model="search.platformId"
                class="select"
                placeholder="请选择"
                clearable
                style="width: 90%"
                @change="queryList"
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
          </el-col>
          <el-col :span="5">
            <el-form-item label="投手组织">
              <el-cascader
                ref="cascader1"
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
                @change="queryList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
          </el-col>
          <el-col :span="3">
            <el-button type="primary" size="small" @click="queryList">
              查询
            </el-button>
            <el-button size="small" @click="onClear">重置</el-button>
          </el-col>
        </el-form>
      </el-row>

      <el-row class="row-e">
        <lineGrid ref="lineGridRef" :search="search" />
      </el-row>
      <el-row class="row-e">
        <roi ref="roiRef" :search="search" />
      </el-row>
      <el-row class="row-e" type="flex" justify="space-between">
        <el-col style="width: 49%">
          <dealSource ref="dealSourceRef" :search="search" />
        </el-col>
        <el-col style="width: 49%">
          <funnel ref="funnelRef" :search="search" />
        </el-col>
      </el-row>
      <el-row class="row-e" type="flex" justify="space-between">
        <el-col style="width: 49%">
          <ranking ref="ranking" :status="1" :search="search" />
        </el-col>
        <el-col style="width: 49%">
          <ranking ref="ranking2" :status="2" :search="search" />
        </el-col>
      </el-row>
    </div>

    <div class="guid-i" style="margin-top: 20px">
      <el-row class="row-e">
        <advertisingData />
      </el-row>
    </div>
  </div>
</template>

<script>
import dataOverview from '../components/timeSearch.vue'
import lineGrid from '../components/lineGrid.vue'
import roi from '../components/roi.vue'
import funnel from '../components/funnel.vue'
import dealSource from '../components/dealSource.vue'
import ranking from '../components/ranking.vue'
import advertisingData from '../components/advertisingData/index.vue'
import {
  getPlatformDropdown,
  getUserByName,
  getDeptList
} from '@/api/advertisingKanBan'
import moment from 'moment'

export default {
  name: 'KanBan',
  components: {
    dataOverview,
    lineGrid,
    roi,
    funnel,
    dealSource,
    ranking,
    advertisingData
  },
  data() {
    return {
      launchPlatformOption: [],
      userList: [],
      depts: [],
      search: {
        time: undefined
      },
      searchActive: 0
    }
  },
  mounted() {
    this.getPlatformDropdown()
    this.getUserByName()
    this.getDeptList()
  },
  methods: {
    userChange() {
      this.userList = []
      this.queryList()
    },
    clearUser() {
      this.queryList()
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
    onSearch(e) {
      this.queryList()
    },
    onClear() {
      this.search.deptId = undefined
      this.search.platformId = undefined
      this.search.userId = undefined
      this.queryList()
    },

    queryList() {
      if (this.search.time.active === 7) {
        this.search.time.time[0] = moment()
          .subtract(7, 'd')
          .format('YYYY-MM-DD')
        this.search.time.time[1] = moment()
          .subtract(1, 'd')
          .format('YYYY-MM-DD')
      }
      if (this.search.time.active === 30) {
        this.search.time.time[0] = moment()
          .subtract(1, 'M')
          .format('YYYY-MM-DD')
        this.search.time.time[1] = moment()
          .subtract(1, 'd')
          .format('YYYY-MM-DD')
      }
      this.$nextTick(() => {
        this.$refs.cascader1.dropDownVisible = false
      })
      if (this.$refs.lineGridRef) this.$refs.lineGridRef.query()
      if (this.$refs.funnelRef) this.$refs.funnelRef.query()
      if (this.$refs.dealSourceRef) this.$refs.dealSourceRef.query()
      if (this.$refs.roiRef) this.$refs.roiRef.query()
      if (this.$refs.ranking) this.$refs.ranking.query()
      if (this.$refs.ranking2) this.$refs.ranking2.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  .title {
    color: #000;
    font-size: 16px;
  }
  .guid-i {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
  }
  .row-e {
    margin-top: 20px;
  }
}

::v-deep {
  .select {
    div input {
      height: 32px;
    }
  }
  .el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
}
</style>
