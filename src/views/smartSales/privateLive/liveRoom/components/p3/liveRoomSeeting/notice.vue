<template>
  <div class="liveRoomNotice">
    <div class="liveRoomNoticeBox">
      <div class="liveRoomNoticeTitle">公告</div>
      <div v-if="liveRoomDetail.announcement" ref="announcement" class="liveRoomNoticeContent">
        <!-- <el-tooltip v-if="ifShow" class="item" effect="dark" :content="liveRoomDetail.announcement" placement="top-start">
          {{ liveRoomDetail.announcement }}
        </el-tooltip>
        <template v-else>{{ liveRoomDetail.announcement }}</template> -->
        <textShowMore :text="liveRoomDetail.announcement" :line-clamp="3" style="margin-bottom: 12px" />
      </div>
      <el-image v-if="liveRoomDetail.announcementUrl" :src="liveRoomDetail.announcementUrl" lazy style="max-width: 319px" :preview-src-list="[liveRoomDetail.announcementUrl]" />
      <div class="liveRoomNoticeEdit" @click="onhandleOpenEditNotice">编辑公告</div>
    </div>
  </div>
</template>

<script>
import Dialog from '../../Dialog/index'
import textShowMore from '@/components/textShowMore/index2.vue'
import { mapState } from 'vuex'
export default {
  components: {
    textShowMore
  },
  data() {
    return {
      ifShow: false
    }
  },
  computed: {
    ...mapState({
      liveRoomDetail: state => state.im.liveRoomDetail
    })
  },
  mounted() {},
  methods: {
    // 点击打开编辑公告弹框
    onhandleOpenEditNotice() {
      // if (this.liveRoomDetail.status === 9) {
      //   return
      // }
      Dialog.open({
        type: 'EditNotice',
        visible: true,
        liveRoomId: this.$route.params.id,
        form: {
          value: JSON.parse(JSON.stringify(this.liveRoomDetail.announcement)),
          url: JSON.parse(JSON.stringify(this.liveRoomDetail.announcementUrl || ''))
        },
        success: () => {
          Dialog.close()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.liveRoomNotice {
  padding: 19px 24px 0;
  .liveRoomNoticeBox {
    border-bottom: 1px solid #F5F5F5;
    .liveRoomNoticeTitle {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: bold;
      color: #333333;
      line-height: 25px;
      padding-bottom: 16px;
    }
    .liveRoomNoticeEdit {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0C6FFF;
      line-height: 20px;
      padding-bottom: 20px;
      cursor: pointer;
    }
    .liveRoomNoticeContent {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #777777;
      line-height: 20px;
      // display: -webkit-box;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // -webkit-line-clamp: 3;
      // -webkit-box-orient: vertical;
      // margin-bottom: 12px;
      // white-space: pre-wrap;
      // font-size: inherit;
      // word-break: break-word;
    }
  }
}
.disabled {
  cursor: not-allowed!important;
  color: #c0c4cc!important;
}
</style>
