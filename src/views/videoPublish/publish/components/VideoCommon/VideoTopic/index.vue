<template>
  <div class="topic-container flex ">
    <publish-title title="作品话题" class="title" style="margin-top:6px;" />
    <div class="topic-content w-full relative">
      <input-tags ref="inputTag" :list="tagList" @update="updateTagList" />
      <p class="add-tag cursor-pointer">{{ currentTagLength }}/{{ maxTagLength }}</p>
      <common-topic @add="commonInputTagsAdd" />
    </div>
  </div>
</template>
<script>
import PublishTitle from '../PublishTitle.vue'
import CommonTopic from '../../Common/CommonTopic.vue'
import InputTags from '../../Common/InputTags.vue'
export default {
  inject: ['updatePublishTopic', 'updataPublishAllList', 'publishForm'],
  components: {
    PublishTitle,
    CommonTopic,
    InputTags
  },
  data() {
    return {
      maxTagLength: 20,
      currentTagLength: 0,
      tagList: []
    }
  },
  watch: {
    'publishForm.topic': {
      handler(val) {
        this.tagList = val
        this.currentTagLength = val.length
      },
      deep: true
    }
  },
  methods: {
    handleClickAddTag() {
      this.$refs.inputTag.addTagValue('#')
    },
    commonInputTagsAdd(data) {
      this.$refs.inputTag.addTagItem(data)
    },
    updateTagList(list) {
      console.log('tttt:tttttt:tt', list)
      this.currentTagLength = list.length
      const arr = [...list]
      this.updataPublishAllList('topic', arr)
      this.updatePublishTopic(arr)
    }
  }
}
</script>
<style lang="scss" scoped>

.add-tag{
  height: 28px;
  border-radius: 4px;
  font-size: 12px;
  color: #777777;
  line-height: 28px;
  text-align: center;
  margin-bottom:16px;
}
.mb-20{
  margin-bottom:20px;
}

::v-deep .vue-input-tag-wrapper{
  padding:0 16px;
  border-radius: 4px;;
  height:32px;
  display: flex;
  align-items: center;
}
::v-deep .vue-input-tag-wrapper .new-tag{
  margin:0;
  padding:4px 10px 4px 0;
}
::v-deep .vue-input-tag-wrapper .input-tag{
  background: none;
  border:none;
  color:#3C8BFF;
  font-size:14px;
  margin:0;
  padding:0;
  margin-right:10px;
  display: block;
  border-radius: 0;
}
::v-deep .vue-input-tag-wrapper .input-tag .remove{
  display: none;
}

.topic-content {
  position: relative;
  .add-tag {
    position: absolute;
    right: 7px;
    top: 6px;
  }
}
</style>
