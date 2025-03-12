<template>
  <!-- 讲师列表 -->
  <el-table
    v-loading="loading"
    :data="config.realityTeacherUser"
    :header-cell-style="{
      background: '#f5f5f5',
      fontSize: '12px',
      padding: '3.6px 0'
    }"
    class="m-t-24 lecturerTable"
  >
    <el-table-column prop="headImgUrl" label="头像" width="80px" align="left" class-name="lecturerTable-column">
      <template slot-scope="{ row }">
        <AppAvatar :name="row.nickName" width="32" :avatar="row.headImgUrl" :no-name="true" />
      </template>
    </el-table-column>
    <el-table-column prop="lecturerName" label="讲师姓名" width="218px" class-name="lecturerTable-column">
      <template slot-scope="{ row }">
        <div class="lecturerTable-nickName-column">
          <div class="lecturerTable-nickName">
            <span class="lecturerTable-nickNameText text_hidden_1">{{ row.nickName }}</span>
          </div>
          <el-tag v-if="config.roundTableMasterId === row.userId && config.roundTableStatus" effect="dark" size="small">主持人</el-tag>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="liveRoomAlias" label="直播间名称" align="left" class-name="lecturerTable-column">
      <template slot-scope="{ row }">
        <div class="lecturerTable-nickName-column">
          <div class="lecturerTable-nickName">
            <span class="lecturerTable-nickNameText text_hidden_1">{{ row.liveRoomAlias }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="teacherTel" label="手机号" width="218px" class-name="assistantTable-column">
      <template slot-scope="{ row }">
        <watchPhoneNumber :default-value="row.teacherTel" :params="row" :user-id="row.teacherId" :get-api="operationLogsWrite" />
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180px" align="left" class-name="lecturerTable-column">
      <template slot-scope="{ row }">
        <span v-if="config.roundTableStatus && config.roundTableMasterId === row.userId">—</span>
        <div class="">
          <el-button
            v-if="config.roundTableStatus && config.roundTableMasterId !== row.userId"
            type="text"
            :disabled="ifDisabled || config.status === 9"
            style="font-size: 14px"
            size="medium"
            @click="operateHostTeacher(row)"
          >设为主持人</el-button>
          <el-button
            v-if="!config.roundTableStatus || config.roundTableMasterId !== row.userId"
            :disabled="ifDisabled || config.status !== 0"
            type="text"
            style="color: #ff2c35; font-size: 14px"
            @click="onhandleDelete(row)"
          >删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { liveOperationType } from '@/views/live/columns.js'
import { sysUserWrite } from '@/api/liveRoom/setting.js'
import watchPhoneNumber from '@/components/watchPhoneNumber'
import { getItem } from '@/utils/localStorage'
import { getIds } from '@/utils/index'
import { mapGetters } from 'vuex'
import {
  operateHostTeacherAjax,
  editHostTeacherAjax
} from '@/api/liveRoom/index'

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
    config: {
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
  methods: {
    // 设置主持人
    operateHostTeacher(row) {
      const params = {
        liveRoomId: this.$route.params.id,
        teacherId: row.userId
      }
      this.loading = true
      operateHostTeacherAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$emit('operateHostTeacherSuccess')
          } else if (res.code === 707102) {
            // 直播间存在老师提示
            this.$delModal({
              tips: `
          <div style="font-size: 16px;color: #333333;font-weight: bold;line-height: 24px;">提示</div>
          <div class="m-t-16" style="font-size: 14px;color: #333333;line-height: 22px;">已经有老师在直播间，如需要切换主持人，</div>
          <div style="font-size: 14px;color: #333333;line-height: 22px;"> 需请正在直播间的老师退出直播间，再进行设置。</div>
        `,
              sureBtnText: '我知道了',
              noCancelBtn: true,
              width: '513px',
              sureBtnStyle: { marginRight: '176.5px' }
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除
    onhandleDelete(row) {
      const realityTeacherUserIds = getIds(
        this.config.realityTeacherUser,
        'userId'
      ).filter(item => item !== row.userId)
      const params = {
        liveRoomId: this.$route.params.id,
        realityTeacherUserIds
      }
      if (realityTeacherUserIds.length === 0) {
        this.$message.error('真人讲师不能为空')
        return
      }
      this.loading = true
      editHostTeacherAjax(params)
        .then(res => {
          if (res.code === 1) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500
            })
          }
          this.$emit('operateHostTeacherSuccess')
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 手机号埋点
    operationLogsWrite(params) {
      const orginfo = getItem('orgInfo')
      const data = {
        userId: params.teacherId,
        phoneNum: params.teacherTel,
        tenantId: orginfo.organizationId,
        operationSysUserId: this.userInfo.userId,
        operationType: liveOperationType.type13
      }
      return sysUserWrite(data)
    }
  }
}
</script>

<style scoped>
.lecturerTable {
  max-width: 948px;
  width: 100%;
}
.lecturerTable-nickName-column {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.lecturerTable-nickName {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.lecturerTable-nickNameText {
  margin-left: 12px;
  max-width: 90px;
}
.lecturerTable ::v-deep .lecturerTable-column {
  padding: 4.6px 0;
}
.lecturerTable ::v-deep thead > tr > .el-table__cell {
  border-right: 1px solid #dfe6ec;
}
.lecturerTable ::v-deep thead > tr > .el-table__cell:nth-last-child(2) {
  border-right: none;
}
.lecturerTable
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
</style>
