<template>
  <div class="reply-container">
    <div class="reply-left">
      <div
        v-for="item in newList"
        :key="item.value"
        class="reply-left-content"
        @click="handleNav(item)"
      >
        <div v-show="item.value === isActive.value" class="reply-box" />
        <span class="title">{{ item.label }}</span>
      </div>
    </div>
    <div>
      <welcomeMessageSettings
        ref="welcomeMessageSettings"
        type="official"
        @change="getTaskWelcomes"
      />
      <el-button
        type="primary"
        :loading="loading"
        style="margin-left: 20px"
        size="small"
        @click="handleSave"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import welcomeMessageSettings from '../../components/welcomeMessageSettings'
import { replyDetail, replySave, replyCreate } from '@/api/privateArea/toolbox'
const newList = [
  {
    label: '欢迎语',
    value: 1
  },
  {
    label: '默认模板',
    value: 2
  }
]
export default {
  components: {
    welcomeMessageSettings
  },
  data() {
    return {
      isActive: newList[0],
      newList,
      taskWelcomes: [],
      id: undefined,
      loading: false
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    handleNav(item) {
      this.isActive = item
      this.getDetail()
    },
    async getDetail() {
      this.loading = true
      try {
        const id = this.$route.query.id
        const { data } = await replyDetail({ id, msgType: this.isActive.value })
        this.id = data?.id
        const dataList =
          data?.dataList?.map(i => {
            const linkImgUrl = i.type === 1 ? i.url : i.linkImgUrl
            return {
              ...i,
              linkImgUrl
            }
          }) ?? []
        this.loading = false
        this.taskWelcomes = dataList || []
        this.$nextTick(() => {
          this.$refs.welcomeMessageSettings.items = dataList
        })
        this.taskWelcomes.push({ content: data?.content })
        this.$refs.welcomeMessageSettings.form.content = data?.content
      } catch (e) {
        this.loading = false
      }
    },
    getTaskWelcomes(taskWelcomes) {
      this.taskWelcomes = taskWelcomes
    },
    handleSave() {
      const taskWelcomesContent =
        this.taskWelcomes.filter(i => i.content)[0] ?? {}
      if (!taskWelcomesContent.content) {
        this.$message.error('请输入欢迎语')
        return
      }
      this.loading = true
      const officialId = this.$route.query.id
      const dataList = this.taskWelcomes
        .filter(i => i.type)
        .map(i => {
          const linkUrl = i.link
          if (i.type === 1) {
            const url = i.linkImgUrl
            return {
              url,
              id: i.id,
              mediaId: i.mediaId,
              type: i.type,
              sort: i.sort
            }
          }
          return {
            ...i,
            linkUrl
          }
        })
      const params = {
        content: taskWelcomesContent.content,
        dataList,
        officialId,
        id: this.id,
        msgType: this.isActive.value
      }
      if (!this.id) {
        this.add(params)
      } else {
        this.edit(params)
      }
    },
    async add(params) {
      try {
        const { code } = await replyCreate(params)
        this.loading = false
        if (code === 1) {
          this.$message.success('保存成功')
          // this.getDetail()
        }
      } catch (e) {
        this.loading = false
      }
    },
    async edit(params) {
      try {
        const { code } = await replySave(params)
        this.loading = false
        if (code === 1) {
          this.$message.success('保存成功')
          this.getDetail()
        }
      } catch (e) {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reply-container {
  height: 100%;
  display: flex;

  .draggle {
    cursor: move;
  }

  .reply-left {
    width: 200px;
    height: 100%;
    padding-top: 20px;
    border-right: 1px solid #eff2f6;

    > div {
      margin-bottom: 10px;
    }

    .reply-left-content {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;

      .reply-box {
        position: absolute;
      }
    }

    .title {
      color: #333333;
      font-size: 16px;
      margin: 0 8px;
    }

    .reply-box {
      width: 4px;
      height: 20px;
      border-radius: 6px;
      background: #0c6fff;
    }
  }

  .reply-right {
    padding: 20px;
    display: flex;
    flex-direction: column;

    .reply-right-btn {
      margin-bottom: 20px;

      .el-button {
        color: #0c6fff;
        background: #fff;
        border-color: #0c6fff;
      }
    }
  }

  .el-textarea {
    width: 450px;
    margin: 16px 0;
  }

  .reply-footer {
    height: 68px;
    display: flex;
    align-items: center;
  }

  .reply-content {
    .reply-items {
      width: 450px;
      height: 100px;
      background: #f5f9ff;
      border-radius: 4px;
      padding: 10px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .reply-items__content {
        width: 305px;
        height: 80px;
        margin-right: 40px;

        .reply-items__title {
          color: #333333;
          font-size: 16px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 10px;
        }

        .reply-items__desc {
          overflow: hidden;
          width: 245px;
          height: 43px;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #777777;
          font-size: 14px;
          margin-right: 10px;
        }

        img {
          width: 48px;
          height: 48px;
          border-radius: 2px;
        }

        .reply-items__img {
          width: 80px;
          height: 80px;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>
