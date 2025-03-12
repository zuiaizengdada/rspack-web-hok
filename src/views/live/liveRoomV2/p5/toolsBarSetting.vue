<template>
  <div class="toolsBarSetting">
    <div class="toolsBarSetting_title">设置</div>
    <div class="tools_tips border_bottom">注：营销工具区可从互动消息区拖动，也可将营销工具拖到互动消息区，且可以支持位置的拖动排序.</div>
    <div class="tools_title">营销工具区<span class="tools_tips m-b-10 m-l-10">最多可展示4个，功能支持拖动进行排序。</span></div>
    <div class="tools_box">
      <div class="tools_view">
        <draggable
          v-model="marketingToolbarData"
          chosen-class="move_drag_btn_primary"
          force-fallback="true"
          :group="group"
          :animation="200"
          @start="onStart"
          @end="onEnd"
        >
          <transition-group>
            <div v-for="(item) in marketingToolbarData" :key="item.key" class="tools_item no-select tools_item1">{{ item.label }}</div>
          </transition-group>
        </draggable>
      </div>

      <div v-if="errTips" class="errTips">营销工具区最少保留一个</div>
    </div>
    <div class="tools_title">互动消息区</div>
    <div class="tools_box">
      <div class="tools_view">
        <draggable
          v-model="liveToolBarData"
          chosen-class="move_drag_btn_primary"
          force-fallback="true"
          :group="group"
          :animation="200"
          :move="move2"
          @start="onStart"
          @end="onEnd"
        >
          <transition-group>
            <div v-for="(item) in liveToolBarData" :key="item.key" class="tools_item no-select tools_item2">{{ item.label }}</div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <div class="foot_btn">
      <div class="foot_btn_sure" @click="onhandleSure">确定</div>
      <div class="foot_btn_close" @click="onhandleCancal">关闭</div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { savePersonSetUpRecord } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {
    draggable
  },
  props: {
    liveToolBar: {
      type: Array,
      default: () => {
        return []
      }
    },
    marketingToolbar: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      top: '10vh',
      loading: false,
      visible: false,
      errTips: false,
      group: 'toolsBarSettingGroup',
      liveToolBarData: [],
      marketingToolbarData: []
      // liveToolBar: [],
      // marketingToolbar: []
    }
  },
  watch: {
    liveToolBar: {
      handler(val) {
        this.liveToolBarData = val
      },
      deep: true,
      immediate: true
    },
    marketingToolbar: {
      handler(val) {
        this.marketingToolbarData = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.errTips = false
  },
  methods: {
    onhandleCancal() {
      this.errTips = false
      this.$emit('cancal')
    },
    onhandleSure() {
      this.loading = true
      this.errTips = false
      if (this.marketingToolbarData.length === 0) {
        this.errTips = true
        return
      }
      const value = {
        liveToolBar: [],
        marketingToolbar: []
      }
      this.liveToolBarData.map(v => {
        value.liveToolBar.push(v.key)
      })
      this.marketingToolbarData.map(v => {
        value.marketingToolbar.push(v.key)
      })
      const data = {
        code: 'LIVE_ROOM_MARKETING_TOOLS_TAB',
        value: JSON.stringify(value)
      }
      savePersonSetUpRecord(data).then(() => {
        this.$emit('success', {
          liveToolBar: this.liveToolBarData,
          marketingToolbar: this.marketingToolbarData
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    onStart(e) {},
    onEnd(e) {},
    move2(e) {
      if (this.marketingToolbarData.length >= 4) {
        if (e.related._prevClass === 'tools_item no-select tools_item1') {
          return false
        }
      }
      return true
    }
  }
}
</script>

<style lang='scss' scoped>
.toolsBarSetting {
  // padding: 16px;
  .toolsBarSetting_title {
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 16px;
    font-style: normal;
    font-weight: bolder;
    line-height: 16px;
    margin-bottom: 15px;
  }
  .tools_tips {
    color: #999999;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-style: normal;
    font-weight: Normal;
    line-height: 16px;
  }
  .border_bottom {
    padding-bottom: 15px;
    border-bottom: 1px solid #DCDEE1;
  }
  .tools_title {
    margin-top: 15px;
    margin-bottom: 10px;
    color: #000000;
    font-family: "Microsoft YaHei";
    font-size: 16px;
    font-style: normal;
    font-weight: Semi Bold;
    line-height: 16px;
  }
  .tools_box {
    border-radius: 4px;
    border: 1px solid #DCDEE1;
    padding: 10px;
    position: relative;
    .tools_view {
      min-height: 34px;
      > div {
        min-height: 34px;
      }
      span {
        min-height: 34px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .tools_item {
        color: #000;
        font-weight: bold;
        text-align: center;
        line-height: 34px;
        width: 86px;
        height: 34px;
        flex-shrink: 0;
        border-radius: 5px;
        background: #F7F7F7;
        border: 1px solid #F7F7F7;
        cursor: move;
      }
    }
    .errTips {
      position: absolute;
      bottom: -20px;
      left: 0;
      font-size: 10px;
      color: red;
    }
  }
  .foot_btn {
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .foot_btn_sure {
      cursor: pointer;
      width: 70px;
      height: 32px;
      line-height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #0C6FFF;
      color: #ffffff;
      text-align: center;
      font-family: "Microsoft YaHei";
      border: 1px solid #0C6FFF;
      font-size: 14px;
      font-weight: bolder;
    }
    .foot_btn_close {
      cursor: pointer;
      margin-left: 10px;
      width: 70px;
      height: 32px;
      line-height: 32px;
      flex-shrink: 0;
      border-radius: 5px;
      border: 1px solid #DCDFE5;
      background: #F9F9F9;
      color: #000000;
      text-align: center;
      font-family: "Microsoft YaHei";
      font-size: 14px;
      font-weight: bolder;
    }
  }
}
.chosen {
  background: pink;
}
</style>
