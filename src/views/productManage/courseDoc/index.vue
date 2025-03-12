<template>
  <div class="course-doc-wrap">
    <!-- <el-menu :default-active="activeIndex" class="el-menu-header" mode="horizontal" @select="handleMenuSelect">
      <el-menu-item index="1">课程文件</el-menu-item>
      <el-menu-item index="2">回收站</el-menu-item>
    </el-menu> -->
    <div class="menu-box">
      <div class="menu-info" :class="[activeIndex === 1 ? 'menu-active':'']" @click="handleMenuSelect(1)">课程文件</div>
      <div class="menu-info" :class="[activeIndex === 2 ? 'menu-active':'']" @click="handleMenuSelect(2)">回收站</div>
    </div>
    <div v-if="activeIndex === 1" class="course-doc-box">
      <div class="cd-l">
        <cd-tree :config="configTree" @getFileList="getFileList" />
      </div>
      <div class="cd-r">
        <div class="header-box">
          <el-form :inline="true" :model="search" class="demo-form-inline">
            <el-form-item label="状态">
              <el-select v-model="search.status" placeholder="活动区域" @change="onSearch">
                <el-option label="全部" value="" />
                <el-option label="公开" value="1" />
                <el-option label="不公开" value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="文件名称">
              <el-input v-model="search.documentName" placeholder="请输入文件名称" clearable />
            </el-form-item>
            <el-form-item>
              <el-button class="header-search" type="primary" size="small" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button
            v-permission="['system:courseDoc:addFile', permsList]"
            class="upload-btn"
            size="small"
            :disabled="selectCatalog.catalogLevel > 2 ? false : true"
            @click="onClickUploadFile(true)"
          >上传文件</el-button>
        </div>
        <div class="tab-box">
          <el-skeleton v-if="tabLoad" :rows="10" animated />
          <el-table
            v-else
            ref="fileTable"
            :header-cell-style="{
              background: '#f5f5f5',
              color: '#606266',
              fontSize: '14px',
              fontFamily: 'MicrosoftYaHei'
            }"
            style="width: 100%;height: 100%;"
            max-height="610"
            height="600"
            :data="config.tableData"
            @selection-change="handleListSelectionChange"
          >
            <template v-for="item in config.tableColumns">
              <el-table-column v-if="item.type === 'selection'" :key="item.label" type="selection" width="55" />
              <el-table-column
                v-else-if="item.type === 'slot'"
                :key="item.label + 1"
                fixed="right"
                label="操作"
                width="150"
              >
                <template slot-scope="scope">
                  <el-button v-permission="['system:courseDoc:see', permsList]" class="tab-box-btn" type="text" size="small" @click.native.prevent="onClickSees(scope.row)"> 查看 </el-button>
                  <el-button v-permission="['system:courseDoc:download', permsList]" class="tab-box-btn" type="text" size="small" @click.native.prevent="downloadFile(scope.row)"> 下载 </el-button>
                  <el-dropdown v-permission="['system:courseDoc:more', permsList]" @command="handleCommand">
                    <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right" /> </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-permission="['system:courseDoc:cover', permsList]"
                        :command="beforeHandleCommand(scope.$index, scope.row, 'a')"
                      >覆盖</el-dropdown-item>
                      <el-dropdown-item
                        v-permission="['system:courseDoc:move', permsList]"
                        :command="beforeHandleCommand(scope.$index, scope.row, 'b')"
                      >移动</el-dropdown-item>
                      <el-dropdown-item
                        v-permission="['system:courseDoc:copy', permsList]"
                        :command="beforeHandleCommand(scope.$index, scope.row, 'c')"
                      >复制</el-dropdown-item>
                      <el-dropdown-item
                        v-permission="['system:courseDoc:open', permsList]"
                        :command="beforeHandleCommand(scope.$index, scope.row, 'd')"
                      >{{
                        scope.row.status === 0 ? '公开' : '不公开'
                      }}</el-dropdown-item>
                      <el-dropdown-item
                        v-permission="['system:courseDoc:editName', permsList]"
                        :command="beforeHandleCommand(scope.$index, scope.row, 'e')"
                      >更改名称</el-dropdown-item>
                      <el-dropdown-item
                        v-permission="['system:courseDoc:del', permsList]"
                        :command="beforeHandleCommand(scope.$index, scope.row, 'f')"
                      >删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
              <el-table-column
                v-else-if="item.type === 'inlineTable'"
                :key="item.label + 2"
                :label="item.label"
                width="160"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.quoteCount === 0">0</span>
                  <el-button v-else type="text" size="small" @click.native.prevent="onClickSee(scope.row.id)">
                    {{ scope.row.quoteCount }}
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column v-else :key="item.label + 3" :prop="item.prop" :label="item.label" width="160" />
            </template>
          </el-table>
        </div>
        <div class="foot-box">
          <div class="foot-l">
            <el-link
              v-permission="['system:courseDoc:moveAll', permsList]"
              type="primary"
              :underline="false"
              :disabled="multipleSelection.length ? false : true"
              class="btn-link"
              @click="handleMoveArray"
            >批量移动</el-link>
            <el-link
              v-permission="['system:courseDoc:copyAll', permsList]"
              type="primary"
              :underline="false"
              :disabled="multipleSelection.length ? false : true"
              class="btn-link"
              @click="handleCopyArray"
            >批量复制</el-link>
            <el-link
              v-permission="['system:courseDoc:delAll', permsList]"
              type="primary"
              :underline="false"
              :disabled="multipleSelection.length ? false : true"
              class="btn-link"
              @click="handleDelArray"
            >批量删除</el-link>
          </div>
          <div class="foot-r">
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
        </div>
        <div v-if="!selectCatalog" class="no-select-file">
          <svg-icon icon-class="tree_tab_no" class="icon-svg" />
          <div><span>暂无内容</span></div>
        </div>
      </div>
    </div>
    <div v-else>
      <recycle-bin />
    </div>
    <!-- 主内容 -->
    <dialog-oss-upload
      ref="uploadOss"
      :visible.sync="visibleDialogOssUpload"
      width="800px"
      :upload-info="uploadInfo"
      accept=""
      :limit="3"
      :limit-paste="10"
      :before-upload="ossBeforeUpload"
      @success="ossUploadSuccess"
    >
      <template #header>
        <div class="dialog-oss-header">
          <div class="dialog-oss-header-box">
            <div class="dialog-oss-header-label">上传到:</div>
            <div class="dialog-oss-header-info">{{ pathName }}</div>
          </div>
          <div class="dialog-oss-header-toast">
            <span>如果不是您想存放的路径，可以重新选择左侧文件夹再上传</span>
          </div>
        </div>
      </template>
    </dialog-oss-upload>
    <AppDialog
      v-model="seeDialog.visible"
      :title="seeDialog.title"
      width="180"
      height="280"
      max-height="280"
      @success="seeDialog.visible = false"
    >
      <div class="info-box">
        <MPageLayout
          ref="MPageLayout"
          type="tablePage"
          :slot-arr="slotArr"
          :current-page="seeConfig.currentPage"
          :page-sizes="seeConfig.pageSizes"
          :page-size="seeConfig.pageSize"
          :total="seeConfig.total"
          :table-data="seeConfig.tableData"
          :table-columns="seeConfig.tableColumns"
          :loading="loading"
          layout="total, sizes, prev, pager, next, jumper"
          border
          @size-change="handleListSeeSizeChange"
          @current-change="handleSeeCurrentChange"
          @handleSelectionChange="handleListSeeSelectionChange"
        />
      </div>
      <div slot="footer" class="footer" />
    </AppDialog>
    <AppDialog
      v-model="seePhoto.visible"
      :title="seePhoto.title"
      width="180"
      height="280"
      max-height="280"
      @success="seePhoto.visible = false"
    >
      <div class="info-image-box">
        <el-image
          style="width: 200px; height: 200px"
          fit="cover "
          :src="seePhoto.src"
          :preview-src-list="seePhoto.preview"
        />
      </div>
      <div slot="footer" class="footer" />
    </AppDialog>
    <AppDialog
      v-model="editNameDialog.visible"
      :title="editNameDialog.title"
      width="150"
      height="280"
      max-height="280"
      @success="editNameDialog.visible = false"
    >
      <div class="edit-info-box">
        <el-form ref="editNameForm" :model="editNameForm" label-width="80px" :rules="editNameRules">
          <el-form-item label="文件名称" prop="name">
            <el-input v-model="editNameForm.name" maxlength="50" show-word-limit clearable />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button :loading="editNameDialog.loading" type="primary" @click="submitFileNameForm">保存</el-button>
      </div>
      <div slot="footer" class="footer" />
    </AppDialog>
    <AppDialog
      v-model="treeDialog.visible"
      :title="treeDialog.title"
      width="150"
      height="280"
      max-height="280"
      @success="treeDialog.visible = false"
    >
      <div class="tree-info-box">
        <cd-tree v-if="treeDialog.visible" :config="configTreeDialog" @getFileList="getCatalogue" />
      </div>
      <div slot="footer" class="footer">
        <el-button :loading="treeDialog.loading" type="primary" @click="submitFileLocationForm">{{
          treeDialog.btnText
        }}</el-button>
        <el-button :loading="treeDialog.loading" @click="treeDialog.visible = false">取消</el-button>
      </div>
      <div slot="footer" class="footer" />
    </AppDialog>
    <message-box title="测试" width="25%" top="100px" :visible.sync="visible">
      <template>
        <p>主体内容，随便写点什么...</p>
        <input type="text" placeholder="请输入信息" />
      </template>
      <template v-slot:footer>
        <button>按钮</button>
      </template>
    </message-box>
  </div>
</template>

<script>
import messageBox from './components/messageBox/index.vue'
import AppVideo from '@/components/AppVideo'
import AppDialog from '@/components/AppDialog'
import DialogOssUpload from '@/components/DialogOssUpload/index.vue'
import CdTree from './components/tree.vue'
import recycleBin from './components/recycleBin/index.vue'
import { parseTime } from '@/utils/index'
import {
  documentPage,
  uploadDocument,
  coverDocument,
  updateDocument,
  statusDocument,
  delDocument,
  copyDocument,
  moveDocument,
  quotePage,
  detailCatalog,
  checkFile
} from '@/api/courseDoc/index'
export default {
  name: 'CourseDoc',
  components: {
    AppDialog,
    DialogOssUpload,
    CdTree,
    recycleBin,
    messageBox
  },
  data() {
    return {
      permsList: this.$route?.meta?.permsList || [],
      visible: false,
      loading: false,
      visibleDialogOssUpload: false,
      activeIndex: 1,
      search: {
        status: '',
        documentName: ''
      },
      config: {
        tableData: [],
        tableColumns: [
          { prop: '', label: '', type: 'selection', visible: true },
          { prop: 'pathName', label: '上级目录', type: 'text', visible: true },
          { prop: 'documentName', label: '文件名称', type: 'text', visible: true },
          { prop: 'documentSuffix', label: '文件后缀', type: 'text', visible: true },
          { prop: 'statusTxt', label: '状态', type: 'text', visible: true },
          { prop: 'quoteCount', label: '被复制数', type: 'inlineTable', visible: true },
          { prop: 'documentSize', label: '文件大小', type: 'text', visible: true },
          { prop: 'createTime', label: '创建时间', type: 'text', visible: true },
          { prop: 'action', label: '操作', type: 'slot', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      configTree: {
        height: 700,
        edit: true,
        size: 30,
        nameHide: true
      },
      tabLoad: false,
      leftMore: false,
      uploadInfo: {},
      seeDialog: {
        visible: false,
        title: '被复制数',
        loading: false,
        id: ''
      },
      seeConfig: {
        tableData: [],
        tableColumns: [
          { prop: 'materialType', label: '素材类型', type: 'text', visible: true },
          { prop: 'materialName', label: '素材库文件名称', type: 'text', visible: true },
          { prop: 'createTime', label: '素材库复制时间', type: 'text', visible: true }
        ],
        pageSizes: [10, 20, 50, 200],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      editNameDialog: {
        visible: false,
        title: '编辑文件名称',
        loading: false
      },
      treeDialog: {
        visible: false,
        title: '',
        loading: false,
        btnText: '',
        openType: '',
        moreType: ''
      },
      configTreeDialog: {
        height: 500,
        edit: false,
        size: 20,
        nameHide: false
      },
      seePhoto: {
        visible: false,
        title: '',
        loading: false,
        src: '',
        preview: []
      },
      slotArr: ['headerLeft', 'action', 'footer', 'contentName', 'shelveFlag'],
      editNameForm: {
        name: ''
      },
      editNameRules: {
        name: [
          {
            required: true,
            message: '请输入文件名称',
            trigger: 'blur'
          }
        ]
      },
      multipleSelection: [],
      selectCatalog: '',
      fileId: '',
      originalId: '',
      catalogueId: '',
      pathName: '', // 路径名称
      documentDes: '',
      coverStatus: true // 鉴别是否校验存在文件
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    // 要进行函数卸载
  },
  methods: {
    handleChange(file, fileList) {
      console.log(file, fileList)
    },
    // 获取列表数据
    getList() {
      this.tabLoad = true
      const params = {
        dirId: this.selectCatalog.id,
        status: this.search.status, // 状态
        documentName: this.search.documentName, // 文件名称
        pageIndex: this.config.currentPage,
        pageSize: this.config.pageSize
      }
      documentPage(params)
        .then((res) => {
          this.tabLoad = false
          res.data.items.map((v, i) => {
            v.createTime = v.createTime ? parseTime(new Date(v.createTime).getTime(), '{y}-{m}-{d} {h}:{i}') : '——'
            v.status === 1 ? (v['statusTxt'] = '公开') : (v['statusTxt'] = '不公开')
            v.documentSize = this.getFileSize(v.documentSize)
          })
          this.config.tableData = res.data.items
          this.config.total = res.data.total
        })
        .catch(() => {
          this.tabLoad = false
        })
    },
    getFileSize(size) {
      //  if (size < 0.1 * 1024) {
      //   // 小于0.1KB，则转化成B
      //   size = size.toFixed(2) + 'B'
      // }
      if (size < 0.1 * 1024 * 1024) {
        // 小于0.1MB，则转化成KB
        size = (size / 1024).toFixed(2) + 'KB'
      } else if (size < 1 * 1024 * 1024 * 1024) {
        // 小于1GB，则转化成MB
        size = (size / (1024 * 1024)).toFixed(2) + 'MB'
      } else {
        // 其他转化成GB
        size = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }
      // 转成字符串
      const sizeStr = size + ''
      // 获取小数点处的索引
      const index = sizeStr.indexOf('.')
      // 获取小数点后两位的值
      const dou = sizeStr.substr(index + 1, 2)

      // 判断后两位是否为00，如果是则删除00
      if (dou === '00') return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      return size
    },
    getSeeList() {
      this.seeDialog.loading = true
      console.log('seeConfig', this.seeConfig)
      const currentPage = this.seeConfig.currentPage
      const pageSize = this.seeConfig.pageSize
      const formdata = new FormData()
      formdata.append('id', this.seeDialog.id)
      formdata.append('pageIndex', currentPage)
      formdata.append('pageSize', pageSize)
      quotePage(formdata)
        .then((res) => {
          res.data.items.map((v) => {
            if (v.materialType === 0) {
              v.materialType = '图片'
            } else if (v.materialType === 1) {
              v.materialType = '音频'
            } else if (v.materialType === 2) {
              v.materialType = '视频'
            } else if (v.materialType === 4) {
              v.materialType = '文档'
            }
            v.createTime = v.createTime ? parseTime(new Date(v.createTime).getTime(), '{y}-{m}-{d} {h}:{i}') : '——'
          })
          this.seeConfig.tableData = res.data.items
          this.seeConfig.total = res.data.total
          this.seeDialog.loading = false
        })
        .catch(() => {
          this.seeDialog.loading = false
        })
    },
    // 内容切换
    handleMenuSelect(key) {
      this.activeIndex = key
    },
    onSearch() {
      this.config.pageSize = 10
      this.config.currentPage = 1
      this.getList()
    },
    // 上传文件
    uploadDocument(params) {
      uploadDocument(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getList()
        })
        .catch(() => { })
    },
    // 覆盖文件
    coverDocument(params) {
      coverDocument(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            type: 'success',
            message: '覆盖成功!'
          })
          this.getList()
        })
        .catch(() => { })
    },
    // 更改名称
    updateDocument(params) {
      updateDocument(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            type: 'success',
            message: '更改成功!'
          })
          this.editNameDialog.visible = false
          this.getList()
        })
        .catch(() => { })
    },
    // 更改状态
    statusDocument(params) {
      statusDocument(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getList()
        })
        .catch(() => { })
    },
    // 删除
    delDocument(params) {
      delDocument(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$refs.fileTable.clearSelection()
          this.multipleSelection = []
          this.getList()
        })
        .catch(() => { })
    },
    // 复制
    copyDocument(params) {
      copyDocument(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.clearTreeDialog()
        })
        .catch(() => { })
    },
    // 移动
    moveDocument(params) {
      moveDocument(params)
        .then((res) => {
          console.log(res, 'res')
          this.$message({
            type: 'success',
            message: '移动成功!'
          })
          this.clearTreeDialog()
        })
        .catch(() => { })
    },
    // 修改列表操作区更多之前
    beforeHandleCommand(index, row, command) {
      return {
        index: index,
        row: row,
        command: command
      }
    },
    // 修改列表操作区更多
    handleCommand(command) {
      this.fileId = command.row.id
      this.originalId = command.row.catalogId // 原文件夹id
      switch (command.command) {
        case 'a': // 覆盖
          this.handleCover(command.index, command.row)
          break
        case 'b': // 移动
          this.handleMove(command.index, command.row)
          break
        case 'c': // 复制
          this.handleCopy(command.index, command.row)
          break
        case 'd': // 公开
          this.handlePublicStatus(command.index, command.row)
          break
        case 'e': // 文件名称修改
          // 修改文件名称
          this.editNameForm.name = command.row.documentName
          this.editNameDialog.visible = !this.editNameDialog.visible
          break
        case 'f': // 删除
          this.handleDel(command.index, command.row)
          break
      }
    },
    // 文件夹详情
    detailCatalog() {
      const id = this.selectCatalog.id
      detailCatalog(id)
        .then((res) => {
          this.pathName = res.data.pathName + '->' + this.selectCatalog.catalogName
        })
        .catch(() => { })
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
    // 查询文件是否重复
    async checkFile(params, callback, file) {
      const that = this
      const res = await checkFile(params)
      const fileStatus = !!res.data
      if (fileStatus) {
        this.$confirm('此操作将对原文件覆盖上传, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const delParams = [res.data.id]
            that.delDocument(delParams)
            that.$refs.uploadOss.updateChangeFile(file)
          })
          .catch(() => {
            const fileName = res.data.documentName + '.' + res.data.documentSuffix
            that.$refs.uploadOss.updateChangeFile(file, fileName)
          })
      }
      callback(fileStatus)
    },
    getFileAVDes(file) {
      // 获取时长
      let duration = ''
      if (file.type.includes('video')) {
        const fileUrl = URL.createObjectURL(file)
        const videoEl = document.createElement('VIDEO')
        videoEl.src = fileUrl
        videoEl.setAttribute('crossOrigin', 'Anonymous')
        videoEl.setAttribute('controls', 'controls')
        videoEl.setAttribute('autoplay', 'autoplay')
        videoEl.volume = 0
        videoEl.addEventListener('loadeddata', async () => {
          duration = videoEl.duration || 0 // 时长
          this.documentDes = duration
        })
      } else {
        const url = URL.createObjectURL(file)
        const audioElement = new Audio(url)
        audioElement.addEventListener('loadedmetadata', (_event) => {
          duration = parseInt(audioElement.duration || 0)
          this.documentDes = duration
        })
      }
    },
    getFileImg(file) {
      const that = this
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function(theFile) {
        const image = new Image()
        image.src = theFile.target.result
        image.onload = function () {
          const materialDes = `${this.width || 0}*${this.height || 0}`
          that.documentDes = materialDes
        }
      }
    },
    getFileDes(file) {
      const filePath = file.name // 文件路径
      const index = filePath.lastIndexOf('.') // 获取最后一个.的位置
      this.documentDes = filePath.substr(index + 1) // 获取后缀
    },
    ossBeforeUpload(file) {
      return new Promise((resolve, reject) => {
        const GIGABYTE = Math.pow(1024, 3)
        const MAX_SIZE = 60 * GIGABYTE
        const isLt60G = file.size < MAX_SIZE
        if (!isLt60G) {
          this.$message.error('上传文件大小不能超过 60G!')
        }
        file.type.includes('video') || file.type.includes('audio') ? this.getFileAVDes(file) : ''
        file.type.includes('image') ? this.getFileImg(file) : ''
        !file.type.includes('video') && !file.type.includes('audio') && !file.type.includes('image') ? this.getFileDes(file) : ''
        if (this.coverStatus) {
          const filePath = file.name // 文件路径
          const index = filePath.lastIndexOf('.') // 获取最后一个.的位置
          const documentName = filePath.substr(0, index)
          const params = {
            documentName,
            id: this.selectCatalog.id
          }
          this.checkFile(
            params,
            function (res) {
              if (res) {
                reject(isLt60G && !res)
              } else {
                resolve(isLt60G && !res)
              }
            },
            file
          )
        } else {
          this.coverStatus = true
          resolve(isLt60G)
        }
      })
      // 返回false不会自动上传
    },
    ossUploadSuccess(data) {
      console.log(data)
      const dirId = this.selectCatalog.id
      const id = this.fileId
      const uploadFileType = this.uploadFileType
      const filePath = data.name // 文件路径
      const index = filePath.lastIndexOf('.') // 获取最后一个.的位置
      const documentSuffix = filePath.substr(index + 1)
      const documentName = filePath.substr(0, index)
      const documentDes = this.documentDes
      const documentFrameUrl = data.file.type.includes('video') ? `${data.src}?x-oss-process=video/snapshot,t_10000,m_fast` : ''
      if (uploadFileType) {
        const params = {
          dirId,
          documentSuffix,
          documentName,
          documentSize: data.size,
          documentUrl: data.src,
          documentDes,
          documentFrameUrl
        }
        this.uploadDocument(params)
      } else {
        const params = {
          id,
          dirId,
          documentSuffix,
          documentName,
          documentSize: data.size,
          documentUrl: data.src,
          documentDes,
          documentFrameUrl
        }
        this.coverDocument(params)
      }
    },
    onClickUploadFile(type) {
      this.detailCatalog()
      this.uploadFileType = type
      this.visibleDialogOssUpload = !this.visibleDialogOssUpload
    },
    getFileList(e) {
      this.selectCatalog = e
      this.config.currentPage = 1
      this.getList()
    },
    getCatalogue(e) {
      this.catalogueId = e.id
    },
    onClickSee(id) {
      this.seeDialog.visible = true
      this.seeDialog.id = id
      this.getSeeList()
    },
    handleListSeeSizeChange(val) {
      this.seeConfig.pageSize = val
      this.seeConfig.currentPage = 1
      this.getSeeList()
    },
    handleSeeCurrentChange(val) {
      this.seeConfig.currentPage = val
      this.getSeeList()
    },
    handleListSeeSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(val.length === this.config.tableData.length)
      this.multipleSelection = val
      // this.getList()
    },
    // 转换大小写type true转大写 反之取小写
    convertCase(arr, type) {
      arr.map((v) => {
        type ? arr.push(v.toUpperCase()) : arr.push(v.toLowerCase())
      })
      return arr
    },
    // 查看
    onClickSees(row) {
      const objFormat = {
        video: ['mp4', 'mov', 'fly', 'm2v', 'hls', 'mkv'],
        audio: ['mp3', 'wav', 'wmv', 'aac', 'ogg', 'mpc', 'amr'],
        text: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
        image: ['git', 'jpg', 'jpeg', 'png', 'webp']
      }
      if (this.convertCase(objFormat.video, true).indexOf(row.documentSuffix) > -1) {
        this.playVideo(row.documentUrl)
      } else if (this.convertCase(objFormat.audio, true).indexOf(row.documentSuffix) > -1) {
        this.play(row.documentUrl)
      } else if (this.convertCase(objFormat.text, true).indexOf(row.documentSuffix) > -1) {
        this.openFile(row.documentUrl)
      } else if (this.convertCase(objFormat.image, true).indexOf(row.documentSuffix) > -1) {
        this.openPhoto(row.documentUrl, row.documentName)
      } else {
        window.open(row.documentUrl, '_blank')
      }
    },
    openPhoto(url, title) {
      this.seePhoto.visible = true
      this.seePhoto.title = title
      this.seePhoto.src = url
      this.seePhoto.preview = [url]
    },
    openFile(src) {
      // 打开文件
      window.open('https://view.officeapps.live.com/op/view.aspx?src=' + src, '_blank')
    },
    play(src) {
      // 播放音频
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
    },
    // 下载文件
    downloadFile(row) {
      console.log('测试下载')
      this.handleBrowserDownload(row.documentUrl, row.documentName)
    },
    // 浏览器下载文件
    handleBrowserDownload(link, fileName) {
      const x = new XMLHttpRequest()
      x.open('GET', link, true)
      x.responseType = 'blob'
      x.onload = (e) => {
        const url = window.URL.createObjectURL(x.response)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
      }
      x.send()
    },
    handleCover(index, row) {
      // 覆盖
      console.log(index)
      console.log(row)
      this.coverStatus = false
      this.onClickUploadFile(false)
    },
    handleMove(index, row) {
      // 移动
      console.log(index)
      console.log(row)
      this.treeDialog.visible = true
      this.treeDialog.title = '移动文件'
      this.treeDialog.btnText = '确定移动'
      this.treeDialog.openType = true
      this.treeDialog.moreType = false
    },
    handleMoveArray() {
      this.treeDialog.visible = true
      this.treeDialog.title = '移动文件'
      this.treeDialog.btnText = '确定移动'
      this.treeDialog.openType = true
      this.treeDialog.moreType = true
      const multipleSelection = this.multipleSelection
      console.log('multipleSelection', multipleSelection)
    },
    handleCopy(index, row) {
      // 复制
      console.log(index)
      console.log(row)
      this.treeDialog.visible = true
      this.treeDialog.title = '复制文件'
      this.treeDialog.btnText = '确定复制'
      this.treeDialog.openType = false
      this.treeDialog.moreType = false
    },
    handleCopyArray() {
      // 复制
      this.treeDialog.visible = true
      this.treeDialog.title = '复制文件'
      this.treeDialog.btnText = '确定复制'
      this.treeDialog.openType = false
      this.treeDialog.moreType = true
    },
    handlePublicStatus(index, row) {
      // 公开 切换
      console.log(index)
      console.log(row)
      const statusTxt = row.status === 0 ? '公开' : '不公开'
      this.$confirm(`此操作将${statusTxt}该文件, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: row.id,
            status: row.status === 0 ? 1 : 0
          }
          console.log('状态切换', params)
          this.statusDocument(params)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleDel(index, row) {
      // 删除
      console.log(index)
      console.log(row)
      const toastText =
        row.quoteCount > 0 ? '已被素材库复制是否删除，确认后删除到回收站' : '是否删除，确认后删除到回收站'
      this.$confirm(toastText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = [row.id]
          this.delDocument(params)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleDelArray() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = []
          this.multipleSelection.map((v, i) => {
            console.log(v)
            params.push(v.id)
          })
          this.delDocument(params)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    submitFileNameForm() {
      this.$refs.editNameForm.validate((valid) => {
        if (!valid) return
        const params = {
          documentName: this.editNameForm.name,
          id: this.fileId
        }
        console.log(params)
        this.updateDocument(params)
        console.log('this.editNameForm', this.editNameForm)
      })
    },
    submitFileLocationForm() {
      const dirId = this.catalogueId
      let documentBatchParams = []
      if (this.treeDialog.moreType) {
        this.multipleSelection.map((v, i) => {
          console.log(v)
          documentBatchParams.push({
            dirId: v.catalogId,
            id: v.id
          })
        })
      } else {
        documentBatchParams = [
          {
            dirId: this.originalId,
            id: this.fileId
          }
        ]
      }
      const params = {
        dirId,
        documentBatchParams
      }
      console.log('params', params)
      this.treeDialog.openType ? this.moveDocument(params) : this.copyDocument(params)
    },
    // 重置树选择弹窗
    clearTreeDialog() {
      this.$refs.fileTable.clearSelection()
      this.multipleSelection = []
      this.getList()
      this.treeDialog = {
        visible: false,
        title: '',
        loading: false,
        btnText: '',
        openType: '',
        moreType: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.course-doc-wrap {
  background: #ffffff;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.08),
    0px 1px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px !important;
  .el-menu-header {
    border-radius: 8px 8px 0 0 !important;
    font-size: 16px;
    font-weight: bold;
    .el-menu-item {
      border-radius: 8px 8px 0 0 !important;
    }
    .is-active {
      color: #1890ff;
    }
  }
  .course-doc-box {
    display: flex;
    padding: 20px;
    .cd-l {
      position: relative;
      width: 372px;
      height: 740px;
      min-width: 372px;
      padding: 20px;
      margin-right: 22px;
      background: #ffffff;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      // ::-webkit-scrollbar {
      //   /* chrome */
      //   display: none;
      // }
    }
    .cd-r {
      flex: 1;
      height: 740px;
      position: relative;
      padding: 20px;
      background: #ffffff;
      border: 1px solid #e4e7ed;
      border-radius: 8px;
      overflow: hidden;
      .header-box {
        display: flex;
        justify-content: space-between;
        .upload-btn {
          width: 96px;
          height: 32px !important;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #161616;
        }
        .header-search {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #FFFFFF;
          background-color: #0091FF;
          border: none;
        }
      }
      .tab-box {
        height: 640px;
        max-height: 640px;
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 0;
        }
        ::-webkit-scrollbar {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
        }
        :hover ::-webkit-scrollbar-track-piece {
          cursor: pointer;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 0;
        }

        :hover::-webkit-scrollbar-thumb:hover {
          cursor: pointer;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.1);
          transition: color 0.2s ease;
        }

        :hover::-webkit-scrollbar-thumb:vertical {
          cursor: pointer;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.1);
          transition: color 0.2s ease;
        }
        .tab-box-btn {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #0C6FFF;
        }
      }
      .foot-box {
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 20px;
        display: flex;
        justify-content: space-between;
        .foot-l {
          a {
            margin-right: 10px;
          }
        }
        .foot-r {
        }
        .btn-link {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          // color: #0C6FFF;
        }
      }
      .no-select-file {
        position: absolute;
        z-index: 10;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        color: #919293;
        .icon-svg {
          color: '#606266';
          font-size: 288px;
        }
      }
      // element
      .el-dropdown-link {
        cursor: pointer;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0C6FFF;
        margin-left: 15px;
      }
      .el-icon-arrow-down {
        font-size: 12px;
        color: #0C6FFF;
      }
    }
  }
  .menu-box {
    display: flex;
    padding: 24px 20px 0 20px;
    border-bottom: 1px solid #E4E7ED;
    -webkit-user-select:none;/*webkit浏览器*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none;/*IE10*/
    user-select:none;
    .menu-info {
      margin-right: 32px;
      padding-bottom: 20px;
      border-radius: 1px;
      cursor: pointer;
      font-size: 16px;
    }
    .menu-active {
      color: #0C6FFF;
      border-bottom: 1px solid  #0C6FFF;
      transition:  border-bottom .1s;
    }
  }
}
.info-box {
  height: 600px;
}
.info-image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 480px;
  img {
    width: 200px;
    height: 200px;
  }
}
.edit-info-box {
  display: flex;
  align-items: center;
  padding: 20px;
  .info-title {
    padding-right: 10px;
  }

  .el-form {
    width: 100%;
  }
}
.tree-info-box {
  padding: 20px;
}
.footer {
  margin: 20px;
}
.dialog-oss-header {
  padding-bottom: 20px;
}
.dialog-oss-header-box {
  display: flex;
  margin-bottom: 8px;
  .dialog-oss-header-label {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }
  .dialog-oss-header-info {
    font-size: 14px;
    font-family: MicrosoftYaHei;
    color: #333333;
  }
  .dialog-oss-header-toast {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #999999;
  }
}
::v-deep .el-menu--horizontal > .el-menu-item.is-active {
  border: none;
}
::v-deep .el-dropdown-menu__item {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
::v-deep .el-dropdown-menu__item:hover, .el-dropdown-menu__item:focus {
  background-color: #F5F7FA;
  color: #0C6FFF;
  font-weight: bold;
}
::v-deep .el-table th > .cell {
  font-weight: bold;
  color: #777777;
  font-size: 15px;
}
::v-deep .el-table td {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
</style>
