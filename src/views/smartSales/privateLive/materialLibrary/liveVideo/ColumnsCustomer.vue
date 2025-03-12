<template>
  <el-popover placement="bottom-end" width="150" trigger="click">
    <p
      slot="reference"
      style="
              color: #0c6fff;
              width: 100px;
              margin-top: 6px;
              font-size: 14px;
              cursor: pointer;
            "
      type="text"
      size="small"
    >
      <img
        :src="iconShezhi"
        class="mr-1"
        style="margin-top: 2px; float: left"
      />自定义表头
    </p>

    <el-checkbox
      v-model="allColumnsSelected"
      :disabled="allColumnsSelected"
      :indeterminate="allColumnsSelectedIndeterminate"
      @change="handleCheckAllChange"
    >
      全选
    </el-checkbox>
    <el-checkbox
      v-for="item in config.tableColumns"
      :key="item.label"
      v-model="item.visible"
      v-dragging="{
        item: item,
        list: config.tableColumns,
        group: 'item'
      }"
      :disabled="item.disabled"
      @change="handleCheckedTableColumnsChange(item)"
    >
      {{ item.label }}
    </el-checkbox>
  </el-popover>
</template>
<script>
import iconShezhi from '@/assets/svg/videoManga/shezhi_icon.svg'
import { getColumns } from './columns'
export default {
  data() {
    return {
      iconShezhi,
      allColumnsSelected: false,
      allColumnsSelectedIndeterminate: false,
      config: {
        tableColumns: getColumns.call(this)
      }
    }
  },
  mounted() {
    console.log(this.config.tableColumns, 'tableColumns')
  },
  methods: {
    handleCheckedTableColumnsChange() {},
    handleCheckAllChange() {
      if (!this.allColumnsSelected) {
        this.config.tableColumns.forEach((item) => (item.visible = true))
      } else {
        this.config.tableColumns.forEach((item) => (item.visible = false))
      }
    }
  }
}
</script>
