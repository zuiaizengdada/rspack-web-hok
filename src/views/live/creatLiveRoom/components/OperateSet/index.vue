<template>
  <div class="operate-set-container">
    <base-title title="运营设置" style="margin-bottom:20px;" />
    <el-form ref="form" :model="form" label-width="140px" label-position="right" size="mini">
      <el-form-item label="计划看播用户">
        <associated-tasks @select="handleSelectAssociatedTasks" @upload="handleUploadExcel" />
      </el-form-item>
      <el-form-item label="商品">
        <related-products @select="handleSelectRelatedProducts" />
      </el-form-item>
      <el-form-item label="优惠券">
        <associate-coupons @change="handleChangeAssociateCoupons" @select="handleSelectCoupons" />
      </el-form-item>
      <el-form-item label="抽奖">
        <luck-draw @change="handleChangeLuckDraw" @add="handleAddLuckDraw" />
      </el-form-item>
      <el-form-item label="回放设置">
        <play-back ref="playBack" @change="handleChangePlayBack" />
      </el-form-item>
      <el-form-item label="敏感词设置 ">
        <sensitive-words class="sensitive-words" @select="handleAddSensitiveWords" />
      </el-form-item>
      <el-form-item label="下一场直播预告 ">
        <live-trailer @select="handleSelectLiveTrailer" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import BaseTitle from '../Common/BaseTitle'
import PlayBack from './PlayBack/index'
import LiveTrailer from './LiveTrailer/index'
import SensitiveWords from './SensitiveWords/index'
import LuckDraw from './LuckDraw/index'
import AssociateCoupons from './AssociateCoupons/index'
import RelatedProducts from './RelatedProducts/index'
import AssociatedTasks from './AssociatedTasks/index'
export default {
  components: {
    BaseTitle,
    LuckDraw,
    PlayBack,
    LiveTrailer,
    SensitiveWords,
    AssociateCoupons,
    RelatedProducts,
    AssociatedTasks
  },
  data() {
    return {
      form: {
        // importUserFileList: [], // 计划看播-导入用户文件集合
        // liveRoomPayGoodsConfig: [], // 付费直播间关联商品集合
        operationalSettings: {
          allowRepeat: false, // 直播间是否允许同一人重复中奖设置 true-允许 false-不允许
          couponStyle: 1, // 优惠券展示模式
          couponNos: [], // 优惠券
          goodsInfoRequestList: [], // 直播间商品
          liveRoomTrailers: [], // 直播下一场直播预告
          planWatchUserImportUsers: [], // 计划看播-导入用户文件集合
          playbackSet: {
            // validityType: 1, // 回放类型 1-一年 2-自定义时间
            // playbackSwitch: false, // 设置
            // authorizedPersonnel: 1, // 开放对象 1-观看过直播间的所有人员 2-所有获得邀课链接的人员 3-指定白名单人员
            // expirationDateStr: '', // 自定义日期 yyyy-MM-dd HH:mm:ss
            // liveRoomId: '', // 直播间ID
            // studentPhoneList: [] // 学员手机号码集合
          },
          prizeSetting: [
            // {
            //   assignedComment: '', // 指定评论内容
            //   liveRoomId: '', // 直播间ID
            //   participationCondition: '1', // 参与条件 1-用户在线 2-参与任意评论 3-参与指定评论
            //   prizeDetail: [{
            //     amount: 1, // 奖品数量,1-200限制
            //     giveawayId: '', // 赠品ID
            //     prizeName: '', // 奖品名称，例如：一等奖
            //     sort: '' // 排序，1-5
            //   }],
            //   prizeDrawName: '', // 抽奖名称
            //   prizeInstructions: '', // 抽奖说明
            //   showParticipantsAmount: 0 // 用户端是否展示抽奖参与人数 0-不展示 1-展示
            // }
          ],
          sensitiveWordsGroups: [], // 敏感词设置-选择的词库列表
          taskList: [
            // {
            //   taskCreateId: '', // 任务创建人id
            //   taskId: '', // 任务ID
            //   taskName: '' // 任务名称
            // }
          ] // 任务集合
        }
        // id: undefined

      }
    }
  },
  methods: {
    handleSelectAssociatedTasks(list) {
      this.form.operationalSettings.taskList = list
    },
    handleChangeAssociateCoupons(val) {
      this.form.operationalSettings.couponStyle = val
    },
    handleSelectCoupons(list) {
      const couponNos = []
      list.forEach(item => {
        couponNos.push(item.couponNo)
      })
      this.form.operationalSettings.couponNos = couponNos
    },
    handleChangeLuckDraw(val) {
      console.log(val, '是否允许中奖。。。')
      this.form.operationalSettings.allowRepeat = val
    },
    handleAddLuckDraw(list) {
      // const prizeSetting = this.form.operationalSettings.prizeSetting
      this.form.operationalSettings.prizeSetting = list
    },
    handleSelectRelatedProducts(list) {
      this.form.operationalSettings.goodsInfoRequestList = list
    },
    handleAddSensitiveWords(list) {
      this.form.operationalSettings.sensitiveWordsGroups = list
    },
    handleUploadExcel(list) {
      const users = []
      list.forEach(item => {
        item.list.forEach(_item => {
          users.push(_item)
        })
      })
      this.form.operationalSettings.planWatchUserImportUsers = users
    },
    handleSelectLiveTrailer(list) {
      this.form.operationalSettings.liveRoomTrailers = list
    },
    handleChangePlayBack(data) {
      console.log(data, 'dataaaaaaaaa')
      this.form.operationalSettings.playbackSet = data
      if (data.authorizedPersonnel === '3') {
        this.$parent.$refs.signSet.form.id = data.liveRoomId
      } else {
        this.$parent.$refs.signSet.form.id = undefined
      }
    },
    submitForm() {
      console.log(this.form, '运营设置提交参数。。。')
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve(this.form)
            // return true
          } else {
            reject(false)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>

::v-deep .el-form-item__label{
    font-size:14px;
    font-weight: bold;
    color:#000;
    padding-right:20px;
}
</style>
