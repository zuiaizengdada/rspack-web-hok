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
          @onAdd="onhandleUpload"
          @onSearch="searchFn"
          @onClear="onClear"
        />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button
          v-if="row.createUserId === userInfo.userId"
          type="text"
          :loading="row.loading"
          @click="onhandleEdit(row)"
          v-permission="['btn:newliveMaterial:edit', permsList]"
          >编辑</el-button
        >
        <el-button
          v-if="row.createUserId === userInfo.userId"
          type="text"
          class="c_F53F3F"
          :loading="row.loading"
          @click="onhandleDel(row)"
          v-permission="['btn:newliveMaterial:delete', permsList]"
          >删除</el-button
        >
      </template>
      <template slot="name" slot-scope="{ row }">
        <div class="goods-info-wrapper">
          <uploadShow :url="row.url" width="82" height="82" disabled />
          <div class="goods-info-name m-l-10">
            <textShowMore :line-clamp="2" :text="row.name" />
          </div>
        </div>
      </template>
      <template slot="createTime" slot-scope="{ row }">
        {{ row.createTime | parseTime }}
      </template>
      <template slot="tags" slot-scope="{ row }">
        {{ row.tags | tagsFt }}
      </template>
    </MPageLayout>
    <addDialog :config="addConfig" @handleOk="handleOk" />
  </MCard>
</template>

<script>
import filterTop from './filterTop'
import addDialog from './addDialog.vue'
import {
  warmUpMaterialList,
  deleteWarmUpMaterial
} from '@/api/liveRoom/index.js'
import textShowMore from '@/components/textShowMore/index2.vue'
import uploadShow from '@/components/AppUploadView/uploadShow'
import { mapGetters } from 'vuex'
export default {
  components: {
    filterTop,
    addDialog,
    textShowMore,
    uploadShow
  },
  filters: {
    tagsFt(val) {
      if (val) {
        return val.join('，')
      }
      return ''
    }
  },
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      slotArr: ['action', 'search', 'footer', 'name', 'createTime', 'tags'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'materialId', label: '文件ID', type: 'text' },
          { prop: 'name', label: '文件名称', type: 'slot' },
          {
            prop: 'type',
            label: '文件类型',
            type: 'text',
            // align: 'center',
            render: row => {
              return { 1: '图片', 2: '视频' }[row.type]
            }
          },
          { prop: 'tags', label: '标签', type: 'slot' },
          { prop: 'createUserName', label: '创建人', type: 'text' },
          { prop: 'createTime', label: '创建时间', type: 'slot' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      // 查询条件
      search: {
        fileName: '',
        fileType: '',
        tag: ''
      },
      addConfig: {
        visible: false,
        data: {},
        dialogType: 'ADD'
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const parame = {
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize,
        name: this.search.fileName,
        tag: this.search.tag,
        type: this.search.fileType
      }
      warmUpMaterialList(parame)
        .then(res => {
          res.data.items.map(v => {
            v.loading = false
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleOk() {
      this.addConfig.visible = false
      this.getList()
    },
    // 查询
    searchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 点击重置
    onClear() {
      this.search = {
        liveRoomCode: '',
        liveRoomName: '',
        realityTeacherUserId: '',
        createUserId: '',
        liveModel: '',
        status: '',
        teacherId: '',
        teacherName: '',
        time: { value: ['', ''], label: 0 }
      }
      this.searchFn()
    },
    // 点击上传
    onhandleUpload() {
      this.addConfig = {
        visible: true,
        data: {},
        dialogType: 'ADD'
      }
    },
    // 点击编辑按钮
    onhandleEdit(row) {
      console.log(row, 'row')
      this.addConfig = {
        visible: true,
        data: JSON.parse(JSON.stringify(row)),
        dialogType: 'EDIT'
      }
    },
    // 点击删除按钮
    onhandleDel(row) {
      this.$delModal({
        tips: '确定删除该文件?',
        success: () => {
          row.loading = true
          const data = {
            materialId: row.materialId
          }
          deleteWarmUpMaterial(data)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              row.loading = false
              this.getList()
            })
            .catch(() => {
              row.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap {
  @include responsive-height(66px);
  min-width: 1000px;
  padding: 20px 20px 10px 20px;
  .goods-info-wrapper {
    display: flex;
    .goods-info-name {
      flex: 1 0 0;
    }
  }
}
::v-deep .tablePage .page_footer {
  justify-content: space-between;
  box-shadow: none;
  padding: 6px 0px 0px;
  height: auto;
}
::v-deep .page_header {
  padding: 0 !important;
}
::v-deep .my-table {
  margin: 0 !important;
}
</style>
