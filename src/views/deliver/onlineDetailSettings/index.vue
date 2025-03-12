<template>
  <div>
    <MCard class="cardHeight">
      <div class="videoDeliverySettings">套餐课交付规则</div>
      <div class="form">
        <el-form
          ref="form"
          :model="packageConfig"
          label-width="0px"
          :rules="rules"
        >
          <el-form-item
            label="累计观看"
            prop="packageConfig.playDuration"
            label-width="120px"
            class="custom-group-item"
          >
            <el-input
              v-model.trim.number="packageConfig.playDuration"
              step="1"
              min="0"
              type="number"
              placeholder="请输入"
              style="width: 200px"
              size="small"
              @change="
                e => parseInputValue2Number(e, 'packageConfig', 'playDuration')
              "
            >
              <template v-slot:append>
                <el-select
                  v-model="packageConfig.playDurationType"
                  placeholder="请选择"
                  value="1"
                  class="w-20"
                >
                  <el-option key="001" label="分钟" :value="1" />
                  <el-option key="002" label="小时" :value="2" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label=" " prop="sessionNumType" label-width="120px">
            <el-select
              v-model="packageConfig.sessionNumType"
              placeholder="请选择"
              value="1"
              class="w-20"
              @change="checkType"
            >
              <el-option key="001" label="或者" :value="1" />
              <el-option key="002" label="且" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="交付线下课场次"
            prop="sessionNum"
            label-width="120px"
            class="custom-group-item"
          >
            <el-input
              v-model.trim.number="packageConfig.sessionNum"
              :min="0"
              type="number"
              placeholder="请输入"
              style="width: 200px"
              size="small"
              @change="
                e => parseInputValue2Number(e, 'packageConfig', 'sessionNum')
              "
            >
              <template v-slot:append>
                <span>场</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label=" " prop="liveType" label-width="120px">
            <el-select
              v-model="packageConfig.liveType"
              placeholder="请选择"
              value="1"
              class="w-20"
              @change="checkType"
            >
              <el-option key="001" label="或者" :value="1" />
              <el-option key="002" label="且" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="累计参加"
            prop="liveNum"
            label-width="120px"
            class="custom-group-item"
          >
            <el-input
              v-model.trim.number="packageConfig.liveNum"
              :min="0"
              type="number"
              placeholder="请输入"
              style="width: 200px"
              size="small"
              @change="
                e => parseInputValue2Number(e, 'packageConfig', 'liveNum')
              "
            />
            <span class="mx-2 text-sm" style="color: #333333">
              场直播，且累计直播观看时长
            </span>
            <el-input
              v-model.trim.number="packageConfig.liveDuration"
              :min="0"
              type="number"
              placeholder="请输入"
              style="width: 200px"
              size="small"
              @change="
                e => parseInputValue2Number(e, 'packageConfig', 'liveDuration')
              "
            >
              <template v-slot:append>
                <el-select
                  v-model="packageConfig.liveDurationType"
                  placeholder="请选择"
                  value="1"
                  class="w-20"
                >
                  <el-option key="001" label="分钟" :value="1" />
                  <el-option key="002" label="小时" :value="2" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="packageConfig.sessionNumType !== packageConfig.liveType"
            label="模式"
            prop="time"
            label-width="120px"
            class="formItem"
          >
            <el-radio-group v-model="packageConfig.modelType">
              <el-radio
                class="radioBox"
                :label="1"
              >模式1
                <div class="radioText">
                  (<span>累计观看时长30分钟 且 交付线下课场次1场</span>) 或者
                  累计参加1场直播且累计直播观看时长1分钟
                </div></el-radio>
              <el-radio
                class="radioBox"
                :label="2"
              >模式2
                <div class="radioText">
                  累计观看时长30分钟 且 (<span>交付线下课场次1场 或者
                    累计参加1场直播且累计直播观看时长1分钟</span>)
                </div></el-radio>
            </el-radio-group>
          </el-form-item>
          <!--          <el-form-item v-if="form.liveType&&form.sessionNumType&&form.sessionNumType!==form.liveType" label="模式" prop="time" label-width="120px" class="formItem">-->
          <!--            <div>-->
          <!--              <el-radio v-model="form.modelType" class="radioBox" :label="1">模式1 <div class="radioText">(<span>累计观看时长30分钟 且 交付线下课场次1场</span>) 或者 累计参加1场直播且累计直播观看时长1分钟</div></el-radio>-->
          <!--            </div>-->
          <!--            <div>-->
          <!--              <el-radio v-model="form.modelType" class="radioBox" :label="2">模式2 <div class="radioText">累计观看时长30分钟 且 (<span>交付线下课场次1场 或者 累计参加1场直播且累计直播观看时长1分钟</span>)</div></el-radio>-->
          <!--            </div>-->
          <!--          </el-form-item>-->

          <el-form-item><el-button
            :loading="loading"
            type="primary"
            size="small"
            @click="savePackageConfig"
          >保存</el-button></el-form-item>
        </el-form>
      </div>
      <div>
        <div class="videoDeliverySettings">视频交付设置</div>
        <div class="form">
          <!-- <div class="title">观看时长</div> -->
          <!-- :rules="rule" -->
          <el-form ref="form" :model="form" label-width="0px">
            <el-form-item label="" prop="videoWatchDuration">
              <span class="formValue m-r-4">累计观看时长</span>
              <el-input
                v-model.trim.number="form.videoWatchDuration"
                style="width: 120px; margin: 0 10px"
                size="small"
                @change="e => parseInputValue2Number(e, 'form', 'videoWatchDuration')"
              >
                <span slot="append">分钟</span>
              </el-input>
              <el-button v-if="!showMore" class="m-l-4" type="text" @click="handleAddMore">新增条件</el-button>
            </el-form-item>
            <div v-if="showMore" class="bg">
              <el-form-item label=" " prop="liveType">
                <el-select
                  v-model="form.deliveryConfig"
                  placeholder="请选择"
                  value="1"
                  class="w-20"
                >
                  <el-option key="001" label="或者" :value="1" />
                  <el-option key="002" label="且" :value="2" />
                </el-select>

                <span class="mx-2 text-sm" style="color: #333333">完成节数</span>
                <el-input
                  v-model.trim.number="form.videoWatchNum"
                  :min="0"
                  type="number"
                  placeholder="请输入"
                  style="width: 200px"
                  size="small"
                  @change="
                    e => parseInputValue2Number(e, 'form', 'videoWatchNum')
                  "
                />
                <span class="mx-2 text-sm" style="color: #333333">
                  节
                </span>

                <span class="mx-2 text-sm" style="color: #F1330D;margin-left: 70px" @click="handleDelMore">删除</span>
                <div class="tips">
                  完成节数是指当前节观看进度达100%
                </div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button
                :loading="loading2"
                type="primary"
                size="small"
                @click="save"
              >保存
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 直播课交付设置 -->
      <div class="p-4 rounded-lg" style="background-color: #F2F8FF;">
        <div class="videoDeliverySettings" style="border: 0; margin-bottom: 0;">直播课交付</div>
        <div class="form" style="padding-top: 0px">
          <el-form
            ref="form"
            :model="packageConfig"
            label-width="0px"
            :rules="rules"
            class="bg-white rounded-md py-4 mb-4"
          >
            <el-form-item
              label="累计进入"
              prop="liveNum"
              label-width="120px"
              class="custom-group-item"
            >
              <el-input
                v-model.trim.number="liveCourse.liveEntryCount"
                :min="0"
                type="number"
                placeholder="请输入"
                style="width: 200px"
                size="small"
                @change="
                  e => parseInputValue2Number(e, 'liveCourse', 'liveEntryCount')
                "
              />
              <span class="mx-2 text-sm" style="color: #333333">场直播</span>
              <el-select
                v-model="liveCourse.liveCalcType"
                placeholder="请选择"
                value="1"
                @change="checkType"
              >
                <el-option key="001" label="算进入时长" :value="2" />
                <el-option key="002" label="不算观看时长" :value="1" />
              </el-select>
              <span class="mx-2 text-sm" style="color: #333333"> 累计时长 </span>
              <el-input
                v-model.trim.number="liveCourse.liveDuration"
                :min="0"
                type="number"
                placeholder="请输入"
                style="width: 200px"
                size="small"
                @change="
                  e => parseInputValue2Number(e, 'liveCourse', 'liveDuration')
                "
              >
                <template v-slot:append>
                  <el-select
                    v-model="liveCourse.liveDurationUnit"
                    placeholder="请选择"
                    value="1"
                    class="w-20"
                  >
                    <el-option key="001" label="分钟" :value="1" />
                    <el-option key="002" label="小时" :value="2" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label=" " prop="liveType" label-width="120px">
              <el-select
                v-model="liveCourse.liveDeliveryConfig"
                placeholder="请选择"
                value="1"
                class="w-20"
                @change="checkType"
              >
                <el-option key="001" label="或者" :value="1" />
                <el-option key="002" label="且" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item
              label="累计进入"
              prop="liveNum"
              label-width="120px"
              class="custom-group-item"
            >
              <el-input
                v-model.trim.number="liveCourse.playbackEntryCount"
                :min="0"
                type="number"
                placeholder="请输入"
                style="width: 200px"
                size="small"
                @change="
                  e =>
                    parseInputValue2Number(e, 'liveCourse', 'playbackEntryCount')
                "
              />
              <span class="mx-2 text-sm" style="color: #333333">
                场直播回放
              </span>
              <el-select
                v-model="liveCourse.playbackCalcType"
                placeholder="请选择"
                value="1"
                @change="checkType"
              >
                <el-option key="001" label="算进入时长" :value="2" />
                <el-option key="002" label="不算观看时长" :value="1" />
              </el-select>
              <span class="mx-2 text-sm" style="color: #333333"> 累计时长 </span>
              <el-input
                v-model.trim.number="liveCourse.playbackDuration"
                :min="0"
                type="number"
                placeholder="请输入"
                style="width: 200px"
                size="small"
                @change="
                  e => parseInputValue2Number(e, 'liveCourse', 'playbackDuration')
                "
              >
                <template v-slot:append>
                  <el-select
                    v-model="liveCourse.playbackDurationUnit"
                    placeholder="请选择"
                    value="1"
                    class="w-20"
                  >
                    <el-option key="001" label="分钟" :value="1" />
                    <el-option key="002" label="小时" :value="2" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <div>
            <div class="form" style="padding-left: 0px">
              <!-- :rules="rule" -->
              <el-form ref="form" :model="form" label-width="0px">
                <el-form-item label="" prop="liveType" label-width="0px">
                  <el-select
                    v-model="liveCourse.liveVideoDeliveryConfig"
                    placeholder="请选择"
                    value="1"
                    class="w-20"
                    @change="checkType"
                  >
                    <el-option key="001" label="或者" :value="1" />
                    <el-option key="002" label="且" :value="2" />
                  </el-select>
                  <span class="mx-2 text-sm" style="color: #333333">
                    累计视频观看时长
                  </span>
                  <el-input
                    v-model.trim.number="liveCourse.videoWatchDuration"
                    :min="0"
                    type="number"
                    placeholder="请输入"
                    style="width: 200px"
                    size="small"
                    @change="
                      e =>
                        parseInputValue2Number(
                          e,
                          'liveCourse',
                          'videoWatchDuration'
                        )
                    "
                  >
                    <template v-slot:append>
                      <el-select
                        v-model="liveCourse.videoDurationUnit"
                        placeholder="请选择"
                        value="1"
                        class="w-20"
                      >
                        <el-option key="001" label="分钟" :value="1" />
                        <el-option key="002" label="小时" :value="2" />
                      </el-select>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
              <el-button
                :loading="liveCourseLoading"
                type="primary"
                size="small"
                @click="saveLiveCourseDetail"
              >
                保存
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </MCard>
  </div>
</template>

<script>
import {
  setAutoDeliveryDuration,
  getAutoDeliveryDuration,
  getDeliveryConfig,
  saveDeliveryConfig,
  getLiveCourseDetailApi,
  saveLiveCourseDetailApi
} from '@/api/deliver/baseSeeting'

export default {
  data() {
    return {
      form: {
        videoWatchDuration: 30,
        videoWatchNum: '',
        playDuration: '',
        playDurationType: 1,
        sessionNumType: 0,
        sessionNum: '',
        liveType: 0,
        liveNum: 0,
        liveDuration: '',
        liveDurationType: '',
        modelType: 1,
        deliveryConfig: 0
      },
      rules: {
        packageConfig: {
          playDuration: [
            { required: true, message: '请输入累计观看时长', trigger: 'blur' },
            {
              type: 'number',
              min: 0,
              message: '时间不能是负数'
            }
          ],
          sessionNumType: [
            { required: true, message: '请选择', trigger: 'blur' }
          ],
          sessionNum: [
            { required: true, message: '请输入场次', trigger: 'blur' },
            {
              type: 'number',
              min: 0,
              message: '场次不能是负数'
            }
          ],
          liveType: [{ required: true, message: '请选择', trigger: 'blur' }],
          liveDurationType: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          liveNum: [
            { required: true, message: '请输入', trigger: 'blur' },
            {
              type: 'number',
              min: 0,
              message: '场次不能是负数'
            }
          ],
          liveDuration: [
            { required: true, message: '请输入', trigger: 'blur' },
            {
              type: 'number',
              min: 0,
              message: '场次不能是负数'
            }
          ]
        }
      },
      packageConfig: {
        modelType: 1
      },
      liveCourse: {},
      loading: false,
      loading2: false,
      liveCourseLoading: false,
      showMore: false
    }
  },
  mounted() {
    this.getDetail()
    this.getDeliveryConfig()
    this.getLiveCourseDetail()
  },
  methods: {
    // 点击保存
    save() {
      const params = {
        videoWatchDuration: this.form.videoWatchDuration,
        videoDurationUnit: 1,
        videoWatchNum: this.form.videoWatchNum,
        deliveryConfig: this.form.deliveryConfig

      }
      this.loading2 = true
      setAutoDeliveryDuration(params)
        .then(res => {
          this.loading2 = false
          this.$notify({ title: '提示', message: '操作成功' })
          this.ifEdit = false
          this.getDetail()
        })
        .catch(() => {
          this.loading2 = false
        })
    },
    savePackageConfig() {
      const params = {
        ...this.packageConfig
        // modelType: this.packageConfig.liveType && this.packageConfig.sessionNumType && this.packageConfig.sessionNumType !== this.packageConfig.liveType ? this.packageConfig.modelType : 0
      }
      if (this.packageConfig.sessionNumType === this.packageConfig.liveType) {
        params.modelType = 0
      }
      this.loading = true
      saveDeliveryConfig(params)
        .then(res => {
          this.loading = false
          this.$notify({ title: '提示', message: '操作成功' })
          this.ifEdit = false
          this.getDeliveryConfig()
        })
        .catch(() => {
          this.loading = false
        })
    },
    delNoNumber(e, key) {
      this.form[key] = e.replace(/\D/g, '')
    },
    // 获取视频交付设置
    getDetail() {
      this.loading2 = true
      getAutoDeliveryDuration()
        .then(res => {
          this.form.videoWatchDuration = res.data.videoWatchDuration
          this.form.tenantId = res.data.tenantId
          if (res.data.deliveryConfig !== 0) {
            this.showMore = true
            this.form.videoDurationUnit = 1
            this.form.videoWatchNum = res.data.videoWatchNum
            this.form.deliveryConfig = res.data.deliveryConfig
          }
          this.loading2 = false
        })
        .catch(() => {
          this.loading2 = false
        })
    },
    getDeliveryConfig() {
      // MOCK BEGIN
      // this.packageConfig = {
      //   id: 123,
      //   playDuration: 20, // 交付时长
      //   playDurationType: 2, // 时长分类 1.分钟 2.小时
      //   sessionNum: 2, // 交付场次
      //   sessionNumType: 2, // 交付类别 1.或者 2.且
      //   liveDuration: 10, // 累计直播观看时长
      //   liveNum: 2, // 累积直播场次
      //   liveType: 1, // 直播类别 1.或者 2.且
      //   liveDurationType: 2 // 时长分类 1.分钟 2.小时
      // }
      // MOCK END
      this.loading = true
      getDeliveryConfig()
        .then(res => {
          this.packageConfig = res.data || {
            playDurationType: 1,
            liveDurationType: 1
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    parseInputValue2Number(value, key1, key2) {
      console.log(value, key1)
      // if (/^-?\d+(\.\d+)?$/.test(value)) {
      this[key1][key2] = Math.trunc(Math.abs(value))
      // }
    },
    checkType() {
      if (this.packageConfig.sessionNumType !== this.packageConfig.liveType) {
        if (this.packageConfig.modelType === 0) {
          this.packageConfig.modelType = 1
        }
      }
    },
    getLiveCourseDetail() {
      this.liveCourseLoading = true
      getLiveCourseDetailApi()
        .then(res => {
          this.liveCourseLoading = false
          this.liveCourse = res.data
        })
        .catch(() => {
          this.liveCourseLoading = false
        })
    },
    saveLiveCourseDetail() {
      this.liveCourseLoading = true
      saveLiveCourseDetailApi(this.liveCourse)
        .then(res => {
          this.liveCourseLoading = false
          this.$notify({ title: '提示', message: '操作成功' })
        })
        .catch(() => {
          this.liveCourseLoading = false
          this.$notify({ title: '提示', message: '操作失败' })
        })
    },
    handleAddMore() {
      this.form.deliveryConfig = 1
      this.showMore = true
    },
    handleDelMore() {
      this.showMore = false
      this.form.deliveryConfig = 0
      this.form.videoWatchNum = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.cardHeight {
  //height: calc(100vh - 166px);
  height: 100%;
  padding: 16px;
}

::v-deep {
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 10px;
  }
}

.videoDeliverySettings {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 24px;
  padding-bottom: 20px;
  //margin: 0 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e7e7e7;
}

.title {
  font-size: 14px;
  color: #333333;
  margin-bottom: 16px;
}

.form {
  //padding: 20px;

  .custom-group-item {
    .el-input-group__append .el-select {
      margin: -10px;
    }
  }
}

.formLabel {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
  font-weight: 500;
}

.formValue {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  line-height: 22px;
}

.m-l-4 {
  margin-left: 4px;
}

.m-r-4 {
  margin-right: 4px;
}
.radioBox::v-deep {
  display: flex;
  margin-top: 10px;
  .el-radio__label {
    display: flex;
  }
  .radioText {
    margin-left: 10px;
    color: #000;
    > span {
      color: red;
    }
  }
}
.bg {
  border-radius: 8px;
  background: #F4F4F4;
  padding: 15px 15px 0;
  display: inline-block;
  margin-bottom: 20px;
}
.tips{
  color: #999999;
  font-family: "Microsoft YaHei";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 12px;
  padding-left: 150px;
  margin-top: 6px;
}
</style>
