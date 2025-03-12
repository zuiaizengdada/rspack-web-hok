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
      size="small"
      class="w-200 labelInput"
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
            {{ item.name }}
          </div>
          <div v-if="list.length === 0" class="el-select-dropdown__empty">暂无数据</div>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { getTagList } from '@/api/system/sms.js'
import axios from 'axios'
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
    },
    myclass: {
      type: String,
      default: 'w-200'
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
      visible: false,
      CancelToken: axios.CancelToken
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
      this.visible = false
      this.$emit('select', item)
    },
    // 获取列表数据
    getList() {
      if (this.source) {
        // 取消上一次发出的请求
        this.source.cancel('cancel')
      }
      this.source = this.CancelToken.source()
      this.loading = true
      const params = {
        pageIndex: this.currentPage,
        pageSize: this.size,
        name: this.value
      }
      getTagList(params)
        .then((res) => {
          this.list = this.list.concat(res.data.items)
          this.currentPage += 1
          this.noMore = this.list.length >= res.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 点击input框
    inputClick() {
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
.labelInput {
  position: relative;
}
</style>
