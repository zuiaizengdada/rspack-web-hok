<template>
  <el-popover
    placement="bottom-end"
    width="150"
    trigger="click"
  >
    <p slot="reference" style="color:#0C6FFF;font-size:14px;" class="cursor-pointer flex items-center"><img :src="iconShezhi" class="mr-1" style="margin-top:2px;" />自定义表头</p>
    <el-checkbox v-model="allColumnsSelected" :disabled="allColumnsSelected" :indeterminate="allColumnsSelectedIndeterminate" @change="handleCheckAllChange">
      全选
    </el-checkbox>
    <el-checkbox
      v-for="item in columns"
      :key="item.label"
      v-model="item.visible"
      v-dragging="{ item: item, list: columns, group: 'item' }"
      :disabled="item.disable"
      @change="handleCheckedTableColumnsChange(item)"
    >
      {{ item.label }}
    </el-checkbox>
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
      list: [],
      allColumnsSelected: false,
      allColumnsSelectedIndeterminate: false,
      iconShezhi
    }
  },
  mounted() {
    this.list = this.columns
  },
  methods: {
    handleCheckedTableColumnsChange(item) {
      const arr = this.list.filter(v => v.visible)
      this.allColumnsSelected = arr.length === 9
      if (arr.length === 0) {
        item.visible = true
        this.$message.error('最少保留一条')
      }
      localStorage.setItem('originInfoColumns', JSON.stringify(this.list))
      this.$emit('change', this.list)
    },
    // 表头选择全部
    handleCheckAllChange(val) {
      this.list.map(v => {
        v.visible = true
      })
      localStorage.setItem('originInfoColumns', JSON.stringify(this.list))
      this.$emit('change', this.list)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-depp .el-popper {
  overflow: hidden;
}
::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
  color:#333;
  width: 110px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep .el-checkbox__label {
  width: 110px;
  line-height: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
