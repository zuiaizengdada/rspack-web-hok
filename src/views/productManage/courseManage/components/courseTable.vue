e
<template>
  <div class="table-cont-btn table-data">
    <MPageLayout
      ref="MPageLayout"
      type="tablePage"
      :slot-arr="slotArr"
      :current-page="config.pageIndex"
      :page-sizes="config.pageSizes"
      :page-size="config.pageSize"
      :total="config.total"
      :table-data="config.tableData"
      :table-columns="config.tableColumns"
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="coursewareOutline" slot-scope="{ row }">
        <div v-if="row.coursewareOutline.length > 3">
          <el-popover
            placement="right-start"
            width="200"
            trigger="hover"
          >
            <p
              v-for="(item, index) in row.coursewareOutline"
              :key="index"
              style="border-bottom: 1px solid #e1e6ed; padding-bottom: 5px; margin-top: 8px"
            >
              {{ item }}
            </p>
            <div slot="reference">
              <p>{{ row.coursewareOutline[0] }}</p>
              <p>{{ row.coursewareOutline[1] }}</p>
              <p>...</p>
            </div>
          </el-popover>
        </div>
        <div v-else>
          <p v-for="(item, index) in row.coursewareOutline" :key="index">
            {{ item }}
          </p>
        </div>
      </div>
      <div slot="coursewareVersion" slot-scope="{ row }">
        <span v-if="!row.isUpdate">
          {{ courseBArray[row.coursewareVersion] }}
          <i class="el-icon-caret-bottom" style="cursor:pointer" @click="changeCourseWareVersion(row)" />
        </span>
        <div v-else>
          <el-select
            v-model="row.coursewareVersion"
            class="intable-select"
            placeholder="请选择"
            @change="saveCourseWareVersion(row)"
          >
            <el-option
              v-for="item in coursewareVersionArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </div>
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button v-permission="['web:courseManage:detail', permsList]" type="text" @click="openNewTarget(row)">详情</el-button>
        <el-button
          v-permission="['web:courseManage:edit', permsList]"
          type="text"
          @click="$router.push({ path: `/productManagement/courseInsert?courseId=${row.id}` })"
        >编辑</el-button>
        <el-button v-permission="['web:courseManage:copy', permsList]" class="delete-cls" type="text" @click="copyById(row)">复制</el-button>
      </div>
    </MPageLayout>
  </div>
</template>

<script>
import { getCourseList, copyCourseById, updateVersion } from '@/api/product/courseManage'
import { DateFormat } from '@/utils/index'
export default {
  name: 'CourseTable',
  components: {},
  // eslint-disable-next-line vue/require-prop-types
  props: ['search'],
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      nowChangeUpdateObject: 0,
      coursewareVersionArray: [
        { label: '原版', value: 0, disabled: true },
        { label: '修改版', value: 1 },
        { label: '最终版', value: 2 }
      ],
      loading: false,
      slotArr: ['coursewareOutline', 'coursewareVersion', 'action'],
      courseBArray: ['原版', '修改版', '最终版'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'teacherName', label: '课件IP', type: 'text' },
          { prop: 'coursewareName', label: '课件名称', width: 230, type: 'text' },
          { prop: 'coursewareOutline', label: '课件大纲', width: 230, type: 'slot' },
          { prop: 'coursewareVersion', label: '课件版本', width: 130, type: 'slot' },
          { prop: 'coursewareKeyword', label: '课件关键词', type: 'text' },
          { prop: 'applySceneName', label: '适用场景', type: 'text' },
          { prop: 'produceDate', label: '课件制作时间', type: 'text' },
          { prop: 'producer', label: '课件制作人', type: 'text' },
          { prop: 'action', label: '操作', width: 140, type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  mounted() {
    this.getCourseListData(this.search)
  },
  activated() {
    this.getCourseListData(this.search)
  },
  methods: {
    copyById(row) {
      this.$confirm('确定需要生成一份同样的课件?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          console.log('^^^^^^^^^^^^^^^^:', row)
          copyCourseById(row.id).then((res) => {
            console.log(res)
            if (res.success) {
              this.$message.success('复制成功！')
              this.getCourseListData(this.search)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消复制'
          })
        })
    },
    getCourseListData(res) {
      console.log('reeeesssssssssssssssssss:', res)
      const params = res
      getCourseList(params).then((res) => {
        console.log('dddddd:', res)
        if (res.success) {
          this.config.tableData = res.data.items
          this.config.tableData.forEach((value) => {
            this.$set(value, 'isUpdate', false)
            value.produceDate = DateFormat(new Date(value.produceDate), 'yyyy-MM-dd')
          })
          console.log('###:', this.config.tableData)
          this.config.pageIndex = res.data.pageIndex
          this.config.pageSize = res.data.pageSize
          this.config.total = res.data.total
        }
      })
    },
    noChoose(row) {
      this.getCourseListData(this.search)
    },
    saveCourseWareVersion(row) {
      if (row.coursewareVersion === 0) {
        this.$message.error('版本状态不能修改为原版状态！')
        return
      }
      const param = {
        id: row.id,
        coursewareNo: row.coursewareNo,
        coursewareVersion: row.coursewareVersion
      }
      updateVersion(param).then((res) => {
        console.log('ddssssaaaa:', res)
        if (res.success) {
          this.$message.success('修改成功！')
          this.getCourseListData(this.search)
        }
      })
    },
    changeCourseWareVersion(row) {
      console.log(row)
      this.config.tableData.forEach((value) => {
        if (value.id === row.id) {
          this.$set(value, 'isUpdate', true)
        } else {
          this.$set(value, 'isUpdate', false)
        }
      })
      console.log(this.config.tableData)
      // row.isUpdate = true
      // this.$set(row.isUpdate, true)
      this.nowChangeUpdateObject = row.coursewareVersion
    },
    handleSizeChange(val) {
      console.log(val)
      this.config.pageSize = val
      this.search.pageIndex = 1
      this.search.pageSize = val
      this.getCourseListData(this.search)
    },
    handleCurrentChange(val) {
      console.log(val)
      this.config.pageIndex = val
      this.search.pageIndex = val
      this.getCourseListData(this.search)
    },
    handleSelectionChange(val) {
      this.$refs.tableTools && this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    openNewTarget(row) {
      const routeData = this.$router.resolve({ path: `/productManagement/courseDetail?courseId=${row.id}` })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.table-cont-btn {
  margin-top: 10px;
}
.table-data {
  height: 700px;
  background-color: #fff;
  border-radius: 4px;
  overflow: auto;
  ::v-deep .my-table {
    margin: 0;
  }
  ::v-deep .page_footer {
    padding: 0;
    justify-content: flex-end;
  }
}
.page_footer {
  padding: 0 20px;
  height: 50px;
  text-align: right;
  box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
}

.el-icon-edit {
  cursor: pointer;
}

.intable-select {
  width: 100px;
  margin-right: 10px;
}
</style>
