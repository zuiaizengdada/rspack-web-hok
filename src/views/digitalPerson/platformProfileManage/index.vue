<template>
  <MCard class="page_wrap">
    <el-tabs v-model="activeName">
      <el-tab-pane label="形象管理" name="first">
        <MPageLayout
          ref="MPageLayout"
          class="page_content"
          type="tablePage"
          :slot-arr="slotArr"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          :table-data="config.tableData"
          :table-columns="config.tableColumns"
          :loading="loading"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <template slot="img" slot-scope="scope">
            <div class="flex flex-middle">
              <div
                v-if="
                  scope.row.resolutionType === 0 ||
                    scope.row.resolutionType === 2
                "
                class="horizontal-img"
                :style="{
                  'margin-right': '10px',
                  'background-image':
                    'url(' + scope.row.transversePhotoUrl + ')'
                }"
              >
                <div class="mask-img">
                  <div
                    class="mask-img-item"
                    @click="
                      openBigImg(scope.row.transversePhotoUrl, 'horizontal')
                    "
                  >
                    <i class="el-icon-zoom-in" />
                    大图
                  </div>
                </div>
              </div>
              <div
                v-if="
                  scope.row.resolutionType === 1 ||
                    scope.row.resolutionType === 2
                "
                class="vertical-img"
                :style="{
                  'margin-right': '10px',
                  'background-size': 'auto 80px',
                  'background-image': 'url(' + scope.row.photoUrl + ')'
                }"
              >
                <div class="mask-img">
                  <div
                    class="mask-img-item"
                    @click="openBigImg(scope.row.photoUrl, 'vertical')"
                  >
                    <i class="el-icon-zoom-in" />
                    大图
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template slot="search">
            <filterTop
              :search="search"
              @onSearch="onSearchFn"
              @onClear="onClear"
              @onAdd="add"
            />
          </template>

          <template slot="action" slot-scope="scope">
            <div>
              <el-button
                :disabled="scope.row.thirdType === 4"
                type="text"
                @click="edit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                :disabled="scope.row.thirdType === 4"
                type="text"
                class="c_red"
                @click="del(scope.row)"
              >
                删除
              </el-button>
            </div>
          </template>
        </MPageLayout>

        <createOrEditDialog
          v-if="visibleDialog"
          v-model="visibleDialog"
          :row="info"
          @success="submitSuccess"
          @close="visibleDialog = false"
        />
        <reviewImgDialog
          v-model="bigImgVisible"
          :row="selectImg"
          @close="bigImgVisible = false"
        />
        <delConfirmDialog
          v-model="delConfirmVisible"
          title="提示"
          message="形象删除后，对应机构将不能再继续使用该形象。确认删除该形象?"
          @submit="delConfirm"
          @close="delConfirmVisible = false"
        />
      </el-tab-pane>
      <el-tab-pane label="声音管理" name="second">
        <soundManage />
      </el-tab-pane>
    </el-tabs>
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import { getColumns } from './components/columns'

import createOrEditDialog from './components/createOrEditDialog'
import soundManage from './components/soundManage'
import reviewImgDialog from './components/reviewImgDialog'
import delConfirmDialog from './components/delConfirmDialog'

import { getCharacterPage, deleteCharacter } from '@/api/aiVideoManage'

export default {
  components: {
    filterTop,
    createOrEditDialog,
    reviewImgDialog,
    delConfirmDialog,
    soundManage
  },
  data() {
    return {
      activeName: 'first',
      slotArr: ['action', 'search', 'footer', 'img'],
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      info: {},
      search: {},
      loading: false,
      bigImgVisible: false,
      // type horizontal-横图 vertical-竖图
      selectImg: { type: '', url: '' },
      visibleDialog: false,
      delConfirmVisible: false
    }
  },
  created() {
    this.onSearchFn()
  },
  methods: {
    submitSuccess() {
      this.bigImgVisible = false
      this.onSearchFn()
    },
    openBigImg(url, type) {
      this.selectImg = { type: type, url: url }
      this.bigImgVisible = true
    },
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    add() {
      this.info = {}
      this.visibleDialog = true
    },
    // 点击编辑按钮
    edit(row) {
      this.info = {
        ...row
      }
      this.visibleDialog = true
    },
    del(row) {
      this.info = {
        ...row
      }
      this.delConfirmVisible = true
    },
    // 删除确认
    delConfirm() {
      deleteCharacter({ id: this.info.id }).then(res => {
        if (res.code === 1) {
          this.$message.success({ title: '提示', message: '删除成功' })
          this.delConfirmVisible = false
          this.onSearchFn()
        }
      })
    },
    // 点击查询按钮
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置按钮
    onClear() {
      this.search = {}
      this.onSearchFn()
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        ...this.search,
        pageSize: this.config.pageSize,
        pageIndex: this.config.currentPage
      }
      getCharacterPage(params)
        .then(res => {
          this.loading = false
          if (res.code === 1) {
            this.config.tableData = res.data.items
            this.config.total = res.data.total
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  min-width: 1200px;
  padding: 20px;
  background-color: #fff;
  .page_content {
    @include responsive-height(20px);
  }
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
  .el-table {
    &::after {
      background-color: #e7e7e7;
    }
  }
}

.mask-img {
  display: none;
  width: 100%;
  height: 20px;
  background: rgba(51, 51, 51, 0.4);
  position: absolute;
  bottom: 0;
  align-items: center;
  justify-content: center;
  user-select: none;
  .mask-img-item {
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
  }
}
.vertical-img {
  position: relative;
  width: 45px;
  height: 80px;
  background: #d8d8d8;
  border-radius: 4px;
  background-color: #d8d8d8;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}
.horizontal-img {
  position: relative;
  width: 80px;
  height: 45px;
  border-radius: 4px;
  background-color: #d8d8d8;
  background-repeat: no-repeat;
  background-size: 100% auto;
  &:hover {
    .mask-img {
      display: flex;
    }
  }
}
::v-deep {
  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      // display: none;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #d0d0d0;
      transition: all 0.4s ease;
    }

    &::-webkit-scrollbar-track {
      background: #fff;
    }
  }
}
</style>
