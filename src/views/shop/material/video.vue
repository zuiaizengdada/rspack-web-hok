<template>
  <div class="Page_wrap">
    <div class="Page_layout_left">
      <AppTree
        ref="appTree"
        v-model="videoClass"
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
          <!-- <el-button v-permission="['web:material:down', permsList]" type="text" style="color: #2a75ed;" @click="downVideo(row)">下载</el-button> -->
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
            @click.native="openUpVideo"
          >上传视频</el-button>
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
            :placeholder="select == 1 ? '请输入视频名称' : '请输入课程名称'"
            class="w-300 m-l-10 m-r-10"
            clearable
            @clear="handerSearch"
            @keyup.enter.native="handerSearch"
          >
            <el-select slot="prepend" v-model="select" placeholder="请选择" class="w-100" @change="search = ''">
              <el-option label="素材" value="1" />
              <el-option label="所属课程" value="2" />
            </el-select>
          </el-input>

          <el-button type="primary" @click="handerSearch()">搜索</el-button>
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
          <div class="ImageViewer">
            <!-- <div class="videoImg">
              <img :src="scope.row.materialFrameUrl" @click="playVideo(scope.row)">
            </div> -->
            <ImagePreviewer
              :src="scope.row.materialFrameUrl"
              fit="contain"
              class="videoImg"
              @click.native="playVideo(scope.row)"
            />

            <div class="m-l-10">
              <div class="text_hidden" :title="scope.row.materialName">{{ scope.row.materialName }}</div>
              <div class="font_msg">{{ scope.row.materialDes | filterTime }}</div>
            </div>
          </div>
        </div>

        <div slot="materialSize" slot-scope="{ row }">
          {{ row.materialSize | filterSize }}
        </div>

        <div slot="quoteNum" slot-scope="{ row }">
          <span class="reference-location" @click="openQuote(row)">{{ row.quoteNum }}</span>
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

    <AppQuote :config="quote" />

    <!-- 下载进度弹框 -->
    <el-dialog
      title="下载中"
      :visible.sync="progressModal.visible"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="progressModalClose"
    >
      <el-progress :percentage="progressModal.progress" />
    </el-dialog>
    <course-doc
      v-if="courseDoc.visible"
      :data="courseDoc"
      :selected-data="selectedData"
      material-type="2"
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
import AppVideo from '@/components/AppVideo'
import { DateFormat, downVideo2 } from '@/utils'
import { addMaterial, delMaterial, editMaterial, relationOn, relationOff } from '@/api/course'
import { material, materialPage, materialupdateBatch, deleteBatch, materialUpdate } from '@/api/course'
import { getSourceFileUrl } from '@/api/file'
import axios from 'axios'
import AppQuote from '@/components/AppQuote'
export default {
  components: {
    AppTree,
    // AppTableTools,
    AppTreeSelect,
    AppQuote,
    courseDoc
  },
  filters: {
    filterSize: (mylimit) => {
      const limit = Math.abs(mylimit)
      if (!limit) return ''
      var size = ''
      if (limit < 0.1 * 1024) {
        // 如果小于0.1KB转化成B
        size = limit.toFixed(1) + 'B'
      } else if (limit < 0.1 * 1024 * 1024) {
        // 如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(1) + 'KB'
      } else if (limit < 0.1 * 1024 * 1024 * 1024) {
        // 如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(1) + 'MB'
      } else {
        // 其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(1) + 'GB'
      }
      var sizestr = size + ''
      var len = sizestr.indexOf('\.')
      var dec = sizestr.substr(len + 1, 2)
      if (dec === '00') {
        // 当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
      }
      return sizestr
    },
    filterTime: (time) => {
      if (!time) {
        return '00:00:00'
      }
      const result = parseInt(time)
      const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      const m =
        Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
      const s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)
      return h + ':' + m + ':' + s
    }
  },
  data() {
    return {
      loading: false,
      search: '',
      time: ['', ''], // 搜索时间
      select: '1', // 搜索分类
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'materialName', 'materialSize', 'quoteNum'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'materialName', label: '视频', type: 'slot' },
          { prop: 'materialSize', label: '大小', type: 'slot', width: '80' },
          { prop: 'createTime', label: '上传时间', type: 'text', width: '180' },
          { prop: 'quoteNum', label: '引用位置', type: 'slot', width: '80' },
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
      // 上传数据
      form: {
        id: '',
        label: '',
        name: ''
      },
      treeLoading: false,
      // 移动分组的form
      formMove: {
        name: '',
        id: '',
        row: [] // 当前点击的列
      },
      moveDialog: false, // 移动分组弹框
      quote: {
        visible: false,
        id: ''
      },
      // 下载进度弹框
      progressModal: {
        visible: false,
        progress: 0
      },
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
    ...mapGetters(['videoClass']),
    // eslint-disable-next-line vue/no-dupe-keys
    treeSelectData() {
      if (this.videoClass.length > 0) {
        return this.videoClass[0].children
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
        materialType: 2
      }
      if (!this.form.id || this.form.id === '-1') {
        delete params.dirId
      }
      materialPage(params)
        .then((res) => {
          if (res.data) {
            this.loading = false
            this.config.tableData = res.data.records
            this.config.total = res.data.total
            this.$refs.appTree && this.$refs.appTree.setCurrentKey(this.form.id)
          }
          // this.$refs.AppTree.
        })
        .catch(() => {
          this.loading = false
        })
    },
    init() {
      this.config.currentPage = 1
      this.search = ''
      this.getList()
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
      console.log(e, 'eeeee')
      if (e) {
        this.$refs.MPageLayout.handletoggleSelectionAll()
      } else {
        this.$refs.MPageLayout.clearSelection()
      }
    },
    // 点击播放视频
    playVideo(row) {
      console.log(row, '点击播放视频')
      if (row.courseId) {
        AppVideo.play({
          url: row.materialUrl
        })
      } else {
        if (row.materialId) {
          this.loading = true
          const params = {
            materialId: row.materialId
          }
          getSourceFileUrl(params)
            .then((res) => {
              this.loading = false
              AppVideo.play({
                url: res.data,
                materialId: row.materialId,
                poster: row.materialFrameUrl || ''
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
    // 新增分类
    addMaterialFn(v, data) {
      this.treeLoading = true
      const parentDirId = data.id === '-1' ? '' : data.id
      const param = {
        dirName: v,
        dirType: 1,
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
    onBeforeUploadVideo(file) {
      console.log(file)
      const isVideo =
        ['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov', 'video/quicktime'].indexOf(
          file.type
        ) === -1
      const isLT5G = file.size / 1024 / 1024 / 1024 < 5
      if (isVideo) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLT5G) {
        this.$message.error('视频大小不能超过5GB')
        return false
      }
    },
    // 点击上传视频弹框确定按钮
    sureSend(list) {
      this.loading = true
      const param = {
        list: list
      }
      material(param)
        .then((res) => {
          console.log(res, 'res')
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击打开上传视频
    openUpVideo() {
      this.$AppUpload({
        treeSelectData: this.treeSelectData,
        visible: true,
        type: 2,
        accept: 'video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb,video/mov,video/quicktime',
        beforeUpload: this.onBeforeUploadVideo,
        form: this.form,
        tips: '支持上传5GB以内的mp4、avi、wmv、mov、flv、rmvb、3gp、m4v、mkv、webm格式视频，一次最多上传100个文件',
        success: (res, form) => {
          // this.form = form
          // this.sureSend(res)
          this.getList()
        }
      })
    },
    // 分组点击触发
    treeClick(data, node) {
      // this.$refs.tableTools.handleChangeType(false)
      this.form.id = data.id === '-1' ? '' : data.id
      this.form.name = data.dirName
      this.init()
    },
    // 操作栏 -- 点击列表移动
    moveStart(row) {
      this.moveDialog = true
      if (this.videoClass.length > 0) {
        this.formMove.id = this.videoClass[0].children[0].id
        this.formMove.name = this.videoClass[0].children[0].dirName
      }
      this.formMove.row = [row.materialId]
    },
    // 操作栏 -- 移动
    moveSure() {
      console.log(this.formMove)
      this.moveDialog = false
      this.loading = true
      const param = {
        dirId: this.formMove.id,
        materialIds: this.formMove.row
      }
      materialupdateBatch(param).then((res) => {
        this.getList()
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
              that.loading = false
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
      if (this.videoClass.length > 0) {
        this.formMove.id = this.videoClass[0].children[0].id
        this.formMove.name = this.videoClass[0].children[0].dirName
      }
    },
    // 全部移动
    allMove() {
      this.moveDialog = true
      this.formMove.row = []
      this.config.tableData.map((v) => this.formMove.row.push(v.materialId))
      if (this.videoClass.length > 0) {
        this.formMove.id = this.videoClass[0].children[0].id
        this.formMove.name = this.videoClass[0].children[0].dirName
      }
    },
    downVideo(row) {
      console.log(row)
      if (row.materialId) {
        this.loading = true
        const params = {
          materialId: row.materialId
        }
        this.progressModal.progress = 0
        this.progressModal.visible = true
        this.progressModal.source = this.CancelToken.source()
        getSourceFileUrl(params)
          .then((res) => {
            this.loading = false
            downVideo2(res.data, row.materialName, (event) => {
              this.progressModal.progress = ((event.loaded / event.total) * 100) | 0
              console.log(event, '进度')
              if (event.loaded === event.total) {
                // 下载完成 loading = true
                this.progressModal.visible = false
              }
            })
              .then((res) => {
                this.progressModal.source.token
              })
              .catch(() => {
                this.progressModal.visible = false
              })
          })
          .catch((err) => {
            console.log(err)
            // this.progressModal.visible = false
            this.loading = false
          })
      }
    },
    progressModalClose() {
      console.log('取消上传,关闭弹框')
      this.progressModal.source.cancel('cancel')
    },
    // 取消上传
    cancelRequest(row) {
      console.log(row)
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
              that.loading = false
            })
        }
      })
    },
    // 打开引用位置弹框
    openQuote(row) {
      if (!row.quoteNum) {
        return
      }
      this.quote = {
        visible: true,
        id: row.materialId
      }
    },
    onClickSelect() {
      console.log('视频')
      this.courseDoc.visible = true
    },
    // 选中引用
    selectDataFn(e) {
      console.log(e)
      const dirId = this.form.id
      this.selectedData = e
      const list = []
      this.selectedData.map((v) => {
        list.push({
          courseId: v.id,
          dirId,
          materialDes: v.documentDes, // 文件描述 如视频音频描述时长【00:00:19】 图片描述大小【1240*480】
          materialFrameUrl: v.documentFrameUrl, // 视频首帧图片url【material_type=2传入】
          materialName: v.documentName + '.' + v.documentSuffix,
          materialSize: v.documentSize,
          materialType: 2,
          materialUrl: v.documentUrl,
          videoId: '' // 音/视频ID
        })
      })
      console.log('list', list)
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
  .ImageViewer {
    display: flex;
    align-items: center;

    .videoImg {
      width: 80px;
      min-width: 80px;
      height: 60px;
      background: rgb(245, 247, 250);
      cursor: pointer;
      > img {
        width: 100%;
        height: 100%;
      }
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

    .upload-text-tip {
      margin: 0 50px;
      text-align: left;
      line-height: 20px;
    }
  }
}

.videoBox {
  display: flex;
  flex-wrap: wrap;
  .videoView {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
    .imageView {
      position: relative;
      width: 100px;
      height: 100px;
      .el-upload-list {
        opacity: 0;
        position: absolute;
        width: 100px;
        top: 0;
        right: 0;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        cursor: pointer;
      }
      .el-upload-list:hover {
        opacity: 1;
      }
    }
  }
}
.reference-location {
  padding: 0 12px;
  font-size: 14px;
  color: #105cfb;
  cursor: pointer;
}
</style>
