<template>
  <div :class="{ assessBox: shopFeishuGroupList.length > 0 }">
    <el-tag
      v-for="(tag, index) in shopFeishuGroupList"
      :key="tag.chat_id"
      class="remindPersonListView"
      closable
      @close="delAssessUsers(tag, index)"
    >
      {{ tag.name }}
    </el-tag>
    <div v-if="addFlag" class="input-cls">
      <el-select
        v-model="keywordsObject1"
        filterable
        remote
        reserve-keyword
        :placeholder="`请输入${types[loginType]}群名`"
        :remote-method="remoteMethod"
        :loading="loading"
        size="mini"
        @change="changeSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.chat_id"
          :label="item.name"
          :value="item.chat_id"
        >
          <div class="show-icn-label">
            <!-- <img :src="item.avatar" /> -->
            <AppAvatar
              class="avatar"
              :name="item.name || userInitemfo.name"
              width="24"
              :avatar="item.avatar"
              :no-name="true"
            />
            <span>{{ item.name }}</span>
          </div>
        </el-option>
      </el-select>
      <el-button size="mini" @click="sureToAdd">确定</el-button>
    </div>
    <el-button v-else size="mini" class="btn-cls" @click="addFeishuqun">
      <i class="el-icon-plus el-icon--left" />
    </el-button>
  </div>
</template>

<script>
import AppAvatar from '@/components/AppAvatar/AppAvatar.vue'
import {
  getComplementRemindListGroup,
  getbizWechatGroupChatGroup
} from '@/api/deliver/baseSeeting'
export default {
  components: { AppAvatar },
  props: {
    shopNoticeFlag: {
      type: Boolean,
      default: false
    },
    setType: {
      type: Number,
      default: 0
    },
    bizId: {
      type: String,
      default: ''
    },
    shopFeishuGroupList: {
      type: Array,
      default: () => {
        return []
      }
    },
    dianpuDelivered: {
      type: Array,
      default: () => {
        return []
      }
    },
    loginType: {
      type: String,
      default: 'feishu'
    }
  },
  data() {
    return {
      keywordsObject: '',
      keywordsObject1: '',
      loading: false,
      addFlag: false,
      qunInput: '',
      options: [],
      // 登录类型
      types: {
        feishu: '飞书',
        wecom: '企微'
      }
    }
  },
  mounted() {},
  methods: {
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          let res = {}
          if (this.loginType === 'feishu') {
            res = await getComplementRemindListGroup({ query })
          } else {
            res = await getbizWechatGroupChatGroup({ chatName: query })
          }
          if (res.code === 1) {
            this.options = res.data
          }
        } catch (error) {
          console.log(error)
        }

        this.loading = false
      } else {
        this.options = []
      }
    },
    changeSelect() {
      this.keywordsObject = this.options.find(
        item => item.chat_id === this.keywordsObject1
      )
    },
    // 点击删除通知人员
    delAssessUsers(tag, index) {
      this.$delModal({
        tips: `确定删除该${this.types[this.loginType]}群吗?`,
        success: () => {
          console.log(tag)
          console.log(index)
          this.$emit('deleteGroup', this.setType, index)
        }
      })
    },
    addFeishuqun() {
      this.addFlag = !this.addFlag
      this.keywordsObject = ''
    },
    sureToAdd() {
      // this.shopFeishuGroupList.push(this.keywordsObject)
      console.log('ssssssssskey:', this.keywordsObject)
      if (this.keywordsObject === '') {
        this.$message.error(`请输入${this.types[this.loginType]}群`)
        return
      }
      this.keywordsObject1 = ''
      this.addFlag = !this.addFlag
      this.$emit('getComplement', this.keywordsObject, this.setType)
    }
  }
}
</script>

  <style lang="scss" scoped>
  .assessBox {
    box-sizing: border-box;
    padding: 18px 16px 2px;
    height: auto;
    background: #ffffff;
    border-radius: 6px;
    border: 1px dashed #979797;
    .remindPersonListView {
      float: left;
      margin-right: 16px;
      margin-bottom: 16px;
    }
  }
  .btn-cls {
    padding-left: 10px;
    padding-right: 5px;
    float: left;
  }

  .input-cls {
    float: left;
    width: 230px;
    ::v-deep .el-input {
      width: 150px;
      margin-right: 10px;
    }
  }

  .show-icn-label {
    width: 100%;
    padding: 5px 10px;
    .avatar {
      float: left;
      width: 24px;
      height: 24px;
    }
    span {
      float: left;
      margin-left: 10px;
      line-height: 24px;
    }
  }
  </style>
