<template>
  <AppDialog
    v-model="visible"
    title="添加优惠券"
    width="1100px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <!-- 添加优惠券弹框 -->
    <div v-loading="loading" class="addCoupon">
      <div class="filterHeader">
        <span class="formLabel">优惠券类型</span>
        <el-input
          v-model.trim="search.couponName"
          size="small"
          placeholder="请输入优惠券名称"
          style="width: 375px"
          class="m-r-10"
          clearable
          @keyup.enter.native="searchFn"
          @clear="searchFn"
        >
          <el-select
            slot="prepend"
            v-model="search.discountMethod"
            placeholder="请选择"
            style="width: 135px"
            clearable
            @change="searchFn"
          >
            <el-option
              v-for="item in couponDiscountMethodType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-input>

        <span class="formLabel">券创建人</span>
        <el-select
          v-model="search.createUserId"
          size="small"
          class="w-200 m-r-20"
          filterable
          placeholder="请选择"
          clearable
          @change="searchFn"
          @clear="searchFn"
        >
          <el-option
            v-for="item in userArray"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          />
        </el-select>
        <el-button
          size="small"
          type="primary"
          @click="searchFn"
        >查询</el-button>
      </div>
      <div class="myTable">
        <el-table
          height="502"
          :header-cell-style="{ background: '#F3F3F3' }"
          :data="list"
          @row-click="rowClick"
        >
          <el-table-column width="55">
            <template slot-scope="{ row }">
              <el-checkbox
                :value="
                  checkIds.includes(row.couponNo) ||
                    defaultCheckIds.includes(row.couponNo)
                "
                :disabled="
                  defaultCheckIds.includes(row.couponNo) ||
                    (!checkIds.includes(row.couponNo) &&
                      checkIds.length + defaultCheckIds.length >= 10)
                "
                @click.native.prevent
              />
            </template>
          </el-table-column>
          <el-table-column prop="couponNo" label="优惠券ID" width="170" />
          <el-table-column prop="couponName" label="优惠券名称" width="120" />
          <el-table-column prop="discountMethod" label="券类型" width="80">
            <template slot-scope="{ row }">
              {{
                row.discountMethod | getOptionsValue(couponDiscountMethodType)
              }}
            </template>
          </el-table-column>
          <el-table-column prop="issueCount" label="发放数量" align="center" />
          <el-table-column prop="useStartTime" label="券有效期" width="180">
            <template slot-scope="{ row }">
              <template v-if="row.expireDays && row.expireDays > 0">
                有效期：领取后{{ row.expireDays }}天
              </template>
              <template v-else>
                <div>
                  起：{{
                    row.useStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
                  }}
                </div>
                <div>
                  至：{{
                    row.useEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
                  }}
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="claimStartTime" label="领取时间" width="180">
            <template slot-scope="{ row }">
              <div>
                起：{{
                  row.claimStartTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
                }}
              </div>
              <div>
                至：{{
                  row.claimEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="couponContent" label="优惠内容">
            <template slot-scope="{ row }">
              {{ row | filtersName }}
            </template>
          </el-table-column>
          <el-table-column prop="createdByName" label="创建人" />
        </el-table>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :pager-count="5"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { userNoPage } from '@/api/addressBookApi'
import {
  couponDiscountMethodType,
  couponUseStatusType
} from '@/views/live/columns.js'
import {
  getliveRoomcouponaddList,
  liveRoomcouponadd
} from '@/api/liveRoom/index.js'
import { getOptionsValueByKey } from '@/filters/index'
import { filtersMoneyByZeroNoSplit } from '@/filters'
export default {
  components: {
    AppDialog
  },
  filters: {
    filtersName(row) {
      if (row.discountMethod === 1) {
        // 满减
        return `满${filtersMoneyByZeroNoSplit(
          row.satisfiedAmount
        )}元减${filtersMoneyByZeroNoSplit(row.subtractAmount)}元`
      } else if (row.discountMethod === 2) {
        // 直减
        return `直减${filtersMoneyByZeroNoSplit(row.directReductionAmount)}元`
      } else if (row.discountMethod === 3) {
        // 折扣
        return `${row.sale}折`
      }
      return ''
    }
  },
  props: {
    successFn: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      top: '114px',
      loading: false,
      visible: false,
      list: [],
      checks: [],
      search: {
        discountMethod: '',
        couponName: '',
        createUserId: '',
        createUserName: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      userArray: [],
      couponDiscountMethodType,
      couponUseStatusType,
      // 已经被勾选的数据
      defaultCheck: [],
      addCouponType: 1 // 1 多选 2单选
    }
  },
  computed: {
    checkIds() {
      return this.checks.reduce((pre, next) => {
        pre.push(next.couponNo)
        return pre
      }, [])
    },
    defaultCheckIds() {
      return this.defaultCheck.reduce((pre, next) => {
        pre.push(next.couponNo)
        return pre
      }, [])
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.loadUserNoPage()
          this.currentPage = 1
          this.total = 0
          this.list = []
          this.checks = []
          // this.checks = JSON.parse(JSON.stringify(this.defaultCheck))
          this.getList()
        } else {
          this.currentPage = 1
          this.total = 0
          this.list = []
          this.checks = []
        }
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 740) / 2 + 'px'
    // this.loadUserNoPage()
  },
  methods: {
    rowClick(row) {
      if (
        this.defaultCheckIds.includes(row.couponNo) ||
        (!this.checkIds.includes(row.couponNo) &&
          this.checkIds.length + this.defaultCheckIds.length >= 10)
      ) {
        return
      }
      const index = this.checkIds.findIndex(v => v === row.couponNo)
      // 优惠劵弹窗单选
      if (this.addCouponType === 2 && index === -1) {
        this.checks = []
      }
      index > -1 ? this.checks.splice(index, 1) : this.checks.push(row)
    },
    getOptionsValueByKey,
    async loadUserNoPage() {
      const params = {
        nickName: ''
      }
      const res = await userNoPage(params)
      this.userArray = res.data
    },
    sure() {
      if (this.checks.length === 0) {
        return this.$message.error('请至少选择一项')
      }
      if (this.successFn) {
        return this.successFn(this.checks)
      }
      this.loading = true
      const data = {
        couponNos: this.checkIds,
        liveRoomId: this.liveRoomId
      }
      liveRoomcouponadd(data)
        .then(res => {
          this.$notify({ title: '提示', message: '操作成功', type: 'success' })
          this.visible = false
          this.success && this.success(this.checks)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        couponName: this.search.couponName,
        createUserId: this.search.createUserId,
        discountMethod: this.search.discountMethod
      }
      getliveRoomcouponaddList(data)
        .then(res => {
          this.list = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    clearFn() {
      this.search = {
        phone: '',
        status: '',
        id: ''
      }
      this.searchFn()
    }
  }
}
</script>

<style lang='scss' scoped>
.addCoupon {
  height: 622px;
  padding: 20px;
  .filterHeader {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    display: flex;
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
  .myTable {
    width: 100%;
    margin-top: 20px;
    height: 554px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #cbcfd3;
    overflow: hidden;
  }
  .pagination {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: right;
  }
}
::v-deep {
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
