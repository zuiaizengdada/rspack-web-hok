<template>
  <div v-if="list.length" class="tabs-wrapper">
    <draggable v-model="list" draggable=".tabs-item" @end="onEnd">
      <div
        v-for="item in list"
        :key="item.key"
        :class="{ 'tabs-item': true, 'tabs-active': item.active }"
        @click="() => handleActive(item)"
      >
        <span>{{ item.label }}</span>
      </div>
    </draggable>

    <el-tooltip
      class="item"
      effect="dark"
      content="注：拖动可调整顺序"
      placement="right"
    >
      <img
        class="wenhao-icon"
        src="@/assets/image/smartSales/roomdetail/wenhao.png"
        alt=""
      />
    </el-tooltip>
  </div>
</template>

<script>
import { personSetUpRecord, personSetUpRecordSave } from '@/api/liveRoom/index'
import draggable from 'vuedraggable'
export default {
  components: { draggable },
  data() {
    return {
      list: [],
      permsList: this.$route.meta.permsList || [] // 权限
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      personSetUpRecord({ code: 'LIVE_ROOM_INFO_TAB' }).then(res => {
        const ls = JSON.parse(res.data)
        if (!ls || !ls.length) {
          this.$message.error('页签暂无数据！')
          return
        }

        this.list = this.filterMenu(ls)
        this.$emit('change', this.list?.find(f => f.active) || [])
      })
    },
    // 根据权限 控制模块显示隐藏
    filterMenu(list) {
      console.log(JSON.parse(JSON.stringify(list)))
      const rArr = []
      const comObj = {
        plan: 'menu:liveDetail:viewerProfile', // 直播详情-计划看播用户
        actual: 'menu:liveDetail:activeProfile', // 直播详情-实际看播用户
        info: 'menu:liveDetail:basicInfo', // 直播详情-基础信息
        'enroll-setting': 'menu:liveDetail:signSetting', // 直播详情-报名设置
        'operate-setting': 'menu:liveDetail:operationSetting', // 直播详情-运营设置
        'purchase-record': 'menu:liveDetail:buySetting', // 直播详情-购买记录
        'playback-setting': 'menu:liveDetail:playbackSetting', // 直播详情-回放设置
        'chat-record': 'menu:liveDetail:chatSetting', // 直播详情-聊天记录
        'data-record': 'menu:liveDetail:dataStatistics' // 直播详情-数据看板
      }
      let active = -1
      list.forEach((v, index) => {
        if (v.active) {
          active = index
        }
        if (this.permsList.includes(comObj[v.key])) {
          rArr.push(v)
        }
      })
      // 如果没有设置active。或者原来的菜单消失了，设置第一个勾选
      if (active === -1 && rArr.length) rArr[0].active = true
      return rArr
    },
    handleActive(record) {
      this.list.forEach(item => {
        if (item.key !== record.key) {
          item.active = false
        }
      })
      record.active = true
      this.$emit('change', record)
    },
    // 拖拽结束
    async onEnd() {
      let ls = []
      ls = this.list.map(item => ({ ...item, active: item.key === 'info' }))
      await personSetUpRecordSave({
        code: 'LIVE_ROOM_INFO_TAB',
        value: JSON.stringify(ls)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tabs-wrapper {
  width: 100%;
  overflow-x: auto;
  display: flex;
  align-items: center;
  .tabs-item {
    width: 120px;
    display: inline-block;
    text-align: center;
    padding: 9px 0;
    border-radius: 5px;
    background: #f7f7f7;
    margin-right: 5px;
    user-select: none;
    cursor: pointer;
    span {
      color: #000;
      font-family: 'Microsoft YaHei';
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 1px;
    }
  }
  .tabs-active {
    background: linear-gradient(90deg, #cee2ff 0%, #bcc9ff 100%);
  }

  .wenhao-icon {
    width: 24px;
    height: 24px;
    margin-left: 4px;
  }
}
</style>
