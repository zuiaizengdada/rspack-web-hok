<template>
  <el-drawer
    title="详情"
    :visible.sync="visible"
    direction="rtl"
    :size="830"
    class="view-container"
  >

    <div class="drawer-container">
      <el-form
        :inline="true"
        size="small"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="学员电话">
          <el-input
            v-model="form.phone"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="分配时间">
          <el-date-picker
            v-model="form.createTime"
            style="width: 200px"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          />
          <el-button
            size="small"
            style="margin-left:30px"
            type="primary"
            @click="search"
          >查询</el-button>
          <el-button size="small" @click="clear">重置</el-button>
        </el-form-item>
      </el-form>
      <dynamicTable
        ref="table"
        v-model="tableData"
        immediate-check
        :columns="columns"
        :get-list-api="getList"
        class="dialog-table"
      >
        <template slot="action" slot-scope="scope">
          <el-button type="text" @click="onhandleDetail(scope.row)">详情</el-button>
        </template>
        <template slot="isAddQw" slot-scope="{ row }">
          <MIconStatus
            :background="getOptionsValueByKey('value','background',row.isAddQw,followWechatStatus)"
            :color="getOptionsValueByKey('value','color', row.isAddQw,followWechatStatus)"
            :icon-class="getOptionsValueByKey('value', 'icon', row.isAddQw, followWechatStatus)"
            :title="getOptionsValueByKey('value','label',row.isAddQw,followWechatStatus)"
          />
        </template>
        <template slot="isAddGw" slot-scope="{ row }">
          <!-- 添加跟进人个人微信 -->
          <MIconStatus
            style="cursor: pointer;"
            :background="getOptionsValueByKey('value','background',row.isAddGw,followPrivateWechatStatus)"
            :color="getOptionsValueByKey('value','color', row.isAddGw,followPrivateWechatStatus)"
            :icon-class="getOptionsValueByKey('value', 'icon', row.isAddGw, followPrivateWechatStatus)"
            :title="getOptionsValueByKey('value','label',row.isAddGw,followPrivateWechatStatus)"
            class-name="isAddGwIconClass"
            @click.native="editIsAddGw(row)"
          />
        </template>
        <template #isSubscribe="{ row }">
          <AppStatus
            :title="{0:'否',1:'是'}[row.isSubscribe]"
            :status="{0:'error',1:'success'}[row.isSubscribe]"
          />
        </template>
        <template slot="externalUserTags" slot-scope="{ row }">
          <!-- 企微标签 -->
          <el-tag
            v-for="(item, index) in row.externalUserTags"
            :key="index"
            class="m-r-10 m-b-10"
          >{{ item.tagName }}</el-tag>
        </template>
      </dynamicTable>
    </div>
  </el-drawer>
</template>

<script>
import AppStatus from '@/components/AppStatus/index'
import dynamicTable from '@/components/DynamicTable/table'
import { cluePageList } from '@/api/privateArea/toolbox'
import { getOptionsValue, getOptionsValueByKey } from '@/filters/index'
import moment from 'moment'
// 线索类型
const clueTypeStatus = [
  { label: '订单', value: 1 },
  { label: '线下表格', value: 2 }
]
const followStatus = [
  { label: '已加个微待通过', value: 1 },
  { label: '不需要', value: 2 },
  { label: '在忙', value: 3 },
  { label: '未接', value: 4 },
  { label: '意向客户', value: 5 },
  { label: '未知', value: 6 },
  { label: '未接2', value: 7 },
  { label: '未接3', value: 8 },
  { label: '电话搜不到微信', value: 9 },
  { label: '已发短信', value: 10 }
]
export default {
  components: {
    AppStatus,
    dynamicTable
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          // eslint-disable-next-line eqeqeq
          if (this.currentTime) {
            // 一年以内
            // const one = 364 * 24 * 3600 * 1000
            // 月份为30 * 24 * 3600 *1000
            // const minTime = this.currentTime - one
            // const maxTime = this.currentTime + one
            const minTime = moment(this.currentTime).subtract(1, 'years').valueOf()
            const maxTime = moment(this.currentTime).add(1, 'years').valueOf()
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.currentTime = minDate.getTime()
          if (maxDate) {
            this.currentTime = ''
          }
        }
      },
      currentTime: '',
      visible: false,
      tableData: [],
      followWechatStatus: [
        { label: '已加', value: 1, background: '#E6F7EA', color: '#00B42A', icon: 'audit_success' },
        { label: '未加', value: 0, background: '#F5F5F5', color: '#777777', icon: 'liveClose' }
      ],
      followPrivateWechatStatus: [
        { label: '已加', value: 1, background: 'transparent', color: '#00B42A', icon: '个微已加' },
        { label: '未加', value: 0, background: 'transparent', color: '#777777', icon: '个微未加' }
      ],
      columns: [
        { width: '150px', prop: 'userName', label: '学员姓名', type: 'text', visible: true, disable: true },
        { width: '150px', prop: 'remark', label: '微信备注名', type: 'text', visible: true },
        { width: '150px', prop: 'phone', label: '学员电话', type: 'phone', visible: true, copy: true },
        { width: '150px', prop: 'isAddQw', label: '添加跟进人企微', type: 'slot', visible: true },
        { width: '150px', prop: 'isAddGw', label: '添加跟进人个微', type: 'slot', visible: true },
        { width: '150px', prop: 'isSubscribe', label: '关注公众号', type: 'slot', visible: true },
        { width: '200px', prop: 'lastFollowTime', label: '最近跟进时间', type: 'text', visible: true },
        { width: '200px', prop: 'lastFollowRecordType', label: '跟进状态', type: 'text', visible: true, slotFn: (row) => getOptionsValue(row.lastFollowRecordType, followStatus) },
        { width: '200px', prop: 'lastFollowRecordContent', label: '最近跟进记录', type: 'text', visible: true },
        { width: '200px', prop: 'externalUserTags', label: '企微标签', type: 'slot', visible: true },
        { width: '200px', prop: 'teacherNames', label: 'IP老师', type: 'text', visible: true },
        { width: '150px', prop: 'followUserName', label: '跟进人', type: 'text', visible: true },
        { width: '150px', prop: 'clueType', label: '线索类型', type: 'text', render: (row) => { return getOptionsValue(row.clueType, clueTypeStatus) }, visible: true },
        { width: '150px', prop: 'clueContent', label: '线索内容', type: 'text', visible: true },
        { width: '200px', prop: 'createTime', label: '分配时间', type: 'text', visible: true },
        { width: '200px', prop: 'firstFollowTime', label: '首次跟进时间', type: 'text', visible: true }
      ],
      followUserId: '',
      form: {
        phone: '',
        createTime: ['', '']
      }
    }
  },
  methods: {
    getOptionsValueByKey,
    open(row, params) {
      this.visible = true
      this.followUserId = row.followUserId
      this.$nextTick(() => {
        this.$refs.table.onRefresh(params)
      })
    },
    clear() {
      this.form = {
        phone: '',
        createTime: ['', '']
      }
    },
    search() {
      this.$refs.table.onRefresh()
    },
    getList(params) {
      console.log(params, 'params')
      const taskId = this.$route.query.taskId
      return cluePageList({
        ...params,
        startCreateTime: this.form.createTime
          ? this.form.createTime[0]
          : '',
        endCreateTime: this.form.createTime ? this.form.createTime[1] : '',
        phone: this.form.phone || '',
        sysUserId: this.followUserId ? [this.followUserId] : [],
        taskId,
        liveId: undefined,
        userName: undefined
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container ::v-deep{
  padding: 0 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .filter-container{
    padding:0px;
  }
  .my-table{
    margin: 0 ;
  }
  .dialog-table{
    flex: 1;
  }
  .IconStatus {
    .isAddGwIconClass {
      width: 24px;
      height: 24px;
      font-size: 24px;
      margin-right: 4px;
    }
  }
}
</style>
