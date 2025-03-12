<template>
  <el-dialog v-if="config.visible" :title="config.catalogueName" :visible.sync="config.visible" :loading="loading" @close="handleClose">
    <el-button v-permission="['system:catalogue:add', permsList]" style="float:right" type="primary" size="mini" @click="openAdd">新建二级商品分类</el-button>
    <div class="soncontent">
      <el-table :data="dataList" row-key="catalogueId" height="500">
        <el-table-column prop="catalogueSort" label="序号" width="55" />
        <el-table-column prop="catalogueName" label="分组名称" width="120" />
        <el-table-column prop="catalogueUrl" label="分组图标" width="120">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row?scope.row.catalogueUrl:''"
              :preview-src-list="srcList"
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="商品数" />
        <el-table-column prop="subscription" label="创建时间" width="120" />
        <el-table-column prop="action" label="操作" width="200">
          <template slot-scope="{row}">
            <el-button type="text" @click="$router.push({path: `/messageManager/goodsDivision/details/${row.catalogueId}`})">内容管理</el-button>
            <el-button v-permission="['system:catalogue:edit', permsList]" type="text" @click="openEdit(row)">编辑</el-button>
            <el-button v-permission="['web:catalogue:share', permsList]" v-share="'courseList/' + row.catalogueId" type="text">分享</el-button>
            <el-button v-permission="['system:catalogue:remove', permsList]" type="text" @click="del(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import Sortable from 'sortablejs'
import { getCatalogueList, updateCatalogueSort } from '@/api/shop'
export default {
  components: {
  },
  props: ['config'],
  data: () => ({
    loading: false,
    search: '',
    dataList: [],
    srcList: [],
    permsList: []
  }),
  watch: {
    'config.visible': {
      handler(newVal) {
        if (!newVal) return
        this.init()
        this.rowZiliaoDrop()
      },
      immediate: true
    }
  },
  created() {
    this.permsList = this.$route.meta.permsList || []
  },
  methods: {
    handleClose() {
      this.$emit('update:config', { visible: false })
    },
    openEdit(row) {
      this.$emit('handleOpenEdit', row)
    },
    openAdd() {
      this.$emit('handleOpenAdd')
    },
    del(row) {
      this.$emit('handleDel', row)
    },
    refresh() {
      this.init()
    },
    // 资料行拖拽
    rowZiliaoDrop() {
      this.$nextTick(() => {
        const tbody = document.querySelector('.soncontent tbody')
        if (tbody) {
          const that = this
          Sortable.create(tbody, {
            animation: 300,
            draggable: '.el-table__row',
            onEnd({ newIndex, oldIndex }) {
              const currRow = that.dataList.splice(oldIndex, 1)[0]
              currRow.catalogueSort = newIndex
              that.dataList.splice(newIndex, 0, currRow)
              that.updateCatalogueSort()
            }
          })
        }
      })
    },
    async updateCatalogueSort() {
      this.dataList = this?.dataList?.map((item, index) => ({
        ...item,
        catalogueSort: ++index
      }))
      await updateCatalogueSort({ reqs: this.dataList })
    },
    getList() {
      this.loading = true
      const params = {
        parentId: this.config.id
      }
      getCatalogueList(params).then(res => {
        this.dataList = res.data
        this.srcList = []
        this.dataList.map(v => { this.srcList.push(v.catalogueUrl) })
        this.loading = false
      })
    },
    init() {
      this.getList()
    }
  }
}

</script>
<style lang="scss" scoped>
</style>
