<template>
  <div class="">
    <div v-for="(item, index) in list" :key="index" class="itemBox">
      <AppArea v-if="show" v-model="item.districtName" clearable :level="1" @handleClose="handleClose(index)" />
      <el-input
        v-model.trim="item.address"
        style="width: 260px; margin-left: 5px"
        placeholder="请输入详细信息"
      />
      <i
        v-show="list.length > 1 || index"
        class="el-icon-minus addIcon"
        @click="handleDelete(index)"
      />
      <i
        v-show="index === list.length - 1"
        class="el-icon-plus addIcon"
        @click="handleAdd"
      />
    </div>
    <i v-show="!list.length" class="el-icon-plus addIcon" @click="handleAdd" />
  </div>
</template>

<script>
import AppArea from '@/components/AppArea'
const item = { districtName: [], address: '' }
export default {
  components: {
    AppArea
  },
  props: ['value'],
  data: () => ({
    list: [{ ...item }],
    show: true
  }),
  watch: {
    list: {
      handler: function () {
        this.handleEmit()
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.value.length) return
      this.list = this.value?.map(item => ({
        ...item,
        districtName: item?.districtName ? item?.districtName?.split(',') : []
      }))
    })
  },
  methods: {
    handleClose(index) {
      this.list[index].districtName = []
      this.$emit('input', this.list)
    },
    handleEmit() {
      this.$emit('input', this.list)
    },
    handleAdd() {
      const bol = this.list.find(item => !item.districtName || !item.address)
      if (bol) return this.$message.warning('请把地址填写完整')
      this.list = [...this.list, { ...item }]
    },
    handleDelete(index) {
      if (this.list.length === 1) return
      const list = [...this.list]
      list.splice(index, 1)
      this.list = JSON.parse(JSON.stringify(list))
      this.reset()
    },
    reset() {
      this.show = false
      setTimeout(() => {
        this.show = true
      }, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.itemBox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.addIcon {
  font-size: 25px;
  color: #0052d9;
  margin-left: 10px;
  font-weight: bold;
  cursor: pointer;
}
</style>
