<template>
  <div class="page-wrap">
    <div v-loading="contentLoading" class="content">
      <div class="filter_top">
        <el-tabs v-model="tabInfo.cur">
          <template v-for="item in tabInfo.list">
            <el-tab-pane :key="item.name" v-bind="item" />
          </template>
        </el-tabs>
        <filterTop ref="filterTopRef" :search="search" @search="searchFn" />
      </div>

      <div class="p-20 table-module">
        <div class="tree-header">
          <el-button
            v-permission="['system:menu:add', permsList]"
            type="primary"
            size="small"
            @click="showAddDialog"
          >
            新增
          </el-button>
        </div>
        <div class="tree-title">
          <div style="width: 180px" class="menu-title">菜单标题</div>
          <div style="width: 50px">图标</div>
          <div style="width: 100px">快捷图标</div>
          <div style="width: 40px">排序</div>
          <div style="width: 160px">权限标识</div>
          <div style="width: 260px">路由地址</div>
          <div style="width: 140px">操作</div>
        </div>
        <el-tree
          :data="config.tableData"
          :expand-on-click-node="false"
          :props="defaultProps"
          node-key="menuId"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <div class="tree-item" style="width: 180px">
              <span>{{ node.label }}</span>
            </div>
            <div class="tree-item" style="width: 50px">
              <svg-icon
                v-if="data.icon"
                :icon-class="data.icon"
                class="el-input__icon"
                style="height: 32px; width: 16px"
                color="#000"
              />
            </div>
            <div class="tree-item" style="width: 100px">
              <template v-if="data.bigIcon">
                <el-image
                  style="width: 20px; height: 20px"
                  :src="data.bigIcon"
                  fit="contain"
                  :preview-src-list="[data.bigIcon]"
                />
              </template>
              <span v-else />
            </div>
            <div class="tree-item" style="width: 40px">
              <span>{{ data.orderNum }}</span>
            </div>
            <div class="tree-item" style="width: 160px">
              <span>{{ data.perms }}</span>
            </div>
            <div class="tree-item" style="width: 260px">
              <span>{{ data.path }}</span>
            </div>
            <div class="tree-item" style="width: 140px">
              <span v-if="data.menuType !== 'F'">{{
                { 0: '显示', 1: '隐藏' }[data.visible]
              }}</span>
            </div>
            <div class="tree-item" style="width: 100px" @click.stop="">
              <el-button type="text" @click.stop="openDetailMenu(data)">
                详情
              </el-button>
              <el-button
                v-permission="['system:menu:edit', permsList]"
                type="text"
                @click.stop="openEditMenu(data)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['system:menu:remove', permsList]"
                type="text"
                @click.stop="delMenu(data)"
              >
                删除
              </el-button>
            </div>
          </span>
        </el-tree>
        <!--表格渲染-->
        <!-- <MPageLayout
          ref="MPageLayout"
          border
          type="tablePage"
          :slot-arr="slotArr"
          :current-page="config.currentPage"
          :page-sizes="config.pageSizes"
          :page-size="config.pageSize"
          :total="config.total"
          :table-data="config.tableData"
          :table-columns="config.tableColumns"
          :loading="search.loading"
          layout="total"
          row-key="menuId"
          :tree-mode="true"
        >
          <div slot="headerRight">
            <el-popover
              placement="bottom-end"
              width="150"
              trigger="click"
            >
              <el-button slot="reference" type="text" size="small">自定义表头</el-button>

              <el-checkbox v-model="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
                全选
              </el-checkbox>
              <el-checkbox
                v-for="item in config.tableColumns"
                :key="item.label"
                v-model="item.visible"
                v-dragging="{ item: item, list: config.tableColumns, group: 'item' }"
                @change="handleCheckedTableColumnsChange(item)"
              >
                {{ item.label }}
              </el-checkbox>
            </el-popover>
            <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button>
            <el-button v-permission="['system:menu:add', permsList]" type="primary" size="small" @click="showAddDialog">新增</el-button>
          </div>
          <div slot="action" slot-scope="{ row }">
            <el-button v-permission="['system:menu:edit', permsList]" type="text" @click.native="openEditMenu(row)">编辑</el-button>
            <el-button v-permission="['system:menu:remove', permsList]" type="text" @click.native="delMenu(row)">删除</el-button>
           <el-dropdown>
              <span class="el-dropdown-link">
                <el-button type="text" class="m-l-10">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openEditMenu(row)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="delMenu(row)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div slot="icon" slot-scope="{row}">
            <svg-icon v-if="row.icon" :icon-class="row.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
          </div>
          <div slot="isFrame" slot-scope="{row}">
            {{ {0: '是', 1: '否'}[row.isFrame] }}
          </div>
          <div slot="isCache" slot-scope="{row}">
            {{ {0: '缓存', 1: '不缓存'}[row.isCache] }}
          </div>
          <div slot="visible" slot-scope="{row}">
            {{ {0: '显示', 1: '隐藏'}[row.visible] }}
          </div>
          <div slot="createTime" slot-scope="{ row }">
            {{ DateFormat(new Date(row.createTime), 'yyyy-MM-dd hh:mm') }}
          </div>
        </MPageLayout> -->
      </div>
    </div>

    <!-- 弹框层 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="formDialog.visible"
      :title="formDialog.title"
      width="620px"
      @closed="deforeCloseDialog"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group
            v-model="form.menuType"
            size="mini"
            style="width: 178px"
          >
            <el-radio-button label="M">目录</el-radio-button>
            <el-radio-button label="C">菜单</el-radio-button>
            <el-radio-button label="F">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.menuType !== 'F'"
          label="菜单图标"
          prop="icon"
        >
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="form.icon"
              style="width: 450px"
              placeholder="点击选择图标"
              clearable
            >
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :icon-class="form.icon"
                class="el-input__icon"
                style="height: 32px; width: 16px"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="快捷图标" class="upload-item" prop="bigIcon">
          <div>
            <Upload
              ref="BigUpload"
              width="160"
              height="120"
              accept=".jpg,.jpeg,.png"
              :before-upload="beforeUpload"
              :max-length="1"
              :files="files"
              @onClick="onClick"
              @change="fileChange"
            />
          </div>
          <div class="tips">支持格式jpg/png/jpeg格式图片大小不超过5M。</div>
        </el-form-item>
        <el-form-item
          v-show="form.menuType !== 'F'"
          label="外链菜单"
          prop="isFrame"
        >
          <el-radio-group v-model="form.isFrame" size="mini">
            <el-radio-button :label="0">是</el-radio-button>
            <el-radio-button :label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.menuType === 'C'"
          label="菜单缓存"
          prop="isCache"
        >
          <el-radio-group v-model="form.isCache" size="mini">
            <el-radio-button :label="0">是</el-radio-button>
            <el-radio-button :label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-show="form.menuType !== 'F'"
          label="菜单可见"
          prop="visible"
        >
          <el-radio-group v-model="form.visible" size="mini">
            <el-radio-button :label="0">是</el-radio-button>
            <el-radio-button :label="1">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.menuType !== 'F'"
          label="菜单标题"
          prop="menuName"
        >
          <el-input
            v-model.trim="form.menuName"
            :style="form.menuType === 'M' ? 'width: 450px' : 'width: 178px'"
            placeholder="菜单标题"
          />
        </el-form-item>
        <el-form-item
          v-if="form.menuType === 'F'"
          label="按钮名称"
          prop="menuName"
        >
          <el-input
            v-model.trim="form.menuName"
            placeholder="按钮名称"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="form.menuType !== 'M'"
          label="权限标识"
          prop="perms"
        >
          <el-input
            v-model.trim="form.perms"
            :disabled="form.isFrame === 0"
            placeholder="权限标识"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item v-if="form.menuType !== 'F'" label="路由地址" prop="path">
          <el-input
            v-model.trim="form.path"
            placeholder="路由地址"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item label="菜单排序" prop="orderNum">
          <el-input-number
            v-model.number="form.orderNum"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px"
          />
        </el-form-item>
        <el-form-item
          v-show="form.isFrame !== 0 && form.menuType === 'C'"
          label="组件名称"
          prop="routerName"
        >
          <el-input
            v-model.trim="form.routerName"
            style="width: 178px"
            placeholder="匹配组件内Name字段"
          />
        </el-form-item>
        <el-form-item
          v-show="form.isFrame !== 0 && form.menuType === 'C'"
          label="组件路径"
          prop="component"
        >
          <el-input
            v-model="form.component"
            style="width: 178px"
            placeholder="组件路径"
          />
        </el-form-item>
        <el-form-item
          v-show="form.menuType === 'C'"
          label="重定向"
          prop="redirect"
        >
          <el-input
            v-model.trim="form.redirect"
            style="width: 450px"
            placeholder="重定向"
          />
        </el-form-item>
        <el-form-item
          v-show="form.menuType === 'C'"
          label="活动菜单"
          prop="activeMenu"
        >
          <el-input
            v-model.trim="form.activeMenu"
            style="width: 450px"
            placeholder="活动菜单"
          />
        </el-form-item>
        <el-form-item label="上级类目" prop="parentId">
          <treeselect
            v-model="form.parentId"
            v-loading="menuTreeLoading"
            :options="menus"
            style="width: 450px"
            placeholder="选择上级类目"
            :normalizer="normalizer"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="text"
          :loading="search.loading"
          @click="formDialog.visible = false"
        >
          取消
        </el-button>
        <el-button type="primary" :loading="search.loading" @click="sure">
          确认
        </el-button>
      </div>
    </el-dialog>

    <detailDrawer
      :visible.sync="detailDrawerConfig.visible"
      append-to-body
      :row="detailDrawerConfig.row"
      :menus="menus"
      :role-flag="isMain"
      :user-flag="isMain"
    />
  </div>
</template>

<script>
import IconSelect from '@/components/IconSelect'
import detailDrawer from './menu/detailDrawer.vue'
import Upload from '@/components/AppUploadView/upload'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import filterTop from './menu/filterTop.vue'
import { DateFormat, dealingwithadult } from '@/utils/index'
import { getFileType } from '@/utils/index'
import {
  // getMenuList,
  getAllMenuList,
  getMenuAllTreeList,
  delMenu,
  addMenu,
  editMenu
} from '@/api/system/menu'

import { getItem } from '@/utils/localStorage'
const defaultForm = {
  id: null,
  menuName: null,
  orderNum: 999,
  path: null,
  component: null,
  routerName: null,
  isFrame: 1,
  parentId: null,
  icon: null,
  isCache: 1,
  visible: 1,
  menuType: 'M',
  perms: null,
  activeMenu: null,
  isPlatform: false // true=>平台 false=> 机构
}
export default {
  name: 'Menu',
  components: {
    IconSelect,
    Treeselect,
    filterTop,
    detailDrawer,
    Upload
  },
  data() {
    return {
      contentLoading: false, // 加载loading
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,

      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'icon',
        'isFrame',
        'isCache',
        'visible',
        'createTime'
      ],
      defaultProps: {
        label: 'menuName'
      },
      tabInfo: {
        cur: 'jg',
        list: [
          { label: '机构菜单管理', name: 'jg' },
          { label: '平台菜单管理', name: 'pt' }
        ]
      },
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'menuName', label: '菜单标题', type: 'text', visible: true },
          { prop: 'icon', label: '图标', type: 'slot', visible: true },
          { prop: 'orderNum', label: '排序', type: 'text', visible: true },
          { prop: 'perms', label: '权限标识', type: 'text', visible: true },
          { prop: 'path', label: '组件路劲', type: 'text', visible: true },
          { prop: 'isFrame', label: '外链', type: 'slot', visible: true },
          { prop: 'isCache', label: '缓存', type: 'slot', visible: true },
          { prop: 'visible', label: '可见', type: 'slot', visible: true },
          { prop: 'parentId', label: '父菜单id', type: 'text', visible: true },
          {
            prop: 'createTime',
            label: '创建日期',
            type: 'slot',
            visible: true
          },
          {
            prop: 'action',
            label: '操作',
            type: 'slot',
            visible: true,
            width: '150'
          }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        path: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      },
      query: {
        blurry: '',
        createTime: ''
      },
      crud: {
        loading: false,
        data: []
      },
      formDialog: {
        title: '新增',
        type: 1,
        visible: false
      },
      search: {
        menu: { label: 'menuName', value: '' },
        // time: { label: 'createTime', value: ['', ''] },
        status: '',
        visible: '',
        menuType: '',
        loading: false
      },
      menuTreeLoading: false,
      permsList: this.$route.meta.permsList || [],
      detailDrawerConfig: {
        visible: false
      },
      form: {
        id: null,
        menuName: null,
        orderNum: 999,
        path: null,
        component: null,
        routerName: null,
        isFrame: 1,
        parentId: null,
        icon: null,
        isCache: 1,
        visible: 1,
        menuType: 'M',
        perms: null,
        activeMenu: null,
        bigIcon: null,
        isPlatform: false // true=>平台 false=> 机构
      },
      files: []
    }
  },
  computed: {
    isMain() {
      const orgInfo = getItem('orgInfo')
      return !!(orgInfo?.organizationId === 1 && this.tabInfo.cur === 'pt')
    }
  },
  watch: {
    'tabInfo.cur': {
      handler(val) {
        if (val && this.$refs.filterTopRef) {
          this.form.isPlatform = val !== 'jg'
          this.$refs.filterTopRef.clear()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      console.log(res)
      localStorage.setItem(
        'menu_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    })
  },
  created() {
    const tableColumns = localStorage.getItem('menu_tableColumns')
    if (tableColumns) {
      this.config.tableColumns = JSON.parse(tableColumns)
    }
    this.getMenusList()
    this.getMenu()
  },
  methods: {
    DateFormat,
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem(
        'menu_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem(
        'menu_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    async getMenu() {
      this.menuTreeLoading = true
      try {
        const res = await getMenuAllTreeList({
          isPlatform: this.form.isPlatform
        })
        this.menus = [
          {
            id: 0,
            label: '顶级类目',
            children: res.data
          }
        ]
        this.menuTreeLoading = false
      } catch (error) {
        this.menuTreeLoading = false
      }
    },
    async getMenusList() {
      this.search.loading = true
      const params = {
        [this.search.menu.label]: this.search.menu.value,
        menuType: this.search.menuType,
        status: this.search.status,
        visible: this.search.visible,
        isPlatform: this.form.isPlatform
      }

      try {
        const res = await getAllMenuList(params)
        this.config.tableData = dealingwithadult(res.data)
        this.config.total = res.data.length
        this.search.loading = false
      } catch (error) {
        this.search.loading = false
      }
    },
    // 点击新增按钮打开新增弹框
    showAddDialog() {
      this.files = []
      const isPlatform = this.form.isPlatform
      this.form = JSON.parse(JSON.stringify(defaultForm))
      this.form.isPlatform = isPlatform
      this.formDialog = {
        title: '新增',
        visible: true,
        type: 1
      }
      this.getMenu()
    },
    // 选中图标
    selected(name) {
      this.form.icon = name
    },
    // 弹框关闭前重置表单
    deforeCloseDialog() {
      console.log('弹框关闭')
      this.$refs.form.clearValidate()
    },
    // 点击搜索
    async searchFn(res) {
      this.contentLoading = true
      this.search = res
      await this.getMenusList()
      this.contentLoading = false
    },
    // 点击确认新增/修改
    sure() {
      if (this.formDialog.type === 1) {
        // 新增
        this.addMenu()
      } else {
        // 编辑
        this.editMenu()
      }
    },
    // 新增
    addMenu() {
      this.search.loading = true
      addMenu(this.form)
        .then(res => {
          this.formDialog.visible = false
          this.getMenusList()
          this.getMenu()
        })
        .catch(() => {
          this.search.loading = false
        })
    },
    // 编辑
    editMenu() {
      this.search.loading = true
      editMenu(this.form)
        .then(res => {
          this.formDialog.visible = false
          this.getMenusList()
          this.getMenu()
        })
        .catch(() => {
          this.search.loading = false
        })
    },
    openEditMenu(row) {
      console.log(row, 'row')
      // 清空upload数据
      this.onClick()
      this.files = row.bigIcon
        ? [{ url: row.bigIcon, icon: row.bigIcon, status: 3 }]
        : []
      const isPlatform = this.form.isPlatform
      this.form = JSON.parse(JSON.stringify(row))
      this.form.isPlatform = isPlatform
      this.formDialog = {
        title: '编辑',
        visible: true,
        type: 2
      }
      // 获取最新的路由数据
      this.getMenu()
    },
    delMenu(row) {
      console.log(row)
      this.$delModal({
        tips: '确定删除该菜单?',
        success: () => {
          this.search.loading = true
          delMenu(row.menuId)
            .then(res => {
              this.getMenusList()
            })
            .catch(() => {
              this.search.loading = false
            })
        }
      })
    },
    normalizer(node) {
      // 当子节点也就是children=[]时候去掉子节点
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    openDetailMenu(row) {
      this.detailDrawerConfig = {
        row: row,
        visible: true
      }
    },
    // 上传相干
    beforeUpload(file) {
      const type = getFileType(file.name).suffix
      const isIMAGE = ['jpg', 'png', 'JPG', 'PNG', 'jpeg', 'JPEG'].includes(
        type
      )
      const isLt20M = file.size / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error(`仅支持jpg,png,jpeg格式图片!`)
      } else if (!isLt20M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt20M
    },
    onClick() {
      this.$refs.BigUpload && this.$refs.BigUpload.setFileList([])
      this.form.bigIcon = ''
    },
    fileChange(res) {
      if (res.length > 0) {
        this.form.bigIcon = res[0].url
        this.$refs.BigUpload && this.$refs.form.validateField('bigLogo')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
::v-deep .el-tabs__nav-scroll {
  padding-left: 20px;
}
.head-container {
  padding: 20px 20px 0;
}
.page-wrap {
  @include responsive-height(20px);
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    // overflow: auto;
    &::-webkit-scrollbar {
      width: 8px;
      height: 10px;
      background-color: rgba(0, 0, 0, 0);
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
      -moz-transition: all 0.4s ease;
      -webkit-transition: all 0.4s ease;
      -o-transition: all 0.4s ease;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .filter_top {
      /* padding: 20px; */
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
        0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
    }
    .footer-tabs {
      margin-top: 16px;
    }
    .table-module {
      // flex: 1 0 0;
      height: calc(100% - 200px);
      overflow: auto;
      padding: 20px;
      margin-top: 20px;
      width: 100%;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12),
        0px 4px 5px 0px rgba(0, 0, 0, 0.08),
        0px 1px 10px 0px rgba(0, 0, 0, 0.05);
      .tree-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-bottom: 15px;
      }
      .custom-tree-node {
        display: flex;
        align-items: center;
        .tree-item {
          margin: 0 10px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
      .tree-title {
        display: flex;
        padding-left: 20px;
        font-weight: 600;
        margin-bottom: 15px;
        div {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
