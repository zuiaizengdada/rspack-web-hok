<template>
  <div class="add-goods-drawer">
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      direction="rtl"
      size="1000px"
      :show-close="false"
      :destroy-on-close="true"
      :close-on-press-escape="false"
      :wrapper-closable="false"
      :before-close="handleClose"
    >
      <div slot="title" class="ss-material-box-header">
        <div class="ss-material-box-header-title">商品选择</div>
      </div>
      <div class="goods-search">
        <el-input v-model.trim="contentName" placeholder="请输入内容" class="input-with-input" clearable>
          <el-select slot="prepend" v-model="orderLabel" placeholder="请选择" class="input-with-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-input>
        <el-button class="goods-search-cls" type="primary" size="small" @click="searchGoodsData">查询</el-button>
      </div>
      <div class="data-row">
        <el-table
          ref="goodsDataTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :row-key="getRowKeys"
          :header-cell-style="headerCellStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            :selectable="handleDisable"
            :reserve-selection="true"
            width="55"
          />
          <el-table-column
            label="商品信息"
            width="460"
          >
            <template slot-scope="scope">
              <div class="goods-mess-row">
                <ImagePreviewer class="image-previewer" :src="scope.row.coverUrl" alt="" fit="contain" />
                <span class="good-mess-detail">
                  <p>{{ scope.row.contentName }}</p>
                  <span v-if="scope.row.disabled" class="tips">{{ drawerTips }}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="商品价格"
            header-align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.goodsType === 5" class="goods-types-row">
                <el-popover
                  placement="bottom"
                  width="450"
                  trigger="hover"
                  popper-class="message-popover"
                >
                  <el-table
                    :data="scope.row.materialSpecVos"
                    :header-cell-style="headerCellStyle"
                    style="width: 100%;border: 1px solid rgb(245, 245, 245);"
                  >
                    <el-table-column
                      prop="specName"
                      label="规格"
                    />
                    <el-table-column
                      label="价格"
                    >
                      <template slot-scope="scope">
                        <p>¥ {{ (scope.row.salePrice/100).toFixed(2) }}</p>
                      </template>
                    </el-table-column>
                  </el-table>
                  <p slot="reference" class="search-price-p">查看规格报价</p>
                </el-popover>
              </div>
              <p v-else class="goods-type-price"><em>¥</em>{{ scope.row.salePrice? (scope.row.salePrice/100).toFixed(2):0 }}</p>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            width="150"
          >
            <template slot-scope="scope">
              <p v-if="scope.row.goodsType === 3">专栏</p>
              <p v-if="scope.row.goodsType === 4">大专栏</p>
              <p v-if="scope.row.goodsType === 5">线下课</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-row">
        <el-pagination
          :current-page="pageObject.current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageObject.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageObject.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div class="action-row">
        <span>已选<em>{{ multipleSelection.length }}</em>/<em>{{ pageObject.total }}</em></span>
        <div class="sure-cls">
          <el-button size="small" type="primary" @click="chooseGoodsMethod">选择</el-button>
          <el-button size="small" @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getGoodsDataForCoupon } from '@/api/marketingTools/coupon.js'
export default {
  name: 'CouponManager',
  components: {
  },
  props: {
    drawer: {
      type: Boolean,
      default: () => false
    },
    chooseGoodsArray: {
      type: Array,
      default: () => []
    },
    couponPrice: {
      type: String,
      default: () => '0'
    },
    drawerTips: {
      type: String,
      default: () => ''
    },
    discontType: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      pageObject: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      headerCellStyle: {
        'background-color': 'rgb(245, 245, 245)'
      },
      options: [
        { label: '商品名称', value: 'goodsName' }
      ],
      orderLabel: 'goodsName',
      multipleSelection: [],
      contentName: '',
      tableData: []
    }
  },
  watch: {
  },
  created() {
    this.multipleSelection = this.chooseGoodsArray
    this.searchGoodsData()
  },
  mounted() {

  },
  activated() {
  },
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    unique(arr) { // 根据唯一标识id来对数组进行过滤
      const res = new Map()// 定义常量 res,值为一个Map对象实例
      // 返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter((arr) => !res.has(arr.goodsId) && res.set(arr.goodsId, 1))
    },
    handleClose() {
      this.$emit('closeDrawer')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multipleSelection = this.unique(this.multipleSelection)
    },
    getRowKeys(row) {
      return row.goodsId
    },
    searchGoodsData() {
      const params = {
        current: this.pageObject.current,
        size: this.pageObject.pageSize,
        goodsTypes: [3, 4, 5, 8],
        contentName: this.contentName
      }
      getGoodsDataForCoupon(params).then(res => {
        if (res.code === 1) {
          this.pageObject.current = res.data.current
          this.pageObject.total = res.data.total
          this.pageObject.pageSize = res.data.size
          this.tableData = res.data.records
          this.changeDataStatus()
        }
      })
    },
    chooseGoodsMethod() {
      this.$emit('chooseGoodsMethod', this.multipleSelection)
    },
    changeDataStatus() {
      if (this.discontType === 2) {
        this.tableData.some(item => {
          if (item.goodsType === 5) {
            item.materialSpecVos.some(obj => {
              if (obj.salePrice <= parseFloat(this.couponPrice) * 100) {
                this.$set(item, 'disabled', true)
              }
            })
          } else {
            if (item.salePrice <= parseFloat(this.couponPrice) * 100) {
              this.$set(item, 'disabled', true)
            } else {
              this.$set(item, 'disabled', false)
            }
          }
        })
      } else if (this.discontType === 1) {
        this.tableData.some(item => {
          if (item.goodsType === 5) {
            item.materialSpecVos.some(obj => {
              if (obj.salePrice < parseFloat(this.couponPrice) * 100) {
                this.$set(item, 'disabled', true)
              }
            })
          } else {
            if (item.salePrice < parseFloat(this.couponPrice) * 100) {
              this.$set(item, 'disabled', true)
            } else {
              this.$set(item, 'disabled', false)
            }
          }
        })
      }

      this.multipleSelection = this.unique(this.multipleSelection)
      this.multipleSelection.some(obj => {
        this.$refs.goodsDataTable.toggleRowSelection(obj, true)
      })
    },
    handleDisable(row) {
      if (row.disabled) {
        return false
      } else {
        return true
      }
    },
    handleSizeChange(val) {
      this.pageObject.pageSize = val
      this.searchGoodsData()
    },
    handleCurrentChange(val) {
      this.pageObject.current = val
      this.searchGoodsData()
    }
  }
}
</script>

<style lang="scss" scoped>
.add-goods-drawer {
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 10px;
    background-color: #fff;
    .ss-material-box-header {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 52px;
        padding: 15px 0px;
        background: #FFFFFF;
        border-radius: 2px 2px 0 0;
        border-bottom: 1px solid #f2f2f2;
        color: #353535;
        font-size: 16px;
        font-weight: bold;
        .ss-material-box-header-title {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        -webkit-box-orient: vertical;
        }
    }
    ::v-deep .el-drawer__header{
        padding-top: 5px;
    }
    .goods-search {
        width: 100%;
        padding: 0 20px;
        .input-with-input {
            width: 308px;
        }
        .input-with-select {
            width: 120px;
            height: 32px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333333;
            border-radius: 3px 0px 0px 3px;
        }
        .goods-search-cls {
            margin-left: 15px;
        }
    }
    .data-row {
        padding: 0 20px;
        margin-top: 20px;
        ::v-deep .el-table__body-wrapper {
            max-height: 620px;
            overflow-y: auto;
        }
        .image-previewer {
            float: left;
            width: 80px;
            height: 80px;
            border-radius: 2px;
            margin-right: 10px;
            border: 0;
            vertical-align: middle;
            background: rgb(245, 247, 250);
        }
        .good-mess-detail {
            float: left;
            width: 320px;
            height: 60px;
            margin-left: 15px;
            p {
                width: 100%;
                line-height: 20px;
                min-height: 40px;
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .tips {
                color: #F53F3F;
                line-height: 20px;
                font-size: 12px;
            }
        }
        .goods-type-price {
            text-align: center;
            font-size: 14px;
            color: #333;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            em {
                font-style: normal;
                margin-right: 10px;
            }
        }
        .search-price-p {
            width: 100%;
            cursor: pointer;
            text-align: center;
            color: #0C6FFF;
        }
    }
    .page-row {
        text-align: right;
        margin-top: 20px;
        padding-right: 20px;
    }
    .action-row {
        padding: 10px 20px;
        margin-top: 10px;
        span {
            color: #333;
            font-size: 14px;
            float: left;
            line-height: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            em {
                font-style: normal;
                padding: 0 5px;
            }
        }
        .sure-cls {
            float: right;
        }
    }
}

</style>
<style>
.message-popover {
  padding: 0 !important;
  width: 360px!important;
}
</style>
