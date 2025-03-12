<template>
  <div class="Page_wrap">
    <div class="Page_layout_left">
      <AppTree
        ref="appTree"
        v-model="imageClass"
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
            v-permission="['system:material:edit', permsList]"
            type="text"
            style="color: #2a75ed"
            @click="cropper(row)"
          >裁剪</el-button>
          <el-button
            v-permission="['web:material:down', permsList]"
            type="text"
            style="color: #2a75ed"
            @click="downImage(row)"
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
            @click.native="openUpImg"
          >上传图片</el-button>
          <el-button v-permission="['system:material:addFile', permsList]" type="primary" :disabled="form.id ? false : true" @click="onClickSelect">选择课程文件</el-button>
        </div>
        <div slot="headerRight">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
          />
          <el-input
            v-model.trim="keyWord"
            placeholder="请输入图片名称"
            clearable
            class="w-200 m-r-10 m-l-10"
            @keyup.enter.native="handerSearch"
            @clear="handerSearch"
          />
          <el-button type="primary" size="small" @click="handerSearch()">搜索</el-button>
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
          <!-- <el-button type="danger" size="small">批量删除</el-button>
          <el-button size="small">批量移动</el-button>
          <el-button size="small">全部移动</el-button> -->
        </div>

        <div slot="materialName" slot-scope="scope">
          <div class="ImageViewer">
            <div class="imgUrl">
              <!-- 图片预览 -->
              <ImagePreviewer
                style="width: 100%; height: 100%"
                :src="scope.row.materialUrl"
                fit="contain"
                :preview-src-list="[scope.row.materialUrl]"
              />
            </div>

            <div class="m-l-10">
              <div class="text_hidden">{{ scope.row.materialName }}</div>
              <div class="font_msg">{{ scope.row.materialDes | filterDes }}</div>
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
      material-type="0"
      @selectDataFn="selectDataFn"
    />
  </div>
</template>

<script>
import AppTree from '@/components/AppTree'
// import AppImage from '@/components/AppImage'
import courseDoc from '../components/courseDoc/index.vue'
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import { mapGetters } from 'vuex'
import AppTreeSelect from '@/components/AppTreeSelect'
import { downLink, DateFormat, blobToBase64 } from '@/utils'
import { addMaterial, delMaterial, editMaterial, imgBase64, relationOn, relationOff } from '@/api/course'
import { uploadImg } from '@/api/file'
import { material, materialPage, materialupdateBatch, deleteBatch, materialUpdate } from '@/api/course'
export default {
  components: {
    AppTree,
    // AppTableTools,
    AppTreeSelect,
    courseDoc
    // AppImage
  },
  data() {
    return {
      loading: false,
      keyWord: '', // 搜索关键词
      time: ['', ''], // 搜索时间
      slotArr: ['headerRight', 'headerLeft', 'action', 'footer', 'materialName', 'materialSize'],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'materialName', label: '图片', type: 'slot' },
          { prop: 'materialSize', label: '大小', type: 'slot', width: '120' },
          { prop: 'createTime', label: '上传时间', type: 'text', width: '160' },
          { prop: 'action', label: '操作', type: 'slot' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      multipleSelection: [],
      // 上传弹框
      dialogVisible: false,
      // 上传图片数据的form
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
      dialogLoading: false,
      permsList: this.$route.meta.permsList || [],
      courseDoc: {
        visible: false,
        title: '选择课程文件',
        loading: false
      },
      selectedData: []
      // treeSelectData: []
    }
  },
  computed: {
    ...mapGetters(['imageClass']),
    // eslint-disable-next-line vue/no-dupe-keys
    treeSelectData() {
      if (this.imageClass.length > 0) {
        return this.imageClass[0].children
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
      console.log('选中环节', this.form.id)
      const params = {
        dirId: this.form.id,
        startTime,
        endTime,
        materialName: this.keyWord,
        current: this.config.currentPage,
        size: this.config.pageSize,
        materialType: 0
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
    // 点击下载图片
    downImage(row) {
      console.log(row, 'row')
      downLink(row.materialUrl, row.materialName)
    },
    // 新增分类
    addMaterialFn(v, data) {
      this.treeLoading = true
      const parentDirId = data.id === '-1' ? '' : data.id
      const param = {
        dirName: v,
        dirType: 3,
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
    // 文件上传
    UploadImage(param) {
      const that = this
      const formData = new FormData()
      formData.append('file', param.file)
      var MyTest = param.file
      var reader = new FileReader()
      reader.readAsDataURL(MyTest)
      that.fileList.push({
        loading: true
      })
      const index = that.fileList.length - 1
      const self = that.fileList[index]
      console.log(index, 'index')
      reader.onload = function (theFile) {
        var image = new Image()
        image.src = theFile.target.result
        image.onload = function () {
          return uploadImg(formData)
            .then((res) => {
              // const materialDes = {
              //   width: this.width,
              //   height: this.height
              // }
              // self.materialDes = JSON.stringify(materialDes)
              self.materialDes = `${this.width || 0}*${this.height || 0}`
              self.materialName = param.file.name
              self.materialType = 0
              self.materialUrl = res.data.url
              self.materialSize = param.file.size
              self.loading = false
            })
            .catch(() => {
              self.loading = false
            })
        }
      }
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    onBeforeUploadImage(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!')
      }
      return isIMAGE && isLt5M
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
    // 移除图片
    removeImg(i) {
      this.fileList.splice(i, 1)
    },
    // 点击打开上传图片
    openUpImg() {
      this.$AppUploadImagAndFile({
        treeSelectData: this.treeSelectData,
        visible: true,
        type: 1,
        accept: 'image/jpeg,image/png,image/jpg,image/gif,image/bmp',
        beforeUpload: this.onBeforeUploadImage,
        form: this.form,
        tips: '支持上传5MB以内的jpg、jpeg、png、gif、bmp格式图片，一次最多上传100个文件',
        success: (res, form) => {
          // this.form = form
          // this.sureSend(res)
          this.getList()
        }
      })
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
      if (this.imageClass.length > 0) {
        this.formMove.id = this.imageClass[0].children[0].id
        this.formMove.name = this.imageClass[0].children[0].dirName
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
      if (this.imageClass.length > 0) {
        this.formMove.id = this.imageClass[0].children[0].id
        this.formMove.name = this.imageClass[0].children[0].dirName
      }
    },
    // 全部移动
    allMove() {
      this.moveDialog = true
      // const materialIds = []
      this.formMove.row = []
      this.config.tableData.map((v) => this.formMove.row.push(v.materialId))
      if (this.imageClass.length > 0) {
        this.formMove.id = this.imageClass[0].children[0].id
        this.formMove.name = this.imageClass[0].children[0].dirName
      }
    },
    // 点击裁剪图片
    cropper(row) {
      let width = 200
      let height = 200
      if (row.materialDes) {
        width = row.materialDes.split('*')[0] || 200
        height = row.materialDes.split('*')[1] || 200
      }
      const that = this
      this.$AppImageCropper({
        visible: true,
        url: row.materialUrl,
        title: '裁剪图片',
        width,
        height,
        success: (data, obj) => {
          const materialDes = `${obj.width}*${obj.height}`
          // 图片上传
          blobToBase64(data)
            .then((res) => {
              return imgBase64({ base64Data: res })
            })
            .then((res) => {
              const obj = {
                dirId: row.dirId,
                // materialId: row.materialId,
                materialName: row.materialName,
                materialUrl: res.data.url,
                materialDes: materialDes,
                materialType: row.materialType,
                materialSize: data.size
              }
              const params = {
                list: [obj]
              }
              return material(params)
            })
            .then((res) => {
              that.getList()
            })
        }
      })
    },
    // 点击重命名
    editName(row) {
      console.log(row)
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
          return materialUpdate(param).then((res) => {
            that.getList()
          })
        }
      })
    },
    onClickSelect() {
      this.courseDoc.visible = true
    },
    // 选中引用
    selectDataFn(e) {
      console.log(e)
      const dirId = this.form.id
      this.selectedData = e
      console.log('选中目录', this.form.id)
      const list = []
      this.selectedData.map((v) => {
        list.push({
          courseId: v.id,
          dirId,
          materialDes: '', // 文件描述 如视频音频描述时长【00:00:19】 图片描述大小【1240*480】
          materialFrameUrl: '', // 视频首帧图片url【material_type=2传入】
          materialName: v.documentName + '.' + v.documentSuffix,
          materialSize: v.documentSize,
          materialType: 0,
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
    .imgUrl {
      background: #fafafa;
      width: 80px;
      height: 60px;
      max-width: 80px;
      min-width: 80px;
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
.imageBox {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
}
.imageView {
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
}
.close {
  position: absolute;
  right: -8px;
  top: -8px;
  cursor: pointer;
}
</style>
