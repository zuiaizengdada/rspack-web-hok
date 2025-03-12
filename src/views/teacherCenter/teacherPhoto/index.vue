<template>
  <div class="Page_wrap">
    <div class="Page_layout_left">
      <div class="search">
        <el-input
          v-model.trim="search"
          size="small"
          suffix-icon="el-icon-search"
          clearable
          placeholder="请输入老师姓名"
          @clear="searchFn"
          @keyup.enter.native="searchFn"
        />
      </div>

      <div class="tree">
        <el-scrollbar class="ss-scroll">
          <el-tree
            ref="tree"
            node-key="dirId"
            :highlight-current="true"
            style="width: 298px"
            :data="teacherList"
            :props="{
              children: 'children',
              label: 'dirName'
            }"
            :filter-node-method="filterNode"
            @node-click="treeClick"
          />
        </el-scrollbar>
      </div>
    </div>

    <div class="Page_layout_right">
      <div class="flex flex-between">
        <div class="ml-5">
          <el-button
            type="primary"
            @click.native="openUpImg"
          >上传图片</el-button>
          <el-button :disabled="!checkedList.length" :loading="downLoaing" type="primary" @click="batchDownImage">批量下载</el-button>
        </div>
        <div>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
          />
          <el-input
            v-model.trim="name"
            placeholder="请输入图片名称"
            clearable
            class="w-200 m-r-10 m-l-10"
            @keyup.enter.native="handerSearch"
            @clear="handerSearch"
          />
          <el-button
            type="primary"
            size="small"
            @click="handerSearch"
          >搜索</el-button>
          <el-button size="small" @click="handerclear">重置</el-button>
        </div>
      </div>
      <div v-loading="loading" class="lesson-list mt-2 ml-5">
        <el-empty
          v-if="list.length < 1"
          class="noData"
          :image-size="100"
          description="暂无数据"
        />
        <DynamicScroller
          v-else
          ref="DynamicScroller"
          :items="list"
          :min-item-size="60"
          style="width: 100%"
          class="DynamicScroller"
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              class="flex"
            >
              <div v-for="i in item.value" :key="i.id" class="mr-2 mb-2 item">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="i.image"
                  fit="contain"
                  :preview-src-list="[i.image]"
                />
                <div class="flex name">
                  <el-checkbox v-model="i.checked">{{ i.name }}</el-checkbox>
                </div>
                <div class="lesson-list-btn">
                  <el-button
                    type="text"
                    size="small"
                    class="ml-2"
                    @click="editName(i)"
                  >重命名</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="downImage(i)"
                  >下载</el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="handleDel(i)"
                  >删除</el-button>
                </div>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </div>
    </div>
  </div>
</template>
<script>
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { downLink } from '@/utils'
import moment from 'moment'
import {
  getTeacherPhotoList,
  queryTeacherList,
  addTeacherPhoto,
  delTeacherPhoto,
  updateTeacherPhoto,
  batchDownload
} from '@/api/tearchCenter/teacherPhoto'
export default {
  name: 'Material',
  components: {
    DynamicScroller,
    DynamicScrollerItem
  },
  data() {
    return {
      search: '',
      keyWord: '', // 搜索关键词
      time: ['', ''], // 搜索时间
      form: { id: '', name: '' },
      treeSelectData: {},
      // config: { pageIndex: 1, pageSize: 10 },
      name: '',
      loading: false,
      list: [],
      fileClass: [],
      treeLoading: false,
      teacherList: [{
        dirName: '全部',
        dirId: undefined,
        id: undefined }],
      arr: [],
      downLoaing: false
    }
  },
  computed: {
    checkedList() {
      return this.list.reduce((pre, cur) => {
        return pre.concat(cur.value.filter(i => i.checked))
      }, [])
    }
  },
  created() {
    Promise.all([this.getList(), this.getTeacherList()])
  },
  methods: {
    filterNode(value, data) {
      console.log(data, 'data')
      if (!value) return true
      return data.dirName.indexOf(value) !== -1
    },
    // 搜索事件
    searchFn() {
      this.$refs.tree.filter(this.search)
    },
    treeClick(data) {
      this.form.id = data.dirId
      this.form.name = data.dirName
      this.getList()
    },
    async getTeacherList() {
      this.treeLoading = true
      const res = await queryTeacherList().finally(() => {
        this.treeLoading = false
      })
      this.teacherList.push(...res.data.map(i => ({
        dirName: i.teacherName,
        dirId: i.teacherId,
        id: i.teacherId
      })))
    },
    handerclear() {
      this.name = ''
      this.time = ['', '']
      this.handerSearch()
    },
    handerSearch() {
      // this.config.pageIndex = 1
      this.getList()
    },
    async getList() {
      let startTime
      let endTime
      if (this.time) {
        startTime = this.time[0]
          ? moment(this.time[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined
        endTime = this.time[1]
          ? moment(this.time[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
          : undefined
      }
      const res = await getTeacherPhotoList({
        endTime,
        startTime,
        name: this.name,
        teacherId: this.form.id
      })
      this.arr = res.data
      this.list = res.data.map(i => ({ ...i, checked: false }))
        .reduce((acc, cur, i) => {
          const chunk = Math.floor(i / 6)
          if (!acc[chunk]) {
            acc[chunk] = []
          }
          acc[chunk].push(cur)
          return acc
        }, [])
        .map((i, index) => ({ id: index, value: i }))
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
    // 点击打开上传图片
    openUpImg() {
      this.$AppUploadImagAndFile({
        treeSelectData: this.teacherList,
        visible: true,
        api: addTeacherPhoto,
        type: 1,
        accept: 'image/jpeg,image/png,image/jpg,image/gif,image/bmp',
        beforeUpload: this.onBeforeUploadImage,
        form: this.form,
        tips: '支持上传5MB以内的jpg、jpeg、png、gif、bmp格式图片，一次最多上传100个文件',
        success: (res, form) => {
          this.handerSearch()
        }
      })
    },

    editName(row) {
      console.log(row)
      const that = this
      this.$AppEditName({
        title: '请输入素材名称',
        maxlength: 30,
        defaultValue: row.name,
        success: value => {
          const param = {
            id: row.id,
            name: value
          }
          return updateTeacherPhoto(param).then(res => {
            that.getList()
          })
        }
      })
    },

    handleDel(row) {
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          console.log('删除')
          this.loading = true
          delTeacherPhoto(row.id)
            .then(() => {
              return this.getList()
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },

    // 点击下载图片
    downImage(row) {
      downLink(row.image, row.name)
    },
    async batchDownImage() {
      this.downLoaing = true
      const { data } = await batchDownload({
        idList: this.checkedList.length ? this.checkedList.map(i => i.id) : this.arr.map(i => i.id),
        teacherId: this.checkedList.length ? undefined : this.form.id,
        name: `${this.form.name}师资形象照.zip`
      }).finally(() => {
        this.downLoaing = false
      })
      const link = document.createElement('a')
      document.body.appendChild(link)
      link.style.display = 'none'
      link.href = data
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style lang="scss" scoped>
.Page_wrap {
  height: calc(100vh - 160px);
  width: 100%;
  display: flex;
  padding: 20px;

  .Page_layout_left {
    width: 300px;
    height: 100%;
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

  .tree {
    padding: 10px 0;
    flex: 1;
    overflow: auto;
    width: 100%;
    background: #fff;
    height: calc(100vh - 240px);
  }

  .lesson-list {
    height: calc(100vh - 250px);
    overflow-y: auto;
    position: relative;

    .DynamicScroller {
      height: 100%;
    }

    .lesson-list-item {
      border: 1px solid #fff;
      border-radius: 5px;
      min-height: 60px;
      padding: 0 12px;
      // margin-bottom: 10px;
      align-items: center;
    }
  }
}
.item{
  width: 200px;
}
::v-deep .el-checkbox__label {
  width: 190px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: -5px;
}
::v-deep {
  .ss-scroll {
    width: 100%;
    height: 100%;

    ::-webkit-scrollbar {
      display: none;
    }
  }
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
    background-color: #cee2ff !important ;
  }
}
</style>
