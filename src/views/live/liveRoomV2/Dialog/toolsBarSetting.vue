<template>
  <AppDialog v-model="visible" title="设置" width="432px" :loading="loading" height="auto" :top="top" @success="sure">
    <div class="toolsBarSetting">
      <div class="tools_tips border_bottom">注：营销工具区可从互动消息区拖动，也可将营销工具拖到互动消息区，且可以支持位置的拖动排序.</div>
      <div class="tools_title">营销工具区<span class="tools_tips m-b-10 m-l-10">最多可展示4个，功能支持拖动进行排序。</span></div>
      <div class="tools_box">
        <div class="tools_view">
          <draggable
            v-model="marketingToolbar"
            chosen-class="move_drag_btn_primary"
            force-fallback="true"
            :group="group"
            :animation="200"
            @start="onStart"
            @end="onEnd"
          >
            <transition-group>
              <div v-for="(item) in marketingToolbar" :key="item.key" class="tools_item no-select tools_item1">{{ item.label }}</div>
            </transition-group>
          </draggable>
        </div>
      </div>
      <div class="tools_title">互动消息区</div>
      <div class="tools_box">
        <div class="tools_view">
          <draggable
            v-model="liveToolBar"
            chosen-class="move_drag_btn_primary"
            force-fallback="true"
            :group="group"
            :animation="200"
            :move="move2"
            @start="onStart"
            @end="onEnd"
          >
            <transition-group>
              <div v-for="(item) in liveToolBar" :key="item.key" class="tools_item no-select tools_item2">{{ item.label }}</div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script>
import draggable from 'vuedraggable'
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog,
    draggable
  },
  data() {
    return {
      top: '10vh',
      loading: false,
      visible: false,
      group: 'toolsBarSettingGroup',
      liveToolBar: [],
      marketingToolbar: []
    }
  },
  mounted() {},
  methods: {
    sure() {
      this.success && this.success({
        liveToolBar: this.liveToolBar,
        marketingToolbar: this.marketingToolbar
      })
      this.visible = false
    },
    onStart(e) {},
    onEnd(e) {},
    move2(e) {
      if (this.marketingToolbar.length >= 4) {
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
  padding: 16px;
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
    .tools_view {
      min-height: 40px;
      > div {
        min-height: 40px;
      }
      span {
        min-height: 40px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .tools_item {
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
  }
}
.chosen {
  background: pink;
}
</style>
