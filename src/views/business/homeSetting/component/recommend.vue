<template>
  <div class="content">
    <div class="content_header">
      <div class="header_left">
        <el-button type="primary" @click="selectGoods()">添加商品</el-button>
      </div>
    </div>

    <div class="content_table">
      <el-table
        border
        :data="tableData"
        style="width: 100%;"
        height="100%"
        class="myTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="contentName:"
          label="商品名称"
        >
          <template slot-scope="{ row }">
            <div class="fl goods-info-wrapper">
              <ImagePreviewer
                class="m-r-10"
                style="width: 60px; height: 60px;border-radius: 4px;background: #F5F7FA"
                :src="row.coverVerticalUrl || row.coverUrl"
                fit="fill"
              />
              <div class="goods-info-detail">
                <div class="titleOptions">
                  {{ row.contentName }}
                </div>
                <div class="price-info">
                  <span v-if="row.saleType && row.saleType === 0" class="c_777">免费</span>
                  <span v-if="row.saleType && row.saleType === 1" class="c_777">￥{{ row.salePrice | filtersMoney }}</span>
                  <span v-if="row.saleType && [0, 1].includes(row.saleType) && [0, 1].includes(row.saleValidity)" class="c_777"> / </span>
                  <span v-if="row.saleValidity && row.saleValidity === 0" class="c_777">长期有效</span>
                  <span v-if="row.saleValidity && row.saleValidity === 1" class="c_777">有效期{{ row.validityDays }}天</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsType"
          label="类型"
          width="180"
        >
          <template slot-scope="{ row }">
            {{ goodsType_obj[row.goodsType] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="shelveFlag"
          label="上架状态"
          width="180"
        >
          <template slot-scope="{ row }">
            <AppStatus :status="['success', 'error'][row.shelveFlag]">
              <span>
                {{ ['已上架', '已下架', '待上架'][row.shelveFlag] }}
              </span>
            </AppStatus>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="序号"
          width="180"
        >
          <template slot-scope="{ row }">
            <el-popover
              v-model="row.visible"
              placement="bottom"
              width="240"
            >
              <p>
                排列至第
                <el-input v-model.trim="sortChange" class="w-80" />
                位
              </p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="showSort(row)">取消</el-button>
                <el-button type="primary" @click="sort(row)">确定</el-button>
              </div>
              <el-button slot="reference" type="text" class="m-r-10" @click="sortChange = row.sort || 0">{{ row.sort }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="shelveTime"
          label="上架时间"
          width="180"
        />
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="{ row }">
            <el-button v-permission="['web:groupDetail:edit', $route.meta.permsList]" type="text" @click="gotoEdit(row)">编辑</el-button>
            <el-button v-permission="['system:group:remove', $route.meta.permsList]" type="text" @click="_disassociateBatch(row)">移出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="content_footer">
      <el-button @click="allDisassociateBatch()">批量移出</el-button>
      <el-pagination
        class="pagination"
        :current-page="current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { groupingRelationPage, groupingRelationBatch, groupingRelationDisassociate, groupingSort } from '@/api/shop'
import AppStatus from '@/components/AppStatus'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    AppStatus
  },
  data() {
    return {
      loading: false,
      shelveFlag: '',
      current: 1,
      size: 10,
      contentName: '',
      tableData: [],
      total: 0,
      sortChange: '', // 排序的目标值
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters(['goodsType_obj']),
    ...mapState({
      groupingId: state => state.homePageSetting.groupId.like
    })
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      const params = {
        groupingId: this.groupingId,
        current: this.current,
        size: this.size
      }
      groupingRelationPage(params).then(res => {
        console.log(res, '获取列表详情数据')
        this.tableData = res.data.records
        this.total = res.data.total
        this.$store.dispatch('homePageSetting/getLikeList')
      })
    },
    handleSizeChange(val) {
      this.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    selectGoods() {
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check: this.tableData,
        tabList: [
          // { id: '0', name: '图文', api: '' },
          // { id: '1', name: '音频', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '7', name: '套餐课', api: '' },
          { id: '10', name: '直播课', api: '' }
          // { id: '5', name: '线下课', api: '' }
        ],
        currentId: '3',
        success: (res) => {
          console.log(res, 'res+++')
          const data = []
          res.map(v => {
            data.push({
              groupingId: this.groupingId,
              goodsId: v.goodsId
            })
          })
          this._columnBatch(data)
        }
      })
    },
    _columnBatch(res) {
      const data = {
        groupingId: this.groupingId,
        list: res
      }
      groupingRelationBatch(data).then(res => {
        this.current = 1
        this.getList()
      })
    },
    gotoEdit(row) {
      // console.log(row, 'row')
      // const obj = {
      //   0: '/course/imageEdit/',
      //   1: '/course/audioEdit/',
      //   2: '/course/videoEdit/',
      //   3: '/course/columnEdit/',
      //   4: '/course/collegeColumnEdit/',
      //   5: '/course/offlineEdit/'
      // }
      // this.$router.push({ path: obj[row.goodsType] + row.goodsId })

      // console.log(row, 'row')
      const obj = {
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
      })
    },
    // 移出商品
    _disassociateBatch(row) {
      this.$delModal({
        tips: '确定移出?',
        success: () => {
          this.loading = true
          const data = {
            groupingId: this.groupingId,
            list: [{
              goodsId: row.goodsId,
              groupingId: this.groupingId
            }]
          }
          groupingRelationDisassociate(data).then(res => {
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    allDisassociateBatch() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('至少选择一项')
      }
      this.$delModal({
        tips: `确定移出这${this.multipleSelection.length}项?`,
        success: () => {
          this.loading = true
          const list = []
          this.multipleSelection.map(v => {
            list.push({
              goodsId: v.goodsId,
              groupingId: this.groupingId
            })
          })
          const data = {
            groupingId: this.groupingId,
            list: list
          }
          groupingRelationDisassociate(data).then(res => {
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    // 商品展示排序弹框
    showSort(row) {
      row.visible = false
      this.sortChange = row.sort
    },
    // 商品排序
    sort(row) {
      row.visible = false
      this.loaidng = true
      const params = {
        groupingId: this.groupingId,
        goodsId: row.goodsId,
        sort: this.sortChange
      }
      groupingSort(params).then(res => {
        this.getList()
      }).catch(() => {
        this.loaidng = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
   .content_header {
     display: flex;
     align-items: center;
      padding: 10px;
    justify-content: space-between;
   }
   .content_table {
    flex: 1 0 0;
    // overflow: auto;
    display: flex;
    flex-direction: column;
    .pagination {
        margin-top: 20px;
        text-align: right;
    }
   }
   .content_footer {
    // height: 80px;
    padding: 10px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
   }
}
.goods-info-wrapper {
  width: 100%;
  height: 60px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .goods-info-detail {
    line-height: 1.5;
    width: calc(100% - 82px);
    height: 100%;
    flex: 1;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .titleOptions {
      display: flex;
      width: 100%;
      // align-items: center;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      word-wrap: break-word;
      font-size: 14px;
      color: #353535;
      cursor: pointer;
    }
  }
}
</style>
