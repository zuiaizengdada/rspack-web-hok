<template>
  <div v-loading="loading">
    <!-- 操作记录 -->
    <el-table :data="data" :header-cell-style="{ background: '#f5f5f5' }">
      <el-table-column prop="operateTime" label="操作时间" />
      <el-table-column prop="operateUserName" label="操作人" />
      <el-table-column prop="content" label="操作内容" width="160px">
        <template slot-scope="{ row }">
          <div class="reasonContent">
            <span>{{ row.content }}</span>
            <el-popover placement="top-start" trigger="hover">
              <div>
                <span>{{ row.extraContent }}</span>
                <div v-if="row.images && row.images.length">
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="row.images[row.srcUrlIndex]"
                    :preview-src-list="row.images"
                  />
                  <div>
                    <el-button
                      type="text"
                      :disabled="row.srcUrlIndex === 0"
                      @click="prev(row)"
                    >上一张</el-button>
                    <el-button
                      type="text"
                      :disabled="row.srcUrlIndex === row.images.length - 1"
                      @click="next(row)"
                    >下一张</el-button>
                  </div>
                </div>
              </div>
              <span
                v-if="row.extraContent"
                slot="reference"
                style="color: #0c6fff"
              >查看原因</span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getOperationRecordPage
} from '@/api/deliver/studentManagement'
export default {
  components: {},
  props: {
    deliveryInfoId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      loading: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    prev(row) {
      row.srcUrlIndex -= 1
    },
    next(row) {
      row.srcUrlIndex += 1
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
    init() {
      this.currentPage = 1
      this.total = 0
      this.data = []
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        deliveryInfoId: this.deliveryInfoId
      }
      getOperationRecordPage(params)
        .then(res => {
          this.data = res.data.records?.map(i => {
            return {
              ...i,
              srcUrlIndex: 0
            }
          })
          this.total = Number(res.data.total)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  height: 62px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.reasonContent {
  display: flex;
  justify-content: space-between;
}
</style>
