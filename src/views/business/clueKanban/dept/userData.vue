<template>
  <div class="deptData">
    <div class="filterTop">
      <MTitle>员工数据</MTitle>
    </div>

    <el-table v-loading="loading" :data="data" :header-cell-style="{ background: '#f5f5f5' }" class="m-t-20" @sort-change="sortChange">
      <el-table-column prop="staffName" label="姓名" />
      <el-table-column prop="allocationSum" label="分配线索数" sortable="custom" />
      <el-table-column prop="transformClueSum" label="转化线索数" sortable="custom" />
      <el-table-column prop="transformRate" label="转化率" sortable="custom" />
      <el-table-column prop="transformMoneySum" label="转化总金额" sortable="custom">
        <template slot-scope="{row}">
          ￥{{ row.transformMoneySum | filtersMoneyByZero }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getClueStaffData } from '@/api/business/clue'
import { mapState } from 'vuex'
export default {
  components: {},
  data() {
    return {
      data: [],
      sort: {
        allocationSum: '',
        transformClueSum: '',
        transformRate: '',
        transformMoneySum: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      search: state => state.businessClue.search
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 排序改变触发
    sortChange(data) {
      this.loading = true
      for (const key in this.sort) {
        this.sort[key] = ''
      }
      if (data.order === 'descending') {
        // 倒序
        this.sort[data.prop] = 2
      } else if (data.order === 'ascending') {
        // 正序
        this.sort[data.prop] = 1
      } else {
        // 取消
        this.sort[data.prop] = ''
      }
      this.getList()
      // this.$store.dispatch('businessClue/getDeptData', this.sort).then(res => {
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    getList() {
      this.loading = true
      const params = {
        allocationSort: this.sort.allocationSum,
        transformRateSort: this.sort.transformRate,
        transformSort: this.sort.transformClueSum,
        transformSumSort: this.sort.transformMoneySum,
        deptId: this.search.dept.id,
        beginTime: this.search.time.time[0],
        endTime: this.search.time.time[1]
      }
      getClueStaffData(params).then(res => {
        console.log(res, '获取列表数据')
        res.data.map(v => {
          v.transformRate = (Number(v.transformRate) * 100).toFixed(2) + '%'
        })
        this.data = res.data
        this.loading = false
      }).catch((err) => {
        console.log(err, 'err')
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.deptData {
    .filterTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
