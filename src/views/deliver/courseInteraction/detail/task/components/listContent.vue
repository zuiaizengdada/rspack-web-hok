<template>
  <div class="select-right" ref="scrollContainer">
    <div v-if="list.length" class="card-warp">
      <div class="card" v-for="(item, index) in list" :key="item.id">
        <img :src="item.headImg" alt="" />
        <div class="content-box">
          <div class="title">{{ item.userName }}</div>
          <div class="headTime">
            提交于 {{ item.createdAt }} <span>#{{ item.punchTaskTitle }}</span>
          </div>
          <div class="contentBoxText">
            <div>
              {{ item.content }}
            </div>
            <div class="imgBox">
              <div class="fileContent" v-for="i in item.punchFiles" :key="i.id">
                <el-image
                  v-if="i.fileType === 1"
                  style="width: 70px; height: 70px; border-radius: 4px"
                  fit="contain"
                  class="pointer"
                  :src="i.fileUrl"
                  :preview-src-list="[i.fileUrl]"
                />
                <VideoShow v-else :type="i.fileType" :url="i.fileUrl" />
              </div>
            </div>
            <div class="btnBox">
              <div
                v-for="n in btnList"
                :key="n.type"
                @click="handleClick(n, item, index)"
              >
                <img
                  :src="
                    item[n.isActiveKey] ||
                    (item.id === isCommend && n.type === 'editor')
                      ? n.activeICon
                      : n.icon
                  "
                  alt=""
                />
                <span
                  :class="{
                    btnText:
                      item[n.isActiveKey] ||
                      (item.id === isCommend && n.type === 'editor')
                  }"
                  >{{ n.text }}</span
                >
              </div>
            </div>
          </div>
          <div v-if="item.id === isCommend">
            <el-input
              :rows="6"
              class="textarea"
              type="textarea"
              placeholder="请输入内容"
              v-model="form.content"
              maxlength="2000"
              show-word-limit
            />
            <Upload2OSS
              :styles="{ width: '100px', height: '100px' }"
              ref="uploadImgList"
              v-model="form.punchFiles"
              :limit="6"
              :max-m="2"
              class="order-upload"
              tips=""
              @change="handleUrlsChange"
            />
            <el-button
              size="mini"
              type="primary"
              @click="submitPunchComment(item, index)"
              >提交点评</el-button
            >
          </div>
          <div class="cardBox" v-for="itm in item.punchComments" :key="itm.id">
            <div class="cardTitle">
              {{ itm.createdByName }}
              <span
                >提交于
                {{
                  DateFormat(new Date(itm.createdAt), 'yyyy-MM-dd hh:mm:ss')
                }}</span
              >
            </div>
            <div class="cardContent">
              <div>
                {{ itm.content }}
              </div>
              <div
                class="imgBox"
                v-if="itm.punchFiles && itm.punchFiles.length"
              >
                <div
                  class="fileContent"
                  v-for="i in itm.punchFiles"
                  :key="i.id"
                >
                  <el-image
                    v-if="i.fileType === 1"
                    style="width: 70px; height: 70px; border-radius: 4px"
                    fit="contain"
                    class="pointer"
                    :src="i.fileUrl"
                    :preview-src-list="[i.fileUrl]"
                  />
                  <VideoShow v-else :type="i.fileType" :url="i.fileUrl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="loadingText">{{ isData ? '加载中~' : '已加载全部数据' }}</div>
    </div>
    <div v-else class="nullBox">暂无数据~</div>
  </div>
</template>
<script>
import { debounce } from 'throttle-debounce'
import VideoShow from '../../../components/videoShow.vue'
import { DateFormat } from '@/utils/index'
import Upload2OSS from '@/components/AppTemplate/Upload2OSS'
import {
  submitPunchComment,
  submitPunchCommentLike,
  submitPunchCommentFeatured,
  submitPunchCommentTop,
  deletePunchComment,
  getByIdPunchComment
} from '@/api/deliver/punch'
const btnList = [
  {
    icon: require('@/assets/image/min_icon/Editor.png'),
    activeICon: require('@/assets/image/min_icon/Editor_active.png'),
    text: '点评',
    type: 'editor'
  },
  {
    icon: require('@/assets/image/min_icon/Thumbs-up.png'),
    activeICon: require('@/assets/image/min_icon/Thumbs-up_active.png'),
    text: '点赞',
    type: 'thumbs',
    isActiveKey: 'isLiked'
  },
  {
    icon: require('@/assets/image/min_icon/Star.png'),
    activeICon: require('@/assets/image/min_icon/Star_active.png'),
    text: '设为精选',
    type: 'star',
    isActiveKey: 'isFeatured'
  },
  {
    icon: require('@/assets/image/min_icon/To-top.png'),
    activeICon: require('@/assets/image/min_icon/To-top_active.png'),
    text: '置顶',
    type: 'toTop',
    isActiveKey: 'isTop'
  },
  {
    icon: require('@/assets/image/min_icon/Delete.png'),
    text: '删除',
    type: 'delete'
  }
]
export default {
  components: { Upload2OSS, VideoShow },
  props: {
    list: { type: Array, default: () => [] },
    isData: { type: Boolean, default: true }
  },
  data: () => ({
    DateFormat,
    isCommend: '',
    btnList,
    form: { punchFiles: [], content: '' }
  }),
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.scrollContainer.addEventListener('scroll', debounce(300, this.handleScroll))
      }, 1000)
    })
  },
  beforeDestroy() {
    this.$refs.scrollContainer.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    async getByIdPunchComment(item, index) {
      const { code, data } = await getByIdPunchComment(item.id)
      if (code === 1) {
        this.list.splice(index, 1, data)
      }
    },
    // 点评评论
    async submitPunchComment(item, index) {
      if (!this.form.content) {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
        return
      }
      const { code } = await submitPunchComment({
        punchId: item.punchId,
        ...this.form,
        punchTaskId: item.punchTaskId,
        punchUserRecordIds: [item.id]
      })
      if (code === 1) {
        this.isCommend = ''
        this.form = { punchFiles: [], content: '' }
        this.$message({
          message: '评论成功',
          type: 'success'
        })
        this.getByIdPunchComment(item, index)
      }
    },

    async submitPunchCommentLike(item) {
      const { code } = await submitPunchCommentLike(item.id)
      if (code === 1) {
        item.isLiked = item.isLiked ? 0 : 1
      }
    },

    async submitPunchCommentFeatured(item) {
      const { code } = await submitPunchCommentFeatured(item.id)
      if (code === 1) {
        item.isFeatured = item.isFeatured ? 0 : 1
      }
    },
    async submitPunchCommentTop(item) {
      const { code } = await submitPunchCommentTop(item.id)
      if (code === 1) {
        item.isTop = item.isTop ? 0 : 1
      }
    },

    async deletePunchComment(item, index) {
      this.$confirm('此操作将永久删除该条日记, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { code } = await deletePunchComment(item.id)
          if (code === 1) {
            this.list.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleClick(data, item, index) {
      if (data.type === 'editor') {
        this.form = { punchFiles: [], content: '' }
        if (this.isCommend === item.id) {
          this.isCommend = ''
        } else {
          this.isCommend = item.id
        }
      } else if (data.type === 'thumbs') {
        this.submitPunchCommentLike(item)
      } else if (data.type === 'star') {
        this.submitPunchCommentFeatured(item)
      } else if (data.type === 'toTop') {
        this.submitPunchCommentTop(item)
      } else if (data.type === 'delete') {
        this.deletePunchComment(item, index)
      }
    },
    handleScroll() {
      const container = this.$refs.scrollContainer
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight

      // 检查是否滚动到底部
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (this.isData) {
          container.scrollTop =
            container.scrollHeight - container.clientHeight - 500
          this.$emit('onSearch')
        }
        // 在这里执行滚动到底部时的逻辑
      }
    },
    handleUrlsChange(value) {
      this.form.punchFiles = value.map(item => ({
        fileName: item.materialName,
        fileType: 1,
        fileUrl: item.url,
        punchType: 1
      }))
    }
  }
}
</script>
<style lang="scss" scoped>
.select-right {
  flex: 1;
  min-height: 375px;
  max-height: 700px;
  overflow-y: scroll;
  overflow-x: hidden;
  .nullBox {
    border-radius: 10px;
    border: 1px solid #dcdee1;
    width: 100%;
    height: 375px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999999;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 0 !important;
  }
  .loadingText {
    width: 100%;
    display: flex;
    color: #999999;
    align-items: center;
    justify-content: center;
    height: 20px;
  }
  > .card-warp {
  }
  ::v-deep {
    .el-upload-dragger {
      width: 100px;
      height: 100px;
    }
    .image_poster {
      width: 100px;
      height: 100px;
    }
  }
  .card {
    flex-shrink: 0;
    border-radius: 10px;
    border: 1px solid #dcdee1;
    background: #fff;
    padding: 20px 24px;
    display: flex;
    margin-bottom: 20px;
    .fileContent {
      margin-right: 20px;
      > .pointer {
        width: 70px;
        height: 70px;
        background: #999999;
        cursor: pointer;
        border-radius: 5px;
      }
    }
    .order-upload {
      margin-top: 20px;
    }
    .content-box {
      flex: 1;
      margin-left: 10px;
      .textarea {
        margin-top: 18px;
      }
      .contentBoxText {
        padding: 14px 16px;
        border-radius: 5px;
        background: #f5f5f5;
        margin-top: 16px;
        word-break: break-all;
        .btnBox {
          display: flex;
          .btnText {
            color: #0c6fff !important;
          }
          > div {
            padding: 4px 10px;
            height: 26px;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            background: #e4e4e4;
            color: #000000;
            font-size: 14px;
            display: flex;
            align-items: center;
            margin-right: 10px;
            cursor: pointer;
            > img {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
          }
        }
        > .imgBox {
          display: flex;
          padding: 12px 0;
          > img {
            width: 92px;
            height: 92px;
            border-radius: 4px;
            margin-right: 14px;
          }
        }
        > div {
          color: #000000;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
        }
      }
      .title {
        color: #000000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
      }
      .headTime {
        color: #999999;
        font-size: 12px;
        > span {
          color: #000000;
        }
      }
    }
    > img {
      width: 40px;
      height: 40px;
      border-radius: 40px;
    }
  }
  .cardBox {
    margin-top: 20px;
    .cardTitle {
      color: #000000;
      font-size: 14px;
      font-style: normal;
      line-height: 14px;
      display: flex;
      align-items: flex-end;
      > span {
        color: #999999;
        font-size: 12px;
        margin-left: 10px;
      }
    }
    > .cardContent {
      margin-top: 10px;
      padding: 14px 16px;
      color: #000000;
      font-size: 12px;
      border-radius: 10px;
      border: 1px solid #dcdee1;
      > div:nth-of-type(1) {
        line-height: 18px;
      }
      > .imgBox {
        display: flex;
        align-items: center;
        margin-right: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>