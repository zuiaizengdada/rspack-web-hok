<template>
  <el-popover
    v-if="show && tableColumnsMap && columns"
    placement="bottom-end"
    width="150"
    trigger="click"
  >
    <p
      slot="reference"
      style="color: #0c6fff; font-size: 14px"
      class="cursor-pointer flex items-center"
    >
      <el-tooltip
        class="item"
        effect="dark"
        content="自定义表头"
        placement="top-start"
      >
        <img :src="iconShezhi" class="mr-1" style="margin-top: 2px" />
      </el-tooltip>
    </p>
    <el-checkbox
      v-model="allColumnsSelected"
      :disabled="allColumnsSelected"
      :indeterminate="allColumnsSelectedIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <template v-for="(item, index) in columns">
      <el-checkbox
        v-if="index < columns.length - 1"
        :key="item.label"
        v-model="item.visible"
        v-dragging="{ item: item, list: columns, group: 'item' }"
        :disabled="item.disable"
        @change="handleCheckedTableColumnsChange(item)"
      >
        <div class="labelItem">{{ item.label }}</div>
      </el-checkbox>
    </template>
    <el-checkbox
      v-if="columns.length"
      v-model="columns[columns.length - 1].visible"
      :disabled="columns[columns.length - 1].disable"
    >{{ columns[columns.length - 1].label }}</el-checkbox>
  </el-popover>
</template>
<script>
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { mapGetters } from 'vuex'
export default {
  props: {
    keys: {
      type: String,
      default: ''
    },
    onType: {
      type: String,
      default: 'dragged'
    }
  },
  computed: {
    ...mapGetters(['tableColumnsMap'])
  },
  data() {
    return {
      // list: [],
      columns: [],
      show: false,
      allColumnsSelected: false,
      allColumnsSelectedIndeterminate: false,
      iconShezhi
    }
  },
  watch: {
    columns: {
      handler(val) {
        const arr = val?.filter(v => v.visible) ?? []
        this.allColumnsSelected = arr.length === this.columns.length
        this.show = true
      },
      deep: true,
      immediate: true
    }
  },
  activated() {
    this.init()
  },
  deactivated() {
    this.show = false
  },
  beforeDestroy() {
    this.show = false
  },
  destroyed() {
    this.show = false
  },
  created() {
    this.init()
  },
  mounted() {
    this.show = true
    // this.list = this.columns
    // 拖拽后触发的事件
    this.$nextTick(() => {
      setTimeout(() => {
        this.$dragging.$on(this.onType, res => {
          this.$emit('change', this.columns)
        })
      })
    })
  },
  methods: {
    init() {
      this.show = true
      if (this.keys) {
        this.columns = this.tableColumnsMap[this.keys]
      }
    },
    handleCheckedTableColumnsChange(item) {
      const arr = this.columns.filter(v => v.visible)
      this.allColumnsSelected = arr.length === this.columns.length
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      this.$emit('change', this.columns)
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.columns.map(v => {
        v.visible = true
      })
      this.$emit('change', this.columns)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}
.labelItem{
  width: 100px; /* 定义容器宽度 */
  white-space: nowrap; /* 确保文本在一行内显示 */
  overflow: hidden; /* 隐藏超出容器的文本 */
  text-overflow: ellipsis; /* 在文本结束后显示省略号 */
}
</style>
