<template>
  <div v-loading="loading" class="page_wrap">
    <div class="content">
      <div class="filter_top">
        <filterTop :search="search" @search="onSearch" />
      </div>

      <div class="table-module">
        <el-dropdown type="primary" @command="exportExcel">
          <el-button v-permission="['system:goods:third:export', permsList]" type="primary" :loading="exportLoading">
            导出<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">导出查询结果</el-dropdown-item>
            <el-dropdown-item command="2">导出所选</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-table ref="table" v-loading="search.loading" class="m-t-20" :data="tableData" border :header-cell-style="{background: '#f5f5f5'}" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="contentName" label="获课商品名称" width="240">
            <template slot-scope="{ row }">
              <div class="a_link" title="点击前往商品编辑" @click="gotoGoodsEdit(row)">{{ row.contentName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsType" label="获课商品类型" width="240">
            <template slot-scope="{ row }">
              <div>{{ goodsType_obj[row.goodsType] }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="渠道平台" width="240">
            <template slot-scope="{ row }">
              <div>{{ row.type | getOptionsValue(thirdShopType) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="店铺名称" width="240" />
          <el-table-column prop="productId" label="渠道店铺商品ID" width="240" />
          <el-table-column prop="createTime" label="对应时间" width="240" />
          <el-table-column prop="createBy" label="对应人姓名" width="240" />
        </el-table>

        <div class="ss-pagination-warpper m-t-20 m-b-20">
          <div class="fl ss-pagination-warpper-left">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
              <span v-if="multipleSelection.length === 0">选中本页</span>
              <span v-else class="des">已选{{ multipleSelection.length }}项</span>
            </el-checkbox>
            <el-button v-permission="['system:goods:third:remove', permsList]" class="m-l-20" :disabled="multipleSelection.length === 0" type="danger" @click="del">删除</el-button>
          </div>
          <el-pagination
            :current-page="search.current"
            :page-size="search.size"
            layout="total, prev, pager, next, jumper"
            :total="total"
            background
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-drawer
      :title="titleFlag"
      :visible.sync="visibleFlag"
      direction="rtl"
      size="1200px"
      :before-close="handleClose"
    >
      <div v-if="editType === 3">
        <colunmEdit ref="editDrawwerColunmEdit" :goods-id="goodsIdNowEdit" @close="handleCloseFromZ" />
      </div>
      <div v-if="editType === 4">
        <collegeColunmEdit ref="editDrawwerCollegeColunmEdit" :goods-id="goodsIdNowEdit" @close="handleCloseFromZ" />
      </div>
      <div v-if="editType === 5">
        <offlineEdit ref="editDrawwerofflineEdit" :goods-id="goodsIdNowEdit" @close="handleCloseFromZ" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGoodsThirdCheckPage, delThirdCheck, exportThirdCheck } from '@/api/shop/thirdShop'
import filterTop from './filterTop.vue'
import colunmEdit from '@/views/course/column/edit.vue'
import collegeColunmEdit from '@/views/course/collegeColumn/edit.vue'
import offlineEdit from '@/views/course/offline/edit.vue'
export default {
  name: 'ThirdShopCheck',
  components: {
    filterTop,
    colunmEdit,
    collegeColunmEdit,
    offlineEdit
  },
  data() {
    return {
      titleFlag: '',
      editType: 3,
      visibleFlag: false,
      goodsIdNowEdit: '',
      loading: false,
      search: {
        order: { label: 'contentName', value: '' }, // 订单搜索
        channelSource: '', // 渠道来源
        thirdShopId: '', // 第三方店铺id
        thirdShopName: '', // 第三方店铺名称
        current: 1, // 当前页
        size: 10, // 每页条数
        loading: false
      },
      tableData: [],
      total: 0,
      multipleSelection: [],
      checkAll: false,
      isIndeterminate: false,
      exportLoading: false,
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'thirdShopType',
      'goodsType_obj'
    ])
  },
  created() {
    console.log(this.$route)
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    handleClose() {
      this.visibleFlag = false
    },
    handleCloseFromZ(string) {
      if (string === 'fromSuccess') {
        this.init()
      }
      this.handleClose()
    },
    init() {
      this.search = {
        order: { label: 'contentName', value: '' }, // 订单搜索
        channelSource: Number(this.$route.query.type) || '', // 渠道来源
        thirdShopId: this.$route.query.shopId || '', // 第三方店铺id
        thirdShopName: this.$route.query.shopName || '', // 第三方店铺名称
        current: 1, // 当前页
        size: 10, // 每页条数
        loading: false
      }
      console.log(this.search, 'search')
      this.getList()
    },
    getList() {
      this.search.loading = true
      const params = {
        size: this.search.size,
        current: this.search.current,
        type: this.search.channelSource,
        shopId: this.search.thirdShopId,
        [this.search.order.label]: this.search.order.value
      }
      getGoodsThirdCheckPage(params).then(res => {
        this.search.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.search.loading = false
        this.loading = false
      })
    },
    onSearch(val) {
      this.search = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.search.current = val
      this.getList()
    },
    // 列表选择
    handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length === 0) {
        this.checkAll = false
        this.isIndeterminate = false
      } else {
        this.isIndeterminate = this.multipleSelection.length !== this.tableData.length
        this.checkAll = this.multipleSelection.length === this.tableData.length
      }
    },
    // 点击选中本页
    handleCheckAllChange() {
      this.$refs.table.toggleAllSelection()
    },
    del() {
      console.log(this.multipleSelection)
      this.$delModal({
        tips: `确定删除这${this.multipleSelection.length}项吗？`,
        success: () => {
          this.loading = true
          const list = []
          this.multipleSelection.map(v => list.push(v.id))
          const data = {
            list
          }
          delThirdCheck(data).then(res => {
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    gotoGoodsEdit(row) {
      // console.log(row, 'row')
      // const obj = {
      //   0: '/course/imageEdit/',
      //   1: '/course/audioEdit/',
      //   2: '/course/videoEdit/',
      //   3: '/course/columnEdit/',
      //   4: '/course/collegeColumnEdit/',
      //   5: '/course/offlineEdit/'
      // }
      // // this.$router.push({ path: obj[row.goodsType] + row.goodsId })
      // window.open(window.location.origin + '#' + obj[row.goodsType] + row.goodsId, '_blank')

      /* const obj = {
        0: 'editImage',
        1: 'editAudio',
        2: 'editVideo',
        3: 'editColumn',
        4: 'editCollegeColumn',
        5: 'editOffline'
      }
      // // window.open(window.location.origin + `#${obj[row.goodsType]}${row.goodsId}`, '_blank')
      // if (row.goodsType === 5) {
      //   window.open(window.location.origin + `#/course/offlineEdit/${row.goodsId}`, '_blank')
      // } else {
      //   }
      this.$AppEditGoods({
        type: obj[row.goodsType],
        goodsId: row.goodsId,
        visible: true,
        width: '1200px',
        success: () => {
          this.getList()
        }
      }) */
      this.editType = row.goodsType
      this.goodsIdNowEdit = row.goodsId
      if (row.goodsType === 3) {
        this.titleFlag = '编辑专栏'
        this.$nextTick(() => {
          this.$refs.editDrawwerColunmEdit.init()
        })
      }
      if (row.goodsType === 4) {
        this.titleFlag = '编辑大专栏'
        this.$nextTick(() => {
          this.$refs.editDrawwerCollegeColunmEdit.init()
        })
      }
      if (row.goodsType === 5) {
        this.titleFlag = '编辑线下课程'
        this.$nextTick(() => {
          this.$refs.editDrawwerofflineEdit.init()
        })
      }
      this.visibleFlag = true
    },
    // 点击导出
    exportExcel(command) {
      if (command === '2' && this.multipleSelection.length === 0) {
        return this.$message.error('请先选择数据')
      }
      const ids = []
      this.multipleSelection.map(v => ids.push(v.id))
      const params = {
        exportType: command,
        contentName: this.search.order.value,
        ids,
        shopId: this.search.thirdShopId,
        type: this.search.channelSource
      }
      exportThirdCheck(params).then(res => {
        this.exportLoading = false
        console.log(res)
        window.location = res.data
      }).catch(() => {
        this.exportLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.page_wrap {
    // height: 100%;
    // min-width: 1200px;
    // background-color: #fff;
    border-radius: 4px;
    .content {
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 8px;
        height: 10px;
        background-color: rgba(0,0,0,0);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(0,0,0,.2);
        transition: all .4s ease;
        -moz-transition: all .4s ease;
        -webkit-transition: all .4s ease;
        -o-transition: all .4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,.1);
      }
      .filter_top {
        margin-bottom: 20px;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
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
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
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
</style>
