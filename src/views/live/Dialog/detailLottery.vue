<template>
  <!-- 添加抽奖 -->
  <AppDialog
    v-model="visible"
    title="抽奖详情"
    width="696px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addLottery overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <el-form-item label="抽奖名称" prop="prizeDrawName">
          {{ form.prizeDrawName }}
        </el-form-item>
        <el-form-item label="参与条件" prop="participationCondition">
          <span>{{ {1: '用户在线', 2: '参与任意评论', 3: '参与指定评论'}[form.participationCondition] }}</span>
          <el-input v-if="form.participationCondition === 3" v-model.trim="form.assignedComment" disabled placeholder="点击输入指定的评论" class="m-t-10" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="奖品设置" prop="prizeDetail">
          <el-table
            v-if="form.prizeDetail.length > 0"
            ref="elTable"
            class="myLotteryTable m-t-10"
            style="width: 547px"
            border
            :data="form.prizeDetail"
            cell-class-name="cursorMove"
            :header-cell-style="{ background: '#F3F3F3' }"
          >
            <el-table-column type="index" width="32" />
            <el-table-column prop="goodsName" label="奖品" min-width="184" />
            <el-table-column prop="prizeType" label="类型" width="72">
              <template slot-scope="{row}">
                {{ {1: '虚拟商品', 2: '实物商品', 3:'优惠券'}[row.prizeType] }}
              </template>
            </el-table-column>
            <el-table-column prop="prizeName" label="奖品名称" width="130" />
            <el-table-column prop="amount" label="份数" width="74" />
          </el-table>
        </el-form-item>
        <el-form-item label="规则设置" prop="showParticipantsAmount">
          <el-checkbox v-model="form.showParticipantsAmount" disabled>用户端将展示抽奖参与人数</el-checkbox>
        </el-form-item>
        <el-form-item label="抽奖说明" prop="prizeInstructions">
          {{ form.prizeInstructions }}
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" />
    <selectGift :config="selectGiftConfig" @success="onhandleSelect" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import selectGift from './selectGift.vue'
import Sortable from 'sortablejs'
import { editPrize, getPrizeDetail } from '@/api/liveRoom/setting.js'
export default {
  components: {
    AppDialog,
    selectGift
  },
  data() {
    var validateParticipationCondition = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择参与条件'))
      } else if (value === 3 && this.form.assignedComment === '') {
        return callback(new Error('请输入指定评论'))
      } else {
        return callback()
      }
    }
    var validatePrizeDetail = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请添加奖品'))
      } else {
        const arr = value.reduce((pre, next) => {
          (next.prizeName === '' || !Number(next.amount)) && pre.push(next)
          return pre
        }, [])
        if (arr.length > 0) {
          return callback('请输入奖品名称或份数')
        } else {
          return callback()
        }
      }
    }
    return {
      loading: false,
      visible: false,
      liveRoomId: '',
      prizeDrawId: '',
      form: {
        prizeDrawName: '',
        assignedComment: '',
        participationCondition: 1,
        showParticipantsAmount: false,
        prizeDetail: []
      },
      rules: {
        prizeDrawName: [
          { required: true, message: '请输入抽奖名称', trigger: 'blur' }
        ],
        participationCondition: [
          { required: true, validator: validateParticipationCondition, trigger: 'blur' }
        ],
        prizeDetail: [
          { required: true, trigger: 'change', validator: validatePrizeDetail }
        ]
      },
      selectGiftConfig: {
        visible: false,
        checks: []
      },
      top: '114px',
      sortable: null
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getDetail()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
  },
  methods: {
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // alert('submit!');
          console.log('提交')
          this.editPrize()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addLottery() {
      this.form.prizeDetail = this.form.prizeDetail.sort((a, b) => {
        return a.sort - b.sort
      })
      this.selectGiftConfig.checks = this.form.prizeDetail
      this.selectGiftConfig.visible = true
    },
    onhandleDel(row) {
      console.log('删除', row)
      const index = this.form.prizeDetail.findIndex(v => v.giveawayId === row.giveawayId)
      index > -1 && this.form.prizeDetail.splice(index, 1)
    },
    participationConditionChange() {
      this.$refs.form && this.$refs.form.clearValidate('participationCondition')
    },
    // PPT行拖拽
    rowDrop() {
      const tbody = document.querySelector('.myLotteryTable tbody')
      const _this = this
      const tableIds = JSON.parse(JSON.stringify(_this.form.prizeDetail))
      this.sortable && this.sortable.destroy()
      if (tbody) {
        _this.sortable = Sortable.create(tbody, {
          animation: 300,
          async onEnd({ newIndex, oldIndex }) {
            console.log('123')
            const currRow = tableIds.splice(oldIndex, 1)[0]
            tableIds.splice(newIndex, 0, currRow)
            tableIds.map((i, index) => {
              const ins = _this.form.prizeDetail.findIndex(v => v.giveawayId === i.giveawayId)
              _this.form.prizeDetail[ins].sort = index + 1
              return
            })
          }
        })
      }
    },
    onhandleSelect(row) {
      row.map((v, i) => { v.sort = i + 1 })
      this.form.prizeDetail = row
      this.$nextTick(() => {
        this.rowDrop()
      })
      this.selectGiftConfig.visible = false
      // this.form.
    },
    editPrize() {
      const data = {
        ...this.form,
        prizeDrawId: this.prizeDrawId,
        liveRoomId: this.liveRoomId
      }
      editPrize(data).then(res => {
        this.$notify({ title: '提示', message: '操作成功' })
        this.loading = false
        this.visible = false
        this.success && this.success()
      }).catch(() => {
        this.loading = false
      })
    },
    getDetail() {
      this.loading = true
      const data = {
        prizeDrawId: this.prizeDrawId
      }
      getPrizeDetail(data).then(res => {
        console.log(res)
        this.form = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.addLottery {
  max-height: 516px;
  padding: 20px 34px;
}
.tips {
  margin-top: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 17px;
}
.myLotteryTable {
  width: 100%;
  background: #FFFFFF;
  border-radius: 6px;
  border: 1px solid #CBCFD3;
  font-size: 12px;
  overflow: hidden;
}
</style>
