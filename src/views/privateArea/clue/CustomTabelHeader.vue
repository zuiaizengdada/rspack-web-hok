<template>
  <el-popover
    v-if="show"
    placement="bottom-end"
    width="150"
    trigger="click"
  >
    <p slot="reference" style="color:#0C6FFF;font-size:14px;" class="cursor-pointer flex items-center"><img :src="iconShezhi" class="mr-1" style="margin-top:2px;" />自定义表头</p>
    <el-checkbox v-model="allColumnsSelected" :disabled="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
      全选
    </el-checkbox>
    <el-checkbox v-model="columns[0].visible" :disabled="columns[0].disable">{{ columns[0].label }}</el-checkbox>
    <template v-for="(item, index) in columns">
      <el-checkbox
        v-if="index > 0 && index < columns.length - 1"
        :key="item.label"
        v-model="item.visible"
        v-dragging="{ item: item, list: columns, group: 'item' }"
        :disabled="item.disable"
        @change="handleCheckedTableColumnsChange(item)"
      >
        {{ item.label }}
      </el-checkbox>
    </template>
    <el-checkbox v-model="columns[columns.length - 1].visible" :disabled="columns[columns.length - 1].disable">{{ columns[columns.length - 1].label }}</el-checkbox>
  </el-popover>
</template>
<script>
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // list: [],
      show: false,
      allColumnsSelected: false,
      allColumnsSelectedIndeterminate: false,
      iconShezhi
    }
  },
  watch: {
    columns: {
      handler(val) {
        const arr = val.filter(v => v.visible)
        this.allColumnsSelected = arr.length === this.columns.length
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.show = true
    // this.list = this.columns
    // 拖拽后触发的事件
    this.$dragging.$on('dragged', (res) => {
      // localStorage.setItem('tableColumns_privateArea_clue', JSON.stringify(this.columns))
      this.$emit('change', this.columns)
    })
  },
  beforeDestroy() {
    this.show = false
  },
  methods: {
    handleCheckedTableColumnsChange(item) {
      const arr = this.columns.filter(v => v.visible)
      this.allColumnsSelected = arr.length === this.columns.length
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      // localStorage.setItem('tableColumns_privateArea_clue', JSON.stringify(this.columns))
      this.$emit('change', this.columns)
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.columns.map(v => {
        v.visible = true
      })
      // localStorage.setItem('tableColumns_privateArea_clue', JSON.stringify(this.columns))
      this.$emit('change', this.columns)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
  color:#333;
}
</style>
