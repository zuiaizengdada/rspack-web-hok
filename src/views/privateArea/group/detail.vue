<template>
  <div class="table_wrap">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            maxlength="30"
            show-word-limit
            clearable
            style="width: 500px"
          />
        </el-form-item>
        <el-form-item label="发送对象" prop="sObj">
          <!-- <el-form-item label="发送对象"> -->
          <el-button type="primary" class="foot-btn-box" size="small" @click="openSendObj()">选择</el-button>
          <div v-if="objSelect.length" class="sObj-selsect">
            <div>已选：</div>
            <div v-for="(item, index) in objSelect" :key="index" class="select-item" @click="onDelObjSelectList(index)">
              <template v-if="item.type == 1">
                {{ item.goodName }} {{ item.periodNumTxt }} <i class="el-icon-delete" />
              </template>
              <template v-else> {{ item.title }} <i class="el-icon-delete" /> </template>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseRadio">
          <el-radio v-model="form.releaseRadio" :label="1" @change="changeRadio">立即发布</el-radio>
          <el-radio v-model="form.releaseRadio" :label="2" @change="changeRadio">特定时间</el-radio>
          <template v-if="form.releaseRadio == 2">
            <el-date-picker
              v-model="time_val"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
            />
          </template>
        </el-form-item>
        <el-form-item label="发送类型">
          <div>
            <el-select v-model="form.listStatus" placeholder="请选择" size="small">
              <el-option label="图文" :value="1" />
              <el-option label="文字" :value="2" />
              <el-option label="音频" :value="3" />
              <el-option label="视频" :value="4" />
              <el-option label="文件" :value="5" />
              <el-option label="小程序" :value="6" />
            </el-select>
            <el-button type="primary" class="m-l20" size="small" @click="openModel()">新增一条</el-button>
          </div>
          <div v-if="myArray.length" class="form-list-box">
            <draggable
              v-model="myArray"
              chosen-class="chosen"
              force-fallback="true"
              group="people"
              animation="1000"
              @start="onStart"
              @end="onEnd"
            >
              <transition-group>
                <div v-for="(item, index) in myArray" :key="item.msgId" class="draggable-item">
                  <div class="draggable-item-child">
                    <div class="draggable-action"><i class="el-icon-sort" /></div>
                    <div class="m-l20 draggable-item-child-info">{{ item.msgTypeName }}</div>
                    <div class="m-l20 draggable-item-child-info">
                      <div v-if="item.msgType == 1 || item.msgType == 6" class="draggable-item-child-info-img-box">
                        <img :src="item.picUrl" alt="" />
                      </div>
                      <div v-else-if="item.msgType == 2" class="draggable-item-child-info-txt">{{ item.content }}</div>
                      <div v-else-if="item.msgType == 3 || item.msgType == 4 || item.msgType == 5">
                        {{ item.title }}
                      </div>
                    </div>
                    <div class="m-l20 draggable-item-child-info">
                      <div v-if="item.msgType == 1">{{ item.title }}</div>
                      <div v-else-if="item.msgType == 3" @click="play(item.msgUrl)">试听</div>
                      <div v-else-if="item.msgType == 4" @click="playVideo(item.msgUrl)">试看</div>
                      <div v-else-if="item.msgType == 6">{{ item.title }}</div>
                    </div>
                    <div class="m-l20 draggable-item-child-info-w240">
                      <el-input-number
                        v-model="item.sendTimeGap"
                        controls-position="right"
                        :min="1"
                        :max="60"
                        style="width: 120px"
                        size="small"
                      />
                      <el-select
                        v-model="item.gapUnit"
                        placeholder="请选择"
                        style="width: 100px; margin-left: 20px"
                        size="small"
                      >
                        <el-option label="秒" :value="1" />
                        <el-option label="分钟" :value="2" />
                      </el-select>
                    </div>
                    <div class="m-l20" @click="onListRemove(index)">移除</div>
                  </div>
                </div>
              </transition-group>
            </draggable>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-button
      v-if="save_status === 2"
      type="primary"
      class="foot-btn-box"
      size="small"
      @click="save()"
    >保存</el-button>
    <AppDialog
      v-model="addModal.visible"
      :title="addModal.title"
      :width="AppDialogWidth"
      height="auto"
      @success="addModal.visible = false"
    >
      <div v-loading="addModal.loading" class="customer-info-box">
        <template v-if="addModal.type == 1">
          <div class="img-txt-info">
            <div class="img-txt-info-l">
              <el-form ref="formT1" :model="formT1" label-width="100px" :rules="rulesT1">
                <el-form-item label="缩略图">
                  <div class="upload-img">
                    <el-upload
                      class="avatar-uploader"
                      action=""
                      :limit="1"
                      :on-change="onChangeImg"
                      :show-file-list="false"
                      accept=".jpg,.jpeg,.png,gif,JPG,JPEG,PNG,GIF"
                    >
                      <img v-if="formT1.imageUrl" :src="formT1.imageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                  </div>
                </el-form-item>
                <el-form-item label="图文标题" prop="title">
                  <el-input
                    v-model="formT1.title"
                    placeholder="请输入图文标题"
                    maxlength="30"
                    show-word-limit
                    clearable
                    size="small"
                  />
                </el-form-item>
                <el-form-item label="" prop="id">
                  <div style="width: 100%">
                    <AppUEditor
                      ref="AppUEditor"
                      v-model="formT1.content"
                      :maximum-words="10000"
                      :word-count="true"
                      @change="getUEditor"
                    />
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="img-txt-info-r">
              <div class="img-txt-info-r-phone">
                <img src="@/assets/image/icon_phone.jpg" alt="" />
                <div class="img-txt-info-r-main">
                  <div class="comment">
                    <div class="comment-title">{{ formT1.title }}</div>
                    <div class="comment-info">
                      <div class="comment-info-l" v-html="html_content" />
                      <div class="comment-info-r">
                        <img v-if="formT1.imageUrl" :src="formT1.imageUrl" alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="addModal.type == 2">
          <el-button type="primary" size="small" @click="addTextarea()">增加一行</el-button>
          <div class="textarea-info">
            <draggable
              v-model="textareaList"
              chosen-class="chosen"
              force-fallback="true"
              group="people"
              animation="1000"
              @start="onStart"
              @end="onEnd"
            >
              <transition-group>
                <div v-for="(item, key) in textareaList" :key="key + item.txt" class="textarea-info-child draggable-item-child">
                  <div class="draggable-action textarea-info-child-icon"><i class="el-icon-sort" /></div>
                  <el-input
                    v-model="item.txt"
                    autosize
                    type="textarea"
                    :rows="2"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入内容"
                  />
                </div>
              </transition-group>
            </draggable>
          </div>
        </template>
        <template v-else-if="addModal.type == 3">
          <el-upload
            ref="uploadRadio"
            class="upload-box"
            action=""
            accept=".mp3"
            :multiple="true"
            :auto-upload="false"
            :on-change="onChangeRadio"
            :show-file-list="false"
          >
            <el-button type="success">上传文件</el-button><span> 可以上传.mp3</span>
          </el-upload>
          <div class="file-list-box">
            <div v-for="(item, index) in fileListStatus" :key="index" class="file-list">
              <div>
                {{ item.name }} <span>{{ item.status }}</span>
              </div>
              <div class="file-list-del" @click="onRomveFileArray(index, 3)"><i class="el-icon-delete" /></div>
            </div>
          </div>
        </template>
        <template v-else-if="addModal.type == 4">
          <el-upload
            ref="uploadVideo"
            class="upload-box"
            action=""
            accept=".mp4"
            :multiple="false"
            :auto-upload="false"
            :on-change="onChangeVideo"
            :show-file-list="false"
          >
            <el-button type="success">上传文件</el-button><span> 可以上传.mp4</span>
          </el-upload>
          <div class="file-list-box">
            <div v-for="(item, index) in fileListStatus" :key="index" class="file-list">
              <div>
                {{ item.name }} <span>{{ item.status }}</span>
              </div>
              <div class="file-list-del" @click="onRomveFileArray(index, 4)"><i class="el-icon-delete" /></div>
            </div>
          </div>
        </template>
        <template v-else-if="addModal.type == 5">
          <el-upload
            ref="uploadFile"
            class="upload-box"
            action=""
            accept=".pdf, .doc, .docx, .xlsx, .xls, .txt"
            :multiple="true"
            :auto-upload="false"
            :on-change="onChangeFile"
            :show-file-list="false"
          >
            <el-button type="success">上传文件</el-button><span> 可以上传.pdf, .doc, .docx, .xlsx, .xls, .txt</span>
          </el-upload>
          <div class="file-list-box">
            <div v-for="(item, index) in fileListStatus" :key="index" class="file-list">
              <div>
                {{ item.name }} <span>{{ item.status }}</span>
              </div>
              <div class="file-list-del" @click="onRomveFileArray(index, 5)"><i class="el-icon-delete" /></div>
            </div>
          </div>
        </template>
        <template v-else-if="addModal.type == 6">
          <div class="dialog-list">
            <div class="fl">
              <span class="header-title">课程分类</span>
              <el-select v-model="search.goodsType" placeholder="请选择" size="small">
                <el-option label="图片" :value="0" />
                <el-option label="音频" :value="1" />
                <el-option label="视频" :value="2" />
                <el-option label="专栏" :value="3" />
                <el-option label="大专栏" :value="4" />
                <el-option label="线下课程" :value="5" />
                <el-option label="直播专栏" :value="6" />
              </el-select>
              <el-input v-model="search.searchTxt" placeholder="请输入" size="small">
                <el-select slot="prepend" v-model="search.contentName" class="w-120" size="small" placeholder="请选择">
                  <el-option label="课程名称" value="contentName" />
                </el-select>
                <!-- <el-button slot="append" icon="el-icon-search" /> -->
              </el-input>
              <el-button class="m-l-10" size="small" @click="getList">搜索</el-button>
            </div>
            <el-table
              :data="config.tableData"
              border
              max-height="420px"
              max-width="480px"
              @selection-change="handleListSelectionChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="课程名称" prop="contentName">
                <template slot-scope="{ row }">
                  <div class="list-img-main">
                    <div class="list-img"><img :src="row.coverUrl" alt="" /></div>
                    {{ row.contentName }}
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="config.currentPage"
              :page-sizes="config.pageSizes"
              :page-size="config.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="config.total"
              @size-change="handleListSizeChange"
              @current-change="handleListCurrentChange"
            />
          </div>
        </template>
      </div>
      <div slot="footer" class="footer">
        <el-button v-if="save_status === 2" type="primary" size="small" @click="onPopSave()">保存</el-button>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppVideo from '@/components/AppVideo'
import draggable from 'vuedraggable'
import AppDialog from '@/components/AppDialog'
import AppUEditor from '@/components/AppUEditor'
import { uploadImg, uploadFile, uploadvideo, uploadAudio } from '@/api/file'
import { wechatCoursePage, msgSend, wechatMsgDetail, wechatMsgEdit } from '@/api/privateArea/CWMassSending'
export default {
  name: 'CWeChat',
  components: {
    AppDialog,
    draggable,
    AppUEditor
  },
  data() {
    return {
      loading: false,
      recordId: '',
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      search: {
        goodsType: '',
        contentName: 'contentName',
        searchTxt: ''
      },
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'goodsName',
        'price',
        'type',
        'sort',
        'commission',
        'username',
        'contentName'
      ],
      config: {
        tableData: [],
        tableColumns: [{ prop: 'contentName', label: '课程名称', type: 'slot', visible: true }],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      addModal: {
        visible: false,
        title: '',
        loading: false,
        type: ''
      },
      form: {
        title: '',
        sObj: '',
        releaseRadio: '',
        releaseTime: '',
        listStatus: 1,
        listStatusInfo: ''
      },
      formT1: {
        imageUrl: '',
        title: '',
        content: ''
      },
      formT2: {
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        sObj: [{ required: true, message: '请选择发送对象', trigger: 'blur' }],
        releaseRadio: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        releaseTime: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        listStatusInfo: [{ required: true, message: '请选择发送类型', trigger: 'change' }]
      },
      rulesT1: {
        title: [{ required: true, message: '请输入图文标题', trigger: 'blur' }]
      },
      radio: '',
      time_val: '',
      textarea: '',
      myArray: [],
      textareaList: [{ txt: '' }],
      AppDialogWidth: '',
      objSelect: [],
      html_content: '',
      imgFileId: '',
      fileList: [],
      formData: null,
      radioArray: [], // 音频列表
      videoArray: [], // 视频列表
      fileArray: [], // 文件列表
      fileListCount: 0,
      id: '',
      save_status: '',
      pickerOptions: {
        disabledDate(time) {
          const times = new Date(new Date().toLocaleDateString()).getTime() + 39 * 8.64e7 - 1
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > times // 如果没有后面的-8.64e7就是不可以选择今天的
        }
      },
      fileListStatus: []
    }
  },
  created() {
    this.getList()
    this.id = this.$route.params.id
    this.save_status = this.$route.params.save_status
    console.log('this.$route.params', this.$route.params)
    this.id ? this.wechatMsgDetail() : ''
  },
  mounted() {
    // 拖拽后触发的事件
    // this.$dragging.$on('dragged', (res) => {
    //   console.log(res)
    //   localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
    // })
    // content: this.$refs.AppUEditor ? this.$refs.AppUEditor.getContent() : ''
  },
  methods: {
    // 获取详情
    wechatMsgDetail() {
      const params = { recordId: this.id }
      wechatMsgDetail(params)
        .then((res) => {
          console.log('详情', res.data)
          const data = res.data
          this.recordId = data.recordId
          this.form.title = data.title
          this.form.releaseRadio = data.sendMode
          data.sendMode === 2 ? (this.form.releaseTime = data.sendTime) : ''
          this.myArray = data.msgContent
          this.form.listStatusInfo = data.msgContent
          // 按自定义查询用户还原
          data.msgContent.map((v) => {
            let msgTypeName = ''
            if (v.msgType === 1) {
              msgTypeName = '图文'
            } else if (v.msgType === 2) {
              msgTypeName = '文字'
            } else if (v.msgType === 3) {
              msgTypeName = '音频'
            } else if (v.msgType === 4) {
              msgTypeName = '视频'
            } else if (v.msgType === 5) {
              msgTypeName = '文件'
            } else if (v.msgType === 6) {
              msgTypeName = '小程序'
            }
            v['msgTypeName'] = msgTypeName
          })
          if (data.uids) {
            const uids = data.uids
            this.objSelect.push({
              type: 2,
              uid: data.uids,
              id: '',
              title: `自定义查询${uids.length}名用户`
            })
          }
          // 按期数还原
          if (data.msgPeriod) {
            data.msgPeriod.forEach((e) => {
              this.objSelect.push({
                type: 1,
                uid: '',
                periodId: Number(e.periodId),
                goodName: e.goodName, // 直播专栏名称
                periodNum: e.periodNum,
                periodNumTxt: `${e.periodNum}期`
              })
            })
          }
          // 按标签还原
          if (data.labels) {
            data.labels.forEach((e) => {
              let nickName = ''
              let realName = ''
              if (e.nickName) {
                nickName = `昵称${e.nickName}`
              }
              if (e.realName) {
                realName = `昵称${e.realName}`
              }
              console.log('nickName', nickName)
              const title = '查询条件' + nickName + realName + ';' + e.labelNames
              this.objSelect.push({
                type: 3,
                uid: '',
                labelInfo: {
                  labelIds: e.labelIds,
                  labelNames: e.labelNames,
                  nickName: e.nickName,
                  realName: e.realName
                },
                title
              })
              console.log('检测', this.objSelect)
            })
          }
          if (data.sendTime) {
            const t1 = data.sendTime.split(' ')
            const t2 = t1[1].split(':')
            this.time_val = t1[0] + ' ' + t2[0] + ':' + t2[1]
            console.log('data.sendTime', this.time_val)
          }
          this.form.sObj = this.objSelect
        })
        .catch(() => {})
    },
    // 获取列表数据
    getList() {
      this.loading = true
      const params = {
        goodsType: this.search.goodsType, // 类别
        contentName: this.search.searchTxt, // 课程名称
        current: this.config.currentPage,
        size: this.config.pageSize
      }
      wechatCoursePage(params)
        .then((res) => {
          this.loading = false
          this.config.tableData = res.data.records
          console.log(this.config.tableData)
          this.config.total = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.config.tableColumns.filter((v) => v.visible)
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('promoter_tableColumns', JSON.stringify(this.config.tableColumns))
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
      // this.getList()
    },
    getUEditor(e) {
      this.html_content = e.replace(/<\/?.+?\/?>/g, '')
    },
    // 打开成员信息弹框
    openModel(type, row) {
      const listStatus = this.form.listStatus
      this.fileListStatus = []
      // this.memberList = []
      // this.memberModal.loading = true
      if (listStatus) {
        if (listStatus === 1) {
          this.addModal.title = '添加图文'
          this.addModal.type = 1
        } else if (listStatus === 2) {
          this.addModal.title = '添加文字'
          this.addModal.type = 2
        } else if (listStatus === 3) {
          this.addModal.title = '添加音频'
          this.addModal.type = 3
        } else if (listStatus === 4) {
          this.addModal.title = '添加视频'
          this.addModal.type = 4
        } else if (listStatus === 5) {
          this.addModal.title = '添加文件'
          this.addModal.type = 5
        } else if (listStatus === 6) {
          this.addModal.title = '添加小程序'
          this.addModal.type = 6
        }
        listStatus === 1 ? (this.AppDialogWidth = '980px') : (this.AppDialogWidth = '700px')
        this.addModal.visible = true
      } else {
        this.$message({
          showClose: true,
          message: '请选择类型',
          type: 'warning'
        })
      }
      // const params = {
      //   goodsId: row.goodsId,
      //   orderNo: row.orderNo
      // }
      // getStudentList(params)
      //   .then((res) => {
      //     this.memberList = res.data
      //     this.memberModal.loading = false
      //     console.log(res, '获取学员信息')
      //   })
      //   .catch(() => {
      //     this.memberModal.loading = false
      //   })
    },
    changeRadio(e) {
      console.log(e)
      this.form.releaseRadio = e
    },
    onListRemove(num) {
      console.log(this.myArray)
      console.log(num)
      this.myArray.splice(num, 1)
      this.form.listStatusInfo = this.myArray
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onPopSave() {
      // 控制弹窗内容
      const listStatus = this.form.listStatus
      if (listStatus === 1) {
        console.log('AppUEditor', this.$refs.AppUEditor.getText().length)
        if (this.$refs.AppUEditor.getText().length < 10000) {
          this.$refs.formT1.validate((valid) => {
            if (valid) {
              console.log(this.formT1)
              this.myArray.push({
                msgTypeName: '图文',
                fileList: this.fileArray, // 文件列表
                content: this.formT1.content, // 文本内容
                msgId: '', // 消息id
                msgType: 1, // 发送类型 1图文 2文字 3音频 4视频 5文件 6小程序
                msgUrl: '', // 文件地址音频、视频、文件url
                title: this.formT1.title, // 标题名称
                picUrl: this.formT1.imageUrl, // 封面缩略图
                sendTimeGap: 10, // 发送时间间隔,
                gapUnit: 1, // 发送时间间隔单位 1秒 2分钟
                priority: '' // 发送优先级 1为最高优先级，以此类推
              })
              this.formT1 = {
                imageUrl: '',
                title: '',
                content: ''
              }
              this.addModal.visible = false
              this.$refs.form.clearValidate('listStatus')
            } else {
              console.log('error submit!!')
              this.$notify({
                title: '警告',
                message: '请完成必填项!',
                type: 'warning'
              })
              return false
            }
          })
          this.addModal.visible = false
        } else {
          this.$message({
            message: '富文本限制10000字符',
            type: 'warning'
          })
        }
      } else if (listStatus === 2) {
        this.addModal.title = '添加文字'
        this.addModal.type = 2
        const textareaList = this.textareaList
        const res = textareaList.filter((e) => {
          return e.txt
        })
        res.forEach((e) => {
          this.myArray.push({
            msgTypeName: '文字',
            content: e.txt, // 文本内容
            msgId: '', // 消息id
            msgType: 2, // 发送类型 1图文 2文字 3音频 4视频 5文件 6小程序
            msgUrl: '', // 文件地址音频、视频、文件url
            title: this.formT1.title, // 标题名称
            picUrl: this.formT1.imageUrl, // 封面缩略图
            sendTimeGap: 10, // 发送时间间隔,
            gapUnit: 1, // 发送时间间隔单位 1秒 2分钟
            priority: '' // 发送优先级 1为最高优先级，以此类推
          })
        })
        this.addModal.visible = false
        this.textareaList = [{ txt: '' }]
      } else if (listStatus === 3) {
        this.addModal.title = '添加音频'
        this.addModal.type = 3
        this.radioArray.forEach((e, k) => {
          this.myArray.push({
            msgTypeName: '音频',
            content: e.duration, // 文本内容
            msgId: '', // 消息id
            msgType: 3, // 发送类型 1图文 2文字 3音频 4视频 5文件 6小程序
            msgUrl: e.url, // 文件地址音频、视频、文件url
            title: e.name, // 标题名称
            picUrl: '', // 封面缩略图
            sendTimeGap: 10, // 发送时间间隔,
            gapUnit: 1, // 发送时间间隔单位 1秒 2分钟
            priority: '' // 发送优先级 1为最高优先级，以此类推
          })
        })
        this.addModal.visible = false
        this.radioArray = []
        this.fileListStatus = []
        this.$refs.uploadRadio.clearFiles()
      } else if (listStatus === 4) {
        this.addModal.title = '添加视频'
        this.addModal.type = 4
        this.videoArray.forEach((e, k) => {
          this.myArray.push({
            msgTypeName: '视频',
            content: e.duration, // 文本内容
            msgId: '', // 消息id
            msgType: 4, // 发送类型 1图文 2文字 3音频 4视频 5文件 6小程序
            msgUrl: e.url, // 文件地址音频、视频、文件url
            title: e.name, // 标题名称
            picUrl: '', // 封面缩略图
            sendTimeGap: 10, // 发送时间间隔,
            gapUnit: 1, // 发送时间间隔单位 1秒 2分钟
            priority: '' // 发送优先级 1为最高优先级，以此类推
          })
        })
        this.addModal.visible = false
        this.videoArray = []
        this.fileListStatus = []
        console.log('myArray', this.myArray)
        console.log('fileArray', this.videoArray)
        this.$refs.uploadVideo.clearFiles()
      } else if (listStatus === 5) {
        this.addModal.title = '添加文件'
        this.addModal.type = 5
        this.fileArray.forEach((e, k) => {
          this.myArray.push({
            msgTypeName: '文件',
            content: '', // 文本内容
            msgId: '', // 消息id
            msgType: 5, // 发送类型 1图文 2文字 3音频 4视频 5文件 6小程序
            msgUrl: e.url, // 文件地址音频、视频、文件url
            title: e.name, // 标题名称
            picUrl: '', // 封面缩略图
            sendTimeGap: 10, // 发送时间间隔,
            gapUnit: 1, // 发送时间间隔单位 1秒 2分钟
            priority: '' // 发送优先级 1为最高优先级，以此类推
          })
        })
        this.addModal.visible = false
        this.fileArray = []
        this.fileListStatus = []
        console.log('myArray', this.myArray)
        console.log('fileArray', this.fileArray)
        this.$refs.uploadFile.clearFiles()
      } else if (listStatus === 6) {
        this.addModal.title = '添加小程序'
        this.addModal.type = 6
        this.multipleSelection.forEach((e) => {
          this.myArray.push({
            msgTypeName: '小程序',
            content: e.goodsId, // 文本内容
            msgId: '', // 消息id
            msgType: 6, // 发送类型 1图文 2文字 3音频 4视频 5文件 6小程序
            msgUrl: '', // 文件地址音频、视频、文件url
            title: e.contentName, // 标题名称
            picUrl: e.coverUrl, // 封面缩略图
            sendTimeGap: 10, // 发送时间间隔,
            gapUnit: 1, // 发送时间间隔单位 1秒 2分钟
            priority: '' // 发送优先级 1为最高优先级，以此类推
          })
        })
        this.addModal.visible = false
      }
      this.form.listStatusInfo = this.myArray
    },
    // 立即发送
    sendNow(recordId) {
      const params = { recordId }
      msgSend(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            message: '发送成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.$message({
            message: '发送失败',
            type: 'warning'
          })
        })
    },
    // 打开发送对象组件
    openSendObj() {
      const that = this
      const selectColumn = [] // 已选用户
      let selectUser = [] // 已选用户
      console.log('selectColumn', selectColumn)
      that.objSelect.forEach((e) => {
        e.type === 1 ? selectColumn.push(e.periodId) : ''
        e.type === 2 ? (selectUser = e.uid) : ''
      })
      console.log(selectColumn, 'selectColumn')
      this.$SendObj({
        visible: true,
        columnDisabledFn: (row, index) => {
          // 控制专栏
          return !selectColumn.includes(row.id)
          // return false
        },
        userDisabledFn: (row, index) => {
          // 控制选择用户
          return !selectUser.includes(row.uid)
          // return false
        },
        success: (res) => {
          console.log(res, '返回的数据')
          if (res.type === 1) {
            res.value.forEach((e) => {
              that.objSelect.push({
                type: res.type,
                uid: '',
                periodId: e.id,
                goodsId: e.goodsId,
                goodsType: e.goodsType,
                shelveFlag: e.shelveFlag,
                goodName: e.contentName, // 直播专栏名称
                periodNum: e.periodNum,
                periodNumTxt: `${e.periodNum}期`
              })
            })
          } else if (res.type === 2) {
            const uids = []
            res.value.forEach((e) => {
              uids.push(e.uid)
            })
            const objSelectLen = that.objSelect.filter((item) => item.type === 2)
            console.log('objSelectLen>??', objSelectLen)
            if (objSelectLen.length) {
              that.objSelect.forEach((e) => {
                console.log('objSelect-->', e)
                if (e.type === 2) {
                  const arr = [...new Set([...e.uid, ...uids])]
                  e.uid = arr
                  e.title = `自定义查询${arr.length}名用户`
                }
              })
            } else {
              that.objSelect.push({
                type: res.type,
                uid: uids,
                periodId: '',
                title: `自定义查询${res.value.length}名用户`
              })
            }
          } else if (res.type === 3) {
            let labelName = ''
            let labelIds = ''
            res.value.labelId.forEach((e, k) => {
              k === 0 ? (labelName = e.labelName) : (labelName = labelName + '、' + e.labelName)
              k === 0 ? (labelIds = e.labelId) : (labelIds = labelIds + ',' + e.labelId)
            })
            that.objSelect.push({
              type: res.type,
              uid: '',
              id: '',
              labelInfo: {
                labelIds,
                labelNames: labelName,
                nickName: res.value.user.label === 'name' ? res.value.user.value : '',
                realName: res.value.user.label === 'name' ? '' : res.value.user.value
              },
              title: `查询条件${res.value.user.label === 'name' ? '昵称' : '真实姓名'}:${
                res.value.user.value
              };${labelName}`
            })
          }
          this.form.sObj = this.objSelect
        }
      })
    },
    wechatMsgEdit(params) {
      // this.loading = true
      wechatMsgEdit(params)
        .then((res) => {
          console.log(res, 'res')
          // this.loading = false
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.$router.push({ name: 'PrivateAreaGroupList', params: {} })
        })
        .catch(() => {
          // this.loading = false
          this.$message({
            message: '编辑失败',
            type: 'warning'
          })
        })
    },
    // 点击保存
    save() {
      this.$refs.form.validate((valid) => {
        console.log('myArray', this.myArray)
        const msgPeriod = []
        let uids = []
        const Labels = []
        if (this.myArray.length) {
          this.objSelect.forEach((e) => {
            e.type === 1 ? msgPeriod.push(e) : ''
            e.type === 2 ? (uids = e.uid) : ' '
            if (e.type === 3) {
              Labels.push(e.labelInfo)
            }
          })
          console.log('msgPeriod', msgPeriod)
          if (valid) {
            // alert('submit!')
            console.log(this.form)
            if (this.form.releaseRadio !== 2) {
              const params = {
                recordId: this.recordId,
                title: this.form.title,
                msgPeriod, // 专栏
                sendMode: this.form.releaseRadio, // 发送方式 1立即发送 2定时发送
                sendTime: this.time_val, // 定时发送时间
                uids, // 发送用户ID列表
                msgContent: this.myArray,
                Labels // 用户标签
              }
              console.log('params-->', params)
              this.wechatMsgEdit(params)
            } else {
              if (this.time_val) {
                const params = {
                  recordId: this.recordId,
                  title: this.form.title,
                  msgPeriod, // 专栏
                  sendMode: this.form.releaseRadio, // 发送方式 1立即发送 2定时发送
                  sendTime: this.time_val, // 定时发送时间
                  uids, // 发送用户ID列表
                  msgContent: this.myArray,
                  Labels // 用户标签
                }
                console.log('params-->', params)
                this.wechatMsgEdit(params)
              } else {
                this.$message({
                  message: '日期不能为空~',
                  type: 'warning'
                })
              }
            }
          } else {
            console.log('error submit!!')
            this.$notify({
              title: '警告',
              message: '请完成必填项!',
              type: 'warning'
            })
            return false
          }
        } else {
          this.$message({
            message: '发送内容不能为空',
            type: 'warning'
          })
        }
      })
    },
    addTextarea() {
      const textareaList = this.textareaList
      textareaList.push({
        txt: ''
      })
      this.textareaList = textareaList
    },
    onDelObjSelectList(key) {
      console.log(key)
      this.$confirm('此操作将删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.objSelect.splice(key, 1)
          this.form.sObj = this.objSelect
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 拖拽组件
    // 开始拖拽事件
    onStart() {
      this.drag = true
    },
    // 拖拽结束事件
    onEnd() {
      this.drag = false
    },
    // feil ability
    onChangeImg(file, fileList) {
      // 上传单图
      // 新增筛选代码
      if (file.status !== 'ready') return
      // 这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
      const typeArray = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
      const isJPG = typeArray.indexOf(file.raw.type)
      if (isJPG === -1) {
        this.$message.error('上传头像图片只能是 jpg、jpeg、png或gif 格式！！！')
        fileList.pop()
      }
      const formData = new FormData()
      fileList.forEach((item) => {
        formData.append('file', item.raw, item.raw.name)
      })
      uploadImg(formData)
        .then((res) => {
          this.formT1.imageUrl = res.data.url
        })
        .catch(() => {
          console.log('图片上传失败')
        })
    },
    onChangeFile(file, fileList) {
      // 上传文件
      console.log('fileList', fileList.length)
      if (fileList.length < 7) {
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
        uploadFile(formData)
          .then((res) => {
            console.log(res)
            console.log(res.code)
            if (res.code === 1) {
              this.formT1.imageUrl = res.data.url
              this.fileArray.push({ name: file.name, url: res.data.url })
              this.fileListStatus.forEach((e) => {
                e.uid === file.uid ? (e.status = '上传成功') : ''
              })
            } else {
              this.fileListStatus.forEach((e) => {
                e.uid === file.uid ? (e.status = '上传失败') : ''
              })
            }
            this.$refs.uploadFile.clearFiles()
          })
          .catch(() => {
            this.fileListStatus.forEach((e) => {
              e.uid === file.uid ? (e.status = '上传失败') : ''
            })
            console.log(file.name + '上传失败')
          })
      } else {
        this.$message({
          message: '温馨提示：一次最多选6个文件',
          type: 'warning'
        })
      }
    },
    onChangeRadio(file, fileList) {
      // 上传文件
      const that = this
      if (fileList.length < 7) {
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
              let duration = ''
              var url = URL.createObjectURL(file.raw)
              var audioElement = new Audio(url)
              audioElement.addEventListener('loadedmetadata', (_event) => {
                duration = parseInt(audioElement.duration || 0)
                console.log(duration)
                that.radioArray.push({ name: file.name, url: res.data.url, duration })
                that.fileListStatus.forEach((e) => {
                  e.uid === file.uid ? (e.status = '上传成功') : ''
                })
              })
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
            console.log(file.name + '音频上传失败')
          })
      } else {
        this.$message({
          message: '温馨提示：一次最多选6个音频',
          type: 'warning'
        })
      }
    },
    onChangeVideo(file, fileList) {
      // 上传文件
      const that = this
      if (fileList.length < 7) {
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
        uploadvideo(formData)
          .then((res) => {
            if (res.code === 1) {
              // 获取时长
              let duration = ''
              const fileUrl = URL.createObjectURL(file.raw)
              const videoEl = document.createElement('VIDEO')
              videoEl.src = fileUrl
              videoEl.setAttribute('crossOrigin', 'Anonymous')
              videoEl.setAttribute('controls', 'controls')
              videoEl.setAttribute('autoplay', 'autoplay')
              videoEl.volume = 0
              videoEl.addEventListener('loadeddata', async () => {
                duration = videoEl.duration || 0 // 时长
                console.log(duration)
                that.videoArray.push({ name: file.name, url: res.data.url, duration })
                that.fileListStatus.forEach((e) => {
                  e.uid === file.uid ? (e.status = '上传成功') : ''
                })
              })
            } else {
              this.fileListStatus.forEach((e) => {
                e.uid === file.uid ? (e.status = '上传失败') : ''
              })
            }
            this.$refs.uploadVideo.clearFiles()
          })
          .catch(() => {
            this.fileListStatus.forEach((e) => {
              e.uid === file.uid ? (e.status = '上传失败') : ''
            })
            console.log(file.name + '视频上传失败')
          })
      } else {
        this.$refs.uploadVideo.clearFiles()
        this.$message({
          message: '温馨提示：一次最多选6个视频',
          type: 'warning'
        })
      }
    },
    onRomveFileArray(num, type) {
      // 移除文件
      const that = this
      if (type === 3) {
        this.radioArray.splice(num, 1)
      } else if (type === 4) {
        this.videoArray.splice(num, 1)
      } else if (type === 5) {
        this.fileArray.splice(num, 1)
      }
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
    },
    play(src) {
      // 播放音频
      console.log(src)
      this.$AppAudio({
        visible: true,
        src
      })
    },
    playVideo(url) {
      // 播放视频
      AppVideo.play({
        url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table_wrap {
  height: 100%;
  background: #fff;
  padding-bottom: 20px;
  .form-box {
    padding: 20px;
    .form-list-box {
      max-height: 500px;
      overflow: auto;
    }
  }
  .draggable-item {
    margin-top: 20px;
    .draggable-item-child {
      display: flex;
      margin-bottom: 20px;
      -moz-user-select: -moz-none;
      -moz-user-select: none;
      -o-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      cursor: pointer;
      .draggable-action {
        width: 40px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ececec;
        border-radius: 6px;
      }
      .draggable-item-child-info {
        width: 160px;
        display: -webkit-box;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        .draggable-item-child-info-txt {
          width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .draggable-item-child-info-img-box {
          width: 70px;
          height: 70px;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .draggable-item-child-info-w240 {
        width: 240px;
      }
    }
  }
  .sObj-selsect {
    display: flex;
    .select-item {
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .foot-btn-box {
    margin-left: 20px;
  }
}
.customer-info-box {
  padding: 20px;
  .img-txt-info {
    display: flex;
    .img-txt-info-l {
      width: 700px;
    }
    .img-txt-info-r {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 10px 0 10px;
      .img-txt-info-r-phone {
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        .img-txt-info-r-main {
          position: absolute;
          right: 44px;
          top: 36px;
          .comment {
            position: relative;
            width: 150px;
            // height: 90px;
            background: #ffffff;
            border-radius: 5px;
            margin: 30px auto 0;
            padding: 4px;
            .comment-title {
              color: #182b50;
              font-size: 15px;
              font-weight: 500;
              display: -webkit-box;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .comment-info {
              display: flex;
              color: #9398a0;
              font-size: 10px;
              font-weight: 400;
              margin-top: 8px;
              .comment-info-l {
                flex: 1;
                display: -webkit-box;
                text-overflow: ellipsis;
                overflow: hidden;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }
              .comment-info-r {
                width: 24px;
                height: 24px;
                background-color: #d6d6d6;
                image {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .comment:after {
            content: '';
            position: absolute;
            top: 10px;
            right: -4px;
            width: 8px;
            height: 8px;
            transform: rotate(45deg);
            background-color: #ffffff;
          }
        }
      }
    }
  }
  .textarea-info {
    height: 300px;
    overflow: auto;
    .textarea-info-child {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .textarea-info-child-icon {
        width: 40px;
        height: 40px;
        line-height: 40px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background-color: #ececec;
        border-radius: 6px;
        margin-right: 20px;
      }
    }
  }
  .upload-img {
    v-deep.el-upload-list__item {
      width: 120px;
      height: 120px;
    }
  }
  .upload-box {
  }
  .file-list-box {
    height: 500px;
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
  .list-img-main {
    display: flex;
    align-items: center;
    .list-img {
      width: 80px;
      height: 80px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        object-fit: cover;
      }
    }
  }
}
.fl {
  align-items: center;
}
.m-l20 {
  margin-left: 20px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
}
::v-deep .edui-default .edui-editor {
  width: 100% !important;
  height: 400px !important;
  z-index: 2050 !important;
}
::v-deep .edui-default .edui-editor-iframeholder {
  width: 100% !important;
  height: 210px !important;
  z-index: 2050 !important;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.dialog-list {
  height: 500px;
  .header-title {
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-block;
    width: 140px;
    font-weight: 700;
  }
}
</style>
