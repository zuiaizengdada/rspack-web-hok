<template>
  <div class="upload-item">
    <div class="image_poster">
      <div v-if="current.status === 1">
        <div>上传中({{ authProgress }}%)</div>
        <el-progress :show-text="false" :percentage="authProgress" />
      </div>
      <div
        v-else-if="current.status === 2"
        @mouseenter="alignUploadShow = true"
        @mouseleave="alignUploadShow = false"
      >
        <i class="el-icon-error" style="color: #f53f3f; font-size: 24px" />
        <div class="addimag_icon_error">上传失败</div>
        <!-- 重新上传按钮 -->
        <transition name="slide">
          <div v-if="alignUploadShow" class="alignUploadShow">
            <svg-icon icon-class="alignUploadShow" class="alignUploadIcon" />
            <div class="pointer" @click="$emit('again')">重新上传</div>
          </div>
        </transition>
      </div>
      <div v-else class="flex flex-middle" style="width:100%">
        <svg-icon
          icon-class="icon_draggable"
          style="margin-right:10px;"
          class="icon_draggable"
        />
        <ImagePreviewer
          style="width: 80px; height: 80px;margin-right:10px"
          :src="current.url"
          fit="contain"
          :preview-src-list="[current.url]"
        />
        <div class="flex-1 flex flex-column flex-between" style="height:80px">
          <el-form-item
            :prop="`fileList.${index}.jumpType`"
            label="跳转类型"
            :rules="[
              { required: true, message: '请选择跳转类型', trigger: 'change' },
            ]"
          >
            <el-select
              v-model="current.jumpType"
              style="width:210px"
              size="small"
              clearable
              placeholder="请选择"
              @change="handleJumpChange"
            >
              <el-option
                v-for="list in options"
                :key="list.value"
                :label="list.label"
                :value="list.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="current.jumpType === 1"
            label="课程详情"
            :prop="`fileList.${index}.value`"
            class="flex flex-top"
            :rules="[
              { required: true, message: '请选择跳转类型', trigger: 'change' },
            ]"
          >
            <div style="margin-left:16px;">
              <el-button
                v-if="!current.contentName"
                type="primary"
                size="small"
                @click="selectGoods"
              >选择课程</el-button>
              <template v-else>
                <div class="detail-container">
                  <div class="detail-content">
                    <div class="detail-title">
                      {{ current.contentName }}
                    </div>
                    <i
                      class="el-icon-close"
                      style="cursor: pointer"
                      @click="handleClose"
                    />
                  </div>
                  <el-button type="text" @click="handleReChange">重选</el-button>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item
            v-else-if="current.jumpType === 2"
            :prop="`fileList.${index}.value`"
            label="课程分类"
            :rules="[
              { required: true, message: '请选择课程分类', trigger: 'change' },
            ]"
          >
            <el-select
              v-model="current.value"
              clearable
              style="width:210px"
              placeholder="请选择"
            >
              <el-option
                v-for="list in catalogueList"
                :key="list.catalogueId"
                :label="list.catalogueName"
                :value="list.catalogueId"
              />
            </el-select>

          </el-form-item>
          <el-form-item
            v-else-if="current.jumpType === 3"
            :prop="`fileList.${index}.value`"
            label="选择IP"
            :rules="[
              { required: true, message: '请选择IP', trigger: 'change' },
            ]"
          >
            <teacherSelect v-model="current.value" style="width:210px" />
          </el-form-item>
          <el-form-item
            v-else-if="current.jumpType === 4"
            :prop="`fileList.${index}.value`"
            label="跳转网页"
            :rules="[
              { required: true,validator:validateWeb, trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="current.value"
              clearable
              style="width:210px"
              maxlength="200"
              show-word-limit
              placeholder="请输入跳转网页"
            />
          </el-form-item>
        </div>
        <svg-icon
          icon-class="icon_delete"
          class="icon_delete"
          @click="handleDel"
        />
      </div>
    </div>
  </div>
</template>

<script>
import teacherSelect from '@/components/AppTemplate/teacherSelect/index'
export default {
  components: {
    teacherSelect
  },
  props: {
    // status 0: 未开始上传 1: 文件上传中 2: 文件上传失败 3: 文件上传成功
    authProgress: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    },
    catalogueList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validateWeb = (rule, value, callback) => {
      const url = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/
      if (value === '') {
        callback(new Error('请输入跳转网页'))
      } else if (!url.test(value)) {
        callback(new Error('请输入正确的网址'))
      } else {
        callback()
      }
    }
    return {
      alignUploadShow: false,
      validateWeb,
      options: [
        {
          label: '不跳转',
          value: 0
        },
        {
          label: '课程详情',
          value: 1
        },
        {
          label: '课程分类',
          value: 2
        },
        {
          label: 'IP详情',
          value: 3
        },
        {
          label: '网页',
          value: 4
        }
      ],
      detail: {}
    }
  },
  computed: {
    current: {
      get() {
        return this.item
      },
      set(val) {
        this.$emit('update:item', val)
      }
    }
  },
  methods: {
    handleDel() {
      this.$delModal({
        tips: `是否确定操作?`,
        success: () => {
          this.$emit('del')
        }
      })
    },
    handleJumpChange() {
      this.current.value = ''
    },
    handleReChange() {
      this.$SelectGoods({
        visible: true,
        multiple: false,
        currentId: '3',
        disabledFn: (res) => {
          if (res.onlineList && res.goodsType === 5 && res.onlineList && res.onlineList.length > 0) {
            const sum = res.onlineList.reduce((pre, next) => {
              return pre + (next.availableNum ? Number(next.availableNum) : 0)
            }, 0)
            return sum <= 0
          } else {
            return false
          }
        },
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' }
        ],
        success: (res) => {
          if (res.length > 0) {
            this.$emit('update:item',
              { ...this.item, value: res[0].goodsId, contentName: res[0].contentName }
            )
          }
        }
      })
    },
    handleClose() {
      this.$emit('update:item',
        { ...this.item, value: '', contentName: '' }
      )
      this.current.value = ''
      this.current.contentName = ''
    },
    selectGoods() {
      this.$SelectGoods({
        visible: true,
        multiple: false,
        currentId: '3',
        disabledFn: (res) => {
          if (res.onlineList && res.goodsType === 5 && res.onlineList && res.onlineList.length > 0) {
            const sum = res.onlineList.reduce((pre, next) => {
              return pre + (next.availableNum ? Number(next.availableNum) : 0)
            }, 0)
            return sum <= 0
          } else {
            return false
          }
        },
        tabList: [
          { id: '3', name: '普通专栏', api: '' },
          { id: '4', name: '大专栏', api: '' },
          { id: '5', name: '线下课', api: '' }
        ],
        success: (res) => {
          if (res.length > 0) {
            this.$emit('update:item',
              { ...this.item, value: res[0].goodsId, contentName: res[0].contentName }
            )
          }
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.upload-item::v-deep {
  position: relative;
  .el-form-item__label{
    float: left;
    text-align: right;
  }
  .el-form-item{
    border-bottom: 0px !important;
    padding-bottom:0px !important;
  }

  .image_poster {
    display: flex;
    background: #ffffff;
    padding: 10px;
    height: 115px;
    border-radius: 4px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #0c6fff;
    line-height: 20px;
    overflow: hidden;
    position: relative;
    .addimag_icon {
      font-size: 18px;
      margin-bottom: 13px;
    }
    &:hover {
      border-color: #0c6fff;
    }
    .addimag_icon_error {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #f53f3f;
      line-height: 22px;
    }
    .alignUploadShow {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 2;
      background: #fbfcfe;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .alignUploadIcon {
        font-size: 24px;
      }
    }
    .detail-container{
      display: flex;
      align-items: center;
      width: 210px;
      .detail-content{
        flex: 1;
        background: #E6E6E6;
        border-radius: 4px;
        color: #333333;
        font-size: 14px;
        display: flex;
        align-items: center;
        height: 28px;
        padding: 4px 8px;
        margin-right: 10px;
        .detail-title{
          flex: 1;
          text-align: start;
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: 100%;
          display: flex;
          align-items: center;
        }
        i{
          font-size: 16px;
        }
      }
    }

  }
  .del {
    position: absolute;
    right: -6px;
    top: -6px;
    color: #686664;
    cursor: pointer;
    font-size: 16px;
    z-index: 2;
  }
}
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translateZ(0);
  }
}
@keyframes slideOutDown {
  0% {
    transform: translateZ(0);
  }

  to {
    visibility: hidden;
    transform: translate3d(100%, 0, 0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
</style>
