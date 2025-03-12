<template>
  <!-- 获客助手链接 -->
  <div class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :empty-text="status ? '暂无数据' : '未开启店铺配置功能'"
      keys="generalSetting_logistics_shopInfo"
      :slot-arr="slotArr"
      style="height: calc(100vh - 260px)"
      :current-page="config.currentPage"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="tableColumns()"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="empty">
        <el-empty
          v-if="!status"
          :image-size="400"
          :description="isToConfig ? '暂无数据' : '未开启店铺配置功能'"
        >
          <img
            slot="image"
            src="@/assets/image/aigc/digitalVideoManage/icn_nodata.png"
            alt=""
          />
          <div v-if="!isToConfig" slot="default">
            请先在 售后管理-售后设置-实物物流-基本信息 设置中开启物流服务<span
              style="color: #409eff; cursor: pointer"
              @click="toConfig"
            >
              点击进入
            </span>
          </div>
        </el-empty>
        <div v-else>暂无数据</div>
      </template>
      <template slot="search">
        <div class="searchBox">
          <div class="searchLeft">
            <div class="title">渠道名称</div>
            <m-select
              v-model="search.type"
              :dict-list="channelSourceList"
              :param="{ value: 'channelSource', label: 'channelSourceName' }"
            />
            <div class="title m-l-20">店铺名称</div>
            <el-input v-model="search.shopName" class="inputBox" clearable />
            <el-button type="primary" @click="searchFn">查询</el-button>
            <el-button @click="handleRest">重置</el-button>
          </div>
        </div>
      </template>
      <template slot="supportHG" slot-scope="scope">
        <div class="flex">
          <div style="margin-right:10px">
            {{ scope.row.supportHG ? '开启' : '关闭' }}</div>
          <el-switch
            v-model="scope.row.supportHG"
            element-loading-spinner="el-icon-loading"
            @change="handleEditType(scope.row,2)"
          />
        </div>
      </template>
      <template slot="toDeliveryFlag" slot-scope="scope">
        <div class="flex">
          <div style="margin-right:10px">
            {{ !!scope.row.toDeliveryFlag ? '开启' : '关闭' }}
          </div>
          <el-switch
            v-model="scope.row.toDeliveryFlag"
            element-loading-spinner="el-icon-loading"
            @change="handleEditType(scope.row,1)"
          />
        </div>
      </template>
    </MPageLayout>
  </div>
</template>

<script>
import {
  getShopList,
  editShopList,
  getLogisticsSetting
} from '@/api/business/orderLogistics'
import { selectThridShopChannelData } from '@/api/shop/thirdShop'
export default {
  data() {
    return {
      search: {
        shopName: '',
        type: ''
      },
      isGoodsName: '',
      channelSourceList: [],
      active: '',
      slotArr: ['action', 'search', 'footer', 'empty', 'toDeliveryFlag', 'supportHG'],
      status: false,
      config: {
        tableData: [],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false
    }
  },
  mounted() {
    this.getLogisticsSetting()
    this.selectThridShopChannelData()
  },
  methods: {
    getLogisticsSetting() {
      getLogisticsSetting({ erpType: 1 })
        .then(res => {
          if (res.data) {
            this.status = res.data.status
            if (this.status) {
              this.searchFn()
            }
          }
        })
        .catch(() => {})
    },
    toConfig() {
      this.$router.push({
        path: '/afterSale/generalSetting/logistics/basicInfo'
      })
    },
    async handleEditType(row, type) {
      const { code } = await editShopList({
        shopId: row.shopId,
        type
      })
      if (code === 1) {
        this.$message.success('修改成功')
      }
    },
    tableColumns() {
      return [
        {
          prop: 'type',
          label: '渠道',
          type: 'text',
          render: row => {
            return this.channelSourceList.find(
              item => item.channelSource === row.type
            )?.channelSourceName
          }
        },
        { prop: 'shopName', label: '店铺名称', type: 'text' },
        { prop: 'shopId', label: 'ShopID', type: 'text' },
        { prop: 'shopIdT', label: '店铺ID', type: 'text' },
        {
          prop: 'shelveFlag',
          label: '上架状态',
          type: 'text',
          width: 100,
          render: row => {
            return row.shelveFlag === 0 ? '上架' : '下架'
          }
        },
        {
          prop: 'toDeliveryFlag',
          label: '支持物流状态',
          type: 'slot'
        },
        {
          prop: 'supportHG',
          label: '支持港澳台物流',
          type: 'slot'
        }
      ]
    },
    async selectThridShopChannelData() {
      const { code, data } = await selectThridShopChannelData()
      if (code === 1) {
        this.channelSourceList = data
      }
    },
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    handleRest() {
      this.search = {
        shopName: '',
        type: ''
      }
      this.searchFn()
    },
    // 获取列表数据
    async getList() {
      if (!this.status) return
      this.loading = true
      try {
        const params = {
          current: this.config.currentPage,
          size: this.config.pageSize,
          ...this.search
        }
        const { code, data } = await getShopList(params)
        if (code === 1) {
          this.config.tableData = data.records.map(i => ({ ...i, supportHG: !i.filterAddressesFlag }))
          this.config.total = data.total
        }
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    // 分页改变触发
    handleSizeChange(val) {
      this.config.pageSize = val
      this.searchFn()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap::v-deep {
  padding: 0;
  .el-form-item__content .el-input__inner {
    padding-right: 55px;
  }
}
.searchBox::v-deep {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  > .searchLeft {
    display: flex;
    align-items: center;
    > .title {
      min-width: 80px;
      color: #666666;
      font-size: 14px;
    }
    > .inputBox {
      margin-right: 10px;
    }
  }
}
.flexBox {
  display: flex;
  align-items: center;
  .color_icon {
    color: #0d85f5;
    margin-left: 5px;
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 10px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
