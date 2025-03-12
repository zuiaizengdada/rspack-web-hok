<!-- @author zhengjie -->
<template>
  <el-popover
    v-model="visible"
    placement="bottom-start"
    width="200"
    popper-class="p-0"
    trigger="manual"
  >
    <el-input
      slot="reference"
      :value="value"
      class="w-200"
      size="small"
      style="position: relative;"
      clearable
      placeholder="请输入"
      v-bind="$attrs"
      :disabled="disabled"
      @clear="clear"
      @focus="inputClick"
      @blur="blur"
      v-on="$listeners"
    />

    <div v-loading="loading" class="icon-body">
      <div v-infinite-scroll="getList" class="icon-list overflowOuto" infinite-scroll-disabled="disabledLoad">
        <div class="radioGroup">
          <div v-for="(item) in list" :key="item.id" class="labelValue" @click="selectedIcon(item)">
            {{ item.labelName }}
          </div>
          <div v-if="list.length === 0" class="el-select-dropdown__empty">暂无数据</div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { recallMsgLabelPage } from '@/api/privateArea/recall'
export default {
  name: 'TeacherSelect',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      currentPage: 1,
      size: 10,
      total: 0,
      noMore: false,
      clearStatus: false,
      visible: false
    }
  },
  computed: {
    disabledLoad() {
      return this.loading || this.noMore
    }
  },
  watch: {
    value() {
      if (this.visible) {
        this.currentPage = 1
        this.list = []
        this.getList()
      }
    }
  },
  methods: {
    // 清空搜索条件
    clear() {
      this.currentPage = 1
      this.list = []
      this.$emit('input', '')
    },
    blur() {
      this.visible = false
    },
    // 点击选择
    selectedIcon(item) {
      console.log(item, 'item')
      this.visible = false
      this.$emit('select', item.labelName)
    },
    // 获取列表数据
    getList() {
      console.log('加载')
      this.loading = true
      const params = {
        current: this.currentPage,
        size: this.size,
        labelName: this.value
      }
      recallMsgLabelPage(params)
        .then((res) => {
          console.log(res, 'res')
          this.list = this.list.concat(res.data.records)
          this.currentPage += 1
          this.noMore = this.list.length >= res.data.total
          console.log(this.noMore, 'noMore')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击input框
    inputClick() {
      console.log('input聚焦')
      if (!this.visible) {
        this.visible = true
      }
      this.currentPage = 1
      this.list = []
      this.getList()
    },
    clearFn(e) {
      e.stopPropagation()
      this.clearStatus = false
    },
    sure() {
      this.$emit('selected', this.selectUser)
      this.visible = false
    },
    cancel() {
      this.visible = false
      // document.body.click()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  // padding: 10px;
  .icon-list {
    padding: 10px;
    box-sizing: border-box;
    height: 200px;
    .radioGroup {
      width: 100%;
      display: flex;
      flex-direction: column;
      .labelValue {
        width: 100%;
        font-size: 14px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
            background-color: #f5f7fa;
        }
      }
    }
  }
}
::v-deep {
  .tearchInput {
    width: 200px;
    .el-input__inner {
      cursor: pointer;
      background-color: #fff;
      color: #000;
    }
  }
}
.el-icon-circle-close {
  cursor: pointer!important;
}
</style>
