<template>
  <div class="cd-tree-container">
    <div class="cd-tree-header">
      <el-input v-model.trim="filterText" prefix-icon="el-icon-search" placeholder="输入老师课程/课程名称" />
    </div>
    <div
      id="scroll-view"
      ref="scrollView"
      class="cd-tree-main"
      :style="{ height: config.height + 'px' }"
      @scroll="handleScroll"
    >
      <div v-if="leftLoading" class="skeleton-box"><el-skeleton :rows="10" /></div>
      <el-tree
        id="fixtree"
        ref="treeRef"
        node-key="id"
        class="filter-tree"
        :load="loadNode"
        lazy
        :data="treeData"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="handleCheckedNode"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span :class="config.nameHide ? 'tree-label' : 'tree-label-max'">{{ data.catalogName }}</span>
          <span v-if="config.edit">
            <template v-if="node.level === 1">
              <svg-icon v-permission="['system:courseDoc:tree:add', permsList]" icon-class="cd_add" class="icon-svg" @click="handFile(node, data, true, $event)" />
            </template>
            <template v-else>
              <svg-icon v-permission="['system:courseDoc:tree:add', permsList]" icon-class="cd_add" class="icon-svg" @click="handFile(node, data, true, $event)" />
              <svg-icon v-permission="['system:courseDoc:tree:edit', permsList]" icon-class="cd_edit" class="icon-svg" @click="handFile(node, data, false, $event)" />
              <svg-icon v-permission="['system:courseDoc:tree:del', permsList]" icon-class="cd_del" class="icon-svg" @click="delFile(node, data, $event)" />
              <!-- <el-button type="text" size="mini" @click="() => append(data)"> 编辑 </el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)"> 删除 </el-button> -->
            </template>
          </span>
        </span>
      </el-tree>
    </div>
    <div
      v-show="searchTreeShow"
      class="cd-search-tree"
      :style="{ height: config.height + 'px' }"
      @scroll="handleSearchScroll"
    >
      <el-tree
        id="fixtree"
        ref="treeS"
        node-key="id"
        class="filter-tree"
        :load="searchLoadNode"
        lazy
        :data="searchTreeData"
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="handleCheckedNode"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span :class="config.nameHide ? 'tree-label' : 'tree-label-max'">{{ data.catalogName }}</span>
          <span>
            <template v-if="node.level === 1">
              <svg-icon icon-class="cd_add" class="icon-svg" @click="handFile(node, data, true, $event)" />
            </template>
            <template v-else>
              <svg-icon icon-class="cd_add" class="icon-svg" @click="handFile(node, data, true, $event)" />
              <svg-icon icon-class="cd_edit" class="icon-svg" @click="handFile(node, data, false, $event)" />
              <svg-icon icon-class="cd_del" class="icon-svg" @click="delFile(node, data, $event)" />
            </template>
          </span>
        </span>
      </el-tree>
    </div>
    <div v-if="loadShow" class="cd-load">
      <el-link v-if="searchTreeShow" type="primary" @click="currentSearchChange">
        <span>加载更多</span>
        <template v-if="more"><i class="el-icon-loading" /></template>
        <template v-else><i class="el-icon-refresh-right" /></template>
      </el-link>
      <el-link v-else type="primary" @click="currentChange">
        <span>加载更多</span>
        <template v-if="more"><i class="el-icon-loading" /></template>
        <template v-else><i class="el-icon-refresh-right" /></template>
      </el-link>
    </div>
    <AppDialog
      v-model="fileDialog.visible"
      :title="fileDialog.title"
      width="120"
      height="280"
      max-height="280"
      @success="fileDialog.visible = false"
    >
      <div class="info-box">
        <el-form v-if="fileDialog.visible" ref="form" :model="form" label-width="120px" :rules="rules">
          <el-form-item label="上级目录：">
            <span>{{ form.routeName }}</span>
          </el-form-item>
          <el-form-item :label="fileDialog.labelName + '：'" prop="name">
            <el-input v-model="form.name" class="w-300" maxlength="30" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="footer">
        <el-button :loading="fileDialog.loading" type="primary" @click="submitFileForm">保存</el-button>
      </div>
      <div slot="footer" class="footer" />
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { catalogPage, catalogIDPage, addCatalog, editCatalog, delCatalog, detailCatalog } from '@/api/courseDoc/index'
export default {
  name: 'CDTree',
  components: {
    AppDialog
  },
  props: {
    config: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      permsList: this.$route?.meta?.permsList || [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      loadShow: false,
      loadSearchShow: false,
      nodeKey: '',
      nodeData: '',
      more: false,
      treeData: [],
      pageNum: 1,
      pageSearchNum: 1,
      searchTreeData: [],
      searchTreeShow: false,
      fileDialog: {
        visible: false,
        title: '',
        loading: false,
        labelName: ''
      },
      form: {
        routeName: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      },
      leftLoading: true,
      nodeAll: '',
      updateId: ''
    }
  },
  watch: {
    filterText(val) {
      if (val) {
        console.log(val)
        this.pageSearchNum = 1
        this.getSearchList()
        this.searchTreeShow = true
        // this.searchTreeData = data
      } else {
        this.searchTreeData = []
        this.searchTreeShow = false
        this.pageNum = 1
        this.getList()
      }

      // this.$refs.tree.filter(val)
    }
  },
  async mounted() {
    await this.getList()
    const { teacherName } = this.$route.query
    if (teacherName) {
      this.filterText = teacherName
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      try {
        this.tabLoad = true
        const params = {
          catalogName: '', // 课程名称
          pageIndex: this.pageNum,
          pageSize: this.config.size
        }
        this.leftLoading = true
        const { data } = await catalogPage(params)
        this.treeData = data.items
        this.leftLoading = false
        data.items.length ? this.pageNum++ : ''
      } catch (e) {
        this.leftLoading = false
      }
    },
    getSearchList() {
      const params = {
        catalogName: this.filterText, // 课程名称
        pageIndex: this.pageSearchNum,
        pageSize: this.config.size
      }
      catalogPage(params)
        .then((res) => {
          this.searchTreeData = res.data.items
          res.data.items.length ? this.pageSearchNum++ : ''
          const { teacherName } = this.$route.query
          if (this.filterText === teacherName && this.searchTreeData.length) {
            this.$nextTick(() => {
              const id = this.searchTreeData[0].id
              this.$refs.treeS && this.$refs.treeS.setCurrentKey(id)
              this.handleCheckedNode(this.searchTreeData[0])
            })
          }
        })
        .catch(() => {})
    },
    detailCatalog(id, node, data, type) {
      this.form = {
        routeName: '',
        name: ''
      }
      detailCatalog(id)
        .then((res) => {
          const data = res.data
          if (type && node.level === 1) {
            console.log('data.catalogName', data.catalogName)
            this.form.routeName = data.catalogName
          } else {
            this.form.routeName = data.pathName
          }
          (!type && node.level === 2) || (type && node.level === 1)
            ? (this.fileDialog.labelName = '课程名称')
            : (this.fileDialog.labelName = '文件夹名称')
          const title = this.fileDialog.title
          title === '编辑' ? (this.form.name = data.catalogName) : ''
        })
        .catch(() => {})
    },
    addCatalog(params) {
      // console.log(this.$refs.treeRef.getNode())
      // const node = this.$refs.treeRef.getNode(id)
      // this.$nextTick(() => {
      //   const node = this.$refs.tree.getNode({ id: this.tagId })
      //   this.tagName = node.label
      // })
      // console.log('node', node)
      // node.loaded = false
      // // 主动调用展开节点方法，重新查询该节点下的所有子节点
      // node.expand()
      addCatalog(params)
        .then((res) => {
          console.log('添加', res.data)
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.form = {
            routeName: '',
            name: ''
          }
          this.fileDialog = {
            visible: false,
            title: '',
            loading: false,
            labelName: ''
          }
          this.refreshNodeBy(false)
          this.$emit('getFileList', this.nodeData)
        })
        .catch(() => {})
    },
    editCatalog(params) {
      editCatalog(params)
        .then((res) => {
          console.log('添加', res.data)
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.form = {
            routeName: '',
            name: ''
          }
          this.fileDialog = {
            visible: false,
            title: '',
            loading: false,
            labelName: ''
          }
          this.refreshNodeBy(true)
          this.$emit('getFileList', this.nodeData)
        })
        .catch(() => {})
    },
    refreshNodeBy(type) {
      const id = this.updateId
      let node = ''
      if (this.searchTreeShow) {
        node = this.$refs.treeS.getNode(id)
      } else {
        node = this.$refs.treeRef.getNode(id)
      }
      node.parent.loaded = false
      // console.log('执行')
      if (type) {
        node.parent.expand()
      } else {
        node.childNodes = []
        const params = id
        catalogIDPage(params)
          .then((res) => {
            this.$set(node.data, 'children', res.data)
          })
          .catch(() => {})
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleScroll(e) {
      const { scrollTop, clientHeight, scrollHeight } = e.target
      // console.log(scrollTop, clientHeight, scrollHeight)
      if (scrollTop + clientHeight === scrollHeight) {
        this.$emit('getScrollBottom', true)
        this.loadShow = true
      } else {
        this.$emit('getScrollBottom', false)
        this.loadShow = false
      }
    },
    handleSearchScroll(e) {
      const { scrollTop, clientHeight, scrollHeight } = e.target
      // console.log(scrollTop, clientHeight, scrollHeight)
      if (scrollTop + clientHeight === scrollHeight) {
        this.loadShow = true
      } else {
        this.loadShow = false
      }
    },
    handFile(node, data, type) {
      node.parent.loaded = true
      node.parent.loading = false
      this.detailCatalog(data.id, node, data, type)
      this.fileDialog.title = type ? '新增' : '编辑'
      this.fileDialog.visible = true
    },
    delFile(node, data) {
      this.nodeAll = node
      this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delCatalog(data.id)
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.nodeParentLoaded()
              // 刷新父树结构
              // node.parent.loaded = false
              // node.parent.expand()
              // console.log('删除', res.data)
              // this.$emit('getFileList', this.nodeData)
              // this.nodeParentLoaded()
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    nodeParentLoaded() {
      const node = this.nodeAll
      // 刷新父树结构
      node.parent.loaded = false
      node.parent.expand()
    },
    loadNode(node, resolve) {
      // this.resolve = resolve
      const id = node.data.id
      if (node.level === 0) {
        return
      } else {
        // 请求
        // 如果当前不是最顶级  则node.data拿到被点击的节点本身  通过节点di请求这条数据的子集
        // 判断请求的数据是不是空的  即这条数据有没有子集
        const params = id
        catalogIDPage(params)
          .then((res) => {
            resolve(res.data)
          })
          .catch(() => {
            resolve([])
          })
      }
    },
    searchLoadNode(node, resolve) {
      // this.resolve = resolve
      const id = node.data.id
      if (node.level === 0) {
        return
      } else {
        // 请求
        // 如果当前不是最顶级  则node.data拿到被点击的节点本身  通过节点di请求这条数据的子集
        // 判断请求的数据是不是空的  即这条数据有没有子集
        // if (node.level > 2) return resolve([])
        const params = id
        catalogIDPage(params)
          .then((res) => {
            resolve(res.data)
          })
          .catch(() => {})
      }
    },
    // 页数
    currentChange() {
      this.more = true
      const params = {
        catalogName: this.filterText, // 课程名称
        pageIndex: this.pageNum,
        pageSize: this.config.size
      }
      catalogPage(params)
        .then((res) => {
          console.log('目录', res.data.items)
          if (res.data.items.length) {
            res.data.items.map((v) => {
              this.treeData.push(v)
            })
            this.pageNum++
          }
          this.more = false
        })
        .catch(() => {
          this.more = false
        })
    },
    currentSearchChange() {
      this.more = true
      const params = {
        catalogName: this.filterText, // 课程名称
        pageIndex: this.pageSearchNum,
        pageSize: this.config.size
      }
      catalogPage(params)
        .then((res) => {
          if (res.data.items.length) {
            res.data.items.map((v) => {
              this.searchTreeData.push(v)
            })
            this.pageSearchNum++
          }
          this.more = false
        })
        .catch(() => {
          this.more = false
        })
    },
    submitFileForm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        const title = this.fileDialog.title
        const parentDirId = this.nodeData.id
        const catalogName = this.form.name
        const catalogType = this.nodeData.catalogType
        this.updateId = this.nodeData.id
        if (title === '新增') {
          const params = {
            catalogName,
            catalogType,
            parentDirId
          }
          this.addCatalog(params)
        } else {
          const params = {
            catalogName,
            id: parentDirId
          }
          this.editCatalog(params)
        }
      })
    },
    handleCheckedNode(e) {
      this.nodeData = e
      // console.log('选中节点', e.id)
      this.$emit('getFileList', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.cd-tree-container {
  position: relative;
  .cd-tree-header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
  }
  #fixtree {
    display: inline-block;
    min-width: 320px;
  }
  .cd-tree-main {
    padding: 40px 0;
    overflow: auto;
    overflow-x: scroll;
    position: relative;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .icon-svg {
        color: '#606266';
        font-size: 20px;
        margin-left: 8px;
      }
    }
    .icon-image {
      width: 14px;
      height: 14px;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .skeleton-box {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2;
      background-color: #ffffff;
    }
  }
  .cd-search-tree {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #ffffff;
    // background-color: red;
    padding: 40px 0;
    overflow: auto;
    overflow-x: scroll;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      .icon-svg {
        font-size: 20px;
        margin-left: 8px;
      }
    }
    .icon-image {
      width: 14px;
      height: 14px;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .cd-load {
    position: absolute;
    bottom: 25px;
    right: 0;
    left: 0;
    color: #1890ff;
    font-size: 14px;
    text-align: center;
  }
  .tree-label {
    width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tree-label-max {
    width: 420px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0;
  }
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
  }
  :hover ::-webkit-scrollbar-track-piece {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0;
  }

  :hover::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    transition: color 0.2s ease;
  }

  :hover::-webkit-scrollbar-thumb:vertical {
    cursor: pointer;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    transition: color 0.2s ease;
  }
}
.info-box {
  padding: 20px;
}
.footer {
  margin: 20px;
}
.w-300 {
  width: 70%;
}
::v-deep .tree-label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
}
</style>
