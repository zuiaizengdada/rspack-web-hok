<template>
  <div :class="[isFullScreen() ? 'stt-Popup' : 'stt-Slide-Popup']">
    <div class="header-stt-Popup">
      <span>参考模板</span>
      <el-button type="text" @click="handleClose">
        <i class="el-icon-close" style="font-size: 20px; color: #fff" />
      </el-button>
    </div>
    <div class="content-stt">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="content-stt-item"
        @click.stop="selectItem(item.content)"
      >
        <div class="content-stt-item-detail" v-html="item.content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectedTopicTemplate',
  inject: ['isFullScreen'],
  data() {
    return {
      list: [
        {
          title: '选题生成模版',
          content:
            '1. 黄金三秒--以钩引人（爆炸性开篇、反认知观点、视听冲击）锁定观众的眼球（好奇心）\n2. 热点内容--以趣留人（时效性热点、潮流感话题、紧贴时事）调动观众的情绪（求知欲）\n3. 干货分析--以理服人（专业性说服、差异化观点、逻辑闭环）说服观众的大脑（思考力）\n4. 情感真挚--以情动人（真诚性分享、有温度语言、情感共鸣）链接观众的内心（安全感）\n5. 引导互动--以氛促人（鼓励性参与、情景化设问、共同体验）激活观众的唇齿（表达欲）'
        }
      ]
    }
  },
  methods: {
    selectItem(val) {
      this.$emit('selectItem', val)
    },
    handleClose() {
      this.$emit('handleClose', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.stt-Slide-Popup {
  width: 432px;
  height: 337px;
  position: absolute;
  bottom: -1px;
  left: -25px;
  background-color: #fff;
  z-index: 4002;
  overflow-y: hidden;
}
.stt-Popup {
  width: 620px;
  background: #fff;
  position: absolute;
  top: -324px;
  left: -462px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  padding-bottom: 20px;
  border-radius: 8px 10px;
}

.header-stt-Popup {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 23px;
  background: linear-gradient(90deg, #01acf0 0%, #397fff 99%);
  border-radius: 8px 10px 0px 0px;
  span {
    font-size: 16px;
    color: #FFFFFF;
  }
}
.content-stt {
  width: 100%;
  height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 14px;
  margin-top: 20px;
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    // display: none;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #d0d0d0;
    transition: all 0.4s ease;
  }

  &::-webkit-scrollbar-track {
    background: #d0d0d0;
  }
  .content-stt-item {
    width: 100%;
    // max-height: 60px;
    background: #fff;
    border-radius: 10px;
    padding: 10px 10px;
    user-select: none;
    cursor: pointer;
    &:hover {
      background: #f5f5f5;
    }
    .content-stt-item-title {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .content-stt-item-detail {
      font-size: 14px;
      color: #333;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
      // white-space: normal;
    }
  }
}
</style>
<style>
.stt-popper-Popup {
  z-index: 6999 !important;
  width: 589px;
  margin-top: 20px !important;
}
</style>
