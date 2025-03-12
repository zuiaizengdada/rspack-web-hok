<template>
  <AppDialog
    v-if="visible"
    v-model="visible"
    title="新增空降学员"
    width="1100px"
    :loading="loading"
    top="50px"
    height="auto"
    @success="commit"
  >
    <div class="dialog-container">
      <div class="dialog-header">
        <div v-if="detail.goodsName" class="dialog-item">
          <span class="label">课程名称：</span>
          <span>{{ detail.goodsName }}</span>
        </div>
        <div v-else class="dialog-item">
          <span class="label">课程名称：</span>
          <div class="autoHeight">
            <el-tag
              v-for="item in detail.goodsNameList"
              :key="item"
              class="tagStype"
              type="info"
            >
              {{ item }}
            </el-tag>
          </div>
        </div>
        <div class="dialog-item">
          <span class="label">当前班期：</span>
          <span>{{ detail.scheduleNum }}</span>
        </div>
        <div class="dialog-item">
          <span class="label">班期容纳人数：</span>
          <span>{{ detail.capacity }}</span>
          <span
            class="tips"
          >新增空降学员后实际入班人数大于容纳人数时将自动新增容纳人数</span>
        </div>
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="rules"
        size="small"
      >
        <el-form-item label="班主任" prop="headTeacherId">
          <el-select
            v-model="form.headTeacherId"
            placeholder="请选择"
            style="width: 240px"
          >
            <el-option
              v-for="item in detail.scheduleHeadteacherVoList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="添加学员">
          <el-input v-model.trim="form.value" style="width: 240px" clearable>
            <el-select
              slot="prepend"
              v-model="form.key"
              style="width: 90px"
              placeholder="请选择"
            >
              <el-option label="电话" value="userPhone" />
              <el-option label="姓名" value="userName" />
              <el-option label="订单号" value="orderNo" />
              <el-option label="邮箱号" value="email" />
            </el-select>
          </el-input>
          <el-button
            type="primary"
            :loading="loading"
            class="m-l-10"
            @click="handleClickSearch"
          >查 询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <div class="dialog-content">
          <dynamicTable
            ref="table"
            v-model="tableData"
            :columns="columns"
            size="mini"
            :config-props="{
              layout: 'prev, pager, next'
            }"
            row-key="deliveryId"
            checkbox
            :get-list-api="getList"
            immediate-check
            @selectionChange="selectionChange"
          >
            <template slot="userPhone" slot-scope="{ row }">
              <watchPhoneNumber
                :phone-area-code="row.phoneAreaCode"
                :default-value="row.userPhone"
                :user-id="row.userId"
              />
            </template>
            <template slot="email" slot-scope="{ row }">
              <tableEmailItem
                v-model="row.email"
                :row-data="{ userId: row.userId }"
                type="user"
              />
            </template>
          </dynamicTable>
          <div class="table-check-container">
            <div class="table-check-header">
              已选学员({{ selectStudent.length }})
            </div>
            <div v-for="(item, index) in selectStudent" :key="item.deliveryId">
              <div class="table-check-content">
                <div class="table-check-item">
                  <div class="flex">
                    <div>{{ item.userName }}</div>
                    <div v-if="item.userPhone" class="flex">
                      （<watchPhoneNumber
                        :phone-area-code="item.phoneAreaCode"
                        :default-value="item.userPhone"
                        :user-id="item.userId"
                      />）
                    </div>
                    <div v-if="item.email&&!item.userPhone" class="flex">
                      （<tableEmailItem
                        v-model="item.email"
                        :row-data="{ userId: item.userId }"
                        type="user"
                      />）
                    </div>
                  </div>
                  <i
                    class="el-icon-close pointer"
                    @click="deleteSelectStudent(item, index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="table-bottom-text">
          以上学员均在当前课程下，且学员交付状态为待交付/延期交付"
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import dynamicTable from '@/components/DynamicTable/table'
import {
  getDeliveryScheduleDetail,
  getAirborneStudentPageAjax,
  addAirborneStudentAjax
} from '@/api/deliver/scheduleManagement'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import tableEmailItem from '@/components/AppTemplate/tableEmailItem'

export default {
  components: {
    AppDialog,
    dynamicTable,
    tableEmailItem,
    watchPhoneNumber
  },
  data() {
    return {
      form: {
        value: '',
        key: 'userPhone',
        headTeacherId: ''
      },
      visible: false,
      tableData: [],
      loading: false,
      innerVisible: false,
      columns: [
        { prop: 'userName', label: '学员姓名', type: 'text' },
        { prop: 'userPhone', label: '学员电话', type: 'slot', width: '160px' },
        { prop: 'email', label: '学员邮箱', type: 'slot', width: '170px' },
        { prop: 'orderNo', label: '订单号', type: 'text' }
      ],
      current: {},
      goodsId: '',
      detail: {
        capacity: '', // 容纳人数
        scheduleNum: '', // 班期数
        scheduleHeadteacherVoList: [] // 班主任列表
      }, // 班期详情
      selectStudent: [], // 已选中学员
      rules: {
        headTeacherId: [
          { required: true, message: '请选择班主任', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    visible(newV) {
      if (!newV) {
        this.selectStudent = []
        this.$refs.table && this.$refs.table.toggleSelection()
        this.resetForm()
      }
    }
  },
  methods: {
    open(row) {
      console.log(row)
      this.visible = true
      this.current = row
      this.getAirborneStudentPage()
      this.getDetail()
    },
    handleAdd() {
      this.innerVisible = true
    },
    // 获取班期详情
    getDetail() {
      getDeliveryScheduleDetail(this.current.scheduleId).then(res => {
        this.detail = {
          ...res.data
        }
      })
    },
    // 获取空降学员列表
    getAirborneStudentPage() {
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.onRefresh()
      })
    },
    getList(params) {
      const data = {
        scheduleId: this.current.id,
        goodsId: this.current.goodsId,
        size: params.pageSize,
        current: params.pageIndex,
        ...params
      }
      delete data.pageSize
      delete data.pageIndex
      return getAirborneStudentPageAjax(data).then(res => {
        res.data.items = res.data.records || []
        this.loading = false
        return res
      })
    },
    // 学员列表选择项
    selectionChange(val) {
      this.selectStudent = val
    },
    // 删除
    deleteSelectStudent(item, index) {
      const detIndex = this.selectStudent.indexOf(index)
      this.selectStudent.splice(detIndex, 1)
      this.$refs.table.toggleSelection([item])
    },
    // 确定
    commit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.selectStudent.length === 0) {
            return this.$message.error('请先添加学员！')
          }
          const deliveryIds = this.selectStudent.map(item => item.deliveryId)
          const { goodsId, scheduleId } = this.current
          const headTeacherId = this.form.headTeacherId
          const data = {
            deliveryIds,
            goodsId,
            headTeacherId,
            scheduleId
          }
          this.loading = true
          addAirborneStudentAjax(data)
            .then(res => {
              this.loading = false
              this.visible = false
              this.$emit('addAirborneStudentSuccess')
              this.$notify.success({ title: '提示', message: '操作成功' })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 重置表单
    resetForm() {
      this.form = {
        value: '',
        key: 'userPhone',
        headTeacherId: ''
      }
      this.$refs.form && this.$refs.form.resetFields()
    },
    handleClickSearch() {
      const query = { pageIndex: 1 }
      query[this.form.key] = this.form.value
      this.$refs.table.onRefresh(query)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container ::v-deep {
  display: flex;
  flex-direction: column;
  // height: 100%;
  min-height: 720px;
  max-height: 820px;
  .filter-container {
    padding: 0 0 0 20px;
  }
  .table_container {
    flex: 1;
  }
  .dialog-header {
    display: flex;
    flex-direction: column;
    // height: 78px;
    background: #f7fbff;
    border-radius: 8px;
    justify-content: center;
    margin: 20px;
    padding: 10px;
    .dialog-item {
      font-size: 14px;
      color: #333333;
      display: flex;
      align-items: center;
      .label {
        width: 120px;
        min-width: 120px;
        text-align: right;
        font-size: 16px;
        color: #777777;
      }
      .tips {
        font-size: 12px;
        margin-left: 10px;
        color: #777777;
      }
    }
  }
  .dialog-content {
    display: flex;
    height: 480px;
    .table-check-container {
      flex: 0.5;
      border-radius: 8px;
      border: 1px solid #e7e7e7;
      margin: 0 20px 0 17px;
      .table-check-header {
        font-size: 14px;
        color: #777777;
        background: #f3f3f3;
        padding: 7px 0;
        text-align: center;
        font-weight: 500;
      }
      .table-check-content {
        display: flex;
      }
      .table-check-item {
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        width: 100%;
        border-bottom: 1px solid #e7e7e7;
      }
    }
  }
  .el-table__header-wrapper {
    height: 36px;
    .el-table__cell {
      padding: 7px 0;
    }
  }
  .table_container {
    width: 437px;
    border-radius: 8px;
    border: 1px solid #e7e7e7;
    margin-left: 80px;
    .my-table {
      margin: 0px;
    }
  }

  .tagStype {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  .table-bottom-text {
    color: #777777;
    font-size: 12px;
    margin-left: 80px;
    padding: 5px 0;
  }
}

.autoHeight {
  max-height: 132px;
  overflow: auto;
}
</style>
