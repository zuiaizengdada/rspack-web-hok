<template>
  <div class="Page_wrap">
    <div class="Page_layout_left">
      <AppTree
        ref="appTree"
        v-model="fileClass"
        :loading="treeLoading"
        @addHandle="addMaterialFn"
        @delHandle="delMaterialFn"
        @editHandle="editMaterialFn"
        @node-click="treeClick"
        @relationOffHandle="relationOff"
        @relationOnHandle="relationOn"
      />
    </div>

    <div class="Page_layout_right">
      <MPageLayout
        ref="MPageLayout"
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @handleSelectionChange="handleSelectionChange"
      >
        <div slot="action" slot-scope="{ row }">
          <el-button
            v-permission="['system:material:edit', permsList]"
            type="text"
            style="color: #2a75ed"
            @click="editName(row)"
          >重命名</el-button>
          <el-button
            v-permission="['web:material:down', permsList]"
            type="text"
            style="color: #2a75ed"
            @click="downFile(row)"
          >下载</el-button>
          <el-button
            v-permission="['system:material:edit', permsList]"
            type="text"
            style="color: #2a75ed"
            @click="moveStart(row)"
          >移动</el-button>
          <el-button
            v-permission="['system:material:remove', permsList]"
            type="text"
            style="color: red"
            @click="del(row)"
          >删除</el-button>
        </div>
        <div slot="headerLeft">
          <el-button
            v-permission="['system:material:add', permsList]"
            type="primary"
            @click.native="openUpFile"
          >上传文件</el-button>
          <el-button type="primary" :disabled="form.id ? false : true" @click="onClickSelect">选择课程文件</el-button>
        </div>
        <div slot="headerRight">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="w-300"
            unlink-panels
          />
          <el-input
            v-model="search"
            :placeholder="select == 1 ? '请输入文件名称' : '请输入课程名称'"
            class="w-300 m-l-10 m-r-10"
            clearable
            @keyup.enter.native="handerSearch"
            @clear="handerSearch"
          >
            <el-select slot="prepend" v-model="select" placeholder="请选择" class="w-100" @change="search = ''">
              <el-option label="素材" value="1" />
              <el-option label="所属课程" value="2" />
            </el-select>
          </el-input>

          <!-- <el-input v-model.trim="search" placeholder="请输入文件名称" clearable   class="w-200 m-r-10 m-l-10" @keyup.enter.native="handerSearch" /> -->
          <el-button type="primary" @click="handerSearch()">搜索</el-button>
          <!-- <el-button   icon="el-icon-refresh" @click="init()" /> -->
        </div>

        <div slot="footer">
          <!-- <AppTableTools
            ref="tableTools"
            :tools="['批量删除', '批量移动', '全部移动']"
            @onAllChange="onAllChange"
            @onClick="allChange"
          /> -->
          <el-button v-permission="['system:material:remove', permsList]" @click="allChange(0)">批量删除</el-button>
          <el-button v-permission="['system:material:edit', permsList]" @click="allChange(1)">批量移动</el-button>
          <el-button v-permission="['system:material:edit', permsList]" @click="allChange(2)">全部移动</el-button>
        </div>

        <div slot="materialName" slot-scope="scope">
          <div class="AudioViewer">
            <img
              v-if="['xls', 'xlsx', 'cvs', 'xlsm'].includes(scope.row.materialName.split('.').pop().toLowerCase())"
              src="@/assets/image/pdf.png"
              fit="contain"
              class="size-icon"
            />
            <img
              v-else-if="['ppt', 'pptx'].includes(scope.row.materialName.split('.').pop().toLowerCase())"
              src="@/assets/image/ppt.png"
              fit="contain"
              class="size-icon"
            />
            <img
              v-else-if="['doc', 'docx', 'pdf'].includes(scope.row.materialName.split('.').pop().toLowerCase())"
              src="@/assets/image/ppt2.png"
              fit="contain"
              class="size-icon"
            />
            <img
              v-else-if="['word'].includes(scope.row.materialName.split('.').pop().toLowerCase())"
              src="@/assets/image/word.png"
              fit="contain"
              class="size-icon"
            />
            <img
              v-else-if="['txt'].includes(scope.row.materialName.split('.').pop().toLowerCase())"
              src="@/assets/image/txt.png"
              fit="contain"
              class="size-icon"
            />
            <img v-else src="@/assets/image/weizhigeshi.png" fit="contain" class="size-icon" />
            <div class="m-l-10">
              <div class="text_hidden" @click="openFile(scope.row)">{{ scope.row.materialName }}</div>
            </div>
          </div>
        </div>

        <div slot="materialSize" slot-scope="{ row }">
          {{ row.materialSize | filterSize }}
        </div>
      </MPageLayout>
    </div>

    <el-dialog title="移动分组" :visible.sync="moveDialog" width="480px">
      <div class="fl fl_ai_c">
        <span class="m-r-10">移动到分组:</span>
        <AppTreeSelect v-model="formMove.name" :data="treeSelectData" @change="(e) => (formMove.id = e)" />
      </div>
      <span slot="footer" class="dialog-footer m-t-10">
        <el-button @click="moveDialog = false">取 消</el-button>
        <el-button type="primary" @click="moveSure">确 定</el-button>
      </span>
    </el-dialog>
    <course-doc
      v-if="courseDoc.visible"
      :data="courseDoc"
      :selected-data="selectedData"
      material-type="4"
      @selectDataFn="selectDataFn"
    />
  </div>
</template>

<script>
import AppTree from '@/components/AppTree'
import courseDoc from '../components/courseDoc/index.vue'
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import { mapGetters } from 'vuex'
import AppTreeSelect from '@/components/AppTreeSelect'
import { DateFormat, download } from '@/utils'
// import { uploadByPieces } from '@/utils/upload'
import { addMaterial, delMaterial, editMaterial, relationOn, relationOff } from '@/api/course'
import { uploadFile } from '@/api/file'
import axios from 'axios'
import { getSourceFileUrl } from '@/api/file'
import { material, materialPage, materialupdateBatch, deleteBatch, materialUpdate } from '@/api/course'
export default {
  components: {
    AppTree,
    // AppTableTools,
    AppTreeSelect,
    courseDoc
  },
  data() {
    return {
      materialType: 4,
      loading: false,
      search: '', // 搜索关键词
      time: '', // 搜索时间
      select: '1', // 搜索分类
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'materialName', 'materialSize'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'materialName', label: '文件名', type: 'slot' },
          { prop: 'materialSize', label: '大小', type: 'slot', width: '80' },
          { prop: 'createTime', label: '上传时间', type: 'text', width: '180' },
          // { prop: 'quoteNum', label: '引用', type: 'text', width: '80' },
          { prop: 'action', label: '操作', type: 'slot', width: '240' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0,
        multipleSelection: []
      },
      // 上传弹框
      dialogVisible: false,
      // 上传文件数据的form
      form: {
        name: '',
        id: ''
      },
      // 移动分组的form
      formMove: {
        name: '',
        id: '',
        row: [] // 当前点击的列
      },
      moveDialog: false, // 移动分组弹框
      treeLoading: false,
      fileList: [],
      dialogLoading: false, // 上传弹框loading
      CancelToken: axios.CancelToken,
      permsList: this.$route.meta.permsList || [],
      courseDoc: {
        visible: false,
        title: '选择课程文件',
        loading: false
      },
      selectedData: []
    }
  },
  computed: {
    ...mapGetters(['fileClass']),
    treeSelectData() {
      if (this.fileClass.length > 0) {
        return this.fileClass[0].children
      } else {
        return []
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
      this.config.pageSize = val
      this.config.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.config.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      // this.$refs.tableTools.handleChangeType(this.config.tableData.length !== 0 && val.length === this.config.tableData.length)
      this.multipleSelection = val
    },
    getList() {
      this.loading = true
      let startTime = ''
      let endTime = ''
      if (this.time) {
        startTime = DateFormat(this.time[0], 'yyyy-MM-dd')
        endTime = DateFormat(this.time[1], 'yyyy-MM-dd')
      }
      const params = {
        dirId: this.form.id,
        startTime,
        endTime,
        materialName: this.search,
        current: this.config.currentPage,
        size: this.config.pageSize,
        materialType: this.materialType
      }
      if (!this.form.id || this.form.id === '-1') {
        delete params.dirId
      }
      materialPage(params)
        .then((res) => {
          if (res.data) {
            console.log(res)
            this.loading = false
            this.config.tableData = res.data.records
            this.config.total = res.data.total
            this.$refs.appTree && this.$refs.appTree.setCurrentKey(this.form.id)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.getList()
      // this.$refs.tableTools.handleChangeType(false)
    },
    handerSearch() {
      this.config.currentPage = 1
      this.getList()
    },

    // 底部上架下架删除按钮点击事件
    allChange(index) {
      console.log(index, 'index')
      switch (index) {
        case 0:
          this.BulkDel()
          break
        case 1:
          this.BulkMove()
          break
        case 2:
          this.allMove()
          break
      }
    },
    // 底部选中本页
    onAllChange(e) {
      if (e) {
        this.$refs.MPageLayout.handletoggleSelectionAll()
      } else {
        this.$refs.MPageLayout.clearSelection()
      }
    },
    // 点击打开文件
    play(row) {
      if (row.materialId) {
        this.loading = true
        const params = {
          materialId: row.materialId
        }
        getSourceFileUrl(params)
          .then((res) => {
            this.loading = false
            this.$AppAudio({
              visible: true,
              src: res.data
            })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 点击下载文件
    downFile(row) {
      console.log(row, 'row')
      download(row.materialUrl, row.materialName)
      // window.location.href = row.materialUrl
    },
    // 新增分类
    addMaterialFn(v, data) {
      this.treeLoading = true
      const parentDirId = data.id === '-1' ? '' : data.id
      const param = {
        dirName: v,
        dirType: 4,
        parentDirId
      }
      addMaterial(param)
        .then((res) => {
          return this.$store.dispatch('option/getClass')
        })
        .then(() => {
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    // 删除分类
    delMaterialFn(data) {
      this.treeLoading = true
      delMaterial(data.id)
        .then((res) => {
          return this.$store.dispatch('option/getClass')
        })
        .then(() => {
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    // 编辑分类
    editMaterialFn(v, data) {
      this.treeLoading = true
      const param = {
        dirId: data.id,
        dirName: v
      }
      editMaterial(param)
        .then((res) => {
          return this.$store.dispatch('option/getClass')
        })
        .then(() => {
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    onBeforeUploadFile(file) {
      console.log(file, 'file')
      var fileExtension = file.name.split('.').pop().toLowerCase()
      console.log(fileExtension, 'fileExtension')
      if (!['pdf', 'ppt', 'pptx', 'xls', 'txt', 'doc', 'csv', 'docx', 'xlsm', 'xlsx'].includes(fileExtension)) {
        this.$message.error('请上传符合格式的文件')
        return false
      }
      // 限制上传文件大小 100M
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isLt100M) {
        this.$message.error('上传文件大小不能超过 100MB!')
        this.fileList = []
      }
      return isLt100M
    },
    // 点击上传文件弹框确定按钮
    sureSend(list) {
      this.loading = true
      const param = {
        list: list
      }
      material(param)
        .then((res) => {
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 移除文件
    removeImg(i) {
      this.fileList.splice(i, 1)
    },
    // 点击打开上传文件
    openUpFile() {
      this.$AppUploadImagAndFile({
        treeSelectData: this.treeSelectData,
        visible: true,
        type: 2,
        accept: '.pdf,.ppt,.xls,.txt,.doc,.csv,.xlsx,.pptx,.docx,.xlsm',
        beforeUpload: this.onBeforeUploadFile,
        form: this.form,
        tips: '支持上传100MB以内的pptx、ppt、docx、doc、xls、xlsx、pdf、csv、xlsm、txt格式文档，一次最多上传100个文件',
        success: (res, form) => {
          // this.form = form
          this.getList()
          // this.sureSend(res)
        }
      })
      // this.fileList = []
      // this.dialogVisible = true
      // if (this.fileClass.length > 0 && this.form.id === '') {
      //   this.form.id = this.fileClass[0].children[0].id
      //   this.form.name = this.fileClass[0].children[0].dirName
      // }
      // console.log(this.form)
    },
    // 分组点击触发
    treeClick(data, node) {
      console.log(data, node)
      this.form.id = data.id === '-1' ? '' : data.id
      this.form.name = data.dirName
      this.init()
    },
    // 操作栏 -- 点击列表移动
    moveStart(row) {
      this.moveDialog = true
      if (this.fileClass.length > 0) {
        this.formMove.id = this.fileClass[0].children[0].id
        this.formMove.name = this.fileClass[0].children[0].dirName
      }
      this.formMove.row = [row.materialId]
    },
    // 操作栏 -- 移动
    moveSure() {
      console.log(this.formMove)
      this.moveDialog = false
      this.loading = true
      const param = { dirId: this.formMove.id, materialIds: this.formMove.row }
      materialupdateBatch(param)
        .then((res) => {
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 操作栏 -- 删除
    del(row) {
      const that = this
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          console.log('删除')
          that.loading = true
          const param = {
            materialIds: [row.materialId]
          }
          deleteBatch(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              that.loading = false
            })
        }
      })
    },
    // 工具栏
    // 批量删除
    BulkDel() {
      console.log(this.multipleSelection)
      if (this.multipleSelection.length < 1) {
        return this.$message.warning('请选择素材')
      }
      const that = this
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          console.log('删除')
          that.loading = true
          const materialIds = []
          this.multipleSelection.map((v) => materialIds.push(v.materialId))
          const param = {
            materialIds: materialIds
          }
          deleteBatch(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 批量移动
    BulkMove() {
      if (this.multipleSelection.length < 1) {
        return this.$message.warning('请选择素材')
      }
      this.moveDialog = true
      this.formMove.row = []
      this.multipleSelection.map((v) => this.formMove.row.push(v.materialId))
      if (this.fileClass.length > 0) {
        this.formMove.id = this.fileClass[0].children[0].id
        this.formMove.name = this.fileClass[0].children[0].dirName
      }
    },
    // 全部移动
    allMove() {
      this.moveDialog = true
      // const materialIds = []
      this.formMove.row = []
      this.config.tableData.map((v) => this.formMove.row.push(v.materialId))
      if (this.fileClass.length > 0) {
        this.formMove.id = this.fileClass[0].children[0].id
        this.formMove.name = this.fileClass[0].children[0].dirName
      }
    },
    // 取消上传
    cancelRequest(row) {
      row.source.cancel('cancel')
    },
    // 点击重命名
    editName(row) {
      const that = this
      this.$AppEditName({
        title: '请输入素材名称',
        maxlength: 30,
        defaultValue: row.materialName,
        success: (value) => {
          const param = {
            dirId: row.dirId,
            materialId: row.materialId,
            materialName: value,
            materialUrl: row.materialUrl,
            materialDes: row.materialDes
          }
          return materialUpdate(param)
            .then((res) => {
              that.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    againUpload(row, index) {
      this.fileList[index].statue = '上传中'
      this.fileList[index].percent = 0
      this.fileList[index].source = this.CancelToken.source()
      const that = this
      return uploadFile(
        row.formData,
        (progressEvent) => {
          const percent = ((progressEvent.loaded / progressEvent.total) * 100) | 0
          // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          if (percent === 100) {
            this.fileList[index].percent = 99
          } else {
            this.fileList[index].percent = percent
          }
        },
        this.fileList[index].source.token
      )
        .then((res) => {
          if (res.data) {
            this.fileList[index].percent = 100
            that.fileList[index].materialUrl = res.data.url
            that.fileList[index].statue = '已完成'
          }
        })
        .catch(() => {
          that.fileList[index].statue = '失败'
          // this.removeImg(index)
        })
    },
    openFile(row) {
      const url = 'https://view.officeapps.live.com/op/view.aspx?src=' + row.materialUrl
      window.open(url)
    },
    onClickSelect() {
      console.log('文件')
      this.courseDoc.visible = true
    },
    // 选中引用
    selectDataFn(e) {
      const dirId = this.form.id
      this.selectedData = e
      const list = []
      this.selectedData.map((v) => {
        list.push({
          courseId: v.id,
          dirId,
          materialDes: '', // 文件描述 如视频音频描述时长【00:00:19】 图片描述大小【1240*480】
          materialFrameUrl: '', // 视频首帧图片url【material_type=2传入】
          materialName: v.documentName + '.' + v.documentSuffix,
          materialSize: v.documentSize,
          materialType: 4,
          materialUrl: v.documentUrl,
          videoId: '' // 音/视频ID
        })
      })
      this.sureSend(list)
    },
    // 老师关联
    relationOff(e) {
      console.log(e)
      this.treeLoading = true
      const param = {
        dirId: e.data.dirId,
        teacherId: e.teacherId
      }
      relationOff(param)
        .then((res) => {
          res.code === 1 ? this.$refs.appTree.clearRelationIofo() : ''
          return this.$store.dispatch('option/getClass')
        })
        .then(() => {
          this.treeLoading = false
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    relationOn(e) {
      const that = this
      this.$delModal({
        tips: '确定取消关联?',
        success: () => {
          this.treeLoading = true
          relationOn(e.dirId)
            .then((res) => {
              res.code === 1 ? this.$notify({ title: '成功', message: '取消关联成功！', type: 'success' }) : ''
              return that.$store.dispatch('option/getClass')
            })
            .then(() => {
              that.treeLoading = false
            })
            .catch(() => {
              that.treeLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Page_wrap {
  height: calc(100% - 50px);
  width: 100%;
  display: flex;
  padding: 20px;
  .Page_layout_left {
    width: 300px;
    // background-color: pink;
    overflow: auto;
    border: 1px solid #ebebeb;
    border-radius: 4px;
    min-width: 300px;
  }
  .Page_layout_right {
    flex: 1;
    overflow-y: auto;
  }
  .AudioViewer {
    display: flex;
    align-items: center;
    .size-icon {
      width: 40px;
      min-width: 40px;
      height: 40px;
      cursor: pointer;
    }
  }

  .font_msg {
    font-size: 12px;
    font-weight: 400;
    color: #999;
  }

  .form-upload {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  .upload-demo {
    width: 100%;
    ::v-deep .el-upload {
      width: 100%;
      .el-upload-dragger {
        width: 100%;
      }
    }
  }
}
</style>
