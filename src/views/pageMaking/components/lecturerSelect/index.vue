<template>
  <div class="lecturer-container">
    <div class="lecturer-header">
      <teacherSelect
        v-model="lecturerId"
        :ids="ids"
        style="width:340px;margin-right:15px"
        @getDetail="handleGetDetail"
      />
      <el-button
        size="small"
        :disabled="!lecturerId || items.length >= 8"
        type="primary"
        @click="selectLecturer"
      >{{ `加入IP(${items.length}/8)` }}</el-button>
    </div>
    <div v-if="items.length" class="lecturer-content">
      <el-scrollbar :extrusion="true" :class="{'h-500':items.length >= 5}">
        <draggable
          :list="items"
          tag="div"
          draggable=".lecturer-items"
          v-bind="{
            animation:500 ,
            handle:'.icon_draggable',
          }"
          :move="handleMove"
        >
          <div
            v-for="(item, index) in items"
            :key="item.lecturerId + index"
            :class="{'m-b-12':index !== items.length - 1}"
            class="flex flex-middle lecturer-items"
          >
            <svg-icon
              icon-class="icon_draggable"
              class="lecturer-icon icon_draggable"
            />
            <ImagePreviewer
              class="lecturer-image"
              :src="item.headUrl"
              fit="contain"
              :preview-src-list="[item.headUrl]"
            />
            <div class="flex-1 flex flex-column" style="height:80px">
              <div class="title">{{ item.lecturerName }}</div>
              <div class="tips">{{ item.lecturerLabel }}</div>
            </div>
            <svg-icon
              icon-class="icon_delete"
              class="icon_delete"
              @click="handleDel(index)"
            />
          </div>
        </draggable>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import teacherSelect from '../teacherSelect/index'
import draggable from 'vuedraggable'
export default {
  name: 'LecturerSelect',
  components: {
    teacherSelect,
    draggable
  },
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      lecturerId: '',
      lecturerCurrent: {}
    }
  },
  computed: {
    // 文件上传状态status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
    // 文件类型fileType: audio[音频mp3/wav/aac/3pg/mar/wma] video[视频3pg/mp4/mov] img[图片jpg/png/jpeg/bmp]
    items: {
      set(val) {
        this.$emit('update:dataSource', val)
      },
      get() {
        return this.dataSource
      }
    },
    ids() {
      return this.items.map(i => i.lecturerId)
    }
  },
  methods: {
    handleGetDetail(val) {
      this.lecturerCurrent = val
    },
    handleDel(index) {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.items.splice(index, 1)
        }
      })
    },
    handleMove() {
      return true
    },
    selectLecturer() {
      this.items.push(this.lecturerCurrent)
      this.lecturerId = ''
      this.lecturerCurrent = {}
    }
  }
}
</script>

<style lang="scss" scoped>
.lecturer-container{
  .title{
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    line-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tips{
    font-weight: 400;
    color: #666666;
    font-size: 14px;
    margin-top: 10px;
    line-height: 20px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .lecturer-items{
    background: #FFFFFF;
    border-radius: 2px;
    padding: 10px;
  }
  .lecturer-content{
    background: #F5F5F5;
    border-radius: 4px;
    padding: 12px;
    margin-top: 16px;
  }
  .lecturer-icon{
    margin-right:10px;
  }
  .lecturer-image{
    width: 80px;
    height: 80px;
    margin-right:10px;
    border-radius: 4px;
  }
  .m-b-12{
    margin-bottom: 12px;
  }
}
</style>
