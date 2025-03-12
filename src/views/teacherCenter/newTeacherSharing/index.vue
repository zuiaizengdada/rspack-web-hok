<template>

  <div class="zb-wrapper">
    <el-tabs v-model="activeName" class="zb-tabs">
      <el-tab-pane label="意向池" name="first">
        <template v-if="activeName === 'first'">
          <filterTop type="first" :search="search" @search="onSearch" />
          <div class="pageView">
            <followUpPool
              ref="pageView"
              :search="search"
              :loading="loading"
              :list="list"
              :total="total"
              @search="onSearch"
            />
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="成功池"
        name="second"
      >
        <template v-if="activeName === 'second'">
          <filterTop type="second" :search="search" @search="onSearch" />
          <div class="pageView">
            <followUpPool
              ref="pageView"
              :search="search"
              :loading="loading"
              :list="list"
              :total="total"
              @search="onSearch"
            />
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane
        label="黑名单池"
        name="third"
      >
        <template v-if="activeName === 'third'">
          <filterTop type="third" :search="search" @search="onSearch" />
          <div class="pageView">
            <followUpPool
              ref="pageView"
              :search="search"
              :loading="loading"
              :list="list"
              :total="total"
              @search="onSearch"
            />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import followUpPool from './followUpPool.vue'
import filterTop from './filterTop.vue'
import { teacherSharingNewList } from '@/api/tearchCenter/tearchSharing.js'
export default {
  components: {
    followUpPool,
    filterTop
  },
  data() {
    return {
      activeName: 'first',
      search: {
        cooperateStatus: '', // 跟进状态
        followUserId: '', // 跟进人Id
        createUserId: '', // 跟进人Id
        followerName: '', // 跟进人姓名
        teacherName: '', // 老师真实姓名
        orgId: '', // 跟进人所属机构id
        followOrgId: '', // 跟进人所属机构id
        assessResult: '', // 跟进人所属机构id
        domainId: undefined,
        createUserName: '',
        pageIndex: 1,
        pageSize: 10,
        createTimeEnd: undefined,
        createTimeBegin: undefined
      },
      list: [],
      total: 0,
      loading: false
    }
  },
  watch: {
    activeName(val) {
      this.search = {
        cooperateStatus: '', // 跟进状态
        followUserId: '', // 跟进人Id
        createUserId: '', // 跟进人Id
        followerName: '', // 跟进人姓名
        teacherName: '', // 老师真实姓名
        orgId: '', // 跟进人所属机构id
        followOrgId: '', // 跟进人所属机构id
        assessResult: '', // 跟进人所属机构id
        domainId: undefined,
        createUserName: '',
        pageIndex: 1,
        pageSize: 10,
        createTimeEnd: undefined,
        createTimeBegin: undefined
      }
      this.getList()
    }
  },
  created() {
    if (
      this.$route.query.teacherName
    ) {
      this.search.teacherName = this.$route.query.teacherName
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onSearch(val) {
      this.search = val
      this.getList()
    },
    getList() {
      this.loading = true
      const cooperateStatusPool = this.activeName === 'first' ? 1 : this.activeName === 'second' ? 2 : 3
      teacherSharingNewList({ ...this.search }, cooperateStatusPool)
        .then(res => {
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.zb-wrapper {
  position: relative;
  width: 100%;
  border-radius: 10px;
  background-color: #fff;
}
::v-deep {
  .zb-tabs {
    .el-tabs__header {
      padding-top: 10px;
      .el-tabs__nav-wrap {
        padding-left: 20px;
        &::after {
          height: 1px;
          background-color: #eff2f6;
        }
      }
    }
  }
}
</style>
