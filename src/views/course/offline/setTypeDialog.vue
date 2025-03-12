<template>
  <AppDialog
    v-model="visible"
    width="800px"
    top="100px"
    title="类型设置"
    class="dialog-container"
    @success="visible = false"
  >
    <dynamicTable
      ref="table"
      v-model="tableData"
      class="drop-table"
      immediate-check
      :columns="columns"
      hide-pagination
      :get-list-api="getList"
      @dataChange="rowDrop"
    >
      <template #headerBtn>
        <el-button
          size="small"
          class="btn_primary"
          @click="handleClickAdd"
        >新增</el-button>
      </template>
      <template #state="{row}">
        <el-switch
          v-model="row.state"
          :active-value="1"
          :inactive-value="0"
          @change="handleChangeState(row)"
        />
      </template>
      <template #operate="{row}">
        <el-button
          type="text"
          class="drop-class"
          style="cursor: move;"
        >拖动排序</el-button>
        <el-button
          type="text"
          @click="handleEdit(row)"
        >编辑</el-button>
        <el-button
          type="text"
          style="color:#F53F3F"
          @click="handleDel(row)"
        >删除</el-button>
      </template>
    </dynamicTable>
    <AppDialog
      v-model="innerVisible"
      width="450px"
      :rules="rules"
      class="inner-dialog"
      height="200px"
      :title="type === 'add'?'新增':'编辑'"
      @success="handleSuccess"
    >
      <el-form ref="form" :model="form" label-width="70px">
        <el-form-item label="类型名称" prop="courseTypeName">
          <el-input
            v-model.trim="form.courseTypeName"
            style="width:340px"
            maxlength="15"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="交付设置" prop="allowMultiSchedule">
          <el-checkbox v-model="form.allowMultiSchedule" :true-label="2" :false-label="1">允许一人多次入同一班期</el-checkbox>
          <div>
            使用场景：类似与咨询类项目，一个人购买多个小时，选择在某个时间段一次交付多个小时的课程
          </div>
        </el-form-item>
      </el-form>
    </AppDialog>
  </AppDialog>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import AppDialog from '@/components/AppDialog'
import { coursePage, courseSort, courseCreate, courseEdit, courseStop, courseDelete } from '@/api/course'
import Sortable from 'sortablejs'
import moment from 'moment'
export default {
  name: 'SetTypeDialog',
  components: {
    AppDialog,
    dynamicTable
  },
  data() {
    return {
      tableData: [],
      columns: [
        { prop: 'typeName', label: '类型名称', type: 'text' },
        { prop: 'state',
          label: '状态',
          type: 'slot'
        },
        {
          prop: 'firstClass',
          label: '更新时间',
          width: 160,
          slotFn: (row) => moment(row.updateAt).format('YYYY-MM-DD HH:mm:ss'),
          type: 'text'
        },
        { prop: 'createByName', label: '更新人', type: 'text' },
        { prop: 'operate', label: '操作', width: 180, type: 'slot' }
      ],
      rules: {
        courseTypeName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      visible: false,
      innerVisible: false,
      goodsId: '',
      form: {
        courseTypeName: '',
        allowMultiSchedule: 1,
        id: undefined
      },
      sortable: null,
      type: ''
    }
  },
  methods: {
    open(goodsId) {
      this.goodsId = goodsId
      this.visible = true
      this.onRefresh()
    },
    reset() {
      this.form = {
        courseTypeName: '',
        id: undefined
      }
    },
    handleClickAdd() {
      this.form.courseTypeName = ''
      this.form.allowMultiSchedule = 1
      this.type = 'add'
      this.innerVisible = true
    },
    handleSuccess() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            this.add()
          } else {
            this.edit()
          }
        }
      })
    },
    async edit() {
      const { code } = await courseEdit(this.form)
      if (code === 1) {
        this.$message.success('编辑成功')
        this.innerVisible = false
        this.onRefresh()
      }
    },
    async add() {
      const { code } = await courseCreate(this.form)
      if (code === 1) {
        this.$message.success('新增成功')
        this.innerVisible = false
        this.onRefresh()
      }
    },
    async handleDel(row) {
      this.$delModal({
        tips: `确定删除这个类型吗`,
        success: async() => {
          this.loading = true
          const { code } = await courseDelete({ id: row.id })
          if (code === 1) {
            this.$message.success('删除成功')
            this.onRefresh()
          }
        }
      })
    },
    handleEdit(row) {
      this.form.courseTypeName = row.typeName
      this.form.allowMultiSchedule = row.allowMultiSchedule
      this.form.id = row.id
      this.type = 'edit'
      this.innerVisible = true
    },
    onRefresh() {
      this.$nextTick(() => {
        this.tableData = []
        this.$refs.table.onRefresh()
      })
    },
    async handleChangeState(row) {
      const { code } = await courseStop({
        id: row.id,
        state: row.state
      })
      if (code === 1) {
        this.$message.success('修改状态成功')
        this.onRefresh()
      }
    },
    rowDrop() {
      const tbody = document.querySelector('.drop-table tbody')
      this.sortable && this.sortable.destroy()
      const tableIds = this.tableData.map(i => i.id)
      if (tbody) {
        this.sortable = Sortable.create(tbody, {
          animation: 300,
          handle: '.drop-class',
          async onEnd({ newIndex, oldIndex }) {
            const currRow = tableIds.splice(oldIndex, 1)[0]
            tableIds.splice(newIndex, 0, currRow)
            const dropList = tableIds.map((i, index) => {
              return {
                id: i,
                sort: index
              }
            })
            console.log(dropList)
            try {
              await courseSort(dropList)
            } catch (e) {
              console.log(e)
            }
          }
        })
      }
    },
    async getList() {
      return coursePage().then(res => {
        return { data: { items: res.data } }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep{
    .filter-container{
        padding: 10px 20px;
        .row-btn{
            padding:0px;
            border-bottom:0px
        }
    }
}
.inner-dialog ::v-deep{
    .dialog-body-content{
        padding: 20px 10px;
    }
}
</style>
