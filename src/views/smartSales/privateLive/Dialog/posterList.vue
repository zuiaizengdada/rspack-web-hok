<template>
  <AppDialog v-model="visible" title="生成链接" width="726px" :loading="loading" height="auto" top="100px" @success="sure">
    <div class="posterList_page_wrap">
      <div class="tips">样式支持拖动可支持排列</div>
      <div ref="scrollView" class="posterList" :style="`transform: translateX(${scrollStep}px)`">
        <div class="posterListView">
          <div class="posterListCover addView" @click="onhandleAdd">
            <i class="el-icon-plus" />
            <span class="addViewText">新增样式</span>
          </div>
        </div>

        <div v-for="(item, index) in list" :key="index" class="posterListView">
          <div class="posterListCover" :class="{selectPoster: selectId === item.id}" @click="onhandleSelect(item)">
            <el-image :src="item.coverUrl" alt="" style="width: 100%;height: 100%;" fit="contain" :preview-src-list="[item.coverUrl]" />
          </div>
          <img v-if="selectId === item.id" src="~@/assets/image/liveRoom/posterSelect.png" alt="" class="posterSelectImg" />
          <div class="posterListTitle text_hidden">
            <textShowMore :line-clamp="1" :text="item.posterName" />
          </div>
          <div class="posterListViewBtn">
            <div class="posterSetting" @click="onChange(item, index)">
              <el-radio :value="item.isDefault" :label="0">设为默认</el-radio>
            </div>
            <i v-if="item.isSystem !== 0" class="el-icon-delete" @click="onhandleDel(item)" />
          </div>
        </div>

      </div>
      <div class="previous_page" @click="onhandlePrevious" />
      <div class="next_page" @click="onhandleNext" />
    </div>
  </AppDialog>
</template>

<script>
import { getMyPosterSetupList } from '@/api/liveRoom/liveRoom.js'
import textShowMore from '@/components/textShowMore/index2'
import AppDialog from '@/components/AppDialog'
import Dialog from '@/components/Dialog/index.js'
import { setPosterDefault, delPoster } from '@/api/liveRoom/liveRoom.js'
import Sortable from 'sortablejs'
export default {
  components: {
    AppDialog,
    textShowMore
  },
  data() {
    return {
      loading: false,
      visible: false,
      liveRoomInfo: {
        name: '',
        startTime: ''
      },
      userInfo: {
        nickName: ''
      },
      src: '',
      list: [],
      pageIndex: 1,
      pageSize: 10,
      hasNextMore: true, // 是否有下一页数据
      selectId: '',
      total: 0,
      showScroll: false,
      maxWidth: 0,
      scrollStep: 0
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          val && this.init()
          this.rowDrop()
        })
      }
    }
  },
  mounted() {},
  methods: {
    // 拖拽方法
    rowDrop() {
      const el = document.querySelector('.posterList .posterListView') // 找到想要拖拽的那一列
      const _this = this
      Sortable.create(el, {
        onEnd({ newIndex, oldIndex }) {
          console.log(newIndex, oldIndex, _this.tabList)
          const arr = JSON.parse(JSON.stringify(_this.tabList))
          // oldIIndex拖放前的位置， newIndex拖放后的位置  //tabOptionList为遍历的tab签
          const currRow = arr.splice(oldIndex - 1, 1)[0] // 鼠标拖拽当前的el-tabs-pane
          arr.splice(newIndex - 1, 0, currRow) // tableData 是存放所以el-tabs-pane的数组
          _this.tabList = arr
        }
      })
    },
    onhandleSelect(item) {
      this.selectId = item.id
    },
    onChange(item, index) {
      console.log(this)
      if (this.loading) return
      this.loading = true
      const data = {
        id: item.id,
        liveRoomId: this.liveRoomInfo.id
      }
      setPosterDefault(data).then((res) => {
        this.loading = false
        this.list.map(v => {
          v.isDefault = 1
        })
        item.isDefault = 0
      }).catch(() => {
        this.loading = false
      })
    },
    onhandleDel(item) {
      console.log(item, this.userInfo)
      if (item.createUserId !== this.userInfo.userId) {
        this.$message.error('当前样式非本人创建，不可删除。')
      }
      this.loading = true
      const data = {
        posterSetupId: item.id
      }
      delPoster(data).then(() => {
        this.list = []
        this.scrollStep = 0
        this.pageIndex = 1
        this.getList()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onhandleAdd() {
      Dialog.open({
        visible: true,
        type: 'PosterSetting',
        liveRoomInfo: this.liveRoomInfo,
        userInfo: this.userInfo,
        src: this.src,
        success: () => {
          this.getList()
        }
      })
    },
    getList() {
      this.loading = true
      const data = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      return getMyPosterSetupList(data).then(res => {
        this.list = this.list.concat(res.data.items)
        this.total = res.data.total
        this.hasNextMore = !(this.list.length >= res.data.total)
        this.loading = false
        this.$nextTick(() => {
          this.showScroll = this.$refs.scrollView.scrollWidth > this.$refs.scrollView.clientWidth
          this.maxWidth = this.$refs.scrollView.scrollWidth - this.$refs.scrollView.clientWidth
        })
      }).catch(() => {
        this.loading = false
      })
    },
    init() {
      this.loading = true
      this.list = []
      this.pageIndex = 1
      this.getList()
    },
    sure() {
      this.visible = false
      this.success && this.success()
    },
    onhandlePrevious() {
      this.scrollStep += 174
      if (this.scrollStep >= 0) {
        this.scrollStep = 0
        return
      }
    },
    onhandleNext() {
      this.scrollStep -= 174
      if (Math.abs(this.scrollStep) > this.maxWidth) {
        this.scrollStep = 0 - this.maxWidth
        if (this.hasNextMore) {
          this.pageIndex++
          this.getList().then(() => {
            this.scrollStep -= 174
          })
        }
        return
      }
      console.log('2222')
    }
  }
}
</script>

<style lang='scss' scoped>
.posterList_page_wrap {
  padding: 20px;
  max-height: 389px;
  overflow: hidden;
  position: relative;
}
.tips {
  color: #000000;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  margin-bottom: 22px;
}
.posterList {
  display: flex;
  gap: 20px;
  position: relative;
  transition: transform .3s ease;
  .posterListView {
    position: relative;
    .posterListCover {
      width: 154px;
      height: 274px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      flex-shrink: 0;
      border: 1px solid #fff;
      background: #FBFCFE;
      cursor: pointer;
    }
    .addView {
      background: #FBFCFE;
      border: 1px dashed #0C6FFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .el-icon-plus {
        font-size: 13px;
        font-weight: bolder;
      }
      .addViewText {
        margin-top: 10px;
        color: #0C6FFF;
        font-size: 12px;
      }
    }
    .posterListViewBtn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .posterSetting {
        color: #000000;
        font-family: "Microsoft YaHei";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
      }
      .el-icon-delete {
        cursor: pointer;
        color: #F53F3F;
      }
    }
    .posterListTitle {
      width: 154px;
      color: #000000;
      margin-top: 13px;
      margin-bottom: 12px;
      font-family: "Microsoft YaHei";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
    }
    .selectPoster {
      border: 1px solid #0C6FFF;
    }
    .posterSelectImg {
      position: absolute;
      top: 0;
      right: 0;
      width: 16px;
    }
  }

}
.previous_page {
  position: absolute;
  left: 10px;
  top: 50%;
  cursor: pointer;
  width: 19px;
  height: 19px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(~@/assets/image/liveRoom/previous_page_d.png);
  &:hover {
    background-image: url(~@/assets/image/liveRoom/previous_page_c.png);
  }
}
.next_page {
  position: absolute;
  right: 10px;
  top: 50%;
  cursor: pointer;
  width: 19px;
  height: 19px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(~@/assets/image/liveRoom/next_page_d.png);
  &:hover {
    background-image: url(~@/assets/image/liveRoom/next_page_c.png);
  }
}
</style>
