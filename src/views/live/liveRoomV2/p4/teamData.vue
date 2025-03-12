<template>
  <div class="teamData">
    <div class="teamDataHeader">
      <!-- <div class="teamDataHeaderLeft" @click="onHandleBack"><i class="el-icon-arrow-left backIcon" />返回</div> -->
      <div class="teamDataHeaderRight">
        <span class="teamDataHeaderRightLeable">部门</span>
        <el-cascader
          ref="cascader"
          v-model="myDept"
          class="teamDataHeaderRightSelect"
          size="mini"
          :show-all-levels="false"
          filterable
          :clearable="canClearable()"
          :options="deptTreeArray"
          :props="{ checkStrictly: true }"
          @change="searchFn"
        />
      </div>
    </div>
    <div class="teamDataTable">
      <el-table
        :data="tableData"
        style="width: 100%"
        :max-height="300"
        :row-class-name="rowClassName"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :header-cell-style="{ color: '#000' }"
        :cell-style="{ color: '#000' }"
      >
        <el-table-column prop="userName" label="员工姓名" width="110">
          <template slot-scope="{ row }">
            <div class="userNameBox">
              <span>{{ row.userName }}</span>
              <div class="onlineTips" :class="`onlineTips${row.onlineStatus}`">{{ { 1: '在线', 0: '离线' }[row.onlineStatus] }}
              </div></div>
          </template>
        </el-table-column>
        <el-table-column prop="attendPeopleNum" label="到课人数" sortable width="90" align="center" />
        <el-table-column prop="unpaidOrderCount" label="未支付" sortable width="85" align="center" />
        <el-table-column prop="paidOrderCount" label="已支付笔数" sortable width="110" align="center" />
        <el-table-column prop="gmv" label="已付款GMV" sortable width="110" align="center">
          <template slot-scope="{ row }">
            {{ row.gmv | filtersMoneyByZero }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { deptTree } from '@/api/addressBookApi'
import { teamOverview } from '@/api/liveRoom/liveRoom.js'
import { mapState } from 'vuex'
export default {
  components: {},
  data() {
    return {
      myDept: [],
      tableData: [],
      loading: false,
      liveRoomId: this.$route.params.id,
      deptTreeArray: []
    }
  },
  computed: {
    ...mapState({
      groupId: state => state.im.liveRoomDetail.groupId,
      imUserInfoDeptId: state => state.im.imUserInfo.deptId
    })
  },
  mounted() {
    this.loading = true
    this.myDept = this.imUserInfoDeptId
    this.loadTreeData()
    this.searchFn()
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      return 'custom-row'
    },
    onHandleBack() {
      this.$emit('onBack')
    },
    async loadTreeData() {
      const res = await deptTree()
      this.encapsulateData(res.data)
      this.deptTreeArray = res.data
    },
    encapsulateData(array) {
      if (!array) {
        return
      }
      for (let i = 0; i < array.length; i++) {
        array[i].value = array[i].id
        if (array[i].children && array[i].children.length > 0) {
          this.encapsulateData(array[i].children)
        } else {
          delete array[i].children
        }
      }
    },
    searchFn() { // 手动关闭下拉框
      this.$nextTick(() => {
        this.$refs.cascader.dropDownVisible = false
      })
      this.loading = true
      if (this.myDept.length === 0) {
        this.myDept = this.imUserInfoDeptId
      }
      let deptId = ''
      this.myDept.length > 0 && (deptId = this.myDept[this.myDept.length - 1])
      const data = {
        deptId,
        liveRoomId: this.liveRoomId,
        groupId: this.groupId
      }
      console.log(this.myDept, 'myDept')
      teamOverview(data).then(res => {
        console.log(res, '获取团队数据')
        if (res.data) {
          this.tableData = res.data
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    canClearable() {
      return JSON.stringify(this.myDept) !== JSON.stringify(this.imUserInfoDeptId)
    }
  }
}
</script>

<style lang='scss' scoped>
.teamData {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background: linear-gradient(180deg, #D7FEFF 0%, #FFF 100%);

  // display: flex;
  // flex-direction: column;
  .teamDataHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 0;

    .teamDataHeaderLeft {
      color: #999999;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: Normal;
      display: flex;
      align-items: center;
      cursor: pointer;

      &:hover {
        color: #0C6FFF;
      }

      .backIcon {
        font-size: 15px;
      }
    }

    .teamDataHeaderRight {
      .teamDataHeaderRightLeable {
        color: #000000;
        font-family: "Microsoft YaHei";
        font-size: 10px;
        font-style: normal;
        font-weight: Semi Bold;
        line-height: 14px;
        margin-right: 10px;
      }

      .teamDataHeaderRightSelect {
        width: 120px;

        ::v-deep {
          .el-input__inner {
            border: none;
            background: rgba(0, 0, 0, 0.05);
            color: #000;
            font-size: 10px;
            height: 22px;
            padding: 0 18px 0 5px;
          }
        }
      }
    }
  }

  .teamDataTable {
    flex: 1 0 0;
    padding: 0 10px 10px;
    overflow: hidden;

    ::v-deep {
      .el-table__header {
        th {
          background: transparent;
          border-bottom: none;

          .cell {
            color: #000;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            text-align: center;
            .caret-wrapper{
              width: 10px;
            }
          }
        }
      }

      .el-table {
        background: transparent;

        &::before {
          content: none;
        }

        .custom-row {
          margin-bottom: 5px;
        }

        .el-table__body-wrapper .el-table__row {
          margin-bottom: 5px;
          /* 表格内容实际行的间距 */
        }

        /* 针对 .el-table 的样式调整 */
        .el-table__body-wrapper {
          overflow-y: auto;
        }

        .el-table__body {
          border-collapse: separate !important;
          /* 使表格元素不合并，以便设置间距 */
          border-spacing: 0 5px;
          /* 行间距 */

          .el-table__cell {
            border-bottom: none;
            background: rgba(0, 0, 0, 0.05);
          }
          .cell{
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
        }

        tr {
          border-radius: 5px;
          background: transparent;
          td{
            &:first-of-type{
              border-radius: 5px 0 0 5px;
            }
            &:last-of-type{
              border-radius: 0 5px 5px 0;
            }
          }
          // background: rgba(0, 0, 0, 0.05);
        }

        td.el-table__cell {
          border-bottom: none;
        }
      }
    }
  }

  .onlineTips {
    display: inline-block;
    font-family: "Microsoft YaHei";
    font-size: 10px;
    font-style: normal;
    font-weight: Normal;
    line-height: 9px;
    border: 1px solid;
    border-radius: 2px;
    flex-shrink: 0;
    padding: 2px 4px;
    vertical-align: 1px;
  }

  .onlineTips0 {
    color: #c9c9c9;
    border: 1px solid #C9C9C9;
  }

  .onlineTips1 {
    color: #45AE3F;
    border: 1px solid #45AE3F;
  }
  .userNameBox{
    display: flex;
    align-items: center;
    >span{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-right: 2px;
    }
  }
}

::v-deep {
  .has-gutter {
    >tr {
      .el-table__cell:first-child {
        >.cell {
          transform: translateY(-2px);
        }
      }
    }
  }
}
</style>
