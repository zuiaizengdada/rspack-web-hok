<template>
  <!-- 敏感词设置 -->
  <div class="sensitive-setting-wrapper">
    <div class="flex flex-middle">
      <span class="label">敏感词设置</span>
      <div>
        <el-tag
          v-for="tag in dynamicTags"
          :key="tag.groupId"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.groupName }}
        </el-tag>
        <el-autocomplete
          v-if="inputVisible"
          ref="saveTagInput"
          v-model="inputValue"
          size="small"
          class="button-new-tag"
          :fetch-suggestions="seacrh"
          value-key="groupName"
          placeholder="请输入内容"
          @select="handleSelect"
        />
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showInput"
        >
          添加
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  liveRoomSensitive,
  getInfoByGroupName,
  getInfoByGroupIds
} from '@/api/liveRoom/detail'
import { getLiveRoomInfo } from '@/api/liveRoom/index'
export default {
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      loading: false
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const params = {
        liveRoomId: this.$route.params.id
      }
      this.loading = true
      getLiveRoomInfo(params)
        .then(res => {
          if (
            res.data.sensitiveWordsGroupIds &&
            res.data.sensitiveWordsGroupIds.length
          ) {
            this.getInfoByGroupIds(res.data.sensitiveWordsGroupIds)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    getInfoByGroupIds(val) {
      getInfoByGroupIds({ groupIds: val })
        .then(res => {
          this.loading = false
          this.dynamicTags = [...res.data]
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelect(e) {
      if (this.dynamicTags.findIndex(item => item.groupId === e.groupId) > -1) {
        this.$message.warning('该项已存在！')
        return
      }
      this.dynamicTags.push({ ...e })
      this.setLiveRoomSensitive()
    },
    setLiveRoomSensitive() {
      liveRoomSensitive({
        groupIds: this.dynamicTags.map(item => item.groupId),
        liveRoomId: this.$route.params.id
      })
        .then(() => {
          this.inputVisible = false
          this.inputValue = ''
        })
        .catch(() => {
          this.dynamicTags.splice(this.dynamicTags.indexOf(e), 1)
        })
    },
    seacrh(val, cb) {
      getInfoByGroupName({ searchName: val }).then(res => {
        cb([...res.data])
      })
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      this.setLiveRoomSensitive()
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sensitive-setting-wrapper {
  position: relative;
  margin-top: 20px;
  .label {
    margin-right: 10px;
    font-size: 14px;
    color: #999999;
  }
  ::v-deep {
    .el-tag + .el-tag {
      margin-left: 10px;
    }
  }
  .button-new-tag {
    margin-left: 10px;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
</style>
