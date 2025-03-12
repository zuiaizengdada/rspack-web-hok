<template>
  <div class="listView" :style="{width: width}">
    <div v-for="(item) in myData" :key="item.userId" class="listLi" :style="liStyle">
      <el-tooltip class="item" effect="dark" :content="item.userName" placement="top-start">
        <div class="text_hidden_ellipsis" :title="item.userName">{{ item.userName }}</div>
      </el-tooltip>
      <el-switch :value="item.remindFlag" :disabled="disabled" :active-value="2" :inactive-value="1" @click.native="remindChange(item)" />
      <i v-if="del" class="el-icon-close m-l-8 delBtn" @click="$emit('del', item)" />
    </div>
    <div v-if="data.length > 6" :style="liStyle" class="listLi More" @click="handleClickMore">
      <span class="pointer">
        更多...
      </span>
    </div>
    <!-- 更多展示弹框 -->
    <moreHeadmaster
      ref="moreHeadmaster"
      :config="moreHeadmasterConfig"
      :del="del"
      :disabled="disabled"
      @remindChange="(item) => $emit('remindChange', item)"
      @del="(res) => $emit('del', res)"
    />
  </div>
</template>

<script>
import moreHeadmaster from './moreHeadmaster.vue'
export default {
  components: {
    moreHeadmaster
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
    liStyle: {
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
      loading: false,
      moreHeadmasterConfig: {
        visible: false,
        data: []
      },
      myData: []
    }
  },
  watch: {
    data: {
      handler(val) {
        val.length > 6 ? this.myData = val.filter((v, i) => i < 5) : this.myData = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    // 点击更多
    handleClickMore() {
      this.moreHeadmasterConfig.visible = true
      this.moreHeadmasterConfig.data = this.data
    },
    refresh() {
      this.moreHeadmasterConfig.data = this.data
      this.$nextTick(() => {
        this.$refs.moreHeadmaster.refresh()
      })
    },
    remindChange(item) {
      console.log(item)
      this.$emit('remindChange', item)
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
        &:nth-child(3n + 3) {
            margin-right: 0!important;
        }
        .delBtn {
          margin-top: 3px;
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
