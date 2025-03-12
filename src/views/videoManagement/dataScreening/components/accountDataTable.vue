<template>
  <div>
    <div class="flex flex-middle flex-between">
      <span class="title_span">
        <em />
        <p>账号数据明细</p>
      </span>
      <el-form ref="useForm" inline :model="config" size="mini">
        <div class="flex flex-end">
          <div class="flex">
            <el-form-item label="账号名称" prop="account">
              <el-input
                v-model="config.accountName"
                placeholder="请输入账号名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="handleClickSearch"
              >查询</el-button>
              <el-button plain @click="handleClickReset">重置</el-button>
              <el-button
                v-permission="['web:dataScreening:export', permsList]"
                type="primary"
                style="margin-left: 12px"
                plain
                @click="exportData"
              >导出数据</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="dataDetailsTable">
      <el-table
        :header-row-class-name="'tableClassName'"
        :data="data.items"
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          v-for="item in accountDataColumns"
          :key="item.label"
          :width="item.width"
          :label="item.label"
          :prop="item.prop"
          :sortable="item.sort"
        >
          <template slot-scope="scope">
            <span
              v-if="item.prop === 'name'"
              class="deptName flex flex-middle"
              @click="goAccountDetails(scope.row)"
            >
              <img
                :src="scope.row.avatar"
                alt=""
                class="m-r-8"
                style="width: 40px; height: 40px; border-radius: 50%"
              />
              {{ scope.row[item.prop] }}
            </span>
            <span v-else-if="item.prop === 'fans'">
              {{ filtersMoneyByW(scope.row[item.prop]) }}
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <div slot="empty" class="empty">
          <el-empty :image-size="70" description="暂无数据" />
        </div>
      </el-table>
      <div v-if="data.total > 0" class="flex justify-end mt-2 m-b-20">
        <el-pagination
          :current-page="config.pageIndex"
          :page-sizes="[10, 20, 40, 100]"
          :page-size="config.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { accountDataColumns } from './columns'
import { filtersMoneyByW } from '@/filters/index'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    search: {
      type: Object,
      default: () => {
        return {
          active: 1,
          time: ['', '']
        }
      }
    }
  },
  data() {
    return {
      accountDataColumns,
      permsList: this.$route.meta.permsList || [],
      config: {
        pageIndex: 1,
        pageSize: 10,
        accountName: '',
        orderByParam: '',
        orderByWay: ''
      }
    }
  },
  methods: {
    filtersMoneyByW,
    handleCurrentChange(val) {
      this.config.pageIndex = val
      this.loadData()
    },
    exportData() {
      this.$emit('exportData')
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.loadData()
    },
    sortChange({ prop, order }) {
      console.log(prop, order, '9999666')
      // 排序属性:1新增作品2新增粉丝3新增播放 4新增点赞5新增评论6新增订单7新增免费订单8新增付费订单9新地GMV 10新增免费GMV 11新增付费GMV  参考引入的accountDataColumns
      this.accountDataColumns.forEach(item => {
        if (item.prop === prop) {
          this.config.orderByParam = item.type
        }
      })
      // 排序方式:0倒序 1升序
      if (order === 'ascending') {
        this.config.orderByWay = 1
      } else if (order === 'descending') {
        this.config.orderByWay = 0
      } else {
        this.config.orderByWay = ''
      }
      this.loadData()
    },
    goAccountDetails(row) {
      const path = this.$route.path
      // startTime: search.startTime, endTime: search.endTime,
      this.$router.push({
        path: `/videoManagement/myAccountDetail?fromType=all&accountId=${row.platformAccountId}&startTime=${this.search.startTime}&endTime=${this.search.endTime}`,
        query: {
          path,
          name: '数据总览'
        }
      })
    },
    loadData() {
      this.$emit('loadData')
    },
    handleClickReset() {
      this.config.accountName = ''
      this.config.pageIndex = 1
      this.loadData()
    },
    handleClickSearch() {
      this.config.pageIndex = 1
      this.loadData()
    }
  }
}
</script>
<style lang="scss" scoped>
.dataDetailsTable {
  //   margin-top: 20px;
  background: #ffffff;
  // border: 1px solid #e7e7e7;
}
.title_span {
  color: #333;
  height: 24px;
  font-size: 16px;
  line-height: 24px;
  margin-right: 10px;
  margin-bottom: 18px;
  .title_span_tips {
    font-size: 12px;
    font-weight: 400;
    color: #999999;
  }
  p {
    float: left;
    line-height: 24px;
    font-weight: bold;
  }
  em {
    float: left;
    width: 4px;
    height: 24px;
    border-radius: 6px;
    background: #0c6fff;
    margin-right: 8px;
  }
}
.deptName {
  color: #0c6fff;
  cursor: pointer;
}
.account_details_title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}
.tableClassName {
  background: #f3f3f3 !important;
}
::v-deep {
  .tableClassName > th {
    background: #f3f3f3 !important;
  }
}
</style>
