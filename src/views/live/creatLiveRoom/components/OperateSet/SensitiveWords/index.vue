<template>
  <!-- 敏感词设置 -->
  <div class="sensitive-setting-wrapper">
    <div class="flex flex-middle flex-wrap items-start">

      <el-tag
        v-for="tag in dynamicTags"
        :key="tag.groupId"
        closable
        :disable-transitions="false"
        class="tag-item"
        style="margin-bottom:6px"
        @close="handleClose(tag)"
      >
        {{ tag.groupName }}
      </el-tag>
      <el-autocomplete
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        size="mini"
        class="button-new-tag"
        :fetch-suggestions="seacrh"
        value-key="groupName"
        placeholder="请输入内容"

        @select="handleSelect"
      />
      <el-button
        v-else
        class="button-new-tag"
        size="mini"
        type="primary"
        @click="showInput"
      >
        添加
      </el-button>

    </div>
  </div>
</template>

<script>
import {
  getInfoByGroupName,
  getInfoByGroupIds
} from '@/api/liveRoom/detail'
import eventBus from '@/utils/eventBus'
import {
  getSensitiveGroupPageApi
} from '@/api/liveRoom/sensitive.js'
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

  mounted() {
    eventBus.$on('handleChangeVideoCourseware', (data) => {
      this.getSensitiveList(data)
    })
    eventBus.$on('handleClearVideoCourseware', () => {
      this.dynamicTags = []
    })
  },
  methods: {
    async getSensitiveList(data) {
      console.log(data, 2222222)
      let list = []
      if (data.teacherId) {
        const res = await getSensitiveGroupPageApi({
          groupId: data.teacherId,
          groupName: data.teacherName,
          pageIndex: 1,
          pageSize: 100,
          sceneType: 1
        })
        list = res.data.items
      }
      let list2 = []
      if (data.videoId) {
        const res2 = await getSensitiveGroupPageApi({
          groupId: data.videoId,
          groupName: data.videoName,
          pageIndex: 1,
          pageSize: 100,
          sceneType: 2
        })
        list2 = res2.data.items
      }
      this.dynamicTags = [...list, ...list2]
      const sensitiveWordsGroups = []
      this.dynamicTags.forEach(item => {
        sensitiveWordsGroups.push(item.groupId)
      })
      this.$emit('select', sensitiveWordsGroups)
    },
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
      this.inputValue = ''
      const _list = []
      this.dynamicTags.forEach(item => {
        _list.push(item.groupId)
      })
      this.$emit('select', _list)
    },
    seacrh(val, cb) {
      getInfoByGroupName({ searchName: val }).then(res => {
        cb([...res.data])
      })
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
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
  // .button-new-tag {
  //   margin-left: 10px;
  // }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
::v-deep .el-tag{
  margin-right:10px;
  margin-left:0!important;
}
</style>
