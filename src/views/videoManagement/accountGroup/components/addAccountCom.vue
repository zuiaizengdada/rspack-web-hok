<template>
  <div v-if="addAccountFlag" class="add_account_page">
    <el-dialog
      width="695px"
      :visible.sync="addAccountFlag"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <p class="p-title">添加账号</p>
      </div>
      <div class="account-choose-block">
        <div class="acc-block-left">
          <div v-for="(item, index) in platformArray" :key="item.platformId" class="acc-line" :class="activeClassIndex === index?'activeClass':''" @click="changePlatform(index,item.platformId)">
            <img :src="item.platformIcon" />
            <p>{{ item.platformName }}</p>
          </div>
        </div>
        <div class="acc-block-right">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="35"
            />
            <el-table-column
              label="全选"
              width="440"
            >
              <template slot-scope="scope">
                <div class="scope-line">
                  <img :src="scope.row.avatar" />
                  <span>{{ scope.row.name }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAccountFlag = false">取 消</el-button>
        <el-button type="primary" @click="chooseTheUseAccount">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getPlatform, getAccountByPlatform } from '@/api/videoManagement/accountManage'
export default {
  name: 'AddAccountCom',
  props: {
    accountArr: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: []
    }
  },
  data() {
    return {
      addAccountFlag: false,
      addOrEidt: 'add',
      platformArray: [],
      activeClassIndex: 0,
      activePlatformId: '',
      tableData: [],
      multipleSelection: [],
      chooseData: []
    }
  },
  created() {
    this.loadPlatformData()
  },
  mounted() {
  },
  methods: {
    pjData() {
      this.accountArr.some(item => {
        for (var i = 0; i < this.chooseData.length; i++) {
          if (item.platformId === this.chooseData[i].platformId) {
            this.chooseData[i].arr.push(item)
          }
        }
      })
      this.activeClassIndex = 0
      this.loadAccountList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(val)
      this.chooseData.some(item => {
        if (item.platformId === this.activePlatformId) {
          item.arr = val
        }
      })
    },
    loadAccountList() {
      const params = {
        platformId: this.platformArray[this.activeClassIndex].platformId,
        type: 1
      }
      getAccountByPlatform(params).then(res => {
        console.log('sssssssss:', res)
        if (res.success) {
          this.tableData = res.data
          if (this.tableData.length <= 0) {
            return
          }
          this.$nextTick(() => {
            this.multipleSelection = []
            this.tableData.some(item => {
              for (var i = 0; i < this.accountArr.length; i++) {
                if (item.platformAccountId === this.accountArr[i].platformAccountId) {
                  this.$refs.multipleTable?.toggleRowSelection(item, true)
                  this.$forceUpdate()
                }
              }
            })
          })
        }
      })
    },
    changePlatform(index, id) {
      this.activeClassIndex = index
      this.activePlatformId = id
      this.loadAccountList()
    },
    chooseTheUseAccount() {
      let returnArr = []
      this.chooseData.some(item => {
        returnArr = returnArr.concat(item.arr)
      })
      this.addAccountFlag = false
      returnArr?.some(item => {
        for (var i = 0; i < this.platformArray.length; i++) {
          if (item.platformId === this.platformArray[i].platformId) {
            item.ptAvator = this.platformArray[i].platformIcon
          }
        }
      })
      this.chooseData.some(item => {
        item.arr = []
      })
      this.$emit('returnAccountData', returnArr)
    },
    show() {
      this.addAccountFlag = true
      // this.loadAccountList()
    },
    handleClose() {
      this.addAccountFlag = false
    },
    loadPlatformData() {
      getPlatform().then(res => {
        if (res.success) {
          this.platformArray = res.data
          this.activeClassIndex = 0
          this.activePlatformId = this.platformArray[this.activeClassIndex].platformId
          if (this.addOrEidt === 'add') {
            this.chooseData = []
            this.platformArray?.some(item => {
              const obj = {}
              obj.platformId = item.platformId
              obj.arr = []
              this.chooseData.push(obj)
            })
          }
          this.changePlatform(this.activeClassIndex, this.activePlatformId)
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.add_account_page {
    width: 100%;
    height: 100%;
    position: absolute;
    ::v-deep .el-dialog {
        border-radius: 10px;
    }
    ::v-deep .el-dialog__body {
        padding: 0 0px!important;
    }
    ::v-deep .el-dialog__header {
        border-bottom: 1px solid #e7e7e7;
    }
    ::v-deep .el-dialog__footer {
      box-shadow: 0px -2px 4px 0px rgba(0,0,0,0.05);
    }
    .p-title {
        font-size: 16px;
        font-weight: bold;
    }
    .plat_array_content {
        width: 100%;
        height: 280px;
        .plat_content {
            float: left;
            margin-right: 54px;
            width: 64px;
            height: 64px;
            cursor: pointer;
            img {
                width: 64px;
                height: 64px;
            }
            p {
                font-size: 16px;
                line-height: 30px;
                height: 30px;
                width: 100%;
                text-align: center;
                color: #333;
                float: left;
                margin-top: 5px;
            }
        }
    }
}
.account-choose-block {
    width: 100%;
    display: flex;
    .acc-block-left {
        float: left;
        width: 200px;
        height: 100%;
        border-right: 1px solid #E7E7E7;
        .acc-line {
            width: 100%;
            padding: 10px 20px;
            height: 68px;
            cursor: pointer;
            img {
                float: left;
                width: 48px;
                height: 48px;
                margin-right: 10px;
            }
            p {
                float: left;
                height: 48px;
                line-height: 48px;
                color: #333;
                font-size: 16px;
            }
        }
        .activeClass {
          background: #E7F0FF;
        }
    }
    .acc-block-right {
      float: left;
      width: 480px;
      height: 100%;
      overflow-y: auto;
      ::v-deep .el-table {
        width: 100%!important;
        border: none!important;
      }
      ::v-deep .el-table::before {
        height: 0px!important;
      }
      ::v-deep .ep-table th {
        width: 100%;
      }
      ::v-deep .el-table th.el-table__cell.is-leaf {
        border: none!important;
      }
      ::v-deep .el-table td.el-table__cell {
        border: none!important;
      }
      ::v-deep .el-checkbox:last-of-type {
        margin-right: -10px!important;
      }
    }
    .scope-line {
      width: 100%;
      padding-left: 5px;
      img {
        float: left;
        width: 52px;
        height: 52px;
        border-radius: 100%;
        margin-right: 10px;
      }
      span {
        float: left;
        width: 340px;
        height: 52px;
        line-height: 52px;
        color: #333;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .message-ws {
        float: right;
        margin-top: 13px;
        color: #0C6FFF;
        border: 1px solid #0C6FFF;
      }
    }
}
</style>

