<template>
  <div class="page-wrap">
    <div class="content">
      <div class="filter_top">
        <filterTop :search="search" @search="searchFn" />
      </div>

      <div class="p-20 table-module">
        <!--表格渲染-->
        <MPageLayout
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
          checkbox
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @handleSelectionChange="handleSelectionChange"
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
            <el-button v-permission="['system:third:add', permsList]" type="primary" size="small" @click="showAddDialog">新增</el-button>
          </div>
          <div slot="action" slot-scope="{ row }">
            <el-button v-permission="['system:third:edit', permsList]" type="text" @click="showEditModal(row)">编辑</el-button>
            <el-button v-permission="['system:third:remove', permsList]" type="text" @click="del(row)">删除</el-button>
            <!-- <el-button type="text">数据</el-button>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button type="text" class="m-l-10">更多</el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="openEditMenu(row)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="delMenu(row)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
          <div slot="platformType" slot-scope="{ row }">
            <!-- {{ {1: '抖店', 2: '快手'}[row.platformType] }} -->
            {{ row.platformType | getOptionsValue(thirdShopType) }}
          </div>
          <div slot="footer">
            <el-button v-permission="['system:third:remove', permsList]" size="small" type="danger" :disabled="multipleSelection.length === 0" @click="AllDel">删除</el-button>
          </div>
        </MPageLayout>
      </div>
    </div>

    <!-- 弹框层 -->
    <Modal
      :title="modal.title"
      :type="modal.type"
      size="600px"
      width="600px"
      :visible.sync="modal.visible"
    >
      <thirdImputationModal
        :type="modal.type"
        :visible.sync="modal.visible"
        :data="modal.data"
        @close="closeModal()"
        @success="sendSuccess"
      />
    </Modal>
  </div>
</template>

<script>
import filterTop from './thirdImputation/filterTop.vue'
import Modal from '@/components/Modal'
import thirdImputationModal from '@/components/Modal/shop/thirdImputation.vue'
// import { getMenuList, getMenuTreeList, delMenu, addMenu, editMenu } from '@/api/system/menu'
import {
  getThirdPage,
  delThird
// getThirdDetail
} from '@/api/shop/thirdImputation'
import { mapGetters } from 'vuex'

const defaultForm = { id: null, menuName: null, orderNum: 999, path: null, component: null, routerName: null, isFrame: 1, parentId: null, icon: null, isCache: 1, visible: 1, menuType: 'M', perms: null, activeMenu: null }
export default {
  name: 'Menu',
  components: {
    filterTop,
    thirdImputationModal,
    Modal
  },
  data() {
    return {
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,

      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'platformType'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'platformId', label: '第三方平台id', type: 'text', visible: true },
          { prop: 'platformAccount', label: '第三方账户', type: 'text', visible: true },
          { prop: 'platformType', label: '第三方平台', type: 'slot', visible: true },
          { prop: 'platformUrl', label: '归集接收地址url', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', visible: true, width: '150' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      formDialog: {
        title: '新增',
        type: 1,
        visible: false
      },
      search: {
        platformType: '',
        platformAccount: '',
        platformUrl: '',
        loading: false
      },
      // 弹框属性
      modal: {
        title: '新增',
        type: 1, // 1: 新增; 2查看; 3编辑;
        visible: false,
        data: {}
      },
      multipleSelection: [],
      permsList: this.$route.meta.permsList || [],
      form: { id: null, menuName: null, orderNum: 999, path: null, component: null, routerName: null, isFrame: 1, parentId: null, icon: null, isCache: 1, visible: 1, menuType: 'M', perms: null, activeMenu: null }
    }
  },
  computed: {
    ...mapGetters([
      'thirdShopType'
    ])
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter(v => v.visible)
        if (arr.length === this.config.tableColumns.length) {
          this.allColumnsSelected = true
          this.allColumnsSelectedIndeterminate = false
        } else {
          this.allColumnsSelected = false
          this.allColumnsSelectedIndeterminate = true
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      console.log(res)
      localStorage.setItem('thirdImputation_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  created() {
    // const tableColumns = localStorage.getItem('thirdImputation_tableColumns')
    // if (tableColumns) {
    //   this.config.tableColumns = JSON.parse(tableColumns)
    // }
    this.getList()
  },
  methods: {
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('thirdImputation_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    handleCheckAllChange(val) {
      this.config.tableColumns.map(v => {
        v.visible = true
      })
      localStorage.setItem('thirdImputation_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    getList() {
      this.search.loading = true
      const params = {
        platformType: this.search.platformType,
        platformAccount: this.search.platformAccount,
        platformUrl: this.search.platformUrl
      }
      getThirdPage(params).then(res => {
        this.config.tableData = res.data.records
        this.config.total = res.data.total
        this.search.loading = false
      }).catch(() => {
        this.search.loading = false
      })
    },
    // 点击新增按钮打开新增弹框
    showAddDialog() {
      this.form = JSON.parse(JSON.stringify(defaultForm))
      this.modal = {
        title: '新增',
        visible: true,
        type: 1
      }
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'platformId', label: '第三方平台id', type: 'text', visible: true },
        { prop: 'platformAccount', label: '第三方账户', type: 'text', visible: true },
        { prop: 'platformType', label: '第三方平台', type: 'slot', visible: true },
        { prop: 'platformUrl', label: '归集接收地址url', type: 'text', visible: true },
        { prop: 'action', label: '操作', type: 'slot', visible: true, width: '150' }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('thirdImputation_tableColumns', JSON.stringify(tableColumns))
    },
    // 点击搜索
    searchFn(res) {
      this.search = res
      console.log(res, 'res')
      this.getList()
    },
    closeModal() {
      this.modal.visible = false
    },
    sendSuccess() {
      this.modal.visible = false
      this.getList()
    },
    // 编辑弹框
    showEditModal(row) {
      this.modal = {
        type: 3,
        title: '编辑',
        visible: true,
        data: JSON.parse(JSON.stringify(row))
      }
    },
    // 删除业务
    del(row) {
      this.$delModal({
        tips: '确定删除该数据',
        success: () => {
          this.search.loading = true
          const params = {
            platformIdList: [row.platformId]
          }
          delThird(params).then(res => {
            this.getList()
          }).catch(() => {
            this.search.loading = false
          })
        }
      })
    },
    //
    handleSizeChange(val) {
      console.log(val)
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    AllDel() {
      if (this.multipleSelection.length === 0) {
        return this.$message.error('请先选择数据')
      }
      this.$delModal({
        tips: '确定删除该数据',
        success: () => {
          this.search.loading = true
          const platformIdList = []
          this.multipleSelection.map(v => {
            platformIdList.push(v.platformId)
          })
          const params = {
            platformIdList
          }
          delThird(params).then(res => {
            this.getList()
          }).catch(() => {
            this.search.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
 ::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.head-container {
  padding: 20px 20px 0;
}
.page-wrap {
  height: calc(100vh - 100px);
  // background: #fff;

  .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      // overflow: auto;
      &::-webkit-scrollbar {
        width: 8px;
        height: 10px;
        background-color: rgba(0,0,0,0);
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: rgba(0,0,0,.2);
        transition: all .4s ease;
        -moz-transition: all .4s ease;
        -webkit-transition: all .4s ease;
        -o-transition: all .4s ease;
      }
      &::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,.1);
      }
      .filter_top {
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
      }
      .footer-tabs {
        margin-top: 16px;
      }
      .table-module {
        flex: 1 0 0;
        padding: 20px;
        margin-top: 20px;
        width: 100%;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.05);
      }
    }
}
</style>
