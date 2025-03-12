<template>
  <div :id="item.id" class="chatView">
    <!-- 非我的发言 -->
    <template v-if="!item.isMine">
      <div class="avatar">
        <AppAvatar
          :avatar="item.fromAvatar"
          :name="item.fromName"
          width="40"
          :no-name="true"
        />
      </div>
      <div class="chatConten m-l-10">
        <div class="chatUserInfo">
          <!-- <div class="userName text_hidden_ellipsis">
            {{ item.fromName }}
          </div> -->
          <div class="msgSendTime">
            {{ item.time | parseTime }}
          </div>
        </div>
        <div class="comment">
          <chatComment
            :content="item.content"
            :is-mine="item.staffId === item.fromId"
            :type="item.type"
            :item="item"
            @imgLoadSuccess="$emit('imgLoadSuccess')"
          />
        </div>
      </div>
    </template>

    <!-- 我的发言 -->
    <template v-else>
      <div class="chatConten m-r-10 is_mind">
        <div class="chatUserInfo chatUserInfo_isMind">
          <div class="msgSendTime">{{ item.time | parseTime }}</div>
          <!-- <div class="userName text_hidden_ellipsis m-l-8">{{ item.name }}</div> -->
          <!-- <div class="userRole" :class="item.role === 1 ? 'userRole_green' : 'userRole_red'">{{ item.roleText }}</div> -->
        </div>
        <div class="comment comment_isMind">
          <chatComment
            :content="item.content"
            :is-mine="item.isMine"
            :type="item.type"
            :item="item"
            @imgLoadSuccess="$emit('imgLoadSuccess')"
          />
        </div>
      </div>
      <div class="avatar">
        <AppAvatar :avatar="item.fromAvatar" :name="item.fromName" width="40" :no-name="true" />
      </div>
    </template>
  </div>
</template>

<script>
import { getOptionsValue } from '@/filters/index'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import chatComment from './chatComment.vue'
export default {
  components: {
    chatComment,
    AppAvatar
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      commentType: [
        { label: 'text', value: '1', des: '普通文本' },
        { label: 'image', value: '2', des: '图片' },
        { label: 'system', value: '3', des: '系统消息' }
      ]
    }
  },
  mounted() {},
  methods: {
    getOptionsValue
  }
}
</script>

<style lang='scss' scoped>
.chatView {
  display: flex;
  margin-bottom: 20px;
  padding: 0 20px;
  width: 100%;
  .systemInfo {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #666;
  }
  .avatar {
    width: 40px;
  }
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
.is_mind {
  .comment {
    margin-top: 0px!important;
  }
  .chatUserInfo {
    .userName {
      text-align: right;
    }
  }
  .comment_content {
    background-color: #0C6FFF!important;
    ::v-deep{
      .comment_content_text {
        color: #fff!important;
      }
    }
  }
}
</style>
