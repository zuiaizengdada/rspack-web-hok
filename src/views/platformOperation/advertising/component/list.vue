<template>
  <div v-loading="loading" class="adSettingList">
    <div class="adSettingListTitle">
      <div class="titleText">广告列表</div>
      <div v-if="!ifAdd" class="addText" @click="$emit('onhandleAdd')"><i class="el-icon-plus" />新增</div>
    </div>
    <div v-if="data.length === 0" class="noData">
      <img src="@/assets/image/adNoData.png" alt="" />
      <div class="noDataText">列表内容为空</div>
    </div>
    <div v-else class="listWrap overflowOuto">
      <div
        v-for="(item) in data"
        :key="item.id"
        v-dragging="{ item: item, list: data, group: 'item' }"
        :class="{'u_current': current === item.id, 'mousedown': mousedownId === item.id}"
        class="listUl"
        @click="onhandleClick(item)"
        @mouseenter="moveId = item.id"
        @mouseleave="moveId = ''"
        @mousedown="mousedownId = item.id"
        @mouseup="mousedownId = ''"
      >
        <i v-if="moveId === item.id" class="el-icon-rank" />{{ item.adTitle }}
      </div>
    </div>
  </div>
</template>

<script>
import { adInfoSort } from '@/api/platform/advertising'
export default {
  components: {},
  props: {
    ifAdd: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => { return [] }
    },
    current: {
      type: [String, Number],
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moveId: '', // 当前鼠标移入id
      mousedownId: '',
      draged: {},
      to: {}
    }
  },
  mounted() {
    const _this = this
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      _this.draged = res.draged
      this.to = res.to
    })
    this.$dragging.$on('dragend', () => {
      this.mousedownId = ''
      const data = [
        { id: _this.draged.id, pid: this.$route.params.id, sort: _this.to.sort },
        { id: _this.to.id, pid: this.$route.params.id, sort: _this.draged.sort }
      ]
      adInfoSort(data).then(() => {
        _this.$emit('dragged')
      })
    })
  },
  methods: {
    onhandleClick(item) {
      if (this.current === item.id) {
        return
      }
      this.$emit('onClick', item)
    }
  }
}
</script>

<style lang='scss' scoped>
.adSettingList {
  height: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  .adSettingListTitle {
    padding-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 24px;
    .titleText {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
    .addText {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #0C6FFF;
      line-height: 22px;
      cursor: pointer;
      .el-icon-plus {
        width: 24px;
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .listWrap {
    padding-top: 14px;
    flex: 1 0 0;
    padding-right: 20px;
    .listUl {
      height: 32px;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #fff;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 32px;
      padding: 0 10px;
      word-break:keep-all;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      margin-bottom: 11px;
      cursor: grab;
      .el-icon-rank {
        width: 16px;
        height: 16px;
        line-height: 16px;
        color: #1976FF;
        margin-right: 10px;
      }
      &:hover {
        background: #F7F9FF;
        border-radius: 4px;
      }
    }
    >.u_current {
      background: #EDF3FF!important;
      border: 1px solid #0C6FFF;
    }
    .mousedown {
      cursor: grabbing!important;
    }
  }
  .noData {
    padding-top: 25px;
    width: 230px;
    > img {
      width: 100%;
    }
    .noDataText {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #A4A4A8;
      line-height: 20px;
      text-align: center;
    }
  }
}
</style>
