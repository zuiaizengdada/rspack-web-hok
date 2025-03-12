<template>
  <div>
    <el-button :disabled="ifDisabled" type="primary" size="small" icon="el-icon-plus" @click="addAssistant">添加助教</el-button>
    <span class="assistantSettings-tip">助教最多添加100个，如需更换直播间头像和名称，请找负责人在【通用设置】菜单中更换。</span>
    <!-- 助教列表 -->
    <el-table
      v-loading="loading"
      :data="list"
      :header-cell-style="{background: '#f5f5f5',fontSize: '12px',padding: '3.6px 0'}"
      class="m-t-24 assistantTable"
    >
      <el-table-column prop="headImgUrl" label="头像" width="80px" align="left" class-name="assistantTable-column">
        <template slot-scope="{ row }">
          <AppAvatar :name="row.liveRoomAlias || row.teacherName" width="32" :avatar="row.headImgUrl" :no-name="true" />
        </template>
      </el-table-column>
      <el-table-column prop="teacherName" label="助教姓名" width="218px" class-name="assistantTable-column" />
      <el-table-column prop="liveRoomAlias" label="直播间助教名称" class-name="assistantTable-column" />
      <el-table-column prop="teacherTel" label="手机号" width="218px" class-name="assistantTable-column">
        <template slot-scope="{ row }">
          <watchPhoneNumber :default-value="row.teacherTel" :params="row" :user-id="row.teacherId" :get-api="operationLogsWrite" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px" align="left" class-name="assistantTable-column">
        <template slot-scope="{ row }">
          <el-button :disabled="ifDisabled || detail.status !== 0" type="text" style="color: #ff2c35; font-size: 14px" @click="onhandleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { liveOperationType } from '@/views/live/columns.js'
import { getIds } from '@/utils/index'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { sysUserWrite } from '@/api/liveRoom/setting.js'
import { getItem } from '@/utils/localStorage'
import { addLiveRoomInfoEditTutor, gettutorPage, delTeacherManager } from '@/api/liveRoom/index'
import { mapGetters } from 'vuex'
export default {
  components: {
    AppAvatar,
    watchPhoneNumber
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    form: {
      type: Object,
      default: () => {
        return {
          realityTeacherUser: [],
          tutorTeacherUser: [],
          roundTableStatus: false,
          roundTableMasterId: '',
          status: ''
        }
      }
    },
    enterLiveRoom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    ifDisabled() {
      const ifCreate = this.detail?.createUserId === this.userInfo.userId
      console.log(ifCreate, 'ifCreate', this.detail?.status, this.enterLiveRoom)
      if (this.detail?.status === 9) {
        return true
      } else if (this.enterLiveRoom) {
        // 白名单可直接设置
        return false
      } else if (ifCreate) {
        // 创建人可操作
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    'form.tutorTeacherUser': {
      handler() {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    // 删除
    onhandleDelete(row) {
      console.log('点击删除', row)
      this.$delModal({
        tips: `是否确定删除?`,
        success: () => {
          this.loading = true
          const data = {
            id: row.id
          }
          delTeacherManager(data).then(res => {
            this.currentPage = 1
            this.getList()
            this.$emit('success')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    getList() {
      // this.loading = true
      // const start = (this.currentPage - 1) * this.pageSize
      // const end = this.currentPage * this.pageSize
      // const arr = JSON.parse(JSON.stringify(this.form.tutorTeacherUser))
      // this.list = arr.splice(start, end)
      // this.total = this.list.length
      // this.loading = false
      this.loading = true
      const data = {
        // liveRoomId: this.detail.liveRoomId,
        liveRoomId: this.$route.params.id,
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      gettutorPage(data).then(res => {
        this.list = res.data.items
        this.total = res.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加助教
    addAssistant() {
      let disabledUser = getIds(this.form.realityTeacherUser, 'userId')
      if (this.detail.status !== 0) {
        const arr = getIds(this.form.tutorTeacherUser, 'userId')
        disabledUser = disabledUser.concat(arr)
      }
      this.$AddressBook({
        visible: true,
        multiple: true,
        disabledUser,
        checkUser: this.form.tutorTeacherUser,
        type: [1],
        maxlength: 100,
        success: res => {
          console.log(res, 'res')
          const teacherIds = getIds(res.user, 'userId')
          this.loading = true
          const params = {
            liveRoomId: this.detail.liveRoomId,
            teacherIds
          }
          addLiveRoomInfoEditTutor(params).then(res => {
            this.$emit('success')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const orginfo = getItem('orgInfo')
      const data = {
        userId: params.teacherId,
        phoneNum: params.teacherTel,
        tenantId: orginfo.organizationId,
        operationSysUserId: this.userInfo.userId,
        operationType: liveOperationType.type11
      }
      return sysUserWrite(data)
    }
  }
}
</script>

<style scoped>
.assistantTable {
  max-width: 948px;
  width: 100%;
}
.assistantTable-nickName-column {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.assistantTable-nickName {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.assistantTable-nickNameText {
  margin-left: 12px;
  max-width: 90px;
}
.assistantTable ::v-deep .assistantTable-column {
  padding: 4.6px 0;
}
.assistantTable ::v-deep thead > tr > .el-table__cell {
  border-right: 1px solid #dfe6ec;
}
.assistantTable ::v-deep thead > tr > .el-table__cell:nth-last-child(2) {
  border-right: none;
}
.assistantTable
  ::v-deep
  .el-table__body-wrapper
  tbody
  > tr
  > .el-table__cell {
    border-right: 1px solid #dfe6ec;
}
.assistantTable
  ::v-deep
  .el-table__body-wrapper
  tbody
  > tr
  > .el-table__cell:last-child {
  border-right: none;
}
.assistantSettings-tip {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  margin-left: 16px;
  vertical-align: middle;
}
.pagination {
  width: 930px;
  margin-top: 10px;
  text-align: right;
}
</style>
