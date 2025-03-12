<template>
  <MCard class="flex-1 flex flex-column page_wrap">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item
        :to="{ path: '/deliver/studentManagement/studentManagementAllStudent' }"
      >学员管理</el-breadcrumb-item>
      <el-breadcrumb-item>分配设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" size="small" label-width="70px">
      <el-form-item label="选择IP">
        <el-select
          v-model="form.lecturerId"
          style="width: 228px"
          filterable
          remote
          :remote-method="remoteMethod"
          clearable
          :loading="loading"
          :placeholder="`请选择IP`"
          @change="submit"
        >
          <el-option
            v-for="item in teacherOptions"
            :key="item.lecturerId"
            :label="item.lecturerName"
            :value="item.lecturerId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型">
        <el-select
          v-model="form.courseType"
          style="width: 228px"
          filterable
          clearable
          :loading="loading"
          :placeholder="`请选择课程类型`"
          @change="submit"
        >
          <el-option
            v-for="item in options"
            :key="item.curriculumType"
            :label="item.typeName"
            :value="item.curriculumType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程名称">
        <CourseSelect
          ref="CourseSelect"
          style="width: 200px"
          :default-id="form.goodsId"
          :value="form.goodsName"
          @selected="courseSelect"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="submit"
        >查询</el-button>
        <el-button size="small" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="page_table">
      <dynamicTable
        ref="table"
        v-model="tableData"
        :columns="columns"
        :get-list-api="getList"
      >
        <template slot="action" slot-scope="{ row }">
          <el-button type="text" @click="handleClickEdit(row)">编辑</el-button>
        </template>
      </dynamicTable>
    </div>
    <assistantDialog ref="assistantDialog" />
  </MCard>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import assistantDialog from './components/assistantDialog'
import { getTeacherList } from '@/api/shop'
import { assistantSettingPage } from '@/api/deliver/assistant'
import { courseListWithDisable } from '@/api/course'
import CourseSelect from '../components/courseSelect'
export default {
  components: {
    dynamicTable,
    assistantDialog,
    CourseSelect
  },
  data() {
    return {
      tableData: [],
      form: {
        lecturerId: '',
        courseType: '',
        goodsId: '',
        goodsName: ''
      },
      columns: [
        {
          prop: 'lecturerName',
          label: 'IP',
          width: 400,
          slotFn: row => row?.lecturerName?.join('/') ?? '',
          type: 'text',
          visible: true
        },
        {
          prop: 'courseTypeName',
          label: '课程类型',
          type: 'text'
        },
        {
          prop: 'normalDistributionNum',
          label: '正常分配助教人员',
          type: 'text'
        },
        {
          prop: 'suspendAllocationNum',
          label: '暂停分配助教人员',
          type: 'text'
        },
        { prop: 'action', label: '操作', type: 'slot', width: 100 }
      ],
      loading: false,
      permsList: this.$route.meta.permsList || [],
      teacherOptions: [],
      options: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getCourseList()
      this.remoteMethod()
    },
    submit() {
      this.$refs.table.onRefresh()
    },
    async remoteMethod(query) {
      this.loading = true
      const { data, code } = await getTeacherList({ lecturerName: query })
      if (code === 1) {
        this.teacherOptions = data
      }
      this.loading = false
    },
    courseSelect(val) {
      this.form.goodsId = val[0].goodsId
      this.form.goodsName = val[0].contentName
      if (val.length > 0) {
        this.lecturerId = ''
        this.courseType = ''
        this.getList()
      }
    },
    resetForm() {
      this.form = {
        lecturerId: '',
        courseType: '',
        goodsId: '',
        goodsName: ''
      }
    },
    async getCourseList() {
      const { data } = await courseListWithDisable()
      this.options = data
    },
    async getList(params) {
      return assistantSettingPage({
        ...params,
        lecturerId: this.form.lecturerId,
        courseType: this.form.courseType,
        goodsId: this.form.goodsId
      })
    },
    // 点击编辑按钮
    handleClickEdit(row) {
      this.$refs.assistantDialog.open(row)
    },
    // 新增或者编辑的回调
    successFn() {
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap ::v-deep {
  height: calc(100vh - 160px);
  background: #fff;
  border-radius: 5px;
  min-width: 1200px;
  overflow: auto;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
    0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  .filter-container {
    padding: 0px;
  }
  .el-breadcrumb__separator {
    color: #333333;
    font-weight: 500;
  }
  .el-breadcrumb {
    padding: 0 0 20px 20px;
    font-size: 16px;
  }
  .page_table {
    padding: 0 20px;
    height: calc(100vh - 170px);
  }
  .page_header {
    padding: 0 !important;
    min-height: 0 !important;
  }
  .my-table {
    margin: 0 !important;
  }
  .tablePage .page_footer {
    box-shadow: none;
  }
}
</style>
