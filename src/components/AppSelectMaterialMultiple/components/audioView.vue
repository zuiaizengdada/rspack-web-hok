<template>
  <div>
    <div class="ss-material-picture">
      <div class="left-wrap">
        <el-button v-if="type === '1'" class="m-r-20" @click.native="openUpVideo">上传音频</el-button>
        <span class="ss-material-button" @click="gotoMaterial()">前往素材中心</span>
      </div>
      <div class="right-wrap">
        <el-input
          v-model.trim="search"
          placeholder="音频名称"
          prefix-icon="el-icon-search"
          @keyup.enter.native="init()"
        />
        <el-button icon="el-icon-refresh" type="text" class="m-l-10" @click="handleCurrentChange(1)" />
      </div>
    </div>
    <div class="ss-material-main">
      <div class="ss-material-main-left">
        <div class="ss-material-main-tree">
          <AppTree
            v-model="classlist"
            style="width: 200px"
            :loading="treeLoading"
            :nobtn="true"
            @node-click="treeClick"
          />
        </div>
      </div>
      <div v-loading="loading" class="ss-material-main-right">
        <div class="content-wrap">
          <!-- 列表模式 -->
          <div v-show="listType === 'list'" class="table-wrap">
            <div class="header-wrap">
              <el-table
                ref="multipleTable"
                height="360"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 666px"
                :header-cell-style="{ background: '#f5f5f5', padding: '0' }"
                :row-key="(row) => row.materialId"
                @selection-change="handleTableSelectionChange"
              >
                <el-table-column type="selection" :reserve-selection="true" width="55" :selectable="selectable" />
                <el-table-column prop="materialName" label="音频">
                  <template slot-scope="{ row }">
                    <div class="fl fl_ai_c">
                      <svg-icon
                        class-name="size-icon"
                        style="width: 60px: height: 60px;font-size: 60px"
                        icon-class="audio"
                        @click="play(row.materialUrl)"
                      />
                      <span class="m-l-10">{{ row.materialName }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="materialDes" label="时长" width="120">
                  <template slot-scope="{ row }">
                    {{ row.materialDes | filterTime }}
                  </template>
                </el-table-column>
                <el-table-column prop="materialSize" width="80" label="大小" show-overflow-tooltip>
                  <template slot-scope="{ row }">
                    {{ row.materialSize | filterSize }}
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" width="160" label="上传时间" show-overflow-tooltip />
              </el-table>
            </div>
            <div />
          </div>
        </div>

        <!-- 分页器 -->
        <div class="pagination-wrap">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            :current-page.sync="current"
            :page-size="size"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppTree from '@/components/AppTree'
import { materialPage, material } from '@/api/course'
import { getSourceFileUrl } from '@/api/file'
export default {
  components: {
    AppTree
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value', 'classlist', 'fileType'],
  data() {
    return {
      type: '1',
      loading: false,
      treeLoading: false,
      listType: 'list', // 列表模式：list:列表；card：卡片
      search: '',
      size: 10, // 每页显示条数
      current: 1, // 当前页
      total: 0, // 总条数
      dirId: '', // 目录id
      tableData: [], // 表格/列表数据
      srcList: [], // 预览图片地址
      form: {
        id: '',
        name: ''
      }
    }
  },
  created() {
    console.log('音频')
  },
  methods: {
    init() {
      this.tableData = []
      this.value &&
        this.value.map((e) => {
          this.$refs.multipleTable.toggleRowSelection(e, true)
        })
      this.getList()
    },
    selectable(row) {
      if (!this.fileType?.length) return true
      return this.fileType?.some(i => row?.materialUrl?.indexOf('.' + i) !== -1)
    },
    treeClick(data, node) {
      this.dirId = data.dirId
      this.form = {
        id: data.id,
        name: data.name
      }
      this.current = 1
      this.getList()
    },
    getList() {
      this.loading = true
      this.tableData = []
      const params = {
        dirId: this.dirId,
        materialName: this.search,
        current: this.current,
        size: this.size,
        materialType: this.type
      }
      if (!this.dirId || this.dirId === '-1') {
        delete params.dirId
      }
      return materialPage(params)
        .then((res) => {
          if (res.data) {
            this.tableData = res.data.records
            this.srcList = []
            this.tableData &&
              this.tableData.map((v) => {
                this.srcList.push(v.materialUrl)
              })
            this.total = res.data.total
            this.loading = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.current = val
      this.getList()
    },
    // 点击全选按钮
    handleTableSelectionChange(val) {
      console.log('表格全选', val)
      this.$emit('input', val)
    },
    // 点击播放音频
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
    // 清空表格的选中状态
    clearTable() {
      this.$refs.multipleTable.clearSelection()
    },
    // 点击前往素材中心
    gotoMaterial() {
      window.open(window.location.origin + '#/shop/material', '_blank')
    },
    // 点击上传音频弹框确定按钮
    sureSend(list) {
      this.loading = true
      const param = {
        list: list
      }
      material(param)
        .then((res) => {
          this.uploadLoading = false
          this.handleCurrentChange(1)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击打开上传音频
    openUpVideo() {
      this.$AppUpload({
        treeSelectData: this.classlist,
        visible: true,
        type: 1,
        accept: 'audio/*',
        form: this.form,
        beforeUpload: this.onBeforeUploadAudio,
        tips: '支持上传500MB以内的m4a、mp3格式音频，一次最多上传100个文件',
        success: (res, form) => {
          this.form = form
          this.dirId = form.id
          this.sureSend(res)
        }
      })
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    onBeforeUploadAudio(file) {
      // 文件类型进行判断
      console.log(file, 'file')
      const isAudio = /^audio/.test(file.type)
      // 限制上传文件大小 500M
      const isLt500M = file.size / 1024 / 1024 < 500
      if (!isAudio) {
        this.$message.error('上传文件只能是Mp3,m4a格式!')
      } else if (!isLt500M) {
        this.$message.error('上传文件大小不能超过 500MB!')
      }
      return isAudio && isLt500M
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .ele-tabs-wrap {
    .el-tabs__header {
      margin: 0;
      .el-tabs__nav-wrap {
        padding: 0 24px;
        .el-tabs__item {
          height: 48px;
          line-height: 48px;
        }
      }
    }
  }
}

.ss-material-picture {
  padding: 16px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-wrap {
    display: flex;
    align-items: center;
    .ss-material-button {
      color: #105cfb;
      border-color: transparent;
      background: transparent;
      cursor: pointer;
    }
  }
  .right-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      color: #cdcdcd;
      font-size: 20px;
      margin-right: 5px;
    }
    .active {
      color: #1890ff;
    }
  }
}
.ss-material-main {
  display: flex;
  margin: 12px 24px 0;
  .ss-material-main-left {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 421px;
    border: 1px solid #eee;
    flex: none;
    .ss-material-main-tree {
      height: 100%;
      flex: 1;
      overflow: hidden;
      .ss-search-wrap {
        width: 200px;
        padding: 12px 8px 7px;
        box-sizing: border-box;
      }
      .ss-scroll {
        width: 200px;
        // height: calc(100% - 55px);
        height: 100%;
        ::-webkit-scrollbar {
          display: none;
        }
        .ss-all {
          > .title {
            padding-left: 8px;
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
  .ss-material-main-right {
    flex: 1;
    border: 1px solid #eee;
    border-top: none;
    border-left: none;
    .content-wrap {
      height: 360px;
      width: 666px;
      overflow-y: auto;
      .card-pattern-list-wrap {
        padding: 0 20px;
        height: 100%;
        ::v-deep {
          .el-checkbox-group {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }
        .check {
          margin-bottom: 6px;
        }
        .picture-card {
          border-radius: 4px;
          border: 1px solid #eee;
          font-size: 12px;
          width: 184px;
          margin: 0 12px 13px 0;
          .content {
            position: relative;
            overflow: hidden;
            padding-top: 100%;
            > .el-image {
              cursor: pointer;
              position: absolute;
              left: 0;
              bottom: 0;
              top: 0;
              right: 0;
              width: 100%;
              height: 100%;
              -o-object-fit: scale-down;
              object-fit: scale-down;
              background: #fafafa;
            }
            img {
              cursor: pointer;
              position: absolute;
              left: 0;
              bottom: 0;
              top: 0;
              right: 0;
              width: 100%;
              height: 100%;
              -o-object-fit: scale-down;
              object-fit: scale-down;
              background: #fafafa;
            }
            .resolution {
              position: absolute;
              bottom: 8px;
              right: 8px;
              padding: 2px 8px;
              color: #fff;
              background: #333;
              border-radius: 4px;
              opacity: 0.7;
            }
          }
          .detail {
            padding: 8px;
            .common-row {
              color: #999;
              width: 100%;
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-pack: justify;
              -webkit-justify-content: space-between;
              -ms-flex-pack: justify;
              justify-content: space-between;
              -webkit-box-align: center;
              -webkit-align-items: center;
              -ms-flex-align: center;
              align-items: center;
              margin-top: 9px;
              font-size: 12px;
            }
          }
        }
      }
    }
    .pagination-wrap {
      height: 52px;
      // border-top: 1px solid red;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .table-wrap {
      height: 360px;
      width: 100%;
      .header-wrap {
        height: 40px;
        background-color: #f6f8fa;
        font-size: 14px;
        font-weight: 500;
        color: #333;
        line-height: 40px;
        > table {
          width: 100%;
        }
      }
    }
  }
}
.m-picture-title {
  height: 18px;
  line-height: 18px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  color: #333;
}
.m-picture-property {
  height: 18px;
  line-height: 18px;
  color: #888;
}
.size-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.videoImg {
  width: 80px;
  height: 60px;
  cursor: pointer;
  > img {
    width: 100%;
    height: 100%;
  }
}
</style>
