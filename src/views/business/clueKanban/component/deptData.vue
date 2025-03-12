<template>
  <div class="deptData">
    <div class="filterTop">
      <MTitle>转化部门数据</MTitle>
      <div>
        部门
        <!-- <el-select v-model="select" size="small">
          <el-option label="1" value="1" />
        </el-select> -->
        <el-cascader
          v-model="select"
          :options="tree"
          :props="{ checkStrictly: true, label: 'deptName', value: 'deptId', emitPath: false }"
          clearable
          :show-all-levels="false"
          @change="treeChange"
        />
      </div>
    </div>

    <el-table
      v-loading="loading"
      :data="data"
      :header-cell-style="{ background: '#f5f5f5' }"
      class="m-t-20"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="deptName"
        label="部门"
      >
        <template slot-scope="{ row }">
          <span
            class="a_link"
            @click="gotoDeptData(row)"
          >{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="allocationSum"
        label="分配线索数"
        sortable="custom"
      />
      <el-table-column
        prop="transformClueSum"
        label="转化线索数"
        sortable="custom"
      />
      <el-table-column
        prop="transformRate"
        label="转化率"
        sortable="custom"
      />
      <el-table-column
        prop="transformMoneySum"
        label="转化总金额"
        sortable="custom"
      >
        <template slot-scope="{row}">
          ￥{{ row.transformMoneySum | filtersMoneyByZero }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { clueDeptData, getDeptTree } from '@/api/business/clue'
import { mapState } from 'vuex'
export default {
  components: {},
  data() {
    return {
      select: '',
      data: [],
      tree: [],
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
    this.getTree()
    this.getList()
  },
  methods: {
    // 点击前往部门数据看板
    gotoDeptData(row) {
      console.log(row, encodeURIComponent(row.deptId))
      this.$store.commit('businessClue/SET_search', { key: 'dept', data: { name: row.deptName, id: row.deptId } })
      this.$router.push(`clueKanbanDept/${encodeURIComponent(row.deptId)}?name=${row.deptName}`)
    },
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
        deptId: this.select,
        beginTime: this.search.time.time[0],
        endTime: this.search.time.time[1],
        adPlatform: this.search.launchPlatform
      }
      clueDeptData(params).then(res => {
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
    },
    // 获取部门数据
    getTree() {
      getDeptTree().then(res => {
        console.log(res, '部门数据结构')
        this.tree = this._T(res.data)
      })
    },
    _T(dataArr) {
      const result = dataArr.reduce((prev, next) => {
        prev[next.fatherDeptId] ? prev[next.fatherDeptId].push(next) : (prev[next.fatherDeptId] = [next])
        return prev
      }, {})
      Object.keys(result).map((key) => {
        result[key].map((item, i) => {
          result[item.deptId] ? (item.children = result[item.deptId]) : ''
        })
      })
      console.log(result, 'result')
      return result['']
    },
    treeChange(e) {
      this.getList()
      console.log(e)
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
