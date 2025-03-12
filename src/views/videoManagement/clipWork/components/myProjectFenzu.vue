<template>
  <div class="page_wrap ">
    <p class="myproject-cls">我的工程<i class="plus-add" @click="addMenu({},1)" /></p>
    <el-tree
      ref="treeForPage"
      class="my_tree overflowOuto"
      :data="listData"
      :props="defaultProps"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      auto-expand-parent
      :current-node-key="currentLivingId"
      node-key="code"
      :default-expand-all="false"
      :default-expanded-keys="defaultkeyarr"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      @node-click="handleNodeClick"
      @node-expand="fnnodepand"
      @node-collapse="closePand"
    >
      <div slot-scope="{data}" class="customize-tree-p active-mode">
        <i class="icn-title" :class="data.type === 1?'icn-wjj':'icn-wj'" />
        <span class="title-span">
          <span>{{ data.type === 1?data.groupName:data.projectName }}{{ data.type === 1 && data.projectNum?'('+data.projectNum+')':'' }}</span>
          <span v-if="data.newVideoNum&&data.type!==1" class="nums-prompt" :style="data.newVideoNum<10?' border-radius: 50%;':''">{{ data.newVideoNum>99?'99+':data.newVideoNum }}</span>
        </span>
        <i v-if="data.type === 2" class="active-right" />
        <div v-if="(data.groupLevel === 2 || data.groupLevel === 1) && data.groupId != '0'" class="action-block">
          <i class="plus-add" @click.stop="addMenu(data,1)" />
          <el-dropdown style="padding-top: 6px; float: right" @click.stop="function(){}">
            <i class="more-add" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <p @click="addMenu(data,2)">编辑</p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p class="delete-p" @click="deleteMenu(data)">删除</p>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-tree>
    <el-dialog width="550px" :title="isInsertOrEdit?'新增分组':'编辑分组'" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="editGroupForm" :model="editGroupForm" :rules="rules">
        <el-form-item label="上级分组：" :label-width="formLabelWidth">
          <p>根目录{{ forUpdateName?'/'+forUpdateName:'' }}</p>
        </el-form-item>
        <el-form-item label="分组名称：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editGroupForm.name" class="w-350" maxlength="10" show-word-limit />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editGroupForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('editGroupForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="delete-diloag" width="344px" :visible.sync="deleteFormDialog" :close-on-click-modal="false">
      <p><i class="delete-doloag-tip" /><span v-if="hasChildInfo && hasChildInfo.projectNum"> 该分组内还有{{ hasChildInfo && hasChildInfo.projectNum }}个工程，分组删除后，工程也将一并删除，且不可恢复，确认删除吗？</span><span v-else>分组下无工程，确认删除该分组吗？</span></p>
      <p v-if="hasChildInfo && hasChildInfo.projectNum" style="margin-top: 8px;margin-left: 38px;"><el-checkbox v-model="checkedDelete">确认直接删除分组内所有工程文件</el-checkbox></p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTheWnj">取 消</el-button>
        <el-button type="danger" :disabled="!checkedDelete &&hasChildInfo&& hasChildInfo.projectNum" @click="deleteTheWnj">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMyprojectList, addGroup, deleteGroup, updateGroupName, updateGroup } from '@/api/videoManagement/clipWork'
export default {
  components: {},
  props: {
  },
  data() {
    return {
      deleteFormDialog: false,
      forUpdateName: '',
      isInsertOrEdit: true,
      formLabelWidth: '95px',
      editGroupForm: {
        name: ''
      },
      dialogFormVisible: false,
      countNumber: 1,
      listData: [],
      checkedDelete: false,
      currentLivingId: '',
      openString: '',
      defaultProps: {
        children: 'childrenList',
        label: 'groupName'
      },
      nowAddProject: {},
      rules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ]
      },
      hasChildInfo: null,
      defaultkeyarr: ['0'],
      nowChooseObj: {},
      hasDataFlag: false,
      nowChooseObjFlag: false,
      isDeleteFlag: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    })
  },
  created() {
    const arrCode = localStorage.getItem('myProjectTreeOpenCodeArr')
    let arr = []
    if (arrCode) {
      arr = arrCode.split(',')
    }
    if (arr && arr.length > 0) {
      this.defaultkeyarr = arr
    } else {
      this.defaultkeyarr = ['0']
    }
    const chooseObj = localStorage.getItem('myProjectChooseObj')
    if (chooseObj) {
      this.nowChooseObjFlag = false
      this.nowChooseObj = JSON.parse(chooseObj)
      this.currentLivingId = this.nowChooseObj.code
      this.$emit('tohander', this.nowChooseObj)
    } else {
      this.nowChooseObjFlag = true
    }
  },
  methods: {
    handleNodeClick(data) {
      console.log(data, '点击的节点')
      if (data.childrenList || data.type === 1) {
        return
      }
      this.currentLivingId = data.code
      localStorage.setItem('myProjectChooseObj', JSON.stringify(data))
      this.$emit('tohander', data)
    },
    // 上一个页面带的参数选中对应节点
    selectNode(data) {
      // 通过传入的data的projectId递归查询listData相应的这条数据
      if (data?.projectId) {
        setTimeout(() => {
          const data1 = this.filterData(data.projectId, this.listData)
          this.currentLivingId = data1.code
          this.$refs.treeForPage && this.$refs.treeForPage.setCurrentKey(this.currentLivingId)
          this.defaultkeyarr = [data1.code]
          this.$emit('tohander', data1, data.videoId)
        }, 1000)
      }
    },
    filterData(id, arr) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item.projectId === id) {
          return item
        } else {
          if (item.childrenList && item.childrenList.length > 0) {
            const result = this.filterData(id, item.childrenList)
            if (result) {
              return result
            }
          }
        }
      }
    },
    closePand(node) {
      this.defaultkeyarr.some((item, index) => {
        if (item === node.code) {
          this.defaultkeyarr.splice(index, 1)
        }
      })
      localStorage.setItem('myProjectTreeOpenCodeArr', this.defaultkeyarr)
    },
    fnnodepand(node) {
      this.defaultkeyarr.push(node.code)
      localStorage.setItem('myProjectTreeOpenCodeArr', this.defaultkeyarr)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.editGroupForm.name === '默认分组') {
            this.$message.error('名称不能为默认分组！')
            return
          }
          if (this.isInsertOrEdit) {
            const params = {
              name: this.editGroupForm.name,
              parentGroupId: this.nowAddProject.groupId ? this.nowAddProject.groupId : 0
            }
            addGroup(params).then(res => {
              if (res.success) {
                this.$message.success('新增分组成功！')
                this.dialogFormVisible = false
                this.loadData()
                this.$refs[formName].resetFields()
              }
            })
          } else {
            const params = {
              groupId: this.nowAddProject.groupId,
              groupName: this.editGroupForm.name
            }
            updateGroupName(params).then(res => {
              if (res.success) {
                this.$message.success('编辑分组成功！')
                this.dialogFormVisible = false
                this.loadData()
                this.$refs[formName].resetFields()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async deleteTheWnj() {
      const res = await deleteGroup(this.hasChildInfo.groupId)
      if (res.success) {
        this.$message.success('删除成功！')
        this.deleteFormDialog = false
        this.loadData()
      }
    },
    cancelTheWnj() {
      this.deleteFormDialog = false
    },
    deleteMenu(obj) {
      this.hasChildInfo = obj
      this.deleteFormDialog = true
      // if (obj.projectNum > 0) {

      // } else {
      //   deleteGroup(obj.groupId).then(res => {
      //     if (res.success) {
      //       this.$message.success('删除成功！')
      //       this.loadData()
      //     }
      //   })
      // }
    },
    handleDragStart(node, ev) {
      // console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
      /* if (dropType === 'none' && draggingNode.data.type === 1) {
        return
      }*/
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      if (draggingNode.data.type === 2) {
        const params = {
          type: 2,
          groupId: '',
          projectId: ''
        }
        if (dropType === 'inner') {
          params.groupId = dropNode.data.groupId
          params.projectId = draggingNode.data.projectId
        } else if (dropType === 'none') {
          params.groupId = dropNode.data.groupId
          params.projectId = draggingNode.data.projectId
        } else {
          params.groupId = dropNode.parent.data.groupId
          params.projectId = draggingNode.data.projectId
        }

        updateGroup(params).then(res => {
          this.loadData()
        })
      } else if (draggingNode.data.type === 1) {
        const sortArray = []
        const params = {
          type: 1,
          groupId: '', // draggingNode.data.groupId,
          parentGroupId: '', // dropNode.data.parentGroupId,
          sortList: []
        }
        if (dropType === 'inner') {
          let sSortNumber = 0
          dropNode.data.childrenList.some(item => {
            sSortNumber++
            const obj = {
              groupId: '',
              sort: ''
            }
            obj.groupId = item.groupId
            obj.sort = sSortNumber
            sortArray.push(obj)
            params.groupId = draggingNode.data.groupId
            params.parentGroupId = dropNode.data.groupId
            params.sortList = sortArray
          })
        } else if (dropType === 'none') {
          params.groupId = draggingNode.data.groupId
          params.parentGroupId = dropNode.data.groupId
        } else {
          let sSortNumber = 0
          if (dropNode.parent.data.childrenList) {
            dropNode.parent.data.childrenList.some(item => {
              sSortNumber++
              const obj = {
                groupId: '',
                sort: ''
              }
              obj.groupId = item.groupId
              obj.sort = sSortNumber
              sortArray.push(obj)
              params.groupId = draggingNode.data.groupId
              params.parentGroupId = dropNode.data.parentGroupId
              params.sortList = sortArray
            })
          } else {
            dropNode.parent.data.some(item => {
              sSortNumber++
              const obj = {
                groupId: '',
                sort: ''
              }
              obj.groupId = item.groupId
              obj.sort = sSortNumber
              sortArray.push(obj)
              params.groupId = draggingNode.data.groupId
              params.parentGroupId = dropNode.data.parentGroupId
              params.sortList = sortArray
            })
          }
        }
        updateGroup(params).then(res => {
          this.loadData()
        })
      }
    },
    resetUpdateDatas(obj) {
      this.findUpdateData(obj, this.listData)
    },
    findUpdateData(obj, arr) {
      arr.some(item => {
        if (item.type === 2) {
          if (item.projectId === obj.projectId) {
            item.projectName = obj.projectName
            return
          } else if (item.childrenList && item.childrenList.length > 0) {
            this.findUpdateData(obj, item.childrenList)
          }
        } else if (item.type === 1) {
          if (item.childrenList && item.childrenList.length > 0) {
            this.findUpdateData(obj, item.childrenList)
          }
        }
      })
    },
    allowDrop(draggingNode, dropNode, type) {
      console.log(dropNode, draggingNode, type, '节点信息')
      // 不允许拖拽到2级以下节点
      if (draggingNode.data.type === 2 && (dropNode.data.groupLevel === 1 || !dropNode.data.groupLevel) && type !== 'inner') {
        return false
      }
      if (dropNode.data.type === 2 && type !== 'inner') {
        return false
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      if (draggingNode.data.groupName === '默认分组') { return false } else {
        return true
      }
      // draggingNode.data.code.indexOf('三级 3-2-2') === -1
    },
    addMenu(row, type) {
      if (type === 1) {
        this.nowAddProject = {}
        this.isInsertOrEdit = true
        this.openString = ''
        this.dialogFormVisible = true
        if (row) {
          this.nowAddProject = row
          this.forUpdateName = row.groupName
        } else {
          this.forUpdateName = ''
        }
      } else if (type === 2) {
        this.isInsertOrEdit = false
        this.dialogFormVisible = true
        this.nowAddProject = row
        if (this.nowAddProject.groupLevel === 1) {
          this.forUpdateName = ''
        } else {
          this.forUpdateName = this.getParentGroupName(this.nowAddProject.parentGroupId)
        }
        // this.nowAddProject
        this.editGroupForm.name = row.groupName
      }
    },
    getParentGroupName(id) {
      let name = ''
      this.listData.some(item => {
        if (item.groupId === id) {
          name = item.groupName
        }
      })
      return name
    },
    async huoquData(arr) {
      if (arr && arr.length > 0 && !this.hasDataFlag) {
        arr.some(item => {
          if (this.hasDataFlag) {
            return this.hasDataFlag
          }
          if (item.type === 1) {
            if (item.childrenList && item.childrenList.length > 0) {
              this.huoquData(item.childrenList)
            }
          } else if (item.type === 2) {
            this.hasDataFlag = true
            // this.nowChooseObj = item
            this.$emit('tohander', item)
            const that = this
            this.$nextTick(function() {
              that.currentLivingId = item.code
            })
            // this.expendForParent(item, arr)
            return this.hasDataFlag
          }
        })
      } else {
        return this.hasDataFlag
      }
    },
    expendForParent(item, arr) {
      this.nowAddProject = item
      arr.some(obj => {
        const parentGroupId = item.parentGroupId ? item.parentGroupId : '0'
        if (obj.groupId === parentGroupId) {
          this.defaultkeyarr.push(obj.code)
          localStorage.setItem('myProjectTreeOpenCodeArr', this.defaultkeyarr)
          localStorage.setItem('myProjectChooseObj', JSON.stringify(item))
          // alert(this.currentLivingId)
          this.$emit('tohander', item)
          const that = this
          this.$nextTick(function() {
            that.currentLivingId = item.code
          })

          return true
        } else if (obj.childrenList && obj.childrenList.length > 0) {
          this.expendForParent(item, obj.childrenList)
        } else {
          return false
        }
      })
    },
    loadData() {
      const params = {
      }
      getMyprojectList(params).then(async res => {
        this.listData = res.data
        this.hasDataFlag = false
        if (this.nowChooseObjFlag) {
          if (this.nowChooseObjFlag && this.listData[0].childrenList && this.listData[0].childrenList.length > 0) {
            this.$nextTick(() => {
              this.currentLivingId = this.listData[0].childrenList[0].code
              this.$refs.treeForPage && this.$refs.treeForPage.setCurrentKey(this.currentLivingId)
            })
            this.$emit('tohander', this.listData[0].childrenList[0])
            localStorage.setItem('myProjectChooseObj', JSON.stringify(this.listData[0].childrenList[0]))
          } else {
            console.log(1)
          }
        }
        if (this.isDeleteFlag) {
          this.$emit('deleteNoData')
          this.isDeleteFlag = false
        }
        // this.resetData(this.listData)
        // console.log('%%%%%%%%%%%%%%##########: ', this.listData)
        // this.openString = this.listData[0].id
        // this.currentLivingId = this.listData[0].childrenList[0].id
        // this.$emit('tohander', this.listData[0].childrenList[0])
      })
    },
    resetData(array) {
      array.some((item, index) => {
        this.countNumber++
        this.$set(item, 'id', this.countNumber + '' + index + '')
        if (item.childrenList && item.childrenList.length > 0) {
          this.resetData(item.childrenList)
        }
      })
    }
  }
}
</script>

  <style lang='scss' scoped>
  .page_wrap {
    width: 100%;
    // height: 700px;
    overflow-y: auto;
    height: calc(100vh - 300px);
    display: flex;
    flex-direction: column;
    // margin-top: 10px;
    background: #FAFCFF;
    .my_tree{
      flex: 1;
    }
    ::v-deep .el-tree {
        background-color: #FAFCFF;
    }
    .customize-tree-p {
      width: 100%;
      height: 28px;
      font-size: 14px;
      margin-top: 5px;
      padding-top: 5px;
      margin-bottom: 5px;
      ::v-deep .is-current {
          background-color: #fff;
          color: #0C6FFF;
      }
      .icn-title {
          float: left;
          width: 16px;
          height: 16px;
          margin-top: 3px;
          margin-right: 5px;
      }
      .icn-wjj {
          background-image: url(../../../../assets/image/video/wenjianjia_icon.png);
          background-size: 100% 100%;
      }
      .icn-wj {
          background-image: url(../../../../assets/image/video/wenjian_icon.png);
          background-size: 100% 100%;
      }
      .title-p {
          float: left;
          width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }
      .long-p {
          width: 150px;
      }
    }
    .active-mode {
        float: left;
        width: 100%;
        height: 28px;
    }
    ::v-deep .el-tree-node.is-current > .el-tree-node__content {
      background: #fff;
      color: #187aff;
      width: 100%;
      position: relative;
      ::v-deep .el-tree-node__expand-icon {
        color: rgb(0, 112, 255);
      }
      ::v-deep .is-leaf {
        color: rgba(0, 0, 0, 0);
      }
      .active-mode {
        float: left;
        width: 100%;
        height: 28px;
        right: 9px;
        background: #fff;
        color: #187aff;
      }
      .active-right {
        position: absolute;
        right: 9px;
        top: 9px;
        display: block;
      }
    }
    .active-right {
      width: 18px;
      height: 18px;
      display: none;
      background-image: url(../../../../assets/image/video/icn_bz.png);
      background-size: 100%;
    }
  }

  .myproject-cls {
    width: 100%;
    padding: 5px 0;
    padding-left: 15px;
    padding-right: 3px;
    font-size: 14px;
    color: #333;
    .plus-add {
      float: right;
      width: 16px;
      height: 16px;
      margin-right: 10px;
      background-image: url(../../../../assets/image/video/icn_add_img.png);
      background-size: 100%;
      cursor: pointer;
    }
  }
  ::v-deep .el-tree-node__content:hover {
    position: relative;
    .action-block {
      display: block;
    }
  }
  .action-block {
    position: absolute;
    width: 40px;
    height: 30px;
    right: 12px;
    top: 4px;
    display: none;
    .plus-add {
      float: left;
      width: 16px;
      height: 16px;
      margin-top: 6px;
      margin-right: 3px;
      background-image: url(../../../../assets/image/video/icn_add_img.png);
      background-size: 100%;
      cursor: pointer;
    }
    .more-add {
      float: right;
      width: 16px;
      height: 16px;
      background-image: url(../../../../assets/image/video/icn_more.png);
      background-size: 100%;
      cursor: pointer;
    }
  }
  .w-350 {
    width: 350px;
  }
  .delete-p {
    color: #F53F3F;
  }
  ::v-deep .el-tree-node__content {
    height: 32px;
  }

  .title-span {
      font-style: normal;
      margin-right: 5px;
      padding-right: 40px;
      position: relative;
      display: block;
      height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      .nums-prompt{
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        padding: 0 6px;
        background: #F53F3F;
        border-radius: 8px;
        position: absolute;
        right: 8px;
        top: 2px;
      }
  }

  ::v-deep .el-dialog__wrapper{
    display: flex;
    padding: 24px;
    .el-dialog {
      border-radius: 10px;
      margin: auto!important;
      .el-dialog__header {
        border-bottom: 1px solid #ececec;
        .el-dialog__title {
          font-weight: bold;
        }
      }
    }
  }

  .delete-diloag {
    ::v-deep .el-dialog__header {
      border-bottom: none!important;
    }
    ::v-deep .el-dialog__wrapper{
    display: flex;
    padding: 24px;
    width: 344px;
    .el-dialog {
      border-radius: 10px;
      margin: auto!important;

    }
  }
  }
  .delete-doloag-tip {
        float: left;
        width: 28px;
        height: 28px;
        background-image: url(../../../../assets/image/video/icn_delete_tip.png);
        background-size: 100%;
        margin-right: 10px;
      }

  ::v-deep .el-tree-node__content {
    padding-right: 15px!important;
  }
  </style>

