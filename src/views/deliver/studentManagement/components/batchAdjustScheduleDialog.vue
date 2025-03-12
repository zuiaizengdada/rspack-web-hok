<template>
  <!-- 批量调整班期 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['确定调整班期', '取消']"
    title="批量调整班期"
    width="518px"
    height="auto"
    :loading="loading"
    @success="sure"
  >
    <div class="batchAdjustScheduleDialog overflowOuto">
      <div class="viewForm">
        <div class="viewFormLabel">课程名称：</div>
        <div class="viewFormValue">{{ config.goodsName }}</div>
      </div>
      <div class="viewForm" style="margin-bottom: 8px">
        <div v-if="type === 'live'" class="viewFormLabel">
          符合调整班级的学员（待交付/延期交付）
        </div>
        <div v-else class="viewFormLabel">调整班期的学员：</div>
      </div>
      <div class="userList m-b-20">
        <div
          v-for="rowIndex in Math.ceil(config.userList.length / 5)"
          :key="rowIndex"
          class="row"
        >
          <template v-for="colIndex in 5">
            <el-tooltip
              v-if="
                config.userList[(rowIndex - 1) * 5 + colIndex - 1] &&
                config.userList[(rowIndex - 1) * 5 + colIndex - 1].userId
              "
              :key="colIndex"
              class="item"
              effect="dark"
              :content="
                config.userList[(rowIndex - 1) * 5 + colIndex - 1].userName
              "
              placement="top-start"
            >
              <div class="col flex">
                <span class="text_hidden_1 text">{{
                  config.userList[(rowIndex - 1) * 5 + colIndex - 1].userName
                }}</span>
                <span
                  class="close"
                  @click="delUser((rowIndex - 1) * 5 + colIndex - 1)"
                  ><i class="el-icon-close"
                /></span>
              </div>
            </el-tooltip>
            <div v-else :key="colIndex + 1" class="colhidden" />
          </template>
        </div>
      </div>
      <div class="FormChange">
        <span class="FormChangeLabel">变更班期：</span>
        <el-select
          v-model="form.adjustScheduleId"
          placeholder="请选择"
          size="small"
          class="m-r-16"
          :filterable="true"
          clearable
          @change="adjustScheduleChangeFn"
          @clear="clear"
        >
          <el-option label="延期交付" value="-1" />
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="`${item.scheduleNum}(${item.deliveryStartTime})`"
            :value="item.id"
          />
        </el-select>
      </div>
      <template v-if="type !== 'live'">
        <div class="tips">
          若班期已开班或班期结束，联系班主任进行空降学员入班.
        </div>
        <div
          v-if="form.adjustScheduleId && form.adjustScheduleId !== '-1'"
          class="FormChange"
        >
          <span class="FormChangeLabel" style="width: 56px">班主任</span>
          <el-select
            v-model="form.teacherUserId"
            placeholder="请选择"
            size="small"
            class="m-r-16"
            clearable
            @clear="clear"
          >
            <el-option
              v-for="item in headmasterArr"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            />
          </el-select>
        </div>
        <div v-if="form.adjustScheduleId === '-1'" class="FormChange">
          <span class="FormChangeLabel" style="width: 56px"> 助教： </span>
          <AppSelect
            :get-api-fn="getAssistantPage"
            search-key="sysUserName"
            :value="form.assistantUserId"
            :label="form.sysUserName"
            :props="props"
            :params="{ goodsId: config.goodsId }"
            @selected="selected"
          />
        </div>
      </template>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppSelect from '@/components/AppSelect'
import {
  batchAdjustDeliveryInfo,
  getsScheduleHeadteacherList,
  getUnfinishedListSchedule,
  liveAdjustDeliveryInfo
} from '@/api/deliver/studentManagement'
import { getAssistantPage } from '@/api/deliver/assistant'
export default {
  components: {
    AppDialog,
    AppSelect
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          goodsName: '',
          goodsId: '',
          scheduleId: '',
          userList: []
        }
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        adjustScheduleId: '', //
        assistantUserId: '',
        scheduleId: '', // 班期编号
        teacherUserId: '',
        sysUserName: ''
      },
      props: {
        label: 'sysUserName',
        value: 'sysUserId'
      },
      options: [],
      loading: false,
      headmasterArr: [],
      assistantList: []
    }
  },
  watch: {
    'config.visible'(val) {
      if (val) {
        this.getScheduleList()
      } else {
        this.form = {
          adjustScheduleId: '', //
          assistantUserId: '',
          scheduleId: '', // 班期编号
          teacherUserId: '',
          sysUserName: ''
        }
        this.headmasterArr = []
      }
    }
  },
  mounted() {},
  methods: {
    // 清空班期选择
    clear() {},
    getAssistantPage(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        goodsId: params.goodsId,
        sysUserName: params.sysUserName
      }
      return getAssistantPage(data).then(res => {
        this.assistantList = res.data.items
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    selected(e) {
      this.form.assistantUserId = e.sysUserId
      this.form.sysUserName = e.sysUserName
    },
    // 根据商品获取班期列表
    getScheduleList() {
      getUnfinishedListSchedule(
        this.type === 'live' ? 2 : 1,
        this.config.goodsId,
        this.config.scheduleId
      ).then(res => {
        if (res.data) {
          this.options = res.data
        }
      })
    },
    // 变更班期选择触发
    adjustScheduleChangeFn(val) {
      this.form.teacherUserId = ''
      this.form.scheduleId = ''
      if (val === '-1') {
        const userInfo = this.$store.state.user.userInfo
        const userIds = this.assistantList.map(i => i.sysUserId)
        if (userIds.includes(userInfo.userId)) {
          this.form.assistantUserId = userInfo.userId
        }
      } else {
        if (this.form.adjustScheduleId) {
          this.getsScheduleHeadteacherList()
        }
        this.headmasterArr = []
      }
    },
    delUser(index) {
      this.config.userList.splice(index, 1)
    },
    // 点击确认
    sure() {
      if (!this.form.adjustScheduleId) {
        return this.$message.error('请选择变更班期')
      } else if (
        this.type !== 'live' &&
        this.form.adjustScheduleId !== '-1' &&
        this.form.teacherUserId === ''
      ) {
        return this.$message.error('请选择班主任')
      } else if (
        this.type !== 'live' &&
        this.form.adjustScheduleId === '-1' &&
        this.form.assistantUserId === ''
      ) {
        return this.$message.error('请选择助教')
      }
      this.loading = true
      const deliveryInfoIdList = this.config.userList.reduce((pre, next) => {
        next.deliveryInfoId && pre.push(next.deliveryInfoId)
        return pre
      }, [])
      let params = {}
      if (this.type === 'live') {
        params = {
          ids: deliveryInfoIdList,
          scheduleId: this.form.adjustScheduleId,
          assistantUserId: this.form.assistantUserId,
          teacherUserId: this.form.teacherUserId
        }
      } else {
        params = {
          adjustScheduleId:
            this.form.adjustScheduleId === '-1'
              ? ''
              : this.form.adjustScheduleId,
          delayDeliveryFlag: this.form.adjustScheduleId === '-1' ? 2 : 1,
          deliveryInfoIdList,
          assistantUserId: this.form.assistantUserId,
          scheduleId: this.form.scheduleId,
          teacherUserId: this.form.teacherUserId
        }
      }
      const Pro =
        this.type === 'live' ? liveAdjustDeliveryInfo : batchAdjustDeliveryInfo
      Pro(params)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
          // if (res.data) {
          //   this.$message.success(res.data)
          // }
          this.$emit('success')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getsScheduleHeadteacherList() {
      const currentUserId = this.$store.state.user.userInfo.userId
      getsScheduleHeadteacherList(this.form.adjustScheduleId).then(res => {
        this.headmasterArr = res.data
        const index = res.data.findIndex(v => {
          return v.userId === currentUserId
        })
        console.log(index, 'index')
        index > -1 && (this.form.teacherUserId = currentUserId)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.batchAdjustScheduleDialog {
  padding: 16px;
  min-height: 304px;
  max-height: 400px;
  .viewForm {
    display: flex;
    margin-bottom: 16px;
    .viewFormLabel {
      min-width: 80px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      color: #777777;
      line-height: 24px;
      margin-right: 8px;
      font-size: 14px;
    }
    .viewFormValue {
      padding-top: 2px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
    }
  }
  .FormChange {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .FormChangeLabel {
      text-align: right;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333333;
      line-height: 22px;
      margin-right: 8px;
    }
  }
  .userList {
    background: #f7fbff;
    border-radius: 8px;
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    .row {
      width: 100%;
      border-bottom: 1px solid #e7e7e7;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 10px;
      padding-bottom: 10px;
      &:last-child {
        border-bottom: none;
      }
      .col {
        text-align: center;
        padding: 4px 5px 4px 10px;
        background: #e6f4ff;
        border-radius: 4px;
        border: 1px solid #66bdff;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #0091ff;
        line-height: 20px;
        display: flex;
        .text {
          width: 50px;
        }
        .close {
          margin-left: 5px;
          font-size: 16px;
        }
      }
      .colhidden {
        width: 70px;
      }
    }
    .tips {
      margin: 0 0 16px 80px;
      font-size: 12px;
      color: #999999;
    }
    // .userListView {
    //   flex: 20% 0 0;
    //   border-bottom: 1px solid #E7E7E7;
    //   padding-bottom: 10px;
    //   padding-top: 10px;
    //   // &:nth-last-child(-n + 5) {
    //   //   border-bottom: none
    //   // }
    //   .userNmae {
    //     width: 70px;
    //     box-sizing: border-box;
    //     text-align: center;
    //     background: #E6F4FF;
    //     padding: 4px 11px;
    //     border: 1px solid #66BDFF;
    //     font-size: 12px;
    //     font-family: MicrosoftYaHei;
    //     color: #0091FF;
    //     line-height: 20px;
    //     border-radius: 4px;
    //   }
    // }
  }
}
</style>
