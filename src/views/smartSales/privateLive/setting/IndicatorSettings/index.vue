<template>
  <div class="indicatorSettings">
    <div class="indicatorSettingsTitle">到课数定义</div>
    <div class="indicatorSettingsContent m-t-10">
      <span>在直播间中观看时长大于等于</span>
      <el-input-number
        v-model="form.attendClassTime"
        :max="180"
        :min="0"
        :disabled="!ifEdit"
        size="small"
        style="width: 120px"
        class="m-l-10 m-r-10"
      />
      <span>分钟的数据</span>
    </div>
    <div class="indicatorSettingsContent m-t-10">
      <el-select
        v-model="form.attendCondition"
        placeholder="请选择"
        size="small"
        :disabled="!ifEdit"
      >
        <el-option
          v-for="item in attendConditionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="indicatorSettingsContent m-t-10">
      <span>在直播间观看回放时长大于等于</span>
      <el-input-number
        v-model="form.attendPlaybackTime"
        :max="180"
        :min="0"
        :disabled="!ifEdit"
        size="small"
        style="width: 120px"
        class="m-l-10 m-r-10"
      />
      <span>分钟的数据</span>
    </div>
    <div class="indicatorSettingsTitle m-t-20">完课数定义</div>
    <div class="indicatorSettingsContent m-t-10">
      <span>在直播间中观看时长大于等于</span>
      <el-input
        v-model="form.finishClassTime"
        :disabled="!ifEdit"
        size="small"
        style="width: 120px"
        class="m-l-10 m-r-10"
        @input="e => delNumber(e, 'finishClassTime')"
      />
      <span>分钟的数据</span>
    </div>
    <div class="indicatorSettingsTitle m-t-20">回放定义</div>
    <div class="indicatorSettingsContent m-t-10">
      <span>用户累计观看回放时长大于等于</span>
      <el-input
        v-model="form.playbackTime"
        :disabled="!ifEdit"
        size="small"
        style="width: 120px"
        class="m-l-10 m-r-10"
        @input="e => delNumber(e, 'playbackTime')"
      />
      <span>分钟的数据</span>
    </div>

    <div class="m-t-20">
      <el-button
        v-if="!ifEdit"
        :loading="loading"
        size="small"
        type="primary"
        @click="onhandleEdit"
        v-permission="['btn:IndicatorSettings:edit', permsList]"
        >编辑</el-button
      >
      <el-button
        v-if="ifEdit"
        :loading="loading"
        size="small"
        type="primary"
        @click="onhandleSave"
        >保存</el-button
      >
      <el-button
        v-if="ifEdit"
        :loading="loading"
        size="small"
        @click="onhandleCancel"
        >取消</el-button
      >
    </div>
  </div>
</template>

<script>
import { getLiveRoomOrgConfig, saveOrUpdate } from '@/api/liveRoom/index.js'
export default {
  components: {},
  data() {
    return {
      permsList: this.$route.meta.permsList || [],
      // 真实的数据
      readFrom: {
        attendClassTime: '',
        finishClassTime: '',
        attendCondition: '',
        attendPlaybackTime: '',
        playbackTime: ''
      },
      // 展示的数据
      form: {
        attendClassTime: '',
        finishClassTime: '',
        attendCondition: '',
        attendPlaybackTime: '',
        playbackTime: ''
      },
      loading: false,
      ifEdit: false,
      attendConditionOptions: [
        {
          value: '',
          label: '请选择'
        },
        {
          value: 'or',
          label: '或者'
        },
        {
          value: 'and',
          label: '并且'
        }
      ]
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getLiveRoomOrgConfig()
        .then(res => {
          console.log(res)
          this.form.attendClassTime = res.data.attendClassTime || 0
          this.form.finishClassTime = res.data.finishClassTime || 0
          this.form.playbackTime = res.data.playbackTime || 0
          this.form.attendCondition = res.data.attendCondition || ''
          this.form.attendPlaybackTime = res.data.attendPlaybackTime || 0
          this.readFrom = JSON.parse(JSON.stringify(this.form))
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 限制只能输入英文和数字
    delNumber(e, key) {
      this.form[key] = e.replace(/[^0-9]/g, '')
    },
    onhandleEdit() {
      this.ifEdit = true
      this.form = JSON.parse(JSON.stringify(this.readFrom))
    },
    onhandleCancel() {
      this.ifEdit = false
      this.form = JSON.parse(JSON.stringify(this.readFrom))
    },
    onhandleSave() {
      this.loading = true
      const data = {
        attendClassTime: this.form.attendClassTime,
        finishClassTime: this.form.finishClassTime,
        playbackTime: this.form.playbackTime,
        attendCondition: this.form.attendCondition,
        attendPlaybackTime: this.form.attendPlaybackTime
      }
      saveOrUpdate(data)
        .then(res => {
          this.ifEdit = false
          this.readFrom = JSON.parse(JSON.stringify(this.form))
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.indicatorSettings {
  padding: 20px 40px;
  .indicatorSettingsTitle {
    font-size: 14px;
    color: #333;
    font-weight: bold;
  }
  .indicatorSettingsContent {
    color: rgb(96, 98, 102);
    font-size: 14px;
  }
}
</style>
