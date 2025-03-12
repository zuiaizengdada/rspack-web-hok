<template>
  <div class="addView">
    <div class="tabView">
      <div v-for="(item) in navTab" :key="item.value" class="tabViewItem" :class="{active: active === item.value}" @click="onhandleTabChange(item)">
        {{ item.label }}
      </div>
    </div>
    <div class="contentView overflowOuto">
      <el-form ref="form" v-loading="loading" :model="form" label-width="auto" size="small" :rules="rules" @submit.native.prevent>
        <template v-if="active === 1">
          <el-form-item label="发送时间" prop="sendTime">
            <el-input
              ref="palyTime"
              v-model="form.sendTime"
              style="width: 245px"
              placeholder="请输入"
              @blur.stop="handleBlurPlayTime"
              @keyup.enter.native="handleBlurPlayTime"
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="msg.robots">
            <AppSelect
              :get-api-fn="getRobot"
              search-key="robotNickName"
              :popover-width="245"
              :props="{
                label: 'robotNickName',
                value: 'robotId'
              }"
              :value="form.msg.robots"
              :max-length="20"
              @selected="selectRobot"
            >
              <div slot-scope="{ row }" class="robotSelectLabel">
                <AppAvatar :avatar="row.robotHeadPic" :name="row.robotNickName" :width="26" :no-name="true" />
                <!-- <el-tag v-if="renderRoleInfo(row.robotId).role" size="mini" style="margin-left: 5px;" effect="dark">{{ renderRoleInfo(row.robotId).role }}</el-tag> -->
                <span v-if="renderRoleInfo(row.robotId).role" class="user_info_role">{{ renderRoleInfo(row.robotId).role }}</span>
                <span class="myLabel" :title="row['robotNickName']">{{ row['robotNickName'] }}</span>
              </div>
            </AppSelect>
            <el-select v-model="selectRobotNumber" placeholder="随机选人" style="width: 120px;float: right;" clearable @change="randomRobot">
              <el-option label="5位" :value="5" />
              <el-option label="10位" :value="10" />
              <el-option label="15位" :value="15" />
              <el-option label="20位" :value="20" />
            </el-select>
            <div v-if="form.msg.robots.length > 0" class="userViewBox">
              <el-tag v-for="(tag, index) in form.msg.robots" :key="tag.robotId" :disable-transitions="true" class="m-r-10 m-b-10" closable @close="delRobot(tag, index)">
                <!-- <el-tag v-if="renderRoleInfo(tag.robotId).type" :disable-transitions="true" size="mini" effect="dark">{{ renderRoleInfo(tag.robotId).role }}</el-tag> -->
                <span v-if="renderRoleInfo(tag.robotId).type" class="user_info_role">{{ renderRoleInfo(tag.robotId).role }}</span>
                {{ tag.robotNickName }}
              </el-tag>
              <div class="userViewBoxTips">
                {{ form.msg.robots.length }}/20
              </div>
            </div>
          </el-form-item>
          <el-form-item label="消息类型" prop="msg.msgType">
            <msgSelect v-model="form.msg.msgContent" :type.sync="form.msg.msgType" @onChange="onhandleTypeChange" />
          </el-form-item>
        </template>
        <template v-else-if="active === 2">
          <!-- <MTitle class="m-b-20">人数控制</MTitle> -->
          <el-form-item label="发送时间" prop="sendTime">
            <el-input
              ref="palyTime"
              v-model="form.sendTime"
              style="width: 245px"
              placeholder="请输入"
              @blur.stop="handleBlurPlayTime"
              @keyup.enter.native="handleBlurPlayTime"
            />
          </el-form-item>
          <el-form-item label="调整类型" prop="system.peopleNumberType">
            <el-radio-group v-model="form.system.peopleNumberType">
              <el-radio :label="1">增加</el-radio>
              <el-radio :label="2">减少</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="人数调整" prop="system.peopleNumber">
            <el-input v-model.trim="form.system.peopleNumber" style="width: 200px" placeholder="请输入" clearable @input="delNumber" />
          </el-form-item>
        </template>
        <template v-else-if="active === 3">
          <el-form-item label="发送时间" prop="sendTime">
            <el-input
              ref="palyTime"
              v-model="form.sendTime"
              style="width: 245px"
              placeholder="请输入"
              @blur.stop="handleBlurPlayTime"
              @keyup.enter.native="handleBlurPlayTime"
            />
          </el-form-item>
          <el-form-item label="选择商品" prop="goodsView.goodsId">
            <el-button v-if="!form.goodsView.goodsId" size="small" type="primary" @click="selectGoods">选择商品</el-button>
            <div v-else class="goodsList" @click="selectGoods">
              <img
                v-if="form.goodsView.goodsType === 5"
                class="m-r-10"
                style="width:100px; height: 75px;border-radius: 4px;background: #F5F7FA;object-fit: contain;"
                :src="form.goodsView.contentUrl ? form.goodsView.contentUrl.split(',')[0] : ''"
              />
              <img
                v-else
                class="m-r-10"
                style="width:100px; height: 75px;border-radius: 4px;background: #F5F7FA;object-fit: contain;"
                :src="form.goodsView.coverUrl"
              />
              <div class="goodsDetail">
                <div class="goodsName text_hidden_1">{{ form.goodsView.goodsName }}<el-tag v-if="form.goodsView.goodsSpecName" size="small">{{ form.goodsView.goodsSpecName }}</el-tag></div>
                <div class="goodsPrice">
                  <el-tag v-if="form.goodsView.goodsType === 5" size="small">线下课</el-tag>
                  <template v-else>
                    <unitPrice :price="form.goodsView.goodsPromotionPrice" />
                  </template>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="停留时间" prop="goodsView.stayTime">
            <el-input v-model.number="form.goodsView.stayTime" placeholder="请输入" style="width: 150px">
              <el-button slot="append">分钟</el-button>
            </el-input>
          </el-form-item>
        </template>
        <template v-else-if="active === 4">
          <el-form-item label="发送时间" prop="sendTime">
            <el-input ref="palyTime" v-model="form.sendTime" style="width: 245px" placeholder="请输入" @blur.stop="handleBlurPlayTime" @keyup.enter.native="handleBlurPlayTime" />
          </el-form-item>
          <el-form-item label="签到引导语" prop="signSetting.guide">
            <el-input v-model="form.signSetting.guide" type="textarea" style="width: 100%" placeholder="请输入" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="签到时长" prop="signSetting.stayTime">
            <div class="signList">
              <div v-for="(item, index) in signTimeOption" :key="index" :class="{active: form.signSetting.stayTime === item.value}" class="signItem" @click="onhandleSelectSignTime(item)">
                {{ item.label }}
              </div>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="footerBtn">
      <el-button v-if="scriptInteractId" size="small" class="btn_primary" :loading="loading" @click="openAdd">新增</el-button>
      <el-button size="small" type="primary" :loading="loading" @click="onhandleSave">保存</el-button>
      <el-button size="small" :loading="loading" @click="onhandleClear()">重置</el-button>
    </div>
  </div>
</template>

<script>
import msgSelect from './msgSelect.vue'
import moment from 'moment'
import AppSelect from '@/components/AppSelect/index2'
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import { getOptionsValueByKey } from '@/filters/index'
import { msgTypeOption, renderRoleInfo, signTimeOption } from '../../../columns'
import { addScriptInteract, editInteract, randomRobot } from '@/api/liveRoom/script'
import { queryRobot } from '@/api/liveRoom/robot'
import { mapState } from 'vuex'
import unitPrice from '@/views/live/liveList/component/price'
import axios from 'axios'
export default {
  components: {
    msgSelect,
    AppSelect,
    AppAvatar,
    unitPrice
  },
  props: {
    videoDetail: {
      type: Object,
      default: () => {
        return {
          duration: 1000000, // 总时长
          imgUrl: '' // 封面
        }
      }
    }
  },
  data() {
    var checkType = (rule, value, callback) => {
      if (this.active === 1 && value === '') {
        callback(new Error('请选择话述类型'))
      } else if (this.active === 1 && this.form.msg.msgContent === '') {
        const ErrorText = {
          1: '请输入内容',
          3: '请输入话述',
          2: '请输入内容',
          5: '请选择表情包',
          4: '请上传图片'
        }
        callback(new Error(ErrorText[value]))
      } else {
        callback()
      }
    }
    var checkPeopleNumber = (rule, value, callback) => {
      console.log(typeof value)
      if (value === '') {
        callback(new Error('请输入人数调整'))
      } else if (value === '0' || value === 0) {
        callback(new Error('人数调整不能为0'))
      } else {
        callback()
      }
    }
    var checkSendTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入发送时间'))
      } else if (value === '00:00:00') {
        return callback(new Error('发送时间不能为0秒'))
      } else {
        callback()
      }
    }
    return {
      navTab: [
        { label: '互动内容', value: 1 },
        { label: '人数控制', value: 2 },
        { label: '推送商品', value: 3 },
        { label: '签到设置', value: 4 }
      ],
      signTimeOption,
      active: 1,
      rules: {
        sendTime: [{ required: true, trigger: 'blur', validator: checkSendTime }],
        'msg.robots': [{ required: true, message: '请选择用户', trigger: 'blur' }],
        'msg.msgType': [{ required: true, validator: checkType, trigger: 'blur' }],
        'system.peopleNumberType': [{ required: true, message: '请选择调整类型', trigger: 'blur' }],
        'system.peopleNumber': [{ required: true, trigger: 'blur', validator: checkPeopleNumber }],
        'goodsView.stayTime': [
          { required: true, trigger: 'blur', message: '请输入停留时间' },
          { min: 1, max: 180, type: 'number', required: true, trigger: 'blur', message: '停留时间要大于1分钟小于180分钟' }
        ],
        'goodsView.goodsId': [
          { required: true, trigger: 'change', message: '请选择商品' }
        ],
        'signSetting.stayTime': [
          { required: true, trigger: 'change', message: '请选择签到时长' },
          { min: 0.5, type: 'number', required: true, trigger: 'blur', message: '请选择签到时长' }
        ]
      },
      form: {
        sendTime: '00:00:01', // 发送时间
        msg: {
          robots: [], // 选择用户(机器人)数组
          msgType: 3, // 话术类型
          msgContent: getOptionsValueByKey('value', 'default', 3, msgTypeOption) // 话术内容
        },
        system: {
          peopleNumber: '',
          peopleNumberType: 1 // 1增加， 2减少
        },
        goodsView: {
          stayTime: 0, // 停留时间
          goodsId: '', // 商品id
          contentUrl: '', // 详情图存储路径(用‘,’隔开)，online_flag==1生效，必须保存一张
          coverUrl: '', // 商品横版封面存储路径
          goodsName: '', // 商品名称
          goodsPrice: '', // 商品原价
          goodsPromotionPrice: '', // 商品促销价格
          goodsSpecId: '', // 商品规格
          goodsType: ''// 商品类型
        },
        // 签到设置
        signSetting: {
          stayTime: 0, // 签到时长,单位：分钟
          guide: '各位同学开始签到了' // 签到引导语
        }
      },
      loading: false,
      copyForm: {
        sendTime: '00:00:01', // 发送时间
        msg: {
          robots: [], // 选择用户(机器人)数组
          msgType: 3, // 话术类型
          msgContent: getOptionsValueByKey('value', 'default', 3, msgTypeOption) // 话术内容
        },
        system: {
          peopleNumber: '',
          peopleNumberType: 1 // 1增加， 2减少
        },
        goodsView: {
          stayTime: 0, // 停留时间
          goodsId: '', // 商品id
          contentUrl: '',
          coverUrl: '',
          goodsName: '', // 商品名称
          goodsPrice: '', // 商品原价
          goodsPromotionPrice: '', // 商品促销价格
          goodsSpecId: '', // 商品规格
          goodsType: ''// 商品类型
        },
        // 签到设置
        signSetting: {
          stayTime: 0, // 签到时长,单位：分钟
          guide: '各位同学开始签到了' // 签到引导语
        }
      }, // 用于编辑的重置
      scriptInteractId: '',
      selectRobotNumber: ''
    }
  },
  computed: {
    ...mapState({
      currentTime: state => state.liveScript.currentTime
    })
  },
  mounted() {},
  methods: {
    renderRoleInfo,
    // 随机选取用户
    randomRobot(val) {
      console.log(val)
      if (!val) {
        return
      }
      const data = {
        number: val
      }
      randomRobot(data).then(res => {
        console.log(res)
        this.form.msg.robots = res.data
      })
    },
    // 限制只能输入数字
    delNumber(e) {
      if (Number(e) > 10000) {
        this.form.system.peopleNumber = 10000
        return
      }
      this.form.system.peopleNumber = e.replace(/[^0-9]/g, '')
    },
    onhandleTabChange(res) {
      if (res.value === this.active) {
        return
      }
      this.active = res.value
      this.form.msg = {
        robots: [], // 选择用户(机器人)数组
        msgType: 3, // 话术类型
        msgContent: getOptionsValueByKey('value', 'default', 3, msgTypeOption) // 话术内容
      }
      this.form.system = {
        peopleNumber: '',
        peopleNumberType: 1 // 1增加， 2减少
      }
      this.form.goodsView = {
        stayTime: 0, // 停留时间
        goodsId: '', // 商品id
        contentUrl: '',
        coverUrl: '',
        goodsName: '', // 商品名称
        goodsPrice: '', // 商品原价
        goodsPromotionPrice: '', // 商品促销价格
        goodsSpecId: '', // 商品规格
        goodsType: ''// 商品类型
      }
      this.form.signSetting = {
        stayTime: 0, // 签到时长,单位：分钟
        guide: '各位同学开始签到了' // 签到引导语
      }
      this.$refs.form && this.$refs.form.clearValidate()
    },
    // 点击保存
    onhandleSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('baocun ')
          this.onSave()
        } else {
          console.log('error submit!!')
          return false
        }
      })
      console.log(this.form)
    },
    // 点击重置
    onhandleClear(currentTime) {
      if (this.scriptInteractId) {
        // 编辑
        // this.form = JSON.parse(JSON.stringify(this.copyForm))
        // this.onEdit(this.copyForm)
        this.form = {
          sendTime: this.getFormatHMS(currentTime ? currentTime * 1000 : this.currentTime * 1000), // 发送时间
          msg: {
            robots: [], // 选择用户(机器人)数组
            msgType: 3, // 话术类型
            msgContent: getOptionsValueByKey('value', 'default', 3, msgTypeOption) // 话术内容 // 话术内容
          },
          system: {
            peopleNumber: '',
            peopleNumberType: 1 // 1增加， 2减少
          },
          goodsView: {
            stayTime: 0, // 停留时间
            goodsId: '', // 商品id
            contentUrl: '',
            coverUrl: '',
            goodsName: '', // 商品名称
            goodsPrice: '', // 商品原价
            goodsPromotionPrice: '', // 商品促销价格
            goodsSpecId: '', // 商品规格
            goodsType: ''// 商品类型
          },
          signSetting: {
            stayTime: 0, // 签到时长,单位：分钟
            guide: '' // 签到引导语
          }
        }
        this.active = 1
        // this.active = obj.eventType
      } else {
        // 新增
        this.scriptInteractId = ''
        this.form = {
          sendTime: this.getFormatHMS(currentTime ? currentTime * 1000 : this.currentTime * 1000), // 发送时间
          msg: {
            robots: [], // 选择用户(机器人)数组
            msgType: 3, // 话术类型
            msgContent: getOptionsValueByKey('value', 'default', 3, msgTypeOption) // 话术内容 // 话术内容
          },
          system: {
            peopleNumber: '',
            peopleNumberType: 1 // 1增加， 2减少
          },
          goodsView: {
            stayTime: 0, // 停留时间
            goodsId: '', // 商品id
            contentUrl: '',
            coverUrl: '',
            goodsName: '', // 商品名称
            goodsPrice: '', // 商品原价
            goodsPromotionPrice: '', // 商品促销价格
            goodsSpecId: '', // 商品规格
            goodsType: ''// 商品类型
          },
          // 签到设置
          signSetting: {
            stayTime: 0, // 签到时长,单位：分钟
            guide: '各位同学开始签到了' // 签到引导语
          }
        }
        this.active = 1
      }
      this.$refs.form && this.$refs.form.clearValidate()
    },
    onAdd(currentTime) {
      this.scriptInteractId = ''
      this.onhandleClear(currentTime)
    },
    onhandleTypeChange() {
      console.log('话术类型改变触发')
      this.$refs.form && this.$refs.form.clearValidate()
    },
    handleBlurPlayTime() {
      const duration = this.videoDetail.duration
      let total = this.formatPrTime(this.form.sendTime)
      if (total || total === 0) {
        total = total > duration ? duration : total
        // this.updateVideoSeekTime(total, '播放时间修改')
        this.form.sendTime = this.getFormatHMS(total * 1000)
      } else {
        this.form.sendTime = this.getFormatHMS(this.currentTime * 1000)
      }
      console.log(this.form.sendTime, 'this.form.sendTime')
      return
      // this.isEditPlayTime = false
    },
    // 时间转秒
    formatPrTime(val) {
      const isValid = this.volidFormatTime(val)
      if (isValid) {
        const list = val.split(':').reverse()
        for (let i = 0; i < list.length; i++) {
          if (!list[i]) {
            list[i] = '00'
          }
        }
        const mss = Number(list[0]) || 0
        const ss = list.length > 1 ? Number(list[1]) * 60 : 0
        const ms = list.length > 2 ? Number(list[2]) * 3600 : 0
        // const hs = list.length > 3 ? Number(list[3]) * 3600 : 0
        const total = mss + ss + ms
        console.log(mss, ss, ms, '1231')
        return total
      }
    },
    volidFormatTime(val) {
      let isValid = true
      if (val.includes(':')) {
        const list = val.split(':')
        list.forEach((item) => {
          isValid = !isNaN(Number(item))
        })
      } else {
        isValid = !isNaN(Number(val))
      }
      return isValid
    },
    // 接收豪秒的单位
    getFormatHMS(val) {
      // console.log(val)
      return moment.utc(val).format('HH:mm:ss')
    },
    // 点击删除机器人
    delRobot(row, index) {
      this.form.msg.robots.splice(index, 1)
    },
    onSave() {
      this.scriptInteractId ? this.onhandleEdit() : this.onhandleAdd()
    },
    async onhandleAdd() {
      this.loading = true
      let width = 0
      let height = 0
      let stayTime = 0
      let msgContent = this.form.msg.msgContent
      if (this.active === 1 && this.form.msg.msgType === 4) {
        // 获取OSS图片宽高
        const res = await axios(this.form.msg.msgContent + '?x-oss-process=image/info')
        console.log(res, '获取的图片信息')
        if (res?.data?.ImageHeight) {
          height = Number(res.data.ImageHeight.value)
        }
        if (res?.data?.ImageWidth) {
          width = Number(res.data.ImageWidth.value)
        }
      } else if (this.active === 1 && this.form.msg.msgType === 2) {
        width = 20
        height = 20
      }
      if (this.active === 3) {
        stayTime = this.form.goodsView.stayTime * 60
        msgContent = this.form.goodsView.goodsId
      } else if (this.active === 4) {
        stayTime = this.form.signSetting.stayTime * 60
        msgContent = this.form.signSetting.guide
      }
      const robotIds = this.form.msg.robots.reduce((pre, next) => {
        pre.push(next.robotId)
        return pre
      }, [])
      const data = {
        adjustNumber: this.active === 1 ? null : this.form.system.peopleNumber,
        numAdjustType: this.active === 1 ? null : this.form.system.peopleNumberType,
        eventType: this.active,
        height: this.form.msg.msgType === 2 ? 20 : height,
        msgContent: msgContent,
        msgType: this.form.msg.msgType,
        robotIds,
        scriptId: this.$route.params.id,
        sendTime: this.formatPrTime(this.form.sendTime),
        width: this.form.msg.msgType === 2 ? 20 : width,
        stayTime // 停留时间
      }
      addScriptInteract(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        this.$store.commit('liveScript/set_configurationIndex', res.data)
        const obj = {
          ...data,
          robots: this.form.msg.robots,
          scriptInteractId: res.data,
          goodsType: this.form.goodsView.goodsType,
          goodsPrice: this.form.goodsView.goodsPrice,
          goodsPromotionPrice: this.form.goodsView.goodsPrice,
          goodsName: this.form.goodsView.goodsName,
          coverUrl: this.form.goodsView.coverUrl,
          contentUrl: this.form.goodsView.contentUrl
        }
        this.$store.commit('liveScript/updata_interactDetail', obj)
        this.onhandleClear()
        this.$nextTick(() => {
          this.$emit('success', res.data)
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    async onhandleEdit() {
      this.loading = true
      let width = 0
      let height = 0
      let stayTime = 0
      let msgContent = this.form.msg.msgContent
      if (this.active === 1 && this.form.msg.msgType === 4) {
        // 获取OSS图片宽高
        const res = await axios(this.form.msg.msgContent + '?x-oss-process=image/info')
        console.log(res, '获取的图片信息')
        if (res?.data?.ImageHeight) {
          height = Number(res.data.ImageHeight.value)
        }
        if (res?.data?.ImageWidth) {
          width = Number(res.data.ImageWidth.value)
        }
      } else if (this.active === 1 && this.form.msg.msgType === 2) {
        width = 20
        height = 20
      }
      if (this.active === 3) {
        stayTime = this.form.goodsView.stayTime * 60
        msgContent = this.form.goodsView.goodsId
      } else if (this.active === 4) {
        stayTime = this.form.signSetting.stayTime * 60
        msgContent = this.form.signSetting.guide
      }
      const robotIds = this.form.msg.robots.reduce((pre, next) => {
        pre.push(next.robotId)
        return pre
      }, [])
      const data = {
        adjustNumber: this.active === 1 ? null : this.form.system.peopleNumber,
        numAdjustType: this.active === 1 ? null : this.form.system.peopleNumberType,
        eventType: this.active,
        height: this.form.msg.msgType === 2 ? 20 : height,
        msgContent: msgContent,
        msgType: this.form.msg.msgType,
        robotIds,
        scriptId: this.$route.params.id,
        sendTime: this.formatPrTime(this.form.sendTime),
        width: this.form.msg.msgType === 2 ? 20 : width,
        scriptInteractId: this.scriptInteractId,
        stayTime // 停留时间
      }
      editInteract(data).then(res => {
        this.$notify.success({ title: '提示', message: '操作成功' })
        const obj = {
          ...data,
          id: data.scriptInteractId,
          robots: this.form.msg.robots,
          scriptInteractId: this.scriptInteractId,
          goodsType: this.form.goodsView.goodsType,
          goodsPrice: this.form.goodsView.goodsPrice,
          goodsPromotionPrice: this.form.goodsView.goodsPrice,
          goodsName: this.form.goodsView.goodsName,
          coverUrl: this.form.goodsView.coverUrl,
          contentUrl: this.form.goodsView.contentUrl
        }
        this.$store.commit('liveScript/updata_interactDetail', obj)
        this.onhandleClear()
        this.$nextTick(() => {
          this.$emit('success', this.scriptInteractId)
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取机器人列表
    getRobot(params) {
      const data = {
        pageIndex: params.current,
        pageSize: params.size,
        robotNickName: params.robotNickName
      }
      return queryRobot(data).then(res => {
        return {
          items: res.data.items,
          total: res.data.total
        }
      })
    },
    // 选中机器人触发
    selectRobot(res) {
      this.form.msg.robots = res
      this.$refs.form.validateField('msg.robots')
    },
    onEdit(obj) {
      console.log(obj)
      this.form = {
        sendTime: this.getFormatHMS(obj.sendTime * 1000), // 发送时间
        msg: {
          // height: obj.height,
          // width: obj.width,
          robots: obj.robots, // 选择用户(机器人)数组
          msgType: obj.msgType, // 话术类型
          msgContent: obj.msgContent // 话术内容 // 话术内容
        },
        system: {
          peopleNumber: obj.eventType === 1 ? '' : Math.abs(obj.adjustNumber),
          peopleNumberType: obj.eventType === 1 ? '' : (obj.adjustNumber >= 0 ? 1 : 2) // 1增加， 2减少
        },
        goodsView: {
          stayTime: obj.eventType === 3 ? obj.stayTime / 60 : '', // 停留时间
          goodsId: obj.eventType === 3 ? obj.msgContent : '', // 商品id
          contentUrl: obj.eventType === 3 ? obj.contentUrl : '', // 商品图片
          coverUrl: obj.eventType === 3 ? obj.coverUrl : '', // 商品图片
          goodsName: obj.eventType === 3 ? obj.goodsName : '', // 商品名称
          goodsPrice: obj.eventType === 3 ? obj.goodsPrice : '', // 商品原价
          goodsPromotionPrice: obj.eventType === 3 ? obj.goodsPrice : '', // 商品促销价格
          goodsSpecId: obj.eventType === 3 ? obj.goodsSpecId : '', // 商品规格
          goodsType: obj.eventType === 3 ? obj.goodsType : ''// 商品类型
        },
        signSetting: {
          stayTime: obj.eventType === 4 ? obj.stayTime / 60 : '', // 签到时长,单位：分钟
          guide: obj.eventType === 4 ? obj.msgContent : '各位同学开始签到了' // 签到引导语
        }
      }
      this.copyForm = JSON.parse(JSON.stringify(obj))
      this.scriptInteractId = obj.scriptInteractId
      this.active = obj.eventType
      this.$refs.form && this.$refs.form.clearValidate()
    },
    // 删除当前操作数据需要重置
    onReset(arr, currentTime) {
      if (!this.scriptInteractId) {
        return
      } else {
        if (arr.includes(this.scriptInteractId)) {
          this.onAdd(currentTime)
        }
      }
    },
    openAdd() {
      this.onAdd(this.currentTime)
    },
    selectGoods() {
      // 做禁选
      this.$SelectGoods({
        visible: true,
        multiple: false,
        initSearch: {
          tagType: 5
        },
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' }
        ],
        disabledFn: (row) => {
          return row.saleType === 0
        },
        currentId: '3',
        success: (res) => {
          if (res.length === 0) {
            return this.$message.error('请选择商品')
          }
          console.log(res, 'res')
          const goodsInfoRequestList = res.reduce((pre, next) => {
            let goodsPrice = 0
            if (next.goodsType === 5 && next.onlineList.length > 0) {
              goodsPrice = 0
            } else if (next.goodsType !== 5) {
              goodsPrice = next.salePrice
            }
            pre.push({
              stayTime: this.form.goodsView.stayTime,
              goodsId: next.goodsId,
              contentUrl: next.contentUrl,
              coverUrl: next.coverUrl,
              goodsName: next.contentName || next.goodsName,
              goodsPrice: goodsPrice,
              goodsPromotionPrice: goodsPrice,
              goodsSpecId: next.specId || '',
              goodsType: next.goodsType || 5
            })
            return pre
          }, [])
          console.log(goodsInfoRequestList)
          this.form.goodsView = goodsInfoRequestList[0]
          this.$refs.form && this.$refs.form.validateField('goodsView.goodsId')
        }
      })
    },
    onhandleSelectSignTime(item) {
      this.form.signSetting.stayTime = item.value
    }
  }
}
</script>

<style lang='scss' scoped>
::v-deep {
  .el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }
  .tearchInput {
    width: 245px;
  }
}
.addView {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tabView {
      margin: 0 20px;
      height: 60px;
      border-bottom: 1px solid #EFF2F6;
      display: flex;
      align-items: center;
      .tabViewItem {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #777777;
        line-height: 24px;
        margin-right: 20px;
        line-height: 60px;
        height: 100%;
        cursor: pointer;
        border-bottom: 2px solid #fff;
      }
      .active {
        font-weight: 500;
        color: #0C6FFF;
        border-bottom: 2px solid #0C6FFF;
      }
    }
    .contentView {
      flex: 1 0 0;
      padding: 20px 18px 0;
    }
    .footerBtn {
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 64px;
      box-shadow: 0px -1px 10px 0px rgba(0,0,0,0.05);
    }
}
.userViewBox {
  margin-top: 16px;
  width: 100%;
  border: 1px dashed #CBCFD3;
  border-radius: 6px;
  padding-top: 10px;
  padding-left: 10px;
  position: relative;
  .userViewBoxTips {
    position: absolute;
    right: 10px;
    bottom: 4px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }
}
.robotSelectLabel {
  display: flex;
  align-items: center;
  .myLabel {
    margin-left: 5px;
    width: 100%;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
  }
}
.goodsList {
  padding: 10px;
  display: flex;
  cursor: pointer;
  align-items: center;
  border-bottom: 1px solid #F5F5F5;
  border-left: 1px solid #F5F5F5;
  border-right: 1px solid #F5F5F5;
  &:hover {
    background: #E7F0FF;
    border-radius: 4px;
  }
  .goodsSort {
    width: 60px;
    text-align: center;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  .goodsDetail {
    flex: 1 0 0;
    height: 75px;
    display: flex;
    flex-direction: column;
    // align-items: flex-end;
    justify-content: space-between;
    .goodsName {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
    .goodsPrice {
      display: flex;
      align-items: flex-end;
      .crossedPrice{
        margin-left: 10px;
        text-decoration:line-through;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 17px;
      }
    }
  }
  .goodsBtn {
    width: 100px;
  }
  &:nth-child(1) {
    border-top: 1px solid #F5F5F5;
  }
}
.signList {
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  .signItem {
    width: 77px;
    height: 32px;
    background: #fff;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    line-height: 32px;
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #333333;
    text-align: center;
    cursor: pointer;
    margin-right: 12px;
    margin-bottom: 12px;
    &:hover {
      background: #F0F6FF;
      border: 1px solid #0C6FFF;
    }
  }
  .active {
    background: #0C6FFF!important;
    border: 1px solid #0C6FFF!important;
    color: #FFFFFF!important;
  }
}
.user_info_role {
  display: inline-block;
  width: 28px;
  min-width: 28px;
  height: 16px;
  background: #0091FF;
  border-radius: 2px;
  font-size: 10px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 14px;
  text-align: center;
  margin-left: 4px;
  margin-right: 4px;
}
</style>
