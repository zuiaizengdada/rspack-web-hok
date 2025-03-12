<template>
  <!-- 调整班期弹框 -->
  <AppDialog
    v-model="config.visible"
    :footer-text="['确定调整班期', '取消']"
    title="调整班期"
    width="518px"
    height="300px"
    :loading="loading"
    @success="sure"
  >
    <div class="adjustScheduleDialog overflowOuto">
      <div class="viewForm">
        <div class="viewFormLabel">课程名称：</div>
        <div class="viewFormValue">{{ config.row.goodsName }}</div>
      </div>
      <div class="viewForm">
        <div class="viewFormLabel">原属班期：</div>
        <div class="viewFormValue">
          {{
            `${
              config.row.scheduleNum ? config.row.scheduleNum + '期' : '未分班'
            }`
          }}
        </div>
      </div>
      <div v-if="config.row.scheduleNum" class="viewForm">
        <div class="viewFormLabel">班期状态：</div>
        <div class="viewFormValue">
          {{
            { 1: '未开班', 2: '已开班', 3: '已完结' }[config.row.scheduleStatus]
          }}
        </div>
      </div>
      <div v-if="config.row.scheduleNum" class="viewForm">
        <template v-if="type === '3'">
          <div class="viewFormLabel">开班时间：</div>
          <div class="viewFormValue">
            {{ config.row.scheduleDeliveryStartTime }}
          </div>
        </template>
        <template v-else>
          <div class="viewFormLabel">班期交付时间：</div>
          <div class="viewFormValue">
            {{ config.row.deliveryTime }}
          </div></template
        >
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
      <template v-if="type !== '3'">
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
      </template>
      <!-- <div v-if="form.adjustScheduleId === '-1'" class="FormChange">
        <span class="FormChangeLabel" style="width: 56px">
          助教：
        </span>
        <AppSelect
          :get-api-fn="getAssistantPage"
          search-key="sysUserName"
          :value="form.assistantUserId"
          :label="form.sysUserName"
          :props="props"
          :params="{goodsId: config.row.goodsId}"
          @selected="selected"
        />
      </div> -->
    </div>
  </AppDialog>
</template>

<script>
// scheduleStatus 1未开班，2已开班，3已完结
import AppDialog from '@/components/AppDialog'
// import AppSelect from '@/components/AppSelect'
import {
  getsScheduleHeadteacherList,
  getUnfinishedListSchedule,
  editDeliveryAdjustDetail,
  editDeliveringAdjustDetail,
  liveAdjustDeliveryInfo
} from '@/api/deliver/studentManagement'
import { getAssistantPage } from '@/api/deliver/assistant'
export default {
  components: {
    AppDialog
    // AppSelect
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          visible: false,
          row: {}
        }
      }
    },
    type: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      form: {
        adjustScheduleId: '', //
        // assistantUserId: '', // 由当前登录账号跟进此学员
        scheduleId: '', // 班期编号
        teacherUserId: '', // 班期班主任用户编号
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
        this.init()
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
      // this.form.assistantUserId = e.sysUserId
      this.form.sysUserName = e.sysUserName
    },
    // 根据商品获取班期列表
    getScheduleList() {
      getUnfinishedListSchedule(
        this.type === '3' ? 2 : 1,
        this.config.row.goodsId,
        this.config.row.scheduleId
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
          // this.form.assistantUserId = userInfo.userId
        }
      } else {
        if (this.form.adjustScheduleId) {
          this.getsScheduleHeadteacherList()
        }
        this.headmasterArr = []
      }
    },
    // 点击确认
    sure() {
      if (!this.form.adjustScheduleId) {
        return this.$message.error('请选择变更班期')
      } else if (
        this.type !== '3' &&
        this.form.adjustScheduleId !== '-1' &&
        this.form.teacherUserId === ''
      ) {
        return this.$message.error('请选择班主任')
      }
      // else if (this.form.adjustScheduleId === '-1' && this.form.assistantUserId === '') {
      //   return this.$message.error('请选择助教')
      // }

      this.loading = true
      const params = {
        adjustScheduleId:
          this.form.adjustScheduleId === '-1' ? '' : this.form.adjustScheduleId,
        delayDeliveryFlag: this.form.adjustScheduleId === '-1' ? 2 : 1,
        deliveryInfoId: this.config.row.deliveryInfoId,
        // assistantUserId: this.form.assistantUserId,
        scheduleId: this.form.scheduleId,
        teacherUserId: this.form.teacherUserId
      }
      this.editAdjust(params)
        .then(res => {
          this.$notify.success({ title: '提示', message: '操作成功' })
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
        index > -1 && (this.form.teacherUserId = currentUserId)
      })
    },
    init() {
      this.form = {
        adjustScheduleId: '',
        // assistantUserId: '',
        scheduleId: '', // 班期编号
        teacherUserId: '', // 班期班主任用户编号
        sysUserName: ''
      }
      this.headmasterArr = []
    },
    editAdjust(params) {
      if (this.type === '1') {
        return editDeliveringAdjustDetail(params)
      } else if (this.type === '3') {
        return liveAdjustDeliveryInfo({
          ids: [this.config.row.deliveryInfoId],
          teacherUserId: this.form.teacherUserId,
          scheduleId: this.form.adjustScheduleId
        })
      } else {
        return editDeliveryAdjustDetail(params)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.adjustScheduleDialog {
  padding: 16px;
  height: 300px;
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
  .tips {
    margin: 0 0 16px 80px;
    font-size: 12px;
    color: #999999;
  }
}
</style>
