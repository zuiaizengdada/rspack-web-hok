<template>
  <MCard class="page_wrap">
    <filterTop :search="search" @search="onSearch" />
    <div class="pageView">
      <components
        :is="search.poolType === 1 ? 'followUpPool' : 'publicPool'"
        ref="pageView"
        :search="search"
        :loading="loading"
        :list="list"
        :total="total"
        @search="onSearch"
      />
    </div>
  </MCard>
</template>

<script>
import followUpPool from './followUpPool.vue'
import publicPool from './publicPool.vue'
import filterTop from './filterTop.vue'
import { teacherSharingCommonList } from '@/api/tearchCenter/tearchSharing.js'
export default {
  components: {
    followUpPool,
    publicPool,
    filterTop
  },
  data() {
    return {
      search: {
        poolType: 1, // 池子类型 1-跟进池 2-共享池
        cooperateStatus: '', // 跟进状态
        followerId: '', // 跟进人Id
        followerName: '', // 跟进人姓名
        teacherRealName: '', // 老师真实姓名
        teacherPhoneNum: '', // 老师手机号
        queryDetail: false, // 是否查看跟进池已存在老师详情
        tenantId: '', // 跟进人所属机构id
        pageIndex: 1,
        pageSize: 10
      },
      list: [],
      total: 0,
      loading: false
    }
  },
  created() {
    if (
      this.$route.query.teacherRealName ||
      this.$route.query.teacherPhoneNum
    ) {
      this.search.teacherRealName = this.$route.query.teacherRealName
      this.search.teacherPhoneNum = this.$route.query.teacherPhoneNum
    }
    if (this.$route.query.poolType) {
      this.search.poolType = +this.$route.query.poolType || 1
    }
    if (this.$route.query.queryDetail) {
      this.search.queryDetail = true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    onSearch(val) {
      this.search = val
      console.log(this.search, 'search')
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        cooperateStatus: this.search.cooperateStatus, // 跟进状态
        followerId: this.search.followerId, // 跟进人id
        poolType: this.search.poolType, // 池子类型 1-跟进池 2-共享池
        teacherRealName: this.search.teacherRealName, // 老师真实姓名
        teacherPhoneNum: this.search.teacherPhoneNum,
        tenantId: this.search.tenantId, // 跟进人所属机构ID
        queryDetail: this.search.queryDetail,
        pageIndex: this.search.pageIndex,
        pageSize: this.search.pageSize
      }
      teacherSharingCommonList(data)
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
.page_wrap {
  display: flex;
  flex-direction: column;
  .pageView {
    flex: 1 0 0;
  }
}
</style>
