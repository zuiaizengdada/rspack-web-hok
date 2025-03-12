<template>
  <div class="pageWrap">
    <div
      class="listView"
      :class="{active: item.scriptInteractId === configurationIndex, ifCurrent: item.sendTime === currentTime}"
      @click="onhandleClick"
    >
      <template v-if="item.eventType === 1">
        <div class="listViewHeader">
          <avatarList :list="item.robots" />
          <div class="userName text_hidden_1">
            <el-popover width="414" trigger="hover">
              <div class="userListView">
                <div class="userListViewHeader">共{{ item.robots.length }}位学员</div>
                <div class="userListBox overflowOuto">
                  <div v-for="(robot) in item.robots" :key="robot.robotId" class="userListItem">
                    <AppAvatar style="margin-right: 6px" :avatar="robot.robotHeadPic" :name="robot.robotNickName" :width="32" :no-name="true" />
                    <span v-if="renderRoleInfo(robot.robotId).role" class="user_info_role">{{ renderRoleInfo(robot.robotId).role }}</span>
                    <textShowMore :key="robot.robotId" :text="robot.robotNickName" :line-clamp="1" style="width: 96px" />
                  </div>
                </div>
              </div>
              <div slot="reference">
                <span v-for="(robot, index) in item.robots" :key="robot.robotId">
                  <div v-if="renderRoleInfo(robot.robotId).type" class="user_info_role">{{ renderRoleInfo(robot.robotId).role }}</div>
                  <span>{{ robot.robotNickName }}</span>
                  <span v-if="index !== item.robots.length - 1">、</span>
                </span>
              </div>
            </el-popover>
          </div>
          <el-checkbox :value="multipleSelection.includes(item.scriptInteractId)" @change="onhandleCheck" />
        </div>
        <div class="listViewContent m-t-10">
          <div>
            <chatComment :content="item.msgContent" :type="item.msgType" />
          </div>
          <div class="editBtnView">
            <div class="btn_primary editBtn" @click="onhandleEdit">编辑</div>
          </div>
        </div>
      </template>
      <template v-else-if="item.eventType === 2">
        <div class="systemMsg">
          <svg-icon icon-class="xitongxiaoxi" class-name="SystemIcon" />
          <div style="flex: 1 0 0">
            系统消息：{{ `${item.adjustNumber >= 0 ? '增加' : '减少'}` }}{{ Math.abs(item.adjustNumber) }}人
          </div>
          <div class="systemMsgEdit">
            <el-checkbox :value="multipleSelection.includes(item.scriptInteractId)" @change="onhandleCheck" />
            <div class="editBtnView">
              <div class="btn_primary editBtn" @click="onhandleEdit">编辑</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="item.eventType === 3">
        <div class="systemSellGoods">
          <div class="systemSellGoodsIcon">
            <img src="~@/assets/image/liveRoom/shopCar.png" class="shopingIcon" />
          </div>
          <div class="sellGoods">
            <span class="sellGoodsText">
              推送商品：
            </span>
            <span class="goodsList">
              <!-- <img class="m-r-10" style="width:100px; height: 75px;border-radius: 4px;background: #F5F7FA;object-fit: contain;" :src="item.goodsImg"> -->
              <img
                v-if="item.goodsType === 5"
                class="m-r-10"
                style="width:100px; height: 75px;border-radius: 4px;background: #F5F7FA;object-fit: contain;"
                :src="item.contentUrl ? item.contentUrl.split(',')[0] : ''"
              />
              <img
                v-else
                class="m-r-10"
                style="width:100px; height: 75px;border-radius: 4px;background: #F5F7FA;object-fit: contain;"
                :src="item.coverUrl"
              />
              <div class="goodsDetail">
                <div class="goodsName">{{ item.goodsName }}<el-tag v-if="item.goodsSpecName" size="small">{{ item.goodsSpecName }}</el-tag></div>
                <div class="sellTime">
                  <svg-icon class-name="size-icon" icon-class="time_grey" />
                  <span class="sellTimeText">停留时长1</span>
                  <span>{{ item.stayTime / 60 }}分钟</span>
                </div>
                <div class="goodsPrice">
                  <el-tag v-if="item.goodsType === 5" size="small">线下课</el-tag>
                  <template v-else>
                    <unitPrice :price="item.goodsPrice" />
                  </template>
                </div>
              </div>
            </span>
          </div>
          <div class="systemSellGoodsEdit" style="height: 96px">
            <el-checkbox :value="multipleSelection.includes(item.scriptInteractId)" @change="onhandleCheck" />
            <div class="editBtnView">
              <div class="btn_primary editBtn" @click="onhandleEdit">编辑</div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="item.eventType === 4">
        <div class="systemMsg">
          <svg-icon icon-class="scriptSign" class-name="SystemIcon" />
          <div style="flex: 1 0 0; color: #666">
            <div>签到</div>
            <div>时长：{{ (item.stayTime / 60) | getOptionsValue(signTimeOption) }}</div>
          </div>
          <div class="systemMsgEdit">
            <el-checkbox :value="multipleSelection.includes(item.scriptInteractId)" @change="onhandleCheck" />
            <div class="editBtnView">
              <div class="btn_primary editBtn" @click="onhandleEdit">编辑</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import avatarList from './avatarList.vue'
import chatComment from './chatComment.vue'
import textShowMore from '@/components/textShowMore/index2.vue'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { mapState } from 'vuex'
import unitPrice from '@/views/live/liveList/component/price'
import { renderRoleInfo, signTimeOption } from '@/views/live/columns.js'
export default {
  components: {
    chatComment,
    avatarList,
    textShowMore,
    AppAvatar,
    unitPrice
  },
  filters: {
    renderName(val) {
      if (!val || val.length === 0) return ''
      return val.reduce((pre, next) => {
        pre.push(next.robotNickName)
        return pre
      }, []).join('、')
    }
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
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      signTimeOption,
      loading: false
    }
  },
  computed: {
    ...mapState({
      currentTime: state => state.liveScript.currentTime,
      multipleSelection: state => state.liveScript.multipleSelection,
      configurationIndex: state => state.liveScript.configurationIndex
    })
  },
  mounted() {},
  methods: {
    renderRoleInfo,
    onhandleCheck(res) {
      console.log(res)
      if (this.loading) return
      this.loading = true
      if (res) {
        this.$store.commit('liveScript/add_multipleSelection', this.item.scriptInteractId)
      } else {
        this.$store.commit('liveScript/del_multipleSelection', this.item.scriptInteractId)
      }
      this.loading = false
    },
    onhandleEdit() {
      this.$store.commit('liveScript/set_configurationIndex', this.item.scriptInteractId)
      this.$emit('onEdit')
    },
    onhandleClick() {
      this.$store.commit('liveScript/set_timeListTime', 1)
      this.$store.commit('liveScript/set_configurationIndex', this.item.scriptInteractId)
      this.$emit('onListClick')
    }
  }
}
</script>

<style lang='scss' scoped>
.pageWrap {
  padding-bottom: 30px;
}
.listView {
    margin: 0 20px;
    margin-bottom: 30px;
    background: #F5F9FF;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #fff;
    cursor: pointer;
    .listViewHeader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .userName {
        flex: 1 0 0;
        padding-left: 10px;
        padding-right: 20px;
        text-align: left;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
    }
    .listViewContent {
      display: flex;
        // align-items: center;
        align-items: flex-end;
        justify-content: space-between;
        .editBtnView {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          .editBtn {
              cursor: pointer;
              width: 48px;
              height: 24px;
              border-radius: 4px;
              border: 1px solid #0C6FFF;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #1778FF;
              line-height: 20px;
              text-align: center;
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
      .systemMsgEdit {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: space-between;
        .editBtnView {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          .editBtn {
              cursor: pointer;
              width: 48px;
              height: 24px;
              border-radius: 4px;
              border: 1px solid #0C6FFF;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #1778FF;
              line-height: 20px;
              text-align: center;
          }
        }
      }
    }
}
.active {
  border: 1px solid #0C6FFF;
}
.ifCurrent {
  background: #E0ECFF!important;
}
.userListView {
  .userListViewHeader {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 26px;
  }
  .userListBox {
    display: flex;
    flex-wrap: wrap;
    max-height: 470px;
    padding-top: 16px;
    .userListItem {
      flex: 50% 0 0;
      display: flex;
      margin-bottom: 12px;
      align-items: center;
      padding-right: 16px;
    }
  }
}
.systemSellGoods {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 20px;
  .systemSellGoodsIcon {
    width: 40px;
    height: 40px;
    font-size: 40px;
    margin-right: 10px;
    border-radius: 50%;
    background: #FB810E;
  }
  .sellGoods {
    flex: 1 0 0;
    display: flex;
    align-items: center;
    .goodsList {
      background: #fff;
      flex: 1 0 0;
      padding: 10px;
      display: flex;
      cursor: pointer;
      align-items: center;
      border-bottom: 1px solid #F5F5F5;
      border-left: 1px solid #F5F5F5;
      border-right: 1px solid #F5F5F5;
      &:hover {
        // background: #E7F0FF;
        border-radius: 4px;
      }
      .goodsSort {
        width: 60px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
      .goodsDetail {
        flex: 1 0 0;
        height: 75px;
        display: flex;
        flex-direction: column;
        // align-items: flex-end;
        justify-content: space-between;
        .goodsName {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
        }
        .goodsPrice {
          display: flex;
          align-items: flex-end;
          .crossedPrice{
            margin-left: 10px;
            text-decoration:line-through;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 17px;
          }
        }
      }
      .goodsBtn {
        width: 100px;
      }
      &:nth-child(1) {
        border-top: 1px solid #F5F5F5;
      }
    }
  }
  .systemSellGoodsEdit {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    .editBtnView {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .editBtn {
          cursor: pointer;
          width: 48px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #0C6FFF;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1778FF;
          line-height: 20px;
          text-align: center;
      }
    }
  }
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
