<template>
  <div class="page_wrap_promoter">
    <div class="dataOverView">
      <DataOverView />
    </div>
    <div class="table_wrap">
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
        checkbox
        @size-change="handleListSizeChange"
        @current-change="handleListCurrentChange"
        @handleSelectionChange="handleListSelectionChange"
      >
        <div slot="headerLeft">
          <div class="fl">
            <el-select
              v-model="search.auditStatus"
              class="w-140 m-r-10"
              placeholder="审核状态"
              size="small"
              clearable
            >
              <el-option label="未审核" :value="0" />
              <el-option label="审核通过" :value="1" />
              <el-option label="审核拒绝" :value="2" />
            </el-select>
            <el-input
              v-model="search.text.value"
              placeholder="请输入"
              class="w-350 input-with-select"
              size="small"
              clearable
            >
              <el-select
                slot="prepend"
                v-model="search.text.label"
                class="w-120"
                placeholder="请选择"
              >
                <el-option label="推广员姓名" value="realName" />
                <el-option label="推广员昵称" value="name" />
                <el-option label="推广员码" value="promoteCode" />
                <el-option label="推广员手机号" value="phone" />
              </el-select>
            </el-input>
            <el-date-picker
              v-model="search.time"
              class="m-l-20 w-250"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button
              class="m-l-10"
              type="primary"
              size="small"
              @click="getListBySearch"
              >搜索</el-button
            >
            <!-- <el-button class="m-l-10" size="small" @click="clearSearch">重置</el-button> -->
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
          <el-button
            v-permission="['web:promotePromoter:add', permsList]"
            type="primary"
            size="small"
            @click="openPromoterAdd()"
            >新增</el-button
          >
        </div>
        <div slot="action" slot-scope="{ row }">
          <el-button
            v-if="row.auditStatus !== 1"
            v-permission="['web:promotePromoter:edit', permsList]"
            type="text"
            @click="table_edit(row)"
            >编辑</el-button
          >
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-button
                v-permission="[
                  'web:promotePromoter:log,web:promotePromoter:remove',
                  permsList
                ]"
                type="text"
                class="m-l-10"
                >更多</el-button
              >
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="row.auditStatus === 1 && row.userStatus === 1"
                v-permission="['web:promotePromoter:remove', permsList]"
                @click.native="unavailable(row)"
                >失效</el-dropdown-item
              >
              <el-dropdown-item
                v-if="row.auditStatus === 1 && row.userStatus === 2"
                v-permission="['web:promotePromoter:remove', permsList]"
                @click.native="available(row)"
                >恢复正常</el-dropdown-item
              >
              <el-dropdown-item
                v-permission="['web:promotePromoter:log', permsList]"
                @click.native="openPromotionRecord(row)"
                >推广记录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div slot="name" slot-scope="{ row }" class="table-name">
          <AppAvatar :avatar="row.headImg" :name="row.name" :no-name="true" />
          <span>{{ row.name }}</span>
        </div>
        <div slot="footer">
          <el-dropdown
            type="primary"
            size="small"
            :disabled="multipleSelection.length === 0"
          >
            <el-button
              v-permission="['web:promotePromoter:edit', permsList]"
              type="primary"
              size="small"
              >批量审核<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="passPromoterBatch"
                >审核通过</el-dropdown-item
              >
              <el-dropdown-item @click.native="rejectPromoterBatch"
                >审核失败</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button type="danger" size="small" :disabled="multipleSelection.length === 0">批量审核</el-button> -->
        </div>
      </MPageLayout>

      <!-- 新增推广员弹框 -->
      <el-dialog
        :before-close="promoterhandleClose"
        :visible.sync="promoterDialog.visible"
        width="500px"
        append-to-body
      >
        <span slot="title">新增</span>
        <div>
          <el-form
            ref="promoterForm"
            :model="promoterDialog.form"
            label-width="80px"
            :rules="promoterRule"
          >
            <el-form-item label="手机" prop="phone">
              <el-input v-model="promoterDialog.form.phone" />
            </el-form-item>
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="promoterDialog.form.realName" />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :loading="promoterDialog.loading"
            @click="promoterAdd"
            >保存</el-button
          >
        </span>
      </el-dialog>

      <!-- 编辑审核弹框 -->
      <el-dialog
        :before-close="checkhandleClose"
        :visible.sync="checkDialog.visible"
        width="700px"
        append-to-body
      >
        <span slot="title">编辑</span>
        <div>
          <el-form
            ref="checkForm"
            :model="checkDialog.form"
            label-width="90px"
            :rules="promoterEditRule"
          >
            <el-form-item label="推广员码" prop="promoteCode">
              <span>{{ checkDialog.form.promoteCode }}</span>
            </el-form-item>
            <el-form-item label="推广员" prop="promoter">
              <div class="fl" style="justify-content: center">
                <AppAvatar
                  :avatar="checkDialog.form.headImg"
                  :name="checkDialog.form.name"
                  :no-name="true"
                  :width="40"
                />
                <span class="m-l-10">{{ checkDialog.form.name }}</span>
              </div>
            </el-form-item>
            <el-form-item label="绑定手机号" prop="phone">
              <span>{{ checkDialog.form.phone }}</span>
            </el-form-item>
            <el-form-item label="加入时间" prop="createTime">
              <span>{{ checkDialog.form.createTime | filterDate }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input
                v-model="checkDialog.form.realName"
                placeholder="请输入姓名"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="状态" prop="auditStatus">
              <el-radio-group v-model="checkDialog.form.auditStatus">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="2">审核失败</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="原因" prop="auditRemark">
              <el-input
                v-model="checkDialog.form.auditRemark"
                type="textarea"
                :rows="7"
                placeholder="审核失败必填"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            :loading="checkDialog.loading"
            @click="edit_save()"
            >保存</el-button
          >
        </span>
      </el-dialog>

      <el-drawer
        :visible.sync="promoteListDrawer.visible"
        direction="rtl"
        size="900px"
        append-to-body
      >
        <span slot="title">推广记录</span>
        <div class="promoteList_drawer_content">
          <!-- 筛选栏 -->
          <div>
            <el-date-picker
              v-model="promoteListDrawer.time"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button
              class="m-l-10"
              size="small"
              @click="getPromoteRecordPage()"
              >搜索</el-button
            >
          </div>
          <div
            v-loading="promoteListDrawer.loading"
            class="m-t-20 promoteList_drawer_content_table"
          >
            <el-table :data="promoteListDrawer.data" border>
              <el-table-column prop="orderNo" label="订单号" />
              <el-table-column prop="createTime" label="交易时间">
                <template slot-scope="{ row }">
                  {{ row.createTime | filterDate }}
                </template>
              </el-table-column>
              <el-table-column prop="name" label="购买用户" />
              <el-table-column prop="goodsNum" label="商品数" />
              <el-table-column prop="payerTotal" label="订单金额">
                <template slot-scope="{ row }">
                  {{ row.payerTotal | filtersMoney }}
                </template>
              </el-table-column>
              <el-table-column prop="orderStatus" label="订单状态">
                <template slot-scope="{ row }">
                  {{
                    {
                      1: '未支付',
                      2: '支付成功',
                      3: '超时已关闭',
                      4: '用户已取消',
                      5: '退款中',
                      6: '部分退款',
                      7: '全部退款',
                      8: '退款异常'
                    }[row.orderStatus]
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="afterStatus" label="售后状态">
                <template slot-scope="{ row }">
                  {{
                    {
                      1: '可申请',
                      2: '申请中',
                      3: '已完成',
                      4: '用户关闭',
                      5: '超时关闭'
                    }[row.afterStatus]
                  }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="m-t-20 p-b-20">
            <el-pagination
              :current-page="promoteListDrawer.current"
              :page-sizes="[10, 20, 50, 200]"
              :page-size="promoteListDrawer.size"
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="promoteListDrawer.total"
              @size-change="promoteDrawerhandleSizeChange"
              @current-change="romoteDrawerhandleCurrentChange"
            />
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import DataOverView from './dataOverview.vue'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import {
  promoterPage,
  addPromoter,
  passPromoter,
  rejectPromoter,
  availablePromoter,
  unavailablePropter,
  rejectPromoterBatch,
  passPromoterBatch,
  getPromoteRecordPage
} from '@/api/promotion/promoter'
import { getColumns } from './columns/promoter'
export default {
  nmae: 'Promoter',
  components: {
    DataOverView,
    AppAvatar
  },
  data() {
    var checkAuditRemark = (rule, value, callback) => {
      if (!value && this.checkDialog.form.auditStatus === 2) {
        return callback(new Error('请输入原因'))
      } else {
        callback()
      }
    }
    var checkAuditStatus = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择审核状态'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      search: {
        text: { label: 'realName', value: '' },
        time: ['', ''],
        auditStatus: ''
      },
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'name', 'footer'],
      config: {
        tableData: [],
        tableColumns: getColumns(),
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      // 新增推广员弹框
      promoterDialog: {
        visible: false,
        form: {},
        loading: false
      },
      // 新增推广员弹框检验
      promoterRule: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      // 编辑审核
      checkDialog: {
        visible: false,
        form: {
          promoteCode: '',
          phone: '',
          createTime: '',
          headImg: '',
          id: '',
          realName: '',
          name: '',
          auditStatus: 1, // 1: 审核通过 2：审核失败
          auditRemark: ''
        }
      },
      promoterEditRule: {
        auditStatus: [
          { required: true, validator: checkAuditStatus, trigger: 'blur' }
        ],
        auditRemark: [{ validator: checkAuditRemark, trigger: 'blur' }]
      },
      // 单个推广员列表
      promoteListDrawer: {
        visible: false,
        data: [],
        current: 1,
        total: 0,
        size: 10,
        loading: false,
        time: ['', ''],
        phone: ''
      },
      permsList: this.$route.meta.permsList || []
    }
  },
  mounted() {
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', res => {
      console.log(res)
      localStorage.setItem(
        'promoter_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    })
    this.getList()
  },
  methods: {
    // 重置搜索条件
    clearSearch() {
      this.search = {
        text: { label: 'realName', value: '' },
        time: ['', ''],
        auditStatus: ''
      }
      this.config.current = 1
      this.getList()
    },
    getListBySearch() {
      this.config.currentPage = 1
      this.getList()
    },
    // 获取列表数据
    async getList() {
      this.loading = true
      const params = {
        current: this.config.currentPage,
        size: this.config.pageSize,
        startTime: this.search.time ? this.search.time[0] : '',
        endTime: this.search.time ? this.search.time[1] : '',
        [this.search.text.label]: this.search.text.value,
        auditStatus: this.search.auditStatus
      }
      const { data } = await promoterPage(params)
      this.config.tableData = data.records
      this.config.total = data.total
      this.loading = false
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter(v => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem(
        'promoter_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.forEach(v => {
        v.visible = true
      })
      localStorage.setItem(
        'promoter_tableColumns',
        JSON.stringify(this.config.tableColumns)
      )
    },
    // 点击重置按钮
    clear() {
      const tableColumns = getColumns()
      this.config.tableColumns = tableColumns
      localStorage.setItem(
        'promoter_tableColumns',
        JSON.stringify(tableColumns)
      )
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
    // 关闭新增弹框
    promoterhandleClose(done) {
      this.promoterDialog.form = {
        phone: '',
        name: ''
      }
      this.$refs.promoterForm.clearValidate()
      done()
    },
    checkhandleClose(done) {
      this.$refs.checkForm.clearValidate()
      done()
    },

    /** 推广员抽屉方法 */
    promoteDrawerhandleSizeChange(val) {
      this.promoteListDrawer.current = 1
      this.promoteListDrawer.size = val
      this.getPromoteRecordPage()
    },
    romoteDrawerhandleCurrentChange(val) {
      this.promoteListDrawer.current = val
      this.getPromoteRecordPage()
    },
    /** 推广员抽屉方法结束 */

    /** 推广员新增 */
    // 新增打开弹框
    openPromoterAdd() {
      this.promoterDialog.form = {
        phone: '',
        name: ''
      }
      this.$refs.promoterForm && this.$refs.promoterForm.clearValidate()
      this.promoterDialog.visible = true
    },
    // 新增保存
    promoterAdd() {
      this.$refs.promoterForm.validate(valid => {
        if (valid) {
          this.promoterDialog.loading = true
          const data = {
            phone: this.promoterDialog.form.phone,
            realName: this.promoterDialog.form.realName
          }
          addPromoter(data)
            .then(res => {
              // console.log(res)
              this.promoterDialog.visible = false
              this.getList()
              this.promoterDialog.loading = false
            })
            .catch(() => {
              this.promoterDialog.loading = false
            })
        } else {
          return false
        }
      })
    },
    /** 推广员新增结束 */

    /** 推广员编辑 */
    // 打开编辑弹框
    table_edit(row) {
      this.checkDialog = {
        visible: true,
        form: JSON.parse(JSON.stringify(row))
      }
      this.$refs.checkForm && this.$refs.checkForm.clearValidate()
    },
    // 编辑弹框点击保存
    edit_save() {
      this.$refs.checkForm.validate(async valid => {
        if (valid) {
          console.log(valid)
          try {
            this.checkDialog.loading = true
            const data = {
              auditRemark: this.checkDialog.form.auditRemark,
              id: this.checkDialog.form.id,
              realName: this.checkDialog.form.realName
            }
            this.checkDialog.form.auditStatus === 1
              ? await passPromoter(data)
              : await rejectPromoter(data)
            this.checkDialog.visible = false
            this.$notify.success({ title: '提示', message: '操作成功' })
            this.getList()
            this.checkDialog.loading = false
          } catch (err) {
            console.log(err)
            this.checkDialog.loading = false
          }
          // this.promoterDialog.loading = true
          // const data = {
          //   phone: this.promoterDialog.form.phone,
          //   realName: this.promoterDialog.form.realName
          // }
          // addPromoter(data).then(res => {
          //   // console.log(res)
          //   this.promoterDialog.visible = false
          //   this.getList()
          //   this.promoterDialog.loading = false
          // }).catch(() => {
          //   this.promoterDialog.loading = false
          // })
        } else {
          return false
        }
      })
    },
    // 推广员审核批量通过
    passPromoterBatch() {
      console.log(this.multipleSelection)
      this.loading = true
      const data = []
      this.multipleSelection.forEach(v => {
        data.push({
          id: v.id,
          realName: v.name
        })
      })
      passPromoterBatch({ auditList: data })
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 推广员审核批量拒绝
    rejectPromoterBatch() {
      console.log(this.multipleSelection)

      this.$prompt('请输入原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{1,200}$/,
        inputErrorMessage: '请输入200字内的原因',
        closeOnClickModal: false
      })
        .then(({ value }) => {
          const data = []
          this.multipleSelection.forEach(v => {
            data.push({
              id: v.id,
              realName: v.name,
              auditRemark: value
            })
          })
          rejectPromoterBatch({ auditList: data })
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '您已取消' })
        })
    },
    /** 推广员编辑结束 */

    /** 更多-失效 */
    unavailable(row) {
      this.$delModal({
        tips: '确定要失效推广员身份?请谨慎操作,失效后推广员不能再进入推广页面!',
        success: () => {
          this.loading = true
          unavailablePropter(row.id)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    /** 更多-恢复正常 */
    available(row) {
      this.$delModal({
        tips: '确定恢复该推广员?',
        success: () => {
          this.loading = true
          availablePromoter(row.id)
            .then(res => {
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    /** 更多-推广记录 */
    openPromotionRecord(row) {
      console.log(row, 'row')
      this.promoteListDrawer = {
        visible: true,
        data: [],
        current: 1,
        total: 0,
        size: 10,
        loading: false,
        time: ['', ''],
        phone: row.phone,
        promoteCode: row.promoteCode
      }
      this.getPromoteRecordPage()
    },
    // 获取推广员推广记录
    getPromoteRecordPage() {
      this.promoteListDrawer.loading = true
      const { time, phone, current, size } = this.promoteListDrawer
      const params = {
        current,
        endTime: time ? time[1] : '',
        phone: phone,
        size,
        startTime: time ? time[0] : ''
      }
      getPromoteRecordPage(params)
        .then(res => {
          console.log(res, '获取推广记录')
          this.$set(this.promoteListDrawer, 'data', res.data.records)
          this.$set(this.promoteListDrawer, 'total', res.data.total)
          this.$set(this.promoteListDrawer, 'loading', false)
          // this.promoteListDrawer.data = res.data.records
          // this.promoteListDrawer.total = res.data.total
          // this.promoteListDrawer.loading = false
        })
        .catch(() => {
          this.promoteListDrawer.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.page_wrap_promoter {
  height: 100%;
  min-width: 1000px;
  // background: #fff;
  .dataOverView {
    height: 200px;
    background: #fff;
  }
  .table_wrap {
    margin-top: 10px;
    height: calc(100% - 200px - #{$historyHeight} - 40px);
    background: #fff;
  }
}
.promoteList_drawer_content {
  height: 100%;
  padding: 20px;
}
.table-name {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
</style>
