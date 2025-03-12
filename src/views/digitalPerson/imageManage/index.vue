<template>
  <MCard class="page_wrap">
    <MPageLayout
      ref="MPageLayout"
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
      <template slot="search">
        <filterTop
          :search="search"
          :teacher-list="teacherList"
          @onSearch="onSearchFn"
          @onClear="onClear"
          @onAdd="onhandleAdd"
        />
      </template>
      <template slot="action" slot-scope="scope">
        <el-button
          type="text"
          class="c_red"
          @click="onhandleDel(scope.row)"
        >删除</el-button>
      </template>
      <template slot="photoUrl" slot-scope="{ row }">
        <div class="expertChannel">
          <el-image
            fit="contain"
            style="border-radius: 2px"
            :src="row.photoUrl"
          />
        </div>
      </template>
      <template slot="status" slot-scope="{ row }">
        <div v-if="row.status != 3" class="status">
          <div class="statusFont">
            <p>{{ row.statue }}</p>
            <span :class="row.status == 1 ? 'tips1' : 'tips2'" />
            <span>{{ row.status == 1 ? '启用' : '禁用' }}</span>
          </div>
          <el-switch
            v-model="row.flag"
            active-color="#0C6FFF"
            inactive-color="#999999"
            @change="handleChange(row)"
          />
        </div>
        <div v-else>已删除</div>
      </template>
    </MPageLayout>
    <!-- 弹框层 -->
    <addDialog :config="addConfig" @success="closeAddDialog" />
  </MCard>
</template>

<script>
import filterTop from './components/filterTop.vue'
import addDialog from './components/addDialog.vue'
import { getColumns } from './components/columns'
import { getOptionsValueByKey } from '@/filters/index.js'
import {
  charactersDelete,
  getCharactersTeacherList,
  getConnectList,
  modifyStatus
} from '@/api/aiVideoManage'
export default {
  components: {
    filterTop,
    addDialog
  },
  data() {
    return {
      slotArr: ['action', 'search', 'footer', 'photoUrl', 'status'],
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      config: {
        tableData: [],
        tableColumns: getColumns.call(this),
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      search: {
        teacherId: '', // IP姓名
        status: undefined // 状态
      },
      loading: false,
      teacherList: [],
      value: true,
      value1: false,
      addConfig: {
        type: 1, // 1：新增 2：编辑
        row: {},
        visible: false
      }
    }
  },
  mounted() {
    this.getTeacherList()
    this.onSearchFn()
  },
  methods: {
    getOptionsValueByKey,
    // 分页改变触发
    handleSizeChange(row) {
      this.config.pageSize = row
      this.config.currentPage = 1
      this.getList()
    },
    async getTeacherList() {
      const res = await getCharactersTeacherList({})
      this.teacherList = res.data
      console.log(res, 'IP的列表')
    },
    // 改变状态
    async handleChange(row) {
      await modifyStatus({
        connectId: row.connectId,
        status: row.status === 1 ? '2' : '1'
      })
      this.getList()
    },

    // 当前页改变触发
    handleCurrentChange(row) {
      this.config.currentPage = row
      this.getList()
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      this.addConfig = {
        type: 2,
        row: row,
        visible: true
      }
    },
    // 点击删除按钮
    onhandleDel(row) {
      this.$delModal({
        width: '505px',
        tips: `<div style="font-weight: bold;color: #333333;line-height: 24px;font-size: 16px;">删除提醒</div><div style="margin-top: 16px;color: #333333;line-height: 22px;font-size: 14px;">是否删除形象?</div>`,
        success: () => {
          this.loading = true
          const data = {
            connectId: row.connectId
          }
          charactersDelete(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.onSearchFn()
              this.getTeacherList()
            })
            .catch(() => {
              this.loading = false
            })
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
      this.search = {
        teacherId: '' // 达人渠道
      }
      this.onSearchFn()
    },
    // 点击新增规则按钮
    onhandleAdd() {
      this.addConfig = {
        type: 1,
        row: {},
        visible: true
      }
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const statusMap = new Map([
        [1, true],
        [2, false],
        [3, 3]
      ])
      const params = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        teacherId: this.search.teacherId,
        status: this.search.status,
        thirdType: this.search.thirdType
      }
      getConnectList(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.tableData.forEach(item => {
            item['flag'] = statusMap.get(item.status)
          })
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击关闭弹框并刷新列表
    closeAddDialog() {
      this.addConfig.visible = false
      this.getTeacherList()
      this.onSearchFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(20px);
  min-width: 1200px;
  padding: 20px;
}
.status {
  display: flex;
  align-items: center;
  .statusFont {
    display: flex;
    align-items: center;
    margin-right: 8px;
    .tips1,
    .tips2 {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .tips1 {
      background: #00b42a;
    }
    .tips2 {
      background: #f53f3f;
    }
  }
  //flex-direction: column;
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
.expertChannel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 90px;
  background: #f5f5f5;
  border-radius: 2px;
  .expertChannelicon {
    width: 20px;
    height: 20px;
    font-size: 20px;
    margin-right: 8px;
  }
}
::v-deep .expertChannel {
  img {
    width: auto;
    height: 90px;
  }
}
</style>
