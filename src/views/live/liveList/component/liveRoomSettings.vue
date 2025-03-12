<template>
  <div v-loading="loading" class="page_wrap">
    <el-form ref="ruleForm" :model="form" :rules="rules" class="demo-ruleForm">
      <el-form-item label="允许进入直播间" prop="model">
        <el-radio-group :value="form.model">
          <el-radio
            :disabled="detail.feesType === 2"
            :label="1"
            @click.stop.native="onChange(1)"
            >所有人可进入</el-radio
          >
          <el-radio :label="2" @click.stop.native="onChange(2)"
            >指定人员可进入</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.model === 2">
        <liveRoomSettingsUser />
      </el-form-item>
    </el-form>

    <el-card class="box-card m-t-20">
      <MTitle slot="header">自嗨设置</MTitle>
      <selfHiSettings />
    </el-card>

    <el-card class="box-card m-t-20">
      <MTitle slot="header">分享设置</MTitle>
      <shareSettings />
    </el-card>

    <el-card class="box-card m-t-20">
      <MTitle slot="header">推流设置</MTitle>
      <streamingSettings :detail="detail" />
    </el-card>
  </div>
</template>

<script>
import streamingSettings from './streamingSettings.vue'
import selfHiSettings from './selfHiSettings.vue'
import liveRoomSettingsUser from './liveRoomSettingsUser.vue'
import shareSettings from './shareSettings.vue'
import {
  getLiveRoomUserLimit,
  saveLiveRoomUserLimit
} from '@/api/liveRoom/detail.js'
export default {
  components: {
    selfHiSettings,
    liveRoomSettingsUser,
    streamingSettings,
    shareSettings
  },
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        liveRoomId: '',
        model: 1
      },
      rules: {},
      loading: false
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      const data = {
        liveRoomId: this.$route.params.id
      }
      getLiveRoomUserLimit(data)
        .then(res => {
          this.form = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    onChange(type) {
      if (this.detail.feesType === 2 && type === 1) {
        return
      }

      this.form.model = type === 1 ? 2 : 1
      this.$delModal({
        tips: `是否确定切换成${type === 1 ? '所有人可进入' : '指定人员可进入'}`,
        success: () => {
          this.loading = true
          const data = {
            liveRoomId: this.$route.params.id,
            model: type
          }
          saveLiveRoomUserLimit(data)
            .then(() => {
              this.form.model = type
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_wrap {
  position: relative;
}
</style>
