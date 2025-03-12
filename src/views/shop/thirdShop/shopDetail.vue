<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <div class="page_header_title">
        <span class="pointer" @click="$router.push({ path: '/shop/thirdShop' })"> 第三方店铺</span>
        >
        <span>售后单数量详情</span>
      </div>
      <div class="filter_top">
        <div class="detail-shop-mess">
          <div class="detail-shop-mess-row">
            <span class="title">店铺名称：{{ shopDetail.shopName }}</span>
            <span>店铺类型：{{ shopType[shopDetail.type] }}</span>
            <span>SHOP_ID：{{ shopDetail.shopId }}</span>
          </div>
          <div class="detail-shop-mess-row last-line">
            <span
              style="margin-left: 0px"
            >近90天售后单数量/签单量<em><i>{{ shopDetail.afterNum ? shopDetail.afterNum : '-' }}</i>/{{ shopDetail.orderNum ? shopDetail.orderNum : '-' }}</em></span>
            <span>近60天售后单数量/签单量<em><i>{{ shopDetail.after60Num ? shopDetail.after60Num : '-' }}</i>/{{ shopDetail.order60Num ? shopDetail.order60Num : '-' }}</em></span>
            <span>近30天售后单数量/签单量<em><i>{{ shopDetail.after30Num ? shopDetail.after30Num : '-' }}</i>/{{ shopDetail.order30Num ? shopDetail.order30Num : '-' }}</em></span>
          </div>
        </div>
        <div slot="headerLeft" class="header-left">
          <span class="span-title">售后单关联商品清单</span>
          <el-select v-model="selectTime" placeholder="请选择时间查看范围">
            <el-option label="近30天" :value="30" />
            <el-option label="近60天" :value="60" />
            <el-option label="近90天" :value="90" />
          </el-select>
          <el-button class="search-btn" type="primary" @click="ToSearch">查询</el-button>
        </div>
        <div class="table-data">
          <el-table v-loading="dataloadding" :header-cell-style="rowClass" :data="tableData" border style="width: 100%">
            // eslint-disable-next-line vue/no-parsing-error
            <el-table-column label="序号" width="60" type="index" :index="table_index" />
            <el-table-column prop="contentName" label="商品名称" width="400">
              <template slot-scope="{ row }">
                <div class="name-row">
                  <span>{{ row.contentName }}</span>
                  <em @click="copyToztb(row.contentName)">复制</em>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品图片" width="122px">
              <template slot-scope="{ row }">
                <img style="width: 100px" :src="row.coverUrl" />
              </template>
            </el-table-column>
            <el-table-column prop="goodsId" label="商品ID" width="240">
              <template slot-scope="{ row }">
                <div class="name-row">
                  <span>{{ row.goodsId }}</span>
                  <em @click="copyToztb(row.goodsId)">复制</em>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="afterNum" label="申请售后次数" width="110" center />
            <el-table-column prop="orderNum" label="确认签单数量" width="110" center />
            <el-table-column prop="resonlist" label="原因清单">
              <template slot-scope="{ row }">
                <div v-if="row.reasonList">
                  <div v-if="row.reasonList.length > 3">
                    <el-tooltip class="update-border" placement="top" effect="light">
                      <div slot="content" style="border: 1px solid #ececec">
                        <el-table :data="row.reasonList">
                          <el-table-column width="300" property="reason" label="原因" />
                          <el-table-column width="60" property="reasonNum" label="编号" />
                        </el-table>
                      </div>
                      <el-button style="border: none">
                        <div style="width: 100%">
                          <p>
                            {{ row.reasonList[0].reason }}
                            <em style="font-style: normal">【{{ row.reasonList[0].reasonNum }}】</em>
                          </p>
                          <p>
                            {{ row.reasonList[1].reason }}
                            <em style="font-style: normal">【{{ row.reasonList[1].reasonNum }}】</em>
                          </p>
                          <p>
                            {{ row.reasonList[2].reason }}
                            <em style="font-style: normal">【{{ row.reasonList[2].reasonNum }}】</em>
                          </p>
                          <p>更多...</p>
                        </div>
                      </el-button>
                    </el-tooltip>
                  </div>
                  <div v-else>
                    <p v-for="(item, index) in row.reasonList" :key="index">
                      {{ index + 1 }}、{{ item.reason
                      }}<em style="font-style: normal">【{{ row.reasonList[index].reasonNum }}】</em>
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="fx-page">
            <el-pagination
              :total="total"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDetailList, getDetailDataList } from '@/api/shop/detail'
export default {
  name: 'ShopDetail',
  components: {},
  data() {
    return {
      dataloadding: false,
      loading: false,
      selectTime: 30,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      shopDetail: {},
      shopType: ['', '抖音', '快手'],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([])
  },
  created() {
    this.loadData()
  },
  activated() {
    this.loadData()
  },
  methods: {
    table_index(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    ToSearch() {
      this.loadTableData()
    },
    loadTableData() {
      this.dataloadding = true
      const params = {
        days: this.selectTime,
        shopId: this.shopDetail.shopId,
        size: this.pageSize,
        current: this.currentPage
      }
      getDetailDataList(params).then((res) => {
        if (res.code === 1) {
          this.dataloadding = false
          this.tableData = res.data.records
          this.total = res.data.total
        }
      })
    },
    loadData() {
      const id = this.$route.query.id
      getDetailList(id).then((res) => {
        if (res.data) {
          this.shopDetail = res.data
          this.loadTableData()
        }
      })
    },
    copyToztb(data) {
      var input = document.createElement('input')
      input.value = data
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      document.body.removeChild(input)
      this.$message.success('复制成功！')
    },
    rowClass() {
      return 'background: #f3f3f3;'
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.loadTableData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loadTableData()
    }
  }
}
</script>

<style>
.el-tooltip__popper.is-light {
  border: 1px solid #ececec;
}
</style>
<style lang="scss" scoped>
.page_wrap {
  // height: 100%;
  // min-width: 1200px;
  // background-color: #fff;
  font-family: '微软雅黑';
  border-radius: 4px;
  .content {
    height: 100%;
    overflow: auto;
    min-width: 1280px;
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
      margin-bottom: 20px;
      padding: 0 20px;
      padding-bottom: 20px;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
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
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
      .ss-pagination-warpper {
        text-align: right;
        .ss-pagination-warpper-left {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}

.detail-shop-mess {
  width: 100%;
  padding-top: 10px;
  height: 90px;
  .detail-shop-mess-row {
    width: 100%;
    height: 40px;
    line-height: 40px;
    span {
      float: left;
      margin-right: 20px;
      text-align: left;
      color: #666;
      font-size: 14px;
      em {
        font-style: normal;
        color: rgba(2, 167, 240, 1);
      }
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      font-family: '微软雅黑';
    }
  }
  .last-line {
    min-width: 1200px;
    margin-top: 5px;
    color: #777;
    width: 100%;
    float: left;
    height: 70px;
    span {
      margin-left: 120px;
      font-size: 16px;
      em {
        float: left;
        width: 100%;
        color: #777;
        margin-top: -5px;
        i {
          color: #333;
          font-size: 26px;
          font-style: normal;
        }
      }
    }
  }
}
.span-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  font-family: '微软雅黑';
  margin-right: 20px;
  float: left;
}

.search-btn {
  margin-left: 20px;
}
.table-data {
  width: 100%;
  margin-top: 15px;
}
.fx-page {
  width: 100%;
  text-align: right;
  margin-top: 15px;
}
.page_header_title {
  margin-bottom: 25px;
  span {
    color: #333;
  }
}
.pointer {
  font-size: 16px;
  color: #777;
}

.header-left {
  margin-top: 60px;
  padding-top: 20px;
  text-align: right;
  border-top: 1px solid #e7e7e7;
}

.name-row {
  span {
    float: left;
    width: 85%;
  }
  em {
    float: right;
    font-style: normal;
    color: rgba(2, 167, 240, 1);
    cursor: pointer;
  }
}
</style>
