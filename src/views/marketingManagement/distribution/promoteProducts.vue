<template>
  <div class="page-wrap">
    <!-- 分销管理 -->

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
      :loading="loading"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleListSizeChange"
      @current-change="handleListCurrentChange"
    >
      <div slot="headerLeft">
        <div class="fl">
          <el-select
            v-model="search.shelveFlag"
            class="w-140 m-r-10"
            placeholder="上架状态"
            size="small"
            clearable
            @change="getListBySearch"
          >
            <el-option label="已上架" :value="0" />
            <el-option label="已下架" :value="1" />
            <el-option label="待上架" :value="2" />
          </el-select>
          <el-input
            v-model="search.goodsName"
            placeholder="请输入商品名称"
            clearable
            size="small"
            @keyup.enter.native="getListBySearch"
            @clear="getListBySearch"
          />
          <el-button class="m-l-10" type="primary" size="small" @click="getListBySearch">搜索</el-button>
        </div>
      </div>
      <div slot="headerRight">
        <!-- <el-popover placement="bottom-end" width="150" trigger="click">
          <el-button slot="reference" type="text" size="small">自定义表头</el-button>

          <el-checkbox
            v-model="allColumnsSelected"
            :indeterminate="allColumnsSelectedIndeterminate"
            @change="handleCheckAllChange"
          >
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
        <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button> -->
        <el-button v-permission="['web:promoteProducts:add', permsList]" type="primary" size="small" @click="add">添加商品</el-button>
      </div>
      <div slot="action" slot-scope="{ row }">
        <el-button v-if="!row.isEdit" v-permission="['web:promoteProducts:edit', permsList]" type="text" @click="table_edit(row)">编辑</el-button>
        <el-button v-if="row.isEdit" v-permission="['web:promoteProducts:edit', permsList]" type="text" @click="table_save(row)">保存</el-button>
        <el-button v-if="row.isEdit" v-permission="['web:promoteProducts:edit', permsList]" type="text" @click="table_cancel(row)">取消</el-button>
        <el-button v-if="!row.isEdit" v-permission="['web:promoteProducts:remove', permsList]" type="text" @click="table_delete(row)">移除</el-button>
      </div>
      <div slot="contentName" slot-scope="{ row }" class="content-name">
        <ImagePreviewer
          class="m-r-10"
          style="width: 82px; height: 60px; border-radius: 4px; background: #f5f7fa"
          :src="row.contentUrl ? row.contentUrl.split(',')[0] : row.coverVerticalUrl"
          fit="contain"
          :preview-src-list="row.contentUrl ? row.contentUrl.split(',') : []"
          :scale-width="82"
          :scale-height="60"
        />
        <div v-if="row.contentName.length < 9">{{ row.contentName }}</div>
        <el-tooltip v-else class="item" effect="dark" :content="row.contentName" placement="top">
          <div class="ellipsis">{{ row.contentName }}</div>
        </el-tooltip>
      </div>
      <div slot="shelveFlag" slot-scope="{ row }">
        <AppStatus :status="['success', 'error'][row.shelveFlag]">
          <span>
            {{ ['已上架', '已下架', '待上架'][row.shelveFlag] }}
          </span>
        </AppStatus>
      </div>
      <div slot="sort" slot-scope="{ row }">
        <el-input-number
          v-if="row.isEdit"
          v-model="row.sort"
          :max="999999"
          style="width: 180px"
          :step="1"
          step-strictly
          :min="0"
        />
        <span v-else>{{ row.sort }}</span>
      </div>
      <div slot="footer" />
      <div slot="commissionRate" slot-scope="{ row }">
        <template v-if="row.isEdit">
          <el-input-number v-model="row.commissionRate" style="width: 120px" :max="99" :min="0" />
          <span>%</span>
        </template>
        <span v-else>{{ row.commissionRate }}%</span>
      </div>
    </MPageLayout>
  </div>
</template>

<script>
import {
  promotionGoodsPage,
  promotionGoodsSave,
  promotionGoodsUpdate,
  promotionGoodsDel,
  promotionGoodsExists
} from '@/api/promotion/promoter'
import { getColumns } from './columns/promoteProducts'
import AppStatus from '@/components/AppStatus'
export default {
  name: 'PromoteProducts',
  components: {
    AppStatus
  },
  data() {
    return {
      loading: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'shelveFlag', 'sort', 'footer', 'commissionRate', 'contentName'],
      config: {
        tableData: [],
        tableColumns: getColumns(),
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      menus: [],
      query: {
        blurry: '',
        createTime: ''
      },
      search: {
        goodsName: '',
        shelveFlag: undefined
      },
      crud: {
        loading: false,
        data: []
      },
      // 新增角色/编辑角色弹框
      formDialog: {
        title: '新增',
        type: 1,
        visible: false,
        loading: false
      },
      form: {
        roleName: ''
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleKey: [
          { required: true, message: '请输入权限字符串', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (!/[a-zA-z]$/.test(value)) {
                callback(new Error('请输入英文'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }],
        menuIds: [{ type: 'array', required: true, message: '请至少选择一个角色权限', trigger: 'blur' }]
      },
      // 设置角色权限弹框
      roleSettingModal: {
        title: '设置',
        type: 1,
        visible: false,
        loading: false,
        data: {}
      },
      treeData: [],
      roleUserModel: {
        title: '人员列表',
        visible: false,
        loading: false,
        tableData: [],
        current: 1,
        size: 10,
        total: 0
      },
      multipleSelection: [],
      permsList: this.$route.meta.permsList || []
    }
  },
  watch: {
    'config.tableColumns': {
      handler(val) {
        const arr = val.filter((v) => v.visible)
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
      localStorage.setItem('distribution_tableColumns', JSON.stringify(this.config.tableColumns))
    })
  },
  created() {
    // const tableColumns = localStorage.getItem('distribution_tableColumns')
    // if (tableColumns) {
    //   this.config.tableColumns = JSON.parse(tableColumns)
    // }
    this.getList()
  },
  methods: {
    getListBySearch() {
      this.config.currentPage = 1
      this.getList()
    },
    async add() {
      const { data } = await promotionGoodsExists()
      this.$SelectGoods({
        visible: true,
        multiple: true,
        check: data,
        disabledFn: (item) => item.relationSaleFlag === 1 && item.goodsType !== 3 && item.goodsType !== 4,
        tabList: [
          { id: '0', name: '图文', api: '' },
          { id: '1', name: '音频', api: '' },
          { id: '2', name: '视频', api: '' },
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' }
        ],
        currentId: '3',
        success: (res) => {
          console.log(res, 'res')
          this.goodsSave(res)
        }
      })
    },
    async goodsSave(data) {
      const params = data.map((item) => {
        return {
          goodsId: item.goodsId,
          goodsName: item.contentName,
          goodsType: item.goodsType,
          sort: 100,
          commissionRate: 0,
          relationSaleFlag: item.relationSaleFlag
        }
      })
      const { code } = await promotionGoodsSave(params)
      if (code === 1) {
        this.$notify.success('添加成功')
        this.getList()
      }
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter((v) => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('distribution_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.forEach((v) => {
        v.visible = true
      })
      localStorage.setItem('distribution_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = getColumns()
      this.config.tableColumns = tableColumns
      localStorage.setItem('distribution_tableColumns', JSON.stringify(tableColumns))
    },
    // 获取列表数据
    async getList() {
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        goodsName: this.search.goodsName,
        shelveFlag: this.search.shelveFlag
      }
      const { data } = await promotionGoodsPage(params)
      this.config.tableData = data.records?.map((v) => {
        return {
          ...v,
          isEdit: false
        }
      })
      this.config.total = data.total
      this.loading = false
    },
    handleListSizeChange(val) {
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleListCurrentChange(val) {
      this.config.currentPage = val
      this.getList()
    },
    handleListSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    table_delete(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          this.handleDelete(row)
        }
      })
    },
    async handleDelete(row) {
      const { code } = await promotionGoodsDel(row.goodsId)
      if (code === 1) {
        this.$notify.success('删除成功')
        this.getList()
      }
    },
    // 列表点击编辑
    table_edit(row) {
      row.commissionRate = row.commissionRate || 0
      row.sort = row.sort || 0
      row.isEdit = true
    },
    async table_save(row) {
      row.isEdit = false
      const { code } = await promotionGoodsUpdate(row)
      if (code === 1) {
        this.$notify.success('修改成功')
        this.getList()
      }
    },
    table_cancel(row) {
      row.isEdit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.head-container {
  padding: 20px 20px 0;
}
.page-wrap {
  min-width: 1200px;
  // height: 100%;
  height: 100%;
  background: #fff;
}
.content-name {
  display: flex;
  align-items: center;
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  div {
    width: 120px;
    margin-left: 15px;
  }
  img {
    width: 80px;
    height: 50px;
    border-radius: 5px;
  }
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
    -webkit-box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    box-shadow: 0 -7px 5px -5px rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
  }
}
</style>
