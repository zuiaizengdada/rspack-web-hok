
<template>
  <div class="special-container">
    <dynamicTable
      ref="table"
      v-model="tableData"
      :columns="columns"
      :get-list-api="getList"
    >
      <template #submitBtn>
        <el-button
          type="primary"
          size="small"
          @click="openModel"
        >新增专题页</el-button>
      </template>
      <template #action="{ row }">
        <el-button
          type="text"
          @click="handlePreview(row)"
        >预览</el-button>
        <el-button
          type="text"
          @click="edit(row)"
        >编辑</el-button>
        <el-button
          v-if="row.status === 0"
          type="text"
          style="color:#FF3333"
          @click="handleDel(row)"
        >删除</el-button>
      </template>
    </dynamicTable>
    <el-dialog
      title="预览"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="400px"
    >
      <div class="flex flex-middle flex-center">
        <AppQrcode :src="textSrc" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dynamicTable from '@/components/DynamicTable/table'
import AppQrcode from '@/components/AppQrcode'
import { getColumns } from './column'
import { specialPage, specialPageDelete } from '@/api/messageManagement/special'
export default {
  name: 'SpecialManagement',
  components: {
    dynamicTable,
    AppQrcode
  },
  data() {
    return {
      tableData: [],
      columns: getColumns.call(this),
      visible: false,
      textSrc: '',
      permsList: this.$route.meta.permsList || []
    }
  },
  methods: {
    handleClose() {
      this.$refs.table.onRefresh()
    },
    getList(params) {
      return specialPage(params)
    },
    async openModel() {
      window.open(location.origin + '#/pageGenerator')
    },
    edit(row) {
      window.open(location.origin + '#/pageGenerator?id=' + row.id)
    },
    handlePreview(row) {
      this.textSrc = process.env.VUE_APP_H5_URL + `pages/pageGenerator/index?id=${row.id}&shopId=${row.tenantId}&isPreview=true`
      this.visible = true
    },
    handleDel(row) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.del(row)
        }
      })
    },
    async del(row) {
      const { code } = await specialPageDelete({ id: row.id, isDelete: 1 })
      if (code === 1) {
        this.$message.success('删除成功')
        this.$refs.table.onRefresh()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.special-container {
  height: calc(100vh - 90px);
}
</style>
