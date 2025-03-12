<template>
  <!-- 用户跟进 -->
  <div>
    <div class="p-20">
      <el-table v-loading="loading" :data="tableData" border height="400px">
        <el-table-column prop="createTime" label="跟进时间" />
        <el-table-column prop="content" label="跟进内容" />
        <el-table-column prop="createBy" label="跟进人" />
        <el-table-column prop="followType" label="跟进方式">
          <template slot-scope="{ row }">
            {{ {1: '电话', 2: '微信', 3: '站内'}[row.followType] }}
          </template>
        </el-table-column>
        <el-table-column prop="nextFollowTime" label="下次跟进" />
      </el-table>

      <div class="m-t-20 clearfix">
        <div style="float:left">
          <el-button type="primary" :loading="modal.loading" @click="openAddModal">新增</el-button>
        </div>
        <div style="float:right">
          <el-pagination
            background
            :current-page="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <div slot="footer" />
    <AppDialog
      v-model="modal.visible"
      :title="modal.title"
      width="700px"
      height="400px"
      @success="addUserFollow"
    >
      <div v-loading="modal.loading" class="choose_resource m-t-20 p-10">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="跟进内容" prop="content">
            <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" />
          </el-form-item>
          <el-form-item label="跟进方式">
            <el-select v-model="form.followType" placeholder="请选择">
              <el-option label="电话" :value="1" />
              <el-option label="微信" :value="2" />
              <el-option label="站内" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="下次跟进">
            <el-date-picker
              v-model="form.nextFollowTime"
              :picker-options="DatePicker"
              type="datetime"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { userFollow, addFollowByOrderNo } from '@/api/user/member'
export default {
  components: {
    AppDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderNo: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      tableData: [],
      currentPage: 1,
      total: 0,
      search: '',
      modal: {
        visible: false,
        title: '新增',
        loading: false
      },
      form: {
        content: '',
        userId: '',
        nextFollowTime: '',
        followType: 1
      },
      rules: {
        content: [
          { required: true, message: '请输入跟进内容', trigger: 'blur' }
        ]
      },
      DatePicker: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    }
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          this.getList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    init() {
      this.current = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.pageSize,
        orderNo: this.orderNo,
        followClassify: 2
        // userId: this.$route.params.id
      }
      userFollow(params).then(res => {
        this.loading = false
        console.log(res, '获取跟进记录')
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch(() => {
        this.loading = false
      })
    },
    addUserFollow() {
      console.log('点击确认按钮')
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.modal.loading = true
          addFollowByOrderNo(this.form).then(res => {
            this.modal.loading = false
            this.modal.visible = false
            this.$notify.success({
              title: '提示',
              message: '提交成功'
            })
            this.getList()
          }).catch(() => {
            this.modal.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 打开新增跟进记录弹框
    openAddModal() {
      console.log('打开弹框')
      this.form = {
        content: '',
        followType: 1,
        nextFollowTime: '',
        orderNo: this.orderNo,
        userId: ''
      }
      this.modal.visible = true
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
