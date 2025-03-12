<template>
  <!-- 聊天记录 -->
  <div class="chatRecords">
    <div class="search">
      <label class="searchLabel">用户昵称<el-input v-model.trim="search.userName" clearable size="small" class="w-200 m-r-20 m-l-8" placeholder="请输入用户昵称" @keyup.enter.native="searchFn" @clear="searchFn" /></label>
      <label class="searchLabel">查询内容<el-input v-model.trim="search.content" clearable size="small" class="w-200 m-r-20 m-l-8" placeholder="请输入查询内容" @keyup.enter.native="searchFn" @clear="searchFn" /></label>
      <el-button size="small" type="primary" @click="searchFn">查询</el-button>
      <el-button v-permission="['web:liveDetail:chatRecordsExport', permsList]" class="fr btn_primary" type="primary" size="small" :loading="importLoading" @click="onhandleImport">导出记录</el-button>
    </div>
    <el-table :data="list" :header-cell-style="{ background: '#f5f5f5' }" class="m-t-20">
      <el-table-column prop="fromUserName" label="用户昵称" width="240">
        <template slot-scope="{ row }">
          {{ filtersTextPhone(row.fromUserName) }}
        </template>
      </el-table-column>
      <el-table-column prop="msgTime" label="聊天时间" width="240">
        <template slot-scope="{ row }">
          {{ row.msgTime | filterTime }}
        </template>
      </el-table-column>
      <el-table-column prop="msgBody" label="聊天内容">
        <template slot-scope="{ row }">
          <div v-if="row.msgBody && row.msgBody[0].msgType === 'TIMTextElem' && row.msgBody[0].textMsgContent" class="comment_content_text" v-html="filterContent(row.msgBody[0].textMsgContent.text)" />
          <div v-else-if="row.msgBody && row.msgBody[0].msgType === 'TIMImageElem' && row.msgBody[0].imageMsgContent.origImage">
            <el-image
              :style="{
                width:`${!row.msgBody[0].imageMsgContent.origImage.width ? 100 : row.msgBody[0].imageMsgContent.origImage.width}px`,
                height: `${!row.msgBody[0].imageMsgContent.origImage.height ? 100 : row.msgBody[0].imageMsgContent.origImage.height}px`,
                maxHeight: '100px',
                maxWidth: '100px'
              }"
              :src="row.msgBody[0].imageMsgContent.origImage.url"
              fit="contain"
              :preview-src-list="[row.msgBody[0].imageMsgContent.origImage.url]"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { chatRecordPage, chatRecordExportAjax } from '@/api/liveRoom/index'
import { emojiMap } from '../../liveRoom/components/p2/Emoji/emoji.js'
import moment from 'moment'
import { filtersTextPhone } from '@/utils/index'
export default {
  filters: {
    filterTime(val) {
      if (!val) { return '' }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {},
  data() {
    return {
      search: {
        userName: '',
        content: ''
      },
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
      permsList: this.$route.meta.permsList || [],
      importLoading: false
    }
  },
  mounted() {
    this.searchFn()
  },
  methods: {
    filtersTextPhone(str) {
      return filtersTextPhone(str)
    },
    filterContent(value) {
      if (!value) {
        return ''
      } else {
        const reg = /\[(.*?)\]/gi
        const tmp = value.match(reg)
        if (!tmp) return value
        tmp.forEach((i) => {
          let imgStr = ''
          if (emojiMap[i]) {
            imgStr = `<img src="${emojiMap[i]}" style="width:20px;height:20px;display: inline-block;vertical-align:bottom;" />`
          } else {
            imgStr = i
          }
          value = value.replace(i, imgStr)
        })
        return value
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        liveRoomId: this.$route.params.id,
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        userName: this.search.userName,
        content: this.search.content
      }
      chatRecordPage(params).then((res) => {
        console.log(res)
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchFn() {
      this.currentPage = 1
      this.getList()
    },
    // 点击导出记录
    onhandleImport() {
      this.importLoading = true
      const data = {
        liveRoomId: this.$route.params.id,
        content: this.search.content,
        userName: this.search.userName
      }
      chatRecordExportAjax(data).then(res => {
        const url = res.data + '?t=' + new Date().getTime()
        window.open(url)
        this.importLoading = false
      }).catch(() => {
        this.importLoading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.comment_content_text {
  display: inline-block;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  white-space: pre-wrap;
  font-size: inherit;
  word-break: break-word;
}
.chatRecords {
  .search {
    .searchLabel {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  }
  .pagination {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
