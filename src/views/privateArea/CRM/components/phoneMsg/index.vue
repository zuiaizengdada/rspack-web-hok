<template>
  <div class="wxBox">
    <div class="box">
      <div v-for="(item, index) in newDataList" :key="index" class="cardBox">
        <img src="@/assets/image/bstitle.png" class="imglogo" />
        <div class="reply-items__content" :class="{ bg: item.type === 'img' }">
          <template v-if="item.type === 'img'">
            <img class="xuxiCard" src="@/assets/image/xuxiCard.png" alt="" />
          </template>
          <template v-if="item.type === 1">
            <img class="reply-items__img" :src="item.linkImgUrl" alt="" />
          </template>
          <template v-else-if="item.type === 2">
            <div class="reply-items__title">
              {{ item.linkTitle }}
            </div>
            <div class="flex flex-middle">
              <div class="reply-items__desc">
                {{ item.linkDesc }}
              </div>
              <img :src="item.linkImgUrl" alt="" />
            </div>
          </template>
          <template v-else-if="item.type === 3">
            <div class="cardThree">
              <img
                class="reply-items__img"
                src="@/assets/image/task_qrCode.png"
                alt=""
              />
            </div>
          </template>
          <template v-else-if="item.type === 4">
            <div class="reply-items__dafault">
              根据任务中实际配置的直播间给用户推送带跟进人参数的链接地址，示例如下：直播名称直播名称直播名称
            </div>
            <div class="flex flex-middle">
              <div class="reply-items__desc">xxx邀您观看直播</div>
              <img src="@/assets/image/task_dafultImg.png" alt="" />
            </div>
          </template>
          <template v-else-if="item.type === 5">
            <div class="cardThree">
              <div
                class="flex flex-middle"
              ><video
                width="48px"
                height="48px"
                :src="item.videoUrl"
              />{{ item.name }}</div>
            </div>
          </template>
          <template v-else-if="item.type === 6">
            <div class="cardThree flex flex-middle">
              <img
                v-if="showFileImg(['xls', 'xlsx', 'cvs', 'xlsm'], item)"
                src="@/assets/image/pdf.png"
                fit="contain"
                class="size-icon"
              />
              <img
                v-else-if="showFileImg(['ppt', 'pptx'], item)"
                src="@/assets/image/ppt.png"
                fit="contain"
                class="size-icon"
              />
              <img
                v-else-if="showFileImg(['pdf'], item)"
                src="@/assets/image/ppt2.png"
                fit="contain"
                class="size-icon"
              />
              <img
                v-else-if="showFileImg(['word', 'doc', 'docx'], item)"
                src="@/assets/image/word.png"
                fit="contain"
                class="size-icon"
              />
              <img
                v-else-if="showFileImg(['txt'], item)"
                src="@/assets/image/txt.png"
                fit="contain"
                class="size-icon"
              />
              <img
                v-else-if="showFileImg(['zip', 'rar', '7z', 'tar', 'gz'], item)"
                src="@/assets/image/zip.png"
                fit="contain"
                class="size-icon"
              />
              <img v-else src="@/assets/image/word.png" />{{ item.name }}
            </div>
          </template>
          <template v-else>
            <div clas="contentBox" v-html="item.content" />
            <!-- <div class="flex flex-middle">
              <div class="reply-items__desc">xxx邀您观看直播</div>
              <img src="@/assets/image/task_dafultImg.png" alt="">
            </div> -->
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dataList: {
      type: Array,
      default: () => []
    },
    showStudyCard: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    newDataList: []
  }),
  methos: {
    setList(data) {
      this.newDataList = data
    }
  },
  watch: {
    dataList: {
      handler: function(newVal) {
        if (!this.showStudyCard) {
          this.newDataList = [...(this.dataList || [])]
          return
        }
        if (!this.dataList?.length) {
          this.newDataList = [{ type: 'img' }]
          return
        }
        const newdataList = [...this.dataList]
        if (newdataList[0].content) {
          newdataList.splice(1, 0, { type: 'img' })
        } else {
          newdataList.unshift({ type: 'img' })
        }
        this.newDataList = [...newdataList]
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    showFileImg(list, item) {
      const str =
        item?.name?.split('.').pop() || item?.fileUrl?.split('.').pop()
      console.log(str, 'str')
      return list.includes(str)
    }
  }
}
</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none;
}
.xuxiCard {
  width: 305px !important;
  height: 56px;
}
.wxBox {
  width: 244px;
  height: 424px;
  background: url('../../../../../assets/image/bgshell.png') no-repeat 100% 100%;
  background-size: 100% 100%;
  border-top: 1px solid;
  border-color: rgba(0, 0, 0, 0);

  .reply-items__content {
    width: 305px;
    .reply-items__title {
      color: #333333;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .reply-items__dafault {
      color: #333333;
      font-size: 12px;
      line-height: 1.2;
      white-space: pre-wrap;
    }
    .reply-items__desc {
      overflow: hidden;
      width: 245px;
      font-size: 12px;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      color: #777777;
      margin-right: 10px;
    }
    img {
      width: 48px;
      height: 48px;
      border-radius: 2px;
    }
    .cardThree {
      width: 163px;
    }
    .reply-items__img {
      width: 40px;
      height: 40px;
      border-radius: 2px;
    }
  }
  > .box {
    margin: 0 12px;
    height: 266px;
    padding: 0 8px;
    padding-bottom: 10px;
    margin-top: 76px;
    overflow-y: scroll;
    > .cardBox {
      display: flex;
      margin-bottom: 20px;
      > div {
        max-width: 80%;
        margin-left: 4px;
        background: #c9e7fe;
        padding: 6px;
        line-height: 1.2;
        word-wrap: break-word;
      }
    }
    .imglogo {
      width: 24px;
      height: 24px;
    }
  }
  .bg {
    background-color: #ffffff !important;
  }
  .contentBox {
    white-space: pre;
  }
}
</style>
