<template>
  <div>
    <el-drawer
      title=""
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <div class="drawer-content">

        <div class="addTags">
          <!-- <el-button size="mini" type="primary" @click="addTags">新增标签</el-button> -->
          <el-popover
            v-model="visible"
            placement="bottom-start"
          >
            <div class="flex flex-middle m-b-10">
              <my-select-color :color="color1" :type="1" :predefine-colors="predefineColors" @selectColor="selectColor" />
              <el-input
                v-model="input3"
                size="mini"
                placeholder="请输入标记名称"
                maxlength="20"
                class="myinput"
              />
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="addTagMark(1)">确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="primary">新增标记</el-button>
          </el-popover>
        </div>
        <div class="drawer-table table-item">
          <el-table :header-row-class-name="'tableClassName'" :data="hotMarkTypeList">
            <el-table-column prop="name" label="标记名称" width="180">
              <template slot-scope="scope">
                <div class="flex flex-middle">
                  <span
                    :style="`background:${getPrColor(scope.row.color) || '#fff'}`"
                    class="tipsBgColor"
                  />
                  <span style="flex:1" class="text_hidden" :title="scope.row.name">{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" width="80" label="创建人" />
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-popover
                  :ref="`popover-${scope.$index}`"
                  trigger="click"
                  placement="bottom-start"
                >
                  <div class="flex flex-middle m-b-10">
                    <my-select-color :color="editColor" :type="2" :predefine-colors="predefineColors" @selectColor="selectColor" />
                    <el-input
                      v-model="editName"
                      size="mini"
                      placeholder="请输入标记名称"
                      maxlength="20"
                    />
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="closePopover(scope.$index)">取消</el-button>
                    <el-button type="primary" size="mini" @click="addTagMark(2,scope.$index)">确定</el-button>
                  </div>
                  <el-button slot="reference" size="mini" type="text" @click="edit(scope.row)">编辑</el-button>
                </el-popover>
                <el-button v-if="activeName === 'first'" size="mini" type="text" class="m-l-8" style="color:#F53F3F ;" @click="deleteTags(scope.row.id)">删除</el-button>
                <!-- <el-button
                  size="mini"
                  type="text"
                  @click="editTags(scope)"
                >编辑</el-button> -->
              </template>
            </el-table-column>
            <div slot="empty" class="empty">
              <el-empty :image-size="70" description="暂无数据" />
            </div>
          </el-table>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  addHotMarkType, updateHotMarkType, updateSensitiveMarkType, addSensitiveMarkType, deleteSensitiveMarkType
} from '@/api/product/tagManage'
import MySelectColor from './mySelectColor.vue'
export default {
  name: 'TagEdit',
  components: {
    MySelectColor
  },
  props: {
    drawer: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => []
    },
    hotMarkTypeList: {
      type: Array,
      default: () => []
    },
    activeName: {
      type: String,
      default: 'first'
    }
  },
  data() {
    return {
      // Your data here
      direction: 'rtl',
      dialogVisible: false,
      color1: 'GREEN',
      visible: false,
      editFlag: false,
      editColor: '',
      predefineColors: ['GREEN', 'RED', 'PURPLE', 'ORANGE', 'YELLOW', 'BLUE', 'CYAN'],
      editId: '',
      editName: '',
      input3: ''
    }
  },
  methods: {
    // Your methods here
    handleClose() {
      this.$emit('close')
    },
    closePopover(index) {
      this.$refs[`popover-${index}`].doClose()
    },
    addTags() {
      this.dialogVisible = true
    },
    edit(row) {
      console.log(row, '编辑了标签')
      this.editColor = row.color
      this.editName = row.name
      this.editId = row.id
      this.editFlag = true
    },
    selectColor(color, type) {
      if (type === 1) {
        this.color1 = color
      } else {
        this.editColor = color
      }
    },
    async deleteTags(id) {
      // 二次确认
      this.$confirm('确认删除该标记吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteSensitiveMarkType({ id })
        if (res.code === 1) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          this.$emit('addTagMark')
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async addTagMark(type, index) {
      if (type === 1 && !this.input3 || type === 2 && !this.editName) {
        this.$message({
          message: '请输入标记名称',
          type: 'warning',
          duration: 1500
        })
        return
      }
      // this.dialogVisible = false
      const params = {
        color: type === 1 ? this.color1 : this.editColor,
        name: type === 1 ? this.input3 : this.editName,
        description: ''
      }
      if (type === 2) {
        params.id = this.editId
      }
      let res = null
      if (type === 1) {
        if (this.activeName === 'first') {
          res = await addSensitiveMarkType(params)
        } else {
          res = await addHotMarkType(params)
        }
      } else {
        if (this.activeName === 'first') {
          res = await updateSensitiveMarkType(params)
        } else {
          res = await updateHotMarkType(params)
        }
      }
      if (res.code === 1) {
        this.$message({
          message: type === 1 ? '新增成功' : '编辑成功',
          type: 'success',
          duration: 1500
        })
        this.visible = false
        if (type !== 1) {
          this.$refs[`popover-${index}`].doClose()
        }
        this.input3 = ''
        this.color1 = 'GREEN'
        this.$emit('addTagMark')
      }
    }
  }
  // Your component options here
}
</script>

<style lang="scss" scoped>
/* Your component styles here */

.tipsBgColor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
::v-deep .el-input__inner {
  border-radius: 0 4px 4px 0!important;
}
.drawer-content {
  padding: 20px;
  box-sizing: border-box;
  .addTags {
    text-align: right;
  }
  ::v-deep{
    .el-color-dropdown__main-wrapper{
    display: none !important;
  }
  }
  .drawer-table {
    margin-top: 20px;
    border: 1px solid #ebeef5;
    border-bottom: none;
    border-radius: 8px;
    height: 100%;
  }
}
</style>
