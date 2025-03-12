<template>
  <div class="console">
    <!-- 中控台设置 -->
    <div class="mb-20">
      <MTitle class="mb-10">直播设置</MTitle>
      <div class="change-type">
        <div
          v-for="item in settingTabs"
          :key="item.type"
          :class="{ active: settingType === item.type }"
          @click="changeType(item.type)"
        >
          {{ item.name }}
        </div>
      </div>
      <div v-if="settingType === 'PERSON_LIVE'">
        <el-form ref="realRef" label-width="140px">
          <el-form-item
            v-for="(item, key) in realPeople"
            :key="key"
            :label="item.name"
          >
            <template v-if="item.type === 'switch'">
              <el-switch
                v-if="item.type === 'switch'"
                v-model="realForm[item.key]"
                @change="settingSet(1)"
              />
            </template>
            <template v-if="item.type === 'checkbox'">
              <el-checkbox-group
                v-model="realForm[item.key]"
                class="inline-block"
              >
                <el-checkbox
                  v-for="(check, index) in item.checkChild"
                  :key="index"
                  :label="check.value"
                  @change="settingSet(1)"
                >
                  {{ check.name }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <span v-if="item.desc" class="desc">{{ item.desc }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="settingType === 'AI_LIVE'">
        <el-form ref="virtualRef" label-width="140px">
          <el-form-item
            v-for="(item, key) in virtualPeople"
            :key="key"
            :label="item.name"
          >
            <template v-if="item.type === 'switch'">
              <el-switch
                v-if="item.type === 'switch'"
                v-model="virtualForm[item.key]"
                @change="settingSet(2)"
              />
            </template>
            <template v-if="item.type === 'checkbox'">
              <el-checkbox-group
                v-model="virtualForm[item.key]"
                class="inline-block"
              >
                <el-checkbox
                  v-for="(check, index) in item.checkChild"
                  :key="index"
                  :label="check.value"
                  @change="settingSet(2)"
                >
                  {{ check.name }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <span v-if="item.desc" class="desc">{{ item.desc }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div>
      <MTitle class="mb-10">
        追单通知
        <span class="desc">
          是指在直播间下单，对“未支付”或“支付超时”学员，根据设定规则通过系统自动给助教发送追单消息，发送方式在直播中控台或助教企微
        </span>
      </MTitle>
      <el-form ref="noticeRef" label-width="140px">
        <el-form-item label="1）购买记录：">
          <div class="txt">
            当某一学员存在“未支付”或“超时已关闭”的订单，在“下单时间”后
            <el-input-number
              v-model="noticeForm.noticeIntervalTime"
              size="small"
              @change="noticeSet"
            />
            分钟， 给对应的助教发送追单消息，最多发3次；
          </div>
        </el-form-item>
        <el-form-item label="2）通知方式：">
          <div class="txt">
            <el-checkbox-group
              v-model="noticeForm.noticeType"
              class="inline-block"
            >
              <el-checkbox label="1" @change="noticeSet">
                直播间消息通知
              </el-checkbox>
              <el-checkbox label="2" @change="noticeSet">企微通知</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="3） 通知内容：">
          <div class="txt">
            【追单消息提醒】您好，当前与您有关的直播中产生一笔新的学员订单未支付或超时已关闭，订单信息如下：
            直播间ID、学员在直播间的昵称、学员手机号、订单号、商品名称、订单金额；
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { debounce } from '@/utils'
import {
  getDefaultConfigApi,
  upfDefaultConfigApi,
  getNoticeConfigApi,
  upfNoticeConfigApi
} from '@/api/liveRoom/setting.js'
export default {
  data() {
    return {
      settingTabs: [
        { name: '数字直播', type: 'AI_LIVE' },
        { name: '真人直播', type: 'PERSON_LIVE' }
      ],
      settingType: 'AI_LIVE',
      virtualPeople: [
        {
          key: 'showShoppingCart',
          name: '显示购物车',
          type: 'switch'
        },
        {
          key: 'showLikes',
          name: '显示点赞',
          type: 'switch'
        },
        {
          key: 'showStudentMessage',
          name: '显示学员进出消息',
          type: 'switch',
          desc: '关闭，指运营人员和C端用户均不可见；开启，仅运营人员可见；'
        },
        {
          key: 'muteAll',
          name: '全员禁言',
          type: 'switch'
        },
        {
          key: 'allowConnect',
          name: '允许连麦',
          type: 'switch',
          desc: '开启，C端用户仅限功能展示；'
        },
        {
          key: 'selfHideMessage',
          name: '自嗨消息可见',
          type: 'checkbox',
          checkChild: [
            { name: '助教可见', value: '1' },
            { name: '主持人可见', value: '2' }
          ]
        }
      ],
      virtualForm: {
        showShoppingCart: false,
        showLikes: false,
        showStudentMessage: false,
        muteAll: false,
        allowConnect: false,
        selfHideMessage: []
      },
      realPeople: [
        {
          key: 'showShoppingCart',
          name: '显示购物车',
          type: 'switch'
        },
        {
          key: 'showLikes',
          name: '显示点赞',
          type: 'switch'
        },
        {
          key: 'showStudentMessage',
          name: '显示学员进出消息',
          type: 'switch',
          desc: '关闭，指运营人员和C端用户均不可见；开启，仅运营人员可见；'
        },
        {
          key: 'muteAll',
          name: '全员禁言',
          type: 'switch'
        },
        {
          key: 'selfHideMessage',
          name: '自嗨消息可见',
          type: 'checkbox',
          checkChild: [
            { name: '助教可见', value: '1' },
            { name: '主持人可见', value: '2' }
          ]
        }
      ],
      realForm: {
        showShoppingCart: false,
        showLikes: false,
        showStudentMessage: false,
        muteAll: false,
        allowConnect: false,
        selfHideMessage: []
      },

      // 追单通知
      noticeForm: {
        noticeIntervalTime: 5,
        noticeType: [],
        noticeContent: '' // 暂时固定 不用传递
      },
      noticeSet: null,
      settingSet: null
    }
  },
  created() {
    this.init()
    this.noticeSet = debounce(this.updNotice, 300)
    this.settingSet = debounce(this.updSetting, 300)
  },
  methods: {
    init() {
      const that = this
      Promise.all([
        getDefaultConfigApi({ liveModel: 'AI_LIVE' }),
        getDefaultConfigApi({ liveModel: 'PERSON_LIVE' }),
        getNoticeConfigApi()
      ])
        .then(responses => {
          if (responses[0].success) {
            responses[0].data.selfHideMessage = this.selfHideMessageTransfer(
              responses[0].data.selfHideMessage
            )
            this.virtualForm = responses[0].data
          }
          if (responses[1].success) {
            responses[1].data.selfHideMessage = this.selfHideMessageTransfer(
              responses[1].data.selfHideMessage
            )
            this.realForm = responses[1].data
          }
          if (responses[2].success) {
            const noticeType = responses[2].data.noticeType
            if (noticeType) {
              responses[2].data.noticeType = noticeType.split(',')
            } else {
              responses[2].data.noticeType = []
            }
            this.noticeForm = responses[2].data
          }
        })
        .catch(error => {
          // 处理错误
          that.$message.error('获取直播设置、通知数据失败')
          console.log('中控台---error', error)
        })
    },
    selfHideMessageTransfer(selfHideMessage, type) {
      if (type) {
        return {
          assistant: selfHideMessage.includes('1'),
          host: selfHideMessage.includes('2')
        }
      } else {
        const arr = []
        if (selfHideMessage.assistant) arr.push('1')
        if (selfHideMessage.host) arr.push('2')
        return arr
      }
    },
    changeType(type) {
      this.settingType = type
    },
    updNotice() {
      const parmes = cloneDeep(this.noticeForm)
      parmes.noticeType = parmes.noticeType.join(',')
      upfNoticeConfigApi(parmes).then(res => {
        if (res.success) {
          this.$notify.success({ title: '提示', message: '操作成功' })
        }
      })
    },
    updSetting() {
      const parmes = cloneDeep(
        this[this.settingType === 'PERSON_LIVE' ? 'realForm' : 'virtualForm']
      )
      parmes.selfHideMessage = this.selfHideMessageTransfer(
        parmes.selfHideMessage,
        true
      )
      parmes.type = this.settingType
      upfDefaultConfigApi(parmes).then(res => {
        if (res.success) {
          this.$notify.success({ title: '提示', message: '操作成功' })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.console {
  padding: 0 20px 20px 20px;
  overflow-y: auto;
  .desc {
    font-size: 14px;
    color: #999;
    font-weight: 450;
    padding-left: 10px;
  }
  .inline-block {
    display: inline-block;
  }
  .red {
    color: red;
  }
  .txt {
    color: #606266;
    font-size: 14px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .mb-10 {
    margin-bottom: 10px;
  }

  .change-type {
    display: inline-block;
    padding: 0 4px;
    border-radius: 4px;
    background: #f0f0f0;
    padding: 3px;
    cursor: pointer;
    user-select: none;
    margin-bottom: 8px;
    div {
      display: inline-block;
      min-width: 117px;
      text-align: center;
      color: #000;
      font-size: 14px !important;
    }
    .active {
      padding-top: 2px;
      height: 26px;
      border-radius: 4px;
      color: #0c6fff;
      background: #fff;
    }
  }
}

::v-deep {
  .el-form-item {
    margin-bottom: 10px;
    .el-form--label-top .el-form-item__label {
      padding: 0;
    }
  }
}
</style>
