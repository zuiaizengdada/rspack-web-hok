<template>
  <div>
    <el-dialog width="695px" :visible.sync="visibleDialog" :title="dialogPublishEslintStepTitleList[dialogPublishEslintStep]" :destroy-on-close="true" :append-to-body="true" :close-on-press-escape="false" :close-on-click-modal="false" @close="dialogClose">
      <account-eslint v-show="dialogPublishEslintStep===0" ref="accountEslint" @success="publishEslintSuccess" />
      <account-publish v-show="dialogPublishEslintStep===1" :list="checkAccountList" :sensitive-list="sensitiveList" :token="merchantData" @complete="videoPublishComplete" />
    </el-dialog>
    <SensitiveTips ref="modal" :sensitive-list="sensitiveList" @handleClose="allowClicking" @submitForm="continuePublishing" />
  </div>
</template>
<script>
import AccountEslint from './AccountEslint.vue'
import AccountPublish from './AccountPublish.vue'
import { qryLoginMerchant, addTopic } from '../../api/index'
import SensitiveTips from './sensitiveTips.vue'
import { publishCheck } from '@/api/videoManagement/videoPublish'
export default {
  components: {
    AccountEslint,
    AccountPublish,
    SensitiveTips
  },
  inject: ['publishChannelData'],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogPublishEslintStepTitleList: ['发布检测', '内容分发'],
      dialogPublishEslintStep: 0,
      checkAccountList: [],
      sensitiveList: [],
      suslist: [],
      merchantData: {}
    }
  },
  computed: {
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    visibleDialog(val) {
      if (val) {
        this.getLoginMerchant()
        this.dialogPublishEslintStep = 0
        this.$nextTick(() => {
          this.$refs.accountEslint.initAccountList()
        })
      }
    }
  },
  methods: {
    async getLoginMerchant() {
      const res = await qryLoginMerchant()
      this.merchantData = res.data
      // localStorage.setItem('videoPublishMerchantData', JSON.stringify(this.merchantData))
    },
    async publishEslintSuccess(list) {
      this.suslist = [...list]
      const arr = this.filterAccountList(this.publishChannelData.list, list)
      const res = await publishCheck(arr)
      if (res.data && res.data.length > 0) {
        this.sensitiveList = res.data
        this.$refs.modal.openDialog()
        return
      } else {
        this.sensitiveList = []
      }
      this.continuePublishing()
    },
    continuePublishing() {
      this.checkAccountList = this.suslist
      this.dialogPublishEslintStep = 1
      this.allowClicking()
    },
    allowClicking() {
      this.$refs.accountEslint.allowClicking()
    },
    filterAccountList(oldList1, newList1) {
      const oldList = JSON.parse(JSON.stringify(oldList1))
      const newList = JSON.parse(JSON.stringify(newList1))
      const arr = []
      oldList.forEach(item => {
        newList.forEach(item2 => {
          if (item2 === item.account.accountId) {
            arr.push(item)
          }
        })
      })
      const { finishVideoId } = this.$route.query
      const newArr = []
      const filterTitle = [15, 31]
      arr.forEach((ele) => {
        console.log(ele, 'ele')
        this.addTopicApi(ele)
        // 抖音渠道限制5个话题platformId=19 快手限制3个话题platformId=24 b站限制10个话题platformId=15
        ele.topic = ele.topic.slice(0, ele.account.platformId === 19 ? 5 : ele.account.platformId === 24 ? 3 : ele.account.platformId === 15 ? 10 : 20)
        // topic [{value:'',index:''}] 取value
        ele.topic = ele.topic && ele.topic.map(item => item.value)
        newArr.push({
          finishVideoId,
          platformAccountId: ele.account.platformAccountId,
          platformId: ele.account.platformId,
          synopsis: ele.intro,
          title: filterTitle.includes(ele.account.platformId) ? ele.title : '',
          topic: ele.topic
        })
      })
      return newArr
    },
    // 添加话题
    async addTopicApi(data) {
      console.log(data, '话题的列表')
      const list = []
      const topics = data.topic
      // const { finishVideoId } = this.$route.query
      topics.forEach(item => {
        const obj = {
          accountId: data.account.accountId,
          platformId: data.account.platformId,
          finishVideoId: this.$route.query.finishVideoId,
          topic: item.value
        }
        list.push(obj)
      })
      if (list.length > 0) {
        await addTopic(list)
      }
    },
    videoPublishComplete() {
      // this.visibleDialog = false
    },
    dialogClose() {
      this.dialogPublishEslintStep = 0
      // this.$store.commit('user/SET_UPDATEVISIBLEDIALOGVIDEOPUBLISH', false)
      this.checkAccountList = []
    }
  }

}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 10px;
}
::v-deep .el-dialog__header{
    border-bottom:1px solid #E7E7E7
}
::v-deep .el-dialog__body{
    padding:30px 0;
}
</style>
