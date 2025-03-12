<template>
  <div class="relative">
    <template-title title="话题">
      <em v-if="type === 'bilibili'" slot="required" class="required">*</em>
    </template-title>
    <div class="inputTag" :style="tagList==''?'':'padding-top:8px'" :class="{'error':isValid}">
      <div class="tagList flex items-center">
        <el-tag
          v-for="(tag,index) in tagList"
          :key="index"
          class="tagDetails"
          closable
          @close="handleClose(index)"
        >
          # {{ removeSymbol(tag.value) }}
        </el-tag>
        <el-autocomplete v-if="type==='kuaishou'" ref="taginput" v-model="value1" :fetch-suggestions="querySearch" placeholder="按回车键Enter创建话题" class="tag-input" size="mini" @select="handleSelect">
          <template slot-scope="{ item }">
            <p class="flex justify-between">
              <span>{{ item.value }}</span> <span>{{ formatNum(item.readNum) }}</span>
            </p>
          </template>
        </el-autocomplete>
        <el-autocomplete v-else-if="type==='xiaohongshu'" ref="taginput" v-model="value1" :fetch-suggestions="querySearch" placeholder="按回车键Enter创建话题" class="tag-input" size="mini" @select="handleSelect" />
        <el-input
          v-else
          ref="taginput"
          v-model="value1"
          :style="tagList==''?'':'margin-bottom:8px'"
          placeholder="按回车键Enter创建话题"
          class="tag-input"
          size="mini"
          @keydown.delete.native="deleteInput"
          @keyup.native="changeInput"
          @input="changeValue"
        />
      </div>
    </div>
    <p v-if="isValid" class="error-tips">请创建话题</p>
    <p v-if="isOverMaxTagList" class="tips-error">最多添加20个话题</p>
    <div style="">
      <span class="addTags cursor-pointer" @click="handleClickAddTag">
        {{ tagList.length }}/{{ type==='kuaishou'?3:type==='tiktok'?5:type==='bilibili'?10:20 }}
      </span>
    </div>
    <!--    <p v-if="isOverMaxTagList" class="tips-error">最多添加10个话题</p>-->
    <!-- <div class="m-t-16" style="margin-bottom:14px;">
      <span class="addTags cursor-pointer" @click="handleClickAddTag">
        # 添加话题 {{ tagList.length }}/10 ?
      </span>
    </div> -->
    <common-topic @add="addCommonTopic" />

  </div>
</template>

<script>
import {
  mixinsAllOperations
} from '@/views/videoPublish/publish/components/VideoDetail/DetailChannelColumn/allOperations'
import TemplateTitle from './TemplateTitle.vue'
import CommonTopic from '../../../Common/CommonTopic.vue'
import { isUseNewClient } from '@/utils'

export default {
  name: 'DetailTopic',
  components: {
    TemplateTitle,
    CommonTopic
  },
  mixins: [mixinsAllOperations],
  inject: ['getMerchantToken', 'updataErrList', 'publishChannelData'],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value1: '',
      isDeleteFlag: false, // 计数器 第一次value为0时不删除标签
      tagList: [],
      isOverMaxTagList: false,
      isValid: false
    }
  },
  watch: {
    'publishChannelData.activeData': {
      handler(newVal, oldVal) {
        this.initData()
      },
      deep: true
    }
  },
  mounted() {
    console.log(this.$refs.taginput, 'input标签')
  },
  methods: {
    // 初始化数据
    initData() {
      const activeData = this.publishChannelData.activeData
      if (Object.keys(activeData).length > 0) {
        if (this.type === 'kuaishou' && this.publishChannelData.activeData.topic.length > 3) {
          setTimeout(() => {
            this.tagList = this.publishChannelData.activeData.topic.slice(0, 3)
          }, 100)
        } else if (this.type === 'bilibili' && this.publishChannelData.activeData.topic.length > 10) {
          setTimeout(() => {
            this.tagList = this.publishChannelData.activeData.topic.slice(0, 10)
          }, 100)
        } else if (this.type === 'tiktok' && this.publishChannelData.activeData.topic.length > 5) {
          setTimeout(() => {
            this.tagList = this.publishChannelData.activeData.topic.slice(0, 5)
          }, 100)
        } else {
          this.tagList = this.publishChannelData.activeData.topic || []
        }
      }
      this.validTagList()
    },
    changeValue() {
      this.isDeleteFlag = false
    },
    // 删除标签
    deleteInput() {
      if (this.value1.length) return
      if (this.tagList && this.value1 === '') {
        // if (!this.isDeleteFlag) {
        //   this.isDeleteFlag = true
        //   return
        // }
        this.tagList.splice(this.tagList.length - 1, 1)
        // this.$refs.taginput.onfocus()
        this.updateTagList()
      }
    },
    changeInput(e) {
      if (e.keyCode === 13) {
        if (this.value1 === '') {
          return
        }
        if (this.value1.length > 20) {
          this.isDeleteFlag = true
        } else {
          const value = this.removeSymbol(this.value1) // this.value1.indexOf('#') === 0 ? this.value1 : '# ' + this.value1
          if (this.tagList.length > 19) {
            this.isOverMaxTagList = true
          } else {
            this.tagList.push({ value })
            this.isDeleteFlag = true
          }
        }
        this.updateTagList()
      }
    },
    handleClose(index) {
      this.tagList.splice(index, 1)
      // this.$refs.taginput.focus()
      this.updateTagList()
      this.isOverMaxTagList = false
    },
    updateTagList() {
      this.validTagList()
      const arr = JSON.parse(JSON.stringify(this.tagList))
      this.updataPublishActiveData(this.publishChannelData.activeData.account.accountId, 'topic', arr)
      this.value1 = ''
    },
    validTagList() {
      const activeData = this.publishChannelData?.activeData
      if (Object.keys(activeData).length) {
        const platformId = activeData.account.platformId
        if (platformId === 15) {
          const list = this.tagList
          const isValid = list.length === 0
          this.isValid = isValid
          console.log(isValid, 88888888)
          this.updataErrList({ platformId: activeData.account.platformId, isValidTags: isValid, contentError: isValid }, 'b站话题校验')
        } else {
          this.isValid = false
        }
      }
    },
    handleClickAddTag() {
      this.$refs.taginput.focus()
    },
    addCommonTopic(data) {
      if (this.tagList.length >= 20) {
        return
      }
      this.tagList.push({ value: data })
      this.updateTagList()
    },
    querySearch(queryString, cb) {
      const { platformId, cookie, platformAccountId } = this.publishChannelData.activeData.account
      const params = {
        platformId,
        platformAccountCookie: cookie,
        platformAccountToken: this.getMerchantToken,
        platformAccountId,
        newVersion: this.allChannelSwitch[platformId],
        mediaTypeEnum: 'MiniVideo', // Video Article MiniVideo
        dataType: 2, // 1好友 2话题 3热点
        keyWord: queryString // 搜索关键词
      }
      console.log(params, queryString, '获取小红书话题参数。。。。')
      if (queryString !== '') {
        isUseNewClient(this.channel.id, 'get-mediaTopicInfo', this.publishChannelData.activeData.account.platformAccountId, '获取好友/话题/热点').emit('get-mediaTopicInfo', JSON.stringify(params), response => {
          const result = JSON.parse(response)
          if (result.messageType === '0') {
            result.dataBody.forEach(item => {
              item.value = item.title
            })
            cb(result.dataBody)
          }
          console.log(result, '监听小红书获取话题参数。。。。')
        })
      } else {
        cb([])
      }
    },
    handleSelect(data) {
      this.tagList.push(data)
      this.updateTagList()
      this.value1 = ''
    },
    formatNum(val) {
      let txt = ''
      if (val > 10000) {
        txt = val / 10000 + '万次播放'
      } else if (val > 100000000) {
        txt = val / 10000 + '亿次播放'
      }
      return txt
    },
    // 删除#号
    removeSymbol(val) {
      return val.replace('#', '')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  border: none;
  padding: 0;
}
.minitags{
  margin-right: 8px;
}
.inputTag {
  position: relative;
  width: 109%;
  padding-right: 9%!important;
}
.addTags{
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #777777;
  position: absolute;
  right: 2px;
  top: 28px;
}
.tagDetails{
  margin-right: 8px;
  margin-bottom: 8px;
}
.inputTag {
  width: 100%;
  min-height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding:0 12px;
  box-sizing: border-box;

  &.error{
   border: 1px solid red;
  }
.tagList{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  box-sizing: border-box;
}
.tag-input{
  min-width: 130px;
  flex: 1;
  height: 28px;
}
}
.tips-error{
  float: left;
  width: 100%;
  font-size:14px;
  color:#F53F3F;
}
.error-tips{
  bottom:40px;
  left:0;
  font-size:14px;
  color:#F53F3F;
}
.required{
  color: #F53F3F;
  font-size: 16px;
  margin-right:8px;
}
</style>
