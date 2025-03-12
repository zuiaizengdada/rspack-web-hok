<template>
  <AppDialog
    v-model="visible"
    :title="title"
    width="850px"
    height="500px"
    top="10vh"
    @success="successFn"
  >
    <div class="ele-tabs-wrap">
      <!-- 贴标签 -->
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
        checkbox
        border
        if-index
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <div slot="headerLeft">
          <el-button type="primary" @click="openAddGroup">新增</el-button>
        </div>
        <div slot="headerRight">
          <el-select slot="prepend" v-model="select" placeholder="请选择状态" class="w-120 m-r-10" @change="handerSearch()">
            <el-option label="全部" value="" />
            <el-option label="手动标签" :value="0" />
            <el-option label="其他标签" :value="1" />
          </el-select>
          <el-input v-model.trim="search" placeholder="输入标签名称" clearable class="w-200 m-r-10" @keyup.enter.native="handerSearch" />
          <el-button type="primary" @click="handerSearch()">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="init()" />
        </div>
        <div slot="labelType" slot-scope="scope">
          <span>{{ {0: '手动标签' , 1: '其他标签'}[scope.row.labelType] }}</span>
        </div>
      </MPageLayout>

      <!-- 弹框层 -->
      <AppDialog
        v-model="modal.visible"
        :title="modal.title"
        width="500px"
        height="200px"
        @success="sendSuccess"
      >
        <div class="choose_resource m-t-20 p-10">
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-form-item label="标签名称" prop="labelName">
              <el-input v-model.trim="form.labelName" class="w-300" maxlength="20" show-word-limit />
            </el-form-item>
            <el-form-item label="标签类型">
              <span>{{ {0: '手动标签', 1: '其他标签'}[form.labelType] }}</span>
            </el-form-item>
          </el-form>
        </div>
      </AppDialog>
    </div>
  </AppDialog>
</template>
<script>
import AppDialog from '@/components/AppDialog'
import { GetList, Add, Edit } from '@/api/user/label'
import { mapGetters } from 'vuex'
export default {
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择'
    },
    success: {
      type: Function,
      default: () => {
        return () => {}
      }
    }
  },
  data() {
    return {
      loading: false,
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'labelName', label: '标签名称', type: 'text', width: '300' },
          { prop: 'labelType', label: '标签类型', type: 'slot' },
          { prop: 'labelNum', label: '标签人数', type: 'text' }
        ],
        pageSizes: [1, 2, 3, 4],
        pageSize: 1,
        currentPage: 1,
        total: 0
      },
      slotArr: ['headerRight', 'headerLeft', 'labelType'],
      // 弹框属性
      modal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      form: {
        labelName: '',
        labelType: 0
      },
      multipleSelection: [],
      search: '',
      select: ''
    }
  },
  computed: {
    ...mapGetters([
      'labelType'
    ])
  },
  watch: {
    // eslint-disable-next-line vue/no-dupe-keys
    visible: function(value) {
      if (value) {
        console.log('打开选标签弹框')
        this.init()
      }
    }
  },
  mounted() {
  },
  methods: {
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.select = ''
      // this._getRoleOptions()
      this.getList()
    },
    close() {
      this.visible = false
    },
    successFn() {
      console.log(this.multipleSelection, 'multipleSelection')
      this.visible = false
      this.success && this.success()
    },
    // 关闭新增弹框
    closeModal() {
      // this.groupStore.clearForm()
      this.modal.visible = false
    },
    getList() {
      this.loading = true
      const params = {
        labelName: this.search,
        current: this.config.currentPage,
        size: this.config.pageSize,
        labelType: this.select
      }
      GetList(params).then(res => {
        this.loading = false
        console.log(res, '列表数据')
        this.config.tableData = res.data.records
        this.config.total = res.data.total
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增或者编辑成功
    sendSuccess() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(this.form))
          let res = null
          if (this.modal.type === 1) {
            // 新增
            res = await Add(data)
          } else if (this.modal.type === 3) {
            // 修改
            res = await Edit(data)
          }
          if (res) {
            this.closeModal()
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
            this.config.currentPage = 1
            this.getList()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handerSearch() {
      this.config.currentPage = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(this.multipleSelection, 'this.multipleSelection')
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val, 'val')
      this.multipleSelection = val
    },
    // 打开新建
    openAddGroup() {
      this.modal = {
        title: '新建',
        type: 1,
        visible: true
      }
      this.form = {
        labelName: '',
        labelType: 0
      }
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.ele-tabs-wrap {
  height: 500px;
}
</style>
