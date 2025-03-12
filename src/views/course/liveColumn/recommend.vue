<template>
  <div class="content">
    <div class="content_header">
      <div class="header_left">
        <el-button v-permission="['system:recommend:add', permsList]" type="primary" @click="selectGoods()">添加推荐</el-button>
      </div>
      <div class="header_right">
        <el-select v-model="shelveFlag" @change="getList">
          <el-option label="全部" value="" />
          <el-option label="已上架" :value="0" />
          <el-option label="已下架" :value="1" />
          <el-option label="待上架" :value="2" />
        </el-select>
        <el-input v-model.trim="contentName" class="w-200 m-l-10 m-r-10" placeholder="请输入商品名称" clearable @keyup.enter.native="init" @clear="handerSearch" />
        <el-button :loading="loading" @click="handerSearch">搜索</el-button>
      </div>
    </div>

    <div class="content_table">
      <el-table
        v-loading="loading"
        border
        :data="tableData"
        style="width: 100%"
        class="m-t-20"
        :header-cell-style="{background: '#f5f5f5'}"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="contentName"
          label="商品名称"
          min-width="280"
        >
          <template slot-scope="{ row }">
            <div class="fl goods-info-wrapper">
              <el-image
                class="m-r-10"
                style="width: 82px; height: 60px;border-radius: 4px;background: #F5F7FA"
                :src="row.coverUrl"
                fit="contain"
                :preview-src-list="[row.coverUrl]"
              />
              <div class="goods-info-detail">
                <div class="titleOptions">
                  {{ row.contentName }}
                </div>
                <div class="price-info">
                  <span v-if="row.saleType === 0" class="c_777">免费</span>
                  <span v-if="row.saleType === 1" class="c_777">￥{{ row.salePrice | filtersMoney }}</span>
                  <span v-if="[0, 1].includes(row.saleType) && [0, 1].includes(row.saleValidity)" class="c_777"> / </span>
                  <span v-if="row.saleValidity === 0" class="c_777">长期有效</span>
                  <span v-if="row.saleValidity === 1" class="c_777">有效期{{ row.validityDays }}天</span>
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
          prop="shelveTime"
          label="上架时间"
          width="180"
        />
        <el-table-column
          prop="sort"
          label="排序"
          width="180"
        />
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="{ row }">
            <el-button v-permission="['system:recommend:edit', permsList]" type="text" @click="gotoEdit(row)">编辑</el-button>
            <el-button v-permission="['system:recommend:remove', permsList]" type="text" class="m-r-10" @click="_disassociateBatch(row)">移出</el-button>

            <el-popover
              v-model="row.visible"
              placement="bottom"
              width="240"
            >
              <p>
                序号
                <el-input v-model.trim="sortChange" class="w-80" type="number" :min="0" />
                <el-tooltip class="item" effect="dark" content="序号越小越靠前" placement="top-start">
                  <i class="el-icon-info m-l-10" />
                </el-tooltip>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="showSort(row)">取消</el-button>
                <el-button type="primary" @click="sort(row)">确定</el-button>
              </div>
              <el-button slot="reference" type="text" @click="sortChange = ''">排序</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <el-col :span="12">
          <el-button v-permission="['system:recommend:remove', permsList]" class="m-t-20" @click="allDisassociateBatch()">批量移出</el-button>
        </el-col>
        <el-col :span="12">
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
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// import { columnBatch, disassociateBatch } from '@/api/course'
import { recommendPage, recommendAddBatch, recommendDisassociateBatch, recommendSort } from '@/api/course'
import AppStatus from '@/components/AppStatus'
import { mapGetters } from 'vuex'
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
      multipleSelection: [],
      sortChange: '',
      id: '',
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'goodsType_obj'
    ])
  },
  created() {
    this.id = this.$route.params.id
    this.init()
  },
  methods: {
    showSort(row) {
      row.visible = false
    },
    sort(row) {
      row.visible = false
      this.loaidng = true
      const data = {
        goodsId: row.goodsId,
        columnId: this.id,
        sort: this.sortChange
      }
      recommendSort(data).then(res => {
        this.sortChange = ''
        this.getList()
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.getList()
    },
    getList() {
      if (!this.id) {
        return
      }
      this.loading = true
      const params = {
        goodsId: this.id,
        current: this.current,
        size: this.size,
        shelveFlag: this.shelveFlag,
        contentName: this.contentName
      }
      recommendPage(params).then(res => {
        console.log(res, '获取列表详情数据')
        this.tableData = res.data.records
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
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
      const check = [this.$route.params.id]
      this.tableData.map(v => {
        check.push(v.goodsId)
      })
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check,
        tabList: [
          { id: '0', name: '图文', api: '' },
          { id: '1', name: '音频', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' },
          { id: '6', name: '直播专栏', api: '' }
        ],
        currentId: '0',
        success: (res) => {
          const data = []
          res.map(v => {
            data.push(v.goodsId)
          })
          this._columnBatch(data)
        }
      })
    },
    _columnBatch(res) {
      const data = {
        goodsId: this.$route.params.id,
        goodsIdList: res
      }
      recommendAddBatch(data).then(res => {
        this.current = 1
        this.getList()
      })
    },
    gotoEdit(row) {
      console.log(row, 'row')
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
            goodsIdList: [row.goodsId],
            goodsId: this.$route.params.id
          }
          recommendDisassociateBatch(data).then(res => {
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
          const goodsIdList = []
          this.multipleSelection.map(v => {
            goodsIdList.push(v.goodsId)
          })
          const data = {
            goodsId: this.$route.params.id,
            goodsIdList
          }
          recommendDisassociateBatch(data).then(res => {
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handerSearch() {
      this.current = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
   .content_header {
       display: flex;
       justify-content: space-between;
       .header_left {
        }
        .header_right {

        }
   }
   .content_table {

       .pagination {
           margin-top: 20px;
           text-align: right;
       }
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
