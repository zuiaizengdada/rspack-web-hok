<template>
  <div :id="`scriptPreview_${item.id}`" class="listView">
    <template v-if="item.eventType === 1">
      <div class="listViewContent m-t-10">
        <div class="avatar">
          <AppAvatar
            :avatar="item.robots.robotHeadPic"
            :name="item.robots.robotNickName"
            width="40"
            :no-name="true"
          />
        </div>
        <div class="chatConten m-l-10">
          <div class="chatUserInfo">
            <div class="userName text_hidden_ellipsis">
              <!-- {{ item.robots.robotNickName }} -->
              <div v-if="renderRoleInfo(item.robots.robotId).type" class="user_info_role">{{ renderRoleInfo(item.robots.robotId).role }}</div>
              <!-- <el-tag v-if="renderRoleInfo(item.robots.robotId).type" :type="renderRoleInfo(item.robots.robotId).type" size="mini" style="margin-right: 5px;" effect="plain">{{ renderRoleInfo(item.robots.robotId).role }}</el-tag> -->
              <textShowMore :key="item.robots.robotId" :text="item.robots.robotNickName" :line-clamp="1" />
            </div>
          </div>
          <div class="comment">
            <chatComment :content="item.msgContent" :type="item.msgType" @imgLoadSuccess="$emit('imgLoadSuccess')" />
          </div>
        </div>
      </div>
    </template>
    <!-- <template v-else-if="item.eventType === 2">
      <div class="systemMsg">
        <svg-icon icon-class="xitongxiaoxi" class-name="SystemIcon" />
        <div style="flex: 1 0 0">
          系统消息：{{ `${item.adjustNumber >= 0 ? '增加' : '减少'}` }}{{ Math.abs(item.adjustNumber) }}人
        </div>
        <div>
          <el-checkbox :value="multipleSelection.includes(item.scriptInteractId)" @change="onhandleCheck" />
        </div>
      </div>
    </template> -->
  </div>
</template>

<script>
import chatComment from './chatComment.vue'
import { mapState } from 'vuex'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import textShowMore from '@/components/textShowMore/index2.vue'
import { renderRoleInfo } from '@/views/live/columns.js'
export default {
  components: {
    chatComment,
    AppAvatar,
    textShowMore
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          adjustNumber: 0, // 在线人数调整数量
          eventType: 0, // 事件类型1-发送消息 2-人数调整
          height: 0, // 图片高度
          msgContent: '', // 消息内容
          msgType: 0, // 消息类型
          robots: [{ robotHeadPic: '', robotId: '', robotNickName: '' }], // 机器人列表
          scriptInteractId: '', // 脚本互动ID
          sendTime: 0, // 发送时间，单位：秒
          width: 0 // 图片宽度
        }
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState({
      multipleSelection: state => state.liveScript.multipleSelection
    })
  },
  mounted() {},
  methods: {
    renderRoleInfo
  }
}
</script>

<style lang='scss' scoped>
.listView {
    .listViewContent {
      display: flex;
      // align-items: center;
      align-items: flex-start;
      .chatConten {
    width: 100%;
    .chatUserInfo {
      display: flex;
      align-items: center;
      .userRole {
        height: 20px;
        line-height: 20px;
        padding: 0 10px;
        border-radius: 4px;
        font-size: 12px;
        color: #FFFFFF;
        line-height: 20px;
        margin-right: 6px;
      }
      .userRole_green {
        background: #27C000;
      }
      .userRole_red {
        background: #EE2E14;
      }
      .msgSendTime {
        color: #999;
        font-size: 14px;
      }
      .userName {
        font-size: 14px;
        color: rgba(51, 51, 51, 0.9);
        line-height: 22px;
        margin-right: 7px;
        max-width: 200px;
        display: flex;
        align-items: center;
        // display: -webkit-box;//对象作为弹性伸缩盒子模型显示
        // overflow: hidden;//溢出隐藏
        // -webkit-box-orient: vertical;//设置伸缩盒子对象的子元素的排列方式
        // -webkit-line-clamp: 1;//设置 块元素包含的文本行数
      }
      .user_more {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    }
    .chatUserInfo_isMind {
      justify-content: flex-end;
    }
    .comment {
      margin-top: 10px;
      .msgMsgLoading {
        display: flex;
        align-items: center;
        padding-right: 5px;
      }
    }
    .comment_isMind {
      text-align: right;
      display: flex;
      justify-content: flex-end;
    }
    .comment_link {
      margin-top: 6px;
      .comment_content {
        cursor: pointer;
        display: inline-block;
        padding: 6px 10px;
        font-size: 14px;
        color: rgba(51, 51, 51, 0.9);
        line-height: 22px;
        box-sizing: border-box;
        position: relative;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 6px;
        font-size: 12px;
        color: #777777;
        line-height: 20px;
      }
    }
    .comment_link_isMine {
      text-align: right;
    }
    .sendError {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 12px;
      color: #FF4747;
      line-height: 20px;
      margin-top: 6px;
      cursor: pointer;
      .sendErrorImg {
        width: 20px;
        height: 20px;
      }
    }
  }
    }
    .systemMsg {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      .SystemIcon {
        width: 40px;
        height: 40px;
        font-size: 40px;
        margin-right: 10px;
      }
    }
}
.active {
  border: 1px solid #0C6FFF;
}
.user_info_role {
  display: inline-block;
  width: 28px;
  min-width: 28px;
  height: 16px;
  background: #0091FF;
  border-radius: 2px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 14px;
  text-align: center;
  margin-left: 4px;
  margin-right: 4px;
}
</style>
