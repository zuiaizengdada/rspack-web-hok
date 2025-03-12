<template>
  <div class="page_wrap 11">
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
      border
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <div slot="action" slot-scope="{ row }">
        <el-button
          v-permission="['system:recycle:remove', permsList]"
          type="text"
          style="color: red"
          @click="del(row)"
        >
          彻底删除
        </el-button>
        <el-button
          v-permission="['system:recycle:edit', permsList]"
          type="text"
          style="color: #2a75ed"
          @click="back(row)"
        >还原</el-button>
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
          placeholder="请输入"
          class="w-300 m-l-10 m-r-10"
          clearable
          @clear="handerSearch"
          @keyup.enter.native="handerSearch"
        >
          <el-select
            slot="prepend"
            v-model="select"
            placeholder="请选择"
            class="w-100"
            @change="searchChange"
          >
            <el-option label="全部素材" value="5" />
            <el-option label="图片" value="0" />
            <el-option label="音频" value="1" />
            <el-option label="视频" value="2" />
            <el-option label="文档" value="4" />
          </el-select>
        </el-input>
        <el-button type="primary" @click="handerSearch()">搜索</el-button>
      </div>

      <div slot="footer">
        <!-- <AppTableTools
          ref="tableTools"
          :tools="['彻底删除', '全部还原']"
          @onAllChange="onAllChange"
          @onClick="allChange"
        /> -->
        <el-button
          v-permission="['system:recycle:remove', permsList]"
          @click="allChange(0)"
        >批量删除</el-button>
        <el-button
          v-permission="['system:recycle:edit', permsList]"
          @click="allChange(1)"
        >全部还原</el-button>
      </div>

      <div slot="materialName" slot-scope="scope">
        <div v-if="scope.row.materialType === 0" class="ImageViewer">
          <div class="imgUrl">
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

        <div v-if="scope.row.materialType === 1" class="AudioViewer">
          <svg-icon
            class-name="size-icon"
            icon-class="audio"
            @click="play(scope.row.materialUrl)"
          />
          <div class="m-l-10">
            <div class="text_hidden">{{ scope.row.materialName }}</div>
            <div class="font_msg">{{ scope.row.materialDes | filterTime }}</div>
          </div>
        </div>

        <div v-if="scope.row.materialType === 2" class="ImageViewer">
          <div class="videoImg">
            <img
              :src="scope.row.materialFrameUrl"
              alt=""
              @click="playVideo(scope.row)"
            />
          </div>

          <div class="m-l-10">
            <div class="text_hidden" :title="scope.row.materialName">
              {{ scope.row.materialName }}
            </div>
            <div class="font_msg">{{ scope.row.materialDes | filterTime }}</div>
          </div>
        </div>

        <div v-if="scope.row.materialType === 4" class="AudioViewer">
          <svg-icon class-name="size-icon" icon-class="ppt" />
          <div class="m-l-10">
            <div class="text_hidden" @click="openFile(scope.row)">
              {{ scope.row.materialName }}
            </div>
          </div>
        </div>
      </div>

      <div slot="materialType" slot-scope="scoped">
        <div>
          {{ ['图片', '音频', '视频', '', '文档'][scoped.row.materialType] }}
        </div>
      </div>

      <div slot="materialSize" slot-scope="{ row }">
        {{ row.materialSize | filterSize }}
      </div>
    </MPageLayout>
  </div>
</template>

<script>
import { DateFormat } from '@/utils'
// import AppTableTools from '@/components/AppTableTools/AppTableTools.vue'
import { recyclePage, deleteMaterial, reductionMaterial } from '@/api/shop'
import AppVideo from '@/components/AppVideo'
import { getSourceFileUrl } from '@/api/file'
export default {
  components: {
    // AppTableTools
  },
  data() {
    return {
      loading: false,
      search: '', // 搜索关键词
      time: '', // 搜索时间
      select: '5', // 搜索分类
      slotArr: [
        'headerRight',
        'headerLeft',
        'action',
        'footer',
        'materialName',
        'materialSize',
        'materialType'
      ],
      config: {
        tableData: [],
        tableColumns: [
          { prop: 'materialName', label: '文件', type: 'slot' },
          { prop: 'materialType', label: '类型', type: 'slot', width: '120' },
          { prop: 'materialSize', label: '大小', type: 'slot', width: '120' },
          { prop: 'updateTime', label: '删除时间', type: 'text', width: '240' },
          { prop: 'action', label: '操作', type: 'slot', width: '240' }
        ],
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        currentPage: 1,
        total: 0,
        multipleSelection: []
      },
      permsList: this.$route.meta.permsList || []
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
        startTime,
        endTime,
        materialName: this.search,
        current: this.config.currentPage,
        size: this.config.pageSize,
        materialType: this.select
      }
      console.log(params)
      recyclePage(params)
        .then(res => {
          console.log(res, 'res')
          if (res.data) {
            console.log(res)
            this.loading = false
            this.config.tableData = res.data.records
            this.config.total = res.data.total
          }
          this.loading = false
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
    // 底部上架下架删除按钮点击事件
    allChange(index) {
      console.log(index, 'index')
      switch (index) {
        case 0:
          this.BulkDel()
          break
        case 1:
          this.BulkBack()
          break
      }
    },
    handerSearch() {
      this.config.currentPage = 1
      this.config.total = 0
      this.getList()
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
      if (row.materialId) {
        this.loading = true
        const params = {
          materialId: row.materialId
        }
        getSourceFileUrl(params)
          .then(res => {
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
    },
    // 点击播放音频
    play(row) {
      if (row.materialId) {
        this.loading = true
        const params = {
          materialId: row.materialId
        }
        getSourceFileUrl(params)
          .then(res => {
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
    // 预览文档
    openFile(row) {
      const url =
        'https://view.officeapps.live.com/op/view.aspx?src=' + row.materialUrl
      window.open(url)
    },
    // 批量删除
    BulkDel() {
      if (this.multipleSelection.length < 1) {
        return this.$message.warning('请选择素材')
      }
      const that = this
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          that.loading = true
          const materialIds = []
          this.multipleSelection.map(v => materialIds.push(v.materialId))
          const param = {
            materialIds: materialIds
          }
          deleteMaterial(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              that.loading = false
            })
        }
      })
    },
    // 批量还原
    BulkBack() {
      if (this.multipleSelection.length < 1) {
        return this.$message.warning('请选择素材')
      }
      const that = this
      this.$delModal({
        tips: '确定还原?',
        success: () => {
          console.log('删除')
          that.loading = true
          const materialIds = []
          this.multipleSelection.map(v => materialIds.push(v.materialId))
          const param = {
            materialIds: materialIds
          }
          reductionMaterial(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              that.loading = false
            })
        }
      })
    },
    // 彻底删除指定素材
    del(row) {
      const that = this
      this.$delModal({
        tips: '确定删除?',
        success: () => {
          that.loading = true
          const param = {
            materialIds: [row.materialId]
          }
          deleteMaterial(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              that.loading = false
            })
        }
      })
    },
    // 还原指定素材
    back(row) {
      const that = this
      this.$delModal({
        tips: '确定还原?',
        success: () => {
          that.loading = true
          const param = {
            materialIds: [row.materialId]
          }
          reductionMaterial(param)
            .then(() => {
              return this.getList()
            })
            .catch(() => {
              that.loading = false
            })
        }
      })
    },
    searchChange() {
      this.search = ''
      this.current = 1
      this.total = 0
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .videoImg {
    width: 80px;
    min-width: 80px;
    height: 60px;
    cursor: pointer;
    > img {
      width: 100%;
      height: 100%;
    }
  }
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
</style>
