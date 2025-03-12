<template>
  <div v-loading="loading" class="page_wrap">
    <!--行业管理 -->
    <MCard>
      <div class="header">
        <div class="header_wrap">
          <div>行业管理</div>
          <!-- <div style="font-size: 20px" @click="addFirst()">
            <svg-icon icon-class="xinzeng" class="a_link" />
          </div> -->
          <el-button size="small" type="primary" @click="addFirst"><i class="el-icon-plus" /> 新增行业</el-button>
        </div>
      </div>
      <div class="content">
        <el-tree
          :data="treeData"
          node-key="catId"
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="nodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node" :class="{ active: editForm.catId === data.catId }">
            <span class="treeLabel">
              <template v-if="editForm.catId === data.catId">
                <el-input v-model="editForm.catName" style="width: 320px" size="mini" maxlength="20" show-word-limit />
              </template>
              <template v-else>
                {{ node.data.catName }}
              </template>
            </span>
            <span v-if="clickId === data.catId" class="action" :class="{ active: editForm.catId === data.catId }">
              <template v-if="editForm.catId !== data.catId">
                <svg-icon
                  v-if="node.level === 1"
                  icon-class="xinzeng"
                  class="m-l-20"
                  @click="openAdd(node, data, $event)"
                />
                <svg-icon icon-class="edit2" class="m-l-20" @click="openEdit(node, data, $event)" />
                <svg-icon icon-class="delete" class="m-l-20" @click="del(node, data, $event)" />
              </template>
              <template v-else>
                <el-button size="mini" type="primary" @click="edit()">确定</el-button>
                <el-button size="mini" @click="editForm.catId = ''">取消</el-button>
              </template>
            </span>
          </span>
        </el-tree>
      </div>
    </MCard>

    <!-- 新增弹框 -->
    <AppDialog
      v-model="dialogModel.visible"
      :title="`新增${dialogModel.title}`"
      width="518px"
      height="162px"
      :loading="dialogModel.loading"
      @success="send"
    >
      <div v-if="dialogModel.visible" v-loading="dialogModel.loading" class="dialogModel">
        <el-form ref="ruleForm" :model="dialogModel.form" :rules="rules" label-width="110px">
          <el-form-item :label="`${dialogModel.title}名称`" prop="catName">
            <div>
              <el-input
                v-model="dialogModel.form.catName"
                maxlength="20"
                show-word-limit
                size="small"
                style="width: 350px"
                placeholder="请输入行业名称"
              />
              <div class="tips">注：限制20个字内</div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </AppDialog>
  </div>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { getTradeList, tradeListEdit, tradeAdd, tradeDel } from '@/api/tearchCenter/index'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'catName'
      },
      // 新增弹框数据
      dialogModel: {
        visible: false,
        form: {
          catLevel: '', // 层级
          catName: '', // 分类名称
          children: [], // 子集合
          parentCid: '' // 父分类id
        },
        title: '一级分类',
        type: 1, // 1：新增 2:编辑
        loading: false
      },
      treeData: [],
      // 编辑的数据
      editForm: {
        catId: '',
        catName: ''
      },
      // 点击对象
      clickId: '',
      rules: {
        catName: [
          { required: true, message: '请输入行业分类', trigger: 'blur' },
          { max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 打开新增
    openAdd(node, data, e) {
      console.log(node, data)
      e.stopPropagation()
      this.dialogModel = {
        visible: true,
        title: '二级分类',
        form: {
          catLevel: node.level + 1, // 层级
          catName: '', // 分类名称
          children: [], // 子集合
          parentCid: data.catId // 父分类id
        },
        loading: false
      }
    },
    // 打开编辑
    openEdit(node, data, e) {
      console.log(data)
      e.stopPropagation()
      console.log(node, data)
      data.ifEdit = !data.ifEdit
      this.editForm = JSON.parse(JSON.stringify(data))
    },
    // 点击删除
    del(node, data, e) {
      console.log(node, data)
      e.stopPropagation()
      this.$delModal({
        tips: `确定要删除该分类`,
        success: () => {
          this.loading = true
          const params = {
            catId: data.catId
          }
          tradeDel(params)
            .then((res) => {
              this.loading = false
              this.$notify.success({ title: '提示', message: '操作成功' })
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    // 1级新增
    addFirst() {
      this.dialogModel = {
        visible: true,
        title: '一级分类',
        form: {
          catLevel: 1, // 层级
          catName: '', // 分类名称
          children: [], // 子集合
          parentCid: 0 // 父分类id
        },
        loading: false
      }
    },
    // 提交
    send() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.add()
        } else {
          return false
        }
      })
    },
    // 新增
    add() {
      console.log(this.dialogModel)
      const data = {
        catLevel: this.dialogModel.form.catLevel, // 层级
        catName: this.dialogModel.form.catName, // 分类名称
        children: this.dialogModel.form.children, // 子集合
        parentCid: this.dialogModel.form.parentCid // 父分类id
      }
      this.loading = true
      tradeAdd(data)
        .then((res) => {
          this.dialogModel.visible = false
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 编辑
    edit() {
      const data = {
        catId: this.editForm.catId,
        catName: this.editForm.catName
      }
      this.loading = true
      tradeListEdit(data)
        .then((res) => {
          this.loading = false
          this.editForm = {
            catId: '',
            catName: ''
          }
          this.$notify.success({ title: '提示', message: '操作成功' })
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 节点被点击触发
    nodeClick(obj, node, data) {
      this.clickId = obj.catId
    },
    // 获取行业列表
    getList() {
      this.loading = true
      getTradeList()
        .then((res) => {
          console.log(res, 'res')
          this.treeData = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    padding-left: 20px;
    padding-right: 20px;
    .header_wrap {
      padding-bottom: 20px;
      padding-left: 16px;
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      border-bottom: 1px solid #e7e7e7;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 24px;
    }
  }
  .content {
    // background: pink;
    height: calc(100% - 54px);
    overflow-y: auto;
    padding-left: 20px;
    padding-right: 20px;
  }
}
.dialogModel {
  width: 518px;
  height: 162px;
  padding: 20px;
}
.tips {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #999999;
  line-height: 20px;
  margin-top: 8px;
}
::v-deep {
  .el-tree-node__content {
    margin-top: 8px;
    margin-bottom: 8px;
    height: 32px;
    height: 32px;
    .custom-tree-node {
      flex: 1 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .treeLabel {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #333333;
        line-height: 22px;
      }
      .action {
        padding-right: 16px;
        font-size: 20px;
      }
    }
  }
  .el-tree-node:focus > .el-tree-node__content {
    background: #e7f0ff !important;
  }
  .is-current > .el-tree-node__content {
    background: #e7f0ff !important;
  }
}
</style>
