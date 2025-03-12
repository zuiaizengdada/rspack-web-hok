<template>
  <!-- 订单标记弹框 -->
  <div>
    <div class="orderSignContent">
      <div class="orderSignFrom">
        <div class="orderSignFromItem bj-status-cls">
          <div class="orderSignFromLabel">标记状态：</div>
          <div class="orderSignFromValue">
            <el-tag v-if="tagStatus === 0" size="small" type="danger">标记停止</el-tag>
            <el-tag v-else-if="tagStatus === 1" size="small">标记中</el-tag>
          </div>
        </div>
        <div class="orderSignFromItem">
          <!-- <div class="orderSignFromLabel">订单标记条件：</div>
          <div class="orderSignFromValue">
            <el-button size="mini" @click="openEditDialog">修改</el-button>
          </div> -->

          <div class="orderSignFromLabel m-l-20">标记查询：</div>
          <div class="orderSignFromValue">
            <el-select v-model="search.tagName" size="small" placeholder="请选择" filterable clearable @clear="searchFn()">
              <el-option v-for="item in signLabelOption" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
          <div class="orderSignFromLabel m-l-20">商品名：</div>
          <div class="orderSignFromValue">
            <el-input v-model="search.orderName" placeholder="请输入第三方商品名称" />
          </div>
          <div class="orderSignFromLabel m-l-20">商品ID：</div>
          <div class="orderSignFromValue">
            <el-input v-model="search.productId" placeholder="请输入第三方商品ID" />
          </div>
        </div>
        <div class="orderSignFromItem">
          <div class="orderSignFromLabel m-l-20">渠道/店铺</div>
          <div class="orderSignFromValue">
            <el-cascader
              v-model="search.orderPlatform"
              style="width: 400px"
              :options="options"
              :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'label', label: 'label', children: 'list' }"
              @change="handleChange"
            />
          </div>
          <div class="orderSignFromVlaue" style="width: 445px; float:  right;">
            <el-button size="small" type="primary" class="m-l-20" @click="searchFn()">查询</el-button>
            <el-button size="small" @click="clearSearch()">重置</el-button>
            <el-button class="right-cls-btn" size="small" type="primary" @click="openEditDialog"><i class="el-icon-plus" style="margin-right: 5px;" />新增标记条件</el-button>
          </div>
        </div>
      </div>
      <div class="orderSignTable">
        <el-table :header-cell-style="{ background: '#f5f5f5' }" border :data="tableData" style="width: 100%" :max-height="580">
          <el-table-column label="渠道" width="180">
            <template slot-scope="scope">
              <img class="channel-img" :src="scope.row.channelImg">
              <span>{{ scope.row.orderPlatform }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shopName" label="店铺" width="180" />
          <el-table-column prop="tagName" label="标记" width="100" />
          <el-table-column prop="productId" label="第三方商品ID" />
          <el-table-column prop="orderName" width="220" label="第三方商品名称" />
          <el-table-column
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="toEdit(scope.row)">编辑</el-button>
              <el-button class="red-cls" type="text" size="small" @click="deleteBj(scope.row)">删除</el-button>
            </template>
          </el-table-column>
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
      width="580px"
      height="auto"
      @success="addTag"
      @close="clear"
    >
      <div class="editConfigContent">
        <el-form ref="editForm" :rules="rules" label-position="left" :inline="true" :model="form" size="small" label-width="90px">
          <el-form-item label="渠道/店铺" prop="orderPlatform">
            <el-cascader
              ref="cascaderForChoose"
              v-model="form.orderPlatform"
              style="width: 380px"
              :options="options"
              :props="{ expandTrigger: 'hover', value: 'label', label: 'label', children: 'list' }"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="商品名" prop="orderName">
            <el-input v-model.trim="form.orderName" style="width: 380px" placeholder="请输入商品名称" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="商品ID" prop="productId">
            <el-input v-model.trim="form.productId" style="width: 380px" placeholder="请输入商品名称" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="标记选择" prop="tagName">
            <el-select v-model="form.tagName" placeholder="请选择" style="width: 380px" filterable>
              <el-option v-for="item in signLabelOption" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button class="btn_primary" :loading="editConfig.loading" @click="addTag()">添加</el-button>
            <el-button :loading="editConfig.loading" @click="clear()">重置</el-button>
          </el-form-item> -->
        </el-form>
        <!-- <div class="editConfigTitle">当前标记条件</div>
        <div class="editConfigTable">
          <el-table v-loading="editConfig.loading" :header-cell-style="{ background: '#f5f5f5' }" border :data="editConfig.tableData" style="width: 100%" :max-height="400">
            <el-table-column prop="orderPlatform" label="渠道" width="180" />
            <el-table-column prop="shopName" label="店铺" width="180" />
            <el-table-column prop="tagName" label="标记" width="180" />
            <el-table-column prop="productId" label="第三方商品ID" width="100" />
            <el-table-column prop="orderName" label="第三方商品名称" />
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="text" style="color: red" @click="delTag(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div> -->
      </div>
      <!-- <div slot="footer" class="editConfigFooter">
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
      </div> -->
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import {
  addPushOrderTag,
  getOrderTagList,
  editOrderTagModified,
  removeOrderTag,
  getTagStatus,
  getThirdShopSelect
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
      search: {
        tagName: '',
        orderPlatform: [],
        productId: '',
        shopId: '',
        orderName: ''
      },
      tableData: [],
      editConfig: {
        visible: false,
        title: '新增标记条件',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        tableData: [],
        total: 0
      },
      form: {
        orderPlatform: [], // 渠道店铺
        productId: '',
        shopName: '',
        id: '',
        tagName: '', // 标记名称
        orderName: '' // 商品名
      },
      getListLoading: false,
      getStatusLoading: false,
      pageSize: 10,
      pageIndex: 1,
      total: 1000,
      options: [],
      rules: {
        orderPlatform: [
          { required: true, type: 'array', message: '请选择渠道/店铺', trigger: 'change' }
        ],
        tagName: [
          { required: true, message: '请选择标记', trigger: 'change' }
        ],
        orderName: [
          { required: true, message: '请输入商品名', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请输入商品ID', trigger: 'blur' }
        ]
      },
      signLabelOption: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  computed: {},
  watch: {
    config: {
      handler(val) {
        if (val.visible) {
          this.search = { tagName: '' }
          this.init()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    clearSearch() {
      this.search = {
        tagName: '',
        orderPlatform: [],
        productId: '',
        shopId: '',
        orderName: ''
      }
      this.pageIndex = 1
      this.getList()
    },
    toEdit(row) {
      console.log(row)
      this.editConfig.visible = true
      this.editConfig.title = '编辑标记条件'
      this.form.orderPlatform = []
      this.form = {
        orderPlatform: [row.orderPlatform, row.shopName], // 渠道店铺
        productId: row.productId,
        shopName: row.shopName,
        id: row.id,
        tagName: row.tagName, // 标记名称
        orderName: row.orderName // 商品名
      }
    },
    deleteBj(row) {
      console.log(row)
      const test = '是否需要删除当前标记？'
      this.$confirm(test, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        removeOrderTag(params).then((res) => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
        }).catch(() => {
        })
      })
    },
    // 获取渠道/店铺筛选条件
    getOptions() {
      getThirdShopSelect().then(res => {
        this.options = res.data.reduce((pre, next) => {
          if (next.list && next.list.length > 0) {
            next.list.map(e => {
              e.label = e.shopName
            })
            pre.push({
              label: next.dictLabel,
              list: next.list
            })
          }
          return pre
        }, [])
        console.log('this.options', this.options)
        // this.options = res.data || []
      })
    },
    // 点击打开修改标记弹框
    openEditDialog() {
      this.editConfig = {
        visible: true,
        title: '新增标记条件',
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        tableData: [],
        total: 0
      }
      this.form = {}
      this.editGetList()
    },
    getShopIdByOrderplatform(array) {
      var shopId = ''
      this.options.some(item => {
        if (item.label === array[0]) {
          item.list.some(obj => {
            if (obj.shopName === array[1]) {
              shopId = obj.shopId
            }
          })
        }
      })
      return shopId
    },
    // 获取推送需要标记订单名称列表
    getList() {
      this.getListLoading = true
      var shopId = this.search.orderPlatform ? this.getShopIdByOrderplatform(this.search.orderPlatform) : ''
      const params = {
        tagName: this.search.tagName,
        productId: this.search.productId,
        orderPlatform: this.search.orderPlatform ? this.search.orderPlatform[0] : '',
        orderName: this.search.orderName,
        pageIndex: this.pageIndex,
        shopId: shopId,
        pageSize: this.pageSize
      }
      getOrderTagList(params).then(res => {
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
    searchFn () {
      this.pageIndex = 1
      this.getList()
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
        productId: this.form.productId,
        shopId: this.getShopIdByOrderplatform(this.form.orderPlatform),
        orderName: this.form.orderName,
        tagName: this.form.tagName,
        id: this.editConfig.title === '编辑标记条件' ? this.form.id : ''
      }
      this.editConfig.loading = true
      addPushOrderTag(data).then(res => {
        if (this.editConfig.title === '编辑标记条件') {
          this.$notify.success({ title: '提示', message: '编辑成功' })
        } else {
          this.$notify.success({ title: '提示', message: '添加成功' })
        }

        this.clear()
        this.getList()
        this.editConfig.visible = false
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

.bj-status-cls {
  padding: 20px;
  border-radius: 6px;
  background: #F5F9FF;
}

.channel-img {
  float: left;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}

.right-cls-btn {
  float: right;
}
.red-cls {
  color: #F53F3F;
}
</style>
