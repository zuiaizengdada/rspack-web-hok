<template>
  <!-- 标记 -->
  <AppDialog v-model="visible" :title="title" width="526px" :loading="loading" height="auto" :top="top" @success="sure">
    <div class="followUpNotesTips">
      <div>
        <el-select v-model="form.markType" size="small" placeholder="标记类型" style="width: 120px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-if="form.markType === 99" v-model="form.typeDesc" size="small" style="width: 141px;margin-left: 5px" placeholder="请输入" />
      </div>
      <div class="m-t-15">
        <el-input v-model="form.markContent" size="small" maxlength="200" type="textarea" show-word-limit :autosize="{minRows: 4, maxRows: 6}" placeholder="请输入" />
      </div>
    </div>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import { addMark, editModifyMark } from '@/api/liveRoom/liveRoom.js'
export default {
  components: {
    AppDialog
  },
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        markType: 1,
        typeDesc: '',
        markContent: ''
      },
      followClassRecordId: '',
      liveRoomDetail: {},
      title: '标记',
      top: '10vh',
      options: [
        { label: '推课数据', value: 1 },
        { label: '干货数据', value: 2 },
        { label: '用户互动高', value: 3 },
        { label: '金句标记', value: 4 },
        { label: '情绪共鸣', value: 5 },
        { label: '繁复表达', value: 6 },
        { label: '讲时间点', value: 7 },
        { label: '自定义类型', value: 99 }
      ],
      ifEdit: false
    }
  },
  mounted() {
    this.top = Math.abs(window.innerHeight - 307) / 2 + 'px'
  },
  methods: {
    sure() {
      if (!this.form.markType) {
        return this.$message.error('请选择标记类型')
      }
      if (this.form.markType === 99 && !this.form.typeDesc) {
        return this.$message.error('请输入自定义类型名称')
      }
      this.ifEdit ? this.onEdit() : this.onAdd()
    },
    onAdd() {
      this.loading = true
      const data = {
        'followClassRecordId': this.followClassRecordId,
        'liveRoomId': this.liveRoomDetail.liveRoomId,
        'markChannelType': 1,
        'markContent': this.form.markContent,
        'markType': this.form.markType
      }
      if (data.markType === 99) data.typeDesc = this.form.typeDesc
      addMark(data).then((res) => {
        this.visible = false
        this.success && this.success({ ...data, id: Number(res.data) })
      }).catch(() => {
        this.loading = false
      })
    },
    onEdit() {
      this.loading = true
      const data = {
        'id': this.form.id,
        'markContent': this.form.markContent,
        'markType': this.form.markType,
        'typeDesc': this.form.typeDesc
      }
      editModifyMark(data).then(() => {
        this.visible = false
        this.success && this.success(data)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.followUpNotesTips {
  padding: 15px 15px 0;
}
.m-t-15 {
  margin-top: 15px;
}
</style>
