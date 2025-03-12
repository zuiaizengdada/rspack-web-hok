<template>
  <!-- 订单标记弹框 -->
  <AppDialog
    v-model="config.visible"
    :title="config.title"
    width="800px"
    height="auto"
  >
    <div class="orderSignContent">
      <div class="orderSignFrom">
        <div class="orderSignFromItem">
          <div class="orderSignFromLabel">标记状态：</div>
          <div class="orderSignFromValue">
            <el-tag v-if="tagStatus === 0" size="small" type="danger">标记停止</el-tag>
            <el-tag v-else-if="tagStatus === 1" size="small">标记中</el-tag>
          </div>
        </div>
        <div class="orderSignFromItem">
          <div class="orderSignFromLabel">订单标记条件：</div>
          <div class="orderSignFromValue">
            <el-button size="mini" @click="openEditDialog">修改</el-button>
            <!-- <span class="tips">如需修改【标记条件】请先停止标记</span> -->
          </div>
        </div>
      </div>
      <div class="orderSignTable">
        <el-table :header-cell-style="{ background: '#f5f5f5' }" border :data="tableData" style="width: 100%" :max-height="400">
          <el-table-column prop="orderPlatform" label="渠道" width="180" />
          <el-table-column prop="shopName" label="店铺" width="180" />
          <el-table-column prop="orderName" label="商品名称" />
        </el-table>
      </div>
      <div class="pagination" />
    </div>
    <div slot="footer" class="orderSignFooter">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        :pager-count="5"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div>
        <el-button v-if="tagStatus === 0" type="primary" size="small" :loading="getStatusLoading" @click="changeTagStatus(1)">开始标记</el-button>
        <el-button v-else-if="tagStatus === 1" type="danger" size="small" :loading="getStatusLoading" @click="changeTagStatus(0)">停止标记</el-button>
      </div>
    </div>

    <!-- 修改标记弹框 -->
    <AppDialog
      v-model="editConfig.visible"
      :title="editConfig.title"
      width="900px"
      height="auto"
    >
      <div class="editConfigContent">
        <div class="editConfigTitle">新增标记条件</div>
        <el-form ref="editForm" :rules="rules" label-position="left" :inline="true" :model="form" size="small" label-width="90px">
          <el-form-item label="渠道/店铺" prop="orderPlatform">
            <el-cascader
              v-model="form.orderPlatform"
              style="width: 490px"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="商品名" prop="orderName">
            <el-input v-model.trim="form.orderName" style="width: 490px" placeholder="请输入商品名称" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item>
            <el-button class="btn_primary" :loading="editConfig.loading" @click="addTag()">添加</el-button>
            <el-button :loading="editConfig.loading" @click="clear()">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="editConfigTitle">当前标记条件</div>
        <div class="editConfigTable">
          <el-table v-loading="editConfig.loading" :header-cell-style="{ background: '#f5f5f5' }" border :data="editConfig.tableData" style="width: 100%" :max-height="400">
            <el-table-column prop="orderPlatform" label="渠道" width="180" />
            <el-table-column prop="shopName" label="店铺" width="180" />
            <el-table-column prop="orderName" label="商品名称" />
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="text" style="color: red" @click="delTag(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="editConfigFooter">
        <el-pagination
          :current-page="editConfig.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="editConfig.total"
          :pager-count="5"
          @size-change="editHandleSizeChange"
          @current-change="editHandleCurrentChange"
        />
        <div>
          <el-button size="small" type="primary" @click="close()">确定</el-button>
          <el-button size="small" @click="close()">取消</el-button>
        </div>
      </div>
    </AppDialog>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  addPushOrderTag,
  getOrderTagList,
  editOrderTagModified,
  removeOrderTag,
  getTagStatus
} from '@/api/order/orderSign.js'
export default {
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          title: '',
          visible: false
        }
      }
    }
  },
  data() {
    return {
      tagStatus: 0, // 0 标记停止 1 标记中
      tableData: [],
      editConfig: {
        visible: false,
        title: '标记条件配置',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        tableData: [],
        total: 0
      },
      form: {
        orderPlatform: [], // 渠道店铺
        orderName: '' // 商品名
      },
      getListLoading: false,
      getStatusLoading: false,
      pageSize: 10,
      pageIndex: 1,
      total: 1000,
      options: [
        {
          value: '抖音平台',
          label: '抖音平台',
          children: [
            { value: '获客文化专营店', label: '获客文化专营店' },
            { value: '获客一下专营店', label: '获客一下专营店' },
            { value: '获客管理专营店', label: '获客管理专营店' },
            { value: '获客牛3店', label: '获客牛3店' }
          ]
        },
        {
          value: '微信小店',
          label: '微信小店',
          children: [
            { value: '获课学堂', label: '获课学堂' },
            { value: '获客识堂', label: '获客识堂' },
            { value: '获客有赞', label: '获客有赞' },
            { value: '获客教育', label: '获客教育' },
            { value: '获客文化', label: '获客文化' }
          ]
        },
        {
          value: '快手平台',
          label: '快手平台',
          children: [
            { value: '获客牛5店', label: '获客牛5店' }
          ]
        }
      ],
      rules: {
        orderPlatform: [
          { required: true, type: 'array', message: '请选择渠道/店铺', trigger: 'change' }
        ],
        orderName: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    config: {
      handler(val) {
        if (val.visible) {
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 点击打开修改标记弹框
    openEditDialog() {
      this.editConfig = {
        visible: true,
        title: '标记条件配置',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        tableData: [],
        total: 0
      }
      this.editGetList()
    },
    // 获取推送需要标记订单名称列表
    getList() {
      this.getListLoading = true
      const params = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      getOrderTagList(params).then(res => {
        console.log(res, '获取的列表数据')
        this.tableData = res.data.items
        this.total = res.data.total
        this.getListLoading = true
      }).catch(() => {
        this.getListLoading = false
      })
    },
    // 获取推送标记状态
    getStatus() {
      this.getStatusLoading = true
      getTagStatus().then(res => {
        console.log(res, '获取的状态数据')
        this.tagStatus = res.data ? 1 : 0
        this.getStatusLoading = false
      }).catch(() => {
        this.getStatusLoading = false
      })
    },
    // 页码改变触发
    handleSizeChange(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getList()
    },
    // 当前页改变触发
    handleCurrentChange(val) {
      this.pageIndex = val
      this.getList()
    },
    init() {
      this.pageIndex = 1
      this.getList()
      this.getStatus()
    },
    // 点击开始标记/停止标记
    changeTagStatus(status) {
      const test = status ? '该操作将【启动】订单标记处理，请确认【标记条件】是否满足订单标记需要。' : '该操作将【停止】订单标记处理，请确认。'
      this.$confirm(test, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          onPush: status
        }
        this.getStatusLoading = true
        editOrderTagModified(params).then((res) => {
          this.getStatus()
          this.getStatusLoading = false
        }).catch(() => {
          this.getStatusLoading = false
        })
      })
    },

    /** 修改弹框中的方法 */
    // 页码改变触发
    editHandleSizeChange(val) {
      this.editConfig.pageSize = val
      this.editConfig.pageIndex = 1
      this.editGetList()
    },
    // 当前页改变触发
    editHandleCurrentChange(val) {
      this.editConfig.pageIndex = val
      this.editGetList()
    },
    editGetList() {
      this.editConfig.loading = true
      const params = {
        pageIndex: this.editConfig.pageIndex,
        pageSize: this.editConfig.pageSize
      }
      getOrderTagList(params).then(res => {
        this.editConfig.tableData = res.data.items
        this.editConfig.total = res.data.total
        this.editConfig.loading = false
        console.log(this.editConfig.tableData, 'this.editConfig.tableData')
      }).catch(() => {
        this.editConfig.loading = false
      })
    },
    // 点击添加标记
    addTag() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.handleAddTag()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 点击重置
    clear() {
      this.$refs.editForm.resetFields()
    },
    handleAddTag() {
      const data = {
        orderPlatform: this.form.orderPlatform[0],
        shopName: this.form.orderPlatform[1],
        orderName: this.form.orderName
      }
      this.editConfig.loading = true
      addPushOrderTag(data).then(res => {
        this.$notify.success({ title: '提示', message: '添加成功' })
        this.clear()
        this.editGetList()
        this.editConfig.loading = false
      }).catch(() => {
        this.editConfig.loading = false
      })
    },
    // 删除标签
    delTag(row) {
      const params = {
        id: row.id
      }
      this.editConfig.loading = true
      removeOrderTag(params).then((res) => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.editGetList()
        this.editConfig.loading = false
      }).catch(() => {
        this.editConfig.loading = false
      })
    },
    // 关闭弹框
    close() {
      this.clear()
      this.editConfig.visible = false
      this.init()
    },
    // 联动选中触发
    handleChange(val) {
      console.log(val)
    }
    /** 修改弹框中的方法 */
  }
}
</script>

<style lang='scss' scoped>
.orderSignFooter,.editConfigFooter {
    display: flex;
    padding-right: 20px;
    padding-left: 20px;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    width: 100%;
    height: 66px;
    border-radius: 2px 2px 0 0;
}

.orderSignContent {
    width: 100%;
    .orderSignFrom {
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 12px;
        .orderSignFromItem {
            display: flex;
            margin-bottom: 20px;
            .orderSignFromLabel {
                font-size: 16px;
                font-family: MicrosoftYaHei;
                color: #777777;
                line-height: 24px;
                margin-right: 8px;
            }
            .orderSignFromValue {
                font-size: 14px;
                font-family: MicrosoftYaHei;
                color: #333333;
                line-height: 22px;
                > .tips {
                    font-size: 12px;
                    font-family: MicrosoftYaHei;
                    color: #F53F3F;
                    line-height: 20px;
                    margin-left: 8px;
                }
            }
        }
    }
    .orderSignTable {
        padding-left: 20px;
        padding-right: 20px;
    }
}

.editConfigContent {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 15px;
    .editConfigTable {

    }
    .editConfigTitle {
        font-size: 16px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: #333333;
        line-height: 24px;
        margin-bottom: 20px;
    }
}
.inputBtn {
    width: 50px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #1890ff;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0px 4px 4px 0;
    cursor: pointer;
}
</style>
