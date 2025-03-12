<template>
  <div class="content-task">
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
        @size-change="handleListSizeChange"
        @current-change="handleListCurrentChange"
        @handleSelectionChange="handleListSelectionChange"
      >
        <div slot="headerLeft">
          <div class="fl">
            <el-form ref="form" class="filter-module" :model="search" label-width="100px" size="small" :inline="true">
              <el-row>
                <el-form-item label="执行状态">
                  <el-select v-model="search.status" class="m-l20" placeholder="请选择" style="width: 180px">
                    <el-option label="全部" value="" />
                    <el-option label="未执行" :value="1" />
                    <el-option label="执行中" :value="2" />
                    <el-option label="部分执行" :value="3" />
                    <el-option label="执行完毕" :value="4" />
                  </el-select>
                </el-form-item>
              </el-row>
            </el-form>
            <el-form ref="form" class="filter-module" :model="search" label-width="100px" size="small" :inline="true">
              <el-row>
                <el-form-item label="任务名称">
                  <el-input
                    v-model="search.taskName"
                    placeholder="请输入"
                    class="input-w"
                    size="small"
                    style="width: 280px"
                    maxlength="100"
                  />
                </el-form-item>
              </el-row>
            </el-form>
            <el-form ref="form" class="filter-module" :model="search" label-width="100px" size="small" :inline="true">
              <el-row>
                <el-form-item label="">
                  <el-button class="m-l-10" type="primary" size="small" @click="getList(true)">搜索</el-button>
                </el-form-item>
              </el-row>
            </el-form>
          </div>
        </div>
        <div slot="headerRight">
          <el-popover placement="bottom-end" width="150" trigger="click">
            <!-- <el-button slot="reference" type="text" size="small">自定义表头</el-button> -->
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
          <!-- <el-button type="text" size="small" class="m-l-20" @click="clear()">重置表头</el-button> -->
        </div>
        <div slot="action" slot-scope="{ row }">
          <template v-if="row.status === 1">
            <el-button type="text" :disabled="btnStart" @click="onClickStart(row.id)">开始</el-button>
            <el-button v-if="row.status === 1" type="text" @click="getDetail(row.id)">编辑</el-button>
          </template>
          <el-button
            v-if="row.status === 2"
            :disabled="btnCancel"
            type="text"
            @click="onClickCancel(row.id)"
          >取消</el-button>
          <el-button
            v-if="row.status === 3"
            :disabled="btnRetransmission"
            type="text"
            @click="onClickRetransmission(row.id)"
          >重发</el-button>
        </div>
        <div slot="commission" slot-scope="{ row }">
          <template v-if="row.isEdit">
            <el-input-number v-model="row._commission" :max="100" :min="0" />
            <span>%</span>
          </template>
          <span v-else>{{ row.commission }}%</span>
        </div>
        <div slot="footer">
          <el-button type="primary" size="" @click="addTask()">新增任务</el-button>
        </div>
      </MPageLayout>
    </div>
    <!-- 用户详情弹框 -->
    <Modal
      :title="taskInfoDialog.title"
      :type="taskInfoDialog.type"
      size="1000px"
      width="1000px"
      :visible.sync="taskInfoDialog.visible"
    >
      <div class="m-form-info">
        <el-form ref="formInfo" :model="formInfo" label-width="130px" :rules="rulesInfo">
          <el-form-item label="任务名称:" prop="taskName">
            <el-input v-model="formInfo.taskName" maxlength="50" show-word-limit clearable class="m-form-input" />
            <el-link
              type="info"
              :underline="false"
            >每天8:00-22:00可发送任务,超过22点的任务,第二天早上8点开始执行</el-link>
          </el-form-item>
          <el-form-item label="选择AI话术:" prop="voiceMsgTemplateId">
            <el-select
              v-model="formInfo.voiceMsgTemplateId"
              class="m-form-width"
              placeholder="请选择"
              @change="onChangeVoice"
            >
              <el-option v-for="item in configTel.tableData" :key="item.id" :label="item.content" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择短信:" prop="smsMsgTemplateId">
            <el-select
              v-model="formInfo.smsMsgTemplateId"
              class="m-form-width"
              placeholder="请选择"
              @change="onChangeSms"
            >
              <el-option v-for="item in configMsg.tableData" :key="item.id" :label="item.content" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="发送对象(用户):" prop="importPhoneFile">
            <div class="flex-box">
              <el-upload
                ref="uploadFile"
                class="upload-box"
                action=""
                accept=".xlsx, .xls"
                :multiple="false"
                :auto-upload="false"
                :on-change="onChangeFile"
                :show-file-list="false"
                :disabled="fileArray.length ? true : false"
              >
                <el-button
                  type="primary"
                  size="mini"
                  round
                  :disabled="fileArray.length ? true : false"
                >上传文件</el-button>
              </el-upload>
              <div class="m-l20">
                <el-button
                  type="info"
                  size="mini"
                  class="a-download-box"
                  round
                  @click="downloadTel"
                >模版下载<a
                  href="https://oss.hokkj.cn/hok/frontend/UploadTemplate.xlsx"
                  class="a-download"
                /></el-button>
              </div>
            </div>
            <div class="file-list-box">
              <div v-for="(item, index) in fileArray" :key="index" class="file-list">
                <div>已选择：{{ item.name }}</div>
                <div class="file-list-del" @click="onRomveFileArray(index, 5)"><i class="el-icon-delete" /></div>
              </div>
            </div>
            <span>文件只能上传1个后缀未xls,xlsx格式文件, 文件条数不能超过1万条</span>
          </el-form-item>
          <el-form-item label="企微打标签:" prop="labelList">
            <el-input
              v-model="label_val"
              show-word-limit
              clearable
              maxlength="20"
              minlength="2"
              class="m-form-input"
              :disabled="formInfo.labelList.length < 5 ? false : true"
              @keyup.enter.native="addLabel()"
            />
            <div v-if="formInfo.labelList.length" class="tag-list">
              <el-tag
                v-for="(tag, index) in formInfo.labelList"
                :key="index"
                closable
                :disable-transitions="false"
                @close="delLabel(index)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="企微话术:" prop="textTitle" />
          <el-form-item label="文字" prop="textMsg">
            <el-input
              v-model="formInfo.textMsg"
              type="textarea"
              class="m-form-width"
              maxlength="200"
              show-word-limit
              :autosize="{ minRows: 5, maxRows: 10 }"
            />
          </el-form-item>
          <el-form-item label="二维码">
            <el-link type="info" :underline="false">这里是班主任的二维码,以实际发送自动分配班主任</el-link>
          </el-form-item>
          <!-- <el-form-item label="音频 暂时关闭" prop="voiceUrl"> -->
          <el-form-item label="音频" prop="">
            <el-upload
              ref="uploadRadio"
              class="upload-box"
              action=""
              accept=".amr"
              :multiple="false"
              :auto-upload="false"
              :on-change="onChangeRadio"
              :show-file-list="false"
              :disabled="fileListStatus.length ? true : false"
            >
              <el-button
                type="primary"
                size="mini"
                round
                :disabled="fileListStatus.length ? true : false"
              >上传文件</el-button>
            </el-upload>
            <div class="file-list-box">
              <!-- <div v-for="(item, index) in radioArray" :key="index" class="file-list"> -->
              <div v-for="(item, index) in fileListStatus" :key="index" class="file-list">
                <div>
                  {{ item.name }} <span>{{ item.status }}</span>
                </div>
                <div class="file-list-del" @click="onRomveFileArray(index, 3)"><i class="el-icon-delete" /></div>
              </div>
            </div>
            <span>只能上传1个amr格式并且不大于10M的音频文件,音频不能大于60秒!</span>
          </el-form-item>
          <el-form-item label="">
            <el-button
              type="primary"
              :loading="infoSaveLoading"
              size="medium"
              plain
              class="m-form-btn"
              @click="save"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import {
  msgTemplate,
  getTaskList,
  addTask,
  editTask,
  getTaskInfo,
  resendTask,
  cancelTask,
  runTask
} from '@/api/msg/msg'
import { uploadAudio } from '@/api/file'
import { parseTime } from '@/utils/index'
export default {
  name: 'CWeChat',
  components: {
    Modal
  },
  data() {
    return {
      loading: false,
      search: {
        status: '',
        taskName: ''
      },
      btnStart: false,
      btnCancel: false,
      btnRetransmission: false,
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'sendCount', 'price', 'type', 'sort', 'commission'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'action', label: '操作', type: 'slot', visible: true },
          { prop: 'taskName', label: '任务名称', type: 'text', visible: true },
          { prop: 'phoneCount', label: '手机数量（条）', type: 'text', visible: true },
          { prop: 'countTxt', label: '执行成功数（短信/AI/企微回复）', type: 'text', visible: true },
          { prop: 'statusTxt', label: '执行状态', type: 'text', visible: true },
          {
            prop: 'realBeginTime',
            label: '开始时间',
            type: 'text',
            visible: true,
            render: (row) => {
              return row.runTime ? parseTime(row.runTime, '{y}-{m}-{d} {h}:{i}') : '——'
            }
          }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      configMsg: {
        // ps: 项目紧急 考虑回显 暂时一次性全加载 内容不多
        tableData: [],
        tableColumns: [],
        pageSizes: [10, 20, 50, 200],
        pageSize: 200,
        currentPage: 1,
        total: 0
      },
      configTel: {
        // ps: 项目紧急 考虑回显 暂时一次性全加载 内容不多
        tableData: [],
        tableColumns: [],
        pageSizes: [10, 20, 50, 200],
        pageSize: 200,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      memberModal: {
        visible: false,
        title: '已发次数详情',
        loading: false
      },
      form: {
        id: '',
        labelName: ''
      },
      rules: {
        id: [{ required: true, message: '请输入机器人id', trigger: 'blur' }],
        labelName: [{ required: true, message: '请输入机器人名称', trigger: 'blur' }]
      },
      listMore: false,
      msgResultId: '',
      //
      taskInfoDialog: {
        title: '',
        type: 1,
        visible: false
      },
      formInfo: {
        textTitle: '标题',
        taskName: '', // 任务名称
        voiceMsg: '', // 电话内容
        smsMsg: '', // 短信内容
        voiceMsgTemplateId: '', // 电话id
        smsMsgTemplateId: '', // 短信id
        importPhoneFile: '', // 文件
        labelList: [], // 标签组合
        textMsg: '', // 企微话术 文本
        voiceUrl: '', // 企微话术 mp3地址
        voiceMsgFileName: '' // mp3文件名称
      },
      rulesInfo: {
        textTitle: [{ required: true, message: '', trigger: 'blur' }],
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        voiceMsgTemplateId: [{ required: true, message: '请选择AI话术', trigger: 'change' }],
        smsMsgTemplateId: [{ required: true, message: '请选择短信', trigger: 'change' }],
        importPhoneFile: [{ required: true, message: '请选择文件', trigger: 'change' }],
        labelList: [{ required: true, message: '请选择输入标签', trigger: 'blur' }],
        textMsg: [{ required: true, message: '请选择输入文字', trigger: 'blur' }],
        voiceUrl: [{ required: true, message: '请选择文件', trigger: 'change' }]
      },
      label_val: '', // 文本输入内容
      infoSaveLoading: false,
      fileListStatus: [],
      radioArray: [], // 音频列表
      videoArray: [], // 视频列表
      fileArray: [], // 文件列表
      edit_id: null // 编辑用户id
    }
  },
  created() {},
  mounted() {
    this.getList()
    this.getMsgTemplate(1)
    this.getMsgTemplate(4)
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', (res) => {
    //   console.log(res)
    //   localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    // })
  },
  methods: {
    // 获取列表数据
    getList(status) {
      this.loading = true
      status ? (this.config.currentPage = 1) : ''
      console.log(this.search)
      const params = {
        status: this.search.status,
        taskName: this.search.taskName,
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      getTaskList(params)
        .then((res) => {
          console.log(res, 'res')
          this.loading = false
          res.data.records.map((v) => {
            console.log('v', v)
            let statusTxt = ''
            v['countTxt'] = `${v.finishSmsMsgCount}/${v.finishVoiceMsgCount}/${v.finishCustomMsgCount}`
            if (v.status === 1) {
              statusTxt = '未执行'
            } else if (v.status === 2) {
              statusTxt = '执行中'
            } else if (v.status === 3) {
              statusTxt = '部分执行'
            } else if (v.status === 4) {
              statusTxt = '执行完毕'
            }
            v['statusTxt'] = statusTxt
          })
          this.config.tableData = res.data.records
          this.config.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取短信模板
    getMsgTemplate(channelId) {
      let current = ''
      let size = ''
      if (channelId === 1) {
        current = this.configMsg.currentPage
        size = this.configMsg.pageSize
      } else {
        current = this.configTel.currentPage
        size = this.configTel.pageSize
      }
      const params = {
        channelId,
        current,
        size
      }
      msgTemplate(params)
        .then((res) => {
          console.log(res, 'res')
          // res.data.records.map(v => {
          //   v['listMore'] = false
          // })
          if (channelId === 1) {
            this.configMsg.tableData = res.data.records
            this.configMsg.total = res.data.total
          } else {
            this.configTel.tableData = res.data.records
            this.configTel.total = res.data.total
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 添加任务
    addTaskApi(params) {
      this.infoSaveLoading = true
      addTask(params)
        .then((res) => {
          console.log(res, 'res')
          if (res.code === 1) {
            this.$message({
              showClose: true,
              message: '添加成功',
              type: 'success'
            })
            this.taskInfoDialog.visible = false
            this.getList()
          }
          this.infoSaveLoading = false
        })
        .catch(() => {
          this.infoSaveLoading = false
        })
    },
    // 编辑任务
    editTaskApi(params) {
      this.infoSaveLoading = true
      console.log('编辑')
      editTask(params)
        .then((res) => {
          console.log(res, 'res')
          if (res.code === 1) {
            this.$message({
              showClose: true,
              message: '编辑成功',
              type: 'success'
            })
            this.taskInfoDialog.visible = false
            this.getList()
            this.edit_id = null
          }
          this.infoSaveLoading = false
        })
        .catch(() => {
          this.infoSaveLoading = false
        })
    },
    // 下载模板
    downloadTel() {
      // 模板接口
      console.log('模板接口')
    },
    // 获取内容详情
    getDetail(id) {
      this.reseFormInfo()
      // 详情接口
      getTaskInfo(id)
        .then((res) => {
          console.log(res, 'res')
          const data = res.data
          this.fileArray.push({
            uid: Date.parse(new Date()),
            name: data.phoneCount,
            status: '上传成功',
            file: ''
          })
          if (data.voiceUrl) {
            this.fileListStatus.push({
              uid: new Date().getTime(),
              name: data.voiceMsgFileName,
              status: '上传成功'
            })
          }
          this.formInfo = {
            textTitle: '标题',
            taskName: data.taskName, // 任务名称
            voiceMsg: data.voiceMsg, // 电话内容
            smsMsg: data.smsMsg, // 短信内容
            voiceMsgTemplateId: data.voiceMsgTemplateId, // 电话id
            smsMsgTemplateId: data.smsMsgTemplateId, // 短信id
            importPhoneFile: this.fileArray, // 文件
            labelList: data.label ? data.label.split(',') : '', // 标签组合
            textMsg: data.textMsg, // 企微话术 文本
            voiceUrl: data.voiceUrl, // 企微话术 mp3地址
            voiceMsgFileName: data.voiceMsgFileName
          }
          console.log(this.formInfo)
        })
        .catch(() => {})
      this.edit_id = id
      this.taskInfoDialog.title = '编辑任务'
      this.taskInfoDialog.visible = true
    },
    addTask() {
      this.reseFormInfo()
      this.edit_id = ''
      this.taskInfoDialog.title = '新增任务'
      this.taskInfoDialog.visible = true
    },
    onChangeVoice(res) {
      console.log(res)
      this.configTel.tableData.forEach((e) => {
        res === e.id ? (this.formInfo.voiceMsg = e.content) : ''
      })
    },
    onChangeSms(res) {
      console.log(res)
      this.configMsg.tableData.forEach((e) => {
        res === e.id ? (this.formInfo.smsMsg = e.content) : ''
      })
    },
    addLabel() {
      console.log('确定按钮', this.label_val)
      if (this.label_val.length > 1) {
        this.formInfo.labelList.push(this.label_val)
        this.label_val = ''
      }
    },
    delLabel(key) {
      console.log(key)
      this.formInfo.labelList.splice(key, 1)
      console.log('this.formInfo.labelList', this.formInfo.labelList)
    },
    onRomveFileArray(num, type) {
      // 移除文件
      const that = this
      if (type === 3) {
        this.radioArray.splice(num, 1)
        this.fileListStatus.forEach((e, i) => {
          console.log(e.status)
          if (i === num) {
            if (e.status === '上传中') {
              this.$message({
                message: '上传中不删除',
                type: 'warning'
              })
            } else {
              that.fileListStatus.splice(num, 1)
            }
          }
        })
      } else if (type === 4) {
        this.videoArray.splice(num, 1)
        this.fileListStatus.forEach((e, i) => {
          console.log(e.status)
          if (i === num) {
            if (e.status === '上传中') {
              this.$message({
                message: '上传中不删除',
                type: 'warning'
              })
            } else {
              that.fileListStatus.splice(num, 1)
            }
          }
        })
      } else if (type === 5) {
        this.fileArray.splice(num, 1)
      }
    },
    onChangeFile(file, fileList) {
      // 上传文件
      console.log('fileList', fileList.length)
      if (fileList.length < 2) {
        this.fileArray = []
        this.fileArray.push({
          uid: file.uid,
          name: file.name,
          status: '上传中',
          file
        })
        this.formInfo.importPhoneFile = this.fileArray
        console.log('file', file)
        this.$refs['formInfo'].clearValidate()
        this.$refs.uploadFile.clearFiles()
        // // 新增筛选代码
        // if (file.status !== 'ready') return
        // // 这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
        // const formData = new FormData()
        // formData.append('file', file.raw)
        // uploadFile(formData).then(res => {
        //   console.log(res)
        //   console.log(res.code)
        //   if (res.code === 1) {
        //     this.formT1.imageUrl = res.data.url
        //     this.fileArray.push({ name: file.name, url: res.data.url })
        //     this.fileListStatus.forEach(e => {
        //       e.uid === file.uid ? e.status = '上传成功' : ''
        //     })
        //   } else {
        //     this.fileListStatus.forEach(e => {
        //       e.uid === file.uid ? e.status = '上传失败' : ''
        //     })
        //   }
        //   this.$refs.uploadFile.clearFiles()
        // }).catch(() => {
        //   this.fileListStatus.forEach(e => {
        //     e.uid === file.uid ? e.status = '上传失败' : ''
        //   })
        //   console.log(file.name + '上传失败')
        // })
      } else {
        this.$refs.uploadFile.clearFiles()
        this.$message({
          message: '温馨提示：一次最多选1个文件',
          type: 'warning'
        })
      }
    },
    onChangeRadio(file, fileList) {
      // 上传音频文件
      const that = this
      console.log('fileList', fileList)
      if (fileList.length < 2) {
        fileList.forEach((e) => {
          if (e.size < 10485760) {
            this.fileListStatus.push({
              uid: file.uid,
              name: file.name,
              status: '上传中'
            })
            // 新增筛选代码
            if (file.status !== 'ready') return
            // 这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
            const formData = new FormData()
            formData.append('file', file.raw)
            uploadAudio(formData)
              .then((res) => {
                if (res.code === 1) {
                  const duration = 0
                  that.formInfo.voiceUrl = res.data.url
                  that.formInfo.voiceMsgFileName = file.name
                  that.radioArray.push({ name: file.name, url: res.data.url, duration })
                  that.fileListStatus.forEach((e) => {
                    e.uid === file.uid ? (e.status = '上传成功') : ''
                  })
                  that.$refs['formInfo'].clearValidate()
                  console.log('that.radioArray', that.radioArray)
                  // let duration = ''
                  // var url = URL.createObjectURL(file.raw)
                  // var audioElement = new Audio(url)
                  // audioElement.addEventListener('loadedmetadata', (_event) => {
                  //   duration = parseInt(audioElement.duration || 0)
                  //   console.log(duration)
                  //   that.radioArray.push({ name: file.name, url: res.data.url, duration })
                  //   that.formInfo.voiceUrl = res.data.url
                  //   that.formInfo.voiceMsgFileName = file.name
                  //   that.fileListStatus.forEach((e) => {
                  //     e.uid === file.uid ? (e.status = '上传成功') : ''
                  //   })
                  //   that.$refs['formInfo'].clearValidate()
                  //   console.log('that.radioArray', that.radioArray)
                  // })
                } else {
                  this.fileListStatus.forEach((e) => {
                    e.uid === file.uid ? (e.status = '上传失败') : ''
                  })
                }
                this.$refs.uploadRadio.clearFiles()
              })
              .catch(() => {
                // this.addModal.loading = false
                this.fileListStatus.forEach((e) => {
                  e.uid === file.uid ? (e.status = '上传失败') : ''
                })
                this.$refs.uploadRadio.clearFiles()
                console.log(file.name + '音频上传失败')
              })
          } else {
            this.$refs.uploadRadio.clearFiles()
            this.$message({
              message: '温馨提示：音频文件已超过10M！',
              type: 'warning'
            })
          }
        })
      } else {
        this.$refs.uploadRadio.clearFiles()
        this.$message({
          message: '温馨提示：一次最多选1个音频',
          type: 'warning'
        })
      }
    },
    onClickStart(id) {
      // 开始发送
      this.btnStart = true
      console.log(id)
      // childrenMap.forEach((e, index) => {
      //   console.log(e)
      // })
      runTask(id)
        .then((res) => {
          console.log(res, 'res')
          this.getList()
          this.$message({
            message: '开始成功',
            type: 'success'
          })
          this.btnStart = false
        })
        .catch(() => {
          this.btnStart = false
        })
    },
    onClickCancel(id) {
      // 取消发送
      console.log(id)
      this.btnCancel = true
      cancelTask(id)
        .then((res) => {
          console.log(res, 'res')
          this.getList()
          this.$message({
            message: '取消成功',
            type: 'success'
          })
          this.btnCancel = false
        })
        .catch(() => {
          this.btnCancel = false
        })
    },
    onClickRetransmission(id) {
      // 重新发送
      this.btnRetransmission = true
      console.log(id)
      resendTask(id)
        .then((res) => {
          console.log(res, 'res')
          this.getList()
          this.$message({
            message: '重新发送成功',
            type: 'success'
          })
          this.btnRetransmission = false
        })
        .catch(() => {
          this.btnRetransmission = false
        })
    },
    // 重置添加编辑内容
    reseFormInfo() {
      this.fileListStatus = []
      this.fileArray = [] // 文件列表
      this.formInfo = {
        textTitle: '标题',
        taskName: '', // 任务名称
        voiceMsg: '', // 电话内容
        smsMsg: '', // 短信内容
        voiceMsgTemplateId: '', // 电话id
        smsMsgTemplateId: '', // 短信id
        importPhoneFile: '', // 文件
        labelList: [], // 标签组合
        textMsg: '', // 企微话术 文本
        voiceUrl: '', // 企微话术 mp3地址
        voiceMsgFileName: '' // mp3文件名称
      }
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter((v) => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.config.tableColumns.map((v) => {
        v.visible = true
      })
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    },
    // 点击重置按钮
    clear() {
      const tableColumns = [
        { prop: 'action', label: '操作', type: 'text', visible: true },
        { prop: 'goodsName', label: '推广员码', type: 'text', visible: true },
        { prop: 'price', label: '推广员', type: 'text', visible: true },
        { prop: 'type', label: '审核状态', type: 'text', visible: true },
        { prop: 'sort', label: '姓名', type: 'text', visible: true },
        { prop: 'sort', label: '绑定手机号', type: 'text', visible: true },
        { prop: 'sort', label: '累计用户', type: 'text', visible: true },
        { prop: 'sort', label: '状态', type: 'text', visible: true },
        { prop: 'commission', label: '加入时间', type: 'text', visible: true }
      ]
      this.config.tableColumns = tableColumns
      localStorage.setItem('promoter_tableColumns', JSON.stringify(tableColumns))
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
      this.getList()
    },
    onClickListMore(row) {
      this.config.tableData.map((v) => {
        v.id === row ? (v.listMore = !v.listMore) : ''
      })
    },
    // 点击保存
    save() {
      this.$refs.formInfo.validate((valid) => {
        if (valid) {
          const formInfo = this.formInfo
          const formData = new FormData()
          const importPhoneFile = formInfo.importPhoneFile[0].file ? formInfo.importPhoneFile[0].file.raw : null
          this.edit_id ? formData.append('id', this.edit_id) : ''
          importPhoneFile ? formData.append('importPhoneFile', importPhoneFile) : ''
          formData.append('labelList', String(formInfo.labelList))
          formData.append('smsMsg', String(formInfo.smsMsg))
          formData.append('smsMsgTemplateId', String(formInfo.smsMsgTemplateId))
          formData.append('voiceMsg', String(formInfo.voiceMsg))
          formData.append('voiceMsgTemplateId', String(formInfo.voiceMsgTemplateId))
          formData.append('taskName', formInfo.taskName)
          formData.append('textMsg', formInfo.textMsg)
          formData.append('voiceUrl', formInfo.voiceUrl)
          formData.append('voiceMsgFileName', formInfo.voiceMsgFileName)
          this.edit_id ? this.editTaskApi(formData) : this.addTaskApi(formData)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content-task {
  height: 100%;
}
.table_wrap {
  height: 100%;
  background: #fff;
  .count-show {
    cursor: pointer;
  }
}
.customer-info-box {
  padding: 20px;
  .result-list-box {
    height: 500px;
  }
}
.fl {
  align-items: center;
}
.m-l20 {
  padding-left: 20px;
}
.a-download-box {
  position: relative;
}
.a-download {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}
.search-info {
  display: flex;
}
.m-form-info {
  padding: 0 20px 0 0;
  .m-form-input {
    width: 88.4%;
  }
  .m-form-width {
    width: 88.4%;
  }
  .m-form-btn {
    margin-top: 20px;
  }
  .tag-list {
    margin-top: 20px;
  }
  .file-list-box {
    overflow: auto;
    .file-list {
      width: 80%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      .file-list-del {
        cursor: pointer;
      }
    }
  }
}
.flex-box {
  display: flex;
}
.el-tag {
  margin-right: 10px;
}
</style>
