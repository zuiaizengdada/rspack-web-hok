<template>
  <div class="page-wrap">
    <!-- 套餐管理 -->

    <!--表格渲染-->
    <MPageLayout
      ref="MPageLayout"
      class="package-layout"
      border
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
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
      @handleSelectionChange="handleListSelectionChange"
    >
      <div slot="headerLeft">
        <div class="fl">
          <el-input
            v-model="searchInfo.packageName"
            class="w200"
            placeholder="请输入套餐名称"
            clearable
            size="small"
            @keyup.enter.native="onSearchFn"
            @clear="onSearchFn"
          />
          <el-select
            v-model="searchInfo.isCustomized"
            placeholder="请选择是否定制"
            size="small"
            class="m-l-10 w200"
          >
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
          <el-button
            class="m-l-10"
            size="small"
            type="primary"
            @click="onSearchFn"
          >
            搜索
          </el-button>
          <el-button class="m-l-10" size="small" @click="onReset">
            重置
          </el-button>
        </div>
      </div>
      <div slot="headerRight">
        <!--
          v-permission="['system:role:add', permsList]" -->
        <el-button
          type="primary"
          size="small"
          @click="showOperateDialog(false)"
        >
          新增
        </el-button>
      </div>
      <!-- 套餐图标 -->
      <div slot="icon" slot-scope="{ row }">
        <el-image
          v-if="row.icon"
          style="max-width: 100px; max-height: 100px"
          :src="row.icon"
          :preview-src-list="[row.icon]"
        />
      </div>
      <!-- 是否定制 -->
      <div slot="isCustomized" slot-scope="{ row }">
        <span>
          {{ row.isCustomized ? '是' : '否' }}
        </span>
      </div>
      <!-- 机构数量 -->
      <div slot="organizationCount" slot-scope="{ row }">
        <span class="a_link" @click="openjgModel(row)">{{
          row.organizationCount
        }}</span>
      </div>
      <!-- 是否操作 -->
      <div slot="action" slot-scope="{ row }">
        <el-button type="text" @click="showOperateDialog(row)">
          设置
        </el-button>
        <!--  v-permission="['system:role:remove', permsList]" -->
        <el-button
          v-if="row.isCustomized"
          type="text"
          style="color: #ff4949"
          @click="delRow(row)"
        >
          删除
        </el-button>
      </div>
    </MPageLayout>

    <!-- 新增/修改套餐弹窗-->
    <el-drawer
      :title="operateInfo.dialog.title"
      :visible.sync="operateInfo.dialog.visible"
      size="500px"
      :wrapper-closable="false"
      @close="deforeCloseDialog"
    >
      <div v-loading="operateInfo.dialog.loading" class="groupDrawer">
        <el-form
          ref="form"
          :model="operateInfo.form"
          :rules="operateInfo.rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="套餐名称" prop="packageName">
            <el-input
              v-model="operateInfo.form.packageName"
              placeholder="请输入套餐名称"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="套餐描述" prop="packageDesc">
            <el-input
              v-model="operateInfo.form.packageDesc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="500"
              placeholder="请输入套餐描述"
            />
          </el-form-item>
          <el-form-item label="套餐图标" prop="icon" class="hoc-upload-item">
            <template v-if="operateInfo.dialog.visible">
              <template v-if="operateInfo.form.icon">
                <HokUpload
                  ref="MUpload"
                  class="hoc-upload"
                  :accept="accept"
                  :before-upload="beforeUpload"
                  :tips="detail.remark"
                  :max-length="1"
                  :list="[
                    {
                      icon: operateInfo.form.icon,
                      status: 3,
                      url: operateInfo.form.icon
                    }
                  ]"
                  oss-teacher-folder="hok_shopAdvertising"
                  @change="fileChange"
                />
              </template>
              <template v-else>
                <HokUpload
                  ref="MUpload"
                  :accept="accept"
                  :before-upload="beforeUpload"
                  :tips="detail.remark"
                  :max-length="1"
                  oss-teacher-folder="hok_shopAdvertising"
                  @change="fileChange"
                />
              </template>
            </template>
          </el-form-item>
          <el-form-item label="是否定制" prop="isCustomized">
            <el-switch
              v-model="operateInfo.form.isCustomized"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
          <el-form-item label="显示顺序" prop="orderNum">
            <el-input-number v-model="operateInfo.form.orderNum" :min="0" />
          </el-form-item>
          <el-form-item label="套餐权限" prop="jgName">
            <el-tree
              ref="editRoleTree"
              :data="operateInfo.treeData"
              node-key="id"
              show-checkbox
              :default-checked-keys="operateInfo.form.menuIds"
              @check="handleCheckChange"
            />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="operateInfo.dialog.visible = false">
            取 消
          </el-button>
          <!--  v-permission="['system:role:edit,system:role:add', permsList]" -->
          <el-button type="primary" @click="sure"> 确 定 </el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 套餐机构列表 -->
    <AppDialog v-model="jgModel.visible" title="">
      <div
        slot="title"
        style="width: 700px; display: inline-block; margin-top: 10px"
      >
        <span>
          <p style="float: left">{{ jgModel.title }}</p>
          <p
            style="
              float: left;
              margin-left: 20px;
              font-size: 14px;
              font-weight: normal;
              line-height: 26px;
            "
          >
            {{ jgModel.jgName }}
          </p>
        </span>
      </div>
      <div v-loading="jgModel.loading" class="p-10">
        <el-table
          :header-cell-style="{ background: '#f5f5f5' }"
          :data="jgModel.tableData"
          border
          height="500px"
          @selection-change="roleChangeSelect"
        >
          <!-- <el-table-column prop="userName" label="登录账号" /> -->
          <el-table-column prop="companyAbbreviation" label="机构名称" />
          <el-table-column prop="name" label="机构全称" />
          <el-table-column prop="type" label="类型">
            <template slot-scope="{ row }">
              {{ row.type === 1 ? '企业' : '个人' }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="入驻套餐">
            <template slot-scope="{ row }">
              <span>{{ row.packageName }}</span>
              <!-- <el-tag
                v-for="(item, index) in row.packageNames || []"
                :key="index"
              >
                {{ item.packageName }}
              </el-tag> -->
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="添加日期" />
        </el-table>
        <el-pagination
          class="fr m-t-10"
          :current-page.sync="jgModel.current"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="jgModel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="jgModel.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </AppDialog>
  </div>
</template>

<script>
import {
  listPackagesApi,
  editPackageApi,
  packageMenuTreeselectApi,
  editPackageMenusApi,
  delPackageApi,
  mnuTreeApi,
  organizationPageApi
} from '@/api/package'
import AppDialog from '@/components/AppDialog'
import HokUpload from '@/views/shop/advertising/component/upload.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'HokPackage',
  components: {
    AppDialog,
    HokUpload
  },
  data() {
    return {
      // 页面loading
      loading: false,
      // 表格搜索所需参数
      searchInfo: {
        isCustomized: null,
        isPlatform: false,
        packageName: null
      },
      // 表格配置参数
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'packageName', label: '套餐名称', type: 'text' },
          { prop: 'packageName', label: '套餐名称', type: 'text' },
          { prop: 'packageDesc', label: '套餐描述', type: 'text' },
          { prop: 'id', label: '套餐ID', type: 'text' },
          { prop: 'icon', label: '套餐图标', width: '120px', type: 'slot' },
          {
            prop: 'isCustomized',
            label: '是否定制',
            type: 'slot'
          },
          {
            prop: 'organizationCount',
            label: '机构数量',
            type: 'slot'
          },
          {
            prop: 'createTime',
            label: '创建时间',
            type: 'text'
          },
          { prop: 'orderNum', label: '显示顺序', type: 'text' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      // 默认表格菜单
      defaultTable: [
        { prop: 'packageName', label: '套餐名称', visible: true },
        { prop: 'packageDesc', label: '套餐描述', visible: true },
        { prop: 'id', label: '套餐ID', visible: true },
        {
          prop: 'icon',
          label: '套餐图标',
          type: 'slot',
          width: '120px',
          visible: true
        },
        {
          prop: 'isCustomized',
          label: '是否定制',
          type: 'slot',
          visible: true
        },
        {
          prop: 'organizationCount',
          label: '机构数量',
          type: 'slot',
          visible: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          type: 'text',
          visible: true
        },
        { prop: 'orderNum', label: '显示顺序', type: 'text', visible: true },
        { prop: 'action', label: '操作', type: 'slot', visible: true }
      ],
      // 默认slot可使用的key
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'isCustomized',
        'organizationCount',
        'createTime',
        'icon'
      ],
      // 新增/编辑 套餐弹框
      operateInfo: {
        dialog: {
          title: '新增',
          type: 1,
          visible: false,
          loading: false
        },
        form: {
          packageName: '',
          packageDesc: '',
          icon: '',
          isCustomized: true,
          orderNum: 0,
          menuIds: []
        },
        treeData: [],
        rules: {
          packageName: [
            { required: true, message: '请输入套餐名称', trigger: 'blur' }
          ],
          packageDesc: [
            { required: true, message: '请输入套餐描述', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '请输入套餐图标', trigger: 'blur' }
          ],
          menuIds: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个套餐权限',
              trigger: 'blur'
            }
          ]
        }
      },
      // 操作基本模板
      operateFormDefautlt: {
        packageName: '',
        packageDesc: '',
        icon: '',
        isCustomized: 0,
        orderNum: 0,
        menuIds: []
      },
      // 机构弹窗相关
      jgChangeMultiple: [],
      jgModel: {
        title: '机构列表',
        jgName: '',
        visible: false,
        loading: false,
        tableData: [],
        current: 1,
        size: 10,
        total: 0
      },
      permsList: this.$route.meta.permsList,
      detail: {
        id: '',
        name: '',
        type: '',
        maxNum: 1,
        fileFormat: [],
        fileSize: 5, // MB单位
        remark: `<div data-v-41f1df76="" class="tips overflowOuto">1、上传jpg,png图片，只能上传1张 <br> 2、单张图片不能大于5M</div>`
      }
    }
  },
  computed: {
    ...mapGetters(['ifAdmin']),
    accept() {
      const arr = []
      this.detail.fileFormat.map(v => {
        v === 1 && arr.push('.jpg,.png,.jpeg')
        v === 2 && arr.push('.mp4')
      })
      console.log(arr.join(','))
      return arr.join(',')
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 表单操作 --- start
    // 获取列表数据
    getList() {
      this.loading = true
      const customizedObj = { 0: false, 1: true }
      const params = {
        ...this.searchInfo,
        isCustomized: customizedObj[this.searchInfo.isCustomized],
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      listPackagesApi(params)
        .then(res => {
          this.config.tableData = res.data.items
          this.config.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 搜索
    onSearchFn() {
      this.config.currentPage = 1
      this.getList()
    },
    // 重置
    onReset() {
      this.searchInfo.isCustomized = null
      this.searchInfo.packageName = null
      this.getList()
    },
    // 表格 操作栏
    handleListSizeChange(value) {
      // 切换页数
      this.config.pageSize = value
      this.getList()
    },
    handleListCurrentChange(value) {
      // 页数改变回调
      this.config.currentPage = value
      this.getList()
    },
    handleListSelectionChange(value) {
      // 切换页数
      this.config.currentPage = value
    },
    // 删除套餐
    delRow(row) {
      console.log(row)
      const str = '确定删除【' + row.packageName + '】这个套餐吗？'
      this.$delModal({
        tips: str,
        success: () => {
          this.delPackage(row.id)
        }
      })
    },
    async delPackage(id) {
      this.loading = true
      try {
        await delPackageApi({ id })
        this.getList()
      } catch (error) {
        this.$message.error(error.message)
      }
      this.loading = false
    },
    // 表单操作 --- end

    // 新增/编辑套餐----start
    // 点击新增/编辑按钮 弹出
    async showOperateDialog(info) {
      this.operateInfo.dialog = {
        title: info ? '编辑' : '新增',
        type: info ? 2 : 1,
        visible: true,
        loading: true
      }
      if (info) {
        const keys = [
          'packageName',
          'packageDesc',
          'isCustomized',
          'orderNum',
          'id',
          'icon'
        ]
        keys.forEach(key => (this.operateInfo.form[key] = info[key]))
        this.getPackageMenuTreeselect(info.id)
      } else {
        this.operateInfo.form = JSON.parse(
          JSON.stringify(this.operateFormDefautlt)
        )
        this.getMnuTree()
      }
    },
    // 单独获取数数据
    async getMnuTree() {
      this.operateInfo.dialog.loading = true
      // isPlatform: false  代表查询机构菜单
      try {
        const res = await mnuTreeApi({ isPlatform: false })
        this.$set(this.operateInfo, 'treeData', res.data)
        // this.operateInfo.treeData = res.data
      } catch (error) {
        console.log('mnuTreeApi----------', error)
      }
      this.operateInfo.dialog.loading = false
    },
    // 获取树数据 + 已勾选id
    getPackageMenuTreeselect(packageId) {
      this.operateInfo.dialog.loading = true
      packageMenuTreeselectApi(packageId)
        .then(res => {
          this.$set(this.operateInfo, 'treeData', res.data.menus)
          // this.operateInfo.treeData = res.data.menus
          this.$set(this.operateInfo.form, 'menuIds', res.data.checkedKeys)
          // this.operateInfo.form.menuIds = res.data.checkedKeys
        })
        .finally(() => (this.operateInfo.dialog.loading = false))
    },
    // 勾选 取消 树数据
    handleCheckChange(
      checkedNodes,
      checkedKeys,
      halfCheckedNodes,
      halfCheckedKeys
    ) {
      console.log(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys)
      console.log('checkedKeys.checkedKeys----------', checkedKeys.checkedKeys)
      this.$set(this.operateInfo.form, 'menuIds', checkedKeys.checkedKeys)
    },
    // 弹框关闭前重置表单
    deforeCloseDialog() {
      this.$refs.form.clearValidate()
    },
    // 点击重置按钮
    clear() {
      const tableColumns = this.defaultTable
      this.config.tableColumns = tableColumns
      localStorage.setItem('role_tableColumns', JSON.stringify(tableColumns))
    },
    // 添加/编辑点击确定
    sure() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.operateInfo.dialog.loading = true
            // const menuIds = this.operateInfo.form.menuIds
            delete this.operateInfo.form.menuIds
            // 套餐基本信息添加 接口会返回 生成的套餐id
            const { data } = await editPackageApi(this.operateInfo.form)
            // 套餐关联菜单添加
            await editPackageMenusApi({
              menuIds: this.$refs.editRoleTree
                .getCheckedKeys()
                .concat(this.$refs.editRoleTree.getHalfCheckedKeys()),
              packageId: this.operateInfo.form.id || data
            })
            this.getList()
          } catch (error) {
            this.$message.error(error.message)
          }
          this.operateInfo.dialog.loading = false
          this.operateInfo.dialog.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 添加/编辑套餐----end

    // 机构数量-弹层 ----start
    // 打开
    openjgModel(row) {
      this.chooseNumberObj = row
      this.jgModel = {
        title: '机构列表',
        jgName: row.packageName,
        visible: true,
        loading: true,
        tableData: [],
        current: 1,
        size: 10,
        total: 0,
        packageId: row.id
      }
      this.getOrganizationList()
    },
    // 获取table数据
    getOrganizationList() {
      this.jgModel.loading = true
      const params = {
        packageId: this.jgModel.packageId,
        pageIndex: this.jgModel.current,
        pageSize: this.jgModel.size
      }
      organizationPageApi(params)
        .then(res => {
          this.jgModel.tableData = res.data.items
          this.jgModel.total = res.data.total
          this.jgModel.loading = false
        })
        .catch(() => {
          this.jgModel.loading = false
        })
    },
    // size切换
    handleSizeChange(val) {
      this.jgModel.size = val
      this.getOrganizationList()
    },
    // Current切换
    handleCurrentChange(val) {
      this.jgModel.current = val
      this.getOrganizationList()
    },
    roleChangeSelect(val) {
      this.jgChangeMultiple = val
    },
    // 机构数量-弹层 ----end

    // 上传操作 ---statr
    beforeUpload(file) {
      // const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLtX = file.size / 1024 / 1024 < this.detail.fileSize
      if (!isLtX) {
        this.$message.error(`上传文件大小不能超过 ${this.detail.fileSize}KB!`)
      }
      return isLtX
    },
    // 上传文件对象改变
    fileChange(res) {
      console.log(res, '上传文件改变触发', this)
      if (res.length > 0 && this.operateInfo.form) {
        console.log('  this.form--------', this.operateInfo.form, res[0].url)
        this.operateInfo.form.icon = res[0].url
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.head-container {
  padding: 20px 20px 0;
}
.page-wrap {
  // height: 100%;
  height: calc(100vh - 160px);
  background: #fff;
}
::v-deep .upload {
  height: 152px;
}
.groupDrawer {
  flex-direction: column;
  display: flex;
  flex-direction: column;
  height: 100%;
  .demo-ruleForm {
    // flex: 1;
    height: calc(100vh - 77px - 50px);
    width: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .demo-drawer__footer {
    width: 100%;
    height: 50px;
    padding-top: 10px;
    padding-left: 10px;
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%),
      0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
}

.move-role-cls {
  ::v-deep .el-dialog {
    border-radius: 8px;
  }
  .title-span {
    width: 100%;
    display: inline-block;
    margin-bottom: 10px;
    em {
      float: left;
      font-style: normal;
    }
    p {
      float: left;
    }
  }
}
.w200 {
  width: 200px;
}
</style>
