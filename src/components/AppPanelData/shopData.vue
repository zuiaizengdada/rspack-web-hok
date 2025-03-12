<template>
  <div style="margin-top: 12px">
    <div class="top-data">
      <span class="left-title"><i /><span class="tit-name" @click="goBack">售卖渠道</span><span style="color:#ccc;margin-left: 4px;margin-right: 4px">/</span><span>{{ content }}</span></span>
    </div>
    <div class="shopContent">
      <el-table
        :data="sellDetailTotalData"
        style="width: 100%;margin-top: 16px;"
        :header-row-class-name="'tableClassName'"
      >
        <el-table-column
          prop="name"
          label="店铺名称"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="goPage(scope.row)"
            >{{ scope.row.shopName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="成交金额"
        >
          <template slot-scope="scope">
            <div>
              <div class="price">
                ￥{{ filterPrice(scope.row.dealTotal) }}
              </div>
              <div class="monthPrice">
                <span>
                  同期: {{ filterPrice(scope.row.beforeDealTotal) }}
                </span>
                <span class="ti-ri">
                  <i :class="fillClassString(scope.row.dealRatio)" />
                  <strong>{{ (scope.row.dealRatio) }}%</strong>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="直播带货"
        >
          <template slot-scope="scope">
            <div>
              <div class="price">
                ￥{{ filterPrice(scope.row.liveGoodsTotal) }}
              </div>
              <div class="monthPrice">
                <span>
                  同期: {{ filterPrice(scope.row.beforeLiveGoodsTotal) }}
                </span>
                <span class="ti-ri">
                  <i :class="fillClassString(scope.row.liveTotalRatio)" />
                  <strong>{{ (scope.row.liveTotalRatio) }}%</strong>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="内容带货"
        >
          <template slot-scope="scope">
            <div>
              <div class="price">
                ￥{{ filterPrice(scope.row.contentGoodsTotal) }}
              </div>
              <div class="monthPrice">
                <span>
                  同期: {{ filterPrice(scope.row.beforeContentGoodsTotal) }}
                </span>
                <span class="ti-ri">
                  <i :class="fillClassString(scope.row.contentTotalRatio)" />
                  <strong>{{ (scope.row.contentTotalRatio) }}%</strong>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="自然成交"
        >
          <template slot-scope="scope">
            <div>
              <div class="price">
                ￥{{ filterPrice(scope.row.natureTotal) }}
              </div>
              <div class="monthPrice">
                <span>
                  同期: {{ filterPrice(scope.row.beforeNatureTotal) }}
                </span>
                <span class="ti-ri">
                  <i :class="fillClassString(scope.row.natureTotalRatio)" />
                  <strong>{{ (scope.row.natureTotalRatio) }}%</strong>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="退款金额"
        >
          <template slot-scope="scope">
            <div>
              <div class="price">
                ￥{{ filterPrice(scope.row.refundTotal) }}
              </div>
              <div class="monthPrice">
                <span>
                  同期: {{ filterPrice(scope.row.beforeRefundTotal) }}
                </span>
                <span class="ti-ri">
                  <i :class="fillClassString(scope.row.refundTotalRatio)" />
                  <strong>{{ (scope.row.refundTotalRatio) }}%</strong>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>

export default {
  name: 'ShopData',
  props: {
    sellDetailTotalData: {
      type: Array,
      default: () => {
        return []
      }
    },
    content: {
      type: String,
      default: '抖音'
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    // 跳转页面部门
    goPage(item) {
      this.$emit('goPage', item)
    },
    goBack() {
      this.$emit('goBack')
    },
    fillClassString(num) {
      if (num < 0) {
        return 'red-p'
      } else {
        return 'green-p'
      }
    },
    // 过滤所有的数值
    filterPrice(num) {
      if (num === null) {
        return 0
      } else {
        const newNum = num
        if (newNum < 10000000 && newNum > -10000000) {
          return newNum
        } else {
          return (newNum / 10000).toFixed(2) + '万'
        }
      }
    },
    fillDataString(num) {
      const nums = Math.abs(num * 100).toFixed(2)
      return nums + '%'
    },
    handleGoPage() {
      this.$router.push({
        path: '/business/shopData?type=doudian'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .tableClassName>th{
    background: #F3F3F3 !important;
  }
}
::v-deep .el-page-header__content{
  color: #333;
  font-size: 16px;
  font-weight: bold;
}
.left-title {
  width: 200px;
  height: 32px;
  line-height: 32px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  font-family: '微软雅黑';
  display: flex;
  align-items: center;
  .tit-name {
    margin-left: 8px;
    cursor: pointer;
    color: #0c6fff;
  }
  .tit-name:hover{
  }
  i {
    width: 4px;
    height: 24px;
    margin-top: 3px;
    float: left;
    background: #0c6fff;
    border-radius: 8px;
  }
  img {
    float: left;
    width: 16px;
    margin-top: 5px;
    margin-left: 8px;
  }
}
.shopContent{
  border: 1px solid #CBCFD3;
  margin-top: 16px;
  padding: 10px 16px;
}
.tableClassName{
  background: #F3F3F3 !important;
}
.price{
  font-size: 18px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: #161616;
}
.monthPrice {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #777777;
  line-height: 20px;
  margin-top: 8px;

  .ti-ri {
    width: 59%;
    padding-top: 8px;
    text-align: right;
    margin-left: 4px;

    em {
      font-style: normal;
      color: #777;
      font-size: 14px;
      margin-right: 8px;
    }

    .red-p {
      width: 11px;
      height: 11px;
      display: inline-block;
      background-image: url('../../assets/image/product/down.png');
      background-size: 100% 100%;
    }

    .green-p {
      width: 11px;
      height: 11px;
      margin-right: 2px;
      display: inline-block;
      background-image: url('../../assets/image/product/up.png');
      background-size: 100% 100%;
    }

    i {
      font-size: 16px;
    }

    strong {
      font-size: 14px;
      font-family: 'DIN Alternate Bold';
      font-weight: bold;
      max-width: 68px;
      text-align: right;
      color: #161616;
      display: inline-block;
    }
  }
}
</style>
