<template>
  <!-- 添加抽奖 -->
  <AppDialog
    v-model="visible"
    title="添加抽奖"
    width="696px"
    :loading="loading"
    height="auto"
    :top="top"
    @success="sure"
  >
    <div class="addLottery overflowOuto">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="auto"
        size="small"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item label="抽奖名称" prop="prizeDrawName">
          <el-input
            ref="userInput"
            v-model.trim="form.prizeDrawName"
            style="width: 450px"
            clearable
            placeholder="请输入"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="参与条件" prop="participationCondition">
          <el-radio-group
            v-model="form.participationCondition"
            @change="participationConditionChange"
          >
            <el-radio :label="1">用户在线</el-radio>
            <!-- <el-radio :label="2">参与任意评论</el-radio> -->
            <el-radio :label="3">参与指定评论</el-radio>
          </el-radio-group>

          <el-input
            v-if="form.participationCondition === 3"
            v-model.trim="form.assignedComment"
            placeholder="点击输入指定的评论"
            class="m-t-10"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="奖品设置" prop="prizeDetail">
          <el-button type="primary" @click="addLottery">添加奖品</el-button>
          <div class="tips">
            <div>1.拖拽奖品列表可调整奖品在直播间的展示顺序；</div>
            <div>2.一轮抽奖最多可设置5种奖品，每种奖品最多设置200份；</div>
          </div>
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
            <el-table-column prop="sort" width="32" />
            <el-table-column prop="goodsName" label="奖品" min-width="184" />
            <el-table-column prop="prizeType" label="类型" width="72">
              <template slot-scope="{ row }">
                {{
                  { 1: '虚拟商品', 2: '实物商品', 3: '优惠券' }[row.prizeType]
                }}
              </template>
            </el-table-column>
            <el-table-column prop="prizeName" label="奖品名称" width="130">
              <template slot-scope="{ row }">
                <el-input
                  v-model.trim="row.prizeName"
                  placeholder="例如：一等奖"
                  maxlength="6"
                />
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="份数" width="74">
              <template slot-scope="{ row }">
                <el-input
                  v-model.trim="row.amount"
                  @input="e => delNumber(e, row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="" width="50" align="center">
              <template slot-scope="{ row }">
                <i
                  class="el-icon-delete cursorPoninter"
                  style="color: #0c6fff; font-size: 14px"
                  @click="onhandleDel(row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="规则设置" prop="showParticipantsAmount">
          <el-checkbox
            v-model="form.showParticipantsAmount"
            :true-label="1"
            :false-label="0"
          >用户端将展示抽奖参与人数</el-checkbox>
        </el-form-item>
        <el-form-item label="抽奖说明" prop="prizeInstructions">
          <el-input
            v-model.trim="form.prizeInstructions"
            type="textarea"
            maxlength="500"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </el-form-item>
      </el-form>
    </div>
    <selectGift :config="selectGiftConfig" @success="onhandleSelect" />
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import selectGift from './selectGift.vue'
import Sortable from 'sortablejs'
import { addPrize } from '@/api/liveRoom/setting.js'
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
      visible: true,
      liveRoomId: '',
      form: {
        prizeDrawName: '',
        assignedComment: '',
        participationCondition: 1,
        showParticipantsAmount: 0,
        prizeInstructions: '',
        prizeDetail: []
      },
      rules: {
        prizeDrawName: [
          { required: true, message: '请输入抽奖名称', trigger: 'blur' }
        ],
        participationCondition: [
          {
            required: true,
            validator: validateParticipationCondition,
            trigger: 'blur'
          }
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
  mounted() {
    this.top = Math.abs(window.innerHeight - 644) / 2 + 'px'
    this.$nextTick(() => {
      this.rowDrop()
    })
  },
  methods: {
    // 限制只能输入数字
    delNumber(e, row) {
      if (Number(e) > 200) {
        row.amount = 200
        return
      }
      row.amount = e.replace(/[^0-9]/g, '')
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // alert('submit!');
          console.log('提交')
          this.addPrize()
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
      const index = this.form.prizeDetail.findIndex(
        v => v.giveawayId === row.giveawayId
      )
      index > -1 && this.form.prizeDetail.splice(index, 1)
      this.form.prizeDetail.map((v, i) => {
        v.sort = i + 1
      })
    },
    participationConditionChange() {
      this.$refs.form && this.$refs.form.clearValidate('participationCondition')
    },
    // PPT行拖拽
    rowDrop() {
      const tbody = document.querySelector('.myLotteryTable tbody')
      const _this = this
      this.sortable && this.sortable.destroy()
      if (tbody) {
        _this.sortable = Sortable.create(tbody, {
          async onEnd({ newIndex, oldIndex }) {
            console.log(newIndex, oldIndex)
            if (newIndex === oldIndex) {
              return
            }
            const currRowdom = tbody.children[newIndex]
            const oldRowdom = tbody.children[oldIndex]
            tbody.removeChild(currRowdom)
            if (newIndex > oldIndex) {
              tbody.insertBefore(currRowdom, oldRowdom)
            } else {
              tbody.insertBefore(currRowdom, oldRowdom.nextSibling)
            }
            const currRow = _this.form.prizeDetail.splice(oldIndex, 1)[0]
            _this.form.prizeDetail.splice(newIndex, 0, currRow)
            _this.form.prizeDetail.map((v, i) => {
              v.sort = i + 1
            })
          }
        })
      }
    },
    onhandleSelect(row) {
      row.map((v, i) => {
        v.sort = i + 1
      })
      this.form.prizeDetail = row
      this.$nextTick(() => {
        this.rowDrop()
      })
      this.selectGiftConfig.visible = false
      // this.form.
    },
    addPrize() {
      const data = {
        ...this.form,
        liveRoomId: this.liveRoomId
      }
      addPrize(data)
        .then(res => {
          this.$notify({ title: '提示', message: '操作成功' })
          this.loading = false
          this.visible = false
          this.success && this.success()
        })
        .catch(() => {
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
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbcfd3;
  font-size: 12px;
  overflow: hidden;
}
::v-deep {
  .el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: #000000;
  }
  .el-form-item__content {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #777777;
  }
}
</style>
