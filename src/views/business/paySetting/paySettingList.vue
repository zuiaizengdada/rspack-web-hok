<template>
  <div class="page_wrap">
    <div class="content">
      <div class="filter_top">
        <filterTop :search="search" @search="searchFn" />
      </div>

      <div class="p-20 table-module">
        <el-table
          v-loading="search.loading"
          :data="tableData"
          border
          :header-cell-style="{ background: '#f5f5f5' }"
        >
          <el-table-column prop="orderNo" label="订单号" width="240">
            <template slot-scope="{ row }">
              <AppIconClipboard :src="row.orderNo">
                <span
                  class="a_link"
                  title="点击前往售后订单详情"
                  @click="gotoDetail(row)"
                >{{ row.orderNo }}</span>
              </AppIconClipboard>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="课程名称" />
          <el-table-column prop="userPhone" label="手机号码" width="150">
            <template slot-scope="{ row }">
              <tablePhoneItem
                v-model="row.userPhone"
                :phone-area-code="row.phoneAreaCode"
                :row-data="{ uid: row.userId }"
                type="user"
              />
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="170">
            <template slot-scope="{ row }">
              <tableEmailItem
                v-model="row.email"
                :row-data="{ userId: row.userId }"
                type="user"
              />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="售后状态">
            <template slot-scope="{ row }">
              <AppStatus
                :status="
                  {
                    0: 'error',
                    1: 'warning',
                    2: 'success',
                    3: 'info',
                    4: 'error'
                  }[row.status]
                "
              >
                <span>{{
                  {
                    0: '未处理',
                    1: '退款中',
                    2: '已退款',
                    3: '已关闭',
                    4: '退款异常',
                    5: '处理中',
                    6: '商家拒绝退款',
                    7: '部分退款'
                  }[row.status]
                }}</span>
              </AppStatus>
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="用户昵称" />
          <el-table-column prop="payerTotal" label="订单金额">
            <template slot-scope="{ row }">
              {{ (row.payerTotal || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column prop="subPayerTotal" label="课程金额（元）">
            <template slot-scope="{ row }">
              {{ (row.subPayerTotal || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column prop="appliedFee" label="申请金额（元）">
            <template slot-scope="{ row }">
              {{ (row.appliedFee || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column prop="refundFee" label="退款金额（元）">
            <template slot-scope="{ row }">
              {{ (row.refundFee || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column prop="discountsFee" label="优惠金额">
            <template slot-scope="{ row }">
              {{ (row.discountsFee || 0) | filtersMoney }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" @click="gotoDetail(row)"> 详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          class="ss-pagination-warpper m-t-20 m-b-20"
          :current-page.sync="search.current"
          :page-size="search.size"
          layout="total, prev, pager, next, jumper"
          :total="total"
          background
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import filterTop from './filterTop.vue'
import { getGoodsAfterSalePage } from '@/api/business'
import AppStatus from '@/components/AppStatus'
import AppIconClipboard from '@/components/AppIconClipboard'
import tablePhoneItem from '@/components/AppTemplate/tablePhoneItem'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'
export default {
  name: 'PaySetting',
  components: {
    filterTop,
    AppStatus,
    AppIconClipboard,
    tablePhoneItem,
    tableEmailItem
  },
  data() {
    return {
      tableData: [],
      search: {
        order: { label: 'orderNo', value: '' },
        time: ['', ''],
        status: '',
        current: 1,
        size: 10,
        loading: false
      },
      total: 0
    }
  },
  beforeRouteLeave(to, from, next) {
    // 去详情页面才进行保存
    if (to.name === 'PaySettingDetail') {
      this.$setPageSearch(this.search)
    } else {
      this.$setPageSearch({
        order: { label: 'orderNo', value: '' },
        time: ['', ''],
        status: '',
        current: 1,
        size: 10,
        loading: false
      })
    }
    next()
  },
  async created() {
    await this.$store.dispatch('user/viewingFlag', 'paySetting')
    this.initSearchData()
  },
  methods: {
    initSearchData() {
      // const initSearch = this.$getPageSearch()
      const initSearch = {
        order: { label: 'orderNo', value: '' },
        time: ['', ''],
        status: '',
        current: 1,
        size: 10,
        loading: false
      }
      console.log(initSearch, 'initSearch', this.$getPageSearch())
      this.search = initSearch
      this.getList()
    },
    searchFn(res) {
      this.search = res
      this.getList()
    },
    getList() {
      this.search.loading = true
      let startTime = ''
      let endTime = ''
      if (this.search.time) {
        startTime = this.search.time[0]
        endTime = this.search.time[1]
      }
      console.log(this.search.status)
      const params = {
        [this.search.order.label]: this.search.order.value,
        current: this.search.current,
        size: this.search.size,
        startTime,
        channelSource: this.search.channelSource,
        endTime,
        status: this.search.status.length ? this.search.status.toString() : ''
      }
      getGoodsAfterSalePage(params)
        .then(res => {
          this.tableData = res.data.records
          this.total = res.data.total
          this.search.loading = false
        })
        .catch(() => {
          this.search.loading = false
        })
    },
    handleCurrentChange(val) {
      this.search.current = val
      this.getList()
    },
    // 跳转订单详情
    gotoDetail(row) {
      this.$router.push({ path: `paySetting/${row.afterSaleNo}` })
    }
  }
}
</script>

<style scoped lang="scss">
.page_wrap {
  // height: 100%;
  min-width: 1200px;
  // background-color: #fff;
  border-radius: 4px;
  .content {
    height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
      -moz-transition: all 0.4s ease;
      -webkit-transition: all 0.4s ease;
      -o-transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .filter_top {
      padding: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
        0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    }
    .footer-tabs {
      margin-top: 16px;
    }
    .table-module {
      padding: 20px;
      margin-top: 20px;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
        0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
      .ss-pagination-warpper {
        text-align: right;
      }
      .table-empty-text {
        width: 100%;
        height: 100px;
        line-height: 100px;
        font-size: 16px;
        text-align: center;
        color: #5e7382;
      }
      .main-table {
        width: 100%;
        .table-header {
          width: 100%;
          line-height: 40px;
          font-size: 14px;
          font-weight: 600;
          background: #f6f8fa;
          color: #353535;
          .header-item {
            float: left;
            box-sizing: border-box;
            position: relative;
            &:nth-child(1) {
              width: 20%;
              padding-left: 16px;
            }
            &:nth-child(2) {
              width: 10%;
            }
            &:nth-child(3) {
              width: 10%;
            }
            &:nth-child(4) {
              width: 10%;
            }
            &:nth-child(5) {
              width: 10%;
            }
            &:nth-child(6) {
              width: 10%;
            }
            &:nth-child(7) {
              width: 10%;
            }
            &:nth-child(8) {
              width: 10%;
            }
            &:nth-child(9) {
              width: 10%;
            }
          }
        }

        .table-body {
          width: 100%;
          font-size: 14px;
          .table-title-row {
            position: relative;
            padding: 0 50px 0 15px;
            margin-top: 16px;
            background: #f7f9fb;
            border: 1px solid #eee;
            min-height: 44px;
            line-height: 28px;
            height: auto;
            overflow: hidden;
            color: #333;
            font-size: 14px;
            .title-item {
              margin-right: 24px;
              height: 42px;
              line-height: 42px;
              float: left;
            }

            .color-tag-area {
              display: flex;
              align-items: center;
              position: absolute;
              right: 0;
              top: 0;
              padding: 0 15px;
              height: 42px;
              line-height: 42px;
              color: #105cfb;
              cursor: pointer;
              > img {
                width: 16px;
                height: 16px;
              }
            }
          }
          .table-body-row {
            width: 100%;
            display: flex;
            align-items: center;
            min-height: 93px;
            border-left: 1px solid #eeeeee;
            border-right: 1px solid #eeeeee;
            border-bottom: 1px solid #eeeeee;
            .body-item {
              box-sizing: border-box;
              position: relative;
              height: 100%;
              &:nth-child(1) {
                width: 20%;
                padding-left: 15px;
              }
              &:nth-child(2) {
                width: 10%;
              }
              &:nth-child(3) {
                width: 10%;
              }
              &:nth-child(4) {
                width: 10%;
              }
              &:nth-child(5) {
                width: 10%;
              }
              &:nth-child(6) {
                width: 10%;
              }
              &:nth-child(7) {
                width: 10%;
              }
              &:nth-child(8) {
                width: 10%;
              }
              &:nth-child(9) {
                width: 10%;
              }

              .goods-img-info {
                display: flex;
                align-items: center;
                .goods-img {
                  width: 64px;
                  height: 64px;
                  min-width: 64px;
                  background: #eee;
                }
                .goods-info {
                  min-height: 60px;
                  padding-left: 8px;
                  display: grid;

                  .goods-type {
                    width: 100%;
                    height: 18px;
                    line-height: 18px;
                    font-size: 14px;
                    color: #999999;
                    margin-right: 8px;
                  }
                  .goods-period {
                    width: 100%;
                    height: 16px;
                    font-size: 12px;
                    color: #b2b2b2;
                    line-height: 16px;
                    overflow: hidden;
                    -o-text-overflow: ellipsis;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.ss-pagination-warpper {
  text-align: right;
}
</style>
