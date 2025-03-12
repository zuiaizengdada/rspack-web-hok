<template>
  <div class="page_wrap">
    <!-- 员工管理 -->
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="action" slot-scope="scope">
        <el-button v-permission="['system:label:edit', permsList]" type="text" @click="openEdit(scope.row)">编辑</el-button>
        <el-button v-permission="['system:label:remove', permsList]" type="text" style="color: red" @click="del(scope.row)">删除</el-button>
      </div>
      <div slot="headerLeft">
        <el-button v-permission="['system:label:add', permsList]" type="primary" @click="openAddGroup">新增</el-button>
      </div>
      <div slot="headerRight">
        <el-select slot="prepend" v-model="select" placeholder="请选择状态" class="w-120 m-r-10" @change="handerSearch()">
          <el-option label="全部" value="" />
          <el-option label="手动标签" :value="0" />
          <el-option label="其他标签" :value="1" />
        </el-select>
        <el-input v-model.trim="search" placeholder="输入标签名称" clearable class="w-200 m-r-10" @clear="handerSearch" @keyup.enter.native="handerSearch" />
        <el-button type="primary" @click="handerSearch()">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="init()" />
      </div>
      <div slot="footer">
        <!-- <AppTableTools ref="tableTools" :tools="['批量删除']" @onAllChange="onAllChange" @onClick="allChange" /> -->
        <el-button v-permission="['system:label:remove', permsList]" @click="allChange(0)">批量删除</el-button>
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
</template>

<script>
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
// import store from '@/store'
import { GetList, Add, Edit, DelBatch } from '@/api/user/label'
import { mapGetters } from 'vuex'
import AppDialog from '@/components/AppDialog'
export default {
  name: 'EmployeeManage',
  components: {
    AppDialog
    // AppTableTools
  },
  data() {
    return {
      loading: false,
      search: '',
      select: '',
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'labelType'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'labelName', label: '标签名称', type: 'text', width: '300', visible: true },
          { prop: 'labelType', label: '标签类型', type: 'slot', visible: true },
          { prop: 'labelDefinition', label: '标签定义', type: 'text', visible: true },
          { prop: 'labelNum', label: '标签人数', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', width: '240', visible: true }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 弹框属性
      modal: {
        title: '新增标签',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false
      },
      multipleSelection: [],
      allChangeType: false,
      form: {
        labelName: '',
        labelType: 0
      },
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  computed: {
    ...mapGetters([
      'labelType'
    ])
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
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
    handleSelectionChange(val) {
      this.$refs.tableTools && this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
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
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.select = ''
      // this._getRoleOptions()
      this.getList()
    },
    // 获取角色下拉框
    // async _getRoleOptions() {
    //   await store.dispatch('option/getRoleOptions')
    // },
    // 打开查看
    openDetail(row) {
      this.modal = {
        title: '详情',
        type: 2, // 1: 新增; 2查看; 3编辑;
        visible: true
      }
    //   this.groupStore.getInfo(row.id)
    },
    // 打开编辑
    openEdit(row) {
      this.modal = {
        title: '编辑',
        type: 3, // 1: 新增; 2查看; 3编辑;
        visible: true
      }
      this.form = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 删除
    del(row) {
    //   const ids = [row.id]
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          console.log('删除')
          this.loading = true
          const data = {
            labelIdList: [row.labelId]
          }
          DelBatch(data).then(res => {
            this.config.currentPage = 1
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        }
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

    // 底部上架下架删除按钮点击事件
    allChange(index) {
      if (this.multipleSelection.length === 0) {
        return this.$notify.warning({
          title: '警告',
          message: '请先选中'
        })
      }
      if (index === 0) {
        this.$delModal({
          tips: `确定删除这${this.multipleSelection.length}个账号吗？`,
          success: () => {
            this.loading = true
            const labelIdList = []
            this.multipleSelection.map(v => {
              labelIdList.push(v.labelId)
            })
            const params = {
              labelIdList
            }
            DelBatch(params).then(res => {
              this.getList()
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    },
    // 底部选中本页
    onAllChange(e) {
      if (e) {
        this.$refs.MPageLayout.handletoggleSelectionAll()
      } else {
        this.$refs.MPageLayout.clearSelection()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import "~@/styles/variables.scss";
.page_wrap {
  @include responsive-height(20px);
  overflow: auto;
  background-color: #fff;
  border-radius: 4px;

  .nickName {
    display: flex;
    align-items: center;
  }
}
</style>
