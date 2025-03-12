<template>
  <MCard class="page_wrap">
    <MTitle>目标设置</MTitle>
    <div class="filterHeader">
      <div class="fl">
        <span class="formLabel">月份</span>
        <el-date-picker
          v-model="search.mothYear"
          format="yyyy-MM"
          value-format="yyyyMM"
          size="small"
          type="month"
          placeholder="请选择"
          style="width: 120px"
          class="m-r-20 m-l-10"
          filterable
          clearable
          @change="searchFn"
          @focus="focus"
        />
        <span class="formLabel">所在部门</span>
        <el-cascader
          v-model="search.deptId"
          class="m-r-20"
          size="small"
          filterable
          :options="deptTreeArray"
          :props="{ checkStrictly: true }"
          clearable
          @change="searchFn"
        />
        <el-button
          size="small"
          type="primary"
          @click="onhanldeAdd"
        >新增</el-button>
      </div>
    </div>

    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      class="m-t-20"
      :header-cell-style="{ background: '#f5f5f5' }"
      show-summary
      :summary-method="getSummaries"
      height="100%"
    >
      <el-table-column prop="monthYear" label="月份" width="90" align="center">
        <template slot-scope="{ row }">
          {{ row.monthYear | filtersMoth }}
        </template>
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="所在部门"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="userName"
        label="员工"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="targetValue"
        label="目标值"
        min-width="120"
        align="center"
      >
        <template slot="header">
          <MTips text="目标值" tips="设置对应月份业绩完成指标" align="center" />
        </template>
        <template slot-scope="{ row }">
          <span v-if="!ifEdit">{{ filtersMoney(row.targetValue) }}</span>
          <!-- <el-input-number v-else v-model="row.targetValue" :min="0" :max="1000000" /> -->
          <el-input
            v-else
            v-model="row.targetValue"
            size="small"
            @input="e => delNumber(e, row, 'targetValue')"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="updateUserName"
        label="更新人"
        min-width="120"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        min-width="120"
        align="center"
      />
      <el-table-column label="操作" min-width="120" align="center">
        <template slot-scope="{ row }">
          <el-button
            v-if="currentMothYear <= search.mothYear"
            type="text"
            class="c_F53F3F"
            @click="onhandleDel(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="m-t-20">
      <el-button
        v-if="!ifEdit"
        :disabled="currentMothYear > search.mothYear"
        size="small"
        type="primary"
        @click="onhandleEdit"
      >编辑</el-button>
      <el-button
        v-else
        size="small"
        type="primary"
        @click="onhandleSave"
      >保存</el-button>
    </div>
  </MCard>
</template>

<script>
import { deptTree } from '@/api/addressBookApi'
import Dialog from '@/views/live/Dialog/index.js'
import {
  getTargetSetupList,
  delTargetSetup,
  saveTargetSetup
} from '@/api/liveRoom/target.js'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { filtersMoneyByZero } from '@/filters/index.js'
export default {
  name: 'LiveTargetSettingEdit',
  components: {},
  filters: {
    filtersMoth(val) {
      return Number(String(val).substring(4, 6)) + '月份'
    }
  },
  data() {
    return {
      search: {
        mothYear: '',
        deptId: []
      },
      loading: false,
      // 当前月份
      currentMothYear: '',
      deptTreeArray: [],
      tableData: [],
      totalTargetValue: 0, // 总目标值
      ifEdit: false
    }
  },
  mounted() {
    this.currentMothYear = moment().format('YYYYMM')
    if (this.$route.params && this.$route.params.month) {
      this.search.mothYear = this.$route.params.month
    } else {
      this.search.mothYear = moment().format('YYYYMM')
    }
    this.loadTreeData()
    this.searchFn()
  },
  methods: {
    filtersMoney(money) {
      return parseFloat(BigNumber(Math.abs(+money || 0)))
        .toFixed(2)
        .toString()
        .split('')
        .reverse()
        .join('')
        .replace(/(\d{3})/g, '$1,')
        .replace(/\,$/, '')
        .split('')
        .reverse()
        .join('')
        .replace(/(\.00)$/, '')
    },
    // 限制只能输入数字
    delNumber(e, row, key) {
      row.targetValue = e.replace(/[^0-9]/g, '')
      if (row.targetValue > 1000000) {
        row.targetValue = 1000000
      } else if (row.targetValue < 0) {
        row.targetValue = 0
      }
    },
    focus() {
      if (!this.search.mothYear) {
        this.search.mothYear = moment().format('YYYYMM')
        setTimeout(() => {
          this.search.mothYear = moment().format('YYYYMM')
        }, 200)
      }
    },
    searchFn() {
      if (!this.search.mothYear) {
        this.search.mothYear = this.currentMothYear
        setTimeout(() => {
          this.search.mothYear = moment().format('YYYYMM')
        }, 200)
      }
      this.ifEdit = false
      this.getList()
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index === 3) {
          sums[index] = this.tableData.reduce((pre, next) => {
            pre += Number(next.targetValue) || 0
            return pre
          }, 0)
          return
        }
        sums[index] = ''
        return
      })
      sums[3] = this.filtersMoney(sums[3])
      console.log(sums, 'sums')
      return sums
    },
    // 点击新增按钮
    onhanldeAdd() {
      Dialog.open({
        type: 'AddTargetSetting',
        visible: true,
        form: {
          monthYear: this.currentMothYear,
          userList: [],
          targetValue: 200000
        },
        success: res => {
          console.log(res, 'res')
          Dialog.close()
          this.loading = true
          const userStatTargetSetupList = res.userList.reduce((pre, next) => {
            pre.push({
              targetValue: Number(res.targetValue) * 100,
              userId: next.userId
            })
            return pre
          }, [])
          const data = {
            monthYear: res.monthYear,
            userStatTargetSetupList: userStatTargetSetupList
          }
          saveTargetSetup(data)
            .then(res => {
              this.ifEdit = false
              this.search.mothYear = data.monthYear
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 点击删除按钮
    onhandleDel(row) {
      this.$delModal({
        tips: '确认是否删除',
        success: () => {
          this.loading = true
          const data = {
            id: row.id
          }
          delTargetSetup(data)
            .then(() => {
              this.searchFn()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    getList() {
      this.loading = true
      let deptId = ''
      if (this.search.deptId.length > 0) {
        deptId = this.search.deptId[this.search.deptId.length - 1]
      }
      const data = {
        deptId,
        mothYear: this.search.mothYear
      }
      getTargetSetupList(data)
        .then(res => {
          res.data.targetSetupList.map(v => {
            v.targetValue = v.targetValue / 100
          })
          this.tableData = res.data.targetSetupList
          this.totalTargetValue = filtersMoneyByZero(res.data.totalTargetValue)
          setTimeout(() => {
            this.$refs.table && this.$refs.table.doLayout()
          }, 200)
          this.loading = false
        })
        .catch(() => {
          this.tableData = []
          setTimeout(() => {
            this.$refs.table && this.$refs.table.doLayout()
          }, 200)
          this.loading = false
        })
    },
    // 点击编辑
    onhandleEdit() {
      this.ifEdit = true
    },
    // 点击保存
    onhandleSave() {
      this.loading = true
      const userStatTargetSetupList = this.tableData.reduce((pre, next) => {
        pre.push({
          targetValue: Number(next.targetValue) * 100,
          userId: next.userId
        })
        return pre
      }, [])
      const data = {
        monthYear: this.search.mothYear,
        userStatTargetSetupList: userStatTargetSetupList
      }
      saveTargetSetup(data)
        .then(res => {
          this.ifEdit = false
          this.searchFn()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px 20px;
}
.filterHeader {
  margin-top: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .formLabel {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 32px;
    margin-right: 8px;
  }
}
</style>
