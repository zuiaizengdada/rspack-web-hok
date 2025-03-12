<template>
  <div class="box">
    <div class="column">
      <div class="start">申请人发起</div>
      <AddBtn @add="handleAdd($event, -1)" />
      <div v-for="(item, index) in nodeInfoList" :key="index" class="column">
        <div
          class="card"
          :class="{ 'card-red': !item.nodeName }"
          @click="handleEdit(item, index)"
        >
          <div
            class="name flex justify-between"
            :class="{ name1: item.nodeType === 1 }"
          >
            <div v-if="item.nodeName.length < 8">
              <img
                v-if="item.nodeType === 1"
                class="crad-img"
                src="@/assets/image/shenpi1.png"
              />
              <img
                v-if="item.nodeType === 2"
                class="crad-img"
                src="@/assets/image/chaosong1.png"
              />
              {{
                item.nodeName
                  ? item.nodeName
                  : `${item.nodeType === 1 ? '审批' : '抄送'}节点名称`
              }}
            </div>
            <el-tooltip
              v-else
              :content="`${item.nodeName}`"
              placement="top-start"
            >
              <div>
                <img
                  v-if="item.nodeType === 1"
                  class="crad-img"
                  src="@/assets/image/shenpi1.png"
                />
                <img
                  v-if="item.nodeType === 2"
                  class="crad-img"
                  src="@/assets/image/chaosong1.png"
                />{{ item.nodeName }}
              </div></el-tooltip>
            <i
              class="el-icon-close"
              @click.stop="delNode(index, item.nodeType)"
            />
          </div>
          <div class="value-content">
            <div class="value">
              <div v-if="item.approvalUserName.length < 30">
                {{ item.nodeType === 1 ? '审批' : '抄送' }}人：{{
                  item.approvalUserName
                    ? item.approvalUserName
                    : `请输入${item.nodeType === 1 ? '审批' : '抄送'}人`
                }}
              </div>
              <el-tooltip
                v-else
                :content="`${item.approvalUserName}`"
                placement="right-start"
              >
                <div>
                  {{ item.nodeType === 1 ? '审批' : '抄送' }}人：{{
                    item.approvalUserName
                      ? item.approvalUserName
                      : `请输入${item.nodeType === 1 ? '审批' : '抄送'}人`
                  }}
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <AddBtn @add="handleAdd($event, index)" />
      </div>
      <div class="start">流程结束</div>
    </div>
    <el-drawer
      :title="drawerConfig.row.nodeType === 1 ? '编辑审批节点' : '编辑抄送节点'"
      size="600px"
      :visible.sync="drawerConfig.visible"
      direction="rtl"
      :wrapper-closable="false"
    >
      <Edit
        v-if="drawerConfig.visible"
        ref="RefEdit"
        :info="drawerConfig.row"
        @success="handleSuccess"
        @close="handleClose"
      />
    </el-drawer>
  </div>
</template>

<script>
import { updateNode } from '../../api/approval'
import AddBtn from './addButton.vue'
import Edit from './editDialog.vue'
export default {
  components: {
    AddBtn,
    Edit
  },
  props: {
    info: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      nodeInfoList: [
        {
          nodeName: '',
          approvalUserName: '',
          nodeType: 1,
          templateId: ''
        }
      ],
      drawerConfig: {
        visible: false,
        row: {}
      },
      currentIndex: undefined
    }
  },
  watch: {
    info: {
      handler(v) {
        Object.assign(this.nodeInfoList, v.nodeInfoList)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 新增节点
    handleAdd(nodeType, index) {
      // 抄送节点最多三个
      if (nodeType === 2) {
        if (
          this.nodeInfoList.filter(item => item.nodeType === 2).length === 3
        ) {
          this.$message.error('最多可添加3个抄送节点')
          return
        }
      }
      // 节点最多三个
      if (nodeType === 1) {
        if (
          this.nodeInfoList.filter(item => item.nodeType === 1).length === 10
        ) {
          this.$message.error('最多可添加10个审批节点')
          return
        }
      }
      if (index === -1) {
        this.nodeInfoList.unshift({
          nodeName: '',
          approvalUserName: '',
          nodeType,
          templateId: this.info.id
        })
      } else {
        this.nodeInfoList.splice(index + 1, 0, {
          nodeName: '',
          approvalUserName: '',
          nodeType,
          templateId: this.info.id
        })
      }
    },

    // 打开弹窗
    handleEdit(item, index) {
      this.drawerConfig = {
        visible: true,
        row: item
      }
      this.currentIndex = index
    },
    // 编辑节点确认
    handleSuccess(row) {
      this.nodeInfoList.splice(this.currentIndex, 1, { ...row })
      this.handleClose()
    },
    // 编辑节点取消
    handleClose() {
      this.drawerConfig.visible = false
    },
    // 删除节点
    delNode(index, nodeType) {
      if (
        this.nodeInfoList.filter(item => item.nodeType === 1).length === 1 &&
        nodeType === 1
      ) {
        this.$message.error('至少保留一个审批节点')
        return
      }
      this.nodeInfoList.splice(index, 1)
    },
    submit() {
      return new Promise((resolve, reject) => {
        if (
          this.nodeInfoList.length === 0 ||
          this.nodeInfoList.every(item => item.nodeType !== 1)
        ) {
          this.$message.error('请添加至少一个审批节点')
          return reject()
        }
        updateNode({
          templateId: this.info.id,
          nodeInfoList: this.nodeInfoList
        }).then(() => {
          this.$message.success('提交成功')
          return resolve()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box {
  width: 1400px;
  padding: 20px 0 60px;
  margin: 0 auto;
}
.start {
  width: 320px;
  height: 32px;
  background: #d6d6d6;
  box-shadow: 0 -2px 4px 0 #0000000d;
  border-radius: 4px;
  border: 1px solid #cbcfd3;
  color: #000;
  font-size: 14px;
  text-align: center;
  line-height: 32px;
  font-weight: 600;
}
.card {
  width: 320px;
  border-radius: 4px;
  // border: 1px solid #dcdee0;
  color: #777777;
  font-size: 14px;
  margin-top: -25px;
  cursor: pointer;
  box-shadow: 0 2px 8px 0 #00000026;
  &.card-red {
    .value {
      color: #ff2020;
    }
  }
  .name {
    border: 1px solid #ffdd80;
    background: #ffdd80;
    color: #000;
    border-radius: 4px 4px 0 0;
    font-weight: 600;
    &.name1 {
      border: 1px solid #bfd9ff;
      background: #bfd9ff;
      color: #00317a;
    }
    .crad-img {
      width: 20px;
      height: 20px;
      display: inline-block;
      vertical-align: -5px;
      margin-right: 4px;
    }
    > div {
      padding: 0 10px;
      line-height: 32px;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    i {
      color: #333333;
      font-size: 20px;
      margin-top: 3px;
      margin-right: 4px;
    }
  }
  .value-content {
    border-right: 1px solid #dcdee0;
    border-left: 1px solid #dcdee0;
    border-bottom: 1px solid #dcdee0;
    border-radius: 0 0 4px 4px;
    padding-bottom: 10px;
    height: 80px;
  }
  .value {
    height: 50px;
    padding: 10px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #000000;
  }
}
.tips {
  color: #777777;
  font-size: 12px;
}

::v-deep .el-form-item__label {
  color: #000;
}
::v-deep .el-form-item__content {
  color: #000;
}
::v-deep .el-checkbox {
  color: #000;
}
::v-deep .el-radio__label {
  color: #000;
}
::v-deep .el-input__inner {
  color: #000;
}
::v-deep .el-input__inner {
  color: #000;
}
::v-deep .el-drawer__header {
  color: #333;
}
::v-deep .el-drawer__header {
  font-weight: bold;
}
</style>

