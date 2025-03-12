<!-- 新增 -->
<template>
  <el-dialog
    :title="row.ifEdit ? '修改' : '新增'"
    :visible.sync="visible"
    width="583px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="120px"
    >
      <el-form-item label="文件名称" prop="fileName">
        <el-input v-model="form.fileName" clearable placeholder="请输入" />
      </el-form-item>
      <el-form-item label="关联公司" class="form-item" prop="companyId">
        <el-select
          v-model="form.companyId"
          clearable
          @change="entryCompanyIdChange"
          filterable
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联部门" prop="deptIdList">
        <!-- <el-input
          :value="form.deptChainNameList"
          style="width: calc(100% - 78px)"
          :disabled="true"
        />
        <el-button style="width: 68px" class="m-l-10" @click="selectDept"
          >选择</el-button
        > -->
        <el-cascader
          ref="cascader1"
          v-model="form.deptIdList"
          style="width: 100%"
          :options="deptTreeArray"
          :props="{ multiple: true, emitPath: false, checkStrictly: true }"
          clearable
        />
      </el-form-item>
      <el-form-item label="关联岗位" class="form-item" prop="positionIdList">
        <!-- 岗位 -->
        <el-select
          v-model="form.positionIdList"
          clearable
          multiple
          filterable
          placeholder="请选择岗位"
          style="width: 100%"
        >
          <el-option
            v-for="item in jobList"
            :key="item.jobId"
            :label="item.jobName"
            :value="item.jobId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="关联公章" class="form-item" prop="electronicSealId">
        <el-select
          v-model="form.electronicSealId"
          clearable
          filterable
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="item in electronicSealList"
            :key="item.id"
            :label="item.sealName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="form-item" label="员工是否可下载" prop="canDownload">
        <el-radio-group v-model="form.canDownload">
          <el-radio
            v-for="item in canDownloadOption"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传文件" class="form-item" prop="fileUrl">
        <el-upload
          ref="uploadFile"
          class="upload-demo"
          action="#"
          :before-upload="beforeUpload"
          :limit="1"
          :multiple="false"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="onChangeFile"
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传pdf格式文件,大小不能超过10M,过多数据请分批上传。
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" :loading="loading">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading"
        >确 定</el-button
      >
      <el-button
        type="primary"
        @click="submit('next')"
        v-if="!row.ifEdit"
        :loading="loading"
        >下一步</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { jobNoPageList } from '@/views/system/positionManagement/api/job'
import { getCompanyListAjax } from '@/api/businessAdmin/talentFile'
import { addOrUpdateAjax, signFileDetailAjax } from '../../../../api/signFile'
import { canDownloadOption } from '../../utils/options'
import { uploadFile } from '@/api/file'
import { deptTree } from '@/api/addressBookApi'
// import { hasValue } from '@/utils/index'

export default {
  model: { prop: 'visible', event: 'getVisible' },
  props: {
    visible: { type: Boolean, default: false },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fileType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      companyList: [],
      userList: [],
      electronicSealList: [],
      form: {
        deptIdList: [],
        positionIdList: [],
        companyId: ''
      },
      deptTreeArray: [],
      jobList: [],
      rules: {
        fileName: [
          {
            required: true,
            message: '请输入文件名称',
            trigger: 'blur'
          },
          { min: 1, max: 40, message: '限制最多输入120个字符', trigger: 'blur' }
        ],
        companyId: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        deptIdList: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        positionIdList: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        electronicSealId: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        canDownload: [
          {
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ],
        fileUrl: [
          {
            required: true,
            message: '请上传',
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!this.fileList.length) {
                callback(new Error('请上传'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      fileList: [],
      fileUrl: '',
      canDownloadOption,
      checkDepts: [],
      loading: false
    }
  },
  computed: {
    getVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('getVisible', val)
      }
    }
  },
  async mounted() {
    // const res = await this.getJobList()

    // if (res.some(item => item.jobId === +this.row.positionId)) {
    //   if (this.row.id) {
    //     this.form = { ...this.row }
    //   }
    // } else {
    //   if (this.row.id) {
    //     this.form = { ...this.row, positionId: '' }
    //   }
    // }
    if (this.row.ifEdit) {
      this.initEdit()
    } else {
      this.initAdd()
    }
    this.getCompanyPageList()
    this.getJobList()
    this.loadTreeData()
    this.getElecContractList()
  },
  methods: {
    //获取印章list
    getElecContractList(val) {
      const params = {
        status: 1,
        companyId: val
      }
      this.$store
        .dispatch('oaManage/getElecFollowConditionList', params)
        .then(res => {
          this.electronicSealList = res || []
        })
    },
    entryCompanyIdChange(val) {
      console.log(val, 'sssssssssss')
      if (val) {
        this.form.electronicSealId && (this.form.electronicSealId = '')
        this.getElecContractList(val)
      }
    },
    async getCompanyPageList() {
      const res = await getCompanyListAjax()
      if (res) {
        this.companyList = res.data.filter(item => item.status === 0)
      }
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    // 点击选择部门
    selectDept() {
      const _this = this
      this.$AddressBook({
        type: [0],
        visible: true,
        multiple: true,
        checkDept: this.checkDepts,
        checkUserIds: [],
        success: res => {
          console.log(res, '选择的部门')
          if (res.dept.length > 0) {
            _this.$set(
              this.form,
              'deptChainNameList',
              res.dept.map(m => m.name).join(',')
            )
            _this.$set(
              this.form,
              'deptIdList',
              res.dept.map(m => m.id)
            )
          }
        }
      })
    },
    async getJobList() {
      const res = await jobNoPageList()
      this.jobList = res.data
      return this.jobList
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isTypeAllowed = /\.(pdf)$/i.test(file.name)
      if (!isTypeAllowed) {
        this.$message.error('只能上传 pdf 格式的文件！')

        return false
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB！')

        return false
      }

      return isLt10M && isTypeAllowed
    },
    onChangeFile(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.raw)
      const isUpload = this.beforeUpload(file)
      if (isUpload) {
        uploadFile(formData)
          .then(res => {
            this.fileUrl = res.data.url
            this.fileList = fileList
            this.$refs.uploadFile.clearFiles()
          })
          .catch(() => {
            console.log(file.name + '上传失败')
          })
      } else {
        this.handleRemove()
        this.$refs.uploadFile.clearFiles()
      }
    },
    handleRemove() {
      this.fileList.splice(0)
      this.fileUrl = ''
    },
    handleClose() {
      this.$emit('close')
    },
    submit(type) {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            ...this.form,
            fileType: this.fileType,
            fileUrl: this.fileUrl,
            fileUrlList: JSON.stringify(this.fileList)
          }
          this.loading = true
          addOrUpdateAjax(params)
            .then(res => {
              if (res.code === 1) {
                if (type === 'next') {
                  const formData = new FormData()
                  formData.append('signFileId', res.data)
                  formData.append('signFileVersion', 0)
                  this.loading = true
                  signFileDetailAjax(formData)
                    .then(res2 => {
                      if (res2.code === 1) {
                        this.$emit('nextSuccess', res2.data)
                      }
                    })
                    .finally(() => {
                      this.loading = false
                    })
                } else {
                  this.$emit('success')
                }
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    initAdd() {
      this.form = {
        deptIdList: [],
        positionIdList: []
      }
    },
    initEdit() {
      this.form = { ...this.row }
      this.fileUrl = this.form.fileUrl
      this.fileList = this.form.fileUrlList && JSON.parse(this.form.fileUrlList)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e7e7e7;
}

::v-deep .el-dialog__title {
  font-size: 16px;
  font-weight: 500;
}

.dialog-footer {
  text-align: right !important;
}

.el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
}
.el-textarea__inner::-webkit-scrollbar-track {
  background-color: transparent;
}

.innerbox {
  max-height: 150px;
  overflow: auto;
}

// 滚动条整体样式
.innerbox::-webkit-scrollbar {
  width: 6px;
}
// 滚动条内嵌滑块
.innerbox::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
// 滚动条边角
.innerbox::-webkit-scrollbar-corner {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
