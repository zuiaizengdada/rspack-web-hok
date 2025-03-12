<template>
  <div class="listView" :style="{width: width}">
    <template v-for="(item, index) in data">
      <div v-if="index < 5" :key="index" class="listLi" :style="listyle">
        <el-tooltip class="item" effect="dark" :content="item.nickName" placement="top-start">
          <div class="text_hidden_ellipsis" :title="item.nickName">{{ item.nickName }}</div>
        </el-tooltip>
        <i v-if="del" class="el-icon-close m-l-8 delBtn" @click="$emit('onDel', item)" />
      </div>
    </template>
    <div v-if="data.length > 0" :style="listyle" class="listLi More">
      <span class="pointer" @click="handleClickMore">更多...</span>
    </div>
    <!-- 更多展示弹框 -->
    <moreAssistant
      ref="moreAssistant"
      :config="moreAssistantConfig"
      :disabled="disabled"
      @autoAllocation="(res) => $emit('autoAllocation', res)"
      @unAutoAllocation="(res) => $emit('unAutoAllocation', res)"
      @onDel="(res) => $emit('onDelBatch', res)"
      @onAdd="(res) => $emit('onAdd', res)"
    />
  </div>
</template>

<script>
import moreAssistant from './moreAssistant.vue'
export default {
  components: {
    moreAssistant
  },
  props: {
    del: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: [Number, String],
      default: ''
    },
    listyle: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      moreAssistantConfig: {
        visible: false,
        data: []
      }
    }
  },
  mounted() {},
  methods: {
    // 点击更多
    handleClickMore() {
      this.moreAssistantConfig.visible = true
      this.moreAssistantConfig.data = this.data
    },
    refresh() {
      this.$set(this.moreAssistantConfig, 'data', this.data)
      this.$nextTick(() => {
        this.$refs.moreAssistant && this.$refs.moreAssistant.searchFn()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.listView {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px dashed #979797;
    display: flex;
    flex-wrap: wrap;
    padding: 8px 16px;
    .listLi {
        // width: 33.33%;
        padding: 4px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        // width: 143px;
        height: 32px;
        background: #E6F4FF;
        border-radius: 4px;
        margin-right: 20px;
        margin-top: 8px;
        margin-bottom: 8px;
        .text_hidden_ellipsis {
            width: 163px;
        }
        &:nth-child(3n) {
            margin-right: 0!important;
        }
        .delBtn {
            cursor: pointer;
            &:hover {
                color: #5cb6ff;
            }
        }
    }
    .More {
        background: #fff;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #0C6FFF;
        line-height: 22px;
        padding-left: 0;
        // cursor: pointer;
    }
}
</style>
