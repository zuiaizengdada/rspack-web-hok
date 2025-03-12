<template>
  <div class="hotlive">
    <!-- 加热直播间配置 -->
    <div class="searchTop">
      <div>
        <span class="m-r-10 formLabel">选择机构</span>
        <el-select v-model="search.tenantId" size="small" placeholder="请选择" filterable @change="getDetail">
          <el-option v-for="item in orgOption" :key="item.organizationId" :label="item.name" :value="item.organizationId" />
        </el-select>
      </div>
      <div>
        <el-button size="small" type="primary" @click="onclickWarn">预警操作</el-button>
        <el-button size="small" type="primary" @click="onhandleOpenMsg">消息通知设置</el-button>
      </div>
    </div>
    <div class="myTable">
      <el-table ref="myTable" :data="tableData" style="width: 100%" :header-cell-style="{ background: '#f5f5f5' }">
        <el-table-column prop="heatType" label="加热类型" fixed width="180px">
          <template slot-scope="{ row }">
            {{ row.heatType | getOptionsValue(heatType) }}
          </template>
        </el-table-column>
        <el-table-column prop="actionDesc" label="用户动作" width="200px">
          <template slot-scope="{ row }">
            {{ row.actionDesc }}
          </template>
        </el-table-column>
        <el-table-column prop="triggerConditionDesc" label="触发条件" width="300px">
          <template slot-scope="{ row }">
            <div style="min-height: 50px" v-html="row.triggerConditionDesc" />
          </template>
        </el-table-column>
        <el-table-column prop="triggerActionDesc" label="触发时执行动作" width="280px">
          <template slot-scope="{ row }">
            {{ row.triggerActionDesc }}
          </template>
        </el-table-column>
        <el-table-column prop="heatNumDesc" label="用户个数" min-width="200px">
          <template slot-scope="{ row }">
            <template>{{ row.heatNumDesc }}</template>
          </template>
        </el-table-column>
        <el-table-column prop="onceTriggerTimeWindow" label="时间最大值（秒）" min-width="140px">
          <template slot-scope="{ row }">
            <template v-if="row.code === 'ask_questions'">——</template>
            <template v-else-if="!ifEdit">{{ row.onceTriggerTimeWindow }}</template>
            <template v-else>
              <el-input-number v-model="row.onceTriggerTimeWindow" style="width: 100%" :min="3" :max="60" controls-position="right" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="startNum" label="邀约用户启动次数" min-width="140px">
          <template slot-scope="{ row }">
            <template v-if="row.code === 'ask_questions'">——</template>
            <template v-else-if="!ifEdit">{{ row.startNum }}</template>
            <template v-else>
              <el-input-number v-model="row.startNum" style="width: 100%" :min="1" :max="20" controls-position="right" @input="(e) => delNumber(e, row, 'startNum')" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="频次（同一人发几次）" min-width="180px">
          <template slot-scope="{ row }">
            <template v-if="!ifEdit">{{ row.frequency }}次</template>
            <template v-else>
              <el-input-number v-model="row.frequency" style="width: 100%" :min="getMin(row)" :max="getMax(row)" controls-position="right" @input="(e) => delNumber(e, row, 'frequency')" />
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="权重值" min-width="200px">
          <template slot-scope="{ row }">
            <template v-if="!ifEdit">{{ row.weight[0] }}% - {{ row.weight[1] }}%</template>
            <template v-else>
              <el-input v-model="row.weight[0]" style="width: 60px" :class="row.check === 1 ? 'isError' : ''" @input="(e) => delNumberweight0(e, row)" />
              <span class="m-l-10 m-r-10">-</span>
              <el-input v-model="row.weight[1]" style="width: 60px" :class="row.check === 2 ? 'isError' : ''" @input="(e) => delNumberweight1(e, row)" />
              <span class="m-l-10">%</span>
              <div v-if="row.check" class="errTips">{{ row.errTis }}</div>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="m-t-20">
        <el-button v-if="!ifEdit" :loading="loading" size="small" class="primary" @click="onEdit">编辑</el-button>
        <el-button v-if="ifEdit" :loading="loading" size="small" type="primary" @click="onSave">保存</el-button>
        <el-button v-if="ifEdit" :loading="loading" size="small" @click="onCancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getOptionsValueByKey } from '@/filters/index.js'
import Dialog from '@/views/live/Dialog/index.js'
import { getHeatConfigList, saveHeatConfig } from '@/api/liveRoom/courseware.js'
import { getOrgList } from '@/api/liveRoom/setting.js'
export default {
  components: {},
  data() {
    return {
      heatType: [
        { value: 1, label: '加热人气', icon: '' },
        { value: 2, label: '加热订单', icon: '' }
      ],
      triggerConditionDescArr: [
        { des: '当有邀约用户发送时1或送花或666', ifN: false, N: '' },
        { des: '邀约用户发送次数N次以上', ifN: true, N: '' },
        { des: '当遇到某个时间为【敲重点】', ifN: false, N: '' },
        { des: '邀约用户发送过N次以上', ifN: true, N: '' },
        { des: '当遇到某个时间点为【提问题】', ifN: false, N: '' },
        { des: '邀约用户回答发送N次以上', ifN: true, N: '' },
        { des: '每次发送签到组件。', ifN: false, N: '' },
        { des: '签到组件正在弹窗中。', ifN: false, N: '' },
        { des: '邀约用户点击签到组件N次以上', ifN: true, N: '' },
        { des: '每次点赞开关打开时', ifN: false, N: '' },
        { des: '邀约用户总点赞数>N以上', ifN: true, N: '' },
        { des: '每次发送优惠券推送时', ifN: false, N: '' },
        { des: '优惠券为可领取状态', ifN: false, N: '' },
        { des: '邀约用户领取优惠券>N以上', ifN: true, N: '' },
        { des: '有商品推送时或购物车商品上架时。', ifN: false, N: '' }
      ],
      actionDesc: [
        { key: '1', value: '发评论' },
        { key: '2', value: '点击【签到】按钮' },
        { key: '3', value: '点击【点赞】按钮' },
        { key: '4', value: '领取优惠券' },
        { key: '5', value: '用户下单' }
      ],
      triggerActionDesc: [
        { key: '1', value: '发送1或送花、666' },
        { key: '2', value: '发送AI推荐的语义相近的2个词。' },
        { key: '3', value: '发送AI推荐的相关答案' },
        { key: '4', value: '已签到' },
        { key: '5', value: '点赞数+1' },
        { key: '6', value: '已领取优惠券' },
        { key: '7', value: '正在购买中，同时创建订单' }
      ],
      heatNumDesc: [
        { key: '1', value: '当前加热人数*权重' }
      ],
      tableData: [
        // { heatType: 1, actionDesc: '发评论', triggerConditionDesc: '', triggerActionDesc: '当前加热人数*权重', heatNumDesc: '', onceTriggerTimeWindow: '', startNum: '', frequency: '', weight: ['', ''] },
        // { heatType: 1, actionDesc: '发评论', triggerConditionDesc: '', triggerActionDesc: '当前加热人数*权重', heatNumDesc: '', onceTriggerTimeWindow: '', startNum: '', frequency: '', weight: ['', ''] },
        // { heatType: 1, actionDesc: '发评论', triggerConditionDesc: '', triggerActionDesc: '当前加热人数*权重', heatNumDesc: '', onceTriggerTimeWindow: '', startNum: '', frequency: '', weight: ['', ''] },
        { heatType: 2, actionDesc: '点击【签到】按钮', triggerConditionDesc: '', triggerActionDesc: '当前加热人数*权重', heatNumDesc: '', onceTriggerTimeWindow: '', startNum: '', frequency: '', weight: ['', ''] },
        { heatType: 1, actionDesc: '点击【点赞】按钮', triggerConditionDesc: '', triggerActionDesc: '当前加热人数*权重', heatNumDesc: '', onceTriggerTimeWindow: '', startNum: '', frequency: '', weight: ['', ''] }
        // { heatType: 1, actionDesc: '领取优惠券', triggerConditionDesc: '', triggerActionDesc: '当前加热人数*权重', heatNumDesc: '', onceTriggerTimeWindow: '', startNum: '', frequency: '', weight: ['', ''] }
        // { heatType: 1, actionDesc: '用户下单', triggerConditionDesc: '', triggerActionDesc: '当前加热人数*权重', heatNumDesc: '', onceTriggerTimeWindow: '', startNum: '', frequency: '', weight: ['', ''] }
      ],
      tableDataDefault: [],
      search: {
        orgName: '',
        tenantId: ''
      },
      loading: false,
      orgOption: [],
      ifEdit: false
    }
  },
  mounted() {
    this.loading = true
    this.getOrgList().then((res) => {
      if (res.data.length > 0) {
        this.search.tenantId = res.data[0].organizationId
      }
      this.getDetail()
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    onhandleOpenMsg() {
      Dialog.open({
        visible: true,
        type: 'MsgSetting',
        title: '预警操作'
      })
    },
    getMin(row) {
      // 签到提问题领优惠券1次
      // 点赞最小1次
      // 其他最小0次
      if (['ask_questions', 'sign', 'coupon', 'like'].includes(row.code)) {
        return 1
      } else {
        return 0
      }
    },
    // 签到提问题领优惠券1次
    // 点赞最大100次
    // 其他最大5次
    getMax(row) {
      if (['ask_questions', 'sign', 'coupon'].includes(row.code)) {
        return 1
      } else if (['like'].includes(row.code)) {
        return 100
      } else {
        return 5
      }
    },
    // 获取机构列表
    getOrgList() {
      return getOrgList().then(res => {
        this.orgOption = res.data
        return res
      })
    },
    // 限制只能输入数字
    delNumber(e, row, key) {
      // row[key] = String(e).replace(/[^0-9]/g, '')
      if (key === 'startNum') {
        // 邀约用户启动次数0-20
        row[key] > 20 && (row[key] = 20)
      } else if (key === 'frequency') {
        row[key] > 100 && (row[key] = 100)
        row[key] < 1 && (row[key] = 1)
      }
    },
    delNumberweight0(e, row) {
      row.weight[0] = e.replace(/[^0-9]/g, '')
      row.weight[0] > 100 && (row.weight[0] = 100)
      if (row.weight[0] === '') {
        row.check = 1
        row.errTis = '请输入最小值'
        return
      }
      if (Number(row.weight[0]) > Number(row.weight[1])) {
        row.check = 1
        row.errTis = '最小值要小于最大值'
      } else {
        row.check = 0
        row.errTis = ''
      }
    },
    delNumberweight1(e, row) {
      row.weight[1] = e.replace(/[^0-9]/g, '')
      row.weight[1] > 100 && (row.weight[1] = 100)
      if (row.weight[1] === '') {
        row.check = 2
        row.errTis = '请输入最大值'
        return
      }
      if (Number(row.weight[1]) < Number(row.weight[0])) {
        row.check = 2
        row.errTis = '最大值要大于最大值'
      } else {
        row.check = 0
        row.errTis = ''
      }
    },
    onchange(res, index, row) {
      const ifN = getOptionsValueByKey('des', 'ifN', res, this.triggerConditionDescArr)
      console.log(ifN)
      row.ifN = ifN
    },
    addTriggerConditions(i, row) {
      row.triggerConditionDesc.push({ des: '', ifN: false, N: '' })
    },
    delTriggerConditions(i, row) {
      row.triggerConditionDesc.splice(i, 1)
    },
    // 点击编辑
    onEdit() {
      this.tableDataDefault = JSON.parse(JSON.stringify(this.tableData))
      this.ifEdit = true
    },
    // 校验权重
    checkSave() {
      let check = true
      this.tableData.map(v => {
        if (v.weight[0] === '') {
          v.check = 1
          v.errTis = '请输入最小值'
          check = false
        }
        if (v.weight[1] === '') {
          v.check = 2
          v.errTis = '请输入最大值'
          check = false
        }
        if (Number(v.weight[0]) > Number(v.weight[1])) {
          v.check = 1
          v.errTis = '最小值要小于最大值'
          check = false
        }
        if (Number(v.weight[1]) < Number(v.weight[0])) {
          console.log(v.weight[1], v.weight[0])
          v.check = 2
          v.errTis = '最大值要大于最小值'
          check = false
        }
      })
      return check
    },
    // 点击保存
    onSave() {
      if (!this.checkSave()) {
        this.$message.error('请检查配置项是否填写正确')
        return
      }
      const data = this.tableData.reduce((pre, next) => {
        pre.push({
          'frequency': next.frequency,
          'heatConfigCode': next.code,
          'onceTriggerTimeWindow': next.onceTriggerTimeWindow,
          'startNum': next.startNum,
          'tenantId': next.tenantId,
          'weightMax': next.weight[1],
          'weightMin': next.weight[0]
        })
        return pre
      }, [])
      this.loading = true
      saveHeatConfig(data).then(() => {
        // this.loading = false
        this.ifEdit = false
        this.getDetail()
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击取消
    onCancel() {
      this.tableData = this.tableDataDefault
      this.tableDataDefault = []
      this.ifEdit = false
    },
    // 点击预警操作
    onclickWarn() {
      Dialog.open({
        visible: true,
        type: 'WarningOperation',
        title: '预警操作'
      })
    },
    // 获取详情
    getDetail() {
      this.loading = true
      const data = {
        tenantId: this.search.tenantId
      }
      getHeatConfigList(data).then(res => {
        console.log(res)
        res.data.map(v => {
          v.triggerConditionDesc = v.triggerConditionDesc.replace(/\n/g, '<br />')
          v.weight = [v.weightMin, v.weightMax]
          v.check = 0
          v.errTis = ''
        })
        this.tableData = res.data
        this.$refs.myTable && this.$refs.myTable.doLayout()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.myTable {
  padding: 20px;
}
.hotlive {
  padding: 20px 0;
  .searchTop {
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .formLabel {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
  }
  .triggerConditionDescItem + .triggerConditionDescItem {
    margin-top: 10px;
  }
}
::v-deep {
  .isError {
    .el-input__inner {
      border: 1px solid #f56c6c;
    }
  }
}
.errTips {
  font-size: 12px;
  position: absolute;
  bottom: -4px;
  color: #f56c6c;
}
</style>
