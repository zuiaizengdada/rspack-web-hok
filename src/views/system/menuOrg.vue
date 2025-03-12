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
            </div>
          </span>
        </el-tree>
      </div>
    </div>
    <detailDrawer
      :visible.sync="detailDrawerConfig.visible"
      append-to-body
      :row="detailDrawerConfig.row"
      :menus="menus"
      :role-flag="true"
      :user-flag="true"
      :jg-flag="false"
      @update:visible="getList"
    />
  </div>
</template>

<script>
import detailDrawer from './menu/detailDrawer.vue'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import filterTop from './menu/filterTop.vue'
import { DateFormat, dealingwithadult } from '@/utils/index'
import { getFileType } from '@/utils/index'
import {
  // getMenuList,
  getAllMenuList,
  getMenuAllTreeList
} from '@/api/system/menu'
export default {
  name: 'MenuOrg',
  components: {
    filterTop,
    detailDrawer
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
          { label: '机构菜单管理', name: 'jg' }
          // { label: '平台菜单管理', name: 'pt' }
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
      // 清空upload数据
      this.onClick()
      this.files = row.bigIcon ? [{ url: row.bigIcon }] : []
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
