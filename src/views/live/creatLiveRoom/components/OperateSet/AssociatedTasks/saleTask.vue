<template>
  <div>
    <el-button size="small" type="primary" @click="onhandleClick">选择</el-button>
    <el-table v-if="value.length > 0" :header-cell-style="{ background: '#F3F3F3' }" :data="value" max-height="250" style="width: 100%" border size="mini" class="m-t-20">
      <el-table-column prop="taskName" label="任务名称" />
      <el-table-column prop="createUserName" label="创建人" />
      <el-table-column>
        <template slot-scope="{ row }">
          <el-popconfirm title="确定删除?" @confirm="onhandleClickDel(row)">
            <el-button slot="reference" class="c_red" type="text">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Dialog from '@/views/live/Dialog/index.js'
export default {
  components: {},
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onhandleClick() {
      Dialog.open({
        type: 'SelectTask',
        selectList: JSON.parse(JSON.stringify(this.value)),
        success: (res) => {
          Dialog.close()
          this.$emit('input', res)
        }
      })
    },
    onhandleClickDel(row) {
      const index = this.value.findIndex(v => v.id === row.id)
      index > -1 && this.value.splice(index, 1)
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
