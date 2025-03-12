<template>
  <div class="offlineTable">
    <div v-if="dataType === 2" class="offlineTableHeader">
      <div class="offlineTableHeaderTitle">数据类型：线下表格</div>
      <div class="offlineTableTips" @click="downUrl">下载模板</div>
    </div>
    <el-form
      ref="form"
      label-width="90px"
      style="margin-top: 20px"
      :model="form"
      :rules="rules"
      :validate-on-change="false"
    >
      <el-form-item label="AI外呼" prop="callId">
        <el-select
          v-model="form.callId"
          filterable
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option
            v-for="item in callTaskOptions"
            :key="item.id"
            :disabled="item.status === 2"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="短信模板" prop="smsActionId">
        <smsMsgTemplate
          v-model="form.smsActionId"
          :sms-signature-id.sync="form.smsSignatureId"
          :sms-signature-name.sync="form.smsSignatureName"
          :sms-msg="form.title"
          @update="changeSmsTem"
        />
      </el-form-item>
    </el-form>
    <template v-if="dataType === 2">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="#"
        :limit="1"
        accept=".xlsx,.xls"
        :before-upload="beforeUpload"
        :http-request="onChangeRadio"
        :show-file-list="false"
      >
        <el-button
          slot="trigger"
          class="m-l-20"
          size="small"
          style="width: 104px; margin-top: 0px; margin-bottom: 21px"
          >上传表格</el-button
        >
      </el-upload>
      <div class="file-list-box">
        <div v-if="fileListStatus.status" class="file-list">
          <svg-icon icon-class="mar" class="marIcon" />
          <div class="fileName text_hidden_1">
            <el-tag
              v-if="fileListStatus.status === 3"
              class="m-r-10"
              size="mini"
              type="danger"
            >
              (上传失败)
            </el-tag>
            <span class="fileNamevalue text_hidden_1">
              {{ fileListStatus.name }}
            </span>
          </div>
          <span
            class="authProgress"
            :style="{ width: `${fileListStatus.authProgress}%` }"
          />
        </div>
      </div>
      <div class="tableBorderBox">
        <div class="tableBorder">
          <el-table
            v-loading="loading"
            class="tableBorder"
            style="width: 100%"
            height="100%"
            :data="tableData"
            :header-cell-style="{ background: '#F2F9FF' }"
          >
            <el-table-column prop="userName" label="客户姓名" />
            <el-table-column prop="userPhone" label="手机号码" />
            <el-table-column prop="goodsName" label="购买商品" />
            <el-table-column prop="userIntention" label="客户意向" />
            <el-table-column prop="createTime" label="上传时间" />
            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button type="text" style="color: #f53f3f" @click="del(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          class="pagination"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <template v-if="dataType === 4">
      <div
        class="el-form-item is-required el-form-item--medium"
        style="margin-bottom: 0px; margin-left: 20px"
      >
        <label class="el-form-item__label">线索接量方式</label>
      </div>
      <clueTable ref="clueTable" />
    </template>
    <div class="drawer__footer">
      <el-button size="small" :loading="loading" @click="onhandleBackStep"
        >上一步</el-button
      >
      <el-button
        :loading="loading"
        type="primary"
        size="small"
        @click="handleNextStep"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  getSaleTaskOfflinePage,
  saleTaskOfflineImport,
  deleteSaleTaskOffline
} from '@/api/privateArea/CRM'
import { callList } from '@/api/privateArea/toolbox'
import smsMsgTemplate from '../smsMsgTemplate'
import { getChannelSignaturePageV2 } from '@/api/system/sms'
import clueTable from '../clueTable/index'
// import { uploadFile } from '@/api/file'
// import { downLink } from '@/utils/index'
import axios from 'axios'
export default {
  components: {
    smsMsgTemplate,
    clueTable
  },
  props: {
    taskObjective: {
      type: Number,
      default: 1
    },
    taskId: {
      type: String,
      default: ''
    },
    dataType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      fileListStatus: {
        status: 0, // 0 无上传数据 1. 上传中 2.上传成功 3.上传失败
        name: '', // 文件名称
        authProgress: 0, // 上传进度
        source: null // 请求缓存
      },
      CancelToken: axios.CancelToken,
      // rules: {
      //   callId: [
      //     { required: true, message: '请选择AI外呼', trigger: 'change' }
      //   ],
      //   smsSignatureId: [
      //     { required: true, message: '请选择签名', trigger: 'change' }
      //   ],
      //   smsActionId: [
      //     { required: true, message: '请选择短信模板', trigger: 'blur' }
      //   ]
      // },
      form: {
        title: '',
        smsActionId: '',
        callId: '',
        smsSignatureId: '',
        smsSignatureName: '',
        id: undefined
      },
      callTaskOptions: [],
      signOptions: []
    }
  },
  computed: {
    rules() {
      return {
        callId: [
          {
            required: this.taskObjective === 1 ? true : false,
            message: '请选择AI外呼',
            trigger: 'change'
          }
        ],
        smsSignatureId: [
          { required: true, message: '请选择签名', trigger: 'change' }
        ],
        smsActionId: [
          {
            required: this.dataType === 4 ? true : false,
            message: '请选择短信模板',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    taskId: {
      handler(val) {
        val && this.getList()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.currentPage = 1
    this.taskId && this.getList()
    this.getCallTask()
    this.getSignOptions()
  },
  methods: {
    setData(form = {}) {
      this.currentPage = 1
      this.form = form
      this.getList()
      this.getCallTask()
      this.getSignOptions()
      if (this.dataType === 4) {
        this.$refs.clueTable.form.taskId = form.id
        this.$refs.clueTable.search()
      }
    },
    del(row) {
      this.loading = true
      deleteSaleTaskOffline(row.id)
        .then(res => {
          this.loading = false
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    async getSignOptions() {
      const { data } = await getChannelSignaturePageV2()
      this.signOptions = data ?? []
    },
    handleChangeSmsSignature(val) {
      const data = this.signOptions.find(i => i.id === val)
      this.form.smsSignatureName = data?.signatureName ?? ''
    },
    async getCallTask() {
      const { data } = await callList()
      this.callTaskOptions = data
    },
    changeSmsTem() {
      this.$refs.form.validateField('smsActionId')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.taskId,
        addFlag: true
      }
      getSaleTaskOfflinePage(data)
        .then(res => {
          this.tableData = res.data.items
          this.total = res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    beforeUpload(file) {
      console.log(file)
      // 限制上传文件大小 500M
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      return isLt50M
    },
    onChangeRadio(e) {
      this.$refs.upload && this.$refs.upload.clearFiles()
      // 上传文件
      const selectFile = e.file
      if (!selectFile) {
        alert('请先选择需要上传的文件!')
        return
      }
      this.fileListStatus = {
        status: 1,
        name: selectFile.name,
        authProgress: 0,
        source: this.CancelToken.source()
      }
      const formData = new FormData()
      formData.append('file', selectFile)
      saleTaskOfflineImport(
        formData,
        progressEvent => {
          const Progress =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0
          if (Progress === 100) {
            this.fileListStatus.authProgress = 99
          } else {
            this.fileListStatus.authProgress = Progress
          }
        },
        this.fileListStatus.source.token
      )
        .then(res => {
          // this.form.url = res.data.url
          // this.form.fileName = selectFile.name
          // this.taskId = res.data
          this.$emit('taskIdChange', res.data)
          this.fileListStatus.authProgress = 100
          this.fileListStatus.status = 2
          console.log('成功', res)
          // this.getList()
          this.$refs.upload.clearFiles()
        })
        .catch(() => {
          this.$refs.upload.clearFiles()
          this.fileListStatus.name = selectFile.name
          this.fileListStatus.status = 3
        })
    },
    downUrl() {
      window.location = 'https://oss.hokkj.cn/智能销售线下表格模板.xls'
    },
    onhandleBackStep() {
      this.$emit('backStep')
    },
    handleNextStep() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.$refs.clueTable) {
            const taskId = this.$refs.clueTable.form.taskId
            this.form.id = taskId
            if (!this.$refs.clueTable.tableData.length) {
              this.$message.error('线索接量方式不能为空')
              return
            }
          }

          this.$emit('nextStep', this.form)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.offlineTable {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .offlineTableHeader {
    display: flex;
    align-items: center;
    padding: 20px;
    margin-left: 20px;
    margin-right: 20px;
    background: #f2f9ff;
    border-radius: 8px;
    .offlineTableHeaderTitle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
    .offlineTableTips {
      margin-left: 20px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0c6fff;
      line-height: 22px;
      cursor: pointer;
    }
  }
  .tableBorderBox {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
    flex: 1 0 0;
    border-radius: 6px;
    border: 1px solid #cbcfd3;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .tableBorder {
      flex: 1 0 0;
      height: 200px;
    }
    .pagination {
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
.drawer__footer {
  border-top: 1px solid #e7e7e7;
  padding: 12px 21px;
  text-align: left;
  margin-top: 10px;
}
.file-list-box {
  padding: 0 20px;
  width: 100%;
  .file-list {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 44px;
    border-radius: 4px;
    border: 1px solid #eff2f6;
    padding: 0 20px;
    position: relative;
    .marIcon {
      z-index: 2;
      font-size: 24px;
      margin-right: 12px;
    }
    .fileName {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      width: 460px;
      z-index: 2;
      display: flex;
      align-items: center;
      .fileNamevalue {
        display: inline-block;
        max-width: 300px;
      }
    }
    .file-list-del {
      cursor: pointer;
      z-index: 2;
      .el-icon-error {
        color: #999999;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
</style>
